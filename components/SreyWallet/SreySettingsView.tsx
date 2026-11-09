import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Copy, Check, Lock, Globe, RefreshCw, Trash2, Smartphone, Eye, EyeOff, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import { SreyAccount } from './sreyWalletStore';

interface SreySettingsViewProps {
  account: SreyAccount;
  fiatCurrency: string;
  onCurrencyChange: (currency: string) => void;
  selectedNetwork: string;
  onNetworkChange: (net: string) => void;
  onResetWallet: () => void;
}

export const SreySettingsView: React.FC<SreySettingsViewProps> = ({
  account,
  fiatCurrency,
  onCurrencyChange,
  selectedNetwork,
  onNetworkChange,
  onResetWallet
}) => {
  const [showSeedModal, setShowSeedModal] = useState<boolean>(false);
  const [seedConfirmed, setSeedConfirmed] = useState<boolean>(false);
  const [copiedSeed, setCopiedSeed] = useState<boolean>(false);
  const [revealSeed, setRevealSeed] = useState<boolean>(false);

  const words = account.mnemonic.split(' ');

  const handleCopySeed = () => {
    navigator.clipboard.writeText(account.mnemonic);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const tgUser = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp?.initDataUnsafe?.user : null;

  return (
    <div className="w-full space-y-4 animate-fade-in text-xs font-sans pb-4">
      
      {/* 1. SECURITY & BACKUP CARD */}
      <div className="bg-[#0d111c] border border-stone-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold">
              <KeyRound size={16} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Secret Recovery Phrase</h4>
              <p className="text-[11px] text-stone-400">24-Word Master Cryptographic Seed</p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold">
            BACKED UP
          </span>
        </div>

        <p className="text-stone-300 text-[11px] leading-relaxed">
          Your 24-word recovery phrase gives full sovereign access to your multi-chain funds. Keep it private.
        </p>

        <button
          type="button"
          onClick={() => setShowSeedModal(true)}
          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 border border-amber-500/40 rounded-xl font-bold font-mono text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Eye size={14} />
          <span>View 24-Word Recovery Phrase</span>
        </button>
      </div>

      {/* 2. MULTI-CHAIN ADDRESSES CARD */}
      <div className="bg-[#0d111c] border border-stone-800 rounded-2xl p-4 space-y-2.5 shadow-lg">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Globe size={15} className="text-cyan-400" />
          <span>Derived Multi-Chain Addresses</span>
        </h4>

        <div className="space-y-2 font-mono text-[11px]">
          <div className="bg-[#07090e] p-2.5 rounded-xl border border-stone-850 flex items-center justify-between">
            <div>
              <span className="text-amber-400 font-bold block text-[10px]">TON (The Open Network)</span>
              <span className="text-stone-300 truncate max-w-[220px] block">{account.tonAddress}</span>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(account.tonAddress)}
              className="text-stone-500 hover:text-white p-1"
            >
              <Copy size={13} />
            </button>
          </div>

          <div className="bg-[#07090e] p-2.5 rounded-xl border border-stone-850 flex items-center justify-between">
            <div>
              <span className="text-cyan-400 font-bold block text-[10px]">EVM (Ethereum / BNB / Polygon)</span>
              <span className="text-stone-300 truncate max-w-[220px] block">{account.evmAddress}</span>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(account.evmAddress)}
              className="text-stone-500 hover:text-white p-1"
            >
              <Copy size={13} />
            </button>
          </div>

          <div className="bg-[#07090e] p-2.5 rounded-xl border border-stone-850 flex items-center justify-between">
            <div>
              <span className="text-yellow-400 font-bold block text-[10px]">Bitcoin (BTC Native SegWit)</span>
              <span className="text-stone-300 truncate max-w-[220px] block">{account.btcAddress}</span>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(account.btcAddress)}
              className="text-stone-500 hover:text-white p-1"
            >
              <Copy size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. PREFERENCES & CURRENCY */}
      <div className="bg-[#0d111c] border border-stone-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <h4 className="font-bold text-sm text-white">App Preferences</h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-mono text-stone-400 block mb-1">Display Fiat Currency:</label>
            <select
              value={fiatCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full bg-[#07090e] border border-stone-800 rounded-xl p-2.5 text-xs text-white font-mono outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NGN">NGN (₦)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-stone-400 block mb-1">Active Network:</label>
            <select
              value={selectedNetwork}
              onChange={(e) => onNetworkChange(e.target.value)}
              className="w-full bg-[#07090e] border border-stone-800 rounded-xl p-2.5 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="TON Mainnet">TON Mainnet</option>
              <option value="TON Testnet">TON Testnet</option>
              <option value="Multi-Chain EVM">Multi-Chain EVM</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. TELEGRAM WEBAPP ENVIRONMENT INFO */}
      <div className="bg-[#0d111c] border border-stone-800 rounded-2xl p-4 space-y-2 shadow-lg text-[11px] font-mono text-stone-400">
        <div className="flex items-center justify-between text-white font-bold">
          <span className="flex items-center gap-1.5 font-sans">
            <Smartphone size={14} className="text-cyan-400" /> Telegram Mini App Status
          </span>
          <span className="text-emerald-400">READY</span>
        </div>
        <div className="flex justify-between">
          <span>TMA SDK Version:</span>
          <span className="text-stone-300">v7.0 (Auto-expanded)</span>
        </div>
        <div className="flex justify-between">
          <span>Telegram User:</span>
          <span className="text-stone-300">{tgUser?.first_name || 'Anonymous User'}</span>
        </div>
        <div className="flex justify-between">
          <span>Client Encryption:</span>
          <span className="text-amber-400">BIP-39 Pure Client-Side</span>
        </div>
      </div>

      {/* 5. RESET / DISCONNECT */}
      <button
        type="button"
        onClick={() => {
          if (window.confirm("Are you sure you want to reset this wallet? Make sure you have your 24-word recovery phrase backed up first.")) {
            onResetWallet();
          }
        }}
        className="w-full py-3 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 text-rose-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
      >
        <Trash2 size={14} />
        <span>Reset Wallet / Erase Seed From Browser</span>
      </button>

      {/* RECOVERY PHRASE BACKUP MODAL */}
      {showSeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d111c] border border-amber-500/60 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                <ShieldCheck size={18} /> Backup Recovery Phrase
              </h3>
              <button
                type="button"
                onClick={() => setShowSeedModal(false)}
                className="text-stone-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-[11px] text-amber-200">
              <AlertTriangle size={14} className="inline mr-1 text-amber-400" />
              Do not screenshot. Anyone who knows these 24 words can take your funds.
            </div>

            {/* 24 Words Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#07090e] p-3 rounded-2xl border border-stone-800 max-h-[300px] overflow-y-auto">
              {words.map((word, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-[#0d111c] border border-stone-800 rounded-xl px-2 py-1.5 text-xs font-mono"
                >
                  <span className="text-[10px] text-stone-500 font-bold w-4 text-right">{idx + 1}.</span>
                  <span className="text-white font-bold">{revealSeed ? word : '••••••'}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setRevealSeed(!revealSeed)}
                className="text-stone-400 hover:text-white flex items-center gap-1.5 font-mono text-[11px]"
              >
                {revealSeed ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{revealSeed ? 'Hide' : 'Reveal'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySeed}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                {copiedSeed ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSeed ? 'Copied' : 'Copy 24 Words'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
