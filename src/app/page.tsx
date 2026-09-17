"use client";

/**
 * Landing — the trainer card is the whole first impression.
 *
 * zoom goes up to 210% becoz the DATA FILE (esp honors) needs room to breathe.
 * mobile uses a native portrait card layout (scale ~1); desktop opens closer (1.3).
 * bg color cycle + zoom sit in the corners so they dont fight the card.
 */

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrainerCard } from "@/components/card/trainer-card";
import { CARD_MOBILE_MAX_PX } from "@/components/card/card-layout";
import { useCardMobileLayout } from "@/hooks/use-media-query";
import { useTransition } from "@/hooks/use-transition";
import { retroSound, type MusicTrackId } from "@/lib/sound";
import { ViewCounter } from "@/components/site/view-counter";
import { SpriteBtn } from "@/components/site/hud-sprite-button";

const BG_THEMES = [
  { id: "teal", label: "TEAL", color: "#d0e8e0" },
  { id: "cream", label: "CREAM", color: "#f2e6bc" },
  { id: "sky", label: "SKY", color: "#c8dff0" },
  { id: "lilac", label: "LILAC", color: "#ddd6f3" },
  { id: "mint", label: "MINT", color: "#c5e8d4" },
  { id: "dusk", label: "DUSK", color: "#b8c4d4" },
] as const;

/** Same on the server and the first client paint — never read `window` here. */
const SSR_SCALE = 1.15;

function readLandingScale() {
  return window.matchMedia(`(max-width: ${CARD_MOBILE_MAX_PX}px)`).matches ? 1 : 1.3;
}

export default function Home() {
  const { startTransition } = useTransition();
  const [scale, setScale] = useState(SSR_SCALE);
  const [bgIdx, setBgIdx] = useState(0);
  const [musicTrack, setMusicTrack] = useState<MusicTrackId>("off");
  const [zoomLive, setZoomLive] = useState(false);
  const isMobileLayout = useCardMobileLayout();

  useLayoutEffect(() => {
    setScale(readLandingScale());
    setZoomLive(true);
  }, []);

  useEffect(() => {
    setMusicTrack(retroSound.getMusicTrack());
  }, []);

  // landing is a stage, not a document — hide the page scrollbar so it doesn't sit on the HUD
  useEffect(() => {
    document.documentElement.classList.add("landing-home");
    return () => document.documentElement.classList.remove("landing-home");
  }, []);

  // entering mobile layout: ease zoom back to 100% so the portrait card isn't oversized
  useEffect(() => {
    if (isMobileLayout) setScale(1);
  }, [isMobileLayout]);

  // scale handlers — roomy zoom so the Data File stays readable
  const ZOOM_MIN = 0.7;
  const ZOOM_MAX = 2.1;
  const ZOOM_STEP = 0.15;
  const increaseSize = () => {
    retroSound.unlockAudio();
    retroSound.playBip("high");
    setScale((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX));
  };
  const decreaseSize = () => {
    retroSound.unlockAudio();
    retroSound.playBip("low");
    setScale((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN));
  };
  const cycleBg = () => {
    retroSound.unlockAudio();
    retroSound.playBip("high");
    setBgIdx((i) => (i + 1) % BG_THEMES.length);
  };
  const cycleMusic = () => {
    const next = retroSound.cycleMusic();
    setMusicTrack(next);
  };

  const musicOn = musicTrack !== "off";
  const musicLabel = musicTrack === "off" ? "OFF" : musicTrack.toUpperCase();
  const bg = BG_THEMES[bgIdx];
  const atMinZoom = scale <= ZOOM_MIN + 0.001;
  const atMaxZoom = scale >= ZOOM_MAX - 0.001;
  return (
    <main
      className="flex-1 flex flex-col items-center justify-center p-4 h-dvh relative overflow-hidden transition-colors duration-300"
      style={{ background: bg.color }}
    >
      {/* scanlines overlay */}
      <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none" />

      <ViewCounter />

      {/* escape hatch — cuboidal Mario plaque */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2 pointer-events-none max-[720px]:top-3 max-[720px]:right-3"
      >
        <SpriteBtn
          src="/ui/btn-main-portfolio.webp"
          label="open main portfolio"
          onClick={() => {
            retroSound.playSelect();
            startTransition("/portfolio");
          }}
          width={428}
          height={89}
          className="pointer-events-auto w-[220px] max-[720px]:w-[168px]"
        />
        <p className="font-card text-[13px] leading-snug text-slate-500 text-right max-w-[210px] select-none max-[720px]:hidden">
          not a big fan of cards? then go to my main portfolio :)
        </p>
      </motion.div>

      {/* floating helper instruction text */}
      <div className="mb-3 text-center select-none z-10">
        <p className="text-[8px] font-pixel text-slate-500 animate-pulse">
          {isMobileLayout ? "tap to flip" : "click or press A to flip · hover a corner to tilt"}
        </p>
      </div>

      {/* trainer card — spring zoom + soft stage morph on layout change */}
      <motion.div
        data-card-zoom
        className="w-full flex items-center justify-center z-10"
        initial={false}
        animate={{
          scale,
          maxWidth: isMobileLayout ? 440 : 900,
          paddingTop: isMobileLayout ? 28 : 56,
          paddingBottom: isMobileLayout ? 80 : 88,
        }}
        transition={
          zoomLive
            ? {
                scale: { type: "spring", stiffness: 320, damping: 24 },
                maxWidth: { type: "spring", stiffness: 240, damping: 28 },
                paddingTop: { type: "spring", stiffness: 240, damping: 28 },
                paddingBottom: { type: "spring", stiffness: 240, damping: 28 },
              }
            : { duration: 0 }
        }
      >
        <TrainerCard
          onEnterPortfolio={(tab) => startTransition(`/portfolio?tab=${tab}`)}
          onOpenHariMd={() => {
            window.location.href = "/hari.md";
          }}
        />
      </motion.div>

      {/* bottom-left: background color and 8-bit sound */}
      <div className="fixed bottom-4 left-4 z-50 flex items-end gap-2 max-[720px]:bottom-3 max-[720px]:left-3 max-[720px]:gap-1.5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-[8px] font-pixel text-slate-600 select-none max-[720px]:text-[7px]">
            BG: {bg.label}
          </span>
          <SpriteBtn
            src="/ui/btn-color.webp"
            label="switch background color"
            onClick={cycleBg}
            width={240}
            height={100}
            className="w-[148px] max-[720px]:w-[118px]"
          >
            {/* navy swatch window starts after bucket+palette (~38/36/9/35) */}
            <span
              className="absolute left-[42%] top-[38%] right-[9%] bottom-[33%] block rounded-[1px]"
              aria-hidden
              style={{
                background: bg.color,
                boxShadow: "inset 0 0 0 2px #1a1a1a",
              }}
            />
          </SpriteBtn>
        </div>

        <div className="flex flex-col items-start gap-1">
          <span className="text-[8px] font-pixel text-slate-600 select-none max-[720px]:text-[7px]">
            MUSIC: {musicLabel}
          </span>
          <SpriteBtn
            src={musicOn ? "/ui/btn-sound-on.webp" : "/ui/btn-sound-off.webp"}
            label={`cycle music — currently ${musicLabel}`}
            onClick={cycleMusic}
            width={240}
            height={musicOn ? 101 : 93}
            className="w-[148px] max-[720px]:w-[118px]"
          />
        </div>
      </div>

      {/* zoom sizing */}
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-1 z-50 max-[720px]:bottom-3 max-[720px]:right-3">
        <span className="text-[8px] font-pixel text-slate-600 select-none max-[720px]:text-[7px]">
          ZOOM: {Math.round(scale * 100)}%
        </span>
        <div className="flex gap-1.5">
          <SpriteBtn
            src="/ui/btn-zoom-minus.webp"
            label="decrease size"
            onClick={decreaseSize}
            disabled={atMinZoom}
            width={96}
            height={96}
            className="w-[58px] max-[720px]:w-[48px]"
          />
          <SpriteBtn
            src="/ui/btn-zoom-plus.webp"
            label="increase size"
            onClick={increaseSize}
            disabled={atMaxZoom}
            width={96}
            height={96}
            className="w-[58px] max-[720px]:w-[48px]"
          />
        </div>
      </div>
    </main>
  );
}
