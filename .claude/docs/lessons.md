# Lessons

| Date | What happened | Fix lives in |
|---|---|---|
| 2026-10-04 | A backend's monthly allowance was used up in a few days | `.claude/rules/service-limits.md` + `.claude/docs/services.md` |
| 2026-10-04 | A search printed a secret key | safety step (`.claude/hooks/guard.js`) |
| 2026-10-04 | A checker closed every Chrome window by name | safety step (`.claude/hooks/guard.js`) |
| 2026-10-04 | Instructions were lost across many compactions | memory step (`.claude/hooks/memory.js`) |
| 2026-10-04 | Saved words filled up with pasted reports | memory step strips pasted text |
| 2026-10-04 | "Where are we in v2" was answered with an offer to grill | the board (R-04) |
| 2026-10-04 | A helper stalled on a board permission | only the main session writes the board (R-23) |
| 2026-10-04 | A request on the board was missed | reminder at each message (memory step) |
| 2026-10-04 | Two helpers sat finished for 90 minutes unnoticed | helper watcher (R-40) |
| 2026-10-04 | Send on the board did not reach Claude | comments capability: Send wakes the session |
| 2026-10-04 | Work landed with no task moving | the task check (`.claude/hooks/board-check.js`) |
| 2026-11-19 | Clicks stopped reaching the page after the same hidden tab moved to another website | one hidden tab per website (`.claude/docs/idea.md`, first test) |
| 2026-11-19 | The first test was run in the lab folder while Salem watched the project folder, which looked empty | work in the project folder (now.md, "Salem said to remember") |
| 2026-11-19 | google.com: 7 steps, all from the start page, no search typed, mic refused; Salem: "this simple main 2 pages couldnt do it correctly" | the explorer goes screen by screen and types searches (`core/src/recorder.rs`) |
- 2026-11-20 | Unticking 404 item 1 made the page jump: the broken headline was 59px shorter and the rail row 18px taller (Salem: "it jump fix that"). Fix: good and broken versions stacked in one spot so height never changes; checked by measuring before/after. Lives in the shared checklist layer.
- 2026-11-20 | Builder's preview server (port 4173) and mine (4417) kept web/out locked, so builds failed with EBUSY; fix: next.config EXPORT_DIR switch, and builders stop their servers before finishing (brief).
- 2026-11-20 | Stopping 'npx serve' as a background task left its node children running (3 pairs on port 4417, about 600 MB) and the builder's browser test died for low memory; fix: run serve with node directly (not npx) or a small node server, and check for leftovers after stopping.
- 2026-11-20 | The builder ran its modal test in the background, waited on it and stalled for 10 minutes (watchdog); fix: briefs say run tests in the foreground with a timeout under 4 minutes.
