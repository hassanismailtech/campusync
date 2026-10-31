# Architecture and deployment boundary

## Source of truth

The local Git checkout and `hassanismailtech/campusync` GitHub repository are the source of truth. Lovable is a design/reference environment only and is not a deployment or synchronization target.

## Demo-ready architecture

The Vite client contains a validated local notice store, deterministic sample notices, client-side filters, source evidence, verification state, and RFC 5545 calendar generation. The extractor is deliberately disabled when no server configuration is present; uploads are previewed but never claimed as analysed.

## Gemma 4 boundary

`server/extract-adapter.js` is an isolated server-side contract. A deployed service must supply `GEMMA_ENDPOINT`, `GEMMA_API_KEY`, and `GEMMA_MODEL` as server secrets. The browser calls only a same-origin `/api/extract` endpoint. Provider output must be JSON-validated and rejects invalid/oversized data. No secret, endpoint, model ID, or raw user content belongs in Git.

## Recommended hosting

Use **Vercel for the web app and API boundary**, paired with **DigitalOcean only for the Gemma 4 inference runtime**. Vercel gives GitHub-triggered preview/production deployments, HTTPS, rollbacks, and secure environment-variable handling. DigitalOcean should host the model behind an authenticated HTTPS endpoint only after the exact GPU/runtime, model ID, image capability, quotas, and cost ceiling are agreed. This separates unpredictable inference compute from the public app and avoids exposing a GPU directly.

Before enabling live extraction: configure secrets in Vercel, provision an authenticated DigitalOcean endpoint, enforce a request-size limit and rate limiting, confirm the model contract with a non-sensitive fixture, and set the endpoint's URL only in server configuration.
