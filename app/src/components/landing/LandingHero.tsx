'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Terminal, BookOpen, ExternalLink } from 'lucide-react';

interface ProofData {
  measurement: string;
  guardianKey: string;
  contractId: string;
  totalBurned: string;
  blockHeight: string;
  verifiedSpec: string;
}

interface LandingHeroProps {
  proof: ProofData;
  onLaunchApp: (targetTab?: string) => void;
}

export default function LandingHero({ proof, onLaunchApp }: LandingHeroProps) {
  return (
    <section className="border-b border-[#20283A] bg-gradient-to-b from-[#101522] via-[#0B0E14] to-[#0B0E14] py-14 sm:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
        {/* Left Column: Headlines & Editorial Copy */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEAR HACKATHON // TRACK: MEMECOINS WITH MECHANICS</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
            The First Memecoin Backed by Adversarial AI Red-Teaming.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            A memecoin is usually a vanity token. <span className="text-emerald-400 font-semibold">$SOGOK</span> turns every trade into a verifiable security probe: burn tokens to exploit autonomous AI agents in Intel SGX, or deploy your own sentinel to earn defender royalties.
          </p>

          {/* Badges Strip */}
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
            <span className="px-2.5 py-1 bg-[#141926] border border-[#20283A] text-slate-300">
              NEP-141 Deflationary Burn
            </span>
            <span className="px-2.5 py-1 bg-[#141926] border border-[#20283A] text-emerald-400">
              Intel SGX Enclave
            </span>
            <span className="px-2.5 py-1 bg-[#141926] border border-[#20283A] text-amber-400">
              Defuse 1Click API
            </span>
            <span className="px-2.5 py-1 bg-[#141926] border border-[#20283A] text-cyan-400">
              40/40/20 Tripartite Split
            </span>
          </div>

          {/* Hero Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3 font-mono text-xs">
            <button
              type="button"
              onClick={() => onLaunchApp('arena')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold uppercase transition-all shadow-glow-primary flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>Enter Terminal Arena →</span>
            </button>

            <button
              type="button"
              onClick={() => onLaunchApp('practice')}
              className="px-5 py-3 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Practice Lab</span>
            </button>

            <Link
              href="/docs/implementation"
              className="px-5 py-3 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-amber-400 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Read Security Specs</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Live TEE Attestation Proof Card */}
        <div className="border border-[#20283A] bg-[#0E121B] p-6 sm:p-7 space-y-5 shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#20283A]">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
              <span>Recorded on NEAR Testnet</span>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase font-bold">
              Hardware Verified
            </span>
          </div>

          <dl className="space-y-4 font-mono text-xs">
            <div>
              <dt className="text-slate-500 text-[11px] uppercase tracking-wider">Intel SGX Measurement Hash (MRENCLAVE)</dt>
              <dd className="text-emerald-400 mt-1 break-all bg-[#090C12] p-2 border border-[#20283A]">
                {proof.measurement}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500 text-[11px] uppercase tracking-wider">Guardian Public Key (Ed25519 Dalek)</dt>
              <dd className="text-amber-400 mt-1 break-all bg-[#090C12] p-2 border border-[#20283A]">
                {proof.guardianKey}
              </dd>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-slate-500 text-[11px] uppercase tracking-wider">Live Contract</dt>
                <dd className="text-white mt-1 font-semibold">{proof.contractId}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-[11px] uppercase tracking-wider">Total Burned On-chain</dt>
                <dd className="text-red-400 mt-1 font-semibold">{proof.totalBurned}</dd>
              </div>
            </div>

            <div className="pt-2 border-t border-[#20283A] flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Explorer Receipt</span>
              <a
                href={`https://testnet.nearblocks.io/address/${proof.contractId}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 text-[11px]"
              >
                <span>Verify on NEARBlocks</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
