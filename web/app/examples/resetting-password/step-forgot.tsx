"use client";

import { useRef, useState } from "react";
import { CheckCircle, LockKey, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@ui-sdk/react/button";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { Ghost, useMet } from "../../components/checklist-layer/met-context";
import { Fit } from "../../components/checklist-layer/fit";
import { Variants } from "../../components/checklist-layer/swap";

const TYPED = "name@example.com";

export function StepForgot() {
  const { isMet } = useMet();
  const formRef = useRef<HTMLFormElement>(null);
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
            <a
              href="#reset"
              data-item="1"
              onClick={(e) => {
                e.preventDefault();
                formRef.current?.querySelector("input")?.focus();
              }}
            >
              Forgot password?
            </a>
          )}
        </div>
        {!isMet(1) && <Ghost n={1} />}
        <Input type="password" disabled placeholder="Password" aria-label="Password (example)" />
      </section>

      <div className="rp-intro">
        <h2>Forgot your password?</h2>
        <p>Enter your email and we will send you a link to choose a new one.</p>
      </div>

      <form
        ref={formRef}
        className="rp-form"
        id="reset"
        onSubmit={(e) => {
          e.preventDefault();
          setSentTo(String(new FormData(e.currentTarget).get("email") ?? ""));
        }}
      >
        <Field>
          <Fit>
            <FieldLabel className={isMet(18) ? undefined : "sr"}>Email</FieldLabel>
          </Fit>
          <div data-item="2">
            <Input
              key={String(isMet(2))}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={isMet(18) ? "name@example.com" : "Email"}
              defaultValue={isMet(2) ? TYPED : ""}
            />
          </div>
        </Field>
        {!isMet(17) && (
          <Field>
            <FieldLabel>Security question: what was your first pet&rsquo;s name?</FieldLabel>
            <Input name="answer" required />
          </Field>
        )}
        <Button type="submit" data-variant="solid">
          Send reset link
        </Button>
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
      </form>
    </div>
  );
}
