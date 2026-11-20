import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { LinkDemo } from "./link-demo";
import { checklistLink } from "./checklist";
import "../parts.css";

export const metadata: Metadata = {
  title: "Link (shared part) · Product Checklists",
};

export default function PartLink() {
  return (
    <ChecklistLayer
      exampleId="part-link"
      data={checklistLink}
      kicker="Shared part · Link"
      description="The only links the examples use, built to the link checklist: underlined, visited, focus, clear words, files and new tabs announced, strong contrast and a big enough tap area. Untick an item to see the plain version."
    >
      <LinkDemo />
    </ChecklistLayer>
  );
}
