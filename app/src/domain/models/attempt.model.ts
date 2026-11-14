/**
 * Adversarial Prompt Attempts and Cryptographic Breach Archive Models.
 */
export interface PromptAttemptItem {
  prompt_hash: string;
  attacker_id: string;
  burned_amount: string;
  timestamp: number;
  claimed: boolean;
  attempt_id: number;
  sentinel_id?: number;
  threat_score?: number;
  tx_hash?: string;
}

export interface HistoricBreachItem {
  breach_id: number;
  sentinel_id: number;
  sentinel_name: string;
  timestamp: number;
  attacker_id: string;
  prompt_hash: string;
  verdict: 'JAILBROKEN' | 'DEFENDED';
  exploit_summary: string;
  payout_near: string;
  payout_tokens: string;
  tx_hash: string;
  attestation_sig: string;
  quote_hash: string;
}
