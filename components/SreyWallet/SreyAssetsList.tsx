import React, { useState } from 'react';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, Sparkles, Filter, Search } from 'lucide-react';
import { SreyToken } from './sreyWalletStore';

interface SreyAssetsListProps {
  tokens: SreyToken[];
  activeTab: 'tokens' | 'nft';
  onTabChange: (tab: 'tokens' | 'nft') => void;
  onSelectToken: (token: SreyToken) => void;
  onOpenFilter: () => void;
}

export const SreyAssetsList: React.FC<SreyAssetsListProps> = ({
  tokens,
  activeTab,
  onTabChange,
  onSelectToken,
  onOpenFilter
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const filteredTokens = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-3">
      
      {/* 1. SEGMENTED SWITCHER (Matching Screenshot 2: "Tokens" | "NFT" + 3-dot filter) */}
      <div className="flex items-center justify-between pt-1">
        {/* Left: Segmented Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange('tokens')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-white text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Tokens
          </button>

          <button
            type="button"
            onClick={() => onTabChange('nft')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'nft'
                ? 'bg-white text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            NFT
          </button>
        </div>

        {/* Right: 3-dot filter / search */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="w-7 h-7 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Search tokens"
          >
            <Search size={14} />
          </button>

          <button
            type="button"
            onClick={onOpenFilter}
            className="w-7 h-7 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Filter options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Optional Search Bar */}
      {showSearch && (
        <div className="animate-fade-in">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens or network..."
            className="w-full bg-[#0d111c] border border-stone-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder:text-stone-600 outline-none focus:border-amber-500"
            autoFocus
          />
        </div>
      )}

      {/* 2. TOKEN LIST (Matching Screenshot 2 exact rows) */}
      <div className="divide-y divide-stone-850 bg-[#07090e] rounded-2xl border border-stone-850/80 overflow-hidden shadow-xl">
        {filteredTokens.map((token) => {
          const isPositive = token.change24h >= 0;
          const fiatValue = token.balance * token.priceUsd;

          return (
            <div
              key={token.id}
              onClick={() => onSelectToken(token)}
              className="flex items-center justify-between p-3.5 hover:bg-[#0e1322] transition-colors cursor-pointer group"
            >
              {/* Left: Token Icon & Details */}
              <div className="flex items-center gap-3">
                {/* Token Icon */}
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-inner ${
                    token.id === 'srey'
                      ? 'bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] text-amber-300'
                      : 'bg-stone-900 border border-stone-800 text-stone-200'
                  }`}>
                    {token.icon}
                  </div>
                  {/* Network Mini Badge */}
                  <span className="absolute -bottom-1 -right-1 px-1 rounded bg-[#07090e] border border-stone-800 text-[8px] font-mono text-stone-400 font-bold">
                    {token.network}
                  </span>
                </div>

                {/* Name & Price with 24h Change */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                      {token.name}
                    </span>
                    {token.id === 'srey' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold font-mono">
                        NATIVE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-stone-400">
                      ${token.priceUsd < 0.01 ? token.priceUsd.toFixed(4) : token.priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>

                    <span className={`text-[10px] font-bold flex items-center ${
                      token.change24h === 0
                        ? 'text-stone-500'
                        : isPositive
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}>
                      {token.change24h === 0 ? '—' : isPositive ? '↑' : '↓'}
                      {Math.abs(token.change24h).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Balance & Fiat Value */}
              <div className="text-right space-y-0.5">
                <div className="font-mono font-black text-sm text-white">
                  {token.balance} {token.symbol}
                </div>
                <div className="text-xs font-mono text-stone-500">
                  ${fiatValue.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
