import { TEE_GUARDIAN_API_URL } from '../../config/endpoints.config';

/**
 * TEE Guardian Service and Relayer HTTP Client.
 */
export class TeeGuardianClient {
  public readonly guardianUrl: string;

  constructor(guardianUrl = TEE_GUARDIAN_API_URL) {
    this.guardianUrl = guardianUrl;
  }

  async relayDeploy(payload: {
    name: string;
    attack_fee: string;
    canary_hash: string;
    system_prompt_hash: string;
    lockup_days: number;
    attachedNearDeposit: string;
    canarySecret: string;
    systemPrompt: string;
  }): Promise<{ txHash: string; [key: string]: any }> {
    const res = await fetch(`${this.guardianUrl}/api/relay/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Relayer deploy request failed' }));
      throw new Error(err.error || `Deploy failed with HTTP ${res.status}`);
    }

    return await res.json();
  }

  async relayAttack(params: {
    sentinelId: number;
    promptHash: string;
    senderId: string;
  }): Promise<{ txHash: string; explorerUrl?: string }> {
    const res = await fetch(`${this.guardianUrl}/api/relay/attack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Relay attack failed' }));
      throw new Error(err.error || `Attack failed with HTTP ${res.status}`);
    }

    return await res.json();
  }

  async relayClaim(params: {
    payload: any;
    signatureHex: string;
    callerId: string;
  }): Promise<{ txHash: string; explorerUrl?: string }> {
    const res = await fetch(`${this.guardianUrl}/api/relay/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Relay claim failed' }));
      throw new Error(err.error || `Claim failed with HTTP ${res.status}`);
    }

    return await res.json();
  }

  async relayFaucet(params: {
    recipientId: string;
    amount: number;
  }): Promise<{ txHash: string; explorerUrl?: string }> {
    const res = await fetch(`${this.guardianUrl}/api/relay/faucet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Relayer faucet request failed' }));
      throw new Error(err.error || `Faucet request failed with HTTP ${res.status}`);
    }

    return await res.json();
  }
}
