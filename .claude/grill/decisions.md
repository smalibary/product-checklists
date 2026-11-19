# Decisions

| Date | Decision | Why | By |
|---|---|---|---|
| 2026-11-19 | D1 A: Claude drives the recorder through its controls (open, click, type, record, save), plus an automatic "click everything" mode | No extra AI bill, Salem can watch; option C (built-in AI on a key) waits for the product version | Salem |
| 2026-11-19 | D2 A: the library is a page in Salem's normal browser, served by the Rust app | Fastest to test; same screens can move into a desktop window later | Salem |
| 2026-11-19 | D3 A: shadcn is the base; ui-sdk.dev adds timeline, search (command) and tree pieces | Gets the new pieces without leaving the known stack; logged as an exception to D-025 in business-partner's decisions log | Salem |
| 2026-11-19 | D4 A: websites first; Android apps next, through the virtual phone already proven | Easiest first test; Android shell is proven | Salem |
| 2026-11-19 | Recording runs headless: hidden Chrome, virtual clicks, never Salem's mouse or screen | Salem: "headless if possible, not using my mouse" | Salem |
| 2026-11-19 | One hidden tab per website | First test: clicks were lost when one tab moved to another website | Claude (clear answer) |
| 2026-11-19 | Component cards first (option A): every recording also cuts out each distinct-looking control with its build, look, hover/focus/pressed looks and motion | Foundation for families and recipes; AI can copy only what was measured | Salem |
| 2026-11-19 | Every card carries plain-language text (what it is, what each state does, how it moves) and design lessons (feedback, focus, size, contrast, timing), for people learning as well as AI | Salem: "so people also learn using it" | Salem |
| 2026-11-19 | Card text is written by rules from the measured values, not by an AI model | Exact, free, instant; an AI pass can be added later for richer wording | Claude (clear answer) |
| 2026-11-19 | Hover uses the hidden Chrome's virtual pointer; focus and pressed are switched on directly in Chrome; up to 16 cards on the start page, 8 on later screens, identical-looking controls grouped into one card | Real transitions play, nothing touches Salem's screen, recording time stays about a minute per screen | Claude (clear answer) |
