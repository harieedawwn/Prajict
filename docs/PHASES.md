# Phases
Old work (redesign, deploy fix, phone perf) is done directly, see PROGRESS. New phases:

## P1 · Chạy tốt trong Zalo/Facebook + link chia sẻ đẹp [DONE]
Read: CLAUDE.md, index.html, css/style.css (top), js/sheet.js (action links)
Do:
- Self-host Bricolage Grotesque (latin + vietnamese woff2 from @fontsource/bricolage-grotesque 400/700/800) in `fonts/`, @font-face in style.css with font-display:swap; drop the Google Fonts links.
- Share preview: `<meta name="description">`, og:title/og:description/og:image (absolute URL https://harieedawwn.github.io/Prajict/og.jpg, 1200×630 made from a screenshot of the home screen), twitter:card summary_large_image.
- In an in-app browser (UA has Zalo|FBAN|FBAV|Instagram|Line), "Tải ZIP" shows a small toast "Mở bằng trình duyệt để tải" instead of navigating.
- Bump ?v= in index.html.
Done when:
- [ ] No request to fonts.googleapis.com; Vietnamese diacritics render in the title and card names.
- [ ] og tags present with absolute URLs; og.jpg ≤ 200 KB.
- [ ] check_devices: no errors on all 7 profiles.
Model: Sonnet 5.5 · low — mechanical, clear spec
Deploy: yes · Screenshots: ≤2

## P2 · Admin: sắp xếp thứ tự project [TODO]
Read: CLAUDE.md, js/admin.js (commit, form), js/sheet.js (openP admin buttons)
Do:
- Admin tools gain "Sắp xếp": a dialog listing projects (thumb + name) with up/down buttons (works on touch, no drag library), Save = one commit via `commit()` that reorders `projects`.
- In the edit form, each existing preview image gets a "Làm thumbnail" button: sets `thumb` to that path and `ta` from the image's natural size (no re-upload).
Done when:
- [ ] Reorder saves in one commit and the track shows the new order immediately.
- [ ] Making a preview the thumbnail updates the card ratio without upload.
- [ ] node --check passes; dialogs fit a 360px screen.
Model: Sonnet 5.5 · medium — touches the write path, needs care
Deploy: yes · Screenshots: ≤2
