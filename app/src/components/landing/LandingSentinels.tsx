'use client';

import React from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import { SentinelItem } from '@/lib/near';

interface LandingSentinelsProps {
  sentinels: SentinelItem[];
  onLaunchApp: (targetTab?: string) => void;
}

export default function LandingSentinels({
  sentinels,
  onLaunchApp,
}: LandingSentinelsProps) {
  return (
    <section id="sentinels" className="border-b border-[#20283A] py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-[#0B0E14]">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-emerald-400 text-xs uppercase tracking-[0.2em] font-medium">
              Live Hardware Guards
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Verified Enclave Sentinels
            </h2>
            <p className="text-slate-400 text-sm">
              Autonomous AI defense personas loaded in Intel SGX memory and available for live red-teaming.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onLaunchApp('explore')}
            className="px-4 py-2 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore All Sentinels ({sentinels.length})</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sentinels.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="border border-[#20283A] bg-[#0E121B] p-5 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">#{s.id}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold font-mono ${
                      s.threat_level === 'EXTREME'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : s.threat_level === 'CRITICAL'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {s.threat_level}
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-white">{s.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{s.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#20283A] font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">NEAR Bounty:</span>
                  <span className="font-bold text-amber-400">{s.near_bounty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Attack Fee:</span>
                  <span className="font-bold text-white">{s.attack_fee} $SOGOK</span>
                </div>

                <button
                  type="button"
                  onClick={() => onLaunchApp('arena')}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-90 text-black font-bold uppercase transition-all shadow-glow-primary flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Attack in Arena</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
