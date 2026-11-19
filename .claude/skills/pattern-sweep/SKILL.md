---
name: pattern-sweep
description: Weekly sweep of what went wrong. Reads the lessons, journal, failing checks and helper reports, groups repeated mistakes into patterns, proposes the strongest fix for each (automatic check, then rule, then lesson) and puts the proposals on the board as a question round. Use when the hook says "Pattern sweep due", when Salem says "pattern sweep" or "what keeps going wrong", or after a bad week.
---

# Pattern sweep

Closing the loop: record what failed, judge it, group the failures into patterns, turn each pattern into a fix.
Lessons (R-25) are the recording. This skill is the grouping and the fixing, once a week. It never changes a MUST
rule (`.claude/rulebook/MUST.md`): those are Salem's alone, so a MUST change goes to him as a proposal, nothing more.

Run it after the current task, not in the middle of one. The hook (`.claude/hooks/memory.js`) says when it is due:
the last report in `.claude/docs/sweeps/` is older than 7 days. A sweep needs no helper for a small project; for a big one,
a hidden scout (R-22) can do step 1 and 2 while the main session waits.

## 1. Gather (read only, nothing is changed yet)
- `.claude/docs/lessons.md`: every row. Note date, what happened, where the fix lives.
- `.claude/docs/services.md`: check real usage of each service against its pace line (rule L-7) and add a usage
  row. Any service over pace is a pattern of its own, with its cause.
- `.claude/docs/journal/`: the entries since the last sweep (read the newest report in `.claude/docs/sweeps/` for its date; with
  none, the last 4 weeks). The "Gaps" lines are failures too.
- Failing check output: run the checks once on the project (the commands in `.claude/docs/checking.md`, and a pass over
  `.claude/rulebook/checks/` as `.claude/hooks/run-checks.js` does) and note anything that fails or is skipped.
- Helper reports where they are saved (`.termi/` briefs and reports, `.claude/state/now.md`, the board's finished
  tasks and their one-line notes). Recent git history too: `git log --since=<last sweep> --oneline`, looking for
  "Fix", "again", "revert", "restore" in the subjects.
- The app's own recorded failures (E9.7): read last week's rows of `app_failures` in the Supabase dashboard SQL editor
  (we alone can read it; it holds no message text or names). A failure repeated 3 or more times, or on 2 or more
  people, is a pattern: name it "screen + step", count it, quote its error, and propose a fix like any other.
  ```sql
  select screen, step, error, app_version, count(*) as times, count(distinct user_id) as people,
         min(created_at)::date as first_seen, max(created_at)::date as last_seen
  from app_failures where created_at > now() - interval '7 days'
  group by screen, step, error, app_version order by times desc limit 30;
  ```
  No access to the database (a helper)? Say so in the report; never invent a count.
- Salem's own frustration words in `.claude/state/words.md` ("it didnt reach you", "r they still working"): each is
  a failure the system let through, whether or not a lesson was written.
- The previous sweep report, to see which proposals were answered and whether the fixes held (step 5).

## 2. Group into patterns
- A pattern is the same kind of mistake at least twice (or once, if it cost a lot or Salem noticed it).
  Group by cause, not by symptom: "tests read the live demo" and "a count included another session's rows" are one
  pattern, "shared database".
- Each pattern gets: a short name in plain words, a **count** (how many lessons or events), the **dates**, one or
  two **examples** quoted in a line each, and its **current fix** (what already exists and whether it held).
- Count honestly. A mistake not written in the lessons has no count: list it as "reported, not recorded" and
  propose a lesson row, never invent a number or a date.
- Sort by cost: how often, how long it took to find, whether Salem had to step in. Keep the top 5 to 7 patterns;
  the rest go in one line each under "Watching".

## 3. Judge each pattern: the strongest fix
Per R-25 the order is: an **automatic check** (`.claude/rulebook/checks/R-NN-slug.js`, or a guard in `.claude/hooks/guard.js`,
a lint rule, a script) beats a **rule** (a row in a topic file) beats a **lesson** (one line). For each pattern:
1. Is there already a fix, and did the failures stop after its date? If yes: "held", no new work.
2. If not: what is the cheapest automatic fix that would have stopped the examples? Say what it checks, where it
   runs (after every edit, before a command, at merge) and what it could wrongly block.
3. If it cannot be checked by a machine: a SHOULD rule row with a plain "Why" quoting the examples.
4. Only if neither fits: a lesson row is enough.
Draft the fix, do not apply it yet, unless it is a check that is clearly safe (step 4).

## 4. Draft the safe checks (at most 3 per sweep)
A new check is written now only when all four hold: it flags a pattern with 2 or more recorded cases; it looks at
one file's text (the `check(path, content)` shape of the others in `.claude/rulebook/checks/`); it passes on every file that
exists today (run it over the whole tree, fix any true finding in the same change or leave the check as a
proposal); and it is proven to fail on a made-up bad input. Anything else is only a proposal in the report.
Each new check needs a rule row (next free R- number from `.claude/rulebook/INDEX.md`, then update its "Last used") so it is
explained where rules live. Never put a new rule into `CLAUDE.md` (R-01) and never into `.claude/rulebook/MUST.md`.

## 5. Did last week's fixes hold?
For each proposal in the previous report that Salem accepted, look for the same pattern since: a repeat means the
fix was too weak. Say so in the report and propose the next step up (lesson to rule, rule to check). A pattern that
has not repeated for two sweeps goes to "Held" and is no longer listed in full.

## 6. Write the report: `.claude/docs/sweeps/YYYY-MM-DD.md` (today's date)
Under 250 lines (R-02), plain English, no secrets. Sections:
- **Summary**: 3 lines: sweep period, number of lessons and events read, top 3 patterns, what was built.
- **Patterns**: one block each: name, count, dates, examples, current fix, proposal options (2 to 4, one marked
  Recommended, each with a one-line trade-off), and the draft (file name or the text of the rule row).
- **Built this sweep**: checks added (id, file, what it caught on today's tree).
- **Held**: patterns whose fix worked. **Watching**: single events not yet a pattern.
- **Not recorded**: failures found outside the lessons, with a suggested lesson row.

## 7. Put the proposals on the board (only the main session writes it, R-23)
- In a helper or scout: stop at the report and hand the main session the report path and the list of
  question texts. Do not touch the board.
- In the main session: post one round titled **"Pattern sweep, YYYY-MM-DD"** (R-05): one question per pattern that
  needs a decision, 2 to 4 options each, one marked Recommended, the trade-off in a line. Patterns that are already
  fixed or only need a lesson row are decided by the agent and listed in the round's intro, not asked. Use the
  same page calls the grill skill uses for rounds (`.claude/skills/grill/SKILL.md`).
- Anything that would change a MUST rule goes as its own question, worded "proposal for the hard rules", and is
  never applied until Salem answers.
- Log the sweep as a task on the board in the same turn (R-04), and end the message with the board link (R-36).

## 8. Apply the answers (when his Send arrives)
- Recommended or chosen option, one by one: write the rule row, the check, the guard or the lesson row. Tell Salem in
  one line per SHOULD rule added (R-03). Update `.claude/rulebook/INDEX.md` "Last used".
- Add a lesson row for any pattern that had none, with the date and where its fix lives.
- If a fix changed a file that came from the setup kit and it suits every project, make the same change in the kit itself (`C:/CLI/tools/project-setup/kit/`, the only source; improve it there directly, R-32).
- Add a line to the journal: "Pattern sweep done: N patterns, M fixes, K waiting for Salem."
- The sweep is finished when the report exists, the round is on the board and the answered fixes are in place.
  The hook stops reminding as soon as a report from today exists, even if answers are still pending.

## Never
- Never change `.claude/rulebook/MUST.md` or retire a MUST rule; propose it.
- Never write to the board from a helper.
- Never invent a count, date or example; quote the lesson or the log line.
- Never weaken an existing check to make a sweep pass.
