'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, Key, ArrowRight, X, ExternalLink } from 'lucide-react';
import { sogokClient } from '@/lib/near';

interface BountyClaimModalProps {
  payload: any;
  signatureHex: string;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
  connectedAccount: string;
}

export default function BountyClaimModal({
  payload,
  signatureHex,
  onClose,
  onSuccess,
  connectedAccount,
}: BountyClaimModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleClaim = async () => {
    setIsSubmitting(true);
    try {
      const res = await sogokClient.claimBounty(payload, signatureHex, connectedAccount);
      setTxHash(res.txHash);
      setClaimSuccess(true);
      onSuccess(res.txHash);
    } catch (e: any) {
      alert(`Claim failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#121622] border border-[#20283A] rounded-none p-6 md:p-8 relative shadow-2xl font-mono">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-none bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-[#20283A]"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-[#20283A]">
          <div className="w-12 h-12 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-black shadow-glow-primary">
            <Award className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Critical Breach // TEE Attestation Proof Validated
              </h2>
              <span className="px-2 py-0.5 rounded-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Hardware enclave has signed an autonomous JAILBROKEN verdict for <span className="font-mono text-slate-200">{connectedAccount}</span>
            </p>
          </div>
        </div>

        {claimSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-none bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white font-mono">
              Autonomous Bounty Disbursed!
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
              Smart contract <code className="text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded-none border border-emerald-500/30">sogok-protocol.testnet</code> verified the Ed25519 hardware signature and released the NEAR treasury + $SOGOK jackpot to your account.
            </p>
            <div className="bento-subcard p-3.5 text-xs font-mono text-slate-400 max-w-md mx-auto flex items-center justify-between rounded-none">
              <span>On-Chain Receipt:</span>
              <a
                href={`https://testnet.nearblocks.io/txns/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1.5 font-mono"
              >
                <span>{txHash.slice(0, 16)}...</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-none bg-gradient-to-r from-emerald-500 to-amber-500 text-black font-bold uppercase tracking-wider text-xs transition-opacity hover:opacity-90 cursor-pointer shadow-glow-primary font-mono"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-5">
            {/* Payload Breakdown */}
            <div className="space-y-2 text-xs font-sans">
              <div className="bento-subcard p-4 space-y-2 font-mono rounded-none">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Verdict:</span>
                  <span className="text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded-none border border-emerald-500/30">
                    {payload.verdict}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Recipient:</span>
                  <span className="text-emerald-400 font-semibold">{payload.recipient}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Prompt Hash:</span>
                  <span className="text-slate-300 truncate max-w-xs">{payload.prompt_hash}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Enclave Quote:</span>
                  <span className="text-slate-400 truncate max-w-xs">{payload.measurement_quote_hash}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Anti-Replay Nonce:</span>
                  <span className="text-amber-400">{payload.nonce}</span>
                </div>
              </div>

              {/* Hardware Signature Quote */}
              <div className="bento-subcard p-4 space-y-1.5 font-mono rounded-none">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-slate-300 font-mono font-medium flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    Ed25519 Hardware Signature:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-none border border-emerald-500/30">
                    Hardware Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 break-all bg-black/40 p-2.5 rounded-none border border-[#20283A]">
                  {signatureHex}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 font-mono">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-none bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs transition-colors cursor-pointer border border-[#20283A]"
              >
                Cancel
              </button>
              <button
                onClick={handleClaim}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-none bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-glow-primary"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Disbursing On-Chain...</span>
                  </>
                ) : (
                  <>
                    <span>Claim Autonomous Bounty</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
