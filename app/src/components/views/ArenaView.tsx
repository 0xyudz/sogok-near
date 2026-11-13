'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ChevronDown,
} from 'lucide-react';
import BurnTicker from '@/components/BurnTicker';
import CyberTerminal from '@/components/CyberTerminal';
import TeeInspector from '@/components/TeeInspector';
import PromptHistory from '@/components/PromptHistory';
import { SogokStats, PromptAttemptItem, SentinelItem, sogokClient } from '@/lib/near';

interface ArenaViewProps {
  stats: SogokStats;
  connectedAccount: string;
  onJailbreakSuccess: (payload: any, signatureHex: string) => void;
  onAttemptBurned: () => void;
  recentAttempts: PromptAttemptItem[];
  selectedSentinelId?: number;
  initialPrompt?: string;
  onSelectSentinel?: (id: number) => void;
}

export default function ArenaView({
  stats,
  connectedAccount,
  onJailbreakSuccess,
  onAttemptBurned,
  recentAttempts,
  selectedSentinelId = 0,
  initialPrompt,
  onSelectSentinel,
}: ArenaViewProps) {
  const [sentinels, setSentinels] = useState<SentinelItem[]>([]);
  const [activeId, setActiveId] = useState<number>(selectedSentinelId);

  useEffect(() => {
    sogokClient.listSentinels().then((items) => {
      setSentinels(items);
    });
  }, []);

  useEffect(() => {
    if (selectedSentinelId !== undefined) {
      setActiveId(selectedSentinelId);
    }
  }, [selectedSentinelId]);

  const activeSentinel = sentinels.find((s) => s.id === activeId) || sentinels[0];

  const handleSwitchSentinel = (id: number) => {
    setActiveId(id);
    if (onSelectSentinel) onSelectSentinel(id);
  };

  return (
    <div className="space-y-6">
      {/* Contemporary Deflation Burn Ticker */}
      <BurnTicker stats={stats} />

      {/* Sentinel Switcher & Header Bar */}
      <section aria-label="Active Sentinel Target" className="bg-[#121622] border border-[#20283A] rounded-none p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-bento font-mono">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-black font-mono font-bold text-sm shadow-glow-primary">
            #{activeSentinel?.id ?? 0}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-medium text-slate-400">Target Sentinel:</span>
              <div className="relative inline-block">
                <select
                  value={activeId}
                  onChange={(e) => handleSwitchSentinel(Number(e.target.value))}
                  className="bg-[#161B27] border border-[#20283A] rounded-none px-3.5 py-1.5 text-white font-semibold text-xs focus:border-emerald-500 cursor-pointer pr-8 appearance-none transition-colors font-mono"
                >
                  {sentinels.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#121622] text-white">
                      #{s.id} {s.name} ({s.near_bounty} Vault)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Creator: <strong className="text-slate-200">{activeSentinel?.creator_id}</strong></span>
              <span>•</span>
              <span>Threat Level: <strong className="text-amber-400">{activeSentinel?.threat_level}</strong></span>
            </div>
          </div>
        </div>

        {/* Sentinel Live Bounty Summary Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bento-subcard px-3.5 py-2 flex items-center gap-2 rounded-none">
            <span className="text-slate-400">NEAR Vault:</span>
            <span className="text-amber-400 font-semibold font-mono tabular-nums">
              {activeSentinel?.near_bounty ?? '15.99 NEAR'}
            </span>
          </div>
          <div className="bento-subcard px-3.5 py-2 flex items-center gap-2 rounded-none">
            <span className="text-slate-400">Jackpot:</span>
            <span className="text-emerald-400 font-semibold font-mono tabular-nums">
              {activeSentinel?.token_bounty ?? '100M'} $SOGOK
            </span>
          </div>
          <div className="bento-subcard px-3.5 py-2 flex items-center gap-2 rounded-none">
            <span className="text-slate-400">Attack Fee:</span>
            <span className="text-amber-400 font-semibold font-mono tabular-nums">
              {activeSentinel?.attack_fee ?? '5,000'} $SOGOK
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Cyber Terminal + Hardware Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Terminal & Attack Console */}
        <div className="lg:col-span-2 space-y-6">
          <CyberTerminal
            onJailbreakSuccess={onJailbreakSuccess}
            onAttemptBurned={onAttemptBurned}
            guardianPublicKey={stats.guardian_public_key}
            connectedAccount={connectedAccount}
            targetSentinel={activeSentinel}
            initialPrompt={initialPrompt}
          />
        </div>

        {/* Right 1 Col: Enclave Telemetry & Tripartite Economics */}
        <div className="lg:col-span-1 space-y-6">
          <TeeInspector
            measurementQuoteHash={stats.measurement_quote_hash}
            guardianPublicKey={stats.guardian_public_key}
            enclaveProvider={stats.enclave_provider}
          />

          {/* Tripartite Economic Split Guide Card */}
          <div className="bg-[#121622] border border-[#20283A] rounded-none p-5 text-xs space-y-3.5 shadow-bento font-mono">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#20283A]">
              <div className="w-8 h-8 rounded-none bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Tripartite Economic Flywheel
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">Autonomous multi-stakeholder split</p>
              </div>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              Every attack fee submitted against Sentinel #{activeSentinel?.id ?? 0} is partitioned programmatically by the smart contract:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li className="flex items-start gap-2.5 bento-subcard p-3 rounded-none">
                <span className="px-2 py-0.5 rounded-none bg-amber-500/15 text-amber-400 font-mono font-bold text-xs shrink-0">
                  40%
                </span>
                <span>
                  <strong className="text-white block font-medium">Burned Permanently</strong>
                  <span className="text-slate-400 text-[11px]">Hyper-deflationary sink destroying circulating supply forever.</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5 bento-subcard p-3 rounded-none">
                <span className="px-2 py-0.5 rounded-none bg-emerald-500/15 text-emerald-400 font-mono font-bold text-xs shrink-0">
                  40%
                </span>
                <span>
                  <strong className="text-white block font-medium">Added to Jackpot</strong>
                  <span className="text-slate-400 text-[11px]">Grows this Sentinel&apos;s bounty pool for whoever finds the breach.</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5 bento-subcard p-3 rounded-none">
                <span className="px-2 py-0.5 rounded-none bg-slate-700/40 text-slate-200 font-mono font-bold text-xs shrink-0 border border-[#20283A]">
                  20%
                </span>
                <span>
                  <strong className="text-white block font-medium">Paid to Defender</strong>
                  <span className="text-slate-400 text-[11px]">Transferred directly to {activeSentinel?.creator_id ?? 'creator'} as passive revenue.</span>
                </span>
              </li>
            </ul>
            <div className="pt-3 border-t border-[#20283A] text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>ZERO OPERATOR KEYS</span>
              <span className="text-emerald-400 font-medium">INTEL SGX SIGNED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail: Recent Attacks */}
      <PromptHistory attempts={recentAttempts} />
    </div>
  );
}
