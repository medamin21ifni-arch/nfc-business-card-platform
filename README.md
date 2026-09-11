# NFC Business Cards

Reusable NFC digital-card platform built as a standard Next.js application for Vercel.

## Routes

- `/admin` — private administrator panel.
- `/<slug>` — deterministic public card rendered from one business record.

## Required production environment variables

Set these in Vercel before first use:

- `ADMIN_PASSWORD` — the single administrator password.
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token for persistent encrypted business records and uploaded images.

Without the Blob token, local development uses `data/businesses.json`; production should always use Blob so records survive redeployments.

## Local development

```bash
npm install
$env:ADMIN_PASSWORD="your-local-password"
npm run dev
```

Open `/admin`, create a business, upload exactly one logo and one store image, then publish. The store image is reused in both the hero and location card. Empty optional links are omitted automatically.

## Production

```bash
npm install
npm run lint
npm run build
```

Deploy this repository as a new Vercel project. Do not reuse the former Beauty Success or HOLA BEAUTY customer projects.
