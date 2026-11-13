import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Terminal, Zap, Shield, ExternalLink } from "lucide-react";
import { MarkdownDocument } from "@/components/markdown/MarkdownDocument";
import { DOCS, findDoc, loadDoc } from "@/server/data/docs";

export const dynamic = "force-static";

export function generateStaticParams(): Array<{ slug: string }> {
  return DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = findDoc(params.slug);
  if (!entry) return { title: "Document Not Found // $SOGOK Protocol" };
  return {
    title: `${entry.title} // $SOGOK Protocol`,
    description: entry.summary,
  };
}

export default async function DocSlugPage({ params }: { params: { slug: string } }) {
  const entry = findDoc(params.slug);
  if (!entry) notFound();

  const doc = loadDoc(entry);
  const index = DOCS.findIndex((item) => item.slug.toLowerCase() === entry.slug.toLowerCase());
  const previous = index > 0 ? DOCS[index - 1] : undefined;
  const next = index >= 0 && index < DOCS.length - 1 ? DOCS[index + 1] : undefined;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#20283A]">
        <div className="w-full px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
          {/* Pojok Kiri: Back to Docs & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Docs</span>
            </Link>
            <span className="text-slate-600">/</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400 font-semibold">{entry.title}</span>
            </div>
          </div>

          {/* Pojok Kanan Atas: Launch App button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Cyber Terminal</span>
            </Link>

            <Link
              href="/"
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-90 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-glow-primary flex items-center gap-1.5 font-mono"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch App</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 w-full flex-1 grid gap-8 lg:gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left Sticky Sidebar: Table of Contents */}
        <aside className="lg:sticky lg:top-20 lg:self-start border border-[#20283A] bg-[#0E121B] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#20283A] mb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Table of Contents</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">{entry.eyebrow}</span>
          </div>

          {/* Headings Links */}
          <nav className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin">
            {doc.headings.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono italic">No section anchors.</p>
            ) : (
              doc.headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`block py-1 text-xs transition-colors hover:text-emerald-300 font-mono ${
                    heading.depth === 3
                      ? "pl-4 text-slate-400 hover:text-amber-300 border-l border-[#20283A]/70"
                      : "text-slate-300 font-medium"
                  }`}
                >
                  <span className="text-emerald-500/70 mr-1.5 select-none">
                    {heading.depth === 3 ? "›" : "•"}
                  </span>
                  <span>{heading.text}</span>
                </a>
              ))
            )}
          </nav>

          {/* Quick Doc Navigation */}
          <div className="mt-6 pt-4 border-t border-[#20283A]">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-2">
              All Documentation
            </p>
            <div className="space-y-1">
              {DOCS.map((d) => (
                <Link
                  key={d.slug}
                  href={`/docs/${d.slug}`}
                  className={`block text-[11px] font-mono py-1 transition-colors ${
                    d.slug === entry.slug
                      ? "text-emerald-400 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {d.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Article Area */}
        <article className="min-w-0 bg-[#0E121B] border border-[#20283A] p-6 sm:p-10">
          {/* Document Header Eyebrow */}
          <div className="mb-6 pb-6 border-b border-[#20283A] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                {entry.eyebrow}
              </span>
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                Source: <span className="text-slate-200">{entry.file}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#161B27] border border-[#20283A] text-slate-300 font-mono text-[11px]">
                0-RADIUS SPEC
              </span>
            </div>
          </div>

          {/* Rendered AST Markdown */}
          <MarkdownDocument blocks={doc.blocks} />

          {/* Bottom Pagination (Previous / Next) */}
          <nav className="mt-14 pt-8 border-t border-[#20283A] grid gap-4 sm:grid-cols-2 font-mono">
            {previous ? (
              <Link
                href={`/docs/${previous.slug}`}
                className="group border border-[#20283A] bg-[#121622] hover:border-emerald-500/40 p-4 transition-colors"
              >
                <div className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                  <ArrowLeft className="w-3 h-3" />
                  <span>Previous Document</span>
                </div>
                <div className="text-sm font-semibold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  {previous.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="group border border-[#20283A] bg-[#121622] hover:border-amber-500/40 p-4 transition-colors sm:text-right"
              >
                <div className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1 justify-end group-hover:text-amber-400 transition-colors">
                  <span>Next Document</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
                <div className="text-sm font-semibold text-white mt-1 group-hover:text-amber-300 transition-colors">
                  {next.title}
                </div>
              </Link>
            ) : null}
          </nav>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#20283A] py-8 text-center font-mono text-xs text-slate-500 bg-[#080A0F]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 inline-block" />
            <span>$SOGOK Protocol — Multi-Sentinel AI Red-Teaming on NEAR</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Terminal</Link>
            <Link href="/docs" className="hover:text-emerald-400 transition-colors">Docs</Link>
            <a
              href="https://testnet.nearblocks.io/address/sogok-protocol.testnet"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>NEARBlocks</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
