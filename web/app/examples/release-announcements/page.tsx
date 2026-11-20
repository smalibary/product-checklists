import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistRelease } from "./checklist";
import { ReleasePage } from "./release-page";
import "./release.css";
import "./release-parts.css";

export const metadata: Metadata = {
  title: "Release announcements example · Product Checklists",
};

export default function ExampleRelease() {
  return (
    <ChecklistLayer
      exampleId="release-announcements"
      data={checklistRelease}
      kicker="Example · Release announcements"
      description="A made-up What's new post for one release, built to the Release announcements checklist: a version and date, breaking changes first, changes grouped for readers, an in-product tip that does not block, an opt-in email sign-up, store text and a rollout that finished before the post. Turn on the layer to see which part meets which item. Untick an item to see the page without it."
    >
      <ReleasePage />
    </ChecklistLayer>
  );
}
