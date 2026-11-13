import { SwapAsset } from '../domain/models/swap.model';

/**
 * Supported Defuse 1Click Assets and exchange rates to $SOGOK.
 */
export const SUPPORTED_SWAP_ASSETS: SwapAsset[] = [
  {
    id: 'near',
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    decimals: 24,
    defuse_asset_id: 'nep141:wrap.near',
    ratePerSogok: 25000,
    icon: 'NEAR',
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    defuse_asset_id: 'nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1',
    ratePerSogok: 4800,
    icon: 'USDC',
  },
  {
    id: 'wbtc',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    defuse_asset_id: 'nep141:2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near',
    ratePerSogok: 450000000,
    icon: 'WBTC',
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana (OMFT)',
    decimals: 9,
    defuse_asset_id: 'sol.omft.near',
    ratePerSogok: 850000,
    icon: 'SOL',
  },
];
