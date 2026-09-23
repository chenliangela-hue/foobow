# Foobow Deployment

## Web (prototype site)

- Host: Vercel, team `chenangela-s-projects` (`team_AqCSnEbzhqzfRQ6rdvKOEgCd`), project `foobow` (`prj_SaxS3F8THrSBX0g4qgy33FsXsR08`).
- Deployed artifact: the static clickable prototype in `prototype/`.
- Live URL: <https://foobow.vercel.app> (production alias).
- Custom domains `foobow.com` and `www.foobow.com` are attached to the project but remain parked at Namecheap until DNS is updated (see below).

## Domain DNS (action required at Namecheap)

The domain uses Namecheap default nameservers (`dns1/dns2.registrar-servers.com`). In the Namecheap Advanced DNS panel for `foobow.com`, replace the parking records with:

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `216.198.79.1` |
| `@` | A | `64.29.17.1` |
| `www` | CNAME | `061d7d7761ff16cc.vercel-dns-017.com.` |

Delete the existing parking A/CNAME records (`162.255.119.222`, `parkingpage.namecheap.com`). Vercel issues TLS certificates automatically once DNS propagates.

## CI/CD (automatic)

Deployment is fully automated through **Vercel's native Git integration** — no GitHub secrets required:

- The `foobow` Vercel project is linked to `chenliangela-hue/foobow`.
- Production branch: `main`. Root directory: `prototype`.
- **Every push to `main` deploys to production automatically**, and pull requests get preview deployments.

GitHub Actions (`.github/workflows/ci.yml`) runs the quality gates in parallel — `verify` (unit/content/API/mobile-typecheck/security/browser), `api-db-smoke` (schema + seeds + DB write paths on a fresh Postgres), and `visual-regression`. Vercel deploys independently, so a red build does not block the deploy; check CI before relying on a release.

To change the linked repository or branch, use the Vercel dashboard (Project → Settings → Git) or the API.

## Manual deploy

From `prototype/` (the directory is linked via `prototype/.vercel/`, which is gitignored):

```bash
npx vercel@latest deploy --prod --yes --token "$VERCEL_TOKEN" --scope team_AqCSnEbzhqzfRQ6rdvKOEgCd
```

## API and database

- The backend targets container or serverless hosting (`apps/api`), runnable via `npm --prefix apps/api run start:nest` or `npm --prefix apps/api run start:native`.
- Supabase production project `uukmupcmesqsfrymidtf` has been provisioned with applied migrations (`0001_initial.sql`, `0002_focus_sessions.sql`, `0003_media_and_commerce.sql`), reference seeds, and storage buckets (`public-assets`, `user-uploads`, `ai-generated`).
- When running in cloud-connected mode, configure `DATABASE_URL` with the Supabase pooler connection string. When running locally without cloud secrets, the API gracefully falls back to deterministic in-memory fixtures or local Docker Postgres (`localhost:55432`).
