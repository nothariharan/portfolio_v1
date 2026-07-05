"use client";

import { Container, Reveal, SectionHeading, LogoChip, GitHubIcon, ArrowIcon } from "./ui";
import { PROJECTS, PROJECT_META } from "../portfolio/data";
import { useTransition } from "@/hooks/use-transition";

export function Projects() {
  const { startTransition } = useTransition();

  return (
    <section id="projects" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading index="03" label="PROJECTS" title="Things I've shipped" />

        <div className="grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((p, i) => {
            const meta = PROJECT_META[p.id];
            return (
              <Reveal key={p.id} delay={(i % 2) * 0.08}>
                <article className="group relative flex h-full flex-col rounded-2xl border border-white/8 bg-portfolio-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {meta && (
                        <img
                          src={`/sprites/proj_${meta.icon}.png`}
                          alt=""
                          aria-hidden
                          className="pixelated h-11 w-11 rounded-lg"
                        />
                      )}
                      <h3 className="text-xl text-portfolio-text">{p.short}</h3>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 font-pixel text-[7px] tracking-wide"
                      style={{ color: p.color, background: `${p.color}1a` }}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-portfolio-text/65">{p.blurb}</p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      {p.stack.map((k) => (
                        <LogoChip key={k} k={k} size={28} />
                      ))}
                      {p.extraStack > 0 && (
                        <span className="flex h-7 items-center rounded-md bg-white/5 px-2 font-pixel text-[7px] text-portfolio-text/50">
                          +{p.extraStack}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-portfolio-text/60">
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.short} source`}
                        className="transition-colors hover:text-portfolio-text"
                      >
                        <GitHubIcon className="h-[18px] w-[18px]" />
                      </a>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${p.short} live`}
                          className="transition-colors hover:text-portfolio-accent"
                        >
                          <ArrowIcon className="h-[18px] w-[18px]" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <button
            onClick={() => startTransition("/portfolio/projects")}
            className="mt-10 inline-flex items-center gap-2 text-sm text-portfolio-text/60 transition-colors hover:text-portfolio-accent cursor-pointer"
          >
            View all projects <ArrowIcon />
          </button>
        </Reveal>
      </Container>
    </section>
  );
}
