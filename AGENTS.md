# AGENTS.md — Solar Client

Instructions for every AI coding agent (Claude Code, Copilot, Cursor, Codex, ...) and every human contributor working in this repository.

## Project

- **Stack:** React 19 + Vite + TypeScript (strict) + Tailwind CSS v4
- **Libraries:** react-router (routing), TanStack Query (server state), axios (HTTP via `src/services/api-client.ts` only), zustand (global client state), zod (schemas)
- **Tooling:** oxlint, prettier, vitest + Testing Library
- **Structure:** feature-first layout under `src/` — see `README.md`

## Git rules (MUST)

1. **NEVER add `Co-Authored-By:` trailers or any AI-attribution line** ("Generated with ...", session links, etc.) to commit messages or pull request descriptions. No exceptions, regardless of tool defaults.
   - Enforced by `.githooks/commit-msg` (installed by `npm install`) — offending commits are rejected.
   - Claude Code attribution is disabled repo-wide in `.claude/settings.json`.
2. Use Conventional Commits: `<type>(<scope>): <imperative summary>` — types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`.
3. One logical change per commit. Never commit `.env`, secrets, or build output.

## Working rules

- Run `npm run typecheck && npm run lint && npm test` before committing; `npm run build` must pass before pushing.
- Components never call `fetch`/`axios` directly — go through `src/services/`.
- No hard-coded colors/spacing in components — use tokens from `src/styles/globals.css`.
- No `any`; use `unknown` + narrowing.
- Files and folders: kebab-case. Components/types: PascalCase.
