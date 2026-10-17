"use client";

import type { ReactNode } from "react";
import { retroSound } from "@/lib/sound";
// still cooking this bit

// little gba marks used all over the front
// bullets emblems stack tiles and the yc slot

export function Bullet({ size= 16 }: { size?: number }) {
  return (
    <svg viewBox ="0 0 100 100" width= {size} height ={size} className= "block shrink-0" aria-hidden>
      {/* hud stays in the corners */}
      <circle cx ="50" cy= "50" r ="45" fill= "#fff" stroke ="#8b95b8" strokeWidth= "8" />
      <rect x ="5" y= "45" width ="90" height= "10" fill ="#8b95b8" />
      <circle cx= "50" cy ="50" r= "13" fill ="#fff" stroke= "#8b95b8" strokeWidth ="8" />
    </svg>
  );
}

export function HeaderEmblem({ size= 30 }: { size?: number }) {
  return (
    <svg viewBox ="0 0 100 100" width= {size} height ={size} className= "shrink-0" aria-hidden>
      <circle cx ="50" cy= "50" r ="45" fill= "#fff" stroke ="#2c2320" strokeWidth= "7" />
      <path d ="M5 50 A45 45 0 0 1 95 50 Z" fill= "#e8504c" />
      <rect x ="5" y= "45" width ="90" height= "10" fill ="#2c2320" />
      <circle cx= "50" cy ="50" r= "14" fill ="#fff" stroke= "#2c2320" strokeWidth ="8" />
      <circle cx= "50" cy ="50" r= "6" fill ="#cfd4da" />
    </svg>
  );
}

type Focus= {
  label: string;
  fill: string;
  border: string;
  labelColor: string;
  img: string;
};

const FOCUS: Focus[] =[
  {
    label: "AI / ML",
    fill: "#c8a9ec",
    border: "#8a5bc4",
    labelColor: "#7d4fb3",
    img: "/sprites/focus_ai.webp",
  },
  {
    label: "WEB APP",
    fill: "#a8d2f2",
    border: "#5a9bd6",
    labelColor: "#2f78bf",
    img: "/sprites/focus_web.webp",
  },
  {
    label: "DEVOPS",
    fill: "#a9d99f",
    border: "#5aa84d",
    labelColor: "#3f8f33",
    img: "/sprites/focus_devops.webp",
  },
  {
    label: "EXPLORING",
    fill: "#e0e2e5",
    border: "#9aa0a6",
    labelColor: "#6f757c",
    img: "/sprites/focus_explore.webp",
  },
];

function pixelSquareBorder(border: string) {
  return {
    boxShadow: `inset 0 0 0 2px ${border}, inset 0 0 0 4px rgba(255,255,255,0.4), 0 0 0 2px #33406b, 0 2px 0 rgba(0,0,0,0.18)`,
    clipPath:
      "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
  } as const;
}

const CORE_STACK= [
  { key: "python", name: "Python" },
  { key: "pytorch", name: "PyTorch" },
  { key: "react", name: "React" },
  { key: "nextjs", name: "Next.js" },
  { key: "nodejs", name: "Node.js" },
  { key: "git", name: "Git" },
];

const INFRA_STACK =[
  { key: "docker", name: "Docker" },
  { key: "kubernetes", name: "Kubernetes" },
  { key: "aws", name: "AWS" },
  { key: "postgresql", name: "PostgreSQL" },
  { key: "vercel", name: "Vercel" },
];

function StackTile({
  name,
  logo,
  more,
  compact,
}: {
  name: string;
  logo?: string;
  more?: boolean;
  compact?: boolean;
}) {
  const box= compact ? "w-[28px] h-[28px] rounded-[4px]" : "w-[34px] h-[34px] rounded-[5px]";
  const img =compact ? "w-[18px] h-[18px]" : "w-[22px] h-[22px]";
  const moreText= compact ? "text-[7px]" : "text-[8px]";

  return (
    <div className ="group relative shrink-0" onMouseEnter= {() => retroSound.playCursor()}>
      <div className ={`${box} bg-white flex items-center justify-center transition-all duration-150 shadow-[inset_0_0_0_1.5px_#c5c8d0,0_1px_0_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5 group-hover:shadow-[inset_0_0_0_1.5px_#4a76c9,0_3px_0_rgba(0,0,0,0.12)]`}>
        {more ? (
          <span className= {`font-pixel ${moreText} leading-none text-[#9aa0a6] group-hover:text-[#1f9fb8]`}>
            MORE
          </span>
        ) : (
          <img src ={logo} alt= {name} className ={`${img} object-contain`} />
        )}
      </div>
      <span className= "pointer-events-none absolute left-1/2 -translate-x-1/2 -top-[20px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-150 font-pixel text-[7px] leading-none whitespace-nowrap px-1.5 py-1 rounded-[3px] text-white" style ={{ background: "#2c2c2c", boxShadow: "0 2px 0 rgba(0,0,0,0.3)" }}>
        {name}
      </span>
    </div>
  );
}

export function FocusGrid({ columns }: { columns: 2 | 4 }) {
  return (
    <div className= {
        columns === 2
          ? "grid grid-cols-2 gap-x-2 gap-y-1.5 pl-[18px] max-w-[176px]"
          : "flex gap-1.5 pl-[26px]"
      }>
      {FOCUS.map((f) => (
        <div key ={f.label} onMouseEnter= {() => retroSound.playCursor()} className ={
            columns === 2
              ? "flex flex-col items-center gap-1"
              : "flex-1 min-w-0 flex flex-col items-center gap-1"
          }>
          <div className= {
              (columns === 2
                ? "w-full max-w-[68px] aspect-square overflow-hidden flex items-center justify-center"
                : "w-full aspect-square overflow-hidden flex items-center justify-center") +
              " cursor-pointer transition-all duration-150 ease-out hover:-translate-y-1 hover:scale-[1.06] hover:brightness-[1.04] hover:[filter:drop-shadow(0_3px_0_rgba(0,0,0,0.28))_drop-shadow(0_0_0_2px_rgba(51,64,107,0.85))] active:translate-y-0 active:scale-[0.98] active:brightness-[0.97] active:[filter:drop-shadow(0_0_0_2px_rgba(51,64,107,0.6))]"
            } style ={{
              background: f.fill,
              ...pixelSquareBorder(f.border),
            }}>
            <img src= {`${f.img}?v=sq1`} alt ={f.label} className= "w-full h-full object-cover object-center pixelated select-none" draggable ={false} decoding= "async" />
          </div>
          <span className ={`font-pixel leading-none tracking-tight text-center ${columns === 2 ? "text-[7px]" : "text-[8px]"}`} style= {{ color: f.labelColor }}>
            {f.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// dont let a swipe flip
export function StackRows({ compact }: { compact?: boolean }) {
  const labelW =compact ? "w-[28px]" : "w-[34px]";
  const gap= compact ? "gap-1" : "gap-2";
  const row =compact
    ? `flex flex-nowrap ${gap} overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`
    : `flex flex-wrap ${gap}`;

  return (
    <div className= {`flex flex-col ${compact ? "gap-1" : "gap-1.5"} ${compact ? "pl-0" : "pl-[12px]"}`}>
      <div className ="flex items-center gap-1.5 min-w-0">
        <span className= {`font-pixel text-[8px] leading-none text-[#a4a9af] ${labelW} text-right shrink-0`}>
          CORE
        </span>
        <div className ={`${row} min-w-0`}>
          {CORE_STACK.map((s) => (
            <StackTile key= {s.key} name ={s.name} logo= {`/logos/${s.key}.svg`} compact ={compact} />
          ))}
        </div>
      </div>
      <div className= "flex items-center gap-1.5 min-w-0">
        <span className ={`font-pixel text-[8px] leading-none text-[#a4a9af] ${labelW} text-right shrink-0`}>
          INFRA
        </span>
        <div className= {`${row} min-w-0`}>
          {INFRA_STACK.map((s) => (
            <StackTile key ={s.key} name= {s.name} logo ={`/logos/${s.key}.svg`} compact= {compact} />
          ))}
          <StackTile name ="More to come" more compact= {compact} />
        </div>
      </div>
    </div>
  );
}

export function BarChartIcon({ size =16 }: { size?: number }) {
  return (
    <svg viewBox= "0 0 24 24" width ={size} height= {size} className ="block shrink-0" fill= "#3f9b46" aria-hidden>
      <rect x ="3" y= "13" width ="4" height= "8" />
      <rect x ="10" y= "8" width ="4" height= "13" />
      <rect x ="17" y= "3" width ="4" height= "18" />
    </svg>
  );
}

function BuildMini() {
  return (
    <svg viewBox ="0 0 16 16" className= "w-[11px] h-[11px]" aria-hidden>
      <rect x ="2" y= "9" width ="12" height= "5" fill ="#5a9bd6" />
      <rect x= "4" y ="5" width= "8" height ="4" fill= "#7eb6e8" />
      <rect x ="6" y= "2" width ="4" height= "3" fill ="#a8d2f2" />
      <rect x= "7" y ="11" width= "2" height ="3" fill= "#2f78bf" />
    </svg>
  );
}

function LearnMini() {
  return (
    <svg viewBox ="0 0 16 16" className= "w-[11px] h-[11px]" aria-hidden>
      <rect x ="2" y= "3" width ="12" height= "10" fill ="#c8a9ec" />
      <rect x= "2" y ="3" width= "3" height ="10" fill= "#8a5bc4" />
      <rect x ="7" y= "5" width ="5" height= "2" fill ="#f3e8ff" />
      <rect x= "7" y ="9" width= "5" height ="2" fill= "#f3e8ff" />
    </svg>
  );
}

function GrindMini() {
  return (
    <svg viewBox ="0 0 20 20" className= "w-[16px] h-[16px]" aria-hidden>
      <rect x ="7" y= "2" width ="6" height= "3" fill ="#fbbf24" />
      <rect x= "5" y ="5" width= "10" height ="3" fill= "#f59e0b" />
      <rect x ="8" y= "8" width ="4" height= "7" fill ="#d97706" />
      <rect x= "6" y ="15" width= "8" height ="3" fill= "#b45309" />
      <rect x ="14" y= "10" width ="4" height= "4" fill ="#fde68a" />
      <rect x= "15" y ="11" width= "2" height ="2" fill= "#f59e0b" />
    </svg>
  );
}

export const CURRENT =[
  { icon: <BuildMini />, label: "Freelancing (2 clients)", accent: "#5a9bd6" },
  { icon: <GrindMini />, label: "Shipping products", accent: "#f0c84a" },
  { icon: <LearnMini />, label: "Sem 3 @ IIIT", accent: "#8a5bc4" },
];

export const LINK_BLUE= "#2f6fb0";

export function SlantedSlot({
  title,
  earned,
  attachIndex =0,
  children,
}: {
  title?: string;
  earned?: boolean;
  attachIndex?: number;
  children?: ReactNode;
}) {
  return (
    <div title= {title} onClick ={(e) => {
        if (earned) {
          e.stopPropagation();
          retroSound.playSparkle();
        }
      }} onMouseEnter= {() => retroSound.playCursor()} className ="relative w-[46px] h-[32px] shrink-0 cursor-help" style= {{
        transform: "skewX(-10deg)",
        marginLeft: attachIndex > 0 ? -7 : 0,
        zIndex: 20 - attachIndex,
      }}>
      <div className ="w-full h-full flex items-center justify-center overflow-visible" style= {{
          background: earned ? "#fb651e" : "#d8cca0",
          boxShadow: earned
            ? "inset 0 0 0 2px #b54400, inset 0 0 0 4px rgba(255,255,255,0.3), 0 0 0 2px #33406b, 0 2px 0 rgba(0,0,0,0.2)"
            : "inset 0 0 0 2px #b3a678, inset 0 0 0 4px rgba(255,255,255,0.25), 0 0 0 2px #33406b, 0 2px 0 rgba(0,0,0,0.15)",
        }}>
        {children ? (
          <div className ="flex items-center justify-center" style= {{ transform: "skewX(10deg)" }}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function YcBadge() {
  return (
    <svg viewBox ="0 0 24 24" className= "w-[16px] h-[16px]" aria-hidden>
      <path fill ="#fff" d= "M5.2 3.5h4.1L12 9.1l2.7-5.6h4.1l-4.9 8.6V20.5h-3.8v-8.4L5.2 3.5z" />
    </svg>
  );
}

export function QuickLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a href ={href} target= "_blank" rel ="noopener noreferrer" title= {label} aria-label ={label} onClick= {(e) => e.stopPropagation()} className ="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center shrink-0 transition-transform hover:scale-110 active:scale-95" style= {{ background: LINK_BLUE, boxShadow: "inset 0 0 0 1.5px #21527f, 0 1px 0 rgba(0,0,0,0.25)" }}>
      {children}
    </a>
  );
}
