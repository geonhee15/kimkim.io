# kimkim.io

Maker portfolio of Kim Geonhee.

Live: [kimkim.io](https://kimkim.io)

## Stack

Static site — no framework, no build step.

- `index.html` — main page
- `styles.css` — design tokens, layout, animations
- `main.js` — i18n (KO/EN/JA), reveal-on-scroll, filter toggle, cube video modal
- `factory.jpg` — hero background
- `favicon.png` — tab icon

## Dev

Any static server works:

```bash
python3 -m http.server 4321
# open http://localhost:4321
```

## Asset hosting

Videos hosted on Cloudflare R2 (`videos.kimkim.io`). Source files excluded from git via `.gitignore`.

Local dev (`localhost` / `127.0.0.1` / `0.0.0.0`) falls back to `/assets/videos/*.mp4` so playback works offline. Production fetches from R2 directly.

If R2 CORS errors appear, set the bucket's CORS policy to allow `https://kimkim.io` and `http://localhost:*` for `GET` / `HEAD`.
