'use client';

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DeployStep3EconomicsProps {
  attackFee: number;
  setAttackFee: (val: number) => void;
  nearBounty: number;
  setNearBounty: (val: number) => void;
  lockupDays: number;
  setLockupDays: (val: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function DeployStep3Economics({
  attackFee,
  setAttackFee,
  nearBounty,
  setNearBounty,
  lockupDays,
  setLockupDays,
  onBack,
  onNext,
}: DeployStep3EconomicsProps) {
  return (
    <div className="space-y-6 max-w-2xl font-mono">
      <div className="border-b border-[#20283A] pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Bounty Vault & Defender Reward Economics
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          Configure your Sentinel&apos;s attack fee, initial vault collateral, and lockup duration.
        </p>
      </div>

      <div className="space-y-5 text-xs">
        <div className="space-y-2">
          <label className="text-slate-300 font-semibold">
            ATTACK FEE ($SOGOK PER ATTEMPT)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[5000, 10000, 25000].map((fee) => (
              <button
                key={fee}
                type="button"
                onClick={() => setAttackFee(fee)}
                className={`py-3 px-4 rounded-none text-center border font-semibold cursor-pointer transition-all ${
                  attackFee === fee
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm'
                    : 'bg-[#161B27] text-slate-300 border-[#20283A] hover:border-white/20'
                }`}
              >
                {fee.toLocaleString()} $SOGOK
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-slate-300 font-semibold">
            INITIAL NEAR BOUNTY DEPOSIT (ATTACHED YOCTONEAR)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[2.0, 5.0, 15.0].map((near) => (
              <button
                key={near}
                type="button"
                onClick={() => setNearBounty(near)}
                className={`py-3 px-4 rounded-none text-center border font-semibold cursor-pointer transition-all ${
                  nearBounty === near
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm'
                    : 'bg-[#161B27] text-slate-300 border-[#20283A] hover:border-white/20'
                }`}
              >
                {near.toFixed(1)} NEAR
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-slate-300 font-semibold">
            VAULT SURVIVOR LOCKUP DURATION
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setLockupDays(days)}
                className={`py-3 px-4 rounded-none text-center border font-semibold cursor-pointer transition-all ${
                  lockupDays === days
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm'
                    : 'bg-[#161B27] text-slate-300 border-[#20283A] hover:border-white/20'
                }`}
              >
                {days} DAYS
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-sans">
            If unbreached after {lockupDays} days, you can claim the Survivor Bounty (initial NEAR + all accrued jackpot earnings).
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-[#20283A] flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-none bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs transition-colors cursor-pointer flex items-center gap-2 border border-[#20283A]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-none bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-2 shadow-glow-primary"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
