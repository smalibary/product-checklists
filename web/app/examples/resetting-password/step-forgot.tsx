"use client";

import { useRef, useState } from "react";
import { CheckCircle, LockKey, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Ghost, useMet } from "../../components/checklist-layer/met-context";
import { Variants } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { FormLayout, TextField } from "../../components/kit/field";
import { Link } from "../../components/kit/link";

const TYPED = "name@example.com";

export function StepForgot() {
  const { isMet } = useMet();
  const formRef = useRef<HTMLDivElement>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <div className="rp-step">
      <section className="rp-signin" aria-label="The sign-in page, for context">
        <p className="rp-caption">On the sign-in page</p>
        <div className="rp-signin-row">
          <span className="rp-signin-label">
            <LockKey size={16} aria-hidden="true" /> Password
          </span>
          {isMet(1) && (
            <Link
              href="#reset"
              data-item="1"
              onClick={(e) => {
                e.preventDefault();
                formRef.current?.querySelector("input")?.focus();
              }}
            >
              Forgot password?
            </Link>
          )}
        </div>
        {!isMet(1) && <Ghost n={1} />}
        <TextField label="Password (example)" name="signin-password" type="password" placeholder="Password" disabled hideLabel />
      </section>

      <div className="rp-intro">
        <h2>Forgot your password?</h2>
        <p>Enter your email and we will send you a link to choose a new one.</p>
      </div>

      <div ref={formRef} id="reset" className="rp-form">
        <FormLayout
          label="Reset your password"
          summary={false}
          actions={
            <Button type="submit" kind="primary">
              Send reset link
            </Button>
          }
          onSent={(data) => setSentTo(String(data.get("email") ?? ""))}
        >
          <div data-item="2">
            <TextField
              key={String(isMet(2))}
              label="Email"
              hideLabel={!isMet(18)}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={isMet(18) ? "name@example.com" : "Email"}
              defaultValue={isMet(2) ? TYPED : ""}
            />
          </div>
          {!isMet(17) && (
            <TextField label="Security question: what was your first pet’s name?" name="answer" required />
          )}
        </FormLayout>
        <div role="status">
          <Variants
            item={3}
            active={sentTo === null ? "idle" : isMet(3) ? "ok" : "bad"}
            parts={{
              idle: (
                <div className="rp-result">
                  <p>Our answer shows here once you press the button.</p>
                </div>
              ),
              ok: (
                <div className="rp-result" data-sent="true">
                  <p>
                    <CheckCircle size={20} aria-hidden="true" />
                    <span>
                      If an account exists for {sentTo || "that email"}, we sent a link. It can take
                      a minute to arrive.
                    </span>
                  </p>
                </div>
              ),
              bad: (
                <div className="rp-result" data-sent="true">
                  <p data-bad="true">
                    <WarningCircle size={20} aria-hidden="true" />
                    <span>No account with that email. Check the address, or create an account.</span>
                  </p>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
