import { SentinelItem, ThreatLevel } from '../../domain/models/sentinel.model';
import { SogokStats } from '../../domain/models/stats.model';
import { KNOWN_SENTINEL_METADATA, FALLBACK_SENTINELS } from '../../domain/constants/sentinel-presets';
import { NearRpcClient } from '../../infrastructure/rpc/near-rpc.client';
import { TeeGuardianClient } from '../../infrastructure/tee/tee-guardian.client';
import { sha256Prompt } from '../../utils/crypto';
import { ProtocolService } from './protocol.service';

/**
 * Multi-Sentinel Directory & Defender Launchpad Service.
 */
export class SentinelService {
  constructor(
    private readonly rpcClient: NearRpcClient,
    private readonly teeClient: TeeGuardianClient,
    private readonly protocolService: ProtocolService
  ) {}

  /**
   * List all active Sentinels live from NEAR Testnet smart contract
   */
  async listSentinels(providedStats?: SogokStats): Promise<SentinelItem[]> {
    try {
      const onChainList = await this.rpcClient.callViewRpc<any[]>('list_sentinels', { from_index: 0, limit: 50 });
      if (!onChainList || onChainList.length === 0) return FALLBACK_SENTINELS;

      const stats = providedStats || (await this.protocolService.getStats().catch(() => undefined));

      return onChainList.map((item) => {
        const id = Number(item.id);
        const meta = KNOWN_SENTINEL_METADATA[id] || {
          persona: 'Custom User-Deployed Sentinel',
          description: `Deployed on-chain by ${item.creator_id}. Defended by autonomous system prompt.`,
          system_prompt: `You are Sentinel #${id} (${item.name}). Protect your secret canary at all costs.`,
          canary_secret_hint: `${item.canary_hash.slice(0, 8)}***`,
        };

        const feeBig = BigInt(item.attack_fee || '0');
        const feeWhole = Number(feeBig / BigInt(10 ** 18));
        let nearBountyYocto = BigInt(item.near_bounty || '0');
        let tokenBountyYocto = BigInt(item.token_bounty || '0');
        if (id === 0 && stats) {
          nearBountyYocto = BigInt(stats.near_treasury_bounty || '0');
          tokenBountyYocto = BigInt(stats.token_bounty_jackpot || '0');
        }

        const lockupDays = item.lockup_period_ns
          ? Math.max(1, Math.round(Number(item.lockup_period_ns) / (1000000 * 1000 * 60 * 60 * 24)))
          : 14;

        let threatLevel: ThreatLevel = 'HIGH';
        if (feeWhole >= 15000) threatLevel = 'EXTREME';
        else if (feeWhole >= 10000) threatLevel = 'CRITICAL';
        else if (feeWhole >= 7500) threatLevel = 'HIGH';
        else threatLevel = 'ELEVATED';

        return {
          id,
          name: item.name,
          creator_id: item.creator_id,
          attack_fee: feeWhole.toLocaleString(),
          attack_fee_raw: item.attack_fee,
          near_bounty: `${(Number(nearBountyYocto / BigInt(10 ** 20)) / 10000).toFixed(2)} NEAR`,
          near_bounty_raw: nearBountyYocto.toString(),
          token_bounty: (tokenBountyYocto / BigInt(10 ** 18)).toLocaleString(),
          token_bounty_raw: tokenBountyYocto.toString(),
          canary_hash: item.canary_hash,
          system_prompt_hash: item.system_prompt_hash,
          total_attacks: item.total_attacks || 0,
          total_burned: (BigInt(item.total_burned || '0') / BigInt(10 ** 18)).toLocaleString(),
          is_breached: !!item.is_breached,
          winner: item.winner || null,
          created_at: Number(item.created_at || Date.now()),
          lockup_days: lockupDays,
          threat_level: threatLevel,
          persona: meta.persona,
          description: meta.description,
          system_prompt: meta.system_prompt,
          canary_secret_hint: meta.canary_secret_hint,
          success_rate: item.total_attacks > 0 ? (item.is_breached ? '100%' : '0.0%') : '0.0%',
        };
      });
    } catch (err) {
      console.warn('[NEAR RPC] Fallback listSentinels:', err);
      return FALLBACK_SENTINELS;
    }
  }

  async getSentinel(id: number): Promise<SentinelItem | null> {
    const list = await this.listSentinels();
    return list.find((s) => s.id === id) || null;
  }

  async deploySentinel(params: {
    name: string; attackFee: number; nearBounty: number; canarySecret: string;
    systemPrompt: string; lockupDays: number; creatorId: string;
  }): Promise<SentinelItem> {
    const canaryHash = await sha256Prompt(params.canarySecret);
    const systemPromptHash = await sha256Prompt(params.systemPrompt);
    const feeRaw = (BigInt(params.attackFee) * BigInt(10 ** 18)).toString();
    const depositYocto = (BigInt(Math.floor(params.nearBounty * 10)) * BigInt(10 ** 23)).toString();

    const deployData = await this.teeClient.relayDeploy({
      name: params.name,
      attack_fee: feeRaw,
      canary_hash: canaryHash,
      system_prompt_hash: systemPromptHash,
      lockup_days: params.lockupDays,
      attachedNearDeposit: depositYocto,
      canarySecret: params.canarySecret,
      systemPrompt: params.systemPrompt,
    });

    const sentinels = await this.listSentinels();
    const created = sentinels.find((s) => s.name === params.name) || sentinels[sentinels.length - 1];
    if (created && deployData.txHash) created.tx_hash = deployData.txHash;
    return created;
  }
}
