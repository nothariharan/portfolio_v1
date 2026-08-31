"use client";

import { Container, Reveal, ArrowIcon } from "@/components/site/ui";
import { ACHIEVEMENTS } from "@/components/site/portfolio-data";

export default function AchievementsPage() {
  return (
    <main className="pt-10 pb-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">the trophy shelf</h1>
        <p className="mt-2 max-w-xl text-[15px] text-portfolio-muted">
          merged upstream prs, yc startup school, hacktoberfest gold, and the hackathon circuit if you want the full list.
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
  );
}
