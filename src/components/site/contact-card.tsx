"use client";

// small envelope that slides in from the right when u hit contact
// github linkedin x youtube and the gmail live in the slots so mailto isnt the whole move

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCardMobileLayout } from "@/hooks/use-media-query";
import { SITE } from "./content";
import { GitHubIcon, LinkedInIcon, MailIcon, XIcon, YouTubeIcon } from "./ui";
// oss orgs sit under here

type ContactApi= {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const ContactCtx =createContext<ContactApi | null>(null);

export function useContactCard() {
  const ctx= useContext(ContactCtx);
  if (!ctx) throw new Error("contact card is only inside the portfolio layout");
  return ctx;
}

const SLOTS =[
  { id: "github", label: "github", href: SITE.socials.github, icon: GitHubIcon },
  { id: "linkedin", label: "linkedin", href: SITE.socials.linkedin, icon: LinkedInIcon },
  { id: "x", label: "x", href: SITE.socials.x, icon: XIcon },
  { id: "youtube", label: "youtube", href: SITE.socials.youtube, icon: YouTubeIcon },
] as const;

function Envelope({ onClose, note }: { onClose: () => void; note?: boolean }) {
  return (
    <div data-contact-card role= "dialog" aria-label ="contact" className= "w-[280px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-portfolio-border bg-portfolio-card/95 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-md">
      {/* dont let a swipe flip */}
      {/* flap so it actually reads as an envelope and not just another panel */}
      <div className ="relative h-9 border-b border-portfolio-border/80 bg-white/[0.03]">
        <span aria-hidden className= "absolute inset-x-3 top-0 h-9 bg-white/[0.06]" style ={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        <button type= "button" onClick ={onClose} aria-label= "close contact" className ="absolute right-2 top-1.5 flex h-6 w-6 items-center justify-center rounded-md text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer">
          ×
        </button>
      </div>

      {note && (
        <p className= "px-3 pt-3 font-mono text-[11px] leading-relaxed text-portfolio-muted">
          hey — the links are right here
        </p>
      )}

      <div className ="flex flex-col gap-2 p-3">
        <a href= {`mailto:${SITE.email}`} className ="flex items-center gap-2.5 rounded-lg border border-portfolio-border px-3 py-2.5 text-portfolio-text transition-colors hover:border-white/25">
          <MailIcon className= "h-4 w-4 shrink-0 text-portfolio-muted" />
          <span className ="min-w-0 truncate font-mono text-[11px]">{SITE.email}</span>
        </a>

        <div className= "grid grid-cols-2 gap-2">
          {SLOTS.map((slot) => (
            <a key ={slot.id} href= {slot.href} target ="_blank" rel= "noopener noreferrer" className ="flex items-center gap-2 rounded-lg border border-portfolio-border px-3 py-2.5 text-[13px] text-portfolio-text transition-colors hover:border-white/25">
              <slot.icon className= "h-4 w-4 shrink-0 text-portfolio-muted" />
              {slot.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactCardProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] =useState(false);
  const reduce= useReducedMotion();
  // phone has no side edge so the note sits in the middle instead
  const mobile =useCardMobileLayout();

  useEffect(() => {
    if (!open) return;
    const onKey= (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown =(e: PointerEvent) => {
      const t= e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("[data-contact-card]")) return;
      if (t.closest("[data-contact-trigger]")) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <ContactCtx.Provider value ={{
        open,
        toggle: () => setOpen((v) => !v),
        close: () => setOpen(false),
      }}>
      {children}
      <AnimatePresence>
        {open &&
          (mobile ? (
            <motion.div key= "envelope-note" initial ={reduce ? false : { opacity: 0 }} animate= {{ opacity: 1 }} exit ={reduce ? undefined : { opacity: 0 }} transition= {{ duration: 0.2 }} className ="fixed inset-0 z-50 flex items-center justify-center px-6">
              <button type= "button" aria-label ="close contact" className= "absolute inset-0 bg-black/55 cursor-pointer" onClick ={() => setOpen(false)} />
              <motion.div initial= {reduce ? false : { opacity: 0, y: 10, scale: 0.96 }} animate ={{ opacity: 1, y: 0, scale: 1 }} exit= {reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }} transition ={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} className= "relative">
                <Envelope note onClose ={() => setOpen(false)} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key= "envelope" initial ={reduce ? false : { x: 36, opacity: 0 }} animate= {{ x: 0, opacity: 1 }} exit ={reduce ? undefined : { x: 28, opacity: 0 }} transition= {{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className ="fixed top-20 right-4 z-50">
              <Envelope onClose= {() => setOpen(false)} />
            </motion.div>
          ))}
      </AnimatePresence>
    </ContactCtx.Provider>
  );
}
