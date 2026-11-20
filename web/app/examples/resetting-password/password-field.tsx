"use client";

import { useState } from "react";
import { useMet } from "../../components/checklist-layer/met-context";
import { Variants } from "../../components/checklist-layer/swap";
import { TextField } from "../../components/kit/field";

type Props = {
  value: string;
  again: string;
  onValue: (v: string) => void;
  onAgain: (v: string) => void;
  onPasteBlocked: () => void;
};

// Item 8: one field with Show, or (unticked) two plain fields to match. Only the active one is drawn; the spot glides between heights.
// Item 11 is the autocomplete attribute, item 19 is paste, item 18 is the visible label (an unticked label folds away).
export function PasswordField({ value, again, onValue, onAgain, onPasteBlocked }: Props) {
  const { isMet } = useMet();
  const noPaste = isMet(19)
    ? undefined
    : (e: React.ClipboardEvent) => {
        e.preventDefault();
        onPasteBlocked();
      };
  const common = {
    hideLabel: !isMet(18),
    autoComplete: isMet(11) ? "new-password" : "off",
    onPaste: noPaste,
  };
  const hint = isMet(18) ? undefined : "New password";

  const one = (
    <TextField {...common} label="New password" name="new-password" reveal placeholder={hint} defaultValue={value} onValueChange={onValue} />
  );
  const two = (
    <div className="rp-two">
      <TextField {...common} label="New password" name="new-password" type="password" placeholder={hint} defaultValue={value} onValueChange={onValue} />
      <TextField
        {...common}
        label="Confirm new password"
        name="confirm-password"
        type="password"
        placeholder={isMet(18) ? undefined : "Confirm new password"}
        defaultValue={again}
        onValueChange={onAgain}
      />
    </div>
  );

  return <Variants item={8} active={isMet(8) ? "one" : "two"} parts={{ one, two }} />;
}

export function usePasteNote() {
  const [shown, setShown] = useState(false);
  return { shown, show: () => setShown(true) };
}
