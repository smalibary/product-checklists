import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistField } from "./checklist";
import { FieldDemo } from "./field-demo";
import { FormDemo } from "./form-demo";
import "../parts.css";

export const metadata: Metadata = {
  title: "Input field and form (shared part) · Product Checklists",
};

export default function PartField() {
  return (
    <ChecklistLayer
      exampleId="part-field"
      data={checklistField}
      kicker="Shared part · Input field and form layout"
      description="The only fields and forms the examples use, built to the input field and form layout checklists: label, hint, error, prefix, count, every state, and a one-column form with an error summary. Untick an item to see the plain version."
    >
      <FieldDemo />
      <FormDemo />
    </ChecklistLayer>
  );
}
