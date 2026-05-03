# Architecture

## Overview

Way2Quran Marketing is a Next.js monorepo managed with npm workspaces.

## Workspace layout

| Path | Purpose |
|------|----------|
| `apps/web` | Main marketing website (Next.js 14, App Router) |
| `packages/` | Shared libraries (design tokens, utilities — TBD) |
| `docs/` | Architecture and process documentation |

## Key decisions

- **Static export** — `next export` produces a plain HTML/CSS/JS bundle, enabling GitHub Pages hosting at zero cost.
- **Tailwind CSS** — utility-first styling, fast iteration, no runtime overhead.
- **npm workspaces** — keeps dependencies hoisted, shared scripts at the root.
- **GitHub Pages** — staging URL at `https://tamoura.github.io/way2quran-marketing/`.

## CI/CD

| Trigger | Workflow | Steps |
|---------|----------|-------|
| Any push / PR | `ci.yml` | typecheck → lint → build |
| Push to `main` | `deploy.yml` | build → upload artifact → deploy to Pages |
