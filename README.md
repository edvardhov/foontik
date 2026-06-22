<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="src/assets/foontik-dark.svg" />
  <img alt="Foontik" src="src/assets/foontik-light.svg" width="300" />
</picture>

**Kinetic type-art studio.** Type a word, shape it with your cursor and voice, and snap it as a poster.

[Live demo](https://edvardhov.github.io/foontik/) · [Report a bug](https://github.com/edvardhov/foontik/issues)

</div>

---

Foontik turns a single word into living, kinetic typography. It maps real-time input — pointer position and microphone level — onto the variable-font axes of [Recursive](https://www.recursive.design/), so the letterforms breathe, lean, and morph as you move. When you land on a look you like, export it as a high-resolution poster.

## Features

- **Variable-font engine** — drives `wght`, `slnt`, `CASL` (casual), `MONO`, `CRSV` (cursive), and `scale` axes in real time.
- **Multi-input mapping** — bind any axis to `mouseX`, `mouseY`, microphone level, or a fixed value, each with its own range and sensitivity.
- **Live audio reactivity** — opt-in mic input so type pulses with sound.
- **Presets** — curated starter looks plus save/load of your own, persisted to `localStorage`.
- **Guided onboarding** — first-run walkthrough and an interactive demo.
- **Poster export** — snapshot the stage to an image.
- **Zero backend** — fully client-side; state lives in the browser.

## Tech stack

| Concern   | Choice                    |
| --------- | ------------------------- |
| Framework | React 19                  |
| Language  | TypeScript                |
| Build     | Vite                      |
| Styling   | Tailwind CSS v4           |
| Animation | Motion                    |
| Type      | Recursive (variable font) |

## Getting started

Requires Node.js 20+.

```bash
git clone https://github.com/edvardhov/foontik.git
cd foontik
npm install
npm run dev
```

The dev server prints a local URL (default `http://localhost:5173`).

## Scripts

| Command           | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR.                   |
| `npm run build`   | Type-check and produce a production build in `dist/`. |
| `npm run preview` | Serve the production build locally.                   |
| `npm run lint`    | Run ESLint over the project.                          |

## Project structure

```
src/
  engine/      Variable-font axis definitions, mapping, and the render engine
  inputs/      Pointer and microphone input hooks
  hooks/       Engine wiring and localStorage persistence
  state/       Config model and presets
  components/  Stage, dashboard controls, onboarding, logo
  export/      Poster snapshot
```
