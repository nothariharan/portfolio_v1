"use client";

import { useState } from "react";
import {
  EXP_STATS,
  TIMELINE,
  CURRENT_ROLE,
  KEY_ACHIEVEMENTS,
  SKILLS_GAINED,
  EDUCATION,
  type TimelineItem,
} from "./data";
import { StatTile, LogoTile, MoreTile, Mascot } from "./ui";

function TLIcon({ icon }: { icon: TimelineItem["icon"] }) {
  const common = "w-[22px] h-[22px]";
  switch (icon) {
    case "laptop":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="#cfd6df">
          <rect x="4" y="3" width="16" height="11" rx="1" />
          <rect x="6" y="5" width="12" height="7" fill="#152233" />
          <text x="12" y="10.5" textAnchor="middle" fontSize="5" fill="#5fe07a" fontFamily="monospace">{">_"}</text>
          <path d="M2 17h20l-2-3H4z" fill="#aab3bf" />
        </svg>
      );
    case "brain":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="#b07cf0">
          <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 2 4 3 3 0 0 0 3 2V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-2 4 3 3 0 0 1-3 2V4z" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="#5a9bd6" strokeWidth="2">
          <circle cx="12" cy="12" r="8.5" />
          <ellipse cx="12" cy="12" rx="3.5" ry="8.5" />
          <line x1="3.5" y1="12" x2="20.5" y2="12" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="#5fe07a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 8 5 12 9 16" />
          <polyline points="15 8 19 12 15 16" />
        </svg>
      );
    case "hands":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="#e0a52c">
          <path d="M3 12l4-3 5 3 5-3 4 3-4 4-5-2-5 2z" />
        </svg>
      );
  }
}

export function ExperienceSection() {
  const [sel, setSel] = useState(0);
  const active = TIMELINE[sel];

  return (
    <div className="relative p-4 sm:p-5">
      {/* mascot */}
      <Mascot className="hidden lg:block absolute right-4 top-2 h-[150px] z-10" />

      {/* tagline */}
      <div className="flex items-start gap-2 mb-3 max-w-[60%]">
        <span className="text-[#c23a33] mt-0.5">▶</span>
        <p className="font-card text-[18px] leading-snug text-[#3a3f46]">
          The journey so far.<br />Every step, every lesson.
        </p>
      </div>

      {/* top stats */}
      <div className="flex gap-2 mb-4 lg:pr-[150px]">
        {EXP_STATS.map((s) => (
          <StatTile key={s.label} value={s.value} label={s.label}>
            <span className="font-pixel text-[15px] text-[#3f9b46]">★</span>
          </StatTile>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* JOURNEY TIMELINE */}
        <div className="lg:w-[40%] rounded-[10px] p-3" style={{ background: "#28324a", boxShadow: "inset 0 0 0 2px #1c2438" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#9fb0d0]">◷</span>
            <span className="font-pixel text-[10px] text-[#cdd7ea]">JOURNEY TIMELINE</span>
          </div>
          <div className="flex flex-col gap-2">
            {TIMELINE.map((t, i) => {
              const on = i === sel;
              return (
                <button
                  key={i}
                  onClick={() => setSel(i)}
                  className="text-left rounded-[8px] p-2.5 flex gap-2.5 items-start cursor-pointer transition-all"
                  style={{
                    background: on ? "#eef2f8" : "#313c57",
                    boxShadow: on ? "inset 0 0 0 2px #7fb0e6" : "inset 0 0 0 1px #3c486690",
                  }}
                >
                  <span className="w-[34px] h-[34px] rounded-[6px] shrink-0 flex items-center justify-center" style={{ background: on ? "#dfe7f2" : "#1f2840" }}>
                    <TLIcon icon={t.icon} />
                  </span>
                  <span className="min-w-0">
                    {t.current ? (
                      <span className="inline-block font-pixel text-[6px] text-white bg-[#3a7cc2] px-1.5 py-1 rounded-[3px] mb-1">CURRENT</span>
                    ) : (
                      <span className="block font-pixel text-[7px] text-[#7fa8e0] mb-1">{t.period}</span>
                    )}
                    <span className="block font-card text-[16px] leading-none mb-1.5" style={{ color: on ? "#21304a" : "#dfe6f2" }}>
                      {t.title}
                    </span>
                    <span className="block font-card text-[13px] leading-tight" style={{ color: on ? "#5a6478" : "#9fadc6" }}>
                      {t.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT detail */}
        <div className="lg:flex-1 flex flex-col gap-3">
          {/* current/selected role card */}
          <div className="rounded-[10px] p-3" style={{ background: "#f1efe8", boxShadow: "inset 0 0 0 2px #d9d4ca" }}>
            <span className="inline-block font-pixel text-[9px] text-[#21304a] bg-[#a8d2f2] px-3 py-1.5 rounded-[5px] mb-3 shadow-[inset_0_0_0_2px_#5a9bd6]">
              {active.current ? "CURRENT ROLE" : "MILESTONE"}
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel text-[12px] text-[#2b2b2b]">{active.current ? CURRENT_ROLE.title : active.title.toUpperCase()}</span>
              {active.current && (
                <span className="flex items-center gap-1 font-card text-[12px] text-[#3f9b46]">
                  <span className="w-[7px] h-[7px] rounded-full bg-[#3f9b46]" /> Present
                </span>
              )}
            </div>
            <p className="font-card text-[12px] text-[#5a6cae] mb-3">{active.current ? CURRENT_ROLE.tagline : active.desc}</p>

            <div className="flex flex-col gap-1.5">
              {CURRENT_ROLE.rows.map((r) => (
                <div key={r.label} className="flex items-center gap-2">
                  <span className="font-pixel text-[10px] text-[#8a8f96] w-[88px] shrink-0">{r.label}:</span>
                  <span className="font-card text-[15px] text-[#34383e]">{r.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-pixel text-[8px] text-[#8a8f96] w-[78px] shrink-0">TECH:</span>
                <span className="flex items-center gap-1.5">
                  {CURRENT_ROLE.tech.map((k) => (
                    <LogoTile key={k} k={k} size={32} name={k} />
                  ))}
                  <MoreTile n={CURRENT_ROLE.extraTech} size={32} />
                </span>
              </div>
            </div>
          </div>

          {/* achievements + skills */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-[10px] p-3" style={{ background: "#f4f2ec", boxShadow: "inset 0 0 0 2px #ddd8cd" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#e0a52c]">🏆</span>
                <span className="font-pixel text-[9px] text-[#34383e]">KEY ACHIEVEMENTS</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {KEY_ACHIEVEMENTS.map((a) => (
                  <p key={a} className="font-card text-[14px] leading-tight text-[#4a4f57] flex gap-1.5">
                    <span className="text-[#e0a52c]">★</span> {a}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex-1 rounded-[10px] p-3" style={{ background: "#efeaf5", boxShadow: "inset 0 0 0 2px #d8cfe6" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#7e54b8]">📖</span>
                <span className="font-pixel text-[9px] text-[#34383e]">SKILLS GAINED</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {SKILLS_GAINED.map((s) => (
                  <span key={s} className="font-card text-[11px] text-[#4a4150] bg-white px-2 py-1 rounded-[4px] shadow-[inset_0_0_0_1.5px_#d3c9e2]">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[#3f9b46] text-[11px]">🎓</span>
                <span className="font-pixel text-[8px] text-[#6b6f76]">EDUCATION</span>
              </div>
              <p className="font-card text-[11px] leading-tight text-[#5a5f66]">{EDUCATION}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
