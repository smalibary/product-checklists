import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklist404: ChecklistData = {
  title: "404 checklist",
  note: "12 items of its own. Untick one to see the page without it. Grey numbers are not shown in this preview, so they have no badge on it.",
  groups: [
    {
      title: "Message",
      items: [
        { n: 1, shown: true, text: 'Plain words, not "404" as the headline', where: '"We cannot find that page"', broken: 'a bare "404 Not Found" headline' },
        { n: 2, shown: true, text: "A short reason", where: "Typing mistake, or the page moved", broken: "no reason, only a list of ways to look" },
        { n: 3, shown: true, text: "No blame on the visitor", where: 'Says "the address", never "you typed"', broken: "blame: you typed the address wrong" },
        { n: 4, shown: true, text: "Calm humour only if it does not hide the message", where: "No joke used; the message comes first", broken: "a joke headline, with the real message in small grey text below" },
      ],
    },
    {
      title: "Ways forward",
      items: [
        { n: 5, shown: true, text: "A search box", where: "Search this site", broken: "no way to search the site" },
        { n: 6, shown: true, text: "Home and most used pages", where: "Four popular pages", broken: "no popular pages to go to" },
        { n: 7, shown: true, text: "Report a broken link", where: '"Tell us it is broken"', broken: "no way to report the broken link" },
        { n: 8, shown: true, text: "Normal header and footer", where: "The site header on top and the site footer below; their own items are in the Header and Footer checklists", broken: "no header or footer, so the page feels like a different site" },
      ],
    },
    {
      title: "Technical (behind the page)",
      items: [
        { n: 9, shown: false, text: "Server answers 404, or 410 if gone for good", where: "Set on the server; this preview can't send it", broken: "search engines keep the dead page listed" },
        { n: 10, shown: false, text: "Moved pages redirect (301)", where: "A redirect list on the server, checked before the 404", broken: "old links land here instead of the new page" },
        { n: 11, shown: false, text: "Broken links found in logs and fixed", where: "A weekly look at the 404 report", broken: "the same broken links keep sending people here" },
        { n: 12, shown: false, text: 'Page title "Page not found" with the site name', where: 'On the real site the browser tab reads "Page not found · Example"', broken: 'the browser tab says only "localhost"' },
      ],
    },
  ],
};
