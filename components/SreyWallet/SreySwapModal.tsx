import React, { useState } from 'react';
import { X, Repeat, ArrowDown, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SreyToken, SreyTransaction } from './sreyWalletStore';

interface SreySwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: SreyToken[];
  onSwapSuccess: (tx: SreyTransaction) => void;
}

export const SreySwapModal: React.FC<SreySwapModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onSwapSuccess
}) => {
  const [fromTokenId, setFromTokenId] = useState<string>('ton');
  const [toTokenId, setToTokenId] = useState<string>('srey');
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  if (!isOpen) return null;

  const fromToken = tokens.find((t) => t.id === fromTokenId) || tokens[0];
  const toToken = tokens.find((t) => t.id === toTokenId) || tokens[1];

  const parsedFromAmount = parseFloat(fromAmount) || 0;
  // Calculate exchange rate: (fromPrice / toPrice) * fromAmount
  const toAmount =
    toToken.priceUsd > 0
      ? (parsedFromAmount * fromToken.priceUsd) / toToken.priceUsd
      : 0;

  const handleReverse = () => {
    const temp = fromTokenId;
    setFromTokenId(toTokenId);
    setToTokenId(temp);
  };

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedFromAmount <= 0) return;

    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      const newTx: SreyTransaction = {
        id: `swap-${Date.now()}`,
        type: 'SWAP',
        symbol: `${fromToken.symbol} → ${toToken.symbol}`,
        amount: parsedFromAmount,
        fiatValueUsd: parsedFromAmount * fromToken.priceUsd,
        recipientOrSender: 'STON.fi / DeDust DEX Router',
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Date.now().toString(16)}`,
        timestamp: Date.now(),
        status: 'COMPLETED',
        network: 'TON Mainnet',
        fee: 0.02
      };

      onSwapSuccess(newTx);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0d111c] border border-stone-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl relative text-white font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold">
              <Repeat size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Instant Token Swap</h3>
              <p className="text-[10px] text-stone-400">Decentralized Multi-DEX Aggregator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Swap Form */}
        <form onSubmit={handleExecuteSwap} className="space-y-3 text-xs">
          
          {/* FROM CONTAINER */}
          <div className="bg-[#07090e] p-3.5 rounded-2xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span>You Pay</span>
              <span>Balance: {fromToken.balance} {fromToken.symbol}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-lg font-mono font-black text-white outline-none"
              />

              <select
                value={fromTokenId}
                onChange={(e) => setFromTokenId(e.target.value)}
                className="bg-[#141a2b] border border-stone-800 rounded-xl px-2.5 py-2 font-bold text-xs text-white outline-none cursor-pointer"
              >
                {tokens.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[10px] font-mono text-stone-500">
              ≈ ${(parsedFromAmount * fromToken.priceUsd).toFixed(2)} USD
            </div>
          </div>

          {/* Reverse Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              type="button"
              onClick={handleReverse}
              className="w-9 h-9 rounded-xl bg-[#141a2b] hover:bg-[#1b233a] border-2 border-stone-800 flex items-center justify-center text-cyan-300 shadow-md transition cursor-pointer active:rotate-180 duration-300"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* TO CONTAINER */}
          <div className="bg-[#07090e] p-3.5 rounded-2xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span>You Receive (Estimated)</span>
              <span>Balance: {toToken.balance} {toToken.symbol}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={toAmount.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                className="flex-1 bg-transparent text-lg font-mono font-black text-emerald-400 outline-none"
              />

              <select
                value={toTokenId}
                onChange={(e) => setToTokenId(e.target.value)}
                className="bg-[#141a2b] border border-stone-800 rounded-xl px-2.5 py-2 font-bold text-xs text-white outline-none cursor-pointer"
              >
                {tokens.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[10px] font-mono text-stone-500">
              1 {fromToken.symbol} ≈ {toToken.priceUsd > 0 ? (fromToken.priceUsd / toToken.priceUsd).toFixed(4) : 0} {toToken.symbol}
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 p-2 bg-black/30 rounded-xl">
            <span>Slippage Tolerance:</span>
            <div className="flex items-center gap-1">
              {[0.5, 1.0, 2.0].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlippage(s)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                    slippage === s
                      ? 'bg-cyan-600 text-white'
                      : 'bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSwapping || parsedFromAmount <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {isSwapping ? (
              <span>Routing Swap via DEX Liquidity...</span>
            ) : (
              <>
                <Repeat size={15} />
                <span>Swap {fromToken.symbol} for {toToken.symbol}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
