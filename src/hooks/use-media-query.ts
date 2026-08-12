"use client";

import { useEffect, useState } from "react";
import { CARD_MOBILE_MAX_PX } from "@/components/card/card-layout";

/**
 * Subscribe to a CSS media query. Starts false on the server / first paint
 * so hydration stays stable, then updates after mount.
 * Short debounce coalesces rapid resize / orientation flips so layout morph
 * doesn't thrash mid-gesture.
 */
export function useMediaQuery(query: string, debounceMs = 80) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    let timer: ReturnType<typeof setTimeout> | undefined;

    const apply = () => setMatches(mql.matches);
    const onChange = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(apply, debounceMs);
    };

    apply();
    mql.addEventListener("change", onChange);
    window.addEventListener("orientationchange", onChange);
    return () => {
      window.clearTimeout(timer);
      mql.removeEventListener("change", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, [query, debounceMs]);

  return matches;
}

/** Trainer card compact / phone layout — single source in card-layout.ts */
export const CARD_MOBILE_QUERY = `(max-width: ${CARD_MOBILE_MAX_PX}px)`;

export function useCardMobileLayout() {
  return useMediaQuery(CARD_MOBILE_QUERY, 90);
}
