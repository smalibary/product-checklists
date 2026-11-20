"use client";

import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/react/password-input";
import { useMet } from "../../components/checklist-layer/met-context";
import { Fit } from "../../components/checklist-layer/fit";
import { Variants } from "../../components/checklist-layer/swap";

type Props = {
  value: string;
  again: string;
  onValue: (v: string) => void;
  onAgain: (v: string) => void;
  onPasteBlocked: () => void;
};

// Item 8: one field with Show, or (unticked) two plain fields to match. Only the active one is drawn; the spot glides between heights. Item 11 is the autocomplete attribute, item 19 is paste,
// item 18 is the visible label (an unticked label folds away).
export function PasswordField({ value, again, onValue, onAgain, onPasteBlocked }: Props) {
  const { isMet } = useMet();
  const noPaste = isMet(19)
    ? undefined
    : (e: React.ClipboardEvent) => {
        e.preventDefault();
        onPasteBlocked();
      };
  const complete = isMet(11) ? "new-password" : "off";
  const labelClass = isMet(18) ? undefined : "sr";
  const hint = isMet(18) ? "" : "New password";

  const one = (
    <Field>
      <Fit>
        <FieldLabel className={labelClass}>New password</FieldLabel>
      </Fit>
      <PasswordInput name="new-password" value={value} autoComplete={complete} onValueChange={onValue}>
        <PasswordInputControl placeholder={hint} onPaste={noPaste} />
        <PasswordInputToggle>
          {(state) =>
            state.visible ? (
              <>
                <EyeSlash size={18} aria-hidden="true" />
                Hide<span className="sr"> password</span>
              </>
            ) : (
              <>
                <Eye size={18} aria-hidden="true" />
                Show<span className="sr"> password</span>
              </>
            )
          }
        </PasswordInputToggle>
      </PasswordInput>
    </Field>
  );

  const two = (
    <div className="rp-two">
      <Field>
        <Fit>
        <FieldLabel className={labelClass}>New password</FieldLabel>
      </Fit>
        <Input
          type="password"
          name="new-password"
          autoComplete={complete}
          placeholder={hint}
          value={value}
          onChange={(e) => onValue(e.target.value)}
          onPaste={noPaste}
        />
      </Field>
      <Field>
        <Fit>
        <FieldLabel className={labelClass}>Confirm new password</FieldLabel>
      </Fit>
        <Input
          type="password"
          name="confirm-password"
          autoComplete={complete}
          placeholder={isMet(18) ? "" : "Confirm new password"}
          value={again}
          onChange={(e) => onAgain(e.target.value)}
          onPaste={noPaste}
        />
      </Field>
    </div>
  );

  return <Variants item={8} active={isMet(8) ? "one" : "two"} parts={{ one, two }} />;
}

export function usePasteNote() {
  const [shown, setShown] = useState(false);
  return { shown, show: () => setShown(true) };
}
