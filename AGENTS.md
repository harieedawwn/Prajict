# Kho project — guide for AI agents

Static GitHub Pages portfolio. One owner (hidden login, bottom-left invisible button) adds repos: name, repo link, optional github.io link, thumbnail, preview shots, Markdown description, ZIP download button. Visitors only view.

## Files
- `index.html` markup + script order
- `css/style.css` DOM styling (glass plates, sheet, dialogs)
- `js/util.js` helpers · `config.js` owner/repo/branch (auto-detected from the github.io URL), password hash, state · `md.js` tiny Markdown
- `js/util.js` also has `LOCAL`/`src()`: just-uploaded images shown from memory until Pages redeploys
- `js/glass.js` DOM glass (SVG displacement map, Chromium; blur fallback elsewhere)
- `js/shader.js` GLSL background only: contour map + cursor lens (`uOff` pans with the track)
- `js/track.js` DOM cards (real <img>, card aspect = thumbnail aspect `ta`) laid on a curved arc; drag/wheel/keys with snap; WebGL2 draw loop (paused while the sheet is open)
- `js/sheet.js` project view (FLIP from the card, blurred scrim), multi-image viewer (swipe, keys, fullscreen), dialogs
- `js/admin.js` login (PBKDF2 hash), token AES-GCM in localStorage + optional "remember" (non-extractable key in IndexedDB), all writes as ONE commit via Git Data API (blobs → tree → commit → ref), removed images are deleted
- `js/main.js` loads data
- `data/projects.json` `{"projects":[{id,name,repo,pages,thumb,ta,shots[],desc}]}` (`ta` = thumb width/height) · `images/` uploads

## Freedom
Change anything visual: background, layout, motion, type, how projects are presented. Make it distinctive, not a template.
Fixed: no gradients, no neon, no bloom/glow. Keep UI text minimal (no hints, captions or explanations). Vietnamese UI.
Keep the data schema and admin flow working, or update both sides together. Never put the password or a token in the repo (password is checked via PBKDF2 hash; token is AES-GCM encrypted in localStorage).

## Run / check
When changing CSS/JS, bump `?v=` on every asset in `index.html` (browsers cache old files).
`python3 -m http.server` (fetch needs http, not file://). `node --check js/*.js`. Scripts are plain globals loaded in the order in `index.html`.
Deploy: push to `main`; `.github/workflows/pages.yml` publishes the repo root (Pages source = GitHub Actions).
