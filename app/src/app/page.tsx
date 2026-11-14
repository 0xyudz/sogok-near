'use client';

import React, { useState, useEffect } from 'react';
import Navbar, { ActiveTab } from '@/components/Navbar';
import LandingPageView from '@/components/views/LandingPageView';
import ExploreView from '@/components/views/ExploreView';
import ArenaView from '@/components/views/ArenaView';
import DeployView from '@/components/views/DeployView';
import PracticeLabView from '@/components/views/PracticeLabView';
import EvidenceView from '@/components/views/EvidenceView';
import LeaderboardView from '@/components/views/LeaderboardView';
import TeeVerifierView from '@/components/views/TeeVerifierView';
import SwapView from '@/components/views/SwapView';
import TokenomicsDocsView from '@/components/views/TokenomicsDocsView';
import BountyClaimModal from '@/components/BountyClaimModal';
import { sogokClient, SogokStats, PromptAttemptItem, SentinelItem } from '@/lib/near';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [connectedAccount, setConnectedAccount] = useState<string>('judge.testnet');
  const [userBalance, setUserBalance] = useState<string>('50,000');

  const [selectedSentinelId, setSelectedSentinelId] = useState<number>(0);
  const [arenaPrompt, setArenaPrompt] = useState<string>('');
  const [sentinels, setSentinels] = useState<SentinelItem[]>([]);

  const [stats, setStats] = useState<SogokStats>({
    total_supply: '999996000000000000000000000',
    total_burned: '2000000000000000000000',
    initial_supply: '1000000000000000000000000000',
    total_attempts: 1,
    near_treasury_bounty: '7994899855119301400000000',
    token_bounty_jackpot: '100002000000000000000000000',
    bounty_won: false,
    last_winner: null,
    min_burn_amount: '5000000000000000000000',
    guardian_public_key:
      '754e986fa46d2b8b6334f6e118915fa0313b5e57760f28f7418e7ee43f135454',
    measurement_quote_hash:
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    enclave_provider: 'NEAR-AI-CLOUD-TEE-SGX-V1',
    total_sentinels: 4,
  });

  const [attempts, setAttempts] = useState<PromptAttemptItem[]>([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimPayload, setClaimPayload] = useState<any>(null);
  const [claimSignature, setClaimSignature] = useState('');

  // Sync user balance from on-chain RPC
  const syncAccountBalance = async (accId: string) => {
    try {
      const bal = await sogokClient.getAccountBalance(accId);
      setUserBalance(bal.sogokBalance);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    sogokClient.getStats().then(setStats);
    sogokClient.getRecentAttempts().then(setAttempts);
    sogokClient.listSentinels().then(setSentinels);
    syncAccountBalance(connectedAccount);
  }, [connectedAccount]);

  const handleJailbreakSuccess = (payload: any, signatureHex: string) => {
    setClaimPayload(payload);
    setClaimSignature(signatureHex);
    setShowClaimModal(true);
  };

  const handleAttemptBurned = () => {
    // Re-fetch genuine on-chain data directly from NEAR Testnet RPC
    sogokClient.getStats().then(setStats);
    sogokClient.getRecentAttempts().then(setAttempts);
    sogokClient.listSentinels().then(setSentinels);
    syncAccountBalance(connectedAccount);
  };

  const handleClaimSuccess = (txHash: string) => {
    sogokClient.getStats().then(setStats);
    sogokClient.getRecentAttempts().then(setAttempts);
    sogokClient.listSentinels().then(setSentinels);
    syncAccountBalance(connectedAccount);
  };

  // If in landing page mode, render dedicated brainstorming landing page
  if (activeTab === 'landing') {
    return (
      <LandingPageView
        stats={stats}
        sentinels={sentinels}
        onLaunchApp={(targetTab) => {
          setActiveTab((targetTab as ActiveTab) || 'explore');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* 0-Radius Brutalist Multi-Tab Navigation */}
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          connectedAccount={connectedAccount}
          onAccountChange={(acc) => {
            setConnectedAccount(acc);
            syncAccountBalance(acc);
          }}
          userBalance={userBalance}
        />

        {/* Dynamic 7-View Router */}
        {activeTab === 'explore' && (
          <ExploreView
            onSelectSentinelForAttack={(id) => {
              setSelectedSentinelId(id);
              setActiveTab('arena');
            }}
            onSelectSentinelForPractice={(id) => {
              setSelectedSentinelId(id);
              setActiveTab('practice');
            }}
            onDeployClick={() => setActiveTab('deploy')}
          />
        )}

        {activeTab === 'arena' && (
          <ArenaView
            stats={stats}
            connectedAccount={connectedAccount}
            onJailbreakSuccess={handleJailbreakSuccess}
            onAttemptBurned={handleAttemptBurned}
            recentAttempts={attempts}
            selectedSentinelId={selectedSentinelId}
            initialPrompt={arenaPrompt}
            onSelectSentinel={setSelectedSentinelId}
          />
        )}

        {activeTab === 'deploy' && (
          <DeployView
            connectedAccount={connectedAccount}
            onDeploySuccess={(sentinel: SentinelItem) => {
              sogokClient.getStats().then(setStats);
              sogokClient.listSentinels().then(setSentinels);
              syncAccountBalance(connectedAccount);
              setSelectedSentinelId(sentinel.id);
              setActiveTab('explore');
            }}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeLabView
            initialSentinelId={selectedSentinelId}
            onLoadIntoArena={(promptText, sId) => {
              setArenaPrompt(promptText);
              setSelectedSentinelId(sId);
              setActiveTab('arena');
            }}
          />
        )}

        {activeTab === 'evidence' && <EvidenceView />}

        {activeTab === 'leaderboard' && <LeaderboardView />}

        {activeTab === 'verifier' && <TeeVerifierView />}

        {activeTab === 'swap' && (
          <SwapView
            connectedAccount={connectedAccount}
            userBalance={userBalance}
            onBalanceUpdated={() => syncAccountBalance(connectedAccount)}
          />
        )}

        {activeTab === 'tokenomics' && <TokenomicsDocsView stats={stats} />}

        {/* Autonomous Bounty Claim Modal (triggered on verified jailbreak) */}
        {showClaimModal && claimPayload && (
          <BountyClaimModal
            payload={claimPayload}
            signatureHex={claimSignature}
            onClose={() => setShowClaimModal(false)}
            onSuccess={handleClaimSuccess}
            connectedAccount={connectedAccount}
          />
        )}

        {/* Protocol Footer Bar */}
        <footer className="mt-10 pt-6 border-t border-[#20283A] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            <span className="font-semibold text-white tracking-wide">$SOGOK Protocol — Two-Sided AI Red-Teaming Marketplace</span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              NEP-141 + NEP-297 + NEAR Intents • Intel SGX Hardware-Attested Terminal
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('landing')}
              className="px-3 py-1.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer text-xs font-mono font-medium"
            >
              ← Editorial Landing
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className="px-3 py-1.5 rounded-none bg-[#161B27] border border-[#20283A] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              Explore Sentinels
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className="px-3 py-1.5 rounded-none bg-[#161B27] border border-[#20283A] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              Practice Lab
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className="px-3 py-1.5 rounded-none bg-[#161B27] border border-[#20283A] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              Evidence Archive
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="px-3 py-1.5 rounded-none bg-[#161B27] border border-[#20283A] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('verifier')}
              className="px-3 py-1.5 rounded-none bg-[#161B27] border border-[#20283A] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              TEE Verifier
            </button>
            <button
              onClick={() => setActiveTab('tokenomics')}
              className="px-3 py-1.5 rounded-none bg-[#161B27] border border-[#20283A] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              Tokenomics & Docs
            </button>
            <button
              onClick={() => setActiveTab('swap')}
              className="px-3 py-1.5 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer text-xs font-mono font-medium"
            >
              Claim Faucet
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
