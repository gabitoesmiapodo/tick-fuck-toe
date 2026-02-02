# Tic Tac Toe (minimal tsc + live-server scaffold)

Local dev (watch TypeScript and serve static files):

```bash
# install deps
npm install

# start dev (tsc --watch + live-server)
npm run dev
```

Build once:

```bash
npm run build:ts
```

Notes:
- Edit TypeScript in `src/` — compiled JS will appear in `dist/`.
- `index.html` loads `/dist/main.js` as a module.
- This scaffold uses `tsc --watch` and `live-server` for auto-reload.
