"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Reveal } from "@/components/site/ui";
import { ProjectCard } from "@/components/site/project-card";
import { PROJECTS, CATEGORIES, type Category } from "@/components/site/portfolio-data";
import { useTransition } from "@/hooks/use-transition";
import { Footer } from "@/components/site/footer";
import { SITE } from "@/components/site/content";

type Filter = "All" | Category;

export default function ProjectsDirectory() {
  const { startTransition } = useTransition();
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    document.body.classList.remove("bg-gba-teal");
    document.body.style.background = "#030712";
    return () => {
      document.body.style.background = "";
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

  const filters: Filter[] = ["All", ...CATEGORIES];
  const shown = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  );

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
          <span className="font-mono text-sm text-portfolio-muted">projects</span>
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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">everything i&apos;ve shipped</h1>
          <p className="mt-2 max-w-xl text-[15px] text-portfolio-muted">
            {PROJECTS.length} projects across ai agents, civic tech, dev tools and ml research — most of
            them built (and deployed) at 3am.
          </p>

          {/* category filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                  filter === f
                    ? "border-transparent bg-portfolio-text text-portfolio-bg"
                    : "border-portfolio-border text-portfolio-muted hover:border-white/25 hover:text-portfolio-text"
                }`}
              >
                {f === "All" ? `all · ${PROJECTS.length}` : f.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.05}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </main>

      <Footer onBack={() => startTransition("/")} />
    </div>
  );
}
