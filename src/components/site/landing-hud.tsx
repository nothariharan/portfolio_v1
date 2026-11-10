"use client";

// corner pixel hud controls for color palette, zoom level, and audio toggles basically

import { motion } from "framer-motion";
import {
  HudColorDeck,
  HudMute,
  HudPortfolio,
  HudSkipSong,
  HudZoomIn,
  HudZoomOut,
} from "@/components/site/pixel-hud";
import type { MusicSnapshot } from "@/lib/sound";
import type { BgTheme } from "@/lib/bg-themes";

function musicLine(music: MusicSnapshot) {
  const on = music.playing || music.track !== "off";
  if (music.muted && on) return "MUSIC: MUTED";
  if (music.playing) return "MUSIC PLAYING";
  return "MUSIC: OFF";
}

function muteLabel(music: MusicSnapshot) {
  if (music.track === "off" && !music.playing) return "start music";
  return music.muted ? "unmute music" : "mute music";
}

// top-right escape hatch for ppl who want to skip the whole trainer card and jump to /portfolio
export function PortfolioEscape({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2 pointer-events-none max-[720px]:top-3 max-[720px]:right-3"
    >
      <HudPortfolio onClick={onOpen} className="pointer-events-auto h-[40px] w-[220px] shrink-0 max-[720px]:h-[34px] max-[720px]:w-[128px]" />
      <p className="font-card text-[13px] leading-snug text-slate-500 text-right max-w-[220px] select-none max-[720px]:hidden">
        not a big fan of cards? then go to my main portfolio :)
      </p>
    </motion.div>
  );
}

// bottom-left pixel plaque cycling through backdrop theme colors on tap ( for now ig )
function ColorPlaque({ bg, onCycle }: { bg: BgTheme; onCycle: () => void }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-[8px] font-pixel text-slate-600 select-none max-[720px]:text-[6px]">
        BG: {bg.label}
      </span>
      <HudColorDeck color={bg.color} onClick={onCycle} className="h-[46px] w-[148px] shrink-0 max-[720px]:h-[42px] max-[720px]:w-[92px]" />
    </div>
  );
}

// skip song trigger showing live music status text and advancing the track pool on tap ( for now ig )
function SkipSongBtn({ music, onSkip }: { music: MusicSnapshot; onSkip: () => void }) {
  const line = musicLine(music);
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-[8px] font-pixel text-slate-600 select-none max-[720px]:text-[6px]">
        {line}
      </span>
      <HudSkipSong
        label={`skip song — currently ${line}`}
        onClick={onSkip}
        className="h-[38px] w-[148px] shrink-0 max-[720px]:w-[92px]"
      />
    </div>
  );
}

export function LandingLeftHud({
  bg,
  music,
  onCycleBg,
  onSkipSong,
}: {
  bg: BgTheme;
  music: MusicSnapshot;
  onCycleBg: () => void;
  onSkipSong: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-end gap-2 max-[720px]:bottom-[max(0.4rem,env(safe-area-inset-bottom))] max-[720px]:left-2 max-[720px]:gap-1">
      <ColorPlaque bg={bg} onCycle={onCycleBg} />
      <SkipSongBtn music={music} onSkip={onSkipSong} />
    </div>
  );
}

// bottom-right hud cluster for card zoom stepping and global audio mute toggle ( for now ig )
export function LandingRightHud({
  music,
  scale,
  isMobile,
  atMinZoom,
  atMaxZoom,
  onMute,
  onZoomOut,
  onZoomIn,
}: {
  music: MusicSnapshot;
  scale: number;
  isMobile: boolean;
  atMinZoom: boolean;
  atMaxZoom: boolean;
  onMute: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-1 z-50 max-[720px]:bottom-[max(0.4rem,env(safe-area-inset-bottom))] max-[720px]:right-2">
      {!isMobile ? (
        <span className="text-[8px] font-pixel text-slate-600 select-none">
          ZOOM: {Math.round(scale * 100)}%
        </span>
      ) : null}
      <div className="flex gap-1.5 max-[720px]:gap-1">
        <HudMute
          muted={music.muted}
          label={muteLabel(music)}
          onClick={onMute}
          className="aspect-square w-[58px] shrink-0 p-0 max-[720px]:w-[42px]"
        />
        {!isMobile ? (
          <>
            <HudZoomOut onClick={onZoomOut} disabled={atMinZoom} className="aspect-square w-[58px] shrink-0 p-0" />
            <HudZoomIn onClick={onZoomIn} disabled={atMaxZoom} className="aspect-square w-[58px] shrink-0 p-0" />
          </>
        ) : null}
      </div>
    </div>
  );
}
