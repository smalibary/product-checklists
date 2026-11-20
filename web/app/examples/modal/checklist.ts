import type { ChecklistData } from "../../components/checklist-layer/types";

// "step" is the screen that holds the item's spot (1 Confirm delete, 2 Unsaved changes, 3 Phone,
// 4 Long text). "broken" finishes the rail line "Visitors would see: ...".
export const checklistModal: ChecklistData = {
  title: "Modal",
  note: "24 items. Untick one to see the window without it. The four steps above the window show the other cases, and Delete project opens the window again. Grey numbers cannot be pointed at, so they have no badge here; the real, focus-trapping dialog is on the Dialog parts page.",
  groups: [
    {
      title: "When to use",
      items: [
        { n: 1, shown: false, step: 1, text: "Short tasks or decisions that must happen before going on (confirm delete, quick edit)", where: "Cannot be pointed at. The three windows are a delete question, one field to edit and a short notice", broken: "a long form or a whole settings page squeezed into a window" },
        { n: 2, shown: false, step: 4, text: "Not for long forms, complex tasks or content people want to compare with the page", where: "Cannot be pointed at. The text window holds one short notice and two buttons; anything longer would be its own page", broken: "a many-step form in a window that hides the page people need to compare it with" },
        { n: 3, shown: false, step: 1, text: "Not on page load or as a surprise interruption", where: "Cannot be pointed at. The window opens only when the person presses Delete project", broken: "a window over the page the moment it loads, before the person has done anything" },
        { n: 4, shown: false, step: 1, text: "Urgent confirmations use the alert dialog pattern", where: "Cannot be pointed at. A question that must be answered is built as an alert dialog, which an outside press does not dismiss", broken: "a risky question that vanishes on an outside press and is counted as an answer" },
      ],
    },
    {
      title: "Content",
      items: [
        { n: 5, shown: true, step: 1, text: "A title that says what it is about", where: "The heading names the project it is about", broken: 'a vague "Are you sure?" that does not say what about' },
        { n: 6, shown: true, step: 4, text: "Short body; scroll inside if longer", where: "On the text step the body scrolls inside the window while the title and buttons stay in place", broken: "a window taller than the screen, with the title and buttons pushed out of reach" },
        { n: 7, shown: true, step: 1, text: 'Buttons named for the action ("Delete project", "Keep editing"), not just OK and Cancel', where: "The two buttons say what each one does", broken: 'two buttons that say "Cancel" and "OK", so people must re-read the question to know which is which' },
        { n: 8, shown: true, step: 1, text: "The safe choice is clear; dangerous action styled as dangerous", where: "The safe button is quiet and the destructive one is red", broken: "two identical buttons, so a rushed press can delete the project" },
      ],
    },
    {
      title: "Look",
      items: [
        { n: 9, shown: true, step: 1, text: "Dimmed backdrop over the page", where: "The page behind is dimmed so the window is the only thing to look at", broken: "a window floating over a bright page, with nothing to say the page is locked" },
        { n: 10, shown: true, step: 3, text: "Centred on desktop; full screen or bottom sheet on phones", where: "Centred over the page on a computer; a sheet that slides up from the bottom on the phone", broken: "a box pinned to the top-left corner, and on a phone a floating box instead of a sheet" },
        { n: 11, shown: true, step: 1, text: "Close button with a name in the corner", where: "A cross in the top corner that a screen reader announces as Close", broken: 'a tiny letter "x" that is not a button and has no name' },
        { n: 12, shown: true, step: 1, text: "Width suits the content, with margins on small screens", where: "A comfortable width with space around it on every side", broken: "a window stretched edge to edge with no margin, even on a wide screen" },
      ],
    },
    {
      title: "Behaviour",
      items: [
        { n: 13, shown: false, step: 1, text: "Escape closes it (except where data would be lost without warning)", where: "Cannot be pointed at. Press Escape with the window open", broken: "Escape does nothing, so keyboard users must Tab all the way to the close button" },
        { n: 14, shown: false, step: 1, text: "Click on the backdrop closes non-critical modals", where: "Cannot be pointed at. Press the dimmed page on the delete step", broken: "the dimmed page ignores presses, so people click again and again to get out" },
        { n: 15, shown: true, step: 2, text: "Unsaved changes warned before closing", where: "A warning above the buttons says the typed changes will be lost", broken: "the window closes and the typed changes disappear without a word" },
        { n: 16, shown: false, step: 1, text: "No modals on top of modals", where: "Cannot be pointed at. The unsaved-changes warning sits inside the same window, not in a second one", broken: "a second window stacked on the first, with no clear way back" },
        { n: 17, shown: false, step: 1, text: "Page behind does not scroll", where: "Cannot be pointed at. Turn the wheel over the dimmed page", broken: "the page scrolls behind the window and loses the person's place" },
      ],
    },
    {
      title: "Focus and access",
      items: [
        { n: 18, shown: false, step: 1, text: "Focus moves into the modal (first field or the title)", where: "Cannot be pointed at. Open the window with the keyboard and the title takes the focus", broken: "focus stays on the page behind, so a keyboard user types into nothing" },
        { n: 19, shown: false, step: 1, text: "Focus stays inside while open", where: "Cannot be pointed at. The real dialog on the Dialog parts page keeps Tab inside", broken: "Tab leaves the window and walks through the hidden page" },
        { n: 20, shown: false, step: 1, text: "Focus returns to the button that opened it", where: "Cannot be pointed at. Close the window and Delete project has the focus again", broken: "focus drops to the top of the page after closing" },
        { n: 21, shown: false, step: 1, text: "Role dialog with aria-modal and a name from the title", where: "Cannot be pointed at. The window is a dialog named by its title", broken: "a screen reader hears an unnamed group, with no sign that a window opened" },
        { n: 22, shown: false, step: 1, text: "The native dialog element with showModal handles much of this", where: "Cannot be pointed at. The real dialog is built on the browser's own dialog element", broken: "focus, Escape and the top layer all rebuilt by hand, with gaps" },
        { n: 23, shown: false, step: 1, text: "Page behind is hidden from screen readers (inert)", where: "Cannot be pointed at. The page behind cannot be tabbed to or read while the window is open", broken: "a screen reader still reads the hidden page and a click can reach it" },
        { n: 24, shown: false, step: 1, text: "Opening and closing motion respects reduced motion", where: "Cannot be pointed at. With reduced motion on, the window appears and disappears without sliding", broken: "a sliding window for people who asked their device for less movement" },
      ],
    },
  ],
};
