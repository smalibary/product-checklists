"use client";

import type { ClipboardEvent } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/react/password-input";

// The input of a password field with a Show / Hide button. Used inside TextField (reveal).
export function RevealInput({
  name,
  value,
  autoComplete,
  placeholder,
  onValueChange,
  onPaste,
}: {
  name: string;
  value: string;
  autoComplete?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onPaste?: (event: ClipboardEvent) => void;
}) {
  return (
    <PasswordInput name={name} value={value} autoComplete={autoComplete} onValueChange={onValueChange}>
      <PasswordInputControl placeholder={placeholder} onPaste={onPaste} />
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
  );
}
