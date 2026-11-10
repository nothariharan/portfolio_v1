"use client";

// vintage windows-era pixel icons mapped to projects and work history basically
// react-old-icons sprites matched to project vibes instead of boring modern glyphs
// defaults safely to minesweeper so unknown project slugs never crash the card ( for now ig )

import type { ComponentType } from "react";
import {
  FrostAndFire,
  MicrosoftBob,
  MidtownMadness,
  Minesweeper,
  MonkeyIsland,
  SpybotSearchDestroy,
  WindowsAddressBook,
  WindowsXPCommandPrompt,
  WindowsXPMyComputer,
  WindowsXPPhone,
  WindowsXPSecurityCenter,
  WindowsVistaWindowsWebSite,
  BigMoneyDeluxe,
  ZoneAlarm,
  type OldIconProps,
} from "react-old-icons";

// project slug → retro icon. fallback to Minesweeper in ProjectOldIcon if a slug
// isnt in here, so a new project never crashes the card, just gets a minesweeper.
export const PROJECT_OLD_ICON: Record<string, ComponentType<OldIconProps>> = {
  scout: WindowsXPPhone,
  slopmark: SpybotSearchDestroy,
  certamen: Minesweeper,
  cofound: MicrosoftBob,
  monkeyspeak: MonkeyIsland,
  visor: WindowsXPMyComputer,
  vahanlive: MidtownMadness,
  gurren: WindowsXPCommandPrompt,
  mugen: WindowsXPSecurityCenter,
  continuum: WindowsAddressBook,
  phyla: ZoneAlarm,
  raksha: FrostAndFire,
};

// thin wrapper so every icon gets pixelated rendering + pointer-events none,
// keeps the sprite crisp at small sizes instead of blurring.
export function OldPixelIcon({
  Icon,
  size,
  alt,
  className,
}: {
  Icon: ComponentType<OldIconProps>;
  size: number;
  alt?: string;
  className?: string;
}) {
  return (
    <Icon
      size={size}
      alt={alt}
      className={`pointer-events-none select-none ${className ?? ""}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}

// experience row → retro icon, same vibe-matching idea as projects above.
export const EXPERIENCE_OLD_ICON = {
  stealth: WindowsXPSecurityCenter,
  webmaster: WindowsVistaWindowsWebSite,
  freelance: BigMoneyDeluxe,
} as const;

export type ExperienceOldIconName = keyof typeof EXPERIENCE_OLD_ICON;

export function ExperienceOldIcon({
  name,
  size = 32,
}: {
  name: ExperienceOldIconName;
  size?: number;
}) {
  return <OldPixelIcon Icon={EXPERIENCE_OLD_ICON[name]} size={size} alt={name} />;
}

export function ProjectOldIcon({
  icon,
  name,
  size,
  className,
}: {
  icon: string;
  name: string;
  size: number;
  className?: string;
}) {
  const Icon = PROJECT_OLD_ICON[icon] ?? Minesweeper;
  return <OldPixelIcon Icon={Icon} size={size} alt={name} className={className} />;
}
