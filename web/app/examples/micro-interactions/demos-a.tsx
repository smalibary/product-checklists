"use client";

import { useState } from "react";
import { Copy } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { CopyButton } from "../../components/kit/code";
import { LikeButton } from "../../components/kit/like";
import { Toggle } from "../../components/kit/switch";

const LINK = "https://example.com/p/lorem-ipsum";

// Item 1: what the heart does, written as trigger, response, rules and end state.
export function Spec() {
  const good = (
    <dl className="mi-spec">
      <div><dt>Trigger</dt><dd>A tap, or Enter, on the heart</dd></div>
      <div><dt>Response</dt><dd>The heart fills red and grows a little</dd></div>
      <div><dt>Rules</dt><dd>Tap again to take it back</dd></div>
      <div><dt>End state</dt><dd>A filled heart, and one more on the count</dd></div>
    </dl>
  );
  const broken = (
    <dl className="mi-spec">
      <div><dt>Trigger</dt><dd>Tap the heart</dd></div>
      <div><dt>Response</dt><dd>Not decided</dd></div>
    </dl>
  );
  return <Swap item={1} good={good} broken={broken} />;
}

// Item 3: the press of a button. The broken one does not answer a press.
export function Press() {
  return (
    <Swap
      item={3}
      good={<Button kind="primary">Save changes</Button>}
      broken={
        <Button kind="primary" className="mi-noanswer">
          Save changes
        </Button>
      }
    />
  );
}

function Notify({ snap }: { snap: boolean }) {
  const [on, setOn] = useState(false);
  return <Toggle label="Notifications" hint="A note when someone replies" checked={on} onChange={setOn} snap={snap} />;
}

// Item 4: the switch slides and changes colour together.
export function Notifications() {
  return <Swap item={4} good={<Notify snap={false} />} broken={<Notify snap />} />;
}

// Item 5: the heart, with its count.
export function Heart() {
  return <Swap item={5} good={<LikeButton count={24} />} broken={<LikeButton count={24} pop={false} />} />;
}

function SilentCopy() {
  return (
    <Button
      kind="quiet"
      size="sm"
      icon={<Copy size={16} aria-hidden="true" />}
      onClick={() => void navigator.clipboard?.writeText(LINK).catch(() => undefined)}
    >
      Copy
    </Button>
  );
}

// Item 6: Copy says "Copied" for a moment.
export function CopyLink() {
  return (
    <div className="mi-copy">
      <code>{LINK}</code>
      <Swap item={6} good={<CopyButton text={LINK} what="link" />} broken={<SilentCopy />} />
    </div>
  );
}
