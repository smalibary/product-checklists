import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistMonitoring } from "./checklist";
import { MonitoringPage } from "./monitoring-page";
import "./monitoring.css";
import "./monitoring-parts.css";

export const metadata: Metadata = {
  title: "Monitoring and alerts example · Product Checklists",
};

export default function ExampleMonitoring() {
  return (
    <ChecklistLayer
      exampleId="monitoring-alerts"
      data={checklistMonitoring}
      kicker="Example · Monitoring and alerts"
      description="A made-up on-call overview for one service, built to the Monitoring and alerts checklist: the four signals, an objective, checks from outside, alerts that link to a runbook, a trace, a public notice and paid usage. Turn on the layer to see which part meets which item. Untick an item to see the page without it."
    >
      <MonitoringPage />
    </ChecklistLayer>
  );
}
