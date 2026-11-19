# E1 Best version: audit a recorded flow and show it done right, in the app's own style

**Goal (Salem, 2026-11-19):** record a real sign-up (example: Dribbble), grade it against the checked list
(`.claude/docs/checklists/sign-up.md`) saying what is missing and why, and show a working sign-up that meets every
item, built with ui-sdk and dressed in the recorded app's look. Not just capturing like Mobbin: the best practice
of the same page. Decisions: `.claude/grill/decisions.md` (rows "Best version", 2026-11-19).

| # | Feature | What it does | Status |
|---|---|---|---|
| E1.1 | Phone-size sign-up recording | Records a sign-up at phone size, start to welcome screen: fills each field with test details, triggers each error on purpose (empty, wrong email, weak password), then signs up for real with a test inbox and reads the code from it. Stops and says so at a robot check, never gets around it | ◐ built; on Dribbble a robot check appears after the email, so the recording stops there |
| E1.2 | Test inbox | One throwaway email address per site, from a mail service with a usage limit written in services.md first (L-1); the recorder reads the code or link from it | ● built (mail.tm, capped 20 a day) |
| E1.3 | Automatic audit | Judges every "Seen" item from what was measured (keyboard type, labels, sizes, button states, errors, code boxes, right-to-left); each verdict met / missing / partly met with the step picture as proof and the item's "why" | ○ |
| E1.4 | Claude's audit | In a session, Claude judges the items left over from the pictures and clips, and writes the plain-words summary | ○ |
| E1.5 | Best-version sign-up | A working sign-up built with ui-sdk on shadcn that meets every item: all screens (ways in, form, errors, code, welcome) really work in the page, with fake sending | ○ |
| E1.6 | Their style | The recorded app's colours, font, corners and spacing, taken from its component cards, applied to the best version as tokens; switch between their style and plain ui-sdk | ○ |
| E1.7 | Side by side | In the library: real flow left, best version right, the audit below with each item's verdict, backing and source link | ○ |
