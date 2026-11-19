# Rules layout test, 2026-10-04

**Question:** at 150+ rules, which layout keeps Claude obeying the rules, cheaply, without files growing past 250 lines?

## Setup

- The same 150 rules (10 topics × 15, graded MUST/SHOULD/MAY) were built into four layouts, one Termi worktree each.
- Six of the rules were planted so a script could score them: a date line on notes, a purpose header on scripts,
  lowercase-hyphen file names, decisions appended to one log, an owner line on docs, and no "TODO".
- Six everyday tasks, none mentioning the rules, each run by a fresh headless Claude (Sonnet) in a clean copy.
- Layouts with an automatic checker were also run with the checker switched off, to test finding the rules unaided.
- 42 runs in total.

## Layouts

| | Layout | Files for 150 rules | Largest file |
|---|---|---|---|
| A | One file per rule, each with its own check script | 162 files | small |
| B | One big graded file (the old `RULES.md`) | 1 file | 168 lines, breaks the cap at about 230 rules |
| C | One folder per rule, grouped by topic | 154 folders | small |
| D | Hard rules always loaded, topic files that load by path, one checker | 10 topic files + 1 | about 22 lines per topic |

## Results (6 tasks each)

| Setup | Obeyed | Avg cost | Avg time | File reads |
|---|---|---|---|---|
| A, with checker | 6/6 | $0.171 | 49 s | 52 |
| A, no checker | 5/6 | $0.142 | 48 s | 37 |
| B | 6/6 | $0.128 | 30 s | 15 |
| C, with checker | 6/6 | $0.170 | 46 s | 52 |
| C, no checker | 6/6 | $0.154 | 40 s | 41 |
| **D, with checker** | **6/6** | **$0.104** | **29 s** | **9** |
| D, no checker | 6/6 | $0.117 | 25 s | 12 |

## What it showed

- **Obeying:** all layouts are close at 150 rules. The only miss was A without its checker: Claude wrote "TODO".
- **Cost and speed:** A and C make Claude search through 150+ files on every task, so they cost about 65% more and
  take about 60% longer. One file per rule makes rules easy to *write* and slow to *use*.
- **B works now but has a ceiling:** at about 230 rules it breaks the 250-line rule, and every task reads all of it.
- **D's topic files really do load on their own:** a session that touched `notes/` reported the notes rules
  "loaded" without being told where they were.
- **The checker works:** a forced break (bad name, no date, "TODO") was caught and all three failures were
  reported back to Claude. Hook output was not captured in the batch log, so the catch counts were not reliable there.
  The checker only reports after a file is written. It cannot stop the write.

## Caveats

- Probes were simple, and the global `~/.claude/CLAUDE.md` loaded in every run. Results compare layouts; they are not
  absolute.
- The A, C and D copies still held the old 48-line `RULES.md` as noise. It did not appear to matter.
- One run per task per setup: the cost and time gaps are clear, but the obeyed scores are too close to rank.
