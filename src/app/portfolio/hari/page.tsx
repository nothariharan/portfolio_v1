import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/site/ui";
import { TransitionLink } from "@/components/site/transition-link";
import { BlogMarkdown } from "@/components/site/blog-markdown";

export const metadata: Metadata = {
  title: "hari.md · context",
  description:
    "Long-form context on N. Hariharan — education, experience, projects, wins, DNFs, and how he builds.",
};

function readHariMd() {
  return fs.readFileSync(path.join(process.cwd(), "content", "hari.md"), "utf8");
}

export default function HariMdPage() {
  const content = readHariMd();

  return (
    <main className="pt-10 pb-20">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TransitionLink
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm text-portfolio-muted transition-colors hover:text-portfolio-text"
          >
            <span aria-hidden>◂</span> portfolio
          </TransitionLink>
          <span className="rounded-md border border-portfolio-border bg-black px-2.5 py-1 font-mono text-[11px] text-white">
            hari.md
          </span>
        </div>

        <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-portfolio-muted">
          the long context file — me, the work, the wins, the DNFs, the stack. for humans and for agents that need the whole picture.
        </p>

        <article className="mt-8 max-w-2xl">
          <BlogMarkdown content={content} />
        </article>

        <div className="mt-14 border-t border-portfolio-border/70 pt-6">
          <TransitionLink
            href="/portfolio"
            className="text-[13px] text-portfolio-muted transition-colors hover:text-portfolio-text"
          >
            ← back to portfolio
          </TransitionLink>
        </div>
      </Container>
    </main>
  );
}
