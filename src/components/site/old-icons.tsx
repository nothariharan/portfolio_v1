"use client";

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
