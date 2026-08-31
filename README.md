# Janet Turns 60 — Jamaica 2027

An original luxury travel-inspired website for Janet’s 60th birthday
celebration at Dreams Rose Hall Resort & Spa in Montego Bay, June 17–21, 2027.
The site uses five static navigation tabs, validated Markdown content, supplied
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

## Experience structure

1. A full-screen island-inspired hero introduces Janet's celebration.
2. Editorial story sections establish the tone and week-long format.
3. Five static routes present the welcome, resort, pre-travel guidance, attire
   guidance, and room-block information.
4. Reservations and payment plans are handled externally by VIP Vacations.

## Local development

Requires Node.js 22.12 or later in the Node 22 release line.

```bash
npm ci
npm run dev      # start the dev server
npm run check    # Astro and TypeScript checks
npm run test     # unit tests
npm run build    # build the static site to dist/
npm run preview  # preview the production build
```

Client-controlled event content and feature flags live in
`src/config/event.ts`; visual tokens live in `src/config/theme.ts`.

Public itinerary, FAQ, and travel content lives in `src/content/`. Entries are
validated at build time and remain hidden while `draft: true`. Follow
[`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) to publish content and enable its
feature flag. Never store private event or guest information in Markdown.

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to GitHub Pages.

The site is served from its custom-domain root, so `astro.config.mjs` sets:

```js
site: "https://www.janetsislandbloom.com",
base: "/",
```

One-time repo setup: **Settings → Pages → Build and deployment → Source: GitHub Actions.**

The live URL is: `https://www.janetsislandbloom.com/`

## Security notes

- The deployed website is fully static and does not collect guest or payment
  information.
- Hardened response via a Content-Security-Policy meta tag (`object-src 'none'`,
  `base-uri 'self'`, `upgrade-insecure-requests`) plus a strict referrer policy.
- Production response headers will be applied through Cloudflare after the
  custom domain is configured.
- Reservations and payment plans are handled by VIP Vacations through the
  approved external booking process.
