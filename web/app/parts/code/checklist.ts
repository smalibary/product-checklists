import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

// Built from the code-block lines of API Keys (monospaced, contrast, "Copied" announced), Micro-interactions
// ("Copied" beside the button), Blog post (scrolls on its own) and API docs (readable, keyboard use).
export const checklistCode: ChecklistData = {
  title: "Code block and Copy",
  note: "6 items, taken from the code-block lines of API Keys, Micro-interactions, Blog post and API docs. API docs and the README example both use this one part. Untick an item to see the block without it. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Reading",
      items: [
        spot(1, "Code in a monospaced font", "Every character is the same width, so columns line up", "code in the ordinary text font"),
        spot(2, "Enough contrast and a readable size", "Dark text on a plain box, 13 px", "tiny pale text that fades into the box"),
        spot(3, "Long lines scroll inside the block, never the whole page", "The long command scrolls sideways in its own box", "a long line that is cut off, with nothing to scroll"),
        spot(4, "Reachable by keyboard, with a name", "The block takes focus with Tab and shows a ring", "a block the keyboard cannot reach, so long lines stay hidden"),
      ],
    },
    {
      title: "Copy",
      items: [
        spot(5, "Copy shows \"Copied\" briefly next to the button", "The button says Copied with a tick for two seconds", "a Copy button that looks the same after it has worked"),
        grey(6, "Copy button announces \"Copied\"", "A hidden status line tells screen reader users the text is on the clipboard", "silence after the button is pressed"),
      ],
    },
  ],
};
