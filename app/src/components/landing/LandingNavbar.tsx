'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Zap, ArrowRight, BookOpen } from 'lucide-react';

interface LandingNavbarProps {
  onLaunchApp: (targetTab?: string) => void;
  onScrollToSection: (id: string) => void;
}

export default function LandingNavbar({
  onLaunchApp,
  onScrollToSection,
}: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#20283A]">
      <div className="w-full pl-2 pr-1.5 sm:pl-3 sm:pr-2 md:pl-5 md:pr-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center font-mono font-bold text-black text-[11px] shadow-glow-primary shrink-0">
            $GK
          </div>
          <span className="font-display font-bold text-base sm:text-lg tracking-tight hidden sm:inline-block whitespace-nowrap text-white">
            <span className="text-emerald-400">$SOGOK</span> Protocol
          </span>
        </div>

        {/* Center Navigation Menu */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-2 text-xs font-mono text-slate-300">
          <button
            type="button"
            onClick={() => onScrollToSection('problem')}
            className="px-2.5 py-1.5 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            The Problem
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('lifecycle')}
            className="px-2.5 py-1.5 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            4-Step Lifecycle
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('stack')}
            className="px-2.5 py-1.5 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            The Stack
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('honesty')}
            className="px-2.5 py-1.5 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            Honesty Boundary
          </button>
          <Link
            href="/docs"
            className="px-2.5 py-1.5 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3 text-emerald-400" />
            <span>Docs</span>
          </Link>
        </nav>

        {/* Right: TEE Status & Launch App Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden xl:flex items-center gap-2 bg-[#121622] border border-[#20283A] px-3 py-1 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse inline-block" />
            <span className="text-slate-400">TEE:</span>
            <span className="text-emerald-400 font-semibold">Intel SGX Live</span>
          </div>

          <button
            type="button"
            onClick={() => onLaunchApp('arena')}
            className="hidden lg:flex px-3 py-1.5 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-200 text-xs font-mono transition-colors items-center gap-1.5 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Arena Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => onLaunchApp('explore')}
            aria-label="Launch App - enter the $SOGOK dApp terminal"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-glow-primary flex items-center gap-1.5 cursor-pointer font-mono"
            title="Launch $SOGOK Cyber Terminal & dApp Features"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-2 pb-2 pt-0.5 border-t border-[#20283A]/60 scrollbar-none font-mono text-[11px]">
        {[
          { id: 'problem', label: 'The Problem' },
          { id: 'lifecycle', label: '4 Steps' },
          { id: 'stack', label: 'Stack' },
          { id: 'honesty', label: 'Honesty' },
          { id: 'sentinels', label: 'Sentinels' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onScrollToSection(item.id)}
            className="shrink-0 px-2.5 py-1 bg-[#161B27] border border-[#20283A] text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {item.label}
          </button>
        ))}
        <Link
          href="/docs"
          className="shrink-0 px-2.5 py-1 bg-[#161B27] border border-emerald-500/30 text-emerald-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
        >
          <BookOpen className="w-3 h-3" />
          <span>Docs</span>
        </Link>
      </div>
    </header>
  );
}
