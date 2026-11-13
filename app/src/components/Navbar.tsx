'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Terminal,
  ShieldPlus,
  FlaskConical,
  FileCode2,
  ArrowLeftRight,
  Coins,
  Cpu,
  Wallet,
  Sparkles,
  Globe,
  BookOpen,
  Trophy,
} from 'lucide-react';

export type ActiveTab =
  | 'landing'
  | 'explore'
  | 'arena'
  | 'deploy'
  | 'practice'
  | 'evidence'
  | 'leaderboard'
  | 'verifier'
  | 'swap'
  | 'tokenomics';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  connectedAccount: string;
  onAccountChange: (account: string) => void;
  userBalance: string;
}

export default function Navbar({
  activeTab,
  onTabChange,
  connectedAccount,
  onAccountChange,
  userBalance,
}: NavbarProps) {
  const navTabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'explore', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { id: 'arena', label: 'Arena', icon: <Terminal className="w-4 h-4" /> },
    { id: 'deploy', label: 'Deploy Sentinel', icon: <ShieldPlus className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'evidence', label: 'Evidence', icon: <FileCode2 className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'verifier', label: 'Verifier', icon: <Cpu className="w-4 h-4" /> },
    { id: 'swap', label: 'Swap & Faucet', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'tokenomics', label: 'Tokenomics', icon: <Coins className="w-4 h-4" /> },
  ];

  const handleToggleAccount = () => {
    const nextAccount =
      connectedAccount === 'judge.testnet'
        ? 'sogok-protocol.testnet'
        : 'judge.testnet';
    onAccountChange(nextAccount);
  };

  const handleCustomAccount = () => {
    if (typeof window !== 'undefined') {
      const custom = window.prompt('Enter your NEAR Testnet Account ID (e.g. alice.testnet):', connectedAccount);
      if (custom && custom.trim()) {
        onAccountChange(custom.trim());
      }
    }
  };

  return (
    <header className="w-full bg-[#121622] border border-[#20283A] rounded-none p-4 md:p-5 mb-6 shadow-bento">
      {/* Top Protocol Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#20283A]">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => onTabChange('landing')}
            className="w-10 h-10 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center font-bold text-black text-sm font-mono shadow-glow-primary hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Return to $SOGOK Editorial Landing Page"
          >
            $GK
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                <span className="text-emerald-400">$SOGOK</span> Protocol
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
                <Sparkles className="w-3 h-3" />
                AI Red-Teaming
              </span>
              <button
                onClick={() => onTabChange('landing')}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-300 hover:text-white text-[11px] font-mono transition-all cursor-pointer"
                title="View Brainstorming & Architecture Landing Page"
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Editorial Landing</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Two-Sided Adversarial Marketplace • Intel SGX Hardware Enclaves • 40/40/20 Flywheel
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* TEE Enclave Status Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-[#161B27] border border-emerald-500/30 rounded-none px-3 py-1.5 text-slate-300">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse inline-block" />
            <span className="text-slate-400 text-[11px]">TEE:</span>
            <span className="text-emerald-400 font-semibold text-[11px]">Intel SGX Live</span>
          </div>

          {/* User $SOGOK Balance Chip */}
          <div className="bg-[#161B27] border border-amber-500/30 rounded-none px-3 py-1.5 flex items-center gap-1.5 text-amber-400">
            <Coins className="w-3.5 h-3.5" />
            <span className="text-slate-400 text-[11px]">Bal:</span>
            <span className="font-semibold font-mono tabular-nums text-xs">
              {userBalance} <span className="text-[10px] text-amber-500/80">$SOGOK</span>
            </span>
          </div>

          {/* Account Selector Pill */}
          <div className="bg-[#161B27] border border-[#20283A] rounded-none px-3 py-1.5 flex items-center gap-2 text-slate-200">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-xs font-medium">{connectedAccount}</span>
            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={handleToggleAccount}
                className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer font-medium"
                title="Click to cycle active testnet accounts"
              >
                Switch
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={handleCustomAccount}
                className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors cursor-pointer font-medium"
                title="Enter custom testnet account ID"
              >
                Custom
              </button>
            </div>
          </div>

          {/* Return to Landing Page Quick Button */}
          <button
            onClick={() => onTabChange('landing')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-300 hover:text-emerald-400 text-xs font-mono transition-colors cursor-pointer rounded-none"
            title="Return to Editorial Landing Page"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Landing</span>
          </button>
        </div>
      </div>

      {/* Cyber Brutalist Navigation Tabs Bento Row */}
      <nav className="flex items-center gap-1 pt-3 overflow-x-auto scrollbar-none font-mono">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-mono font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-black font-bold uppercase tracking-wider shadow-glow-primary'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}

        <Link
          href="/docs"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-mono font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap text-amber-400 hover:text-white hover:bg-white/5 border border-amber-400/30 ml-auto"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Docs & Specs</span>
        </Link>
      </nav>
    </header>
  );
}
