"use client";

import { useState } from "react";
import { Fit } from "../../components/checklist-layer/fit";
import { Swap } from "../../components/checklist-layer/swap";
import { Segmented } from "../../components/kit/button";
import { CodeBlock } from "../../components/kit/code";
import { Toggle } from "../../components/kit/switch";
import { LANGS, PLACEHOLDER_KEY, RESPONSE, TEST_KEY, sample, type Lang } from "./data";

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
        <CodeBlock label={`${label} example request`} code={code} copy={`the ${label} example`} />
      </Fit>
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
