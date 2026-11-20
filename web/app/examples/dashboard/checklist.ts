import type { ChecklistData } from "../../components/checklist-layer/types";

// "step" is the page state whose view holds the item's spot (1 Dashboard, 2 Loading, 3 New account,
// 4 A card fails). "broken" finishes the rail line "Visitors would see: ...".
export const checklistDashboard: ChecklistData = {
  title: "Dashboard (web app)",
  note: "20 items. Untick one to see the dashboard without it. The four tabs above the page show its other states. Grey numbers cannot be pointed at, so they have no badge here.",
  groups: [
    {
      title: "Purpose",
      items: [
        { n: 1, shown: true, step: 1, text: "Built for one audience and its questions (an operator watches, a manager reviews)", where: "The title and one line say who it is for and what it answers", broken: 'a generic "Dashboard" with a bit of everything and no stated audience' },
        { n: 2, shown: true, step: 1, text: "The few numbers that matter most at the top, largest", where: "Three big numbers, first thing under the filters", broken: "the same numbers shrunk to the size of the labels, so nothing stands out" },
        { n: 3, shown: true, step: 1, text: "Things needing action (overdue, failing, waiting on me) shown clearly", where: '"Needs attention" card above everything else', broken: "no list of what needs action; problems hide inside charts" },
        { n: 4, shown: true, step: 1, text: "Every card links to the detail behind it", where: '"View details" link at the foot of each card', broken: "dead-end cards: numbers with nowhere to go next" },
      ],
    },
    {
      title: "Numbers and charts",
      items: [
        { n: 5, shown: true, step: 1, text: "Each number with its period, a comparison and a direction", where: '"vs previous 7 days" under every number', broken: "a bare number with no period and nothing to compare it to" },
        { n: 6, shown: true, step: 1, text: "Up and down shown by arrow and word, not only green and red", where: 'An arrow and the word "Up" or "Down"', broken: "direction told by colour alone, which people who cannot tell red from green miss" },
        { n: 7, shown: true, step: 1, text: "Simple charts: lines for trends, bars for comparison", where: "A line for requests over time, bars for services side by side", broken: "a pie for a trend over time and a line joining unrelated services" },
        { n: 8, shown: true, step: 1, text: "Units and time zone stated; when the data was last updated", where: "A line with the period, units, time zone and last update", broken: "numbers with no units, no time zone and no sign of how fresh they are" },
        { n: 9, shown: true, step: 1, text: "Charts have exact values on hover and on keyboard focus", where: "Hover or Tab to a point or bar to read its exact value", broken: "only the shape; the exact value is never shown" },
      ],
    },
    {
      title: "Layout",
      items: [
        { n: 10, shown: false, text: "A grid that reflows on smaller screens, in a sensible reading order", where: "Make the window narrow: cards stack in one column, in the order they are read", broken: "cards stay in fixed columns and the grid scrolls sideways on a phone" },
        { n: 11, shown: false, text: "Cards the same style and spacing", where: "One card style: same border, corners, padding and gaps everywhere", broken: "cards with different corners, padding and gaps, so the page looks patched together" },
        { n: 12, shown: true, step: 1, text: "Date range and filters apply to all cards, shown at the top", where: "Range and environment at the top change every card", broken: "the filters sit inside one chart, so the other cards ignore them" },
        { n: 13, shown: true, step: 1, text: "Optional: choose, hide and reorder cards; the layout is remembered", where: "A Customise button: show, hide and move cards", broken: "one fixed layout for everyone" },
      ],
    },
    {
      title: "States",
      items: [
        { n: 14, shown: true, step: 2, text: "Skeleton cards while loading, each card loading on its own", where: "Grey card shapes in the real layout", broken: "one blank screen with a spinner until everything is ready" },
        { n: 15, shown: true, step: 3, text: "New account with no data: an empty state that helps set up", where: "A short message and the first three steps", broken: "zeros and empty charts with no hint of what to do" },
        { n: 16, shown: true, step: 4, text: "A card that fails shows its own error and Retry; the rest still work", where: "Only the traffic card shows the error and a Retry button", broken: "the card spins forever with no message and no Retry" },
        { n: 17, shown: true, step: 1, text: "Live numbers update without jumping the layout", where: "Numbers change every 5 seconds in fixed-width digits; nothing moves", broken: 'an "Updated" tag appears above each number on every refresh and pushes the page down' },
      ],
    },
    {
      title: "Access",
      items: [
        { n: 18, shown: false, text: "Cards have headings; screen readers can jump between them", where: "Each card title is a real heading, so a screen reader can jump from card to card", broken: "card titles are plain text, so a screen reader has to read the whole page" },
        { n: 19, shown: true, step: 1, text: "Charts have a text summary or a table", where: 'A sentence under each chart and a "View as table" toggle', broken: "a picture only, nothing to read for someone who cannot see it" },
        { n: 20, shown: true, step: 1, text: "Auto-refresh can be paused; motion respects reduced motion", where: '"Live updates" switch pauses the refresh', broken: "the numbers keep changing and cannot be stopped" },
      ],
    },
  ],
};
