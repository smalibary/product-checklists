"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./button";

// The Copy button of a code block. It says "Copied" next to itself for two seconds, keeps its
// width so nothing jumps, and tells screen readers through a status line. "hold" keeps the
// Copied look on, for the Shared parts page.
export function CopyButton({ text, what, hold = false }: { text: string; what: string; hold?: boolean }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const shown = done || hold;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Copying can be blocked in a preview; the text is still on the page to select.
    }
    setDone(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 2000);
  };
  return (
    <>
      <Button
        className="kit-code-copy"
        kind="quiet"
        size="sm"
        icon={shown ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        onClick={copy}
      >
        {shown ? "Copied" : "Copy"}
        <span className="sr"> {what}</span>
      </Button>
      <span className="sr" role="status">
        {shown ? `${what} copied to the clipboard` : ""}
      </span>
    </>
  );
}

// The one code block of the site: monospaced, readable, a labelled region that takes the keyboard
// so a long line can be scrolled, and (with "copy") a Copy button under it. Long lines scroll
// inside the block, never the page; "wrap" folds them instead, for prose such as comments.
// "weak" is the broken version: small, pale, cut off, out of reach of the keyboard.
export function CodeBlock({
  label,
  code,
  copy,
  wrap = false,
  weak = false,
  force,
  holdCopied = false,
}: {
  label: string;
  code: string;
  // What the Copy button copies, in words ("the commands"). Leave out for a block with no button.
  copy?: string;
  wrap?: boolean;
  weak?: boolean;
  force?: "focus";
  holdCopied?: boolean;
}) {
  return (
    <div className="kit-code-box">
      <pre
        className="kit-code"
        data-wrap={wrap || undefined}
        data-weak={weak || undefined}
        data-force={force}
        {...(weak ? {} : { tabIndex: 0, role: "region", "aria-label": label })}
      >
        <code>{code}</code>
      </pre>
      {copy && !weak && (
        <div className="kit-code-foot">
          <CopyButton text={code} what={copy} hold={holdCopied} />
        </div>
      )}
    </div>
  );
}
