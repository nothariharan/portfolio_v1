"use client";

import type { ReactNode } from "react";

type SpriteBtnProps = {
  src: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  width: number;
  height: number;
  children?: ReactNode;
};

const imgClass = "pixelated w-full h-auto pointer-events-none block";

const pressClass =
  "cursor-pointer transition-transform duration-100 ease-out hover:-translate-y-0.5 active:translate-y-[3px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:translate-y-0";

/** Mario SNES plaque — the image is the whole button, overlays sit in the inset window. */
export function SpriteBtn({
  src,
  label,
  onClick,
  disabled,
  className,
  width,
  height,
  children,
}: SpriteBtnProps) {
  const shell = `relative block p-0 bg-transparent border-0 leading-none select-none ${className ?? ""}`;

  const body = (
    <>
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        draggable={false}
        decoding="async"
        className={imgClass}
      />
      {children}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        title={label}
        className={`${shell} ${pressClass}`}
      >
        {body}
      </button>
    );
  }

  return (
    <div role="status" aria-label={label} title={label} className={shell}>
      {body}
    </div>
  );
}
