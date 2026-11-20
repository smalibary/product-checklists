import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { BlogPage } from "./blog-page";
import { checklistBlog } from "./checklist";
import "./blog.css";
import "./blog-parts.css";

export const metadata: Metadata = {
  title: "Blog example · Product Checklists",
};

export default function ExampleBlog() {
  return (
    <ChecklistLayer
      exampleId="blog"
      data={checklistBlog}
      kicker="Example · Blog"
      description="One article on a made-up blog, with the topic list, sharing, comments and an old post around it, built to the Blog checklist. Turn on the layer to see which part meets which item. Untick an item to see the blog without it."
    >
      <BlogPage />
    </ChecklistLayer>
  );
}
