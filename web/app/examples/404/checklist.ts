import type { ChecklistData } from "../../components/checklist-layer/types";

export const checklist404: ChecklistData = {
  title: "404 checklist",
  note: "12 items of its own. Grey numbers are not shown in this preview, so they have no badge on it.",
  groups: [
    {
      title: "Message",
      items: [
        { n: 1, shown: true, met: true, text: 'Plain words, not "404" as the headline', where: '"We cannot find that page"' },
        { n: 2, shown: true, met: true, text: "A short reason", where: "Typing mistake, or the page moved" },
        { n: 3, shown: true, met: true, text: "No blame on the visitor", where: 'Says "the address", never "you typed"' },
        { n: 4, shown: false, met: true, text: "Calm humour only if it does not hide the message", where: "No joke used; the message comes first" },
      ],
    },
    {
      title: "Ways forward",
      items: [
        { n: 5, shown: true, met: true, text: "A search box", where: "Search books and authors" },
        { n: 6, shown: true, met: true, text: "Home and most used pages", where: "Four popular pages" },
        { n: 7, shown: true, met: true, text: "Report a broken link", where: '"Tell us it is broken"' },
        { n: 8, shown: false, text: "Normal header and footer", where: "Left out of this preview; on the real site the shop's usual menu and footer wrap this page. Their own items are in the Header and Footer checklists" },
      ],
    },
    {
      title: "Technical (behind the page)",
      items: [
        { n: 9, shown: false, text: "Server answers 404, or 410 if gone for good", where: "Set on the server; this preview can't send it" },
        { n: 10, shown: false, text: "Moved pages redirect (301)", where: "A redirect list on the server, checked before the 404" },
        { n: 11, shown: false, text: "Broken links found in logs and fixed", where: "A weekly look at the 404 report" },
        { n: 12, shown: false, text: 'Page title "Page not found" with the site name', where: 'On the real site the browser tab reads "Page not found · Qanat Books"' },
      ],
    },
  ],
};
