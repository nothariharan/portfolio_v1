import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/ui";
import { TransitionLink } from "@/components/site/transition-link";
import { BlogMarkdown } from "@/components/site/blog-markdown";
import { formatPostDate, getPostBySlug, getPostSlugs } from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "post not found" };
  return {
    title: `${post.title} · blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="pt-10 pb-16">
      <Container>
        <TransitionLink
          href="/portfolio/blog"
          className="inline-flex items-center gap-1.5 text-sm text-portfolio-muted transition-colors hover:text-portfolio-text"
        >
          <span aria-hidden>◂</span> blog
        </TransitionLink>

        <header className="mt-6 border-b border-portfolio-border/70 pb-8">
          <time
            dateTime={post.date}
            className="font-mono text-[12px] text-portfolio-muted"
          >
            {formatPostDate(post.date)}
          </time>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-portfolio-text sm:text-[2.15rem]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-portfolio-muted">
              {post.excerpt}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
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
        </header>

        <article className="mt-8 max-w-2xl">
          <BlogMarkdown content={post.content} />
        </article>

        <div className="mt-12 border-t border-portfolio-border/70 pt-6">
          <TransitionLink
            href="/portfolio/blog"
            className="text-[13px] text-portfolio-muted transition-colors hover:text-portfolio-text"
          >
            ← all posts
          </TransitionLink>
        </div>
      </Container>
    </main>
  );
}
