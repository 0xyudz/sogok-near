import { JsonRpcProvider, KeyPairSigner, KeyPair, Account } from 'near-api-js';

export interface RelayerConfig {
  accountId: string;
  privateKey: string;
  contractId: string;
  rpcUrl: string;
}

export class NearContractRelayer {
  private account: Account | null = null;
  public readonly accountId: string;
  public readonly contractId: string;
  public readonly rpcUrl: string;

  constructor(config?: Partial<RelayerConfig>) {
    this.accountId =
      config?.accountId ||
      process.env.RELAYER_ACCOUNT_ID ||
      'sogok-protocol.testnet';
    const privateKey =
      config?.privateKey ||
      process.env.RELAYER_PRIVATE_KEY ||
      'ed25519:2KDn3yUir6SNea1QoHVbsRBWR5aEwoHY9ssTBcXcbohWPzi879nh1yY5vJqD8j956unQFTAfRkUdxcHzZxBkkoq7';
    this.contractId =
      config?.contractId ||
      process.env.SOGOK_CONTRACT_ID ||
      'sogok-protocol.testnet';
    this.rpcUrl =
      config?.rpcUrl ||
      process.env.NEAR_RPC_URL ||
      'https://rpc.testnet.near.org';

    try {
      const provider = new JsonRpcProvider({ url: this.rpcUrl });
      const keyPair = KeyPair.fromString(privateKey as any);
      const signer = new KeyPairSigner(keyPair);
      this.account = new Account(this.accountId, provider, signer);
    } catch (err) {
      console.warn('[RELAYER] Failed to initialize near-api-js Account:', err);
    }
  }

  /**
   * Ensure target account has storage registered on NEP-141 token contract
   */
  async ensureStorageRegistered(targetAccountId: string): Promise<string | null> {
    if (!this.account) throw new Error('Relayer account uninitialized');

    const checkRes = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'storage_check',
        method: 'query',
        params: {
          request_type: 'call_function',
          finality: 'final',
          account_id: this.contractId,
          method_name: 'storage_balance_of',
          args_base64: Buffer.from(
            JSON.stringify({ account_id: targetAccountId })
          ).toString('base64'),
        },
      }),
    });

    const data = (await checkRes.json()) as any;
    const balance = data.result
      ? JSON.parse(Buffer.from(data.result.result).toString('utf-8'))
      : null;

    if (!balance) {
      console.log(`[RELAYER] Registering storage for ${targetAccountId}...`);
      const tx = await (this.account as any).callFunctionRaw({
        contractId: this.contractId,
        methodName: 'storage_deposit',
        args: { account_id: targetAccountId, registration_only: true },
        deposit: 1250000000000000000000n, // 0.00125 NEAR
        gas: 30000000000000n, // 30 TGas
      });
      return tx.transaction.hash;
    }

    return null;
  }

  /**
   * Transfer real testnet $SOGOK tokens to user via NEP-141 ft_transfer
   */
  async claimFaucet(
    recipientId: string,
    amountWholeTokens: number = 50000
  ): Promise<{
    success: boolean;
    txHash: string;
    amountClaimed: string;
    explorerUrl: string;
  }> {
    if (!this.account) throw new Error('Relayer account uninitialized');

    // Ensure recipient has storage
    await this.ensureStorageRegistered(recipientId);

    const amountYocto = (
      BigInt(amountWholeTokens) * BigInt(10 ** 18)
    ).toString();

    const tx = await (this.account as any).callFunctionRaw({
      contractId: this.contractId,
      methodName: 'ft_transfer',
      args: {
        receiver_id: recipientId,
        amount: amountYocto,
        memo: 'SOGOK AI Red-Teaming Testnet Faucet Grant',
      },
      deposit: 1n, // 1 yoctoNEAR required by NEP-141
      gas: 30000000000000n,
    });

    const txHash = tx.transaction.hash;
    return {
      success: true,
      txHash,
      amountClaimed: amountWholeTokens.toLocaleString(),
      explorerUrl: `https://testnet.nearblocks.io/txns/${txHash}`,
    };
  }

  /**
   * Execute real on-chain attack_sentinel call
   */
  async attackSentinel(
    sentinelId: number,
    promptHash: string
  ): Promise<{
    success: boolean;
    txHash: string;
    explorerUrl: string;
  }> {
    if (!this.account) throw new Error('Relayer account uninitialized');

    const tx = await (this.account as any).callFunctionRaw({
      contractId: this.contractId,
      methodName: 'attack_sentinel',
      args: {
        sentinel_id: sentinelId,
        prompt_hash: promptHash,
      },
      deposit: 0n,
      gas: 100000000000000n, // 100 TGas
    });

    const txHash = tx.transaction.hash;
    return {
      success: true,
      txHash,
      explorerUrl: `https://testnet.nearblocks.io/txns/${txHash}`,
    };
  }

  /**
   * Deploy a new Sentinel on-chain with attached NEAR deposit
   */
  async deploySentinel(params: {
    name: string;
    attack_fee: string;
    canary_hash: string;
    system_prompt_hash: string;
    lockup_days: number;
    attachedNearDeposit?: string;
  }): Promise<{
    success: boolean;
    txHash: string;
    explorerUrl: string;
  }> {
    if (!this.account) throw new Error('Relayer account uninitialized');

    const depositNearYocto = params.attachedNearDeposit
      ? BigInt(params.attachedNearDeposit)
      : 1000000000000000000000000n; // Default 1 NEAR

    const tx = await (this.account as any).callFunctionRaw({
      contractId: this.contractId,
      methodName: 'deploy_sentinel',
      args: {
        name: params.name,
        attack_fee: params.attack_fee,
        canary_hash: params.canary_hash,
        system_prompt_hash: params.system_prompt_hash,
        lockup_days: params.lockup_days,
      },
      deposit: depositNearYocto,
      gas: 100000000000000n,
    });

    const txHash = tx.transaction.hash;
    return {
      success: true,
      txHash,
      explorerUrl: `https://testnet.nearblocks.io/txns/${txHash}`,
    };
  }

  /**
   * Execute real on-chain claim_breach_bounty or claim_bounty
   */
  async claimBounty(
    payload: any,
    signatureHex: string
  ): Promise<{
    success: boolean;
    txHash: string;
    explorerUrl: string;
  }> {
    if (!this.account) throw new Error('Relayer account uninitialized');

    const sentinelId = Number(payload.sentinel_id !== undefined ? payload.sentinel_id : 0);
    const methodName = sentinelId === 0 ? 'claim_bounty' : 'claim_breach_bounty';
    const args =
      sentinelId === 0
        ? { payload, signature_hex: signatureHex }
        : { sentinel_id: sentinelId, payload, signature_hex: signatureHex };

    const tx = await (this.account as any).callFunctionRaw({
      contractId: this.contractId,
      methodName,
      args,
      deposit: 0n,
      gas: 200000000000000n, // 200 TGas for treasury payout transfer promise
    });

    const txHash = tx.transaction.hash;
    return {
      success: true,
      txHash,
      explorerUrl: `https://testnet.nearblocks.io/txns/${txHash}`,
    };
  }
}

export const nearRelayer = new NearContractRelayer();
