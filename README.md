# Janet Turns 60 — Jamaica 2027

An original luxury travel-inspired website for Janet’s 60th birthday
celebration at Dreams Rose Hall Resort & Spa in Montego Bay, June 17–21, 2027.
The site uses four static navigation tabs, validated Markdown content, supplied
event artwork, immersive editorial layouts, and responsive accessible
presentation.

## Tech stack

| Purpose            | Tech                                   |
| ------------------ | -------------------------------------- |
| Framework          | [Astro](https://astro.build) (static)  |
| Interactivity      | [React](https://react.dev) islands     |
| Styling            | [Tailwind CSS v4](https://tailwindcss.com) |
| Components          | [shadcn/ui](https://ui.shadcn.com) primitives |
| Motion             | CSS transitions and reduced-motion-safe reveals |
| Smooth scrolling   | [Lenis](https://lenis.darkroom.engineering) |
| Public content     | Validated Astro Markdown content collections |
| RSVP API foundation | Cloudflare Worker + D1 + Turnstile |

## Experience structure

1. A full-screen island-inspired hero introduces Janet's celebration.
2. Editorial story sections establish the tone and week-long format.
3. Four static routes present the welcome, resort, attire guidance, and
   room-block information.
4. The RSVP foundation remains feature-gated until production infrastructure
   and final client requirements are approved.

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
