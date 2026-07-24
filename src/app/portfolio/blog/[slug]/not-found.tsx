import { Container } from "@/components/site/ui";
import { TransitionLink } from "@/components/site/transition-link";

export default function BlogNotFound() {
  return (
    <main className="pt-10 pb-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">
          post not found
        </h1>
        <p className="mt-2 text-[15px] text-portfolio-muted">
          that slug doesn&apos;t match a published post.
        </p>
        <TransitionLink
          href="/portfolio/blog"
          className="mt-8 inline-flex text-[13px] text-portfolio-muted transition-colors hover:text-portfolio-text"
        >
          ← back to blog
        </TransitionLink>
      </Container>
    </main>
  );
}
