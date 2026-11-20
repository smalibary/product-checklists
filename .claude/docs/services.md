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

## GitHub (repo smalibary/product-checklists, public) — added 2026-11-20
- Actions (the publish run): standard runners are free and unlimited on public repos, so they draw nothing from an allowance (https://docs.github.com/en/billing/concepts/product-billing/github-actions).
- Pages: 1 GB site; soft 100 GB a month of visitor traffic; soft 10 builds an hour, which a custom Actions workflow is exempt from; 10-minute deploy timeout (https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- How we use it (Salem, 2026-11-20: "dont over use"): one publish per finished example, with its readme change in the same push. Pushes that touch only the readme or .claude don't publish (path filter in pages.yml). Checks run on local builds; the live site gets one look after each publish. About 1 run a day, each under 2 minutes.
