"use client";

/**
 * Card ↔ portfolio world wipe.
 *
 * Expand: the trainer card's rect grows to the viewport and the cream
 * wash turns into the dark portfolio page, then we route underneath.
 * Collapse: reverse — dark cover shrinks back onto the real card.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  estimateCardOrigin,
  getCardOrigin,
  isPortfolioPath,
  viewportRect,
  WIPE_FADE_MS,
  WIPE_GROW_MS,
  WIPE_SHRINK_MS,
  type WipeRect,
  type WipeState,
} from "@/hooks/wipe-utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GROW_S = WIPE_GROW_MS / 1000;
const SHRINK_S = WIPE_SHRINK_MS / 1000;
const FADE_S = WIPE_FADE_MS / 1000;

const CREAM = "#f2e6bc";
const NAVY = "#030712";
const RING_CARD =
  "0 0 0 3px #33406b, 0 0 0 6px #1f2a44, 0 22px 40px rgba(0,0,0,0.42)";
const RING_NONE = "0 0 0 0px #33406b, 0 0 0 0px #1f2a44, 0 0 0 rgba(0,0,0,0)";

type Phase = "run" | "fade";

export function WorldWipe({
  wipe,
  onCommit,
  onEnd,
}: {
  wipe: WipeState | null;
  onCommit: () => void;
  onEnd: () => void;
}) {
  const pathname = usePathname();
  const [target, setTarget] = useState<WipeRect | null>(null);
  const [phase, setPhase] = useState<Phase>("run");
  const phaseRef = useRef<Phase>("run");
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (!wipe) {
      setTarget(null);
      setPhase("run");
      phaseRef.current = "run";
      navigatedRef.current = false;
      return;
    }
    setTarget(null);
    setPhase("run");
    phaseRef.current = "run";
    navigatedRef.current = false;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [wipe]);

  // collapse: once the card page is up, snap the wipe onto the real card
  useEffect(() => {
    if (!wipe || wipe.dir !== "collapse") return;
    if (pathname !== "/") return;
    let frames = 0;
    let raf = 0;
    const look = () => {
      const card = getCardOrigin();
      if (card) {
        setTarget(card);
        return;
      }
      if (frames++ < 16) raf = requestAnimationFrame(look);
      else setTarget(estimateCardOrigin());
    };
    raf = requestAnimationFrame(look);
    return () => cancelAnimationFrame(raf);
  }, [wipe, pathname]);

  // expand: route has landed — dissolve the cover so the portfolio shows through
  useEffect(() => {
    if (!wipe || wipe.dir !== "expand") return;
    if (!isPortfolioPath(pathname)) return;
    const t = window.setTimeout(() => {
      phaseRef.current = "fade";
      setPhase("fade");
    }, 50);
    return () => window.clearTimeout(t);
  }, [wipe, pathname]);

  // last-resort unlock if a route never lands (tab freeze / HMR)
  useEffect(() => {
    if (!wipe) return;
    const t = window.setTimeout(() => onEnd(), 12000);
    return () => window.clearTimeout(t);
  }, [wipe, onEnd]);

  const full = typeof window === "undefined" ? wipe?.origin : viewportRect();

  return (
    <AnimatePresence>
      {wipe && full && (
        <motion.div
          key={`${wipe.dir}-${wipe.href}`}
          data-world-wipe
          className="fixed z-[9999] overflow-hidden pointer-events-auto"
          initial={
            wipe.dir === "expand"
              ? {
                  top: wipe.origin.top,
                  left: wipe.origin.left,
                  width: wipe.origin.width,
                  height: wipe.origin.height,
                  borderRadius: 12,
                  backgroundColor: NAVY,
                  boxShadow: RING_NONE,
                  opacity: 0,
                }
              : {
                  top: 0,
                  left: 0,
                  width: full.width,
                  height: full.height,
                  borderRadius: 0,
                  backgroundColor: NAVY,
                  boxShadow: RING_NONE,
                  opacity: 1,
                }
          }
          animate={
            phase === "fade"
              ? {
                  top: wipe.dir === "expand" ? 0 : (target ?? wipe.origin).top,
                  left: wipe.dir === "expand" ? 0 : (target ?? wipe.origin).left,
                  width: wipe.dir === "expand" ? full.width : (target ?? wipe.origin).width,
                  height: wipe.dir === "expand" ? full.height : (target ?? wipe.origin).height,
                  borderRadius: wipe.dir === "expand" ? 0 : 12,
                  backgroundColor: wipe.dir === "expand" ? NAVY : CREAM,
                  boxShadow: wipe.dir === "expand" ? RING_NONE : RING_CARD,
                  opacity: 0,
                }
              : wipe.dir === "expand"
                ? {
                    top: 0,
                    left: 0,
                    width: full.width,
                    height: full.height,
                    borderRadius: 0,
                    backgroundColor: NAVY,
                    boxShadow: RING_NONE,
                    opacity: 1,
                  }
                : target
                  ? {
                      top: target.top,
                      left: target.left,
                      width: target.width,
                      height: target.height,
                      borderRadius: 12,
                      backgroundColor: CREAM,
                      boxShadow: RING_CARD,
                      opacity: 1,
                    }
                  : {
                      top: 0,
                      left: 0,
                      width: full.width,
                      height: full.height,
                      borderRadius: 0,
                      backgroundColor: NAVY,
                      boxShadow: RING_NONE,
                      opacity: 1,
                    }
          }
          exit={{ opacity: 0 }}
          transition={{
            duration:
              phase === "fade"
                ? FADE_S
                : wipe.dir === "expand"
                  ? GROW_S
                  : target
                    ? SHRINK_S
                    : 0,
            ease: EASE,
            opacity: { duration: phase === "fade" ? FADE_S : 0.12, ease: "easeOut" },
          }}
          onAnimationComplete={() => {
            if (phaseRef.current === "fade") {
              onEnd();
              return;
            }
            if (wipe.dir === "expand") {
              if (navigatedRef.current) return;
              navigatedRef.current = true;
              onCommit();
              return;
            }
            if (!target) {
              if (navigatedRef.current) return;
              navigatedRef.current = true;
              onCommit();
              return;
            }
            phaseRef.current = "fade";
            setPhase("fade");
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none bg-scanlines opacity-[0.07]"
            aria-hidden
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
