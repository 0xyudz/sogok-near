/**
 * Protocol statistics and global telemetry data model.
 */
export interface SogokStats {
  total_supply: string;
  total_burned: string;
  initial_supply: string;
  total_attempts: number;
  near_treasury_bounty: string;
  token_bounty_jackpot: string;
  bounty_won: boolean;
  last_winner: string | null;
  min_burn_amount: string;
  guardian_public_key: string;
  measurement_quote_hash: string;
  enclave_provider: string;
  total_sentinels?: number;
}
