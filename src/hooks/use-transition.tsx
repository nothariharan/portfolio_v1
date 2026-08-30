"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { CardExtend } from "@/components/transition/card-extend";
import {
  estimateCardOrigin,
  getCardOrigin,
  isPortfolioPath,
  readStoredOrigin,
  showLiveCard,
  storeCardOrigin,
  type WipeState,
} from "@/hooks/wipe-utils";

interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: (url: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [wipe, setWipe] = useState<WipeState | null>(null);
  const hrefRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const pathnameRef = useRef("/");
  const router = useRouter();
  const pathname = usePathname();
  pathnameRef.current = pathname;

  const finish = useCallback(() => {
    hrefRef.current = null;
    busyRef.current = false;
    showLiveCard();
    setWipe(null);
  }, []);

  const commitNavigation = useCallback(() => {
    const href = hrefRef.current;
    if (!href) return;
    router.push(href);
  }, [router]);

  const startTransition = useCallback(
    (url: string) => {
      const path = pathnameRef.current;
      const sameWorld = isPortfolioPath(path) && isPortfolioPath(url);
      if (sameWorld) {
        router.push(url);
        return;
      }
      if (busyRef.current) return;

      if (prefersReducedMotion()) {
        router.push(url);
        return;
      }

      const goingToPortfolio = isPortfolioPath(url);
      const origin = goingToPortfolio
        ? (getCardOrigin() ?? readStoredOrigin() ?? estimateCardOrigin())
        : (readStoredOrigin() ?? getCardOrigin() ?? estimateCardOrigin());
      if (goingToPortfolio) storeCardOrigin(origin);

      busyRef.current = true;
      hrefRef.current = url;
      router.prefetch(url);
      setWipe({
        dir: goingToPortfolio ? "expand" : "collapse",
        origin,
        href: url,
      });
    },
    [router],
  );

  useEffect(() => {
    if (!wipe) return;
    const t = window.setTimeout(() => {
      const href = hrefRef.current;
      if (!href) {
        finish();
        return;
      }
      const landed = isPortfolioPath(href)
        ? isPortfolioPath(pathnameRef.current)
        : pathnameRef.current === "/";
      if (landed) finish();
      else router.push(href);
    }, 8000);
    return () => window.clearTimeout(t);
  }, [wipe, finish, router]);

  return (
    <TransitionContext.Provider
      value={{ isTransitioning: wipe !== null, startTransition }}
    >
      {children}
      <CardExtend wipe={wipe} onCommit={commitNavigation} onEnd={finish} />
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
