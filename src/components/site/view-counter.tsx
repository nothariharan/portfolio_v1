"use client";

import { useEffect, useState } from "react";
import { retroSound } from "@/lib/sound";
import { SpriteBtn } from "@/components/site/hud-sprite-button";

function formatViews(n: number) {
  if (n < 10_000) return n.toLocaleString("en-US");
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k < 100 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
  }
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
}

export function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/views")
      .then((r) => r.json())
      .then((data: { views?: number | null }) => {
        if (!alive) return;
        if (typeof data.views === "number") setViews(data.views);
      })
      .catch(() => {
        /* window stays empty */
      });
    return () => {
      alive = false;
    };
  }, []);

  const label = views == null ? "views" : `${formatViews(views)} views`;

  return (
    <div className="fixed top-5 left-5 z-50 max-[720px]:top-3 max-[720px]:left-3" onMouseEnter={() => retroSound.playCursor()}>
      <SpriteBtn
        src="/ui/btn-views.webp"
        label={label}
        width={360}
        height={132}
        className="w-[156px] max-[720px]:w-[124px]"
      >
        {/* navy score window starts after the eye (~35/33/10/30) */}
        <span
          className="absolute left-[36%] top-[32%] right-[11%] bottom-[33%] flex items-center justify-center font-pixel leading-none text-white tabular-nums text-[13px] max-[720px]:text-[10px] -translate-y-px"
          style={{
            textShadow: "2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 2px 2px #000",
          }}
        >
          {views == null ? "—" : formatViews(views)}
        </span>
      </SpriteBtn>
    </div>
  );
}
