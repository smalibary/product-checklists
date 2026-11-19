# Decisions

| Date | Decision | Why | By |
|---|---|---|---|
| 2026-11-19 | D1 A: Claude drives the recorder through its controls (open, click, type, record, save), plus an automatic "click everything" mode | No extra AI bill, Salem can watch; option C (built-in AI on a key) waits for the product version | Salem |
| 2026-11-19 | D2 A: the library is a page in Salem's normal browser, served by the Rust app | Fastest to test; same screens can move into a desktop window later | Salem |
| 2026-11-19 | D3 A: shadcn is the base; ui-sdk.dev adds timeline, search (command) and tree pieces | Gets the new pieces without leaving the known stack; logged as an exception to D-025 in business-partner's decisions log | Salem |
| 2026-11-19 | D4 A: websites first; Android apps next, through the virtual phone already proven | Easiest first test; Android shell is proven | Salem |
| 2026-11-19 | Recording runs headless: hidden Chrome, virtual clicks, never Salem's mouse or screen | Salem: "headless if possible, not using my mouse" | Salem |
| 2026-11-19 | One hidden tab per website | First test: clicks were lost when one tab moved to another website | Claude (clear answer) |
