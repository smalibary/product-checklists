# How the rules work

## Grades

| Grade | What it obliges | Who changes it |
|---|---|---|
| **MUST** | A hard line. Breaking one means stop and fix. | Only Salem. The agent may propose. |
| **SHOULD** | The default. Break it only with a one-line written reason. | The agent, telling Salem in one line. |
| **MAY** | Taste. Never a failure. | Anyone. |

## Where a rule goes

| The rule is… | It goes in | Loaded |
|---|---|---|
| A MUST that applies everywhere (max seven) | `.claude/rulebook/MUST.md` | Every session |
| About one area (git, docs, scripts…) | `.claude/rules/<topic>.md` with `paths:` for the files it governs | Only when those files are touched |
| About one area, but needed everywhere | `.claude/rules/<topic>.md` with no `paths:` | Every session; keep these few |
| Checkable by a machine | Also add `.claude/rulebook/checks/R-NN-slug.js` | Runs after every edit |
| Retired | Move its row to `.claude/rulebook/retired.md` with date and why | Never |

## Adding a rule

1. Take the next free ID. IDs are never reused. Last used: **R-45**.
2. Add one row to the right file. Topic files keep the table `| ID | Grade | Rule | Why | Since |`.
3. A new topic gets a new file only once it has at least three rules. Until then, use the closest topic.
4. If it can be checked mechanically, add a check (copy an existing one in `.claude/rulebook/checks/`).
5. Update "Last used" above.

## Why this layout

Tested 2026-10-04 with 150 rules and 42 headless Claude runs across four layouts: one file per rule,
one big file, one folder per rule, and this one (always-on hard rules + topic files that load by path
+ one checker). All four mostly obeyed the rules; this layout was cheapest (about $0.10 per task, against $0.13 to $0.17
for the others), fastest (about 29 s, against 30 to 49 s) and read the fewest files. It also stays under the 250-line cap
at any size. The full write-up lives in `.claude/rulebook/layout-test-2026-10-04.md`.
