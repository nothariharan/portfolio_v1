import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-0 scroll-mt-24 font-display text-3xl font-semibold tracking-tight text-portfolio-text sm:text-[2.15rem]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 scroll-mt-24 font-display text-xl font-semibold tracking-tight text-portfolio-text first:mt-0">
      {children}
    </h2>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-left text-[13px] text-portfolio-muted">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-portfolio-border/80">{children}</thead>,
  th: ({ children }) => (
    <th className="px-2 py-2 font-mono text-[11px] font-medium uppercase tracking-wide text-portfolio-text/70">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-portfolio-border/40 px-2 py-2 align-top">{children}</td>,
  tr: ({ children }) => <tr>{children}</tr>,
  h3: ({ children }) => (
    <h3 className="mt-8 scroll-mt-24 font-display text-lg font-semibold tracking-tight text-portfolio-text">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-[15px] leading-relaxed text-portfolio-muted">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-portfolio-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-portfolio-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5 marker:text-portfolio-text/40">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-portfolio-text">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-portfolio-muted">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-portfolio-text underline decoration-white/25 underline-offset-3 transition-colors hover:decoration-white/60"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-portfolio-border pl-4 text-[15px] leading-relaxed text-portfolio-muted italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className="font-mono text-[13px] text-portfolio-text/90">{children}</code>
      );
    }
    return (
      <code className="rounded-md border border-portfolio-border bg-portfolio-border/40 px-1.5 py-0.5 font-mono text-[12.5px] text-portfolio-text/90">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-lg border border-portfolio-border bg-portfolio-card p-4 font-mono text-[13px] leading-relaxed">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-10 border-portfolio-border/70" />,
};

export function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
