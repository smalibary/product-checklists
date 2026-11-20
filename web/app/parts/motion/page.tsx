import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistMotion } from "./checklist";
import { AccessDemo } from "./access-demo";
import { MicroDemo } from "./micro-demo";
import { MotionDemo } from "./motion-demo";
import "../parts.css";

export const metadata: Metadata = {
  title: "Motion (shared part) · Product Checklists",
};

export default function PartMotion() {
  return (
    <ChecklistLayer
      exampleId="part-motion"
      data={checklistMotion}
      kicker="Shared part · Motion"
      description="The one set of motion rules every example reads: named durations and curves, one transition for each job, small responses to presses, and a calm version. Untick an item to see the page without it. Turn on Calm mode, or reduced motion on your device, and every example follows."
    >
      <MotionDemo />
      <div className="pt" style={{ paddingTop: 0 }}>
        <p className="pt-cap">Small responses</p>
        <MicroDemo />
        <p className="pt-cap">Accessibility</p>
        <AccessDemo />
      </div>
    </ChecklistLayer>
  );
}
