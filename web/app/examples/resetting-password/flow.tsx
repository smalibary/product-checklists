"use client";

import { BrowserPage } from "./browser-page";
import { useStep } from "../../components/checklist-layer/step-context";
import { StepDone } from "./step-done";
import { StepEmail } from "./step-email";
import { StepForgot } from "./step-forgot";
import { StepPassword } from "./step-password";

const ADDRESS = [
  "example.com/forgot-password",
  "example.com/forgot-password",
  "example.com/reset-password",
  "example.com/reset-password/done",
];

export function ResetFlow() {
  const { step } = useStep();
  return (
    <>
      {step === 1 && (
        <BrowserPage address={ADDRESS[0]}>
          <StepForgot />
        </BrowserPage>
      )}
      {step === 2 && <StepEmail />}
      {step === 3 && (
        <BrowserPage address={ADDRESS[2]}>
          <StepPassword />
        </BrowserPage>
      )}
      {step === 4 && <StepDone />}
    </>
  );
}
