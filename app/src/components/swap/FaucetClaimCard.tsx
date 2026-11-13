'use client';

import React, { useState, useEffect } from 'react';
import {
  Coins,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { sogokClient, FaucetClaimResult } from '@/lib/near';

interface FaucetClaimCardProps {
  connectedAccount: string;
  onBalanceUpdated: () => void;
}

export default function FaucetClaimCard({
  connectedAccount,
  onBalanceUpdated,
}: FaucetClaimCardProps) {
  const [isClaimingFaucet, setIsClaimingFaucet] = useState<boolean>(false);
  const [faucetClaimResult, setFaucetClaimResult] = useState<FaucetClaimResult | null>(null);
  const [faucetCooldownRemaining, setFaucetCooldownRemaining] = useState<number>(0);
  const [faucetError, setFaucetError] = useState<string | null>(null);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  useEffect(() => {
    if (faucetCooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setFaucetCooldownRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [faucetCooldownRemaining]);

  const handleClaimFaucet = async () => {
    if (isClaimingFaucet || faucetCooldownRemaining > 0) return;
    setIsClaimingFaucet(true);
    setFaucetError(null);
    setFaucetClaimResult(null);

    try {
      const res = await sogokClient.claimFaucet(connectedAccount);
      setFaucetClaimResult(res);
      const remainingSeconds = Math.ceil((res.cooldownUntil - Date.now()) / 1000);
      setFaucetCooldownRemaining(Math.max(0, remainingSeconds));
      onBalanceUpdated();
    } catch (err: any) {
      setFaucetError(err.message || 'Faucet claim failed');
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <div className="bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 flex flex-col justify-between space-y-5 shadow-bento font-mono">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#20283A] text-xs">
          <span className="flex items-center gap-2 font-semibold text-white">
            <Coins className="w-4 h-4 text-amber-400" />
            Judge & Auditor Testnet Faucet
          </span>
          <span className="px-2.5 py-0.5 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-medium">
            RATE LIMIT: 60s
          </span>
        </div>

        <div className="space-y-4 pt-4 text-xs">
          <p className="text-slate-300 leading-relaxed font-sans">
            Evaluate the adversarial smart contract on live NEAR Testnet.
            Click below to trigger an on-chain testnet <code className="text-emerald-400 font-mono bg-emerald-500/10 px-1 py-0.5 rounded-none border border-emerald-500/30">ft_transfer</code> + storage registration.
          </p>

          {/* Faucet Payload Display Card */}
          <div className="bento-subcard p-4 space-y-3 rounded-none">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Grant Amount:</span>
              <span className="font-mono text-3xl font-bold text-amber-400 tabular-nums">
                50,000 <span className="text-sm text-amber-400/80">$SOGOK</span>
              </span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-white/5 pt-2">
              <span>Recipient Account:</span>
              <span className="text-white font-medium">{connectedAccount}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Burn Capability:</span>
              <span className="text-slate-300">10 Red-Teaming Attempts (5,000 each)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Storage Deposit:</span>
              <span className="text-emerald-400 font-medium">Automatically Registered</span>
            </div>
          </div>

          {/* Cooldown Machine Status */}
          <div className="p-3.5 bento-subcard flex items-center justify-between rounded-none">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Cooldown Status:</span>
            </div>
            {faucetCooldownRemaining > 0 ? (
              <span className="font-semibold text-rose-400 tabular-nums font-mono">
                Active ({faucetCooldownRemaining}s remaining)
              </span>
            ) : (
              <span className="font-semibold text-emerald-400">Ready to Claim</span>
            )}
          </div>

          {/* Faucet Error Message */}
          {faucetError && (
            <div className="p-3.5 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{faucetError}</span>
            </div>
          )}

          {/* Faucet Success Message */}
          {faucetClaimResult && (
            <div className="p-3.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 space-y-2 font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Faucet Transaction Confirmed</span>
              </div>
              <p className="text-slate-300 text-xs font-sans">{faucetClaimResult.message}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-emerald-500/20 font-mono">
                <a
                  href={`https://testnet.nearblocks.io/txns/${faucetClaimResult.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Tx: {faucetClaimResult.txHash.slice(0, 16)}...</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => copyToClipboard(faucetClaimResult.txHash)}
                  className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedTx === faucetClaimResult.txHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedTx === faucetClaimResult.txHash ? 'Copied' : 'Copy Tx'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Faucet Action Button */}
      <div className="pt-2 font-mono">
        <button
          onClick={handleClaimFaucet}
          disabled={isClaimingFaucet || faucetCooldownRemaining > 0}
          className={`w-full py-3.5 px-4 rounded-none font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isClaimingFaucet || faucetCooldownRemaining > 0
              ? 'bg-[#161B27] text-slate-500 border border-[#20283A] cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-primary'
          }`}
        >
          {isClaimingFaucet ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Broadcasting Testnet Grant...</span>
            </>
          ) : faucetCooldownRemaining > 0 ? (
            <>
              <Clock className="w-4 h-4" />
              <span>Cooldown ({faucetCooldownRemaining}s)</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>Claim 50,000 $SOGOK Testnet Grant</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
