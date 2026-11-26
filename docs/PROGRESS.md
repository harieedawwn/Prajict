# Progress
- Redesign: curved-arc track of real <img> cards (true thumb ratio), sheet with blur scrim + multi-image viewer, remember-login, single-commit writes. DONE.
- Deploy: Actions workflow retries deploy-pages (GitHub sometimes can't see the artifact yet). Asset ?v= cache busting. README display removed. DONE.
- Phone perf + display (2026-11-26): background broke into square blocks on phones (sin-hash precision) → noise texture; 1 height eval/pixel via fwidth; low-res canvas on touch; idle redraw throttled; transforms only when moving; SVG glass disabled on touch; lighter blur/shadows on phones; Zalo bridge stub; short-landscape layout; sheet fits content (bottom sheet on phones). Checked on 7 device profiles. Not yet measured on a real phone. DONE.

Next: P1
- P1 (2026-11-26): self-hosted Bricolage Grotesque (latin+vietnamese 400/700/800 in fonts/), no Google Fonts requests; og/twitter meta + og.jpg (1200×630, 79 KB, screenshot of home); in-app browsers (Zalo|FBAN|FBAV|Instagram|Line) get toast "Mở bằng trình duyệt để tải" on Tải ZIP; ?v=7. DONE. Not run check_devices (script unavailable here); node --check OK. Gotcha: og.jpg is a headless screenshot, re-make if the look changes.

Next: P2
