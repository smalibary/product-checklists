// Pieces of the best-version sign-up: the phone frame, the big buttons and a labelled text field
// that checks itself when the person leaves it (not while typing) and clears its error once fixed.
import { useState, type ComponentProps, type ReactNode } from "react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { themeStyle, type Theme } from "./theme"

export function Phone({ theme, children }: { theme: Theme; children: ReactNode }) {
  return (
    <div
      style={themeStyle(theme)}
      className="relative h-[844px] w-[390px] shrink-0 overflow-y-auto rounded-[2.2rem] border-[10px] border-neutral-800 shadow-xl"
    >
      <div className="flex min-h-full flex-col px-6 pt-10 pb-8">{children}</div>
    </div>
  )
}

/** A main action: 48 pt tall (over the 44 recommended), shows loading and cannot be pressed twice. */
export function Big({ busy, variant = "solid", className, children, ...rest }: ComponentProps<"button"> & { busy?: boolean; variant?: "solid" | "outline" | "ghost" }) {
  return (
    <button
      {...rest}
      disabled={busy || rest.disabled}
      aria-busy={busy || undefined}
      style={{ borderRadius: "var(--bv-button-radius)" }}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 border text-[15px] font-semibold transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-70",
        variant === "solid" && "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border-border bg-background text-foreground hover:bg-muted",
        variant === "ghost" && "h-11 border-transparent text-foreground underline-offset-4 hover:underline",
        className
      )}
    >
      {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export const inputClass =
  "h-12 w-full rounded-lg border border-input bg-background px-3.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive"

type TextProps = {
  label: string
  value: string
  onChange: (v: string) => void
  /** returns the error to show, or "" when fine */
  check: (v: string) => string
  hint?: ReactNode
  /** shows the error now (after a send), even if the field was never left */
  forceCheck?: boolean
} & Omit<ComponentProps<"input">, "value" | "onChange" | "defaultValue" | "size" | "color">

export function TextField({ label, value, onChange, check, hint, forceCheck, ...input }: TextProps) {
  const [left, setLeft] = useState(false)
  const error = left || forceCheck ? check(value) : ""
  return (
    <Field invalid={error ? true : undefined} className="flex flex-col gap-1.5">
      <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
      <Input
        {...input}
        value={value}
        onValueChange={(v) => onChange(v)}
        onBlur={() => {
          onChange(value.trim())
          setLeft(true)
        }}
        className={inputClass}
      />
      {hint && !error && <FieldDescription className="text-[13px] text-muted-foreground">{hint}</FieldDescription>}
      {error && <FieldError match role="alert" className="text-[13px] text-destructive">{error}</FieldError>}
    </Field>
  )
}

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {children}
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export function Small({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-center text-[13px] leading-5 text-muted-foreground", className)}>{children}</p>
}

/** A text link that is still at least 44 pt tall to tap. */
export function TextLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-11 items-center px-1 font-medium text-foreground underline underline-offset-4">
      {children}
    </button>
  )
}

const DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com"]
/** "Did you mean gmail.com?" for a near miss of a common email domain. */
export function suggestDomain(email: string): string | null {
  const [user, domain] = email.trim().toLowerCase().split("@")
  if (!user || !domain || DOMAINS.includes(domain)) return null
  const near = DOMAINS.find((d) => distance(d, domain) <= 2)
  return near ? `${user}@${near}` : null
}
function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = keep
    }
  }
  return row[b.length]
}

export const emailError = (v: string) =>
  !v.trim() ? "Enter your email address." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter an email like name@example.com."
