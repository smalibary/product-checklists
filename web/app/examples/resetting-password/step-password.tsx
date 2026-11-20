"use client";

import { useState } from "react";
import { CheckCircle, Circle, WarningCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { useStep } from "../../components/checklist-layer/step-context";
import { Button } from "../../components/kit/button";
import { FormLayout, FormMessage } from "../../components/kit/field";
import { PasswordField, usePasteNote } from "./password-field";
import { COMMON_REASON, hasForcedMix, isCommon, MIN_LENGTH } from "./passwords";

type Problem = { text: string; mix?: boolean };
type State = "idle" | "ok" | "bad";

function StateIcon({ state }: { state: State }) {
  if (state === "ok") return <CheckCircle size={18} aria-hidden="true" />;
  if (state === "bad") return <XCircle size={18} aria-hidden="true" />;
  return <Circle size={18} aria-hidden="true" />;
}

export function StepPassword() {
  const { isMet } = useMet();
  const { setStep } = useStep();
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [problem, setProblem] = useState<Problem | null>(null);
  const paste = usePasteNote();

  const long = pw.length >= MIN_LENGTH;
  const common = pw.length > 0 && isCommon(pw);
  const lengthState: State = pw === "" ? "idle" : long ? "ok" : "bad";
  const commonState: State = pw === "" ? "idle" : common ? "bad" : "ok";

  function submit() {
    if (!isMet(8) && pw !== again) return setProblem({ text: "The two passwords do not match." });
    if (!long) return setProblem({ text: `Use at least ${MIN_LENGTH} characters.` });
    if (!isMet(9) && !hasForcedMix(pw))
      return setProblem({
        text: "Password must have an uppercase letter, a lowercase letter, a number and a symbol.",
        mix: true,
      });
    if (isMet(10) && common) return setProblem({ text: COMMON_REASON });
    setProblem(null);
    setStep(4);
  }

  return (
    <div className="rp-step">
      <div className="rp-intro">
        <h2>Choose a new password</h2>
        <p>Something only you know. Lorem ipsum dolor sit amet.</p>
      </div>

      <Swap
        item={18}
        good={
          <p className="rp-calm">
            Take your time. This page has no timer, and the link works for 60 minutes.
          </p>
        }
        broken={
          <p className="rp-hurry">
            <WarningCircle size={18} aria-hidden="true" /> Hurry: this page expires in 4:59
          </p>
        }
      />

      <FormLayout
        label="Choose a new password"
        summary={false}
        onSent={submit}
        actions={
          <Button type="submit" kind="primary">
            Save new password
          </Button>
        }
      >
        <PasswordField
          value={pw}
          again={again}
          onValue={setPw}
          onAgain={setAgain}
          onPasteBlocked={paste.show}
        />

        <Collapse n={9} open={isMet(9) || !!problem?.mix}>
          {isMet(9) ? (
            <ul className="rp-rules" aria-label="Password rules">
              <li data-state={lengthState}>
                <StateIcon state={lengthState} />
                At least {MIN_LENGTH} characters
              </li>
              <li className="rp-rules-note">
                No capitals or symbols needed. A few random words work well.
              </li>
            </ul>
          ) : (
            <FormMessage>{problem?.text}</FormMessage>
          )}
        </Collapse>

        <Collapse n={10} open={isMet(10)}>
          <p className="rp-common" data-state={commonState} aria-live="polite">
            <StateIcon state={commonState} />
            <span>{common ? COMMON_REASON : "Not a common or leaked password"}</span>
          </p>
        </Collapse>

        {paste.shown && !isMet(19) && (
          <FormMessage>Pasting is switched off on this field.</FormMessage>
        )}
        {problem && !problem.mix && <FormMessage>{problem.text}</FormMessage>}
      </FormLayout>
    </div>
  );
}
