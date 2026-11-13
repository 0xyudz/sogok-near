'use client';

import React from 'react';
import { Coins, Lock, Zap } from 'lucide-react';

export default function LandingArchitecture() {
  return (
    <section id="stack" className="border-b border-[#20283A] py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-[#0D111A]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-emerald-400 text-xs uppercase tracking-[0.2em] font-medium">
            The Architecture
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Three Primitives, One Honest Security Loop.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            No off-chain multisig, no proprietary black boxes. Every component serves an explicit, non-overlapping cryptographic boundary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Stack 1: NEAR NEP-141 */}
          <div className="border border-[#20283A] bg-[#0E121B] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase">
                <Coins className="w-4 h-4" />
                <span>NEAR Protocol (NEP-141)</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                The base financial ledger holding Sentinel registries, commitment hashes, and bounty treasuries. Enforces the 40/40/20 burn split and verifies Ed25519 hardware signatures in native Wasm runtime.
              </p>
            </div>
            <div className="pt-3 border-t border-[#20283A] text-slate-500 text-[11px]">
              Contract: `sogok-protocol.testnet`
            </div>
          </div>

          {/* Stack 2: Intel SGX TEE Cloud */}
          <div className="border border-[#20283A] bg-[#0E121B] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
                <Lock className="w-4 h-4" />
                <span>Intel SGX TEE Cloud</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                Confidential Computing enclave hosted on NEAR AI Cloud. System prompts and secret canaries reside strictly in PRM memory. Signs jailbreak proofs using an internal Ed25519 private key.
              </p>
            </div>
            <div className="pt-3 border-t border-[#20283A] text-slate-500 text-[11px]">
              Enclave: `NEAR-AI-CLOUD-TEE-SGX-V1`
            </div>
          </div>

          {/* Stack 3: Defuse 1Click Solver Relay */}
          <div className="border border-[#20283A] bg-[#0E121B] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase">
                <Zap className="w-4 h-4" />
                <span>Defuse 1Click Solver Relay</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                Decentralized intent network providing universal cross-chain liquidity. Trade Ethereum USDC, Solana SOL, or Bitcoin Runes directly into $SOGOK with zero bridge latency or wrapper exposure.
              </p>
            </div>
            <div className="pt-3 border-t border-[#20283A] text-slate-500 text-[11px]">
              Relay: `solver-relay-v2.chaindefuser.com`
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
