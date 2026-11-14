'use client';

import React from 'react';
import { History, Flame, Clock, ExternalLink } from 'lucide-react';
import { PromptAttemptItem } from '@/lib/near';

interface PromptHistoryProps {
  attempts: PromptAttemptItem[];
}

export default function PromptHistory({ attempts }: PromptHistoryProps) {
  const formatTokens = (rawStr: string): string => {
    try {
      const val = BigInt(rawStr);
      const whole = val / BigInt(10 ** 18);
      return Number(whole).toLocaleString();
    } catch {
      return '5,000';
    }
  };

  const formatTime = (ts: number): string => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <section aria-label="On-chain Audit Trail" className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 mb-6 shadow-bento font-mono">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#20283A] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Recent Adversarial Attempts // On-Chain Audit Trail
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Every attack query burns $SOGOK and emits NEP-297 events recorded on NEAR Testnet
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
          Event: <code className="text-emerald-400 font-semibold">sogok_prompt_burn</code>
        </span>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#20283A] text-slate-400 text-[11px] uppercase tracking-wider font-medium">
              <th className="pb-3 pl-2">Attempt #</th>
              <th className="pb-3">Attacker</th>
              <th className="pb-3">Prompt Hash (SHA-256)</th>
              <th className="pb-3">Burned Amount</th>
              <th className="pb-3">Verdict</th>
              <th className="pb-3">Receipt</th>
              <th className="pb-3 pr-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#20283A]/60">
            {attempts.map((attempt) => (
              <tr key={attempt.prompt_hash} className="hover:bg-white/[0.03] transition-colors group">
                <td className="py-3 pl-2 text-slate-400">#{attempt.attempt_id}</td>
                <td className="py-3 font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">
                  {attempt.attacker_id}
                </td>
                <td className="py-3 text-slate-400">
                  <span className="bg-[#161B27] px-2 py-1 rounded-none border border-[#20283A]">
                    {attempt.prompt_hash.slice(0, 10)}...{attempt.prompt_hash.slice(-8)}
                  </span>
                </td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {formatTokens(attempt.burned_amount)} $SOGOK
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[11px] font-mono font-semibold ${
                      attempt.claimed
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-black font-bold uppercase shadow-glow-primary'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {attempt.claimed ? 'JAILBROKEN' : 'DEFENDED'}
                  </span>
                </td>
                <td className="py-3">
                  {attempt.tx_hash ? (
                    <a
                      href={`https://testnet.nearblocks.io/txns/${attempt.tx_hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 group font-mono text-[11px]"
                    >
                      <span>{attempt.tx_hash.slice(0, 10)}...</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-slate-500 font-mono text-[11px]">Verifying...</span>
                  )}
                </td>
                <td className="py-3 pr-2 text-right text-slate-400 text-[11px]">
                  <span className="inline-flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTime(attempt.timestamp)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
