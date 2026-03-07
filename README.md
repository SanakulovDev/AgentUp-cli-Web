<div align="center">

# Agent Up — Web

**Marketing & landing page for the Agent Up CLI tool.**

A CLI that scaffolds AI coding agent configuration files (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, etc.) for modern development workflows.

[![Firebase Hosting](https://img.shields.io/badge/Hosted_on-Firebase-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| **UI**       | React 19 + TypeScript 5.8           |
| **Build**    | Vite 6                              |
| **Styling**  | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Animation**| Motion (framer-motion successor)    |
| **Icons**    | Lucide React                        |
| **Utilities**| clsx + tailwind-merge (`cn()`)      |
| **Hosting**  | Firebase Hosting                    |
| **CI/CD**    | GitHub Actions                      |

## Getting Started

**Prerequisites:** Node.js >= 18

```bash
# Clone the repository
git clone https://github.com/SanakulovDev/AgentUp-cli-Web.git
cd AgentUp-cli-Web

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev
```

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start dev server on port 3000      |
| `npm run build`     | Production build (outputs to `dist/`) |
| `npm run preview`   | Preview production build           |
| `npm run lint`      | Type-check with `tsc --noEmit`     |
| `npm run clean`     | Remove `dist/`                     |

## Project Structure

```
src/
├── App.tsx          # All page sections (Navbar, Hero, Features, etc.)
├── main.tsx         # React entry point
├── index.css        # Tailwind config & custom utilities
└── lib/
    └── utils.ts     # cn() utility (clsx + tailwind-merge)
```

This is a single-page landing site — all UI components live in `src/App.tsx` as colocated components. There is no routing.

## Deployment

Hosted on **Firebase Hosting** with automated CI/CD:

- **Merge to `main`** — auto-deploys to production (`.github/workflows/firebase-hosting-merge.yml`)
- **Pull requests** — creates preview deployments (`.github/workflows/firebase-hosting-pull-request.yml`)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable         | Description                     |
| ---------------- | ------------------------------- |
| `GEMINI_API_KEY` | Gemini API key (optional for landing page) |

## License

This project is open source.

---

<div align="center">
  <sub>Built with React, TypeScript, Tailwind CSS, and Vite</sub>
</div>
