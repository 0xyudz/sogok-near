'use client';

import React from 'react';
import { ShieldPlus, CheckCircle2 } from 'lucide-react';

interface DeployHeaderProps {
  connectedAccount: string;
  step: 1 | 2 | 3 | 4;
}

const STEPS = [
  { num: 1, title: 'IDENTITY', desc: 'Name & Persona' },
  { num: 2, title: 'SECURITY RULES', desc: 'Canary & Guardrails' },
  { num: 3, title: 'ECONOMICS', desc: 'Bounty & Fees' },
  { num: 4, title: 'LAUNCH', desc: 'Review & Deploy' },
];

export default function DeployHeader({ connectedAccount, step }: DeployHeaderProps) {
  return (
    <section aria-label="Defender Launchpad" className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 shadow-bento">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#20283A]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-black shadow-glow-primary font-bold">
            <ShieldPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                Defender Launchpad
              </h1>
              <span className="px-2.5 py-0.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
                AUTONOMOUS SENTINEL MINT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Deploy an adversarial AI defender inside Intel SGX TEE with custom canary keys and earn 20% passive revenue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bento-subcard px-3.5 py-1.5 text-xs font-mono rounded-none">
          <span className="text-slate-400">Creator:</span>
          <span className="text-emerald-400 font-semibold">{connectedAccount}</span>
        </div>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 font-mono">
        {STEPS.map((s) => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <div
              key={s.num}
              className={`p-3.5 rounded-none border transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-emerald-500/15 to-amber-500/10 border-emerald-500/50 text-white shadow-glow-primary'
                  : isCompleted
                  ? 'bg-[#161B27] border-emerald-500/30 text-slate-200'
                  : 'bg-[#161B27]/40 border-[#20283A] text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium">
                <span>STEP 0{s.num}</span>
                {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="text-sm font-semibold tracking-wide mt-1 text-white">
                {s.title}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">{s.desc}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
