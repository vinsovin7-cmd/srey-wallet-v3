import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ArrowUpRight, ArrowDownLeft, Repeat, MoreHorizontal, TrendingUp } from 'lucide-react';

interface SreyBalanceCardProps {
  totalBalanceUsd: number;
  change24hUsd: number;
  change24hPct: number;
  fiatCurrency: string;
  onOpenCurrencySwitcher: () => void;
  onOpenSwap: () => void;
  onOpenSend: () => void;
  onOpenReceive: () => void;
  onOpenMore: () => void;
}

export const SreyBalanceCard: React.FC<SreyBalanceCardProps> = ({
  totalBalanceUsd,
  change24hUsd,
  change24hPct,
  fiatCurrency,
  onOpenCurrencySwitcher,
  onOpenSwap,
  onOpenSend,
  onOpenReceive,
  onOpenMore
}) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const formattedBalance = showBalance
    ? `${totalBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '••••••';

  const isPositive = change24hPct >= 0;

  return (
    <div className="w-full bg-[#0d111c] border border-stone-800/80 rounded-3xl p-5 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Strip: Total balance + Eye toggle + 24h Change */}
      <div className="flex items-center justify-between">
        {/* Left: Label + Eye Icon */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-400 font-bold tracking-wide">
            Total balance
          </span>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="text-stone-500 hover:text-stone-300 transition cursor-pointer"
            title={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>

        {/* Right: 24h Change Pill (Matching Screenshot 2) */}
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-stone-400 bg-[#080b13] px-2.5 py-1 rounded-full border border-stone-800">
          <span>
            {isPositive ? '+' : ''}${Math.abs(change24hUsd).toFixed(2)} ({isPositive ? '+' : ''}{change24hPct.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Large Balance Display with USD dropdown */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight drop-shadow-sm">
          {formattedBalance}
        </span>
        <button
          type="button"
          onClick={onOpenCurrencySwitcher}
          className="flex items-center gap-1 text-sm font-mono font-bold text-stone-400 hover:text-white transition cursor-pointer"
        >
          <span>{fiatCurrency}</span>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* 4 ACTION BUTTONS (Matching Screenshot 2) */}
      <div className="grid grid-cols-4 gap-3 pt-1">
        
        {/* 1. SWAP */}
        <button
          type="button"
          onClick={onOpenSwap}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#141a2b] hover:bg-[#1b233a] border border-stone-800 group-hover:border-cyan-500/50 flex items-center justify-center text-stone-200 group-hover:text-cyan-300 shadow-md transition-all active:scale-95">
            <Repeat size={20} className="transition-transform group-hover:rotate-180 duration-500" />
          </div>
          <span className="text-xs font-sans font-bold text-stone-300 group-hover:text-white transition">
            Swap
          </span>
        </button>

        {/* 2. SEND */}
        <button
          type="button"
          onClick={onOpenSend}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#141a2b] hover:bg-[#1b233a] border border-stone-800 group-hover:border-amber-500/50 flex items-center justify-center text-stone-200 group-hover:text-amber-300 shadow-md transition-all active:scale-95">
            <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <span className="text-xs font-sans font-bold text-stone-300 group-hover:text-white transition">
            Send
          </span>
        </button>

        {/* 3. RECEIVE */}
        <button
          type="button"
          onClick={onOpenReceive}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#141a2b] hover:bg-[#1b233a] border border-stone-800 group-hover:border-emerald-500/50 flex items-center justify-center text-stone-200 group-hover:text-emerald-300 shadow-md transition-all active:scale-95">
            <ArrowDownLeft size={20} className="transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
          </div>
          <span className="text-xs font-sans font-bold text-stone-300 group-hover:text-white transition">
            Receive
          </span>
        </button>

        {/* 4. MORE */}
        <button
          type="button"
          onClick={onOpenMore}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#141a2b] hover:bg-[#1b233a] border border-stone-800 group-hover:border-purple-500/50 flex items-center justify-center text-stone-200 group-hover:text-purple-300 shadow-md transition-all active:scale-95">
            <MoreHorizontal size={20} />
          </div>
          <span className="text-xs font-sans font-bold text-stone-300 group-hover:text-white transition">
            More
          </span>
        </button>

      </div>

    </div>
  );
};
