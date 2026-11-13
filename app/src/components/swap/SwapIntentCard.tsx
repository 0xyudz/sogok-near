'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Zap,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import {
  sogokClient,
  SUPPORTED_SWAP_ASSETS,
  SwapIntentQuote,
} from '@/lib/near';

interface SwapIntentCardProps {
  connectedAccount: string;
  onBalanceUpdated: () => void;
}

export default function SwapIntentCard({
  connectedAccount,
  onBalanceUpdated,
}: SwapIntentCardProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('near');
  const [inputAmount, setInputAmount] = useState<number>(1);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [swapResult, setSwapResult] = useState<{
    txHash: string;
    receivedSogok: number;
    intentHash: string;
  } | null>(null);

  const [quote, setQuote] = useState<SwapIntentQuote>({
    defuse_asset_in: 'nep141:wrap.near',
    defuse_asset_out: 'nep141:sogok-protocol.testnet',
    amount_in: 1,
    asset_in_symbol: 'NEAR',
    estimated_sogok_out: 25000,
    min_sogok_out: 24875,
    exchange_rate: 25000,
    network_fee_near: 0.0012,
    slippage_percent: 0.5,
    price_impact_percent: 0.04,
    route: ['NEAR', 'Defuse AMM Pool', '$SOGOK'],
    intent_hash: 'defuse_solver_quote_active',
    deadline: Math.floor(Date.now() / 1000) + 120,
  });

  useEffect(() => {
    let isCurrent = true;
    const validAmount = Number(inputAmount) > 0 ? Number(inputAmount) : 0;
    sogokClient.get1ClickQuote(selectedAssetId, validAmount, slippage).then((q) => {
      if (isCurrent) setQuote(q);
    });
    return () => {
      isCurrent = false;
    };
  }, [selectedAssetId, inputAmount, slippage]);

  const selectedAsset =
    SUPPORTED_SWAP_ASSETS.find((a) => a.id === selectedAssetId) || SUPPORTED_SWAP_ASSETS[0];

  const handleExecuteSwap = async () => {
    if (inputAmount <= 0 || isSwapping) return;
    setIsSwapping(true);
    setSwapResult(null);

    try {
      const res = await sogokClient.execute1ClickSwap(quote, connectedAccount);
      setSwapResult(res);
      onBalanceUpdated();
    } catch (err: any) {
      alert(`Swap execution failed: ${err.message}`);
    } finally {
      setIsSwapping(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <div className="bg-[#121622] border border-[#20283A] rounded-none p-5 md:p-6 flex flex-col justify-between space-y-5 shadow-bento font-mono">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#20283A] text-xs">
          <span className="flex items-center gap-2 font-semibold text-white">
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            1Click Intents Swap (NEAR Intents / Defuse)
          </span>
          <span className="px-2.5 py-0.5 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-medium">
            SOLVER AMM: ONLINE
          </span>
        </div>

        {/* Asset In Selector */}
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              You Pay (Input Asset):
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {SUPPORTED_SWAP_ASSETS.map((asset) => {
                const isSelected = asset.id === selectedAssetId;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`py-2.5 px-2 rounded-none text-xs font-medium transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-black font-bold shadow-glow-primary'
                        : 'bg-[#161B27] text-slate-300 border border-[#20283A] hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-sm">{asset.symbol}</span>
                    <span className="text-[10px] opacity-75">{asset.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Amount Box */}
            <div className="relative">
              <input
                type="number"
                min="0.001"
                step="any"
                value={inputAmount}
                onChange={(e) => setInputAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-4 py-3 font-mono text-3xl font-bold text-white focus:border-emerald-500 tabular-nums transition-colors"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="font-bold text-slate-200 text-sm">{selectedAsset.symbol}</span>
              </div>
            </div>
          </div>

          {/* Swap Direction Indicator */}
          <div className="flex justify-center -my-1">
            <div className="w-8 h-8 rounded-none bg-[#161B27] border border-[#20283A] text-emerald-400 flex items-center justify-center shadow-sm">
              <ArrowLeftRight className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* Asset Out (Estimated $SOGOK) */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>You Receive (Estimated):</span>
              <span>1 {selectedAsset.symbol} = {selectedAsset.ratePerSogok.toLocaleString()} $SOGOK</span>
            </div>
            <div className="w-full bg-[#161B27] border border-[#20283A] rounded-none px-4 py-3 font-mono text-3xl font-bold text-emerald-400 tabular-nums flex items-center justify-between">
              <span>{quote.estimated_sogok_out.toLocaleString()}</span>
              <span className="text-base font-mono font-medium text-emerald-400/80">$SOGOK</span>
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="pt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-medium">Slippage Tolerance:</span>
            <div className="flex items-center gap-1.5">
              {[0.1, 0.5, 1.0].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSlippage(val)}
                  className={`px-3 py-1 rounded-none text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    slippage === val
                      ? 'bg-emerald-500 text-black font-bold shadow-glow-primary'
                      : 'bg-[#161B27] text-slate-400 border border-[#20283A] hover:text-white'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Intent Route Breakdown */}
          <div className="bento-subcard p-3.5 text-xs font-mono space-y-2 rounded-none">
            <div className="flex justify-between text-slate-400">
              <span>Defuse Route:</span>
              <span className="text-emerald-400 font-semibold">{quote.route.join(' → ')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Guaranteed Minimum:</span>
              <span className="text-slate-200 tabular-nums">{quote.min_sogok_out.toLocaleString()} $SOGOK</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Network Gas (NEAR):</span>
              <span className="text-slate-200 tabular-nums">{quote.network_fee_near} NEAR</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>In Asset ID:</span>
              <span className="text-slate-400 truncate max-w-[200px] text-[11px]" title={quote.defuse_asset_in}>
                {quote.defuse_asset_in}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Execution Button & Success Log */}
      <div className="pt-2">
        <button
          onClick={handleExecuteSwap}
          disabled={isSwapping || inputAmount <= 0}
          className={`w-full py-3.5 px-4 rounded-none font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer font-mono ${
            isSwapping || inputAmount <= 0
              ? 'bg-[#161B27] text-slate-500 border border-[#20283A] cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-95 text-black shadow-glow-primary'
          }`}
        >
          {isSwapping ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>Solver Settling Intent...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>Swap {inputAmount} {selectedAsset.symbol} for $SOGOK</span>
            </>
          )}
        </button>

        {/* Swap Result Banner */}
        {swapResult && (
          <div className="mt-3 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-none text-xs space-y-1.5 font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Intent Settled Successfully!</span>
            </div>
            <div className="text-slate-300">
              Received <strong className="text-amber-400">{swapResult.receivedSogok.toLocaleString()} $SOGOK</strong>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <a
                href={`https://testnet.nearblocks.io/txns/${swapResult.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Tx: {swapResult.txHash.slice(0, 16)}...</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => copyToClipboard(swapResult.txHash)}
                className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedTx === swapResult.txHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedTx === swapResult.txHash ? 'Copied' : 'Copy Tx'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
