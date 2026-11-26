# Progress
- Redesign: curved-arc track of real <img> cards (true thumb ratio), sheet with blur scrim + multi-image viewer, remember-login, single-commit writes. DONE.
- Deploy: Actions workflow retries deploy-pages (GitHub sometimes can't see the artifact yet). Asset ?v= cache busting. README display removed. DONE.
- Phone perf + display (2026-11-26): background broke into square blocks on phones (sin-hash precision) → noise texture; 1 height eval/pixel via fwidth; low-res canvas on touch; idle redraw throttled; transforms only when moving; SVG glass disabled on touch; lighter blur/shadows on phones; Zalo bridge stub; short-landscape layout; sheet fits content (bottom sheet on phones). Checked on 7 device profiles. Not yet measured on a real phone. DONE.

Next: P1
