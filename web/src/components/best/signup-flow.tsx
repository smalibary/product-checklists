// The best-version sign-up: every screen works, sending is faked (nothing leaves the page).
// Built to meet the sign-up checklist: ways in, form, emailed code, welcome.
import { useEffect, useState } from "react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/react/password-input"
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Big, Divider, Phone, Small, TextField, TextLink, emailError, inputClass, suggestDomain } from "./parts"
import type { Theme } from "./theme"

type Screen = "ways" | "form" | "code" | "welcome"
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const CODE = "482913"

const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "A number or a symbol", test: (p: string) => /[\d\W_]/.test(p) },
]

export function BestSignUp({ theme, appName }: { theme: Theme; appName: string }) {
  const [screen, setScreen] = useState<Screen>("ways")
  const [email, setEmail] = useState("")
  const [via, setVia] = useState("")
  const back = (to: Screen) => (
    <button type="button" onClick={() => setScreen(to)} aria-label="Back" className="-ml-2 mb-4 inline-flex size-11 items-center justify-center rounded-full hover:bg-muted">
      <ArrowLeft className="size-5" />
    </button>
  )
  return (
    <Phone theme={theme}>
      {screen === "ways" && <Ways appName={appName} onEmail={() => setScreen("form")} onOther={(p) => { setVia(p); setScreen("welcome") }} />}
      {screen === "form" && (
        <>
          {back("ways")}
          <Form email={email} setEmail={setEmail} onDone={() => setScreen("code")} />
        </>
      )}
      {screen === "code" && (
        <>
          {back("form")}
          <Code email={email} onDone={() => { setVia("email"); setScreen("welcome") }} />
        </>
      )}
      {screen === "welcome" && <Welcome appName={appName} via={via} onAgain={() => { setEmail(""); setScreen("ways") }} />}
    </Phone>
  )
}

function Ways({ appName, onEmail, onOther }: { appName: string; onEmail: () => void; onOther: (p: string) => void }) {
  const [busy, setBusy] = useState("")
  const go = async (p: string) => { setBusy(p); await wait(900); setBusy(""); onOther(p) }
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mt-6 text-[28px] leading-tight font-bold">Create your {appName} account</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">Free. Takes under a minute.</p>
      {/* the ways in sit low on the screen, where a thumb reaches */}
      <div className="mt-auto flex flex-col gap-3">
        <Big variant="outline" busy={busy === "passkey"} onClick={() => go("passkey")}><KeyRound className="size-4" />Sign up with a passkey</Big>
        <Big variant="outline" busy={busy === "Apple"} onClick={() => go("Apple")}><AppleMark />Sign up with Apple</Big>
        <Big variant="outline" busy={busy === "Google"} onClick={() => go("Google")}><GoogleMark />Sign up with Google</Big>
        <Divider>or</Divider>
        <Big onClick={onEmail}><Mail className="size-4" />Sign up with email</Big>
        <Small className="mt-2">
          By signing up you agree to our <u>Terms</u> and <u>Privacy Policy</u>.
        </Small>
        <Small>Already have an account? <TextLink>Sign in</TextLink></Small>
      </div>
    </div>
  )
}

function Form({ email, setEmail, onDone }: { email: string; setEmail: (v: string) => void; onDone: () => void }) {
  const [password, setPassword] = useState("")
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const [pwLeft, setPwLeft] = useState(false)
  const suggestion = suggestDomain(email)
  const pwOk = RULES.every((r) => r.test(password))
  const pwError = (pwLeft || tried) && !pwOk ? (password ? "The password needs every point below." : "Choose a password.") : ""

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (emailError(email) || !pwOk) {
      // move to the first field that needs fixing
      ;(e.currentTarget as HTMLFormElement).querySelector<HTMLElement>("[aria-invalid=true]")?.focus()
      return
    }
    setBusy(true)
    await wait(1100)
    setBusy(false)
    onDone()
  }

  return (
    <form noValidate onSubmit={send} className="flex flex-1 flex-col gap-5">
      <h1 className="text-[26px] leading-tight font-bold">Sign up with email</h1>
      <TextField
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="next"
        value={email}
        onChange={setEmail}
        check={emailError}
        forceCheck={tried}
        hint={suggestion ? (
          <>Did you mean <button type="button" className="font-medium text-foreground underline underline-offset-4" onClick={() => setEmail(suggestion)}>{suggestion}</button>?</>
        ) : "We send a 6-digit code here to confirm it."}
      />
      <Field invalid={pwError ? true : undefined} className="flex flex-col gap-1.5">
        <FieldLabel className="text-sm font-medium">Password</FieldLabel>
        <PasswordInput value={password} autoComplete="new-password" onValueChange={(v) => setPassword(v)}>
          <div className="relative">
            <PasswordInputControl enterKeyHint="done" onBlur={() => setPwLeft(true)} className={cn(inputClass, "pr-12")} />
            <PasswordInputToggle aria-label="Show password" className="absolute top-0.5 right-0.5 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground">
              {(s) => (s.visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />)}
            </PasswordInputToggle>
          </div>
        </PasswordInput>
        {/* the rules show from the start and tick as they are met, while typing */}
        <FieldDescription render={<ul />} className="mt-1 flex flex-col gap-1 text-[13px]">
          {RULES.map((r) => (
            <li key={r.label} className={cn("flex items-center gap-1.5", r.test(password) ? "text-emerald-700" : "text-muted-foreground")}>
              <Check className={cn("size-3.5", !r.test(password) && "opacity-30")} aria-hidden="true" />
              {r.label}
              <span className="sr-only">{r.test(password) ? ", done" : ", not yet"}</span>
            </li>
          ))}
        </FieldDescription>
        {pwError && <FieldError match role="alert" className="text-[13px] text-destructive">{pwError}</FieldError>}
      </Field>
      {/* sticky so it stays above the phone keyboard while typing */}
      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-background pt-3">
        <Big type="submit" busy={busy}>{busy ? "Creating your account" : "Create account"}</Big>
        <Small>By creating an account you agree to our <u>Terms</u> and <u>Privacy Policy</u>.</Small>
      </div>
    </form>
  )
}

function Code({ email, onDone }: { email: string; onDone: () => void }) {
  const [code, setCode] = useState("")
  const [wrong, setWrong] = useState(false)
  const [busy, setBusy] = useState(false)
  const [left, setLeft] = useState(30)
  const [sent, setSent] = useState(false)
  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  const check = async (v: string) => {
    setBusy(true)
    await wait(800)
    setBusy(false)
    if (v === CODE) onDone()
    else setWrong(true)
  }
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-[26px] leading-tight font-bold">Check your email</h1>
      <p className="text-[15px] text-muted-foreground">
        We sent a 6-digit code to <span className="font-medium text-foreground">{email || "your email"}</span>. It works for 10 minutes.
      </p>
      <Field invalid={wrong ? true : undefined} className="flex flex-col gap-2">
        <FieldLabel className="text-sm font-medium">Code</FieldLabel>
        <OTPInput
          maxLength={6}
          pattern="digits"
          value={code}
          disabled={busy}
          onValueChange={(v) => { setCode(v); setWrong(false) }}
          onValueCommit={(v) => check(v)}
        >
          <OTPInputGroup className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <OTPInputSlot key={i} index={i} className="flex h-14 w-12 items-center justify-center rounded-lg border border-input text-xl font-semibold data-active:border-ring data-active:ring-3 data-active:ring-ring/40" />
            ))}
          </OTPInputGroup>
        </OTPInput>
        <FieldDescription className="text-[13px] text-muted-foreground">Pasting the whole code works too. (In this demo the code is {CODE}.)</FieldDescription>
        {wrong && <FieldError match role="alert" className="text-[13px] text-destructive">That code is not right. Check the latest email, or send a new code.</FieldError>}
      </Field>
      <div className="flex flex-col items-start text-[14px]">
        {left > 0 ? (
          <p className="min-h-11 py-3 text-muted-foreground" aria-live="polite">{sent ? "New code sent. " : ""}You can send a new code in {left} s.</p>
        ) : (
          <TextLink onClick={() => { setLeft(30); setSent(true); setCode("") }}>Send a new code</TextLink>
        )}
        <TextLink>Use a different email</TextLink>
      </div>
      <div className="mt-auto">
        <Big busy={busy} disabled={code.length < 6} onClick={() => check(code)}>{busy ? "Checking" : "Confirm"}</Big>
        {code.length < 6 && <Small className="mt-2">Enter all 6 digits to confirm.</Small>}
      </div>
    </div>
  )
}

function Welcome({ appName, via, onAgain }: { appName: string; via: string; onAgain: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-16 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Check className="size-7" />
      </div>
      <h1 className="mt-6 text-[28px] leading-tight font-bold">You're in</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        Your {appName} account is ready{via && via !== "email" ? `, made with ${via}` : ""}. You stay signed in on this phone.
      </p>
      <div className="mt-auto flex flex-col gap-3">
        <Big>Start exploring</Big>
        <Big variant="ghost" onClick={onAgain}>Run the sign-up again</Big>
      </div>
    </div>
  )
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M16.4 12.6c0-2.5 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-.9-2.4-3.8zM14 5.3c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" />
    </svg>
  )
}
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7H2.1a11 11 0 0 0 0 9.9l3.7-2.7z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  )
}
