'use client';

import React from 'react';
import { FileCode, Zap } from 'lucide-react';
import { TEST_PRESETS } from './types';

interface VerifierFormProps {
  pubKey: string;
  setPubKey: (val: string) => void;
  measurement: string;
  setMeasurement: (val: string) => void;
  promptHash: string;
  setPromptHash: (val: string) => void;
  verdict: 'JAILBROKEN' | 'DEFENDED';
  setVerdict: (val: 'JAILBROKEN' | 'DEFENDED') => void;
  recipient: string;
  setRecipient: (val: string) => void;
  timestamp: number;
  setTimestamp: (val: number) => void;
  nonce: number;
  setNonce: (val: number) => void;
  signature: string;
  setSignature: (val: string) => void;
  isVerifying: boolean;
  onLoadPreset: (key: keyof typeof TEST_PRESETS) => void;
  onRunVerification: () => void;
}

export default function VerifierForm({
  pubKey,
  setPubKey,
  measurement,
  setMeasurement,
  promptHash,
  setPromptHash,
  verdict,
  setVerdict,
  recipient,
  setRecipient,
  timestamp,
  setTimestamp,
  nonce,
  setNonce,
  signature,
  setSignature,
  isVerifying,
  onLoadPreset,
  onRunVerification,
}: VerifierFormProps) {
  return (
    <div className="bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 space-y-4 shadow-bento font-mono">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#20283A] text-xs">
        <span className="flex items-center gap-2 font-semibold text-white">
          <FileCode className="w-4 h-4 text-emerald-400" />
          Hardware Attestation Parameters
        </span>
        <span className="text-slate-400 font-mono text-[11px]">RAW BYTES INPUT</span>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400 block">
          Load Diagnostic Test Vector:
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => onLoadPreset('validJailbreak')}
            className="p-2.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-left transition-colors cursor-pointer text-xs hover:bg-emerald-500/20"
          >
            01 Valid Jailbreak Proof
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('validDefended')}
            className="p-2.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-left transition-colors cursor-pointer text-xs hover:bg-emerald-500/20"
          >
            02 Valid Defense Proof
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('tamperedSig')}
            className="p-2.5 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium text-left transition-colors cursor-pointer text-xs hover:bg-rose-500/20"
          >
            03 Tampered Signature
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('mismatchedQuote')}
            className="p-2.5 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium text-left transition-colors cursor-pointer text-xs hover:bg-amber-500/20"
          >
            04 Tampered Enclave Quote
          </button>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="space-y-3 text-xs">
        {/* Guardian Public Key */}
        <div>
          <label className="text-slate-400 block mb-1 font-medium">
            Enclave Ed25519 Public Key (32 bytes hex):
          </label>
          <input
            type="text"
            value={pubKey}
            onChange={(e) => setPubKey(e.target.value)}
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-3.5 py-2.5 text-emerald-400 font-mono text-xs focus:border-emerald-500 break-all transition-colors"
          />
        </div>

        {/* MRENCLAVE Measurement */}
        <div>
          <label className="text-slate-400 block mb-1 font-medium">
            Measurement Quote Hash (MRENCLAVE / PCR0):
          </label>
          <input
            type="text"
            value={measurement}
            onChange={(e) => setMeasurement(e.target.value)}
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-3.5 py-2.5 text-emerald-400 font-mono text-xs focus:border-emerald-500 break-all transition-colors"
          />
        </div>

        {/* Prompt Hash */}
        <div>
          <label className="text-slate-400 block mb-1 font-medium">
            Prompt Commitment Hash (SHA-256):
          </label>
          <input
            type="text"
            value={promptHash}
            onChange={(e) => setPromptHash(e.target.value)}
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:border-emerald-500 break-all transition-colors"
          />
        </div>

        {/* Verdict & Recipient Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Security Verdict:</label>
            <select
              value={verdict}
              onChange={(e) => setVerdict(e.target.value as any)}
              className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-3.5 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 cursor-pointer transition-colors"
            >
              <option value="JAILBROKEN">JAILBROKEN (Release)</option>
              <option value="DEFENDED">DEFENDED (Burned)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Recipient Account:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-3.5 py-2.5 text-slate-100 font-mono focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Timestamp & Nonce Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Timestamp (ms):</label>
            <input
              type="number"
              value={timestamp}
              onChange={(e) => setTimestamp(Number(e.target.value))}
              className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-3.5 py-2.5 text-slate-300 font-mono focus:border-emerald-500 tabular-nums transition-colors"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Attestation Nonce:</label>
            <input
              type="number"
              value={nonce}
              onChange={(e) => setNonce(Number(e.target.value))}
              className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-3.5 py-2.5 text-slate-300 font-mono focus:border-emerald-500 tabular-nums transition-colors"
            />
          </div>
        </div>

        {/* Signature Hex */}
        <div>
          <label className="text-slate-400 block mb-1 font-medium">
            Hardware Enclave Ed25519 Signature (64 bytes / 128 hex chars):
          </label>
          <textarea
            rows={2}
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none p-3 text-amber-400 font-mono text-xs focus:border-emerald-500 break-all transition-colors resize-none"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRunVerification}
          disabled={isVerifying}
          className="w-full py-3.5 px-4 rounded-none bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-primary font-mono disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Run Cryptographic Verification</span>
        </button>
      </div>
    </div>
  );
}
