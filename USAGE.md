# Run the website readiness audit

## Requirements
- Python 3.10+
- No third-party packages required

## Run locally

```bash
python audit.py https://example.com --max-pages 10 --out report.md
```

The script fetches public HTML pages on the supplied host and writes a Markdown report. Start with a site you own or have permission to test. Keep `--max-pages` low and do not run aggressive crawls.

## Before using with a client
1. Review the target site's terms and robots.txt.
2. Verify every finding manually; HTML-only parsing can miss JavaScript-rendered content.
3. Remove sensitive data from reports before sharing.
4. Agree the scope, price, delivery date, and refund terms with the client in writing.
5. Never promise search rankings or AI-answer citations.

## Payments
Payment collection is not implemented. Do not store private keys, wallet seed phrases, or payment credentials in this repository. If a client wants to pay in crypto, issue an invoice with the exact asset/network and amount, confirm eligibility and tax treatment with a qualified Indian tax professional, and verify settlement independently before starting work.
