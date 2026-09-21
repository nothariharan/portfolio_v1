"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "@/hooks/use-transition";
import { Hero } from "@/components/site/hero";
import { Experience } from "@/components/site/experience";
import { Projects } from "@/components/site/projects";
import { Achievements } from "@/components/site/achievements";
import { NowPlaying } from "@/components/site/now-playing";

// deep links from the trainer card now route to their dedicated pages
const TAB_ROUTE: Record<string, string> = {
  projects: "/portfolio/projects",
  honors: "/portfolio/achievements",
  skills: "/portfolio/skills",
};

function PortfolioInner() {
  const { startTransition } = useTransition();
  const params = useSearchParams();
  const tab = params.get("tab");

  // route deep links to dedicated pages; experience stays on this page (the journey summary)
  useEffect(() => {
    if (!tab) return;
    const route = TAB_ROUTE[tab];
    if (route) {
      startTransition(route);
      return;
    }
    if (tab === "experience") {
      const el = document.getElementById("experience");
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [tab, startTransition]);

  return (
    <main className="pb-24">
      <Hero />
      <Experience />
      <Projects />
      <Achievements />
      <NowPlaying />
    </main>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<main className="min-h-[50vh]" />}>
      <PortfolioInner />
    </Suspense>
  );
}
