# Epics, features and stories (the plan)

Three levels, biggest first:
- **Epic:** one whole area of the app (for example "Accounts"). One folder each: `E01-<name>/`, with `EPIC.md`.
- **Feature:** one thing a person can do in that area (for example "Sign in"). One folder each inside its epic:
  `F01-<name>/`, with `FEATURE.md`.
- **Story:** one short scene of a real person using that feature, start to finish, with what they should see. One file
  each inside its feature: `S01-<name>.md`. A feature has 2 to 5: the normal case, plus the awkward and failure ones
  (no internet, wrong input, empty list, slow phone). Stories are how the checker judges the work.
- A **fix** repairs a feature; it is not planned here.

```
.claude/docs/epics/
  README.md                this file, with the count table below
  E01-accounts/
    EPIC.md                goal + the feature table
    F01-sign-in/
      FEATURE.md           what it does, done when, the story table
      S01-normal-sign-in.md
      S02-wrong-password.md
```

Numbers: E1 is the epic, E1.1 its first feature, E1.1.S1 that feature's first story.
Status: ✓ done · ○ to do · ⏸ parked. Stories: ✓ passing · ✗ failing · ○ not checked yet.
**A feature is done when every one of its stories passes** in the real running app (checker). An epic is done when
all its features are done.
Version numbers: first number +1 per finished epic, middle +1 per finished feature, last +1 per fix.

Keep it current (in the same commit as the work):
- After the grill, or any decision that changes what the app does: add, change or park the epics, features and
  stories it touches (the grill skill, "Apply to the plan"). A dropped item is marked ⏸ with the decision date, never
  deleted.
- After a check: story status and date in the story file and its feature's table; a feature whose stories all pass
  gets ✓ in its epic's table; the count table below updated.
To start: copy the `E01-example/` folder for each epic, its `F01-example/` folder for each feature.

| Epic | Area | Features done | Stories passing |
|---|---|---|---|
| [E1](E01-example/EPIC.md) | Example area | 0 of 1 | 0 of 2 |
