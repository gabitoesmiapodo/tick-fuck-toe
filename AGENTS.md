# Agent operating guide

## Project summary
- Vite + TypeScript + DOM only
- Human vs AI Tic Tac Toe (3x3)
- No automated tests
- pnpm via Corepack

## Required workflow
1) Read current code and identify compilation/runtime breaks
2) Apply the smallest change set that fixes the task
3) Validate with:
   - pnpm type-check
   - pnpm lint
4) If validation fails, iterate until it passes

## Constraints
- Do not edit README.md unless asked
- Do not add UI frameworks
- Game logic must be deterministic and UI-agnostic (no DOM)

## Architecture
- src/game/**: rules, state transitions, AI move selection
- src/ui/**: DOM rendering and event handling only
- src/main.ts: wiring only

## AI requirements
- Single difficulty, "human-like": occasionally choose a suboptimal move
- No artificial delay
- No undo

## First task priority (repo health)
- Ensure pnpm type-check passes (fix mountUI signature mismatch and any strict TS errors)
- Add ESLint + Prettier and scripts
