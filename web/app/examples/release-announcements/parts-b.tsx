"use client";

import { useState } from "react";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { CodeBlock } from "../../components/kit/code";
import { TextField } from "../../components/kit/field";
import { Link } from "../../components/kit/link";

const STORE_TEXT = `Lorem 2.0
- Share a saved view with one link
- Dark mode follows your device
- Search looks inside notes
- Fixed lists jumping to the top
The old print layout is removed: use Export to PDF.`;

// Item 4: the tip, shown once and easy to dismiss.
export function Tip() {
  const [gone, setGone] = useState(false);
  return (
    <Swap
      item={4}
      good={
        gone ? (
          <p className="ra-meta">Tip dismissed. It will not show again.</p>
        ) : (
          <aside className="ra-tip" aria-label="New feature">
            <Sparkle size={20} weight="fill" aria-hidden="true" />
            <div className="ra-notice-text">
              <p className="ra-strong">New: Share a view</p>
              <p>Next to your saved view. Shown once.</p>
            </div>
            <Button kind="quiet" size="sm" onClick={() => setGone(true)}>
              Got it
            </Button>
          </aside>
        )
      }
      broken={
        <aside className="ra-tip" aria-label="New feature">
          <Sparkle size={20} weight="fill" aria-hidden="true" />
          <div className="ra-notice-text">
            <p className="ra-strong">New: Share a view</p>
            <p>Shown every time the app opens. There is no way to close it.</p>
          </div>
        </aside>
      }
    />
  );
}

// Item 5: the tip sits beside the work; the task stays usable.
export function Strip() {
  return (
    <Swap
      item={5}
      good={
        <div className="ra-app">
          <div className="ra-app-bar">
            <span className="ra-strong">Quarterly notes</span>
            <Button kind="primary" size="sm">
              Save
            </Button>
          </div>
          <p className="ra-meta">The tip above stays beside your work. You can keep typing and press Save at any time.</p>
        </div>
      }
      broken={
        <div className="ra-app">
          <div className="ra-app-bar">
            <span className="ra-strong">Quarterly notes</span>
            <Button kind="primary" size="sm" disabled>
              Save
            </Button>
          </div>
          <p className="ra-meta">Nothing can be typed.</p>
          <div className="ra-cover" role="presentation">
            <p className="ra-strong">Take the 6-step tour first</p>
          </div>
        </div>
      }
    />
  );
}

// Item 6: email only for people who asked.
export function Email() {
  return (
    <Swap
      item={6}
      good={
        <div className="ra-box">
          <TextField
            label="Email address"
            name="release-email"
            type="email"
            autoComplete="email"
            hint="We email release notes only to people who ask. Every email has an unsubscribe link."
          />
          <div>
            <Button kind="primary">Send me release notes</Button>
          </div>
        </div>
      }
      broken={
        <div className="ra-box">
          <p className="ra-meta">Everyone with an account is on the list already. The unsubscribe link is in small grey print.</p>
        </div>
      }
    />
  );
}

// Item 7: the store text, updated for this release.
export function Store() {
  return (
    <Swap
      item={7}
      good={
        <div className="ra-store">
          <CodeBlock label="Store what's new text" code={STORE_TEXT} copy="the store text" wrap />
          <p className="ra-meta">
            Full list on the <Link href="https://example.com/changelog">changelog</Link>.
          </p>
        </div>
      }
      broken={
        <div className="ra-store">
          <CodeBlock label="Store what's new text" code="Bug fixes and improvements." wrap weak />
          <p className="ra-meta">The same line as the last twelve releases.</p>
        </div>
      }
    />
  );
}

// Item 8: the post went out after the rollout reached everyone.
export function Rollout() {
  return (
    <Swap
      item={8}
      good={
        <div className="ra-box">
          <p className="ra-strong">100% of users are on 2.0.0</p>
          <span className="ra-meter" style={{ ["--done" as string]: "100%" }} aria-hidden="true" />
          <p className="ra-meta">Rollout finished 11 March. This post went out on 12 March.</p>
        </div>
      }
      broken={
        <div className="ra-box">
          <p className="ra-strong">20% of users are on 2.0.0</p>
          <span className="ra-meter" style={{ ["--done" as string]: "20%" }} aria-hidden="true" />
          <p className="ra-meta">This post is already out. Most readers cannot find the feature yet.</p>
        </div>
      }
    />
  );
}
