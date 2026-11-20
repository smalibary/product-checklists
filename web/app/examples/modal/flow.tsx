"use client";

import { useState } from "react";
import { useMet } from "../../components/checklist-layer/met-context";
import { useStep } from "../../components/checklist-layer/step-context";
import { ExampleBar } from "../../components/example-frame/example-bar";
import { ModalStage, type ModalPlace } from "../../components/kit/dialog";
import { PhoneFrame } from "../../components/phone-frame/phone-frame";
import { DeleteCard, EditCard, TermsCard } from "./cards";
import { DeskPage, PhonePage } from "./pages-behind";

const OPENERS = { 1: "Delete project", 2: "Rename project", 3: "Delete project", 4: "Show terms" } as const;

// One screen per step: the made-up page with the modal open over it. Items that cannot be seen
// (Escape, a press on the backdrop, focus, inert, the page not scrolling) still work here, and
// stop working when their item is unticked.
function Scene({ step }: { step: 1 | 2 | 3 | 4 }) {
  const { isMet } = useMet();
  const [open, setOpen] = useState(true);
  const done = () => setOpen(false);
  const phone = step === 3;

  // Item 12 unticked: no margins. Item 10 unticked: pinned in a corner, never a sheet.
  const base: ModalPlace = phone ? "sheet" : "center";
  const place: ModalPlace = !isMet(12) ? "wide" : !isMet(10) ? "corner" : base;
  // On the edit step an unsaved-changes warning is showing, so Escape and a backdrop press do not
  // close it (with the warning unticked they do, and the typed changes are lost).
  const guarded = step === 2 && isMet(15);

  const card = step === 2 ? <EditCard onDone={done} /> : step === 4 ? <TermsCard onDone={done} /> : <DeleteCard onDone={done} />;
  const opener = OPENERS[step];
  const onOpen = () => setOpen(true);
  const stage = (
    <ModalStage
      open={open}
      page={phone ? <PhonePage opener={opener} onOpen={onOpen} /> : <DeskPage opener={opener} onOpen={onOpen} />}
      place={place}
      dim={isMet(9)}
      inert={isMet(23)}
      scrollsBehind={!isMet(17)}
      unbounded={step === 4 && !isMet(6)}
      dimSpot={9}
      cardSpot="10 12"
      onEscape={isMet(13) && !guarded ? done : undefined}
      onBackdrop={isMet(14) && !guarded && step !== 4 ? done : undefined}
      focusIn={isMet(18)}
      focusBack={isMet(20)}
    >
      {card}
    </ModalStage>
  );

  if (phone) {
    return (
      <div className="mx-phone">
        <PhoneFrame label="A phone showing a modal as a bottom sheet">{stage}</PhoneFrame>
      </div>
    );
  }
  return (
    <>
      <ExampleBar address="example.com/projects" />
      {stage}
    </>
  );
}

export function ModalFlow() {
  const { step } = useStep();
  const n = (step >= 1 && step <= 4 ? step : 1) as 1 | 2 | 3 | 4;
  return <Scene key={n} step={n} />;
}
