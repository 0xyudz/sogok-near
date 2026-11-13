import { DEFUSE_RPC_URL } from '../../config/endpoints.config';

/**
 * Defuse 1Click Solver Relay RPC Client.
 */
export class DefuseSolverClient {
  public readonly defuseRpcUrl: string;

  constructor(defuseRpcUrl = DEFUSE_RPC_URL) {
    this.defuseRpcUrl = defuseRpcUrl;
  }

  /**
   * Request live quote from Defuse Solver Relay
   */
  async querySolverQuote(params: {
    defuseAssetIdIn: string;
    exactAmountInYocto: string;
  }): Promise<{ quote_hash: string; expiration_time?: string } | null> {
    try {
      const response = await fetch(this.defuseRpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'quote',
          params: [
            {
              defuse_asset_identifier_in: params.defuseAssetIdIn,
              defuse_asset_identifier_out:
                'nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1',
              exact_amount_in: params.exactAmountInYocto,
              min_deadline_ms: 60000,
            },
          ],
        }),
      });

      if (!response.ok) {
        return null;
      }

      const solverData = (await response.json()) as any;
      const resultItem = solverData.result?.[0];
      if (resultItem && resultItem.quote_hash) {
        return {
          quote_hash: resultItem.quote_hash,
          expiration_time: resultItem.expiration_time,
        };
      }
      return null;
    } catch (err) {
      console.warn('[DEFUSE SOLVER] Solver Relay unreachable:', err);
      return null;
    }
  }
}
