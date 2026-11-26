# Kho project

Static GitHub Pages portfolio. One owner (hidden login, bottom-left invisible button) adds repos: name, repo link, optional github.io link, thumbnail, preview shots, Markdown description, ZIP download button. Visitors only view.

## Files
- `index.html` markup + script order
- `css/style.css` DOM styling (glass plates, sheet, dialogs)
- `js/util.js` helpers · `config.js` owner/repo/branch (auto-detected from the github.io URL), password hash, state · `md.js` tiny Markdown
- `js/util.js` also has `LOCAL`/`src()`: just-uploaded images shown from memory until Pages redeploys
- `js/glass.js` DOM glass (SVG displacement map, desktop Chromium only; plain blur elsewhere — the displacement backdrop is too heavy for phones)
- `index.html` head has a Zalo bridge stub (zaloJSV2, ZaloJavaScriptInterface) so in-app browsers don't throw
- Background = pre-rendered seamless contour map `img/map.webp` (made by `tools/make_map.py`, 2x density, tile 1536 CSS px / 1024 on phones) on `#bg`, moved only by translate3d for parallax. No WebGL: the live shader lagged and blurred on phones — don't bring it back.
- `js/track.js` DOM cards (real <img>, card aspect = thumbnail aspect `ta`) laid on a curved arc; drag/wheel/keys with snap. Perf: `place()` and the bg transform only update while moving; loop does nothing when idle, open or hidden. Cards are GPU layers (will-change:transform) so moving them never repaints image/shadow. On touch (pointer:coarse): bg static (no parallax layer), no backdrop-filter on #top/buttons, one-layer shadows, no skew. Headless fps tests can't show phone GPU cost — reason about layers/paints instead
- `js/sheet.js` project view (FLIP from the card, blurred scrim), multi-image viewer (swipe, keys, fullscreen), dialogs
- `js/admin.js` login (PBKDF2 hash), token AES-GCM in localStorage + optional "remember" (non-extractable key in IndexedDB), all writes as ONE commit via Git Data API (blobs → tree → commit → ref), removed images are deleted
- `js/main.js` loads data
- `data/projects.json` `{"projects":[{id,name,repo,pages,thumb,ta,shots[],desc}]}` (`ta` = thumb width/height) · `images/` uploads

## Freedom
Change anything visual: background, layout, motion, type, how projects are presented. Make it distinctive, not a template.
Fixed: no gradients, no neon, no bloom/glow. Keep UI text minimal (no hints, captions or explanations). Vietnamese UI.
Keep the data schema and admin flow working, or update both sides together. Never put the password or a token in the repo (password is checked via PBKDF2 hash; token is AES-GCM encrypted in localStorage).

## Docs
`docs/PHASES.md` phases · `docs/PROGRESS.md` log + Next line · `docs/INBOX.md` user bugs/wishes.

## Run / check
When changing CSS/JS, bump `?v=` on every asset in `index.html` (browsers cache old files).
`python3 -m http.server` (fetch needs http, not file://). `node --check js/*.js`. Device check: the web-ui-multidevice skill's `check_devices.mjs http://localhost:8000/` (+ `--click ".card.on"`). Known OK warnings: neighbour cards cut by screen edge (carousel), `#sec` 30px (hidden login, intended), 40px buttons on phones (user wants a compact phone UI). Scripts are plain globals loaded in the order in `index.html`.
Deploy: push to `main`; `.github/workflows/pages.yml` publishes the repo root (Pages source = GitHub Actions).
