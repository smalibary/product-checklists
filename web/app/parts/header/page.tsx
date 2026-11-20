import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistHeader } from "./checklist";
import { HeaderDemo } from "./header-demo";
import "../parts.css";

export const metadata: Metadata = {
  title: "Header (shared part) · Product Checklists",
};

export default function PartHeader() {
  return (
    <ChecklistLayer
      exampleId="part-header"
      data={checklistHeader}
      kicker="Shared part · Header"
      description="The one header every page of the examples uses, built to the header checklist: wide, phone width, sticky, and the slim and app variants. Turn on the layer to see which part meets which item; untick an item to see the header without it."
    >
      <HeaderDemo />
    </ChecklistLayer>
  );
}
