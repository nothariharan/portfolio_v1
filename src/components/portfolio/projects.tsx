"use client";

import { useState } from "react";
import { PROJECTS, PROJECT_META, TOTAL_BUILT } from "./data";
import { LogoTile, MoreTile } from "./ui";

function Globe({ active }: { active?: boolean }) {
  const c = active ? "#2f78bf" : "#9aa0a6";
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke={c} strokeWidth="1.9">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="3.6" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

// small bordered icon button used for live / source links in the list
function IconBtn({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      onClick={(e) => e.stopPropagation()}
      className="w-[30px] h-[30px] rounded-[6px] bg-white flex items-center justify-center shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95"
      style={{ boxShadow: "inset 0 0 0 1.5px #d7d2c6" }}
    >
      {children}
    </a>
  );
}

// stylised mock dashboard used as the project preview
function MockWindow({ color }: { color: string }) {
  return (
    <div className="w-full h-[170px] rounded-[7px] overflow-hidden shadow-[inset_0_0_0_2px_#cfcabf]" style={{ background: "#10141c" }}>
      <div className="h-[20px] flex items-center gap-1.5 px-3" style={{ background: "#1c2430" }}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#e0524a]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e0a52c]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3f9b46]" />
      </div>
      <div className="flex h-[calc(100%-20px)]">
        <div className="w-[26%] border-r border-white/10 p-2.5 flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-2.5 rounded-[1px]" style={{ background: i === 0 ? color : "rgba(255,255,255,0.14)", width: `${80 - i * 8}%` }} />
          ))}
        </div>
        <div className="flex-1 p-3 flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <span className="h-11 flex-1 rounded-[3px]" style={{ background: `${color}33` }} />
            <span className="h-11 flex-1 rounded-[3px] bg-white/10" />
            <span className="h-11 flex-1 rounded-[3px] bg-white/10" />
          </div>
          <div className="flex-1 rounded-[3px] bg-white/[0.06] relative overflow-hidden">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[70%]">
              <polyline points="0,26 14,18 28,22 42,10 56,14 70,6 84,12 100,4" fill="none" stroke={color} strokeWidth="1.8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [sel, setSel] = useState(0);
  const p = PROJECTS[sel];

  return (
    <div className="p-3 sm:p-4 flex flex-col lg:flex-row gap-3.5">
      {/* ===== LEFT: ALL PROJECTS ===== */}
      <div className="lg:w-[40%] rounded-[12px] p-3.5 flex flex-col min-h-0" style={{ background: "#f4f2ec", boxShadow: "inset 0 0 0 2px #ddd8cd" }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="font-pixel text-[15px] text-[#2b2b2b]">ALL PROJECTS</span>
          <span className="font-pixel text-[11px] text-[#3a7cc2]">{TOTAL_BUILT} BUILT</span>
        </div>
        <div className="flex flex-col gap-2.5 overflow-y-auto pr-1" style={{ maxHeight: "calc(95vh - 340px)" }}>
          {PROJECTS.map((pr, i) => {
            const m = PROJECT_META[pr.id];
            const on = i === sel;
            return (
              <button
                key={pr.id}
                onClick={() => setSel(i)}
                className="text-left rounded-[10px] p-3 flex gap-3 items-center cursor-pointer transition-all"
                style={{ background: on ? "#fff" : "#ece8df", boxShadow: on ? `inset 0 0 0 2px ${pr.color}` : "inset 0 0 0 1px #ded9cd" }}
              >
                <img src={`/sprites/proj_${m.icon}.webp`} alt={pr.short} className="w-[50px] h-[50px] rounded-[8px] pixelated shrink-0" loading="lazy" decoding="async" />
                <span className="min-w-0 flex-1">
                  <span className="block font-pixel text-[13px] leading-none mb-2" style={{ color: on ? pr.color : "#34383e" }}>{pr.short}</span>
                  <span className="block font-card text-[14px] leading-tight text-[#5a6068]">{m.listDesc}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  {pr.url ? (
                    <IconBtn href={pr.url} title="Live demo"><Globe active={on} /></IconBtn>
                  ) : (
                    <span className="w-[30px] h-[30px] rounded-[6px] bg-[#ece8df] flex items-center justify-center" style={{ boxShadow: "inset 0 0 0 1.5px #ded9cd" }}><Globe /></span>
                  )}
                  <IconBtn href={pr.repo} title="Source code">
                    <img src="/logos/github.svg" alt="GitHub" className="w-[18px] h-[18px]" />
                  </IconBtn>
                </span>
              </button>
            );
          })}
        </div>
        <a
          href="https://github.com/nothariharan"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 font-pixel text-[11px] text-[#5a6068] py-3 rounded-[8px] text-center cursor-pointer flex items-center justify-center gap-2"
          style={{ background: "#ece8df", boxShadow: "inset 0 0 0 1.5px #ded9cd" }}
        >
          + MORE PROJECTS ▾
        </a>
      </div>

      {/* ===== RIGHT: DETAIL ===== */}
      <div className="lg:flex-1 rounded-[12px] p-4 sm:p-5" style={{ background: "#f4f2ec", boxShadow: "inset 0 0 0 2px #ddd8cd" }}>
        {/* title row + actions */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-[18px] h-[18px] rounded-full shrink-0" style={{ background: p.color, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.2)" }} />
              <span className="font-pixel text-[12px] text-[#c23a33]">PROJECT #{p.id}</span>
            </div>
            <span className="font-pixel text-[26px] text-[#2b2b2b] block mb-3">{p.short}</span>
            <span className="flex gap-2 flex-wrap">
              {p.tags.map((t) => (
                <span key={t} className="font-pixel text-[10px] text-[#2f5a8c] bg-[#dbe8f6] px-2.5 py-1.5 rounded-[5px] shadow-[inset_0_0_0_1px_#a9c8e8]">{t}</span>
              ))}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 shrink-0">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-pixel text-[11px] text-[#2f78bf] px-4 py-3 rounded-[7px] bg-white flex items-center gap-2.5 cursor-pointer active:translate-y-px" style={{ boxShadow: "inset 0 0 0 2px #7fc6dc, 0 2px 0 rgba(0,0,0,0.12)" }}>
                <Globe active /> LIVE DEMO
              </a>
            ) : (
              <span className="font-pixel text-[11px] text-[#a59f93] px-4 py-3 rounded-[7px] bg-[#ece9e1] flex items-center gap-2.5" style={{ boxShadow: "inset 0 0 0 2px #d9d4ca" }}>NO LIVE DEMO</span>
            )}
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="font-pixel text-[11px] text-[#34383e] px-4 py-3 rounded-[7px] bg-white flex items-center gap-2.5 cursor-pointer active:translate-y-px" style={{ boxShadow: "inset 0 0 0 2px #cfcabf, 0 2px 0 rgba(0,0,0,0.12)" }}>
              <img src="/logos/github.svg" alt="" className="w-[16px] h-[16px]" /> VIEW ON GITHUB
            </a>
          </div>
        </div>

        {/* preview */}
        <MockWindow color={p.color} />

        {/* description — prominent */}
        <p className="font-card text-[18px] leading-snug text-[#3f444c] my-4">{p.blurb}</p>

        {/* meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-[10px] p-4" style={{ background: "#faf8f2", boxShadow: "inset 0 0 0 1.5px #e3ddd0" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-[#8a8f96] text-[16px]">◷</span>
            <div>
              <span className="block font-pixel text-[9px] text-[#8a8f96] mb-1.5">ROLE</span>
              <span className="font-card text-[15px] text-[#34383e]">{p.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#8a8f96] text-[16px]">▦</span>
            <div>
              <span className="block font-pixel text-[9px] text-[#8a8f96] mb-1.5">TEAM</span>
              <span className="font-card text-[15px] text-[#34383e]">{p.team}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#8a8f96] text-[16px]">⏱</span>
            <div>
              <span className="block font-pixel text-[9px] text-[#8a8f96] mb-1.5">DURATION</span>
              <span className="font-card text-[15px] text-[#34383e]">{p.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#8a8f96] text-[16px]">⚙</span>
            <div className="min-w-0">
              <span className="block font-pixel text-[9px] text-[#8a8f96] mb-1.5">STACK</span>
              <span className="flex items-center gap-2">
                {p.stack.map((k) => (
                  <LogoTile key={k} k={k} size={34} name={k} />
                ))}
                <MoreTile n={p.extraStack} size={34} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
