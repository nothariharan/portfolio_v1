"use client";

import { useEffect } from "react";
import { Container, Reveal, TechTag } from "@/components/site/ui";
import { BACK_SKILLS } from "@/components/portfolio/data";
import { useTransition } from "@/hooks/use-transition";
import { Footer } from "@/components/site/footer";
import { SITE } from "@/components/site/content";

const LABELS: Record<string, string> = {
  "AI / ML": "ai / ml",
  "FULL-STACK": "full-stack",
  DEVOPS: "devops",
  CLOUD: "cloud",
  TOOLS: "tools",
};

export default function SkillsPage() {
  const { startTransition } = useTransition();

  useEffect(() => {
    document.body.classList.remove("bg-gba-teal");
    document.body.style.background = "#030712";
    return () => {
      document.body.style.background = "";
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-bg font-sans text-portfolio-text antialiased selection:bg-white/15">
      <header className="sticky top-0 z-40 bg-portfolio-bg/75 backdrop-blur-md">
        <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6 sm:px-8">
          <button
            onClick={() => startTransition("/portfolio")}
            className="group flex items-center gap-1.5 text-sm text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">◂</span> portfolio
          </button>
          <span className="font-mono text-sm text-portfolio-muted">skills</span>
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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">skills &amp; tools</h1>
          <p className="mt-2 max-w-xl text-[15px] text-portfolio-muted">
            the stack i reach for — from ai agents and full-stack to the devops glue that ships it.
          </p>

          <div className="mt-8 flex flex-col gap-6">
            {BACK_SKILLS.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.05}>
                <div className="grid gap-3 border-t border-portfolio-border/70 pt-5 first:border-t-0 first:pt-0 sm:grid-cols-[130px_1fr] sm:items-start">
                  <span className="pt-1 font-mono text-[12px] uppercase tracking-wider text-portfolio-muted">
                    {LABELS[group.label] ?? group.label.toLowerCase()}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.icons.map((k) => (
                      <TechTag key={k} k={k} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => startTransition("/portfolio/projects")}
              className="rounded-md border border-portfolio-border px-4 py-2 text-[13px] text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text cursor-pointer"
            >
              see all projects →
            </button>
            <button
              onClick={() => startTransition("/portfolio/experience")}
              className="rounded-md border border-portfolio-border px-4 py-2 text-[13px] text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text cursor-pointer"
            >
              the journey so far →
            </button>
          </div>
        </Container>
      </main>

      <Footer onBack={() => startTransition("/")} />
    </div>
  );
}
