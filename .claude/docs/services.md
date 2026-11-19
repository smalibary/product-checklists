# Services and their limits

Rules: `.claude/rules/service-limits.md`. One table row per limit. Facts from the official page, linked.
Default for every service: pace to use about 90% by the reset. "No limit" only when Salem says so (dated).

## Services
| Service | Plan | Limit | Resets | Shared by | Daily budget | Used for | Source | Pacing |
|---|---|---|---|---|---|---|---|---|
| (none: recording) | | | | | | Recording runs locally; Claude drives it through Salem's own subscription (D1 A) | | |
| mail.tm (throwaway test inbox) | Free, no account | No limit published (docs page refuses automated reading; search 2026-11-19 found none) | n/a | Only this computer | Our own cap: 20 inboxes a day, at most 40 calls each (one check every 5 s for up to 3 min) | One inbox per sign-up recording, to read the site's code | https://docs.mail.tm | Counted in code; refuses past the cap; stops on a 429 (too many requests) |

## Scheduled jobs (timers count as calls)
| Job | Every | Copies it runs on | Calls inside each run | Calls per day | Share of daily budget |
|---|---|---|---|---|---|

## Feature estimates (before building)
| Date | Feature | Service | Per day at expected use | Share of daily budget | Decision |
|---|---|---|---|---|---|
| 2026-11-19 | Sign-up with a real account (E1.2) | mail.tm | 1 to 5 recordings, at most 200 calls | under the 20-inbox cap | Build; Salem chose the free throwaway inbox |

## Usage checks
| Date | Service | Used so far | % of limit | % of period gone | Over pace? | Note |
|---|---|---|---|---|---|---|
