"use client";

// data file back of the card
// four tabs and honors is the spicy one
// copy lives in portfolio data this file is mostly chrome

import { useEffect, useState } from "react";
import {
  PANELS,
  BACK_PROJECTS,
  BACK_EXPERIENCE,
  BACK_HONORS,
  BACK_SKILLS,
  type TabKey,
} from "../portfolio/data";
import type { CardLayout } from "./card-layout";
import { retroSound } from "@/lib/sound";
import { SvgIcon } from "./card-icons";
import { HonorWorldCard, HonorWorldDetail } from "./card-honors";
import {
  CREAM,
  LABEL_BLUE,
  MOBILE_TAB_LABEL,
  NAVY,
  PANEL_CREAM,
  CornerBadge,
  IconTile,
  LinkBtn,
  LogoChip,
  OpenRecordBtn,
  PanelScroll,
  ProjectThumb,
  RedCursor,
  StatusDot,
  TypePill,
  preloadCardBackAssets,
  rowStyle,
} from "./card-back-bits";

interface CardBackProps {
  layout?: CardLayout;
  onEnterPortfolio: (tab: TabKey) => void;
  onOpenHariMd: () => void;
}

export function CardBack({
  layout = "desktop",
  onEnterPortfolio,
  onOpenHariMd,
}: CardBackProps) {
  const [sel, setSel] = useState(0);
  const [honorSel, setHonorSel] = useState(0);
  const mobile = layout === "mobile";
  const active = PANELS[sel];
  const activeHonor = BACK_HONORS[honorSel] ?? BACK_HONORS[0];

  useEffect(() => {
    preloadCardBackAssets();
  }, []);

  useEffect(() => {
    const root = document.querySelector("[data-flip-root]");
    if (!(root instanceof HTMLElement)) return;

    const tabAtPoint = (x: number, y: number) => {
      const tabs = [...root.querySelectorAll<HTMLElement>('[role="tab"]')];
      if (!tabs.length) return -1;
      for (let i = 0; i < tabs.length; i++) {
        const r = tabs[i].getBoundingClientRect();
        if (x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 10 && y <= r.bottom + 10) {
          return i;
        }
      }
      const top = Math.min(...tabs.map((t) => t.getBoundingClientRect().top)) - 12;
      const bot = Math.max(...tabs.map((t) => t.getBoundingClientRect().bottom)) + 12;
      if (y < top || y > bot) return -1;
      const first = tabs[0].getBoundingClientRect();
      const last = tabs[tabs.length - 1].getBoundingClientRect();
      if (x < first.left - 16 || x > last.right + 24) return -1;
      let best = 0;
      let bestDx = Infinity;
      tabs.forEach((t, i) => {
        const r = t.getBoundingClientRect();
        const dx = Math.abs(x - (r.left + r.right) / 2);
        if (dx < bestDx) {
          bestDx = dx;
          best = i;
        }
      });
      return best;
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (root.getAttribute("aria-pressed") !== "true") return;
      const hit = tabAtPoint(e.clientX, e.clientY);
      if (hit < 0) return;
      e.stopPropagation();
      setSel((prev) => {
        if (prev !== hit) retroSound.playSelect();
        return hit;
      });
    };

    root.addEventListener("pointerdown", onDown, true);
    return () => root.removeEventListener("pointerdown", onDown, true);
  }, []);

  useEffect(() => {
    if (active.tab !== "honors") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        retroSound.playCursor();
        setHonorSel((i) => (i - 1 + BACK_HONORS.length) % BACK_HONORS.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        retroSound.playCursor();
        setHonorSel((i) => (i + 1) % BACK_HONORS.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active.tab]);

  return (
    <div className="relative w-full h-full text-slate-800 select-none flex flex-col" style={{ background: CREAM }}>
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

      {/* pokemon-style tab buttons — click to switch (no hover-switch) */}
      <div
        className={`relative z-20 flex shrink-0 ${mobile ? "gap-1 px-2.5 pt-2.5" : "gap-1.5 px-3.5 pt-3"}`}
        role="tablist"
        aria-label="Data file sections"
        data-no-flip
        style={{ touchAction: "manipulation" }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        {PANELS.map((panel, i) => {
          const on = i === sel;
          const label = mobile ? MOBILE_TAB_LABEL[panel.tab] : panel.label;
          return (
            <button
              key={panel.tab}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={panel.label}
              aria-controls={`panel-${panel.tab}`}
              id={`tab-${panel.tab}`}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.stopPropagation();
                setSel((prev) => {
                  if (prev !== i) retroSound.playSelect();
                  return i;
                });
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onMouseEnter={() => retroSound.playCursor()}
              className={`flex-1 min-w-0 font-pixel leading-none rounded-[6px] cursor-pointer border-2 transition-all duration-100 ease-out active:scale-[0.97] ${
                mobile ? "text-[8px] py-2 px-0.5" : "text-[9px] py-2.5"
              }`}
              style={
                on
                  ? {
                      background: "linear-gradient(180deg, #5b87d6 0%, #4a76c9 55%, #3f68b8 100%)",
                      color: "#fff",
                      borderColor: NAVY,
                      boxShadow: "inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.2)",
                    }
                  : {
                      background: "#fdf6dd",
                      color: "#3d5380",
                      borderColor: NAVY,
                      boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.1)",
                    }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* details box — inset rings; extra-thick top band survives 3D foreshortening */}
      <div
        className={`relative flex-1 min-h-0 mb-1.5 rounded-[8px] pb-1 flex flex-col ${
          mobile ? "mx-2.5 mt-2 pt-2 px-2" : "mx-3.5 mt-3 pt-3 px-3"
        }`}
        style={{
          background: PANEL_CREAM,
          boxShadow: `
            inset 0 3px 0 ${NAVY},
            inset 0 -2px 0 ${NAVY},
            inset 2px 0 0 ${NAVY},
            inset -2px 0 0 ${NAVY},
            inset 0 0 0 4px #fffbe8
          `,
        }}
        role="tabpanel"
        id={`panel-${active.tab}`}
        aria-labelledby={`tab-${active.tab}`}
      >
        {/* hard top edge drawn toward camera — can't vanish when the face slants */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] rounded-t-[8px]"
          style={{ background: NAVY, transform: "translateZ(2px)" }}
        />
        {/* main details — contained scroll so wheel/swipe stays in-panel */}
        <PanelScroll
          key={active.tab}
          className={`flex-1 min-h-0 p-[3px] pr-1 ${
            active.tab === "honors" ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {/* projects — No. + name + one line + link, nothing else */}
          {active.tab === "projects" && (
            <div className="flex flex-col gap-2">
              <div className={`flex flex-col ${mobile ? "gap-2.5" : "gap-2"}`}>
                {BACK_PROJECTS.map((p, i) => (
                  <div
                    key={p.name}
                    className={`group flex items-center rounded-[6px] ${
                      mobile ? "gap-2 p-2.5 pl-1.5" : "gap-1.5 p-1.5 pl-1"
                    }`}
                    style={rowStyle(p.color)}
                  >
                    {!mobile && <RedCursor />}
                    <ProjectThumb
                      icon={p.icon}
                      name={p.name}
                      color={p.color}
                      size={mobile ? 60 : 50}
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`flex items-center gap-1.5 ${mobile ? "mb-1" : "mb-[3px]"}`}>
                        <span
                          className={`font-pixel leading-none ${mobile ? "text-[8px]" : "text-[7px]"}`}
                          style={{ color: p.color }}
                        >
                          No.{String(i + 1).padStart(3, "0")}
                        </span>
                        <TypePill label={p.tag} color={p.color} />
                      </span>
                      <span
                        className={`block font-pixel leading-none text-[#2b2b2b] ${
                          mobile ? "text-[12px] mb-1" : "text-[11px] mb-[3px]"
                        }`}
                      >
                        {p.name}
                      </span>
                      <span
                        className={`block font-card leading-snug text-[#5a6068] ${
                          mobile ? "text-[14px] line-clamp-2" : "text-[13px] truncate"
                        }`}
                      >
                        {p.desc}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      {p.live && (
                        <LinkBtn href={p.live} title="Live site" size={mobile ? 32 : 30}>
                          <SvgIcon name="globe" />
                        </LinkBtn>
                      )}
                      <LinkBtn href={p.repo} title="Source" size={mobile ? 32 : 30}>
                        <SvgIcon name="github" />
                      </LinkBtn>
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterPortfolio("projects");
                }}
                className={`group font-pixel text-[#3d5380] rounded-[6px] cursor-pointer flex items-center justify-center gap-1.5 border-2 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-[0.98] active:translate-y-0 active:scale-[0.98] shrink-0 ${
                  mobile ? "text-[10px] py-2.5" : "text-[10px] py-2"
                }`}
                style={{ background: "#fdf6dd", borderColor: NAVY, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.1)" }}
              >
                <span className="text-[#c23a33] opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                MORE PROJECTS…
              </button>
            </div>
          )}

          {/* experience timeline — one 14px rail so dashes + dots share an axis */}
          {active.tab === "experience" && (
            <div className={`relative ${mobile ? "pr-0" : "pr-0.5"}`}>
              <div
                className="pointer-events-none absolute top-5 bottom-8 left-0 w-[14px]"
                aria-hidden
              >
                <span
                  className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, #c9bc8a 0 5px, transparent 5px 10px)",
                  }}
                />
              </div>
              {BACK_EXPERIENCE.map((e, i) => (
                <div
                  key={i}
                  className={`relative ${mobile ? "mb-2.5 pl-[22px]" : "mb-3 pl-[26px]"}`}
                >
                  <span
                    className={`absolute left-0 z-10 flex items-center justify-center w-[14px] ${
                      mobile ? "top-[20px] h-[14px]" : "top-[24px] h-[14px]"
                    }`}
                  >
                    <span
                      className={`rounded-full bg-white ${
                        mobile ? "w-[12px] h-[12px]" : "w-[14px] h-[14px]"
                      }`}
                      style={{ boxShadow: `inset 0 0 0 ${mobile ? 3 : 3.5}px ${e.color}` }}
                    />
                  </span>
                  <div
                    className={`group relative rounded-[8px] ${mobile ? "p-2 pl-2.5 pr-2" : "p-2.5 pl-3 pr-2"}`}
                    style={rowStyle(e.color)}
                  >
                    {!mobile && <CornerBadge badge={e.badge} />}

                    {mobile ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <IconTile color={e.color} size={34}>
                            <SvgIcon name={e.icon} color={e.color} />
                          </IconTile>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 flex-wrap mb-1">
                              <span className="font-pixel text-[8px] leading-none" style={{ color: e.color }}>
                                {e.year}
                              </span>
                              <TypePill label={e.tag} color={e.color} />
                              <StatusDot status={e.status} />
                            </div>
                            <span className="block font-pixel text-[11px] leading-snug mb-0.5 text-[#1f2430]">
                              {e.title}
                            </span>
                            <span className="block font-card text-[13px] leading-snug text-[#4a515c]">
                              {e.sub}
                            </span>
                          </div>
                        </div>
                        <div
                          className="flex items-center justify-between gap-2 pt-1.5 border-t border-dashed"
                          style={{ borderColor: "#e0d3a4" }}
                        >
                          <OpenRecordBtn href={e.url} />
                          <span className="flex items-center gap-1">
                            {e.github && (
                              <LinkBtn href={e.github} title="GitHub" size={26}>
                                <span className="scale-[0.85] flex">
                                  <SvgIcon name="github" />
                                </span>
                              </LinkBtn>
                            )}
                            <LinkBtn href={e.url} title="LinkedIn" size={26}>
                              <span className="scale-[0.85] flex">
                                <SvgIcon name="linkedin" />
                              </span>
                            </LinkBtn>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5 pr-6">
                        <RedCursor />
                        <IconTile color={e.color} size={42}>
                          <SvgIcon name={e.icon} color={e.color} />
                        </IconTile>
                        <div className="min-w-0 flex-1 pr-1">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                            <span className="font-pixel text-[9px] leading-none" style={{ color: e.color }}>
                              {e.year}
                            </span>
                            <TypePill label={e.tag} color={e.color} />
                            <StatusDot status={e.status} />
                          </div>
                          <span className="block font-pixel text-[12px] leading-snug mb-1 text-[#1f2430]">
                            {e.title}
                          </span>
                          <span className="block font-card text-[15px] leading-snug text-[#4a515c]">
                            {e.sub}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0 mt-5">
                          <OpenRecordBtn href={e.url} />
                          <span className="flex items-center gap-1.5">
                            {e.github && (
                              <LinkBtn href={e.github} title="GitHub" size={28}>
                                <span className="scale-[0.9] flex">
                                  <SvgIcon name="github" />
                                </span>
                              </LinkBtn>
                            )}
                            <LinkBtn href={e.url} title="LinkedIn" size={28}>
                              <span className="scale-[0.9] flex">
                                <SvgIcon name="linkedin" />
                              </span>
                            </LinkBtn>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className={`relative ${mobile ? "pl-[22px]" : "pl-[26px]"}`}>
                <span className="absolute left-0 top-[16px] z-10 flex w-[14px] h-[14px] items-center justify-center">
                  <span
                    className={`rounded-full ${mobile ? "w-[10px] h-[10px]" : "w-[12px] h-[12px]"}`}
                    style={{ background: PANEL_CREAM, boxShadow: "inset 0 0 0 2px #c9bc8a" }}
                  />
                </span>
                <div
                  className={`flex items-center border-2 border-dashed ${
                    mobile ? "gap-2 rounded-[8px] p-2 pl-2.5" : "gap-2.5 rounded-[10px] p-3 pl-3.5"
                  }`}
                  style={{
                    background: "rgba(255,251,233,0.65)",
                    borderColor: "#c9bc8a",
                    boxShadow: "0 4px 0 rgba(0,0,0,0.06)",
                  }}
                >
                  <IconTile color="#9aa0a8" size={mobile ? 32 : 38}>
                    <SvgIcon name="question" />
                  </IconTile>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-pixel leading-none text-[#5b6470] ${
                        mobile ? "text-[10px] mb-1" : "text-[11px] mb-1.5"
                      }`}
                    >
                      MORE TO COME...
                    </span>
                    <span
                      className={`block font-card leading-snug text-[#7a828c] ${
                        mobile ? "text-[12px]" : "text-[14px]"
                      }`}
                    >
                      Future adventures loading
                    </span>
                  </span>
                  {!mobile && (
                    <span className="flex flex-col items-center gap-1 shrink-0 max-w-[84px] text-center">
                      <span
                        className="w-[30px] h-[30px] rounded-[6px] bg-white flex items-center justify-center"
                        style={{ boxShadow: "inset 0 0 0 1.5px #d9cba0" }}
                      >
                        <SvgIcon name="lock" />
                      </span>
                      <span className="font-pixel text-[7px] leading-tight text-[#9aa0a8]">LOCKED</span>
                      <span className="font-card text-[11px] leading-tight text-[#a0a6ae]">
                        Keep leveling up to unlock.
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* honors — sticker world cards + morphing detail */}
          {active.tab === "honors" && (
            <div className={`flex flex-col h-full min-h-0 overflow-hidden ${mobile ? "gap-1.5" : "gap-2"}`}>
              <div
                className={`grid shrink-0 pt-0.5 ${
                  mobile ? "grid-cols-2 gap-2" : "grid-cols-4 gap-1.5"
                }`}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {BACK_HONORS.map((h, i) => (
                  <HonorWorldCard
                    key={h.title}
                    honor={h}
                    selected={i === honorSel}
                    onSelect={() => setHonorSel(i)}
                    mobile={mobile}
                  />
                ))}
              </div>

              <div key={activeHonor.title} className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <HonorWorldDetail
                  honor={activeHonor}
                  mobile={mobile}
                  onEnterPortfolio={onEnterPortfolio}
                />
              </div>
            </div>
          )}

          {/* skills — desktop: side labels; mobile: stacked sections + bigger grid */}
          {active.tab === "skills" &&
            (mobile ? (
              <div className="flex flex-col gap-3 py-0.5 pb-1">
                {BACK_SKILLS.map((g) => (
                  <div key={g.label} className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-pixel text-[10px] leading-none tracking-wide shrink-0"
                        style={{ color: LABEL_BLUE }}
                      >
                        {g.label}
                      </span>
                      <span className="h-px flex-1" style={{ background: "#e0d3a4" }} />
                      <span className="font-pixel text-[7px] leading-none text-[#b0a57a] tabular-nums">
                        {String(g.icons.length).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {g.icons.map((k) => (
                        <LogoChip key={k} k={k} fill />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full gap-2 py-0.5">
                {BACK_SKILLS.map((g) => (
                  <div key={g.label} className="flex items-center gap-3 min-w-0">
                    <span
                      className="font-pixel text-[10px] leading-tight w-[72px] text-right shrink-0"
                      style={{ color: LABEL_BLUE }}
                    >
                      {g.label}
                    </span>
                    <span className="flex items-center gap-2 flex-1 flex-wrap content-center">
                      {g.icons.map((k) => (
                        <LogoChip key={k} k={k} size={42} />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            ))}
        </PanelScroll>

        {/* bottom footer hint + hari.md — shared across every tab */}
        <div className="flex items-center justify-between border-t pt-1 mt-1 gap-2 shrink-0" style={{ borderColor: "#e0d3a4" }}>
          <span className="font-card text-[13px] text-[#8a7c56] leading-none">
            {active.tab === "honors"
              ? "tap a tile · ← → to browse"
              : active.tab === "experience"
                ? "scroll the records"
                : active.tab === "skills"
                  ? mobile
                    ? "skill loadout"
                    : "hover a chip for the name"
                  : "tap a row to open ↗"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenHariMd();
            }}
            className="shrink-0 font-pixel px-2.5 py-1.5 text-white text-[8px] leading-none rounded-[4px] cursor-pointer border-2 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.97]"
            style={{ background: "#111111", borderColor: NAVY, boxShadow: "inset 0 0 0 2px #2a2a2a, 0 2px 0 rgba(0,0,0,0.35)" }}
          >
            hari.md
          </button>
        </div>
      </div>
    </div>
  );
}

