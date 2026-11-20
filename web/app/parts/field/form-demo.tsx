"use client";

import { useState, type ReactNode } from "react";
import { useMet } from "../../components/checklist-layer/met-context";
import { Variants } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { ErrorSummary, FormLayout, FormSection, TextField } from "../../components/kit/field";

const email = (v: string) => (/^\S+@\S+\.\S+$/.test(v) ? undefined : "Enter an email address like name@example.com.");
const need = (v: string) => (v.trim() ? undefined : "Enter your full name.");
const PROBLEMS = [
  { name: "name", label: "Full name", message: "Enter your full name." },
  { name: "email", label: "Email address", message: "Enter an email address like name@example.com." },
];

// One form, built to the form layout checklist. Each item that can be seen changes one thing here.
export function FormDemo() {
  const { isMet } = useMet();
  const [sent, setSent] = useState(false);
  const star = (t: string) => (isMet(30) ? t : `${t} *`);
  const group = (kids: ReactNode) => (isMet(29) ? <FormSection title="Contact details">{kids}</FormSection> : <div className="kit-section">{kids}</div>);

  return (
    <div className="pt">
      <div className="pt-grid">
        <div className="pt-card pt-form" data-item={26} data-cols={isMet(26) ? undefined : "2"} data-side={isMet(27) ? undefined : "1"}>
          <p className="pt-cap">Press Send with empty fields</p>
          <FormLayout
            label="Contact form"
            summary={isMet(34)}
            onSent={() => setSent(true)}
            actions={
              <div data-item={32} className="pt-actions" data-center={isMet(32) ? undefined : "1"}>
                <span data-item={33}>
                  <Button type="button" kind={isMet(33) ? "quiet" : "primary"} onClick={() => setSent(false)}>
                    Cancel
                  </Button>
                </span>
                <Button type="submit" kind="primary">
                  Send
                </Button>
              </div>
            }
          >
            <div data-item={29}>
              {group(
                <>
                  <div data-item={27}>
                    <TextField label={star("Full name")} name="name" required validate={need} autoComplete="name" />
                  </div>
                  <div data-item={31}>
                    <TextField
                      label={star("Email address")}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      hint={isMet(31) ? "We reply here, for example name@example.com." : undefined}
                      validate={email}
                    />
                  </div>
                  <div data-item={30}>
                    <TextField label={isMet(30) ? "Phone (optional)" : "Phone"} name="phone" type="tel" inputMode="tel" autoComplete="tel" size="medium" />
                  </div>
                </>,
              )}
            </div>
          </FormLayout>
          {sent && <p className="pt-note">Sent. Nothing leaves this page.</p>}
        </div>

        <div className="pt-card">
          <p className="pt-cap">After a failed send</p>
          <Variants
            item={34}
            active={isMet(34) ? "good" : "broken"}
            parts={{
              good: (
                <div className="kit-form" style={{ maxWidth: "none" }}>
                  <ErrorSummary problems={PROBLEMS} onPick={() => undefined} />
                  <TextField label="Full name" name="e1" error={PROBLEMS[0].message} />
                  <TextField label="Email address" name="e2" error={PROBLEMS[1].message} />
                </div>
              ),
              broken: (
                <div className="kit-form" style={{ maxWidth: "none" }}>
                  <TextField label="Full name" name="e1" error={PROBLEMS[0].message} />
                  <TextField label="Email address" name="e2" error={PROBLEMS[1].message} />
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
