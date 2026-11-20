import type { ReactNode } from "react";
import { EnvelopeSimple, Minus, Square, X } from "@phosphor-icons/react/dist/ssr";
import "./mail-frame.css";

type Message = { from: string; subject: string; to: string; time: string };

// The mail app's window, for any example that sends an email. Unlike the browser strip
// (ExampleBar) it has a title bar reading "Inbox" and no address bar. Give it a `message`
// to show a from/subject/time header with the body as children, or leave `message` out and
// pass children alone for an empty inbox.
export function MailFrame({ message, children }: { message?: Message; children: ReactNode }) {
  return (
    <section className="mf" aria-label="Mail app">
      <div className="mf-bar" aria-hidden="true">
        <EnvelopeSimple size={16} weight="fill" />
        <span className="mf-title">Inbox</span>
        <span className="mf-win">
          <Minus size={12} />
          <Square size={11} />
          <X size={12} />
        </span>
      </div>
      {message && (
        <header className="mf-head">
          <p className="mf-subject">{message.subject}</p>
          <p className="mf-meta">
            <span>From: {message.from}</span>
            <span>To: {message.to}</span>
            <time>{message.time}</time>
          </p>
        </header>
      )}
      <div className="mf-body">{children}</div>
    </section>
  );
}
