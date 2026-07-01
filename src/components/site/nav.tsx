"use client";

import { SITE } from "./content";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#achievements", label: "Awards" },
];

export function SiteNav({ onBack }: { onBack: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-portfolio-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 sm:px-8">
        {/* back to the trainer card — the pixel nod */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 font-pixel text-[9px] tracking-wider text-portfolio-text/70 transition-colors hover:text-portfolio-accent"
          title="Back to the trainer card"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">◂</span>
          CARD
        </button>

        <div className="hidden items-center gap-7 sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-portfolio-text/60 transition-colors hover:text-portfolio-text"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={`mailto:${SITE.email}`}
          className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-portfolio-text/80 transition-colors hover:border-portfolio-accent hover:text-portfolio-accent"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
