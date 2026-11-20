import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistFooter } from "./checklist";
import { FooterDemo } from "./footer-demo";
import "../parts.css";

export const metadata: Metadata = {
  title: "Footer (shared part) · Product Checklists",
};

export default function PartFooter() {
  return (
    <ChecklistLayer
      exampleId="part-footer"
      data={checklistFooter}
      kicker="Shared part · Footer"
      description="The one footer every page of the examples uses, built to the footer checklist: the full footer and the slim one for sign-in pages. Turn on the layer to see which part meets which item; untick an item to see the footer without it."
    >
      <FooterDemo />
    </ChecklistLayer>
  );
}
