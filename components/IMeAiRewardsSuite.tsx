import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  Tv,
  Coins,
  ArrowRightLeft,
  Send,
  Wallet,
  TrendingUp,
  CheckCircle2,
  Lock,
  Play,
  RotateCw,
  Zap,
  Info,
  ShieldCheck,
  Award,
  DollarSign,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  RefreshCw,
  X,
  Grid,
  Code,
  Image as ImageIcon,
  Mic,
  FileText,
  Globe,
  HelpCircle,
  Sliders
} from "lucide-react";

interface IMeAiRewardsSuiteProps {
  onClose?: () => void;
  onOpenTonWallet?: () => void;
}

export const IMeAiRewardsSuite: React.FC<IMeAiRewardsSuiteProps> = ({
  onClose,
  onOpenTonWallet,
}) => {
  // Main Subtab: chat | rewarded_ads | exchange | withdraw | trade
  const [activeTab, setActiveTab] = useState<
    "chat" | "rewarded_ads" | "exchange" | "withdraw" | "trade"
  >("chat");

  // State Store
  const [stats, setStats] = useState<{
    aiCredits: number;
    usdtBalance: number;
    totalAdsWatched: number;
    totalUsdtEarned: number;
    totalUsdtWithdrawn: number;
    adWatchHistory: any[];
    creditExchanges: any[];
    usdtWithdrawals: any[];
    trades: any[];
  }>({
    aiCredits: 15,
    usdtBalance: 6.50,
    totalAdsWatched: 65,
    totalUsdtEarned: 18.50,
    totalUsdtWithdrawn: 12.00,
    adWatchHistory: [],
    creditExchanges: [],
    usdtWithdrawals: [],
    trades: [],
  });

  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [notice, setNotice] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Chat States
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: "user" | "ime_ai";
      text: string;
      timestamp: string;
      model?: string;
      role?: string;
    }>
  >([
    {
      id: "msg-0",
      sender: "ime_ai",
      text: `I'm your all-in-one assistant here in Telegram & AI Ecosystem! I can handle everything from quick questions to complex tasks.

Here's the breakdown:
• **Content Creation**: Code, articles, scripts, emails, or translations.
• **Visuals**: Generate images or edit photos you send me.
• **Audio**: Listen to voice messages & respond with speech.
• **Analysis**: Documents/screenshots data analysis & text summarization.
• **Web Access**: Search real-time web info or parse URLs.
• **iMe Features**: Manage iMe Ads campaigns, LIME, and Rewarded Ads.

✨ **Every ad you watch rewards you with 1 AI Credit + $0.10 USDT instantly!** You can trade or withdraw your USDT anytime.`,
      timestamp: "20:39",
      model: "Gemini 2.5 Flash",
      role: "All-in-One Assistant",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("Gemini 2.5 Flash");
  const [selectedRole, setSelectedRole] = useState<string>("All-in-One Assistant");
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [showCommandsModal, setShowCommandsModal] = useState<boolean>(false);

  // Rewarded Ad Modal & Player States
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(10);
  const [adRewardClaimed, setAdRewardClaimed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Exchange States
  const [exchangeCreditsInput, setExchangeCreditsInput] = useState<number>(4);
  const [isExchanging, setIsExchanging] = useState<boolean>(false);

  // Withdrawal States
  const [withdrawUsdtInput, setWithdrawUsdtInput] = useState<string>("5.00");
  const [withdrawWalletAddress, setWithdrawWalletAddress] = useState<string>(
    "7xKXv9PqM18vL32zK90xR14bA99pZ71c"
  );
  const [withdrawNetwork, setWithdrawNetwork] = useState<string>(
    "Solana SPL (Phantom Wallet)"
  );
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  // Trade / Swap States
  const [tradePair, setTradePair] = useState<string>("SOL/USDT");
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [tradeUsdtInput, setTradeUsdtInput] = useState<string>("2.00");
  const [isTrading, setIsTrading] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial stats
  useEffect(() => {
    fetchImeStats();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiThinking]);

  const fetchImeStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/ime/stats");
      const data = await res.json();
      if (data.success && data.ime) {
        setStats(data.ime);
      }
    } catch (err) {
      console.warn("Failed to fetch iMe stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Chat Submission
  const handleSendPrompt = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isAiThinking) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user" as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt("");
    setIsAiThinking(true);

    try {
      const res = await fetch("/api/ime/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          model: selectedModel,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const aiMsg = {
          id: `ime-${Date.now()}`,
          sender: "ime_ai" as const,
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          model: data.modelUsed,
          role: data.roleUsed,
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        if (typeof data.remainingCredits === "number") {
          setStats((prev) => ({
            ...prev,
            aiCredits: data.remainingCredits,
            usdtBalance: data.usdtBalance ?? prev.usdtBalance,
          }));
        }
      } else {
        setNotice({ type: "error", text: data.error || "Failed to reach iMe AI." });
      }
    } catch (err) {
      setNotice({ type: "error", text: "Network connection error reaching iMe AI." });
    } finally {
      setIsAiThinking(false);
    }
  };

  // Watch Rewarded Ad Action
  const triggerWatchAd = () => {
    setIsWatchingAd(true);
    setAdCountdown(10);
    setAdRewardClaimed(false);

    // RichAds / RichPartners window trigger attempt
    try {
      if (typeof (window as any).TelegramAdsController !== "undefined") {
        (window as any).TelegramAdsController.initialize({
          pubId: "1018889",
          appId: "8914",
        });
      }
    } catch (e) {
      console.warn("RichAds controller trigger executed.");
    }
  };

  // Ad countdown effect
  useEffect(() => {
    let timer: any = null;
    if (isWatchingAd && adCountdown > 0) {
      timer = setInterval(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isWatchingAd && adCountdown === 0 && !adRewardClaimed) {
      claimAdReward();
    }
    return () => clearInterval(timer);
  }, [isWatchingAd, adCountdown, adRewardClaimed]);

  const claimAdReward = async () => {
    setAdRewardClaimed(true);
    try {
      const res = await fetch("/api/ime/watch-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adType: "RichAds Video Interstitial (Pub #1018889)",
          rewardUsdtOverride: 0.10,
        }),
      });

      const data = await res.json();
      if (data.success && data.ime) {
        setStats(data.ime);
        setNotice({
          type: "success",
          text: `✨ Reward Claimed! You received +1 AI Credit AND +$0.10 USDT instantly!`,
        });

        // Add chat reward confirmation
        setChatMessages((prev) => [
          ...prev,
          {
            id: `rew-${Date.now()}`,
            sender: "ime_ai",
            text: `✨ **You've received 1 AI Credit + $0.10 USDT for watching ads!**\n\nYour updated balance is now **${data.ime.aiCredits} AI Credits** | **$${data.ime.usdtBalance.toFixed(2)} USDT**.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      setNotice({ type: "error", text: "Error recording ad reward." });
    }
  };

  // Exchange Credits Action
  const handleExchangeCredits = async () => {
    if (exchangeCreditsInput <= 0) return;
    setIsExchanging(true);
    try {
      const res = await fetch("/api/ime/exchange-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditsToExchange: exchangeCreditsInput }),
      });
      const data = await res.json();
      if (data.success && data.ime) {
        setStats(data.ime);
        setNotice({ type: "success", text: data.message });
      } else {
        setNotice({ type: "error", text: data.error || "Exchange failed." });
      }
    } catch (err) {
      setNotice({ type: "error", text: "Error connecting to credit exchange." });
    } finally {
      setIsExchanging(false);
    }
  };

  // Withdraw USDT Action
  const handleWithdrawUsdt = async () => {
    const amt = parseFloat(withdrawUsdtInput);
    if (!amt || amt <= 0) return;
    setIsWithdrawing(true);
    try {
      const res = await fetch("/api/ime/withdraw-usdt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsdt: amt,
          destinationWallet: withdrawWalletAddress,
          network: withdrawNetwork,
        }),
      });
      const data = await res.json();
      if (data.success && data.ime) {
        setStats(data.ime);
        setNotice({ type: "success", text: data.message });
      } else {
        setNotice({ type: "error", text: data.error || "Withdrawal failed." });
      }
    } catch (err) {
      setNotice({ type: "error", text: "Error executing outbound withdrawal." });
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Trade USDT Action
  const handleTradeUsdt = async () => {
    const amt = parseFloat(tradeUsdtInput);
    if (!amt || amt <= 0) return;
    setIsTrading(true);
    try {
      const res = await fetch("/api/ime/trade-usdt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair: tradePair,
          type: tradeType,
          amountUsdt: amt,
        }),
      });
      const data = await res.json();
      if (data.success && data.ime) {
        setStats(data.ime);
        setNotice({ type: "success", text: data.message });
      } else {
        setNotice({ type: "error", text: data.error || "Trade failed." });
      }
    } catch (err) {
      setNotice({ type: "error", text: "Error executing trade." });
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#0a0a14] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden font-sans text-stone-100 flex flex-col min-h-[750px] relative animate-fade-in">
      {/* TOP HEADER & LIVE BALANCE DASHBOARD */}
      <div className="bg-gradient-to-r from-[#12072b] via-[#1a0c3b] to-[#09152b] border-b border-stone-800 p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-sky-500 p-0.5 shadow-lg shadow-purple-900/40 shrink-0">
            <div className="w-full h-full bg-[#0e0822] rounded-[14px] flex items-center justify-center text-sky-300 font-black text-xl">
              <Bot size={24} className="text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                iMe AI Bot
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-900/80 text-purple-200 border border-purple-500/50 font-bold flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-400" /> REWARDED USDT ACTIVE
                </span>
              </h1>
            </div>
            <p className="text-xs text-purple-200/70 mt-0.5 font-mono">
              Watch Ads • Earn AI Credits + Instant USDT • Exchange & Trade Live
            </p>
          </div>
        </div>

        {/* BALANCE BADGES & QUICK ACTIONS */}
        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
          <button
            onClick={() => setShowTopUpModal(true)}
            className="px-3.5 py-2 bg-purple-950/80 hover:bg-purple-900/90 border border-purple-600/60 rounded-xl flex items-center gap-2 text-xs font-bold text-purple-100 shadow-md cursor-pointer transition-all transform hover:scale-105"
          >
            <Sparkles size={15} className="text-amber-400 animate-pulse" />
            <span>Balance:</span>
            <span className="font-mono text-amber-300 font-extrabold">{stats.aiCredits} AI Credits</span>
          </button>

          <button
            onClick={() => setActiveTab("withdraw")}
            className="px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/60 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-100 shadow-md cursor-pointer transition-all transform hover:scale-105"
          >
            <Coins size={15} className="text-emerald-400" />
            <span>USDT Pool:</span>
            <span className="font-mono text-emerald-300 font-extrabold">${stats.usdtBalance.toFixed(2)} USDT</span>
          </button>

          <button
            onClick={triggerWatchAd}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black rounded-xl text-xs shadow-xl cursor-pointer transition-all flex items-center gap-1.5 transform hover:scale-105 shrink-0"
          >
            <Tv size={15} />
            <span>+ Watch Ad (+1 Credit / +$0.10)</span>
          </button>
        </div>
      </div>

      {/* NOTICE NOTIFICATION BANNER */}
      {notice && (
        <div
          className={`mx-6 mt-4 p-3 rounded-xl border text-xs flex items-center justify-between gap-3 animate-fade-in font-mono ${
            notice.type === "success"
              ? "bg-emerald-950/90 border-emerald-500 text-emerald-200"
              : notice.type === "error"
              ? "bg-red-950/90 border-red-500 text-red-200"
              : "bg-sky-950/90 border-sky-500 text-sky-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white text-xs px-1">
            ✕
          </button>
        </div>
      )}

      {/* SUBTAB NAVIGATION BAR */}
      <div className="bg-[#0e0a1a] border-b border-stone-800 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
            }`}
          >
            <Bot size={14} />
            <span>iMe AI Chat</span>
          </button>

          <button
            onClick={() => setActiveTab("rewarded_ads")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "rewarded_ads"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-900/50"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
            }`}
          >
            <Tv size={14} />
            <span>Rewarded Ads Engine</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-stone-950 font-black">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab("exchange")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "exchange"
                ? "bg-sky-600 text-white shadow-lg shadow-sky-900/50"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
            }`}
          >
            <ArrowRightLeft size={14} />
            <span>Credit ➔ USDT Exchange</span>
          </button>

          <button
            onClick={() => setActiveTab("withdraw")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "withdraw"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
            }`}
          >
            <Send size={14} />
            <span>USDT Wallet Payout</span>
          </button>

          <button
            onClick={() => setActiveTab("trade")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "trade"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
            }`}
          >
            <TrendingUp size={14} />
            <span>Instant USDT Spot Trade Desk</span>
          </button>
        </div>

        <button
          onClick={fetchImeStats}
          disabled={loadingStats}
          className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg cursor-pointer transition-all shrink-0"
          title="Refresh iMe Balances"
        >
          <RotateCw size={15} className={loadingStats ? "animate-spin" : ""} />
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 sm:p-6 bg-[#080511] overflow-y-auto min-h-[500px]">
        {/* SUBTAB 1: iMe AI CHAT BOT & COMMANDS */}
        {activeTab === "chat" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* AI MODEL & ROLE SELECTOR STRIP */}
            <div className="p-3 bg-stone-900/90 border border-stone-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-stone-400 font-bold flex items-center gap-1">
                  <Sliders size={13} className="text-purple-400" /> Model:
                </span>
                {["Gemini 2.5 Flash", "GPT-4o", "Claude 3.5 Sonnet", "DeepSeek R1"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedModel(m)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all ${
                      selectedModel === m
                        ? "bg-purple-600 text-white shadow"
                        : "bg-stone-800/80 text-stone-300 hover:bg-stone-700"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCommandsModal(true)}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-purple-300 font-mono rounded-lg border border-purple-500/40 flex items-center gap-1 cursor-pointer"
                >
                  <Terminal size={13} />
                  <span>Commands (/mod, /role)</span>
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES DISPLAY */}
            <div className="bg-[#0e0a1f] border border-purple-900/40 rounded-2xl p-4 sm:p-6 space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} animate-fade-in`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-stone-400">
                    {msg.sender === "user" ? (
                      <span>You</span>
                    ) : (
                      <span className="text-purple-300 font-bold flex items-center gap-1">
                        <Sparkles size={10} className="text-amber-400" /> iMe AI [{msg.model || selectedModel}]
                      </span>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[88%] shadow-md whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-purple-600 text-white rounded-tr-none font-medium"
                        : "bg-[#160e2e] text-purple-100 border border-purple-800/50 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 p-2">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>iMe AI is synthesizing response...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT PROMPT BAR */}
            <form onSubmit={handleSendPrompt} className="flex items-center gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="What's on your mind? Ask iMe AI anything..."
                className="flex-1 bg-stone-900/90 border border-stone-800 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-stone-100 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAiThinking || !inputPrompt.trim()}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-2xl text-xs shadow-lg cursor-pointer transition-all flex items-center gap-2"
              >
                <Send size={15} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}

        {/* SUBTAB 2: REWARDED ADS ENGINE & TOP-UP MODAL */}
        {activeTab === "rewarded_ads" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* BALANCE & REWARD OVERVIEW CARD (MATCHING SCREENSHOT 2) */}
            <div className="bg-gradient-to-br from-[#180a33] via-[#100724] to-[#080d21] border-2 border-purple-600/70 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 relative overflow-hidden">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 text-4xl shadow-xl animate-bounce">
                🎁
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                  Balance <Sparkles size={20} className="text-amber-400" /> {stats.aiCredits} AI Credit(s)
                </h2>
                <p className="text-sm text-purple-200/80 mt-1 max-w-md mx-auto">
                  Choose the best way to top up your balance and enjoy seamless access to AI-powered features & USDT direct earnings!
                </p>
              </div>

              {/* EARNING OPTIONS TABLE (MATCHING SCREENSHOT 2) */}
              <div className="bg-[#0b0617]/90 border border-purple-900/60 rounded-2xl overflow-hidden max-w-lg mx-auto text-left text-xs divide-y divide-purple-900/40">
                <div className="p-3.5 flex items-center justify-between hover:bg-purple-900/20 transition-all">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Free
                  </div>
                  <div className="text-purple-200 font-medium">
                    Rewarded for every ad you watch <span className="text-amber-300 font-bold">(+1 Credit & +$0.10 USDT)</span>
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between hover:bg-purple-900/20 transition-all">
                  <div className="font-bold text-amber-400 flex items-center gap-2">
                    <Award size={16} /> iMe Premium
                  </div>
                  <div className="text-purple-200 font-medium">
                    Increased daily usage limits & 2x USDT reward rate
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between hover:bg-purple-900/20 transition-all">
                  <div className="font-bold text-sky-400 flex items-center gap-2">
                    <Coins size={16} /> Buy Credits
                  </div>
                  <div className="text-purple-200 font-medium">
                    Get as much as you need with 1-click USDT
                  </div>
                </div>
              </div>

              {/* PRIMARY ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={triggerWatchAd}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black rounded-2xl text-sm shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <Tv size={18} />
                  <span>Get Free AI Credits & USDT Now</span>
                </button>

                <button
                  onClick={() => setActiveTab("trade")}
                  className="w-full sm:w-auto px-6 py-3.5 bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-500/60 text-white font-bold rounded-2xl text-sm shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <TrendingUp size={18} className="text-indigo-400" />
                  <span>Trade Earned USDT</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE VIDEO AD PLAYER SIMULATOR */}
            {isWatchingAd && (
              <div className="bg-stone-950 border-2 border-amber-500 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-fade-in relative">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                    <Tv size={16} />
                    <span>RichAds Sponsored Interstitial Stream (Pub #1018889)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-600">
                    COUNTDOWN: {adCountdown}s
                  </span>
                </div>

                <div className="relative aspect-video max-w-lg mx-auto bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 animate-pulse">
                    <Play size={28} />
                  </div>

                  <h3 className="text-base font-bold text-white mt-3">
                    RichAds Web3 Quantum Trade & Solana Gaming
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs">
                    Watch full 10-second sponsor video to automatically release +1 AI Credit and +$0.10 USDT to your connected Phantom Wallet!
                  </p>

                  <div className="w-full bg-stone-800 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-1000"
                      style={{ width: `${((10 - adCountdown) / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {adRewardClaimed && (
                  <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-emerald-200 text-xs font-mono font-bold flex items-center justify-between gap-3 animate-bounce">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      <span>✨ REWARD CREDITED: +1 AI Credit & +$0.10 USDT!</span>
                    </div>
                    <button
                      onClick={() => setIsWatchingAd(false)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-950 rounded-xl font-black cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: CREDIT ➔ USDT EXCHANGE ENGINE */}
        {activeTab === "exchange" && (
          <div className="space-y-6 max-w-2xl mx-auto bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-500/60 flex items-center justify-center text-sky-400 text-xl font-bold">
                <ArrowRightLeft size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Instant AI Credit ➔ USDT Converter</h3>
                <p className="text-xs text-stone-400 font-mono">
                  Guaranteed Live Liquidity Conversion • Rate: 1 AI Credit = $0.25 USDT
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  AI Credits to Exchange (Available: {stats.aiCredits} Credits)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={stats.aiCredits}
                    value={exchangeCreditsInput}
                    onChange={(e) => setExchangeCreditsInput(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => setExchangeCreditsInput(stats.aiCredits)}
                    className="px-3 py-3 bg-stone-800 hover:bg-stone-700 text-sky-300 text-xs font-mono font-bold rounded-2xl cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* CALCULATED OUTPUT PREVIEW */}
              <div className="p-4 bg-sky-950/40 border border-sky-800/60 rounded-2xl flex items-center justify-between text-xs font-mono">
                <span className="text-sky-300 font-bold">You Receive in USDT:</span>
                <span className="text-emerald-400 text-base font-extrabold">
                  +${(exchangeCreditsInput * 0.25).toFixed(2)} USDT
                </span>
              </div>

              <button
                onClick={handleExchangeCredits}
                disabled={isExchanging || exchangeCreditsInput <= 0}
                className="w-full py-4 bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 hover:from-sky-500 hover:to-sky-600 text-white font-black rounded-2xl text-sm shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isExchanging ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span>1-Click Convert Credits to USDT</span>
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 4: USDT WALLET OUTBOUND WITHDRAWAL */}
        {activeTab === "withdraw" && (
          <div className="space-y-6 max-w-2xl mx-auto bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400 text-xl font-bold">
                <Send size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Outbound USDT Wallet Payout</h3>
                <p className="text-xs text-stone-400 font-mono">
                  Send Earned USDT Directly to External Web3 Wallets • Balance: ${stats.usdtBalance.toFixed(2)} USDT
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-300 mb-1">Select Blockchain Network</label>
                <select
                  value={withdrawNetwork}
                  onChange={(e) => setWithdrawNetwork(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-white font-mono focus:outline-none"
                >
                  <option value="Solana SPL (Phantom Wallet)">Solana SPL (Phantom Wallet)</option>
                  <option value="TON Network Jetton (The Open Network)">TON Network Jetton (The Open Network)</option>
                  <option value="TRC-20 (Tron Network)">TRC-20 (Tron Network)</option>
                  <option value="ERC-20 (Ethereum Mainnet)">ERC-20 (Ethereum Mainnet)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Destination Wallet Address</label>
                <input
                  type="text"
                  value={withdrawWalletAddress}
                  onChange={(e) => setWithdrawWalletAddress(e.target.value)}
                  placeholder="e.g. 7xKXv9PqM18vL32zK90xR14bA99pZ71c"
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Amount to Transfer (USDT)</label>
                <input
                  type="number"
                  step="0.01"
                  value={withdrawUsdtInput}
                  onChange={(e) => setWithdrawUsdtInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 font-mono text-sm text-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleWithdrawUsdt}
                disabled={isWithdrawing || !withdrawWalletAddress}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-600 text-stone-950 font-black rounded-2xl text-sm shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isWithdrawing ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                <span>Execute Outbound USDT Withdrawal</span>
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 5: INSTANT USDT SPOT TRADE DESK */}
        {activeTab === "trade" && (
          <div className="space-y-6 max-w-3xl mx-auto bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-500/60 flex items-center justify-center text-indigo-400 text-xl font-bold">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Instant USDT Spot Trade Desk</h3>
                  <p className="text-xs text-stone-400 font-mono">
                    Trade Earned Ad Rewards Directly for SOL, TON, LIME, BTC, or ETH
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold">
                USDT Balance: ${stats.usdtBalance.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TRADE INPUTS */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Trading Pair</label>
                  <select
                    value={tradePair}
                    onChange={(e) => setTradePair(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-white font-mono focus:outline-none"
                  >
                    <option value="SOL/USDT">SOL / USDT ($190.50)</option>
                    <option value="TON/USDT">TON / USDT ($6.80)</option>
                    <option value="LIME/USDT">LIME / USDT ($0.085)</option>
                    <option value="BTC/USDT">BTC / USDT ($92,500.00)</option>
                    <option value="ETH/USDT">ETH / USDT ($3,450.00)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTradeType("BUY")}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      tradeType === "BUY" ? "bg-emerald-600 text-white" : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    BUY {tradePair.split("/")[0]}
                  </button>
                  <button
                    onClick={() => setTradeType("SELL")}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      tradeType === "SELL" ? "bg-red-600 text-white" : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    SELL {tradePair.split("/")[0]}
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Trade Amount (USDT)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tradeUsdtInput}
                    onChange={(e) => setTradeUsdtInput(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 font-mono text-white focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleTradeUsdt}
                  disabled={isTrading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isTrading ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                  <span>Execute {tradeType} Order</span>
                </button>
              </div>

              {/* LIVE MARKET PRICE GRAPH PREVIEW */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between font-mono text-xs space-y-3">
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="font-bold text-stone-300">{tradePair} Price:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">LIVE $190.50</span>
                </div>

                <div className="h-32 bg-[#0d0a18] rounded-xl border border-stone-800 flex items-end justify-between p-2 gap-1 overflow-hidden">
                  {[40, 55, 35, 70, 60, 85, 75, 90, 100].map((val, idx) => (
                    <div
                      key={idx}
                      className="bg-indigo-500/80 hover:bg-emerald-400 rounded-t transition-all w-full"
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>

                <div className="text-[10px] text-stone-400 space-y-1">
                  <div>• Order Execution: Instant Sub-Second DEX Routing</div>
                  <div>• Network Slippage: 0.1% Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COMMANDS & PERSONA MODAL */}
      {showCommandsModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120a26] border border-purple-500/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Terminal size={18} className="text-purple-400" /> iMe AI Commands & Roles
              </h3>
              <button
                onClick={() => setShowCommandsModal(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-purple-200 mb-1">Select Persona Role (/role)</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="All-in-One Assistant">All-in-One Assistant</option>
                  <option value="Senior Coder & Software Engineer">Senior Coder & Software Engineer</option>
                  <option value="Financial & Crypto Trader">Financial & Crypto Trader</option>
                  <option value="Quantum Physics & Math Analyst">Quantum Physics & Math Analyst</option>
                  <option value="Multilingual Translator">Multilingual Translator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-purple-200 mb-1">Quick Trigger Commands</label>
                <div className="space-y-1 font-mono text-[11px] text-purple-300">
                  <div
                    onClick={() => {
                      handleSendPrompt(undefined, "/mod");
                      setShowCommandsModal(false);
                    }}
                    className="p-2 bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer border border-stone-800"
                  >
                    • <strong>/mod</strong> - Switch AI models
                  </div>
                  <div
                    onClick={() => {
                      handleSendPrompt(undefined, "/role");
                      setShowCommandsModal(false);
                    }}
                    className="p-2 bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer border border-stone-800"
                  >
                    • <strong>/role</strong> - Change persona
                  </div>
                  <div
                    onClick={() => {
                      handleSendPrompt(undefined, "/help");
                      setShowCommandsModal(false);
                    }}
                    className="p-2 bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer border border-stone-800"
                  >
                    • <strong>/help</strong> - Full list of commands
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
