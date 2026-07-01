"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "@/hooks/use-transition";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Experience } from "@/components/site/experience";
import { Projects } from "@/components/site/projects";
import { Skills } from "@/components/site/skills";
import { Achievements } from "@/components/site/achievements";
import { Footer } from "@/components/site/footer";

// which card tab maps to which section anchor
const TAB_ANCHOR: Record<string, string> = {
  projects: "projects",
  experience: "experience",
  honors: "achievements",
  skills: "skills",
};

function PortfolioInner() {
  const { startTransition } = useTransition();
  const params = useSearchParams();
  const tab = params.get("tab");

  // dark backdrop for the whole minimal world
  useEffect(() => {
    document.body.classList.remove("bg-gba-teal");
    document.body.style.background = "#0d0d0d";
    return () => {
      document.body.style.background = "";
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

  // deep-link: if arriving from a card section, jump to it after mount
  useEffect(() => {
    const anchor = tab ? TAB_ANCHOR[tab] : undefined;
    if (!anchor) return;
    const el = document.getElementById(anchor);
    if (el) {
      // let the page paint first, then scroll into view
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [tab]);

  const backToCard = () => startTransition("/");

  return (
    <div className="min-h-screen bg-portfolio-bg font-sans text-portfolio-text selection:bg-portfolio-accent/30">
      <SiteNav onBack={backToCard} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
      </main>
      <Footer onBack={backToCard} />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-portfolio-bg" />}>
      <PortfolioInner />
    </Suspense>
  );
}
