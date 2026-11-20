"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CaretDown, List, MagnifyingGlass, Planet, UserCircle, X } from "@phosphor-icons/react/dist/ssr";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu";
import { Button } from "./button";
import { Link } from "./link";
import { Part, type Spots } from "./part";
import { Reveal } from "./reveal";

export type HeaderVariant = "site" | "slim" | "app";
type NavItem = { label: string; href?: string; children?: { label: string; href: string }[] };

const SITE_MENU: NavItem[] = [
  { label: "Features", children: ["Overview", "Security", "Integrations"].map((l) => ({ label: l, href: `#${l.toLowerCase()}` })) },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "About", href: "#about" },
];
const APP_MENU: NavItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Projects", href: "#projects" },
  { label: "Reports", href: "#reports" },
];

export type HeaderProps = {
  variant?: HeaderVariant;
  // The section the visitor is in, marked in the menu (when markCurrent is on).
  current?: string;
  markCurrent?: boolean;
  // Sticky stays small and shrinks once the page scrolls; shrink={false} is the oversized kind.
  sticky?: boolean;
  shrink?: boolean;
  // Fold the menu into a menu button on small screens.
  fold?: boolean;
  // Give the menu button a visible word. Off, it is an icon with no name.
  menuButtonLabel?: boolean;
  // Checklist spots by part name (example pages only). Parts without one are simply drawn.
  spots?: Spots;
  brokens?: Record<string, ReactNode>;
};

// The one header of the site, in three variants: "site" (the full menu), "slim" (logo and help only,
// for sign-in and similar pages) and "app" (the signed-in menu). Same order, same places everywhere.
export function SiteHeader({
  variant = "site",
  current,
  markCurrent = true,
  sticky = false,
  shrink = true,
  fold = true,
  menuButtonLabel = true,
  spots,
  brokens,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const panel = useId();
  const menu = variant === "site" ? SITE_MENU : variant === "app" ? APP_MENU : [];
  const full = variant !== "slim";

  useEffect(() => {
    const el = sentinel.current;
    if (!sticky || !shrink || !el) return;
    let root: Element | null = null;
    for (let p = el.parentElement; p && !root; p = p.parentElement) {
      if (/auto|scroll/.test(getComputedStyle(p).overflowY)) root = p;
    }
    const io = new IntersectionObserver(([e]) => setShrunk(!e.isIntersecting), { root });
    io.observe(el);
    return () => io.disconnect();
  }, [sticky, shrink]);

  const P = (name: string, children: ReactNode, axis: "x" | "y" = "x") => (
    <Part name={name} spots={spots} axis={axis} broken={brokens?.[name]}>
      {children}
    </Part>
  );
  const here = (label: string) => markCurrent && label === current;
  const canFold = fold && full;
  const panelLinks: { label: string; href: string }[] = [
    ...menu.flatMap((m) => m.children ?? [{ label: m.label, href: m.href ?? "#" }]),
    { label: "Help", href: "#help" },
    ...(variant === "site" ? [{ label: "Sign in", href: "#sign-in" }] : []),
  ];

  return (
    <>
      {sticky && <div ref={sentinel} className="kit-hd-sentinel" aria-hidden="true" />}
      <header
        className="kit-header"
        data-variant={variant}
        data-sticky={sticky || undefined}
        data-shrunk={(sticky && shrink && shrunk) || undefined}
        data-tall={(sticky && !shrink) || undefined}
        data-fold={canFold}
        data-item={sticky ? spots?.sticky : undefined}
      >
        <a className="kit-skip" href="#main">
          Skip to content
        </a>
        <div className="kit-hd-in">
          {P(
            "logo",
            <a className="kit-logo" href="#home" aria-label="Lorem, home page">
              <Planet size={24} weight="fill" aria-hidden="true" />
              <span>Lorem</span>
            </a>,
          )}

          {full &&
            P(
              "menu",
              <nav className="kit-nav" aria-label="Main" data-item={fold ? undefined : spots?.menubtn}>
                <NavigationMenu aria-label="Main menu">
                  <NavigationMenuList>
                    {menu.map((m) =>
                      m.children ? (
                        <NavigationMenuItem key={m.label} value={m.label.toLowerCase()}>
                          <NavigationMenuTrigger>
                            {m.label}
                            <CaretDown size={14} aria-hidden="true" />
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul>
                              {m.children.map((c) => (
                                <li key={c.label}>
                                  <NavigationMenuLink href={c.href}>{c.label}</NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ) : (
                        <NavigationMenuItem key={m.label} data-item={m.label === current ? spots?.current : undefined}>
                          <NavigationMenuLink href={m.href} current={here(m.label)}>
                            {m.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ),
                    )}
                  </NavigationMenuList>
                  <NavigationMenuViewport sideOffset={8} />
                </NavigationMenu>
              </nav>,
            )}

          <div className="kit-hd-end">
            {full && (
              <div className="kit-search">
                {P("search", <Button kind="quiet" size="sm" icon={<MagnifyingGlass size={18} aria-hidden="true" />} label="Search" />)}
              </div>
            )}
            <div className="kit-utility">
              {P(
                "help",
                <Link href="#help" standalone>
                  Help
                </Link>,
              )}
              {variant === "site" &&
                P(
                  "utility",
                  <Link href="#sign-in" standalone>
                    Sign in
                  </Link>,
                )}
              {variant === "app" &&
                P("utility", <Button kind="quiet" size="sm" icon={<UserCircle size={22} aria-hidden="true" />} label="Account" />)}
            </div>
            {variant === "site" &&
              P(
                "action",
                <Button kind="primary" size="sm">
                  Start free
                </Button>,
              )}
          </div>

          {canFold && (
            <div className="kit-menu-btn" data-item={spots?.menubtn}>
              <Button
                kind="secondary"
                size="sm"
                icon={open ? <X size={18} aria-hidden="true" /> : <List size={18} aria-hidden="true" />}
                aria-expanded={open}
                aria-controls={panel}
                data-item={spots?.menulabel}
                onClick={() => setOpen((o) => !o)}
              >
                {menuButtonLabel ? "Menu" : undefined}
              </Button>
            </div>
          )}
        </div>

        {canFold && (
          <Reveal open={open} id={panel}>
            <ul className="kit-panel">
              {panelLinks.map((m) => (
                <li key={m.label}>
                  <Link href={m.href} standalone aria-current={here(m.label) ? "page" : undefined}>
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </header>
    </>
  );
}
