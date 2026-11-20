import type { ChecklistData } from "../../components/checklist-layer/types";

// "step" is the step whose screen holds the item's spot (1 Sign in, 2 Wrong details, 3 Locked out,
// 4 Offline, 5 Text code, 6 Signed in). "broken" finishes the rail line "Visitors would see: ...".
export const checklistMobileLogin: ChecklistData = {
  title: "Login (mobile)",
  note: "18 items. Untick one to see the screen without it. The six steps above the phone show the other screens. Grey numbers cannot be pointed at, so they have no badge here.",
  groups: [
    {
      title: "Ways in",
      items: [
        { n: 1, shown: true, step: 1, text: "Passkeys offered where supported", where: 'A "Continue with a passkey" button at the top', broken: "no passkey button; people who use a passkey have to type a password" },
        { n: 2, shown: true, step: 1, text: "Sign in with Apple on iOS if other social sign-ins are offered", where: '"Continue with Apple" under the passkey button', broken: "other social sign-ins but no Apple button, which Apple's own rules do not allow on iOS" },
        { n: 3, shown: true, step: 1, text: "Google sign-in through the system Credential Manager on Android", where: '"Continue with Google", which opens the phone\'s own account sheet', broken: "no Google button, or a web pop-up that takes people out of the app" },
        { n: 4, shown: true, step: 5, text: "Phone number with SMS code, with the code autofilled from the message", where: "The six code boxes fill themselves from the text message", broken: "empty boxes; people read the message and type the code by hand" },
      ],
    },
    {
      title: "Fields",
      items: [
        { n: 5, shown: true, step: 1, text: "Email or phone field with the right keyboard and autofill type", where: "The keyboard has an @ key and offers the saved address above it", broken: "a plain keyboard with no @ key and no saved address" },
        { n: 6, shown: true, step: 1, text: "Password field works with password managers (no blocked paste)", where: "The password field accepts a pasted or saved password", broken: "paste is blocked, so a saved password cannot be filled in" },
        { n: 7, shown: true, step: 1, text: "Show password button", where: '"Show" at the end of the password field', broken: "no way to check what was typed on a small keyboard" },
        { n: 8, shown: true, step: 1, text: "Login button stays usable; errors after submit", where: "The Log in button is always tappable; missing details are explained after the press", broken: "a greyed-out button that never says what is missing" },
      ],
    },
    {
      title: "Remember",
      items: [
        { n: 9, shown: true, step: 1, text: "Stay signed in by default on a personal phone", where: '"Stay signed in" is already ticked', broken: "unticked, so people are signed out and log in again every time" },
        { n: 10, shown: true, step: 1, text: "Face ID or fingerprint to unlock the app later, as an option", where: '"Unlock with Face ID next time", a switch that starts off', broken: "no quick unlock; the password is asked for every time" },
        { n: 11, shown: false, step: 6, text: "Tokens kept in the Keychain or Keystore, not plain storage", where: "Cannot be seen. The signed-in screen has a line saying where the session is kept", broken: "the session saved as plain text in the app's files, where other apps and backups can read it" },
      ],
    },
    {
      title: "Errors and help",
      items: [
        { n: 12, shown: true, step: 2, text: "One general message for wrong email or password", where: "One message that does not say which of the two was wrong", broken: "a message saying the password is wrong, which tells an attacker the email has an account" },
        { n: 13, shown: true, step: 1, text: "Forgot password link near the field", where: '"Forgot password?" right under the password field', broken: "no link; people give up or make a second account" },
        { n: 14, shown: true, step: 3, text: "Too many tries: wait time shown, not a dead end", where: "A message with the wait time, a counting button and a reset link", broken: '"Your account is locked" with no time and no way out' },
        { n: 15, shown: true, step: 4, text: "Offline: say so, keep what was typed", where: "A banner says you are offline; the email and password stay in the fields", broken: '"Something went wrong" and empty fields to type again' },
      ],
    },
    {
      title: "Security",
      items: [
        { n: 16, shown: true, step: 5, text: "Two-step check where risk is high", where: 'An "Extra check" line above the code, because the sign-in is from a new place', broken: "a new place gets in with only a password and no extra check" },
        { n: 17, shown: true, step: 6, text: "New device sign-in alert by email", where: "A security email in its own mail window", broken: "no email; the owner never learns someone else signed in" },
      ],
    },
    {
      title: "Access",
      items: [
        { n: 18, shown: true, step: 1, text: "Large text supported; keyboard never covers the button", where: "The keyboard sits below; the Log in button stays above it", broken: "the keyboard slides up over the Log in button" },
      ],
    },
  ],
};
