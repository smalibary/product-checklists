"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { isCalm, motionMs } from "../kit/motion";
import "./swap.css";

// A box that is exactly as tall as what is inside it, and glides (the base duration token) when that changes,
// instead of snapping. No height is reserved: it always fits the content it shows now.
export function Fit({
  children,
  className,
  item,
  tag: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  item?: number | string;
  // "span" where a div is not allowed (inside a button).
  tag?: "div" | "span";
}) {
  const inner = useRef<HTMLElement>(null);
  const height = useRef<number | null>(null);
  const timer = useRef<number>(0);
  const [h, setH] = useState<number | null>(null);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const next = el.getBoundingClientRect().height;
      const prev = height.current;
      height.current = next;
      if (prev !== null && Math.abs(next - prev) > 0.5 && !isCalm()) {
        setMoving(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setMoving(false), motionMs("--dur-base") + 120);
      }
      setH(next);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <Tag
      className={className ? `cl-fit ${className}` : "cl-fit"}
      data-item={item}
      data-ready={h !== null}
      data-moving={moving}
      style={h === null ? undefined : { height: h }}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget) setMoving(false);
      }}
    >
      <Tag ref={inner as never} className="cl-fit-inner">
        {children}
      </Tag>
    </Tag>
  );
}
