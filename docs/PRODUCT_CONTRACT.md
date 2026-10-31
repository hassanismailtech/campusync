# CampusSync product contract

CampusSync turns a user-supplied LASUCOM flyer or broadcast into reviewable, calendar-ready actions. Students and class representatives are the users; LASUCOM is the prospective institutional owner, not an asserted partner or endorser.

## Outcome and workflow

The outcome is fewer missed academic deadlines—not a larger announcement feed.

`Capture → extract → review evidence → verify locally → filter → calendar`

The Mirror Principle governs every surface: CampusSync never creates news. Each extracted action must retain a short source excerpt, a confidence level, ambiguity notes, and an explicit unverified state. Local verification means the user checked the source; it never represents institutional verification.

## Scope

This hackathon build supports browser-local text and flyer capture, clearly labelled fictional samples, local filtering, revision display, and calendar export in Africa/Lagos time.

It does not include authentication, accounts, an admin portal, WhatsApp scraping, payments, server-side notice storage, healthcare advice, or any claim of official LASUCOM data.

## Data boundary

Raw text and file previews are transient in the browser. Structured actions and evidence excerpts may be retained locally on the device. A future Gemma 4 provider is server-side only and must not receive sensitive or patient data.
