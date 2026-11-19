# product-checklists: the idea (changed 2026-11-20)

## In Salem's words
"I want this app to be this artifact, delete all the rest, the recording of other sites etc when we started it!
I don't like that, I like this artifact!"

## What it is now
**Product Checklists**: one page with every checklist a product team needs, from the website and sign-up flow to
code, motion, growth, support and launch. 292 checklists in 14 groups, each item marked as a Rule (law or store
policy), Standard, Research or Practice, with a link to its source.

## What it does
- Overview of all groups, then each checklist with its sections and items.
- Search across every item; filter by backing (Rule, Standard, Research, Practice).
- Ticks per project, kept in the browser; "Copy as text"; an "All sources" view.
- Optional groups (code, growth, product, support, launch) are marked as needed only by some products.

## How it is made
- Each checklist is a short text file in `note/.src/<group>/`; sources live once in `note/.src/sources.txt`.
- One script builds the notes and the page's data file; the page is published as a claude.ai artifact.
- Every source link is checked before it is used.

## What was dropped (2026-11-20)
The first idea: a hidden-Chrome recorder that walked websites screen by screen and kept clips in a library.
Code, builds and recordings were deleted; the code's last version is kept as git tag `recorder-last`.

Renamed 2026-11-20 from agentscreen to product-checklists (Salem chose the name).
