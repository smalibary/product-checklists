"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
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
      <ExampleBar address={ADDRESS[step - 1]} />
      {step === 1 && <StepForgot />}
      {step === 2 && <StepEmail />}
      {step === 3 && <StepPassword />}
      {step === 4 && <StepDone />}
    </>
  );
}
