import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistModal } from "./checklist";
import { ModalFlow } from "./flow";
import "./modal.css";

export const metadata: Metadata = {
  title: "Modal example · Product Checklists",
};

const steps = [
  { n: 1, label: "Confirm delete" },
  { n: 2, label: "Unsaved changes" },
  { n: 3, label: "Phone sheet" },
  { n: 4, label: "Long text" },
];

export default function ExampleModal() {
  return (
    <ChecklistLayer
      exampleId="modal"
      data={checklistModal}
      steps={steps}
      kicker="Example · Modal"
      description="A modal window over a made-up page, built to the modal checklist. Move through the four cases, turn on the layer to see which part meets which item, and untick an item to see the window without it. Press Escape or the dimmed page to close it."
    >
      <ModalFlow />
    </ChecklistLayer>
  );
}
