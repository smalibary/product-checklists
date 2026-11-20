"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@ui-sdk/react/button";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap, Variants } from "../../components/checklist-layer/swap";
import { ExampleBar } from "../../components/example-frame/example-bar";
import { MailFrame } from "../../components/mail-frame/mail-frame";

export function StepDone() {
  const { isMet } = useMet();
  const [reported, setReported] = useState(false);

  return (
    <div className="rp-desk">
      <div className="rp-browser">
        <ExampleBar address="example.com/reset-password/done" />
        <div className="rp-step">
          <Swap
            item={12}
            good={
              <div className="rp-intro rp-done">
                <CheckCircle size={32} weight="fill" aria-hidden="true" />
                <h2>Your password has been changed</h2>
                <p>You are signed in on this device. Lorem ipsum dolor sit amet.</p>
              </div>
            }
            broken={
              <div className="rp-intro">
                <h2>Log in</h2>
                <p>Enter your email and password.</p>
              </div>
            }
          />

          <Collapse n={13} open={isMet(13)}>
            <label data-slot="label" className="rp-signout">
              <Checkbox defaultChecked>
                <CheckboxIndicator />
              </Checkbox>
              <span>
                Sign out of other devices
                <small>
                  Anyone still using the old password on another phone or computer is signed out.
                </small>
              </span>
            </label>
          </Collapse>
        </div>
      </div>

      <div className="rp-mailslot">
        <Variants
          item={14}
          active={isMet(14) ? "good" : "broken"}
          parts={{
            good: (
              <MailFrame
                message={{
                  from: "Example <no-reply@example.com>",
                  subject: "Your password was changed",
                  to: "name@example.com",
                  time: "09:43",
                }}
              >
                <p>
                  The password for name@example.com was changed just now. If that was you, there is
                  nothing to do.
                </p>
                <Button type="button" onClick={() => setReported(true)}>
                  This wasn&rsquo;t me
                </Button>
                <output className="rp-mail-small">
                  {reported ? "On a real site this would lock the account and start a safe recovery." : ""}
                </output>
              </MailFrame>
            ),
            broken: (
              <MailFrame>
                <p className="mf-empty">No new messages. Nothing was sent.</p>
              </MailFrame>
            ),
          }}
        />
      </div>
    </div>
  );
}
