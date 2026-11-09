import React from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Repeat, ExternalLink, TrendingUp, TrendingDown, ShieldCheck, Sparkles } from 'lucide-react';
import { SreyToken } from './sreyWalletStore';

interface SreyTokenDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: SreyToken | null;
  onOpenSend: (token: SreyToken) => void;
  onOpenReceive: () => void;
  onOpenSwap: (token: SreyToken) => void;
}

export const SreyTokenDetailsModal: React.FC<SreyTokenDetailsModalProps> = ({
  isOpen,
  onClose,
  token,
  onOpenSend,
  onOpenReceive,
  onOpenSwap
}) => {
  if (!isOpen || !token) return null;

  const isPositive = token.change24h >= 0;
  const fiatValue = token.balance * token.priceUsd;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0d111c] border border-stone-800 rounded-3xl p-5 max-w-md w-full space-y-5 shadow-2xl relative text-white font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-xl shadow-inner">
              {token.icon}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>{token.name}</span>
                <span className="text-[10px] font-mono text-stone-400">({token.symbol})</span>
              </h3>
              <p className="text-[10px] font-mono text-cyan-400">{token.networkName}</p>
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

        {/* Balance Card */}
        <div className="bg-[#07090e] p-4 rounded-2xl border border-stone-800 text-center space-y-1">
          <span className="text-[11px] font-mono text-stone-500 font-bold block">
            Your {token.symbol} Balance
          </span>
          <div className="text-3xl font-black font-mono text-white">
            {token.balance} {token.symbol}
          </div>
          <div className="text-xs font-mono text-stone-400">
            ≈ ${fiatValue.toFixed(2)} USD
          </div>
        </div>

        {/* Live Market Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-[#07090e] p-3 rounded-xl border border-stone-850 space-y-1">
            <span className="text-stone-500 text-[10px]">Price (USD):</span>
            <div className="font-bold text-white text-sm">
              ${token.priceUsd < 0.01 ? token.priceUsd.toFixed(4) : token.priceUsd.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#07090e] p-3 rounded-xl border border-stone-850 space-y-1">
            <span className="text-stone-500 text-[10px]">24h Change:</span>
            <div className={`font-bold text-sm flex items-center gap-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{isPositive ? '+' : ''}{token.change24h.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Send / Receive / Swap) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSend(token);
            }}
            className="py-3 bg-[#141a2b] hover:bg-[#1c243c] border border-stone-800 hover:border-amber-500/60 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <ArrowUpRight size={15} className="text-amber-400" />
            <span>Send</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReceive();
            }}
            className="py-3 bg-[#141a2b] hover:bg-[#1c243c] border border-stone-800 hover:border-emerald-500/60 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <ArrowDownLeft size={15} className="text-emerald-400" />
            <span>Receive</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSwap(token);
            }}
            className="py-3 bg-[#141a2b] hover:bg-[#1c243c] border border-stone-800 hover:border-cyan-500/60 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <Repeat size={15} className="text-cyan-400" />
            <span>Swap</span>
          </button>
        </div>

      </div>
    </div>
  );
};
