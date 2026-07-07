"use client";

import { useEffect, useState } from "react";
import { SITE } from "./content";

const LINKS = [
  { id: "about", label: "home" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "achievements", label: "awards" },
];

export function SiteNav({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState("about");

  // scrollspy — highlight the section currently in view
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the section whose top sits nearest just below the sticky header
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-portfolio-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6 sm:px-8">
        {/* back to the trainer card — the pixel nod */}
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
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`relative text-sm transition-colors ${
                active === l.id ? "text-portfolio-text" : "text-portfolio-muted hover:text-portfolio-text"
              }`}
            >
              {l.label}
              {active === l.id && (
                <span className="absolute -bottom-1.5 left-0 right-0 mx-auto h-1 w-1 rounded-full bg-portfolio-text" />
              )}
            </a>
          ))}
        </div>

        <a
          href={`mailto:${SITE.email}`}
          className="rounded-md border border-portfolio-border px-3 py-1.5 text-sm text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text"
        >
          contact
        </a>
      </nav>
    </header>
  );
}
