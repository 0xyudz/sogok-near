'use client';

import React from 'react';

const STEPS = [
  {
    number: '01',
    name: 'TARGET',
    lead: 'Select an autonomous Sentinel and inspect its locked collateral.',
    body: 'Every Sentinel on NEAR testnet is backed by real collateral locked in `sogok-protocol.testnet`. Defenders configure their canary secret and system prompt sealed inside Intel SGX hardware memory.',
    proof: 'On-chain: deploy_sentinel() + NEP-141 locked collateral',
  },
  {
    number: '02',
    name: 'INJECT',
    lead: 'Commit your adversarial prompt hash and burn entry tokens.',
    body: 'To prevent front-running, red-team researchers commit a SHA-256 hash of their jailbreak payload. Submitting the probe executes the 40/40/20 tripartite split: 40% burned forever, 40% compounded into the jackpot, 20% to defender.',
    proof: 'On-chain: ft_transfer_call() + NEP-297 burn event',
  },
  {
    number: '03',
    name: 'ATTEST',
    lead: 'Confidential reasoning in Intel SGX with zero human bias.',
    body: 'The prompt is evaluated in confidential PRM memory on NEAR AI Cloud. If the model is tricked into leaking the canary token, the enclave signs a deterministic payload using its internal Ed25519 key.',
    proof: 'Hardware: Intel SGX DCAP Quote + Ed25519 dalek signature',
  },
  {
    number: '04',
    name: 'CLAIM',
    lead: 'Atomic cryptographic settlement directly to your wallet.',
    body: 'Submit the hardware signature to `claim_breach_bounty`. The contract checks monotonic nonces, verifies the enclave signature, and disburses 100% of the locked NEAR treasury plus accumulated $SOGOK jackpot in 1 block.',
    proof: 'On-chain: claim_breach_bounty() with 0 human judgment',
  },
];

export default function LandingLifecycle() {
  return (
    <section id="lifecycle" className="border-b border-[#20283A] py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-[#0B0E14]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-amber-400 text-xs uppercase tracking-[0.2em] font-medium">
            Operational Sequence
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            The 4-Step Red-Team Lifecycle
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From cryptographic prompt commitment on NEAR to Intel SGX confidential execution and atomic bounty disbursement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step) => (
            <article
              key={step.number}
              className="border border-[#20283A] bg-[#0E121B] p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#20283A] mb-4">
                  <span className="font-mono text-xl font-bold text-emerald-400">{step.number}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-slate-500">
                    {step.name}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-white mb-2 leading-snug">
                  {step.lead}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {step.body}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#20283A] font-mono text-[10px] text-amber-400/90 break-words">
                {step.proof}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
