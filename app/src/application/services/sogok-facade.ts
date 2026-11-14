import { SOGOK_CONTRACT_ID, NEAR_RPC_URL, TEE_GUARDIAN_API_URL } from '../../config/endpoints.config';
import { NearRpcClient } from '../../infrastructure/rpc/near-rpc.client';
import { TeeGuardianClient } from '../../infrastructure/tee/tee-guardian.client';
import { DefuseSolverClient } from '../../infrastructure/defuse/defuse-solver.client';
import { ProtocolService } from './protocol.service';
import { SentinelService } from './sentinel.service';
import { RedTeamService } from './redteam.service';
import { SwapService } from './swap.service';
import { ArchiveService } from './archive.service';
import { SogokStats } from '../../domain/models/stats.model';
import { SentinelItem } from '../../domain/models/sentinel.model';
import { PromptAttemptItem, HistoricBreachItem } from '../../domain/models/attempt.model';
import { SwapIntentQuote, FaucetClaimResult } from '../../domain/models/swap.model';
import { LeaderboardEntry } from '../../domain/models/leaderboard.model';

/**
 * Enterprise Facade combining Layered Domain Services into a unified client.
 */
export class SogokContractClient {
  public readonly contractId: string;
  public readonly rpcUrl: string;
  public readonly guardianUrl: string;

  private readonly rpcClient: NearRpcClient;
  private readonly teeClient: TeeGuardianClient;
  private readonly defuseClient: DefuseSolverClient;

  public readonly protocol: ProtocolService;
  public readonly sentinels: SentinelService;
  public readonly redteam: RedTeamService;
  public readonly swap: SwapService;
  public readonly archive: ArchiveService;

  constructor(
    contractId = SOGOK_CONTRACT_ID,
    rpcUrl = NEAR_RPC_URL,
    guardianUrl = TEE_GUARDIAN_API_URL
  ) {
    this.contractId = contractId;
    this.rpcUrl = rpcUrl;
    this.guardianUrl = guardianUrl;

    this.rpcClient = new NearRpcClient(this.contractId, this.rpcUrl);
    this.teeClient = new TeeGuardianClient(this.guardianUrl);
    this.defuseClient = new DefuseSolverClient();

    this.protocol = new ProtocolService(this.rpcClient);
    this.sentinels = new SentinelService(this.rpcClient, this.teeClient, this.protocol);
    this.redteam = new RedTeamService(this.teeClient, this.sentinels);
    this.swap = new SwapService(this.defuseClient, this.teeClient, this.protocol, this.contractId);
    this.archive = new ArchiveService(this.protocol, this.sentinels);
  }

  // Delegated Protocol & Telemetry Methods
  callViewRpc<T = any>(methodName: string, args: Record<string, any> = {}): Promise<T> {
    return this.rpcClient.callViewRpc<T>(methodName, args);
  }
  getStats(): Promise<SogokStats> {
    return this.protocol.getStats();
  }
  async getRecentAttempts(): Promise<PromptAttemptItem[]> {
    const attempts = await this.protocol.getRecentAttempts();
    return attempts.map((att) => ({
      ...att,
      tx_hash: this.archive.resolveTxHash(att.prompt_hash),
    }));
  }
  getAccountBalance(accountId: string): Promise<{ sogokBalance: string; nearBalance: string }> {
    return this.protocol.getAccountBalance(accountId);
  }

  // Delegated Sentinel Directory & Minting Methods
  listSentinels(stats?: SogokStats): Promise<SentinelItem[]> {
    return this.sentinels.listSentinels(stats);
  }
  getSentinel(id: number): Promise<SentinelItem | null> {
    return this.sentinels.getSentinel(id);
  }
  deploySentinel(params: {
    name: string; attackFee: number; nearBounty: number; canarySecret: string;
    systemPrompt: string; lockupDays: number; creatorId: string;
  }): Promise<SentinelItem> {
    return this.sentinels.deploySentinel(params);
  }

  // Delegated Red-Teaming & Attestation Claim Methods
  async attackSentinel(sentinelId: number, promptHash: string, senderId: string) {
    const res = await this.redteam.attackSentinel(sentinelId, promptHash, senderId);
    if (res?.txHash) {
      this.archive.recordLiveTx(promptHash, res.txHash, sentinelId);
    }
    return res;
  }
  claimBounty(payload: any, signatureHex: string, callerId: string) {
    return this.redteam.claimBounty(payload, signatureHex, callerId);
  }

  // Delegated 1Click Swap & Faucet Methods
  get1ClickQuote(assetInId: string, amountIn: number, slippagePercent: number): Promise<SwapIntentQuote> {
    return this.swap.get1ClickQuote(assetInId, amountIn, slippagePercent);
  }
  execute1ClickSwap(quote: SwapIntentQuote, recipientId: string) {
    return this.swap.execute1ClickSwap(quote, recipientId);
  }
  claimFaucet(accountId: string): Promise<FaucetClaimResult> {
    return this.swap.claimFaucet(accountId);
  }

  // Delegated Analytics & Leaderboard Methods
  getLeaderboard(filter: 'all' | 'weekly' = 'all'): Promise<LeaderboardEntry[]> {
    return this.archive.getLeaderboard(filter);
  }
  getBreachHistory(filter: 'all' | 'breaches' | 'defended' = 'all'): Promise<HistoricBreachItem[]> {
    return this.archive.getBreachHistory(filter);
  }
}

export const sogokClient = new SogokContractClient();
