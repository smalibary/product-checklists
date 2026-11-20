import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistReadmeDocs } from "./checklist";
import { RepoPage } from "./repo-page";
import "./readme-docs.css";
import "./readme-docs-parts.css";

export const metadata: Metadata = {
  title: "README and docs example · Product Checklists",
};

export default function ExampleReadmeDocs() {
  return (
    <ChecklistLayer
      exampleId="readme-docs"
      data={checklistReadmeDocs}
      kicker="Example · README and code docs"
      description="A project home page for a made-up library, built to the README and code docs checklist. Turn on the layer to see which part meets which item. Untick an item to see the page without it."
    >
      <RepoPage />
    </ChecklistLayer>
  );
}
