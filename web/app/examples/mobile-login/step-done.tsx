"use client";

import { CheckCircle, LockKey, Warning } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Variants } from "../../components/checklist-layer/swap";
import { MailFrame } from "../../components/mail-frame/mail-frame";
import { PhoneFrame } from "../../components/phone-frame/phone-frame";
import { Note } from "./note";

// Item 11 has no spot (it cannot be seen); its line on the screen shows where the session is kept.
// Item 17 is the alert email, in its own mail window.
export function StepDone() {
  const { isMet } = useMet();
  return (
    <div className="ml-desk">
      <PhoneFrame label="The app, signed in">
        <div className="ml-screen">
          <header className="ml-head ml-done">
            <CheckCircle size={40} weight="fill" aria-hidden="true" />
            <h2>You are in</h2>
            <p>Welcome back to Lorem Ipsum.</p>
          </header>
          {isMet(11) ? (
            <Note icon={<LockKey size={18} weight="fill" />}>Session kept in the phone&rsquo;s secure storage.</Note>
          ) : (
            <Note tone="bad" icon={<Warning size={18} weight="fill" />}>Session kept as plain text in the app&rsquo;s files.</Note>
          )}
        </div>
      </PhoneFrame>

      <div className="ml-mail">
        <Variants
          item={17}
          active={isMet(17) ? "good" : "broken"}
          parts={{
            good: (
              <MailFrame
                message={{ from: "security@example.com", subject: "New sign-in to your account", to: "name@example.com", time: "9:41" }}
              >
                <p>We noticed a sign-in from a new phone.</p>
                <p>If this was you, you do not need to do anything. If it was not, reset your password now.</p>
              </MailFrame>
            ),
            broken: (
              <MailFrame>
                <p className="mf-empty">No new messages. Nothing was sent about this sign-in.</p>
              </MailFrame>
            ),
          }}
        />
      </div>
    </div>
  );
}
