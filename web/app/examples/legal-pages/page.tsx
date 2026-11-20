import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistLegal } from "./checklist";
import { LegalPage } from "./legal-page";
import "./legal-pages.css";
import "./legal-pages-parts.css";

export const metadata: Metadata = {
  title: "Legal pages example · Product Checklists",
};

export default function ExampleLegalPages() {
  return (
    <ChecklistLayer
      exampleId="legal-pages"
      data={checklistLegal}
      kicker="Example · Legal pages"
      description="The legal pack of a made-up company on one page, built to the Legal pages checklist. All the text is made up and is not legal advice. Turn on the layer to see which part meets which item. Untick an item to see the page without it."
    >
      <LegalPage />
    </ChecklistLayer>
  );
}
