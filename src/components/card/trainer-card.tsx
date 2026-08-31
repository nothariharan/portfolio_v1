"use client";

/**
 * Trainer card shell — flip / tilt / float / layout-morph live here.
 *
 * CardFace paints the GBA rings as nested padded borders INSIDE the face box
 * (outer box-shadow rings used to vanish when tilt foreshortened the top edge).
 * press A / Enter / Space / click to flip. prefers-reduced-motion kills tilt + float.
 *
 * Layout mode (desktop | mobile) is driven by CARD_MOBILE_QUERY and applied to
 * both shell size and CardFront. Crossing the breakpoint morphs shell size with
 * a soft spring + brief depth pulse so device rotate / resize doesn't hard-cut.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCardTilt } from "../../hooks/use-card-tilt";
import { useCardMobileLayout } from "../../hooks/use-media-query";
import { CardFront } from "./card-front";
import { CardBack } from "./card-back";
import { CARD_SHELL, type CardLayout } from "./card-layout";
import { retroSound } from "@/lib/sound";

import type { TabKey } from "../portfolio/data";

interface TrainerCardProps {
  onEnterPortfolio: (tab: TabKey) => void;
  onOpenHariMd: () => void;
}

/** Shared flip curve — identical both directions, soft mid-turn lift. */
const FLIP_EASE: [number, number, number, number] = [0.33, 0.0, 0.2, 1];
const FLIP_MS = 0.78;

/** Controls / links must not arm a flip (pointerup bubbles past stopPropagation on click). */
const FLIP_IGNORE_SEL = "a, button, input, textarea, select, label, [data-no-flip]";
/** Near-miss padding so taps just outside a control don't flip. */
const FLIP_HIT_SLOP_PX = 12;

function shouldIgnoreFlip(target: EventTarget | null, clientX?: number, clientY?: number) {
  if (!(target instanceof Element)) return false;
  const hit = target.closest(FLIP_IGNORE_SEL);
  // the unused face stays in the DOM (visibility:hidden) so its tabs/links
  // must not steal hits from the face you're actually looking at
  if (hit && !hit.closest('[aria-hidden="true"]')) return true;

  // taps in the soft margin around buttons / links / stickers
  if (clientX == null || clientY == null) return false;
  const root = target.closest("[data-flip-root]");
  if (!root) return false;
  for (const el of root.querySelectorAll(FLIP_IGNORE_SEL)) {
    if (el.closest('[aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (
      clientX >= r.left - FLIP_HIT_SLOP_PX &&
      clientX <= r.right + FLIP_HIT_SLOP_PX &&
      clientY >= r.top - FLIP_HIT_SLOP_PX &&
      clientY <= r.bottom + FLIP_HIT_SLOP_PX
    ) {
      return true;
    }
  }
  return false;
}

/** Shell resize when crossing mobile ↔ desktop. */
const SHELL_SPRING = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.85 };
const LAYOUT_MORPH_MS = 0.52;
const LAYOUT_MORPH_EASE: [number, number, number, number] = [0.4, 0.0, 0.2, 1];

/**
 * Face is slightly larger than the card so the GBA frame rings live inside the
 * backface-visibility box. Outer box-shadow rings used to get clipped when the
 * card tilted forward — nested in-box borders do not.
 */
function CardFace({
  children,
  flipped,
  isBack,
  lifting,
  crossed,
}: {
  children: ReactNode;
  flipped: boolean;
  isBack?: boolean;
  /** Mid-flip / morph: deepen the drop shadow so the lift reads. */
  lifting?: boolean;
  /** Past ~90° — hide the outgoing face so it can't ghost through. */
  crossed?: boolean;
}) {
  const show = flipped === !!isBack;
  // Keep the outgoing face only for the first half of the turn. After that,
  // backface-visibility is not enough — nested chips / text paint as fragments.
  const inert = !show && (!lifting || crossed);

  return (
    <div
      className="absolute -inset-[13px] rounded-[10px]"
      data-card-visual={show ? "" : undefined}
      aria-hidden={inert}
      style={{
        transform: isBack
          ? "rotateY(180deg) translateZ(1px)"
          : "rotateY(0deg) translateZ(1px)",
        // flat — preserve-3d on the face lets descendants ignore backface hide
        transformStyle: "flat",
        pointerEvents: show ? "auto" : "none",
        // inherit — "visible" would punch through html[data-card-extending] hide
        visibility: inert ? "hidden" : "inherit",
        opacity: inert ? 0 : 1,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        isolation: "isolate",
      }}
    >
      <div
        className="absolute inset-0 rounded-[10px] pointer-events-none transition-[box-shadow] duration-500 ease-out"
        style={{
          boxShadow: lifting
            ? "0 26px 48px rgba(0,0,0,0.48)"
            : "0 18px 34px rgba(0,0,0,0.4)",
        }}
        aria-hidden
      />

      {/* slightly thicker outer ring so foreshortened top edge still reads as a border */}
      <div className="absolute inset-0 rounded-[10px] bg-[#1f2a44] p-[3px]">
        <div className="h-full w-full rounded-[8px] bg-[#33406b] p-[3px]">
          <div className="h-full w-full rounded-[6px] bg-[#f2e6bc] p-[5px]">
            <div className="h-full w-full rounded-[5px] bg-[#33406b] p-[3px]">
              <div
                className="relative h-full w-full rounded-[4px] overflow-hidden"
                data-card-face-inner={show ? "" : undefined}
              >
                {children}
                <div className="absolute inset-[2px] rounded-[3px] bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrainerCard({ onEnterPortfolio, onOpenHariMd }: TrainerCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipCrossed, setFlipCrossed] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);
  const flippingRef = useRef(false);
  const flippedRef = useRef(false);
  /** Hard cooldown so click+ghost-click / Enter+click can't arm two flips. */
  const lockUntilRef = useRef(0);
  const layoutRef = useRef<CardLayout | null>(null);
  const flipControls = useAnimationControls();
  const morphControls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  const isMobileLayout = useCardMobileLayout();
  const layout: CardLayout = isMobileLayout ? "mobile" : "desktop";
  const shell = CARD_SHELL[layout];
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useCardTilt();

  /* morph shell + depth pulse when crossing mobile ↔ desktop (rotate / resize) */
  useEffect(() => {
    const prev = layoutRef.current;
    layoutRef.current = layout;
    if (prev === null || prev === layout) return;

    if (reduceMotion) {
      void morphControls.set({ scale: 1, opacity: 1, filter: "blur(0px)", rotateZ: 0 });
      return;
    }

    let cancelled = false;
    setIsMorphing(true);
    const toMobile = layout === "mobile";

    void (async () => {
      try {
        await morphControls.start({
          scale: [1, 0.935, 1.015, 1],
          opacity: [1, 0.88, 1],
          filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"],
          rotateZ: toMobile ? [0, -1.2, 0.4, 0] : [0, 1.2, -0.4, 0],
          transition: {
            duration: LAYOUT_MORPH_MS,
            ease: LAYOUT_MORPH_EASE,
            times: [0, 0.35, 0.75, 1],
          },
        });
      } finally {
        if (!cancelled) {
          setIsMorphing(false);
          void morphControls.set({ scale: 1, opacity: 1, filter: "blur(0px)", rotateZ: 0 });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [layout, morphControls, reduceMotion]);

  async function runFlip() {
    const now = performance.now();
    if (now < lockUntilRef.current) return;
    if (flippingRef.current || isMorphing) return;
    // lock before any await so a second event in the same tick can't re-enter
    flippingRef.current = true;
    lockUntilRef.current = now + FLIP_MS * 1000 + 120;
    setIsFlipping(true);

    const next = !flippedRef.current;
    flippedRef.current = next;
    setIsFlipped(next);
    retroSound.playFlip();

    if (reduceMotion) {
      await flipControls.set({ rotateY: next ? 180 : 0, scale: 1, y: 0 });
      flippingRef.current = false;
      setIsFlipping(false);
      setFlipCrossed(false);
      return;
    }

    setFlipCrossed(false);
    // Hide the outgoing face once the turn is past edge-on (~90°).
    const mid = window.setTimeout(() => setFlipCrossed(true), FLIP_MS * 420);

    try {
      await flipControls.start({
        rotateY: next ? 180 : 0,
        scale: [1, 0.97, 1],
        y: [0, -10, 0],
        transition: {
          rotateY: { duration: FLIP_MS, ease: FLIP_EASE },
          scale: { duration: FLIP_MS, times: [0, 0.45, 1], ease: "easeInOut" },
          y: { duration: FLIP_MS, times: [0, 0.45, 1], ease: "easeInOut" },
        },
      });
      // snap off sub-pixel leftovers (1.01 overshoot / compositor hairlines)
      await flipControls.set({ rotateY: next ? 180 : 0, scale: 1, y: 0 });
    } finally {
      window.clearTimeout(mid);
      flippingRef.current = false;
      setIsFlipping(false);
      setFlipCrossed(false);
    }
  }

  function handleLeave() {
    setIsHovered(false);
    handleMouseLeave();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        void runFlip();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // padding must cover the -inset-[13px] face + tilt foreshortening
  const pad = isMobileLayout ? "p-3" : "p-5 sm:p-7";
  const busy = isFlipping || isMorphing;
  const [floatOk, setFloatOk] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setFloatOk(true), 480);
    return () => window.clearTimeout(t);
  }, []);
  // Back face is a control surface — tilt/float move the tabs off the cursor.
  const pauseFloat = reduceMotion || isHovered || isMobileLayout || busy || isFlipped || !floatOk;
  const freezeTilt = reduceMotion || isMobileLayout || busy || isFlipped;

  return (
    <motion.div
      className={`w-full max-w-full flex items-center justify-center ${pad}`}
      data-layout={layout}
      data-card-origin
      initial={false}
      animate={{
        maxWidth: shell.width,
        height: shell.height,
      }}
      transition={reduceMotion ? { duration: 0 } : SHELL_SPRING}
      style={{
        perspective: isMobileLayout ? 1200 : 1200,
        perspectiveOrigin: "50% 45%",
      }}
    >
      {/*
        Focus ring lives on a flat wrapper — putting ring-* on the 3D-tilted /
        flip face shears into a blue edge line mid-rotate (esp. on mobile).
      */}
      <div className="w-full h-full rounded-lg outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#4a76c9] has-[:focus-visible]:ring-offset-4 has-[:focus-visible]:ring-offset-transparent">
        {/* layout morph layer — device rotate / breakpoint cross */}
        <motion.div
          className={`w-full h-full${busy ? " will-change-transform" : ""}`}
          initial={false}
          animate={morphControls}
          style={{ transformOrigin: "center center" }}
        >
          {/*
            Hit + float + scale live here — no rotate. Measuring tilt
            against a foreshortened box is what made the hover feel lagged.
          */}
          <motion.div
            className={`w-full h-full relative cursor-pointer select-none outline-none rounded-lg${busy ? " will-change-transform" : ""}`}
            role={isFlipped ? "group" : "button"}
            tabIndex={0}
            data-flip-root
            aria-pressed={isFlipped}
            aria-label={
              isFlipped
                ? "Trainer card back. Press A or Enter to flip."
                : "Trainer card front. Press A or Enter to flip."
            }
            style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
            animate={{
              y: pauseFloat ? 0 : [0, -8, 0],
              scale: isHovered && !freezeTilt ? 1.02 : 1,
            }}
            transition={{
              y: pauseFloat
                ? { duration: 0.18, ease: "easeOut" }
                : { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.18, ease: "easeOut" },
            }}
            onMouseMove={freezeTilt ? undefined : handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleLeave}
            onPointerUp={(e) => {
              // Primary path — one arm per tap. Ignore controls + near-miss margin.
              if (e.button !== 0) return;
              if (e.pointerType === "mouse" && e.detail > 1) return;
              if (shouldIgnoreFlip(e.target, e.clientX, e.clientY)) return;
              void runFlip();
            }}
            onClick={(e) => {
              // Don't hijack real control clicks; only swallow leftover shell activation.
              if (shouldIgnoreFlip(e.target, e.clientX, e.clientY)) return;
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              if (e.target !== e.currentTarget) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                void runFlip();
              }
            }}
          >
            {/* tilt only — spring isn't fighting the hover scale / float */}
            <motion.div
              className={`w-full h-full${busy ? " will-change-transform" : ""}`}
              style={{
                rotateX: freezeTilt ? 0 : rotateX,
                rotateY: freezeTilt ? 0 : rotateY,
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }}
            >
            {/* flip layer — no translateZ(0); that flattens 3D and leaves hairlines */}
            <motion.div
              className={`w-full h-full relative${busy ? " will-change-transform" : ""}`}
              style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
              initial={{ rotateY: 0, scale: 1, y: 0 }}
              animate={flipControls}
            >
              <CardFace flipped={isFlipped} lifting={busy} crossed={flipCrossed}>
                <CardFront layout={layout} />
              </CardFace>

              <CardFace flipped={isFlipped} isBack lifting={busy} crossed={flipCrossed}>
                <CardBack
                  layout={layout}
                  onEnterPortfolio={onEnterPortfolio}
                  onOpenHariMd={onOpenHariMd}
                />
              </CardFace>
            </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
