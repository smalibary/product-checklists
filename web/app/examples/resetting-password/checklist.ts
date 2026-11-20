import type { ChecklistData } from "../../components/checklist-layer/types";

// "step" is the step whose page holds the item's spot. "broken" finishes "Visitors would see: ...".
export const checklistReset: ChecklistData = {
  title: "Resetting password (flow)",
  note: "19 items. Untick one to see the step without it. Grey numbers sit behind the page, so they have no badge here.",
  groups: [
    {
      title: "Starting",
      items: [
        { n: 1, shown: true, step: 1, text: '"Forgot password?" next to the password field', where: "Right beside the password field on sign-in", broken: "no link; people have to guess where to go" },
        { n: 2, shown: true, step: 1, text: "Email field filled with what was typed on login", where: "The email is already in the field", broken: "an empty email field to type again" },
        { n: 3, shown: true, step: 1, text: 'Same message whether or not the account exists ("If an account exists, we sent a link")', where: "One answer for every email", broken: '"No account with that email", which tells strangers who has an account' },
      ],
    },
    {
      title: "The link or code",
      items: [
        { n: 4, shown: false, text: "Random, single use, expires soon (about an hour or less)", where: "Made and checked on the server; the email says 60 minutes", broken: "the same link keeps working for days" },
        { n: 5, shown: true, step: 2, text: "Sent by email, or code by SMS where that is how people sign in", where: "An email with the link", broken: "no email; the link is printed on the page for anyone looking at the screen" },
        { n: 6, shown: true, step: 2, text: "Resend after a short wait", where: "Resend button with a countdown", broken: "no resend; a lost email means starting over" },
        { n: 7, shown: false, text: "Link opens on any device", where: "A plain web address, not tied to the browser that asked", broken: '"Open this on the computer you started on"' },
      ],
    },
    {
      title: "New password",
      items: [
        { n: 8, shown: true, step: 3, text: "One field with Show, not two to match", where: "One field and a Show button", broken: "two password fields to match, and no way to see what was typed" },
        { n: 9, shown: true, step: 3, text: "Rules shown up front, checked as typed: at least 8 characters (15 if password-only), no forced mix of symbols", where: "One rule, ticked as you type", broken: "no rules until a failed try, then a demand for capitals, digits and a symbol" },
        { n: 10, shown: true, step: 3, text: "Common or leaked passwords refused with a reason", where: 'Try "password123"', broken: "a common password is accepted without a word" },
        { n: 11, shown: false, text: "Password managers can fill and save (autocomplete new-password)", where: 'The field is marked autocomplete="new-password"', broken: "the browser offers no strong password and may fill the old one" },
      ],
    },
    {
      title: "After",
      items: [
        { n: 12, shown: true, step: 4, text: "Signed in, or sent to login with a success message", where: '"Your password has been changed"', broken: "a bare login page with no word that it worked" },
        { n: 13, shown: true, step: 4, text: "Other sessions signed out, with the choice shown", where: "A ticked choice to sign out other devices", broken: "no choice; other devices stay signed in and nobody is told" },
        { n: 14, shown: true, step: 4, text: 'Email telling the person the password changed, with "This wasn\'t me"', where: "The change-notice email", broken: "no email, so a stranger's change goes unnoticed" },
      ],
    },
    {
      title: "Security",
      items: [
        { n: 15, shown: false, text: "Requests rate-limited", where: "Counted per address and per account on the server", broken: "anyone can ask for thousands of emails, or guess links" },
        { n: 16, shown: false, text: "Two-step check still asked if it was on", where: "A code is asked before the new password is saved", broken: "a reset skips the second step, so it opens a back door" },
        { n: 17, shown: false, text: "No security questions", where: "Nothing like \"first pet's name\" anywhere in the flow", broken: 'a security question on step 1, like "What was your first pet\'s name?"' },
      ],
    },
    {
      title: "Access",
      items: [
        { n: 18, shown: true, step: 3, text: "Fields named; no time pressure", where: "Visible labels, and a note that there is no timer", broken: "placeholder-only fields and a ticking clock" },
        { n: 19, shown: false, text: "Copy-paste allowed", where: "Paste works in the password field", broken: "paste blocked, so password managers fail" },
      ],
    },
  ],
};
