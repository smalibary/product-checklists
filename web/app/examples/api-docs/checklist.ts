import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistApiDocs: ChecklistData = {
  title: "API docs checklist",
  note: "13 items of its own. Untick one to see the page without it. Grey numbers are not shown in this preview, so they have no badge on it. The header and footer are the shared ones.",
  groups: [
    {
      title: "Structure",
      items: [
        { n: 1, shown: true, text: "Four kinds kept apart: tutorial, how-to guides, reference, explanations", where: "The sidebar, in four named groups", broken: "one flat list of every page, with no sign of which kind each is" },
        { n: 2, shown: true, text: "A quick start that reaches a first working call in minutes", where: "The Quick start card: three steps, about 5 minutes", broken: "no quick start, so a newcomer has to piece the first call together from the reference" },
        { n: 3, shown: true, text: "The reference generated from the OpenAPI file", where: "The line under the title naming the file and its version", broken: "a hand-written reference that says it was last checked 14 months ago" },
      ],
    },
    {
      title: "Reference",
      items: [
        { n: 4, shown: true, text: "Every address with its method, fields, types, required marks, example request and response", where: "The fields table, with type and required or optional on each row", broken: "field names with no types and no word on which are required" },
        { n: 5, shown: true, text: "Every error code with its meaning and fix", where: "The Errors table", broken: "no list of errors, so a failed call is a guessing game" },
        { n: 6, shown: true, text: "Authentication, paging, rate limits and versioning explained once and linked from each address", where: "Four links under Works the same on every address", broken: "the same long explanations repeated on every address" },
      ],
    },
    {
      title: "Examples",
      items: [
        { n: 7, shown: true, text: "Copyable examples in curl and the main languages, with test keys filled in for signed-in readers", where: "Language switch, Signed in switch and a Copy button above the request", broken: "one curl example with a placeholder key and no Copy button" },
        { n: 8, shown: false, text: "Examples that are run in tests so they keep working", where: "A test that sends every example against a test account on each release", broken: "examples that quietly stop working after the next change" },
      ],
    },
    {
      title: "Change",
      items: [
        { n: 9, shown: true, text: "A changelog with dates and what callers must do", where: "The Changelog list: a date, the change and What to do", broken: "one line saying various improvements and fixes" },
        { n: 10, shown: true, text: "Deprecated items marked with their retire date", where: "The old orders address, with its retire date and what replaces it", broken: "the old address listed like any other, until it stops working" },
      ],
    },
    {
      title: "Finding things",
      items: [
        { n: 11, shown: true, text: "Search across all pages", where: "The search box above the sidebar; typing narrows the pages", broken: "no search, only the sidebar to scroll through" },
        { n: 12, shown: true, text: "A status page and a support contact linked from the docs", where: "The Something not working box at the bottom", broken: "no way to tell an outage from a mistake, or to reach support" },
      ],
    },
    {
      title: "Access",
      items: [
        { n: 13, shown: true, text: "Docs pages meet WCAG: headings, keyboard use, contrast, readable code blocks", where: "The example response: readable text that a keyboard can scroll", broken: "small, pale code text that a keyboard cannot reach" },
      ],
    },
  ],
};
