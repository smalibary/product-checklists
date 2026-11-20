import type { ReactNode } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

type Props = { subject: string; children: ReactNode };

// A made-up email, drawn small inside the page so the flow's emails can be pointed at.
export function MailCard({ subject, children }: Props) {
  return (
    <article className="rp-mail" aria-label={`Email: ${subject}`}>
      <header className="rp-mail-head">
        <EnvelopeSimple size={20} aria-hidden="true" />
        <div>
          <p className="rp-mail-subject">{subject}</p>
          <p className="rp-mail-from">From: Example &lt;no-reply@example.com&gt;</p>
        </div>
      </header>
      <div className="rp-mail-body">{children}</div>
    </article>
  );
}
