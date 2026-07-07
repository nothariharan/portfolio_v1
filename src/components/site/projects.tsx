"use client";

import { Section, Reveal, SectionHeading, ArrowIcon } from "./ui";
import { ProjectCard } from "./project-card";
import { FEATURED_PROJECTS, PROJECTS } from "./portfolio-data";
import { useTransition } from "@/hooks/use-transition";

export function Projects() {
  const { startTransition } = useTransition();

  return (
    <Section id="projects">
      <SectionHeading
        title="featured projects"
        action={
          <button
            onClick={() => startTransition("/portfolio/projects")}
            className="inline-flex items-center gap-1 text-[13px] text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer"
          >
            all {PROJECTS.length} projects <ArrowIcon className="h-3.5 w-3.5" />
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURED_PROJECTS.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.06}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
