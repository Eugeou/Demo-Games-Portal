import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-content space-y-4 text-sm leading-7 text-ink md:text-base">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-extrabold tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="pt-2 text-xl font-extrabold tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold">{children}</h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand pl-4 text-muted">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => {
            if (href?.startsWith("/")) {
              return (
                <Link
                  to={href}
                  className="font-semibold text-brand hover:underline"
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand hover:underline"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt ?? ""}
              className="my-3 w-full rounded-xl md:rounded-2xl object-cover"
            />
          ),
          code: ({ children, className }) => {
            const block =
              className?.includes("language-") ||
              String(children).includes("\n");
            if (block) {
              return (
                <pre className="overflow-x-auto rounded-xl md:rounded-2xl bg-lift p-4 text-xs ring-1 ring-line">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="rounded bg-lift px-1.5 py-0.5 text-[0.9em]">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-line px-3 py-2 font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-line px-3 py-2">{children}</td>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
