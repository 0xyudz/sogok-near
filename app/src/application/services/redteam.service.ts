import { TeeGuardianClient } from '../../infrastructure/tee/tee-guardian.client';
import { SentinelService } from './sentinel.service';

/**
 * Red-Team Adversarial Operations & Hardware Bounty Claims.
 */
export class RedTeamService {
  constructor(
    private readonly teeClient: TeeGuardianClient,
    private readonly sentinelService: SentinelService
  ) {}

  /**
   * Attack a Sentinel on-chain via TEE Relayer
   * 40% Burned, 40% Added to Jackpot, 20% Paid to Defender
   */
  async attackSentinel(
    sentinelId: number,
    promptHash: string,
    senderId: string
  ): Promise<{
    success: boolean;
    txHash: string;
    fee: number;
    burnCut: number;
    jackpotCut: number;
    creatorCut: number;
    explorerUrl: string;
  }> {
    const sentinel = await this.sentinelService.getSentinel(sentinelId);
    const feeNum = sentinel ? parseInt(sentinel.attack_fee.replace(/,/g, ''), 10) || 5000 : 5000;

    const data = await this.teeClient.relayAttack({
      sentinelId,
      promptHash,
      senderId,
    });

    const burnCut = Math.floor(feeNum * 0.4);
    const jackpotCut = Math.floor(feeNum * 0.4);
    const creatorCut = feeNum - burnCut - jackpotCut;

    return {
      success: true,
      txHash: data.txHash,
      fee: feeNum,
      burnCut,
      jackpotCut,
      creatorCut,
      explorerUrl: data.explorerUrl || `https://testnet.nearblocks.io/txns/${data.txHash}`,
    };
  }

  /**
   * Execute claim_bounty transaction on-chain via TEE Relayer
   */
  async claimBounty(
    payload: any,
    signatureHex: string,
    callerId: string
  ): Promise<{
    success: boolean;
    txHash: string;
    nearPayout: string;
    tokenPayout: string;
    explorerUrl: string;
  }> {
    const data = await this.teeClient.relayClaim({
      payload,
      signatureHex,
      callerId,
    });

    return {
      success: true,
      txHash: data.txHash,
      nearPayout: '7.99 NEAR',
      tokenPayout: '100,002,000 $SOGOK',
      explorerUrl: data.explorerUrl || `https://testnet.nearblocks.io/txns/${data.txHash}`,
    };
  }
}
