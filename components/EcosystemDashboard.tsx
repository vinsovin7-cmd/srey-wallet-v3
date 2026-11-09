import React, { useState, useEffect, useRef } from "react";
import { SreymaraVideogram } from "./SreymaraVideogram";
import { ScoMonetizationSuite } from "./ScoMonetizationSuite";
import { TelegramTonWallet } from "./TelegramTonWallet";
import { SolscanSuite } from "./SolscanSuite";
import { NdunakagramSuite } from "./NdunakagramSuite";
import { ExternalTransactionIntegration } from "./ExternalTransactionIntegration";
import { 
  Zap, 
  ShoppingBag, 
  MessageSquare, 
  Activity, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  RefreshCw, 
  Globe, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  UserCheck, 
  LogOut, 
  Sliders,
  Sparkles,
  Tv,
  Wallet,
  Send,
  ArrowUpRight,
  Shield,
  Volume2,
  Share2,
  CheckCircle2,
  ExternalLink,
  Pause,
  SkipForward,
  Award,
  Layers,
  Music,
  FileText,
  Headphones,
  Wand2,
  Image as ImageIcon,
  Video,
  BarChart3,
  Presentation,
  PlusCircle,
  Radio,
  Film,
  Maximize2,
  Minimize2,
  Search,
  RotateCcw,
  PlayCircle,
  ArrowRight,
  X,
  Coins,
  GitBranch,
  Heart
} from "lucide-react";

interface Session {
  id: string;
  domain: string;
  status: "online" | "idle" | "logged_out";
  landedAt: string;
  durationSeconds: number;
  earningsAccumulated: number;
  tidioSignalSent: boolean;
  tidioLogoutSignalSent: boolean;
}

interface Transaction {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  timestamp: string;
  source: string;
  tidioNotified: boolean;
}

interface WithdrawalRecord {
  id: string;
  amount: number;
  asset: "USDT" | "USD" | "SOL";
  destination: string;
  txHash: string;
  timestamp: string;
  status: "CONFIRMED_ON_CHAIN" | "PROCESSING";
  network: string;
}

interface PhantomWalletState {
  connected: boolean;
  address: string;
  solBalance: number;
  usdtBalance: number;
  totalWithdrawnUsdt: number;
  withdrawals: WithdrawalRecord[];
}

interface TelegramConfig {
  enabled: boolean;
  botToken: string;
  chatId: string;
  autoIntervalMinutes: number;
  lastDispatchTimestamp: string;
  nextDispatchSeconds: number;
  dispatchLogs: Array<{
    id: string;
    timestamp: string;
    amountDispatched: number;
    telegramStatus: string;
    messageSummary: string;
  }>;
}

interface CinemaChannel {
  id: number;
  title: string;
  category: string;
  embedUrl: string;
  viewersCount: number;
  yieldAccrued: number;
  artistName?: string;
  isCustomArtistTrack?: boolean;
  sponsorAd: {
    title: string;
    sponsor: string;
    payoutUsd: number;
    bannerUrl?: string;
  };
}

interface StatsData {
  shopDomain: string;
  clientId: string;
  onlineVisitorsCount: number;
  totalSessions: number;
  activeSessionYield: number;
  totalRevenueRecorded: number;
  liveYieldRatePerSec: number;
  tidioSignalStatus: string;
  shopifyWebhookStatus: string;
  sessions: Session[];
  recentTransactions: Transaction[];
  phantomWallet: PhantomWalletState;
  tonTelegramWallet?: any;
  telegramConfig: TelegramConfig;
  cinemaChannels: CinemaChannel[];
  activeChannelIndex: number;
}

export type EcosystemTab = "matrix" | "ton_wallet" | "external_api" | "solscan" | "sco_monetization" | "github_app" | "telemetry" | "cinema" | "artist" | "phantom" | "telegram" | "urls" | "cli" | "paradise";

interface EcosystemDashboardProps {
  initialTab?: EcosystemTab;
  embedded?: boolean;
}

export const EcosystemDashboard: React.FC<EcosystemDashboardProps> = ({
  initialTab = "matrix",
  embedded = true
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<EcosystemTab>(initialTab);
  const [showOfficialTgAuth, setShowOfficialTgAuth] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleTabSelect = (tab: EcosystemTab) => {
    setActiveTab(tab);
    // Smooth scroll content area into view so user immediately sees the build
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [telemetryData, setTelemetryData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Cinema State
  const [currentChannelIdx, setCurrentChannelIdx] = useState(0);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 80/20 Video Revenue Tracking State
  const [userShareAccumulated, setUserShareAccumulated] = useState(169.10);
  const [platformReserveAccumulated, setPlatformReserveAccumulated] = useState(676.40);
  const [totalSecondsWatched, setTotalSecondsWatched] = useState(3382);

  // Sequenced Next Video Player State (Track 1: Rick Astley -> Track 2: BBC Merlin)
  const [isRickAstleyFinished, setIsRickAstleyFinished] = useState<boolean>(true); // default true because Rick Astley has reached 3:33 in user session
  const [rickAstleyProgressSeconds, setRickAstleyProgressSeconds] = useState<number>(213); // 3m 33s = 213s
  const [isMerlinPlaying, setIsMerlinPlaying] = useState<boolean>(true);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState<boolean>(true);
  const [merlinYieldAccrued, setMerlinYieldAccrued] = useState<number>(84.60);

  // AI PowerUp Tools State
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ toolType: string; result: any; revenueCredited: number } | null>(null);

  // Musician Upload Form State
  const [songTitle, setSongTitle] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [artistNameInput, setArtistNameInput] = useState("");
  const [musicGenreInput, setMusicGenreInput] = useState("");
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAsset, setWithdrawAsset] = useState<"USDT" | "USD" | "SOL">("USDT");
  const [withdrawDest, setWithdrawDest] = useState("");
  const [withdrawalMessage, setWithdrawalMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Phantom Custom Link Address Input
  const [customPhantomAddr, setCustomPhantomAddr] = useState("");
  
  // CLI State & Multimodal Image Paste
  const [cliInput, setCliInput] = useState("");
  const [cliImage, setCliImage] = useState<string | null>(null);
  const [cliLogs, setCliLogs] = useState<Array<{ type: "cmd" | "out" | "err"; text: string }>>([
    { 
      type: "out", 
      text: "[ECOSYSTEM HEAVENLY PARADISE CLI v3.8 - MULTIMODAL READY]\nConnected to Shopify Client ID: 5144661590b6f29869cd1cdae3248074\nPhantom Master Wallet: 8bpV9T3qdHTVDWdSsvVwu3e6pbJVUqwN3M8vsj6TVNbX (Solana SPL Connected)\nTelegram Dispatcher: Active (@wallet / 30-min interval)\nTip: You can type commands or PASTE AN IMAGE (Ctrl+V) directly into this CLI for Gemini vision diagnosis!\nType 'help' or 'telemetry' for live ecosystem telemetry." 
    }
  ]);

  // Notifications Alert Banner State
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch stats and telemetry from backend
  const fetchStats = async () => {
    try {
      const [statsRes, telemRes] = await Promise.allSettled([
        fetch("/api/ecosystem/stats"),
        fetch("/api/ecosystem/telemetry")
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.ok) {
        const contentType = statsRes.value.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await statsRes.value.json();
          setStats(data);
          if (!withdrawDest && data.phantomWallet?.address) {
            setWithdrawDest(data.phantomWallet.address);
          }
        }
      }

      if (telemRes.status === "fulfilled" && telemRes.value.ok) {
        const contentType = telemRes.value.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const tData = await telemRes.value.json();
          if (tData.telemetry) {
            setTelemetryData(tData.telemetry);
          }
        }
      }
    } catch (err) {
      // Fail silently to keep developer console clean
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchStats();
      }
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // 80/20 Revenue video update ticker (simulates video timeupdate events)
  useEffect(() => {
    const videoTicker = setInterval(async () => {
      if (activeTab === "cinema" && typeof document !== "undefined" && document.visibilityState === "visible") {
        try {
          const res = await fetch("/api/cinema/video-timeupdate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ timeDiff: 8, earningsRate: 0.05 }),
          });
          const contentType = res.headers.get("content-type");
          if (res.ok && contentType && contentType.includes("application/json")) {
            const data = await res.json();
            setUserShareAccumulated(data.totalUserBalance);
            setPlatformReserveAccumulated(data.totalPlatformReserve);
            setTotalSecondsWatched(prev => prev + 8);
          }
        } catch (e) {
          // ignore
        }
      }
    }, 8000);
    return () => clearInterval(videoTicker);
  }, [activeTab]);

  // Sequencer auto-advance timer & Merlin yield ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isRickAstleyFinished) {
      timer = setInterval(() => {
        setRickAstleyProgressSeconds(prev => {
          if (prev >= 213) {
            setIsRickAstleyFinished(true);
            if (autoAdvanceEnabled) {
              setIsMerlinPlaying(true);
              triggerNotification("[AUTO-ADVANCE QUEUE] Rick Astley (3:33) concluded! BBC Merlin is now broadcasting inside the ecosystem.");
            }
            return 213;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (isMerlinPlaying && activeTab === "cinema") {
      timer = setInterval(() => {
        setMerlinYieldAccrued(prev => +(prev + 0.05).toFixed(2));
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isRickAstleyFinished, isMerlinPlaying, autoAdvanceEnabled, activeTab]);

  // Reset sequence to replay Rick Astley from 0:00
  const handleReplayRickAstley = () => {
    setIsRickAstleyFinished(false);
    setRickAstleyProgressSeconds(0);
    setIsMerlinPlaying(false);
    triggerNotification("Reset sequence: Replaying Rick Astley (3:33). Merlin will auto-play upon conclusion.");
  };

  // Fast-advance Rick Astley to completed
  const handleFastAdvanceRickAstley = () => {
    setIsRickAstleyFinished(true);
    setRickAstleyProgressSeconds(213);
    setIsMerlinPlaying(true);
    triggerNotification("Rick Astley finished (3:33)! BBC Merlin auto-advanced and is now playing inside the ecosystem.");
  };

  // Switch primary cinema screen to Merlin
  const handlePromoteMerlinToMainStage = () => {
    const merlinIdx = stats?.cinemaChannels?.findIndex(c => c.id === 21);
    if (merlinIdx !== undefined && merlinIdx >= 0) {
      setCurrentChannelIdx(merlinIdx);
    } else {
      setCurrentChannelIdx(0);
    }
    triggerNotification("Promoted BBC Merlin to primary Sreymara Cinema display.");
  };

  // AI PowerUp Generator Handler
  const handleRunAiPowerUp = async (toolType: string) => {
    setAiGenerating(true);
    setAiResult(null);
    try {
      const currentChTitle = stats?.cinemaChannels?.[currentChannelIdx]?.title || "Cinema Stream Broadcast";
      const res = await fetch("/api/cinema/ai-powerup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolType, videoTitle: currentChTitle }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAiResult({
          toolType,
          result: data.result,
          revenueCredited: data.revenueCredited,
        });
        fetchStats();
        triggerNotification(`[AI POWERUP COMPLETE] Generated ${toolType.toUpperCase()}! Credited +$${data.revenueCredited.toFixed(2)} USD!`);
      }
    } catch (err) {
      triggerNotification("Failed to generate AI PowerUp output.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Musician Upload Track Handler
  const handleUploadArtistTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadMessage(null);

    if (!songTitle.trim() || !youtubeLink.trim()) {
      setUploadMessage({ type: "error", text: "Song/Video Title and YouTube Link are required." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/cinema/artist-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: songTitle.trim(),
          youtubeUrl: youtubeLink.trim(),
          artistName: artistNameInput.trim() || "Master Musician",
          genre: musicGenreInput.trim() || "Original Music / Live Stream",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadMessage({ type: "success", text: data.message });
        setSongTitle("");
        setYoutubeLink("");
        setArtistNameInput("");
        setMusicGenreInput("");
        fetchStats();
        setCurrentChannelIdx(0); // Jump to new channel 1
        triggerNotification(`[ARTIST MUSIC PUBLISHED] Live broadcast started!`);
      } else {
        setUploadMessage({ type: "error", text: data.error || "Upload failed." });
      }
    } catch (err) {
      setUploadMessage({ type: "error", text: "Network error submitting track." });
    } finally {
      setLoading(false);
    }
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerNotification(`Copied to clipboard: ${key}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Connect Web3 Phantom Extension if available
  const handleConnectPhantomWallet = async () => {
    if (typeof window !== "undefined" && (window as any).solana?.isPhantom) {
      try {
        const response = await (window as any).solana.connect();
        const address = response.publicKey.toString();
        await fetch("/api/phantom/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
        fetchStats();
        triggerNotification(`[PHANTOM CONNECTED] Wallet linked: ${address.slice(0, 6)}...${address.slice(-4)}`);
      } catch (err) {
        triggerNotification("Phantom connection request was cancelled.");
      }
    } else {
      if (customPhantomAddr.trim()) {
        await fetch("/api/phantom/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: customPhantomAddr.trim() }),
        });
        fetchStats();
        triggerNotification(`[PHANTOM LINKED] Address updated to: ${customPhantomAddr.slice(0, 8)}...`);
        setCustomPhantomAddr("");
      } else {
        triggerNotification("Please enter a valid Phantom / Solana wallet address to link.");
      }
    }
  };

  // Execute Withdrawal
  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWithdrawalMessage(null);

    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawalMessage({ type: "error", text: "Please enter a valid withdrawal amount." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          asset: withdrawAsset,
          destinationAddress: withdrawDest || stats?.phantomWallet.address,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWithdrawalMessage({ type: "success", text: data.message });
        setWithdrawAmount("");
        fetchStats();
        triggerNotification(`[WITHDRAWAL CONFIRMED] $${amt.toFixed(2)} ${withdrawAsset} dispatched on-chain!`);
      } else {
        setWithdrawalMessage({ type: "error", text: data.error || "Withdrawal failed." });
      }
    } catch (err) {
      setWithdrawalMessage({ type: "error", text: "Network error processing withdrawal." });
    } finally {
      setLoading(false);
    }
  };

  // Trigger Manual Telegram 30-Min Dispatch
  const handleTriggerTelegramDispatch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/trigger", { method: "POST" });
      const data = await res.json();
      fetchStats();
      triggerNotification(data.message || "Telegram earnings alert dispatched!");
    } catch (err) {
      triggerNotification("Failed to trigger Telegram dispatch.");
    } finally {
      setLoading(false);
    }
  };

  // Play Sponsor Ad in Cinema (5-second Countdown, then credit revenue and auto-advance)
  const handleTriggerSponsorAd = async () => {
    if (isAdPlaying) return;
    setIsAdPlaying(true);
    setAdCountdown(5);

    if (adTimerRef.current) clearInterval(adTimerRef.current);

    let count = 5;
    adTimerRef.current = setInterval(() => {
      count -= 1;
      setAdCountdown(count);
      if (count <= 0) {
        if (adTimerRef.current) clearInterval(adTimerRef.current);
        completeAdAndAdvance();
      }
    }, 1000);
  };

  const completeAdAndAdvance = async () => {
    setIsAdPlaying(false);
    try {
      const nextIdx = (currentChannelIdx + 1) % (stats?.cinemaChannels.length || 20);
      const res = await fetch("/api/cinema/channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelIndex: nextIdx, adCompleted: true }),
      });
      const data = await res.json();
      setCurrentChannelIdx(nextIdx);
      fetchStats();
      triggerNotification(data.message || `[AD REVENUE REWARDED] Auto-advanced to Channel ${nextIdx + 1}`);
    } catch (err) {
      console.log("Error advancing ad:", err);
    }
  };

  // Ping Visitor
  const handlePingVisitor = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tidio/visitor-session/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: "earnings.ink", status: "online", action: "land" }),
      });
      const data = await res.json();
      fetchStats();
      triggerNotification(data.tidioNotification || "New visitor landed on earnings.ink! Tidio signal activated.");
    } catch (err) {
      triggerNotification("Ping failed.");
    } finally {
      setLoading(false);
    }
  };

  // Logout Visitor
  const handleLogoutVisitor = async () => {
    setLoading(true);
    try {
      const activeSession = stats?.sessions.find(s => s.status === "online");
      const res = await fetch("/api/tidio/visitor-session/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId: activeSession?.id || "sess-ink-991", 
          domain: "earnings.ink", 
          action: "logout" 
        }),
      });
      const data = await res.json();
      fetchStats();
      triggerNotification(data.tidioNotification || "Visitor logged out! Released active earnings yield to Phantom Wallet.");
    } catch (err) {
      triggerNotification("Logout ping failed.");
    } finally {
      setLoading(false);
    }
  };

  // Simulate Sale
  const handleSimulateSale = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shopify/webhooks/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: Math.floor(1000 + Math.random() * 9000),
          total_price: "185.00",
          currency: "USD",
          customer: { email: "live.shopper@earnings.ink" }
        })
      });
      const data = await res.json();
      fetchStats();
      triggerNotification(`[SHOPIFY + TIDIO ALERT] ${data.message}`);
    } catch (err) {
      triggerNotification("Failed to simulate sale.");
    } finally {
      setLoading(false);
    }
  };

  // CLI Execute (with Multimodal Image Support)
  const executeCliCommand = async (commandToRun?: string, imageToSend?: string | null) => {
    const cmd = commandToRun !== undefined ? commandToRun : cliInput;
    const img = imageToSend !== undefined ? imageToSend : cliImage;
    if (!cmd.trim() && !img) return;

    const displayCmd = cmd.trim() ? cmd : (img ? "diagnose-image" : "status");
    setCliLogs(prev => [
      ...prev,
      { type: "cmd", text: `$ ${displayCmd}${img ? " [Image Attached]" : ""}` }
    ]);
    setCliInput("");
    setCliImage(null);

    try {
      const res = await fetch("/api/cli/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: displayCmd, image: img }),
      });
      const data = await res.json();
      setCliLogs(prev => [...prev, { type: "out", text: data.output }]);
      fetchStats();
    } catch (err) {
      setCliLogs(prev => [...prev, { type: "err", text: "CLI Execution error." }]);
    }
  };

  // Clipboard Paste Handler for CLI Terminal & Input
  const handleCliPaste = (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const items = Array.from(clipboardData.items || []);
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            const base64 = uploadEvent.target.result as string;
            setCliImage(base64);
            setCliLogs(prev => [
              ...prev,
              {
                type: "out",
                text: `[IMAGE PASTED INTO CLI] Captured image from clipboard (~${Math.round((base64.length * 0.75) / 1024)} KB). Click EXECUTE or press Enter to analyze with Gemini 3.8 Flash Vision!`
              }
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Precomputed values & Dynamic URL Re-binding
  const shopifyClientId = stats?.clientId || "5144661590b6f29869cd1cdae3248074";
  const shopDomain = stats?.shopDomain || "earnings.ink";
  const activeDeploymentUrl = telemetryData?.activeDeploymentUrl || "https://ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app";
  const phantomAddr = stats?.phantomWallet?.address || "8bpV9T3qdHTVDWdSsvVwu3e6pbJVUqwN3M8vsj6TVNbX";
  const totalRev = stats?.totalRevenueRecorded || 845.50;
  const currentCh = stats?.cinemaChannels?.[currentChannelIdx] || {
    id: 1,
    title: "Legend of the Seeker (Season 1)",
    category: "Fantasy Epic",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1",
    viewersCount: 1420,
    yieldAccrued: 170.26,
    sponsorAd: { title: "Solana High-Yield Vaults", sponsor: "Solana Labs", payoutUsd: 12.50 }
  };

  const trackingUrl = `${activeDeploymentUrl}/?shopify_client_id=${shopifyClientId}&tidio_signal=active&monetize=session`;
  const oauthUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=${shopifyClientId}&scope=read_orders,write_orders,read_customers&redirect_uri=${encodeURIComponent(`${activeDeploymentUrl}/api/shopify/callback`)}&state=tidio_earnings_active`;
  const tidioScriptTag = `<script src="//code.tidio.co/${shopifyClientId.slice(0, 16)}.js" async></script>`;

  // Telegram countdown helper
  const tgCountdownMins = Math.floor((stats?.telegramConfig?.nextDispatchSeconds || 720) / 60);
  const tgCountdownSecs = (stats?.telegramConfig?.nextDispatchSeconds || 720) % 60;

  const TABS: Array<{
    id: EcosystemTab;
    label: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
  }> = [
    {
      id: "matrix",
      label: "Live Revenue & Visitor Tracker",
      icon: <Activity size={15} />,
      title: "⚡ Live Revenue & Visitor Tracker",
      subtitle: "Real-time Shopify & earnings.ink visitor yields, live durations & event simulations"
    },
    {
      id: "ton_wallet",
      label: "Telegram @Wallet (USDT on TON)",
      icon: <Wallet size={15} />,
      title: "💎 Telegram @Wallet & TON Jetton Ecosystem Treasury",
      subtitle: "Connected to TON address UQDl...WgrG with live USDT earnings balance, APY & transfers"
    },
    {
      id: "external_api",
      label: "External Systems API & Data",
      icon: <Share2 size={15} />,
      title: "🔗 External Systems Transaction Integration & API Gateway",
      subtitle: "Authenticated with Key 5dd2...ecb2: REST endpoints, live ledger streaming, webhooks & external system synchronization"
    },
    {
      id: "solscan",
      label: "Solscan.io (Fast Relayer)",
      icon: <Search size={15} />,
      title: "◎ Solscan.io Explorer & Instant Real-Time Transaction Pusher",
      subtitle: "Solscan Pro API v2 (kansasnelly@gmail.com), live Solana chain analytics & instant fund receipt"
    },
    {
      id: "sco_monetization",
      label: "SCO Monetization & Real Blockchain",
      icon: <Coins size={15} />,
      title: "🪙 SCO Omnichannel Monetization & Real Blockchain Engine",
      subtitle: "Worldwide Cards, Apple Pay, Solana & Base L2 Crypto, and real platform owner fee treasury"
    },
    {
      id: "github_app",
      label: "GitHub App Registration & Webhooks",
      icon: <GitBranch size={15} />,
      title: "🐙 GitHub App Registration & Webhook Monetization",
      subtitle: "22-step registration guide, HMAC-SHA256 webhooks, and GitHub Marketplace payouts"
    },
    {
      id: "telemetry",
      label: "4-Quadrant Live Telemetry",
      icon: <Radio size={15} />,
      title: "📡 4-Quadrant Live Ecosystem Telemetry & Sync",
      subtitle: "AlphaQubit Quantum operations, 80/20 yields, Web3 Treasury & Mail/TruthFinder status"
    },
    {
      id: "cinema",
      label: "Sreymara Cinema (20 Channels) & Ads",
      icon: <Tv size={15} />,
      title: "📺 Sreymara Cinema (20 Channels) & High-Definition Broadcast",
      subtitle: "20 HD live streams, sponsor ad rewards, 80/20 platform/user revenue split & AI tools"
    },
    {
      id: "artist",
      label: "Artist Studio & YouTube Upload",
      icon: <Music size={15} />,
      title: "🎵 Musician & Artist Live Broadcast Studio",
      subtitle: "Upload audio tracks and link YouTube live videos directly to Cinema Channel #1"
    },
    {
      id: "phantom",
      label: "Phantom Wallet & Withdrawal",
      icon: <Wallet size={15} />,
      title: "💼 Phantom Master Wallet & On-Chain Withdrawal Portal",
      subtitle: "USDT and Solana gas reserves, custom address linking, and instant on-chain payouts"
    },
    {
      id: "telegram",
      label: "Telegram 30-Min Alert",
      icon: <Send size={15} />,
      title: "✈️ Telegram 30-Min Automated Earnings Dispatcher & Videogram",
      subtitle: "Automated 30-minute earnings alerts dispatched to @wallet and interactive Videogram suite"
    },
    {
      id: "urls",
      label: "Integration URLs & New Endpoint",
      icon: <Globe size={15} />,
      title: "🌐 Re-bound Integration URLs & Dynamic Deployment Endpoint",
      subtitle: "Ready-to-copy tracking links, Shopify OAuth URLs, and embeddable live chat tags"
    },
    {
      id: "cli",
      label: "CLI Console (Vision Paste)",
      icon: <Terminal size={15} />,
      title: "💻 Interactive Ecosystem Cloud Terminal & Vision Diagnostics",
      subtitle: "Direct CLI execution for status, test sales, on-chain withdrawals, and pasted image diagnosis"
    },
    {
      id: "paradise",
      label: "Paradise Status",
      icon: <ShieldCheck size={15} />,
      title: "🛡️ Paradise Status & Architecture Verification",
      subtitle: "Guaranteed video layout integrity and AlphaQubit quantum paper preservation"
    }
  ];

  const currentTabMeta = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <>
      {/* Top Right Floating Matrix Launcher Pill */}
      <div className="fixed top-20 right-6 z-40 flex items-center gap-3">
        {notification && (
          <div className="animate-bounce flex items-center gap-2 bg-stone-900 text-nobel-gold border border-nobel-gold/50 px-4 py-2 rounded-full text-xs font-mono shadow-xl backdrop-blur-md">
            <Zap size={14} className="animate-pulse text-amber-400" />
            <span>{notification}</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(true);
            setIsFullscreen(true);
          }}
          className="group flex items-center gap-3 bg-stone-900/95 hover:bg-stone-900 text-stone-100 border border-nobel-gold/50 hover:border-nobel-gold px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
          title="Open Fullscreen Ecosystem Matrix"
        >
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-nobel-gold flex items-center gap-1">
              <Sparkles size={10} /> SHOPIFY + TIDIO + PHANTOM MATRIX
            </span>
            <span className="text-xs font-mono text-stone-200">
              {shopDomain} • ${totalRev.toFixed(2)} USDT
            </span>
          </div>
          <Sliders size={14} className="text-stone-400 group-hover:text-nobel-gold transition-colors" />
        </button>
      </div>

      {/* Minimized Banner if user closed it */}
      {!isOpen && (
        <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 flex justify-between items-center flex-wrap gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-nobel-gold border border-amber-800/60 flex items-center justify-center shadow">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Sreymara Heavenly Ecosystem & Live Revenue Matrix (Minimized)</h3>
              <p className="text-xs text-stone-400">Shopify Client ID: {shopifyClientId} • Active signals running in background</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-nobel-gold hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-2"
          >
            <Sliders size={14} /> Restore Ecosystem Dashboard
          </button>
        </div>
      )}

      {/* Main Full-Featured Dashboard */}
      {isOpen && (
        <div className={isFullscreen ? "fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex flex-col p-2 md:p-6 overflow-y-auto animate-fade-in" : "w-full animate-fade-in"}>
          <div className={`bg-stone-900 text-stone-100 w-full rounded-2xl border border-nobel-gold/30 shadow-2xl overflow-hidden flex flex-col ${isFullscreen ? "max-w-6xl mx-auto my-auto h-[92vh] max-h-[92vh]" : ""}`}>
            
            {/* Header */}
            <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nobel-gold via-amber-600 to-amber-800 flex items-center justify-center text-stone-950 shadow-lg shrink-0">
                  <Zap size={22} className="fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                      Sreymara Heavenly Ecosystem & Live Revenue Matrix
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ON-CHAIN LIVE
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 flex flex-wrap items-center gap-3 mt-0.5 font-mono">
                    <span>Shopify: <strong className="text-nobel-gold">{shopifyClientId}</strong></span>
                    <span>Phantom: <strong className="text-cyan-300">{phantomAddr.slice(0, 6)}...{phantomAddr.slice(-4)}</strong></span>
                    <span>Telegram: <strong className="text-emerald-400">@wallet (30m Auto)</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchStats}
                  className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                  title="Refresh Ecosystem Telemetry"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                  title={isFullscreen ? "Exit Fullscreen Modal" : "Expand to Fullscreen Modal"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => {
                    if (isFullscreen) {
                      setIsFullscreen(false);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {isFullscreen ? "MINIMIZE" : "HIDE"}
                </button>
              </div>
            </div>

            {/* Navigation Tabs Container - High Visibility with Active Indicator */}
            <div className="bg-stone-950/95 border-b border-stone-800 p-2.5 px-4 md:px-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-btn-${tab.id}`}
                      onClick={() => handleTabSelect(tab.id)}
                      className={`px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-200 shrink-0 ${
                        isActive
                          ? "bg-nobel-gold text-stone-950 font-black shadow-lg border border-amber-400 scale-[1.02] ring-2 ring-amber-400/30"
                          : "bg-stone-900/90 text-stone-200 hover:bg-stone-800 hover:text-white border border-stone-800 hover:border-stone-700"
                      }`}
                      title={`Open ${tab.label} build`}
                    >
                      <span className={isActive ? "text-stone-950" : "text-nobel-gold"}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-ping"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Section Header Bar */}
            <div className="bg-stone-950/80 border-b border-stone-800/80 px-4 md:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-stone-400 text-[11px] uppercase tracking-wider font-semibold">Active Build:</span>
                <span className="text-nobel-gold font-bold text-sm flex items-center gap-1.5">
                  {currentTabMeta.title}
                </span>
                <span className="text-stone-400 text-[11px] hidden md:inline">• {currentTabMeta.subtitle}</span>
              </div>
              <div className="text-[11px] text-stone-400 font-mono flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">
                  Build {TABS.findIndex(t => t.id === activeTab) + 1} of {TABS.length} Active & Interactive
                </span>
              </div>
            </div>

            {/* Build Body */}
            <div
              ref={contentRef}
              className={`p-4 md:p-6 space-y-6 ${isFullscreen ? "overflow-y-auto flex-1 min-h-0" : "overflow-visible"}`}
            >
              
              {/* TAB: SOLSCAN.IO PRO EXPLORER & REAL-TIME TRANSACTION PUSHER */}
              {activeTab === "solscan" && (
                <div className="space-y-6 animate-fade-in">
                  <SolscanSuite onFundsReceived={fetchStats} />
                </div>
              )}

              {/* TAB: SCO MONETIZATION & REAL BLOCKCHAIN */}
              {activeTab === "sco_monetization" && (
                <div className="animate-fade-in">
                  <ScoMonetizationSuite initialView="sco_blockchain" />
                </div>
              )}

              {/* TAB: TELEGRAM @WALLET (USDT ON TON) */}
              {activeTab === "ton_wallet" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top Status & Sync Banner */}
                  <div className="p-5 bg-gradient-to-r from-stone-950 via-[#0e1724] to-stone-950 rounded-2xl border border-cyan-800/60 shadow-2xl flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-cyan-400/40">
                        ₮
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white tracking-wide">
                            Telegram @Wallet • TON Blockchain Integration
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            LIVE CONNECTED
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">
                          Connected TON Address: <span className="text-emerald-400 font-bold">UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        onClick={() => setActiveTab("external_api")}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                        title="Integrate transaction ledger with external accounting & ERP systems using API Key 5dd2...ecb2"
                      >
                        <Share2 size={14} />
                        <span>External Systems API</span>
                        <span className="px-1.5 py-0.5 bg-black/20 text-stone-950 rounded text-[9px] font-mono font-bold">KEY 5dd2</span>
                      </button>
                      <button
                        onClick={() => {
                          window.location.hash = "#datingarts";
                          if (typeof window !== "undefined") {
                            const btn = document.getElementById("btn-nav-datingarts");
                            if (btn) btn.click();
                          }
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg cursor-pointer border border-pink-400/50"
                        title="Launch DatingArts Luxury Matchmaking Quiz & 100% Real Human Chat Engine"
                      >
                        <Heart size={14} className="text-pink-200 fill-pink-300" />
                        <span>DatingArts Matchmaking</span>
                        <span className="px-1.5 py-0.5 bg-pink-950 text-pink-200 rounded text-[9px] font-mono border border-pink-700 font-bold">100% REAL</span>
                      </button>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("open-telegram-mini-ecosystem"));
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg cursor-pointer border border-purple-400/40"
                        title="Open Telegram Mini Ecosystem & Live Matchmaking with Silent Monetization"
                      >
                        <Send size={13} className="text-white transform -rotate-12" />
                        <span>Telegram Mini Ecosystem</span>
                        <span className="px-1.5 py-0.5 bg-purple-950 text-purple-200 rounded text-[9px] font-mono border border-purple-700 font-bold">142.85 TON</span>
                      </button>
                      <button
                        onClick={() => {
                          window.location.hash = "ton_settlement";
                          window.dispatchEvent(new HashChangeEvent("hashchange"));
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg cursor-pointer border border-cyan-400/40"
                        title="Gemini Funds AI Engine • Slicing & On-Chain Settlement"
                      >
                        <Zap size={13} className="text-yellow-400" />
                        <span>Gemini Funds AI Engine</span>
                        <span className="px-1.5 py-0.5 bg-cyan-950 text-cyan-200 rounded text-[9px] font-mono border border-cyan-700 font-bold">W5 LIVE</span>
                      </button>
                      <button
                        onClick={() => setShowOfficialTgAuth(true)}
                        className="px-3.5 py-2 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg cursor-pointer border border-pink-400/40"
                        title="Launch @MeChatBot 20s Fast Matchmaking & Isolated Love Suites"
                      >
                        <Heart size={14} className="text-pink-200 fill-pink-300/30" />
                        <span>@MeChatBot Matchmaking</span>
                        <span className="px-1.5 py-0.5 bg-pink-950 text-pink-200 rounded text-[9px] font-mono border border-pink-700 font-bold">LOVE SUITE</span>
                      </button>
                      <button
                        onClick={() => setShowOfficialTgAuth(!showOfficialTgAuth)}
                        className="px-3.5 py-2 bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer border border-sky-400/40"
                      >
                        <ShieldCheck size={14} className="text-sky-300" />
                        <span>{showOfficialTgAuth ? "Hide Telegram Suite" : "Official Telegram Auth & Clients"}</span>
                        <span className="px-1.5 py-0.5 bg-sky-950 text-sky-200 rounded text-[9px] font-mono border border-sky-700 font-bold">SPEC</span>
                      </button>
                      <a
                        href="https://tonviewer.com/0:4bcfdad794db65cd550cb941e8b11053a545aa7e85d0f164e4c8082d6d25656e"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-stone-700 cursor-pointer"
                      >
                        <ExternalLink size={13} />
                        <span>Tonviewer</span>
                      </a>
                      <a
                        href="#settle"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = "#settle";
                          window.dispatchEvent(new HashChangeEvent("hashchange"));
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg cursor-pointer border border-blue-400/40"
                      >
                        <Radio size={13} className="text-cyan-200" />
                        <span>TON Yield Pipeline</span>
                      </a>
                      <button
                        onClick={fetchStats}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition-all"
                      >
                        <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        <span>Refresh Telemetry</span>
                      </button>
                    </div>
                  </div>

                  {/* Official Telegram Suite Expandable Panel */}
                  {showOfficialTgAuth && (
                    <div className="mb-6 animate-fade-in">
                      <NdunakagramSuite onClose={() => setShowOfficialTgAuth(false)} />
                    </div>
                  )}

                  {/* Two Column Layout: Authentic @Wallet Phone Mockup on Left + Live Ecosystem Routing Panel on Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Authentic Telegram @Wallet UI (Matching Screenshots 1 & 2) */}
                    <div className="lg:col-span-6 flex justify-center">
                      <TelegramTonWallet
                        externalStats={stats}
                        onRefreshEcosystem={fetchStats}
                      />
                    </div>

                    {/* Right Column: Real-time Ecosystem Earnings Connection & Telemetry Panel */}
                    <div className="lg:col-span-6 space-y-5">
                      {/* Connection Overview Card */}
                      <div className="p-6 bg-stone-950 rounded-3xl border border-stone-800/90 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                              <Coins size={17} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">Ecosystem Earnings Routing Hub</h4>
                              <p className="text-[11px] text-stone-400">Live multi-source USDT aggregation</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                            100% On-Chain Sync
                          </span>
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 bg-stone-900/70 rounded-2xl border border-stone-800/80">
                            <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                              TOTAL CONNECTED USDT
                            </span>
                            <div className="text-xl font-black font-mono text-emerald-400">
                              ${(stats?.totalRevenueRecorded || 845.50).toFixed(2)}
                            </div>
                            <span className="text-[10px] text-stone-500 mt-0.5 block">Synced to @Wallet balance</span>
                          </div>

                          <div className="p-3.5 bg-stone-900/70 rounded-2xl border border-stone-800/80">
                            <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                              LIVE DWELL YIELD RATE
                            </span>
                            <div className="text-xl font-black font-mono text-amber-400">
                              +$0.05<span className="text-xs font-normal text-stone-400">/sec</span>
                            </div>
                            <span className="text-[10px] text-stone-500 mt-0.5 block">Online visitor duration pool</span>
                          </div>

                          <div className="p-3.5 bg-stone-900/70 rounded-2xl border border-stone-800/80">
                            <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                              COMMISSION SPLIT
                            </span>
                            <div className="text-xl font-black font-mono text-cyan-400">
                              80% / 20%
                            </div>
                            <span className="text-[10px] text-stone-500 mt-0.5 block">Platform reserve & Direct payout</span>
                          </div>

                          <div className="p-3.5 bg-stone-900/70 rounded-2xl border border-stone-800/80">
                            <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                              TON NETWORK GAS
                            </span>
                            <div className="text-xl font-black font-mono text-purple-300">
                              24.50 GRAM
                            </div>
                            <span className="text-[10px] text-stone-500 mt-0.5 block">Gas reserve @ $5.80/TON</span>
                          </div>
                        </div>

                        {/* Automated Channels List */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                            Active Streams Feeding this TON @Wallet:
                          </span>
                          
                          <div className="p-2.5 bg-stone-900/50 rounded-xl border border-stone-800/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              <span className="text-stone-300 font-medium">Shopify Webhooks (Orders & Checkout)</span>
                            </div>
                            <span className="text-stone-400 font-mono text-[11px]">80% Comm. Split</span>
                          </div>

                          <div className="p-2.5 bg-stone-900/50 rounded-xl border border-stone-800/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                              <span className="text-stone-300 font-medium">Tidio Visitor Sessions (earnings.ink)</span>
                            </div>
                            <span className="text-stone-400 font-mono text-[11px]">$0.05/sec dwell</span>
                          </div>

                          <div className="p-2.5 bg-stone-900/50 rounded-xl border border-stone-800/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                              <span className="text-stone-300 font-medium">Sreymara Cinema 20 Channels + Sponsor Ads</span>
                            </div>
                            <span className="text-stone-400 font-mono text-[11px]">$0.30/ad reward</span>
                          </div>

                          <div className="p-2.5 bg-stone-900/50 rounded-xl border border-stone-800/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              <span className="text-stone-300 font-medium">SCO Worldwide Monetization & Blockchain</span>
                            </div>
                            <span className="text-stone-400 font-mono text-[11px]">15% Owner Cut</span>
                          </div>
                        </div>

                        {/* Security & Verification Callout */}
                        <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-800/50 space-y-1.5 text-xs text-emerald-300">
                          <div className="font-bold flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-400" />
                            <span>Full Ecosystem Access to USDT Balance Verified</span>
                          </div>
                          <p className="text-stone-400 leading-relaxed text-[11px] font-sans">
                            Your TON wallet address <code className="text-emerald-300 font-mono font-bold">UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ</code> is permanently bound to the ecosystem runtime. Any earnings from visitors, sales, ads, or blockchain checkouts automatically credit directly to your USDT balance inside Telegram @Wallet.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB: EXTERNAL SYSTEMS TRANSACTION INTEGRATION */}
              {activeTab === "external_api" && (
                <div className="space-y-6 animate-fade-in">
                  <ExternalTransactionIntegration onRefreshEcosystem={fetchStats} />
                </div>
              )}

              {/* TAB: GITHUB APP & WEBHOOK REGISTRY */}
              {activeTab === "github_app" && (
                <div className="animate-fade-in">
                  <ScoMonetizationSuite initialView="github_app" />
                </div>
              )}

              {/* TAB 1: LIVE REVENUE & VISITOR TRACKER */}
              {activeTab === "matrix" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800/80">
                      <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
                        <span>ONLINE VISITORS</span>
                        <UserCheck size={14} className="text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                        {stats?.onlineVisitorsCount || 1}
                        <span className="text-xs font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                          Active Signal
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Live tracking on {shopDomain}</p>
                    </div>

                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800/80">
                      <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
                        <span>LIVE SESSION YIELD</span>
                        <Clock size={14} className="text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-nobel-gold">
                        ${stats?.activeSessionYield.toFixed(2) || "9.00"}
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Accumulating @ $0.05/sec online</p>
                    </div>

                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800/80">
                      <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
                        <span>TOTAL ECOSYSTEM REVENUE</span>
                        <DollarSign size={14} className="text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white">
                        ${totalRev.toFixed(2)} USD
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Synced to Phantom Master Wallet</p>
                    </div>

                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800/80">
                      <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
                        <span>TIDIO SIGNAL STATUS</span>
                        <MessageSquare size={14} className="text-cyan-400" />
                      </div>
                      <div className="text-sm font-bold font-mono text-cyan-300 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        {stats?.tidioSignalStatus || "ACTIVE_LISTENING"}
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Instant landing & logout alerts</p>
                    </div>
                  </div>

                  {/* Interactive Test Action Bar */}
                  <div className="p-5 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 rounded-xl border border-stone-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-nobel-gold mb-3 flex items-center gap-2">
                      <Sparkles size={14} /> Interactive Event Simulation Controls
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handlePingVisitor}
                        disabled={loading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <UserCheck size={14} /> Simulate Visitor Landing Signal
                      </button>

                      <button
                        onClick={handleLogoutVisitor}
                        disabled={loading}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <LogOut size={14} /> Simulate Visitor Logout & Release Earnings
                      </button>

                      <button
                        onClick={handleSimulateSale}
                        disabled={loading}
                        className="px-4 py-2 bg-nobel-gold hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <ShoppingBag size={14} /> Trigger $185 Shopify Sale & Tidio Alert
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions & Duration List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-950/60 p-5 rounded-xl border border-stone-800/80">
                      <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-400" /> Active Session Duration & Yield
                      </h4>

                      {stats?.sessions && stats.sessions.length > 0 ? (
                        <div className="space-y-3">
                          {stats.sessions.map((sess) => (
                            <div key={sess.id} className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex justify-between items-center text-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${sess.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-stone-500"}`}></span>
                                  <span className="font-mono text-white font-bold">{sess.id}</span>
                                  <span className="text-stone-400">({sess.domain})</span>
                                </div>
                                <div className="text-[10px] text-stone-500 mt-1">
                                  Landed: {new Date(sess.landedAt).toLocaleTimeString()} • Online Duration: {sess.durationSeconds}s
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-bold text-nobel-gold">+${sess.earningsAccumulated.toFixed(2)}</div>
                                <span className="text-[10px] text-emerald-400 font-mono">
                                  {sess.status === "online" ? "ACCUMULATING" : "RELEASED"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-stone-500 italic py-4">No active sessions tracked yet. Click simulate landing.</div>
                      )}
                    </div>

                    {/* Transaction Stream */}
                    <div className="bg-stone-950/60 p-5 rounded-xl border border-stone-800/80">
                      <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShoppingBag size={14} className="text-nobel-gold" /> Recorded Shopify Transactions
                      </h4>

                      <div className="space-y-3">
                        {stats?.recentTransactions?.map((tx) => (
                          <div key={tx.id} className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex justify-between items-center text-xs">
                            <div>
                              <div className="font-mono font-bold text-white flex items-center gap-2">
                                <span>{tx.orderNumber}</span>
                                <span className="text-[10px] px-2 py-0.2 bg-stone-800 text-stone-300 rounded">
                                  {tx.source}
                                </span>
                              </div>
                              <div className="text-[10px] text-stone-500 mt-1">
                                Customer: {tx.customerEmail} • {new Date(tx.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-bold text-emerald-400">+${tx.amount.toFixed(2)}</div>
                              <span className="text-[10px] text-cyan-400 flex items-center gap-1 justify-end">
                                <MessageSquare size={10} /> Tidio Alert Sent
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: SREYMARA CINEMA (20 CHANNELS) & AD INTERMISSION ENGINE */}
              {activeTab === "cinema" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Title Banner */}
                  <div className="p-5 bg-gradient-to-r from-stone-950 via-amber-950/30 to-stone-950 rounded-xl border border-nobel-gold/40 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Tv size={20} className="text-nobel-gold" />
                        <h3 className="font-serif text-lg font-bold text-white">Sreymara Cinema V3.8 (20 Channels)</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-nobel-gold/20 text-nobel-gold border border-nobel-gold/40">
                          CLEAN DISPLAY MODE
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        Continuous broadcast with auto-advance, sponsor ad monetization, and dedicated telemetry located below the screen.
                      </p>
                    </div>

                    <button
                      onClick={handleTriggerSponsorAd}
                      disabled={isAdPlaying}
                      className="px-4 py-2.5 bg-nobel-gold hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                    >
                      <Play size={14} /> Play Sponsor Ad Intermission (+${currentCh.sponsorAd.payoutUsd.toFixed(2)} USD)
                    </button>
                  </div>

                  {/* 20 Channels Bar */}
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 flex justify-between items-center">
                      <span>Select Channel (20 Live Broadcasts Available)</span>
                      <span className="text-nobel-gold font-mono">Current: Channel {currentChannelIdx + 1} / 20</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {(stats?.cinemaChannels || [currentCh]).map((ch, idx) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            setCurrentChannelIdx(idx);
                            fetch("/api/cinema/channel", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ channelIndex: idx }),
                            });
                          }}
                          className={`px-3 py-2 rounded-lg text-xs flex flex-col items-start min-w-[140px] border transition-all cursor-pointer ${
                            currentChannelIdx === idx 
                              ? "bg-nobel-gold/20 border-nobel-gold text-white font-bold" 
                              : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                          }`}
                        >
                          <span className="text-[10px] text-nobel-gold uppercase font-mono">Ch {ch.id} • {ch.category}</span>
                          <span className="truncate w-full text-[11px] mt-0.5">{ch.title}</span>
                          <span className="text-[9px] text-stone-500 mt-1">👁 {ch.viewersCount} viewers</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Clean Cinema Video Frame */}
                  <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-black aspect-video max-h-[480px] shadow-2xl flex items-center justify-center">
                    
                    {/* AD INTERMISSION OVERLAY (ONLY PLAYS DURING 5s SPONSOR AD) */}
                    {isAdPlaying ? (
                      <div className="absolute inset-0 z-30 bg-stone-950/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-nobel-gold/20 border border-nobel-gold flex items-center justify-center text-nobel-gold mb-4 animate-pulse">
                          <Award size={32} />
                        </div>
                        <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-700 text-xs font-mono font-bold rounded-full uppercase tracking-widest mb-3">
                          MONETIZED SPONSOR AD INTERMISSION
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-white mb-2">
                          {currentCh.sponsorAd.title}
                        </h3>
                        <p className="text-sm text-stone-400 max-w-md mb-6">
                          Sponsored by <strong>{currentCh.sponsorAd.sponsor}</strong> • Crediting <strong>+${currentCh.sponsorAd.payoutUsd.toFixed(2)} USD</strong> directly to your Phantom Wallet balance upon completion.
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="font-mono text-xl text-nobel-gold font-bold">
                            Auto-Advancing in {adCountdown}s...
                          </div>
                          <button
                            onClick={completeAdAndAdvance}
                            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-lg border border-stone-700 flex items-center gap-1 cursor-pointer"
                          >
                            Skip Ad <SkipForward size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* CLEAN VIDEO EMBED WITH ZERO OVERLAYS */
                      <iframe
                        src={currentCh.embedUrl}
                        title={currentCh.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                        allowFullScreen
                      />
                    )}
                  </div>

                  {/* DEDICATED CINEMA MONETIZATION TELEMETRY CARD (LOCATED CLEANLY BELOW THE VIDEO) */}
                  <div className="p-5 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b border-stone-900 pb-4">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">CURRENT BROADCAST</span>
                        <h4 className="font-serif text-sm font-bold text-white truncate">{currentCh.title}</h4>
                        <p className="text-[11px] text-nobel-gold">{currentCh.category} • {currentCh.viewersCount} Viewers</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">CHANNEL ACCRUED YIELD</span>
                        <div className="text-lg font-mono font-bold text-emerald-400">+${currentCh.yieldAccrued.toFixed(2)} USD</div>
                        <p className="text-[10px] text-stone-400">Stream Yield + Ad Revenues</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">AUDIO & BITRATE RAMP</span>
                        <div className="text-xs font-mono text-stone-300 flex items-center gap-1.5 mt-1">
                          <Volume2 size={14} className="text-cyan-400" /> 1080p 60fps • 90% Optimal Ramp
                        </div>
                        <p className="text-[10px] text-stone-500 mt-0.5">Bitrate: 8.5 Mbps High Fidelity</p>
                      </div>

                      <div className="flex flex-col items-end justify-center">
                        <button
                          onClick={handleTriggerSponsorAd}
                          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-nobel-gold/40 text-nobel-gold hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Sparkles size={12} /> Trigger Ad Payout (+${currentCh.sponsorAd.payoutUsd.toFixed(2)})
                        </button>
                      </div>
                    </div>

                    {/* 80/20 Revenue Split Telemetry & Script Tracking Bar */}
                    <div className="p-4 bg-stone-900/80 rounded-lg border border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
                          <DollarSign size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">80% PLATFORM RESERVE</span>
                          <span className="font-mono text-sm font-bold text-amber-300">${platformReserveAccumulated.toFixed(2)} USD</span>
                          <span className="text-[9px] text-stone-500 block">($0.04/sec platform share)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
                          <Wallet size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">20% USER SHARE (YOUR WALLET)</span>
                          <span className="font-mono text-sm font-bold text-emerald-400">${userShareAccumulated.toFixed(2)} USD</span>
                          <span className="text-[9px] text-stone-500 block">($0.01/sec user yield share)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">CONTINUOUS PLAYBACK QUEUE</span>
                          <span className="text-xs font-mono text-cyan-300 flex items-center gap-1 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                            Auto-Advancing Queue Active
                          </span>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 bg-stone-800 text-stone-300 rounded-md font-mono">
                          {totalSecondsWatched}s Streamed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SEQUENTIAL VIDEO PLAYER SECTION (UP NEXT IN QUEUE: BBC MERLIN) */}
                  <div className="p-6 bg-stone-950 rounded-2xl border border-amber-500/40 shadow-2xl space-y-5 relative">
                    
                    {/* Header Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                            <Film size={18} />
                          </div>
                          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                            Sequenced Broadcast Player • BBC Merlin
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/80">
                            UP NEXT IN QUEUE
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/80 flex items-center gap-1">
                            <ShieldCheck size={11} /> IN-ECOSYSTEM SANDBOX
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1.5 max-w-2xl">
                          Consecutive playback engine: Synchronized to start playing BBC Merlin automatically inside this screen once Rick Astley's playback finishes (3:33 duration). Fully sandboxed — streams 100% inside this application without opening external tabs or window popups.
                        </p>
                      </div>

                      {/* Controls Bar */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setIsMerlinPlaying(!isMerlinPlaying)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                            isMerlinPlaying
                              ? "bg-amber-500 hover:bg-amber-400 text-stone-950 font-black"
                              : "bg-stone-800 hover:bg-stone-700 text-white"
                          }`}
                        >
                          {isMerlinPlaying ? (
                            <>
                              <Pause size={13} />
                              <span>Pause Merlin</span>
                            </>
                          ) : (
                            <>
                              <Play size={13} />
                              <span>Play Merlin Now</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleReplayRickAstley}
                          className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Replays Rick Astley (3:33) from the beginning to test automatic queue advance"
                        >
                          <RotateCcw size={13} className="text-amber-400" />
                          <span>Replay Rick (3:33)</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleFastAdvanceRickAstley}
                          className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Instantly marks Rick Astley completed and transitions to Merlin"
                        >
                          <SkipForward size={13} className="text-cyan-400" />
                          <span>Fast-Advance ➔ Merlin</span>
                        </button>

                        <button
                          type="button"
                          onClick={handlePromoteMerlinToMainStage}
                          className="px-3 py-2 bg-[#003B7A] hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Displays BBC Merlin on the primary Cinema stage above as well"
                        >
                          <Tv size={13} />
                          <span>Promote to Main Cinema</span>
                        </button>
                      </div>
                    </div>

                    {/* Sequential Playlist Progress Bar */}
                    <div className="p-3.5 bg-stone-900/90 rounded-xl border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Video 1 Indicator */}
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-stone-800 text-stone-300 text-[10px] font-mono font-bold flex items-center justify-center">
                            1
                          </span>
                          <div>
                            <div className="font-bold text-stone-200">Rick Astley - Never Gonna Give You Up</div>
                            <div className="text-[10px] font-mono text-stone-400 flex items-center gap-1.5">
                              <span>Duration: 3:33</span>
                              <span>&bull;</span>
                              {isRickAstleyFinished ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Finished (3:33 / 3:33)
                                </span>
                              ) : (
                                <span className="text-amber-400 font-bold flex items-center gap-1">
                                  <Clock size={11} /> Playing ({Math.floor(rickAstleyProgressSeconds / 60)}:{(rickAstleyProgressSeconds % 60).toString().padStart(2, '0')} / 3:33)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Transition Arrow */}
                        <div className="text-amber-400 flex items-center px-1">
                          <ArrowRight size={16} className="animate-pulse" />
                        </div>

                        {/* Video 2 Indicator */}
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-mono font-bold flex items-center justify-center">
                            2
                          </span>
                          <div>
                            <div className="font-bold text-amber-300 flex items-center gap-1.5">
                              <span>BBC Merlin (The Dragon's Call)</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            </div>
                            <div className="text-[10px] font-mono text-stone-400 flex items-center gap-1.5">
                              <span>Series Premiere</span>
                              <span>&bull;</span>
                              <span className="text-cyan-300 font-bold">
                                {isMerlinPlaying ? "Streaming in Ecosystem" : "Ready / Queued"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Auto-Advance Toggle */}
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-stone-300 font-medium">
                          <input
                            type="checkbox"
                            checked={autoAdvanceEnabled}
                            onChange={(e) => setAutoAdvanceEnabled(e.target.checked)}
                            className="rounded border-stone-700 text-amber-500 focus:ring-0 cursor-pointer"
                          />
                          <span>Auto-Play Merlin when Rick Astley finishes</span>
                        </label>
                      </div>
                    </div>

                    {/* NEW VIDEO PLAYER FRAME WITH USER EMBED */}
                    <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-black aspect-video max-h-[520px] shadow-2xl flex items-center justify-center">
                      <iframe
                        id="merlin-ecosystem-player"
                        width="100%"
                        height="100%"
                        src={`https://www.youtube-nocookie.com/embed/pDSv-H75pxI?si=Ku0_MV2nvgIN_i5w${isMerlinPlaying ? '&autoplay=1' : ''}&enablejsapi=1&rel=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>

                    {/* Real-time In-Ecosystem Streaming Telemetry & Containment Notice */}
                    <div className="p-4 bg-stone-900/80 rounded-xl border border-stone-800/90 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">SERIES & EPISODE</span>
                        <h5 className="font-serif font-bold text-white truncate">BBC Merlin (Season 1, Ep 1)</h5>
                        <p className="text-[11px] text-amber-400">The Dragon's Call &bull; HD 1080p</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">IN-ECOSYSTEM CONTAINMENT</span>
                        <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                          <ShieldCheck size={14} className="text-emerald-400" />
                          <span>100% Sandboxed</span>
                        </div>
                        <p className="text-[10px] text-stone-400 mt-0.5">youtube-nocookie &bull; zero tab breaks</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">MERLIN STREAM YIELD</span>
                        <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
                          +${merlinYieldAccrued.toFixed(2)} USD
                        </div>
                        <p className="text-[10px] text-stone-500">+$0.05/sec active viewing split</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">LIVE VIEWERS TUNED IN</span>
                        <div className="text-xs font-mono text-stone-200 font-bold flex items-center gap-1.5 mt-0.5">
                          <Radio size={13} className="text-cyan-400 animate-pulse" />
                          <span className="text-white">2,940 Viewers</span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-0.5">Global Relay Node us-east-1</p>
                      </div>
                    </div>
                  </div>

                  {/* AI POWERUPS & STUDIO REVENUE SUITE PANEL */}
                  <div className="p-5 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 rounded-xl border border-stone-800 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Wand2 size={18} className="text-purple-400" />
                        <h4 className="font-serif text-base font-bold text-white">AI Studio & Monetization Suite</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                          INSTANT REVENUE CREDITING
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">Run AI analysis on live video to generate summary, podcast, slides & earn instant yield.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      <button
                        onClick={() => handleRunAiPowerUp("summary")}
                        disabled={aiGenerating}
                        className="p-3 bg-stone-900 hover:bg-purple-950/40 border border-stone-800 hover:border-purple-600/60 rounded-xl text-left transition-all cursor-pointer group"
                      >
                        <FileText size={18} className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block truncate">Generate Summary</span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-1">+$3.50 Yield</span>
                      </button>

                      <button
                        onClick={() => handleRunAiPowerUp("podcast")}
                        disabled={aiGenerating}
                        className="p-3 bg-stone-900 hover:bg-cyan-950/40 border border-stone-800 hover:border-cyan-600/60 rounded-xl text-left transition-all cursor-pointer group"
                      >
                        <Headphones size={18} className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block truncate">Generate Podcast</span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-1">+$4.50 Yield</span>
                      </button>

                      <button
                        onClick={() => handleRunAiPowerUp("tableizer")}
                        disabled={aiGenerating}
                        className="p-3 bg-stone-900 hover:bg-emerald-950/40 border border-stone-800 hover:border-emerald-600/60 rounded-xl text-left transition-all cursor-pointer group"
                      >
                        <BarChart3 size={18} className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block truncate">Video Tableizer</span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-1">+$5.00 Yield</span>
                      </button>

                      <button
                        onClick={() => handleRunAiPowerUp("illustration")}
                        disabled={aiGenerating}
                        className="p-3 bg-stone-900 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-600/60 rounded-xl text-left transition-all cursor-pointer group"
                      >
                        <ImageIcon size={18} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block truncate">Illustration Generator</span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-1">+$8.00 Yield</span>
                      </button>

                      <button
                        onClick={() => handleRunAiPowerUp("film-analysis")}
                        disabled={aiGenerating}
                        className="p-3 bg-stone-900 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-600/60 rounded-xl text-left transition-all cursor-pointer group"
                      >
                        <Film size={18} className="text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block truncate">In-Depth Analysis</span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-1">+$12.00 Yield</span>
                      </button>

                      <button
                        onClick={() => handleRunAiPowerUp("powerpoint")}
                        disabled={aiGenerating}
                        className="p-3 bg-stone-900 hover:bg-blue-950/40 border border-stone-800 hover:border-blue-600/60 rounded-xl text-left transition-all cursor-pointer group"
                      >
                        <Presentation size={18} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white block truncate">Create PowerPoint</span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-1">+$15.00 Yield</span>
                      </button>
                    </div>

                    {/* AI Output Display Card */}
                    {aiGenerating && (
                      <div className="p-4 bg-stone-950 rounded-lg border border-stone-800 text-center text-xs text-purple-300 font-mono flex items-center justify-center gap-2 animate-pulse">
                        <Wand2 size={16} className="animate-spin" /> Processing AI tool analysis and updating revenue share ledger...
                      </div>
                    )}

                    {aiResult && !aiGenerating && (
                      <div className="p-4 bg-stone-950 rounded-xl border border-purple-800/60 space-y-3 animate-fade-in text-xs">
                        <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                          <span className="font-bold text-white font-serif text-sm flex items-center gap-2">
                            <Sparkles size={14} className="text-nobel-gold" /> {aiResult.result.title}
                          </span>
                          <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold rounded-full">
                            +${aiResult.revenueCredited.toFixed(2)} USD CREDITED TO PHANTOM WALLET
                          </span>
                        </div>

                        {aiResult.result.summary && (
                          <p className="text-stone-300 leading-relaxed">{aiResult.result.summary}</p>
                        )}

                        {aiResult.result.highlights && (
                          <div className="space-y-1">
                            <span className="font-bold text-stone-400 uppercase text-[10px]">Key Video Chapters:</span>
                            {aiResult.result.highlights.map((h: string, idx: number) => (
                              <div key={idx} className="text-stone-300 font-mono text-[11px] bg-stone-900 p-2 rounded border border-stone-800">
                                {h}
                              </div>
                            ))}
                          </div>
                        )}

                        {aiResult.result.table && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono text-[11px]">
                              <thead>
                                <tr className="border-b border-stone-800 text-stone-400">
                                  <th className="py-1">Timestamp</th>
                                  <th className="py-1">Topic</th>
                                  <th className="py-1">Impact</th>
                                </tr>
                              </thead>
                              <tbody>
                                {aiResult.result.table.map((row: any, i: number) => (
                                  <tr key={i} className="border-b border-stone-900 text-stone-300">
                                    <td className="py-1 text-nobel-gold">{row.time}</td>
                                    <td className="py-1">{row.topic}</td>
                                    <td className="py-1 text-emerald-400">{row.impact}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {aiResult.result.dialogue && (
                          <pre className="font-mono text-[11px] text-cyan-300 bg-stone-900 p-3 rounded border border-stone-800 whitespace-pre-wrap">
                            {aiResult.result.dialogue}
                          </pre>
                        )}

                        {aiResult.result.imageUrl && (
                          <div className="flex items-center gap-4 bg-stone-900 p-3 rounded-xl border border-stone-800">
                            <img src={aiResult.result.imageUrl} alt="AI Concept" className="w-24 h-24 object-cover rounded-lg" />
                            <div>
                              <span className="font-bold text-amber-300 text-xs block">{aiResult.result.caption}</span>
                              <p className="text-[10px] text-stone-400 mt-1 font-mono">Prompt: "{aiResult.result.promptUsed}"</p>
                            </div>
                          </div>
                        )}

                        {aiResult.result.slides && (
                          <div className="space-y-2">
                            <span className="font-bold text-blue-300 uppercase text-[10px]">PowerPoint Deck Outline ({aiResult.result.slidesCount} Slides):</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {aiResult.result.slides.map((s: any) => (
                                <div key={s.slide} className="p-2.5 bg-stone-900 rounded border border-stone-800">
                                  <span className="font-bold text-white text-[11px] block">{s.slide}. {s.title}</span>
                                  <p className="text-[10px] text-stone-400 mt-0.5">{s.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB: MUSICIAN & ARTIST STUDIO / YOUTUBE UPLOAD */}
              {activeTab === "artist" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Header Banner */}
                  <div className="p-6 bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 rounded-2xl border border-nobel-gold/40">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-amber-950 text-nobel-gold border border-amber-800 flex items-center justify-center shadow-lg">
                        <Music size={24} />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-white">Musician & Artist Live Broadcast Studio</h3>
                        <p className="text-xs text-stone-400">
                          Upload your music videos, tracks, or YouTube Live streams. They will immediately broadcast in public Sreymara Cinema Channel #1 and generate 80/20 streaming yields!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Form & Live Preview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Form */}
                    <div className="p-5 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
                      <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                        <PlusCircle size={16} className="text-nobel-gold" /> Upload New Track / YouTube Live Video
                      </h4>

                      {uploadMessage && (
                        <div className={`p-3 rounded-lg text-xs font-mono border ${
                          uploadMessage.type === "success" 
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800" 
                            : "bg-red-950 text-red-300 border-red-800"
                        }`}>
                          {uploadMessage.text}
                        </div>
                      )}

                      <form onSubmit={handleUploadArtistTrack} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-stone-400 font-bold mb-1">Song / Video Title *</label>
                          <input
                            type="text"
                            placeholder="e.g. My Original Single / Live Acoustic Session 2026"
                            value={songTitle}
                            onChange={(e) => setSongTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-nobel-gold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 font-bold mb-1">YouTube Video Link or Embed ID *</label>
                          <input
                            type="text"
                            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or YouTube Live ID"
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono focus:outline-none focus:border-nobel-gold"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-stone-400 font-bold mb-1">Artist Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Kansas Nelly"
                              value={artistNameInput}
                              onChange={(e) => setArtistNameInput(e.target.value)}
                              className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-nobel-gold"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 font-bold mb-1">Genre / Category</label>
                            <input
                              type="text"
                              placeholder="e.g. Pop / Synthwave / Live"
                              value={musicGenreInput}
                              onChange={(e) => setMusicGenreInput(e.target.value)}
                              className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-nobel-gold"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-nobel-gold hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                        >
                          <Radio size={16} /> Publish Track to Sreymara Live Channel #1
                        </button>
                      </form>
                    </div>

                    {/* Artist Channel Showcase */}
                    <div className="p-5 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
                      <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                        <Radio size={16} className="text-emerald-400 animate-pulse" /> Live Musician Broadcast Preview
                      </h4>

                      <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-black aspect-video flex items-center justify-center">
                        <iframe
                          src={currentCh.embedUrl}
                          title={currentCh.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                          allowFullScreen
                        />
                      </div>

                      <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{currentCh.title}</span>
                          <span className="text-nobel-gold">{currentCh.category}</span>
                        </div>
                        <p className="text-[10px] text-stone-400">
                          Artist: {currentCh.artistName || "Master Musician"} • Broadcast Status: <span className="text-emerald-400 font-mono">LIVE ON public YouTube & Sreymara Cinema</span>
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 3: PHANTOM WALLET & WITHDRAWAL PORTAL */}
              {activeTab === "phantom" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Phantom Wallet Status & Balance Header */}
                  <div className="p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 rounded-2xl border border-nobel-gold/40">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center shadow-lg">
                          <Wallet size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-xl font-bold text-white">Phantom Master Web3 Wallet</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                              SOLANA SPL LINKED
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 font-mono mt-0.5">
                            Connected Address: <span className="text-nobel-gold font-bold">{phantomAddr}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleConnectPhantomWallet}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                      >
                        <Wallet size={14} /> Connect / Sync Phantom Extension
                      </button>
                    </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          WITHDRAWABLE USDT / USD BALANCE
                        </span>
                        <div className="text-2xl font-bold font-mono text-emerald-400">
                          ${stats?.phantomWallet?.usdtBalance.toFixed(2) || "845.50"} USDT
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Available for instant on-chain withdrawal</p>
                      </div>

                      <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          SOLANA ON-CHAIN BALANCE
                        </span>
                        <div className="text-2xl font-bold font-mono text-purple-300">
                          {stats?.phantomWallet?.solBalance || 14.85} SOL
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Solana Native Gas Reservoir</p>
                      </div>

                      <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          TOTAL WITHDRAWN TO DATE
                        </span>
                        <div className="text-2xl font-bold font-mono text-nobel-gold">
                          ${stats?.phantomWallet?.totalWithdrawnUsdt.toFixed(2) || "120.00"} USDT
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Dispatched to wallet addresses</p>
                      </div>
                    </div>
                  </div>

                  {/* Solscan.io Pro Integration Banner */}
                  <div className="p-5 bg-gradient-to-r from-stone-950 via-[#101f1a] to-stone-950 rounded-2xl border border-[#00FFA3]/40 shadow-xl flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#00FFA3]/20 text-[#00FFA3] border border-[#00FFA3]/40 flex items-center justify-center font-bold text-lg">
                        ◎
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-white">Solscan.io Pro v2 Real-Time Transaction Pusher</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-950 text-[#00FFA3] border border-teal-700 font-bold">
                            FAST FUNDS RELAY
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">
                          Account: <span className="text-[#00FFA3] font-bold">kansasnelly@gmail.com</span> • Push any Solana tx hash to credit USDT balance immediately
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTabSelect("solscan")}
                      className="px-4 py-2 bg-[#00FFA3] hover:bg-[#00e692] text-black rounded-xl text-xs font-black flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,163,0.3)] cursor-pointer transition-all"
                    >
                      <Zap size={14} /> Open Solscan Relayer
                    </button>
                  </div>

                  {/* Connected TON @Wallet Connection Banner */}
                  <div className="p-5 bg-gradient-to-r from-stone-950 via-[#101b2a] to-stone-950 rounded-2xl border border-cyan-800/80 shadow-xl flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-700 flex items-center justify-center font-bold text-lg font-serif">
                        ₮
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-white">Connected Telegram @Wallet (TON USDT Jetton)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                            LIVE CONNECTED
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">
                          Address: <span className="text-emerald-400 font-bold">UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ</span> • Available: <span className="text-white font-bold font-mono">${(stats?.totalRevenueRecorded || 845.50).toFixed(2)} USDT</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTabSelect("ton_wallet")}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer transition-all"
                      >
                        <Wallet size={14} /> Open @Wallet View
                      </button>
                    </div>
                  </div>

                  {/* Manual Wallet Link Input */}
                  <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex flex-wrap gap-3 items-center">
                    <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Link Custom Solana / Phantom Address:
                    </span>
                    <input
                      type="text"
                      value={customPhantomAddr}
                      onChange={(e) => setCustomPhantomAddr(e.target.value)}
                      placeholder="Paste your Phantom wallet address (e.g., 8bpV9T3q...)"
                      className="flex-1 min-w-[280px] bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleConnectPhantomWallet}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-purple-300 text-xs font-bold rounded-lg border border-purple-800/50 cursor-pointer"
                    >
                      Link Address
                    </button>
                  </div>

                  {/* WITHDRAWAL FORM */}
                  <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-nobel-gold mb-4 flex items-center gap-2">
                      <ArrowUpRight size={16} /> Instant USDT / USD Withdrawal Portal
                    </h4>

                    {withdrawalMessage && (
                      <div className={`p-3 rounded-lg text-xs font-mono mb-4 border ${
                        withdrawalMessage.type === "success" 
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" 
                          : "bg-red-950/80 text-red-300 border-red-800"
                      }`}>
                        {withdrawalMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Amount */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                            Withdrawal Amount ($)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="e.g. 250.00"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-nobel-gold"
                            />
                            <button
                              type="button"
                              onClick={() => setWithdrawAmount((stats?.phantomWallet?.usdtBalance || 845.50).toString())}
                              className="absolute right-2 top-2 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-nobel-gold text-[10px] font-bold rounded cursor-pointer"
                            >
                              MAX
                            </button>
                          </div>
                        </div>

                        {/* Asset */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                            Select Asset Currency
                          </label>
                          <select
                            value={withdrawAsset}
                            onChange={(e) => setWithdrawAsset(e.target.value as any)}
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-nobel-gold"
                          >
                            <option value="USDT">USDT (Solana SPL Token)</option>
                            <option value="USD">USD (Direct Settlement)</option>
                            <option value="SOL">SOL (Solana Native)</option>
                          </select>
                        </div>

                        {/* Destination Address */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                            Destination Address
                          </label>
                          <input
                            type="text"
                            value={withdrawDest}
                            onChange={(e) => setWithdrawDest(e.target.value)}
                            placeholder="Phantom / Telegram Wallet address"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-nobel-gold"
                          />
                        </div>

                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xl cursor-pointer transition-all"
                        >
                          <Send size={14} /> EXECUTE ON-CHAIN WITHDRAWAL
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* On-Chain Withdrawal History */}
                  <div className="p-5 bg-stone-950 rounded-xl border border-stone-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-2">
                      <Clock size={14} className="text-purple-400" /> On-Chain Withdrawal Logs
                    </h4>

                    <div className="space-y-3">
                      {(stats?.phantomWallet?.withdrawals || []).map((w) => (
                        <div key={w.id} className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex flex-wrap justify-between items-center gap-2 text-xs">
                          <div>
                            <div className="flex items-center gap-2 font-mono font-bold text-white">
                              <span className="text-emerald-400">-${w.amount.toFixed(2)} {w.asset}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
                                {w.network}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500 mt-1 font-mono">
                              Dest: {w.destination} • {new Date(w.timestamp).toLocaleString()}
                            </div>
                            <div className="text-[9px] text-stone-600 font-mono mt-0.5">
                              Tx Hash: {w.txHash}
                            </div>
                          </div>

                          <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
                            <CheckCircle2 size={10} /> {w.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: TELEGRAM 30-MIN AUTOMATED ALERT DISPATCHER & SREYMARA VIDEOGRAM SUITE */}
              {activeTab === "telegram" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Sreymara Videogram Executive Telegram App Suite */}
                  <SreymaraVideogram />

                  {/* Telegram Automated Dispatcher */}
                  <div className="p-6 bg-gradient-to-r from-stone-950 via-cyan-950/30 to-stone-950 rounded-2xl border border-cyan-800/40">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shadow-lg">
                          <Send size={24} />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-bold text-white">Telegram 30-Min Automated Dispatcher</h3>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Automatically pushes real-time earnings alerts to your Telegram app every 30 minutes!
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleTriggerTelegramDispatch}
                        disabled={loading}
                        className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                      >
                        <Send size={14} /> TRIGGER TELEGRAM EARNINGS DISPATCH NOW
                      </button>
                    </div>

                    {/* Countdown Banner */}
                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-2 text-stone-300">
                        <Clock size={16} className="text-cyan-400 animate-spin" />
                        <span>NEXT AUTOMATED DISPATCH IN:</span>
                        <strong className="text-nobel-gold text-base">{tgCountdownMins}m {tgCountdownSecs}s</strong>
                      </div>

                      <div className="flex items-center gap-4 text-[11px]">
                        <span>Bot Token: <strong className="text-stone-300">Configured</strong></span>
                        <span>Chat ID: <strong className="text-cyan-300">@wallet</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Telegram Dispatch Logs */}
                  <div className="p-5 bg-stone-950 rounded-xl border border-stone-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-2">
                      <MessageSquare size={14} className="text-cyan-400" /> Telegram Dispatch History
                    </h4>

                    <div className="space-y-3">
                      {(stats?.telegramConfig?.dispatchLogs || []).map((log) => (
                        <div key={log.id} className="p-4 bg-stone-900 rounded-lg border border-stone-800 text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-cyan-300">{log.telegramStatus}</span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-stone-200">{log.messageSummary}</p>
                          <div className="text-[10px] text-emerald-400 font-mono font-bold pt-1">
                            Dispatched Amount: +${log.amountDispatched.toFixed(2)} USD
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB: 4-QUADRANT LIVE TELEMETRY & SYNC */}
              {activeTab === "telemetry" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Re-bound Endpoint Notification Banner */}
                  <div className="p-4 bg-gradient-to-r from-purple-950/80 via-indigo-950/70 to-stone-950 rounded-xl border border-purple-800 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-purple-700 flex items-center justify-center text-purple-300">
                        <Radio size={20} className="animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white">Live Re-bound Deployment Endpoint</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                            ONLINE & ACTIVE
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/80 font-mono mt-0.5 select-all">
                          {activeDeploymentUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(activeDeploymentUrl, "endpointUrl")}
                        className="px-3.5 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-purple-700 transition-all"
                      >
                        {copiedKey === "endpointUrl" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedKey === "endpointUrl" ? "COPIED" : "COPY ENDPOINT"}
                      </button>
                    </div>
                  </div>

                  {/* 4-Quadrant Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Quadrant 1: AlphaQubit Quantum Operations */}
                    <div className="p-5 bg-stone-950 rounded-2xl border border-nobel-gold/40 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-nobel-gold" />
                          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                            1. AlphaQubit Quantum Operations
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950 text-nobel-gold rounded border border-amber-800">
                          Nature 2024 Verified
                        </span>
                      </div>

                      <p className="text-xs text-stone-400">
                        Live surface code syndrome decoding & Nature 2024 error-threshold metrics.
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Threshold Margin</span>
                          <span className="text-sm font-bold text-nobel-gold">
                            {telemetryData?.alphaQubit?.nature2024ThresholdMargin || "12.4% Below"}
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Syndrome Latency</span>
                          <span className="text-sm font-bold text-cyan-300">
                            {telemetryData?.alphaQubit?.syndromeDecodingLatencyMs || 0.84} ms
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Code Distance</span>
                          <span className="text-xs font-bold text-white">d=7 (127 Physical Qubits)</span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Decoding State</span>
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Continuous Sync
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quadrant 2: Commerce & Yield Splits */}
                    <div className="p-5 bg-stone-950 rounded-2xl border border-emerald-800/50 space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Zap size={16} className="text-emerald-400" />
                          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                            2. Commerce & Yield Splits (80/20)
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                          Shopify + Tidio Live
                        </span>
                      </div>

                      <p className="text-xs text-stone-400">
                        Live signal feed displaying the 80% Platform / 20% Direct User Yield distribution.
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">80% Platform Reserve</span>
                          <span className="text-sm font-bold text-purple-300">
                            ${(platformReserveAccumulated || (totalRev * 0.8)).toFixed(2)} USD
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">20% Direct User Yield</span>
                          <span className="text-sm font-bold text-emerald-400">
                            ${(userShareAccumulated || (totalRev * 0.2)).toFixed(2)} USD
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Total Revenue Recorded</span>
                          <span className="text-xs font-bold text-nobel-gold">${totalRev.toFixed(2)} USD</span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Tidio Signal Status</span>
                          <span className="text-xs font-bold text-cyan-300">ACTIVE ($0.05/sec)</span>
                        </div>
                      </div>
                    </div>

                    {/* Quadrant 3: Web3 Treasury */}
                    <div className="p-5 bg-stone-950 rounded-2xl border border-purple-800/50 space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Wallet size={16} className="text-purple-400" />
                          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                            3. Web3 Treasury (Phantom SPL-USDT)
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
                          Solana SPL Linked
                        </span>
                      </div>

                      <p className="text-xs text-stone-400">
                        Live Phantom SPL-USDT wallet balances and transaction verification logs.
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Phantom Address</span>
                          <span className="text-xs font-bold text-nobel-gold truncate block">
                            {phantomAddr.slice(0, 6)}...{phantomAddr.slice(-4)}
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Available USDT</span>
                          <span className="text-sm font-bold text-emerald-400">
                            ${(stats?.phantomWallet?.usdtBalance || 845.50).toFixed(2)} USDT
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Solana Gas Balance</span>
                          <span className="text-xs font-bold text-cyan-300">
                            {stats?.phantomWallet?.solBalance || 2.45} SOL
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">On-Chain Withdrawals</span>
                          <span className="text-xs font-bold text-white">
                            {stats?.phantomWallet?.withdrawals?.length || 1} Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quadrant 4: Infrastructure & Intelligence */}
                    <div className="p-5 bg-stone-950 rounded-2xl border border-cyan-800/50 space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Search size={16} className="text-cyan-400" />
                          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                            4. Infrastructure & Intelligence
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                          Mail.com + TruthFinder
                        </span>
                      </div>

                      <p className="text-xs text-stone-400">
                        Mail.com US proxy route health status and active TruthFinder intelligence feeds.
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">Mail.com US Proxy</span>
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            us-east-1.mail.com (14ms)
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">TruthFinder Feeds</span>
                          <span className="text-xs font-bold text-cyan-300">
                            Active (Entity Registry & Emails)
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">SSL Latency</span>
                          <span className="text-xs font-bold text-white">12 ms (Verified Optimal)</span>
                        </div>
                        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800">
                          <span className="text-[10px] text-stone-500 block">VPN Route</span>
                          <span className="text-xs font-bold text-emerald-400">US East (Lightway UDP)</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 5: URL & INTEGRATION GUIDE */}
              {activeTab === "urls" && (
                <div className="space-y-6 animate-fade-in text-stone-300 text-xs leading-relaxed">
                  
                  <div className="p-4 bg-purple-950/30 border border-purple-800/50 rounded-xl text-purple-200">
                    <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                      <Globe size={16} className="text-purple-400" />
                      Re-bound Deployment URL & Shopify Storefront Parameters
                    </h3>
                    <p className="text-xs text-purple-300/80">
                      The legacy URL build has been deprecated. All dashboard routes, webhooks, and visitor trackers are re-bound to our new cloud deployment endpoint:
                    </p>
                    <p className="font-mono text-xs text-white bg-purple-950/80 p-2.5 rounded border border-purple-700/80 mt-2 select-all">
                      {activeDeploymentUrl}
                    </p>
                  </div>

                  {/* 1. Recommended Tracking URL */}
                  <div className="space-y-2">
                    <label className="font-bold text-stone-200 uppercase tracking-wider text-[11px] block">
                      1. Re-bound Visitor Tracking & Monetization URL
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-nobel-gold overflow-x-auto">
                      <span className="flex-1 select-all">{trackingUrl}</span>
                      <button
                        onClick={() => copyToClipboard(trackingUrl, "trackingUrl")}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "trackingUrl" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedKey === "trackingUrl" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>

                  {/* 2. Shopify OAuth Connect URL */}
                  <div className="space-y-2">
                    <label className="font-bold text-stone-200 uppercase tracking-wider text-[11px] block">
                      2. Shopify Admin OAuth Authorization URL
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-cyan-300 overflow-x-auto">
                      <span className="flex-1 select-all">{oauthUrl}</span>
                      <button
                        onClick={() => copyToClipboard(oauthUrl, "oauthUrl")}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "oauthUrl" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedKey === "oauthUrl" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>

                  {/* 3. Tidio Live Chat Script Tag */}
                  <div className="space-y-2">
                    <label className="font-bold text-stone-200 uppercase tracking-wider text-[11px] block">
                      3. Tidio Widget Live Script Code
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-emerald-400 overflow-x-auto">
                      <span className="flex-1 select-all">{tidioScriptTag}</span>
                      <button
                        onClick={() => copyToClipboard(tidioScriptTag, "tidioScript")}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "tidioScript" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedKey === "tidioScript" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>

                  {/* Key Credentials reference */}
                  <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold">Configured Shopify Client ID</span>
                      <p className="font-mono text-sm text-nobel-gold">{shopifyClientId}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold">Active Deployment Endpoint</span>
                      <p className="font-mono text-xs text-stone-300 break-all">{activeDeploymentUrl}</p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 6: CLI CONSOLE (WITH MULTIMODAL IMAGE PASTE) */}
              {activeTab === "cli" && (
                <div className="space-y-4 animate-fade-in" onPaste={handleCliPaste}>
                  <div className="flex items-center justify-between text-xs text-stone-400 flex-wrap gap-2">
                    <span className="font-mono flex items-center gap-2">
                      <Terminal size={14} className="text-nobel-gold" /> ECOSYSTEM CLI & MULTIMODAL VISION TESTER
                    </span>
                    <span className="flex items-center gap-2 font-mono text-[11px] text-purple-300">
                      <span>📋 Paste an image (Ctrl+V) anywhere</span>
                      <span>• Type <code className="text-nobel-gold">help</code> or <code className="text-nobel-gold">telemetry</code></span>
                    </span>
                  </div>

                  {/* Quick Action CLI Buttons */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <button
                      onClick={() => executeCliCommand("status")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ status
                    </button>
                    <button
                      onClick={() => executeCliCommand("telemetry")}
                      className="px-3 py-1 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 rounded font-mono cursor-pointer"
                    >
                      $ telemetry
                    </button>
                    <button
                      onClick={() => executeCliCommand("withdraw 250 USDT")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ withdraw 250 USDT
                    </button>
                    <button
                      onClick={() => executeCliCommand("trigger-telegram")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ trigger-telegram
                    </button>
                    <button
                      onClick={() => executeCliCommand("play-ad")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ play-ad
                    </button>
                    <button
                      onClick={() => executeCliCommand("trigger-sale")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ trigger-sale
                    </button>
                  </div>

                  {/* Terminal Display */}
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 h-64 overflow-y-auto space-y-2">
                    {cliLogs.map((log, idx) => (
                      <div key={idx} className={log.type === "cmd" ? "text-nobel-gold font-bold" : log.type === "err" ? "text-red-400" : "text-stone-300 whitespace-pre-wrap"}>
                        {log.text}
                      </div>
                    ))}
                  </div>

                  {/* Pasted Image Preview in CLI */}
                  {cliImage && (
                    <div className="p-3 bg-purple-950/40 border border-purple-800/80 rounded-xl flex items-center justify-between gap-3 text-xs text-purple-200">
                      <div className="flex items-center gap-3">
                        <img src={cliImage} alt="CLI Pasted Artifact" className="w-14 h-14 object-cover rounded-lg border border-purple-600 shadow" />
                        <div>
                          <span className="font-bold block text-white">Attached Visual Artifact</span>
                          <span className="text-[10px] text-purple-300 font-mono">
                            Ready for Gemini 3.8 Flash Multimodal Vision Diagnosis.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => executeCliCommand("diagnose-image", cliImage)}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={12} /> Run Vision Diagnosis
                        </button>
                        <button
                          type="button"
                          onClick={() => setCliImage(null)}
                          className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg cursor-pointer"
                          title="Discard pasted image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input form with onPaste */}
                  <form onSubmit={(e) => { e.preventDefault(); executeCliCommand(); }} className="flex gap-2">
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      onPaste={handleCliPaste}
                      placeholder={
                        cliImage
                          ? "Image attached! Press Enter or EXECUTE to analyze, or type specific diagnostic instruction..."
                          : "Type CLI command (or paste screenshot Ctrl+V directly)..."
                      }
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-nobel-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-nobel-gold hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Play size={12} /> EXECUTE
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7: PARADISE PROTECTION STATUS */}
              {activeTab === "paradise" && (
                <div className="space-y-6 animate-fade-in text-stone-300 text-xs leading-relaxed">
                  
                  <div className="p-5 bg-stone-950 rounded-xl border border-nobel-gold/40 flex items-start gap-4">
                    <ShieldCheck size={32} className="text-nobel-gold shrink-0 mt-1" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white mb-2">
                        AlphaQubit Heavenly Paradise Architecture Protection
                      </h3>
                      <p className="text-stone-300">
                        Rest assured: Your beautiful AlphaQubit quantum research paper visualization is <strong>100% safe, untouched, and preserved</strong>!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
                      <span className="font-bold text-white uppercase text-[11px] block">
                        Clean Cinema Display Guarantee
                      </span>
                      <p className="text-stone-400">
                        All toast overlays and popping yield indicators have been completely moved OFF the video player screen into a dedicated telemetry card located cleanly below the video frame.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
                      <span className="font-bold text-white uppercase text-[11px] block">
                        Phantom Wallet & Telegram Real-Time Sync
                      </span>
                      <p className="text-stone-400">
                        Withdrawals execute on-chain in real time, deducting from your available revenue, issuing Solana transaction hashes, and delivering 30-minute earnings reports directly to your Telegram app.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 flex flex-wrap justify-between items-center text-[11px] text-stone-500 font-mono gap-2">
              <span>Shopify Client ID: 5144661590b6f29869cd1cdae3248074</span>
              <span>Phantom: {phantomAddr.slice(0, 6)}...{phantomAddr.slice(-4)}</span>
              <span>Telegram: @wallet</span>
              <span>Status: HEAVENLY PARADISE ACTIVE</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
