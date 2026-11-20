import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

export const checklistDialog: ChecklistData = {
  title: "Dialog",
  note: "6 items, taken from the modal checklist. These are the only windows any example uses. Untick an item to see the window without it. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Look",
      items: [
        spot(1, "A title that says what it is about", "The heading of the window", 'a vague "Are you sure?" heading'),
        spot(2, "Close button with a name in the corner", "The cross in the top corner, announced as Close", 'a tiny letter "x" that is not a button'),
        spot(3, "Dimmed backdrop over the page", "The page behind is dimmed", "a window floating over a bright page"),
        spot(4, "Short body; scroll inside if longer", "The long text scrolls inside the window; the title and buttons stay", "a window taller than the screen with the buttons out of reach"),
        spot(5, "Centred on desktop, with margins on small screens", "The window is centred with space around it", "a window stretched edge to edge, or stuck in a corner"),
      ],
    },
    {
      title: "Behaviour",
      items: [
        grey(6, "Focus moves in and stays inside; Escape closes; focus returns; the page behind is inert", "Cannot be pointed at. Press Open the real dialog, then Tab, Escape and Tab again", "focus leaking to the hidden page, Escape ignored, focus lost after closing"),
      ],
    },
  ],
};
