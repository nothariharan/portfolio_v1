import { CARD_MOBILE_MAX_PX, CARD_SHELL } from "@/components/card/card-layout";

export type WipeDir = "expand" | "collapse";
export type WipeRect = { top: number; left: number; width: number; height: number };

export type WipeState = {
  dir: WipeDir;
  origin: WipeRect;
  href: string;
};

/** Interior iris-to-black, then the card grows. Keep these in sync with CSS. */
export const INK_MS = 560;
/** Short breath on the black card so the grow doesn't kick immediately. */
export const HOLD_MS = 80;
export const GROW_MS = 1080;
export const FADE_MS = 340;
export const REVEAL_MS = 520;

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

function landingZoom(): number {
  const el = document.querySelector("[data-card-zoom]");
  if (el instanceof HTMLElement) {
    const t = getComputedStyle(el).transform;
    if (t && t !== "none") {
      const m = /matrix\(([^)]+)\)/.exec(t);
      if (m) {
        const sx = Number(m[1].split(",")[0]);
        if (Number.isFinite(sx) && sx > 0.2) return sx;
      }
    }
  }
  return window.innerWidth <= CARD_MOBILE_MAX_PX ? 1 : 1.3;
}

export function estimateCardOrigin(): WipeRect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw <= CARD_MOBILE_MAX_PX;
  const shell = mobile ? CARD_SHELL.mobile : CARD_SHELL.desktop;
  // visual face is shell + the -inset-[13px] GBA rings, then landing zoom
  const ring = 26;
  const zoom = landingZoom();
  const width = Math.min((shell.width + ring) * zoom, vw - 24);
  const height = Math.min((shell.height + ring) * zoom, vh - 24);
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

/** Kill tilt / float / 3D so the live card and the black plate share one 2D box. */
export function freezeLiveCard() {
  document.documentElement.dataset.cardFrozen = "1";
}

export function unfreezeLiveCard() {
  delete document.documentElement.dataset.cardFrozen;
}

const LIVE_INK = "data-card-live-ink";

function faceHost(): HTMLElement | null {
  const visual = document.querySelector("[data-card-visual]");
  if (visual instanceof HTMLElement) return visual;
  const inner = document.querySelector("[data-card-face-inner]");
  return inner instanceof HTMLElement ? inner : null;
}

/** Iris lives inside the live face so 3D stacking can't put panels over it. */
export function mountLiveInk(): HTMLElement | null {
  const host = faceHost();
  if (!host) return null;
  let layer = host.querySelector(`[${LIVE_INK}]`);
  if (!(layer instanceof HTMLElement)) {
    layer = document.createElement("div");
    layer.setAttribute(LIVE_INK, "");
    layer.setAttribute("aria-hidden", "true");
    const blob = document.createElement("span");
    blob.setAttribute("data-card-ink-blob", "");
    layer.appendChild(blob);
    host.appendChild(layer);
  }
  return layer;
}

export function setLiveInk(on: boolean, snap = false) {
  const layer = mountLiveInk();
  if (!layer) return false;
  layer.dataset.on = on ? "1" : "";
  layer.dataset.snap = snap ? "1" : "";
  return true;
}

/** Mount ink at rest, then open it so the CSS scale actually tweens. */
export function playLiveInk() {
  const layer = mountLiveInk();
  if (!layer) return false;
  layer.dataset.snap = "1";
  layer.dataset.on = "";
  void layer.offsetWidth;
  layer.dataset.snap = "";
  layer.dataset.on = "1";
  return true;
}

/** Cover the live face instantly (no tween) so we can show it under a full iris. */
export function coverLiveInk() {
  const layer = mountLiveInk();
  if (!layer) return false;
  layer.dataset.snap = "1";
  layer.dataset.on = "1";
  void layer.offsetWidth;
  return true;
}

/** Open the iris on the live face. */
export function openLiveInk() {
  const layer = mountLiveInk();
  if (!layer) return false;
  layer.dataset.snap = "";
  layer.dataset.on = "";
  return true;
}

export function clearLiveInk() {
  document.querySelectorAll(`[${LIVE_INK}]`).forEach((el) => el.remove());
}
