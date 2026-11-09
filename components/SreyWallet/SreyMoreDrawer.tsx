import React from 'react';
import { X, CreditCard, Zap, Coins, Fuel, Sparkles, ExternalLink, ShieldCheck, Gift, Users } from 'lucide-react';

interface SreyMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchOfframp: () => void;
  onLaunchBuy: () => void;
}

export const SreyMoreDrawer: React.FC<SreyMoreDrawerProps> = ({
  isOpen,
  onClose,
  onLaunchOfframp,
  onLaunchBuy
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-fade-in">
      <div className="bg-[#0d111c] border border-stone-800 rounded-t-3xl sm:rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl relative text-white font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">More Srey Web3 Services</h3>
              <p className="text-[10px] text-stone-400">Fiat On/Off Ramps, Staking & Gas Tank</p>
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

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3 text-left">
          
          {/* 1. BUY CRYPTO (On-Ramp) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onLaunchBuy();
            }}
            className="p-3.5 bg-[#07090e] hover:bg-[#121727] border border-stone-800 hover:border-blue-500/50 rounded-2xl space-y-1.5 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <CreditCard size={18} />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-blue-300">
              Buy Crypto
            </div>
            <p className="text-[10px] text-stone-400 leading-tight">
              Bank Card, Apple Pay or Wire (Transak / MoonPay)
            </p>
          </button>

          {/* 2. SELL / CASH OUT (Off-Ramp) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onLaunchOfframp();
            }}
            className="p-3.5 bg-[#07090e] hover:bg-[#121727] border border-stone-800 hover:border-emerald-500/50 rounded-2xl space-y-1.5 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Zap size={18} />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-emerald-300">
              Cash Out (Sell)
            </div>
            <p className="text-[10px] text-stone-400 leading-tight">
              Send TON / USDT to your Bank, Card or PayPal
            </p>
          </button>

          {/* 3. SREY LIQUID REVENUE */}
          <div className="p-3.5 bg-[#07090e] border border-stone-800 rounded-2xl space-y-1.5 opacity-90">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Coins size={18} />
            </div>
            <div className="font-bold text-xs text-white">
              Srey Liquid Revenue
            </div>
            <p className="text-[10px] text-stone-400 leading-tight">
              Access 100% liquid revenue streams with zero lockup periods
            </p>
          </div>

          {/* 4. GAS TANK / BATTERY */}
          <div className="p-3.5 bg-[#07090e] border border-stone-800 rounded-2xl space-y-1.5 opacity-90">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Fuel size={18} />
            </div>
            <div className="font-bold text-xs text-white">
              Telegram Gas Tank
            </div>
            <p className="text-[10px] text-stone-400 leading-tight">
              Prepay gas fees in USDT or Stars with zero TON needed
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
