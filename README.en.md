# Spreadsheet cleanup and reconciliation

[简体中文](README.md) · English

Clean duplicate rows, match two spreadsheets and export differences.

Runs locally in your browser. No account or paid API is required. Demo data is fictional.

[Open online](https://tianchaodaxing-beep.github.io/pandao-reconcile/?lang=en) · [Download](https://github.com/tianchaodaxing-beep/pandao-reconcile/releases/latest) · [All projects](https://github.com/tianchaodaxing-beep/pandao-open-tools)

## Getting started

Download and extract the ZIP, then open `index.html`. On Windows you can double-click `Start-tool.cmd`. Keep the entire extracted folder together. Click **English** in the header; click **中文** to return to Chinese. Language selection preserves current inputs. Use `?lang=en` for a direct English page.

1. Import the left and right spreadsheets with unique, nonempty headers in the first row.
2. Choose matching columns; combine multiple columns if needed.
3. Choose amount columns and an allowed difference, reconcile and export all results.
4. Single-sheet cleanup trims whitespace, normalizes full-width characters and removes identical rows.

## Files and data

Spreadsheet import supports `.xlsx`, `.xls`, `.csv` and `.tsv`. Only the first worksheet is read. A spreadsheet is limited to 20,000 rows and 10 MB. Text-file support varies by tool.

Spreadsheet templates and export headers follow the selected language. Chinese and English template headers can both be imported. User-entered content and numeric results are retained as entered. Data is processed on your device and is not uploaded by the tool. External feedback links open GitHub. Export any data you need before closing: inputs are not saved automatically.

## Supported scope

Duplicate matching values are listed separately, without automatic pairing or amount merging. Empty keys and invalid amounts require review. The page shows the first 500 groups; exports include all groups.

## Development and licensing

Run `npm test` with Node.js 20 or later. Using the page requires no Node.js installation or runtime dependency.

MIT licensed. Commercial use, modification and redistribution are allowed while retaining the license notice. SheetJS Community Edition 0.20.3 uses Apache-2.0; see `THIRD_PARTY_NOTICES.md` and `vendor/SheetJS-LICENSE`.

## Feedback

Use the [issue tracker](https://github.com/tianchaodaxing-beep/pandao-reconcile/issues) to describe your use case and expected result. Use fictional examples in public reports; do not post customer data or credentials.

## Contact

Project enquiries and collaboration: [tianchaodaxing@gmail.com](mailto:tianchaodaxing@gmail.com)
