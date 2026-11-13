'use client';

import React from 'react';
import SwapHeader from '../swap/SwapHeader';
import SwapIntentCard from '../swap/SwapIntentCard';
import FaucetClaimCard from '../swap/FaucetClaimCard';

interface SwapViewProps {
  connectedAccount: string;
  userBalance: string;
  onBalanceUpdated: () => void;
}

export default function SwapView({
  connectedAccount,
  userBalance,
  onBalanceUpdated,
}: SwapViewProps) {
  return (
    <div className="space-y-6">
      <SwapHeader
        connectedAccount={connectedAccount}
        userBalance={userBalance}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SwapIntentCard
          connectedAccount={connectedAccount}
          onBalanceUpdated={onBalanceUpdated}
        />
        <FaucetClaimCard
          connectedAccount={connectedAccount}
          onBalanceUpdated={onBalanceUpdated}
        />
      </div>
    </div>
  );
}
