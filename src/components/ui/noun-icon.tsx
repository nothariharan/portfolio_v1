/**
 * Noun Project icons from /public/icons/noun
 *
 * Prefer pixel PNGs (mask-tinted) when present — those match the mock better.
 * Falls back to public-domain SVGs. One file, any accent color via CSS mask.
 */

import type { NounIconName } from "@/components/portfolio/data";

type NounIconProps = {
  name: NounIconName;
  color?: string;
  size?: number;
  className?: string;
  /** force png (pixel) or svg — default prefers png */
  prefer?: "png" | "svg";
};

export function NounIcon({
  name,
  color = "#33406b",
  size = 16,
  className = "",
  prefer = "png",
}: NounIconProps) {
  const src = prefer === "svg" ? `/icons/noun/${name}.svg` : `/icons/noun/${name}.png`;
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
