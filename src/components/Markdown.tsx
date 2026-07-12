import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Branded typography. react-markdown does NOT render raw HTML by default,
// so user input is safe (no rehype-raw).
const components: Components = {
  h1: (p) => <h2 className="mt-8 font-display text-2xl font-semibold text-ink" {...p} />,
  h2: (p) => <h2 className="mt-8 font-display text-2xl font-semibold text-ink" {...p} />,
  h3: (p) => <h3 className="mt-6 font-display text-lg font-semibold text-ink" {...p} />,
  h4: (p) => <h4 className="mt-5 font-semibold text-ink" {...p} />,
  p: (p) => <p className="mt-4 leading-relaxed text-ink" {...p} />,
  ul: (p) => <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-gold-500" {...p} />,
  ol: (p) => <ol className="mt-4 list-decimal space-y-1.5 pl-5 marker:text-gold-500" {...p} />,
  li: (p) => <li className="leading-relaxed text-ink" {...p} />,
  strong: (p) => <strong className="font-semibold text-ink" {...p} />,
  em: (p) => <em className="italic" {...p} />,
  a: (p) => (
    <a
      className="font-medium text-leaf-600 underline underline-offset-2 hover:text-leaf-700"
      target="_blank"
      rel="noopener noreferrer"
      {...p}
    />
  ),
  blockquote: (p) => (
    <blockquote
      className="mt-4 border-l-4 border-gold-400 pl-4 italic text-ink-soft"
      {...p}
    />
  ),
  hr: () => <hr className="my-8 border-leaf-100" />,
  code: (p) => (
    <code className="rounded bg-leaf-50 px-1.5 py-0.5 text-sm text-leaf-700" {...p} />
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[15px] [&>*:first-child]:mt-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
