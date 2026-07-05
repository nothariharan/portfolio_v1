"use client";

import { useEffect } from "react";
import { Container, Reveal, LogoChip, GitHubIcon, ArrowIcon } from "@/components/site/ui";
import { PROJECTS, PROJECT_META } from "@/components/portfolio/data";
import { useTransition } from "@/hooks/use-transition";
import { Footer } from "@/components/site/footer";

export default function ProjectsDirectory() {
  const { startTransition } = useTransition();

  // set dark background class for portfolio layout
  useEffect(() => {
    document.body.classList.remove("bg-gba-teal");
    document.body.style.background = "#0d0d0d";
    return () => {
      document.body.style.background = "";
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

  const backToPortfolio = () => startTransition("/portfolio?tab=projects");

  return (
    <div className="min-h-screen bg-portfolio-bg font-sans text-portfolio-text selection:bg-portfolio-accent/30 bg-dot-grid relative">
      
      {/* centered content wrapper with side rail borders */}
      <div className="mx-auto max-w-5xl border-l border-r border-white/5 bg-portfolio-bg/25 min-h-screen flex flex-col">
        
        {/* header navigation bar */}
        <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-portfolio-bg/70 backdrop-blur-md">
          <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 sm:px-8">
            <button
              onClick={backToPortfolio}
              className="group flex items-center gap-2 font-pixel text-[9px] tracking-wider text-portfolio-text/70 transition-colors hover:text-portfolio-accent cursor-pointer"
            >
              <span>◂</span> PORTFOLIO
            </button>
            <span className="font-pixel text-[8px] text-slate-500">PROJECTS DIRECTORY</span>
            <a
              href="mailto:nmhariharanme@gmail.com"
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-portfolio-text/80 transition-colors hover:border-portfolio-accent hover:text-portfolio-accent"
            >
              Contact
            </a>
          </nav>
        </header>

        {/* projects index listing */}
        <main className="flex-grow pt-24 pb-20">
          <Container>
            <div className="mb-12">
              <span className="font-pixel text-[10px] tracking-[0.2em] text-portfolio-accent">
                DIRECTORY — ALL SHIPPED CODE
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] text-portfolio-text sm:text-5xl">
                Projects Index
              </h2>
            </div>

            <div className="space-y-12">
              {PROJECTS.map((p, i) => {
                const meta = PROJECT_META[p.id];
                return (
                  <Reveal key={p.id} delay={i * 0.05}>
                    <div className="grid gap-6 border-t border-white/8 pt-8 md:grid-cols-[1fr_auto]">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          {meta && (
                            <img
                              src={`/sprites/proj_${meta.icon}.png`}
                              alt=""
                              className="pixelated h-12 w-12 rounded-lg bg-white/5 border border-white/8 p-0.5 shadow-sm"
                            />
                          )}
                          <div>
                            <h3 className="text-2xl font-semibold tracking-tight text-portfolio-text">{p.short}</h3>
                            <p className="text-xs text-portfolio-text/50 font-pixel mt-0.5">{p.role} · {p.duration}</p>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-portfolio-text/70 max-w-3xl">
                          {p.blurb}
                        </p>

                        <div className="flex flex-wrap gap-2.5 items-center">
                          {p.stack.map((k) => (
                            <span
                              key={k}
                              className="flex items-center gap-1.5 rounded-md border border-white/5 bg-portfolio-card/40 py-1 pl-1 pr-2 text-xs text-portfolio-text/85"
                            >
                              <LogoChip k={k} size={20} label={k} />
                              <span>{k}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end gap-4 min-w-[120px]">
                        {/* status indicator dot */}
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/5 bg-white/5 font-pixel text-[8px] tracking-wide text-portfolio-text/80">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span>{p.status}</span>
                        </div>

                        {/* code & repository links */}
                        <div className="flex items-center gap-3 text-portfolio-text/60">
                          <a
                            href={p.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="source code"
                            className="flex items-center gap-1 text-xs hover:text-portfolio-text border border-white/10 px-3 py-1.5 rounded-lg bg-portfolio-card/40 transition-colors"
                          >
                            <GitHubIcon className="h-4 w-4" /> Repo
                          </a>
                          {p.url && (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="live demo"
                              className="flex items-center gap-1 text-xs hover:text-portfolio-accent border border-white/10 px-3 py-1.5 rounded-lg bg-portfolio-card/40 transition-colors text-portfolio-text/85"
                            >
                              <ArrowIcon className="h-4 w-4" /> Live
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </main>

        <div className="horizontal-rail" />
        <Footer onBack={() => startTransition("/")} />
      </div>
    </div>
  );
}
