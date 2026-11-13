'use client';

import React from 'react';
import { Cpu } from 'lucide-react';

export default function VerifierHeader() {
  return (
    <section
      aria-label="TEE Cryptographic Verifier"
      className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 shadow-bento font-mono"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#20283A]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-black shadow-glow-primary font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                TEE Cryptographic Proof Inspector
              </h1>
              <span className="px-2.5 py-0.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
                ED25519 WEBCRYPTO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Client-side zero-trust Ed25519 signature & Intel SGX hardware measurement quote validator
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bento-subcard px-3.5 py-1.5 text-xs font-mono rounded-none">
          <span className="w-2 h-2 rounded-none bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Hardware Enclave:</span>
          <span className="text-emerald-400 font-semibold">INTEL SGX (NEAR AI CLOUD)</span>
        </div>
      </div>

      {/* Technical Architecture Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 text-xs font-mono">
        <div className="bento-subcard p-4 space-y-1 rounded-none">
          <span className="text-slate-400 font-medium uppercase text-[11px] block">PROVIDER TYPE:</span>
          <span className="font-semibold text-white">Intel SGX / AMD SEV-SNP Enclave</span>
          <p className="text-xs text-slate-400 font-sans">
            Isolated execution sandbox preventing host operator tampering.
          </p>
        </div>
        <div className="bento-subcard p-4 space-y-1 rounded-none">
          <span className="text-slate-400 font-medium uppercase text-[11px] block">SIGNING ALGORITHM:</span>
          <span className="font-semibold text-emerald-400 font-mono">Ed25519 (Edwards-curve 25519)</span>
          <p className="text-xs text-slate-400 font-sans">
            Validated natively on NEAR smart contract via <code className="text-slate-300 font-mono">env::ed25519_verify</code>.
          </p>
        </div>
        <div className="bento-subcard p-4 space-y-1 rounded-none">
          <span className="text-slate-400 font-medium uppercase text-[11px] block">CANONICAL PROTOCOL:</span>
          <span className="font-semibold text-amber-400 font-mono">SOGOK_TEE_VERDICT Spec</span>
          <p className="text-xs text-slate-400 font-sans">
            Deterministic byte serialization matching <code className="text-slate-300 font-mono">contracts/src/guardian.rs</code>.
          </p>
        </div>
      </div>
    </section>
  );
}
