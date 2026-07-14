# Janet's Journey — First Class to Jamaica ✈️

A modern, secure static landing page. Tap the animated **US passport** to open it
into a **Jamaica boarding pass**, complete with a cabin **boarding chime** and a
**captain "prepare for takeoff"** announcement.

## Tech stack

| Purpose            | Tech                                   |
| ------------------ | -------------------------------------- |
| Framework          | [Astro](https://astro.build) (static)  |
| Interactivity      | [React](https://react.dev) islands     |
| Styling            | [Tailwind CSS v4](https://tailwindcss.com) |
| Components          | [shadcn/ui](https://ui.shadcn.com) primitives |
| Animation          | [Motion](https://motion.dev) + [GSAP](https://gsap.com) |
| Smooth scrolling   | [Lenis](https://lenis.darkroom.engineering) (Smooth UI) |
| Audio              | Web Audio API chime + SpeechSynthesis captain voice |

## How the experience works

1. The passport floats with a GSAP idle animation and a repeating gold shine sweep.
2. Clicking (or pressing Enter/Space on) the passport flips the cover open with a
   Motion 3D animation, revealing the boarding pass.
3. The click is the user gesture that unlocks audio, so the boarding chime plays
   immediately, followed by the captain's announcement — no autoplay blocking, and
   no external/copyrighted audio files.

## Local development

Requires Node.js 22+.

```bash
npm install
npm run dev      # start the dev server
npm run build    # build the static site to dist/
npm run preview  # preview the production build
```

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to GitHub Pages.

The site is served from a sub-path, so `astro.config.mjs` sets:

```js
site: "https://rell2405.github.io",
base: "/Janet-Birthday-Site",
```

One-time repo setup: **Settings → Pages → Build and deployment → Source: GitHub Actions.**

The live URL will be: `https://rell2405.github.io/Janet-Birthday-Site/`

## Security notes

- Fully static output — no server runtime, no user input, no third-party trackers.
- Hardened response via a Content-Security-Policy meta tag (`object-src 'none'`,
  `frame-ancestors 'none'`, `base-uri 'self'`, `upgrade-insecure-requests`) plus a
  strict referrer policy.
- `npm audit` reports **0 vulnerabilities**.
