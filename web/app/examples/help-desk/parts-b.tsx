"use client";

import { Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";

const TARGETS = [
  { level: "Urgent", reply: "1 hour", fix: "4 hours" },
  { level: "High", reply: "4 hours", fix: "1 day" },
  { level: "Normal", reply: "1 day", fix: "3 days" },
  { level: "Low", reply: "2 days", fix: "7 days" },
];

// Item 4: reply and fix targets by priority.
export function Targets() {
  return (
    <Swap
      item={4}
      good={
        <table className="hd-table">
          <caption className="sr">Reply and fix targets by priority</caption>
          <thead>
            <tr>
              <th scope="col">Priority</th>
              <th scope="col">First reply</th>
              <th scope="col">Fixed within</th>
            </tr>
          </thead>
          <tbody>
            {TARGETS.map((t) => (
              <tr key={t.level}>
                <th scope="row">{t.level}</th>
                <td>{t.reply}</td>
                <td>{t.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      broken={
        <div className="hd-box">
          <p className="hd-meta">We reply as soon as we can.</p>
        </div>
      }
    />
  );
}

// Item 5: the request was sorted and routed on arrival.
export function Routing() {
  return (
    <Swap
      item={5}
      good={
        <dl className="hd-facts" aria-label="Where your request went">
          <div><dt>Topic</dt><dd>Billing</dd></div>
          <div><dt>Team</dt><dd>The billing team</dd></div>
          <div><dt>Priority</dt><dd>Normal: first reply in 1 day</dd></div>
        </dl>
      }
      broken={
        <dl className="hd-facts" aria-label="Where your request went">
          <div><dt>Team</dt><dd>Everyone (shared queue)</dd></div>
          <div><dt>Note</dt><dd>Passed between teams by hand.</dd></div>
        </dl>
      }
    />
  );
}

// Item 6: who is helping, and what happens next.
export function Progress() {
  return (
    <Swap
      item={6}
      good={
        <dl className="hd-facts" aria-label="Progress">
          <div><dt>Helping you</dt><dd>Sam, from the billing team</dd></div>
          <div><dt>Doing now</dt><dd>Checking the invoice you sent</dd></div>
          <div><dt>Next</dt><dd>You will hear from Sam by Thursday 14:00</dd></div>
        </dl>
      }
      broken={
        <dl className="hd-facts" aria-label="Progress">
          <div><dt>Status</dt><dd>Open</dd></div>
        </dl>
      }
    />
  );
}

// Item 7: history, so nobody asks again.
export function History() {
  return (
    <Swap
      item={7}
      good={
        <ul className="hd-list" aria-label="History on this topic">
          <li>
            <span className="hd-strong">9 March, email</span>
            <span className="hd-meta">You sent the invoice number. Sam has it, so you do not need to send it again.</span>
          </li>
          <li>
            <span className="hd-strong">3 March, chat</span>
            <span className="hd-meta">A first question about the same invoice, answered by Priya.</span>
          </li>
        </ul>
      }
      broken={<p className="hd-meta">No history. Each new person starts with: please tell us your order number and what happened.</p>}
    />
  );
}

// Item 8: only what is needed, deleted on schedule.
export function Privacy() {
  return (
    <Swap
      item={8}
      good={
        <div className="hd-box">
          <p>We keep only your email, order number and messages. We delete a closed request after 12 months.</p>
          <p>
            <Link href="https://example.com/privacy">Privacy policy</Link>
          </p>
        </div>
      }
      broken={
        <div className="hd-box">
          <p className="hd-meta">Nothing here says what is kept or for how long.</p>
        </div>
      }
    />
  );
}

// Item 10: complaints counted, with a cause and a fix.
export function Complaints() {
  return (
    <Swap
      item={10}
      good={
        <div className="hd-box">
          <p className="hd-strong">14 complaints this quarter, down from 22</p>
          <p className="hd-meta">Main cause: replies later than promised. Fix: a second person on the early shift.</p>
        </div>
      }
      broken={
        <div className="hd-box">
          <p className="hd-meta">Each complaint is answered on its own. Nobody counts them.</p>
        </div>
      }
    />
  );
}
