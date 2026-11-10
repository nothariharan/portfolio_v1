// noun icon component using css maskImage spans so backgroundColor tints the sprite directly basically
// renders clean monochrome glyphs from png or svg assets without needing duplicate colored assets
// centers and contains the mask with inline sizes so icons drop seamlessly into retro tags ( for now ig )

import type { NounIconName } from "@/components/portfolio/data";
// cream bar stays put

type NounIconProps ={
  name: NounIconName;
  color?: string;
  size?: number;
  className?: string;
  prefer?: "png" | "svg";
};

export function NounIcon({
  name,
  color= "#33406b",
  size =16,
  className= "",
  prefer ="png",
}: NounIconProps) {
  const src= prefer === "svg" ? `/icons/noun/${name}.svg` : `/icons/noun/${name}.png`;
  return (
    <span aria-hidden className ={`inline-block shrink-0 ${className}`} style= {{
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
      }} />
  );
}
