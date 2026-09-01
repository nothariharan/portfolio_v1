"use client";

/**
 * Trainer card FRONT — identity side.
 *
 * Two layouts share the same content blocks:
 *   desktop — wide GBA card, focus 1×4, badge strip + floating CURRENTLY
 *   mobile  — portrait shell, focus 2×2, EXP|CURRENTLY row, no badge strip
 *
 * Pass `layout` from TrainerCard (driven by CARD_MOBILE_QUERY) so shell size
 * and face stay in lockstep. Future glass/bg can hang off data-layout.
 */

import { TRAINER_ID } from "../portfolio/data";
import {
  CARD_PANEL_STYLE,
  CARD_PINK_DIVIDER,
  type CardLayout,
} from "./card-layout";
import { retroSound } from "@/lib/sound";

/* ================================================================== */
/*  Small reusable marks                                              */
/* ================================================================== */

// gray section bullet that precedes every label (aligns down the left edge)
function Bullet({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="block shrink-0" aria-hidden>
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
/*  FOCUS — four square pixel tiles                                   */
/* ================================================================== */

type Focus = {
  label: string;
  fill: string;
  border: string;
  labelColor: string;
  img: string;
};

const FOCUS: Focus[] = [
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

/** chunky pixel square — navy outer ring + accent inset + soft drop */
function pixelSquareBorder(border: string) {
  return {
    boxShadow: `inset 0 0 0 2px ${border}, inset 0 0 0 4px rgba(255,255,255,0.4), 0 0 0 2px #33406b, 0 2px 0 rgba(0,0,0,0.18)`,
    // stepped corners via clip-path (pixel chamfer)
    clipPath:
      "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
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
  const box = compact ? "w-[28px] h-[28px] rounded-[4px]" : "w-[34px] h-[34px] rounded-[5px]";
  const img = compact ? "w-[18px] h-[18px]" : "w-[22px] h-[22px]";
  const moreText = compact ? "text-[7px]" : "text-[8px]";

  return (
    <div
      className="group relative shrink-0"
      onMouseEnter={() => retroSound.playCursor()}
    >
      <div
        className={`${box} bg-white flex items-center justify-center transition-all duration-150 shadow-[inset_0_0_0_1.5px_#c5c8d0,0_1px_0_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5 group-hover:shadow-[inset_0_0_0_1.5px_#4a76c9,0_3px_0_rgba(0,0,0,0.12)]`}
      >
        {more ? (
          <span className={`font-pixel ${moreText} leading-none text-[#9aa0a6] group-hover:text-[#1f9fb8]`}>
            MORE
          </span>
        ) : (
          <img src={logo} alt={name} className={`${img} object-contain`} />
        )}
      </div>
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

function BarChartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="block shrink-0"
      fill="#3f9b46"
      aria-hidden
    >
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

/* ================================================================== */
/*  CURRENTLY — what i'm up to right now                              */
/* ================================================================== */

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
  { icon: <BuildMini />, label: "Freelancing (2 clients)", accent: "#5a9bd6" },
  { icon: <GrindMini />, label: "Shipping products", accent: "#f0c84a" },
  { icon: <LearnMini />, label: "Sem 3 @ IIIT", accent: "#8a5bc4" },
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
      onClick={(e) => {
        if (earned) {
          e.stopPropagation();
          retroSound.playSparkle();
        }
      }}
      onMouseEnter={() => retroSound.playCursor()}
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
      className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center shrink-0 transition-transform hover:scale-110 active:scale-95"
      style={{ background: LINK_BLUE, boxShadow: "inset 0 0 0 1.5px #21527f, 0 1px 0 rgba(0,0,0,0.25)" }}
    >
      {children}
    </a>
  );
}

/* ================================================================== */
/*  Content blocks — shared across desktop / mobile                   */
/* ================================================================== */

function FocusGrid({ columns }: { columns: 2 | 4 }) {
  return (
    <div
      className={
        columns === 2
          ? "grid grid-cols-2 gap-x-2 gap-y-2 pl-[22px] max-w-[200px]"
          : "flex gap-1.5 pl-[26px]"
      }
    >
      {FOCUS.map((f) => (
        <div
          key={f.label}
          onMouseEnter={() => retroSound.playCursor()}
          className={
            columns === 2
              ? "flex flex-col items-center gap-1"
              : "flex-1 min-w-0 flex flex-col items-center gap-1"
          }
        >
          <div
            className={
              (columns === 2
                ? "w-full max-w-[78px] aspect-square overflow-hidden flex items-center justify-center"
                : "w-full aspect-square overflow-hidden flex items-center justify-center") +
              " cursor-pointer transition-all duration-150 ease-out hover:-translate-y-1 hover:scale-[1.06] hover:brightness-[1.04] hover:[filter:drop-shadow(0_3px_0_rgba(0,0,0,0.28))_drop-shadow(0_0_0_2px_rgba(51,64,107,0.85))] active:translate-y-0 active:scale-[0.98] active:brightness-[0.97] active:[filter:drop-shadow(0_0_0_2px_rgba(51,64,107,0.6))]"
            }
            style={{
              background: f.fill,
              ...pixelSquareBorder(f.border),
            }}
          >
            <img
              src={`${f.img}?v=sq1`}
              alt={f.label}
              className="w-full h-full object-cover object-center pixelated select-none"
              draggable={false}
              decoding="async"
            />
          </div>
          <span
            className={`font-pixel leading-none tracking-tight text-center ${columns === 2 ? "text-[7px]" : "text-[8px]"}`}
            style={{ color: f.labelColor }}
          >
            {f.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function StackRows({ compact }: { compact?: boolean }) {
  const labelW = compact ? "w-[28px]" : "w-[34px]";
  const gap = compact ? "gap-1" : "gap-2";
  // mobile: single-line scroll so logos never wrap into a messy pile
  const row = compact
    ? `flex flex-nowrap ${gap} overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`
    : `flex flex-wrap ${gap}`;

  return (
    <div className={`flex flex-col ${compact ? "gap-1" : "gap-1.5"} ${compact ? "pl-0" : "pl-[12px]"}`}>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`font-pixel text-[8px] leading-none text-[#a4a9af] ${labelW} text-right shrink-0`}>
          CORE
        </span>
        <div className={`${row} min-w-0`}>
          {CORE_STACK.map((s) => (
            <StackTile key={s.key} name={s.name} logo={`/logos/${s.key}.svg`} compact={compact} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`font-pixel text-[8px] leading-none text-[#a4a9af] ${labelW} text-right shrink-0`}>
          INFRA
        </span>
        <div className={`${row} min-w-0`}>
          {INFRA_STACK.map((s) => (
            <StackTile key={s.key} name={s.name} logo={`/logos/${s.key}.svg`} compact={compact} />
          ))}
          <StackTile name="More to come" more compact={compact} />
        </div>
      </div>
    </div>
  );
}

function IdentityPanel({ layout }: { layout: CardLayout }) {
  const mobile = layout === "mobile";

  return (
    <div
      className={`relative z-10 flex flex-col rounded-[8px] ${
        mobile ? "w-[calc(100%-104px)] gap-1 px-2 py-1.5" : "w-[64%] gap-1 px-2.5 py-1.5"
      }`}
      style={CARD_PANEL_STYLE}
    >
      <div>
        <div className="flex items-center gap-2 min-w-0">
          <Bullet size={mobile ? 14 : 16} />
          <span className={`font-pixel leading-none text-[#56618c] shrink-0 ${mobile ? "text-[10px]" : "text-[12px]"}`}>
            NAME:
          </span>
          <span
            className={`font-pixel leading-none text-[#c23a33] tracking-wide ${
              mobile ? "text-[12px]" : "text-[14px] truncate"
            }`}
          >
            HARIHARAN
          </span>
        </div>
        <div className="h-px mt-1.5" style={{ background: CARD_PINK_DIVIDER }} />
      </div>

      <div>
        <div className={`flex items-center gap-2 ${mobile ? "mb-1" : "mb-1"}`}>
          <Bullet size={mobile ? 14 : 16} />
          <span className={`font-pixel leading-none text-[#56618c] ${mobile ? "text-[10px]" : "text-[12px]"}`}>
            FOCUS:
          </span>
        </div>
        <FocusGrid columns={mobile ? 2 : 4} />
        <div className="h-px mt-1.5" style={{ background: CARD_PINK_DIVIDER }} />
      </div>

      <div>
        <div className={`flex items-center gap-2 ${mobile ? "mb-1" : "mb-1.5"}`}>
          <Bullet size={mobile ? 14 : 16} />
          <span className={`font-pixel leading-none text-[#56618c] ${mobile ? "text-[10px]" : "text-[12px]"}`}>
            STACK:
          </span>
        </div>
        <StackRows compact={mobile} />
      </div>
    </div>
  );
}

function ExpPanel({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center w-fit max-w-full ${
        compact
          ? "h-[32px] gap-1.5 rounded-[7px] px-2.5"
          : "h-[40px] gap-2 rounded-[8px] px-3"
      }`}
      style={CARD_PANEL_STYLE}
    >
      {/* Press Start glyphs sit high in the em box — drop the whole row onto the visual midline */}
      <span className={`flex items-center ${compact ? "gap-1.5 translate-y-px" : "gap-2 translate-y-px"}`}>
        <Bullet size={compact ? 14 : 17} />
        <span
          className={`font-pixel leading-none text-[#56618c] shrink-0 ${
            compact ? "text-[11px]" : "text-[13px]"
          }`}
        >
          EXP:
        </span>
        <BarChartIcon size={compact ? 14 : 17} />
        <span
          className={`font-pixel leading-none text-[#3f9b46] whitespace-nowrap shrink-0 ${
            compact ? "text-[12px]" : "text-[14px]"
          }`}
        >
          1+ YEAR
        </span>
      </span>
    </div>
  );
}

function CurrentlyPanel({ layout }: { layout: CardLayout }) {
  const mobile = layout === "mobile";

  return (
    <div
      className={
        mobile
          ? "relative z-10 flex-1 min-w-0 h-[118px] rounded-[8px] overflow-hidden pointer-events-none"
          : "absolute right-0 bottom-0 z-20 w-[62%] max-w-[420px] h-[120px] rounded-[8px] overflow-hidden pointer-events-none"
      }
      style={{
        boxShadow:
          "inset 0 0 0 2px #33406b, 0 0 0 2px rgba(255,255,255,0.35), 0 8px 18px rgba(0,0,0,0.35)",
      }}
    >
      <img
        src="/sprites/front_bg.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-right pixelated"
        decoding="async"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(9,15,26,0.96) 38%, rgba(9,15,26,0.6) 62%, rgba(9,15,26,0) 82%)",
        }}
      />
      <div className={`relative z-10 h-full flex flex-col ${mobile ? "px-2 pt-1.5 pb-2" : "px-3 pt-2 pb-2.5"}`}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Bullet size={14} />
          <span className="font-pixel text-[11px] leading-none text-white">CURRENTLY:</span>
          <span className="w-[9px] h-[9px] rounded-full bg-[#46c463] ml-1 shadow-[0_0_6px_#46c463]" />
        </div>
        <div className={`flex flex-col ${mobile ? "gap-1" : "gap-1.5"}`}>
          {CURRENT.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 min-w-0">
              <span
                className={`${mobile ? "w-[20px] h-[20px]" : "w-[23px] h-[23px]"} shrink-0 flex items-center justify-center rounded-[3px]`}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  boxShadow: `inset 0 0 0 1.5px ${c.accent}66`,
                }}
              >
                {c.icon}
              </span>
              <span
                className={`font-card leading-none text-white truncate ${mobile ? "text-[13px]" : "text-[16px]"}`}
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardAvatar({ layout }: { layout: CardLayout }) {
  const mobile = layout === "mobile";
  return (
    <div
      className={
        mobile
          ? "absolute right-0 top-1 z-20 h-[280px] w-[118px] pointer-events-none"
          : "absolute right-[12px] top-[-8px] z-20 h-[290px] w-[170px] pointer-events-none"
      }
    >
      <div className="absolute inset-0 drop-shadow-[2px_4px_4px_rgba(0,0,0,0.22)]">
        <img
          src="/harifinal.webp"
          alt="Hariharan"
          className="h-full w-full object-contain object-bottom pixelated select-none"
          draggable={false}
          decoding="async"
        />
      </div>
    </div>
  );
}

function CardHeader({ id, layout }: { id: string; layout: CardLayout }) {
  const mobile = layout === "mobile";

  return (
    <div
      className={`relative flex items-center justify-between shrink-0 ${mobile ? "px-2.5 h-[44px]" : "px-3.5 h-[50px]"}`}
      style={{
        background: "linear-gradient(180deg, #ec605c 0%, #df4f4c 60%, #d8453f 100%)",
        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.16)",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <HeaderEmblem size={mobile ? 24 : 30} />
        <span
          className={`font-pixel leading-none text-white tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.22)] ${
            mobile ? "text-[13px]" : "text-[18px]"
          }`}
        >
          {mobile ? "DEV CARD" : "DEVELOPER CARD"}
        </span>
      </div>

      <div className={`flex items-center shrink-0 ${mobile ? "gap-1" : "gap-1.5"}`}>
        <QuickLink href="https://github.com/nothariharan" label="GitHub">
          <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="#fff" aria-hidden>
            <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
          </svg>
        </QuickLink>
        {!mobile && (
          <QuickLink href="https://www.linkedin.com/in/nmhariharan/" label="LinkedIn">
            <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="#fff" aria-hidden>
              <path d="M6.34 8.95H2.67V21h3.67V8.95zM4.5 3C3.12 3 2 4.12 2 5.5S3.12 8 4.5 8 7 6.88 7 5.5 5.88 3 4.5 3zM21.33 21h-3.66v-5.89c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9.8V8.95h3.51v1.65h.05c.49-.93 1.68-1.9 3.46-1.9 3.7 0 4.51 2.44 4.51 5.61V21z" />
            </svg>
          </QuickLink>
        )}
        <QuickLink href="mailto:nmhariharanme@gmail.com" label="Email">
          <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" aria-hidden>
            <rect x="2.5" y="5" width="19" height="14" rx="2" fill="#fff" />
            <path
              d="M3.5 6.5 L12 13 L20.5 6.5"
              stroke={LINK_BLUE}
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </QuickLink>

        <div
          className={`flex items-baseline rounded-[6px] bg-[#f8edc8] ${mobile ? "gap-1 px-1.5 py-1" : "gap-1.5 px-2.5 py-1.5"}`}
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(90,70,20,0.25)" }}
        >
          <span className={`font-pixel leading-none text-[#3a3a3a] ${mobile ? "text-[9px]" : "text-[11px]"}`}>
            IDNo.
          </span>
          <span className={`font-pixel leading-none text-[#3a3a3a] ${mobile ? "text-[9px]" : "text-[11px]"}`}>
            {id}
          </span>
        </div>
      </div>
    </div>
  );
}

function BadgeFooter() {
  return (
    <div
      className="relative z-10 h-[40px] flex items-center gap-0 px-4 py-1 shrink-0 overflow-visible"
      style={{
        background: "#ead9a8",
        boxShadow: "inset 0 2px 0 #33406b, inset 0 -1px 0 rgba(0,0,0,0.08)",
      }}
    >
      <SlantedSlot title="Y Combinator · Startup School" earned attachIndex={0}>
        <YcBadge />
      </SlantedSlot>
      {Array.from({ length: 3 }).map((_, i) => (
        <SlantedSlot key={i} title="Badge slot — locked" attachIndex={i + 1} />
      ))}
      <span className="ml-auto font-pixel text-[9px] leading-none text-[#7a6a3d] tracking-wide">
        PRESS <span className="text-[#c23a33]">A</span> TO FLIP ▸
      </span>
    </div>
  );
}

function MobileFlipBar() {
  return (
    <div
      className="relative z-20 h-[28px] flex items-center justify-center shrink-0"
      style={{
        background: "#ead9a8",
        boxShadow: "inset 0 2px 0 #33406b, inset 0 -1px 0 rgba(0,0,0,0.08)",
      }}
    >
      <span className="font-pixel text-[9px] leading-none text-[#7a6a3d] tracking-wide">
        TAP TO FLIP ▸
      </span>
    </div>
  );
}

/* ================================================================== */
/*  CARD FRONT                                                        */
/* ================================================================== */

export function CardFront({ layout = "desktop" }: { layout?: CardLayout }) {
  // fixed trainer id — random per-render values break SSR hydration
  const id = TRAINER_ID;
  const mobile = layout === "mobile";

  return (
    <div
      className="card-surface relative w-full h-full overflow-hidden bg-[#f6ecc6] text-slate-800 select-none flex flex-col"
      data-layout={layout}
    >
      {/* Slot for a future scenery / glass layer behind content */}
      <div className="card-surface__backdrop absolute inset-0 pointer-events-none" aria-hidden />

      <CardHeader id={id} layout={layout} />

      <div
        className={`relative z-10 flex-1 min-h-0 flex flex-col ${mobile ? "px-2 pt-1.5 pb-1.5" : "px-4 pt-2 pb-2"}`}
      >
        <CardAvatar layout={layout} />
        <IdentityPanel layout={layout} />

        {mobile ? (
          <>
            <div className="relative z-30 mt-1.5 flex items-end gap-1.5 shrink-0">
              <ExpPanel compact />
              <CurrentlyPanel layout="mobile" />
            </div>
            <div className="flex-1 min-h-0" aria-hidden />
          </>
        ) : (
          <>
            <CurrentlyPanel layout="desktop" />
            <div className="relative z-30 mt-auto mb-3 -ml-2 pt-1.5 w-fit max-w-[220px] shrink-0">
              <ExpPanel />
            </div>
          </>
        )}
      </div>

      {mobile ? <MobileFlipBar /> : <BadgeFooter />}
    </div>
  );
}
