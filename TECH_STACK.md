# Janet Birthday Site Technology Stack

## Document purpose

This document defines the approved target architecture and engineering standards
for the Janet Birthday Site. It is both a technology decision record and an
implementation guide. Items marked **Target** are approved but may not yet be
implemented in the repository.

- **Repository:** `Rell2405/Janet-Birthday-Site`
- **Current site:** `https://www.janetsislandbloom.com/`
- **Domain registrar:** Namecheap
- **DNS provider:** Cloudflare
- **Hosting:** GitHub Pages
- **Last reviewed:** 2026-08-22

## Executive architecture

The site uses a static-first frontend and a separately deployed RSVP API:

1. **Website:** Astro generates static HTML and assets. GitHub Actions deploys
   them to GitHub Pages.
2. **Public domain:** Namecheap is the domain registrar. Cloudflare manages
   authoritative DNS and proxies the website hostname to GitHub Pages so edge
   security controls can be applied.
3. **RSVP API:** A Cloudflare Worker runs on a separate API hostname, validates
   and rate-limits submissions, verifies Turnstile tokens, and stores RSVP data
   in Cloudflare D1.
4. **Optional music feature:** A curated playlist is the default. Interactive
   song search or guest submissions may be enabled later as a separately
   approved capability.

```text
Guest browser
  |-- https://www.janetsislandbloom.com --> Cloudflare DNS --> GitHub Pages
  |-- https://api.janetsislandbloom.com --> Cloudflare Worker --> D1
  |                                      |
  |                                      +--> Turnstile Siteverify
  |
  +-- optional approved playlist provider
```

The website domain is active. The API hostname remains reserved for the future
RSVP Worker deployment.

## Implementation status

| Capability | Status | Remaining production decision |
| --- | --- | --- |
| Static Astro frontend | Implemented | Client content and visual approval |
| Typed event and theme configuration | Implemented | Final event values and theme |
| Validated Markdown content collections | Implemented with client tab copy and event schedule | Final timing, location, and booking updates |
| Five-tab static navigation | Implemented | Final booking link and remaining event timing |
| Responsive event artwork | Implemented | Supplied event imagery and approved alt text |
| Feature flags | Implemented, disabled by default | Approved optional capabilities |
| Accessible RSVP form scaffold | Implemented, disabled by default | Client fields and production enablement |
| Worker API and validation | Implemented locally | Cloudflare account and production hostname |
| D1 schema and migration | Implemented locally | Staging and production database provisioning |
| Turnstile verification | Implemented with public local test keys | Production widget and secret provisioning |
| Rate limiting | Configured | Production thresholds and namespace confirmation |
| Type, unit, browser, accessibility, and build checks | Implemented | Branch-protection enforcement |
| GitHub Pages deployment | Implemented | Custom domain |
| Worker production deployment | Workflow scaffold implemented | Domain, D1 resources, secrets, and environment approval |
| Security response headers | Defined | Cloudflare zone and production CSP domains |

Client requirements are collected through [`CLIENT_INTAKE.md`](./CLIENT_INTAKE.md).
Production RSVP and invitation-only features remain disabled until the required
client and infrastructure decisions are complete.

Before RSVP is enabled, provision the staging and production D1 databases,
record their generated `database_id` values in `worker/wrangler.jsonc`, replace
all `example.com` placeholders, create the Turnstile widget, set its Worker
secret, and configure the `PUBLIC_API_BASE` and `PUBLIC_TURNSTILE_SITE_KEY`
GitHub Actions variables. Remote Worker deployment is intentionally incomplete
until those resources exist.

## 1. Static-first frontend

### Approved technologies

| Purpose | Technology | Policy |
| --- | --- | --- |
| Application framework | Astro 7 | Primary framework; static output |
| Editorial content | Astro Markdown content collections | Public itinerary, FAQ, and travel content |
| Interactive components | React | Use only for components that require browser state |
| Styling | Tailwind CSS 4 | Use through documented design tokens and reusable variants |
| UI primitives | Radix UI / shadcn-style components | Use accessible primitives rather than rebuilding controls |
| Type checking | TypeScript strict mode | Required for site and Worker code |
| Build tool | Vite through Astro | Managed as an Astro dependency |

The exact installed versions are recorded in `package-lock.json`. This document
records supported major versions and architectural intent rather than
duplicating every locked transitive version.

### Markdown content model

Public editorial content is stored as plain Markdown in validated Astro
build-time content collections:

| Collection | Purpose | Source |
| --- | --- | --- |
| `itinerary` | Chronological schedule and activity descriptions | `src/content/itinerary/` |
| `faq` | Frequently asked questions and public answers | `src/content/faq/` |
| `travel` | Public transportation, lodging, packing, and local guidance | `src/content/travel/` |

Frontmatter schemas enforce required titles, valid dates and times, IANA
timezones, bounded text, supported categories, display order, draft status, and
public visibility. Invalid content must fail type checking and the production
build.

Markdown is selected because it:

- Lets approved content be updated without editing UI components
- Keeps changes reviewable, versioned, and reversible in Git
- Produces static HTML without adding browser JavaScript or a paid CMS
- Allows schedule entries to be sorted and grouped from structured frontmatter
- Keeps presentation controlled by reusable Astro components
- Can later feed printable schedules, calendar exports, or reminder content

Plain Markdown is the default. MDX is not enabled because executable components
in editorial files increase complexity and review risk. Interactive
requirements should be implemented as reviewed Astro or React components.

All Markdown content is public. Invitation-only event details, guest data,
dietary information, personal contacts, access codes, and credentials are
prohibited from content collections and must remain behind the Worker/D1
boundary.

The authoring and publishing process is defined in
[`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md).

### Rendering policy

Event details, schedule, location guidance, attire, FAQs, registry information,
and contact instructions must render as static HTML. The site must remain useful
when JavaScript is unavailable or fails.

React islands are appropriate for:

- RSVP form state and confirmation
- Countdown
- Playlist controls
- Photo carousel
- Deliberate interactive effects

Islands must use the least eager Astro hydration directive that still provides
the intended experience. Decorative components must not delay core content or
form controls.

### Performance objectives

- Optimize for mobile devices and variable network quality.
- Target Lighthouse scores of at least 90 for performance, accessibility, and
  best practices on representative production pages.
- Avoid shipping JavaScript for static content.
- Define width and height for media to prevent layout shifts.
- Lazy-load below-the-fold media.
- Treat performance budgets as release criteria rather than optional cleanup.

## 2. Visual system, media, and motion

### Design system

Tailwind is the styling foundation. Theme values must be centralized rather
than repeated as arbitrary values throughout components.

The design system must define:

- Brand and semantic colors with accessible contrast
- Typography families, sizes, weights, and line heights
- Spacing and responsive breakpoints
- Borders, radii, elevation, and focus treatments
- Button, link, card, dialog, and form-control variants
- Motion durations and easing
- Error, warning, success, disabled, loading, and empty states

Reusable variants should use the existing component utilities where
appropriate. Visual consistency and accessibility take priority over one-off
effects.

### Images and fonts

- Keep local content images in `src/` and render them with Astro's `<Image />`
  or `<Picture />` components so they can be resized and optimized at build
  time.
- Use responsive image sizes and modern formats while retaining a compatible
  fallback.
- Reserve `public/` for assets that must be copied without transformation, such
  as favicons or explicitly pre-optimized files.
- Provide meaningful alternative text, or an empty `alt` value for decorative
  images.
- Self-host WOFF2 web fonts when licensing permits. Preload only fonts required
  for initial rendering.
- Generate the Open Graph image at build time from the same event-data source
  used by the website.

### Motion

Use CSS transitions for simple effects and **Motion** as the default component
animation library. GSAP is permitted only for complex sequences that cannot be
implemented clearly with CSS or Motion. Lenis or another custom smooth-scroll
implementation is optional and should be retained only when usability testing
shows a meaningful benefit.

All motion must:

- Honor `prefers-reduced-motion`
- Preserve keyboard and screen-reader operation
- Never block access to event details or RSVP controls
- Avoid unexpected audio or motion before a user gesture
- Remain usable on low-power mobile devices

## 3. RSVP capability: approved Option C

The approved RSVP model is a custom, branded form backed by a Cloudflare Worker
and D1. The backend is a required production dependency once the RSVP form is
enabled.

### RSVP responsibilities

The Worker will:

1. Accept only documented API routes and HTTP methods.
2. Enforce request content type and a small maximum request size.
3. Validate Turnstile before processing a submission.
4. Rate-limit submission and update routes.
5. Validate and normalize all fields on the server.
6. Write parameterized queries through the D1 binding.
7. Return a generic success or error response without exposing internals.
8. Avoid logging guest names, messages, contact details, or Turnstile tokens.

Suggested minimum RSVP fields:

| Field | Requirement |
| --- | --- |
| RSVP ID | Server-generated opaque identifier |
| Guest or household name | Required, length limited |
| Attendance status | Required, allowlisted value |
| Party size | Required, bounded integer |
| Dietary restrictions | Optional, length limited |
| Guest message | Optional, length limited |
| Created and updated timestamps | Server generated |

Email addresses and telephone numbers should not be collected unless an
approved guest-communication workflow requires them.

### Guest changes

If guests may update an RSVP, use an unguessable, revocable update token. Do not
expose sequential database identifiers. Security-sensitive identifiers must use
Web Crypto, such as `crypto.randomUUID()` or `crypto.getRandomValues()`, rather
than `Math.random()`.

### Production availability

Browser-only demo storage may be used during local development, but it must not
be presented as a successful production RSVP.

If the API is unavailable:

- Tell the guest that the RSVP could not be submitted.
- Preserve entered values for retry when practical.
- Provide an alternate contact method.
- Do not silently downgrade to `localStorage`.

## 4. Cloudflare D1 data layer

D1 replaces GitHub repository files as the RSVP datastore. The Worker accesses
D1 through a binding; browsers never connect directly to the database.

### Database standards

- Store schema migrations in version control.
- Use SQLite `STRICT` tables where compatible with the schema.
- Define primary keys, uniqueness constraints, foreign keys where needed, and
  indexes for actual lookup patterns.
- Use prepared statements with bound values for every guest-supplied value.
- Generate Worker binding types with `wrangler types`.
- Maintain separate development, staging, and production databases.
- Test migrations against local and staging databases before production.
- Document export, recovery, and post-event deletion procedures.
- Do not use D1 or rate limiting as a substitute for input authorization and
  validation.

### Administrative access

The public API must not expose a guest-list endpoint. Organizer access should
use a separate protected workflow, such as a Cloudflare Access-protected
administrative endpoint or an authenticated export process. Administrative
authorization must not rely on a hidden URL.

## 5. RSVP security controls

### Input and request controls

- Validate every field on the server using explicit allowlists, types, ranges,
  and maximum lengths.
- Use a shared TypeScript schema where it can safely keep client and server
  validation consistent. Client validation improves usability; server
  validation is authoritative.
- Reject unsupported methods and content types.
- Enforce a maximum body size before fully consuming a request.
- Encode all guest-provided content when displayed.
- Never render guest input as raw HTML.

### Bot and abuse protection

- Protect public write routes with Cloudflare Turnstile.
- Always verify Turnstile tokens through Siteverify on the Worker; the browser
  widget alone is not security.
- Treat tokens as short-lived and single-use.
- Add a Cloudflare Rate Limiting binding for RSVP writes and updates.
- Choose a rate-limit key that minimizes harm to legitimate guests sharing
  mobile networks or household connections.
- Return HTTP `429` for limited requests and provide a usable retry message.
- Monitor aggregate rejected-request counts without recording RSVP content.

### Origin and transport controls

- Allow only the exact production site origin and documented local-development
  origins through CORS.
- Do not use `Access-Control-Allow-Origin: *` for RSVP endpoints.
- Remember that CORS is not authentication and does not prevent direct API
  requests.
- Serve the site and API only over HTTPS.
- Return `Cache-Control: no-store` for RSVP submissions, lookups, and
  administrative responses.

### Secrets and errors

- Store Turnstile and other secrets with Wrangler secret management.
- Never place secrets in source, `wrangler.jsonc`, client environment
  variables, build output, or logs.
- Use structured internal errors and generic public responses.
- Do not silently swallow D1, Turnstile, or upstream failures.
- Configure secret rotation and emergency revocation procedures.

## 6. Public and invitation-only content

The team must classify every event field before launch.

| Classification | Examples | Delivery |
| --- | --- | --- |
| Public | Theme, general description, non-sensitive schedule | Static HTML |
| Invitation-only | Exact private address, access instructions, private contact details | Authorized API response |
| Private organizer data | Guest list, RSVP status, dietary notes, internal notes | Protected administrative access only |

An obscure URL is not access control. Sensitive event details must not be
embedded in generated HTML, source maps, JavaScript bundles, public JSON, image
metadata, or repository content.

If invitation-only details are required, the Worker should validate an
invitation credential before returning them. Invitation credentials must be
unguessable and revocable. The site must not reveal whether a specific person
is invited through distinguishable public errors.

## 7. Privacy and retention

The site will follow data minimization:

- Collect only information needed to plan the party.
- Explain what is collected and how it will be used near the RSVP form.
- Limit access to designated organizers.
- Do not sell or share RSVP information for advertising.
- Do not place personal information in analytics, traces, or error reports.
- Provide an organizer-supported process to correct or remove an RSVP.
- Define a deletion date before opening RSVPs.
- Delete or anonymize RSVP records after the event and its reconciliation
  period.
- Obtain appropriate permission before publishing identifiable guest photos.

The final retention interval is a product decision and must be recorded before
production RSVP collection begins.

## 8. Optional music and playlist capability

Music is optional and must not delay the core site or RSVP launch.

### Default recommendation

Embed a host-curated playlist using the provider's privacy-enhanced option when
available. Alternatively, collect a bounded text song suggestion with the RSVP
and require organizer approval before adding it to a playlist.

### Optional interactive search

Live YouTube search and playlist submission may be enabled only after approval
of:

- API key restrictions and secret storage
- Daily quota and failure behavior
- Server-side query validation and length limits
- Rate limiting
- Content moderation and organizer removal workflow
- Safe output encoding for third-party titles and thumbnails
- A CSP allowlist for the required provider domains
- A graceful experience when the provider is unavailable

The API key must remain in the Worker. It must never be exposed in browser code
or a public build variable.

## 9. Hosting, custom domains, and DNS

### Selected topology

GitHub Pages can be used with a Cloudflare D1 backend because D1 is accessed by
the Cloudflare Worker, not by GitHub Pages or browser code.

The domain will be purchased and retained at Namecheap. After purchase, the
domain will be added to Cloudflare and its Namecheap nameserver settings will be
changed to the authoritative nameservers assigned by Cloudflare. A registrar
transfer is not required.

Recommended hostnames:

| Hostname | Service | Purpose |
| --- | --- | --- |
| `www.janetsislandbloom.com` | GitHub Pages, with Cloudflare DNS | Static website |
| `api.janetsislandbloom.com` | Cloudflare Worker Custom Domain | RSVP API |
| `janetsislandbloom.com` | Redirect to `www.janetsislandbloom.com` | Canonical entry point |

### Domain configuration requirements

1. Enable Namecheap account multi-factor authentication, registrar lock,
   contact privacy, and automatic renewal. Store recovery information with the
   designated site owner.
2. Add the domain as a Cloudflare DNS zone and replace the Namecheap default
   nameservers with the exact nameservers assigned by Cloudflare.
3. Verify ownership of the domain with GitHub before attaching it to the
   repository.
4. Configure the custom domain in GitHub Pages before publishing its DNS record
   to reduce domain-takeover risk.
5. Point the website hostname at `Rell2405.github.io` as GitHub documents; do
   not include the repository name in the CNAME target.
6. Avoid wildcard DNS records.
7. Enable and verify HTTPS on GitHub Pages.
8. Proxy the production website hostname through Cloudflare when Cloudflare
   response-header or edge controls are required.
9. Configure `api.janetsislandbloom.com` as the Worker's Custom Domain. It must be a
   distinct hostname and cannot retain a conflicting CNAME record.
10. Set Astro's `site` to the canonical custom-domain URL and use `/` as the
   production base path after migration.
11. Configure the Worker CORS allowlist with the exact canonical origin.
12. Verify the GitHub Pages default URL redirects to the custom domain and do
    not advertise the fallback URL.

### Architectural boundary

GitHub Pages serves only static files. It cannot access D1 directly. All
database operations, Turnstile validation, secret use, and privileged logic
must remain in the Worker.

### Cost guardrails

The target operating model uses free and open-source software where practical.
At expected birthday-party traffic, the Namecheap domain is the only mandatory
paid item.

| Service | Initial policy | Upgrade trigger |
| --- | --- | --- |
| Namecheap domain | Paid annual registration | Required |
| GitHub Pages and standard Actions | Free public-repository usage | Private hosting or paid runner requirement |
| Cloudflare DNS, CDN, SSL, and Transform Rules | Free plan | Demonstrated need for advanced WAF or support |
| Workers | Free plan | Measured limit pressure or reliability requirement |
| D1 | Free plan | Measured reads, writes, or storage exceed included capacity |
| Turnstile | Free plan | Enterprise widget-management requirement |
| Cloudflare Access | Free organizer tier | Organizer count exceeds the free allowance |

Budget against the normal domain renewal price rather than a first-year
promotion. Paid Cloudflare upgrades, email, SMS, premium media, or analytics
require an approved requirement and cost review.

## 10. Reproducible development and builds

### Runtime policy

| Requirement | Policy |
| --- | --- |
| Node.js | Node 22, declared in `engines` and `.nvmrc` or `.node-version` |
| npm | Version compatible with the approved Node release |
| Lockfile | `package-lock.json` committed and reviewed |
| Clean install | `npm ci` for CI and documented reproducible setup |
| TypeScript | Strict configuration for frontend and Worker |
| Wrangler | Locked development dependency in the Worker workspace |

Use `npm install` only when intentionally changing dependencies. Dependabot or
Renovate should propose scheduled dependency and GitHub Actions updates.

### Required commands

The repository should expose stable scripts for:

```bash
npm ci
npm run dev
npm run check
npm run test
npm run build
npm run preview
```

The Worker workspace should expose corresponding development, type-check,
test, migration, and deployment commands.

### Configuration policy

- Commit safe defaults and examples.
- Keep local secrets in ignored development-secret files.
- Validate required public configuration during the build.
- Fail production builds when required API settings are absent.
- Do not use success-shaped configuration fallbacks in production.

## 11. CI/CD and operational controls

### Pull request checks

Every pull request must run:

1. Reproducible install with `npm ci`
2. Astro and TypeScript checks
3. Production build
4. Unit tests for validation and authorization logic
5. Browser tests for critical navigation and RSVP flows
6. Automated accessibility checks
7. Dependency and workflow security checks

### Deployment workflow

- Deploy the site to GitHub Pages only after required checks pass.
- Deploy the Worker through an automated, independently observable job.
- Apply D1 migrations as an explicit reviewed deployment step.
- Maintain separate staging and production Worker environments and D1
  databases.
- Require approval for the production environment where practical.
- Grant each job only the GitHub token permissions it needs.
- Pin third-party GitHub Actions to full commit SHAs and retain version comments
  for maintainability.
- Use a narrowly scoped Cloudflare API token unless a supported short-lived
  workload identity is configured.
- Protect workflow and infrastructure files with `CODEOWNERS`.
- Prevent overlapping production deployments with concurrency controls.

### Worker configuration

- Use `wrangler.jsonc` for new Worker configuration.
- Set a current `compatibility_date` when the Worker is created and review it
  periodically with tests before updating.
- Enable `nodejs_compat` only as required by the selected dependencies; document
  why it is enabled.
- Generate environment and binding types with `wrangler types`.
- Declare bindings separately for staging and production.
- Enable structured Workers logs and traces with an intentional sampling rate.
- Treat all promises explicitly: await them, return them, or pass non-critical
  post-response work to `ctx.waitUntil()`.
- Keep request-specific mutable state out of module scope.

### Recovery

Document how to:

- Roll back the static deployment
- Roll back the Worker
- Recover or export D1 data
- Revoke compromised secrets
- Disable RSVP writes without taking down event information
- Provide guests with an alternate RSVP method during an incident

## 12. Browser and API security headers

The production website hostname should be proxied through Cloudflare so
Response Header Transform Rules, or an equivalent reviewed edge configuration,
can add headers that GitHub Pages does not directly expose for repository
configuration.

### Website policy

At minimum, configure and test:

```text
Content-Security-Policy:
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'none';
  form-action 'self' https://api.janetsislandbloom.com;
  upgrade-insecure-requests

X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

The final CSP must also enumerate the exact script, frame, image, font, style,
and connection origins required by Turnstile and any approved playlist
provider. Avoid broad wildcards and remove allowances when integrations are
retired.

Use an HTTP response header for CSP in production. A CSP meta element may
provide defense in depth for static content, but directives such as
`frame-ancestors` are not effective when delivered through a meta element.

HSTS should be enabled only after HTTPS is confirmed across every included
hostname. Cache rules must distinguish immutable static assets from HTML.

### API policy

Worker responses must include:

- Explicit content types
- Exact-origin CORS headers only on approved routes
- `Vary: Origin` when responses vary by origin
- `Cache-Control: no-store` for RSVP and administrative data
- `X-Content-Type-Options: nosniff`

Preflight responses must allow only required methods and headers. API responses
must not include secrets, stack traces, database details, or guest information
outside an authorized operation.

## Accessibility and browser support

- Target current evergreen Chrome, Edge, Firefox, and Safari releases.
- Meet WCAG 2.2 AA for the RSVP journey and core event information.
- Support keyboard navigation, visible focus, semantic landmarks, appropriate
  labels, status announcements, and sufficient contrast.
- Test at common mobile viewport sizes and at 200% zoom.
- Do not rely on color, animation, hover, audio, or drag gestures as the only
  way to communicate or complete an action.

## Delivery phases

### Phase 1: frontend foundation

- Static Astro experience
- Validated Markdown collections for public itinerary, FAQ, and travel content
- Tailwind design tokens and reusable components
- Responsive optimized media
- Accessibility and reduced-motion compliance
- Reproducible CI checks
- Custom domain, HTTPS, and browser security headers
- Public versus invitation-only content classification

### Phase 2: RSVP service

- Worker project and environment configuration
- D1 schema and version-controlled migrations
- Server-side validation
- Turnstile and rate limiting
- Privacy notice and retention period
- Staging and production deployment
- Recovery and alternate RSVP procedure

### Phase 3: optional capabilities

- Curated playlist or approved song-request workflow
- Protected organizer export or dashboard
- Privacy-conscious analytics and operational alerts

## Approval status

The following decisions are approved for incorporation:

- Astro static-first frontend
- Tailwind-based documented visual system
- Minimal React islands
- Custom RSVP Option C
- Cloudflare Worker with D1
- Turnstile, rate limiting, server validation, and production-safe failures
- Public/invitation-only/private content classification
- Data-minimization and retention policy
- GitHub Pages with a Cloudflare-managed custom domain
- Separate Worker API custom domain
- Reproducible builds and hardened CI/CD
- Browser and API security headers

The music and playlist capability remains optional.

## References

- [Astro image guidance](https://docs.astro.build/en/guides/images/)
- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [Cloudflare Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Cloudflare Worker Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Cloudflare D1 Worker Binding API](https://developers.cloudflare.com/d1/worker-api/)
- [Cloudflare Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Cloudflare Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Response Header Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/)
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
