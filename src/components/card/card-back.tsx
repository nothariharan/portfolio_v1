"use client";

import { useState } from "react";

interface CardBackProps {
  onEnterPortfolio: () => void;
}

// the 4 diagonal data sections — each rewrites the summary box below
const SECTIONS = [
  {
    key: "projects",
    label: "PROJECTS",
    accent: "#5fd0e6",
    img: "/sprites/section_projects.png",
    clip: "polygon(0 0, 95% 0, 75% 100%, 0 100%)",
    tagline: "things i've shipped",
    lines: [
      "STARTUP PLATFORM — realtime community app",
      "OBSIDIAN SYNC — md → site compiler",
      "TRAINER PORTFOLIO — this card + site",
    ],
    stats: "TOTAL 24 · LANGS TS/PY · HOST VERCEL",
  },
  {
    key: "experience",
    label: "EXPERIENCE",
    accent: "#7fd6a6",
    img: "/sprites/section_experience.png",
    clip: "polygon(10% 0, 95% 0, 80% 100%, 0 100%)",
    tagline: "the journey so far",
    lines: [
      "CO-FOUNDER — startup, full-stack + devops",
      "FULL-STACK ENG — next / react / node",
      "FOCUS — ai agent workflows, ci/cd",
    ],
    stats: "SINCE 2024 · LV 99 · AI · DEVOPS",
  },
  {
    key: "honors",
    label: "HONORS",
    accent: "#f0c84a",
    img: "/sprites/section_achievements.png",
    clip: "polygon(10% 0, 95% 0, 85% 100%, 0 100%)",
    tagline: "badges earned",
    lines: [
      "Y COMBINATOR — starter school",
      "HACKATHON — 1st place, agent track",
      "STARTUP — co-founded & launched",
    ],
    stats: "BADGES 18 · HACKS 12 · STARTUPS 1",
  },
  {
    key: "skills",
    label: "SKILLS",
    accent: "#9aa0f0",
    img: "/sprites/section_skills.png",
    clip: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)",
    tagline: "moves & abilities",
    lines: [
      "CORE — next.js, react, typescript",
      "BACK — node, python, devops, ml",
      "TOOLS — tailwind, obsidian, github api",
    ],
    stats: "OT HARI · LV 99 · CORE NEXTJS",
  },
];

export function CardBack({ onEnterPortfolio }: CardBackProps) {
  const [selected, setSelected] = useState(0);
  const active = SECTIONS[selected];

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f7f6f3] text-slate-800 select-none flex flex-col">
      {/* ===================== HEADER (matches front) ===================== */}
      <div
        className="relative flex items-center justify-between px-3.5 h-[46px] shrink-0"
        style={{
          background: "linear-gradient(180deg, #ec605c 0%, #df4f4c 60%, #d8453f 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.16)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <svg viewBox="0 0 100 100" className="w-[26px] h-[26px] shrink-0" aria-hidden>
            <circle cx="50" cy="50" r="45" fill="#fff" stroke="#2c2320" strokeWidth="7" />
            <path d="M5 50 A45 45 0 0 1 95 50 Z" fill="#e8504c" />
            <rect x="5" y="45" width="90" height="10" fill="#2c2320" />
            <circle cx="50" cy="50" r="14" fill="#fff" stroke="#2c2320" strokeWidth="8" />
          </svg>
          <span className="font-pixel text-[15px] leading-none text-white tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.22)]">
            DATA FILE
          </span>
        </div>
        <span className="font-pixel text-[8px] leading-none text-white/85">HOVER A SECTION</span>
      </div>

      {/* ===================== BODY ===================== */}
      <div className="flex flex-col flex-1 min-h-0 px-3.5 py-2.5 gap-2.5">
        {/* 4 diagonal image sections */}
        <div className="flex flex-1 min-h-0 gap-1.5">
          {SECTIONS.map((section, idx) => {
            const isActive = selected === idx;
            return (
              <div
                key={section.key}
                role="button"
                tabIndex={0}
                className="relative flex-1 min-w-0 cursor-pointer transition-all duration-200 overflow-hidden rounded-[5px]"
                style={{
                  clipPath: section.clip,
                  boxShadow: isActive
                    ? `inset 0 0 0 3px ${section.accent}`
                    : "inset 0 0 0 2px #c4ccc8",
                  transform: isActive ? "translateY(-2px)" : "none",
                }}
                onMouseEnter={() => setSelected(idx)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(idx);
                }}
              >
                {/* section art */}
                <img
                  src={section.img}
                  alt={section.label}
                  className="absolute inset-0 w-full h-full object-cover pixelated transition-opacity duration-200"
                  style={{ opacity: isActive ? 1 : 0.62 }}
                />
                {/* legibility wash — lighter when active */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: isActive
                      ? "linear-gradient(180deg, rgba(8,24,52,0) 45%, rgba(8,24,52,0.85) 100%)"
                      : "linear-gradient(180deg, rgba(8,24,52,0.4) 0%, rgba(8,24,52,0.8) 100%)",
                  }}
                />
                {/* label */}
                <span
                  className="absolute bottom-1.5 left-2 font-pixel text-[8px] leading-none tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  style={{ color: isActive ? section.accent : "#ffffff" }}
                >
                  {section.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* summary panel — rewrites per section, styled like the front */}
        <div
          className="shrink-0 rounded-[8px] p-2.5 flex flex-col gap-1.5"
          style={{ background: "#f1eee9", boxShadow: "inset 0 0 0 2px #dcd7cf, 0 2px 0 rgba(0,0,0,0.1)" }}
        >
          {/* title tab + tagline */}
          <div className="flex items-center justify-between">
            <span
              className="font-pixel px-2 py-1 rounded-[4px] text-[9px] leading-none text-slate-900"
              style={{ background: active.accent }}
            >
              {active.label}
            </span>
            <span className="font-card text-[12px] text-slate-400 leading-none">{active.tagline}</span>
          </div>

          {/* breakdown lines */}
          <div className="flex flex-col gap-1">
            {active.lines.map((line, i) => (
              <p key={i} className="font-card text-[12px] leading-tight text-[#5a5f66]">
                <span style={{ color: "#c23a33" }}>▸</span> {line}
              </p>
            ))}
          </div>

          {/* footer: stat readout + enter button */}
          <div className="mt-0.5 flex items-center justify-between border-t pt-1.5 gap-2" style={{ borderColor: "#e3ddd4" }}>
            <span className="font-card text-[11px] text-slate-400 leading-none truncate">{active.stats}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEnterPortfolio();
              }}
              className="shrink-0 font-pixel px-2.5 py-2 text-white text-[9px] leading-none rounded-[4px] cursor-pointer active:translate-y-px"
              style={{ background: "#e0524a", boxShadow: "inset 0 0 0 2px #a32f28, 0 2px 0 rgba(0,0,0,0.3)" }}
            >
              ▶ ENTER PORTFOLIO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
