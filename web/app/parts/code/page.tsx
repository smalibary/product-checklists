import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { CodeDemo } from "./code-demo";
import { checklistCode } from "./checklist";
import "../parts.css";
import "./code.css";

export const metadata: Metadata = {
  title: "Code block (shared part) · Product Checklists",
};

export default function PartCode() {
  return (
    <ChecklistLayer
      exampleId="part-code"
      data={checklistCode}
      kicker="Shared part · Code block"
      description="The only code block the examples use, with its Copy button: monospaced, readable, scrolls inside its own box, reachable by keyboard, and says Copied. Untick an item to see the plain version."
    >
      <CodeDemo />
    </ChecklistLayer>
  );
}
