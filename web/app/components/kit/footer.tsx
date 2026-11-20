"use client";

import type { ReactNode } from "react";
import { ArrowUp, EnvelopeSimple, LinkedinLogo, XLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./button";
import { FormLayout, TextField } from "./field";
import { Link } from "./link";
import { Part, type Spots } from "./part";

export type FooterVariant = "full" | "slim";

const GROUPS = [
  { title: "Product", links: ["Features", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Contact us"] },
  { title: "Resources", links: ["Documentation", "Guides", "Blog"] },
];
const SOCIAL = [
  { label: "X", icon: <XLogo size={18} aria-hidden="true" /> },
  { label: "LinkedIn", icon: <LinkedinLogo size={18} aria-hidden="true" /> },
  { label: "YouTube", icon: <YoutubeLogo size={18} aria-hidden="true" /> },
];

// The one footer of the site: "full" (link groups, contact, newsletter and the legal strip) or
// "slim" (the legal strip only, for sign-in and similar pages). Same order and places everywhere.
export function SiteFooter({
  variant = "full",
  spots,
  brokens,
  socialNames = true,
}: {
  variant?: FooterVariant;
  spots?: Spots;
  brokens?: Record<string, ReactNode>;
  // Social links say their name in words, not only an icon.
  socialNames?: boolean;
}) {
  const full = variant === "full";
  const P = (name: string, children: ReactNode, axis: "x" | "y" = "x") => (
    <Part name={name} spots={spots} axis={axis} broken={brokens?.[name]}>
      {children}
    </Part>
  );
  const year = new Date().getFullYear();

  return (
    <Part name="root" spots={spots} axis="y" broken={brokens?.root}>
      <footer className="kit-footer" data-variant={variant}>
        {full &&
          P(
            "groups",
            <div className="kit-ft-cols">
              {GROUPS.map((g) => (
                <nav key={g.title} className="kit-ft-col" aria-labelledby={`ft-${g.title}`}>
                  <h2 id={`ft-${g.title}`}>{g.title}</h2>
                  <ul>
                    {g.links.map((l) => (
                      <li key={l}>
                        <Link href={`#${l.toLowerCase().replace(/ /g, "-")}`}>{l}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>,
            "y",
          )}

        {full && (
          <div className="kit-ft-row">
            {P(
              "contact",
              <address className="kit-ft-contact">
                <strong>Contact</strong>
                <Link href="mailto:hello@example.com">hello@example.com</Link>
                <Link href="tel:+10000000000">+1 000 000 0000</Link>
              </address>,
            )}
            {P(
              "company",
              <p className="kit-ft-company">
                Lorem Ltd, registration 000000
                <br />
                1 Example Street, Sampletown
              </p>,
            )}
            {P(
              "newsletter",
              <div className="kit-ft-news">
                <FormLayout
                  label="Newsletter"
                  actions={<Button type="submit" kind="primary" size="md" icon={<EnvelopeSimple size={18} aria-hidden="true" />}>Subscribe</Button>}
                >
                  <TextField
                    label="Email for the newsletter"
                    name="news-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    validate={(v) => (/^\S+@\S+\.\S+$/.test(v) ? undefined : "Enter an email address like name@example.com.")}
                  />
                  <p className="kit-ft-consent">
                    One email a month, nothing else. Unsubscribe at any time. See our <Link href="#privacy">privacy policy</Link>.
                  </p>
                </FormLayout>
              </div>,
            )}
          </div>
        )}

        <div className="kit-ft-end">
          {P("copyright", <span>&copy; {year} Lorem Ltd</span>)}
          {P(
            "legal",
            <ul className="kit-ft-legal" aria-label="Legal">
              <li>
                <Link href="#privacy">Privacy policy</Link>
              </li>
              <li>
                <Link href="#terms">Terms</Link>
              </li>
              {full && (
                <li>
                  <Link href="#cookies">Cookie settings</Link>
                </li>
              )}
            </ul>,
          )}
          {full && P("ccpa", <Link href="#do-not-sell">Do not sell or share my personal information</Link>)}
          {full && P("a11y", <Link href="#accessibility">Accessibility statement</Link>)}
          {P(
            "support",
            <ul className="kit-ft-legal" aria-label="Support">
              {full && (
                <li>
                  <Link href="#status">System status</Link>
                </li>
              )}
              <li>
                <Link href="#help">Help centre</Link>
              </li>
            </ul>,
          )}
          {full &&
            P(
              "social",
              <ul className="kit-ft-social" aria-label="Social media">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <Link href="#social" standalone>
                      {s.icon}
                      {socialNames ? <span style={{ marginInlineStart: 6 }}>{s.label}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>,
            )}
          {full &&
            P(
              "language",
              <label className="kit-ft-lang">
                <span className="sr">Language and region</span>
                <select defaultValue="en" name="language">
                  <option value="en">English (International)</option>
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                </select>
              </label>,
            )}
          {full &&
            P(
              "top",
              <Link href="#home" standalone>
                <ArrowUp size={16} aria-hidden="true" /> <span style={{ marginInlineStart: 4 }}>Back to top</span>
              </Link>,
            )}
        </div>
      </footer>
    </Part>
  );
}
