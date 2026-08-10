"use client";

/**
 * Landing — the trainer card is the whole first impression.
 *
 * zoom goes up to 210% becoz the DATA FILE (esp honors) needs room to breathe.
 * mobile uses a native portrait card layout (scale ~1); desktop opens closer (1.3).
 * bg color cycle + zoom sit in the corners so they dont fight the card.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrainerCard } from "@/components/card/trainer-card";
import { CARD_MOBILE_MAX_PX } from "@/components/card/card-layout";
import { useCardMobileLayout } from "@/hooks/use-media-query";
import { useTransition } from "@/hooks/use-transition";

const BG_THEMES = [
  { id: "teal", label: "TEAL", color: "#d0e8e0" },
  { id: "cream", label: "CREAM", color: "#f2e6bc" },
  { id: "sky", label: "SKY", color: "#c8dff0" },
  { id: "lilac", label: "LILAC", color: "#ddd6f3" },
  { id: "mint", label: "MINT", color: "#c5e8d4" },
  { id: "dusk", label: "DUSK", color: "#b8c4d4" },
] as const;

function defaultScale() {
  if (typeof window === "undefined") return 1.15;
  return window.matchMedia(`(max-width: ${CARD_MOBILE_MAX_PX}px)`).matches ? 1 : 1.3;
}

export default function Home() {
  const { startTransition } = useTransition();
  const [scale, setScale] = useState(1.15);
  const [bgIdx, setBgIdx] = useState(0);
  const isMobileLayout = useCardMobileLayout();

  useEffect(() => {
    setScale(defaultScale());
  }, []);

  // entering mobile layout: snap zoom back to 100% so the portrait card isn't oversized
  useEffect(() => {
    if (isMobileLayout) setScale(1);
  }, [isMobileLayout]);

  // scale handlers — roomy zoom so the Data File stays readable
  const ZOOM_MIN = 0.7;
  const ZOOM_MAX = 2.1;
  const ZOOM_STEP = 0.15;
  const increaseSize = () => setScale((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX));
  const decreaseSize = () => setScale((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN));
  const cycleBg = () => setBgIdx((i) => (i + 1) % BG_THEMES.length);

  const bg = BG_THEMES[bgIdx];
  const atMinZoom = scale <= ZOOM_MIN + 0.001;
  const atMaxZoom = scale >= ZOOM_MAX - 0.001;
  return (
    <main
      className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen relative overflow-x-hidden overflow-y-auto transition-colors duration-300"
      style={{ background: bg.color }}
    >
      {/* scanlines overlay */}
      <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none" />

      {/* escape hatch button straight to main portfolio */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2"
      >
        <button
          onClick={() => startTransition("/portfolio")}
          className="font-pixel text-white text-[11px] leading-none px-4 py-3 rounded-[6px] cursor-pointer transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.97] select-none"
          style={{ background: "#e0524a", boxShadow: "inset 0 0 0 2px #a32f28, 0 3px 0 rgba(0,0,0,0.3)" }}
        >
          ▶ MAIN PORTFOLIO
        </button>
        <p className="font-card text-[13px] leading-snug text-slate-500 text-right max-w-[210px] select-none max-[720px]:hidden">
          not a big fan of cards? then go to my main portfolio :)
        </p>
      </motion.div>

      {/* floating helper instruction text */}
      <div className="mb-3 text-center select-none z-10">
        <p className="text-[8px] font-pixel text-slate-500 animate-pulse">
          {isMobileLayout ? "tap to flip" : "click or press A to flip · hover to tilt"}
        </p>
      </div>

      {/* trainer card with retro spring zoom scale animation */}
      <motion.div
        className={`w-full flex items-center justify-center z-10 ${
          isMobileLayout ? "max-w-[440px] py-6" : "max-w-[900px] py-16"
        }`}
        animate={{ scale: scale }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 18,
        }}
      >
        <TrainerCard
          onEnterPortfolio={(tab) => startTransition(`/portfolio?tab=${tab}`)}
          onOpenHariMd={() => {
            window.location.href = "/hari.md";
          }}
        />
      </motion.div>

      {/* bottom-left: cycle page background color */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-1.5">
        <span className="text-[6px] font-pixel text-slate-500 select-none">
          BG: {bg.label}
        </span>
        <button
          onClick={cycleBg}
          className="h-7 px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-600 text-gba-text-dark font-pixel text-[8px] flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-90 transition-transform select-none rounded"
          title="switch background color"
        >
          <span
            className="w-3 h-3 rounded-[2px] border border-slate-600 shrink-0"
            style={{ background: bg.color }}
            aria-hidden
          />
          COLOR
        </button>
      </div>

      {/* zoom sizing button panel */}
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-1.5 z-50">
        <span className="text-[6px] font-pixel text-slate-500 select-none">
          ZOOM: {Math.round(scale * 100)}%
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={decreaseSize}
            disabled={atMinZoom}
            className="w-6 h-6 bg-slate-100 hover:bg-slate-200 border border-slate-600 text-gba-text-dark font-pixel text-[8px] flex items-center justify-center cursor-pointer shadow active:scale-90 transition-transform select-none rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            title="decrease size"
          >
            -
          </button>
          <button
            onClick={increaseSize}
            disabled={atMaxZoom}
            className="w-6 h-6 bg-slate-100 hover:bg-slate-200 border border-slate-600 text-gba-text-dark font-pixel text-[8px] flex items-center justify-center cursor-pointer shadow active:scale-90 transition-transform select-none rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            title="increase size"
          >
            +
          </button>
        </div>
      </div>
    </main>
  );
}
