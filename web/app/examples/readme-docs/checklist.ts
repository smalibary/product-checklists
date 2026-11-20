import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistReadmeDocs: ChecklistData = {
  title: "README and code docs checklist",
  note: "10 items of its own. Untick one to see the project page without it. The header and footer are the shared ones.",
  groups: [
    {
      title: "README",
      items: [
        { n: 1, shown: true, text: "What it is and who it is for, in the first lines", where: "The first sentence under README", broken: "a row of badges and no sentence saying what the project is" },
        { n: 2, shown: true, text: "How to install, run and test, as copyable commands", where: "The Install, run and test block, with a Copy button", broken: "a line saying install it the usual way, with no commands to copy" },
        { n: 3, shown: true, text: "Settings and environment variables listed", where: "The Settings table: name, what it does, default, required or optional", broken: "a line telling people to set the variables, without naming them" },
        { n: 4, shown: true, text: "How to get help and how to contribute", where: "Three links under Help and contributing", broken: "no way to ask, report a problem or help" },
        { n: 5, shown: true, text: "The licence named", where: "The Licence line under the title", broken: "no licence named, so nobody knows whether they may use it" },
      ],
    },
    {
      title: "Docs",
      items: [
        { n: 6, shown: true, text: "Tutorials, how-tos, reference and explanations kept apart", where: "Four named groups under Docs", broken: "one flat list of pages with no sign of which kind each is" },
        { n: 7, shown: true, text: "Big decisions recorded with their reasons", where: "The Decisions list: title, status, date and why", broken: "reasons that live in an old chat thread and in people's memory" },
        { n: 8, shown: true, text: "Comments explain why, not what", where: "The code example under In the code", broken: "a comment that repeats what the line already says" },
        { n: 9, shown: true, text: "API reference generated from the code or spec", where: "The line under the Docs groups naming the source and the version", broken: "a hand-written reference last checked 14 months ago" },
      ],
    },
    {
      title: "Upkeep",
      items: [
        { n: 10, shown: true, text: "Docs changed in the same commit as the code", where: "Latest commits: each lists the code file and the doc file together", broken: "docs updated three weeks after the code, in a commit of their own" },
      ],
    },
  ],
};
