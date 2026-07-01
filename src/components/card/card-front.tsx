"use client";

import { useEffect, useState } from "react";

/* ================================================================== */
/*  Small reusable marks                                              */
/* ================================================================== */

// gray section bullet that precedes every label (aligns down the left edge)
function Bullet({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="45" fill="#fff" stroke="#a7adb4" strokeWidth="8" />
      <rect x="5" y="45" width="90" height="10" fill="#a7adb4" />
      <circle cx="50" cy="50" r="13" fill="#fff" stroke="#a7adb4" strokeWidth="8" />
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
  icon: React.ReactNode;
};

const FOCUS: Focus[] = [
  {
    label: "AI / ML",
    sub: "Building smart solutions",
    fill: "#c8a9ec",
    border: "#8a5bc4",
    labelColor: "#7d4fb3",
    icon: (
      <svg viewBox="0 0 36 36" className="w-[54px] h-[54px]">
        <rect x="9" y="9" width="18" height="18" rx="1" fill="#5e2f9e" />
        <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="monospace">AI</text>
        {[12, 18, 24].map((p) => (
          <g key={p} stroke="#5e2f9e" strokeWidth="2">
            <line x1={p} y1="4" x2={p} y2="9" />
            <line x1={p} y1="27" x2={p} y2="32" />
            <line x1="4" y1={p} x2="9" y2={p} />
            <line x1="27" y1={p} x2="32" y2={p} />
          </g>
        ))}
      </svg>
    ),
  },
  {
    label: "WEB APP",
    sub: "Crafting fast & modern apps",
    fill: "#a8d2f2",
    border: "#5a9bd6",
    labelColor: "#2f78bf",
    icon: (
      <svg viewBox="0 0 36 36" className="w-[54px] h-[54px]" fill="none" stroke="#1f5a96" strokeWidth="2">
        <circle cx="18" cy="18" r="13" />
        <ellipse cx="18" cy="18" rx="5.5" ry="13" />
        <line x1="5" y1="18" x2="31" y2="18" />
        <line x1="8" y1="11" x2="28" y2="11" />
        <line x1="8" y1="25" x2="28" y2="25" />
      </svg>
    ),
  },
  {
    label: "DEVOPS",
    sub: "Automate, deploy & scale",
    fill: "#a9d99f",
    border: "#5aa84d",
    labelColor: "#3f8f33",
    icon: (
      <svg viewBox="0 0 36 36" className="w-[54px] h-[54px]" fill="none" stroke="#2c6b22" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="14 11 7 18 14 25" />
        <polyline points="22 11 29 18 22 25" />
      </svg>
    ),
  },
  {
    label: "EXPLORING",
    sub: "Always learning new things",
    fill: "#e0e2e5",
    border: "#bfc4c9",
    labelColor: "#9a9ea3",
    dashed: true,
    icon: <span className="text-[52px] leading-none font-pixel" style={{ color: "#a4a9af" }}>?</span>,
  },
];

/* ================================================================== */
/*  STACK — technology logos (only JS/TS sit on colored squares)      */
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
        className="w-[40px] h-[40px] bg-white rounded-[5px] flex items-center justify-center transition-all duration-150 shadow-[inset_0_0_0_2px_#2c2c2c,0_2px_0_rgba(0,0,0,0.22)] group-hover:-translate-y-0.5 group-hover:shadow-[inset_0_0_0_2px_#1fc4e0,0_4px_0_rgba(0,0,0,0.22)]"
      >
        {more ? (
          <span className="font-pixel text-[8px] leading-none text-[#9aa0a6] group-hover:text-[#1f9fb8]">MORE</span>
        ) : (
          <img src={logo} alt={name} className="w-[27px] h-[27px] object-contain" />
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
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0" fill="#3f9b46">
      <rect x="3" y="13" width="4" height="8" />
      <rect x="10" y="8" width="4" height="13" />
      <rect x="17" y="3" width="4" height="18" />
    </svg>
  );
}

/* ================================================================== */
/*  CURRENTLY — progress rows over the generated desk scene           */
/* ================================================================== */

// segmented retro progress bar
function SegBar({ color, filled, total = 12 }: { color: string; filled: number; total?: number }) {
  return (
    <span className="flex gap-[2px]">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="w-[8px] h-[8px] rounded-[1px]"
          style={{ background: i < filled ? color : "rgba(255,255,255,0.16)" }}
        />
      ))}
    </span>
  );
}

function LaptopMini() {
  return (
    <svg viewBox="0 0 24 18" className="w-[18px] h-[14px]">
      <rect x="4" y="2" width="16" height="11" rx="1" fill="#cfd6df" />
      <rect x="6" y="4" width="12" height="7" fill="#1f2a38" />
      <text x="12" y="9.8" textAnchor="middle" fontSize="5" fill="#5fe07a" fontFamily="monospace">&gt;_</text>
      <path d="M2 16 H22 L20 13 H4 Z" fill="#aab3bf" />
    </svg>
  );
}

function BookMini() {
  return (
    <svg viewBox="0 0 22 22" className="w-[16px] h-[16px]">
      <rect x="4" y="3" width="14" height="16" rx="1" fill="#d4524a" />
      <rect x="4" y="3" width="4" height="16" fill="#a83a33" />
      <rect x="10" y="6" width="6" height="2" fill="#f3d9d6" />
      <rect x="10" y="10" width="6" height="2" fill="#f3d9d6" />
    </svg>
  );
}

function MugMini() {
  return (
    <svg viewBox="0 0 24 22" className="w-[16px] h-[15px]">
      <rect x="3" y="5" width="13" height="13" rx="1" fill="#e8e6df" />
      <path d="M16 8 h3 a3 3 0 0 1 0 6 h-3 z" fill="none" stroke="#e8e6df" strokeWidth="2" />
      <text x="9.5" y="14" textAnchor="middle" fontSize="6" fill="#3a7cc2" fontFamily="monospace">&lt;/&gt;</text>
    </svg>
  );
}

const CURRENT = [
  { icon: <LaptopMini />, label: "Building something cool", color: "#5fe07a", filled: 10 },
  { icon: <BookMini />, label: "Mastering AI & System Design", color: "#49a6ff", filled: 7 },
  { icon: <MugMini />, label: "Shipping & learning everyday", color: "#b07cf0", filled: 8 },
];

/* ================================================================== */
/*  Header quick links (blue)                                         */
/* ================================================================== */

const LINK_BLUE = "#2f6fb0";

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
/*  CARD FRONT                                                        */
/* ================================================================== */

const PINK_DIVIDER = "#f0d6d8";

export function CardFront() {
  const [id, setId] = useState("80445");

  useEffect(() => {
    setId(Math.floor(10000 + Math.random() * 90000).toString());
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f7f6f3] text-slate-800 select-none">
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

          <div className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#fbf6f4]" style={{ boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.08)" }}>
            <span className="font-pixel text-[11px] leading-none text-[#3a3a3a]">IDNo.</span>
            <span className="font-pixel text-[11px] leading-none text-[#3a3a3a]">{id}</span>
          </div>
        </div>
      </div>

      {/* ===================== MAIN ===================== */}
      <div className="relative px-4 pt-2.5 pb-2 flex flex-col" style={{ height: "calc(100% - 50px - 44px)" }}>
        {/* faded watermark rings behind the avatar */}
        <svg viewBox="0 0 100 100" className="absolute right-[-58px] top-[14px] w-[320px] h-[320px] pointer-events-none" aria-hidden>
          <circle cx="50" cy="50" r="48" fill="#f1cdd1" opacity="0.7" />
          <circle cx="50" cy="50" r="34" fill="#f7f6f3" />
          <circle cx="50" cy="50" r="21" fill="#f1cdd1" opacity="0.7" />
          <circle cx="50" cy="50" r="9" fill="#f7f6f3" />
        </svg>

        {/* avatar — stands free on the right, overlapping the watermark */}
        <img
          src="/sprites/hari1.png"
          alt="Hariharan"
          className="absolute right-0 top-[-2px] h-[252px] object-contain pixelated drop-shadow-[2px_4px_2px_rgba(0,0,0,0.16)] pointer-events-none"
        />

        {/* ---------- left info column (NAME / FOCUS / STACK) ---------- */}
        <div className="relative z-10 w-[64%] flex flex-col gap-2">
          {/* NAME */}
          <div>
            <div className="flex items-center gap-2.5">
              <Bullet />
              <span className="font-pixel text-[12px] leading-none text-[#6b6f76]">NAME:</span>
              <span className="font-pixel text-[14px] leading-none text-[#c23a33] tracking-wide">HARIHARAN</span>
            </div>
            <div className="font-card text-[14px] leading-none text-[#6b6f76] pl-[26px] mt-1.5">
              AKA: Hari
            </div>
            <div className="h-px mt-2" style={{ background: PINK_DIVIDER }} />
          </div>

          {/* FOCUS */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Bullet />
              <span className="font-pixel text-[12px] leading-none text-[#6b6f76]">FOCUS:</span>
            </div>
            <div className="flex gap-2 pl-[26px]">
              {FOCUS.map((f) => (
                <div key={f.label} className="flex-1 min-w-0 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full flex items-center justify-center py-1 rounded-[6px]"
                    style={{
                      background: f.fill,
                      boxShadow: `inset 0 0 0 2.5px ${f.border}, 0 2px 0 rgba(0,0,0,0.12)`,
                      border: f.dashed ? `2px dashed ${f.border}` : undefined,
                      transform: "skewX(-9deg)",
                    }}
                  >
                    <div style={{ transform: "skewX(9deg)" }}>{f.icon}</div>
                  </div>
                  <span className="font-pixel text-[9px] leading-none tracking-tight text-center" style={{ color: f.labelColor }}>
                    {f.label}
                  </span>
                  <span className="font-card text-[11px] leading-[1.15] text-center text-[#8a8f96] px-0.5">
                    {f.sub}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-px mt-2.5" style={{ background: PINK_DIVIDER }} />
          </div>

          {/* STACK */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Bullet />
              <span className="font-pixel text-[12px] leading-none text-[#6b6f76]">STACK:</span>
            </div>
            <div className="flex flex-col gap-2 pl-[26px]">
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
            <div className="h-px mt-2.5" style={{ background: PINK_DIVIDER }} />
          </div>
        </div>

        {/* ---------- bottom band: EXP  +  CURRENTLY banner ---------- */}
        <div className="relative z-10 flex gap-3 mt-auto mb-1 items-stretch h-[132px]">
          {/* EXP */}
          <div className="w-[30%] shrink-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2.5">
              <Bullet />
              <span className="font-pixel text-[12px] leading-none text-[#6b6f76]">EXP:</span>
            </div>
            <div className="flex items-center gap-2 mb-2.5 pl-[26px]">
              <BarChartIcon />
              <span className="font-pixel text-[13px] leading-none text-[#3f9b46] whitespace-nowrap">1+ YEAR</span>
            </div>
            <p className="font-card text-[16px] leading-snug text-[#6b6f76] pl-[26px]">
              Building.<br />Learning.<br />Shipping.
            </p>
          </div>

          {/* CURRENTLY — desk-scene banner with progress rows */}
          <div
            className="relative flex-1 rounded-[8px] overflow-hidden"
            style={{ boxShadow: "inset 0 0 0 2px #14403d, 0 2px 0 rgba(0,0,0,0.2)" }}
          >
            <img
              src="/sprites/front_bg.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-right pixelated"
            />
            {/* left darkening so the text stays legible */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, rgba(9,15,26,0.95) 32%, rgba(9,15,26,0.55) 58%, rgba(9,15,26,0) 78%)" }}
            />
            <div className="relative z-10 h-full p-2.5 flex flex-col">
              <div className="flex items-center gap-1.5 mb-2">
                <Bullet size={14} />
                <span className="font-pixel text-[10px] leading-none text-[#f1ede3]">CURRENTLY:</span>
                <span className="w-[9px] h-[9px] rounded-full bg-[#46c463] ml-1 shadow-[0_0_6px_#46c463]" />
              </div>
              <div className="flex flex-col gap-2">
                {CURRENT.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-[20px] shrink-0 flex justify-center">{c.icon}</span>
                    <span className="flex flex-col gap-1">
                      <span className="font-card text-[12px] leading-none text-[#ecead3]">{c.label}</span>
                      <SegBar color={c.color} filled={c.filled} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== FOOTER: YC badge + empty wells ===================== */}
      <div className="relative h-[44px] flex items-center gap-2 px-4" style={{ background: "#cdd9d4", boxShadow: "inset 0 2px 0 rgba(0,0,0,0.08)" }}>
        {/* earned: Y Combinator — Starter School */}
        <div
          title="Y Combinator · Starter School"
          className="w-[30px] h-[30px] rounded-[5px] flex items-center justify-center shrink-0 cursor-help"
          style={{ background: "#f0640f", boxShadow: "inset 0 0 0 2px #b54400, 0 1px 0 rgba(0,0,0,0.25)" }}
        >
          <span className="font-pixel text-white text-[14px] leading-none">Y</span>
        </div>
        {/* empty placeholder wells */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-[30px] h-[30px] rounded-[5px] shrink-0"
            style={{ background: "#c2cfc9", boxShadow: "inset 0 0 0 2px #b2c0b9" }}
          />
        ))}
      </div>
    </div>
  );
}
