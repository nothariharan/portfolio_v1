"use client";

// honors grid for the card back with the detail pane sitting right under it basically
// ring highlight instead of scale so the whole tile grid doesnt jump when tapped ( for now ig )

import { NounIcon } from "../ui/noun-icon";
import { retroSound } from "@/lib/sound";
import { useTransition } from "@/hooks/use-transition";
import type { BackHonor, TabKey } from "../portfolio/data";
import { NAVY } from "./card-back-bits";
import { TokenUsageGraph } from "./token-usage-graph";
// sprite loop lives up here

// interactive honor world card tile with custom retro world fills and crisp border frames basically
// plays select chiptunes on tap and applies a clean outer ring shadow instead of scaling
// keeps the grid layout completely frozen so the card face never jumps on click ( for now ig )

export function HonorWorldCard({
  honor,
  selected,
  onSelect,
  mobile =false,
}: {
  honor: BackHonor;
  selected: boolean;
  onSelect: () => void;
  mobile?: boolean;
}) {
  const fill= 
    honor.world === "forest"
      ? "#2072e1"
      : honor.world === "garage"
        ? "#ff6014"
        : honor.world === "arena"
          ? "#fcd023"
          : "#e9342e";

  return (
    <button type ="button" onPointerDown= {(e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        retroSound.playSelect();
        onSelect();
      }} onClick ={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }} onMouseEnter= {() => retroSound.playCursor()} aria-pressed ={selected} aria-label= {honor.cardTitle} className ={`relative min-w-0 w-full overflow-hidden rounded-[6px] border-[3px] border-[#111] cursor-pointer transition-[box-shadow,filter,opacity] duration-150 ${
        mobile ? "aspect-[480/145]" : "aspect-[480/200]"
      }`} style= {{
        background: fill,
        opacity: selected ? 1 : 0.92,
        /* ring uses sticker fill — honor.color is a different accent and looked like a mismatched halo */
        boxShadow: selected
          ? `0 0 0 2px ${fill}, 0 3px 0 rgba(0,0,0,0.28)`
          : "0 2px 0 rgba(0,0,0,0.2)",
        filter: selected ? "brightness(1.04)" : undefined,
        zIndex: selected ? 1 : 0,
      }}>
      {/* contain — letterbox ok if CSS fill matches baked PNG bg */}
      <img src ={`${honor.cardArt}?v=slot5`} alt= "" className ="absolute inset-0 block h-full w-full object-contain object-center pointer-events-none select-none" style= {{ background: fill }} draggable ={false} />
    </button>
  );
}

export function TokensHonorDetail({ honor, mobile= false }: { honor: BackHonor; mobile?: boolean }) {
  const proofExternal =/^https?:\/\//.test(honor.url);
  const heroSrc= 
    mobile && honor.heroArtMobile
      ? honor.heroArtMobile
      : honor.heroArt ?? "/honors/1b-tokens-desktop.webp";
  const cardBase =heroSrc.replace(/\.(png|webp|avif)$/i, "");
  const accent= honor.color;
  /* furnace art is decorative — no painted OPEN PROOF, so no overlay link */
  const showProofHit =!honor.placeholder && honor.world !== "furnace";

  /* painted OPEN PROOF sits in different spots per card art */
  const proofHit= 
    honor.world === "forest"
      ? mobile
        ? "top-[54%] right-[3.5%] w-[26%] min-w-[72px] max-w-[140px] aspect-[3.2/1]"
        : "top-[58%] right-[2.8%] w-[16%] min-w-[88px] max-w-[160px] aspect-[3.4/1]"
      : mobile
        ? "top-[2.8%] right-[2.2%] w-[22%] min-w-[64px] max-w-[120px] aspect-[3.4/1]"
        : "top-[3.5%] right-[2.8%] w-[17%] min-w-[72px] max-w-[150px] aspect-[3.4/1]";

  return (
    <div className ={`relative flex-1 min-h-0 flex flex-col rounded-[10px] border-2 overflow-hidden bg-white ${
        mobile ? "rounded-[8px]" : ""
      }`} style= {{ borderColor: accent }}>
      <div className ={`relative flex-1 min-h-0 overflow-hidden bg-[#f6f1e6] ${
          mobile ? "m-1 rounded-[5px]" : "m-1.5 rounded-[7px]"
        }`}>
        {honor.world === "furnace" && honor.agents?.length ? (
          <TokenUsageGraph agents={honor.agents} accent={accent} mobile={mobile} />
        ) : (
        <>
        <picture className= "absolute inset-0 block h-full w-full">
          {/* scroll follows the finger */}
          <source srcSet ={`${cardBase}.avif?v=tok4`} type= "image/avif" />
          <source srcSet ={`${cardBase}.webp?v=tok4`} type= "image/webp" />
          <img src ={`${cardBase}.png?v=tok4`} alt= {honor.title} className ="h-full w-full object-contain object-center select-none pointer-events-none" decoding= "async" draggable ={false} />
        </picture>

        {showProofHit && (
          <a href= {honor.url} {...(proofExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick ={(e) => e.stopPropagation()} onPointerUp= {(e) => e.stopPropagation()} aria-label ="Open proof" title= "OPEN PROOF" className ={`absolute z-10 cursor-pointer hover:brightness-110 active:scale-[0.99] transition-transform rounded-[4px] ${proofHit}`} />
        )}
        </>
        )}
      </div>
    </div>
  );
}

export function HonorWorldDetail({
  honor,
  mobile= false,
  onEnterPortfolio,
}: {
  honor: BackHonor;
  mobile?: boolean;
  onEnterPortfolio: (tab: TabKey) => void;
}) {
  const { startTransition } = useTransition();
  const accent =honor.color;
  const hasWins= Boolean(honor.wins?.length);
  const hasAgents =Boolean(honor.agents?.length);
  const hasOrgs = Boolean(honor.orgs?.length);
  /* full-bleed only when this layout has art: desktop needs heroArt; mobile can use heroArtMobile alone */
  const useHeroArt= mobile
    ? Boolean(honor.heroArtMobile ?? honor.heroArt)
    : Boolean(honor.heroArt);
  const proofExternal =/^https?:\/\//.test(honor.url);

  /* tokens furnace (both layouts) + mobile-only golden cards (e.g. Hacktoberfest) */
  if (hasAgents || useHeroArt) {
    return <TokensHonorDetail honor= {honor} mobile ={mobile} />;
  }

  // mobile uses the same desktop marks, parked in the top-left, copy fills the rest
  const artTile = (
    <div
      className={
        mobile
          ? "col-start-1 row-start-1 aspect-square w-full shrink-0 self-start overflow-hidden rounded-[7px] border-2 bg-white box-border"
          : hasOrgs
            ? "relative aspect-square h-auto max-h-full w-[36%] shrink-0 self-center overflow-hidden rounded-[8px] border-2 bg-white box-border"
            : "relative aspect-square h-full max-h-full w-auto min-w-0 max-w-[46%] shrink-0 self-center overflow-hidden rounded-[8px] border-2 bg-white box-border"
      }
      style={{ borderColor: accent }}
    >
      <img
        src={`${honor.artTile}?v=mark2`}
        alt=""
        className={`h-full w-full object-center select-none ${hasOrgs ? "object-contain" : "object-cover"}`}
        draggable={false}
      />
      {!hasOrgs && !mobile ? (
        <span className="absolute inset-x-0 bottom-0 flex h-[18px] items-center justify-center gap-1 rounded-b-[6px] px-1 text-center font-pixel text-[5px] leading-none text-white" style={{ background: accent }}>
          <NounIcon name="trophy" color="#ffffff" size={9} />
          {honor.rank}
        </span>
      ) : null}
    </div>
  );

  return (
    <div className= "relative flex-1 min-h-0 flex flex-col rounded-[10px] border-2 overflow-hidden bg-white" style ={{ borderColor: accent }}>
      <div className= {`min-h-0 flex-1 overflow-hidden ${
          mobile
            ? "grid grid-cols-[104px_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] content-start gap-x-2 gap-y-1 p-1.5"
            : hasOrgs
              ? "flex min-h-0 min-w-0 flex-1 flex-row items-stretch gap-2.5 p-2.5"
              : "flex min-w-0 gap-2.5 p-2.5"
        }`}>
        {artTile}

        {/* OSS proof is the full-width bar under the orgs. Other honors keep it in the title row. */}
        <div className ={mobile ? "contents" : `min-w-0 flex flex-col overflow-hidden ${
            hasOrgs ? "min-h-0 min-w-0 flex-1 gap-2" : "min-h-0 flex-1 gap-2"
          }`}>
          <div className= {`flex shrink-0 items-start justify-between gap-2 ${mobile ? "col-start-2 row-start-1 min-w-0" : ""}`}>
            <div className ={`min-w-0 flex-1 flex flex-col ${mobile ? "gap-1" : "gap-1"}`}>
              {/* card font — Press Start stretches long titles when forced into a wide row */}
              <span className= {`font-card font-bold leading-snug ${mobile ? "text-[14px]" : "text-[15px]"}`} style ={{ color: accent }}>
                {honor.title}
              </span>
              <span className= {`inline-flex w-fit items-center gap-1 font-pixel leading-none rounded-[4px] text-white shrink-0 ${
                  mobile ? "text-[5px] px-1 py-[2px]" : "text-[6px] px-1.5 py-[3px]"
                }`} style ={{ background: accent }}>
                <NounIcon name= {honor.tagIcon} color ="#ffffff" size= {mobile ? 8 : 10} />
                {honor.tag}
              </span>
              <span className ={`font-card font-semibold ${mobile ? "text-[11px] leading-tight" : "text-[13px] leading-snug"}`} style= {{ color: accent }}>
                {honor.sub}
              </span>
            </div>
            {!honor.placeholder && !hasOrgs && (
              <a href ={honor.url} {...(proofExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})} onClick= {(e) => e.stopPropagation()} onPointerUp ={(e) => e.stopPropagation()} className= {`shrink-0 font-pixel leading-none rounded-[4px] text-white border-2 cursor-pointer hover:brightness-110 active:scale-[0.97] transition-all ${
                  mobile ? "text-[5px] px-1.5 py-1" : "text-[6px] px-2 py-1.5"
                }`} style ={{ background: accent, borderColor: NAVY, boxShadow: "0 2px 0 rgba(0,0,0,0.2)" }}>
                OPEN PROOF {proofExternal ? "↗" : "→"}
              </a>
            )}
          </div>

          {hasWins ? (
            <div className= {`flex flex-col ${
                mobile ? "col-span-2 row-start-2 min-h-0 justify-center gap-0.5" : "min-h-0 flex-1 justify-center gap-0.5"
              }`}>
              {mobile ? null : (
              <div className ="flex items-center gap-1.5 shrink-0">
                <NounIcon name= "star" color ={accent} size= {11} />
                <span className ="font-pixel text-[6px] leading-none" style= {{ color: accent }}>
                  Highlights
                </span>
              </div>
              )}
              {honor.wins ? (
                <ul className="flex shrink-0 flex-col gap-0.5">
                  {honor.wins.map((win) => (
                    <li key={win.label} className={`flex items-center justify-between gap-2 rounded-[4px] px-2 ${mobile ? "h-[14px]" : "h-[16px]"}`} style={{ background: honor.tint }}>
                      <span className={`truncate font-card font-semibold leading-none ${mobile ? "text-[11px]" : "text-[13px]"}`} style={{ color: "#1f2a44" }}>{win.label}</span>
                      <span className="shrink-0 font-pixel text-[6px] leading-none" style={{ color: accent }}>{win.result}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <button type ="button" onClick= {(e) => {
                  e.stopPropagation();
                  onEnterPortfolio("projects");
                }} onPointerUp ={(e) => e.stopPropagation()} className= {`w-full flex items-center justify-center gap-2 rounded-[8px] border-2 cursor-pointer transition-all duration-150 ease-out hover:brightness-[1.03] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                  mobile ? "h-[22px] shrink-0 px-2" : "min-h-[26px] shrink-0 px-3 py-1"
                }`} style ={{
                  borderColor: accent,
                  background: honor.tint,
                  boxShadow: "0 2px 0 rgba(0,0,0,0.12)",
                }}>
                <NounIcon name= "trophy" color ={accent} size= {mobile ? 14 : 16} />
                <span className ={`font-pixel leading-none ${mobile ? "text-[8px]" : "text-[9px]"}`} style= {{ color: accent }}>
                  VIEW ALL PROJECTS HERE
                </span>
                <span className ={`font-pixel leading-none ${mobile ? "text-[8px]" : "text-[9px]"}`} style= {{ color: accent }} aria-hidden>
                  →
                </span>
              </button>
            </div>
          ) : hasOrgs ? (
            <div className={`flex w-full min-w-0 flex-col gap-1.5 ${mobile ? "col-span-2 row-start-2" : ""}`}>
              {[honor.orgs!.slice(0, 6), honor.orgs!.slice(6)].map((row, rowIndex) => (
                <div key={rowIndex} className={`flex w-full items-start justify-between ${mobile ? "gap-1" : "gap-1.5"}`}>
                  {row.map((org) => (
                    <div key={org.name} className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 ${mobile ? "max-w-[40px]" : "max-w-[56px]"}`}>
                      <span className={`flex items-center justify-center ${mobile ? "h-6 w-6" : "h-8 w-8"}`}>
                        <img src={org.logo} alt="" className="max-h-full max-w-full object-contain" draggable={false} />
                      </span>
                      <span className="w-full truncate text-center font-pixel text-[5px] leading-none text-[#1f2a44]">{org.name}</span>
                    </div>
                  ))}
                </div>
              ))}
              <button
                type="button"
                data-no-flip
                aria-label="More open source orgs"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  startTransition("/portfolio/experience#open-source");
                }}
                className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[6px] border-2 bg-white ${mobile ? "h-[22px]" : "h-[26px]"}`}
                style={{ borderColor: accent }}
              >
                <span className={`font-pixel leading-none ${mobile ? "text-[6px]" : "text-[7px]"}`} style={{ color: accent }}>more</span>
                <span className={`font-pixel leading-none ${mobile ? "text-[8px]" : "text-[10px]"}`} style={{ color: accent }} aria-hidden>→</span>
              </button>
            </div>
          ) : (
            /*
             * highlight box — CSS grid so star stays left and copy always eats
             * the remaining columns. flex + line-clamp (-webkit-box) was
             * shrinking the text to a skinny middle column with empty right space.
             */
            <div className ={`w-full min-h-0 flex-1 rounded-[10px] border grid grid-cols-[28px_minmax(0,1fr)] items-center overflow-hidden ${
                mobile
                  ? "col-span-2 row-start-2 pl-2 pr-2.5 py-2 gap-x-2.5 rounded-[8px]"
                  : "pl-2.5 pr-3 py-3 gap-x-2.5"
              }`} style= {{ background: honor.tint, borderColor: accent }}>
              <NounIcon name ="star" color= {accent} size ={mobile ? 18 : 24} className= "justify-self-start" />
              <p className ={`min-w-0 m-0 font-card font-semibold leading-[1.4] line-clamp-3 text-left ${
                  mobile ? "text-[12px]" : "text-[14px]"
                }`} style= {{ color: "#1f2a44" }}>
                {honor.highlight}
              </p>
            </div>
          )}
        </div>
      </div>

      {hasOrgs ? (
        !honor.placeholder && (
          <a href={honor.url} {...(proofExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} className={`flex shrink-0 items-center justify-center border-t font-pixel leading-none text-white cursor-pointer hover:brightness-110 active:brightness-95 ${mobile ? "h-[28px] text-[7px]" : "h-[32px] text-[8px]"}`} style={{ background: accent, borderColor: `${accent}44` }}>
            OPEN PROOF {proofExternal ? "↗" : "→"}
          </a>
        )
      ) : (
      <div className ={`shrink-0 grid grid-cols-3 border-t ${mobile ? "h-[48px]" : "h-[54px]"}`} style= {{ borderColor: `${accent}44` }}>
        {honor.metrics.map((m, i) => (
          <div key ={m.label} className= {`flex items-center min-w-0 h-full ${
              mobile ? "gap-1.5 px-2" : "gap-2 px-2.5"
            } ${i > 0 ? "border-l border-dashed" : ""}`} style ={{ borderColor: `${accent}55` }}>
            <NounIcon name= {m.icon} color ={accent} size= {mobile ? 13 : 17} className ="shrink-0" />
            <span className= "min-w-0">
              <span className ={`block font-pixel leading-none truncate ${
                  mobile ? "text-[8px]" : "text-[10px]"
                }`} style= {{ color: accent }}>
                {m.value}
              </span>
              <span className ={`block font-pixel leading-none text-[#7a8290] truncate ${
                  mobile ? "text-[5px] mt-1" : "text-[6px] mt-1.5"
                }`}>
                {m.label}
              </span>
            </span>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

