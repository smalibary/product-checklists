"use client";

import { useStep } from "../../components/checklist-layer/step-context";
import { StepCode } from "./step-code";
import { StepDone } from "./step-done";
import { StepProblem, type Problem } from "./step-problem";
import { StepSignin } from "./step-signin";

const PROBLEMS: Record<number, Problem> = { 2: "wrong", 3: "locked", 4: "offline" };

export function LoginFlow() {
  const { step } = useStep();
  return (
    <>
      {step === 1 && <StepSignin />}
      {PROBLEMS[step] && <StepProblem key={step} kind={PROBLEMS[step]} />}
      {step === 5 && <StepCode />}
      {step === 6 && <StepDone />}
    </>
  );
}
