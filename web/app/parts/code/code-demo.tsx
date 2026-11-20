"use client";

import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { CodeBlock } from "../../components/kit/code";

const SHORT = `npm install widget
npm test`;
const LONG = `npm install widget --save-exact --registry https://registry.example.com/packages --loglevel verbose --no-audit`;
const COMMENT = `// Wait before each retry, longer every time, so a struggling server is not hit again straight away.`;

const bare = (code: string, cls: string, tab = false) => (
  <pre className={`kit-code ${cls}`} {...(tab ? { tabIndex: 0 } : {})}>
    <code>{code}</code>
  </pre>
);

// The kit code block and Copy button, one demo per checklist item.
export function CodeDemo() {
  return (
    <div className="pt">
      <div className="pt-grid">
        <div className="pt-card">
          <p className="pt-cap">Font</p>
          <Swap item={1} good={<CodeBlock label="Two commands" code={SHORT} />} broken={bare(SHORT, "pc-prop")} />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Contrast and size</p>
          <Swap item={2} good={<CodeBlock label="Two commands, readable" code={SHORT} />} broken={<CodeBlock label="Two commands" code={SHORT} weak />} />
        </div>
        <div className="pt-card">
          <p className="pt-cap">A long line</p>
          <Swap item={3} good={<CodeBlock label="A long command" code={LONG} />} broken={bare(LONG, "pc-clip", true)} />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Keyboard</p>
          <Swap item={4} good={<CodeBlock label="A long command, focused" code={LONG} force="focus" />} broken={bare(LONG, "pc-clip")} />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Copy</p>
          <Swap
            item={5}
            good={<CodeBlock label="Two commands with Copy" code={SHORT} copy="the commands" holdCopied />}
            broken={
              <div className="kit-code-box">
                <pre className="kit-code" tabIndex={0} role="region" aria-label="Two commands with Copy">
                  <code>{SHORT}</code>
                </pre>
                <div className="kit-code-foot">
                  <Button className="kit-code-copy" kind="quiet" size="sm">Copy</Button>
                </div>
              </div>
            }
          />
          <p className="pt-note">A press says Copied for two seconds, then goes back to Copy. Item 6 is the same press, said aloud to screen reader users.</p>
        </div>
        <div className="pt-card">
          <p className="pt-cap">Wrapped, for comments</p>
          <CodeBlock label="A comment that says why" code={COMMENT} wrap />
          <p className="pt-note">Where the words matter more than the layout, long lines fold instead of scrolling.</p>
        </div>
      </div>
    </div>
  );
}
