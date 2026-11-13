'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Zap,
  Search,
  Flame,
} from 'lucide-react';
import { SentinelItem, sogokClient } from '@/lib/near';

interface ExploreViewProps {
  onSelectSentinelForAttack: (sentinelId: number) => void;
  onSelectSentinelForPractice: (sentinelId: number) => void;
  onDeployClick: () => void;
}

export default function ExploreView({
  onSelectSentinelForAttack,
  onSelectSentinelForPractice,
  onDeployClick,
}: ExploreViewProps) {
  const [sentinels, setSentinels] = useState<SentinelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'highest_bounty' | 'most_attacked' | 'breached'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    sogokClient.listSentinels().then((items) => {
      setSentinels(items);
      setLoading(false);
    });
  }, []);

  const filteredSentinels = sentinels
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.creator_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.persona.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === 'breached') return s.is_breached;
      return true;
    })
    .sort((a, b) => {
      if (filter === 'highest_bounty') {
        const bNear = parseFloat(b.near_bounty.replace(/[^0-9.]/g, '')) || 0;
        const aNear = parseFloat(a.near_bounty.replace(/[^0-9.]/g, '')) || 0;
        return bNear - aNear;
      }
      if (filter === 'most_attacked') {
        return b.total_attacks - a.total_attacks;
      }
      return a.id - b.id;
    });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section aria-label="Sentinel Directory Banner" className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 shadow-bento">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#20283A]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-black shadow-glow-primary font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                  Red Sentinel Directory
                </h1>
                <span className="px-2.5 py-0.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
                  MULTI-SENTINEL REGISTRY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target high-bounty autonomous guardians or launch your own defender enclave on NEAR Testnet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDeployClick}
              className="px-5 py-2.5 rounded-none bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-glow-primary flex items-center gap-2 cursor-pointer font-mono"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Deploy Sentinel</span>
            </button>
          </div>
        </div>

        {/* Global Marketplace Telemetry */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div className="bento-subcard p-4 rounded-none">
            <div className="text-slate-400 text-xs font-mono font-medium">Active Sentinels</div>
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums py-0.5 font-mono">
              {sentinels.length}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono font-medium">Hardware Enclaves</div>
          </div>
          <div className="bento-subcard p-4 rounded-none">
            <div className="text-slate-400 text-xs font-mono font-medium">Combined NEAR Vaults</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums py-0.5 font-mono">
              18.99 NEAR
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Locked Bounty</div>
          </div>
          <div className="bento-subcard p-4 rounded-none">
            <div className="text-slate-400 text-xs font-mono font-medium">$SOGOK Jackpot Total</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums py-0.5 font-mono">
              100M+
            </div>
            <div className="text-[11px] text-slate-400 font-mono">40% Split Accrual</div>
          </div>
          <div className="bento-subcard p-4 rounded-none">
            <div className="text-slate-400 text-xs font-mono font-medium">Total Attempts Logged</div>
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums py-0.5 font-mono">
              12+
            </div>
            <div className="text-[11px] text-amber-400 font-mono">Permanent Burns</div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-[#121622] border border-[#20283A] rounded-none p-4 flex flex-wrap items-center justify-between gap-4 shadow-bento">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sentinels by name, creator, or role..."
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-none text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-emerald-500 text-black font-bold shadow-glow-primary'
                : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
            }`}
          >
            All ({sentinels.length})
          </button>
          <button
            onClick={() => setFilter('highest_bounty')}
            className={`px-3.5 py-1.5 rounded-none text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'highest_bounty'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
            }`}
          >
            Highest Bounty
          </button>
          <button
            onClick={() => setFilter('most_attacked')}
            className={`px-3.5 py-1.5 rounded-none text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'most_attacked'
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
            }`}
          >
            Most Attacked
          </button>
          <button
            onClick={() => setFilter('breached')}
            className={`px-3.5 py-1.5 rounded-none text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'breached'
                ? 'bg-amber-500 text-black font-bold shadow-glow-secondary'
                : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
            }`}
          >
            Breached
          </button>
        </div>
      </div>

      {/* Sentinel Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSentinels.map((sentinel) => {
          const isPrime = sentinel.id === 0;
          return (
            <div
              key={sentinel.id}
              className={`bg-[#121622] border rounded-none p-5 space-y-4 transition-all shadow-bento ${
                sentinel.is_breached
                  ? 'border-amber-500/40 bg-amber-500/[0.03]'
                  : isPrime
                  ? 'border-emerald-500/60 shadow-glow-primary'
                  : 'border-[#20283A] hover:border-emerald-500/40'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#20283A]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-none bg-[#161B27] border border-[#20283A] text-slate-300 font-semibold">
                      #{sentinel.id}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight font-mono">
                      {sentinel.name}
                    </h3>
                    {isPrime && (
                      <span className="px-2 py-0.5 rounded-none bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                        MASTER
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                    <span>by:</span>
                    <span className="text-slate-200 font-medium">{sentinel.creator_id}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{sentinel.persona}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="text-right space-y-1">
                  {sentinel.is_breached ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-none bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-semibold uppercase">
                      BREACHED
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded-none bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold uppercase">
                      ACTIVE DEFENDER
                    </span>
                  )}
                  <div className="text-[10px] text-slate-400 font-mono">
                    Threat Level: <span className="text-amber-400 font-semibold">{sentinel.threat_level}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                {sentinel.description}
              </p>

              {/* Bounties & Economics Grid */}
              <div className="grid grid-cols-2 gap-3 bento-subcard p-3.5 text-xs rounded-none">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono font-medium">Locked NEAR Bounty</div>
                  <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                    {sentinel.near_bounty}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono font-medium">$SOGOK Jackpot</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                    {sentinel.token_bounty}
                  </div>
                </div>
              </div>

              {/* Fee Split Specification Box */}
              <div className="bg-[#161B27] rounded-none border border-[#20283A] p-3 text-xs space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Attack Fee:</span>
                  <span className="font-semibold text-amber-400">{sentinel.attack_fee} $SOGOK</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#20283A] text-slate-400">
                  <span className="text-amber-400 font-medium">40% Burn</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">40% Jackpot Pool</span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">20% Defender</span>
                </div>
              </div>

              {/* Metrics & Hash info */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 font-mono">
                <div className="bento-subcard py-2 px-2 rounded-none">
                  <div className="text-[10px] text-slate-400">ATTACKS</div>
                  <div className="font-semibold text-white tabular-nums">{sentinel.total_attacks}</div>
                </div>
                <div className="bento-subcard py-2 px-2 rounded-none">
                  <div className="text-[10px] text-slate-400">SUCCESS</div>
                  <div className="font-semibold text-amber-400 tabular-nums">{sentinel.success_rate}</div>
                </div>
                <div className="bento-subcard py-2 px-2 rounded-none">
                  <div className="text-[10px] text-slate-400">LOCKUP</div>
                  <div className="font-semibold text-white tabular-nums">{sentinel.lockup_days}D</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#20283A] font-mono">
                <button
                  onClick={() => onSelectSentinelForPractice(sentinel.id)}
                  className="flex-1 py-2.5 rounded-none bg-[#161B27] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-[#20283A]"
                >
                  Test in Lab (Free)
                </button>
                <button
                  onClick={() => onSelectSentinelForAttack(sentinel.id)}
                  disabled={sentinel.is_breached}
                  className={`flex-1 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    sentinel.is_breached
                      ? 'bg-[#161B27] text-slate-600 border border-[#20283A] cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black shadow-glow-primary'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{sentinel.is_breached ? 'Breached' : 'Attack in Arena'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
