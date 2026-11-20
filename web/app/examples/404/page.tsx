import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklist404 } from "./checklist";
import { Site404 } from "./site-404";
import "./404.css";

export const metadata: Metadata = {
  title: "404 page example · Product Checklists",
};

export default function Example404() {
  return (
    <ChecklistLayer
      exampleId="404"
      data={checklist404}
      kicker="Example · 404 page"
      description="A 404 page for a made-up website, built to the 404 checklist. Turn on the layer to see which part meets which item. Untick an item to see the page without it."
    >
      <Site404 />
    </ChecklistLayer>
  );
}
