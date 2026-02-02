You are operating in VS Code Agent mode.
Goal: make the repo pass pnpm type-check and pnpm lint.

Rules:
- Use pnpm via Corepack
- Do not edit README.md
- Keep changes minimal and localized

Process:
1) Identify current TypeScript errors (especially UI mounting signatures)
2) Apply minimal fixes
3) Add ESLint + Prettier with scripts
4) Run pnpm type-check and pnpm lint and fix until green
Return:
- List of files changed
- Commands executed and results
