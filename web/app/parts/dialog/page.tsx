import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { DialogDemo } from "./dialog-demo";
import { checklistDialog } from "./checklist";
import "../parts.css";

export const metadata: Metadata = {
  title: "Dialog (shared part) · Product Checklists",
};

export default function PartDialog() {
  return (
    <ChecklistLayer
      exampleId="part-dialog"
      data={checklistDialog}
      kicker="Shared part · Dialog"
      description="The only windows the examples use, built to the modal checklist: a named title and close button, a dimmed backdrop, a body that scrolls inside, and a centred card. The first window is drawn on the page so the layer can mark it; the button below opens the real one. Untick an item to see the plain version."
    >
      <DialogDemo />
    </ChecklistLayer>
  );
}
