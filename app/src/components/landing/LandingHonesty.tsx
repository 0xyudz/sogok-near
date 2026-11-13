'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export default function LandingHonesty() {
  return (
    <section id="honesty" className="border-b border-[#20283A] py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-[#0B0E14]">
      <div className="max-w-5xl mx-auto border border-[#20283A] bg-[#0E121B] p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-400">
          <Shield className="w-4 h-4" />
          <span>Honesty Boundary & Explicit Limitations</span>
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
          What the Protocol Does Not Claim
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Every crypto protocol makes grandiose promises. In keeping with engineering honesty, here is exactly what is verified on testnet today and what remains in development:
        </p>

        <div className="grid gap-4 sm:grid-cols-3 font-mono text-xs">
          <div className="border border-[#20283A] bg-[#121622] p-4 space-y-2">
            <span className="text-amber-400 font-semibold uppercase">1. Testnet Hardware</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              The testnet enclave currently simulates DCAP attestation quotes while production hardware cloud licenses are finalizing. Ed25519 canonical signatures and on-chain contract verifications are 100% real and enforced.
            </p>
          </div>

          <div className="border border-[#20283A] bg-[#121622] p-4 space-y-2">
            <span className="text-amber-400 font-semibold uppercase">2. Solver Bridge Finality</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Defuse 1Click solver swaps for Ethereum L1 are subject to underlying proof reorg times (~12 minutes), whereas Solana and NEAR swaps settle within sub-second intent execution blocks.
            </p>
          </div>

          <div className="border border-[#20283A] bg-[#121622] p-4 space-y-2">
            <span className="text-amber-400 font-semibold uppercase">3. LLM Reasoning Horizon</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Canary isolation protects target secrets, but deep recursive roleplay exploits can occasionally exhaust token context limits. Sentinels implement heuristic threat throttles to maintain determinism.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
