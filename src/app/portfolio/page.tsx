"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "@/hooks/use-transition";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Experience } from "@/components/site/experience";
import { Footer } from "@/components/site/footer";

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

  // set dark background class for portfolio layout
  useEffect(() => {
    document.body.classList.remove("bg-gba-teal");
    document.body.style.background = "#030712";
    return () => {
      document.body.style.background = "";
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

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

  const backToCard = () => startTransition("/");

  return (
    <div className="min-h-screen bg-portfolio-bg font-sans text-portfolio-text antialiased selection:bg-white/15">
      <SiteNav onBack={backToCard} active="home" />
      <main>
        <Hero />
        <Experience />
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
