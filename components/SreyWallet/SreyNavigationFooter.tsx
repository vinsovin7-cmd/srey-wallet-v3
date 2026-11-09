import React from 'react';
import { Wallet, Clock, Settings, Sparkles } from 'lucide-react';

interface SreyNavigationFooterProps {
  activeTab: 'wallet' | 'history' | 'settings';
  onSelectTab: (tab: 'wallet' | 'history' | 'settings') => void;
}

export const SreyNavigationFooter: React.FC<SreyNavigationFooterProps> = ({
  activeTab,
  onSelectTab
}) => {
  return (
    <div className="w-full bg-[#07090E] border-t border-stone-850/90 pt-2 pb-1 sticky bottom-0 z-30 shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
      
      {/* 3 Fixed Tabs (Matching Screenshot 2) */}
      <div className="grid grid-cols-3 max-w-md mx-auto px-4">
        
        {/* 1. WALLET TAB */}
        <button
          type="button"
          onClick={() => onSelectTab('wallet')}
          className={`flex flex-col items-center gap-1 py-1.5 transition-colors cursor-pointer relative ${
            activeTab === 'wallet' ? 'text-white' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          {activeTab === 'wallet' && (
            <span className="absolute top-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          )}
          <Wallet size={20} className={activeTab === 'wallet' ? 'text-amber-400' : ''} />
          <span className="text-[11px] font-sans font-bold tracking-tight">
            Wallet
          </span>
        </button>

        {/* 2. HISTORY TAB */}
        <button
          type="button"
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center gap-1 py-1.5 transition-colors cursor-pointer relative ${
            activeTab === 'history' ? 'text-white' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          {activeTab === 'history' && (
            <span className="absolute top-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          )}
          <Clock size={20} className={activeTab === 'history' ? 'text-amber-400' : ''} />
          <span className="text-[11px] font-sans font-bold tracking-tight">
            History
          </span>
        </button>

        {/* 3. SETTINGS TAB */}
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center gap-1 py-1.5 transition-colors cursor-pointer relative ${
            activeTab === 'settings' ? 'text-white' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          {activeTab === 'settings' && (
            <span className="absolute top-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          )}
          <Settings size={20} className={activeTab === 'settings' ? 'text-amber-400' : ''} />
          <span className="text-[11px] font-sans font-bold tracking-tight">
            Settings
          </span>
        </button>

      </div>

      {/* Footer Tagline (Matching Screenshot 1 & 2: @SREY_WALLET_BOT) */}
      <div className="text-center pt-1.5 pb-0.5 text-[10px] font-mono text-stone-600 tracking-wider">
        @SREY_WALLET_BOT
      </div>

    </div>
  );
};
