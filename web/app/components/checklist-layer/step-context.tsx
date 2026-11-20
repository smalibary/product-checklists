"use client";

import { createContext, useContext } from "react";

type StepValue = { step: number; setStep: (n: number) => void };

export const StepContext = createContext<StepValue>({ step: 1, setStep: () => {} });

// A flow example calls this to know which step is on show, and to move to another.
export function useStep() {
  return useContext(StepContext);
}
