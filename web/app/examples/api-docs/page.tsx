import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistApiDocs } from "./checklist";
import { ApiDocs } from "./docs";
import "./api-docs.css";
import "./api-docs-parts.css";

export const metadata: Metadata = {
  title: "API docs example · Product Checklists",
};

export default function ExampleApiDocs() {
  return (
    <ChecklistLayer
      exampleId="api-docs"
      data={checklistApiDocs}
      kicker="Example · API docs"
      description="An API reference page for a made-up service, built to the API docs checklist. Turn on the layer to see which part meets which item. Untick an item to see the page without it."
    >
      <ApiDocs />
    </ChecklistLayer>
  );
}
