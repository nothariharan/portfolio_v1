"use client";

import { SITE } from "./content";
import { Container, GitHubIcon, LinkedInIcon, MailIcon } from "./ui";

export function Footer({ onBack }: { onBack: () => void }) {
  return (
    <footer className="border-t border-white/8 py-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-pixel text-[9px] tracking-wider text-portfolio-accent">
              LET&apos;S BUILD SOMETHING
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 block font-serif text-3xl text-portfolio-text transition-colors hover:text-portfolio-accent sm:text-4xl"
            >
              {SITE.email}
            </a>

            <div className="mt-6 flex items-center gap-3 text-portfolio-text/60">
              <a
                href={SITE.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-portfolio-accent"
              >
                <GitHubIcon />
              </a>
              <a
                href={SITE.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-portfolio-accent"
              >
                <LinkedInIcon />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="transition-colors hover:text-portfolio-accent"
              >
                <MailIcon />
              </a>
            </div>
          </div>

          {/* reverse transition back to the card view */}
          <button
            onClick={onBack}
            className="group flex items-center gap-3 rounded-full border border-white/12 px-5 py-3 transition-colors hover:border-portfolio-accent"
          >
            <img src="/sprites/trainer.png" alt="" aria-hidden className="pixelated h-6 w-6" />
            <span className="font-pixel text-[9px] tracking-wider text-portfolio-text/80 transition-colors group-hover:text-portfolio-accent">
              ◂ BACK TO TRAINER CARD
            </span>
          </button>
        </div>

        <p className="mt-14 font-pixel text-[8px] leading-relaxed tracking-wider text-portfolio-text/30">
          {SITE.fullName.toUpperCase()} · BUILT WITH NEXT.JS + FRAMER MOTION
        </p>
      </Container>
    </footer>
  );
}
