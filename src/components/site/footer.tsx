"use client";

import { SITE } from "./content";
import { Container, GitHubIcon, LinkedInIcon, MailIcon } from "./ui";
import { useTransition } from "@/hooks/use-transition";

const social =
  "flex h-9 w-9 items-center justify-center rounded-md border border-portfolio-border text-portfolio-muted transition-colors hover:border-white/25 hover:text-portfolio-text";

export function Footer({ onBack }: { onBack: () => void }) {
  const { startTransition } = useTransition();

  return (
    <footer className="mt-6 border-t border-portfolio-border/70 py-10">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a
              href={`mailto:${SITE.email}`}
              className="text-[15px] font-semibold text-portfolio-text transition-colors hover:text-portfolio-muted"
            >
              {SITE.email}
            </a>
            <div className="mt-3 flex items-center gap-2">
              <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={social}>
                <GitHubIcon className="h-[18px] w-[18px]" />
              </a>
              <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={social}>
                <LinkedInIcon className="h-[18px] w-[18px]" />
              </a>
              <a href={`mailto:${SITE.email}`} aria-label="Email" className={social}>
                <MailIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            {/* quick links to the dedicated routes */}
            <nav className="flex flex-wrap items-center gap-4 font-mono text-[12px] text-portfolio-muted">
              <button onClick={() => startTransition("/portfolio")} className="transition-colors hover:text-portfolio-text cursor-pointer">
                portfolio
              </button>
              <button onClick={() => startTransition("/portfolio/experience")} className="transition-colors hover:text-portfolio-text cursor-pointer">
                experience
              </button>
              <button onClick={() => startTransition("/portfolio/projects")} className="transition-colors hover:text-portfolio-text cursor-pointer">
                projects
              </button>
              <button onClick={() => startTransition("/portfolio/achievements")} className="transition-colors hover:text-portfolio-text cursor-pointer">
                achievements
              </button>
              <button onClick={() => startTransition("/portfolio/blog")} className="transition-colors hover:text-portfolio-text cursor-pointer">
                blog
              </button>
            </nav>

            {/* reverse transition back to the card view */}
            <button
              onClick={onBack}
              className="group inline-flex w-fit items-center gap-2.5 rounded-md border border-portfolio-border px-4 py-2 transition-colors hover:border-white/25 cursor-pointer"
            >
              <img src="/sprites/trainer.png" alt="" aria-hidden className="pixelated h-5 w-5" />
              <span className="text-[13px] text-portfolio-muted transition-colors group-hover:text-portfolio-text">
                ◂ back to trainer card
              </span>
            </button>
          </div>
        </div>

        <p className="mt-8 font-mono text-[11px] text-portfolio-muted/70">
          © {new Date().getFullYear()} {SITE.fullName} · built with next.js + framer motion
        </p>
      </Container>
    </footer>
  );
}
