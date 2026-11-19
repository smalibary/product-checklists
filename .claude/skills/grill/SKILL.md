---
name: grill
description: Decide what a request needs before doing it. Settles every decision it can from the record, from facts and from standards, and asks Salem only the real choices (no clear winner, his to make). Grows a map across sessions when work is big or foggy. Runs on every request through the always-on rule; also use when Salem says "grill me", or before long or overnight work.
---

> Built from Matt Pocock's `grilling`, `wayfinder` and `domain-modeling` skills (mattpocock/skills, MIT; see
> LICENSE-MATT-POCOCK). Changes: one skill instead of three; runs on every request; decides everything that has
> a clear answer and asks Salem only the real choices; keeps working without him (away mode); the map is a
> file in `.claude/grill/`, not GitHub issues; no fixed levels.

## 1. Sort the decisions (every time)
Map the request as a **design tree**: each decision branches into those that depend on it. The **frontier** is
every decision whose prerequisites are settled. Sort each frontier decision:

| Group | How to tell | What you do |
|---|---|---|
| Decided | In `decisions.md`, a map, preferences, lessons, the journal, CLAUDE.md, this chat | Use it; cite where |
| Fact | The project, its history, docs or the web can answer it | Look it up (a scout helper for anything slow) |
| Clear winner | A recognised standard or common practice; one option dominates; or cheap to undo and low stakes | Decide, log with reason and source, tell him in the reply |
| His call | No clear winner AND his to make: taste, money, priorities, people, public-facing, hard to undo | Ask (section 3) |

When Salem says he doesn't know, it usually isn't his call after all: research the standard (what the best
sources or most teams do), cite it, decide, log it as yours.
**Zero state:** no "his call" items means ask nothing and do the work.

## 2. Settled decisions push the frontier
Each answer unblocks the decisions under it. Re-sort the new frontier the same way. A question that depends on
another still-open one waits for a later round. Facts being fetched only hold up the questions downstream of them.

## 3. Asking (only his calls)
- A round = his calls on the frontier only, at most 5, each with 2 to 4 options, exactly one **Recommended**,
  each option one line: what it does and its trade-off. Plain words, glossary terms.
- Where: on the board's questions (works from his phone) when the project has a board; otherwise in the chat
  (the question tool when he is at the computer). Then stop and wait; do not poll.
- Never answer his side yourself while he is present. Never ask again what is already decided.

## 4. Away mode (overnight, "run this", "don't wait for me", or he is not answering)
- Never stop the whole job for him. Decide every group 1 to 3 item and keep going.
- His calls: write each to `.claude/grill/open.md` (and the board) with your recommended default, then:
  - **Cheap to undo:** take the recommended default, log it as `assumed`, keep working.
  - **Hard to undo, money, public, other people:** stay parked; do every piece of work that does not depend on it.
- A later session answers from the record (decisions, preferences, lessons, journal, earlier maps) before
  thinking of asking; that reading is the first step of every session.
- When he returns, the reply leads with: what was assumed (one line each, easy to overturn), what still waits on him.

## 5. When the work outgrows one session: the map
No switch, no ceremony: as soon as the work clearly needs more than this session, or the frontier is mostly fog,
start `.claude/grill/maps/<topic>.md` from [MAP.md](MAP.md). Each open item has a type:
**talk** (his call, asked as in section 3), **research** (a scout, findings to `.claude/grill/research/`; run all
ready research items together), **prototype** (a builder makes a rough thing for him to react to), **task**
(work that must happen before a decision, e.g. signing up for a service). Fog that can't be phrased sharply yet
stays in the map's fog list until an answer makes it sharp. Work beyond the end goal goes to "out of scope".

## 6. Files (must be updated before the turn ends)
All in `.claude/grill/` (CLAUDE.md stays the only agent file in the project root):
- `decisions.md`: one line per decision, never edited, only appended:
  `YYYY-MM-DD | question | answer | by: Salem / auto (reason) / assumed | source`
  A changed answer gets a new line that says what it replaces.
- `open.md`: his calls still waiting, each with the recommended default and what is blocked.
- `maps/<topic>.md`: section 5. Update Decided / Open / Fog after every answer.
- `why/NNNN-<topic>.md`: a short note (context, choice, why, what it rules out) only for big, hard-to-undo choices.
- New project words go into the glossary that CLAUDE.md points to.
- If the project has a board: answered questions closed, decisions turned into tasks.

## 6a. Apply to the plan (same turn, not later)
Every decision that changes what the app does lands in `.claude/docs/epics/` (layout: its README):
- A new area: a new epic folder with `EPIC.md`. A new thing a person can do: a feature folder with `FEATURE.md`.
- Each feature gets 2 to 5 stories, one file each: the normal case plus the awkward and failure ones. Write them
  from the decisions; a story detail that is his call (wording he will see, what counts as good enough) goes in
  the round like any other question, the rest you decide.
- A changed decision: update the epic, feature and stories it touches; a story that changed goes back to ○.
- A dropped item: ⏸ with the decision date, never deleted.
- Then update the count table in the README and, if there is a board, the epic's features on it.

## 7. Finish
- Done when the frontier is empty (or only parked items remain in away mode) and the plan (6a) matches the decisions.
- Reply: what you decided yourself (one line each, so he can overturn), what he decided, what waits on him,
  and the next 3 steps. For a big plan, end with a one-question round: a 7-line summary,
  "That's right (Recommended)" / "Change something".
