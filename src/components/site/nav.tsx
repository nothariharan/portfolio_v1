"use client";

// desktop is a quiet row phone gets a hamburger
// close the drawer before we leave so ppl dont get stuck on the next page

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContactCard } from "./contact-card";
import { useTransition } from "@/hooks/use-transition";
// phone gets the short shell

const LINKS= [
  { id: "home", label: "home", href: "/portfolio" },
  { id: "experience", label: "experience", href: "/portfolio/experience" },
  { id: "projects", label: "projects", href: "/portfolio/projects" },
  { id: "skills", label: "skills", href: "/portfolio/skills" },
  { id: "achievements", label: "awards", href: "/portfolio/achievements" },
  { id: "blog", label: "blog", href: "/portfolio/blog" },
];

export function SiteNav({ onBack, active ="home" }: { onBack: () => void; active?: string }) {
  const { startTransition }= useTransition();
  const contact =useContactCard();
  const reduce =useReducedMotion();
  const [open, setOpen]= useState(false);
  const pop =reduce
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 520, damping: 34, mass: 0.72 };

  const go =(id: string, href: string) => {
    setOpen(false);
    if (id === "home" && active === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    startTransition(href);
  };

  useEffect(() => {
    if (!open) return;
    const onKey= (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className ="sticky top-0 z-40 bg-portfolio-bg/70 backdrop-blur-md">
      {/* drawer closes on the way */}
      <nav className= "mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6 sm:px-8">
        <button onClick ={onBack} className= "group flex items-center gap-1.5 text-sm text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer" title ="Back to the trainer card">
          <span className= "transition-transform group-hover:-translate-x-0.5">◂</span>
          card
        </button>

        <div className ="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <button key= {l.id} onClick ={() => go(l.id, l.href)} className= {`relative text-sm transition-colors cursor-pointer ${
                active === l.id ? "text-portfolio-text" : "text-portfolio-muted hover:text-portfolio-text"
              }`}>
              {l.label}
              {active === l.id && (
                <span className ="absolute -bottom-1.5 left-0 right-0 mx-auto h-1 w-1 rounded-full bg-portfolio-text" />
              )}
            </button>
          ))}
        </div>

        <div className= "flex items-center gap-2">
          <button type ="button" className= "inline-flex h-9 w-9 items-center justify-center rounded-full border border-portfolio-border text-portfolio-muted transition-colors hover:border-white/25 hover:text-portfolio-text active:scale-95 sm:hidden" aria-expanded ={open} aria-controls= "mobile-nav" aria-label ={open ? "Close menu" : "Open menu"} onClick= {() => setOpen((v) => !v)}>
            <span className ="relative block h-3.5 w-4" aria-hidden>
              <span className= {`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform ${open ? "translate-y-[5.5px] rotate-45" : ""}`} />
              <span className ={`absolute left-0 top-[5.5px] h-[1.5px] w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className= {`absolute left-0 top-[11px] h-[1.5px] w-full bg-current transition-transform ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`} />
            </span>
          </button>

          {/* opens the envelope from the side instead of jumping straight into mail */}
          <button type ="button" data-contact-trigger aria-expanded= {contact.open} onClick ={() => contact.toggle()} className= "rounded-md border border-portfolio-border px-3 py-1.5 text-sm text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text cursor-pointer">
            contact
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={reduce ? false : { opacity: 0, scale: 0.92, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.96, y: -8 }}
            transition={pop}
            style={{ transformOrigin: "top right" }}
            className="origin-top-right overflow-hidden border-t border-portfolio-border/70 bg-portfolio-bg/95 px-6 py-3 sm:hidden"
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-1">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  type="button"
                  onClick={() => go(l.id, l.href)}
                  initial={reduce ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reduce ? { duration: 0.01 } : { ...pop, delay: 0.035 * i }}
                  className={`rounded-md px-3 py-2.5 text-left text-sm transition-colors cursor-pointer active:scale-[0.98] ${
                    active === l.id
                      ? "bg-portfolio-border/40 text-portfolio-text"
                      : "text-portfolio-muted hover:bg-portfolio-border/25 hover:text-portfolio-text"
                  }`}
                >
                  {l.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
