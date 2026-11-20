"use client";

import { useState } from "react";
import { Robot } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { CodeBlock } from "../../components/kit/code";
import { Link } from "../../components/kit/link";
import { Toggle } from "../../components/kit/switch";
import { RULES, SECURITY_TXT } from "./data";

// Item 3: a cookie notice with an equal No and Yes, and a choice for each kind.
export function Cookies() {
  const [stats, setStats] = useState(false);
  const [ads, setAds] = useState(false);
  const good = (
    <div className="lg-cookie" role="group" aria-label="Cookie choices">
      <p>We use cookies to keep you signed in. Others are optional and off until you say yes.</p>
      <p className="lg-fixed">Needed to sign in: always on.</p>
      <Toggle label="Counting visits" hint="Which pages help" checked={stats} onChange={setStats} />
      <Toggle label="Personalised ads" hint="Only on our own pages" checked={ads} onChange={setAds} />
      <div className="kit-bgroup">
        <Button kind="secondary" onClick={() => { setStats(false); setAds(false); }}>Reject all</Button>
        <Button kind="secondary" onClick={() => { setStats(true); setAds(true); }}>Accept all</Button>
      </div>
    </div>
  );
  const broken = (
    <div className="lg-cookie" role="group" aria-label="Cookie notice">
      <p>By using this site you accept all cookies.</p>
      <div className="kit-bgroup">
        <Button kind="primary">Accept</Button>
      </div>
    </div>
  );
  return (
    <section className="lg-block" aria-labelledby="lg-cookie-h">
      <h2 id="lg-cookie-h">Cookies</h2>
      <Swap item={3} good={good} broken={broken} />
    </section>
  );
}

// Item 7: where to send a security report, as the standard file.
export function Security() {
  const { isMet } = useMet();
  return (
    <Collapse n={7} open={isMet(7)}>
      <section className="lg-block" aria-labelledby="lg-sec-h">
        <h2 id="lg-sec-h">Security contact</h2>
        <p>Found a flaw? Tell us at security@example.com. The same details sit in our <Link href="#securitytxt">security.txt</Link> file:</p>
        <CodeBlock label="security.txt" code={SECURITY_TXT} copy="the security.txt file" wrap />
      </section>
    </Collapse>
  );
}

// Item 8: the rules for what people post, and who reads the reports.
export function Community() {
  const { isMet } = useMet();
  return (
    <Collapse n={8} open={isMet(8)}>
      <section className="lg-block" aria-labelledby="lg-com-h">
        <h2 id="lg-com-h">Community rules</h2>
        <ol className="lg-points">
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </section>
    </Collapse>
  );
}

// Item 9: say so when someone is talking to an AI.
export function Assistant() {
  const good = (
    <div className="lg-chat">
      <p className="lg-chat-note" role="note">
        <Robot size={16} aria-hidden="true" /> You are chatting with an AI assistant, not a person. Ask for a person any time.
      </p>
      <p className="lg-bubble">Hi, how can I help with your plan today?</p>
    </div>
  );
  const broken = (
    <div className="lg-chat">
      <p className="lg-bubble">Hi, I am Sam. How can I help with your plan today?</p>
    </div>
  );
  return (
    <section className="lg-block" aria-labelledby="lg-ai-h">
      <h2 id="lg-ai-h">Assistant chat</h2>
      <Swap item={9} good={good} broken={broken} />
    </section>
  );
}
