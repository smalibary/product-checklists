"use client";

import { useState } from "react";
import { AppleLogo, Fingerprint, GoogleLogo, Lock } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse } from "../../components/checklist-layer/swap";
import { useStep } from "../../components/checklist-layer/step-context";
import { Button } from "../../components/kit/button";
import { FormMessage, TextField } from "../../components/kit/field";
import { Link } from "../../components/kit/link";
import { Toggle } from "../../components/kit/switch";
import { PhoneFrame } from "../../components/phone-frame/phone-frame";
import { Keyboard } from "./keyboard";

// A switch that starts on or off and then belongs to the person (the key restarts it when the item changes).
function Choice({ label, on }: { label: string; on: boolean }) {
  const [checked, setChecked] = useState(on);
  return <Toggle label={label} checked={checked} onChange={setChecked} />;
}

export function StepSignin() {
  const { isMet } = useMet();
  const { setStep } = useStep();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tried, setTried] = useState(false);
  const [pasteTried, setPasteTried] = useState(false);
  const empty = !email.trim() || !password;
  const noPaste = isMet(6)
    ? undefined
    : (e: React.ClipboardEvent) => {
        e.preventDefault();
        setPasteTried(true);
      };

  return (
    <div className="ml-desk">
      <PhoneFrame label="The app, sign-in screen">
        <form
          className="ml-screen"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setTried(true);
            if (!empty) setStep(5);
          }}
        >
          <header className="ml-head">
            <h2>Welcome back</h2>
            <p>Sign in to Lorem Ipsum.</p>
          </header>

          <div className="ml-group" data-gap="8">
            <Collapse n={1} open={isMet(1)}>
              <Button kind="primary" size="lg" className="ml-wide" icon={<Fingerprint size={20} aria-hidden="true" />}>
                Continue with a passkey
              </Button>
            </Collapse>
            <Collapse n={2} open={isMet(2)}>
              <Button size="lg" className="ml-wide" icon={<AppleLogo size={20} weight="fill" aria-hidden="true" />}>
                Continue with Apple
              </Button>
            </Collapse>
            <Collapse n={3} open={isMet(3)}>
              <Button size="lg" className="ml-wide" icon={<GoogleLogo size={20} weight="bold" aria-hidden="true" />}>
                Continue with Google
              </Button>
            </Collapse>
          </div>

          <p className="ml-or">
            <span>or with your email</span>
          </p>

          <div data-item="5">
            <TextField
              label="Email or phone"
              name="email"
              type={isMet(5) ? "email" : "text"}
              inputMode={isMet(5) ? "email" : "text"}
              autoComplete={isMet(5) ? "username" : "off"}
              placeholder="name@example.com"
              onValueChange={setEmail}
            />
          </div>

          <div className="ml-group" data-gap="8">
            <div data-item="6">
              <TextField
                label="Password"
                name="password"
                reveal
                revealSpot={7}
                revealGone={!isMet(7)}
                placeholder="Password"
                autoComplete={isMet(6) ? "current-password" : "off"}
                onValueChange={setPassword}
                onPaste={noPaste}
              />
            </div>
            <Collapse open={pasteTried && !isMet(6)}>
              <FormMessage>Pasting is blocked here, so a saved password cannot be filled in.</FormMessage>
            </Collapse>
            <Collapse n={13} open={isMet(13)}>
              <Link href="#forgot" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </Link>
            </Collapse>
          </div>

          <div className="ml-group" data-gap="10">
            <div data-item="9">
              <Choice key={String(isMet(9))} label="Stay signed in" on={isMet(9)} />
            </div>
            <Collapse n={10} open={isMet(10)}>
              <Choice label="Unlock with Face ID next time" on={false} />
            </Collapse>
          </div>

          <Collapse open={tried && empty && isMet(8)}>
            <FormMessage>Enter your email or phone and your password to continue.</FormMessage>
          </Collapse>
          <div data-item="8">
            <Button type="submit" kind="primary" size="lg" className="ml-wide" icon={<Lock size={16} aria-hidden="true" />} disabled={!isMet(8) && empty}>
              Log in
            </Button>
          </div>
        </form>
        <Keyboard />
      </PhoneFrame>
    </div>
  );
}
