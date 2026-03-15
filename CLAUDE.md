# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgentUp CLI Web is the marketing/landing page for the AgentUp CLI tool — a CLI that scaffolds AI coding agent configuration files (CLAUDE.md, AGENTS.md, .cursorrules, etc.) for modern development workflows. This repo is the **website only**, not the CLI itself.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build (outputs to `dist/`)
- `npm run preview` — Preview production build
- `npm run lint` — Type-check with `tsc --noEmit` (no separate linter)
- `npm run clean` — Remove `dist/`

## Tech Stack

- **React 19** with TypeScript, built via **Vite**
- **Tailwind CSS v4** (uses `@tailwindcss/vite` plugin, config in `src/index.css` via `@theme`)
- **Motion** (framer-motion successor) for animations
- **Lucide React** for icons
- `clsx` + `tailwind-merge` via `cn()` utility at `src/lib/utils.ts`

## Architecture

This is a single-page landing site. All UI lives in `src/App.tsx` as colocated components (Navbar, Hero, ProblemSection, InteractivePreview, Features, HowItWorks, FAQ, Footer). There is no routing.

## Deployment

- Hosted on **Firebase Hosting** (config in `firebase.json`, `.firebaserc`)
- CI via GitHub Actions: `.github/workflows/firebase-hosting-merge.yml` (deploy on merge to main) and `firebase-hosting-pull-request.yml` (preview on PR)
- SPA rewrite rule: all routes serve `index.html`

## Path Aliases

`@/*` maps to the project root (configured in both `tsconfig.json` and `vite.config.ts`).

## Environment

- `GROQ_API_KEY`, `GROQ_API_URL`, `GROQ_MODEL` — used by the Express proxy server (`server/index.ts`), read from `.env`
- The frontend never accesses API keys directly; all AI calls go through `/api/generate` and `/api/analyze` proxied to `localhost:3001`
