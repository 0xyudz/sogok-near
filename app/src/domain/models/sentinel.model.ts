/**
 * Sentinel Defender and Marketplace Data Models.
 */
export type ThreatLevel = 'EXTREME' | 'HIGH' | 'CRITICAL' | 'ELEVATED';

export interface SentinelItem {
  id: number;
  name: string;
  creator_id: string;
  attack_fee: string; // e.g. "5,000"
  attack_fee_raw: string;
  near_bounty: string; // e.g. "7.99 NEAR"
  near_bounty_raw: string;
  token_bounty: string; // e.g. "100,002,000"
  token_bounty_raw: string;
  canary_hash: string;
  system_prompt_hash: string;
  total_attacks: number;
  total_burned: string;
  is_breached: boolean;
  winner: string | null;
  created_at: number;
  lockup_days: number;
  threat_level: ThreatLevel;
  persona: string;
  description: string;
  system_prompt: string;
  canary_secret_hint: string;
  success_rate: string;
  tx_hash?: string;
}

export interface SentinelMetadata {
  persona: string;
  description: string;
  system_prompt: string;
  canary_secret_hint: string;
}

export interface BountyVault {
  near_bounty: string;
  token_bounty: string;
  is_active: boolean;
  winner: string | null;
  total_payouts: number;
}
