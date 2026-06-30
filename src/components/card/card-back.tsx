"use client";

import { useState } from "react";
import { PANELS, BACK_SECTIONS, type BackIcon, type TabKey } from "../portfolio/data";
import { TabIcon } from "../portfolio/ui";

interface CardBackProps {
  onEnterPortfolio: (tab: TabKey) => void;
}

function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "github":
      return <img src="/logos/github.svg" alt="GitHub" className="w-[22px] h-[22px]" />;
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="w-[23px] h-[23px]" fill="#0a66c2">
          <rect x="2" y="2" width="20" height="20" rx="3" />
          <g fill="#fff">
            <rect x="5" y="9.5" width="3" height="8.5" />
            <circle cx="6.5" cy="6.3" r="1.7" />
            <path d="M11 9.5h2.9v1.3c.5-.9 1.6-1.6 3-1.6 2.1 0 3.1 1.3 3.1 3.8V18h-3v-4.4c0-1.1-.4-1.8-1.4-1.8-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8V18h-3z" />
          </g>
        </svg>
      );
    case "leetcode":
      return (
        <svg viewBox="0 0 24 24" className="w-[23px] h-[23px]">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#ffa116" />
          <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="monospace">LC</text>
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" className="w-[23px] h-[23px]">
          <rect x="3" y="5" width="18" height="14" rx="2" fill="#2f6fb0" />
          <path d="M4 7l8 5.5L20 7" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "trophy":
      return (
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="#e0a52c">
          <path d="M6 3h12v3a6 6 0 0 1-12 0z" />
          <path d="M4 4h2v2a2.5 2.5 0 0 1-2-2zM20 4h-2v2a2.5 2.5 0 0 0 2-2z" />
          <rect x="10.5" y="10" width="3" height="6" />
          <rect x="8" y="18" width="8" height="3" rx="1" />
        </svg>
      );
    default:
      return null;
  }
}

function BackIconTile({ icon }: { icon: BackIcon }) {
  const bare = icon.kind === "proj";
  const content =
    icon.kind === "proj" ? (
      <img src={`/sprites/proj_${icon.ref}.png`} alt={icon.label} className="w-[40px] h-[40px] rounded-[8px] pixelated" />
    ) : icon.kind === "logo" ? (
      <img src={`/logos/${icon.ref}.svg`} alt={icon.label} className="w-[24px] h-[24px] object-contain" />
    ) : (
      <SocialIcon name={icon.ref} />
    );
  const wrap = bare ? (
    content
  ) : (
    <span className="w-[40px] h-[40px] rounded-[8px] bg-white flex items-center justify-center shadow-[inset_0_0_0_2px_#dcd7cf]">{content}</span>
  );
  const cls = "shrink-0 transition-transform hover:scale-110 active:scale-95";
  return icon.url ? (
    <a href={icon.url} target="_blank" rel="noopener noreferrer" title={icon.label} onClick={(e) => e.stopPropagation()} className={cls}>
      {wrap}
    </a>
  ) : (
    <span title={icon.label} className="shrink-0">
      {wrap}
    </span>
  );
}

export function CardBack({ onEnterPortfolio }: CardBackProps) {
  const [sel, setSel] = useState(0);
  const active = PANELS[sel];
  const section = BACK_SECTIONS[active.tab];

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f7f6f3] text-slate-800 select-none flex flex-col">
      {/* ===================== HEADER ===================== */}
      <div
        className="relative flex items-center justify-between px-3.5 h-[44px] shrink-0"
        style={{
          background: "linear-gradient(180deg, #ec605c 0%, #df4f4c 60%, #d8453f 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.16)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <svg viewBox="0 0 100 100" className="w-[24px] h-[24px] shrink-0" aria-hidden>
            <circle cx="50" cy="50" r="45" fill="#fff" stroke="#2c2320" strokeWidth="7" />
            <path d="M5 50 A45 45 0 0 1 95 50 Z" fill="#e8504c" />
            <rect x="5" y="45" width="90" height="10" fill="#2c2320" />
            <circle cx="50" cy="50" r="14" fill="#fff" stroke="#2c2320" strokeWidth="8" />
          </svg>
          <span className="font-pixel text-[14px] leading-none text-white tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.22)]">
            DATA FILE
          </span>
        </div>
        <span className="font-pixel text-[8px] leading-none text-white/85">HOVER A SECTION ▸</span>
      </div>

      {/* ===================== 4 COMPACT BOXED SECTIONS ===================== */}
      <div className="flex flex-[0.95] min-h-0 gap-2 px-3.5 pt-2.5 pb-1.5">
        {PANELS.map((panel, i) => {
          const on = i === sel;
          return (
            <button
              key={panel.tab}
              onMouseEnter={() => setSel(i)}
              onClick={(e) => {
                e.stopPropagation();
                setSel(i);
              }}
              className="group relative flex-1 min-w-0 h-full overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                transform: on ? "translateY(-3px)" : "none",
                borderRadius: 6,
                boxShadow: on
                  ? `0 0 0 2px #fff, 0 0 0 4px ${panel.accent}, 0 4px 0 rgba(0,0,0,0.25)`
                  : "0 0 0 2px #e3ddd2, 0 2px 0 rgba(0,0,0,0.18)",
              }}
            >
              <img
                src={panel.img}
                alt={panel.label}
                className="absolute inset-0 w-full h-full object-cover pixelated transition-all duration-200"
                style={{ filter: on ? "saturate(1.05) brightness(1)" : "saturate(0.85) brightness(0.82)" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: on
                    ? "linear-gradient(180deg, rgba(8,18,40,0) 48%, rgba(8,18,40,0.86) 100%)"
                    : "linear-gradient(180deg, rgba(8,18,40,0.25) 0%, rgba(8,18,40,0.8) 100%)",
                }}
              />
              <span
                className="absolute bottom-1.5 left-0 right-0 text-center font-pixel text-[8px] leading-none tracking-wide drop-shadow-[1px_2px_0_rgba(0,0,0,0.9)]"
                style={{ color: on ? panel.accent : "#ffffff" }}
              >
                {panel.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ===================== BIG ONE-LINER + ICON LINKS ===================== */}
      <div
        className="flex-1 min-h-0 mx-3 mb-3 rounded-[8px] p-3.5 flex flex-col justify-between"
        style={{ background: "#f1eee8", boxShadow: "inset 0 0 0 2px #dcd7cf, 0 2px 0 rgba(0,0,0,0.1)" }}
      >
        {/* icon + label */}
        <div className="flex items-center gap-2">
          <span
            className="w-[28px] h-[28px] rounded-[6px] bg-white flex items-center justify-center shrink-0"
            style={{ boxShadow: `inset 0 0 0 2px ${active.accent}` }}
          >
            <TabIcon tab={active.tab} active />
          </span>
          <span
            className="font-pixel px-2.5 py-1.5 rounded-[5px] text-[11px] leading-none text-[#21304a]"
            style={{ background: active.accent }}
          >
            {active.label}
          </span>
        </div>

        {/* big one-line */}
        <p className="font-card text-[19px] leading-snug text-[#3a3f47]">{section.line}</p>

        {/* icon links */}
        <div className="flex flex-wrap items-center gap-2">
          {section.icons.map((ic, i) => (
            <BackIconTile key={i} icon={ic} />
          ))}
        </div>

        {/* bottom: hint + main portfolio */}
        <div className="flex items-center justify-between border-t pt-2 gap-2" style={{ borderColor: "#e3ddd4" }}>
          <span className="font-card text-[13px] text-slate-400 leading-none">tap an icon to open ↗</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnterPortfolio(active.tab);
            }}
            className="shrink-0 font-pixel px-3 py-2.5 text-white text-[9px] leading-none rounded-[5px] cursor-pointer active:translate-y-px"
            style={{ background: "#e0524a", boxShadow: "inset 0 0 0 2px #a32f28, 0 2px 0 rgba(0,0,0,0.3)" }}
          >
            ▶ MAIN PORTFOLIO
          </button>
        </div>
      </div>
    </div>
  );
}
