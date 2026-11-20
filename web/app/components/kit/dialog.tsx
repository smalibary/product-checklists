"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { Button, type ButtonKind } from "./button";
import { Part, type Spots } from "./part";

type CardProps = {
  title: string;
  children: ReactNode;
  // The buttons row (a ButtonGroup). Put the main action last.
  actions?: ReactNode;
  // The body scrolls inside the card when it is longer than the screen.
  scroll?: boolean;
  // The close button's name for screen readers.
  closeLabel?: string;
  onClose?: () => void;
  // Checklist item for the body's scrolling (example pages only).
  bodySpot?: number;
  // Name the dialog from its title (aria-labelledby). On by default.
  named?: boolean;
  spots?: Spots;
  brokens?: Record<string, ReactNode>;
  // The real ui-sdk dialog (top layer) or the plain card drawn inside an example.
  real?: boolean;
};

// The card of every modal: a title, a close button with a name, a body that scrolls inside when
// long, and a row of buttons. Parts: title, close.
export function ModalCard({
  title,
  children,
  actions,
  scroll = true,
  closeLabel = "Close",
  onClose,
  bodySpot,
  named = true,
  spots,
  brokens,
  real = false,
}: CardProps) {
  const id = useId();
  const heading = real ? (
    <DialogTitle className="kit-mtitle">{title}</DialogTitle>
  ) : (
    <h2 id={id} className="kit-mtitle" tabIndex={-1} data-modal-title>
      {title}
    </h2>
  );
  const close = real ? (
    <DialogClose className="kit-mx" aria-label={closeLabel}>
      <X size={20} aria-hidden="true" />
    </DialogClose>
  ) : (
    <button type="button" className="kit-mx" aria-label={closeLabel} onClick={onClose}>
      <X size={20} aria-hidden="true" />
    </button>
  );
  const inner = (
    <>
      <div className="kit-mhead">
        <Part name="title" spots={spots} axis="y" broken={brokens?.title}>
          {heading}
        </Part>
        <Part name="close" spots={spots} broken={brokens?.close ?? <span className="kit-mx-bare" aria-hidden="true">x</span>}>
          {close}
        </Part>
      </div>
      <div className="kit-mbody" data-scroll={scroll || undefined} data-item={bodySpot}>
        {children}
      </div>
      {actions && <div className="kit-mfoot">{actions}</div>}
    </>
  );
  if (real) {
    return <DialogContent className="kit-mcard kit-mdialog">{inner}</DialogContent>;
  }
  return (
    <div
      className="kit-mcard"
      role="dialog"
      aria-modal="true"
      aria-labelledby={named ? id : undefined}
    >
      {inner}
    </div>
  );
}

export type ModalPlace = "center" | "sheet" | "wide" | "corner";

// A made-up page with a modal open over it, drawn inside the example (the real dialog sits in the
// browser's top layer, where the checklist's numbered spots could not be seen). The page behind
// is hidden from screen readers and keyboards while open, the backdrop dims it, and the card sits
// centred (desktop), as a bottom sheet (phone) or full width.
export function ModalStage({
  open,
  page,
  children,
  place = "center",
  dim = true,
  inert = true,
  scrollsBehind = false,
  unbounded = false,
  tall = false,
  dimSpot,
  cardSpot,
  onEscape,
  onBackdrop,
  focusIn = true,
  focusBack = true,
}: {
  open: boolean;
  // The page behind. Anything with data-opener gets the focus back when the modal closes.
  page: ReactNode;
  children: ReactNode;
  place?: ModalPlace;
  dim?: boolean;
  inert?: boolean;
  scrollsBehind?: boolean;
  unbounded?: boolean;
  tall?: boolean;
  dimSpot?: number | string;
  cardSpot?: number | string;
  onEscape?: () => void;
  onBackdrop?: () => void;
  focusIn?: boolean;
  focusBack?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (open && seen.current && focusIn) {
      el.querySelector<HTMLElement>("[data-modal-title]")?.focus({ preventScroll: true });
    }
    if (!open && seen.current && focusBack && el.contains(document.activeElement || null)) {
      el.querySelector<HTMLElement>("[data-opener]")?.focus({ preventScroll: true });
    }
    seen.current = true;
  }, [open, focusIn, focusBack]);

  return (
    <div
      ref={root}
      className="kit-mstage"
      data-tall={tall || undefined}
      onKeyDown={(e) => {
        if (open && e.key === "Escape") onEscape?.();
      }}
    >
      <div className="kit-mpage" data-scrolls={scrollsBehind || undefined} inert={open && inert}>
        {page}
      </div>
      <div
        className="kit-mback"
        data-open={open}
        data-dim={dim}
        data-item={dimSpot}
        onClick={() => open && onBackdrop?.()}
      />
      <div className="kit-mpos" data-open={open} data-place={place} aria-hidden={open ? undefined : true} inert={!open}>
        <div className="kit-mslot" data-unbounded={unbounded || undefined} data-item={cardSpot}>
          {children}
        </div>
      </div>
    </div>
  );
}

// The real modal for pages: ui-sdk's dialog in the browser top layer. It traps focus, makes the
// page behind inert, closes on Escape and on a press outside, and returns focus to the opener.
// Pass dismissible={false} for a modal that must be answered.
export function Modal({
  opener,
  openerKind = "secondary",
  title,
  children,
  actions,
  closeLabel,
  dismissible = true,
}: {
  opener: string;
  openerKind?: ButtonKind;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  closeLabel?: string;
  dismissible?: boolean;
}) {
  return (
    <Dialog dismissible={dismissible}>
      <DialogTrigger render={<Button kind={openerKind} />}>{opener}</DialogTrigger>
      <DialogBackdrop className="kit-mback-real" />
      <ModalCard real title={title} actions={actions} closeLabel={closeLabel}>
        {children}
      </ModalCard>
    </Dialog>
  );
}

// A button inside a real modal that closes it.
export function ModalClose({ kind = "secondary", children }: { kind?: ButtonKind; children: ReactNode }) {
  return <DialogClose render={<Button kind={kind} />}>{children}</DialogClose>;
}
