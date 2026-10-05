// cream teal and the rest of the stage colors
// cycle these from the color plaque on the landing

export const BG_THEMES = [
  { id: "teal", label: "TEAL", color: "#d0e8e0" },
  { id: "cream", label: "CREAM", color: "#f2e6bc" },
  { id: "sky", label: "SKY", color: "#c8dff0" },
  { id: "lilac", label: "LILAC", color: "#ddd6f3" },
  { id: "mint", label: "MINT", color: "#c5e8d4" },
  { id: "dusk", label: "DUSK", color: "#b8c4d4" },
] as const;

export type BgTheme = (typeof BG_THEMES)[number];
