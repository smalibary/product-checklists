<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ui-sdk

Before using ui-sdk, follow the ui-sdk skill if it's installed, and read `node_modules/@ui-sdk/react/docs/llms.txt`.
To build a new component, also search `node_modules/@ui-sdk/react/docs/core.md` by heading, and read `rendering.md` next to it.

## Icons

Icons: Phosphor only (@phosphor-icons/react), no hand-drawn SVG icons. Import from "@phosphor-icons/react/dist/ssr"; regular weight, 16 to 20px, aria-hidden when beside text.

## Examples that must not jump

A part with a good and a broken version uses `Swap` or `Variants` (components/checklist-layer/swap.tsx): only the active version is drawn, and the spot's height glides (200ms, instant with reduced motion) between versions through `Fit` (fit.tsx). No height is reserved, so the good state has no blank room. A part that is simply missing when unticked uses `Collapse`. Put no data-item inside either; the wrapper carries it. The layer re-measures when a transition ends.

`Collapse` takes an optional `style` (for CSS `order`) and may be nested; its open/closed rules use the child selector. `Variants` `item` is optional (a string like "5 6" gives one spot to two items). The mail app window for emails is the shared `MailFrame` (components/mail-frame/).

## The standard kit (components/kit)

Every example and page uses these and nothing else for the same job: `SiteHeader`, `SiteFooter`, `Button`, `ButtonGroup`, `Segmented`, `Toggle`, `Link`, `TextField`, `FormLayout`, `FormSection`, `Modal` (the real dialog), `ModalCard`, `ModalStage` (a modal drawn inside an example so its numbered spots stay visible), `CodeBlock` and `CopyButton` (every code block with its Copy button; `wrap` for comments). Never write a page's own button, link, field, header, footer or transition. Motion numbers are tokens in `kit/motion.css` (`--dur-quick|base|slow|leave`, `--ease-enter|leave|move`, `--move`); no hard-coded durations. Reduced motion (system setting, or `data-calm="true"` on the root) turns durations to 1 ms and `--move` to 0, and fades stay. Each part was built to its own checklist on a page under `app/parts/<name>/`. Kit components take optional `spots` and `brokens` props (example pages only) so a checklist item can number a part and unticking it shows the plain version; real pages pass nothing.
