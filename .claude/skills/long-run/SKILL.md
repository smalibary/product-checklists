---
name: long-run
description: Work through the board's tasks on its own for hours, within a limit Salem sets (time and/or weekly usage), then stop cleanly with a summary. Use when Salem says "keep working", "work while I sleep", "long run", "for 8 hours" or similar.
---

# Long run

## 1. Start (needs Salem's limit, never guess it)
- He must give a limit: a time ("8 hours", "until 7 am") and/or a weekly usage line ("stop when the weekly bar
  shows 95%"). If his words are unclear (for example "15%"), ask once, as one question with options, on the board
  or in chat if he is here. No limit, no run.
- Write `.claude/state/long-run.json`: `{"startedAt", "stopAt" (ISO or null), "weekStopAt" (number or null),
  "branch": "long-run-YYYYMMDD-HHMM", "done": [], "waiting": []}`.
- Create the branch with Termi's worktree create action (based on `main`); all work of this run happens there.
- Board headline: "Long run until <limit>: working through v<N>." Then start the loop: run the `loop` skill
  with no interval and the prompt `/long-run tick`, so each step schedules the next.

## 2. Each tick (one task per tick, then schedule the next)
1. `node .claude/skills/long-run/gate.js`. On `STOP: ...` go to section 3.
2. Read the board: answered questions that unblock a task (set it back to `next`), and new requests (mark seen,
   turn into tasks or answer).
3. Pick the next task: lowest version `order`, status `next` (never `idea`, `blocked` or `done`), then by task id.
   None left: go to section 3 with "all tasks done".
4. If the task needs a decision only Salem can make: post it as a round on the board (round = the task's title,
   2 to 4 options, one Recommended), set the task to `blocked` with "waiting for your answer", add it to
   `waiting`, and schedule the next tick. Never decide for him; never stop the run for a question.
5. Otherwise do it in the run's worktree: a builder helper for anything non-trivial, verified the cheapest way that
   proves it, committed there with a plain message. A failed check: one fix attempt; still failing, mark it
   `blocked` with what failed, log a lesson, move on.
6. Update the board in one batch: the task (`done`, with one line of what changed), the headline (N of M done),
   and now.md's Status line. Add the task to `done`.
7. Schedule the next tick about 60 seconds out.

## 3. Stop
- Set `stopped` in long-run.json (the reason). Merge the run's branch into `main` from the main folder if every
  task on it passed its check; otherwise leave it unmerged and say so. Remove the worktree (R-12).
- Install the final build where Salem uses it (his phone, or open the site) when reachable, else say so, and post a
  short **"What to test"** list on the board: each change in one line, where to find it, what should happen
  (DOLABI 2026-11-13: "what did you build when i was sleeping").
- Board summary (meta/now summary, max 5 lines): why it stopped, tasks done, questions waiting for him, what is
  next. Journal entry. Then end the loop (schedule no further tick).
