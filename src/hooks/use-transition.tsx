"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { WorldWipe } from "@/components/transition/world-wipe";
import {
  armCardGrow,
  disarmWorldWipe,
  estimateCardOrigin,
  getCardOrigin,
  isPortfolioPath,
  viewportRect,
  WIPE_GROW_MS,
  type WipeState,
} from "@/hooks/wipe-utils";

export type { WipeDir, WipeRect, WipeState } from "@/hooks/wipe-utils";
export { estimateCardOrigin, getCardOrigin, isPortfolioPath, viewportRect } from "@/hooks/wipe-utils";

interface TransitionContextType {
  isTransitioning: boolean;
  wipe: WipeState | null;
  startTransition: (url: string) => void;
  commitNavigation: () => void;
  endTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [wipe, setWipe] = useState<WipeState | null>(null);
  const hrefRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const busySinceRef = useRef(0);
  const pathnameRef = useRef("/");
  const router = useRouter();
  const pathname = usePathname();
  pathnameRef.current = pathname;

  const startTransition = useCallback(
    (url: string) => {
      const path = pathnameRef.current;
      const sameWorld = isPortfolioPath(path) && isPortfolioPath(url);
      if (sameWorld) {
        router.push(url);
        return;
      }
      if (busyRef.current && Date.now() - busySinceRef.current < 2000) return;

      if (prefersReducedMotion()) {
        router.push(url);
        return;
      }

      const goingToPortfolio = isPortfolioPath(url);
      const origin = goingToPortfolio
        ? (getCardOrigin() ?? estimateCardOrigin())
        : viewportRect();

      busyRef.current = true;
      busySinceRef.current = Date.now();
      hrefRef.current = url;
      router.prefetch(url);
      if (goingToPortfolio) armCardGrow(origin);
      setWipe({
        dir: goingToPortfolio ? "expand" : "collapse",
        origin,
        href: url,
      });

      // only if the grow callback never fires — still wait for the motion
      window.setTimeout(() => {
        if (!busyRef.current) return;
        const href = hrefRef.current;
        if (!href) return;
        hrefRef.current = null;
        router.push(href);
      }, WIPE_GROW_MS + 80);
    },
    [router],
  );

  const commitNavigation = useCallback(() => {
    const href = hrefRef.current;
    if (!href) return;
    hrefRef.current = null;
    router.push(href);
  }, [router]);

  const endTransition = useCallback(() => {
    hrefRef.current = null;
    busyRef.current = false;
    disarmWorldWipe();
    setWipe(null);
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning: wipe !== null,
        wipe,
        startTransition,
        commitNavigation,
        endTransition,
      }}
    >
      {children}
      <WorldWipe wipe={wipe} onCommit={commitNavigation} onEnd={endTransition} />
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
