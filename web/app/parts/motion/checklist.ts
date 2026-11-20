import type { ChecklistData } from "../../components/checklist-layer/types";
import { grey, spot } from "../_lib/items";

export const checklistMotion: ChecklistData = {
  title: "Motion",
  note: "37 items from four checklists: motion system (1 to 9), timing and easing (10 to 19), micro-interactions (20 to 28) and motion accessibility (29 to 37). Every example reads these same tokens. Untick an item to see the version without it. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Motion system: tokens",
      items: [
        spot(1, "Durations and easing curves stored as named tokens", "The token table, read live from the page", "numbers typed into every transition, a little different each time"),
        spot(2, "A short list: a few durations, a few curves", "Four durations and three curves", "a dozen different times and curves"),
      ],
    },
    {
      title: "Motion system: patterns, handoff, principles, review",
      items: [
        spot(3, "One named transition for each job (open, close, push, expand)", "Four buttons, one transition each", "each screen opens things its own way"),
        grey(4, "Written rules for what moves and what never moves", "The rules file lists what moves", "any part of the page may start moving"),
        spot(5, "Each animation specified with trigger, property, duration, curve and delay", "The spec table, one row per transition", "no spec, so each developer guesses"),
        spot(6, "A recording or live demo beside each spec", "A Play button beside each row", "a spec with nothing to look at"),
        spot(7, "Two or three motion principles written in plain words", "Three principles above the table", "no principles, so no way to settle an argument"),
        grey(8, "Reduced motion version defined for every pattern", "Every pattern has a calm version", "a pattern with no calm version"),
        grey(9, "Motion reviewed in design review, like colour and type", "Motion is on the review list", "motion never reviewed"),
      ],
    },
    {
      title: "Timing and easing: duration",
      items: [
        spot(10, "Small changes (a toggle, a hover) about 100 to 200 ms", "Small: 120 ms", "a toggle that takes nearly a second"),
        spot(11, "Medium changes (a menu, a card opening) about 200 to 300 ms", "Medium: 200 ms", "a menu that crawls open or snaps shut"),
        spot(12, "Big changes (a full screen) up to about 400 to 500 ms", "Big: 320 ms", "a screen change that takes over a second"),
        spot(13, "Things leaving faster than things arriving", "Leave: 140 ms, shorter than the arrival", "things that leave more slowly than they arrive"),
        grey(14, "Bigger distance, slightly longer time", "A long slide gets a little more time", "the same time for a hop and a long slide"),
      ],
    },
    {
      title: "Timing and easing: easing and testing",
      items: [
        spot(15, "Ease-out for things entering, ease-in for things leaving, standard for moves on screen", "Three curves, each for its job", "everything on one flat linear curve"),
        grey(16, "No linear easing for movement, except progress and spinners", "Linear is used for the spinner only", "linear easing on every slide"),
        grey(17, "A small named set of curves used everywhere", "Three curves, all named", "a new curve for each screen"),
        grey(18, "Timing checked slowed down, then at real speed", "Slowed 4 times in review", "timing only ever seen at full speed"),
        grey(19, "Repeated animations felt after the 20th time, not just the first", "Tried twenty times in a row", "an animation that is charming once and tiresome after"),
      ],
    },
    {
      title: "Micro-interactions",
      items: [
        grey(20, "A trigger, a response, rules and an end state, all designed", "Each micro-interaction has all four", "a response with no end state"),
        grey(21, "Response starts within 100 ms of the action", "The press answers at once", "a pause before anything seems to happen"),
        spot(22, "Button press shows a pressed state", "Press the button: it sinks and darkens", "a button that does not change when pressed"),
        spot(23, "Toggles slide and change colour together", "Switch it: the thumb slides as the colour changes", "a switch that snaps with no sliding"),
        spot(24, "Like or favourite gives a short, clear reaction", "Press the heart: it pops and fills", "a like that changes nothing visible"),
        spot(25, "Copy shows \"Copied\" briefly next to the button", "Press Copy: the label says Copied, then returns", "a copy button that gives no sign it worked"),
        spot(26, "Hover and focus states animate, not jump", "Hover the card: the border eases in", "a card whose border jumps on hover"),
        grey(27, "Delight only where it helps; never slows a repeated task", "No animation in the way of repeated clicks", "a flourish that slows each click"),
        grey(28, "Focus state always visible, even mid-animation", "The ring stays while things move", "a focus ring that disappears during a move"),
      ],
    },
    {
      title: "Motion accessibility",
      items: [
        spot(29, "Reduce motion setting respected on web, iPhone and Android", "A line says whether your device asks for less motion, and the page follows it", "a page that ignores the device setting"),
        spot(30, "Reduced motion swaps movement and zoom for fades, not nothing at all", "Open the panel: it slides, or only fades when motion is reduced", "movement removed, so the panel just snaps in with no cue"),
        spot(31, "An in-app switch to turn animation down too", "The Calm mode switch", "no way to turn motion down inside the page"),
        grey(32, "Large zooms, spins and parallax avoided", "No zoom, spin or parallax anywhere", "a large zoom that can cause dizziness"),
        grey(33, "Nothing flashes more than three times a second", "Nothing flashes", "a flashing banner"),
        spot(34, "Auto-playing motion over 5 seconds can be paused, stopped or hidden", "The looping animation has a Pause button", "a loop that cannot be stopped"),
        grey(35, "No information only available while animating", "Every state also shows in words", "the only sign of an error is a shake"),
        grey(36, "Focus is never lost or moved by an animation", "Focus stays where it was", "focus jumping when something slides"),
        grey(37, "Time limits never shortened by animation", "Animation does not use up the user's time", "a timer that runs while a slow animation plays"),
      ],
    },
  ],
};
