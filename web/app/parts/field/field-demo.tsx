"use client";

import { useState, type ReactNode } from "react";
import { useMet } from "../../components/checklist-layer/met-context";
import { Swap } from "../../components/checklist-layer/swap";
import { TextField } from "../../components/kit/field";

// The version without the kit: a bare box, with whatever extra the broken item needs.
function Plain({ children, ...rest }: { children?: ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="pt-plain">
      {children}
      <input className="nv nv-input" {...rest} />
    </div>
  );
}

function Live() {
  const [v, setV] = useState("");
  return (
    <Plain value={v} onChange={(e) => setV(e.target.value)} placeholder="Address" aria-label="Address">
      <span className="nv">Address</span>
      {v.length > 0 && v.length < 8 && <span className="nv" style={{ color: "#c0392b" }}>Too short, add more.</span>}
    </Plain>
  );
}

const state = (label: string, force: string | undefined, extra: Partial<React.ComponentProps<typeof TextField>> = {}) => (
  <div key={label} className="pt-state" data-force={force}>
    <TextField label={label} name={`s-${label}`} defaultValue="Lorem ipsum" {...extra} />
  </div>
);

// The kit input field, one demo per checklist item (the form items are on the same page, below).
export function FieldDemo() {
  const { isMet } = useMet();
  return (
    <div className="pt">
      <div className="pt-grid">
        <div className="pt-card">
          <p className="pt-cap">Label, hint, placeholder</p>
          <Swap
            item={1}
            good={<TextField label="Email address" name="f1" placeholder="name@example.com" />}
            broken={<Plain placeholder="" aria-label="field" />}
          />
          <Swap
            item={2}
            good={<TextField label="Phone" name="f2" hint="Include the area code, for example 02 0000 0000." />}
            broken={<TextField label="Phone" name="f2b" />}
          />
          <Swap
            item={3}
            good={<TextField label="Full name" name="f3" placeholder="For example Alex Sample" />}
            broken={<Plain placeholder="Full name" aria-label="Full name" />}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Error, prefix and suffix, count</p>
          <Swap
            item={4}
            good={<TextField label="Email address" name="f4" error="Enter an email address like name@example.com." defaultValue="alex@" />}
            broken={<Plain defaultValue="alex@" aria-invalid style={{ borderColor: "#c0392b" }} aria-label="Email address" />}
          />
          <Swap
            item={5}
            good={
              <div className="pt-row">
                <TextField label="Amount" name="f5a" prefix="SAR" size="medium" defaultValue="120" />
                <TextField label="Weight" name="f5b" suffix="kg" size="short" defaultValue="12" />
              </div>
            }
            broken={
              <div className="pt-row">
                <Plain defaultValue="SAR 120" aria-label="Amount" />
                <Plain defaultValue="12 kg" aria-label="Weight" />
              </div>
            }
          />
          <Swap
            item={6}
            good={<TextField label="Short bio" name="f6" maxLength={80} defaultValue="Lorem ipsum dolor" />}
            broken={<Plain defaultValue="Lorem ipsum dolor" aria-label="Short bio" />}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Width and touch size</p>
          <Swap
            item={7}
            good={
              <div className="pt-row" style={{ alignItems: "flex-start" }}>
                <TextField label="Postcode" name="f7a" size="short" defaultValue="0000" />
                <TextField label="Address" name="f7b" defaultValue="1 Example Street" />
              </div>
            }
            broken={
              <div className="pt-box">
                <Plain defaultValue="0000" aria-label="Postcode" />
                <Plain defaultValue="1 Example Street" aria-label="Address" />
              </div>
            }
          />
          <Swap item={9} good={<TextField label="Name" name="f9" defaultValue="Alex Sample" />} broken={<Plain className="nv nv-input" data-thin="" defaultValue="Alex Sample" aria-label="Name" />} />
        </div>
      </div>

      <div className="pt-box">
        <p className="pt-cap">States, each held still</p>
        <Swap
          item={10}
          good={
            <div className="pt-states">
              {state("Default", undefined)}
              {state("Hover", "hover")}
              {state("Focus", "focus")}
              {state("Filled", undefined)}
              {state("Error", undefined, { error: "Enter a valid value." })}
              {state("Disabled", undefined, { disabled: true })}
              {state("Read-only", undefined, { readOnly: true })}
            </div>
          }
          broken={
            <div className="pt-states">
              {["Default", "Hover", "Focus", "Filled", "Error", "Disabled", "Read-only"].map((l) => (
                <Plain key={l} defaultValue="Lorem ipsum" aria-label={l} />
              ))}
            </div>
          }
        />
      </div>

      <div className="pt-grid">
        <div className="pt-card">
          <p className="pt-cap">Focus ring and border</p>
          <div className="pt-state" data-force={isMet(11) ? "focus" : undefined}>
            <Swap item={11} good={<TextField label="Focused field" name="f11" defaultValue="Lorem" />} broken={<Plain defaultValue="Lorem" aria-label="Focused field" style={{ outline: "none" }} />} />
          </div>
          <Swap item={13} good={<TextField label="Field border" name="f13" />} broken={<Plain data-pale="" aria-label="Field border" />} />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Error: border, icon and words</p>
          <Swap
            item={12}
            good={<TextField label="Postcode" name="f12" size="medium" error="Enter four digits." defaultValue="12" />}
            broken={<Plain defaultValue="12" aria-label="Postcode" style={{ borderColor: "transparent", color: "#c0392b" }} />}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Spaces and dashes</p>
          <Swap
            item={19}
            good={<TextField label="Phone" name="f19" inputMode="tel" autoComplete="tel" defaultValue="0400 000 000" validate={(v) => (/^[\d\s-]{8,}$/.test(v) ? undefined : "Enter a phone number.")} />}
            broken={<TextField label="Phone" name="f19b" defaultValue="0400 000 000" error="Digits only, no spaces." />}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Check when leaving the field</p>
          <Swap
            item={20}
            good={<TextField label="Address" name="f20" validate={(v) => (v.length >= 8 ? undefined : "Add the street and number.")} />}
            broken={<Live />}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Required, in words</p>
          <Swap
            item={24}
            good={<TextField label="Email address" name="f24" required markRequired />}
            broken={<Plain placeholder="" aria-label="Email address *"><span className="nv">Email address *</span></Plain>}
          />
        </div>
      </div>
    </div>
  );
}
