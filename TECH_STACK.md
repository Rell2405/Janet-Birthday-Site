# Janet's Island in Bloom Technology Stack

## Purpose

This document defines the production architecture and engineering standards for
the Janet Turns 60 birthday website. The site is intentionally static: it
publishes event, resort, attire, booking, and travel guidance but does not
collect guest information or process reservations.

- **Repository:** `Rell2405/Janet-Birthday-Site`
- **Live site:** https://www.janetsislandbloom.com/
- **Domain registrar:** Namecheap
- **DNS and edge security:** Cloudflare
- **Hosting:** GitHub Pages
- **Last reviewed:** 2026-08-30

## Architecture

```text
Guest browser
  |
  v
Cloudflare DNS, proxy, TLS, DNSSEC, and security headers
  |
  v
GitHub Pages static site
  |
  +--> VIP Vacations group booking (external link when available)
  +--> WhatsApp community (external invite)
  +--> Dreams Rose Hall website (external link)
```

There is no application backend, server-side runtime, RSVP database, or payment
processing. VIP Vacations owns the reservation workflow and related guest data.

## Frontend stack

| Purpose | Technology | Policy |
| --- | --- | --- |
| Application framework | Astro 7 | Static output |
| Interactive islands | React | Use only when browser state is necessary |
| Styling | Tailwind CSS 4 | Centralized tokens and reusable variants |
| Type checking | TypeScript strict mode | Required |
| Build tool | Vite through Astro | Managed by Astro |
| Public editorial content | Astro Markdown content collections | Validated at build time |
| Browser testing | Playwright | Desktop and mobile routes |
| Accessibility testing | axe-core with Playwright | Block serious and critical violations |
| Unit testing | Vitest | Configuration and content helpers |

Exact resolved versions live in `package-lock.json`. This document records
architectural intent rather than duplicating lockfile data.

## Site pages

The site has five static pages:

1. Welcome
2. The Resort
3. Birthday Weekend
4. Book Your Stay
5. Things to Know, Before You Go

Navigation paths and labels are defined in `src/config/navigation.ts`. Event
identity and optional feature flags live in `src/config/event.ts`.

## Markdown content

Public editorial content uses validated build-time collections:

| Collection | Purpose | Source |
| --- | --- | --- |
| `tabPages` | Five navigation pages | `src/content/tabs/` |
| `itinerary` | Structured event schedule source | `src/content/itinerary/` |
| `faq` | Optional public FAQs | `src/content/faq/` |
| `travel` | Optional public travel notes | `src/content/travel/` |

Schemas validate titles, dates, times, IANA timezones, categories, display
order, draft status, and public visibility. Invalid content fails the build.

All Markdown is public. Never commit:

- Guest names or responses
- Booking records
- Private contact information
- Access codes
- Credentials or API keys
- Sensitive medical or travel information

Booking data belongs with VIP Vacations. Group-only updates belong in the
WhatsApp community or another approved private channel.

Authoring instructions are in [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md).

## Visual system

Tailwind theme values are centralized in `src/config/theme.ts`. The visual
system defines:

- Brand and semantic colors with accessible contrast
- Display and body typography
- Spacing and responsive breakpoints
- Borders, radii, shadows, and focus treatments
- Loading, hover, focus, and reduced-motion behavior

Local images are stored in `src/assets/` and rendered through Astro image
components for responsive sizing and build-time optimization. Supplied assets
must be owned or licensed for website use.

CSS handles simple transitions and reveal effects. Lenis provides optional
smooth scrolling and disables itself when `prefers-reduced-motion` is enabled.

## Booking model

The Book Your Stay page is informational. Room selection details expand on
hover or keyboard focus and display directly on touch devices.

The designated booking process is:

1. The guest follows the official group booking link.
2. VIP Vacations collects reservation and payment information.
3. VIP Vacations manages payment plans and booking support.
4. Website content explains that group events require booking through the
   designated room block.

`[BOOK YOUR STAY HERE]` remains a non-clickable placeholder until the official
VIP Vacations URL is approved. The website must not collect reservation,
payment, passport, health, or guest-list data.

## External services

| Service | Purpose | Data consideration |
| --- | --- | --- |
| GitHub Pages | Static hosting | Public site content |
| Cloudflare | DNS, proxy, TLS, DNSSEC, security headers | Standard request metadata |
| Namecheap | Domain registration | Account and registrant data |
| VIP Vacations | Group reservations and payments | Guest booking data |
| WhatsApp | Group updates | Public community invite currently published |
| Dreams Rose Hall | Resort information | External public website |

External links must be reviewed before launch and checked periodically. The
WhatsApp invite is publicly discoverable and should be rotated if abused.

## Development requirements

| Requirement | Policy |
| --- | --- |
| Node.js | Node 22, declared in `engines` and `.nvmrc` |
| npm | Version compatible with the approved Node release |
| Lockfile | `package-lock.json` committed and reviewed |
| Clean install | `npm ci` |
| TypeScript | Strict Astro configuration |

Use `npm install` only when intentionally changing dependencies.

```bash
npm ci
npm run dev
npm run check
npm run test:unit
npm run build
npm run test:e2e
npm run preview
```

## CI/CD

Pull requests run:

1. Reproducible dependency installation
2. Astro and TypeScript checks
3. Unit tests
4. Production build
5. Desktop and mobile browser tests
6. Automated accessibility checks
7. CodeQL analysis

GitHub Actions are pinned to full commit SHAs. `main` requires pull requests,
current passing `verify` and CodeQL checks, resolved conversations, and admin
enforcement. Force pushes and branch deletion are disabled.

Pushes to `main` deploy the static `dist/` artifact through GitHub Pages.

## Domain and hosting

| Hostname | Purpose |
| --- | --- |
| `www.janetsislandbloom.com` | Canonical website |
| `janetsislandbloom.com` | Redirects to canonical `www` hostname |

Production controls:

- Namecheap registrar lock and account MFA
- Cloudflare authoritative nameservers
- Cloudflare proxy enabled for website records
- DNSSEC enabled and validated
- Cloudflare SSL mode set to Full (strict)
- GitHub Pages HTTPS enforced
- Apex and legacy GitHub.io redirects to the canonical hostname
- Route-specific canonical URLs

`astro.config.mjs` uses:

```js
site: "https://www.janetsislandbloom.com",
base: "/",
```

## Browser security

Cloudflare Response Header Transform Rules apply:

```text
Content-Security-Policy:
  default-src 'self';
  img-src 'self' data:;
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  script-src 'self' 'unsafe-inline';
  connect-src 'self';
  frame-src 'self';
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests

X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
X-Frame-Options: DENY
```

Review CSP whenever an external integration changes. Avoid adding broad
wildcards.

## Privacy

The website is public, including event dates, resort information, images, and
the WhatsApp community invite. Search-engine controls can reduce discovery but
are not access control.

The website must not collect personal information. VIP Vacations and WhatsApp
operate under their own privacy terms. Remove or rotate public invitation links
if abuse occurs.

## Accessibility and performance

- Target WCAG 2.2 AA.
- Support keyboard navigation, visible focus, semantic headings, and 200% zoom.
- Honor reduced-motion preferences.
- Test current evergreen Chrome, Edge, Firefox, and Safari.
- Optimize local images at build time.
- Keep core content available as static HTML.
- Target Lighthouse scores of at least 90 for performance, accessibility, and
  best practices.

## Cost model

Expected birthday-party traffic should remain within free tiers for GitHub
Pages and Cloudflare. The recurring mandatory cost is the Namecheap domain
renewal. Paid services require a documented requirement and approval.

## Remaining launch decisions

- Replace `[BOOK YOUR STAY HERE]` with the official VIP Vacations URL.
- Confirm final event times and locations.
- Confirm whether public search indexing is desired.
- Confirm rights for all portrait, attire, and resort imagery.
- Decide whether to retain or rotate the public WhatsApp invite.

## References

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro image guidance](https://docs.astro.build/en/guides/images/)
- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [Cloudflare DNS](https://developers.cloudflare.com/dns/)
- [Cloudflare Response Header Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/)
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
