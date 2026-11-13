'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function LandingProblem() {
  return (
    <section id="problem" className="border-b border-[#20283A] py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-[#0D111A]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-emerald-400 text-xs uppercase tracking-[0.2em] font-medium">
            The Fundamental Problem
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            A memecoin without utility is an inevitable dump.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every day, thousands of tokens launch on automated bonding curves. 99.8% die within 72 hours because their only mechanic is extraction: early buyers dumping on late buyers with zero structural utility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="border border-red-500/30 bg-[#120F16] p-6 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>The Traditional Memecoin Pattern</span>
            </div>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400">✕</span>
                <span>Purely speculative pump-and-dump mechanics with zero external cash flows.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✕</span>
                <span>Tokens are hoarded or dumped; they do not perform work or trigger verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✕</span>
                <span>Safety claims rely on subjective human audits that are static and easily gamed.</span>
              </li>
            </ul>
          </div>

          <div className="border border-emerald-500/40 bg-[#0B1516] p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>The $SOGOK Adversarial Marketplace</span>
            </div>
            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Every attack probe burns 40% of fees permanently, locking deflation into market velocity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Model defenders earn 20% passive creator yield for hardening autonomous AI guards.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Intel SGX hardware attestation releases bounties without human bias or multisig delay.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
