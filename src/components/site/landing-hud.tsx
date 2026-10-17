"use client";

import { motion } from "framer-motion";
import { SpriteBtn } from "@/components/site/hud-sprite-button";
import type { MusicSnapshot } from "@/lib/sound";
import type { BgTheme } from "@/lib/bg-themes";
// scroll follows the finger

// corner chrome for the landing
// left is color plus skip right is mute and zoom
// mobile hides zoom becoz the card is already locked at 1

function musicLine(music: MusicSnapshot) {
  const on= music.playing || music.track !== "off";
  if (music.muted && on) return "MUSIC: MUTED";
  if (music.playing) return "MUSIC PLAYING";
  return "MUSIC: OFF";
}

function muteLabel(music: MusicSnapshot) {
  if (music.track === "off" && !music.playing) return "start music";
  return music.muted ? "unmute music" : "mute music";
}

export function PortfolioEscape({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div initial ={{ opacity: 0, y: -10 }} animate= {{ opacity: 1, y: 0 }} transition ={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className= "fixed top-5 right-5 z-50 flex flex-col items-end gap-2 pointer-events-none max-[720px]:top-3 max-[720px]:right-3">
      {/* flip stays off the links */}
      <SpriteBtn src ="/ui/btn-main-portfolio.webp" label= "open main portfolio" onClick ={onOpen} width= {428} height ={89} className= "pointer-events-auto w-[220px] max-[720px]:w-[140px]" />
      <p className ="font-card text-[13px] leading-snug text-slate-500 text-right max-w-[210px] select-none max-[720px]:hidden">
        not a big fan of cards? then go to my main portfolio :)
      </p>
    </motion.div>
  );
}

function ColorPlaque({ bg, onCycle }: { bg: BgTheme; onCycle: () => void }) {
  return (
    <div className= "flex flex-col items-start gap-1">
      <span className ="text-[8px] font-pixel text-slate-600 select-none max-[720px]:text-[6px]">
        BG: {bg.label}
      </span>
      <SpriteBtn src= "/ui/btn-color.webp" label ="switch background color" onClick= {onCycle} width ={240} height= {100} className ="w-[148px] max-[720px]:w-[92px]">
        <span className= "absolute left-[42%] top-[38%] right-[9%] bottom-[33%] block rounded-[1px]" aria-hidden style ={{
            background: bg.color,
            boxShadow: "inset 0 0 0 2px #1a1a1a",
          }} />
      </SpriteBtn>
    </div>
  );
}

function SkipSongBtn({ music, onSkip }: { music: MusicSnapshot; onSkip: () => void }) {
  const line= musicLine(music);
  return (
    <div className ="flex flex-col items-start gap-1">
      <span className= "text-[8px] font-pixel text-slate-600 select-none max-[720px]:text-[6px]">
        {line}
      </span>
      <SpriteBtn src ="/ui/btn-skip-song.png" label= {`skip song — currently ${line}`} onClick ={onSkip} width= {360} height ={120} className= "w-[148px] max-[720px]:w-[92px]" />
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
    <div className ="fixed bottom-4 left-4 z-50 flex items-end gap-2 max-[720px]:bottom-[max(0.4rem,env(safe-area-inset-bottom))] max-[720px]:left-2 max-[720px]:gap-1">
      <ColorPlaque bg= {bg} onCycle ={onCycleBg} />
      <SkipSongBtn music= {music} onSkip ={onSkipSong} />
    </div>
  );
}

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
    <div className= "fixed bottom-4 right-4 flex flex-col items-end gap-1 z-50 max-[720px]:bottom-[max(0.4rem,env(safe-area-inset-bottom))] max-[720px]:right-2">
      {!isMobile ? (
        <span className ="text-[8px] font-pixel text-slate-600 select-none">
          ZOOM: {Math.round(scale * 100)}%
        </span>
      ) : null}
      <div className= "flex gap-1.5 max-[720px]:gap-1">
        <SpriteBtn src ={music.muted ? "/ui/btn-mute.webp" : "/ui/btn-unmute.webp"} label= {muteLabel(music)} onClick ={onMute} width= {256} height ={256} className= "w-[58px] max-[720px]:w-[42px]" />
        {!isMobile ? (
          <>
            <SpriteBtn src ="/ui/btn-zoom-minus.webp" label= "decrease size" onClick ={onZoomOut} disabled= {atMinZoom} width ={96} height= {96} className ="w-[58px]" />
            <SpriteBtn src= "/ui/btn-zoom-plus.webp" label ="increase size" onClick= {onZoomIn} disabled ={atMaxZoom} width= {96} height ={96} className= "w-[58px]" />
          </>
        ) : null}
      </div>
    </div>
  );
}
