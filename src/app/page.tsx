"use client";

// this page is just the trainer card the whole first thing ppl see
// zoom goes up so the data file can breathe
// mobile stays at 1 desktop opens closer
// hud sits in the corners so it doesnt fight the card

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrainerCard } from "@/components/card/trainer-card";
import { BootScreen } from "@/components/card/boot-screen";
import { CARD_MOBILE_MAX_PX } from "@/components/card/card-layout";
import { useCardMobileLayout } from "@/hooks/use-media-query";
import { useTransition } from "@/hooks/use-transition";
import { retroSound, type MusicSnapshot } from "@/lib/sound";
import { BG_THEMES } from "@/lib/bg-themes";
import { markBootSeen, shouldSkipBoot } from "@/lib/boot-flag";
import { ViewCounter } from "@/components/site/view-counter";
import {
  LandingLeftHud,
  LandingRightHud,
  PortfolioEscape,
} from "@/components/site/landing-hud";

const SSR_SCALE = 1.15;
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 2.1;
const ZOOM_STEP = 0.15;

function readLandingScale() {
  return window.matchMedia(`(max-width: ${CARD_MOBILE_MAX_PX}px)`).matches ? 1 : 1.3;
}

export default function Home() {
  const { startTransition } = useTransition();
  const [scale, setScale] = useState(SSR_SCALE);
  const [bgIdx, setBgIdx] = useState(0);
  const [music, setMusic] = useState<MusicSnapshot>({
    track: "off",
    title: "nothing playing",
    muted: false,
    playing: false,
    paused: true,
    currentTime: 0,
    duration: 0,
  });
  const [zoomLive, setZoomLive] = useState(false);
  const [booting, setBooting] = useState(true);
  const isMobileLayout = useCardMobileLayout();

  useLayoutEffect(() => {
    setScale(readLandingScale());
    setZoomLive(true);
    if (shouldSkipBoot()) setBooting(false);
  }, []);

  useEffect(() => {
    const sync = () => setMusic(retroSound.snapshot());
    sync();
    return retroSound.subscribe(sync);
  }, []);

  // hide the page scrollbar so it doesnt sit on the hud
  useEffect(() => {
    document.documentElement.classList.add("landing-home");
    return () => document.documentElement.classList.remove("landing-home");
  }, []);

  useEffect(() => {
    if (isMobileLayout) setScale(1);
  }, [isMobileLayout]);

  const finishBoot = () => {
    markBootSeen();
    setBooting(false);
    retroSound.ensureBgm();
  };

  const bumpZoom = (dir: 1 | -1) => {
    retroSound.unlockAudio();
    retroSound.playBip(dir > 0 ? "high" : "low");
    setScale((prev) =>
      dir > 0
        ? Math.min(prev + ZOOM_STEP, ZOOM_MAX)
        : Math.max(prev - ZOOM_STEP, ZOOM_MIN),
    );
  };

  const cycleBg = () => {
    retroSound.unlockAudio();
    retroSound.playBip("high");
    setBgIdx((i) => (i + 1) % BG_THEMES.length);
  };

  const toggleMute = () => {
    if (music.track === "off" && !music.playing) {
      retroSound.skipTrack();
      return;
    }
    retroSound.toggleMute();
  };

  const bg = BG_THEMES[bgIdx];

  return (
    <main
      className="flex-1 flex flex-col items-center justify-center p-4 max-[720px]:p-2 h-dvh relative overflow-hidden transition-colors duration-300"
      style={{ background: bg.color }}
    >
      {booting ? <BootScreen onDone={finishBoot} /> : null}

      <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none" />

      <ViewCounter />
      <PortfolioEscape onOpen={() => startTransition("/portfolio")} />

      {!isMobileLayout ? (
        <div className="mb-3 text-center select-none z-10">
          <p className="text-[8px] font-pixel text-slate-500 animate-pulse">
            click or press A to flip · hover a corner to tilt
          </p>
        </div>
      ) : null}

      <motion.div
        data-card-zoom
        className="w-full flex items-center justify-center z-10"
        initial={false}
        animate={{
          scale,
          maxWidth: isMobileLayout ? 380 : 900,
          paddingTop: isMobileLayout ? 8 : 56,
          paddingBottom: isMobileLayout ? 58 : 88,
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

      <LandingLeftHud
        bg={bg}
        music={music}
        onCycleBg={cycleBg}
        onSkipSong={() => retroSound.skipTrack()}
      />
      <LandingRightHud
        music={music}
        scale={scale}
        isMobile={isMobileLayout}
        atMinZoom={scale <= ZOOM_MIN + 0.001}
        atMaxZoom={scale >= ZOOM_MAX - 0.001}
        onMute={toggleMute}
        onZoomOut={() => bumpZoom(-1)}
        onZoomIn={() => bumpZoom(1)}
      />
    </main>
  );
}
