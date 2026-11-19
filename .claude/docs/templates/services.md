# Services and their limits (copy to `.claude/docs/services.md`)

Rules: `.claude/rules/service-limits.md`. One table row per limit. Facts from the official page, linked.
Default for every service: pace to use about 90% by the reset. "No limit" only when Salem says so (dated).

## Services
| Service | Plan | Limit | Resets | Shared by | Daily budget | Used for | Source | Pacing |
|---|---|---|---|---|---|---|---|---|
| <name> | <free / paid tier> | <e.g. 1M function calls> | <monthly, day N> | <dev + test + real> | <limit / days> | <features> | <link> | paced / no limit (Salem, YYYY-MM-DD) |

## Scheduled jobs (timers count as calls)
| Job | Every | Copies it runs on | Calls inside each run | Calls per day | Share of daily budget |
|---|---|---|---|---|---|

## Feature estimates (before building)
| Date | Feature | Service | Per day at expected use | Share of daily budget | Decision |
|---|---|---|---|---|---|

## Usage checks
| Date | Service | Used so far | % of limit | % of period gone | Over pace? | Note |
|---|---|---|---|---|---|---|
