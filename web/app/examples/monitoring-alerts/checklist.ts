import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistMonitoring: ChecklistData = {
  title: "Monitoring and alerts checklist",
  note: "11 items of its own. Untick one to see the page without it. The page is one made-up on-call overview for a service called Lorem API. The header, footer, button, link and code block are the shared ones.",
  groups: [
    {
      title: "Measure",
      items: [
        { n: 1, shown: true, text: "The four golden signals: traffic, errors, time taken and how full the system is", where: "Four tiles at the top: requests a second, share of failures, time taken and how full", broken: "one number (processor use) and no view of what users feel" },
        { n: 2, shown: true, text: "Service level objectives agreed and written", where: "The objective card: 99.9% of requests succeed over 30 days, with the budget left", broken: "no target at all, so nobody can say what good enough means" },
        { n: 3, shown: true, text: "Checks from outside that act like a user", where: "The outside checks list: three checks, run from three places every minute", broken: "no checks from outside; the first sign of trouble is a customer message" },
      ],
    },
    {
      title: "Alerts",
      items: [
        { n: 4, shown: true, text: "Alert on user pain (SLO burn rate), not on every high number", where: "The rule: fires when errors use the monthly budget 14 times too fast", broken: "an alert for processor above 70% that fires on every busy afternoon" },
        { n: 5, shown: true, text: "Every alert can be acted on and links to a runbook", where: "The sample alert: owner, first step and an Open the runbook link", broken: "an alert that says something is wrong, with no owner and no next step" },
        { n: 6, shown: true, text: "Urgent alerts page someone; the rest go to a ticket", where: "The routing list: urgent pages the on-call person, everything else becomes a ticket", broken: "every alert paging the on-call person, day and night" },
        { n: 7, shown: true, text: "Noisy alerts fixed or removed", where: "The alert health card: 38 fired this week, 36 needed action, 2 noisy ones removed", broken: "212 alerts this week with 9 needing action, so people mute them all" },
      ],
    },
    {
      title: "Dashboards",
      items: [
        { n: 8, shown: true, text: "One overview page per service", where: "The title block: one page for Lorem API, with everything below it", broken: "charts spread over several tools, with no single page to open" },
        { n: 9, shown: true, text: "Traces across services", where: "The trace: one request followed through gateway, sign-in, search and database", broken: "separate logs per service, so a slow request cannot be followed across them" },
      ],
    },
    {
      title: "Users",
      items: [
        { n: 10, shown: true, text: "A public status page during problems", where: "The notice at the top: what is slower, the next update time and a Status page link", broken: "no public notice, so customers find out from each other" },
      ],
    },
    {
      title: "Costs",
      items: [
        { n: 11, shown: true, text: "Usage of paid services watched against limits, with alerts at 50% and 80%", where: "The usage bars: marks at 50% and 80%, and an alert already sent at 80%", broken: "usage read once a month from the invoice, after the limit was hit" },
      ],
    },
  ],
};
