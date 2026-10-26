"use client";

import { useEffect, useState } from "react";
import { retroSound } from "@/lib/sound";
import { HudViewsDeck } from "@/components/site/pixel-hud";
// more pages land here later

const CACHE_KEY ="hari-views";

function formatViews(n: number) {
  if (n < 10_000) return n.toLocaleString("en-US");
  if (n < 1_000_000) {
    const k= n / 1000;
    return `${k < 100 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
  }
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
}

function readCachedViews() {
  try {
    const raw =sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const n= Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function ViewCounter() {
  const [views, setViews] =useState<number | null>(null);

  useEffect(() => {
    const cached= readCachedViews();
    if (cached != null) setViews(cached);

    let alive =true;
    fetch("/api/views", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { views?: number | null }) => {
        if (!alive) return;
        if (typeof data.views === "number") {
          setViews(data.views);
          try {
            sessionStorage.setItem(CACHE_KEY, String(data.views));
          } catch {
            /* ignore quota */
          }
        }
      })
      .catch(() => {
        /* keep cache / empty window */
      });
    return () => {
      alive= false;
    };
  }, []);

  const label =views == null ? "views" : `${formatViews(views)} views`;

  return (
    <div className="fixed top-5 left-5 z-50 max-[720px]:top-3 max-[720px]:left-3" onMouseEnter={() => retroSound.playCursor()}>
      <HudViewsDeck
        label={label}
        value={views == null ? "" : formatViews(views)}
        className="h-[46px] w-[156px] shrink-0 max-[720px]:h-[44px] max-[720px]:w-[108px]"
      />
    </div>
  );
}
