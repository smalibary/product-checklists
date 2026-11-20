import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

export const checklistHeader: ChecklistData = {
  title: "Header (website)",
  note: "18 items. This is the one header every page uses, in three variants (site, sign-in, app). Untick an item to see the header without it. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Content",
      items: [
        spot(1, "Logo at the top left, linking to the home page", "The logo, first on the left, links home", "a name in plain text that goes nowhere"),
        spot(2, "Main menu with a few short, plain labels", "Four short labels: Features, Pricing, Docs, About", "a long row of vague labels that runs out of room"),
        spot(3, "The current section marked in the menu", "Pricing has an underline and bold text", "a menu that never says where you are"),
        spot(4, "Search box or search button where the site has search", "A search button before the utility links", "no way to search from the header"),
        spot(5, "Small utility links (sign in, account, cart, language) kept apart from the main menu", "Sign in sits on the right, apart from the menu", "sign in mixed in with the main menu"),
        spot(6, "One clear main action at most", "One filled button: Start free", "no main action, or several competing buttons"),
      ],
    },
    {
      title: "Consistency",
      items: [
        grey(7, "The same header, in the same order, on every page", "Every example page uses this header (the sign-in pages use the slim one)", "a different header on every page"),
        spot(8, "Help or contact link in the same place on every page", "Help, left of Sign in, on every header", "help found in a different place on each page"),
      ],
    },
    {
      title: "Phones",
      items: [
        spot(9, "Menu folds into a menu button on small screens, with the most used links still visible", "The phone header: logo, main action and a Menu button", "the full menu squeezed in, running off the side of the screen"),
        spot(10, "The menu button has a visible label or a clear name for screen readers", "The button says Menu in words", "an icon with no word and no name for screen readers"),
        grey(11, "Nothing scrolls sideways at 320 px", "The phone header fits 320 px", "the page scrolls sideways on a small phone"),
      ],
    },
    {
      title: "Sticky headers",
      items: [
        spot(12, "Sticky only if it stays small, and shrinks or hides on scroll down", "Scroll the frame: the header stays and shrinks", "a tall header that stays and takes a third of a phone screen"),
        grey(13, "Never covers the item that has keyboard focus", "Pages keep room under the header when tabbing", "a focused link hidden under the header"),
      ],
    },
    {
      title: "Structure and access",
      items: [
        grey(14, "Marked as the page's header landmark (banner) with the menu inside a nav landmark", "Header element with a nav inside", "screen reader users cannot jump to the menu"),
        grey(15, "A \"Skip to content\" link as the first thing a keyboard reaches", "Press Tab on a page: the link appears", "keyboard users tab through every menu link on each page"),
        grey(16, "Drop-down menus open by click or Enter, not only on hover", "Features opens by click or Enter", "a menu that opens only on hover"),
        grey(17, "Visible focus on every link and button", "A ring on whatever has focus", "no sign of where the keyboard is"),
        grey(18, "Touch targets at least 24 pixels apart or in size", "Every header control is at least 44 px tall", "tiny links that are hard to hit"),
      ],
    },
  ],
};
