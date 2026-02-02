# Copilot workspace instructions (Vite + TS + DOM, pnpm)

## Non-negotiables
- Use TypeScript. Do not add frameworks.
- Use pnpm via Corepack. Do not use npm or yarn.
- Do not modify README.md unless explicitly asked.
- No tests in this repo. Use type-check + lint as validation.
- Keep the game logic pure: no DOM usage in src/game/**.
- UI code only in src/ui/** and it must not implement game rules.

## Commands (source of truth)
- Install: corepack enable && pnpm install
- Dev: pnpm dev
- Type check: pnpm type-check
- Lint: pnpm lint
- Format: pnpm format

## Definition of done for any change
- pnpm type-check passes
- pnpm lint passes
- App runs with pnpm dev without console errors

## Implementation style
- Prefer small commits worth of changes (one focused task).
- Prefer pure functions and immutable data in game logic.
- Keep files small and cohesive. Avoid overengineering.

## Safety rails
- Do not introduce new dependencies unless required for ESLint/Prettier.
- If you change public APIs (Game / UI), update all call sites in the same change.
