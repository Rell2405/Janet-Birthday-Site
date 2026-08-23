# Birthday Site Client Intake

This checklist defines the information required to turn the reusable foundation
into a production birthday site. Do not place private event details or guest
data in this document if the repository remains public.

## Approval and schedule

- [ ] Client or event owner
- [ ] Final approval owner
- [ ] Target launch date
- [ ] Event date and local start/end times
- [ ] Event timezone
- [ ] RSVP deadline
- [ ] Date RSVP records should be deleted or anonymized

## Event identity and content

- [ ] Honoree's preferred name and spelling
- [ ] Event title and short description
- [ ] Theme or experience concept
- [ ] Welcome message
- [ ] Schedule
- [ ] Attire guidance
- [ ] Registry or gift guidance
- [ ] Frequently asked questions
- [ ] Public fallback contact method
- [ ] Required languages

## Venue and privacy classification

Classify every item as **public**, **invitation-only**, or **organizer-only**.

- [ ] Venue name
- [ ] Exact street address
- [ ] Parking or transportation instructions
- [ ] Building or gate access instructions
- [ ] Host contact information
- [ ] Guest list and RSVP information
- [ ] Photo-sharing permissions
- [ ] Decision on invitation credentials

Invitation-only information must be delivered by the Worker after authorization;
it must not be committed to this public repository or generated into static
assets.

## RSVP decisions

- [ ] Maximum total attendance
- [ ] Maximum party size per household
- [ ] Allowed attendance responses
- [ ] Required guest fields
- [ ] Whether dietary restrictions are collected
- [ ] Whether guest messages are collected
- [ ] Whether email or telephone information is genuinely required
- [ ] Whether guests may update a response
- [ ] Organizer export owners
- [ ] Alternate RSVP process during an outage
- [ ] Approved privacy notice

Default unless the client approves otherwise:

- No public guest list
- Household name, attendance, party size, dietary restrictions, and optional
  message only
- Guest updates use a private opaque token
- RSVP records are deleted 30 days after the event
- Organizer exports are protected with Cloudflare Access
- Production never reports browser-only storage as a successful RSVP

## Visual design and assets

- [ ] Preferred colors
- [ ] Typography preferences
- [ ] Inspiration links
- [ ] Logo, monogram, or event mark
- [ ] Hero and gallery photos
- [ ] Photo captions and alternative text
- [ ] Confirmation that supplied assets are owned or licensed for use
- [ ] Motion and audio preferences
- [ ] Accessibility accommodations

Provide original, high-resolution files where possible. Do not send private
assets through a public issue or commit.

## Optional capabilities

- [ ] Countdown
- [ ] Curated playlist
- [ ] Guest song suggestions
- [ ] Photo gallery
- [ ] Invitation-only details
- [ ] Organizer dashboard
- [ ] Privacy-conscious analytics
- [ ] Email confirmations
- [ ] SMS reminders

Optional capabilities require explicit approval and must not delay the core
event information and RSVP launch.

## Domain and accounts

- [ ] Candidate Namecheap domain
- [ ] Namecheap account owner and recovery owner
- [ ] Cloudflare account owner
- [ ] GitHub repository owner
- [ ] Domain auto-renewal and registrar lock enabled
- [ ] Production `www` and `api` hostnames approved

Credentials and recovery codes must be exchanged through an approved secure
channel, never through repository files or public project discussions.

## Acceptance criteria

- [ ] Content and spelling approved
- [ ] Mobile and desktop layouts approved
- [ ] Keyboard and screen-reader RSVP flow approved
- [ ] Reduced-motion behavior approved
- [ ] Social preview approved
- [ ] Privacy notice approved
- [ ] Test RSVP successfully created and updated in staging
- [ ] Organizer export successfully completed in staging
- [ ] Alternate RSVP method confirmed
- [ ] Custom-domain HTTPS and redirects confirmed
- [ ] Production data-retention date recorded

