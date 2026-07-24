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

## API and database (not yet deployed)

- The API targets container hosting (`API_HOSTING_PROVIDER=container` in `.env.local`); no environment exists yet.
- The Supabase project recorded in `.env.local` (`ifujcchqlotxenuitrey`) no longer resolves and must be recreated before database-backed deploys.
