"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";
import { Fit } from "../../components/checklist-layer/fit";
import { Swap } from "../../components/checklist-layer/swap";
import { Button, Segmented } from "../../components/kit/button";
import { Toggle } from "../../components/kit/switch";
import { LANGS, PLACEHOLDER_KEY, RESPONSE, TEST_KEY, sample, type Lang } from "./data";

// A code block people can read and reach by keyboard: a labelled region that takes focus, so
// long lines can be scrolled with the arrow keys. "weak" is the broken version for item 13.
export function CodeBlock({ label, code, weak = false }: { label: string; code: string; weak?: boolean }) {
  return (
    <pre
      className="ad-code"
      data-weak={weak || undefined}
      {...(weak ? {} : { tabIndex: 0, role: "region", "aria-label": label })}
    >
      <code>{code}</code>
    </pre>
  );
}

function CopyButton({ text, what }: { text: string; what: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
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
      <Button className="ad-copy" kind="quiet" size="sm" icon={done ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} onClick={copy}>
        {done ? "Copied" : "Copy"}
        <span className="sr"> {what}</span>
      </Button>
      <span className="sr" role="status">
        {done ? `${what} copied to the clipboard` : ""}
      </span>
    </>
  );
}

// The request examples: one tab per language, a Copy button, and the reader's own test key filled
// in when signed in. Unticked (item 7) there is one curl example with a placeholder and no Copy.
export function Samples() {
  const [lang, setLang] = useState<Lang>("curl");
  const [signed, setSigned] = useState(true);
  const code = sample(lang, signed ? TEST_KEY : PLACEHOLDER_KEY);
  const label = LANGS.find((l) => l.value === lang)?.label ?? lang;

  const good = (
    <div className="ad-sample">
      <div className="ad-sample-bar">
        <Segmented label="Language" options={LANGS} value={lang} onChange={(v) => setLang(v as Lang)} />
        <Toggle label="Signed in" hint={signed ? "Your test key is filled in" : "A placeholder is shown"} checked={signed} onChange={setSigned} />
      </div>
      <Fit>
        <CodeBlock label={`${label} example request`} code={code} />
      </Fit>
      <div className="ad-sample-foot">
        <CopyButton text={code} what={`${label} example`} />
      </div>
    </div>
  );
  const broken = (
    <div className="ad-sample">
      <CodeBlock label="curl example request" code={sample("curl", PLACEHOLDER_KEY)} />
    </div>
  );
  return <Swap item={7} good={good} broken={broken} />;
}

// The example response. Item 13: readable code (contrast, size, reachable by keyboard).
export function Response() {
  return (
    <Swap
      item={13}
      good={<CodeBlock label="Example response" code={RESPONSE} />}
      broken={<CodeBlock label="Example response" code={RESPONSE} weak />}
    />
  );
}
