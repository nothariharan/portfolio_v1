"use client";

import { useEffect, useRef, useState } from "react";
import {
  BACK_HONORS,
  BACK_PROJECTS,
  BACK_SKILLS,
  type BackExperienceBadge,
  type BackExperienceStatus,
  type TabKey,
} from "../portfolio/data";
import { SvgIcon } from "./card-icons";
// oss orgs sit under here

// palette and little chrome for the back face

export const NAVY= "#33406b";
export const NAVY_SOFT ="#3d4d78";
export const LABEL_BLUE= "#4a6db5";
export const CREAM ="#f6ecc6";
export const PANEL_CREAM= "#fbf4d8";
export const ROW_CREAM ="#fffbe9";

const STATUS_META: Record<BackExperienceStatus, { color: string }>= {
  COMPLETED: { color: "#8a919c" },
  ACTIVE: { color: "#3f9b46" },
  "IN PROGRESS": { color: "#e8913a" },
};

export function StatusDot({ status }: { status: BackExperienceStatus }) {
  const { color } =STATUS_META[status];
  return (
    <span className= "inline-flex items-center gap-1 shrink-0">
      {/* dont let a swipe flip */}
      <span className ="w-[6px] h-[6px] rounded-full" style= {{ background: color, boxShadow: `0 0 0 1.5px ${color}44` }} />
      <span className ="font-pixel text-[6px] leading-none tracking-wide" style= {{ color }}>
        {status}
      </span>
    </span>
  );
}

export function CornerBadge({ badge }: { badge: BackExperienceBadge }) {
  return (
    <span className ="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-[5px] bg-white flex items-center justify-center z-10 overflow-hidden" style= {{ boxShadow: "inset 0 0 0 1.5px #d9cba0" }} aria-hidden>
      <span className ="scale-[0.7] flex">
        <SvgIcon name= {badge} />
      </span>
    </span>
  );
}

export function OpenRecordBtn({ href }: { href: string }) {
  return (
    <a href ={href} target= "_blank" rel ="noopener noreferrer" title= "Open record" onClick ={(e) => e.stopPropagation()} className= "inline-flex items-center gap-1 font-pixel text-[7px] leading-none text-[#3d5380] px-1.5 py-[5px] rounded-[4px] bg-white shrink-0 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:scale-95" style ={{ boxShadow: "inset 0 0 0 1.5px #d9cba0" }}>
      OPEN RECORD
      <SvgIcon name= "play" />
    </a>
  );
}

export function preloadCardBackAssets() {
  const urls =[
    ...BACK_HONORS.flatMap((h) => [h.cardArt, h.heroArt, h.heroArtMobile].filter(Boolean)),
    ...BACK_PROJECTS.map((p) => `/sprites/proj_${p.icon}.webp`),
    ...BACK_SKILLS.flatMap((g) => g.icons.map((k) => `/logos/${k}.svg`)),
  ] as string[];
  for (const src of urls) {
    const img= new Image();
    img.decoding ="async";
    img.src= src;
  }
}

export function PanelScroll({
  children,
  className ="",
  axis= "y",
}: {
  children: React.ReactNode;
  className?: string;
  axis?: "y" | "x";
}) {
  const ref =useRef<HTMLDivElement>(null);

  // the face is rotateY'd so a phone wont scroll this on its own
  // drive scrollTop from the finger and leave the cream bar alone
  useEffect(() => {
    const el= ref.current;
    if (!el || axis !== "y") return;
    let lastY =0;
    let originY= 0;
    let dragging =false;

    const start= (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      lastY =originY= e.touches[0].clientY;
      dragging =false;
    };
    const move= (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const y =e.touches[0].clientY;
      if (!dragging && Math.abs(y - originY) < 8) return;
      dragging= true;

      const max =el.scrollHeight - el.clientHeight;
      if (max <= 0) return;
      el.scrollTop= Math.max(0, Math.min(max, el.scrollTop + (lastY - y)));
      lastY =y;
      e.preventDefault();
    };
    const end= () => {
      dragging =false;
    };

    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });


    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, [axis]);

  return (
    <div ref= {ref} data-no-flip className ={`gba-scroll ${className}`} style= {{
        overscrollBehavior: "contain",
        // none so the flipped face doesnt swallow the finger
        // the cream bar stays, this just feeds scrollTop
        touchAction: axis === "y" ? "none" : "pan-x",
        WebkitOverflowScrolling: "touch",
      }} onWheel ={(e) => e.stopPropagation()} onPointerDown= {(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}

// white tile holding a technology logo that lifts on hover
// player tucks on a phone
export function LogoChip({
  k,
  size =30,
  fill,
}: {
  k: string;
  size?: number;
  fill?: boolean;
}) {
  return (
    <span className= {`group/chip relative rounded-[6px] bg-white flex items-center justify-center shadow-[inset_0_0_0_2px_#d9cba0] transition-transform duration-150 ease-out will-change-transform hover:z-10 hover:-translate-y-[3px] hover:scale-[1.08] hover:shadow-[inset_0_0_0_2px_#4a76c9,0_5px_10px_rgba(0,0,0,0.18)] ${
        fill ? "w-full aspect-square min-w-0" : "shrink-0"
      }`} style ={fill ? undefined : { width: size, height: size }} title= {k}>
      <img src ={`/logos/${k}.svg`} alt= {k} className ={`object-contain transition-transform duration-150 group-hover/chip:scale-105 ${
          fill ? "w-[62%] h-[62%]" : ""
        }`} style= {fill ? undefined : { width: size - 12, height: size - 12 }} decoding ="async" />
    </span>
  );
}

// link button with a hover lift and click feedback
export function LinkBtn({
  href,
  title,
  children,
  size= 30,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <a href ={href} target= "_blank" rel ="noopener noreferrer" title= {title} onClick ={(e) => e.stopPropagation()} className= "rounded-[6px] bg-white flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150 ease-out will-change-transform hover:-translate-y-[3px] hover:scale-[1.12] hover:shadow-[0_5px_10px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-95 shadow-[inset_0_0_0_1.5px_#d9cba0]" style ={{ width: size, height: size }}>
      {children}
    </a>
  );
}

// blinking red menu cursor, revealed on row hover
export function RedCursor() {
  return (
    <span className= "shrink-0 w-[10px] font-pixel text-[11px] leading-none text-[#c23a33] opacity-0 group-hover:opacity-100 transition-opacity duration-100" aria-hidden>
      ▶
    </span>
  );
}

// cream list row — inset navy ring so 3D card tilt can't clip the outer stroke
export function rowStyle(color: string) {
  return {
    background: ROW_CREAM,
    boxShadow: `inset 0 0 0 2px ${NAVY_SOFT}, inset 4px 0 0 ${color}, inset 0 0 0 4px #fffef6`,
  } as const;
}

// pokemon type-style pill naming what the thing actually is
export function TypePill({ label, color }: { label: string; color: string }) {
  return (
    <span className ="font-pixel text-[7px] leading-none px-1.5 py-[3px] rounded-[3px] text-white shrink-0" style= {{ background: color, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.22), 0 0 0 1.5px rgba(0,0,0,0.2)" }}>
      {label}
    </span>
  );
}

// project thumb — uses sprite if we have one, otherwise a letter tile
export function ProjectThumb({
  icon,
  name,
  color,
  size,
}: {
  icon: string;
  name: string;
  color: string;
  size: number;
}) {
  const [ok, setOk] =useState(true);
  if (!ok) {
    return (
      <span className= "rounded-[6px] flex items-center justify-center shrink-0" style ={{ width: size, height: size, background: color }}>
        <span className= "font-pixel text-[11px] leading-none text-white" style ={{ textShadow: "1px 1px 0 rgba(0,0,0,0.35)" }}>
          {name.slice(0, 1).toUpperCase()}
        </span>
      </span>
    );
  }
  return (
    <img src= {`/sprites/proj_${icon}.webp`} alt ={name} width= {size} height ={size} className= "pixelated shrink-0 object-contain" style ={{ width: size, height: size }} onError= {() => setOk(false)} decoding ="async" />
  );
}

// icon tile tinted with the row accent color
export function IconTile({ color, size, children }: { color: string; size: number; children: React.ReactNode }) {
  return (
    <span className= "rounded-[6px] flex items-center justify-center shrink-0 overflow-hidden" style ={{ width: size, height: size, background: `${color}1f`, boxShadow: `inset 0 0 0 2px ${color}` }}>
      {children}
    </span>
  );
}

export const MOBILE_TAB_LABEL: Record<TabKey, string>= {
  projects: "PROJ",experience: "EXP",
  honors: "HONORS",
  // more here soon :eyes: 
  skills: "SKILLS",
};

