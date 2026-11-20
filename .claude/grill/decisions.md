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
| 2026-11-19 | Every card gets a live copy: the component rebuilt as its own small page from the measured looks, with real hover, keyboard focus and pressing, shown on the library page with a ui-sdk switch (Live, Normal, Hover, Focus, Pressed) | Salem: "cant you just build one too? like i hover and see it"; automatic, so it scales to 2k sites | Salem |
| 2026-11-19 | The explorer goes screen by screen: every new screen on the site is explored in turn; search boxes get a search typed and Enter pressed; menus that open are tried inside; mic, camera and location are allowed with a fake device; other sub-sites of the same company count as the site; up to 4 links to other websites are opened per screen, not explored | Salem: google.com was not searched, results not opened, mic not allowed | Claude (clear answer) |
| 2026-11-19 | The recorder does not hide that it is an automated Chrome, so sites with a robot check (Google search results) show that check instead | Getting around robot checks is not something we build | Claude (clear answer) |
| 2026-11-19 | Default budget 80 steps per recording (up to 300); the same component found again on another screen is skipped | A whole site in one recording, without repeated cards | Claude (clear answer) |
| 2026-11-19 | Best version: the checklist is checked against sources before building; each item labelled Rule / Standard / Research / Practice, and Seen (judged from a recording) or Person | Salem: "verified first" | Salem |
| 2026-11-19 | Best version: first flow is sign-up only, proven end to end before other flows | Proves the whole idea on one flow; cheap to widen later | Claude (clear answer) |
| 2026-11-19 | Best version: shown side by side in the library (real flow left, best version right, a switch between their style and plain ui-sdk, checklist below) | Comparing needs both in view; cheap to change | Claude (clear answer) |
| 2026-11-19 | Best version: sign-up flows are recorded at phone size | The checklist is for mobile | Claude (clear answer) |
| 2026-11-19 | "Account already exists": the best version uses the helpful message for ordinary apps, the private one for sensitive apps | Real trade-off between usability (practice) and privacy (OWASP) | Claude (clear answer) |
| 2026-11-19 | Best version: recordings make a real account with a throwaway test email, one per site, reading the code from a test inbox; at a robot check the recording stops and says so | Salem chose full sign-up so every step can be judged | Salem |
| 2026-11-19 | Best version: measured items judged automatically, the rest by Claude in a session (no AI cost per recording) | Salem chose the recommended option | Salem |
| 2026-11-19 | Test inbox: a free throwaway inbox (mail.tm), one new address per recording; capped at 20 a day in code | Salem chose the recommended option; nothing to set up | Salem |
| 2026-11-19 | Robot check on Dribbble: audit what was recorded; screens past the robot check are marked 'not reached' | Salem chose the recommended option | Salem |

| 2026-11-20 | The app is the Product Checklists page only; the recorder, its library page and all recordings are deleted (code kept as git tag recorder-last). D1 to D4 no longer apply. | Salem: "i want this app to be this artifact, delete all the rest" | Salem |
| 2026-11-20 | Project and folder renamed from agentscreen to product-checklists | Matches the page title and covers every group, not only code | Salem |
| 2026-11-20 | General accessibility items live only in the Accessibility checklist; other lists keep only access items special to them, plus an 'Also meets' link | Salem chose it (ask 33): 123 repeats across 150 lists | Salem |
| 2026-11-20 | Live examples are built in a Next.js app (`web/`) with ui-sdk, not shadcn | Salem: "using ui sdk ?? Dont use shadncn"; picked React + Next.js | Salem |
| 2026-11-20 | The app sits in `web/` beside `note/`, not in the root | Root already holds the content and agent files; keeps the build separate | Claude |
| 2026-11-20 | Examples are built one at a time by a Sonnet helper and checked by the main session | Salem: "build one by one using sonnet subagent (1 at a time) you eval" | Salem |
| 2026-11-20 | GitHub repo is public, with a free live preview on GitHub Pages | Salem chose Public (Recommended) | Salem |
| 2026-11-20 | First example to approve: the 404 page rebuilt with ui-sdk | Salem chose it | Salem |
| 2026-11-20 | GitHub repo is public with its whole history (messages, notes, journal included) | Salem picked option 2 | Salem |
| 2026-11-20 | Examples are generic: example.com, no real brand or country; lorem ipsum for filler, real words only where an item is about the words | Salem: "make it general ... use lumpsim" | Salem |
| 2026-11-20 | Each checklist item can be ticked or unticked on the example; unticking shows the page breaking that rule | Salem: "check the list or uncheck and this effect how it looks" | Salem |
| 2026-11-20 | One example per group, in this order: flows/resetting-password, web-app/dashboard, mobile/login, design-system/modal, api/api-docs, backend/search, code/readme-docs, growth/blog, launch/legal-pages, motion/micro-interactions, operations/monitoring-alerts, product/release-announcements, support/help-desk (website/404 done) | The most visual checklist in each group; cheap to swap | Claude |
| 2026-11-20 | Icons come from Phosphor (@phosphor-icons/react), in every example; no hand-drawn icons | Salem: "use that" | Salem |
| 2026-11-20 | Ticking never snaps the layout: the changed spot slides to its new height (~200ms) instead of reserving blank space for the taller version | Reserved space showed as empty gaps in the good state (step 3, the rail) | Claude |
| 2026-11-20 | An email in an example sits in its own mail-app window (title bar "Inbox", no address bar), beside the browser window, never inside it; a shared mail frame for every example | Salem: people should see the website and the email are two different things | Salem |
