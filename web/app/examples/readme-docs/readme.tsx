"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { Link } from "../../components/kit/link";
import { COMMANDS, SETTINGS } from "./data";

// A block of commands people can copy, and reach by keyboard so long lines can be scrolled.
export function Code({ label, code }: { label: string; code: string }) {
  return (
    <pre className="rd-code" tabIndex={0} role="region" aria-label={label}>
      <code>{code}</code>
    </pre>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Copying can be blocked in a preview; the commands are still on the page to select.
    }
    setDone(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 2000);
  };
  return (
    <>
      <Button kind="quiet" size="sm" icon={done ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} onClick={copy}>
        {done ? "Copied" : "Copy"}
        <span className="sr"> the commands</span>
      </Button>
      <span className="sr" role="status">
        {done ? "Commands copied to the clipboard" : ""}
      </span>
    </>
  );
}

// Item 1: the first lines say what it is and who it is for.
export function Intro() {
  const good = (
    <p className="rd-lead">
      <strong>widget</strong> is a small library that sends requests and retries the ones that fail. It is for developers who want that without writing it themselves.
    </p>
  );
  const broken = (
    <div className="rd-badges" aria-label="Badges">
      <span>build passing</span>
      <span>coverage 91%</span>
      <span>downloads 12k</span>
      <span>v1.4.0</span>
    </div>
  );
  return <Swap item={1} good={good} broken={broken} />;
}

// Item 2: install, run and test as copyable commands.
export function Install() {
  const good = (
    <div className="rd-install">
      <Code label="Install, run and test" code={COMMANDS} />
      <div className="rd-install-foot">
        <CopyButton text={COMMANDS} />
      </div>
    </div>
  );
  const broken = <p>Install it the usual way, start it, then run the tests.</p>;
  return (
    <section className="rd-block">
      <h3>Install, run and test</h3>
      <Swap item={2} good={good} broken={broken} />
    </section>
  );
}

// Item 3: every setting and environment variable listed, with its default.
export function Settings() {
  const good = (
    <table className="rd-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">What it does</th>
          <th scope="col">Default</th>
        </tr>
      </thead>
      <tbody>
        {SETTINGS.map((s) => (
          <tr key={s.name}>
            <th scope="row">
              <code>{s.name}</code>
              <span className="rd-req" data-required={s.required || undefined}>
                {s.required ? "Required" : "Optional"}
              </span>
            </th>
            <td>{s.meaning}</td>
            <td>
              <code>{s.fallback}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const broken = <p>Set the environment variables first. The code shows which ones.</p>;
  return (
    <section className="rd-block">
      <h3>Settings</h3>
      <Swap item={3} good={good} broken={broken} />
    </section>
  );
}

// Item 4: how to get help and how to contribute. Folds away when unticked.
export function Help() {
  const { isMet } = useMet();
  return (
    <Collapse n={4} open={isMet(4)}>
      <section className="rd-block">
        <h3>Help and contributing</h3>
        <ul className="rd-links">
          <li>
            <Link href="#questions" standalone>Ask a question</Link>
          </li>
          <li>
            <Link href="#issues" standalone>Report a problem</Link>
          </li>
          <li>
            <Link href="#contributing" standalone>Read the contributing guide</Link>
          </li>
        </ul>
      </section>
    </Collapse>
  );
}

// Item 5: the licence is named, in the line under the title.
export function Licence() {
  return (
    <Swap
      item={5}
      good={
        <p className="rd-meta">
          Licence: <Link href="#licence">MIT</Link>. Free to use and change, with the notice kept.
        </p>
      }
      broken={<p className="rd-meta">No licence is named, so nobody knows whether they may use it.</p>}
    />
  );
}
