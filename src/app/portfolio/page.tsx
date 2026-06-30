"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "@/hooks/use-transition";
import { DataFileShell } from "@/components/portfolio/ui";
import { ProjectsSection } from "@/components/portfolio/projects";
import { ExperienceSection } from "@/components/portfolio/experience";
import { HonorsSection } from "@/components/portfolio/honors";
import { SkillsSection } from "@/components/portfolio/skills";
import type { TabKey } from "@/components/portfolio/data";

const VALID: TabKey[] = ["projects", "experience", "honors", "skills"];

function PortfolioInner() {
  const { startTransition } = useTransition();
  const params = useSearchParams();
  const initial = params.get("tab");
  const [tab, setTab] = useState<TabKey>(
    initial && VALID.includes(initial as TabKey) ? (initial as TabKey) : "projects"
  );

  // dark backdrop behind the framed device
  useEffect(() => {
    document.body.classList.remove("bg-gba-teal");
    document.body.style.background = "#0f2a2a";
    return () => {
      document.body.style.background = "";
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

  return (
    <DataFileShell active={tab} onTab={setTab} onBack={() => startTransition("/")}>
      {tab === "projects" && <ProjectsSection />}
      {tab === "experience" && <ExperienceSection />}
      {tab === "honors" && <HonorsSection />}
      {tab === "skills" && <SkillsSection />}
    </DataFileShell>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f2a2a]" />}>
      <PortfolioInner />
    </Suspense>
  );
}
