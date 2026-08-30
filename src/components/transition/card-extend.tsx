"use client";

/**
 * Card ↔ portfolio.
 *
 * Expand: face irises to black (same size / aspect), then the black card
 * scales from its center until it covers the window, then the portfolio
 * is underneath and the overlay fades.
 *
 * Collapse: screen goes black, the same card shrinks back to origin,
 * face irises back in, live card swaps in. Never two cards at once.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FADE_MS,
  GROW_MS,
  HOLD_MS,
  INK_MS,
  REVEAL_MS,
  coverScale,
  estimateCardOrigin,
  getCardOrigin,
  hideLiveCard,
  isPortfolioPath,
  readStoredOrigin,
  showLiveCard,
  type WipeRect,
  type WipeState,
} from "@/hooks/wipe-utils";

const CREAM = "#f2e6bc";
const RING_OUTER = "#1f2a44";
const RING_INNER = "#33406b";
const PORTFOLIO_BLACK = "#030712";

type Phase = "idle" | "ink" | "grow" | "shrink" | "reveal" | "fade";

function applyBox(el: HTMLElement, box: WipeRect) {
  el.style.top = `${box.top}px`;
  el.style.left = `${box.left}px`;
  el.style.width = `${box.width}px`;
  el.style.height = `${box.height}px`;
  el.style.setProperty("--cover-scale", String(coverScale(box)));
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function cloneFace(slot: HTMLElement) {
  const src = document.querySelector("[data-card-face-inner]");
  if (!(src instanceof HTMLElement)) return false;
  const clone = src.cloneNode(true) as HTMLElement;
  clone.removeAttribute("data-card-face-inner");
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("data-card-face-clone", "");
  clone.style.cssText = [
    "position:absolute",
    "inset:0",
    "width:100%",
    "height:100%",
    "pointer-events:none",
    "margin:0",
  ].join(";");
  slot.replaceChildren(clone);
  return true;
}

export function CardExtend({
  wipe,
  onCommit,
  onEnd,
}: {
  wipe: WipeState | null;
  onCommit: () => void;
  onEnd: () => void;
}) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const commitRef = useRef(onCommit);
  const endRef = useRef(onEnd);
  commitRef.current = onCommit;
  endRef.current = onEnd;

  const committedRef = useRef(false);
  const endedRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");

  useLayoutEffect(() => {
    if (!wipe || !rootRef.current) return;
    applyBox(rootRef.current, wipe.origin);
    rootRef.current.dataset.grown = wipe.dir === "collapse" ? "1" : "";
  }, [wipe]);

  useEffect(() => {
    if (!wipe) {
      setPhase("idle");
      committedRef.current = false;
      endedRef.current = false;
      showLiveCard();
      document.documentElement.style.overflow = "";
      return;
    }

    endedRef.current = false;
    committedRef.current = false;
    document.documentElement.style.overflow = "hidden";

    const root = rootRef.current;
    const ink = inkRef.current;
    const veil = veilRef.current;
    if (!root) return;

    let cancelled = false;

    const run = async () => {
      if (wipe.dir === "expand") {
        hideLiveCard();
        applyBox(root, wipe.origin);
        root.dataset.grown = "";
        root.dataset.hidden = "";
        if (faceRef.current) cloneFace(faceRef.current);
        if (ink) ink.dataset.on = "";
        if (veil) veil.dataset.on = "";
        setPhase("ink");
        await nextFrame();
        if (cancelled) return;
        if (ink) ink.dataset.on = "1";
        await wait(INK_MS);
        if (cancelled) return;
        await wait(HOLD_MS);
        if (cancelled) return;
        setPhase("grow");
        await nextFrame();
        if (cancelled) return;
        root.dataset.grown = "1";
        await wait(GROW_MS);
        if (cancelled) return;
        if (!committedRef.current) {
          committedRef.current = true;
          commitRef.current();
        }
        return;
      }

      /* collapse — screen goes black first; card overlay stays hidden until shrink */
      root.dataset.hidden = "1";
      applyBox(root, wipe.origin);
      root.dataset.grown = "1";
      if (ink) ink.dataset.on = "1";
      if (veil) veil.dataset.on = "1";
      setPhase("ink");
      await wait(INK_MS);
      if (cancelled) return;
      if (!committedRef.current) {
        committedRef.current = true;
        commitRef.current();
      }
    };

    void run();

    return () => {
      cancelled = true;
      document.documentElement.style.overflow = "";
    };
  }, [wipe]);

  /* collapse: home mounted — hide the live card, shrink, then reveal */
  useEffect(() => {
    if (!wipe || wipe.dir !== "collapse") return;
    if (pathname !== "/" && pathname !== "") return;

    let cancelled = false;

    const run = async () => {
      hideLiveCard();
      const card = getCardOrigin() ?? readStoredOrigin() ?? estimateCardOrigin();
      const root = rootRef.current;
      if (!root || !card) return;
      applyBox(root, card);
      root.dataset.grown = "1";
      root.dataset.hidden = "";
      if (inkRef.current) inkRef.current.dataset.on = "1";
      if (veilRef.current) veilRef.current.dataset.on = "";
      if (faceRef.current) cloneFace(faceRef.current);
      setPhase("shrink");
      await nextFrame();
      if (cancelled) return;
      root.dataset.grown = "";
      await wait(GROW_MS);
      if (cancelled) return;
      await wait(HOLD_MS);
      if (cancelled) return;
      setPhase("reveal");
      await nextFrame();
      if (cancelled) return;
      if (inkRef.current) inkRef.current.dataset.on = "";
      await wait(REVEAL_MS);
      if (cancelled || endedRef.current) return;
      endedRef.current = true;
      endRef.current();
      showLiveCard();
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [wipe, pathname]);

  /* expand: portfolio mounted under the black card — fade the overlay */
  useEffect(() => {
    if (!wipe || wipe.dir !== "expand") return;
    if (!isPortfolioPath(pathname)) return;
    if (phase !== "grow") return;
    if (!committedRef.current) return;

    let cancelled = false;
    const t = window.setTimeout(() => {
      if (cancelled || endedRef.current) return;
      setPhase("fade");
    }, 40);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [wipe, pathname, phase]);

  useEffect(() => {
    if (phase !== "fade" || !wipe) return;
    const t = window.setTimeout(() => {
      if (endedRef.current) return;
      endedRef.current = true;
      showLiveCard();
      endRef.current();
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase, wipe]);

  useEffect(() => {
    if (!wipe) return;
    const t = window.setTimeout(() => {
      if (endedRef.current) return;
      endedRef.current = true;
      endRef.current();
      showLiveCard();
    }, 12000);
    return () => window.clearTimeout(t);
  }, [wipe]);

  if (!wipe) return null;

  return (
    <>
      <div
        ref={veilRef}
        data-extend-veil
        aria-hidden
        style={{ background: PORTFOLIO_BLACK }}
      />
      <div
        ref={rootRef}
        data-card-extend
        data-phase={phase}
        aria-hidden
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 10,
            background: RING_OUTER,
            padding: 3,
            boxShadow: "0 22px 44px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 8,
              background: RING_INNER,
              padding: 3,
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 6,
                background: CREAM,
                padding: 5,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 5,
                  background: RING_INNER,
                  padding: 3,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: 4,
                    background: CREAM,
                  }}
                >
                  <div
                    ref={faceRef}
                    style={{ position: "absolute", inset: 0 }}
                  />
                  <div ref={inkRef} data-card-ink aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
