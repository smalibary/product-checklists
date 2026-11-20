import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

export const checklistField: ChecklistData = {
  title: "Input field and form layout",
  note: "36 items: 25 for the input field, then 11 for the form layout. These are the only fields and forms any example uses. Untick an item to see the plain version. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Field: parts",
      items: [
        spot(1, "A visible label above the field, always present", "The label sits above every field", "a box with no label, so nobody knows what to type"),
        spot(2, "Hint text under the label for format or examples", "A hint under the label shows the format", "no hint, so people guess the format"),
        spot(3, "Placeholder never used as the label", "The label stays; the placeholder is only an example", "the placeholder is the only label and vanishes when you type"),
        spot(4, "Error message next to the field, in words", "The message sits under the field and says what to do", "a red box with no words"),
        spot(5, "Optional prefix or suffix outside the typed text", "SAR before the amount, kg after the weight", "the unit typed into the box by hand"),
        spot(6, "Character count for limited fields", "\"12 / 80\" under the field", "a limit nobody can see until it cuts the text"),
      ],
    },
    {
      title: "Field: sizes",
      items: [
        spot(7, "Width hints at expected length (postcode short, address long)", "A short field for the postcode, a long one for the address", "every field the same width whatever goes in it"),
        grey(8, "Text size large enough on phones (16 px stops iOS zooming)", "Field text is 16 px", "the page zooms in when a field is tapped on an iPhone"),
        spot(9, "Touch area at least 24 px, ideally 44", "Each field is at least 44 px tall", "a thin field that is hard to tap"),
      ],
    },
    {
      title: "Field: states",
      items: [
        spot(10, "Default, hover, focus, filled, error, disabled, read-only, each clearly different", "Seven fields, each held in one state", "fields that look the same in every state"),
        spot(11, "Focus ring visible with 3:1 contrast", "The focused field has a ring", "no ring on the focused field"),
        spot(12, "Error shown by border, icon and message, not only red", "A red border, an icon and words", "only the text turns red"),
        spot(13, "Field border 3:1 contrast", "A clear border around every field", "a border so pale the field seems to float"),
        grey(14, "Read-only text still selectable and copyable", "Select the text in the read-only field", "text that cannot be selected or copied"),
      ],
    },
    {
      title: "Field: helping people type",
      items: [
        grey(15, "Right type and keyboard: email, tel, url, number pads with inputmode", "The phone field opens the number pad", "a letters keyboard for a phone number"),
        grey(16, "autocomplete set (name, email, address)", "Personal fields have autocomplete hints", "people retype their own name and address"),
        grey(17, "Paste always allowed", "Paste works in every field", "a field that refuses pasted text"),
        grey(18, "Spellcheck off for codes and names", "No red wavy lines under names or codes", "wavy lines under every name"),
        spot(19, "Accept spaces and dashes in phone and card numbers", "\"0400 000 000\" is accepted as typed", "an error saying digits only"),
      ],
    },
    {
      title: "Field: checking",
      items: [
        spot(20, "Check when leaving the field or on submit, not on every key", "Type half an address and nothing is said until you leave", "an error shouting after the first letter"),
        grey(21, "Clear the error once fixed", "The message goes as soon as the value is fine", "an error that stays after the fix"),
      ],
    },
    {
      title: "Field: access",
      items: [
        grey(22, "Label linked with for and id; hint and error linked with aria-describedby", "A screen reader reads label, hint and error with the field", "a field a screen reader calls \"edit text\" and nothing more"),
        grey(23, "Invalid fields marked aria-invalid", "A field with an error is announced as invalid", "a screen reader never learns the field has a problem"),
        spot(24, "Required fields marked in words, not only with *", "\"(required)\" beside the label", "a lone star with no explanation"),
        grey(25, "Direction follows the typed language (dir auto)", "Arabic text typed in a field runs right to left", "Arabic text jumbled in a left-to-right box"),
      ],
    },
    {
      title: "Form: layout",
      items: [
        spot(26, "One column", "Fields in one column", "fields in two columns, and some missed"),
        spot(27, "Labels above fields", "Every label sits above its field", "labels beside the fields, squeezing the text"),
        grey(28, "Field width hints at the expected length", "Short fields for short answers", "every field the same width"),
        spot(29, "Related fields grouped with a heading or fieldset", "Contact details under their own heading", "one heap of fields"),
      ],
    },
    {
      title: "Form: labels and help",
      items: [
        spot(30, "Every field has a visible label; optional fields marked, not required ones", "Phone says (optional); the others say nothing", "stars on the required ones and nothing on the optional one"),
        spot(31, "Help text under the label, before the field", "The email hint sits under its label", "the hint tucked below the field, read too late"),
      ],
    },
    {
      title: "Form: actions",
      items: [
        spot(32, "The main button at the end, left-aligned with the fields", "Send sits under the fields, on the left edge", "the button floating in the middle of the form"),
        spot(33, "One main button; others look secondary", "Send is filled; Cancel is quiet", "two filled buttons asking for the same attention"),
      ],
    },
    {
      title: "Form: errors and access",
      items: [
        spot(34, "Error summary at the top, messages at each field", "A summary at the top lists each problem as a link to its field", "messages at the fields only; the top of a long form shows nothing"),
        grey(35, "Order of fields matches reading order", "Tab goes down the page, top to bottom", "Tab jumps around the form"),
        grey(36, "Autocomplete hints on personal fields", "Name, email and phone have autocomplete hints", "people retype their own details every time"),
      ],
    },
  ],
};
