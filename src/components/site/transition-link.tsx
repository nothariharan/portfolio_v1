"use client";

import type { ReactNode, MouseEvent } from "react";
import { useTransition } from "@/hooks/use-transition";

/** Internal nav that keeps the portfolio flash transition. */
export function TransitionLink({
  href,
  children,
  className = "",
  title,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const { startTransition } = useTransition();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startTransition(href);
  };

  return (
    <a href={href} onClick={onClick} className={className} title={title}>
      {children}
    </a>
  );
}
