"use client";

import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { Button as SdkButton } from "@ui-sdk/react/button";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";

export type ButtonKind = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type Props = Omit<ComponentProps<typeof SdkButton>, "size" | "children"> & {
  children?: ReactNode;
  kind?: ButtonKind;
  size?: ButtonSize;
  icon?: ReactNode;
  // The accessible name of an icon-only button (a button with an icon and no text).
  label?: string;
  loading?: boolean;
  // Full width on phones, for the main action.
  fullOnPhone?: boolean;
  // A toggle button: says whether it is pressed.
  pressed?: boolean;
};

// The one button of the site. Wraps the ui-sdk Button: four kinds, three sizes, a loading state
// that keeps its width, and a disabled state that still reaches focus and says why.
export function Button({
  kind = "secondary",
  size = "md",
  icon,
  label,
  loading = false,
  fullOnPhone = false,
  pressed,
  disabled,
  className,
  children,
  ...rest
}: Props) {
  const iconOnly = icon !== undefined && children === undefined;
  return (
    <SdkButton
      {...rest}
      className={className ? `kit-btn ${className}` : "kit-btn"}
      data-variant={kind === "primary" ? "solid" : kind === "danger" ? "destructive" : undefined}
      data-kind={kind}
      data-size={size}
      data-loading={loading || undefined}
      data-icon-only={iconOnly || undefined}
      data-full-phone={fullOnPhone || undefined}
      disabled={disabled || loading}
      focusableWhenDisabled
      aria-busy={loading || undefined}
      aria-label={iconOnly ? label : undefined}
      aria-pressed={pressed}
    >
      <span className="kit-btn-label">
        {icon}
        {children}
      </span>
      {loading && (
        <span className="kit-btn-spin" aria-hidden="true">
          <CircleNotch size={18} weight="bold" />
        </span>
      )}
    </SdkButton>
  );
}

// A row of related buttons. The main one goes last (the end), where people look for it.
export function ButtonGroup({
  label,
  align = "start",
  attached = false,
  children,
}: {
  label: string;
  align?: "start" | "end";
  attached?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="kit-bgroup" role="group" aria-label={label} data-align={align} data-attached={attached || undefined}>
      {children}
    </div>
  );
}

export type SegmentOption = { value: string; label: string; icon?: ReactNode };

// 2 to 5 choices that switch a view at once; one is selected at a time. Not for page navigation.
export function Segmented({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <SegmentedControl
      className={className ? `kit-seg ${className}` : "kit-seg"}
      aria-label={label}
      style={{ "--kit-seg-n": options.length } as CSSProperties}
      value={value}
      onValueChange={(v) => v !== null && onChange(v)}
    >
      <SegmentedControlIndicator />
      {options.map((o) => (
        <SegmentedControlItem key={o.value} value={o.value}>
          {o.icon}
          {o.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}
