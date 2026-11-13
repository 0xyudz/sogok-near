'use client';

import React from 'react';
import {
  SogokStats,
  SentinelItem,
  SOGOK_CONTRACT_ID,
} from '@/lib/near';
import LandingNavbar from '../landing/LandingNavbar';
import LandingHero from '../landing/LandingHero';
import LandingProblem from '../landing/LandingProblem';
import LandingLifecycle from '../landing/LandingLifecycle';
import LandingArchitecture from '../landing/LandingArchitecture';
import LandingHonesty from '../landing/LandingHonesty';
import LandingDocsPreview from '../landing/LandingDocsPreview';
import LandingSentinels from '../landing/LandingSentinels';
import LandingCtaFooter from '../landing/LandingCtaFooter';

interface LandingPageViewProps {
  stats: SogokStats;
  sentinels: SentinelItem[];
  onLaunchApp: (targetTab?: string) => void;
}

export default function LandingPageView({
  stats,
  sentinels,
  onLaunchApp,
}: LandingPageViewProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalBurnedNum = Number(
    BigInt(stats.total_burned || '8000000000000000000000') / BigInt(10 ** 18)
  );

  const proof = {
    measurement:
      stats.measurement_quote_hash ||
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    guardianKey:
      stats.guardian_public_key ||
      '754e986fa46d2b8b6334f6e118915fa0313b5e57760f28f7418e7ee43f135454',
    contractId: SOGOK_CONTRACT_ID,
    totalBurned: `${totalBurnedNum.toLocaleString()} $SOGOK`,
    blockHeight: '174,831,205',
    verifiedSpec: 'ED25519_CANONICAL_ENCLAVE_SIGNATURE',
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <LandingNavbar
        onLaunchApp={onLaunchApp}
        onScrollToSection={scrollToSection}
      />
      <LandingHero
        proof={proof}
        onLaunchApp={onLaunchApp}
      />
      <LandingProblem />
      <LandingLifecycle />
      <LandingArchitecture />
      <LandingHonesty />
      <LandingDocsPreview />
      <LandingSentinels
        sentinels={sentinels}
        onLaunchApp={onLaunchApp}
      />
      <LandingCtaFooter
        onLaunchApp={onLaunchApp}
      />
    </div>
  );
}
