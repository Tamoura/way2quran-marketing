# Architecture

## Monorepo layout

| Path | Purpose |
|------|---------|
| `apps/web` | Marketing website (Next.js 14, static export) |
| `packages/` | Shared libraries — design tokens, UI, utilities (TBD) |
| `docs/` | Architecture and process documentation |

## Environments

| Environment | URL | Trigger |
|-------------|-----|---------|
| Staging | https://tamoura.github.io/way2quran-marketing/ | Push to `main` |
| Production | TBD — custom domain via GitHub Pages or Vercel | Manual / tag |

## CI/CD pipeline

**`ci.yml`** — every branch push and PR to `main`:
1. `tsc --noEmit` — type safety gate
2. `next lint` — ESLint
3. `next build` — ensures the app builds

**`deploy.yml`** — push to `main` only:
1. `next build` with `output: 'export'` → `apps/web/out/`
2. Upload artifact to GitHub Pages
3. `actions/deploy-pages` publishes to staging URL

## Adding a lockfile (recommended)

After first clone, run `npm install` and commit `package-lock.json`.
This enables `npm ci` in CI for faster, reproducible installs.
