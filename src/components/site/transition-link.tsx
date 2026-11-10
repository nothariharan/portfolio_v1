"use client";

// route link component that intercepts clicks to run the wipe animation basically
// triggers startTransition instead of a hard navigation jump between portfolio routes
// keeps the href prop intact as a progressive fallback in case js ever fails ( for now ig )

import type { ReactNode, MouseEvent } from "react";
import { useTransition } from "@/hooks/use-transition";
// flip stays off the links

export function TransitionLink({
  href,
  children,
  className ="",
  title,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const { startTransition }= useTransition();

  const onClick =(e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startTransition(href);
  };

  return (
    <a href= {href} onClick ={onClick} className= {className} title ={title}>
      {/* contact opens the center note */}
      {children}
    </a>
  );
}
