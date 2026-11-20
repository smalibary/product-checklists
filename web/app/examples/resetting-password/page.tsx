import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistReset } from "./checklist";
import { ResetFlow } from "./flow";
import "./resetting-password.css";
import "./rp-parts.css";

export const metadata: Metadata = {
  title: "Resetting password example · Product Checklists",
};

const steps = [
  { n: 1, label: "Forgot password" },
  { n: 2, label: "Check your email" },
  { n: 3, label: "New password" },
  { n: 4, label: "Done" },
];

export default function ExampleResettingPassword() {
  return (
    <ChecklistLayer
      exampleId="resetting-password"
      data={checklistReset}
      steps={steps}
      kicker="Example · Resetting password"
      description="The reset flow of a made-up website, built to the resetting-password checklist. Move through the four steps, turn on the layer to see which part meets which item, and untick an item to see its step without it."
    >
      <ResetFlow />
    </ChecklistLayer>
  );
}
