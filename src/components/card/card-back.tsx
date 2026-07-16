"use client";

import { useState } from "react";
import {
  PANELS,
  BACK_PROJECTS,
  BACK_EXPERIENCE,
  BACK_HONORS,
  BACK_SKILLS,
  type TabKey,
} from "../portfolio/data";

// pokemon menu palette shared across the back face
const NAVY = "#33406b";
const NAVY_SOFT = "#3d4d78";
const LABEL_BLUE = "#4a6db5";
const CREAM = "#f6ecc6";
const PANEL_CREAM = "#fbf4d8";
const ROW_CREAM = "#fffbe9";

// small utility icons — grad/brief/cloud take the row accent color
function SvgIcon({ name, color = "#5d6b7a" }: { name: string; color?: string }) {
  switch (name) {
    case "grad":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill={color}>
          <path d="M12 4 1 9l11 5 11-5z" />
          <path d="M5 12.2V16c0 1.4 3.1 2.8 7 2.8s7-1.4 7-2.8v-3.8l-7 3.1z" />
        </svg>
      );
    case "brief":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill={color}>
          <path d="M9 5h6v2h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4zm2 0v2h2V5z" />
          <rect x="3" y="11.5" width="18" height="2" fill="#fff" opacity="0.55" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill={color}>
          <path d="M7 18a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.6 1.1A4 4 0 0 1 17.5 18z" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="none" stroke="#3f9b46" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 8 5 12 9 16" />
          <polyline points="15 8 19 12 15 16" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="#e0a52c">
          <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
        </svg>
      );
    case "trophy":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="#e0a52c">
          <path d="M6 3h12v3a6 6 0 0 1-12 0z" />
          <path d="M4 4h2v2a2.5 2.5 0 0 1-2-2zM20 4h-2v2a2.5 2.5 0 0 0 2-2z" />
          <rect x="10.5" y="10" width="3" height="6" />
          <rect x="8" y="18" width="8" height="3" rx="1" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#0a66c2">
          <rect x="2" y="2" width="20" height="20" rx="3" />
          <g fill="#fff">
            <rect x="5" y="9.5" width="3" height="8.5" />
            <circle cx="6.5" cy="6.3" r="1.7" />
            <path d="M11 9.5h2.9v1.3c.5-.9 1.6-1.6 3-1.6 2.1 0 3.1 1.3 3.1 3.8V18h-3v-4.4c0-1.1-.4-1.8-1.4-1.8-.8 0-1.3.5-1.5 1.1V18h-3z" />
          </g>
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="#2f78bf" strokeWidth="1.9">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="3.6" ry="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case "github":
      return <img src="/logos/github.svg" alt="GitHub" className="w-[18px] h-[18px]" />;
    default:
      return null;
  }
}

// white tile holding a technology logo that lifts on hover
function LogoChip({ k, size = 30 }: { k: string; size?: number }) {
  return (
    <span
      className="group/chip relative rounded-[6px] bg-white flex items-center justify-center shrink-0 shadow-[inset_0_0_0_2px_#d9cba0] transition-transform duration-150 ease-out will-change-transform hover:z-10 hover:-translate-y-[3px] hover:scale-[1.12] hover:shadow-[inset_0_0_0_2px_#4a76c9,0_5px_10px_rgba(0,0,0,0.18)]"
      style={{ width: size, height: size }}
      title={k}
    >
      <img
        src={`/logos/${k}.svg`}
        alt={k}
        className="object-contain transition-transform duration-150 group-hover/chip:scale-105"
        style={{ width: size - 12, height: size - 12 }}
      />
    </span>
  );
}

// link button with a hover lift and click feedback
function LinkBtn({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      onClick={(e) => e.stopPropagation()}
      className="w-[30px] h-[30px] rounded-[6px] bg-white flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150 ease-out will-change-transform hover:-translate-y-[3px] hover:scale-[1.12] hover:shadow-[0_5px_10px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-95 shadow-[inset_0_0_0_1.5px_#d9cba0]"
    >
      {children}
    </a>
  );
}

// blinking red menu cursor, revealed on row hover
function RedCursor() {
  return (
    <span
      className="shrink-0 w-[10px] font-pixel text-[11px] leading-none text-[#c23a33] opacity-0 group-hover:opacity-100 transition-opacity duration-100"
      aria-hidden
    >
      ▶
    </span>
  );
}

// cream list row with the classic navy double border and a colored accent stripe on the left
function rowStyle(color: string) {
  return {
    background: ROW_CREAM,
    boxShadow: `0 0 0 2px ${NAVY_SOFT}, inset 4px 0 0 ${color}, inset 0 0 0 2px #fffef6`,
  } as const;
}

// pokemon type-style pill naming what the thing actually is
function TypePill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="font-pixel text-[7px] leading-none px-1.5 py-[3px] rounded-[3px] text-white shrink-0"
      style={{ background: color, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.22), 0 0 0 1.5px rgba(0,0,0,0.2)" }}
    >
      {label}
    </span>
  );
}

// icon tile tinted with the row accent color
function IconTile({ color, size, children }: { color: string; size: number; children: React.ReactNode }) {
  return (
    <span
      className="rounded-[6px] flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size, background: `${color}1f`, boxShadow: `inset 0 0 0 2px ${color}` }}
    >
      {children}
    </span>
  );
}

interface CardBackProps {
  onEnterPortfolio: (tab: TabKey) => void;
}

export function CardBack({ onEnterPortfolio }: CardBackProps) {
  const [sel, setSel] = useState(0);
  const active = PANELS[sel];

  return (
    <div className="relative w-full h-full overflow-hidden text-slate-800 select-none flex flex-col" style={{ background: CREAM }}>
      {/* header bar */}
      <div
        className="relative flex items-center justify-between px-3.5 h-[42px] shrink-0"
        style={{
          background: "linear-gradient(180deg, #ec605c 0%, #df4f4c 60%, #d8453f 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.16)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <svg viewBox="0 0 100 100" className="w-[22px] h-[22px] shrink-0" aria-hidden>
            <circle cx="50" cy="50" r="45" fill="#fff" stroke="#2c2320" strokeWidth="7" />
            <path d="M5 50 A45 45 0 0 1 95 50 Z" fill="#e8504c" />
            <rect x="5" y="45" width="90" height="10" fill="#2c2320" />
            <circle cx="50" cy="50" r="14" fill="#fff" stroke="#2c2320" strokeWidth="8" />
          </svg>
          <span className="font-pixel text-[13px] leading-none text-white tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.22)]">DATA FILE</span>
        </div>
        <span className="font-pixel text-[8px] leading-none text-white/85">PRESS A TO FLIP</span>
      </div>

      {/* pokemon-style tab buttons */}
      <div className="flex gap-1.5 px-3.5 pt-3 shrink-0">
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
              className="flex-1 min-w-0 font-pixel text-[9px] leading-none py-2.5 rounded-[6px] cursor-pointer transition-all duration-100 ease-out active:scale-[0.97]"
              style={
                on
                  ? {
                      background: "linear-gradient(180deg, #5b87d6 0%, #4a76c9 55%, #3f68b8 100%)",
                      color: "#fff",
                      boxShadow: `0 0 0 2px ${NAVY}, inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.2)`,
                      transform: "translateY(-1px)",
                    }
                  : {
                      background: "#fdf6dd",
                      color: "#3d5380",
                      boxShadow: `0 0 0 2px ${NAVY}, inset 0 -2px 0 rgba(0,0,0,0.1)`,
                    }
              }
            >
              {panel.label}
            </button>
          );
        })}
      </div>

      {/* details box */}
      <div
        className="flex-1 min-h-0 mx-3.5 my-3 rounded-[8px] p-3 flex flex-col"
        style={{ background: PANEL_CREAM, boxShadow: `0 0 0 2px ${NAVY}, inset 0 0 0 2px #fffbe8` }}
      >
        {/* main details — 3px padding keeps row borders from being clipped by the scroll area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-[3px] pr-1">
          {/* projects — No. + name + one line + link, nothing else */}
          {active.tab === "projects" && (
            <div className="flex flex-col gap-2">
              {BACK_PROJECTS.map((p, i) => (
                <div key={p.name} className="group flex items-center gap-2 rounded-[6px] p-1.5 pl-2.5" style={rowStyle(p.color)}>
                  <RedCursor />
                  <IconTile color={p.color} size={36}>
                    <img src={`/sprites/proj_${p.icon}.png`} alt={p.name} className="w-full h-full pixelated" />
                  </IconTile>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 mb-[3px]">
                      <span className="font-pixel text-[7px] leading-none" style={{ color: p.color }}>
                        No.{String(i + 1).padStart(3, "0")}
                      </span>
                      <TypePill label={p.tag} color={p.color} />
                    </span>
                    <span className="block font-pixel text-[11px] leading-none mb-[3px] text-[#2b2b2b]">{p.name}</span>
                    <span className="block font-card text-[13px] leading-snug text-[#5a6068] truncate">{p.desc}</span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    {p.live && <LinkBtn href={p.live} title="Live site"><SvgIcon name="globe" /></LinkBtn>}
                    <LinkBtn href={p.repo} title="Source"><SvgIcon name="github" /></LinkBtn>
                  </span>
                </div>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterPortfolio("projects");
                }}
                className="group font-pixel text-[10px] text-[#3d5380] py-2 rounded-[6px] cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-[0.98] active:translate-y-0 active:scale-[0.98]"
                style={{ background: "#fdf6dd", boxShadow: `0 0 0 2px ${NAVY}, inset 0 -2px 0 rgba(0,0,0,0.1)` }}
              >
                <span className="text-[#c23a33] opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                MORE PROJECTS…
              </button>
            </div>
          )}

          {/* experience timeline */}
          {active.tab === "experience" && (
            <div className="relative pl-6">
              {/* timeline guide line */}
              <div className="absolute left-[8px] top-3 bottom-5 w-[2px]" style={{ background: "#d4c491" }} />
              {BACK_EXPERIENCE.map((e, i) => (
                <div key={i} className="relative mb-2">
                  <span className="absolute left-[-21px] top-[16px] w-[12px] h-[12px] rounded-full bg-white z-10" style={{ boxShadow: `inset 0 0 0 3px ${e.color}` }} />
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(ev) => ev.stopPropagation()}
                    className="group flex items-center gap-2 rounded-[6px] p-2 pl-3 cursor-pointer transition-transform hover:translate-x-0.5"
                    style={rowStyle(e.color)}
                  >
                    <RedCursor />
                    <IconTile color={e.color} size={32}>
                      <SvgIcon name={e.icon} color={e.color} />
                    </IconTile>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 mb-1">
                        <span className="font-pixel text-[8px] leading-none" style={{ color: e.color }}>{e.year}</span>
                        <TypePill label={e.tag} color={e.color} />
                      </span>
                      <span className="block font-pixel text-[11px] leading-none mb-1 text-[#2b2b2b]">{e.title}</span>
                      <span className="block font-card text-[13px] leading-snug text-[#5a6068]">{e.sub}</span>
                    </span>
                    <span className="w-[28px] h-[28px] rounded-[6px] bg-white flex items-center justify-center shrink-0" style={{ boxShadow: "inset 0 0 0 1.5px #d9cba0" }}>
                      <SvgIcon name="linkedin" />
                    </span>
                  </a>
                </div>
              ))}
              <div className="relative pl-1">
                <span className="absolute left-[-19px] top-[2px] w-[10px] h-[10px] rounded-full" style={{ background: PANEL_CREAM, boxShadow: "inset 0 0 0 2px #d4c491" }} />
                <span className="font-card text-[13px] text-slate-400 italic">⋯ more to come in the future</span>
              </div>
            </div>
          )}

          {/* honors sublist */}
          {active.tab === "honors" && (
            <div className="flex flex-col gap-2">
              {BACK_HONORS.map((r) => (
                <a
                  key={r.title}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group flex items-center gap-2.5 rounded-[6px] p-2.5 pl-3 cursor-pointer transition-transform hover:translate-x-0.5"
                  style={rowStyle(r.color)}
                >
                  <RedCursor />
                  <IconTile color={r.color} size={34}>
                    <SvgIcon name={r.icon} />
                  </IconTile>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 mb-1.5">
                      <span className="font-pixel text-[11px] leading-none text-[#2b2b2b]">{r.title}</span>
                      <TypePill label={r.tag} color={r.color} />
                    </span>
                    <span className="block font-card text-[14px] leading-snug text-[#5a6068]">{r.sub}</span>
                  </span>
                  <span className="w-[28px] h-[28px] rounded-[6px] bg-white flex items-center justify-center shrink-0" style={{ boxShadow: "inset 0 0 0 1.5px #d9cba0" }}>
                    <SvgIcon name="linkedin" />
                  </span>
                </a>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterPortfolio("honors");
                }}
                className="group font-pixel text-[9px] text-[#3d5380] py-2.5 rounded-[6px] cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-[0.98] active:translate-y-0 active:scale-[0.98]"
                style={{ background: "#fdf6dd", boxShadow: `0 0 0 2px ${NAVY}, inset 0 -2px 0 rgba(0,0,0,0.1)` }}
              >
                <span className="text-[#c23a33] opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                MORE ELABORATED ACHIEVEMENTS…
              </button>
            </div>
          )}

          {/* skills logo lines */}
          {active.tab === "skills" && (
            <div className="flex flex-col justify-between h-full gap-1.5 py-0.5">
              {BACK_SKILLS.map((g) => (
                <div key={g.label} className="flex items-center gap-2.5">
                  <span className="font-pixel text-[8px] leading-tight w-[58px] text-right shrink-0" style={{ color: LABEL_BLUE }}>{g.label}</span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    {g.icons.map((k) => (
                      <LogoChip key={k} k={k} size={34} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* bottom footer hint and button */}
        <div className="flex items-center justify-between border-t pt-2 mt-2 gap-2 shrink-0" style={{ borderColor: "#e0d3a4" }}>
          <span className="font-card text-[16px] text-[#8a7c56] leading-none">tap an icon to open ↗</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnterPortfolio(active.tab);
            }}
            className="shrink-0 font-pixel px-3 py-2.5 text-white text-[9px] leading-none rounded-[5px] cursor-pointer transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.97]"
            style={{ background: "#e0524a", boxShadow: `0 0 0 2px ${NAVY}, inset 0 0 0 2px #a32f28, 0 2px 0 rgba(0,0,0,0.3)` }}
          >
            ▶ MAIN PORTFOLIO
          </button>
        </div>
      </div>
    </div>
  );
}
