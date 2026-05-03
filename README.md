# Way2Quran Marketing

Monorepo for Way2Quran Marketing Agency web properties.

## Structure

```
apps/
  web/        — Marketing website (Next.js 14, TypeScript, Tailwind)
packages/     — Shared libraries (design tokens, utilities — TBD)
docs/         — Architecture and process docs
scripts/      — Dev and ops scripts
```

## Local setup

**Prerequisites:** Node.js 22+, npm 10+

```bash
# Install all workspace dependencies
npm install

# Copy and fill in env vars
cp apps/web/.env.example apps/web/.env.local

# Start dev server at http://localhost:3100
npm run dev

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Deployment

Deployment is handled by **Vercel** (see `.github/workflows/deploy.yml` for setup steps).

- **Production:** `main` branch → auto-deployed to production URL
- **Previews:** every branch/PR gets a unique preview URL

One-time setup:
1. Go to [vercel.com/new](https://vercel.com/new) → import `Tamoura/way2quran-marketing`
2. Set root directory to `apps/web`
3. Add env vars from `apps/web/.env.example` in Vercel Settings → Environment Variables

## CI

| Trigger | Workflow | What runs |
|---------|----------|-----------|
| Push to any branch / PR | `ci.yml` | Typecheck, lint, build |

## Email

Transactional and campaign emails are sent via **Resend**.

- **Contact form:** `POST /api/contact` — sends confirmation to visitor + alert to team
- **Unsubscribe:** `GET /unsubscribe?email=...&token=...` — one-click unsubscribe (CAN-SPAM/GDPR)
- **Domain auth:** see `docs/email-domain-auth.md` for per-domain SPF/DKIM/DMARC setup
- **Smoke test:** `RESEND_API_KEY=xxx SMOKE_TO=you@example.com node scripts/smoke-test-email.mjs`

Required env vars: see `apps/web/.env.example`.

## Tech stack

- **Framework**: Next.js 14 (App Router, server runtime)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Email**: Resend (transactional + campaigns)
- **Monorepo**: npm workspaces
- **CI**: GitHub Actions
- **Hosting**: Vercel
