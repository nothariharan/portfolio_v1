"use client";

import { motion } from "framer-motion";
import { useTransition } from "@/hooks/use-transition";
import { useEffect } from "react";

// mock projects data for phase 1 placeholder
const MOCK_PROJECTS = [
  { name: "startup platform", desc: "co-founded and built the tech stack for a community platform. optimized real-time communication systems.", lang: "TypeScript" },
  { name: "obsidian brain sync", desc: "automated compiler script that parses markdown nodes into structured website configuration files.", lang: "Python" },
  { name: "pokémon trainer portfolio", desc: "clean developer profile coupled with a gba trainer card landing and custom web audio signals.", lang: "Next.js" },
];

export default function PortfolioPage() {
  const { startTransition } = useTransition();

  // switch page background color to dark portfolio theme on mount
  useEffect(() => {
    document.body.classList.add("bg-portfolio-bg");
    document.body.classList.remove("bg-gba-teal");
    
    // cleanup
    return () => {
      document.body.classList.remove("bg-portfolio-bg");
      document.body.classList.add("bg-gba-teal");
    };
  }, []);

  return (
    <main className="min-h-screen bg-portfolio-bg text-portfolio-text font-sans p-6 md:p-12 flex flex-col justify-between selection:bg-portfolio-accent selection:text-portfolio-bg">
      {/* top navigation header */}
      <header className="flex justify-between items-center max-w-4xl mx-auto w-full mb-16">
        <span className="text-xs font-pixel text-portfolio-accent tracking-tighter select-none">
          LOG: STAGE_01
        </span>
        <button 
          onClick={() => startTransition("/")}
          className="text-[8px] font-pixel border border-portfolio-text/30 hover:border-portfolio-accent hover:text-portfolio-accent px-2 py-1 rounded transition-colors cursor-pointer"
        >
          ▶ trainer card
        </button>
      </header>

      {/* hero layout section */}
      <section className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-normal tracking-tight mb-4 text-white">
            hariharan
          </h1>
          <p className="text-lg md:text-xl font-sans text-portfolio-text/80 max-w-2xl leading-relaxed mb-6">
            co-founder, full-stack engineer, and builder. based in India. i focus on creating robust developer experiences, agent loop automations, and minimalist frontends.
          </p>
          <div className="flex gap-4 text-xs font-mono text-portfolio-text/60">
            <span>github</span>
            <span>·</span>
            <span>twitter</span>
            <span>·</span>
            <span>email</span>
          </div>
        </motion.div>
      </section>

      {/* placeholder projects grid for phase 1 */}
      <section className="max-w-4xl mx-auto w-full mb-20">
        <motion.h2 
          className="text-xs font-pixel text-portfolio-accent mb-6 select-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          SELECT WORKS
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_PROJECTS.map((project, idx) => (
            <motion.div 
              key={idx}
              className="bg-portfolio-card p-6 border border-white/5 rounded-lg flex flex-col justify-between hover:border-portfolio-accent/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div>
                <h3 className="text-sm font-pixel text-white mb-3 group-hover:text-portfolio-accent transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-portfolio-text/75 leading-relaxed mb-6 font-sans">
                  {project.desc}
                </p>
              </div>
              <span className="text-[9px] font-mono text-portfolio-text/40 uppercase">
                {project.lang}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* footer section with reverse transition */}
      <footer className="max-w-4xl mx-auto w-full border-t border-white/5 pt-8 mt-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[9px] font-pixel text-portfolio-text/40">
          © {new Date().getFullYear()} HARIHARAN. built using nextjs & tailwind.
        </p>
        
        <button
          onClick={() => startTransition("/")}
          className="text-[8px] font-pixel text-portfolio-accent hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <span className="animate-pulse">◀</span> BACK TO TRAINER CARD
        </button>
      </footer>
    </main>
  );
}
