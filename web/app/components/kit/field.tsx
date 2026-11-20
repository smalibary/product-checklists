"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { Fit } from "../checklist-layer/fit";
import { RevealInput } from "./reveal-input";

type Rule = { label: string; validate?: (value: string) => string | undefined };
type FormValue = { submitted: boolean; register: (name: string, rule: Rule) => () => void };
const FormCtx = createContext<FormValue | null>(null);

export type TextFieldProps = {
  label: string;
  name: string;
  // Help text under the label, before the field: format or an example.
  hint?: string;
  optional?: boolean;
  required?: boolean;
  // Says "(required)" in words next to the label. Off in forms, where the optional ones are marked.
  markRequired?: boolean;
  prefix?: string;
  suffix?: string;
  // Width hints at the expected length.
  size?: "short" | "medium" | "long";
  maxLength?: number;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  spellCheck?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
  // A password field with a Show / Hide button (the text is a password either way).
  reveal?: boolean;
  // Checklist pages only: the spot on the Show button, and its broken version (the button folds away).
  revealSpot?: number;
  revealGone?: boolean;
  // The label is kept for screen readers only. Gliding to the new height is for the checklist pages.
  hideLabel?: boolean;
  onValueChange?: (value: string) => void;
  onPaste?: (event: React.ClipboardEvent) => void;
  // A fixed error (for a state shown on its own); otherwise the error comes from validate.
  error?: string;
  // Returns the error in words, or nothing. Checked when leaving the field or on submit.
  validate?: (value: string) => string | undefined;
};

// The one text field: a visible label, hint, optional prefix and suffix, character count, and an
// error shown by border, icon and words. Wraps the ui-sdk Field and Input, which link the label,
// hint and error to the input for screen readers.
export function TextField(p: TextFieldProps) {
  const form = useContext(FormCtx);
  const [value, setValue] = useState(p.defaultValue ?? "");
  const [touched, setTouched] = useState(false);
  const { name, label, validate } = p;

  useEffect(() => form?.register(name, { label, validate }));

  const error = p.error ?? (touched || form?.submitted ? validate?.(value) : undefined);
  const change = (v: string) => {
    setValue(v);
    p.onValueChange?.(v);
  };
  const marker = p.optional ? " (optional)" : p.required && p.markRequired ? " (required)" : "";

  const labelEl = (
    <FieldLabel className={p.hideLabel ? "sr" : undefined}>
      {p.label}
      {marker && <span className="kit-field-mark">{marker}</span>}
    </FieldLabel>
  );
  const labelNode = p.hideLabel === undefined ? labelEl : <Fit>{labelEl}</Fit>;

  return (
    <Field name={name} className="kit-field" invalid={error ? true : undefined} disabled={p.disabled} data-size={p.size ?? "long"}>
      {labelNode}
      {p.hint && <FieldDescription>{p.hint}</FieldDescription>}
      <div className="kit-field-row" data-prefix={p.prefix ? "" : undefined} data-suffix={p.suffix ? "" : undefined}>
        {p.prefix && <span className="kit-affix" data-side="start">{p.prefix}</span>}
        {p.reveal ? (
          <RevealInput
            name={name}
            value={value}
            autoComplete={p.autoComplete}
            placeholder={p.placeholder}
            onValueChange={change}
            onPaste={p.onPaste}
            spot={p.revealSpot}
            gone={p.revealGone}
          />
        ) : (
          <Input
            type={p.type ?? "text"}
            inputMode={p.inputMode}
            autoComplete={p.autoComplete}
            spellCheck={p.spellCheck ?? false}
            readOnly={p.readOnly}
            required={p.required}
            maxLength={p.maxLength}
            placeholder={p.placeholder}
            dir="auto"
            value={value}
            onValueChange={change}
            onPaste={p.onPaste}
            onBlur={() => setTouched(true)}
          />
        )}
        {p.suffix && <span className="kit-affix" data-side="end">{p.suffix}</span>}
      </div>
      {p.maxLength && (
        <FieldDescription className="kit-count">
          {value.length} / {p.maxLength}
        </FieldDescription>
      )}
      {error && (
        <FieldError match className="kit-error">
          <WarningCircle size={16} weight="fill" aria-hidden="true" />
          {error}
        </FieldError>
      )}
    </Field>
  );
}

// One message about the whole form (not one field), in the same look as a field's error.
export function FormMessage({ children }: { children: ReactNode }) {
  return (
    <p className="kit-error" role="alert">
      <WarningCircle size={16} weight="fill" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export type Problem = { name: string; label: string; message: string };

// The summary at the top of a form after a failed send: each problem is a button that jumps to its field.
export function ErrorSummary({ problems, onPick }: { problems: Problem[]; onPick: (name: string) => void }) {
  if (problems.length === 0) return null;
  return (
    <div className="kit-summary" role="alert">
      <strong>
        <WarningCircle size={18} weight="fill" aria-hidden="true" /> Please fix {problems.length}{" "}
        {problems.length === 1 ? "problem" : "problems"}
      </strong>
      <ul>
        {problems.map((p) => (
          <li key={p.name}>
            <button type="button" className="kit-summary-link" onClick={() => onPick(p.name)}>
              {p.label}: {p.message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The one form layout: one column, labels above, related fields grouped, the main button at the
// end, and after a failed send an error summary at the top (plus the message at each field).
export function FormLayout({
  label,
  actions,
  onSent,
  summary = true,
  children,
}: {
  label: string;
  actions: ReactNode;
  onSent?: (data: FormData) => void;
  // Show the error summary at the top after a failed send.
  summary?: boolean;
  children: ReactNode;
}) {
  const rules = useRef(new Map<string, Rule>());
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);

  function scan(): Problem[] {
    const data = new FormData(formRef.current ?? undefined);
    return [...rules.current].flatMap(([name, r]) => {
      const message = r.validate?.(String(data.get(name) ?? ""));
      return message ? [{ name, label: r.label, message }] : [];
    });
  }
  function focusField(name: string) {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    const found = scan();
    setSubmitted(true);
    setProblems(found);
    if (found.length === 0) onSent?.(new FormData(formRef.current ?? undefined));
    else requestAnimationFrame(() => focusField(found[0].name));
  }

  const ctx: FormValue = {
    submitted,
    register: (name, rule) => {
      rules.current.set(name, rule);
      return () => void rules.current.delete(name);
    },
  };

  return (
    <FormCtx.Provider value={ctx}>
      <form
        ref={formRef}
        className="kit-form"
        aria-label={label}
        noValidate
        onSubmit={submit}
        onInput={() => submitted && setProblems(scan())}
      >
        {summary && <ErrorSummary problems={problems} onPick={focusField} />}
        {children}
        <div className="kit-form-actions">{actions}</div>
      </form>
    </FormCtx.Provider>
  );
}

// Related fields grouped under a heading.
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="kit-section">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}
