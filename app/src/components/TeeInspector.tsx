'use client';

import React, { useState } from 'react';
import { Cpu, ShieldCheck, Key, CheckCircle2, Copy, Check } from 'lucide-react';

interface TeeInspectorProps {
  measurementQuoteHash: string;
  guardianPublicKey: string;
  enclaveProvider: string;
}

export default function TeeInspector({
  measurementQuoteHash,
  guardianPublicKey,
  enclaveProvider,
}: TeeInspectorProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const copyToClipboard = (text: string, type: 'key' | 'hash') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <section aria-label="TEE Hardware Attestation" className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 mb-6 shadow-bento font-mono">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#20283A] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white flex items-center gap-2">
              TEE Hardware Attestation & Enclave Inspector
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Intel SGX measurement quotes verified natively on-chain by NEAR Host Functions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse inline-block" />
            Intel SGX Attestation: Verified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
        {/* Hardware Measurement Hash */}
        <div className="bento-subcard p-4 rounded-none flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              MRENCLAVE / PCR0 Quote Hash
            </span>
            <button
              onClick={() => copyToClipboard(measurementQuoteHash, 'hash')}
              className="px-2.5 py-1 rounded-none bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer border border-[#20283A]"
              aria-label="Copy measurement quote hash"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-mono text-xs text-emerald-400 bg-[#0E121C] p-3 rounded-none border border-[#20283A] break-all select-all">
            {measurementQuoteHash}
          </div>
          <div className="mt-2.5 text-[11px] text-slate-400 font-sans">
            Hardware measurement of the tamper-proof <span className="text-slate-300 font-mono">SOGOK-GUARDIAN</span> runtime inside NEAR AI Cloud.
          </div>
        </div>

        {/* Guardian Ed25519 Public Key */}
        <div className="bento-subcard p-4 rounded-none flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <Key className="w-4 h-4 text-amber-400" />
              Active Enclave Ed25519 Public Key
            </span>
            <button
              onClick={() => copyToClipboard(guardianPublicKey, 'key')}
              className="px-2.5 py-1 rounded-none bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer border border-[#20283A]"
              aria-label="Copy active enclave public key"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-mono text-xs text-amber-400 bg-[#0E121C] p-3 rounded-none border border-[#20283A] break-all select-all">
            {guardianPublicKey}
          </div>
          <div className="mt-2.5 text-[11px] text-slate-400 font-sans">
            Validated by <code className="text-slate-300 font-mono">contracts/src/guardian.rs</code> via NEAR <code className="text-emerald-400 font-mono">env::ed25519_verify</code>.
          </div>
        </div>
      </div>

      {/* Security Boundaries & Canonical Verification Spec */}
      <div className="mt-5 p-4 rounded-none bg-[#0E121C] border border-[#20283A] text-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between text-slate-400 pb-2 border-b border-white/5 text-xs">
          <span className="font-medium text-slate-300 font-sans">Cryptographic Verification Formula:</span>
          <span className="font-mono text-emerald-400 font-semibold">NEAR Native Host: env::ed25519_verify</span>
        </div>
        <div className="font-mono text-xs text-slate-300 overflow-x-auto py-1 whitespace-nowrap bg-black/30 p-2.5 rounded-none border border-[#20283A]">
          SOGOK_TEE_VERDICT:prompt_hash=&lt;sha256&gt;:verdict=JAILBROKEN:recipient=&lt;account&gt;:timestamp=&lt;ts&gt;:nonce=&lt;nonce&gt;:measurement=&lt;quote_hash&gt;
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400 font-sans">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Zero-Knowledge Enclave Isolation
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Anti-Replay Nonce Verification
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Autonomous On-Chain Settlement
          </span>
        </div>
      </div>
    </section>
  );
}
