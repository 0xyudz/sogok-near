import Link from "next/link";
import { Terminal, Shield, ArrowRight, Zap, ExternalLink, BookOpen } from "lucide-react";
import { DOCS } from "@/server/data/docs";

export const metadata = {
  title: "Documentation & Technical Specs // $SOGOK Protocol",
  description:
    "Authoritative engineering specifications for the $SOGOK Protocol: crowdsourced red-teaming, Intel SGX attestation, tokenomics flywheel, and deploy runbooks.",
};

export default function DocsIndexPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#20283A]">
        <div className="w-full px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
          {/* Pojok Kiri: Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center font-mono font-bold text-black text-xs shadow-glow-primary">
                $GK
              </div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight">
                <span className="text-emerald-400">$SOGOK</span> Protocol
              </span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Documentation</span>
          </div>

          {/* Pojok Kanan Atas: Quick Links & Launch App */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#121622] border border-[#20283A] px-3 py-1 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 bg-emerald-400 animate-pulse inline-block" />
              <span>TEE SGX LIVE</span>
            </div>

            <Link
              href="/"
              className="px-3 py-1.5 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cyber Terminal</span>
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

      {/* Hero Header */}
      <section className="border-b border-[#20283A] bg-gradient-to-b from-[#101522] to-[#0B0E14] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-[0.2em] mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Specifications & Verifiable Proofs</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
            The documents that ship with the protocol.
          </h1>
          <p className="mt-5 max-w-3xl text-slate-400 text-sm sm:text-base leading-relaxed">
            These are the source markdown files in <code className="font-mono text-emerald-300 bg-[#161B27] px-1.5 py-0.5 border border-[#20283A]">docs/</code> rendered directly with our zero-dependency parser. Every specification, tokenomic split, TEE hardware quote, and failure policy is published openly without intermediary sanitization.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs font-mono">
            <div className="bg-[#10141E] border border-[#20283A] px-3.5 py-2 flex items-center gap-2">
              <span className="text-slate-500">CONTRACT:</span>
              <span className="text-emerald-400">sogok-protocol.testnet</span>
            </div>
            <div className="bg-[#10141E] border border-[#20283A] px-3.5 py-2 flex items-center gap-2">
              <span className="text-slate-500">TEE ENCLAVE:</span>
              <span className="text-amber-400">Intel SGX / NEAR AI Cloud</span>
            </div>
            <div className="bg-[#10141E] border border-[#20283A] px-3.5 py-2 flex items-center gap-2">
              <span className="text-slate-500">STANDARD:</span>
              <span className="text-cyan-400">NEP-141 + NEP-297</span>
            </div>
          </div>
        </div>
      </section>

      {/* Document Grid */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 w-full flex-1">
        <div className="grid gap-5 md:grid-cols-2">
          {DOCS.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group border border-[#20283A] bg-[#0E121B] hover:border-emerald-500/50 hover:bg-[#121724] p-6 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-emerald-400/90 font-medium">
                    {doc.eyebrow}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 group-hover:text-emerald-400 transition-colors">
                    {doc.file}
                  </span>
                </div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                  {doc.title}
                </h2>
                <p className="mt-3 text-slate-400 text-xs sm:text-[13.5px] leading-relaxed">
                  {doc.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#20283A]/70 flex items-center justify-between font-mono text-xs">
                <span className="text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5 font-semibold">
                  <span>Read Specification</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-slate-500 text-[11px]">0-Radius AST</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Reading Order Guide */}
        <div className="mt-12 border border-[#20283A] bg-[#0E121B] p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400 mb-2">
            <Shield className="w-4 h-4" />
            <span>Recommended Reading Sequence</span>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
            Navigating the Architecture in 10 Minutes
          </h3>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-4xl">
            If you are evaluating $SOGOK for technical judging or security auditing, start with{" "}
            <Link href="/docs/implementation" className="text-emerald-400 underline decoration-emerald-400/40 hover:text-emerald-300">
              Implementation Reference
            </Link>{" "}
            to examine how Intel SGX canary isolation prevents prompt leakages and why the 40/40/20 tripartite flywheel creates sustainable deflation. Then read the{" "}
            <Link href="/docs/integrations" className="text-amber-400 underline decoration-amber-400/40 hover:text-amber-300">
              Integrations & Proof Table
            </Link>{" "}
            for verifiable NEAR testnet transaction hashes.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
            <Link
              href="/docs/implementation"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase transition-colors"
            >
              Start With Implementation →
            </Link>
            <Link
              href="/docs/integrations"
              className="px-4 py-2 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-200 transition-colors"
            >
              Inspect Proof Table
            </Link>
            <Link
              href="/docs/deploy"
              className="px-4 py-2 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-200 transition-colors"
            >
              Deployment Runbook
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#20283A] py-8 text-center font-mono text-xs text-slate-500 bg-[#080A0F]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 inline-block" />
            <span>$SOGOK Protocol — Adversarial AI Red-Teaming on NEAR</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Terminal</Link>
            <Link href="/docs" className="hover:text-emerald-400 transition-colors">Docs</Link>
            <a href="https://testnet.nearblocks.io/address/sogok-protocol.testnet" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <span>NEARBlocks</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
