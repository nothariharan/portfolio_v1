"use client";

import { useEffect, useState } from "react";
import { CARD_MOBILE_MAX_PX } from "@/components/card/card-layout";

/**
 * Subscribe to a CSS media query. Starts false on the server / first paint
 * so hydration stays stable, then updates after mount.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Trainer card compact / phone layout — single source in card-layout.ts */
export const CARD_MOBILE_QUERY = `(max-width: ${CARD_MOBILE_MAX_PX}px)`;

export function useCardMobileLayout() {
  return useMediaQuery(CARD_MOBILE_QUERY);
}
