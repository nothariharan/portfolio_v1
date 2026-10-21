"use client";

// front of the trainer card
// desktop is wide with the badge strip
// mobile is the short portrait so the hud has room

import { TRAINER_ID } from "../portfolio/data";
import {
  CARD_PANEL_STYLE,
  CARD_PINK_DIVIDER,
  type CardLayout,
} from "./card-layout";
import {
// player tucks on a phone
  BarChartIcon,
  Bullet,
  CURRENT,
  FocusGrid,
  HeaderEmblem,
  LINK_BLUE,
  QuickLink,
  SlantedSlot,
  StackRows,
  YcBadge,
} from "./card-marks";

function IdentityPanel({ layout }: { layout: CardLayout }) {
  const mobile =layout === "mobile";

  return (
    <div className= {`relative z-10 flex flex-col rounded-[8px] ${
        mobile ? "w-full gap-1 px-2 py-1.5" : "w-[70%] gap-1 px-2.5 py-1.5"
      }`} style ={CARD_PANEL_STYLE}>
      <div>
        {/* oss orgs sit under here */}
        <div className= "flex items-center gap-2 min-w-0">
          <Bullet size ={mobile ? 14 : 16} />
          <span className= {`font-pixel leading-none text-[#56618c] shrink-0 ${mobile ? "text-[10px]" : "text-[12px]"}`}>
            NAME:
          </span>
          <span className ={`font-pixel leading-none text-[#c23a33] tracking-wide ${
              mobile ? "text-[12px]" : "text-[14px] truncate"
            }`}>
            HARIHARAN
          </span>
        </div>
        <div className= "h-px mt-1.5" style ={{ background: CARD_PINK_DIVIDER }} />
      </div>

      <div>
        <div className= {`flex items-center gap-2 ${mobile ? "mb-1" : "mb-1"}`}>
          <Bullet size ={mobile ? 14 : 16} />
          <span className= {`font-pixel leading-none text-[#56618c] ${mobile ? "text-[10px]" : "text-[12px]"}`}>
            FOCUS:
          </span>
        </div>
        <FocusGrid columns ={mobile ? 2 : 4} />
        <div className= "h-px mt-1.5" style ={{ background: CARD_PINK_DIVIDER }} />
      </div>

      <div>
        <div className= {`flex items-center gap-2 ${mobile ? "mb-1" : "mb-1.5"}`}>
          <Bullet size ={mobile ? 14 : 16} />
          <span className= {`font-pixel leading-none text-[#56618c] ${mobile ? "text-[10px]" : "text-[12px]"}`}>
            STACK:
          </span>
        </div>
        <StackRows compact ={mobile} />
      </div>
    </div>
  );
}

function ExpPanel({ compact }: { compact?: boolean }) {
  return (
    <div className= {`flex items-center justify-center w-fit max-w-full ${
        compact
          ? "min-h-[32px] h-auto self-stretch gap-1.5 rounded-[7px] px-2"
          : "h-[40px] gap-2 rounded-[8px] px-3"
      }`} style ={CARD_PANEL_STYLE}>
      <span className= {`flex items-center ${compact ? "gap-1.5 translate-y-px" : "gap-2 translate-y-px"}`}>
        <Bullet size ={compact ? 14 : 17} />
        <span className= {`font-pixel leading-none text-[#56618c] shrink-0 ${
            compact ? "text-[11px]" : "text-[13px]"
          }`}>
          EXP:
        </span>
        <BarChartIcon size ={compact ? 14 : 17} />
        <span className= {`font-pixel leading-none text-[#3f9b46] whitespace-nowrap shrink-0 ${
            compact ? "text-[12px]" : "text-[14px]"
          }`}>
          1+ YEAR
        </span>
      </span>
    </div>
  );
}

function CurrentlyPanel({ layout }: { layout: CardLayout }) {
  const mobile =layout === "mobile";

  return (
    <div className= {
        mobile
          ? "relative z-10 flex-1 min-w-0 min-h-[96px] rounded-[8px] overflow-hidden pointer-events-none"
          : "absolute right-0 bottom-0 z-20 w-[62%] max-w-[420px] h-[120px] rounded-[8px] overflow-hidden pointer-events-none"
      } style ={{
        boxShadow:
          "inset 0 0 0 2px #33406b, 0 0 0 2px rgba(255,255,255,0.35), 0 8px 18px rgba(0,0,0,0.35)",
      }}>
      <img src= "/sprites/front_bg.webp" alt ="" className= "absolute inset-0 w-full h-full object-cover object-right pixelated" decoding ="async" />
      <div className= "absolute inset-0" style ={{
          background:
            "linear-gradient(90deg, rgba(9,15,26,0.96) 38%, rgba(9,15,26,0.6) 62%, rgba(9,15,26,0) 82%)",
        }} />
      <div className= {`relative z-10 h-full flex flex-col ${mobile ? "px-2 pt-1.5 pb-2" : "px-3 pt-2 pb-2.5"}`}>
        <div className ="flex items-center gap-1.5 mb-1.5">
          <Bullet size= {14} />
          <span className ="font-pixel text-[11px] leading-none text-white">CURRENTLY:</span>
          <span className= "w-[9px] h-[9px] rounded-full bg-[#46c463] ml-1 shadow-[0_0_6px_#46c463]" />
        </div>
        <div className ={`flex flex-col ${mobile ? "gap-1" : "gap-1.5"}`}>
          {CURRENT.map((c, i) => (
            <div key= {i} className ="flex items-center gap-1.5 min-w-0">
              <span className= {`${mobile ? "w-[20px] h-[20px]" : "w-[23px] h-[23px]"} shrink-0 flex items-center justify-center rounded-[3px]`} style ={{
                  background: "rgba(255,255,255,0.08)",
                  boxShadow: `inset 0 0 0 1.5px ${c.accent}66`,
                }}>
                {c.icon}
              </span>
              <span className= {`font-card leading-none text-white truncate ${mobile ? "text-[13px]" : "text-[16px]"}`}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// contact opens the center note
function CardAvatar({ layout }: { layout: CardLayout }) {
  const mobile =layout === "mobile";
  return (
    <div aria-hidden className= {
        mobile
          ? "absolute right-0 top-0 z-20 h-[210px] w-[96px] pointer-events-none"
          : "absolute right-[12px] top-[-8px] z-20 h-[290px] w-[170px] pointer-events-none"
      }>
      <span className ="absolute inset-0 drop-shadow-[2px_4px_4px_rgba(0,0,0,0.22)]">
        <img src= "/harifinal.webp" alt ="" className= "h-full w-full object-contain object-bottom pixelated select-none" draggable ={false} decoding= "async" />
      </span>
    </div>
  );
}

function CardHeader({ id, layout }: { id: string; layout: CardLayout }) {
  const mobile =layout === "mobile";

  return (
    <div className= {`relative flex items-center justify-between shrink-0 ${mobile ? "px-2 h-[40px]" : "px-3.5 h-[50px]"}`} style ={{
        background: "linear-gradient(180deg, #ec605c 0%, #df4f4c 60%, #d8453f 100%)",
        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.16)",
      }}>
      <div className= "flex items-center gap-2 min-w-0">
        <HeaderEmblem size ={mobile ? 24 : 30} />
        <span className= {`font-pixel leading-none text-white tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.22)] ${
            mobile ? "text-[13px]" : "text-[18px]"
          }`}>
          {mobile ? "DEV CARD" : "DEVELOPER CARD"}
        </span>
      </div>

      <div className ={`flex items-center shrink-0 ${mobile ? "gap-1" : "gap-1.5"}`}>
        <QuickLink href= "https://github.com/nothariharan" label ="GitHub">
          <svg viewBox= "0 0 24 24" className ="w-[13px] h-[13px]" fill= "#fff" aria-hidden>
            <path d ="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
          </svg>
        </QuickLink>
        {!mobile && (
          <QuickLink href= "https://www.linkedin.com/in/nmhariharan/" label ="LinkedIn">
            <svg viewBox= "0 0 24 24" className ="w-[13px] h-[13px]" fill= "#fff" aria-hidden>
              <path d ="M6.34 8.95H2.67V21h3.67V8.95zM4.5 3C3.12 3 2 4.12 2 5.5S3.12 8 4.5 8 7 6.88 7 5.5 5.88 3 4.5 3zM21.33 21h-3.66v-5.89c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9.8V8.95h3.51v1.65h.05c.49-.93 1.68-1.9 3.46-1.9 3.7 0 4.51 2.44 4.51 5.61V21z" />
            </svg>
          </QuickLink>
        )}
        <QuickLink href= "mailto:nmhariharanme@gmail.com" label ="Email">
          <svg viewBox= "0 0 24 24" className ="w-[13px] h-[13px]" fill= "none" aria-hidden>
            <rect x ="2.5" y= "5" width ="19" height= "14" rx ="2" fill= "#fff" />
            <path d ="M3.5 6.5 L12 13 L20.5 6.5" stroke= {LINK_BLUE} strokeWidth ="1.8" fill= "none" strokeLinecap ="round" strokeLinejoin= "round" />
          </svg>
        </QuickLink>

        <div className ={`flex items-baseline rounded-[6px] bg-[#f8edc8] ${mobile ? "gap-1 px-1.5 py-1" : "gap-1.5 px-2.5 py-1.5"}`} style= {{ boxShadow: "inset 0 0 0 1.5px rgba(90,70,20,0.25)" }}>
          <span className ={`font-pixel leading-none text-[#3a3a3a] ${mobile ? "text-[9px]" : "text-[11px]"}`}>
            IDNo.
          </span>
          <span className= {`font-pixel leading-none text-[#3a3a3a] ${mobile ? "text-[9px]" : "text-[11px]"}`}>
            {id}
          </span>
        </div>
      </div>
    </div>
  );
}

function BadgeFooter() {
  return (
    <div className ="relative z-10 h-[40px] flex items-center gap-0 px-4 py-1 shrink-0 overflow-visible" style= {{
        background: "#ead9a8",
        boxShadow: "inset 0 2px 0 #33406b, inset 0 -1px 0 rgba(0,0,0,0.08)",
      }}>
      <SlantedSlot title ="Y Combinator · Startup School" earned attachIndex= {0}>
        <YcBadge />
      </SlantedSlot>
      {Array.from({ length: 3 }).map((_, i) => (
        <SlantedSlot key ={i} title= "Badge slot — locked" attachIndex ={i + 1} />
      ))}
      <span className= "ml-auto font-pixel text-[9px] leading-none text-[#7a6a3d] tracking-wide">
        PRESS <span className ="text-[#c23a33]">A</span> TO FLIP ▸
      </span>
    </div>
  );
}

function MobileFlipBar() {
  return (
    <div className= "relative z-20 h-[28px] flex items-center justify-center shrink-0" style ={{
        background: "#ead9a8",
        boxShadow: "inset 0 2px 0 #33406b, inset 0 -1px 0 rgba(0,0,0,0.08)",
      }}>
      <span className= "font-pixel text-[9px] leading-none text-[#7a6a3d] tracking-wide">
        TAP TO FLIP ▸
      </span>
    </div>
  );
}

export function CardFront({ layout ="desktop" }: { layout?: CardLayout }) {
  const id= TRAINER_ID;
  const mobile =layout === "mobile";

  return (
    <div className= "card-surface relative w-full h-full overflow-hidden bg-[#f6ecc6] text-slate-800 select-none flex flex-col" data-layout ={layout}>
      <div className= "card-surface__backdrop absolute inset-0 pointer-events-none" aria-hidden />

      <CardHeader id ={id} layout= {layout} />

      <div className ={`relative z-10 flex-1 min-h-0 flex flex-col ${mobile ? "px-2 pt-1.5 pb-1.5" : "px-4 pt-2 pb-2"}`}>
        <CardAvatar layout= {layout} />
        <IdentityPanel layout ={layout} />

        {mobile ? (
          <div className= "relative z-30 mt-1.5 flex items-stretch gap-1.5 shrink-0">
            <ExpPanel compact />
            <CurrentlyPanel layout ="mobile" />
          </div>
        ) : (
          <>
            <CurrentlyPanel layout= "desktop" />
            <div className ="relative z-30 mt-auto mb-3 -ml-2 pt-1.5 w-fit max-w-[220px] shrink-0">
              <ExpPanel />
            </div>
          </>
        )}
      </div>

      {mobile ? <MobileFlipBar /> : <BadgeFooter />}
    </div>
  );
}
