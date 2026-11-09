import React, { useEffect, useRef } from 'react';
import { Tv, Sparkles, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

interface RacerAdsBannerWidgetProps {
  className?: string;
}

export const RACER_ADS_VAST_TAG = "https://ronracepub.com/e/base36/2plie0buxhrpu07q7zuklsfnh4ghsad8cl74b71h0oba9m5amqnquzpg8574c7beggyzvg05lm8p2m3c612u8gneif";
export const RACER_ADS_INTERSTITIAL_SCRIPT = "https://ronracepub.com/e/base36/s0udzjp3pq8jwtd7g4imvepq658on";
export const RACER_ADS_BANNER_SCRIPT = "https://ronracepub.com/e/base36/313h7u2p0ypcyq4ii1pbfnaurypsfpvnpcm6aarmlt?width=240&height=400";

export const RacerAdsBannerWidget: React.FC<RacerAdsBannerWidgetProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = RACER_ADS_BANNER_SCRIPT;
      script.async = true;
      script.type = "text/javascript";
      script.charset = "UTF-8";
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className={`p-4 rounded-3xl bg-[#090D16] border border-amber-500/40 shadow-2xl text-stone-100 flex flex-col items-center justify-center text-center space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
        <Tv size={16} className="text-amber-400" />
        <span>RacerAds SREYMARA Banner (240x400 Placement #1224712)</span>
      </div>

      <div className="relative min-w-[240px] min-h-[400px] max-w-[240px] max-h-[400px] bg-black/80 border border-stone-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
          <div className="text-[11px] font-mono text-stone-500 flex flex-col items-center gap-1 p-4">
            <Sparkles size={20} className="text-amber-400 animate-spin-slow" />
            <span>Loading RacerAds 240x400 Ad...</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full text-[10px] font-mono text-stone-400 pt-1 border-t border-stone-800">
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck size={12} />
          <span>RacerAds Live</span>
        </span>
        <a
          href={RACER_ADS_VAST_TAG}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-300 hover:underline flex items-center gap-1 font-bold"
        >
          <span>VAST Tag ↗</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};

export default RacerAdsBannerWidget;
