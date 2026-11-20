"use client";

import { ChatCircle, ShieldCheck, Warning } from "@phosphor-icons/react/dist/ssr";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input";
import { useMet } from "../../components/checklist-layer/met-context";
import { Variants } from "../../components/checklist-layer/swap";
import { useStep } from "../../components/checklist-layer/step-context";
import { Button } from "../../components/kit/button";
import { PhoneFrame } from "../../components/phone-frame/phone-frame";
import { Note } from "./note";

const CODE = "482913";

function Code({ filled }: { filled: boolean }) {
  return (
    <div className="ml-code">
      <OTPInput maxLength={6} defaultValue={filled ? CODE : ""} aria-label="Text code">
        <OTPInputGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <OTPInputSlot key={i} index={i} />
          ))}
        </OTPInputGroup>
      </OTPInput>
      <p className="ml-hint">{filled ? "Filled in from your message." : "Type the 6-digit code from your message."}</p>
    </div>
  );
}

// Item 16 is the "extra check" line, item 4 the code boxes. The second phone is the messages app.
export function StepCode() {
  const { isMet } = useMet();
  const { setStep } = useStep();
  return (
    <div className="ml-desk">
      <PhoneFrame label="The app, text code screen">
        <form
          className="ml-screen"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(6);
          }}
        >
          <header className="ml-head">
            <h2>Enter your code</h2>
            <p>We sent a text to +00 000 000 000.</p>
          </header>
          <Variants
            item={16}
            active={isMet(16) ? "good" : "broken"}
            parts={{
              good: <Note icon={<ShieldCheck size={18} weight="fill" />}>Extra check: this sign-in is from a new place.</Note>,
              broken: <Note tone="bad" icon={<Warning size={18} weight="fill" />}>Signed in from a new place with no extra check.</Note>,
            }}
          />
          <Field className="kit-field">
            <FieldLabel>Text code</FieldLabel>
            <Variants item={4} active={isMet(4) ? "good" : "broken"} parts={{ good: <Code filled />, broken: <Code filled={false} /> }} />
          </Field>
          <Button type="submit" kind="primary" size="lg" className="ml-wide">
            Continue
          </Button>
        </form>
      </PhoneFrame>

      <PhoneFrame label="The messages app">
        <div className="ml-screen ml-sms">
          <header className="ml-sms-head">
            <ChatCircle size={18} weight="fill" aria-hidden="true" />
            <strong>Messages</strong>
            <span>Example</span>
          </header>
          <p className="ml-bubble">
            Your Lorem Ipsum code is <strong>{CODE}</strong>. It expires in 10 minutes. Do not share it.
          </p>
          <p className="ml-sms-time">Today 9:41</p>
        </div>
      </PhoneFrame>
    </div>
  );
}
