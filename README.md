# Way2Quran Marketing

Monorepo for Way2Quran Marketing Agency web properties.

## Structure

```
apps/
  web/        — Marketing website (Next.js 14, TypeScript, Tailwind)
packages/     — Shared libraries (design tokens, utilities — TBD)
docs/         — Architecture and process docs
```

## Local setup

**Prerequisites:** Node.js 22+, npm 10+

```bash
# Install all workspace dependencies
npm install

# Start dev server at http://localhost:3100
npm run dev

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Staging

Staging auto-deploys from `main` via GitHub Pages.

**One-time setup required:**
1. Go to **Settings → Pages → Source → GitHub Actions** in this repo.
2. Push to `main` — the deploy workflow picks it up automatically.

Staging URL: **https://tamoura.github.io/way2quran-marketing/**

## CI/CD

| Trigger | Workflow | What runs |
|---------|----------|-----------|
| Push to any branch / PR | `ci.yml` | Typecheck, lint, build |
| Push to `main` | `deploy.yml` | Build → GitHub Pages staging |

## Tech stack

- **Framework**: Next.js 14 (App Router, static export)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Monorepo**: npm workspaces
- **CI/CD**: GitHub Actions
- **Staging**: GitHub Pages
