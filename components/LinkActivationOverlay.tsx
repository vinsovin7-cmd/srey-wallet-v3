import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  CheckCircle, 
  Radio, 
  Tv, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  X,
  Zap,
  Globe,
  Bell,
  Minimize2,
  Maximize2,
  TrendingUp,
  Share2
} from 'lucide-react';

interface LinkActivationOverlayProps {
  onComplete?: () => void;
  targetDestination?: string;
}

export const LinkActivationOverlay: React.FC<LinkActivationOverlayProps> = ({
  onComplete,
  targetDestination
}) => {
  // User Journey Flow: User gets into ecosystem first and starts watching/checking
  // Ad stage: 'exploring' (grace period) -> 'showing' (interactive ad active) -> 'minimized' (docked PiP) -> 'closed'
  const [adStage, setAdStage] = useState<'exploring' | 'showing' | 'minimized' | 'closed'>('exploring');
  const [exploreSecondsRemaining, setExploreSecondsRemaining] = useState<number>(7);
  const [countdown, setCountdown] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [geoInfo, setGeoInfo] = useState<any>(null);
  const [notifiedTelegram, setNotifiedTelegram] = useState<boolean>(false);
  const [trafficStats, setTrafficStats] = useState<{ totalClicks: number; totalShares: number; publisherRevenueUsdt: number }>({
    totalClicks: 148,
    totalShares: 64,
    publisherRevenueUsdt: 735.60
  });
  const [adFormat, setAdFormat] = useState<'video' | 'smartlink'>('video');
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);
  const [showPermanentBanner, setShowPermanentBanner] = useState<boolean>(true);

  // 1. Log Geo/IP, register click, & trigger instant Telegram Bot API Alert to Admin
  useEffect(() => {
    let isMounted = true;

    async function triggerNotification() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const refId = urlParams.get('ref') || urlParams.get('startapp') || urlParams.get('userId') || 'guest_' + Math.random().toString(36).substring(2, 8);
        const username = urlParams.get('username') || urlParams.get('user') || 'Anonymous User';
        const target = targetDestination || window.location.hash || window.location.pathname || '/#cinema';

        const res = await fetch('/api/ecosystem/link-click-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: refId,
            username,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct Tap / Link Share',
            targetUrl: target,
            screen: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString()
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setGeoInfo(data.metadata || null);
            setNotifiedTelegram(true);
            if (data.totalClicks) {
              setTrafficStats({
                totalClicks: data.totalClicks,
                totalShares: data.totalShares || 64,
                publisherRevenueUsdt: data.publisherRevenueUsdt || 735.60
              });
            }
          }
        }
      } catch (err) {
        console.warn("Link-click notify exception:", err);
      }
    }

    triggerNotification();

    // Also poll traffic stats every 10 seconds
    const pollInterval = setInterval(async () => {
      try {
        const r = await fetch('/api/ecosystem/live-traffic-stats');
        if (r.ok) {
          const s = await r.json();
          if (isMounted && s.totalClicks) {
            setTrafficStats({
              totalClicks: s.totalClicks,
              totalShares: s.totalShares,
              publisherRevenueUsdt: s.totalPublisherBonusEarningsUsdt || 735.60
            });
          }
        }
      } catch {}
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [targetDestination]);

  // 2. Exploration grace period countdown: User starts watching/checking first
  useEffect(() => {
    if (adStage !== 'exploring') return;

    const exploreTimer = setInterval(() => {
      setExploreSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(exploreTimer);
          setAdStage('showing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(exploreTimer);
  }, [adStage]);

  // 3. Ad countdown timer once active
  useEffect(() => {
    if (adStage !== 'showing' && adStage !== 'minimized') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [adStage]);

  const handleSkipOrProceed = () => {
    setAdStage('closed');
    onComplete?.();
  };

  const handleClaimAdReward = () => {
    setBonusClaimed(true);
    const current = parseFloat(localStorage.getItem('aljazeera_user_watch_yield_usdt') || '24.85');
    localStorage.setItem('aljazeera_user_watch_yield_usdt', (current + 0.50).toFixed(2));
    
    // Open HilltopAds / SmartLink partner destination in new window
    window.open('https://idealistic-revenue.com/3K6vdo', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* 1. INITIAL GRACE PERIOD FLOATING TICKER: Let them watch & explore first */}
      {adStage === 'exploring' && (
        <div 
          className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-md z-[9990] bg-[#0c101c]/95 border-2 border-amber-400 rounded-2xl p-3 shadow-[0_0_40px_rgba(245,158,11,0.5)] backdrop-blur-md animate-fade-in flex flex-col gap-2 font-sans select-none"
          id="ecosystem-welcome-monetization-bar"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono font-black text-amber-300 uppercase flex items-center gap-1">
                <Zap size={13} className="text-amber-400 fill-amber-400" />
                <span>6X PUBLISHER BOOST ACTIVE</span>
              </span>
            </div>
            <div className="text-[10px] font-mono text-stone-400">
              Ad in <strong className="text-amber-400">{exploreSecondsRemaining}s</strong>
            </div>
          </div>

          <p className="text-[11px] text-stone-300 leading-tight">
            🎬 You are live in the <strong>Sreymara Cinema & Apps Ecosystem</strong>. Enjoy streaming! Sponsored reward ad arriving shortly.
          </p>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-800 text-[10px] font-mono">
            <div className="flex items-center gap-2 text-stone-400">
              <span>👁️ {trafficStats.totalClicks} Clicks</span>
              <span>•</span>
              <span>📢 {trafficStats.totalShares} Shares</span>
            </div>
            <button
              type="button"
              onClick={() => setAdStage('showing')}
              className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-black rounded-lg shadow cursor-pointer transition active:scale-95 flex items-center gap-1 text-[10px]"
            >
              <Sparkles size={11} />
              <span>Watch Now (+0.50 USDT)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MINIMIZED PICTURE-IN-PICTURE DOCKED AD UNIT */}
      {adStage === 'minimized' && (
        <div 
          className="fixed bottom-4 right-4 z-[9990] w-72 sm:w-80 bg-[#090C14] border-2 border-amber-400 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md animate-fade-in flex flex-col"
          id="ecosystem-pip-ad-unit"
        >
          <div className="p-2 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Sparkles size={12} className="text-amber-400" />
              <span>6X REWARD AD PIP</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAdStage('showing')}
                className="p-1 text-stone-400 hover:text-white rounded hover:bg-stone-800 cursor-pointer"
                title="Expand Ad Full Screen"
              >
                <Maximize2 size={12} />
              </button>
              <button
                type="button"
                onClick={handleSkipOrProceed}
                className="p-1 text-stone-400 hover:text-red-400 rounded hover:bg-stone-800 cursor-pointer"
                title="Close"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          <div className="relative aspect-video w-full bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/gCNeDWCI0vo?autoplay=1&mute=1&controls=0&playsinline=1"
              title="Mini Sponsor Ad"
              className="w-full h-full border-0 pointer-events-none"
            />
          </div>

          <div className="p-2 flex items-center justify-between gap-1.5 text-[10px] font-mono bg-stone-950">
            <span className="text-emerald-400 font-bold">+$0.50 USDT Ready</span>
            <button
              type="button"
              onClick={handleClaimAdReward}
              className="px-2 py-0.5 bg-amber-400 text-stone-950 font-bold rounded shadow cursor-pointer text-[10px]"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}

      {/* 3. FULL INTERACTIVE AD MODAL OVERLAY */}
      {adStage === 'showing' && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fade-in font-sans"
          id="link-activation-overlay-modal"
        >
          <div 
            className="w-full max-w-2xl bg-[#090C14] border-2 border-amber-400/90 rounded-3xl overflow-hidden shadow-[0_0_70px_rgba(245,158,11,0.5)] flex flex-col relative max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Status & Verification Header */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-stone-950 via-[#0d121f] to-stone-950 border-b border-stone-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400 fill-amber-400" />
                  <span>ECOSYSTEM 6X MONETIZATION AD</span>
                </span>
                <span className="text-[10px] bg-red-950/80 text-red-200 border border-red-700/60 px-2 py-0.5 rounded-full font-mono font-black">
                  +$0.50 USDT REWARD
                </span>
              </div>

              <div className="flex items-center gap-2">
                {notifiedTelegram && (
                  <span className="px-2 py-0.5 bg-sky-950/90 text-sky-300 border border-sky-500/50 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                    <Bell size={11} className="text-sky-400" />
                    <span className="hidden sm:inline">ADMIN NOTIFIED</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setAdStage('minimized')}
                  className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 cursor-pointer"
                  title="Minimize to Picture-in-Picture Dock so you can watch cinema simultaneously"
                >
                  <Minimize2 size={13} />
                </button>
                
                {canSkip ? (
                  <button
                    type="button"
                    onClick={handleSkipOrProceed}
                    className="px-3.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-mono font-black text-xs rounded-xl shadow cursor-pointer transition active:scale-95 flex items-center gap-1"
                  >
                    <span>CONTINUE TO APP</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-stone-900 text-stone-400 border border-stone-800 rounded-xl text-xs font-mono font-bold">
                    Skip in <strong className="text-amber-400">{countdown}s</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Live Admin Telemetry Banner & 6X Traffic Multiplier Bar */}
            <div className="px-4 py-2 bg-black/70 border-b border-stone-900 flex items-center justify-between flex-wrap gap-2 text-[10px] font-mono text-stone-400">
              <div className="flex items-center gap-2 flex-wrap">
                <Globe size={12} className="text-cyan-400 shrink-0" />
                <span>GEO/IP:</span>
                <span className="text-emerald-300 font-bold">
                  {geoInfo?.country || 'Detected Region'} ({geoInfo?.city || 'Verified Node'})
                </span>
                <span className="text-stone-600 hidden sm:inline">•</span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <TrendingUp size={11} />
                  <span>Clicks: {trafficStats.totalClicks} | Shares: {trafficStats.totalShares}</span>
                </span>
              </div>
              <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                <span>Bot: @gemini_sreymara_bot</span>
                <span className="text-stone-600">•</span>
                <span className="text-emerald-400 font-bold">6X Publisher Bonus Active</span>
              </div>
            </div>

            {/* Main Ad Delivery Space (High-Converting Short Video / SmartLink) */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {adFormat === 'video' ? (
                <div className="relative w-full h-full">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/gCNeDWCI0vo?autoplay=1&mute=0&controls=0&playsinline=1&rel=0&modestbranding=1"
                    title="Sponsor Short Video Ad"
                    className="w-full h-full border-0 pointer-events-auto"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                  {/* Floating Interactive CTA Overlay on Video */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between p-3 bg-black/85 backdrop-blur-md rounded-2xl border border-amber-400/50 shadow-2xl flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-stone-950 font-black text-sm shadow">
                        🎬
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          Celestial Cinema & Srey Love Suite
                        </h4>
                        <p className="text-[10px] text-stone-400 font-mono">
                          Watch-to-Earn USDT Active • 6X Publisher Yield
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleClaimAdReward}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-mono font-black text-xs rounded-xl shadow cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                      >
                        <Sparkles size={13} className="text-stone-950" />
                        <span>{bonusClaimed ? 'CLAIMED +$0.50' : 'CLICK & CLAIM +$0.50 USDT'}</span>
                      </button>

                      <a
                        href="https://idealistic-revenue.com/3K6vdo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/50 font-mono font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1"
                      >
                        <span>HilltopAds SmartLink</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full p-6 bg-gradient-to-br from-[#0c1220] via-black to-[#1a1005] flex flex-col justify-between items-center text-center">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold">
                      <Sparkles size={14} />
                      <span>6X PREMIUM SPONSOR DIRECT LINK</span>
                    </div>
                    <h3 className="text-lg font-black text-white">
                      Support Ecosystem Infrastructure &amp; Claim High Return Yields
                    </h3>
                    <p className="text-xs text-stone-300 max-w-md mx-auto">
                      Click through to support the publisher server pool and claim immediate on-chain micro-USDT bonus directly to your ledger!
                    </p>
                  </div>

                  <a
                    href="https://idealistic-revenue.com/3K6vdo"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClaimAdReward}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-mono font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.6)] cursor-pointer transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <span>OPEN SPONSOR PORTAL (+0.50 USDT)</span>
                    <ExternalLink size={16} />
                  </a>

                  <div className="text-[11px] font-mono text-stone-500">
                    Direct-Click Unit (HilltopAds / SmartLink Monetization Network • 6X Yield)
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions & Format Switcher */}
            <div className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800/80 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-stone-400 font-mono">Format:</span>
                <button
                  type="button"
                  onClick={() => setAdFormat('video')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${
                    adFormat === 'video'
                      ? 'bg-amber-400 text-stone-950 font-black'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  Short Video Ad
                </button>
                <button
                  type="button"
                  onClick={() => setAdFormat('smartlink')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${
                    adFormat === 'smartlink'
                      ? 'bg-amber-400 text-stone-950 font-black'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  Direct-Click Ad
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdStage('minimized')}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-700 rounded-xl text-xs font-mono font-bold cursor-pointer transition flex items-center gap-1"
                >
                  <Minimize2 size={12} />
                  <span>Dock to PiP (Watch Both)</span>
                </button>
                <button
                  type="button"
                  onClick={handleSkipOrProceed}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-mono font-black rounded-xl text-xs cursor-pointer transition"
                >
                  {canSkip ? "Enter Ecosystem Now ➔" : "Dismiss"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PERSISTENT NON-INTRUSIVE HIGH-REVENUE BANNER BAR */}
      {showPermanentBanner && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-stone-950 via-[#0d1322] to-stone-950 border-t border-amber-500/50 px-3 py-1.5 flex items-center justify-between text-xs font-mono text-stone-300 shadow-2xl backdrop-blur-md"
          id="ecosystem-publisher-monetization-footer"
        >
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-amber-300 font-bold shrink-0">6X PUBLISHER EARNINGS:</span>
            <span className="text-stone-400 text-[11px] truncate">
              HilltopAds SmartLink &amp; AdsGram Monetization Active • Yield: <strong className="text-emerald-400">${trafficStats.publisherRevenueUsdt.toFixed(2)} USDT</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://idealistic-revenue.com/3K6vdo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition"
            >
              <span>Monetize Traffic</span>
              <ExternalLink size={10} />
            </a>
            <button
              type="button"
              onClick={() => setShowPermanentBanner(false)}
              className="p-1 text-stone-500 hover:text-stone-300 cursor-pointer"
              title="Close Banner"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

