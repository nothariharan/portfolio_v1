"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTransition } from "@/hooks/use-transition";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";

function activeFromPath(pathname: string) {
  if (pathname.startsWith("/portfolio/experience")) return "experience";
  if (pathname.startsWith("/portfolio/projects")) return "projects";
  if (pathname.startsWith("/portfolio/skills")) return "skills";
  if (pathname.startsWith("/portfolio/achievements")) return "achievements";
  if (pathname.startsWith("/portfolio/blog")) return "blog";
  if (pathname.startsWith("/portfolio/hari")) return "hari";
  return "home";
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const { startTransition } = useTransition();
  const pathname = usePathname();
  const backToCard = () => startTransition("/");

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
      <SiteNav onBack={backToCard} active={activeFromPath(pathname)} />
      {children}
      <Footer onBack={backToCard} />
    </div>
  );
}
