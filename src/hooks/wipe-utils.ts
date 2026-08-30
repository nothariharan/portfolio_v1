import { CARD_MOBILE_MAX_PX, CARD_SHELL } from "@/components/card/card-layout";

export type WipeDir = "expand" | "collapse";
export type WipeRect = { top: number; left: number; width: number; height: number };

export type WipeState = {
  dir: WipeDir;
  origin: WipeRect;
  href: string;
};

/** Interior iris-to-black, then the card grows. Keep these in sync with CSS. */
export const INK_MS = 440;
/** Beat on the black card at original size before it grows / after it lands. */
export const HOLD_MS = 160;
export const GROW_MS = 820;
export const FADE_MS = 260;
export const REVEAL_MS = 400;

export function coverScale(origin: WipeRect): number {
  const cx = origin.left + origin.width / 2;
  const cy = origin.top + origin.height / 2;
  const hw = Math.max(origin.width / 2, 1);
  const hh = Math.max(origin.height / 2, 1);
  const sx = Math.max(cx / hw, (window.innerWidth - cx) / hw);
  const sy = Math.max(cy / hh, (window.innerHeight - cy) / hh);
  return Math.max(sx, sy) * 1.04;
}

const ORIGIN_KEY = "card-origin";

export function isPortfolioPath(path: string) {
  const clean = path.split("?")[0].split("#")[0];
  return clean === "/portfolio" || clean.startsWith("/portfolio/");
}

export function viewportRect(): WipeRect {
  return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
}

export function estimateCardOrigin(): WipeRect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw <= CARD_MOBILE_MAX_PX;
  const shell = mobile ? CARD_SHELL.mobile : CARD_SHELL.desktop;
  // visual face is shell + the -inset-[13px] GBA rings
  const ring = 26;
  const width = Math.min(shell.width + ring, vw - 24);
  const height = Math.min(shell.height + ring, vh - 24);
  return {
    left: (vw - width) / 2,
    top: (vh - height) / 2,
    width,
    height,
  };
}

export function getCardOrigin(): WipeRect | null {
  const visual = document.querySelector("[data-card-visual]");
  if (visual instanceof HTMLElement) {
    const r = visual.getBoundingClientRect();
    if (
      r.width >= 8 &&
      r.height >= 8 &&
      r.height < window.innerHeight * 1.35 &&
      r.width < window.innerWidth * 1.35
    ) {
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    }
  }
  const shell = document.querySelector("[data-card-origin]");
  if (shell instanceof HTMLElement) {
    const r = shell.getBoundingClientRect();
    if (r.width >= 8 && r.height >= 8) {
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    }
  }
  return null;
}

export function storeCardOrigin(rect: WipeRect) {
  try {
    sessionStorage.setItem(ORIGIN_KEY, JSON.stringify(rect));
  } catch {
    /* private mode */
  }
}

export function readStoredOrigin(): WipeRect | null {
  try {
    const raw = sessionStorage.getItem(ORIGIN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WipeRect;
    if (
      typeof parsed.top !== "number" ||
      typeof parsed.left !== "number" ||
      typeof parsed.width !== "number" ||
      typeof parsed.height !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function hideLiveCard() {
  document.documentElement.dataset.cardExtending = "1";
}

export function showLiveCard() {
  delete document.documentElement.dataset.cardExtending;
}
