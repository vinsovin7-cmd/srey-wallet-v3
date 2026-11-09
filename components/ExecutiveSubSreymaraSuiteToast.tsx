import React, { useState, useEffect } from 'react';
import { Shield, X, Zap, MessageSquare, Play, Sparkles, Send, Loader2, ArrowRight } from 'lucide-react';

interface ExecutiveSubSreymaraToastProps {
  onLaunchTelegramEngine?: () => void;
  onLaunchWhatsAppEngine?: () => void;
  onClose?: () => void;
}

export function ExecutiveSubSreymaraSuiteToast({
  onLaunchTelegramEngine,
  onLaunchWhatsAppEngine,
  onClose
}: ExecutiveSubSreymaraToastProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoadingTelegram, setIsLoadingLoadingTelegram] = useState(false);
  const [isLoadingWhatsApp, setIsLoadingWhatsApp] = useState(false);

  if (isDismissed) return null;

  const handleTelegramClick = () => {
    setIsLoadingLoadingTelegram(true);
    if (onLaunchTelegramEngine) {
      onLaunchTelegramEngine();
    }
    setTimeout(() => {
      setIsLoadingLoadingTelegram(false);
      window.open('#community_hub', '_self');
    }, 3200);
  };

  const handleWhatsAppClick = () => {
    setIsLoadingWhatsApp(true);
    if (onLaunchWhatsAppEngine) {
      onLaunchWhatsAppEngine();
    }
    setTimeout(() => {
      setIsLoadingWhatsApp(false);
      window.open('https://wa.me/85510371231?text=Hello%20Sreymara%20Monetization%20Engine', '_blank');
    }, 1500);
  };

  const triggerDynamicOffer = () => {
    window.open('https://earnings.ink', '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '360px',
        height: '180px',
        backgroundColor: '#0D0E12',
        color: '#FFFFFF',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        borderRadius: '12px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.85), 0 0 15px rgba(217, 70, 239, 0.2)',
        backdropFilter: 'blur(12px)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px 14px',
        boxSizing: 'border-box',
        zIndex: 999999
      }}
      className="animate-in slide-in-from-bottom-5 duration-500 hover:border-amber-400 transition-all"
    >
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 text-sm">🌐</span>
          <span className="text-[11px] font-black tracking-wider text-[#FF3B30] uppercase">
            LIVE EARNING NOTIFYER
          </span>
        </div>
        <button
          onClick={() => {
            setIsDismissed(true);
            if (onClose) onClose();
          }}
          className="text-stone-400 hover:text-white transition p-0.5 text-base font-bold leading-none cursor-pointer"
          title="Dismiss"
        >
          ×
        </button>
      </div>

      {/* 2. Dynamic Centerpiece (LIVE EVENT Slot) */}
      <div
        onClick={triggerDynamicOffer}
        className="flex items-center gap-3 bg-stone-900/80 p-2 rounded-lg border border-stone-800 hover:border-amber-500/50 transition cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-lg bg-rose-950/80 text-rose-400 flex items-center justify-center font-bold text-lg border border-rose-800/50 shrink-0 group-hover:scale-105 transition">
          📧
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="m-0 text-[12px] font-bold text-stone-100 truncate group-hover:text-amber-300 transition">
            Pocket Option - Light Up Your Chart
          </h4>
          <p className="m-0 text-[10px] text-stone-400 truncate">
            Deposit Boosts. Stars. Grand Reward.
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
            <span className="text-[#007AFF] text-[9px] font-black uppercase tracking-wider">
              ● LIVE EVENT
            </span>
          </div>
        </div>
      </div>

      {/* 3. Quick-Action Interactive Grid */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleTelegramClick}
          disabled={isLoadingTelegram}
          className="bg-[#1C1F2E] border border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white text-[#FF3B30] text-[9px] font-extrabold py-1.5 px-2 rounded transition cursor-pointer flex items-center justify-center gap-1 truncate shadow"
        >
          {isLoadingTelegram ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
              <span>Initializing (3s)...</span>
            </>
          ) : (
            <span>TELEGRAM ADS ENGINES</span>
          )}
        </button>

        <button
          onClick={handleWhatsAppClick}
          disabled={isLoadingWhatsApp}
          className="bg-[#1C1F2E] border border-emerald-500 hover:bg-emerald-600 hover:text-white text-emerald-400 text-[9px] font-extrabold py-1.5 px-2 rounded transition cursor-pointer flex items-center justify-center gap-1 truncate shadow"
        >
          {isLoadingWhatsApp ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <span>WHAT'S APP</span>
          )}
        </button>
      </div>

      {/* 4. Bottom Monogram */}
      <div className="text-center text-[11px] font-black text-[#D946EF] tracking-[1.5px] uppercase drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
        EXECUTIVE SUB SREYMARA SUITE
      </div>
    </div>
  );
}
