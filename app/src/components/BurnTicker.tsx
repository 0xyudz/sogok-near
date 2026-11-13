'use client';

import React from 'react';
import { Flame, Coins, ShieldAlert, Award, Sparkles } from 'lucide-react';
import { SogokStats } from '@/lib/near';

interface BurnTickerProps {
  stats: SogokStats;
}

export default function BurnTicker({ stats }: BurnTickerProps) {
  // Convert 18 decimals to human readable
  const formatTokens = (rawStr: string): string => {
    try {
      const val = BigInt(rawStr);
      const whole = val / BigInt(10 ** 18);
      return Number(whole).toLocaleString();
    } catch {
      return '0';
    }
  };

  const formatNear = (yoctoStr: string): string => {
    try {
      const yocto = BigInt(yoctoStr);
      const nearVal = Number(yocto) / 1e24;
      return nearVal.toFixed(2);
    } catch {
      return '0.00';
    }
  };

  const burnedAmountNum = Number(BigInt(stats.total_burned || '0') / BigInt(10 ** 18));
  const initialSupplyNum = Number(BigInt(stats.initial_supply || '1000000000000000000000000000') / BigInt(10 ** 18));
  const burnPercent = ((burnedAmountNum / (initialSupplyNum || 1)) * 100).toFixed(2);

  return (
    <section aria-label="Protocol Metrics" className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 mb-6 shadow-bento">
      {/* Header telemetry bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#20283A]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 bg-emerald-400 animate-pulse inline-block" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 font-mono">
            NEP-141 Deflationary Flywheel
            <span className="px-2 py-0.5 rounded-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
              ACTIVE
            </span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            Standard: <span className="font-mono text-slate-200">NEP-141 + NEP-297</span>
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            Attempts: <span className="font-mono font-semibold text-amber-400">{stats.total_attempts}</span>
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            Enclave: <span className="font-mono text-emerald-400 font-medium">NEAR AI Cloud TEE</span>
          </span>
        </div>
      </div>

      {/* Main Bento Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
        {/* Total Burned */}
        <div className="bento-subcard p-4 rounded-none flex flex-col justify-between group hover:border-amber-500/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium tracking-wide">
              <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              Total $SOGOK Burned
            </span>
            <span className="px-1.5 py-0.5 rounded-none bg-amber-500/15 text-amber-400 text-[10px] font-mono font-semibold">
              40% BURN
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white py-1">
            {formatTokens(stats.total_burned)}
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Burn Ratio:</span>
            <span className="text-amber-400 font-mono font-semibold">{burnPercent}% of cap</span>
          </div>
        </div>

        {/* Circulating Supply */}
        <div className="bento-subcard p-4 rounded-none flex flex-col justify-between group hover:border-emerald-500/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium tracking-wide">
              <Coins className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              Circulating Supply
            </span>
            <span className="px-1.5 py-0.5 rounded-none bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-semibold">
              NEP-141
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white py-1">
            {formatTokens(stats.total_supply)}
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Genesis Cap:</span>
            <span className="text-slate-300 font-mono">1,000,000,000</span>
          </div>
        </div>

        {/* Autonomous Treasury Jackpot (NEAR) */}
        <div className="bento-subcard p-4 rounded-none flex flex-col justify-between group hover:border-emerald-500/40 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium tracking-wide">
              <Award className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              Treasury Bounty (NEAR)
            </span>
            <span className="px-1.5 py-0.5 rounded-none bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-semibold">
              AUTONOMOUS
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white py-1 flex items-baseline gap-1.5">
            <span className="text-emerald-400">{formatNear(stats.near_treasury_bounty)}</span>
            <span className="text-lg font-mono text-slate-400 font-normal">NEAR</span>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Vault Status:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-400 inline-block" />
              {stats.bounty_won ? 'Claimed' : 'Locked in TEE'}
            </span>
          </div>
        </div>

        {/* Token Jackpot Bonus */}
        <div className="bento-subcard p-4 rounded-none flex flex-col justify-between group hover:border-amber-500/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium tracking-wide">
              <ShieldAlert className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              Token Jackpot ($SOGOK)
            </span>
            <span className="px-1.5 py-0.5 rounded-none bg-amber-500/15 text-amber-400 text-[10px] font-mono font-semibold">
              +40% ACCRUAL
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-amber-400 py-1">
            {formatTokens(stats.token_bounty_jackpot)}
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Min Burn / Attack:</span>
            <span className="text-slate-300 font-mono font-medium">5,000 $SOGOK</span>
          </div>
        </div>
      </div>

      {/* Deflation Visual Meter */}
      <div className="mt-5 pt-4 border-t border-[#20283A] flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <span className="text-xs text-slate-400 whitespace-nowrap font-medium flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Supply Deflation Progress:
          </span>
        </div>
        <div className="flex-1 h-2 bg-[#161B27] rounded-none relative overflow-hidden border border-[#20283A]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-none transition-all duration-700 shadow-glow-primary"
            style={{ width: `${Math.max(2, Math.min(100, Number(burnPercent) * 2))}%` }}
          />
        </div>
        <span className="text-xs font-mono font-semibold text-emerald-400 self-end sm:self-center">
          {burnPercent}% BURNED
        </span>
      </div>
    </section>
  );
}
