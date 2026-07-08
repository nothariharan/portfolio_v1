"use client";

import type { ReactNode } from "react";
import { TRAINER_ID, PANELS, type TabKey } from "./data";

// shared pixel components

// red emblem in headers
export function Emblem({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="45" fill="#fff" stroke="#2c2320" strokeWidth="7" />
      <path d="M5 50 A45 45 0 0 1 95 50 Z" fill="#e8504c" />
      <rect x="5" y="45" width="90" height="10" fill="#2c2320" />
      <circle cx="50" cy="50" r="14" fill="#fff" stroke="#2c2320" strokeWidth="8" />
    </svg>
  );
}

// small white logo tile
export function LogoTile({ k, size = 38, name }: { k: string; size?: number; name?: string }) {
  return (
    <div
      className="group relative bg-white rounded-[5px] flex items-center justify-center shrink-0 shadow-[inset_0_0_0_2px_#2c2c2c,0_2px_0_rgba(0,0,0,0.22)]"
      style={{ width: size, height: size }}
      title={name}
    >
      <img src={`/logos/${k}.svg`} alt={name ?? k} className="object-contain" style={{ width: size - 14, height: size - 14 }} />
    </div>
  );
}

// plus n tile for extra tech
export function MoreTile({ n, size = 38 }: { n: number; size?: number }) {
  return (
    <div
      className="rounded-[5px] flex items-center justify-center shrink-0 bg-[#eef0f2] shadow-[inset_0_0_0_2px_#c9ced4]"
      style={{ width: size, height: size }}
    >
      <span className="font-pixel text-[9px] text-[#8a9097]">+{n}</span>
    </div>
  );
}

// segmented progress bar
export function SegBar({ color, pct, total = 12, light }: { color: string; pct: number; total?: number; light?: boolean }) {
  const filled = Math.round((pct / 100) * total);
  return (
    <span className="flex gap-[2px]">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-[9px] flex-1 rounded-[1px]"
          style={{ background: i < filled ? color : light ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.16)", minWidth: 6 }}
        />
      ))}
    </span>
  );
}

// star rating row
export function Stars({ n, total = 5 }: { n: number; total?: number }) {
  return (
    <span className="flex gap-[2px]">
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill={i < n ? "#6b4fb0" : "#cfd2d8"}>
          <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
        </svg>
      ))}
    </span>
  );
}

// top stat tile
export function StatTile({ value, label, children }: { value: string; label: string; children: ReactNode }) {
  return (
    <div className="flex-1 min-w-0 rounded-[8px] bg-[#f4f2ec] px-2 py-2.5 flex flex-col items-center gap-1 shadow-[inset_0_0_0_2px_#d9d4ca,0_2px_0_rgba(0,0,0,0.08)]">
      <span className="h-[26px] flex items-center justify-center">{children}</span>
      <span className="font-pixel text-[15px] leading-none text-[#2b2b2b]">{value}</span>
      <span className="font-pixel text-[7px] leading-none text-[#8a8f96] tracking-tight text-center">{label}</span>
    </div>
  );
}

// bottom navigation tab icons

export function TabIcon({ tab, active }: { tab: TabKey; active: boolean }) {
  const c = active ? "#c23a33" : "#5d6b64";
  switch (tab) {
    case "projects":
      return (
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke={c} strokeWidth="2">
          <rect x="3" y="4" width="18" height="13" rx="1" />
          <path d="M8 21h8M12 17v4" />
          <path d="M7 8l-2 2.5L7 13M17 8l2 2.5L17 13" strokeWidth="1.6" />
        </svg>
      );
    case "experience":
      return (
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill={active ? "#3f9b46" : "#5d6b64"}>
          <circle cx="12" cy="9" r="6" />
          <circle cx="7" cy="12" r="4.5" />
          <circle cx="17" cy="12" r="4.5" />
          <rect x="10.5" y="13" width="3" height="8" fill="#7a5a3a" />
        </svg>
      );
    case "honors":
      return (
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill={active ? "#e0a52c" : "#5d6b64"}>
          <path d="M7 3h10v3a5 5 0 0 1-10 0z" />
          <path d="M5 4h2v2a3 3 0 0 1-3-2zM19 4h-2v2a3 3 0 0 0 3-2z" />
          <rect x="10.5" y="10" width="3" height="6" />
          <rect x="8" y="18" width="8" height="3" rx="1" />
        </svg>
      );
    case "skills":
      return (
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill={active ? "#7e54b8" : "#5d6b64"}>
          <rect x="3" y="4" width="8" height="16" rx="1" />
          <rect x="13" y="4" width="8" height="16" rx="1" />
          <rect x="5" y="7" width="4" height="1.4" fill="#fff" opacity="0.6" />
          <rect x="15" y="7" width="4" height="1.4" fill="#fff" opacity="0.6" />
        </svg>
      );
  }
}

// data file display frame

export function DataFileShell({
  active,
  onTab,
  onBack,
  children,
}: {
  active: TabKey;
  onTab: (t: TabKey) => void;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-5 bg-[#0f2a2a]">
      <div
        className="w-full max-w-[1180px] h-[min(95vh,900px)] rounded-[14px] overflow-hidden flex flex-col font-card text-[#2b2b2b]"
        style={{ boxShadow: "0 0 0 3px #cdeeea, 0 0 0 13px #3f9b94, 0 0 0 16px #14403d, 0 18px 50px rgba(0,0,0,0.5)" }}
      >
        {/* header bar */}
        <div
          className="relative flex items-center justify-between px-4 h-[52px] shrink-0"
          style={{
            background: "linear-gradient(180deg, #ec605c 0%, #df4f4c 60%, #d8453f 100%)",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.16)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Emblem size={28} />
            <span className="font-pixel text-[16px] sm:text-[19px] leading-none text-white tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.22)]">
              DATA FILE
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#fbf6f4] shrink-0 shadow-[inset_0_0_0_1.5px_rgba(0,0,0,0.08)]">
            <span className="font-pixel text-[10px] sm:text-[11px] leading-none text-[#3a3a3a]">IDNo.</span>
            <span className="font-pixel text-[10px] sm:text-[11px] leading-none text-[#3a7c5a]">{TRAINER_ID}</span>
          </div>
        </div>

        {/* navigation tab buttons */}
        <div className="shrink-0 bg-[#e9e7e0] px-3 sm:px-4 pt-3 pb-2 flex gap-2 sm:gap-3">
          {PANELS.map((panel) => {
            const on = panel.tab === active;
            return (
              <button
                key={panel.tab}
                onClick={() => onTab(panel.tab)}
                className="group relative flex-1 min-w-0 h-[110px] sm:h-[140px] overflow-hidden cursor-pointer transition-all duration-200"
                style={{
                  transform: on ? "translateY(-3px)" : "none",
                  borderRadius: 8,
                  boxShadow: on
                    ? `0 0 0 2px #fff, 0 0 0 4px ${panel.accent}, 0 4px 0 rgba(0,0,0,0.25)`
                    : "0 0 0 2px #d4cfc3, 0 2px 0 rgba(0,0,0,0.18)",
                }}
              >
                <img
                  src={panel.img}
                  alt={panel.label}
                  className="absolute inset-0 w-full h-full object-cover pixelated transition-all duration-200"
                  style={{ filter: on ? "saturate(1.05) brightness(1)" : "saturate(0.82) brightness(0.78)" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: on
                      ? "linear-gradient(180deg, rgba(8,18,40,0) 45%, rgba(8,18,40,0.88) 100%)"
                      : "linear-gradient(180deg, rgba(8,18,40,0.3) 0%, rgba(8,18,40,0.82) 100%)",
                  }}
                />
                <span
                  className="absolute bottom-1.5 left-0 right-0 text-center font-pixel text-[9px] sm:text-[11px] leading-none tracking-wide drop-shadow-[1px_2px_0_rgba(0,0,0,0.9)]"
                  style={{ color: on ? panel.accent : "#ffffff" }}
                >
                  {panel.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* body container */}
        <div className="flex-1 min-h-0 bg-[#e9e7e0] overflow-y-auto overflow-x-hidden">{children}</div>

        {/* bottom bar */}
        <div className="shrink-0 h-[58px] bg-[#d7d2c6] flex items-center justify-between px-3 sm:px-5 gap-2 shadow-[inset_0_2px_0_rgba(0,0,0,0.08)]">
          <button
            onClick={onBack}
            className="shrink-0 font-pixel text-[8px] sm:text-[9px] text-white px-3 py-2.5 rounded-[5px] cursor-pointer active:translate-y-px flex items-center gap-1.5"
            style={{ background: "#46566b", boxShadow: "inset 0 0 0 2px #2f3b4c, 0 2px 0 rgba(0,0,0,0.3)" }}
          >
            ◂ BACK TO CARD
          </button>
          <span className="font-pixel text-[8px] sm:text-[10px] text-[#5d6b64] flex items-center gap-2">
            <span className="text-[#c23a33]">✦</span>
            <Emblem size={16} />
            SELECT A SECTION
            <span className="text-[#c23a33]">✦</span>
          </span>
          <span className="w-[110px] hidden sm:block" />
        </div>
      </div>
    </div>
  );
}

// sprite mascot used in sections
export function Mascot({ className = "" }: { className?: string }) {
  return (
    <img
      src="/sprites/hari_stand.png"
      alt="Hariharan"
      className={`object-contain pixelated drop-shadow-[2px_4px_3px_rgba(0,0,0,0.18)] pointer-events-none select-none ${className}`}
    />
  );
}
