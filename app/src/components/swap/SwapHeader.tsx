'use client';

import React from 'react';
import { Droplets } from 'lucide-react';

interface SwapHeaderProps {
  connectedAccount: string;
  userBalance: string;
}

export default function SwapHeader({ connectedAccount, userBalance }: SwapHeaderProps) {
  return (
    <section aria-label="Swap & Faucet Hub" className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 shadow-bento">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#20283A]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-black shadow-glow-primary font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                1Click Swap & Testnet Faucet
              </h1>
              <span className="px-2.5 py-0.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
                NEAR INTENTS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Acquire $SOGOK via NEAR Intents solver network or claim instant testnet gas tokens for judge audits
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bento-subcard px-3.5 py-1.5 text-xs font-mono rounded-none">
          <span className="text-slate-400">Connected:</span>
          <span className="font-semibold text-emerald-400">{connectedAccount}</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Balance:</span>
          <span className="font-semibold text-amber-400 tabular-nums">{userBalance} $SOGOK</span>
        </div>
      </div>

      {/* Fast Action Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 text-xs font-mono">
        <div className="bento-subcard p-4 flex items-start gap-3 rounded-none">
          <span className="px-2 py-0.5 rounded-none bg-emerald-500/15 text-emerald-400 font-bold text-xs shrink-0 border border-emerald-500/30">
            INTENT
          </span>
          <p className="text-slate-300 leading-relaxed font-sans">
            1Click API constructs a cryptographically signed swap intent with automated solver routing.
            Zero slippage volatility and zero MEV frontrunning.
          </p>
        </div>
        <div className="bento-subcard p-4 flex items-start gap-3 rounded-none">
          <span className="px-2 py-0.5 rounded-none bg-amber-500/15 text-amber-400 font-bold text-xs shrink-0 border border-amber-500/30">
            FAUCET
          </span>
          <p className="text-slate-300 leading-relaxed font-sans">
            Hackathon judges can claim <strong className="text-white font-mono">50,000 $SOGOK</strong> every 60 seconds
            to burn against the adversarial TEE guardian without needing mainnet funds.
          </p>
        </div>
      </div>
    </section>
  );
}
