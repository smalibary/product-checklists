// All the made-up content of the API docs example in one place. Generic on purpose.

export const TEST_KEY = "test_key_8f3a1c92d7";
export const PLACEHOLDER_KEY = "YOUR_API_KEY";

export type Lang = "curl" | "javascript" | "python";

export const LANGS: { value: Lang; label: string }[] = [
  { value: "curl", label: "curl" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
];

export function sample(lang: Lang, key: string): string {
  if (lang === "curl") {
    return `curl https://api.example.com/v2/orders \\
  -H "Authorization: Bearer ${key}" \\
  -G -d customer=cus_2041 -d status=open -d limit=2`;
  }
  if (lang === "javascript") {
    return `const res = await fetch(
  "https://api.example.com/v2/orders?customer=cus_2041&status=open&limit=2",
  { headers: { Authorization: "Bearer ${key}" } },
);
const orders = await res.json();`;
  }
  return `import requests

res = requests.get(
    "https://api.example.com/v2/orders",
    headers={"Authorization": "Bearer ${key}"},
    params={"customer": "cus_2041", "status": "open", "limit": 2},
)
orders = res.json()`;
}

export const RESPONSE = `{
  "data": [
    { "id": "ord_1001", "status": "open", "total": 2500 },
    { "id": "ord_1002", "status": "open", "total": 1800 }
  ],
  "has_more": true,
  "next_cursor": "cur_9f2"
}`;

export const FIELDS = [
  { name: "customer", type: "string", required: true, text: "The customer whose orders to list, such as cus_2041." },
  { name: "status", type: "string", required: false, text: "Only orders in this state: open, paid or closed." },
  { name: "limit", type: "integer", required: false, text: "How many orders to return, 1 to 100. The default is 20." },
  { name: "cursor", type: "string", required: false, text: "Where to continue, taken from next_cursor in the last response." },
];

export const ERRORS = [
  { status: "400", code: "invalid_request", meaning: "A field is missing or has the wrong type.", fix: "Check the fields table above and send the call again." },
  { status: "401", code: "unauthenticated", meaning: "The key is missing, mistyped or revoked.", fix: "Send the header Authorization: Bearer followed by your key." },
  { status: "404", code: "not_found", meaning: "No customer has that id.", fix: "Check the id, and that the key belongs to the same account." },
  { status: "429", code: "rate_limited", meaning: "Too many calls in a short time.", fix: "Wait for the seconds in the Retry-After header, then try again." },
];

export const CHANGES = [
  { date: "2026-11-12", text: "Added the status filter to GET /v2/orders.", action: "Nothing to do. Existing calls keep working." },
  { date: "2026-10-30", text: "The total field is now a whole number in the smallest unit.", action: "Update any code that reads total as a decimal." },
  { date: "2026-09-15", text: "Version 1 of the orders address is deprecated.", action: "Move to GET /v2/orders before 1 March 2027." },
];

// The pages of the docs, grouped by what each kind of page is for.
export const KINDS = [
  { title: "Tutorials", pages: ["Quick start"] },
  { title: "How-to guides", pages: ["Send your first order", "Handle errors", "Verify webhooks"] },
  { title: "Reference", pages: ["Orders", "Customers", "Errors"] },
  { title: "Explanations", pages: ["Authentication", "Paging", "Rate limits", "Versioning"] },
];

export const COMMON = [
  { label: "Authentication", note: "Send your key in every call", href: "#authentication" },
  { label: "Paging", note: "Walk through long lists", href: "#paging" },
  { label: "Rate limits", note: "How many calls, how often", href: "#rate-limits" },
  { label: "Versioning", note: "Which version you are on", href: "#versioning" },
];
