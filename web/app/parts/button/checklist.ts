import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

export const checklistButton: ChecklistData = {
  title: "Button and segmented control",
  note: "29 items: 21 for the button, then 8 for the segmented control. These are the only buttons any example uses. Untick an item to see the button without it. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Button: kinds",
      items: [
        spot(1, "A small set of kinds: primary, secondary, tertiary (text), danger", "Four kinds, side by side", "six or seven one-off button styles"),
        spot(2, "One primary button per view or section", "Only Save is filled; Cancel is quiet beside it", "three filled buttons all asking for attention"),
        spot(3, "Danger style only for actions that destroy or cannot be undone", "Only Delete project is red", "a harmless action in red, and Delete in the main colour"),
        spot(4, "Links go somewhere; buttons do something. Use the right element", "Save changes is a button; Read the guide is a link", "an action built as a link, which people cannot press with Space"),
      ],
    },
    {
      title: "Button: content",
      items: [
        spot(5, "A verb that says what happens (\"Save changes\", \"Send invoice\")", "Send invoice", "a bare \"OK\" that says nothing about what happens"),
        spot(6, "Short, start with a capital, no \"Click here\"", "Save changes", "\"click here to save your changes now\""),
        spot(7, "Icon plus text when it helps; icon-only buttons have a text name", "An icon beside Download; the icon-only close button has a name", "a download button that is only an unlabelled arrow"),
      ],
    },
    {
      title: "Button: sizes and look",
      items: [
        spot(8, "Sizes from tokens (small, medium, large); touch area at least 24 px, ideally 44 to 48", "Small, medium and large, from one scale", "sizes that differ by a few pixels, some too small to tap"),
        spot(9, "Text 4.5:1 contrast; button edge or fill 3:1 against the background", "Strong text and fill in light and dark", "pale grey on pale grey that many people cannot read"),
        spot(10, "Looks pressable: filled or outlined, not plain text for main actions", "The main action is a filled button", "the main action as plain text, easy to miss"),
      ],
    },
    {
      title: "Button: states",
      items: [
        spot(11, "Default, hover, focus, pressed, disabled, loading", "Six buttons, each held in one state", "buttons that look the same however you use them"),
        spot(12, "Focus ring visible in every theme", "The focused button has a ring", "no ring, so keyboard users lose their place"),
        spot(13, "Loading: spinner inside, same width, cannot be pressed again", "Press Save: the spinner sits inside, the width holds", "the button shrinks to a spinner and can be pressed again"),
        spot(14, "Disabled buttons used sparingly; better to allow press and explain what is missing", "Press Send: it says what is missing", "a greyed Send with no word on why"),
      ],
    },
    {
      title: "Button: placement",
      items: [
        spot(15, "Primary action placed consistently (end of the form or dialog)", "Cancel first, Save last", "Save first in one place and last in another"),
        grey(16, "Order follows the platform: on Windows and web varies; on iOS and Android follow their guides", "Web order: cancel, then the main action", "the same order on every platform whatever its habits"),
        spot(17, "Full width on phones for main actions", "A 320 px phone strip: the button fills the width", "a small button in a wide empty row, hard to hit"),
      ],
    },
    {
      title: "Button: access",
      items: [
        grey(18, "Native button element, or role button with Enter and Space", "Every button is a real button", "a styled box that Enter and Space do nothing on"),
        spot(19, "Toggle buttons say pressed (aria-pressed)", "Press Bold: it stays filled while on", "a toggle that never shows whether it is on"),
        grey(20, "Button opening a menu says so (aria-haspopup, aria-expanded)", "The header's Menu button says open or closed", "a menu button that never says it opens something"),
        grey(21, "Name matches the visible label", "The spoken name is the word on the button", "a button named differently from its label"),
      ],
    },
    {
      title: "Segmented control: use",
      items: [
        spot(22, "For 2 to 5 related choices that switch a view at once", "Three choices that switch the view at once", "eight choices squeezed into one row"),
        grey(23, "Not for navigation between pages; use tabs instead", "Page navigation uses tabs and links", "a segmented control that moves between pages"),
      ],
    },
    {
      title: "Segmented control: labels and behaviour",
      items: [
        spot(24, "Short text or icons with names, all the same kind", "Three short words", "a mix of bare icons and long sentences"),
        grey(25, "One selected at a time, or several when marked as multi-select", "Choosing one clears the other", "two selected with no sign it allows that"),
        spot(26, "Selection clear by more than colour", "The chosen one is filled and bold", "the chosen one differs only by a faint colour"),
      ],
    },
    {
      title: "Segmented control: semantics and look",
      items: [
        grey(27, "Built as a radio group or toggle buttons", "Arrow keys move between choices", "plain boxes with no keyboard or screen reader meaning"),
        spot(28, "Equal widths; text does not wrap", "Three equal parts, one line each", "uneven parts and labels wrapping onto two lines"),
        spot(29, "Tap targets large enough", "Each choice is 44 px tall", "tiny choices that are hard to hit"),
      ],
    },
  ],
};
