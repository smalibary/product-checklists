import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistSearch: ChecklistData = {
  title: "Search (server) checklist",
  note: "12 items of its own. Untick one to see the search without it, and press the Try buttons to see each one at work. The header and footer are the shared ones.",
  groups: [
    {
      title: "Index",
      items: [
        { n: 1, shown: true, text: "A full-text index rather than LIKE scans", where: "The timing line under the box: a few milliseconds, using the index", broken: "every search scanning every record, taking seconds as the data grows" },
        { n: 2, shown: true, text: "Arabic and English handled: language rules, letter forms and diacritics", where: "The Arabic Try button: the word typed without marks still finds the marked one", broken: "the Arabic word finding nothing because the marks and letter forms differ" },
        { n: 3, shown: true, text: "The index updated when records change", where: "Add a record, then search receipt: it is there at once", broken: "a record that was just added missing from search until a nightly rebuild" },
      ],
    },
    {
      title: "Queries",
      items: [
        { n: 4, shown: true, text: "Typos forgiven where possible", where: "The typo Try button: results for the right word, with a line saying so", broken: "a misspelt word finding nothing, with no hint what went wrong" },
        { n: 5, shown: true, text: "Results ranked by match and then by freshness or popularity", where: "The results list: title matches first, newer before older", broken: "results in the order they were stored, the best match anywhere" },
        { n: 6, shown: true, text: "Filters use indexes too", where: "The kind of record switch: a filtered search is as fast as an open one", broken: "every filtered search slow, because the filter scans all records" },
        { n: 7, shown: true, text: "Results paged with a maximum", where: "Previous and Next under the results, five to a page", broken: "every result sent in one long list, however many there are" },
      ],
    },
    {
      title: "Safety",
      items: [
        { n: 8, shown: true, text: "Each person sees only results they may open", where: "The line under the switch, and the results: no private records of others", broken: "other people's private records turning up in the results" },
        { n: 9, shown: true, text: "Query length and complexity limited", where: "The long search Try button: cut to 60 characters, with a line saying so", broken: "a very long search accepted whole, and taking seconds longer" },
        { n: 10, shown: true, text: "Search input passed as a parameter, never joined into a query", where: "The quote Try button: searched as plain words, no error", broken: "a quote in the search breaking the query and showing a database error" },
      ],
    },
    {
      title: "Quality",
      items: [
        { n: 11, shown: true, text: "Searches with no results logged to improve the index", where: "The Searches with no results list under What the team sees", broken: "nobody knowing which searches found nothing, so the gaps stay" },
        { n: 12, shown: true, text: "Slow searches measured", where: "The Slowest searches list, with each time in milliseconds", broken: "slow searches only noticed when someone complains" },
      ],
    },
  ],
};
