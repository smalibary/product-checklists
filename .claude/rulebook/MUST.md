# Hard rules (loaded in every session)

Only Salem changes these. The agent may propose. Never more than seven.

| ID | Rule | Why | Since |
|---|---|---|---|
| **R-01** | `CLAUDE.md` only points to other files. It never holds rules, status, decisions or anything else that changes. Checked: it may not pass 20 lines. | A pointer file stays short and stays true. | 2026-10-04 |
| **R-02** | No file the agent maintains goes over **250 lines**. At 150 lines, plan the split. Past 250, split it by topic and leave a pointer. Checked on every edit. | Long files stop being read. | 2026-10-04 |
| **R-03** | Every update to this repo follows these rules. New rules go where `.claude/rulebook/INDEX.md` says, never into `CLAUDE.md`. | One rulebook, applied every time. | 2026-10-04 |
| **R-04** | **The board is the one place for status.** Any task that starts, finishes or gets stuck, and any version change, is written to the board in the same turn. At the start of every turn, read the board's new requests and answered questions first, mark each request seen, and reply to it on the board when done. | Salem kept asking "where are we in v2?" and got text buried between helpers. | 2026-10-04 |
| **R-05** | **Questions never hide in text.** Every decision Salem must make goes on the board as a question with 2 to 4 options (one Recommended), grouped in rounds he answers with one Send. His Send on the board wakes Claude directly; **never watch or poll the board** in between. | Questions got lost in long messages; he does not want to be monitored. |  2026-10-04 |
| **R-35** | **A closed list of components.** `DESIGN.md` is the component inventory: every screen uses only what it lists, and one job always uses the same component (for example one kind of overlay, never a popup here and a sheet there). A new component is added only when nothing in the list can do the job: first to `DESIGN.md` with a one-line reason, and Salem is told. The mockup builder warns when a screen uses an unlisted one. | Salem: "sometimes u use popup sometimes sheet, this should be systemized; we only create when really needed". | 2026-10-04 |
