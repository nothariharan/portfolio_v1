/**
 * Shared trainer-card layout tokens.
 *
 * Keep shell sizing + the CSS media query in sync so a future glass/bg layer
 * can key off the same breakpoint without guessing.
 */

export type CardLayout = "desktop" | "mobile";

/** Matches `CARD_MOBILE_QUERY` / landing zoom breakpoint. */
export const CARD_MOBILE_MAX_PX = 720;

export const CARD_SHELL = {
  desktop: { width: 680, height: 525 },
  /** Portrait phone shell — room for 2×2 focus + currently without badge strip. */
  mobile: { width: 392, height: 600 },
} as const;

/** Cream panel chrome used by NAME / FOCUS / STACK / EXP boxes. */
export const CARD_PANEL_STYLE = {
  background: "#fdf6da",
  boxShadow: "0 0 0 2px #c9a04e, inset 0 0 0 2px #fffdf0",
} as const;

export const CARD_PINK_DIVIDER = "#e6d6a6";
