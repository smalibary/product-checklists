import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { LikeDemo } from "./like-demo";
import { checklistLike } from "./checklist";
import "../parts.css";
import "./like.css";

export const metadata: Metadata = {
  title: "Like button (shared part) · Product Checklists",
};

export default function PartLike() {
  return (
    <ChecklistLayer
      exampleId="part-like"
      data={checklistLike}
      kicker="Shared part · Like button"
      description="The only like button the examples use: the heart fills and grows a little, the count follows, and the keyboard ring stays. All timing comes from the shared motion part. Untick an item to see the plain version."
    >
      <LikeDemo />
    </ChecklistLayer>
  );
}
