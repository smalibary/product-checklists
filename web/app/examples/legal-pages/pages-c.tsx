"use client";

import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { TextField } from "../../components/kit/field";
import { Link } from "../../components/kit/link";
import { COMPANY } from "./data";

// Item 10: dated, and a change announced before it starts.
export function Dated() {
  const good = (
    <div className="lg-dated">
      <p className="lg-meta">Last updated <time dateTime="2026-11-03">3 November 2026</time></p>
      <p className="lg-note" role="note">
        The Terms change on <time dateTime="2026-12-01">1 December 2026</time>. We emailed everyone on 3 November, and the old version stays available. <Link href="#changes">See what changes</Link>
      </p>
    </div>
  );
  const broken = <p className="lg-meta">Last updated: recently</p>;
  return <Swap item={10} good={good} broken={broken} />;
}

// Item 11: the sign-up says what you agree to and links to it.
export function Signup() {
  const good = (
    <p className="lg-meta">
      By creating an account you agree to the <Link href="#terms">Terms of use</Link> and the <Link href="#privacy">Privacy policy</Link>.
    </p>
  );
  const broken = <p className="lg-meta">By creating an account you agree to our terms.</p>;
  return (
    <section className="lg-block" aria-labelledby="lg-sign-h">
      <h2 id="lg-sign-h">Create account</h2>
      <p>Start with {COMPANY}. No card needed.</p>
      <form className="lg-form" onSubmit={(e) => e.preventDefault()}>
        <TextField label="Email" name="email" type="email" placeholder="name@example.com" />
        <Button kind="primary" type="submit">Create account</Button>
      </form>
      <Swap item={11} good={good} broken={broken} />
    </section>
  );
}
