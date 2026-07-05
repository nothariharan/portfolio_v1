"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// contract for transition coordinates
interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: (url: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

// provider to wrap root layout
export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // reset transition state when route successfully changes
  useEffect(() => {
    if (isTransitioning) {
      // wait for fadeout transition
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // trigger flash, navigate at peak flash, then pathname changes
  function startTransition(url: string) {
    setIsTransitioning(true);
    
    setTimeout(() => {
      router.push(url);
    }, 350);
  }

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

// custom hook to access context easily
export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
