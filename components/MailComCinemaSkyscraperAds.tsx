import React, { useState, useEffect } from "react";
import { ExternalLink, ShieldCheck, DollarSign, Sparkles, Volume2, Info, ChevronRight, CheckCircle2 } from "lucide-react";

export interface SkyscraperAd {
  id: string;
  brand: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  cpmRateUsdt: number;
  bgGradient: string;
  accentColor: string;
  imageUrl?: string;
  badge?: string;
  finePrint: string;
}

export const LIVE_SKYSCRAPER_ADS: SkyscraperAd[] = [
  {
    id: "ad-delta-force",
    brand: "DELTA FORCE • MELTDOWN",
    headline: "CRITICAL MOMENT IN AZ3",
    subheadline: "COMMUNITY EVENT • MULTI-PLATFORM TACTICAL SHOOTER",
    ctaText: "DOWNLOAD FREE NOW",
    ctaLink: "https://playdeltaforce.com",
    cpmRateUsdt: 0.048,
    bgGradient: "from-stone-950 via-zinc-900 to-emerald-950",
    accentColor: "#00FFCC",
    badge: "ACTION FPS",
    finePrint: "*INCLUDES IN-GAME PURCHASES (INCLUDES RANDOM ITEMS)"
  },
  {
    id: "ad-ihg-army-hotels",
    brand: "IHG ARMY HOTELS",
    headline: "HOTELS DESIGNED TO PUT YOU AT EASE.",
    subheadline: "Serving Military Members, Veterans & Families Nationwide with Comfort & Hospitality",
    ctaText: "BOOK NOW",
    ctaLink: "https://www.ihg.com/armyhotels",
    cpmRateUsdt: 0.052,
    bgGradient: "from-[#0A2540] via-[#103B66] to-[#0A2540]",
    accentColor: "#F5A623",
    badge: "OFFICIAL MILITARY LODGING",
    finePrint: "Special government per diem rates apply. IHG Rewards member benefits included."
  },
  {
    id: "ad-sound-it-out",
    brand: "SOUND IT OUT • AD COUNCIL",
    headline: "To listen to me is to know me.",
    subheadline: "Find ways to support your kids’ mental wellness through music and open conversations.",
    ctaText: "LEARN MORE",
    ctaLink: "https://sounditoutkids.org",
    cpmRateUsdt: 0.045,
    bgGradient: "from-neutral-950 via-stone-900 to-black",
    accentColor: "#FFE600",
    badge: "AD COUNCIL / PIVOTAL",
    finePrint: "A public service initiative in partnership with Pivotal Ventures & Ad Council."
  }
];

interface SkyscraperProps {
  position?: "left" | "right";
  onYieldEarned?: (amount: number, adId: string) => void;
}

export const MailComCinemaSkyscraperAd: React.FC<SkyscraperProps> = ({
  position = "right",
  onYieldEarned
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(position === "left" ? 0 : 1);
  const [impressionCount, setImpressionCount] = useState(1);
  const [accumulatedAdYield, setAccumulatedAdYield] = useState(0.24);
  const [isHovered, setIsHovered] = useState(false);
  const [showAdInfo, setShowAdInfo] = useState(false);

  const ad = LIVE_SKYSCRAPER_ADS[currentAdIndex];

  // Auto-rotate ads every 18 seconds like Mail.com / Google AdSense
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setCurrentAdIndex((prev) => (prev + 1) % LIVE_SKYSCRAPER_ADS.length);
        setImpressionCount((prev) => prev + 1);
        const microYield = 0.005;
        setAccumulatedAdYield((prev) => Number((prev + microYield).toFixed(4)));
        if (onYieldEarned) onYieldEarned(microYield, ad.id);
      }
    }, 18000);

    return () => clearInterval(timer);
  }, [isHovered, ad.id, onYieldEarned]);

  const handleAdClick = () => {
    const bonus = 0.02;
    setAccumulatedAdYield((prev) => Number((prev + bonus).toFixed(4)));
    if (onYieldEarned) onYieldEarned(bonus, ad.id);
    window.open(ad.ctaLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-[160px] sm:w-[175px] h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-stone-800/80 flex flex-col justify-between relative bg-black select-none shrink-0 transition-all duration-300 hover:border-amber-500/50 group"
    >
      {/* AdChoices Blue Triangle Official Badge */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-[9px] text-slate-800 shadow cursor-pointer hover:bg-white"
        onClick={(e) => {
          e.stopPropagation();
          setShowAdInfo(!showAdInfo);
        }}
        title="AdChoices - Personalized Display Advertising"
      >
        <svg className="w-2.5 h-2.5 text-sky-600 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 4l6.5 13h-13L12 6z"/>
        </svg>
        <span className="font-bold text-[8px]">Ad</span>
      </div>

      {/* Yield Status Pill Top Left */}
      <div className="absolute top-2 left-2 z-20 bg-emerald-950/90 border border-emerald-500/60 backdrop-blur px-1.5 py-0.5 rounded-full text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1 shadow">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>+${accumulatedAdYield.toFixed(3)}</span>
      </div>

      {/* Background with Theme & Poster Art */}
      <div className={`absolute inset-0 bg-gradient-to-b ${ad.bgGradient} opacity-95 z-0`} />

      {/* Decorative Visual Content matching screenshots */}
      <div className="relative z-10 p-3 pt-9 flex flex-col h-full justify-between text-white">
        
        {/* Brand Header */}
        <div>
          {ad.badge && (
            <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-white/10 text-stone-200 border border-white/10 mb-2">
              {ad.badge}
            </span>
          )}
          <h4 className="text-[11px] font-black tracking-wider uppercase text-stone-200 leading-tight">
            {ad.brand}
          </h4>
        </div>

        {/* Center Headline & Hero Visual */}
        <div className="my-auto py-4 space-y-2 text-center">
          {ad.id === "ad-delta-force" && (
            <div className="relative my-2 py-2">
              <div className="w-20 h-20 mx-auto rounded-xl bg-emerald-900/30 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner animate-pulse">
                🪖
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold mt-1">
                OPERATOR SQUAD
              </div>
            </div>
          )}

          {ad.id === "ad-ihg-army-hotels" && (
            <div className="relative my-2 py-2">
              <div className="w-20 h-20 mx-auto rounded-xl bg-blue-900/30 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner">
                🏨
              </div>
              <div className="text-[10px] font-mono text-amber-300 font-bold mt-1">
                ARMY LODGING
              </div>
            </div>
          )}

          {ad.id === "ad-sound-it-out" && (
            <div className="relative my-2 py-2">
              <div className="w-20 h-20 mx-auto rounded-xl bg-stone-900/40 border border-yellow-400/40 flex items-center justify-center text-3xl shadow-inner">
                🎧
              </div>
              <div className="text-[10px] font-mono text-yellow-300 font-bold mt-1">
                KIDS MENTAL HEALTH
              </div>
            </div>
          )}

          <h3 
            className="text-sm sm:text-base font-black uppercase leading-tight tracking-tight drop-shadow-md"
            style={{ color: ad.accentColor }}
          >
            {ad.headline}
          </h3>

          <p className="text-[10px] text-stone-300 leading-snug font-normal line-clamp-3 px-1">
            {ad.subheadline}
          </p>
        </div>

        {/* Bottom CTA Button & Fine Print */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleAdClick}
            className="w-full py-2.5 px-2 rounded-xl text-stone-950 font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 cursor-pointer"
            style={{ backgroundColor: ad.accentColor }}
          >
            <span>{ad.ctaText}</span>
            <ExternalLink size={12} className="text-stone-950" />
          </button>

          <p className="text-[7.5px] text-stone-400 text-center leading-tight line-clamp-2 px-1">
            {ad.finePrint}
          </p>

          <div className="flex items-center justify-between text-[8px] text-stone-400 pt-1 border-t border-white/10">
            <span>Mail.com Ads #{(currentAdIndex + 1)}</span>
            <span className="text-emerald-400 font-mono">TON Pay Ready</span>
          </div>
        </div>
      </div>

      {/* Info popover if user taps AdChoices */}
      {showAdInfo && (
        <div className="absolute inset-0 bg-stone-900/95 z-30 p-3 flex flex-col justify-between text-[10px] text-stone-300">
          <div>
            <div className="font-bold text-white mb-1">About Google & Mail.com Ads</div>
            <p className="leading-tight text-[9px] text-stone-400">
              Live advertisement syndication active on the ecosystem. Every impression and interaction yields USDT credited directly to your connected TON wallet.
            </p>
          </div>
          <button
            onClick={() => setShowAdInfo(false)}
            className="w-full py-1.5 bg-stone-800 text-white rounded text-[10px] font-bold"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MailComCinemaSkyscraperAd;
