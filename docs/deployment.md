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

## CI/CD

`deploy-web` in `.github/workflows/ci.yml` deploys `prototype/` to Vercel production on every `main` push after `verify`, `api-db-smoke`, and `visual-regression` pass. It stays skipped until:

1. Repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` are set.
2. Repository variable `VERCEL_DEPLOY_ENABLED` is set to `true`.

Values live in the untracked root `.env.local`. Never commit them.

## Manual deploy

From `prototype/` (the directory is linked via `prototype/.vercel/`, which is gitignored):

```bash
npx vercel@latest deploy --prod --yes --token "$VERCEL_TOKEN" --scope team_AqCSnEbzhqzfRQ6rdvKOEgCd
```

## API and database (not yet deployed)

- The API targets container hosting (`API_HOSTING_PROVIDER=container` in `.env.local`); no environment exists yet.
- The Supabase project recorded in `.env.local` (`ifujcchqlotxenuitrey`) no longer resolves and must be recreated before database-backed deploys.
