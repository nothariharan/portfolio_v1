"use client";

/**
 * Trainer card shell — flip / tilt / float live here.
 *
 * CardFace paints the GBA rings as nested padded borders INSIDE the face box
 * (outer box-shadow rings used to vanish when tilt foreshortened the top edge).
 * press A / Enter / Space / click to flip. prefers-reduced-motion kills tilt + float.
 *
 * Layout mode (desktop | mobile) is driven by CARD_MOBILE_QUERY and applied to
 * both shell size and CardFront so future glass/bg layers can key off data-layout.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCardTilt } from "../../hooks/use-card-tilt";
import { useCardMobileLayout } from "../../hooks/use-media-query";
import { CardFront } from "./card-front";
import { CardBack } from "./card-back";
import { CARD_SHELL, type CardLayout } from "./card-layout";

import type { TabKey } from "../portfolio/data";

interface TrainerCardProps {
  onEnterPortfolio: (tab: TabKey) => void;
  onOpenHariMd: () => void;
}

/**
 * Shared flip curve — same duration + easing both directions so front→back
 * and back→front feel identical. Soft mid-turn scale/lift, no hard overshoot.
 */
const FLIP_EASE: [number, number, number, number] = [0.45, 0.05, 0.25, 1];
const FLIP_MS = 0.68;

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
}: {
  children: ReactNode;
  flipped: boolean;
  isBack?: boolean;
  /** Mid-flip: deepen the drop shadow so the lift reads. */
  lifting?: boolean;
}) {
  const show = flipped === !!isBack;

  return (
    <div
      className="absolute -inset-[13px]"
      style={{
        transform: isBack ? "rotateY(180deg)" : undefined,
        transformStyle: "preserve-3d",
        pointerEvents: show ? "auto" : "none",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div
        className="absolute inset-0 rounded-[10px] pointer-events-none transition-[box-shadow] duration-500 ease-in-out"
        style={{
          boxShadow: lifting
            ? "0 22px 40px rgba(0,0,0,0.45)"
            : "0 18px 34px rgba(0,0,0,0.4)",
        }}
        aria-hidden
      />

      {/* slightly thicker outer ring so foreshortened top edge still reads as a border */}
      <div className="absolute inset-0 rounded-[10px] bg-[#1f2a44] p-[3px]">
        <div className="h-full w-full rounded-[8px] bg-[#33406b] p-[3px]">
          <div className="h-full w-full rounded-[6px] bg-[#f2e6bc] p-[5px]">
            <div className="h-full w-full rounded-[5px] bg-[#33406b] p-[3px]">
              <div className="relative h-full w-full rounded-[4px] overflow-hidden">
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
  const flippingRef = useRef(false);
  const flippedRef = useRef(false);
  const flipControls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  const isMobileLayout = useCardMobileLayout();
  const layout: CardLayout = isMobileLayout ? "mobile" : "desktop";
  const shell = CARD_SHELL[layout];
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useCardTilt();

  async function runFlip() {
    // one flip at a time — same full sequence every press, both directions
    if (flippingRef.current) return;
    flippingRef.current = true;
    setIsFlipping(true);

    const next = !flippedRef.current;
    flippedRef.current = next;
    setIsFlipped(next);

    if (reduceMotion) {
      await flipControls.set({ rotateY: next ? 180 : 0, scale: 1, y: 0 });
      flippingRef.current = false;
      setIsFlipping(false);
      return;
    }

    try {
      await flipControls.start({
        rotateY: next ? 180 : 0,
        scale: [1, 0.97, 1],
        y: [0, -8, 0],
        transition: {
          rotateY: { duration: FLIP_MS, ease: FLIP_EASE },
          scale: { duration: FLIP_MS, times: [0, 0.5, 1], ease: "easeInOut" },
          y: { duration: FLIP_MS, times: [0, 0.5, 1], ease: "easeInOut" },
        },
      });
    } finally {
      flippingRef.current = false;
      setIsFlipping(false);
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
    // runFlip reads refs + controls — stable enough for a single listener
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // padding must cover the -inset-[13px] face + tilt foreshortening
  const pad = isMobileLayout ? "p-3" : "p-5 sm:p-7";
  const pauseFloat = reduceMotion || isHovered || isMobileLayout || isFlipping;

  return (
    <div
      className={`max-w-full flex items-center justify-center ${pad}`}
      data-layout={layout}
      style={{
        width: isMobileLayout ? `min(100%, ${shell.width}px)` : shell.width,
        height: shell.height,
        perspective: isMobileLayout ? 1400 : 1600,
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/*
        Focus ring lives on a flat wrapper — putting ring-* on the 3D-tilted /
        flip face shears into a blue edge line mid-rotate (esp. on mobile).
      */}
      <div className="w-full h-full rounded-lg outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#4a76c9] has-[:focus-visible]:ring-offset-4 has-[:focus-visible]:ring-offset-transparent">
      <motion.div
        className="w-full h-full relative cursor-pointer select-none outline-none rounded-lg"
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={
          isFlipped
            ? "Trainer card back. Press A or Enter to flip."
            : "Trainer card front. Press A or Enter to flip."
        }
        style={{
          // tilt is desktop-only — phones get tap-to-flip without fighting scroll
          rotateX: reduceMotion || isMobileLayout || isFlipping ? 0 : rotateX,
          rotateY: reduceMotion || isMobileLayout || isFlipping ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: pauseFloat ? 0 : [0, -8, 0],
        }}
        transition={{
          y: pauseFloat
            ? { duration: 0.35, ease: "easeOut" }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        onMouseMove={reduceMotion || isMobileLayout || isFlipping ? undefined : handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleLeave}
        onClick={(e) => {
          void runFlip();
          // pointer/tap focus was painting a blue ring that sheared during flip
          if (e.detail !== 0) e.currentTarget.blur();
        }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            void runFlip();
          }
        }}
      >
        <motion.div
          className="w-full h-full relative will-change-transform"
          style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
          initial={{ rotateY: 0, scale: 1, y: 0 }}
          animate={flipControls}
        >
          <CardFace flipped={isFlipped} lifting={isFlipping}>
            <CardFront layout={layout} />
          </CardFace>

          <CardFace flipped={isFlipped} isBack lifting={isFlipping}>
            <CardBack
              layout={layout}
              onEnterPortfolio={onEnterPortfolio}
              onOpenHariMd={onOpenHariMd}
            />
          </CardFace>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}
