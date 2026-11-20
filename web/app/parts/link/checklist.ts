import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

export const checklistLink: ChecklistData = {
  title: "Link",
  note: "9 items. These are the only links any example uses. Untick an item to see the link without it. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Look",
      items: [
        spot(1, "Looks like a link: underlined or otherwise clear, not by colour alone", "The link in the sentence is underlined", "a link in nearly the same colour as the text and no underline"),
        spot(2, "Visited links look different where it helps", "The second link is a visited one, in another colour", "every link looks the same after you have been there"),
        spot(3, "Focus style clear", "The focused link has a ring", "no sign of where the keyboard is"),
      ],
    },
    {
      title: "Words",
      items: [
        spot(4, "Link text says where it goes; no \"click here\"", "Read the pricing guide", "\"click here\""),
        spot(5, "Links to files say type and size", "Annual report (PDF, 2.4 MB)", "a link that quietly starts a big download"),
      ],
    },
    {
      title: "Behaviour",
      items: [
        spot(6, "Opens in the same tab unless there is a strong reason; new tabs announced", "The external link shows an icon and says it opens in a new tab", "a link that opens a new tab with no warning"),
        grey(7, "Links go to places; buttons do actions", "Actions in the examples are buttons", "an action built as a link"),
      ],
    },
    {
      title: "Look, again",
      items: [
        spot(8, "Contrast against text and background", "Link colour keeps its contrast in light and dark", "pale links that are hard to read"),
        spot(9, "Big enough to tap on phones", "A stand-alone link has a tap area at least 44 px tall on a phone", "a tiny link in a list, easy to mis-tap"),
      ],
    },
  ],
};
