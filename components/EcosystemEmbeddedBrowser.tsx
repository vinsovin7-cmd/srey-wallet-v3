import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home,
  Lock,
  ExternalLink,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Search,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Layers,
  Sparkles,
  Wifi,
  ChevronDown,
  X,
  CheckCircle2
} from "lucide-react";
import { EmbeddedAppItem, FIFTEEN_EMBEDDED_ORIGINAL_APPS } from "./EmbeddedFifteenOriginalAppsSuite";
import {
  TikTokEmbeddedView,
  FacebookEmbeddedView,
  XTwitterEmbeddedView,
  GoogleAIStudioEmbeddedView,
  TelegramEmbeddedView,
  InstagramEmbeddedView,
  WhatsAppEmbeddedView,
  YouTubeEmbeddedView,
  SpotifyEmbeddedView,
  PayPalEmbeddedView,
  ChaseMobileEmbeddedView,
  RevolutEmbeddedView,
  GoogleMapsEmbeddedView,
  GmailEmbeddedView,
  NotionEmbeddedView
} from "./EmbeddedAppViews";
import { LitmatchLandingPage } from "./LitmatchLandingPage";

interface EcosystemEmbeddedBrowserProps {
  initialApp?: EmbeddedAppItem;
  onClose?: () => void;
  onHide?: () => void;
}

export const EcosystemEmbeddedBrowser: React.FC<EcosystemEmbeddedBrowserProps> = ({
  initialApp = FIFTEEN_EMBEDDED_ORIGINAL_APPS[0],
  onClose,
  onHide
}) => {
  // Active App & Navigation State
  const [activeApp, setActiveApp] = useState<EmbeddedAppItem>(initialApp);
  const [urlInput, setUrlInput] = useState<string>(initialApp.url);
  const [currentUrl, setCurrentUrl] = useState<string>(initialApp.url);
  const [history, setHistory] = useState<string[]>([initialApp.url]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // View Mode: 'web_frame' (Real iframe loaded embededly) vs 'native_app' (interactive built-in app view)
  const [viewMode, setViewMode] = useState<"web_frame" | "native_app">("web_frame");
  
  // Proxy Mode: routes through server-side /api/browser/proxy to strip X-Frame-Options and CSP
  const [useProxy, setUseProxy] = useState<boolean>(true);
  
  // Viewport Device Simulation
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Browser Utilities
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [showPortalPicker, setShowPortalPicker] = useState<boolean>(false);
  const [iframeErrorNotice, setIframeErrorNotice] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Compute effective URL to load in iframe (uses proxy to bypass refused-to-connect restrictions)
  const getEffectiveFrameUrl = (url: string) => {
    if (!url) return "";
    if (useProxy || url.includes("tiktok.com") || url.includes("instagram.com") || url.includes("facebook.com") || url.includes("twitter.com") || url.includes("x.com")) {
      return `/api/browser/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // When initialApp changes externally, sync browser URL
  useEffect(() => {
    if (initialApp && initialApp.id !== activeApp.id) {
      navigateDirect(initialApp.url, initialApp);
    }
  }, [initialApp]);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const navigateDirect = (url: string, targetApp?: EmbeddedAppItem) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    
    // Check if URL matches one of our 15 apps
    const matchedApp = targetApp || FIFTEEN_EMBEDDED_ORIGINAL_APPS.find(
      app => cleanUrl.toLowerCase().includes(app.name.toLowerCase().replace(/\s+/g, '')) ||
             cleanUrl.toLowerCase().includes(new URL(app.url).hostname.replace('www.', ''))
    );

    if (matchedApp) {
      setActiveApp(matchedApp);
    }

    setUrlInput(cleanUrl);
    setCurrentUrl(cleanUrl);
    setIsLoading(true);
    setIframeErrorNotice(false);
    setIframeKey(prev => prev + 1);

    // Update history
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(cleanUrl);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);

    showNotification(`Loading ${matchedApp ? matchedApp.name : cleanUrl} embededly in ecosystem browser...`);

    // Reset loading state after reasonable timeout
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateDirect(urlInput);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      const prevUrl = history[newIdx];
      setUrlInput(prevUrl);
      setCurrentUrl(prevUrl);
      setIsLoading(true);
      setIframeKey(prev => prev + 1);
      setTimeout(() => setIsLoading(false), 1200);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      const nextUrl = history[newIdx];
      setUrlInput(nextUrl);
      setCurrentUrl(nextUrl);
      setIsLoading(true);
      setIframeKey(prev => prev + 1);
      setTimeout(() => setIsLoading(false), 1200);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
    showNotification("Reloading embedded portal...");
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Render the native interactive app component for the active app
  const renderNativeAppView = () => {
    switch (activeApp.id) {
      case "app-tiktok":
        return <TikTokEmbeddedView />;
      case "app-facebook":
        return <FacebookEmbeddedView />;
      case "app-x":
        return <XTwitterEmbeddedView />;
      case "app-aistudio":
        return <GoogleAIStudioEmbeddedView />;
      case "app-telegram":
        return <TelegramEmbeddedView />;
      case "app-instagram":
        return <InstagramEmbeddedView />;
      case "app-whatsapp":
        return <WhatsAppEmbeddedView />;
      case "app-youtube":
        return <YouTubeEmbeddedView />;
      case "app-spotify":
        return <SpotifyEmbeddedView />;
      case "app-paypal":
        return <PayPalEmbeddedView />;
      case "app-chase":
        return <ChaseMobileEmbeddedView />;
      case "app-revolut":
        return <RevolutEmbeddedView />;
      case "app-maps":
        return <GoogleMapsEmbeddedView />;
      case "app-gmail":
        return <GmailEmbeddedView />;
      case "app-notion":
        return <NotionEmbeddedView />;
      case "app-litmatch":
        return <LitmatchLandingPage />;
      default:
        return <TikTokEmbeddedView />;
    }
  };

  return (
    <div
      id="ecosystem-embedded-browser"
      className={`w-full bg-[#0A0D14] border-2 border-amber-400/80 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden transition-all duration-200 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : "my-4"
      }`}
    >
      {/* 1. TOP BROWSER TITLE BAR & WINDOW CONTROLS */}
      <div className="bg-[#121624] px-3 sm:px-4 py-2 border-b border-stone-800 flex items-center justify-between flex-wrap gap-2 text-xs select-none">
        
        {/* Active Tab & Quick Portal Switcher */}
        <div className="flex items-center gap-2">
          {/* Active Tab Badge */}
          <div className="flex items-center gap-2 bg-[#1A1F32] border border-amber-500/50 px-3 py-1 rounded-xl shadow-inner text-white font-mono font-bold">
            <span className="text-base">{activeApp.icon}</span>
            <span className="truncate max-w-[130px] sm:max-w-[200px]">{activeApp.name}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </div>

          {/* Quick Portal Switcher Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPortalPicker(!showPortalPicker)}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-[11px] font-mono font-medium flex items-center gap-1 cursor-pointer transition border border-stone-700"
              title="Switch embedded portal"
            >
              <span>Portals</span>
              <ChevronDown size={12} className={showPortalPicker ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {/* Portals Dropdown Menu */}
            {showPortalPicker && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#141828] border border-amber-500/60 rounded-xl shadow-2xl z-50 p-2 grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto font-mono text-[11px]">
                <div className="col-span-2 px-2 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800">
                  Select Embedded Portal:
                </div>
                {FIFTEEN_EMBEDDED_ORIGINAL_APPS.map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setShowPortalPicker(false);
                      navigateDirect(app.url, app);
                    }}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg text-left truncate cursor-pointer transition ${
                      activeApp.id === app.id
                        ? "bg-amber-500 text-stone-950 font-bold"
                        : "text-stone-300 hover:bg-stone-800 hover:text-white"
                    }`}
                  >
                    <span>{app.icon}</span>
                    <span className="truncate">{app.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Mode Controls: Web Frame vs In-Ecosystem Native View */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-stone-800 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => {
              setViewMode("web_frame");
              showNotification("Switched to Live Web Frame mode (Embeded URL)");
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition ${
              viewMode === "web_frame"
                ? "bg-blue-600 text-white shadow"
                : "text-stone-400 hover:text-stone-200"
            }`}
            title="Load the real website/app inside the ecosystem iframe"
          >
            <Globe size={12} />
            <span className="hidden sm:inline">🌐 Live Web Frame</span>
            <span className="sm:hidden">Web</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("native_app");
              showNotification("Switched to In-Ecosystem Native View (Dual-Login Ready)");
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition ${
              viewMode === "native_app"
                ? "bg-amber-500 text-stone-950 shadow"
                : "text-stone-400 hover:text-stone-200"
            }`}
            title="Interactive in-ecosystem authenticated client view"
          >
            <Layers size={12} />
            <span className="hidden sm:inline">📱 In-Ecosystem View</span>
            <span className="sm:hidden">Native</span>
          </button>
        </div>

        {/* Right Window Controls: Device Sizing, Fullscreen & Hide */}
        <div className="flex items-center gap-1.5">
          {/* Device Viewport Simulation */}
          <div className="hidden md:flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5 text-stone-400">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-1 rounded cursor-pointer ${deviceMode === "desktop" ? "bg-stone-700 text-white" : "hover:text-white"}`}
              title="Desktop View (Full Width)"
            >
              <Monitor size={13} />
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`p-1 rounded cursor-pointer ${deviceMode === "tablet" ? "bg-stone-700 text-white" : "hover:text-white"}`}
              title="Tablet View (768px)"
            >
              <Tablet size={13} />
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-1 rounded cursor-pointer ${deviceMode === "mobile" ? "bg-stone-700 text-white" : "hover:text-white"}`}
              title="Mobile View (390px)"
            >
              <Smartphone size={13} />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Browser"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Optional External Popout (Kept as secondary action) */}
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-stone-400 hover:text-blue-400 rounded-lg hover:bg-stone-800 cursor-pointer transition"
            title="Pop out to external tab ↗"
          >
            <ExternalLink size={14} />
          </a>

          {/* Hide Browser Button */}
          {onHide && (
            <button
              type="button"
              onClick={onHide}
              className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/60 rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition"
              title="Hide embedded browser to declutter interface"
            >
              <span>Hide ▲</span>
            </button>
          )}

          {/* Close Button if modal */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-stone-800 cursor-pointer transition"
              title="Close browser"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. BROWSER NAVIGATION & URL BAR */}
      <div className="bg-[#0E121E] px-3 sm:px-4 py-2 border-b border-stone-800/80 flex items-center gap-2 text-xs">
        
        {/* Navigation Buttons: Back, Forward, Reload, Home */}
        <div className="flex items-center gap-1 text-stone-400">
          <button
            type="button"
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition"
            title="Back"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition"
            title="Forward"
          >
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={handleReload}
            className={`p-1.5 rounded-lg hover:bg-stone-800 hover:text-white cursor-pointer transition ${
              isLoading ? "animate-spin text-amber-400" : ""
            }`}
            title="Reload Portal"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={() => navigateDirect(activeApp.url, activeApp)}
            className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-white cursor-pointer transition"
            title="Go to App Home"
          >
            <Home size={14} />
          </button>
        </div>

        {/* Address / URL Input Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
          <div className="w-full bg-[#080A10] border border-stone-700/80 focus-within:border-amber-400 rounded-xl px-2.5 py-1.5 flex items-center gap-2 transition shadow-inner">
            {/* SSL Lock Indicator */}
            <div className="flex items-center gap-1 text-emerald-400 shrink-0 font-mono text-[10px]">
              <Lock size={12} className="text-emerald-400" />
              <span className="hidden sm:inline">Secure</span>
            </div>

            {/* URL Input */}
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter URL or portal link (e.g., https://www.tiktok.com)..."
              className="flex-1 bg-transparent text-stone-200 text-xs font-mono outline-none border-0 p-0 focus:ring-0 placeholder-stone-600"
            />

            {/* Copy URL */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-stone-400 hover:text-white p-0.5 rounded cursor-pointer"
              title="Copy URL"
            >
              {copiedUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>

            {/* Direct Portal Link Button (Runs Inside Browser) */}
            <button
              type="submit"
              className="px-2.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-black text-[11px] rounded-lg cursor-pointer transition shadow flex items-center gap-1 shrink-0"
              title="Load Portal in Embedded Browser"
            >
              <span>Go</span>
            </button>
          </div>
        </form>

        {/* Direct Portal Link Quick Action */}
        <button
          type="button"
          onClick={() => {
            setViewMode("web_frame");
            navigateDirect(activeApp.url, activeApp);
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/50 text-amber-300 rounded-xl text-xs font-mono font-bold cursor-pointer transition shrink-0"
          title="Load Real Portal Embededly"
        >
          <Sparkles size={13} className="text-amber-400" />
          <span>Direct Portal Link</span>
        </button>
      </div>

      {/* 3. NOTIFICATION & STATUS BANNER */}
      {statusMessage && (
        <div className="px-4 py-1.5 bg-emerald-950/80 border-b border-emerald-600/50 text-emerald-300 text-[11px] font-mono flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-emerald-400 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* 4. MAIN BROWSER VIEWPORT FRAME */}
      <div className="flex-1 bg-black relative flex items-center justify-center overflow-auto min-h-[520px]">
        {/* Responsive Frame Container */}
        <div
          className={`h-full flex flex-col transition-all duration-300 ${
            deviceMode === "desktop"
              ? "w-full min-h-[520px]"
              : deviceMode === "tablet"
              ? "w-[768px] min-h-[520px] border-x border-stone-800 shadow-2xl my-2 rounded-xl overflow-hidden"
              : "w-[390px] min-h-[520px] border-2 border-stone-700 shadow-2xl my-2 rounded-2xl overflow-hidden"
          }`}
        >
          {viewMode === "web_frame" ? (
            <div className="w-full h-full min-h-[520px] flex-1 flex flex-col relative bg-stone-950">
              
              {/* Optional CSP/X-Frame Notice helper if domain doesn't permit framing */}
              <div className="px-3 py-1.5 bg-[#121626] border-b border-stone-800 text-[11px] font-mono text-stone-300 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-stone-400">
                  <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                  <span className="truncate">
                    In-Ecosystem Sandbox • <span className="text-amber-300 font-bold">{activeApp.name}</span>
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-700/60 rounded text-[9px]">
                    {useProxy ? "⚡ PROXY BYPASS ACTIVE" : "DIRECT"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setUseProxy(!useProxy);
                      setIframeKey(prev => prev + 1);
                      showNotification(useProxy ? "Switched to Direct URL Frame" : "Switched to Webview Proxy (Bypasses Frame-Ancestors/CSP)");
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition border ${
                      useProxy ? "bg-amber-500/20 text-amber-300 border-amber-500/50" : "bg-stone-800 text-stone-300 border-stone-700"
                    }`}
                    title="Toggle between Direct Frame and Ecosystem Proxy (Removes X-Frame-Options block)"
                  >
                    {useProxy ? "⚡ Proxy: Enabled" : "Direct Frame"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("native_app")}
                    className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-cyan-300 border border-stone-700 rounded text-[10px] font-bold cursor-pointer"
                  >
                    📱 Switch to Native App View ➔
                  </button>
                </div>
              </div>

              {/* Real Embedded IFrame Container */}
              <div className="flex-1 relative w-full h-full min-h-[480px]">
                {isLoading && (
                  <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-stone-300 font-mono text-xs">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                    <span>Connecting to {activeApp.name} ({currentUrl})...</span>
                  </div>
                )}

                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={getEffectiveFrameUrl(currentUrl)}
                  title={`${activeApp.name} Embedded View`}
                  className="w-full h-full min-h-[480px] border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone; display-capture"
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </div>
          ) : (
            // Native In-Ecosystem Interactive View (Dual Login + Guaranteed 100% Zero-Frame Error)
            <div className="w-full h-full min-h-[520px] flex-1 flex flex-col bg-black">
              {renderNativeAppView()}
            </div>
          )}
        </div>
      </div>

      {/* 5. BOTTOM STATUS & DUAL-LOGIN ACTION BAR */}
      <div className="p-3 bg-[#101422] border-t border-stone-800 flex items-center justify-between flex-wrap gap-2 text-xs font-mono select-none">
        <div className="flex items-center gap-2 text-stone-300">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Active In-Ecosystem Browser • No External Redirect • Session Protected</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Portal Link Button */}
          <button
            type="button"
            onClick={() => {
              setViewMode("web_frame");
              navigateDirect(activeApp.url, activeApp);
            }}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition shadow"
            title="Reload Active Portal Embededly"
          >
            <Sparkles size={11} className="text-amber-400" />
            <span>Direct Portal Link</span>
          </button>

          {/* Hide Button */}
          {onHide && (
            <button
              type="button"
              onClick={onHide}
              className="px-3 py-1 bg-red-950 hover:bg-red-900 text-red-200 border border-red-700/80 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <span>Hide Browser ▲</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcosystemEmbeddedBrowser;
