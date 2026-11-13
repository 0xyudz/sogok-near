'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { SentinelItem } from '@/lib/near';

interface DeployStep4ReviewProps {
  name: string;
  connectedAccount: string;
  nearBounty: number;
  attackFee: number;
  lockupDays: number;
  canaryHash: string;
  isDeploying: boolean;
  deployedSentinel: SentinelItem | null;
  txReceipt: string;
  onBack: () => void;
  onLaunch: () => void;
}

export default function DeployStep4Review({
  name,
  connectedAccount,
  nearBounty,
  attackFee,
  lockupDays,
  canaryHash,
  isDeploying,
  deployedSentinel,
  txReceipt,
  onBack,
  onLaunch,
}: DeployStep4ReviewProps) {
  return (
    <div className="space-y-6 max-w-2xl font-mono">
      <div className="border-b border-[#20283A] pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Review & Deploy On-Chain
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          Review the tripartite economic split and lock your Sentinel into NEAR Protocol & Intel SGX.
        </p>
      </div>

      {/* Tripartite Breakdown Box */}
      <div className="bento-subcard p-5 space-y-3.5 text-xs rounded-none">
        <div className="text-slate-400 font-medium flex items-center justify-between">
          <span>Tripartite Revenue Split Per Attack ({attackFee.toLocaleString()} $SOGOK)</span>
          <span className="text-emerald-400 font-semibold text-[11px]">100% PROGRAMMATIC</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#121622] rounded-none border border-amber-500/30 p-3">
            <div className="text-amber-400 font-bold text-base">40% BURN</div>
            <div className="text-white font-semibold tabular-nums mt-0.5">
              {(attackFee * 0.4).toLocaleString()} $SOGOK
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-sans">Permanent Deflation</div>
          </div>
          <div className="bg-[#121622] rounded-none border border-emerald-500/30 p-3">
            <div className="text-emerald-400 font-bold text-base">40% JACKPOT</div>
            <div className="text-white font-semibold tabular-nums mt-0.5">
              {(attackFee * 0.4).toLocaleString()} $SOGOK
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-sans">Bounty Growth</div>
          </div>
          <div className="bg-[#121622] rounded-none border border-[#20283A] p-3">
            <div className="text-slate-200 font-bold text-base">20% DEFENDER</div>
            <div className="text-white font-semibold tabular-nums mt-0.5">
              {(attackFee * 0.2).toLocaleString()} $SOGOK
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-sans">Creator Income</div>
          </div>
        </div>
      </div>

      {/* Deployment Summary */}
      <div className="bento-subcard p-5 space-y-2.5 text-xs rounded-none">
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Sentinel Name:</span>
          <span className="font-semibold text-white">{name}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Creator Account:</span>
          <span className="font-semibold text-emerald-400">{connectedAccount}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Initial Vault Deposit:</span>
          <span className="font-semibold text-amber-400">{nearBounty.toFixed(1)} NEAR</span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Survivor Lockup:</span>
          <span className="font-semibold text-white">{lockupDays} Days</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Canary Hash:</span>
          <span className="text-[11px] text-slate-300 truncate max-w-[280px]">
            {canaryHash || 'Generating...'}
          </span>
        </div>
      </div>

      {/* Success Receipt State */}
      {deployedSentinel && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-none p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sentinel Deployed Successfully on NEAR!</span>
          </div>
          <div className="text-slate-300 font-sans">
            Sentinel <strong className="text-white font-mono">{deployedSentinel.name}</strong> is now live on-chain with ID <strong className="text-emerald-400 font-mono">#{deployedSentinel.id}</strong>.
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            Tx Receipt: <span className="text-slate-300">{txReceipt}</span>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="pt-4 border-t border-[#20283A] flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isDeploying || !!deployedSentinel}
          className="px-5 py-2.5 rounded-none bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs transition-colors cursor-pointer flex items-center gap-2 border border-[#20283A]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {!deployedSentinel ? (
          <button
            type="button"
            onClick={onLaunch}
            disabled={isDeploying}
            className="px-8 py-3 rounded-none bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-2 shadow-glow-primary disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Deploying Sentinel On-Chain...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch Sentinel ({nearBounty.toFixed(1)} NEAR)</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-none bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
          >
            Deploy Another Sentinel
          </button>
        )}
      </div>
    </div>
  );
}
