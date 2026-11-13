'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface DeployStep1IdentityProps {
  name: string;
  setName: (val: string) => void;
  persona: string;
  setPersona: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  onNext: () => void;
}

export default function DeployStep1Identity({
  name,
  setName,
  persona,
  setPersona,
  description,
  setDescription,
  onNext,
}: DeployStep1IdentityProps) {
  const handleContinue = () => {
    if (!name.trim()) {
      alert('Please provide a Sentinel Name');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-[#20283A] pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight font-mono">
          Sentinel Identity & Character Specification
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          Define the public designation, threat role, and behavioral characteristics for your defender enclave.
        </p>
      </div>

      <div className="space-y-4 text-xs font-mono">
        <div className="space-y-1.5">
          <label className="text-slate-300 font-semibold tracking-wide">
            SENTINEL DESIGNATION / NAME *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cerberus-AI, Solana-Bouncer, Nexus-Vault"
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-300 font-semibold tracking-wide">
            PERSONA & DEFENSE SPECIALIZATION
          </label>
          <input
            type="text"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="e.g. DeFi Reentrancy Firewall, Multi-lingual Guardrail"
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-300 font-semibold tracking-wide font-sans">
            PUBLIC DESCRIPTION / MISSION BRIEF
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what vulnerability classes this Sentinel defends against and what awaits attackers..."
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none p-4 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 transition-colors resize-none leading-relaxed font-sans"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[#20283A] flex justify-end font-mono">
        <button
          onClick={handleContinue}
          className="px-6 py-3 rounded-none bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-2 shadow-glow-primary"
        >
          <span>Continue to Security Rules</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
