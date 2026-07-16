"use client";

import { useEffect, useState } from "react";
import { TRAINER_ID } from "../portfolio/data";

/* ================================================================== */
/*  Small reusable marks                                              */
/* ================================================================== */

// gray section bullet that precedes every label (aligns down the left edge)
function Bullet({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="45" fill="#fff" stroke="#8b95b8" strokeWidth="8" />
      <rect x="5" y="45" width="90" height="10" fill="#8b95b8" />
      <circle cx="50" cy="50" r="13" fill="#fff" stroke="#8b95b8" strokeWidth="8" />
    </svg>
  );
}

// red emblem in the header
function HeaderEmblem({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="45" fill="#fff" stroke="#2c2320" strokeWidth="7" />
      <path d="M5 50 A45 45 0 0 1 95 50 Z" fill="#e8504c" />
      <rect x="5" y="45" width="90" height="10" fill="#2c2320" />
      <circle cx="50" cy="50" r="14" fill="#fff" stroke="#2c2320" strokeWidth="8" />
      <circle cx="50" cy="50" r="6" fill="#cfd4da" />
    </svg>
  );
}

/* ================================================================== */
/*  FOCUS — four slanted discipline badges                            */
/* ================================================================== */

type Focus = {
  label: string;
  fill: string;
  border: string;
  labelColor: string;
  sub: string;
  dashed?: boolean;
  img: string;
};

const FOCUS: Focus[] = [
  {
    label: "AI / ML",
    sub: "Building smart solutions",
    fill: "#c8a9ec",
    border: "#8a5bc4",
    labelColor: "#7d4fb3",
    img: "/sprites/focus_ai.png",
  },
  {
    label: "WEB APP",
    sub: "Crafting fast & modern apps",
    fill: "#a8d2f2",
    border: "#5a9bd6",
    labelColor: "#2f78bf",
    img: "/sprites/focus_web.png",
  },
  {
    label: "DEVOPS",
    sub: "Automate, deploy & scale",
    fill: "#a9d99f",
    border: "#5aa84d",
    labelColor: "#3f8f33",
    img: "/sprites/focus_devops.png",
  },
  {
    label: "EXPLORING",
    sub: "Always learning new things",
    fill: "#e0e2e5",
    border: "#bfc4c9",
    labelColor: "#9a9ea3",
    dashed: true,
    img: "/sprites/focus_explore.png",
  },
];

// pixel-style border stack for slanted cards (inner color ring + dark outer edge + drop)
function slantedCardBorder(border: string, dashed?: boolean) {
  return {
    boxShadow: `inset 0 0 0 2px ${border}, inset 0 0 0 4px rgba(255,255,255,0.45), 0 0 0 2px #33406b, 0 3px 0 rgba(0,0,0,0.18)`,
    border: dashed ? `2px dashed ${border}` : undefined,
  } as const;
}

/* ================================================================== */
/*  STACK — technology logos (only JS/TS sit on colored squares) might change it later honestly     */
/* ================================================================== */

// official multi-color SVG logos live inside pixel tiles — the retro feel comes from the
// container chrome, not from distorting the logos. logos are never recolored or pixelated.
const CORE_STACK = [
  { key: "python", name: "Python" },
  { key: "pytorch", name: "PyTorch" },
  { key: "react", name: "React" },
  { key: "nextjs", name: "Next.js" },
  { key: "nodejs", name: "Node.js" },
  { key: "git", name: "Git" },
];
const INFRA_STACK = [
  { key: "docker", name: "Docker" },
  { key: "kubernetes", name: "Kubernetes" },
  { key: "aws", name: "AWS" },
  { key: "postgresql", name: "PostgreSQL" },
  { key: "vercel", name: "Vercel" },
];

// a single 8-bit bordered tile holding one official logo; hover lifts + cyan border + tooltip
function StackTile({ name, logo, more }: { name: string; logo?: string; more?: boolean }) {
  return (
    <div className="group relative shrink-0">
      <div
        className="w-[34px] h-[34px] bg-white rounded-[5px] flex items-center justify-center transition-all duration-150 shadow-[inset_0_0_0_2px_#33406b,0_2px_0_rgba(0,0,0,0.22)] group-hover:-translate-y-0.5 group-hover:shadow-[inset_0_0_0_2px_#4a76c9,0_4px_0_rgba(0,0,0,0.22)]"
      >
        {more ? (
          <span className="font-pixel text-[8px] leading-none text-[#9aa0a6] group-hover:text-[#1f9fb8]">MORE</span>
        ) : (
          <img src={logo} alt={name} className="w-[22px] h-[22px] object-contain" />
        )}
      </div>
      {/* retro tooltip */}
      <span
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-[20px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-150 font-pixel text-[7px] leading-none whitespace-nowrap px-1.5 py-1 rounded-[3px] text-white"
        style={{ background: "#2c2c2c", boxShadow: "0 2px 0 rgba(0,0,0,0.3)" }}
      >
        {name}
      </span>
    </div>
  );
}

/* ================================================================== */
/*  Meta icons                                                        */
/* ================================================================== */

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] shrink-0" fill="#3f9b46">
      <rect x="3" y="13" width="4" height="8" />
      <rect x="10" y="8" width="4" height="13" />
      <rect x="17" y="3" width="4" height="18" />
    </svg>
  );
}

// tiny pixel marks for the EXP bullets
function BuildMini() {
  return (
    <svg viewBox="0 0 16 16" className="w-[11px] h-[11px]" aria-hidden>
      <rect x="2" y="9" width="12" height="5" fill="#5a9bd6" />
      <rect x="4" y="5" width="8" height="4" fill="#7eb6e8" />
      <rect x="6" y="2" width="4" height="3" fill="#a8d2f2" />
      <rect x="7" y="11" width="2" height="3" fill="#2f78bf" />
    </svg>
  );
}

function LearnMini() {
  return (
    <svg viewBox="0 0 16 16" className="w-[11px] h-[11px]" aria-hidden>
      <rect x="2" y="3" width="12" height="10" fill="#c8a9ec" />
      <rect x="2" y="3" width="3" height="10" fill="#8a5bc4" />
      <rect x="7" y="5" width="5" height="2" fill="#f3e8ff" />
      <rect x="7" y="9" width="5" height="2" fill="#f3e8ff" />
    </svg>
  );
}

function ShipMini() {
  return (
    <svg viewBox="0 0 16 16" className="w-[11px] h-[11px]" aria-hidden>
      <rect x="3" y="8" width="10" height="5" fill="#5aa84d" />
      <rect x="5" y="4" width="6" height="4" fill="#7fd66a" />
      <rect x="7" y="2" width="2" height="2" fill="#f0c84a" />
      <rect x="2" y="13" width="12" height="2" fill="#3f8f33" />
    </svg>
  );
}

const EXP_LINES = [
  { label: "Building.", icon: <BuildMini />, accent: "#5a9bd6" },
  { label: "Learning.", icon: <LearnMini />, accent: "#8a5bc4" },
  { label: "Shipping.", icon: <ShipMini />, accent: "#5aa84d" },
];

/* ================================================================== */
/*  CURRENTLY — what i'm up to right now                              */
/* ================================================================== */

// little pixel marks for each line
function SapMini() {
  return (
    <svg viewBox="0 0 20 20" className="w-[16px] h-[16px]" aria-hidden>
      <rect x="2" y="4" width="16" height="13" fill="#0f766e" />
      <rect x="2" y="4" width="16" height="3" fill="#14b8a6" />
      <rect x="5" y="9" width="4" height="3" fill="#ccfbf1" />
      <rect x="11" y="9" width="4" height="3" fill="#ccfbf1" />
      <rect x="8" y="13" width="4" height="4" fill="#99f6e4" />
      <rect x="1" y="17" width="18" height="2" fill="#115e59" />
    </svg>
  );
}

function StealthMini() {
  return (
    <svg viewBox="0 0 20 20" className="w-[16px] h-[16px]" aria-hidden>
      <rect x="3" y="8" width="14" height="8" fill="#334155" />
      <rect x="5" y="4" width="10" height="5" fill="#1e293b" />
      <rect x="7" y="11" width="2" height="2" fill="#38bdf8" />
      <rect x="11" y="11" width="2" height="2" fill="#38bdf8" />
      <rect x="8" y="14" width="4" height="2" fill="#64748b" />
      <rect x="9" y="2" width="2" height="2" fill="#fbbf24" />
    </svg>
  );
}

function GrindMini() {
  return (
    <svg viewBox="0 0 20 20" className="w-[16px] h-[16px]" aria-hidden>
      <rect x="7" y="2" width="6" height="3" fill="#fbbf24" />
      <rect x="5" y="5" width="10" height="3" fill="#f59e0b" />
      <rect x="8" y="8" width="4" height="7" fill="#d97706" />
      <rect x="6" y="15" width="8" height="3" fill="#b45309" />
      <rect x="14" y="10" width="4" height="4" fill="#fde68a" />
      <rect x="15" y="11" width="2" height="2" fill="#f59e0b" />
    </svg>
  );
}

const CURRENT = [
  { icon: <SapMini />, label: "SAP Software Integration @ Rinexis", accent: "#5fe0c8" },
  { icon: <StealthMini />, label: "SWE @ stealth startup", accent: "#49a6ff" },
  { icon: <GrindMini />, label: "Hackathonmaxxing & Tokenmaxxing", accent: "#f0c84a" },
];

/* ================================================================== */
/*  Header quick links (blue)                                         */
/* ================================================================== */

const LINK_BLUE = "#2f6fb0";

// slanted parallelogram slot — used in the footer badge strip
function SlantedSlot({
  title,
  earned,
  attachIndex = 0,
  children,
}: {
  title?: string;
  earned?: boolean;
  attachIndex?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      title={title}
      className="relative w-[46px] h-[32px] shrink-0 cursor-help"
      style={{
        transform: "skewX(-10deg)",
        // pull them together a bit, but keep leftmost on top so YC isn't covered
        marginLeft: attachIndex > 0 ? -7 : 0,
        zIndex: 20 - attachIndex,
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center overflow-visible"
        style={{
          background: earned ? "#fb651e" : "#d8cca0",
          boxShadow: earned
            ? "inset 0 0 0 2px #b54400, inset 0 0 0 4px rgba(255,255,255,0.3), 0 0 0 2px #33406b, 0 2px 0 rgba(0,0,0,0.2)"
            : "inset 0 0 0 2px #b3a678, inset 0 0 0 4px rgba(255,255,255,0.25), 0 0 0 2px #33406b, 0 2px 0 rgba(0,0,0,0.15)",
        }}
      >
        {children ? (
          <div className="flex items-center justify-center" style={{ transform: "skewX(10deg)" }}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Y Combinator mark — path so it stays sharp after the unskew
function YcBadge() {
  return (
    <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" aria-hidden>
      <path
        fill="#fff"
        d="M5.2 3.5h4.1L12 9.1l2.7-5.6h4.1l-4.9 8.6V20.5h-3.8v-8.4L5.2 3.5z"
      />
    </svg>
  );
}

function QuickLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="w-[24px] h-[24px] rounded-[5px] flex items-center justify-center shrink-0 transition-transform hover:scale-110 active:scale-95"
      style={{ background: LINK_BLUE, boxShadow: "inset 0 0 0 1.5px #21527f, 0 1px 0 rgba(0,0,0,0.25)" }}
    >
      {children}
    </a>
  );
}

/* ================================================================== */
/*  AVATAR — just loops through stand frames, no click stuff           */
/* ================================================================== */

// five stand frames, all cropped the same so the feet don't jump
// s1 thumbs up / s2 neutral / s3 arms crossed / s4 peace+wink / s5 eyes closed
const STAND_FRAMES = [
  "/sprites/stand-norm/s1.png",
  "/sprites/stand-norm/s2.png",
  "/sprites/stand-norm/s3.png",
  "/sprites/stand-norm/s4.png",
  "/sprites/stand-norm/s5.png",
];
// hang on neutral a bit, then cycle the poses
const IDLE_SEQ = [1, 1, 1, 4, 4, 3, 3, 2, 0, 0, 1];

function CardAvatar() {
  const [tick, setTick] = useState(0);

  // ~1.6s per frame so it feels idle, not twitchy
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1600);
    return () => clearInterval(id);
  }, []);

  const src = STAND_FRAMES[IDLE_SEQ[tick % IDLE_SEQ.length]];

  return (
    <div className="absolute right-[36px] top-[-2px] z-20 h-[230px] w-[120px] pointer-events-none">
      <div className="absolute inset-0 drop-shadow-[2px_4px_4px_rgba(0,0,0,0.22)]">
        <img
          src={src}
          alt="Hariharan"
          className="h-full w-full object-contain object-bottom pixelated select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  CARD FRONT                                                        */
/* ================================================================== */

const PINK_DIVIDER = "#e6d6a6";

export function CardFront() {
  // fixed trainer id — random per-render values break SSR hydration
  const id = TRAINER_ID;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f6ecc6] text-slate-800 select-none">
      {/* ===================== HEADER ===================== */}
      <div
        className="relative flex items-center justify-between px-3.5 h-[50px]"
        style={{
          background: "linear-gradient(180deg, #ec605c 0%, #df4f4c 60%, #d8453f 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.16)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <HeaderEmblem size={30} />
          <span className="font-pixel text-[18px] leading-none text-white tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.22)]">
            DEVELOPER CARD
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <QuickLink href="https://x.com/" label="X">
            <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="#fff" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </QuickLink>
          <QuickLink href="mailto:nmhariharanme@gmail.com" label="Email">
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" aria-hidden>
              <rect x="2.5" y="5" width="19" height="14" rx="2" fill="#fff" />
              <path d="M3.5 6.5 L12 13 L20.5 6.5" stroke={LINK_BLUE} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </QuickLink>

          <div className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#f8edc8]" style={{ boxShadow: "inset 0 0 0 1.5px rgba(90,70,20,0.25)" }}>
            <span className="font-pixel text-[11px] leading-none text-[#3a3a3a]">IDNo.</span>
            <span className="font-pixel text-[11px] leading-none text-[#3a3a3a]">{id}</span>
          </div>
        </div>
      </div>

      {/* ===================== MAIN ===================== */}
      <div className="relative px-4 pt-2 pb-1.5 flex flex-col" style={{ height: "calc(100% - 50px - 40px)" }}>
        {/* faded watermark rings behind the avatar */}
        <svg viewBox="0 0 100 100" className="absolute right-[-58px] top-[14px] w-[320px] h-[320px] pointer-events-none" aria-hidden>
          <circle cx="50" cy="50" r="48" fill="#e9d795" opacity="0.7" />
          <circle cx="50" cy="50" r="34" fill="#f6ecc6" />
          <circle cx="50" cy="50" r="21" fill="#e9d795" opacity="0.7" />
          <circle cx="50" cy="50" r="9" fill="#f6ecc6" />
        </svg>

        {/* avatar on the right over the rings — animation only */}
        <CardAvatar />

        {/* ---------- left info column (NAME / FOCUS / STACK) ---------- */}
        <div
          className="relative z-10 w-[64%] flex flex-col gap-1 rounded-[8px] px-2.5 py-1.5"
          style={{ background: "#fdf6da", boxShadow: "0 0 0 2px #c9a04e, inset 0 0 0 2px #fffdf0" }}
        >
          {/* NAME */}
          <div>
            <div className="flex items-center gap-2.5">
              <Bullet />
              <span className="font-pixel text-[12px] leading-none text-[#56618c]">NAME:</span>
              <span className="font-pixel text-[14px] leading-none text-[#c23a33] tracking-wide">HARIHARAN</span>
            </div>
            <div className="font-card text-[14px] leading-none text-[#56618c] pl-[26px] mt-1.5">
              AKA: Hari
            </div>
            <div className="h-px mt-2" style={{ background: PINK_DIVIDER }} />
          </div>

          {/* FOCUS — attached slanted illustrated cards */}
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Bullet />
              <span className="font-pixel text-[12px] leading-none text-[#56618c]">FOCUS:</span>
            </div>
            <div className="flex pl-[26px]">
              {FOCUS.map((f, i) => (
                <div
                  key={f.label}
                  className="flex-1 min-w-0 flex flex-col items-center"
                  style={{ marginLeft: i > 0 ? -10 : 0, zIndex: i }}
                >
                  <div
                    className="w-full h-[42px] overflow-hidden flex items-center justify-center"
                    style={{
                      background: f.fill,
                      transform: "skewX(-9deg)",
                      ...slantedCardBorder(f.border, f.dashed),
                    }}
                  >
                    <img
                      src={f.img}
                      alt={f.label}
                      className="w-full h-full object-contain object-center pixelated scale-[1.45]"
                      draggable={false}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1 mt-1.5 pt-0.5 w-full">
                    <span className="font-pixel text-[9px] leading-none tracking-tight text-center" style={{ color: f.labelColor }}>
                      {f.label}
                    </span>
                    <span className="font-card text-[10px] leading-[1.2] text-center text-[#8a8f96] px-0.5">
                      {f.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px mt-2" style={{ background: PINK_DIVIDER }} />
          </div>

          {/* STACK */}
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Bullet />
              <span className="font-pixel text-[12px] leading-none text-[#56618c]">STACK:</span>
            </div>
            <div className="flex flex-col gap-1.5 pl-[26px]">
              {/* core technologies */}
              <div className="flex items-center gap-2.5">
                <span className="font-pixel text-[8px] leading-none text-[#a4a9af] w-[34px] text-right">CORE</span>
                <div className="flex gap-2">
                  {CORE_STACK.map((s) => (
                    <StackTile key={s.key} name={s.name} logo={`/logos/${s.key}.svg`} />
                  ))}
                </div>
              </div>
              {/* infrastructure */}
              <div className="flex items-center gap-2.5">
                <span className="font-pixel text-[8px] leading-none text-[#a4a9af] w-[34px] text-right">INFRA</span>
                <div className="flex gap-2">
                  {INFRA_STACK.map((s) => (
                    <StackTile key={s.key} name={s.name} logo={`/logos/${s.key}.svg`} />
                  ))}
                  <StackTile name="More to come" more />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- EXP — same outlined box language as the left panel ---------- */}
        <div className="relative z-10 mt-auto pt-2 w-[32%] min-w-[150px] max-w-[190px] shrink-0">
          <div
            className="rounded-[7px] px-2 py-1.5 flex flex-col gap-1"
            style={{ background: "#fdf6da", boxShadow: "0 0 0 2px #c9a04e, inset 0 0 0 2px #fffdf0" }}
          >
            <div className="flex items-center gap-1.5">
              <Bullet size={14} />
              <span className="font-pixel text-[11px] leading-none text-[#56618c]">EXP:</span>
              <BarChartIcon />
              <span className="font-pixel text-[12px] leading-none text-[#3f9b46] whitespace-nowrap">1+ YEAR</span>
            </div>
            <div className="flex flex-col gap-1">
              {EXP_LINES.map((line) => (
                <div key={line.label} className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-[16px] h-[16px] shrink-0 flex items-center justify-center rounded-[2px]"
                    style={{
                      background: "#fffdf0",
                      boxShadow: `inset 0 0 0 1px ${line.accent}88, 0 0 0 1px #c9a04e66`,
                    }}
                  >
                    {line.icon}
                  </span>
                  <span className="font-card text-[12px] leading-none text-[#56618c]">{line.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CURRENTLY — top overlay, sits above footer / avatar / everything */}
      <div
        className="absolute right-3 bottom-[30px] z-50 w-[62%] max-w-[420px] h-[138px] rounded-[8px] overflow-hidden pointer-events-none"
        style={{
          boxShadow:
            "inset 0 0 0 2px #33406b, 0 0 0 2px rgba(255,255,255,0.35), 0 8px 18px rgba(0,0,0,0.35)",
        }}
      >
        <img
          src="/sprites/front_bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-right pixelated"
        />
        {/* left darkening so the text stays legible */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(9,15,26,0.96) 38%, rgba(9,15,26,0.6) 62%, rgba(9,15,26,0) 82%)" }}
        />
        <div className="relative z-10 h-full px-3 pt-2.5 pb-3.5 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Bullet size={14} />
            <span className="font-pixel text-[10px] leading-none text-white">CURRENTLY:</span>
            <span className="w-[9px] h-[9px] rounded-full bg-[#46c463] ml-1 shadow-[0_0_6px_#46c463]" />
          </div>
          <div className="flex flex-col gap-2.5">
            {CURRENT.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-[24px] h-[24px] shrink-0 flex items-center justify-center rounded-[3px]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    boxShadow: `inset 0 0 0 1.5px ${c.accent}66`,
                  }}
                >
                  {c.icon}
                </span>
                <span className="font-card text-[15px] leading-snug text-white">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== FOOTER: attached slanted badge strip ===================== */}
      <div
        className="relative z-20 h-[40px] flex items-center gap-0 px-4 py-1 shrink-0 overflow-visible"
        style={{
          background: "#ead9a8",
          boxShadow: "inset 0 2px 0 #33406b, inset 0 -1px 0 rgba(0,0,0,0.08)",
        }}
      >
        {/* earned: Y Combinator — Starter School */}
        <SlantedSlot title="Y Combinator · Starter School" earned attachIndex={0}>
          <YcBadge />
        </SlantedSlot>
        {/* empty placeholder wells — attached to the earned badge */}
        {Array.from({ length: 3 }).map((_, i) => (
          <SlantedSlot key={i} title="Badge slot — locked" attachIndex={i + 1} />
        ))}
        <span className="ml-auto font-pixel text-[9px] leading-none text-[#7a6a3d] tracking-wide">
          PRESS <span className="text-[#c23a33]">A</span> TO FLIP ▸
        </span>
      </div>
    </div>
  );
}
