(function () {
  "use strict";
  const U = Pandao,
    B = Business;
  const app = U.mount({
    title: "表格清洗与对账工具",
    icon: "≋",
    category: "数据核对",
    description:
      "清理空格与重复行，按指定字段匹配两份表格，找出缺失、重复和金额差异。",
    repo: "https://github.com/tianchaodaxing-beep/pandao-reconcile",
  });
  let left = {
      headers: ["订单号", "金额"],
      rows: [
        { 订单号: "A001", 金额: 100 },
        { 订单号: "A002", 金额: 200 },
        { 订单号: "A003", 金额: 90 },
      ],
      name: "左侧演示表",
    },
    right = {
      headers: ["订单编号", "到账金额"],
      rows: [
        { 订单编号: "A001", 到账金额: 100 },
        { 订单编号: "A002", 到账金额: 198 },
        { 订单编号: "A004", 到账金额: 80 },
      ],
      name: "右侧演示表",
    },
    results = [];
  const p = U.panel("选择两份表格");
  const summaries = [U.h("p", { class: "hint" }), U.h("p", { class: "hint" })];
  p.append(
    U.fileInput("左侧表格", async (f) => {
      left = await U.readRows(f);
      draw();
      U.source("文件：" + left.name + " / " + right.name);
    }),
    summaries[0],
    U.fileInput("右侧表格", async (f) => {
      right = await U.readRows(f);
      draw();
      U.source("文件：" + left.name + " / " + right.name);
    }),
    summaries[1],
    U.actions(
      U.button("下载左表模板", () =>
        U.exportRows("左表模板.xlsx", left.rows.slice(0, 3)),
      ),
      U.button("下载右表模板", () =>
        U.exportRows("右表模板.xlsx", right.rows.slice(0, 3)),
      ),
    ),
  );
  app.input.append(p);
  const config = U.panel("匹配设置"),
    pairs = U.h("div");
  let pairFields = [];
  const amountBox = U.h("div", { class: "grid" }),
    tolerance = U.field("允许金额差额", "tolerance", 0.01, "number"),
    ignore = U.h("input", {
      type: "checkbox",
      checked: true,
      id: "ignore-case",
    });
  config.append(
    pairs,
    amountBox,
    tolerance.wrap,
    U.h("label", { class: "check" }, [ignore, "匹配时忽略大小写"]),
    U.actions(
      U.button("增加匹配列", addPair),
      U.button("开始对账", U.run(calculate), true),
    ),
  );
  app.input.append(config);
  let amountFields = [];
  const clean = U.panel("单表清洗");
  clean.append(
    U.h("p", { class: "hint", text: "清洗左表并移除完全重复的行。" }),
    U.actions(
      U.button("清洗并导出左表", () => {
        const r = B.cleanRows(left.rows);
        U.exportRows("清洗结果.xlsx", r.rows);
        U.notice(
          "已保留 " + r.rows.length + " 行，移除 " + r.duplicates + " 个重复行",
        );
      }),
    ),
  );
  app.input.append(clean);
  const out = U.panel("对账结果");
  app.output.append(out);
  function addPair() {
    const a = U.field(
        "左表匹配列",
        "left-key-" + pairFields.length,
        left.headers[0],
        "text",
        left.headers,
      ),
      b = U.field(
        "右表匹配列",
        "right-key-" + pairFields.length,
        right.headers[0],
        "text",
        right.headers,
      );
    const pair = U.h("div", { class: "grid" }, [a.wrap, b.wrap]);
    pairs.append(pair);
    pairFields.push([a.input, b.input]);
  }
  function draw() {
    summaries[0].textContent = left.name + " · " + left.rows.length + "行";
    summaries[1].textContent = right.name + " · " + right.rows.length + "行";
    U.clear(pairs);
    pairFields = [];
    addPair();
    U.clear(amountBox);
    amountFields = [
      U.field(
        "左表金额列",
        "left-amount",
        left.headers.find((k) => /金额|amount/i.test(k)) || "",
        "text",
        [["", "不比较金额"], ...left.headers],
      ),
      U.field(
        "右表金额列",
        "right-amount",
        right.headers.find((k) => /金额|amount/i.test(k)) || "",
        "text",
        [["", "不比较金额"], ...right.headers],
      ),
    ];
    amountBox.append(...amountFields.map((f) => f.wrap));
  }
  function calculate() {
    if (!left.rows.length || !right.rows.length)
      throw Error("两份表格均需包含数据行");
    if (
      Boolean(amountFields[0].input.value) !==
      Boolean(amountFields[1].input.value)
    )
      throw Error("请同时选择两侧金额列，或同时关闭金额比较");
    results = B.reconcile(left.rows, right.rows, {
      keys: pairFields.map((p) => p.map((f) => f.value)),
      leftAmount: amountFields[0].input.value,
      rightAmount: amountFields[1].input.value,
      tolerance: tolerance.input.value,
      ignoreCase: ignore.checked,
    });
    const ok = results.filter((r) =>
      ["一致", "匹配成功"].includes(r.status),
    ).length;
    U.clear(out).append(
      U.h("h2", { text: "对账结果" }),
      U.metrics([
        ["匹配结果", results.length, "组"],
        ["一致", ok, "组"],
        ["需要查看", results.length - ok, "组"],
      ]),
      U.table(
        [
          { key: "key", label: "匹配值" },
          { key: "status", label: "结果" },
          { key: "leftCount", label: "左表行数" },
          { key: "rightCount", label: "右表行数" },
          { key: "leftAmount", label: "左表金额" },
          { key: "rightAmount", label: "右表金额" },
          { key: "difference", label: "差额" },
        ],
        results.slice(0, 500),
      ),
      U.actions(
        U.button("导出全部结果", () =>
          U.exportRows(
            "对账结果.xlsx",
            results.map((r) => ({
              匹配值: r.key,
              结果: r.status,
              左表行数: r.leftCount,
              右表行数: r.rightCount,
              左表金额: r.leftAmount,
              右表金额: r.rightAmount,
              差额: r.difference,
            })),
          ),
        ),
      ),
    );
    if (results.length > 500)
      out.append(
        U.h("p", {
          class: "hint",
          text: "页面显示前500组，导出包含全部结果。",
        }),
      );
    U.source(left.name + " / " + right.name);
  }
  draw();
  calculate();
  U.source("演示数据");
})();
