# CampusSync — LASUCOM Edition

CampusSync turns user-supplied campus flyers and broadcasts into evidence-backed, calendar-ready actions. It is built around the **Mirror Principle**: the product does not create news; it preserves a source excerpt, confidence, ambiguity, and a clear local-verification state for every action.

## Run locally

```bash
npm install
npm run dev
```

Then open the local address shown in the terminal.

## Current status

- Demo-ready: explicit fictional samples, local filters, evidence review, revision context, local persistence, ICS export, and Google Calendar links.
- Integration-ready: the Gemma 4 server adapter fails closed unless its server-side configuration exists.
- Not live: no DigitalOcean inference endpoint has been provisioned or connected; uploads are previewed but never represented as analysed.

## Recommended deployment

GitHub is the source of truth. Use Vercel for the public app and trusted API boundary, and a separately authenticated DigitalOcean service for Gemma 4 inference. Keep `GEMMA_ENDPOINT`, `GEMMA_API_KEY`, and `GEMMA_MODEL` only in deployment secrets—never in this repository or the browser.

See [product contract](docs/PRODUCT_CONTRACT.md), [architecture](docs/ARCHITECTURE.md), and [delivery gates](docs/DELIVERY.md).
# campusync
