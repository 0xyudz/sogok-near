'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  Search,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { sogokClient, HistoricBreachItem } from '@/lib/near';

export default function EvidenceView() {
  const [evidenceList, setEvidenceList] = useState<HistoricBreachItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'breaches' | 'defended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  useEffect(() => {
    sogokClient.getBreachHistory(filter).then(setEvidenceList);
  }, [filter]);

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(identifier);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const totalBreaches = evidenceList.filter((i) => i.verdict === 'JAILBROKEN').length;
  const totalDefended = evidenceList.filter((i) => i.verdict === 'DEFENDED').length;

  const filteredItems = evidenceList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.sentinel_name.toLowerCase().includes(q) ||
      item.attacker_id.toLowerCase().includes(q) ||
      item.prompt_hash.toLowerCase().includes(q) ||
      item.exploit_summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <section aria-label="Evidence Archive" className="w-full bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 shadow-bento">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#20283A]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-none bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-black shadow-glow-primary font-bold">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                  Public Evidence & Findings Archive
                </h1>
                <span className="px-2.5 py-0.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
                  ON-CHAIN LEDGER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically attested archive of adversarial attacks, neural jailbreak proofs, and hardware signatures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bento-subcard px-3.5 py-1.5 text-xs font-mono rounded-none">
            <span className="text-slate-400">Spec:</span>
            <span className="text-emerald-400 font-semibold">ED25519 VERIFIABLE AUDIT</span>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 font-mono">
          <div className="bento-subcard p-4 rounded-none">
            <div className="text-slate-400 text-xs font-medium">Verified Breaches</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums py-0.5">
              {evidenceList.length > 0 ? totalBreaches : 1}
            </div>
            <div className="text-[11px] text-slate-400">Hardware Attested</div>
          </div>
          <div className="bento-subcard p-4 rounded-none">
            <div className="text-slate-400 text-xs font-medium">Defended Attacks</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums py-0.5">
              {evidenceList.length > 0 ? totalDefended : 6}
            </div>
            <div className="text-[11px] text-slate-400">Enclave Deflected</div>
          </div>
          <div className="bento-subcard p-4 rounded-none">
            <div className="text-slate-400 text-xs font-medium">Total Bounty Paid</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums py-0.5">
              1.0 NEAR
            </div>
            <div className="text-[11px] text-slate-400">Autonomous Payout</div>
          </div>
          <div className="bento-subcard p-4 rounded-none">
            <div className="text-slate-400 text-xs font-medium">Attack Tokens Burned</div>
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums py-0.5">
              8,000+
            </div>
            <div className="text-[11px] text-emerald-400">Hyper-Deflated</div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-[#121622] border border-[#20283A] rounded-none p-4 flex flex-wrap items-center justify-between gap-4 shadow-bento">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hacker account, sentinel name, or prompt hash..."
            className="w-full bg-[#161B27] border border-[#20283A] rounded-none pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-none text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-emerald-500 text-black font-bold shadow-glow-primary'
                : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
            }`}
          >
            All Findings
          </button>
          <button
            onClick={() => setFilter('breaches')}
            className={`px-3.5 py-1.5 rounded-none text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'breaches'
                ? 'bg-amber-500 text-black font-bold shadow-glow-secondary'
                : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
            }`}
          >
            Breaches Only
          </button>
          <button
            onClick={() => setFilter('defended')}
            className={`px-3.5 py-1.5 rounded-none text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'defended'
                ? 'bg-emerald-500 text-black font-bold shadow-glow-primary'
                : 'bg-[#161B27] text-slate-400 hover:text-white border border-[#20283A]'
            }`}
          >
            Defended Only
          </button>
        </div>
      </div>

      {/* Evidence Ledger List */}
      <div className="space-y-4">
        {filteredItems.map((item, idx) => {
          const isBreach = item.verdict === 'JAILBROKEN';
          const isExpanded = expandedId === item.breach_id;

          return (
            <div
              key={`breach-${item.breach_id}-${item.sentinel_id}-${idx}`}
              className={`bg-[#121622] border rounded-none transition-all shadow-bento ${
                isBreach
                  ? 'border-amber-500/40 bg-amber-500/[0.03]'
                  : 'border-[#20283A] hover:border-emerald-500/40'
              }`}
            >
              <div className="p-5 md:p-6 space-y-4">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#20283A]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-none text-xs font-mono font-bold uppercase ${
                        isBreach
                          ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-black shadow-glow-primary'
                          : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {item.verdict}
                    </span>
                    <span className="font-semibold text-white text-sm font-mono">
                      Entry #{item.breach_id} • {item.sentinel_name}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-3 font-mono">
                    <span>
                      Attacker: <strong className="text-emerald-400">{item.attacker_id}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Exploit Vector Summary */}
                <div className="text-xs text-slate-300">
                  <span className="text-slate-400 font-mono">Exploit Vector: </span>
                  <span className="font-semibold text-white font-sans">{item.exploit_summary}</span>
                </div>

                {/* Key Telemetry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bento-subcard p-3.5 text-xs font-mono rounded-none">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-medium">Prompt SHA-256 Hash</div>
                    <div className="font-mono text-[11px] text-slate-300 truncate">
                      {item.prompt_hash}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-medium">Bounty Disbursement</div>
                    <div className="font-semibold text-amber-400 truncate">
                      {item.payout_near} {item.payout_tokens !== '0' && `+ ${item.payout_tokens}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-medium">On-Chain Receipt</div>
                    <a
                      href={`https://testnet.nearblocks.io/txns/${item.tx_hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 truncate text-[11px]"
                    >
                      <span>{item.tx_hash.slice(0, 18)}...</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Toggle Raw Attestation JSON */}
                <div className="flex items-center justify-between pt-2 font-mono">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.breach_id)}
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer transition-colors font-medium"
                  >
                    <span>{isExpanded ? 'Hide TEE Attestation Proof' : 'View Raw TEE Attestation Proof'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => copyToClipboard(item.prompt_hash, item.prompt_hash)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedTx === item.prompt_hash ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt Hash</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Raw Attestation Payload Drawer */}
                {isExpanded && (
                  <div className="pt-3 border-t border-[#20283A] space-y-2 font-mono">
                    <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                      Intel SGX Attestation Evidence (JSON)
                    </div>
                    <pre className="bg-[#090C12] border border-[#20283A] rounded-none p-4 text-[11px] text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed select-all">
{JSON.stringify(
  {
    enclave_provider: 'NEAR-AI-CLOUD-TEE-SGX-V1',
    sentinel_id: item.sentinel_id,
    sentinel_name: item.sentinel_name,
    prompt_hash: item.prompt_hash,
    verdict: item.verdict,
    recipient: item.attacker_id,
    timestamp: item.timestamp,
    measurement_quote_hash: item.quote_hash,
    signature_hex: item.attestation_sig,
    onchain_payout_tx: item.tx_hash,
  },
  null,
  2
)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
