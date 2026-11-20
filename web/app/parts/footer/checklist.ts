import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

export const checklistFooter: ChecklistData = {
  title: "Footer (website)",
  note: "20 items. This is the one footer every page uses, in two variants (full, and slim for sign-in pages). Untick an item to see the footer without it. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Content",
      items: [
        spot(1, "Links grouped under short headings (Product, Company, Resources, Legal)", "Three columns, each under a short heading", "one long unsorted list of links"),
        spot(2, "Contact: email, phone or a link to the contact page", "Email and phone under Contact", "no way to reach anyone from the footer"),
        spot(3, "Company name, registration and address where the law asks", "Company name, registration number and address", "no company details at all"),
        spot(4, "Privacy policy, terms and cookie settings links", "Privacy policy, Terms and Cookie settings", "legal pages with no link from anywhere"),
        spot(5, "\"Do not sell or share my personal information\" where California law applies", "The link in the bottom strip", "no way to opt out of the sale of personal data"),
        spot(6, "Accessibility statement link", "Accessibility statement in the bottom strip", "no statement of what is and is not accessible"),
        spot(7, "Copyright line with the current year", "The line at the left of the bottom strip, with this year", "no copyright line"),
        spot(8, "Social links with names, not only icons", "Each social link has its name beside the icon", "icons alone, with no name for screen readers or people unsure of a logo"),
        spot(9, "Language and region switcher", "A language menu at the right of the bottom strip", "no way to change language"),
        spot(10, "Newsletter sign-up, short, with consent rules", "One email field, one button and a line saying what you get", "no sign-up, or a long form with no word on consent"),
        spot(11, "Status page and help centre links", "System status and Help centre in the bottom strip", "no way to find out if the service is down, or to get help"),
      ],
    },
    {
      title: "Consistency",
      items: [
        grey(12, "The same footer, in the same order, on every page", "Every example page uses this footer", "a different footer on every page"),
        grey(13, "Help link in the same place on every page", "Help centre in the same spot on every footer", "help found in a different place on each page"),
      ],
    },
    {
      title: "Structure and access",
      items: [
        grey(14, "Marked as the page's footer landmark (contentinfo)", "A footer element at the end of the page", "screen reader users cannot jump to the footer"),
        grey(15, "Link groups are lists with headings", "Each group is a list under a heading", "links in a heap that read as one long sentence"),
        grey(16, "Link text says where it goes, no \"click here\"", "Every link names its place", "links that say \"click here\""),
        grey(17, "Contrast meets 4.5 to 1, even on dark footers", "Text keeps its contrast in light and dark", "pale grey text on a light background"),
        grey(18, "Touch targets at least 24 pixels apart or in size", "Each link has room around it", "tight links that are easy to mis-tap"),
        grey(19, "Groups stack or fold into sections on phones", "Make the window narrow: the columns stack", "columns squeezed side by side on a phone"),
        spot(20, "Back to top link on long pages", "Back to top at the end of the bottom strip", "no quick way back up a long page"),
      ],
    },
  ],
};
