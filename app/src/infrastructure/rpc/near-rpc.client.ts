import { SOGOK_CONTRACT_ID, NEAR_RPC_URL } from '../../config/endpoints.config';
import { toBase64 } from '../../utils/crypto';

/**
 * Direct NEAR JSON-RPC 2.0 Client with resilient multi-endpoint fallback.
 */
export class NearRpcClient {
  public readonly contractId: string;
  public readonly rpcUrl: string;
  private readonly endpoints: string[];

  constructor(contractId = SOGOK_CONTRACT_ID, rpcUrl = NEAR_RPC_URL) {
    this.contractId = contractId;
    this.rpcUrl = rpcUrl;
    this.endpoints = Array.from(new Set([
      rpcUrl,
      'https://test.rpc.fastnear.com',
      'https://rpc.testnet.near.org',
    ]));
  }

  /**
   * Generic NEAR Testnet View Function Caller with fallback
   */
  async callViewRpc<T = any>(
    methodName: string,
    args: Record<string, any> = {}
  ): Promise<T> {
    const argsBase64 = toBase64(JSON.stringify(args));
    let lastError: Error | null = null;

    for (const url of this.endpoints) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: `sogok_view_${methodName}`,
            method: 'query',
            params: {
              request_type: 'call_function',
              finality: 'final',
              account_id: this.contractId,
              method_name: methodName,
              args_base64: argsBase64,
            },
          }),
        });

        if (!response.ok) continue;
        const data = (await response.json()) as any;
        if (data.error) continue;

        const rawBytes = data.result?.result;
        if (!rawBytes || !Array.isArray(rawBytes)) continue;

        const text = String.fromCharCode(...rawBytes);
        return JSON.parse(text) as T;
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error(`All NEAR RPC endpoints failed for ${methodName}`);
  }

  /**
   * Query native account metadata and balance on NEAR Testnet with fallback
   */
  async queryViewAccount(accountId: string): Promise<{ amount?: string }> {
    for (const url of this.endpoints) {
      try {
        const nearRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: `view_acc_${accountId}`,
            method: 'query',
            params: {
              request_type: 'view_account',
              finality: 'final',
              account_id: accountId,
            },
          }),
        });

        if (!nearRes.ok) continue;
        const nearData = (await nearRes.json()) as any;
        if (nearData.result) return nearData.result;
      } catch {
        continue;
      }
    }
    return {};
  }
}
