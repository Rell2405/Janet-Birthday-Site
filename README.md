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
| Public content     | Validated Astro Markdown content collections |
| RSVP API foundation | Cloudflare Worker + D1 + Turnstile |

## How the experience works

1. The passport floats with a GSAP idle animation and a repeating gold shine sweep.
2. Clicking (or pressing Enter/Space on) the passport flips the cover open with a
   Motion 3D animation, revealing the boarding pass.
3. The click is the user gesture that unlocks audio, so the boarding chime plays
   immediately, followed by the captain's announcement — no autoplay blocking, and
   no external/copyrighted audio files.

## Local development

Requires Node.js 22.12 or later in the Node 22 release line.

```bash
npm ci
npm run dev      # start the dev server
npm run check    # Astro, TypeScript, and Worker configuration checks
npm run test     # unit tests
npm run build    # build the static site to dist/
npm run preview  # preview the production build
```

Client-controlled event content and feature flags live in
`src/config/event.ts`; visual tokens live in `src/config/theme.ts`. The RSVP
feature is disabled until production infrastructure and client requirements are
approved.

Public itinerary, FAQ, and travel content lives in `src/content/`. Entries are
validated at build time and remain hidden while `draft: true`. Follow
[`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) to publish content and enable its
feature flag. Never store private event or guest information in Markdown.

For local RSVP API work:

```bash
cp .env.example .env
cp worker/.dev.vars.example worker/.dev.vars
npm run worker:types
npm run worker:migrate:local
npm run worker:dev
```

The committed Turnstile values are Cloudflare's public test keys. Production
secrets must be set with Wrangler and must never be committed.

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

- The deployed frontend remains static. RSVP processing is isolated in a
  separately deployed Worker and is disabled by default.
- Hardened response via a Content-Security-Policy meta tag (`object-src 'none'`,
  `base-uri 'self'`, `upgrade-insecure-requests`) plus a strict referrer policy.
- Production response headers will be applied through Cloudflare after the
  custom domain is configured.
- D1 migrations, request limits, server-side validation, Turnstile verification,
  and no-store API responses are included in the Worker foundation.
