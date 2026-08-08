"use client";

/**
 * Trainer card shell — flip / tilt / float live here.
 *
 * CardFace paints the GBA rings as nested padded borders INSIDE the face box
 * (outer box-shadow rings used to vanish when tilt foreshortened the top edge).
 * press A / Enter / Space / click to flip. prefers-reduced-motion kills tilt + float.
 */

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCardTilt } from "../../hooks/use-card-tilt";
import { CardFront } from "./card-front";
import { CardBack } from "./card-back";

import type { TabKey } from "../portfolio/data";

interface TrainerCardProps {
  onEnterPortfolio: (tab: TabKey) => void;
  onOpenHariMd: () => void;
}

/**
 * Face is slightly larger than the card so the GBA frame rings live inside the
 * backface-visibility box. Outer box-shadow rings used to get clipped when the
 * card tilted forward — nested in-box borders do not.
 */
function CardFace({
  children,
  flipped,
  isBack,
}: {
  children: ReactNode;
  flipped: boolean;
  isBack?: boolean;
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
        className="absolute inset-0 rounded-[10px] pointer-events-none"
        style={{ boxShadow: "0 18px 34px rgba(0,0,0,0.4)" }}
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
  const reduceMotion = useReducedMotion();
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useCardTilt();

  function toggleFlip() {
    setIsFlipped((prev) => !prev);
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
        toggleFlip();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    // padding must cover the -inset-[13px] face + tilt foreshortening
    <div className="perspective-1000 w-[680px] max-w-full h-[525px] flex items-center justify-center p-5 sm:p-7">
      <motion.div
        className="w-full h-full relative cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#4a76c9] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent rounded-lg"
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Trainer card back. Press A or Enter to flip." : "Trainer card front. Press A or Enter to flip."}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: reduceMotion || isHovered ? 0 : [0, -8, 0],
        }}
        transition={{
          y: isHovered || reduceMotion
            ? { duration: 0.4, ease: "easeOut" }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        onMouseMove={reduceMotion ? undefined : handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleLeave}
        onClick={toggleFlip}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFlip();
          }
        }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 90, damping: 20 }
          }
        >
          <CardFace flipped={isFlipped}>
            <CardFront />
          </CardFace>

          <CardFace flipped={isFlipped} isBack>
            <CardBack onEnterPortfolio={onEnterPortfolio} onOpenHariMd={onOpenHariMd} />
          </CardFace>
        </motion.div>
      </motion.div>
    </div>
  );
}
