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
import { TabIcon } from "../portfolio/ui";

interface CardBackProps {
  onEnterPortfolio: (tab: TabKey) => void;
}

/* ---- small icons ---- */
function SvgIcon({ name }: { name: string }) {
  switch (name) {
    case "grad":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="#5d6b7a">
          <path d="M12 4 1 9l11 5 11-5z" />
          <path d="M5 12.2V16c0 1.4 3.1 2.8 7 2.8s7-1.4 7-2.8v-3.8l-7 3.1z" />
        </svg>
      );
    case "brief":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="#5d6b7a">
          <path d="M9 5h6v2h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4zm2 0v2h2V5z" />
          <rect x="3" y="11.5" width="18" height="2" fill="#fff" opacity="0.55" />
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

// white tile holding a /logos svg — lifts on hover so it feels alive
function LogoChip({ k, size = 30 }: { k: string; size?: number }) {
  return (
    <span
      className="group/chip relative rounded-[6px] bg-white flex items-center justify-center shrink-0 shadow-[inset_0_0_0_2px_#dcd7cf] transition-transform duration-150 ease-out will-change-transform hover:z-10 hover:-translate-y-[3px] hover:scale-[1.12] hover:shadow-[inset_0_0_0_2px_#c9d6d3,0_5px_10px_rgba(0,0,0,0.18)]"
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

// small bordered link button — clear hover lift + press feedback
function LinkBtn({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      onClick={(e) => e.stopPropagation()}
      className="w-[30px] h-[30px] rounded-[6px] bg-white flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150 ease-out will-change-transform hover:-translate-y-[3px] hover:scale-[1.12] hover:shadow-[0_5px_10px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-95 shadow-[inset_0_0_0_1.5px_#dcd7cf]"
    >
      {children}
    </a>
  );
}

export function CardBack({ onEnterPortfolio }: CardBackProps) {
  const [sel, setSel] = useState(0);
  const active = PANELS[sel];

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f7f6f3] text-slate-800 select-none flex flex-col">
      {/* ===================== HEADER ===================== */}
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
        <span className="font-pixel text-[8px] leading-none text-white/85">HOVER A SECTION ▸</span>
      </div>

      {/* ===================== 4 BOXED SECTIONS (shorter) ===================== */}
      <div className="flex flex-[0.78] min-h-0 gap-2 px-3.5 pt-2.5 pb-1.5">
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
              className="group relative flex-1 min-w-0 h-full overflow-hidden cursor-pointer transition-all duration-150 ease-out active:scale-[0.98]"
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
              <div className="absolute inset-0 pointer-events-none" style={{ background: on ? "linear-gradient(180deg, rgba(8,18,40,0) 50%, rgba(8,18,40,0.86) 100%)" : "linear-gradient(180deg, rgba(8,18,40,0.25) 0%, rgba(8,18,40,0.8) 100%)" }} />
              <span className="absolute bottom-1.5 left-0 right-0 text-center font-pixel text-[8px] leading-none tracking-wide drop-shadow-[1px_2px_0_rgba(0,0,0,0.9)]" style={{ color: on ? panel.accent : "#ffffff" }}>{panel.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================== SECTION DETAIL ===================== */}
      <div className="flex-[1.55] min-h-0 mx-3 mb-3 rounded-[8px] p-3 flex flex-col" style={{ background: "#f1eee8", boxShadow: "inset 0 0 0 2px #dcd7cf, 0 2px 0 rgba(0,0,0,0.1)" }}>
        {/* label */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <span className="w-[26px] h-[26px] rounded-[6px] bg-white flex items-center justify-center shrink-0" style={{ boxShadow: `inset 0 0 0 2px ${active.accent}` }}>
            <TabIcon tab={active.tab} active />
          </span>
          <span className="font-pixel px-2.5 py-1.5 rounded-[5px] text-[11px] leading-none text-[#21304a]" style={{ background: active.accent }}>{active.label}</span>
        </div>

        {/* body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
          {/* PROJECTS */}
          {active.tab === "projects" && (
            <div className="flex flex-col gap-2">
              {BACK_PROJECTS.map((p) => (
                <div key={p.name} className="flex items-center gap-2.5 rounded-[8px] p-2" style={{ background: "#faf8f2", boxShadow: "inset 0 0 0 1.5px #e3ddd0" }}>
                  <img src={`/sprites/proj_${p.icon}.png`} alt={p.name} className="w-[42px] h-[42px] rounded-[8px] pixelated shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-pixel text-[13px] leading-none mb-1.5 text-[#2b2b2b]">{p.name}</span>
                    <span className="block font-card text-[15px] leading-snug text-[#5a6068]">{p.desc}</span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    {p.stack.map((k) => (
                      <LogoChip key={k} k={k} size={26} />
                    ))}
                    {p.live && <LinkBtn href={p.live} title="Live demo"><SvgIcon name="globe" /></LinkBtn>}
                    <LinkBtn href={p.repo} title="Source"><SvgIcon name="github" /></LinkBtn>
                  </span>
                </div>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterPortfolio("projects");
                }}
                className="font-pixel text-[10px] text-[#5a6068] py-2.5 rounded-[7px] cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-95 hover:text-[#3f4650] active:translate-y-0 active:scale-[0.98]"
                style={{ background: "#ece8df", boxShadow: "inset 0 0 0 1.5px #ded9cd" }}
              >
                MORE PROJECTS → MAIN PORTFOLIO
              </button>
            </div>
          )}

          {/* EXPERIENCE — chronological timeline */}
          {active.tab === "experience" && (
            <div className="relative pl-7">
              {/* rail */}
              <div className="absolute left-[11px] top-2 bottom-6 w-[2px]" style={{ background: "#cfc8ba" }} />
              {BACK_EXPERIENCE.map((e, i) => (
                <div key={i} className="relative mb-2.5">
                  <span className="absolute left-[-21px] top-3.5 w-[13px] h-[13px] rounded-full bg-white" style={{ boxShadow: `inset 0 0 0 3px ${active.accent}` }} />
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(ev) => ev.stopPropagation()}
                    className="flex items-center gap-2.5 rounded-[8px] p-2.5 mr-[12%] cursor-pointer transition-transform hover:translate-x-0.5"
                    style={{ background: "#faf8f2", boxShadow: "inset 0 0 0 1.5px #e3ddd0" }}
                  >
                    <span className="w-[32px] h-[32px] rounded-[7px] bg-white flex items-center justify-center shrink-0 shadow-[inset_0_0_0_2px_#e0dacd]">
                      <SvgIcon name={e.icon} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-pixel text-[9px] leading-none mb-1 text-[#3f9b46]">{e.year}</span>
                      <span className="block font-pixel text-[11px] leading-none mb-1 text-[#2b2b2b]">{e.title}</span>
                      <span className="block font-card text-[14px] leading-snug text-[#5a6068]">{e.sub}</span>
                    </span>
                    <span className="w-[28px] h-[28px] rounded-[6px] bg-white flex items-center justify-center shrink-0 shadow-[inset_0_0_0_1.5px_#dcd7cf]">
                      <SvgIcon name="linkedin" />
                    </span>
                  </a>
                </div>
              ))}
              <div className="relative">
                <span className="absolute left-[-22px] top-1 w-[13px] h-[13px] rounded-full bg-[#f1eee8]" style={{ boxShadow: "inset 0 0 0 2px #cfc8ba" }} />
                <span className="font-card text-[13px] text-slate-400 italic">⋯ more to come in the future</span>
              </div>
            </div>
          )}

          {/* HONORS — rows + more-details button */}
          {active.tab === "honors" && (
            <div className="flex flex-col gap-2">
              {BACK_HONORS.map((r) => (
                <a
                  key={r.title}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2.5 rounded-[8px] p-2.5 cursor-pointer transition-transform hover:translate-x-0.5"
                  style={{ background: "#faf8f2", boxShadow: "inset 0 0 0 1.5px #e3ddd0" }}
                >
                  <span className="w-[34px] h-[34px] rounded-[7px] bg-white flex items-center justify-center shrink-0 shadow-[inset_0_0_0_2px_#e0dacd]">
                    <SvgIcon name={r.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-pixel text-[11px] leading-none mb-1.5 text-[#2b2b2b]">{r.title}</span>
                    <span className="block font-card text-[14px] leading-snug text-[#5a6068]">{r.sub}</span>
                  </span>
                  <span className="w-[28px] h-[28px] rounded-[6px] bg-white flex items-center justify-center shrink-0 shadow-[inset_0_0_0_1.5px_#dcd7cf]">
                    <SvgIcon name="linkedin" />
                  </span>
                </a>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterPortfolio("honors");
                }}
                className="font-pixel text-[9px] text-[#5a6068] py-2.5 rounded-[7px] cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-95 hover:text-[#3f4650] active:translate-y-0 active:scale-[0.98]"
                style={{ background: "#ece8df", boxShadow: "inset 0 0 0 1.5px #ded9cd" }}
              >
                MORE ELABORATED ACHIEVEMENTS →
              </button>
            </div>
          )}

          {/* SKILLS — grouped icon rows + tools (bigger, fills the space) */}
          {active.tab === "skills" && (
            <div className="flex flex-col justify-between h-full gap-1.5 py-0.5">
              {BACK_SKILLS.map((g) => (
                <div key={g.label} className="flex items-center gap-2.5">
                  <span className="font-pixel text-[8px] leading-tight text-[#8a8f96] w-[58px] text-right shrink-0">{g.label}</span>
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

        {/* footer: hint + main portfolio */}
        <div className="flex items-center justify-between border-t pt-2 mt-2 gap-2 shrink-0" style={{ borderColor: "#e3ddd4" }}>
          <span className="font-card text-[16px] text-slate-500 leading-none">tap an icon to open ↗</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnterPortfolio(active.tab);
            }}
            className="shrink-0 font-pixel px-3 py-2.5 text-white text-[9px] leading-none rounded-[5px] cursor-pointer transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.97]"
            style={{ background: "#e0524a", boxShadow: "inset 0 0 0 2px #a32f28, 0 2px 0 rgba(0,0,0,0.3)" }}
          >
            ▶ MAIN PORTFOLIO
          </button>
        </div>
      </div>
    </div>
  );
}
