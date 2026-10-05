"use client";

import { NounIcon } from "../ui/noun-icon";
import { retroSound } from "@/lib/sound";
import type { BackHonor, TabKey } from "../portfolio/data";
import { NAVY } from "./card-back-bits";

// honors grid plus the detail card under it
// selected tile is a ring not a scale so the grid stays still

export function HonorWorldCard({
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
      ? "#2874e1"
      : honor.world === "garage"
        ? "#ff6014"
        : honor.world === "arena"
          ? "#fcd023"
          : "#e9342e";

  return (
    <button
      type="button"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        retroSound.playSelect();
        onSelect();
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseEnter={() => retroSound.playCursor()}
      aria-pressed={selected}
      aria-label={honor.cardTitle}
      className={`relative min-w-0 w-full overflow-hidden rounded-[6px] border-[3px] border-[#111] cursor-pointer transition-[box-shadow,filter,opacity] duration-150 ${
        mobile ? "aspect-[480/145]" : "aspect-[480/200]"
      }`}
      style={{
        background: fill,
        opacity: selected ? 1 : 0.92,
        /* ring uses sticker fill — honor.color is a different accent and looked like a mismatched halo */
        boxShadow: selected
          ? `0 0 0 2px ${fill}, 0 3px 0 rgba(0,0,0,0.28)`
          : "0 2px 0 rgba(0,0,0,0.2)",
        filter: selected ? "brightness(1.04)" : undefined,
        zIndex: selected ? 1 : 0,
      }}
    >
      {/* contain — letterbox ok if CSS fill matches baked PNG bg */}
      <img
        src={`${honor.cardArt}?v=slot5`}
        alt=""
        className="absolute inset-0 block h-full w-full object-contain object-center pointer-events-none select-none"
        style={{ background: fill }}
        draggable={false}
      />
    </button>
  );
}

export function TokensHonorDetail({ honor, mobile = false }: { honor: BackHonor; mobile?: boolean }) {
  const proofExternal = /^https?:\/\//.test(honor.url);
  const heroSrc =
    mobile && honor.heroArtMobile
      ? honor.heroArtMobile
      : honor.heroArt ?? "/honors/1b-tokens-desktop.webp";
  const cardBase = heroSrc.replace(/\.(png|webp|avif)$/i, "");
  const accent = honor.color;
  /* furnace art is decorative — no painted OPEN PROOF, so no overlay link */
  const showProofHit = !honor.placeholder && honor.world !== "furnace";

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
          <source srcSet={`${cardBase}.avif?v=tok4`} type="image/avif" />
          <source srcSet={`${cardBase}.webp?v=tok4`} type="image/webp" />
          <img
            src={`${cardBase}.png?v=tok4`}
            alt={honor.title}
            className="h-full w-full object-contain object-center select-none pointer-events-none"
            decoding="async"
            draggable={false}
          />
        </picture>

        {showProofHit && (
          <a
            href={honor.url}
            {...(proofExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            aria-label="Open proof"
            title="OPEN PROOF"
            className={`absolute z-10 cursor-pointer hover:brightness-110 active:scale-[0.99] transition-transform rounded-[4px] ${proofHit}`}
          />
        )}
      </div>
    </div>
  );
}

export function HonorWorldDetail({
  honor,
  mobile = false,
  onEnterPortfolio,
}: {
  honor: BackHonor;
  mobile?: boolean;
  onEnterPortfolio: (tab: TabKey) => void;
}) {
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
        {/* shorter strip so Highlights chips get real room on mobile */}
        <div className="relative w-full aspect-[2.55/1] max-h-[108px]">
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
              className={`h-full w-full object-cover select-none ${
                /* YC: bias down so the building crown isn't cropped */
                honor.world === "garage" ? "object-[center_18%]" : "object-center"
              }`}
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
        <div
          className={`min-w-0 flex-1 flex flex-col overflow-hidden ${
            mobile ? (hasWins ? "gap-2" : "gap-1.5") : "gap-2"
          }`}
        >
          <div className="flex items-start justify-between gap-2 shrink-0">
            <div className={`min-w-0 flex-1 flex flex-col ${mobile ? "gap-1" : "gap-1"}`}>
              {/* card font — Press Start stretches long titles when forced into a wide row */}
              <span
                className={`font-card font-bold leading-snug ${mobile ? "text-[14px]" : "text-[15px]"}`}
                style={{ color: accent }}
              >
                {honor.title}
              </span>
              <span
                className={`inline-flex w-fit items-center gap-1 font-pixel leading-none rounded-[4px] text-white shrink-0 ${
                  mobile ? "text-[5px] px-1 py-[2px]" : "text-[6px] px-1.5 py-[3px]"
                }`}
                style={{ background: accent }}
              >
                <NounIcon name={honor.tagIcon} color="#ffffff" size={mobile ? 8 : 10} />
                {honor.tag}
              </span>
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
                onPointerUp={(e) => e.stopPropagation()}
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
            <div
              className={`min-h-0 flex flex-col overflow-hidden ${
                mobile ? "shrink-0 gap-2 pt-0.5 pb-1" : "flex-1 gap-1.5 justify-center"
              }`}
            >
              <div className="flex items-center gap-1.5 shrink-0">
                <NounIcon name="star" color={accent} size={mobile ? 10 : 11} />
                <span className="font-pixel text-[6px] leading-none" style={{ color: accent }}>
                  Highlights
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterPortfolio("projects");
                }}
                onPointerUp={(e) => e.stopPropagation()}
                className={`w-full flex items-center justify-center gap-2 rounded-[8px] border-2 cursor-pointer transition-all duration-150 ease-out hover:brightness-[1.03] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                  mobile ? "min-h-[52px] px-3 py-3" : "min-h-[56px] px-4 py-3.5"
                }`}
                style={{
                  borderColor: accent,
                  background: honor.tint,
                  boxShadow: "0 2px 0 rgba(0,0,0,0.12)",
                }}
              >
                <NounIcon name="trophy" color={accent} size={mobile ? 14 : 16} />
                <span
                  className={`font-pixel leading-none ${mobile ? "text-[8px]" : "text-[9px]"}`}
                  style={{ color: accent }}
                >
                  VIEW ALL PROJECTS HERE
                </span>
                <span
                  className={`font-pixel leading-none ${mobile ? "text-[8px]" : "text-[9px]"}`}
                  style={{ color: accent }}
                  aria-hidden
                >
                  →
                </span>
              </button>
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

