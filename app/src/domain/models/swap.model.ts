/**
 * 1Click Swap & Testnet Faucet Domain Models.
 */
export interface SwapAsset {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  defuse_asset_id: string;
  ratePerSogok: number;
  icon: string;
}

export interface SwapIntentQuote {
  defuse_asset_in: string;
  defuse_asset_out: string;
  amount_in: number;
  asset_in_symbol: string;
  estimated_sogok_out: number;
  min_sogok_out: number;
  exchange_rate: number;
  network_fee_near: number;
  slippage_percent: number;
  price_impact_percent: number;
  route: string[];
  intent_hash: string;
  deadline: number;
  expiration_time?: string;
  is_live_solver_quote?: boolean;
}

export interface FaucetClaimResult {
  success: boolean;
  txHash: string;
  amountClaimed: string;
  newBalance: string;
  cooldownUntil: number;
  message: string;
  explorerUrl?: string;
}
