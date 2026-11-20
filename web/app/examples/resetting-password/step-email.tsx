"use client";

import { useEffect, useState } from "react";
import { Button } from "@ui-sdk/react/button";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { useStep } from "../../components/checklist-layer/step-context";
import { MailCard } from "./mail-card";

const WAIT = 15;

export function StepEmail() {
  const { isMet } = useMet();
  const { setStep } = useStep();
  const [left, setLeft] = useState(WAIT);
  const [again, setAgain] = useState(false);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const open = (
    <Button type="button" data-variant="solid" onClick={() => setStep(3)}>
      Choose a new password
    </Button>
  );

  return (
    <div className="rp-step">
      <div className="rp-intro">
        <h2>Check your email</h2>
        <p>
          We sent a link to <strong>name@example.com</strong>. It works once and expires in 60
          minutes.
        </p>
      </div>

      <Swap
        item={5}
        good={
          <MailCard subject="Reset your password">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Use the button to choose a new password.</p>
            {open}
            <p className="rp-mail-small">Did not ask for this? Ignore this email; nothing changes.</p>
          </MailCard>
        }
        broken={
          <section className="rp-linkbox">
            <p>Your reset link</p>
            <code>example.com/reset?token=7f3a9c2e41</code>
            {open}
          </section>
        }
      />

      <Collapse n={6} open={isMet(6)}>
        <div className="rp-resend">
          <Button
            type="button"
            disabled={left > 0}
            onClick={() => {
              setAgain(true);
              setLeft(WAIT);
            }}
          >
            {left > 0 ? `Resend in 0:${String(left).padStart(2, "0")}` : "Resend email"}
          </Button>
          <output>{again ? "Sent again. Check your inbox." : "Nothing arrived? You can ask again soon."}</output>
        </div>
      </Collapse>
    </div>
  );
}
