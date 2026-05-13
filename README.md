# Editframe Meta Video — `Video is a web page that moves.`

A 27-second vertical (1080×1920) promo for **[Editframe](https://editframe.com)** — built with Editframe itself.
Written as a single HTML composition using `<ef-*>` web components, rendered clientside via WebCodecs + FFmpeg.wasm.

> Echo of Editframe's own brand tagline.
> The whole thing is one `index.html` you can read end-to-end in 5 minutes.

---

## Demo

- **Live preview:** `npm start` → http://localhost:4321
- **Rendered MP4:** see `output.mp4` (clientside render from the Workbench Export button)

## What's inside

| Scene | Duration | Beat |
|---|---|---|
| 1 — Hook | 3.5s | `VIDEO IS A` + yellow `WEB PAGE` + `that moves.` (Editframe's actual tagline) |
| 2 — Dev cockpit | 5.5s | 4 angled mini-terminals streaming realistic CLI output + a central IDE + live render preview |
| 3 — Components | 6s | Pill stack of primitives: `<ef-timegroup />`, `<ef-text />`, `<ef-video />`, `<ef-audio />`, `<ef-image />` |
| 4 — Pipeline | 6s | Code → Browser → MP4 with traveling data packets along the arrows |
| 5 — CTA | 6s | Rotating conic-gradient glow ring + particle burst + "Built by Claude. Rendered in the cloud." |

All animation is **CSS keyframes** — no JS animation runtime. Editframe's time engine ([`--ef-stagger-offset`](https://editframe.com/docs/composition/text), per-scene `mode="fixed"` durations) drives everything.

## Stack

- **Editframe**: `@editframe/elements` + `@editframe/cli` + `@editframe/vite-plugin` (`0.53.2`)
- **Build**: Vite 8 + Tailwind v4 + `vite-plugin-singlefile`
- **Voiceover**: ElevenLabs (`eleven_multilingual_v2`, voice `nPczCjzI2devNBz1zQrb` — Brian)
- **Fonts**: Inter (heavy display) + JetBrains Mono (terminals)

## Project layout

```
editframe-meta-promo/
├── index.html               # the whole composition (5 scenes, all CSS inline)
├── editframe-meta-promo.mp4 # rendered output (27s, 1080×1920, ~25 MB)
├── src/
│   ├── index.js             # loads @editframe/elements runtime
│   ├── styles.css           # tailwind + workbench sizing
│   └── assets/
│       └── voice-s1..5.mp3  # ElevenLabs voiceover per scene
├── scripts/
│   └── generate-voice.mjs   # regenerate voiceover (reads ELEVENLABS_API_KEY)
├── package.json
└── vite.config.ts
```

## Run it

```bash
npm install
npm start           # opens the Editframe Workbench at http://localhost:4321
```

Press the **Export** button in the Workbench (top-right) → choose `DOM` → **Start Export**. Renders clientside via WebCodecs to MP4.

## Regenerate the voiceover

```bash
# Reads ELEVENLABS_API_KEY from ~/.claude/credentials.env or env var
node scripts/generate-voice.mjs
```

Override the voice with `VOICE_ID=<elevenlabs_voice_id>`.

---

Built by **[Ginquel Moreira](https://www.upwork.com/freelancers/~012d1cf522c2961356)** ([Limitless GMTech Solutions](https://limitless-gmtech.com)) for Jeremy Yudkin / Editframe.
