// shell sizes and cream chrome
// keep this in sync with the 720 mobile query

export type CardLayout = "desktop" | "mobile";

export const CARD_MOBILE_MAX_PX = 720;

export const CARD_SHELL = {
  desktop: { width: 680, height: 525 },
  mobile: { width: 360, height: 512 },
} as const;

export const CARD_PANEL_STYLE = {
  background: "#fdf6da",
  boxShadow: "0 0 0 2px #c9a04e, inset 0 0 0 2px #fffdf0",
} as const;

export const CARD_PINK_DIVIDER = "#e6d6a6";
