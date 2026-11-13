import React, { type ReactNode } from "react";
import type { InlineNode, MarkdownBlock, TableAlignment } from "@/utils/markdown";

/**
 * Pure React Markdown renderer ported from Saksi architecture.
 * Safe from XSS: zero dangerouslySetInnerHTML usage.
 * Theme: Cyber Brutalist 0-Radius Dark Terminal (Emerald / Amber accents).
 */

function renderInline(nodes: readonly InlineNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;

    switch (node.kind) {
      case "text":
        return node.value;
      case "code":
        return (
          <code
            key={key}
            className="font-mono bg-[#161B27] border border-[#20283A] text-emerald-400 px-1.5 py-0.5 text-[0.88em] rounded-none break-words"
          >
            {node.value}
          </code>
        );
      case "strong":
        return (
          <strong key={key} className="text-slate-100 font-semibold">
            {renderInline(node.children, key)}
          </strong>
        );
      case "emphasis":
        return (
          <em key={key} className="text-slate-300 italic">
            {renderInline(node.children, key)}
          </em>
        );
      case "link":
        return (
          <a
            key={key}
            href={node.href}
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/40 hover:decoration-amber-300 transition-colors"
            {...(node.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {renderInline(node.children, key)}
          </a>
        );
    }
  });
}

const ALIGN_CLASS: Record<TableAlignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function CodeBlock({
  language,
  value,
}: {
  readonly language: string | null;
  readonly value: string;
}) {
  return (
    <div className="border border-[#20283A] bg-[#0A0D14] my-6 rounded-none overflow-hidden font-mono">
      {language ? (
        <div className="border-b border-[#20283A] bg-[#10141E] px-4 py-2 flex items-center justify-between text-[11px] tracking-wider text-slate-400 uppercase font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-emerald-400 inline-block" />
            <span>{language}</span>
          </span>
          <span className="text-[10px] text-slate-500">CANONICAL_SPEC</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-slate-200 scrollbar-thin">
        <code>{value}</code>
      </pre>
    </div>
  );
}

export function MarkdownDocument({ blocks }: { readonly blocks: readonly MarkdownBlock[] }) {
  return (
    <div className="min-w-0 text-slate-200">
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        switch (block.kind) {
          case "heading": {
            const content = renderInline(block.children, key);
            if (block.depth === 1) {
              return (
                <h1
                  key={key}
                  id={block.id}
                  className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-6"
                >
                  {content}
                </h1>
              );
            }
            if (block.depth === 2) {
              return (
                <h2
                  key={key}
                  id={block.id}
                  className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white border-t border-[#20283A] mt-12 pt-8 mb-4 scroll-mt-24 flex items-center gap-2.5"
                >
                  <span className="text-emerald-400 font-mono text-lg select-none">#</span>
                  <span>{content}</span>
                </h2>
              );
            }
            if (block.depth === 3) {
              return (
                <h3
                  key={key}
                  id={block.id}
                  className="font-display font-semibold text-xl sm:text-2xl tracking-tight text-slate-100 mt-8 mb-3 scroll-mt-24 flex items-center gap-2"
                >
                  <span className="text-amber-400 font-mono text-base select-none">##</span>
                  <span>{content}</span>
                </h3>
              );
            }
            return (
              <h4
                key={key}
                id={block.id}
                className="font-mono font-semibold text-base text-slate-200 mt-6 mb-2 scroll-mt-24"
              >
                {content}
              </h4>
            );
          }

          case "paragraph":
            return (
              <p key={key} className="text-slate-300 mt-4 text-[15px] leading-relaxed">
                {renderInline(block.children, key)}
              </p>
            );

          case "code":
            return <CodeBlock key={key} language={block.language} value={block.value} />;

          case "list": {
            const items = block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`} className="pl-1">
                {renderInline(item, `${key}-${itemIndex}`)}
              </li>
            ));

            if (block.ordered) {
              return (
                <ol
                  key={key}
                  start={block.start}
                  className="text-slate-300 marker:text-amber-400 mt-4 list-decimal space-y-2 pl-6 text-[15px] leading-relaxed font-mono"
                >
                  {items}
                </ol>
              );
            }
            return (
              <ul
                key={key}
                className="text-slate-300 marker:text-emerald-400 mt-4 list-disc space-y-2 pl-6 text-[15px] leading-relaxed"
              >
                {items}
              </ul>
            );
          }

          case "table":
            return (
              <div key={key} className="border border-[#20283A] bg-[#0E121B] my-6 overflow-x-auto rounded-none">
                <table className="w-full border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[#20283A] bg-[#141926]">
                      {block.header.map((cell, cellIndex) => (
                        <th
                          key={`${key}-h-${cellIndex}`}
                          className={`font-mono text-slate-300 px-4 py-3 text-[11px] font-semibold tracking-wider uppercase ${
                            ALIGN_CLASS[block.align[cellIndex] ?? "left"]
                          }`}
                        >
                          {renderInline(cell, `${key}-h-${cellIndex}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#20283A]/70 font-sans">
                    {block.rows.map((row, rowIndex) => (
                      <tr
                        key={`${key}-r-${rowIndex}`}
                        className="hover:bg-[#161B27]/60 transition-colors"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${key}-r-${rowIndex}-${cellIndex}`}
                            className={`text-slate-300 px-4 py-3 align-top leading-relaxed ${
                              ALIGN_CLASS[block.align[cellIndex] ?? "left"]
                            }`}
                          >
                            {renderInline(cell, `${key}-r-${rowIndex}-${cellIndex}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "rule":
            return <hr key={key} className="border-[#20283A] my-10" />;
        }
      })}
    </div>
  );
}
