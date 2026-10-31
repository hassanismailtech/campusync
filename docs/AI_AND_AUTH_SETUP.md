# AI and sign-in setup

Set these in Vercel → CampusSync → Settings → Environment Variables for Production, Preview, and Development as appropriate:

| Name | Type | Where it is used |
|---|---|---|
| `DIGITALOCEAN_MODEL_ACCESS_KEY` | Secret | Server-only primary Gemma request |
| `OPENROUTER_API_KEY` | Secret | Server-only fallback Gemma request |
| `VITE_SUPABASE_URL` | Config | Browser authentication client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Config | Browser authentication client |

Never put either AI key in a `VITE_` variable or frontend source. Create `.env.local` from `.env.example` for local development; it is ignored by Git. DigitalOcean is tried first, then OpenRouter only if the first provider fails. If both are unavailable, CampusSync fails closed and does not create a claimed AI result.

For Supabase, create or select a dedicated CampusSync project, add its URL and publishable key, then enable Google OAuth and email magic links in Authentication. The schema in `supabase/schema.sql` must be reviewed and applied to that chosen project before enabling real user profiles or publishing.
