import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistMicro } from "./checklist";
import { MicroPage } from "./micro-page";
import "./micro.css";
import "./micro-parts.css";

export const metadata: Metadata = {
  title: "Micro-interactions example · Product Checklists",
};

export default function ExampleMicro() {
  return (
    <ChecklistLayer
      exampleId="micro-interactions"
      data={checklistMicro}
      kicker="Example · Micro-interactions"
      description="The small answers to a single action, built to the Micro-interactions checklist: press, switch, like, copy, hover, a repeated task and keyboard focus. All timing is the shared motion part. Turn on the layer to see which part meets which item. Untick an item to see the page without it."
    >
      <MicroPage />
    </ChecklistLayer>
  );
}
