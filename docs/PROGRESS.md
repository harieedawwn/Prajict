# Progress
- Redesign: curved-arc track of real <img> cards (true thumb ratio), sheet with blur scrim + multi-image viewer, remember-login, single-commit writes. DONE.
- Deploy: Actions workflow retries deploy-pages (GitHub sometimes can't see the artifact yet). Asset ?v= cache busting. README display removed. DONE.
- Phone perf + display (2026-11-26): background broke into square blocks on phones (sin-hash precision) → noise texture; 1 height eval/pixel via fwidth; low-res canvas on touch; idle redraw throttled; transforms only when moving; SVG glass disabled on touch; lighter blur/shadows on phones; Zalo bridge stub; short-landscape layout; sheet fits content (bottom sheet on phones). Checked on 7 device profiles. Not yet measured on a real phone. DONE.
- Background (2026-11-26): live WebGL still lagged + looked blurry on the user's phone → replaced with a pre-rendered seamless image slid by transform (no per-frame GPU work). Lens + slow drift dropped. DONE.
- Phone scroll lag (2026-11-26): cards repainted every frame (no own layer) + backdrop blur over moving bg + huge parallax layer → cards will-change, touch: static bg, no blur, light shadows. Not measured on a real phone. DONE.

Next: P1
- P1 (2026-11-26): self-hosted Bricolage Grotesque (latin+vietnamese 400/700/800 in fonts/), no Google Fonts requests; og/twitter meta + og.jpg (1200×630, 79 KB, screenshot of home); in-app browsers (Zalo|FBAN|FBAV|Instagram|Line) get toast "Mở bằng trình duyệt để tải" on Tải ZIP; ?v=7. DONE. Not run check_devices (script unavailable here); node --check OK. Gotcha: og.jpg is a headless screenshot, re-make if the look changes.

- P2 (2026-11-26): nút "Sắp xếp" (#srt) → hộp thoại ↑/↓ + 1 commit (`sortP` in admin.js); form sửa: nút "Thumbnail" trên mỗi ảnh preview đặt thumb + `ta` từ kích thước ảnh, không upload; thumb cũ bị xóa trừ khi vẫn là shot; ?v=8. DONE. Checked: node --check, dialog 360px (30 items, tên dài) fits, swap works. Chưa thử commit thật (cần token).

Next: P3
