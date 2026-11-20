"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Timer, Warning, WifiSlash } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Variants } from "../../components/checklist-layer/swap";
import { useStep } from "../../components/checklist-layer/step-context";
import { Button } from "../../components/kit/button";
import { TextField } from "../../components/kit/field";
import { Link } from "../../components/kit/link";
import { PhoneFrame } from "../../components/phone-frame/phone-frame";
import { Note } from "./note";

export type Problem = "wrong" | "locked" | "offline";

const WAIT = 300;
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// One sign-in screen after a failed try. The item for this problem (12 wrong details, 14 locked out,
// 15 offline) sits on the message; the other items belong to other steps.
export function StepProblem({ kind }: { kind: Problem }) {
  const { isMet } = useMet();
  const { setStep } = useStep();
  const [left, setLeft] = useState(WAIT);

  useEffect(() => {
    if (kind !== "locked") return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [kind]);

  const keep = kind !== "offline" || isMet(15);
  const bad = <Warning size={18} weight="fill" />;

  const messages: Record<Problem, [number, Record<string, ReactNode>]> = {
    wrong: [
      12,
      {
        good: <Note tone="bad" icon={bad}>That email or password is not right. Check both and try again.</Note>,
        broken: <Note tone="bad" icon={bad}>This email has an account, but the password is wrong.</Note>,
      },
    ],
    locked: [
      14,
      {
        good: (
          <Note tone="bad" icon={<Timer size={18} weight="fill" />}>
            Too many tries. You can try again in {clock(left)}, or{" "}
            <Link href="#reset" onClick={(e) => e.preventDefault()}>
              reset your password
            </Link>
            .
          </Note>
        ),
        broken: <Note tone="bad" icon={bad}>Your account is locked.</Note>,
      },
    ],
    offline: [
      15,
      {
        good: (
          <Note tone="bad" icon={<WifiSlash size={18} weight="bold" />}>
            You are offline. We kept what you typed. Try again when you are back online.
          </Note>
        ),
        broken: <Note tone="bad" icon={bad}>Something went wrong. Please try again.</Note>,
      },
    ],
  };
  const [item, parts] = messages[kind];
  const waiting = kind === "locked" && isMet(14) && left > 0;

  return (
    <div className="ml-desk">
      <PhoneFrame label="The app, sign-in screen with a problem" offline={kind === "offline"}>
        <form
          className="ml-screen"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(kind === "offline" ? 1 : 5);
          }}
        >
          <header className="ml-head">
            <h2>Welcome back</h2>
            <p>Sign in to Lorem Ipsum.</p>
          </header>
          <Variants item={item} active={isMet(item) ? "good" : "broken"} parts={parts} />
          <TextField key={`e${keep}`} label="Email or phone" name="email" type="email" defaultValue={keep ? "name@example.com" : ""} placeholder="name@example.com" />
          <TextField key={`p${keep}`} label="Password" name="password" reveal defaultValue={keep ? "lorem-ipsum" : ""} placeholder="Password" />
          <Button type="submit" kind="primary" size="lg" className="ml-wide" disabled={kind === "locked"}>
            {waiting ? `Try again in ${clock(left)}` : "Log in"}
          </Button>
        </form>
      </PhoneFrame>
    </div>
  );
}
