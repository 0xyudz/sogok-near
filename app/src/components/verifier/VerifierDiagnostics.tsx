'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { VerificationOutput } from './types';

interface VerifierDiagnosticsProps {
  result: VerificationOutput | null;
}

export default function VerifierDiagnostics({ result }: VerifierDiagnosticsProps) {
  return (
    <div className="bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 space-y-4 flex flex-col justify-between shadow-bento font-mono">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#20283A] text-xs">
          <span className="flex items-center gap-2 font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verification Diagnostic Audit Log
          </span>
          <span className="text-slate-400 font-mono text-[11px]">REAL-TIME MATH CHECK</span>
        </div>

        {/* Big Status Banner */}
        {result && (
          <div
            className={`mt-4 p-4 rounded-none border text-center space-y-1.5 ${
              result.isValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-base font-bold">
              {result.isValid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>[VERIFIED HARDWARE ATTESTATION: VALID]</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>[INVALID ATTESTATION / CRYPTOGRAPHIC FAILURE]</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {result.isValid
                ? result.verdict === 'JAILBROKEN'
                  ? 'Authentic Intel SGX signature confirmed. Smart contract authorization ready for on-chain execution.'
                  : 'Authentic Intel SGX signature confirmed for DEFENDED attempt. Token burn verified.'
                : 'Cryptographic mismatch detected! Signature was forged or enclave measurement does not match approved hash.'}
            </p>
          </div>
        )}

        {/* Step-by-Step Diagnostic Breakdown */}
        {result && (
          <div className="space-y-2.5 mt-4 text-xs font-mono">
            {result.checks.map((check, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-none border ${
                  check.passed
                    ? 'bg-[#161B27] border-[#20283A]'
                    : 'bg-rose-500/5 border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200">{check.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-none text-[10px] font-mono font-bold ${
                      check.passed
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {check.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 break-all font-mono">{check.details}</p>
              </div>
            ))}
          </div>
        )}

        {/* Canonical Formatted Payload Display */}
        {result && (
          <div className="mt-4 p-3.5 bento-subcard text-xs space-y-1.5 font-mono rounded-none">
            <span className="text-slate-400 block text-[11px] uppercase font-medium">
              Canonical String Serialized to Bytes:
            </span>
            <div className="p-2.5 bg-[#090C12] rounded-none border border-[#20283A] text-slate-300 font-mono text-[11px] break-all select-all">
              {result.canonicalMessage}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[#20283A] text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>Engine: <strong className="text-white font-mono">WebCrypto subtle.verify</strong></span>
        <span className="text-emerald-400 font-mono font-medium">SPEC: NEP-141 / Intel SGX</span>
      </div>
    </div>
  );
}
