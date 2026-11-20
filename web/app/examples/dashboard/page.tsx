import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistDashboard } from "./checklist";
import { Dashboard } from "./dashboard";
import "./dashboard.css";
import "./db-kpis.css";
import "./db-parts.css";
import "./db-states.css";

export const metadata: Metadata = {
  title: "Dashboard example · Product Checklists",
};

const steps = [
  { n: 1, label: "Dashboard" },
  { n: 2, label: "Loading" },
  { n: 3, label: "New account" },
  { n: 4, label: "A card fails" },
];

export default function ExampleDashboard() {
  return (
    <ChecklistLayer
      exampleId="dashboard"
      data={checklistDashboard}
      steps={steps}
      kicker="Example · Dashboard"
      description="A made-up operations dashboard, built to the dashboard checklist. The four tabs show it loading, empty and failing; turn on the layer to see which part meets which item, and untick an item to see the dashboard without it."
    >
      <Dashboard />
    </ChecklistLayer>
  );
}
