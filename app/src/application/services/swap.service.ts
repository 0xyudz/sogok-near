import { SwapIntentQuote, FaucetClaimResult } from '../../domain/models/swap.model';
import { SUPPORTED_SWAP_ASSETS } from '../../config/swap-assets.config';
import { SOGOK_CONTRACT_ID } from '../../config/endpoints.config';
import { DefuseSolverClient } from '../../infrastructure/defuse/defuse-solver.client';
import { TeeGuardianClient } from '../../infrastructure/tee/tee-guardian.client';
import { ProtocolService } from './protocol.service';

/**
 * 1Click Swap & Testnet Faucet Service.
 */
export class SwapService {
  private readonly faucetCooldowns: Map<string, number> = new Map();

  constructor(
    private readonly defuseClient: DefuseSolverClient,
    private readonly teeClient: TeeGuardianClient,
    private readonly protocolService: ProtocolService,
    private readonly contractId = SOGOK_CONTRACT_ID
  ) {}

  /**
   * 1Click Swap API: Query live Defuse Solver Relay RPC
   */
  async get1ClickQuote(
    assetInId: string,
    amountIn: number,
    slippagePercent: number
  ): Promise<SwapIntentQuote> {
    const asset = SUPPORTED_SWAP_ASSETS.find((a) => a.id === assetInId) || SUPPORTED_SWAP_ASSETS[0];
    const estimatedOut = amountIn * asset.ratePerSogok;
    const minOut = Math.floor(estimatedOut * ((100 - slippagePercent) / 100));
    const exactAmountInYocto = (
      BigInt(Math.floor(amountIn * 10000)) * BigInt(10 ** (asset.decimals - 4))
    ).toString();

    const solver = await this.defuseClient.querySolverQuote({
      defuseAssetIdIn: asset.defuse_asset_id,
      exactAmountInYocto,
    });

    const isLive = !!solver;
    const intentHash = solver?.quote_hash || ('defuse_' +
      Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0')).join(''));

    return {
      defuse_asset_in: asset.defuse_asset_id,
      defuse_asset_out: `nep141:${this.contractId}`,
      amount_in: amountIn,
      asset_in_symbol: asset.symbol,
      estimated_sogok_out: estimatedOut,
      min_sogok_out: minOut,
      exchange_rate: asset.ratePerSogok,
      network_fee_near: 0.0012,
      slippage_percent: slippagePercent,
      price_impact_percent: isLive ? 0.02 : 0.04,
      route: isLive
        ? [asset.symbol, 'Defuse Solver Relay', 'Near Intents', '$SOGOK']
        : [asset.symbol, 'Defuse AMM Pool', '$SOGOK'],
      intent_hash: intentHash,
      deadline: Math.floor(Date.now() / 1000) + 120,
      expiration_time: solver?.expiration_time,
      is_live_solver_quote: isLive,
    };
  }

  /**
   * 1Click Swap Execution: Executes swap intent via testnet relayer transfer
   */
  async execute1ClickSwap(
    quote: SwapIntentQuote,
    recipientId: string
  ): Promise<{ success: boolean; txHash: string; receivedSogok: number; intentHash: string }> {
    const tokens = Math.floor(quote.estimated_sogok_out);
    const data = await this.teeClient.relayFaucet({ recipientId, amount: tokens });
    return {
      success: true,
      txHash: data.txHash,
      receivedSogok: quote.estimated_sogok_out,
      intentHash: quote.intent_hash,
    };
  }

  /**
   * Testnet Faucet: Transfers 50,000 $SOGOK testnet tokens via NEP-141 ft_transfer on-chain
   */
  async claimFaucet(accountId: string): Promise<FaucetClaimResult> {
    const now = Date.now();
    const cooldownDuration = 60 * 1000;
    const activeCooldown = this.faucetCooldowns.get(accountId) || 0;

    if (now < activeCooldown) {
      const remainingSeconds = Math.ceil((activeCooldown - now) / 1000);
      throw new Error(`Faucet cooldown active. Please wait ${remainingSeconds}s before claiming again.`);
    }

    const data = await this.teeClient.relayFaucet({ recipientId: accountId, amount: 50000 });
    const nextAvailable = now + cooldownDuration;
    this.faucetCooldowns.set(accountId, nextAvailable);

    const updated = await this.protocolService.getAccountBalance(accountId);

    return {
      success: true,
      txHash: data.txHash,
      amountClaimed: '50,000',
      newBalance: updated.sogokBalance,
      cooldownUntil: nextAvailable,
      message: `Successfully transferred 50,000 $SOGOK to ${accountId} on NEAR Testnet!`,
      explorerUrl: data.explorerUrl,
    };
  }
}
