# Map template (`.claude/grill/maps/<topic>.md`)

A map is an index, not a store: each decision lives once, in `decisions.md`; the map gives a one-line gist and
the date to find it. Loaded once at the start of each session that works on this topic.

```markdown
# <Topic>

## End goal
<What reaching the end looks like: a plan ready to build, a decision locked, a change made. One or two lines.>

## Notes
<Standing preferences for this effort; skills or files every session should read first.>

## Decided
- <decision in a few words>: <answer gist> (decisions.md, YYYY-MM-DD)

## Open
| # | Question | Type | Waits on | Status |
|---|---|---|---|---|
| 1 | <a sharp question> | talk / research / prototype / task | <#s or "nothing"> | ready / taken (session date) / parked |

## Fog
<Things you can tell are coming but cannot phrase sharply yet. Loose notes are fine. When an answer makes one
sharp, move it to Open and delete it here.>

## Out of scope
- <work ruled beyond the end goal>: <why> (YYYY-MM-DD)
```

Rules
- An item is **ready** when everything it waits on is decided. Take ready items in order; run ready research items together.
- Mark an item taken (with the date) before working on it, so a parallel session skips it.
- After each answer: add it to Decided, close the item, add any new sharp questions, move sharpened fog to Open,
  and rewrite or remove items the answer made wrong.
- The map is finished when Open and Fog are empty: the way to the end goal is clear. Then build.
