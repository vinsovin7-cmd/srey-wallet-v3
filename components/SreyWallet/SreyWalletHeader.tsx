import React, { useState } from 'react';
import { MoreVertical, X, Copy, Check, ChevronDown, Shield, Sparkles, Network, Globe } from 'lucide-react';
import { SreyAccount } from './sreyWalletStore';

interface SreyWalletHeaderProps {
  account: SreyAccount;
  onOpenAccountSwitcher: () => void;
  onOpenSettings: () => void;
  onCloseApp?: () => void;
  selectedNetwork: string;
  onOpenNetworkModal: () => void;
}

export const SreyWalletHeader: React.FC<SreyWalletHeaderProps> = ({
  account,
  onOpenAccountSwitcher,
  onOpenSettings,
  onCloseApp,
  selectedNetwork,
  onOpenNetworkModal
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(account.tonAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.close) {
      try {
        (window as any).Telegram.WebApp.close();
      } catch {
        // fallback
      }
    }
    if (onCloseApp) onCloseApp();
  };

  const shortAddress = `${account.tonAddress.slice(0, 6)}...${account.tonAddress.slice(-4)}`;

  return (
    <div className="w-full bg-[#07090E] border-b border-stone-800/80 px-4 pt-3 pb-3 space-y-3 sticky top-0 z-30">
      
      {/* 1. TOP TITLE BAR (Matching Screenshot 1 & 2) */}
      <div className="flex items-center justify-between">
        {/* App Title */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-bold text-xs shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            👑
          </div>
          <h1 className="font-sans font-black text-sm sm:text-base tracking-wider text-white uppercase drop-shadow-sm">
            SREY WALLET
          </h1>
        </div>

        {/* Right Controls: Kebab Menu (3 dots) & Close 'X' */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Options & Settings"
          >
            <MoreVertical size={18} />
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close TMA"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. ACCOUNT & NETWORK PILL STRIP (Matching Screenshot 2) */}
      <div className="flex items-center justify-between gap-2 bg-[#0d111c] p-1.5 rounded-2xl border border-stone-800/80 shadow-inner">
        
        {/* Left: Account Selector Dropdown ("Wallet 1 ⌵") */}
        <button
          type="button"
          onClick={onOpenAccountSwitcher}
          className="flex items-center gap-1.5 bg-[#141a2b] hover:bg-[#1a2238] px-3 py-1.5 rounded-xl text-xs font-bold text-white transition border border-stone-800 cursor-pointer shrink-0"
        >
          <span className="text-amber-400 text-xs">⚔️</span>
          <span>{account.name}</span>
          <ChevronDown size={13} className="text-stone-400" />
        </button>

        {/* Center: Address Bar with Copy */}
        <button
          type="button"
          onClick={handleCopyAddress}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#080b13] hover:bg-[#101524] px-2.5 py-1.5 rounded-xl text-[11px] font-mono text-stone-300 transition border border-stone-800/60 cursor-pointer truncate"
          title="Click to copy TON address"
        >
          <span className="truncate">{shortAddress}</span>
          {copied ? (
            <Check size={12} className="text-emerald-400 shrink-0" />
          ) : (
            <Copy size={12} className="text-stone-500 shrink-0" />
          )}
        </button>

        {/* Right: Network Selector Pill */}
        <button
          type="button"
          onClick={onOpenNetworkModal}
          className="flex items-center gap-1 bg-[#141a2b] hover:bg-[#1a2238] px-2 py-1.5 rounded-xl text-[11px] font-mono font-bold text-cyan-300 transition border border-stone-800 cursor-pointer shrink-0"
          title="Switch Network"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{selectedNetwork}</span>
          <ChevronDown size={12} className="text-stone-400" />
        </button>

      </div>

    </div>
  );
};
