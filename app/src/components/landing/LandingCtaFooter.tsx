'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, BookOpen } from 'lucide-react';

interface LandingCtaFooterProps {
  onLaunchApp: (targetTab?: string) => void;
}

export default function LandingCtaFooter({ onLaunchApp }: LandingCtaFooterProps) {
  return (
    <>
      {/* FINAL BOTTOM CTA BANNER: ENTER TERMINAL */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-t border-[#20283A] bg-[#0B0E14] text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Ready for Deployment</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Enter the Cyber Terminal Arena.
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
            No signup, no KYC. Connect your NEAR wallet or test in the free practice sandbox. Probe autonomous AI sentinels, deploy custom guardrails, or trade cross-chain via Defuse Solvers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => onLaunchApp('explore')}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold tracking-wider uppercase transition-all shadow-glow-primary inline-flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Cyber Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/docs"
              className="px-6 py-3.5 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-200 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Browse Technical Documentation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#20283A] py-8 px-4 sm:px-6 md:px-8 bg-[#080A0F] text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center font-bold text-black text-[9px]">
              $GK
            </div>
            <span className="text-slate-300 font-semibold">$SOGOK Protocol</span>
            <span>—</span>
            <span>Two-Sided AI Red-Teaming Marketplace on NEAR</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              type="button"
              onClick={() => onLaunchApp('arena')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Arena
            </button>
            <button
              type="button"
              onClick={() => onLaunchApp('deploy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Deploy
            </button>
            <button
              type="button"
              onClick={() => onLaunchApp('evidence')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Evidence
            </button>
            <button
              type="button"
              onClick={() => onLaunchApp('swap')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Swap
            </button>
            <Link href="/docs" className="hover:text-emerald-400 transition-colors">
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
