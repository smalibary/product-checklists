import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { ButtonDemo } from "./button-demo";
import { checklistButton } from "./checklist";
import { SegmentedDemo } from "./segmented-demo";
import "../parts.css";

export const metadata: Metadata = {
  title: "Button (shared part) · Product Checklists",
};

export default function PartButton() {
  return (
    <ChecklistLayer
      exampleId="part-button"
      data={checklistButton}
      kicker="Shared part · Button and button group"
      description="The only buttons the examples use, built to the button and segmented control checklists: four kinds, three sizes, every state, a button group with the main action last, and a segmented control. Untick an item to see the plain version."
    >
      <ButtonDemo />
      <div className="pt" style={{ paddingTop: 0 }}>
        <p className="pt-cap">Segmented control</p>
        <SegmentedDemo />
      </div>
    </ChecklistLayer>
  );
}
