import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

// Built from the Micro-interactions lines (a like gives a short, clear reaction; focus always visible).
export const checklistLike: ChecklistData = {
  title: "Like button",
  note: "4 items, taken from the Micro-interactions checklist. The Micro-interactions example uses this one part. Untick an item to see the button without it. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Reaction",
      items: [
        spot(1, "A like gives a short, clear reaction", "Press the heart: it fills red and grows a little, in the quick motion time", "a heart that looks the same after it is pressed"),
        spot(2, "The count follows the heart, up by one and back", "The number beside the heart goes up when pressed and back when pressed again", "a heart that changes with no number, so nobody can tell how many"),
        spot(3, "The keyboard ring stays visible", "Tab to the heart: a ring shows, and stays while it animates", "a heart with the ring removed, so a keyboard user loses their place"),
        grey(4, "The name says what pressing will do, and whether it is on", "A screen reader hears \"Add to favourites, not pressed\", then \"Remove from favourites, pressed\"", "a button just called \"button\""),
      ],
    },
  ],
};
