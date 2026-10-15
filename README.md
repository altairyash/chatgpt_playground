# Signal Audit — Next.js

A responsive landing page for a practical website search-readiness audit service. The Python prototype (`audit.py`) remains in the repository.

## Deploy to Vercel

1. Open [Vercel](https://vercel.com/new) and import this GitHub repository.
2. Set the production branch to `main` and choose the **Next.js** framework preset.
3. Keep the default install/build settings (`npm install`, `npm run build`).
4. In Vercel → Project Settings → Environment Variables, add `NEXT_PUBLIC_CONTACT_EMAIL` with the email address that should receive audit requests.
5. Deploy. New commits to `main` automatically trigger production deployments when the Git integration is active. This repository is intended for an inspect → improve → commit → deploy iteration loop.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Before accepting customers

- The request form opens a prefilled email only if `NEXT_PUBLIC_CONTACT_EMAIL` is configured. It does not store submissions or send email from a server.
- The displayed ₹4,999 is a proposed starting price, not a payment checkout. Confirm scope with the customer before taking payment.
- The Python audit prototype is local-only and is not exposed as a public API by this Next.js app.
- This service offers technical observations and recommendations; it does not guarantee rankings or AI-answer visibility.
