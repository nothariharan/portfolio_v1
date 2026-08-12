"use client";

/**
 * DATA FILE — back face of the trainer card
 *
 * four tabs (projects / experience / honors / skills). honors is the spicy one:
 * four world sticker tiles on top, one simple detail card under (icon + title +
 * short highlight + 3 metrics). selection is click or ← → — do NOT scale the
 * tile on select or the grid jumps around.
 *
 * scroll / wheel / touch get stopped inside PanelScroll so the 3D card tilt
 * doesnt steal the gesture. proof links stopPropagation so a click doesnt flip.
 *
 * content lives in ../portfolio/data — this file is mostly chrome + layout.
 */

import { useEffect, useState } from "react";
import {
  PANELS,
  BACK_PROJECTS,
  BACK_EXPERIENCE,
  BACK_HONORS,
  BACK_SKILLS,
  type BackExperienceBadge,
  type BackExperienceStatus,
  type BackHonor,
  type TabKey,
} from "../portfolio/data";
import { NounIcon } from "../ui/noun-icon";
import type { CardLayout } from "./card-layout";

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
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
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
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#e0a52c">
          <path d="M13 2 4 14h7l-1 8 10-14h-7z" />
        </svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#e8913a">
          <path d="M12 2c2.8 2.2 4.5 5.4 4.8 9.2l2.2 1.4-2.4 2.4-1.4-1.1C14.4 17.3 12.8 19 11 20.2l-1.6-2.6C7.2 16.4 5.4 14 4.6 11.2L7 9.8C7.5 6 9.2 3.5 12 2z" />
          <circle cx="13.2" cy="9.2" r="1.4" fill="#fff" />
          <path d="M7.2 14.8 4 20l5.2-1.6z" fill="#c23a33" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="#9aa0a8">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#9aa0a8" strokeWidth="2.2" />
          <circle cx="12" cy="16" r="1.6" fill="#fff" />
        </svg>
      );
    case "question":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="#9aa0a8">
          <path d="M10 16h4v4h-4zm.4-11.5c2.8-.9 5.6.4 6.1 3 .4 2.1-.6 3.3-1.8 4.2-.9.7-1.5 1.2-1.5 2.3h-3.2c0-2 .9-2.8 2-3.6 1-.8 1.4-1.2 1.2-2.1-.2-.8-1-1.3-1.9-1.1-.7.2-1.1.7-1.2 1.4H7.2c.2-2.4 2-3.7 3.2-4.1z" />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="currentColor">
          <path d="M8 5v14l12-7z" />
        </svg>
      );
    case "medal":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#9b6cc4">
          <circle cx="12" cy="10" r="6" />
          <circle cx="12" cy="10" r="3" fill="#fff" opacity="0.45" />
          <path d="M8 15.5 6 22l6-3 6 3-2-6.5" fill="#c9a0e8" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#4a76c9">
          <path d="M12 2 3 9l9 13 9-13z" />
          <path d="M3 9h18" stroke="#fff" strokeWidth="1.4" opacity="0.5" />
          <path d="M12 2 8 9h8z" fill="#7aa0e0" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor">
          <circle cx="9" cy="8" r="3" />
          <circle cx="16" cy="9" r="2.4" />
          <path d="M2 19c0-3 3-5 7-5s7 2 7 5M13 19c.4-2 2.2-3.4 4.8-3.4 2 0 3.7.9 4.2 2.4" />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor">
          <rect x="3" y="10" width="18" height="11" rx="1" />
          <rect x="2" y="7" width="20" height="4" rx="1" />
          <path d="M12 7V21M12 7c-2-3-5-3-5 0M12 7c2-3 5-3 5 0" fill="none" stroke="#fff" strokeWidth="1.4" />
        </svg>
      );
    case "credit":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </svg>
      );
    case "track":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 18V8M10 18V5M16 18v-7M20 18V9" />
        </svg>
      );
    case "build":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4z" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="#3f9b46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 12 10 18 20 6" />
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

/**
 * One sticker slot in the honors grid (4-up desktop / 2×2 mobile).
 * CSS owns the hard border — PNGs are flat rect art so we dont fight letterboxing.
 * selected state is ring + brightness only (no scale) so neighbors dont reflow.
 */
function HonorWorldCard({
  honor,
  selected,
  onSelect,
  mobile = false,
}: {
  honor: BackHonor;
  selected: boolean;
  onSelect: () => void;
  mobile?: boolean;
}) {
  const fill =
    honor.world === "forest"
      ? "#2f7ad1"
      : honor.world === "garage"
        ? "#fb651e"
        : honor.world === "arena"
          ? "#c9a227"
          : "#e23b2e";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      aria-pressed={selected}
      aria-label={honor.cardTitle}
      className={`relative min-w-0 w-full overflow-hidden rounded-[6px] border-[3px] border-[#111] cursor-pointer transition-[box-shadow,filter,opacity] duration-150 ${
        mobile ? "aspect-[480/175]" : "aspect-[480/200]"
      }`}
      style={{
        background: fill,
        opacity: selected ? 1 : 0.92,
        boxShadow: selected
          ? `0 0 0 2px ${honor.color}, 0 3px 0 rgba(0,0,0,0.28)`
          : "0 2px 0 rgba(0,0,0,0.2)",
        filter: selected ? "brightness(1.04)" : undefined,
        zIndex: selected ? 1 : 0,
      }}
    >
      {/* ?v=slot2 busts old cached letterboxed exports after we swapped art */}
      <img
        src={`${honor.cardArt}?v=slot3`}
        alt=""
        className="absolute inset-0 block h-full w-full object-contain object-center pointer-events-none select-none"
        style={{ background: fill }}
        draggable={false}
      />
    </button>
  );
}

/**
 * Full-bleed honor hero card (tokens furnace, Hacktoberfest golden card, etc).
 * Top sticker tabs stay HTML; this detail is one raster asset.
 * OPEN PROOF is an invisible hit-target over the painted button.
 */
function TokensHonorDetail({ honor, mobile = false }: { honor: BackHonor; mobile?: boolean }) {
  const proofExternal = /^https?:\/\//.test(honor.url);
  const heroSrc =
    mobile && honor.heroArtMobile
      ? honor.heroArtMobile
      : honor.heroArt ?? "/honors/1b-tokens-desktop.webp";
  const cardBase = heroSrc.replace(/\.(png|webp|avif)$/i, "");
  const accent = honor.color;
  /* mobile furnace is a full painted scene — whole panel is the proof hit */
  const fullProofHit = honor.world === "furnace" && mobile;

  /* painted OPEN PROOF sits in different spots per card art */
  const proofHit =
    honor.world === "forest"
      ? mobile
        ? "top-[54%] right-[3.5%] w-[26%] min-w-[72px] max-w-[140px] aspect-[3.2/1]"
        : "top-[58%] right-[2.8%] w-[16%] min-w-[88px] max-w-[160px] aspect-[3.4/1]"
      : mobile
        ? "top-[2.8%] right-[2.2%] w-[22%] min-w-[64px] max-w-[120px] aspect-[3.4/1]"
        : "top-[3.5%] right-[2.8%] w-[17%] min-w-[72px] max-w-[150px] aspect-[3.4/1]";

  return (
    <div
      className={`relative flex-1 min-h-0 flex flex-col rounded-[10px] border-2 overflow-hidden bg-white ${
        mobile ? "rounded-[8px]" : ""
      }`}
      style={{ borderColor: accent }}
    >
      <div
        className={`relative flex-1 min-h-0 overflow-hidden bg-[#f6f1e6] ${
          mobile ? "m-1 rounded-[5px]" : "m-1.5 rounded-[7px]"
        }`}
      >
        <picture className="absolute inset-0 block h-full w-full">
          <source srcSet={`${cardBase}.avif?v=tok3`} type="image/avif" />
          <source srcSet={`${cardBase}.webp?v=tok3`} type="image/webp" />
          <img
            src={`${cardBase}.png?v=tok3`}
            alt={honor.title}
            className={`h-full w-full object-center select-none ${
              mobile && honor.world === "furnace" ? "object-cover" : "object-contain"
            }`}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </picture>

        {!honor.placeholder && (
          <a
            href={honor.url}
            {...(proofExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={(e) => e.stopPropagation()}
            aria-label="Open proof"
            title="OPEN PROOF"
            className={`absolute z-10 cursor-pointer hover:brightness-110 active:scale-[0.99] transition-transform ${
              fullProofHit ? "inset-0 rounded-[4px]" : `rounded-[4px] ${proofHit}`
            }`}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Simple honor detail — mock layout:
 * left art tile + rank · title/tag/sub · highlight (text / win-shots) · 3 metrics.
 * Mobile stacks a short art strip above the copy (no side column).
 * Tokens honor uses TokensHonorDetail instead.
 * OPEN PROOF sits as a top-right button box (not a underline link under the text).
 */
function HonorWorldDetail({ honor, mobile = false }: { honor: BackHonor; mobile?: boolean }) {
  const accent = honor.color;
  const hasWins = Boolean(honor.wins?.length);
  const hasAgents = Boolean(honor.agents?.length);
  /* full-bleed only when this layout has art: desktop needs heroArt; mobile can use heroArtMobile alone */
  const useHeroArt = mobile
    ? Boolean(honor.heroArtMobile ?? honor.heroArt)
    : Boolean(honor.heroArt);
  const proofExternal = /^https?:\/\//.test(honor.url);

  /* tokens furnace (both layouts) + mobile-only golden cards (e.g. Hacktoberfest) */
  if (hasAgents || useHeroArt) {
    return <TokensHonorDetail honor={honor} mobile={mobile} />;
  }

  const mobileArt = honor.artTileMobile ?? honor.artTile;
  /* painted rank ribbon in hero art — skip duplicate HTML rank strip */
  const mobileHeroBanner =
    mobile &&
    (honor.world === "forest" || honor.world === "garage" || honor.world === "arena");
  const heroBannerBg =
    honor.world === "garage"
      ? "#f4a15a"
      : honor.world === "arena"
        ? "#f0e2b0"
        : "#0b1a33";

  const artTile = mobile ? (
    mobileHeroBanner ? (
      <div
        className="w-full shrink-0 rounded-[7px] border overflow-hidden"
        style={{ borderColor: accent, background: heroBannerBg }}
      >
        <div className="relative w-full aspect-[2/1]">
          <picture className="absolute inset-0 block h-full w-full">
            <source
              srcSet={`${mobileArt.replace(/\.(png|webp|avif)$/i, "")}.avif?v=hero2`}
              type="image/avif"
            />
            <source
              srcSet={`${mobileArt.replace(/\.(png|webp|avif)$/i, "")}.webp?v=hero2`}
              type="image/webp"
            />
            <img
              src={`${mobileArt.replace(/\.(png|webp|avif)$/i, "")}.png?v=hero2`}
              alt=""
              className="h-full w-full object-cover object-center select-none"
              draggable={false}
            />
          </picture>
        </div>
      </div>
    ) : (
    <div
      className="w-full shrink-0 rounded-[7px] border overflow-hidden flex flex-col"
      style={{ borderColor: accent, background: honor.tint }}
    >
      <div className="relative h-[56px] bg-[#fff3c4]">
        <img
          src={`${mobileArt}?v=7`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover pixelated"
          style={{ imageRendering: "pixelated" }}
          draggable={false}
        />
      </div>
      <span
        className="flex items-center justify-center gap-1 font-pixel text-[5px] leading-none text-center py-1 px-1.5 text-white"
        style={{ background: accent }}
      >
        <NounIcon name="trophy" color="#ffffff" size={8} />
        {honor.rank}
      </span>
    </div>
    )
  ) : (
    <div
      className="shrink-0 w-[96px] rounded-[8px] border overflow-hidden flex flex-col"
      style={{ borderColor: accent, background: honor.tint }}
    >
      <div className="relative flex-1 min-h-[84px] bg-[#fff3c4]">
        <img
          src={`${honor.artTile}?v=5`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover pixelated"
          style={{ imageRendering: "pixelated" }}
          draggable={false}
        />
      </div>
      <span
        className="flex items-center justify-center gap-1 font-pixel text-[5px] leading-none text-center py-1.5 px-1 text-white"
        style={{ background: accent }}
      >
        <NounIcon name="trophy" color="#ffffff" size={9} />
        {honor.rank}
      </span>
    </div>
  );

  return (
    <div
      className="relative flex-1 min-h-0 flex flex-col rounded-[10px] border-2 overflow-hidden bg-white"
      style={{ borderColor: accent }}
    >
      <div
        className={`min-h-0 flex-1 overflow-hidden ${
          mobile ? "flex flex-col gap-2 p-2.5" : "flex gap-2.5 p-2.5"
        }`}
      >
        {artTile}

        {/* no pr-16 gutter — OPEN PROOF sits in the title row so highlight can use full width */}
        <div className={`min-w-0 flex-1 flex flex-col overflow-hidden ${mobile ? "gap-1.5" : "gap-2"}`}>
          <div className="flex items-start justify-between gap-2 shrink-0">
            <div className={`min-w-0 flex flex-col ${mobile ? "gap-1" : "gap-1"}`}>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`font-pixel leading-none ${mobile ? "text-[10px]" : "text-[11px]"}`}
                  style={{ color: accent }}
                >
                  {honor.title}
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-pixel leading-none rounded-[4px] text-white shrink-0 ${
                    mobile ? "text-[5px] px-1 py-[2px]" : "text-[6px] px-1.5 py-[3px]"
                  }`}
                  style={{ background: accent }}
                >
                  <NounIcon name={honor.tagIcon} color="#ffffff" size={mobile ? 8 : 10} />
                  {honor.tag}
                </span>
              </div>
              <span
                className={`font-card font-semibold leading-snug ${mobile ? "text-[12px]" : "text-[13px]"}`}
                style={{ color: accent }}
              >
                {honor.sub}
              </span>
            </div>
            {!honor.placeholder && (
              <a
                href={honor.url}
                {...(proofExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={(e) => e.stopPropagation()}
                className={`shrink-0 font-pixel leading-none rounded-[4px] text-white border-2 cursor-pointer hover:brightness-110 active:scale-[0.97] transition-all ${
                  mobile ? "text-[5px] px-1.5 py-1" : "text-[6px] px-2 py-1.5"
                }`}
                style={{ background: accent, borderColor: NAVY, boxShadow: "0 2px 0 rgba(0,0,0,0.2)" }}
              >
                OPEN PROOF {proofExternal ? "↗" : "→"}
              </a>
            )}
          </div>

          {hasWins ? (
            <div className="min-h-0 flex-1 flex flex-col gap-1.5 overflow-hidden">
              <div className="flex items-center gap-1.5 shrink-0">
                <NounIcon name="star" color={accent} size={mobile ? 10 : 11} />
                <span className="font-pixel text-[6px] leading-none" style={{ color: accent }}>
                  Highlights
                </span>
              </div>
              {/* app name buttons only — no screenshot embeds (unreadable at this size) */}
              <div
                className={`min-h-0 flex-1 grid content-start ${
                  mobile ? "grid-cols-2 gap-2 auto-rows-min" : "grid-cols-4 gap-2 auto-rows-min"
                }`}
              >
                {honor.wins!.map((win) => (
                  <a
                    key={win.label}
                    href={win.href}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex flex-col items-center justify-center rounded-[7px] border text-center cursor-pointer hover:brightness-[1.03] active:scale-[0.98] transition-all ${
                      mobile ? "gap-1 px-2 py-2.5 min-h-[44px]" : "gap-1 px-2 py-3 min-h-[52px]"
                    }`}
                    style={{
                      borderColor: accent,
                      background: honor.tint,
                      boxShadow: "0 2px 0 rgba(0,0,0,0.12)",
                    }}
                  >
                    <span
                      className={`font-pixel leading-none truncate max-w-full ${
                        mobile ? "text-[7px]" : "text-[8px]"
                      }`}
                      style={{ color: accent }}
                    >
                      {win.label}
                    </span>
                    <span
                      className={`font-card font-semibold leading-none text-[#1f2a44] ${
                        mobile ? "text-[11px]" : "text-[12px]"
                      }`}
                    >
                      🏆 {win.result}
                    </span>
                  </a>
                ))}
                {honor.moreWins && (
                  <a
                    href={honor.moreWins.href}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center justify-center rounded-[7px] border border-dashed text-center cursor-pointer hover:bg-[#fff8e1] active:scale-[0.98] transition-all ${
                      mobile ? "px-2 py-2.5 min-h-[44px]" : "px-2 py-3 min-h-[52px]"
                    }`}
                    style={{ borderColor: accent, color: accent }}
                  >
                    <span
                      className={`font-pixel leading-tight ${mobile ? "text-[6px]" : "text-[7px]"}`}
                    >
                      {honor.moreWins.label}
                    </span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /*
             * highlight box — CSS grid so star stays left and copy always eats
             * the remaining columns. flex + line-clamp (-webkit-box) was
             * shrinking the text to a skinny middle column with empty right space.
             */
            <div
              className={`w-full min-h-0 flex-1 rounded-[10px] border grid grid-cols-[28px_minmax(0,1fr)] items-center overflow-hidden ${
                mobile
                  ? "pl-2 pr-2.5 py-2.5 gap-x-2.5 rounded-[8px]"
                  : "pl-2.5 pr-3 py-3 gap-x-2.5"
              }`}
              style={{ background: honor.tint, borderColor: accent }}
            >
              <NounIcon
                name="star"
                color={accent}
                size={mobile ? 18 : 24}
                className="justify-self-start"
              />
              <p
                className={`min-w-0 m-0 font-card font-semibold leading-[1.4] line-clamp-3 text-left ${
                  mobile ? "text-[12px]" : "text-[14px]"
                }`}
                style={{ color: "#1f2a44" }}
              >
                {honor.highlight}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* metrics footer — fixed height so every honor card matches Hacktoberfest chrome */}
      <div
        className={`shrink-0 grid grid-cols-3 border-t ${mobile ? "h-[48px]" : "h-[54px]"}`}
        style={{ borderColor: `${accent}44` }}
      >
        {honor.metrics.map((m, i) => (
          <div
            key={m.label}
            className={`flex items-center min-w-0 h-full ${
              mobile ? "gap-1.5 px-2" : "gap-2 px-2.5"
            } ${i > 0 ? "border-l border-dashed" : ""}`}
            style={{ borderColor: `${accent}55` }}
          >
            <NounIcon name={m.icon} color={accent} size={mobile ? 13 : 17} className="shrink-0" />
            <span className="min-w-0">
              <span
                className={`block font-pixel leading-none truncate ${
                  mobile ? "text-[8px]" : "text-[10px]"
                }`}
                style={{ color: accent }}
              >
                {m.value}
              </span>
              <span
                className={`block font-pixel leading-none text-[#7a8290] truncate ${
                  mobile ? "text-[5px] mt-1" : "text-[6px] mt-1.5"
                }`}
              >
                {m.label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_META: Record<BackExperienceStatus, { color: string }> = {
  COMPLETED: { color: "#8a919c" },
  ACTIVE: { color: "#3f9b46" },
  "IN PROGRESS": { color: "#e8913a" },
};

function StatusDot({ status }: { status: BackExperienceStatus }) {
  const { color } = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      <span className="w-[6px] h-[6px] rounded-full" style={{ background: color, boxShadow: `0 0 0 1.5px ${color}44` }} />
      <span className="font-pixel text-[6px] leading-none tracking-wide" style={{ color }}>
        {status}
      </span>
    </span>
  );
}

function CornerBadge({ badge }: { badge: BackExperienceBadge }) {
  return (
    <span
      className="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-[5px] bg-white flex items-center justify-center z-10 overflow-hidden"
      style={{ boxShadow: "inset 0 0 0 1.5px #d9cba0" }}
      aria-hidden
    >
      <span className="scale-[0.7] flex">
        <SvgIcon name={badge} />
      </span>
    </span>
  );
}

function OpenRecordBtn({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Open record"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 font-pixel text-[7px] leading-none text-[#3d5380] px-1.5 py-[5px] rounded-[4px] bg-white shrink-0 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
      style={{ boxShadow: "inset 0 0 0 1.5px #d9cba0" }}
    >
      OPEN RECORD
      <SvgIcon name="play" />
    </a>
  );
}

/** Keeps wheel/touch scroll inside the panel */
function PanelScroll({
  children,
  className = "",
  axis = "y",
}: {
  children: React.ReactNode;
  className?: string;
  axis?: "y" | "x";
}) {
  return (
    <div
      className={`gba-scroll ${className}`}
      style={{
        overscrollBehavior: "contain",
        touchAction: axis === "y" ? "pan-y" : "pan-x",
        WebkitOverflowScrolling: "touch",
      }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

// white tile holding a technology logo that lifts on hover
function LogoChip({
  k,
  size = 30,
  fill,
}: {
  k: string;
  size?: number;
  /** Stretch into a CSS grid cell (mobile skills). */
  fill?: boolean;
}) {
  return (
    <span
      className={`group/chip relative rounded-[6px] bg-white flex items-center justify-center shadow-[inset_0_0_0_2px_#d9cba0] transition-transform duration-150 ease-out will-change-transform hover:z-10 hover:-translate-y-[3px] hover:scale-[1.08] hover:shadow-[inset_0_0_0_2px_#4a76c9,0_5px_10px_rgba(0,0,0,0.18)] ${
        fill ? "w-full aspect-square min-w-0" : "shrink-0"
      }`}
      style={fill ? undefined : { width: size, height: size }}
      title={k}
    >
      <img
        src={`/logos/${k}.svg`}
        alt={k}
        className={`object-contain transition-transform duration-150 group-hover/chip:scale-105 ${
          fill ? "w-[62%] h-[62%]" : ""
        }`}
        style={fill ? undefined : { width: size - 12, height: size - 12 }}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

// link button with a hover lift and click feedback
function LinkBtn({
  href,
  title,
  children,
  size = 30,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      onClick={(e) => e.stopPropagation()}
      className="rounded-[6px] bg-white flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150 ease-out will-change-transform hover:-translate-y-[3px] hover:scale-[1.12] hover:shadow-[0_5px_10px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-95 shadow-[inset_0_0_0_1.5px_#d9cba0]"
      style={{ width: size, height: size }}
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

// cream list row — inset navy ring so 3D card tilt can't clip the outer stroke
function rowStyle(color: string) {
  return {
    background: ROW_CREAM,
    boxShadow: `inset 0 0 0 2px ${NAVY_SOFT}, inset 4px 0 0 ${color}, inset 0 0 0 4px #fffef6`,
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

// project thumb — uses sprite if we have one, otherwise a letter tile
function ProjectThumb({ icon, name, color }: { icon: string; name: string; color: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <span
        className="font-pixel text-[11px] leading-none text-white"
        style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.35)" }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={`/sprites/proj_${icon}.webp`}
      alt={name}
      className="w-full h-full pixelated"
      onError={() => setOk(false)}
      style={{ background: color }}
      loading="lazy"
      decoding="async"
    />
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

/** Short tab chrome for the portrait shell — don't shrink the pixel font. */
const MOBILE_TAB_LABEL: Record<TabKey, string> = {
  projects: "PROJ",
  experience: "EXP",
  honors: "HONORS",
  skills: "SKILLS",
};

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
    if (active.tab !== "honors") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        setHonorSel((i) => (i - 1 + BACK_HONORS.length) % BACK_HONORS.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
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
        className={`flex shrink-0 ${mobile ? "gap-1 px-2.5 pt-2.5" : "gap-1.5 px-3.5 pt-3"}`}
        role="tablist"
        aria-label="Data file sections"
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
              onClick={(e) => {
                e.stopPropagation();
                setSel(i);
              }}
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
          transform: "translateZ(1px)",
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
          className={`flex-1 min-h-0 p-[3px] pr-1 animate-[fadeIn_120ms_ease-out] ${
            active.tab === "honors" ? "overflow-hidden" : "overflow-y-auto"
          }`}
          axis="y"
        >
          {/* projects — No. + name + one line + link, nothing else */}
          {active.tab === "projects" && (
            <div
              className={
                mobile
                  ? "flex flex-col justify-between h-full min-h-full gap-2"
                  : "flex flex-col gap-2"
              }
            >
              <div className={`flex flex-col ${mobile ? "gap-2.5 flex-1" : "gap-2"}`}>
                {BACK_PROJECTS.map((p, i) => (
                  <div
                    key={p.name}
                    className={`group flex items-center rounded-[6px] ${
                      mobile ? "gap-2.5 p-2.5 pl-3 flex-1 min-h-[72px]" : "gap-2 p-1.5 pl-2.5"
                    }`}
                    style={rowStyle(p.color)}
                  >
                    {!mobile && <RedCursor />}
                    <IconTile color={p.color} size={mobile ? 44 : 36}>
                      <ProjectThumb icon={p.icon} name={p.name} color={p.color} />
                    </IconTile>
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

          {/* experience timeline — desktop side-actions; mobile stacks actions under copy */}
          {active.tab === "experience" && (
            <div className={`relative ${mobile ? "pl-5 pr-0" : "pl-6 pr-0.5"}`}>
              <div
                className={`absolute top-5 bottom-10 w-0 ${mobile ? "left-[6px]" : "left-[8px]"}`}
                style={{ borderLeft: "2px dashed #c9bc8a" }}
              />
              {BACK_EXPERIENCE.map((e, i) => (
                <div key={i} className={`relative ${mobile ? "mb-2.5" : "mb-3"}`}>
                  <span
                    className={`absolute top-[22px] rounded-full bg-white z-10 ${
                      mobile ? "left-[-17px] w-[12px] h-[12px]" : "left-[-20px] top-[26px] w-[14px] h-[14px]"
                    }`}
                    style={{ boxShadow: `inset 0 0 0 ${mobile ? 3 : 3.5}px ${e.color}` }}
                  />
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

              <div className="relative">
                <span
                  className={`absolute z-10 rounded-full ${
                    mobile ? "left-[-16px] top-[16px] w-[10px] h-[10px]" : "left-[-19px] top-[20px] w-[12px] h-[12px]"
                  }`}
                  style={{ background: PANEL_CREAM, boxShadow: "inset 0 0 0 2px #c9bc8a" }}
                />
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
                <HonorWorldDetail honor={activeHonor} mobile={mobile} />
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
