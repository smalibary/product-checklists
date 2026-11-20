import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistLegal: ChecklistData = {
  title: "Legal pages pack checklist",
  note: "11 items of its own. Untick one to see the page without it. All the text is made up and is not legal advice. The header and footer are the shared ones.",
  groups: [
    {
      title: "Must-haves",
      items: [
        { n: 1, shown: true, text: "Privacy policy: what is collected, why, how long, who it is shared with", where: "Three cards under Privacy policy, each with four lines", broken: "one vague sentence saying information may be shared with partners" },
        { n: 2, shown: true, text: "Terms of use", where: "The Terms of use block with its summary and link", broken: "no terms, so nobody knows the rules of using the product" },
        { n: 3, shown: true, text: "Cookie notice and choices where cookies need consent", where: "The cookie notice: Reject all and Accept all side by side, and a switch for each kind", broken: "a banner with a single Accept button and no way to say no" },
      ],
    },
    {
      title: "When they apply",
      items: [
        { n: 4, shown: true, text: "Refund and cancellation policy for paid products", where: "The Refunds and cancelling block", broken: "no word on refunds, so people write to ask, or dispute the charge" },
        { n: 5, shown: true, text: "Accessibility statement", where: "The Accessibility block, with how to report a problem", broken: "no statement, and no way to say something does not work" },
        { n: 6, shown: true, text: "Imprint or company details in the EU", where: "The Company details list", broken: "no name, number or address for the company behind the site" },
        { n: 7, shown: true, text: "Security contact (security.txt)", where: "The security.txt file, with a Copy button", broken: "no known address for someone who finds a flaw" },
        { n: 8, shown: true, text: "Community rules for user content", where: "The Community rules list", broken: "no rules, and no promise anyone reads reports" },
        { n: 9, shown: true, text: "Notice of AI use where people talk to an AI", where: "The line at the top of the assistant chat", broken: "a chat that does not say it is not a person" },
      ],
    },
    {
      title: "Upkeep",
      items: [
        { n: 10, shown: true, text: "Dated, with changes announced before they apply", where: "The date under Legal and the note about the change starting 1 December", broken: "\"Last updated: recently\", and changes that simply take effect" },
        { n: 11, shown: true, text: "Linked from the footer and the sign-up screen", where: "The line under Create account that links the Terms and Privacy policy", broken: "a sign-up that does not link to what you are agreeing to" },
      ],
    },
  ],
};
