import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistRelease: ChecklistData = {
  title: "Release announcements checklist",
  note: "8 items of its own. Untick one to see the page without it. The page is one made-up \"What's new\" post for a product called Lorem. The header, footer, button, link, field and code block are the shared ones.",
  groups: [
    {
      title: "Release notes",
      items: [
        { n: 1, shown: true, text: "Written for people, grouped as added, changed, fixed, removed", where: "The change list: four groups, each line saying what it means for the reader", broken: "one long list of internal ticket titles, in no order" },
        { n: 2, shown: true, text: "Version number follows the agreed scheme", where: "The title: version 2.0.0 with its date, major.minor.patch", broken: "a version called \"Spring update\" that says nothing about size or order" },
        { n: 3, shown: true, text: "Breaking changes and what to do listed first", where: "The notice under the title: what stops working, and the steps to take", broken: "the breaking change hidden in the middle of the list, with no steps" },
      ],
    },
    {
      title: "In product",
      items: [
        { n: 4, shown: true, text: "New features introduced in context, once, and easy to dismiss", where: "The tip beside the feature: shown once, with Got it to close it", broken: "a tip that comes back every time the app opens and cannot be closed" },
        { n: 5, shown: true, text: "No pop-ups that block the task", where: "The app strip: the tip sits beside the work and Save stays usable", broken: "a full cover over the screen that must be clicked through before Save works" },
      ],
    },
    {
      title: "Other channels",
      items: [
        { n: 6, shown: true, text: "Email only to people who opted in", where: "The sign-up: an email field and a button, with a promise to email only those who ask", broken: "everyone with an account added to the list, with no way to leave" },
        { n: 7, shown: true, text: "Store \"what's new\" text updated each release", where: "The store text: this release's summary in a copy box, with a link to the full list", broken: "the same \"Bug fixes and improvements\" line as every other release" },
      ],
    },
    {
      title: "Timing",
      items: [
        { n: 8, shown: true, text: "Announced after the rollout is complete", where: "The rollout bar: 100% of users on the new version, then this post went out", broken: "a post at 20% rollout, so most readers cannot find the feature yet" },
      ],
    },
  ],
};
