import React from 'react';
import { Share2, Rocket, Award, Zap } from 'lucide-react';

interface ViralShareCardProps {
  referralLink?: string;
  referralCode?: string;
}

/**
 * ViralShareCard.tsx
 * Triggers Telegram's native sharing mechanism with rich previews.
 */
export const ViralShareCard: React.FC<ViralShareCardProps> = ({ 
  referralLink = "https://t.me/ExecutiveSreymaraBot/app",
  referralCode = "EARN2024"
}) => {
  
  const handleShare = () => {
    const shareUrl = `${referralLink}?startapp=${referralCode}`;
    const shareText = "🚀 Join me on EXECUTIVE SREYMARA! Watch ads, claim vouchers, and earn TON rewards instantly. Use my link to get a 3.20 USDT welcome bonus! 💎";
    
    // Use Telegram WebApp native sharing
    const tg = (window as any).Telegram;
    if (tg?.WebApp) {
      // openTelegramLink for share
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      tg.WebApp.openTelegramLink(telegramShareUrl);
    } else {
      // Fallback for browser
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <div className="bg-[#0F1424]/80 backdrop-blur-md border-2 border-emerald-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <Share2 size={32} />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-1">
          <h3 className="text-xl font-black text-white flex items-center justify-center md:justify-start gap-2">
            Viral Traffic Engine <Zap size={18} className="text-emerald-400 fill-emerald-400" />
          </h3>
          <p className="text-sm text-stone-400 max-w-xs">
            Share your invite link with friends. Every person who joins via your rich preview card earns you <span className="text-emerald-400 font-bold">1.50 USDT</span> bonus.
          </p>
        </div>
        
        <button
          onClick={handleShare}
          className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded-2xl shadow-xl shadow-emerald-500/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
        >
          <Rocket size={20} />
          <span>INVITE FRIENDS</span>
        </button>
      </div>
      
      {/* Rich Preview Simulator Hint */}
      <div className="mt-4 pt-4 border-t border-stone-800 flex items-center gap-2 text-[10px] text-stone-500 font-mono">
        <Award size={12} className="text-emerald-400" />
        ENHANCED WITH TELEGRAM OPENGRAPH RICH PREVIEW PARAMETERS
      </div>
    </div>
  );
};
