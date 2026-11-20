"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { ChecklistRail } from "./checklist-rail";
import { MetContext } from "./met-context";
import { EMPTY_UNMET, parseUnmet, readUnmetRaw, subscribeMet, writeUnmet } from "./met-store";
import { readShow, subscribeShow, writeShow } from "./show-store";
import { measureSpots, type Spot } from "./spots";
import type { ChecklistData } from "./types";
import "./checklist-layer.css";

type Props = {
  exampleId: string;
  data: ChecklistData;
  kicker: string;
  description: string;
  children: ReactNode;
};

export function ChecklistLayer({ exampleId, data, kicker, description, children }: Props) {
  const show = useSyncExternalStore(subscribeShow, readShow, () => true);
  const unmetRaw = useSyncExternalStore(
    subscribeMet,
    () => readUnmetRaw(exampleId),
    () => EMPTY_UNMET,
  );
  const unmet = useMemo(() => parseUnmet(unmetRaw), [unmetRaw]);
  const met = useMemo(() => ({ isMet: (n: number) => !unmet.has(n) }), [unmet]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const site = siteRef.current;
    if (!stage || !site) return;
    const shown = new Set(
      data.groups.flatMap((g) => g.items.filter((i) => i.shown).map((i) => i.n)),
    );
    const next = measureSpots(stage, site, shown, unmet);
    const sig = JSON.stringify(next);
    setSpots((prev) => (JSON.stringify(prev) === sig ? prev : next));
  }, [data, unmet]);

  // Ticking changes the page, so measure in the same frame, before the browser paints.
  useLayoutEffect(() => {
    if (show) measure();
  }, [show, measure]);

  const toggle = useCallback(
    (n: number, isMet: boolean) => {
      const next = new Set(unmet);
      if (isMet) next.delete(n);
      else next.add(n);
      writeUnmet(exampleId, [...next]);
    },
    [exampleId, unmet],
  );

  useEffect(() => {
    if (!show) return;
    const site = siteRef.current;
    if (!site) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    if (stageRef.current) ro.observe(stageRef.current);
    ro.observe(site);
    site.querySelectorAll("[data-item]").forEach((el) => ro.observe(el));
    const mo = new MutationObserver(schedule);
    mo.observe(site, { childList: true, subtree: true, characterData: true });
    window.addEventListener("resize", schedule);
    document.fonts?.addEventListener("loadingdone", schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", schedule);
      document.fonts?.removeEventListener("loadingdone", schedule);
    };
  }, [show, measure]);

  function reveal(n: number) {
    const el = siteRef.current?.querySelector<HTMLElement>(`[data-item~="${n}"]`);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
  }

  return (
    <div className="cl-root">
      <header className="cl-head">
        <div className="cl-intro">
          <p className="cl-kicker">{kicker}</p>
          <p className="cl-desc">{description}</p>
        </div>
        <label data-slot="label" className="cl-switch">
          Show where things sit
          <Switch checked={show} onCheckedChange={writeShow}>
            <SwitchThumb />
          </Switch>
        </label>
      </header>

      <div className="cl-grid">
        <div className="cl-stage" ref={stageRef}>
          <div className="cl-site" ref={siteRef}>
            <MetContext.Provider value={met}>{children}</MetContext.Provider>
          </div>
          {show && (
            <div className="cl-overlay" aria-hidden="true">
              {spots.map((s) => {
                const state =
                  active === null ? "idle" : s.nums.includes(active) ? "active" : "dim";
                return (
                  <span key={s.key}>
                    <span
                      className="cl-box"
                      data-state={state}
                      data-unmet={s.unmet}
                      style={s.box}
                    />
                    <span
                      className="cl-badge"
                      data-state={state}
                      data-unmet={s.unmet}
                      style={{
                        left: s.badge.left,
                        top: s.badge.top,
                        width: s.badge.width,
                      }}
                    >
                      {s.badge.label}
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <ChecklistRail
          data={data}
          unmet={unmet}
          onReveal={reveal}
          onActive={setActive}
          onToggle={toggle}
          onReset={() => writeUnmet(exampleId, [])}
        />
      </div>
    </div>
  );
}
