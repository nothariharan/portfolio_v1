import { CARD_MOBILE_MAX_PX, CARD_SHELL } from "@/components/card/card-layout";

export type WipeDir = "expand" | "collapse";
export type WipeRect = { top: number; left: number; width: number; height: number };

export type WipeState = {
  dir: WipeDir;
  origin: WipeRect;
  href: string;
};

export const WIPE_GROW_MS = 780;
export const WIPE_SHRINK_MS = 660;
export const WIPE_FADE_MS = 320;

/** Scale the real card to cover the viewport — no blank cream stand-in. */
export function armCardGrow(origin: WipeRect) {
  const cover = Math.max(window.innerWidth / origin.width, window.innerHeight / origin.height);
  const root = document.documentElement;
  root.dataset.worldWipe = "expand";
  root.style.setProperty("--card-grow", String(cover));
}

export function disarmWorldWipe() {
  const root = document.documentElement;
  delete root.dataset.worldWipe;
  root.style.removeProperty("--card-grow");
}

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
  const width = Math.min(shell.width, vw - 32);
  const height = Math.min(shell.height, vh - 32);
  return {
    left: (vw - width) / 2,
    top: (vh - height) / 2,
    width,
    height,
  };
}

export function getCardOrigin(): WipeRect | null {
  const el =
    document.querySelector("[data-card-origin]") ??
    document.querySelector("[data-flip-root]");
  if (!(el instanceof HTMLElement)) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 8 || r.height < 8) return null;
  // 3d faces can inflate the union box — fall back if it's nonsense
  if (r.height > window.innerHeight * 1.4 || r.width > window.innerWidth * 1.4) {
    return estimateCardOrigin();
  }
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}
