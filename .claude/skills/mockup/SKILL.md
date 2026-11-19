---
name: mockup
description: Build an HTML mockup of screens for a big or complex screen decision, from the project's DESIGN.md, published as the mockup page (the second artifact) with inspect mode built in. If DESIGN.md does not exist yet, write it first through a design grill. Use when Salem asks for a mockup, wants to see options before a screen is built, or a task needs a hard screen decision.
---

# Mockup

The mockup page is the project's second artifact (the board is the first). It shows one decision at a time:
the screens or options side by side, the components, and the look. Salem points at anything with inspect mode
and it reaches Claude live, the same way the board's Send does.

## 1. DESIGN.md first
- Look for `DESIGN.md` in the project folder. **If it is missing, stop and tell Salem in one line:** "There is no
  design file yet, so I'll show you three directions first." Then write **three candidate design files** that
  differ in feel, layout and components, not only colour (Salem: "the 3 mocks should have different feels"):
  `DESIGN.md` for the recommended one and `.claude/mockups/look/B.DESIGN.md`, `C.DESIGN.md`, each from
  `design-template.md` in this folder. Mock the same two screens in each (topic `look`, every option starting
  with a `Design: <file>` line), then one board round: which direction, plus anything to mix in. The winner
  becomes `DESIGN.md`; the others stay as files. Save it (commit).
- DESIGN.md follows Google's format (github.com/google-labs-code/design.md): tokens in the front matter, then
  Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Tokens come in
  three tiers (primitives, roles, component tokens), as in `design-template.md`. Check it with
  `npx @google/design.md lint DESIGN.md` (run it from the project folder, never the home folder); fix errors and
  contrast warnings.
- If it exists, use it as it is. A new component the mockup needs is added to `DESIGN.md` only when nothing listed can do the job
  (R-35: closed component inventory, one job one component), never made up inside the mockup only. Change existing tokens only when Salem asks.

## 2. Write the topic file
`.claude/mockups/<topic>.md` (short topic name, like `booking-flow`):
- `# Title` of the decision in Salem's words, then one line: what he is deciding.
- `## Screens`, then one `###` per screen. For a decision, one `###` per option ("Option A: one long form",
  "Option B: three steps"), each with a one-line description and one ```html block built only from DESIGN.md's
  components and tokens. Real words from the project, never placeholder text. Give important parts a
  `data-name` so inspect mode can name them. 2 to 4 options, never more.

## 3. Build and publish
- `node .claude/skills/mockup/build.js .claude/mockups/<topic>.md` writes `.claude/mockups/<topic>.html`. Fix every warning, then
  look at it (a headless Chrome screenshot) before publishing.
- First time: publish it as a new artifact with capabilities `{db: {}, comments: {}}`, icon `design`, and add its
  address to `CLAUDE.md` as a pointer ("Mockup page: <address>"). After that: publish to the same address, so
  Salem keeps one link; older topics stay as files in `.claude/mockups/`.
- Save the work (commit), put a task on the board, and update the headline.

## 4. The decision goes on the board
Post one round on the board (grill skill): "Which option for <topic>?" with each option, one Recommended, and the
trade-off in one line each. Tell Salem in one line that the mockup and the question are ready, then stop.
Never poll the board or the mockup page.

## 5. Picks
A pick from the mockup page arrives as a message starting `# Screen pick`, with the element, its screen or option,
and Salem's note. Act on it (change the topic file or DESIGN.md, rebuild, republish), then mark it done.
Picks are also saved on the mockup page in its `picks` collection: at the start of a turn, read the ones with
status `new` and set them to `done` when handled.

## 6. After the decision
Write the decision into `.claude/grill/decisions.md` as one appended line (the grill skill's format; what was chosen and why, in Salem's words). The builder builds
the real screen from DESIGN.md's components; the mockup is a picture, never code to copy.
