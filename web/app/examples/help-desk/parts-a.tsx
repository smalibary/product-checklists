"use client";

import { ChatCircle, EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { FormLayout, TextField } from "../../components/kit/field";
import { Link } from "../../components/kit/link";

const WAYS = [
  { icon: <ChatCircle size={20} aria-hidden="true" />, name: "Chat", note: "Replies in about 5 minutes, weekdays 9 to 17" },
  { icon: <EnvelopeSimple size={20} aria-hidden="true" />, name: "Email", note: "Replies within 1 working day" },
  { icon: <Phone size={20} aria-hidden="true" />, name: "Phone", note: "Answered 9 to 17, weekdays" },
];

const ARTICLES = [
  { title: "Change the email on your account", note: "Asked 212 times this month" },
  { title: "Find a missing invoice", note: "Asked 148 times this month" },
  { title: "Reset your password", note: "Asked 131 times this month" },
];

// Item 1: contact options on every screen, each with its reply time.
export function Contact() {
  return (
    <Swap
      item={1}
      good={
        <ul className="hd-ways">
          {WAYS.map((w) => (
            <li key={w.name} className="hd-way">
              {w.icon}
              <div className="hd-way-text">
                <Link href="https://example.com/contact" className="hd-strong">
                  {w.name}
                </Link>
                <span className="hd-meta">{w.note}</span>
              </div>
            </li>
          ))}
        </ul>
      }
      broken={<p className="hd-meta">No contact option here. Open the footer menu, then About, then Company, to find an email address.</p>}
    />
  );
}

// Item 9: articles written from the most common questions.
export function Articles() {
  return (
    <Swap
      item={9}
      good={
        <ul className="hd-list">
          {ARTICLES.map((a) => (
            <li key={a.title}>
              <Link href="https://example.com/help/article">{a.title}</Link>
              <span className="hd-meta">{a.note}</span>
            </li>
          ))}
        </ul>
      }
      broken={<p className="hd-meta">No articles yet. The same answer is typed out by hand, again and again.</p>}
    />
  );
}

// Item 2: the form asks the details support needs, up front.
export function RequestForm() {
  return (
    <Swap
      item={2}
      good={
        <FormLayout label="Send a request" actions={<Button kind="primary" type="submit">Send request</Button>}>
          <TextField label="Email" name="hd-email" type="email" autoComplete="email" required validate={(v) => (v.includes("@") ? undefined : "Enter an email address like name@example.com")} />
          <TextField label="Order number" name="hd-order" optional hint="On your receipt, like LOR-10482" />
          <TextField label="Topic" name="hd-topic" hint="Billing, account, delivery or something else" />
          <TextField label="What happened?" name="hd-what" hint="One or two lines is enough" />
        </FormLayout>
      }
      broken={
        <FormLayout label="Send a request" actions={<Button kind="primary" type="submit">Send</Button>}>
          <TextField label="Message" name="hd-msg" />
        </FormLayout>
      }
    />
  );
}

// Item 3: a reference and a reply time after sending.
export function Confirmation() {
  return (
    <Swap
      item={3}
      good={
        <div className="hd-box" role="status">
          <p className="hd-strong">Request sent. Your reference is HD-48213.</p>
          <p className="hd-meta">We will reply by email within 1 working day. Quote the reference if you write to us again.</p>
        </div>
      }
      broken={
        <div className="hd-box" role="status">
          <p className="hd-strong">Thanks, message sent.</p>
        </div>
      }
    />
  );
}
