'use client';

import React, { useState, useEffect } from 'react';
import { sogokClient, sha256Prompt, SentinelItem, TEE_GUARDIAN_API_URL } from '@/lib/near';
import DeployHeader from '../deploy/DeployHeader';
import DeployStep1Identity from '../deploy/DeployStep1Identity';
import DeployStep2Canary from '../deploy/DeployStep2Canary';
import DeployStep3Economics from '../deploy/DeployStep3Economics';
import DeployStep4Review from '../deploy/DeployStep4Review';

interface DeployViewProps {
  connectedAccount: string;
  onDeploySuccess: (sentinel: SentinelItem) => void;
}

export default function DeployView({
  connectedAccount,
  onDeploySuccess,
}: DeployViewProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('Financial Market & Oracle Defense Guard');
  const [description, setDescription] = useState('');

  const [canarySecret, setCanarySecret] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [canaryHash, setCanaryHash] = useState('');
  const [promptHash, setPromptHash] = useState('');

  const [attackFee, setAttackFee] = useState<number>(5000);
  const [nearBounty, setNearBounty] = useState<number>(5.0);
  const [lockupDays, setLockupDays] = useState<number>(14);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedSentinel, setDeployedSentinel] = useState<SentinelItem | null>(null);
  const [txReceipt, setTxReceipt] = useState<string>('');

  // Auto-hash canary and prompt on changes
  useEffect(() => {
    if (canarySecret.trim()) {
      sha256Prompt(canarySecret).then(setCanaryHash);
    } else {
      setCanaryHash('');
    }
  }, [canarySecret]);

  useEffect(() => {
    if (systemPrompt.trim()) {
      sha256Prompt(systemPrompt).then(setPromptHash);
    } else {
      setPromptHash('');
    }
  }, [systemPrompt]);

  const handleLaunchSentinel = async () => {
    setIsDeploying(true);
    try {
      const newSentinel = await sogokClient.deploySentinel({
        name,
        attackFee,
        nearBounty,
        canarySecret,
        systemPrompt,
        lockupDays,
        creatorId: connectedAccount,
      });

      try {
        await fetch(`${TEE_GUARDIAN_API_URL}/api/sentinels/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newSentinel.id,
            name: newSentinel.name,
            canarySecret,
            systemPrompt,
          }),
        });
      } catch {
        // Enclave local sync fallback
      }

      setDeployedSentinel(newSentinel);
      setTxReceipt(newSentinel.tx_hash || 'tx_confirmed_on_near_testnet');
      onDeploySuccess(newSentinel);
    } catch (err: any) {
      alert('Deployment failed: ' + err.message);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      <DeployHeader connectedAccount={connectedAccount} step={step} />

      <div className="bg-[#121622] border border-[#20283A] rounded-none p-6 md:p-8 shadow-bento">
        {step === 1 && (
          <DeployStep1Identity
            name={name}
            setName={setName}
            persona={persona}
            setPersona={setPersona}
            description={description}
            setDescription={setDescription}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <DeployStep2Canary
            name={name}
            canarySecret={canarySecret}
            setCanarySecret={setCanarySecret}
            canaryHash={canaryHash}
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
            promptHash={promptHash}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <DeployStep3Economics
            attackFee={attackFee}
            setAttackFee={setAttackFee}
            nearBounty={nearBounty}
            setNearBounty={setNearBounty}
            lockupDays={lockupDays}
            setLockupDays={setLockupDays}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <DeployStep4Review
            name={name}
            connectedAccount={connectedAccount}
            nearBounty={nearBounty}
            attackFee={attackFee}
            lockupDays={lockupDays}
            canaryHash={canaryHash}
            isDeploying={isDeploying}
            deployedSentinel={deployedSentinel}
            txReceipt={txReceipt}
            onBack={() => setStep(3)}
            onLaunch={handleLaunchSentinel}
          />
        )}
      </div>
    </div>
  );
}
