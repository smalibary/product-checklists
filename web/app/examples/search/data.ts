// The made-up records the search example looks through. Generic on purpose.

export type RecordType = "Guide" | "Report" | "Note";
export type Rec = { id: number; title: string; body: string; type: RecordType; date: string; private?: boolean };

export const RECORDS: Rec[] = [
  { id: 1, title: "Invoice template", body: "Lorem ipsum invoice layout. Each invoice ends with a receipt line and a total.", type: "Guide", date: "2026-06-10" },
  { id: 2, title: "Quick start guide", body: "Dolor sit amet, a first call in five minutes.", type: "Guide", date: "2026-11-01" },
  { id: 3, title: "Receipt archive 2025", body: "Every receipt sent during the year, kept for reference.", type: "Report", date: "2026-01-30" },
  { id: 4, title: "Team holiday plan", body: "Consectetur adipiscing elit, who is away and when.", type: "Note", date: "2026-10-20" },
  { id: 5, title: "Receipt numbering rules", body: "How receipt numbers are chosen and never reused.", type: "Note", date: "2026-08-14" },
  { id: 6, title: "Password reset steps", body: "Sed do eiusmod tempor, how to reset a password safely.", type: "Guide", date: "2026-07-02" },
  { id: 7, title: "Lost receipt checklist", body: "What to do when a customer says a receipt never arrived.", type: "Note", date: "2026-09-21" },
  { id: 8, title: "Annual summary", body: "Lorem ipsum totals for the year, with a count of every receipt.", type: "Report", date: "2026-03-03" },
  { id: 9, title: "Receipt email settings", body: "Change the sender name and the subject of each receipt email.", type: "Guide", date: "2026-11-12" },
  { id: 10, title: "Monthly receipt report", body: "Receipts issued per day, with refunds in a separate column.", type: "Report", date: "2026-11-18" },
  { id: 11, title: "How to send a receipt", body: "Send a receipt by email or print it, in three steps.", type: "Guide", date: "2026-11-05" },
  { id: 12, title: "Receipt dispute notes", body: "Notes from a dispute, kept for the person who wrote them.", type: "Note", date: "2026-11-10", private: true },
  { id: 13, title: "Receipts reviewed by finance", body: "A private review of receipts that were questioned.", type: "Report", date: "2026-10-15", private: true },
  { id: 14, title: "Meeting notes", body: "Ut enim ad minim veniam, what was agreed on Monday.", type: "Note", date: "2026-11-17" },
  { id: 15, title: "إِيصَالُ الدَّفْعِ", body: "دليل قصير لإرسال الإيصال بالبريد", type: "Guide", date: "2026-09-09" },
];

export const TYPES: { value: "all" | RecordType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Guide", label: "Guides" },
  { value: "Report", label: "Reports" },
  { value: "Note", label: "Notes" },
];

// One-press searches that show what an item does. "ايصال" is the Arabic word for receipt, typed
// without any letter marks.
export const TRIES = [
  { label: "reciept (a typo)", q: "reciept" },
  { label: "ايصال (Arabic)", q: "ايصال" },
  { label: "' OR 1=1 --", q: "' OR 1=1 --" },
  { label: "A very long search", q: "receipt ".repeat(18).trim() },
  { label: "zzzz (no results)", q: "zzzz" },
];

export const PAGE_SIZE = 5;
export const MAX_QUERY = 60;
