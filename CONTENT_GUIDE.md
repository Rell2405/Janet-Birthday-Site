# Public Content Authoring Guide

The site uses validated Astro Markdown collections for public itinerary, FAQ,
and travel content. Markdown is compiled into static HTML during the build, so
content changes require a normal pull request and deployment.

## Security boundary

Everything in `src/content/` is public. It may appear in the repository, build
artifacts, page source, caches, or deployment history.

Never add:

- Private street addresses or entry codes
- Private contact information
- Guest names or RSVP responses
- Dietary information
- Invitation credentials
- Secrets or API keys

Invitation-only content belongs behind the Worker authorization boundary.
Organizer and RSVP data belongs in D1.

## Publishing workflow

1. Copy the draft example in the relevant collection.
2. Rename it with a numeric prefix and descriptive slug, such as
   `20-welcome-dinner.md`.
3. Replace all example content with client-approved public information.
4. Keep `visibility: public`.
5. Set `draft: false` when the entry is ready to display.
6. Enable the corresponding feature in `src/config/event.ts`.
7. Run `npm run check`, `npm run build`, and `npm run test:e2e`.
8. Submit the change for content-owner review.

Schema errors stop the build, preventing incomplete or malformed content from
being deployed.

## Itinerary

Location: `src/content/itinerary/`

```markdown
---
title: Welcome Dinner
summary: Join us for a relaxed start to the celebration.
date: "2026-05-23"
startTime: "18:30"
endTime: "21:00"
timeZone: America/Jamaica
locationLabel: Resort restaurant
category: meal
order: 20
visibility: public
draft: false
---

Resort-casual attire is recommended.
```

Rules:

- Quote `date` and use `YYYY-MM-DD`.
- Use 24-hour `HH:mm` values for times.
- Use an IANA timezone such as `America/Jamaica`.
- Allowed categories are `arrival`, `meal`, `activity`, `celebration`,
  `departure`, and `other`.
- Entries sort by date, start time, order, and title.

## FAQ

Location: `src/content/faq/`

```markdown
---
question: What should I wear?
category: attire
order: 20
visibility: public
draft: false
---

Resort-casual attire is recommended.
```

Allowed categories are `general`, `travel`, `venue`, `attire`, `gifts`,
`accessibility`, and `other`.

## Travel notes

Location: `src/content/travel/`

```markdown
---
title: Airport transportation
summary: General arrival guidance for guests.
category: transportation
order: 20
visibility: public
draft: false
---

Add the approved public guidance here.
```

Allowed categories are `transportation`, `lodging`, `packing`, `local`, and
`other`.

## Markdown policy

Use plain Markdown by default:

- Paragraphs
- Headings below the section title
- Emphasis
- Ordered and unordered lists
- Approved links

MDX and arbitrary embedded components are not enabled. If a future requirement
needs interactivity, implement and review it as an Astro or React component
rather than adding executable behavior to editorial content.

