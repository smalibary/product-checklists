import type { ChecklistItem } from "../../components/checklist-layer/types";

// Checklist item helpers for the Shared parts pages. "spot" is an item with a numbered spot on the
// page; "grey" is an item that cannot be pointed at (code, labels, process), so it has no badge.
export const spot = (n: number, text: string, where: string, broken: string): ChecklistItem => ({ n, shown: true, text, where, broken });
export const grey = (n: number, text: string, where: string, broken: string): ChecklistItem => ({ n, shown: false, text, where, broken });
