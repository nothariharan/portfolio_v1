"use client";

/**
 * Portfolio site nav — desktop is a quiet link row, phone gets a hamburger
 * drawer (sm:hidden). Escape closes it. going to a route always collapses first
 * so ppl dont get stuck with the menu open over the next page.
 */

import { useEffect, useState } from "react";
import { SITE } from "./content";
import { useTransition } from "@/hooks/use-transition";

const LINKS = [
  { id: "home", label: "home", href: "/portfolio" },
  { id: "experience", label: "experience", href: "/portfolio/experience" },
  { id: "projects", label: "projects", href: "/portfolio/projects" },
  { id: "skills", label: "skills", href: "/portfolio/skills" },
  { id: "achievements", label: "awards", href: "/portfolio/achievements" },
  { id: "blog", label: "blog", href: "/portfolio/blog" },
];

export function SiteNav({ onBack, active = "home" }: { onBack: () => void; active?: string }) {
  const { startTransition } = useTransition();
  const [open, setOpen] = useState(false);

  const go = (id: string, href: string) => {
    setOpen(false);
    if (id === "home" && active === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    startTransition(href);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-portfolio-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6 sm:px-8">
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 text-sm text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer"
          title="Back to the trainer card"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">◂</span>
          card
        </button>

        <div className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id, l.href)}
              className={`relative text-sm transition-colors cursor-pointer ${
                active === l.id ? "text-portfolio-text" : "text-portfolio-muted hover:text-portfolio-text"
              }`}
            >
              {l.label}
              {active === l.id && (
                <span className="absolute -bottom-1.5 left-0 right-0 mx-auto h-1 w-1 rounded-full bg-portfolio-text" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-portfolio-border text-portfolio-muted transition-colors hover:border-white/25 hover:text-portfolio-text sm:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-4" aria-hidden>
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[5.5px] h-[1.5px] w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[11px] h-[1.5px] w-full bg-current transition-transform ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>

          <a
            href={`mailto:${SITE.email}`}
            className="rounded-md border border-portfolio-border px-3 py-1.5 text-sm text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text"
          >
            contact
          </a>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-portfolio-border/70 bg-portfolio-bg/95 px-6 py-3 sm:hidden"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-1">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id, l.href)}
                className={`rounded-md px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                  active === l.id
                    ? "bg-portfolio-border/40 text-portfolio-text"
                    : "text-portfolio-muted hover:bg-portfolio-border/25 hover:text-portfolio-text"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
