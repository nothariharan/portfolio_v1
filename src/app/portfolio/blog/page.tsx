import type { Metadata } from "next";
import { Container } from "@/components/site/ui";
import { TransitionLink } from "@/components/site/transition-link";
import { formatPostDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "blog · Hariharan",
  description: "notes on shipping products, ai agents, and building in public.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="pt-10 pb-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">
          blog
        </h1>
        <p className="mt-2 max-w-xl text-[15px] text-portfolio-muted">
          notes from shipping — agents, civic tools, portfolio experiments. read-only out here;
          i write these as files and push them live.
        </p>

        {posts.length === 0 ? (
          <p className="mt-10 text-[15px] text-portfolio-muted">no posts yet — check back soon.</p>
        ) : (
          <ul className="mt-10 flex flex-col">
            {posts.map((post) => (
              <li key={post.slug} className="border-t border-portfolio-border/70 first:border-t-0">
                <TransitionLink
                  href={`/portfolio/blog/${post.slug}`}
                  className="group flex flex-col gap-1.5 py-5 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <div className="min-w-0">
                    <h2 className="font-display text-[17px] font-semibold tracking-tight text-portfolio-text transition-colors group-hover:text-white">
                      {post.title}
                    </h2>
                    <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-portfolio-muted">
                      {post.excerpt}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-portfolio-border bg-portfolio-border/30 px-2 py-0.5 font-mono text-[10px] text-portfolio-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <time
                    dateTime={post.date}
                    className="shrink-0 font-mono text-[12px] text-portfolio-muted/80"
                  >
                    {formatPostDate(post.date)}
                  </time>
                </TransitionLink>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}
