"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "@/hooks/use-transition";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Experience } from "@/components/site/experience";
import { Projects } from "@/components/site/projects";
import { Skills } from "@/components/site/skills";
import { Achievements } from "@/components/site/achievements";
import { Footer } from "@/components/site/footer";

// map tab names to section element ids
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

  // set dark background class for portfolio layout
  useEffect(() => {
    document.body.classList.remove("bg-gba-teal");
    document.body.style.background = "#030712";
    return () => {
      document.body.style.background = "";
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

  // scroll to specific section if coming from card deep link
  useEffect(() => {
    const anchor = tab ? TAB_ANCHOR[tab] : undefined;
    if (!anchor) return;
    const el = document.getElementById(anchor);
    if (el) {
      // scroll smoothly to target element
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [tab]);

  const backToCard = () => startTransition("/");

  return (
    <div className="min-h-screen bg-portfolio-bg font-sans text-portfolio-text antialiased selection:bg-white/15">
      <SiteNav onBack={backToCard} />
      <main>
        <Hero />
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
