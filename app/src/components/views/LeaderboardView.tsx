'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  ShieldAlert,
  ExternalLink,
  Clock,
  Filter,
} from 'lucide-react';
import {
  sogokClient,
  LeaderboardEntry,
  HistoricBreachItem,
} from '@/lib/near';

export default function LeaderboardView() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'weekly'>('all');
  const [breaches, setBreaches] = useState<HistoricBreachItem[]>([]);
  const [breachFilter, setBreachFilter] = useState<'all' | 'breaches' | 'defended'>('all');

  useEffect(() => {
    sogokClient.getLeaderboard(leaderboardFilter).then((data) => setLeaderboard(data));
  }, [leaderboardFilter]);

  useEffect(() => {
    sogokClient.getBreachHistory(breachFilter).then((data) => setBreaches(data));
  }, [breachFilter]);

  const formatTime = (ts: number): string => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <section aria-label="Leaderboard Hall of Fame" className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 shadow-bento font-mono">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#20283A]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-black shadow-glow-primary font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                  Red-Team Hall of Fame
                </h1>
                <span className="px-2.5 py-0.5 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-medium">
                  LEADERBOARD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Top adversarial security researchers, total $SOGOK burned, and verified TEE jailbreak history
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bento-subcard px-3.5 py-1.5 text-xs font-mono rounded-none">
            <span className="text-slate-400">Proof:</span>
            <span className="text-emerald-400 font-semibold">1 Jailbreak Disbursed</span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-semibold">99.7% Defended</span>
          </div>
        </div>

        {/* Top 3 Podium Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 font-mono">
          {leaderboard.slice(0, 3).map((entry, idx) => {
            const podiumColors = [
              { border: 'border-amber-500/50', badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', title: 'RANK #1 - GRANDMASTER' },
              { border: 'border-emerald-500/50', badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', title: 'RANK #2 - ADVERSARY' },
              { border: 'border-slate-500/50', badge: 'bg-white/10 text-slate-200 border border-white/20', title: 'RANK #3 - RED-TEAMER' },
            ][idx] || { border: 'border-[#20283A]', badge: 'bg-white/5 text-slate-300', title: `RANK #${idx + 1}` };

            return (
              <div
                key={entry.hacker_id}
                className={`bento-subcard rounded-none ${podiumColors.border} p-5 flex flex-col justify-between space-y-3`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`px-2.5 py-0.5 rounded-none text-[10px] font-semibold ${podiumColors.badge}`}>
                    {podiumColors.title}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTime(entry.last_active)}
                  </span>
                </div>
                <div>
                  <div className="font-mono text-base font-semibold text-white flex items-center gap-2">
                    <span>{entry.hacker_id}</span>
                    {entry.success_breaches > 0 && (
                      <span className="px-2 py-0.5 rounded-none bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                        BREACHER
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-3xl font-bold text-amber-400 tabular-nums mt-1">
                    {entry.total_burned} <span className="text-xs font-mono text-slate-400">$SOGOK</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Attempts: <strong className="text-white font-mono">{entry.attempts_count}</strong></span>
                  <span>Threat Score: <strong className="text-emerald-400 font-mono">{entry.highest_threat_score}/100</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Leaderboard Table */}
      <section aria-label="Prompt Burn Leaderboard" className="bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 shadow-bento font-mono">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#20283A] gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide">
              All-Time Prompt-Burn Leaderboard
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setLeaderboardFilter('all')}
              className={`px-3 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer ${
                leaderboardFilter === 'all'
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-primary'
                  : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => setLeaderboardFilter('weekly')}
              className={`px-3 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer ${
                leaderboardFilter === 'weekly'
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-primary'
                  : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
              }`}
            >
              This Week
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#20283A] text-slate-400 text-[11px] uppercase tracking-wider font-medium">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Hacker Address</th>
                <th className="pb-3">Total $SOGOK Burned</th>
                <th className="pb-3">Attempts</th>
                <th className="pb-3">Max Threat Score</th>
                <th className="pb-3">Breaches</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 pr-2 text-right">Explorer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20283A]/60">
              {leaderboard.map((entry) => (
                <tr key={entry.hacker_id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="py-3 pl-2 font-mono font-bold">
                    <span
                      className={`inline-block w-6 text-center ${
                        entry.rank === 1
                          ? 'text-amber-400 font-extrabold'
                          : entry.rank === 2
                          ? 'text-emerald-400 font-bold'
                          : entry.rank === 3
                          ? 'text-emerald-300 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {entry.hacker_id}
                  </td>
                  <td className="py-3 font-bold text-amber-400 tabular-nums">
                    {entry.total_burned} <span className="text-xs text-slate-500 font-normal">$SOGOK</span>
                  </td>
                  <td className="py-3 text-slate-300 tabular-nums">{entry.attempts_count}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[#161B27] rounded-none overflow-hidden border border-[#20283A]">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${entry.highest_threat_score}%` }}
                        />
                      </div>
                      <span className="text-emerald-400 font-semibold tabular-nums">
                        {entry.highest_threat_score}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    {entry.success_breaches > 0 ? (
                      <span className="px-2 py-0.5 rounded-none bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                        {entry.success_breaches} JAILBREAK
                      </span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                  <td className="py-3 text-slate-400 tabular-nums text-[11px]">
                    {formatTime(entry.last_active)}
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <a
                      href={`https://testnet.nearblocks.io/address/${entry.hacker_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors text-[11px]"
                      title="View on NearBlocks"
                    >
                      <span>NearBlocks</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Historic Breach & Defense Log */}
      <section aria-label="Historic Attestation Log" className="bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 shadow-bento font-mono">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#20283A] gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Historic Jailbreak & Defense Archive // TEE Proof Logs
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setBreachFilter('all')}
              className={`px-3 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer ${
                breachFilter === 'all'
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-primary'
                  : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
              }`}
            >
              All Attempts
            </button>
            <button
              onClick={() => setBreachFilter('breaches')}
              className={`px-3 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer ${
                breachFilter === 'breaches'
                  ? 'bg-amber-500 text-black font-bold shadow-glow-secondary'
                  : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
              }`}
            >
              Breaches
            </button>
            <button
              onClick={() => setBreachFilter('defended')}
              className={`px-3 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer ${
                breachFilter === 'defended'
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-primary'
                  : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
              }`}
            >
              Defended
            </button>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {breaches.map((item) => {
            const isBreach = item.verdict === 'JAILBROKEN';
            return (
              <div
                key={item.breach_id}
                className={`bento-subcard rounded-none p-4 space-y-2 text-xs transition-colors ${
                  isBreach ? 'border-amber-500/40 bg-amber-500/[0.03]' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#20283A]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold ${
                        isBreach
                          ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-black shadow-glow-primary'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.verdict}
                    </span>
                    <span className="font-semibold text-white">
                      Sentinel #{item.sentinel_id} ({item.sentinel_name})
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    {formatTime(item.timestamp)} • Attacker: <strong className="text-emerald-400">{item.attacker_id}</strong>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-slate-300 font-mono text-[11px]">
                  <div>
                    <span>Hash: </span>
                    <span className="text-slate-400">{item.prompt_hash.slice(0, 16)}...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://testnet.nearblocks.io/txns/${item.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Tx: {item.tx_hash.slice(0, 12)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
