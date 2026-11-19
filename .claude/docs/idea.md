# agentscreen: the idea (2026-11-19)

## In Salem's words (summarised)
A fresh start, not built on ux-agents. Mobbin shows screens, but none of the open-source alternatives show the
full flow: every animation, every screen, everything working. He wants a very light app that an AI uses to go
through a website or app screen by screen, link by link, button by button, and record everything, animations
included. Afterwards: a list of every interaction that can be filtered, searched and explained, plus checklists.
For Salem first; later a product others can use, like Mobbin. Test first, then more examples.
Rust for the logic; ui-sdk.dev for the screens. It must run headless: never use his mouse or screen.

## What it does
- **Rust brain:** runs a hidden Chrome, clicks and types with virtual input, records video of everything, takes a
  picture of each screen, gives each screen a short code that tells pages apart, and saves every action as a step:
  before, what was done, after, and the clip. It also does search, filters and checklists.
- **The AI:** the brain offers controls Claude uses directly (open, click, type, record, save). Claude chooses the
  interesting states (wrong password, email taken, weak or strong password). An automatic mode clicks every
  link and button with no AI.
- **The library:** a page in Salem's browser: flows, clips, search ("every password error"), filters by site and
  screen type, a short explanation per step.

## Decisions (2026-11-19, all option A; full list in `.claude/grill/decisions.md`)
D1 Claude drives it plus an automatic mode · D2 library page in his normal browser · D3 shadcn plus ui-sdk for
timeline, search, tree · D4 websites first, Android apps next · headless only.

## First test (2026-11-19, passed; throwaway code removed, the real recorder is rebuilt from what it proved)
- Hidden Chrome (new headless mode) driven from Rust through the Chrome DevTools connection; video from the
  screencast frames joined into a video file with ffmpeg using their real times.
- A practice login: wrong password (red error) then right password (logged in), one picture and one line per step.
- A 1-second slide-in animation: about 60 frames, 60 frames a second. 7.5 s of video came to about 90 KB.
- The first page's links, buttons and inputs were listed: the start of "every interaction on a screen".
- **Lesson:** when the same tab moved from one website to another, virtual clicks stopped reaching the page.
  Fix: one hidden tab per website.

## Not yet decided
- First real sites to record; what counts as one flow; what the library filters on; how checklists are made.
