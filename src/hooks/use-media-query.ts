"use client";

import { useEffect, useState } from "react";
import { CARD_MOBILE_MAX_PX } from "@/components/card/card-layout";
// contact opens the center note

// media query after mount so ssr doesnt flicker
// debounce so resize and rotate dont thrash
export function useMediaQuery(query: string, debounceMs= 80) {
  const [matches, setMatches] =useState(false);

  useEffect(() => {
    const mql= window.matchMedia(query);
    let timer: number | undefined;

    const apply =() => setMatches(mql.matches);
    const onChange= () => {
      window.clearTimeout(timer);
      timer =window.setTimeout(apply, debounceMs);
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

export const CARD_MOBILE_QUERY= `(max-width: ${CARD_MOBILE_MAX_PX}px)`;

export function useCardMobileLayout() {
  return useMediaQuery(CARD_MOBILE_QUERY, 90);
}
