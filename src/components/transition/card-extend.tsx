"use client";

/**
 * Card ↔ portfolio — ink the LIVE face, then grow a black plate.
 *
 * The iris is mounted inside [data-card-visual] so 3D tilt can't put
 * panels over it (and so we never paint a second trainer card).
 * The body plate is only a black rectangle for the grow / shrink.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import {
  FADE_MS,
  GROW_MS,
  HOLD_MS,
  INK_MS,
  REVEAL_MS,
  clearLiveInk,
  coverScale,
  freezeLiveCard,
  getCardOrigin,
  hideLiveCard,
  isPortfolioPath,
  readStoredOrigin,
  coverLiveInk,
  openLiveInk,
  playLiveInk,
  showLiveCard,
  storeCardOrigin,
  unfreezeLiveCard,
  type WipeRect,
  type WipeState,
} from "@/hooks/wipe-utils";

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

function measureCard(fallback: WipeRect): WipeRect {
  return getCardOrigin() ?? readStoredOrigin() ?? fallback;
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
  const veilRef = useRef<HTMLDivElement>(null);
  const commitRef = useRef(onCommit);
  const endRef = useRef(onEnd);
  commitRef.current = onCommit;
  endRef.current = onEnd;

  const committedRef = useRef(false);
  const endedRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!wipe || !rootRef.current) return;
    applyBox(rootRef.current, wipe.origin);
    rootRef.current.dataset.grown = wipe.dir === "collapse" ? "1" : "";
    rootRef.current.dataset.hidden = wipe.dir === "expand" ? "1" : "";
  }, [wipe]);

  // Expand: freeze + ink the live card, then swap to a matching black plate and grow.
  useEffect(() => {
    if (!wipe) {
      setPhase("idle");
      committedRef.current = false;
      endedRef.current = false;
      clearLiveInk();
      unfreezeLiveCard();
      showLiveCard();
      document.documentElement.style.overflow = "";
      return;
    }
    if (!mounted || wipe.dir !== "expand") return;

    endedRef.current = false;
    committedRef.current = false;
    document.documentElement.style.overflow = "hidden";

    let cancelled = false;
    const root = rootRef.current;
    if (!root) return;

    const run = async () => {
      freezeLiveCard();
      const box = measureCard(wipe.origin);
      storeCardOrigin(box);
      applyBox(root, box);
      root.dataset.grown = "";
      root.dataset.solid = "";
      root.dataset.hidden = "1";
      if (veilRef.current) veilRef.current.dataset.on = "";

      setPhase("ink");
      playLiveInk();
      await wait(INK_MS);
      if (cancelled) return;
      await wait(HOLD_MS);
      if (cancelled) return;

      const cover = measureCard(box);
      storeCardOrigin(cover);
      applyBox(root, cover);
      root.dataset.snap = "1";
      root.dataset.solid = "1";
      root.dataset.hidden = "";
      hideLiveCard();
      clearLiveInk();
      setPhase("grow");
      await wait(20);
      if (cancelled) return;
      root.dataset.snap = "";
      root.dataset.grown = "1";
      await wait(GROW_MS);
      if (cancelled) return;
      if (!committedRef.current) {
        committedRef.current = true;
        commitRef.current();
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [mounted, wipe?.dir, wipe?.href]);

  // Collapse start: ink the portfolio, then navigate home.
  useEffect(() => {
    if (!wipe || !mounted || wipe.dir !== "collapse") return;

    endedRef.current = false;
    committedRef.current = false;
    document.documentElement.style.overflow = "hidden";

    let cancelled = false;
    const root = rootRef.current;
    if (!root) return;

    const run = async () => {
      hideLiveCard();
      freezeLiveCard();
      applyBox(root, wipe.origin);
      root.dataset.hidden = "";
      root.dataset.solid = "1";
      root.dataset.grown = "1";
      if (veilRef.current) veilRef.current.dataset.on = "1";
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
    };
  }, [mounted, wipe?.dir, wipe?.href]);

  // Collapse finish: shrink the plate onto the live card, then iris it open.
  useEffect(() => {
    if (!wipe || wipe.dir !== "collapse") return;
    if (pathname !== "/" && pathname !== "") return;

    let cancelled = false;

    const run = async () => {
      hideLiveCard();
      freezeLiveCard();
      if (veilRef.current) veilRef.current.dataset.on = "1";

      await wait(200);
      if (cancelled) return;

      const root = rootRef.current;
      const card = measureCard(wipe.origin);
      if (root) {
        applyBox(root, card);
        root.dataset.grown = "1";
        root.dataset.solid = "1";
        root.dataset.snap = "1";
        root.dataset.hidden = "";
      }
      setPhase("shrink");
      await wait(20);
      if (cancelled) return;

      if (veilRef.current) veilRef.current.dataset.on = "";
      if (root) root.dataset.snap = "";
      await wait(20);
      if (cancelled) return;

      if (root) root.dataset.grown = "";
      await wait(GROW_MS);
      if (cancelled) return;
      await wait(HOLD_MS);
      if (cancelled) return;

      coverLiveInk();
      showLiveCard();
      if (root) {
        root.dataset.solid = "";
        root.dataset.hidden = "1";
      }
      setPhase("reveal");
      await wait(20);
      if (cancelled) return;
      openLiveInk();
      await wait(REVEAL_MS);
      if (cancelled || endedRef.current) return;
      setPhase("fade");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [wipe, pathname]);

  useEffect(() => {
    if (!wipe || wipe.dir !== "expand") return;
    if (!isPortfolioPath(pathname)) return;
    if (phase !== "grow") return;
    if (!committedRef.current) return;
    const t = window.setTimeout(() => {
      if (endedRef.current) return;
      setPhase("fade");
    }, 40);
    return () => window.clearTimeout(t);
  }, [wipe, pathname, phase]);

  useEffect(() => {
    if (phase !== "fade" || !wipe) return;
    const t = window.setTimeout(() => {
      if (endedRef.current) return;
      endedRef.current = true;
      clearLiveInk();
      unfreezeLiveCard();
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
      clearLiveInk();
      unfreezeLiveCard();
      showLiveCard();
      endRef.current();
    }, 12000);
    return () => window.clearTimeout(t);
  }, [wipe]);

  if (!wipe || !mounted) return null;

  return createPortal(
    <>
      <div
        ref={veilRef}
        data-extend-veil
        aria-hidden
        style={{ background: PORTFOLIO_BLACK }}
      />
      <div ref={rootRef} data-card-extend data-phase={phase} aria-hidden />
    </>,
    document.body,
  );
}
