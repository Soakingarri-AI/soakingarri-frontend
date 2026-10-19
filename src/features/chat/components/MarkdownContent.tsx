import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components: Components = {
  h1: ({ children }) => <h1 className="text-xl font-semibold text-white mt-5 mb-2 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-5 mb-2 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold text-amber-400 mt-5 mb-2 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="font-semibold text-white mt-4 mb-1 first:mt-0">{children}</h4>,
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1.5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1.5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="pl-1 marker:text-amber-500">{children}</li>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-amber-500/60 pl-4 my-3 text-gray-300 italic">{children}</blockquote>
  ),
  code: ({ children, className }) =>
    className ? (
      <code className={`${className} block`}>{children}</code>
    ) : (
      <code className="bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="bg-black/40 rounded-lg p-4 my-3 overflow-x-auto text-sm font-mono">{children}</pre>
  ),
  hr: () => <hr className="my-4 border-white/10" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-white/10 px-3 py-2 text-left font-semibold bg-white/5">{children}</th>,
  td: ({ children }) => <td className="border border-white/10 px-3 py-2">{children}</td>,
};

/** Renders an assistant reply's Markdown (headings, bold, lists…) as formatted text. */
export const MarkdownContent: React.FC<{ content: string }> = ({ content }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
    {content}
  </ReactMarkdown>
);
