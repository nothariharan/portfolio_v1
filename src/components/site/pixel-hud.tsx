"use client";

import type { ReactNode } from "react";

function HudSprite({ src, className }: { src: string; className: string }) {
  return (
    <img
      src={src}
      alt=""
      className={`hud-icon pointer-events-none shrink-0 select-none pixelated ${className}`}
      draggable={false}
    />
  );
}

type HudTone = "primary" | "success" | "warning" | "error" | "orange" | "default";

type HudBtnProps = {
  label: string;
  tone: HudTone;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

function HudBtn({
  label,
  tone,
  onClick,
  disabled,
  className,
  children,
}: HudBtnProps) {
  const cls = `hud-btn ${className ?? ""}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        title={label}
        data-tone={tone}
        className={cls}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      role="status"
      aria-label={label}
      title={label}
      data-tone={tone}
      data-static=""
      className={cls}
    >
      {children}
    </div>
  );
}

function PixelIcon({
  children,
  size = 16,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <svg
      className="hud-icon"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function PlusMark() {
  return (
    <PixelIcon size={38}>
      <rect x="6" y="1" width="4" height="14" fill="currentColor" />
      <rect x="1" y="6" width="14" height="4" fill="currentColor" />
    </PixelIcon>
  );
}

function MinusMark() {
  return (
    <PixelIcon size={38}>
      <rect x="1" y="6" width="14" height="4" fill="currentColor" />
    </PixelIcon>
  );
}

function SkipMark() {
  return (
    <PixelIcon size={20}>
      <path d="M1 2h3v12H1V2zm4 0 7 6-7 6V2zm8 0h3v12h-3V2z" fill="currentColor" />
    </PixelIcon>
  );
}

function SpeakerMark({ muted }: { muted: boolean }) {
  return (
    <PixelIcon size={40}>
      <rect x="1" y="6" width="3" height="4" fill="currentColor" />
      <rect x="4" y="4" width="3" height="8" fill="currentColor" />
      <rect x="7" y="2" width="3" height="12" fill="currentColor" />
      {muted ? (
        <>
          <rect x="11" y="4" width="2" height="2" fill="#8c2022" />
          <rect x="12" y="5" width="2" height="2" fill="#8c2022" />
          <rect x="13" y="6" width="2" height="2" fill="#8c2022" />
          <rect x="12" y="7" width="2" height="2" fill="#8c2022" />
          <rect x="11" y="8" width="2" height="2" fill="#8c2022" />
          <rect x="12" y="9" width="2" height="2" fill="#8c2022" />
          <rect x="13" y="10" width="2" height="2" fill="#8c2022" />
        </>
      ) : (
        <>
          <rect x="11" y="4" width="2" height="2" fill="currentColor" />
          <rect x="13" y="3" width="2" height="2" fill="currentColor" />
          <rect x="12" y="7" width="2" height="2" fill="currentColor" />
          <rect x="11" y="10" width="2" height="2" fill="currentColor" />
          <rect x="13" y="11" width="2" height="2" fill="currentColor" />
        </>
      )}
    </PixelIcon>
  );
}

const KIRBY_COLORS = ["transparent", "#000000", "#ffaccc", "#ff5478"] as const;
const KIRBY = [
  [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0],
  [1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
  [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 0],
  [1, 2, 2, 2, 3, 3, 2, 2, 2, 3, 3, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 1],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 1],
  [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 1],
  [0, 1, 3, 3, 1, 1, 2, 2, 2, 1, 3, 3, 3, 3, 1, 0],
  [1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
] as const;

function KirbyMark() {
  return (
    <svg
      className="hud-icon h-9 w-9 shrink-0 max-[720px]:h-8 max-[720px]:w-8"
      viewBox="0 0 16 16"
      aria-hidden
    >
      {KIRBY.flatMap((row, y) =>
        row.map((cell, x) =>
          cell === 0 ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={KIRBY_COLORS[cell]}
            />
          ),
        ),
      )}
    </svg>
  );
}

export function HudZoomOut(props: {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <HudBtn label="decrease size" tone="warning" {...props}>
      <MinusMark />
    </HudBtn>
  );
}

export function HudZoomIn(props: {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <HudBtn label="increase size" tone="warning" {...props}>
      <PlusMark />
    </HudBtn>
  );
}

export function HudMute({
  muted,
  label,
  onClick,
  className,
}: {
  muted: boolean;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <HudBtn
      label={label}
      tone={muted ? "default" : "primary"}
      onClick={onClick}
      className={className}
    >
      <SpeakerMark muted={muted} />
    </HudBtn>
  );
}

export function HudSkipSong({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <HudBtn label={label} tone="orange" onClick={onClick} className={className}>
      <span className="flex items-center justify-center gap-1 px-0.5 max-[720px]:gap-0.5">
        <SkipMark />
        <span className="hud-type text-[12px] leading-none tracking-normal max-[720px]:text-[9px]">
          <span className="max-[720px]:hidden">SKIP SONG</span>
          <span className="hidden max-[720px]:inline">SKIP</span>
        </span>
      </span>
    </HudBtn>
  );
}

export function HudPortfolio({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <HudBtn label="open main portfolio" tone="error" onClick={onClick} className={className}>
      <span className="flex w-full items-center justify-center px-1">
        <span className="hud-type whitespace-nowrap text-[14px] leading-none tracking-normal max-[720px]:text-[10px]">
          <span className="max-[720px]:hidden">MAIN PORTFOLIO</span>
          <span className="hidden max-[720px]:inline">PORTFOLIO</span>
        </span>
      </span>
    </HudBtn>
  );
}

export function HudColorDeck({
  color,
  onClick,
  className,
}: {
  color: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <HudBtn
      label="switch background color"
      tone="success"
      onClick={onClick}
      className={className}
    >
      <span className="flex w-full items-center gap-2 max-[720px]:gap-1">
        <HudSprite src="/hud/palette.png" className="h-8 w-8 max-[720px]:h-[22px] max-[720px]:w-[22px]" />
        <span className="hud-lcd h-[26px] flex-1 max-[720px]:h-[18px]">
          <span className="absolute inset-[3px] max-[720px]:inset-[2px]" style={{ background: color }} />
        </span>
      </span>
    </HudBtn>
  );
}

export function HudViewsDeck({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <HudBtn label={label} tone="warning" className={className}>
      <span className="flex w-full items-center gap-2 max-[720px]:gap-1">
        <KirbyMark />
        <span className="hud-lcd h-[26px] flex-1 max-[720px]:h-[18px]">
          <span className="hud-type relative z-[1] text-[15px] leading-none tabular-nums text-white max-[720px]:text-[11px]">
            {value}
          </span>
        </span>
      </span>
    </HudBtn>
  );
}
