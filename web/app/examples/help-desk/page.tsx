import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistHelpDesk } from "./checklist";
import { HelpPage } from "./help-page";
import "./help.css";
import "./help-parts.css";

export const metadata: Metadata = {
  title: "Help desk example · Product Checklists",
};

export default function ExampleHelpDesk() {
  return (
    <ChecklistLayer
      exampleId="help-desk"
      data={checklistHelpDesk}
      kicker="Example · Help desk"
      description="A made-up help centre, built to the Help desk checklist: contact options on every page, top articles, a request form that asks the right details, a reference and reply time, targets by priority, the routing and progress of an open ticket, its history, a privacy note and a complaints review. Turn on the layer to see which part meets which item. Untick an item to see the page without it."
    >
      <HelpPage />
    </ChecklistLayer>
  );
}
