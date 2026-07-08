"use client";

import { SITE } from "./content";
import { useTransition } from "@/hooks/use-transition";

const LINKS = [
  { id: "home", label: "home", href: "/portfolio" },
  { id: "experience", label: "experience", href: "/portfolio/experience" },
  { id: "projects", label: "projects", href: "/portfolio/projects" },
  { id: "skills", label: "skills", href: "/portfolio/skills" },
  { id: "achievements", label: "awards", href: "/portfolio/achievements" },
];

export function SiteNav({ onBack, active = "home" }: { onBack: () => void; active?: string }) {
  const { startTransition } = useTransition();

  const go = (id: string, href: string) => {
    if (id === "home" && active === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    startTransition(href);
  };

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
