"use client";

import { useState } from "react";
import {
  SKILL_STATS,
  SKILL_CATEGORIES,
  LANGUAGES,
  PROFICIENCY,
  CURRENTLY_LEARNING,
  SKILL_RADAR,
  SKILL_STATS_FOOTER,
} from "./data";
import { StatTile, LogoTile, SegBar, Stars, Mascot } from "./ui";

// pentagon radar chart
function Radar() {
  const cx = 90, cy = 86, R = 62;
  const n = SKILL_RADAR.length;
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const ring = (f: number) => SKILL_RADAR.map((_, i) => pt(i, R * f).join(",")).join(" ");
  const data = SKILL_RADAR.map((s, i) => pt(i, R * s.value).join(",")).join(" ");
  return (
    <svg viewBox="0 0 180 180" className="w-full h-[150px]">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ring(f)} fill="none" stroke="#c9bfe0" strokeWidth="1" />
      ))}
      {SKILL_RADAR.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#c9bfe0" strokeWidth="1" />;
      })}
      <polygon points={data} fill="#7e54b855" stroke="#7e54b8" strokeWidth="2" />
      {SKILL_RADAR.map((s, i) => {
        const [x, y] = pt(i, R * s.value);
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#7e54b8" />;
      })}
      {SKILL_RADAR.map((s, i) => {
        const [x, y] = pt(i, R + 16);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="7" fill="#6b6f76" fontFamily="monospace">
            {s.axis.split("\n").map((line, li) => (
              <tspan key={li} x={x} dy={li === 0 ? 0 : 8}>{line}</tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

function LearnIcon({ k }: { k: string }) {
  if (k === "kubernetes") return <LogoTile k="kubernetes" size={34} name="Kubernetes" />;
  const label = k === "langgraph" ? "LG" : k === "agents" ? "AI" : "SD";
  return (
    <div className="w-[34px] h-[34px] rounded-[5px] bg-white flex items-center justify-center shadow-[inset_0_0_0_2px_#2c2c2c]">
      <span className="font-pixel text-[9px] text-[#7e54b8]">{label}</span>
    </div>
  );
}

export function SkillsSection() {
  const [cat, setCat] = useState(0);

  return (
    <div className="relative p-4 sm:p-5">
      <Mascot className="hidden lg:block absolute right-4 top-1 h-[150px] z-10" />

      <div className="flex items-start gap-2 mb-3 max-w-[55%]">
        <span className="text-[#c23a33] mt-0.5">▶</span>
        <p className="font-card text-[18px] leading-snug text-[#3a3f46]">
          Tools in my belt.<br />Power in my code.
        </p>
      </div>

      <div className="flex gap-2 mb-4 lg:pr-[150px]">
        {SKILL_STATS.map((s) => (
          <StatTile key={s.label} value={s.value} label={s.label}>
            <span className="text-[14px]">{s.icon === "code" ? "💻" : s.icon === "tools" ? "🛠️" : s.icon === "book" ? "📘" : "⚡"}</span>
          </StatTile>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {/* categories sidebar */}
        <div className="lg:w-[26%] rounded-[10px] p-2.5" style={{ background: "#28324a", boxShadow: "inset 0 0 0 2px #1c2438" }}>
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <span className="text-[#9fb0d0]">🗂</span>
            <span className="font-pixel text-[9px] text-[#cdd7ea]">SKILL CATEGORIES</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {SKILL_CATEGORIES.map((c, i) => {
              const on = i === cat;
              return (
                <button
                  key={c.key}
                  onClick={() => setCat(i)}
                  className="text-left rounded-[8px] p-2 flex gap-2 items-start cursor-pointer"
                  style={{ background: on ? c.color : "#313c57", boxShadow: on ? "inset 0 0 0 2px rgba(255,255,255,0.3)" : "inset 0 0 0 1px #3c486690" }}
                >
                  <span className="w-[26px] h-[26px] rounded-[5px] shrink-0 flex items-center justify-center font-pixel text-[8px] text-white" style={{ background: on ? "rgba(0,0,0,0.2)" : c.color }}>
                    {c.name[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-pixel text-[7px] leading-none mb-1" style={{ color: on ? "#fff" : "#dfe6f2" }}>{c.name}</span>
                    <span className="block font-card text-[10px] leading-tight" style={{ color: on ? "rgba(255,255,255,0.85)" : "#9fadc6" }}>{c.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* main */}
        <div className="lg:flex-1 flex flex-col gap-3 min-w-0">
          {/* languages */}
          <div className="rounded-[10px] p-3" style={{ background: "#f0ecf6", boxShadow: "inset 0 0 0 2px #d8cfe6" }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-pixel text-[10px] text-[#5a3f86] flex items-center gap-2">{"</>"} LANGUAGES</span>
              <span className="font-pixel text-[7px] text-[#9a90ad]">TOTAL: {LANGUAGES.length}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {LANGUAGES.map((l) => (
                <div key={l.name} className="rounded-[7px] p-2 flex flex-col items-center gap-1.5 bg-[#f7f4fb] shadow-[inset_0_0_0_1.5px_#dcd3e8]">
                  <LogoTile k={l.key} size={40} name={l.name} />
                  <span className="font-card text-[12px] text-[#4a4150] leading-none">{l.name}</span>
                  <Stars n={l.stars} />
                </div>
              ))}
            </div>
          </div>

          {/* proficiency + radar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-[10px] p-3" style={{ background: "#f0ecf6", boxShadow: "inset 0 0 0 2px #d8cfe6" }}>
              <span className="font-pixel text-[9px] text-[#5a3f86] block mb-2.5">PROFICIENCY OVERVIEW</span>
              <div className="flex flex-col gap-2">
                {PROFICIENCY.map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <span className="font-card text-[13px] text-[#4a4f57] w-[140px] shrink-0 truncate">{p.name}</span>
                    <span className="flex-1"><SegBar color={p.color} pct={p.pct} total={14} light /></span>
                    <span className="font-pixel text-[10px] w-[34px] text-right" style={{ color: p.color }}>{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sm:w-[210px] rounded-[10px] p-2" style={{ background: "#f0ecf6", boxShadow: "inset 0 0 0 2px #d8cfe6" }}>
              <span className="font-pixel text-[9px] text-[#5a3f86] block mb-1 text-center">SKILL RADAR</span>
              <Radar />
            </div>
          </div>

          {/* currently learning + stats */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-[10px] p-3" style={{ background: "#f0ecf6", boxShadow: "inset 0 0 0 2px #d8cfe6" }}>
              <span className="font-pixel text-[9px] text-[#5a3f86] block mb-2.5">📖 CURRENTLY LEARNING</span>
              <div className="flex gap-2">
                {CURRENTLY_LEARNING.map((c) => (
                  <div key={c.name} className="flex-1 rounded-[7px] p-2 flex flex-col items-center gap-1.5 bg-[#f7f4fb] shadow-[inset_0_0_0_1.5px_#dcd3e8]">
                    <LearnIcon k={c.key} />
                    <span className="font-card text-[9px] text-[#4a4150] leading-tight text-center h-[22px] flex items-center">{c.name}</span>
                    <span className="w-full"><SegBar color="#7e54b8" pct={c.pct} total={8} light /></span>
                    <span className="font-pixel text-[7px] text-[#7e54b8]">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sm:w-[230px] rounded-[10px] p-3" style={{ background: "#f4f2ec", boxShadow: "inset 0 0 0 2px #ddd8cd" }}>
              <span className="font-pixel text-[9px] text-[#34383e] block mb-2.5">STATS</span>
              <div className="flex flex-col gap-2">
                {SKILL_STATS_FOOTER.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-[12px]">{s.icon === "trophy" ? "🏆" : s.icon === "github" ? "🐙" : s.icon === "code" ? "{ }" : "≡"}</span>
                    <span className="font-card text-[14px] text-[#4a4f57] flex-1">{s.label}</span>
                    <span className="font-pixel text-[11px] text-[#3f9b46]">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
