import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistMobileLogin } from "./checklist";
import { LoginFlow } from "./flow";
import "./mobile-login.css";
import "./ml-parts.css";

export const metadata: Metadata = {
  title: "Mobile login example · Product Checklists",
};

const steps = [
  { n: 1, label: "Sign in" },
  { n: 2, label: "Wrong details" },
  { n: 3, label: "Locked out" },
  { n: 4, label: "Offline" },
  { n: 5, label: "Text code" },
  { n: 6, label: "Signed in" },
];

export default function ExampleMobileLogin() {
  return (
    <ChecklistLayer
      exampleId="mobile-login"
      data={checklistMobileLogin}
      steps={steps}
      kicker="Example · Mobile login"
      description="The sign-in screens of a made-up phone app, built to the mobile login checklist. Move through the six screens, turn on the layer to see which part meets which item, and untick an item to see the screen without it."
    >
      <LoginFlow />
    </ChecklistLayer>
  );
}
