import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistMicro: ChecklistData = {
  title: "Micro-interactions checklist",
  note: "9 items of its own. Untick one to see the page without it. All timing comes from the shared motion part, and turning on reduced motion in your system settings makes every change instant. The header, footer, button, switch, like and copy are the shared ones.",
  groups: [
    {
      title: "Parts",
      items: [
        { n: 1, shown: true, text: "A trigger, a response, rules and an end state, all designed", where: "The table of what the heart does: trigger, response, rules, end state", broken: "a heart that is only described as \"tap the heart\", with the rules and the end state left open" },
        { n: 2, shown: false, text: "Response starts within 100 ms of the action", where: "Every response here starts in the same frame as the press and runs at most the quick motion time", broken: "a half second of nothing after a tap, so people tap again" },
      ],
    },
    {
      title: "Common ones",
      items: [
        { n: 3, shown: true, text: "Button press shows a pressed state", where: "The Save changes button: darker and nudged down while held", broken: "a button that looks the same while it is held down" },
        { n: 4, shown: true, text: "Toggles slide and change colour together", where: "The Notifications switch: the thumb slides while the track changes colour", broken: "a switch that jumps from off to on with no slide" },
        { n: 5, shown: true, text: "Like or favourite gives a short, clear reaction", where: "The heart with its count: it fills red, grows a little, and the number goes up", broken: "a heart that does not change when pressed" },
        { n: 6, shown: true, text: "Copy shows \"Copied\" briefly next to the button", where: "The Copy button turns into Copied with a tick for two seconds", broken: "a Copy button that looks the same after it has worked" },
        { n: 7, shown: true, text: "Hover and focus states animate, not jump", where: "The card: its border and background ease in on hover and on focus", broken: "a card whose border and background jump on hover" },
      ],
    },
    {
      title: "Restraint",
      items: [
        { n: 8, shown: true, text: "Delight only where it helps; never slows a repeated task", where: "The task list: each Done strikes the row through at once and the next one can be pressed straight away", broken: "a long celebration on every Done, with the buttons locked until it finishes" },
        { n: 9, shown: true, text: "Focus state always visible, even mid-animation", where: "The two controls under Keyboard: a ring shows on each, and stays while the heart grows", broken: "controls with the ring removed, so a keyboard user loses their place" },
      ],
    },
  ],
};
