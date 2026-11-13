import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { collectHeadings, firstParagraph, parseMarkdown } from "@/utils/markdown";
import type { InlineNode, MarkdownBlock, MarkdownHeading } from "@/utils/markdown";
import { DOCS, DocEntry } from "@/data/docs";

export { DOCS };
export type { DocEntry };

function resolveFilePath(relativeFile: string): string {
  // Try local content directory (for standalone Vercel deployments)
  const p0 = join(process.cwd(), "content", relativeFile);
  if (existsSync(p0)) return p0;

  // Try current working directory
  const p1 = join(process.cwd(), relativeFile);
  if (existsSync(p1)) return p1;

  // Try parent directory (if running from app/)
  const p2 = join(process.cwd(), "..", relativeFile);
  if (existsSync(p2)) return p2;

  // Check if relativeFile starts with docs/ or is in docs/
  const p3 = join(process.cwd(), "docs", relativeFile.replace(/^docs[\\/]/, ""));
  if (existsSync(p3)) return p3;

  const p4 = join(process.cwd(), "..", "docs", relativeFile.replace(/^docs[\\/]/, ""));
  if (existsSync(p4)) return p4;

  return p1;
}

function siteHref(href: string): string {
  if (href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  const normalized = href.replace(/^\.\//, "");
  const target = DOCS.find(
    (entry) => entry.file === normalized || `docs/${entry.file}` === normalized || entry.file === `docs/${normalized}`
  );
  return target ? `/docs/${target.slug}` : href;
}

function rewriteInline(nodes: readonly InlineNode[]): InlineNode[] {
  return nodes.map((node) => {
    switch (node.kind) {
      case "text":
      case "code":
        return node;
      case "strong":
      case "emphasis":
        return { ...node, children: rewriteInline(node.children) };
      case "link":
        return { ...node, href: siteHref(node.href), children: rewriteInline(node.children) };
    }
  });
}

function rewriteBlocks(blocks: readonly MarkdownBlock[]): MarkdownBlock[] {
  return blocks.map((block) => {
    switch (block.kind) {
      case "heading":
      case "paragraph":
        return { ...block, children: rewriteInline(block.children) };
      case "code":
      case "rule":
        return block;
      case "list":
        return { ...block, items: block.items.map(rewriteInline) };
      case "table":
        return {
          ...block,
          header: block.header.map(rewriteInline),
          rows: block.rows.map((row) => row.map(rewriteInline)),
        };
    }
  });
}

export interface DocPage {
  readonly entry: DocEntry;
  readonly blocks: readonly MarkdownBlock[];
  readonly headings: readonly MarkdownHeading[];
  readonly intro: string;
}

export function findDoc(slug: string): DocEntry | null {
  return DOCS.find((entry) => entry.slug.toLowerCase() === slug.toLowerCase()) ?? null;
}

export function loadDoc(entry: DocEntry): DocPage {
  const filePath = resolveFilePath(entry.file);
  let rawContent = "";
  try {
    rawContent = readFileSync(filePath, "utf-8");
  } catch (err) {
    throw new Error(`Failed to read document "${entry.file}" at path "${filePath}": ${err}`);
  }

  const blocks = rewriteBlocks(parseMarkdown(rawContent));
  return {
    entry,
    blocks,
    headings: collectHeadings(blocks, 3),
    intro: firstParagraph(blocks),
  };
}
