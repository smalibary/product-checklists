import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklistSearch } from "./checklist";
import { SearchApp } from "./search-app";
import "./search.css";

export const metadata: Metadata = {
  title: "Search example · Product Checklists",
};

export default function ExampleSearch() {
  return (
    <ChecklistLayer
      exampleId="search"
      data={checklistSearch}
      kicker="Example · Search (server)"
      description="A search page over made-up records, built to the server search checklist. Turn on the layer to see which part meets which item. Untick an item to see the search without it."
    >
      <SearchApp />
    </ChecklistLayer>
  );
}
