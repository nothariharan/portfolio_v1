"use client";

import { useEffect } from "react";
import { Container, Reveal, ArrowIcon } from "@/components/site/ui";
import { ACHIEVEMENTS } from "@/components/site/portfolio-data";
import { useTransition } from "@/hooks/use-transition";
import { Footer } from "@/components/site/footer";
import { SITE } from "@/components/site/content";

export default function AchievementsPage() {
  const { startTransition } = useTransition();

  useEffect(() => {
    document.body.classList.remove("bg-gba-teal");
    document.body.style.background = "#030712";
    return () => {
      document.body.style.background = "";
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

  const backToPortfolio = () => startTransition("/portfolio");

  return (
    <div className="min-h-screen bg-portfolio-bg font-sans text-portfolio-text antialiased selection:bg-white/15">
      <header className="sticky top-0 z-40 bg-portfolio-bg/75 backdrop-blur-md">
        <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6 sm:px-8">
          <button
            onClick={backToPortfolio}
            className="group flex items-center gap-1.5 text-sm text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">◂</span> portfolio
          </button>
          <span className="font-mono text-sm text-portfolio-muted">achievements</span>
          <a
            href={`mailto:${SITE.email}`}
            className="rounded-md border border-portfolio-border px-3 py-1.5 text-sm text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text"
          >
            contact
          </a>
        </nav>
      </header>

      <main className="pt-10 pb-16">
        <Container>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">the trophy shelf</h1>
          <p className="mt-2 max-w-xl text-[15px] text-portfolio-muted">
            9 hackathon wins — four of them in a single day — plus a hacktoberfest golden badge and yc
            startup school &apos;26. placement, not just participation.
          </p>

          <ol className="mt-8 flex flex-col">
            {ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.title} delay={(i % 6) * 0.04}>
                <li className="flex items-start gap-4 border-t border-portfolio-border/70 py-5 first:border-t-0">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-portfolio-border bg-portfolio-card text-xl">
                    {a.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-[16px] font-semibold tracking-tight text-portfolio-text">{a.title}</h2>
                      <span className="shrink-0 font-mono text-[11px] text-portfolio-muted">{a.date}</span>
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-portfolio-muted/80">{a.event}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-portfolio-muted">{a.note}</p>

                    {a.tracks && (
                      <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                        {a.tracks.map((t) => (
                          <div
                            key={t.label}
                            className="flex items-center justify-between gap-2 rounded-md border border-portfolio-border bg-portfolio-border/30 px-2.5 py-1.5 text-[12px]"
                          >
                            <span className="text-portfolio-muted">
                              <span className="font-mono text-[10px] uppercase text-portfolio-muted/70">{t.label}</span>{" "}
                              · {t.project}
                            </span>
                            <span className="shrink-0 font-medium text-portfolio-text/90">{t.result}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {a.live && (
                      <a
                        href={a.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 font-mono text-[12px] text-portfolio-muted transition-colors hover:text-portfolio-text"
                      >
                        {a.project ? `${a.project.toLowerCase()} — live` : "live"}{" "}
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </main>

      <Footer onBack={() => startTransition("/")} />
    </div>
  );
}
