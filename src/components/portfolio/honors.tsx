"use client";

import { useState } from "react";
import { HONOR_STATS, HONORS, FEATURED_HONOR, type Honor } from "./data";
import { StatTile, LogoTile, MoreTile, Mascot } from "./ui";

function BadgeIcon({ shape, size = 22 }: { shape: Honor["shape"]; size?: number }) {
  const c = size;
  switch (shape) {
    case "trophy":
      return <svg viewBox="0 0 24 24" width={c} height={c} fill="#e0a52c"><path d="M6 3h12v3a6 6 0 0 1-12 0z" /><path d="M4 4h2v2a2.5 2.5 0 0 1-2-2zM20 4h-2v2a2.5 2.5 0 0 0 2-2z" /><rect x="10.5" y="10" width="3" height="6" /><rect x="8" y="18" width="8" height="3" rx="1" /></svg>;
    case "medal":
      return <svg viewBox="0 0 24 24" width={c} height={c} fill="#8a5bc4"><path d="M8 2l2 6H6zM16 2l-2 6h4z" /><circle cx="12" cy="15" r="6" /><circle cx="12" cy="15" r="3" fill="#fff" /></svg>;
    case "shield":
      return <svg viewBox="0 0 24 24" width={c} height={c} fill="#3a7cc2"><path d="M12 2l8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5z" /><circle cx="12" cy="11" r="3" fill="#fff" /></svg>;
    case "code":
      return <svg viewBox="0 0 24 24" width={c} height={c} fill="#3f9b46"><path d="M12 2l8 5v10l-8 5-8-5V7z" /><g stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round"><polyline points="10 9 8 12 10 15" /><polyline points="14 9 16 12 14 15" /></g></svg>;
    case "cert":
      return <svg viewBox="0 0 24 24" width={c} height={c}><rect x="4" y="4" width="16" height="13" rx="1" fill="#d8d2c4" stroke="#9a937f" strokeWidth="1.5" /><rect x="7" y="7" width="10" height="1.4" fill="#9a937f" /><rect x="7" y="10" width="7" height="1.4" fill="#9a937f" /><circle cx="16" cy="16" r="4" fill="#c23a33" /></svg>;
    case "star":
      return <svg viewBox="0 0 24 24" width={c} height={c} fill="#e0a52c"><polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" /></svg>;
  }
}

const BADGE_COLOR: Record<Honor["badge"], string> = {
  Winner: "#e0a52c",
  "Runner Up": "#b07cf0",
  Finalist: "#5a9bd6",
  Contributor: "#3f9b46",
  Certificate: "#9a937f",
  Participant: "#d4524a",
};

export function HonorsSection() {
  const [sel, setSel] = useState(0);

  return (
    <div className="relative p-4 sm:p-5">
      <Mascot className="hidden lg:block absolute right-4 top-1 h-[150px] z-10" />

      <div className="flex items-start gap-2 mb-3 max-w-[58%]">
        <span className="text-[#c23a33] mt-0.5">▶</span>
        <p className="font-card text-[18px] leading-snug text-[#3a3f46]">
          Milestones earned.<br />Experiences that shaped the journey.
        </p>
      </div>

      <div className="flex gap-2 mb-4 lg:pr-[150px]">
        {HONOR_STATS.map((s) => (
          <StatTile key={s.label} value={s.value} label={s.label}>
            <BadgeIcon shape={s.icon === "trophy" ? "trophy" : s.icon === "medal" ? "medal" : s.icon === "ribbon" ? "shield" : "star"} size={20} />
          </StatTile>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {/* ACHIEVEMENTS list */}
        <div className="lg:w-[32%] rounded-[10px] p-2.5" style={{ background: "#28324a", boxShadow: "inset 0 0 0 2px #1c2438" }}>
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <span className="text-[#9fb0d0]">◉</span>
            <span className="font-pixel text-[9px] text-[#cdd7ea]">ACHIEVEMENTS</span>
          </div>
          <div className="flex flex-col gap-2">
            {HONORS.map((h, i) => {
              const on = i === sel;
              return (
                <button
                  key={h.title}
                  onClick={() => setSel(i)}
                  className="text-left rounded-[8px] p-2 flex gap-2 items-center cursor-pointer"
                  style={{ background: on ? "#f4efe0" : "#313c57", boxShadow: on ? "inset 0 0 0 2px #e0c878" : "inset 0 0 0 1px #3c486690" }}
                >
                  <span className="w-[30px] h-[30px] rounded-[6px] shrink-0 flex items-center justify-center" style={{ background: on ? "#fff" : "#1f2840" }}>
                    <BadgeIcon shape={h.shape} size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-card text-[15px] leading-none mb-1 truncate" style={{ color: on ? "#21304a" : "#dfe6f2" }}>{h.title}</span>
                    <span className="block font-card text-[12px] leading-none truncate" style={{ color: on ? "#6a7384" : "#9fadc6" }}>{h.sub}</span>
                  </span>
                  <span className="font-pixel text-[6px] px-1 py-1 rounded-[3px] text-white shrink-0" style={{ background: BADGE_COLOR[h.badge] }}>{h.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEATURED */}
        <div className="lg:flex-1 rounded-[10px] p-3" style={{ background: "#f6f1e2", boxShadow: "inset 0 0 0 2px #e3d9b8" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2"><BadgeIcon shape="trophy" size={20} /><span className="font-pixel text-[11px] text-[#34383e]">{FEATURED_HONOR.title}</span></span>
            <span className="font-pixel text-[8px] text-[#8a8f96]">{FEATURED_HONOR.event}</span>
          </div>
          {/* trophy stage art */}
          <div className="w-full h-[120px] rounded-[6px] flex items-center justify-center mb-2 relative overflow-hidden" style={{ background: "linear-gradient(180deg,#2b2350,#3a2d66)" }}>
            {["#e0524a", "#e0a52c", "#3f9b46", "#5a9bd6", "#b07cf0"].map((c, i) => (
              <span key={i} className="absolute w-1.5 h-1.5 rounded-[1px]" style={{ background: c, left: `${12 + i * 18}%`, top: `${15 + (i % 3) * 22}%` }} />
            ))}
            <BadgeIcon shape="trophy" size={64} />
          </div>
          <p className="font-card text-[15px] leading-snug text-[#454a52] mb-3">{FEATURED_HONOR.blurb}</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              ["POSITION", FEATURED_HONOR.position],
              ["DATE", FEATURED_HONOR.date],
              ["TEAM", FEATURED_HONOR.team],
              ["DURATION", FEATURED_HONOR.duration],
            ].map(([l, v]) => (
              <div key={l} className="rounded-[6px] px-2 py-1.5 bg-[#fdfbf2] shadow-[inset_0_0_0_1.5px_#e3d9b8]">
                <span className="block font-pixel text-[9px] text-[#9a937f] mb-1.5">{l}</span>
                <span className="font-card text-[14px] text-[#34383e]">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-pixel text-[7px] text-[#9a937f] w-[64px]">TECH USED:</span>
            {FEATURED_HONOR.tech.map((k) => (
              <LogoTile key={k} k={k} size={30} name={k} />
            ))}
            <MoreTile n={FEATURED_HONOR.extraTech} size={30} />
          </div>
        </div>

        {/* ALL HONORS */}
        <div className="lg:w-[28%] rounded-[10px] p-2.5" style={{ background: "#28324a", boxShadow: "inset 0 0 0 2px #1c2438" }}>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="flex items-center gap-2"><span className="text-[#9fb0d0]">◉</span><span className="font-pixel text-[9px] text-[#cdd7ea]">ALL HONORS</span></span>
          </div>
          <div className="flex flex-col gap-1.5">
            {HONORS.map((h) => (
              <div key={h.title} className="flex items-center gap-2 rounded-[6px] p-1.5" style={{ background: "#313c57" }}>
                <span className="w-[24px] h-[24px] rounded-[5px] bg-[#1f2840] flex items-center justify-center shrink-0"><BadgeIcon shape={h.shape} size={14} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-card text-[11px] leading-none text-[#dfe6f2] truncate">{h.title}</span>
                  <span className="block font-card text-[9px] leading-none text-[#9fadc6] truncate mt-0.5">{h.sub}</span>
                </span>
                <span className="font-card text-[9px] text-[#8a96b0] shrink-0">{h.date}</span>
              </div>
            ))}
            <a
              href="https://github.com/nothariharan"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 font-pixel text-[8px] text-[#cdd7ea] py-2.5 rounded-[5px] cursor-pointer text-center flex items-center justify-center gap-1.5"
              style={{ background: "#39455f", boxShadow: "inset 0 0 0 1px #4a5670" }}
            >
              VIEW ALL HONORS ▸
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
