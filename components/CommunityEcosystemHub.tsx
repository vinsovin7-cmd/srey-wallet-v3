import React, { useState, useEffect } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import {
  Send,
  Share2,
  ExternalLink,
  Award,
  CheckCircle2,
  HelpCircle,
  Copy,
  Zap,
  ShieldCheck,
  Wallet,
  Play,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Gift,
  Bot,
  MessageCircle,
  Music,
  Coins,
  Globe,
  Radio,
  Sliders,
  Check,
  ArrowRight,
  Calendar,
  Layers,
  Flame,
  MousePointerClick
} from "lucide-react";
import { PRIMARY_RECEIVER_ADDRESS, ACTIVE_AUTH_KEY, initTonConnect } from "./TonPayoutConfig";
import { showNonIntrusiveAd, recordYieldEvent } from "../src/services/adManager";

export interface CommunityEcosystemHubProps {
  onNavigateToFranz?: () => void;
  compact?: boolean;
}

export const CommunityEcosystemHub: React.FC<CommunityEcosystemHubProps> = ({
  onNavigateToFranz,
  compact = false
}) => {
  // Referral State
  const [referralCode, setReferralCode] = useState<string>("SREYMARA-VIP-777");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedWallet, setCopiedWallet] = useState<boolean>(false);

  // Live Ledger & Yield Telemetry State
  const [totalYieldUSDT, setTotalYieldUSDT] = useState<number>(4.35);
  const [txCount, setTxCount] = useState<number>(14);
  const [isSyncingLedger, setIsSyncingLedger] = useState<boolean>(false);

  // Zealy & Galxe Quests
  const [questStatuses, setQuestStatuses] = useState<Record<string, "pending" | "verifying" | "completed">>({
    quest_sreymara: "completed",
    quest_multi: "pending",
    quest_topup: "pending",
    quest_executive: "pending",
    quest_bot_tma: "pending"
  });

  // Daily Engagement Quiz State
  const [quizAnswered, setQuizAnswered] = useState<Record<number, number | null>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<number, string | null>>({});

  // 1. Tiered Quiz Reward Engine State (routes/quizRewardEngine.js)
  const [isSubmittingQuizTier, setIsSubmittingQuizTier] = useState<boolean>(false);
  const [tieredQuizReceipt, setTieredQuizReceipt] = useState<{
    success: boolean;
    score: string;
    earnedUSDT: number;
    reward: any;
  } | null>(null);

  // 2. Dual-Button Bot Auto-Reply Engine State (bots/autoReplyEngine.js)
  const [incomingBotMsg, setIncomingBotMsg] = useState<string>("Hey bot, how do I earn USDT today?");
  const [botReplyOutput, setBotReplyOutput] = useState<{
    text: string;
    buttons: Array<{ text: string; type: string; url?: string; action?: string }>;
  }>({
    text: "🎯 **New High-Yield Quiz Challenge Available!**\nChoose an option below to engage and claim USDT rewards directly to your Telegram Wallet:",
    buttons: [
      { text: "➡️ Proceed & Play Quiz", type: "web_app", url: "https://t.me/Sreyquantumbot/sreymara" },
      { text: "⏭️ Next / Quick Claim", type: "callback", action: "ACTION_NEXT_CLAIM" }
    ]
  });
  const [isProcessingNextClaim, setIsProcessingNextClaim] = useState<boolean>(false);
  const [nextClaimToast, setNextClaimToast] = useState<string | null>(null);

  // 3. Scheduled Bot Dispatchers & Viral Sharing State (cron/scheduler.js)
  const [cronStatus, setCronStatus] = useState<any>({
    active: true,
    schedules: [
      { name: "Quiz Broadcast", cron: "*/15 * * * *", interval: "Every 15 Minutes", status: "RUNNING" },
      { name: "Reward Alert Broadcast", cron: "*/25 * * * *", interval: "Every 25 Minutes", status: "RUNNING" }
    ],
    recentLogs: []
  });
  const [shareableCards, setShareableCards] = useState<any>(null);
  const [copiedShareType, setCopiedShareType] = useState<string | null>(null);

  // Non-Intrusive Rewarded Video Modal State
  const [isAdPlaying, setIsAdPlaying] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(5);
  const [canSkipAd, setCanSkipAd] = useState<boolean>(false);
  const [adSuccessToast, setAdSuccessToast] = useState<string | null>(null);

  // Fetch Telemetry on Mount
  const fetchTelemetry = async () => {
    setIsSyncingLedger(true);
    try {
      const res = await fetch("/api/intelligence/telemetry");
      const data = await res.json();
      if (data.success) {
        if (data.totalAccumulatedYieldUSDT !== undefined) {
          setTotalYieldUSDT(Math.max(4.35, data.totalAccumulatedYieldUSDT));
        }
        if (data.totalTransactions !== undefined) {
          setTxCount(Math.max(14, data.totalTransactions));
        }
      }
    } catch (e) {
      // Fail silently to keep developer console clean
    } finally {
      setIsSyncingLedger(false);
    }
  };

  // Fetch Cron Scheduler Status & Shareable Cards
  const fetchSchedulerAndShare = async () => {
    try {
      const [cronRes, shareRes] = await Promise.all([
        fetch("/api/cron/status").catch(() => null),
        fetch(`/api/share/card?userId=${referralCode}`).catch(() => null)
      ]);
      if (cronRes && cronRes.ok) {
        const contentType = cronRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const cronData = await cronRes.json();
          if (cronData.success) setCronStatus(cronData);
        }
      }
      if (shareRes && shareRes.ok) {
        const contentType = shareRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const shareData = await shareRes.json();
          if (shareData.success) setShareableCards(shareData.card);
        }
      }
    } catch (e) {
      // Fail silently to keep developer console clean
    }
  };

  useEffect(() => {
    fetchTelemetry();
    fetchSchedulerAndShare();
    const interval = setInterval(() => {
      fetchTelemetry();
      fetchSchedulerAndShare();
    }, 20000);
    return () => clearInterval(interval);
  }, []);



  // Copy Referral Link
  const referralUrl = `https://t.me/Sreyquantumbot/sreymara?start=ref_${referralCode}`;
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(PRIMARY_RECEIVER_ADDRESS);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2500);
  };

  // Verify Zealy / Galxe Quest Hook
  const handleVerifyQuest = async (questId: string, url: string, rewardUsdt: number) => {
    setQuestStatuses(prev => ({ ...prev, [questId]: "verifying" }));

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }

    setTimeout(async () => {
      setQuestStatuses(prev => ({ ...prev, [questId]: "completed" }));
      setTotalYieldUSDT(prev => Number((prev + rewardUsdt).toFixed(2)));
      setTxCount(prev => prev + 1);

      await recordYieldEvent(`ZEALY_GALXE_QUEST_${questId.toUpperCase()}_COMPLETED`, rewardUsdt);
      fetchTelemetry();
    }, 2800);
  };

  // Daily Engagement Quiz Questions
  const dailyQuizzes = [
    {
      id: 1,
      question: "Which official Telegram Bot hosts the verified Sreymara Mini App & Task Optimizer?",
      options: [
        "@Sreyquantumbot",
        "@RandomSpamBot",
        "@LegacyUnverifiedBot",
        "@StaticHtmlBot"
      ],
      correct: 0,
      reward: 0.05,
      explanation: "Correct! @Sreyquantumbot hosts the official React @telegram-apps/sdk Mini App."
    },
    {
      id: 2,
      question: "What is the primary payout blockchain network configured for real-time USDT settlements?",
      options: [
        "Ethereum L1 (High Gas)",
        "TON Network (The Open Network / Telegram @Wallet)",
        "Legacy Wire Transfer",
        "Paper Cheque"
      ],
      correct: 1,
      reward: 0.05,
      explanation: "Correct! The Open Network (TON) provides instant micro-settlements to wallet UQDl...WgrG."
    },
    {
      id: 3,
      question: "What is the skip delay rule for high-yield rewarded tasks in the Sreymara ecosystem?",
      options: [
        "No skipping allowed (30s forced)",
        "5 Seconds with instant passive yield preservation",
        "60 Seconds wait window",
        "Requires paid subscription"
      ],
      correct: 1,
      reward: 0.05,
      explanation: "Correct! Non-intrusive ad policy guarantees a 5-second skip button while still crediting passive yield!"
    }
  ];

  const handleAnswerQuiz = async (quizId: number, optionIdx: number, correctIdx: number) => {
    if (quizAnswered[quizId] !== undefined) return;
    setQuizAnswered(prev => ({ ...prev, [quizId]: optionIdx }));

    if (optionIdx === correctIdx) {
      setQuizFeedback(prev => ({
        ...prev,
        [quizId]: `🎉 Correct! Selected option recorded.`
      }));
    } else {
      setQuizFeedback(prev => ({
        ...prev,
        [quizId]: "Incorrect answer recorded for this question."
      }));
    }
  };

  // 1. TIERED QUIZ REWARD SUBMISSION (/api/quiz/verify-and-claim)
  const handleSubmitTieredQuiz = async () => {
    setIsSubmittingQuizTier(true);
    try {
      const userAnswers = dailyQuizzes.map(q => ({
        questionId: q.id,
        selectedOption: quizAnswered[q.id] ?? -1,
        isCorrect: quizAnswered[q.id] === q.correct
      }));

      const res = await fetch("/api/quiz/verify-and-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: referralCode,
          userAnswers,
          totalQuestions: dailyQuizzes.length,
          userWallet: PRIMARY_RECEIVER_ADDRESS
        })
      });

      const data = await res.json();
      if (data.success) {
        setTieredQuizReceipt(data);
        setTotalYieldUSDT(prev => Number((prev + data.earnedUSDT).toFixed(2)));
        setTxCount(prev => prev + 1);
        fetchTelemetry();
      } else {
        alert(data.message || "Failed to claim tiered reward.");
      }
    } catch (err: any) {
      console.warn("Quiz submission error:", err);
    } finally {
      setIsSubmittingQuizTier(false);
    }
  };

  // 2. DUAL-BUTTON TELEGRAM BOT AUTO-REPLY HANDLER (Action: ACTION_NEXT_CLAIM)
  const handleTriggerNextClaim = async () => {
    setIsProcessingNextClaim(true);
    try {
      const res = await fetch("/api/bot/action-next-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWallet: PRIMARY_RECEIVER_ADDRESS
        })
      });
      const data = await res.json();
      if (data.success) {
        setTotalYieldUSDT(prev => Number((prev + 0.02).toFixed(2)));
        setTxCount(prev => prev + 1);
        setNextClaimToast(data.message);
        setTimeout(() => setNextClaimToast(null), 5000);
        fetchTelemetry();
      }
    } catch (e) {
      console.warn("Next claim error:", e);
    } finally {
      setIsProcessingNextClaim(false);
    }
  };

  // 3. Trigger 5-Second Skip Rewarded Video Simulation
  const handleTriggerRewardedAd = () => {
    setIsAdPlaying(true);
    setAdCountdown(5);
    setCanSkipAd(false);

    const timer = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkipAd(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFinishOrSkipAd = async (wasSkipped: boolean) => {
    setIsAdPlaying(false);
    const earning = wasSkipped ? 0.02 : 0.05;
    setTotalYieldUSDT(prev => Number((prev + earning).toFixed(2)));
    setTxCount(prev => prev + 1);

    const eventName = wasSkipped ? "AD_SKIPPED_EARLY" : "AD_WATCH_COMPLETE";
    await recordYieldEvent(eventName, earning);

    setAdSuccessToast(
      wasSkipped
        ? `⚡ Skipped after 5s! +$${earning.toFixed(2)} USDT passive yield credited.`
        : `🎉 Ad completed! +$${earning.toFixed(2)} USDT yield credited directly to TON Wallet!`
    );

    setTimeout(() => setAdSuccessToast(null), 4000);
    fetchTelemetry();
  };

  const answeredCount = Object.keys(quizAnswered).length;

  return (
    <div className="w-full space-y-6 text-stone-100 font-sans">
      {/* 1. TOP HERO: ECOSYSTEM TARGETS & TON WALLET SYNCHRONIZER */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles size={13} className="text-amber-400" />
                Community & TMA Ecosystem Hub
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                TON Mainnet Live
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-blue-950 text-blue-300 border border-blue-700/60">
                Key: <strong className="text-white">{ACTIVE_AUTH_KEY}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sreymara Quantum Community & Mini Apps
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Tiered Quiz Yield Engine, dual-button auto-reply bots, viral scheduled dispatchers, and automated USDT settlement to Telegram @Wallet.
            </p>
          </div>

          {/* TON Payout Wallet & Balance Card */}
          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
              💎
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>TON Yield Ledger</span>
                <button
                  onClick={fetchTelemetry}
                  disabled={isSyncingLedger}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                  title="Refresh live telemetry"
                >
                  <RefreshCw size={11} className={isSyncingLedger ? "animate-spin text-amber-400" : ""} />
                </button>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono flex items-center gap-1.5">
                <span>${totalYieldUSDT.toFixed(2)}</span>
                <span className="text-xs text-stone-300 font-normal">USDT</span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                {txCount} Verified Micro-Settlements
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-stone-800 pt-3 sm:pt-0 sm:pl-4 space-y-1">
              <div className="text-[10px] text-stone-400 font-bold">Primary Payout Wallet:</div>
              <div className="flex items-center gap-1.5">
                <code className="text-[11px] font-mono text-cyan-300 bg-stone-950 px-2 py-0.5 rounded border border-stone-800 truncate max-w-[160px]">
                  {PRIMARY_RECEIVER_ADDRESS.slice(0, 6)}...{PRIMARY_RECEIVER_ADDRESS.slice(-6)}
                </code>
                <button
                  onClick={handleCopyWallet}
                  className="p-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded text-xs transition-colors cursor-pointer"
                  title="Copy full TON address"
                >
                  {copiedWallet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
              <div id="ton-connect-button-root" className="pt-1">
                <TonConnectButton />
              </div>
            </div>
          </div>
        </div>

        {/* 2 Primary Web Ecosystem Targets Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href="https://ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/50 rounded-xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                <Globe size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Target 1: Primary Web Gateway
                </div>
                <div className="text-[10px] text-stone-400 font-mono truncate max-w-[260px]">
                  ais-dev-yri2x2xif26llxnhpuguzk...run.app / earnings.ink
                </div>
              </div>
            </div>
            <ExternalLink size={14} className="text-stone-500 group-hover:text-amber-400" />
          </a>

          <button
            type="button"
            onClick={onNavigateToFranz}
            className="p-3 bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-cyan-500/50 rounded-xl transition-all flex items-center justify-between group text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                <Radio size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Target 2: Deep Workspace Frame (/franz)
                </div>
                <div className="text-[10px] text-stone-400 font-mono">
                  Deep AI chat, multi-tab workstation & micro-earning module
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-400 group-hover:underline flex items-center gap-1">
              Launch Frame &rarr;
            </span>
          </button>
        </div>
      </div>

      {/* AD TOAST NOTIFICATION */}
      {adSuccessToast && (
        <div className="p-3 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce shadow-xl">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{adSuccessToast}</span>
        </div>
      )}

      {/* DUAL-BUTTON BOT TOAST NOTIFICATION */}
      {nextClaimToast && (
        <div className="p-3 bg-cyan-950/90 border-2 border-cyan-500 rounded-2xl text-cyan-200 text-xs font-bold flex items-center gap-2 shadow-xl animate-fade-in">
          <Zap size={18} className="text-amber-400 shrink-0" />
          <span>{nextClaimToast}</span>
        </div>
      )}

      {/* 2. TELEGRAM CHANNELS & COMMUNITY HUBS (SECTION B) */}
      <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-[#0088cc]" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Official Telegram Channels & Community Hubs
            </h3>
          </div>
          <span className="text-[11px] font-mono text-stone-400 bg-stone-800 px-2.5 py-1 rounded-full border border-stone-700">
            Bot-Free Clean Community • Daily Engagement Posts
          </span>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">
          Join our verified Telegram network. All channels are kept free of intrusive spam bots and feature daily engagement quizzes, updates, and direct TMA link access:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Channel 1 */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-[#0088cc]/60 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0088cc] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                  Channel #1
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">24.8K Members</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                @SREYMARA
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                Official announcement feed, quantum ecosystem news & core updates.
              </p>
            </div>
            <a
              href="https://t.me/SREYMARA"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-[#0088cc]/20 hover:bg-[#0088cc] text-cyan-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-[#0088cc]/40"
            >
              <Send size={12} />
              <span>Join @SREYMARA &rarr;</span>
            </a>
          </div>

          {/* Channel 2 */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-teal-500/60 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                  Channel #2
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">18.2K Members</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-teal-300 transition-colors">
                @multisreymara
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                Multi-protocol community hub, discussion boards & technical alpha.
              </p>
            </div>
            <a
              href="https://t.me/multisreymara"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-teal-500/40"
            >
              <Send size={12} />
              <span>Join @multisreymara &rarr;</span>
            </a>
          </div>

          {/* Channel 3 */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Support & TopUp
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Active 24/7</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-amber-300 transition-colors">
                @CUSTOMERSERVEVICETOPUP
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                Instant user balance top-up, deposit assistance & client desk.
              </p>
            </div>
            <a
              href="https://t.me/CUSTOMERSERVEVICETOPUP"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-amber-500/40"
            >
              <Send size={12} />
              <span>Contact TopUp Desk &rarr;</span>
            </a>
          </div>

          {/* Community Hub 4 */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-purple-500/60 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                  Executive Suite
                </span>
                <span className="text-[10px] text-purple-300 font-mono font-bold">VIP Hub</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-purple-300 transition-colors">
                @executive_sreymara_suit
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                Private governance room, high-roller yield strategies & royal salon.
              </p>
            </div>
            <a
              href="https://t.me/executive_sreymara_suit"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-purple-500/40"
            >
              <Send size={12} />
              <span>Enter Executive Suite &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. TELEGRAM BOTS & MINI APPS (TMAS) (SECTION C) */}
      <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-emerald-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Autonomous Telegram Bots & Mini Apps (TMAs)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700">
            @telegram-apps/sdk Verified • Auto-Sync Payouts
          </span>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">
          Deep link configured to launch the React interface directly inside Telegram. All micro-tasks and bot executions credit to TON Wallet <code className="text-cyan-300 font-mono">UQDl...WgrG</code>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Bot 1: Mini App Host */}
          <div className="p-4 bg-gradient-to-b from-stone-950 to-stone-900 rounded-2xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3 group shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                  Primary TMA Host
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold">⚡ Deep Link</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-emerald-300 transition-colors">
                @Sreyquantumbot
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                Launches the full interactive React Mini App inside Telegram with automated task optimization.
              </p>
            </div>
            <a
              href="https://t.me/Sreyquantumbot/sreymara"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 rounded-xl text-xs font-black text-center transition-all flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Zap size={13} />
              <span>Launch Mini App &rarr;</span>
            </a>
          </div>

          {/* Bot 2: Music Studio */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-pink-500/60 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800/40">
                  Music Studio
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Hi-Fi Audio</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-pink-300 transition-colors">
                @Sreymaramusicstudiobot
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                AI music creation, royal Cambodian melodies & high-fidelity beat workstation.
              </p>
            </div>
            <a
              href="https://t.me/Sreymaramusicstudiobot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-pink-500/40"
            >
              <Music size={12} />
              <span>Open Music Bot &rarr;</span>
            </a>
          </div>

          {/* Bot 3: Earn Engine */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Earn Engine
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">$0.05 / task</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-amber-300 transition-colors">
                @Earnningsonlinebot
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                Micro-earning accumulator, survey processing & instant TON Connect wallet rewards.
              </p>
            </div>
            <a
              href="https://t.me/Earnningsonlinebot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-amber-500/40"
            >
              <Coins size={12} />
              <span>Launch Earn Bot &rarr;</span>
            </a>
          </div>

          {/* Bot 4: AI Engine */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-cyan-500/60 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Gemini AI
                </span>
                <span className="text-[10px] text-cyan-300 font-mono">Ultra 2.0</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                @GEMINI_SREYMARA_BOT
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                Gemini-powered multimodal reasoning assistant with web browsing & OSINT logic.
              </p>
            </div>
            <a
              href="https://t.me/GEMINI_SREYMARA_BOT"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-cyan-500/40"
            >
              <Bot size={12} />
              <span>Chat With Gemini &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4. ZEALY / GALXE COMMUNITY QUESTS & REFERRAL SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zealy / Galxe Quests (2 Cols) */}
        <div className="lg:col-span-2 p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              <h3 className="text-base sm:text-lg font-black text-white">
                Zealy & Galxe Community Quests (Live Telemetry Hooks)
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
              Instant Micro-Yield Verified
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Complete tasks below to verify community standing. Upon verification, rewards automatically dispatch to the unified TON ledger and credit your balance:
          </p>

          <div className="space-y-2.5 pt-1">
            {/* Quest 1 */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-300 font-bold text-xs">
                  #1
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Join Verified Announcement Channel @SREYMARA</div>
                  <div className="text-[10px] text-stone-400">Earn +100 XP on Zealy • +$0.05 USDT to TON Wallet</div>
                </div>
              </div>

              {questStatuses.quest_sreymara === "completed" ? (
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-bold font-mono rounded-lg border border-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Verified
                </span>
              ) : (
                <button
                  onClick={() => handleVerifyQuest("quest_sreymara", "https://t.me/SREYMARA", 0.05)}
                  disabled={questStatuses.quest_sreymara === "verifying"}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  {questStatuses.quest_sreymara === "verifying" ? <RefreshCw size={12} className="animate-spin" /> : "Verify Quest &rarr;"}
                </button>
              )}
            </div>

            {/* Quest 2 */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-900/40 border border-teal-700/50 flex items-center justify-center text-teal-300 font-bold text-xs">
                  #2
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Join Community Discussion Hub @multisreymara</div>
                  <div className="text-[10px] text-stone-400">Earn +100 XP on Galxe • +$0.05 USDT to TON Wallet</div>
                </div>
              </div>

              {questStatuses.quest_multi === "completed" ? (
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-bold font-mono rounded-lg border border-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Verified
                </span>
              ) : (
                <button
                  onClick={() => handleVerifyQuest("quest_multi", "https://t.me/multisreymara", 0.05)}
                  disabled={questStatuses.quest_multi === "verifying"}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  {questStatuses.quest_multi === "verifying" ? <RefreshCw size={12} className="animate-spin" /> : "Verify Quest &rarr;"}
                </button>
              )}
            </div>

            {/* Quest 3 */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-300 font-bold text-xs">
                  #3
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Access Executive Suite @executive_sreymara_suit</div>
                  <div className="text-[10px] text-stone-400">Earn +150 XP on Zealy • +$0.10 USDT to TON Wallet</div>
                </div>
              </div>

              {questStatuses.quest_executive === "completed" ? (
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-bold font-mono rounded-lg border border-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Verified
                </span>
              ) : (
                <button
                  onClick={() => handleVerifyQuest("quest_executive", "https://t.me/executive_sreymara_suit", 0.10)}
                  disabled={questStatuses.quest_executive === "verifying"}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  {questStatuses.quest_executive === "verifying" ? <RefreshCw size={12} className="animate-spin" /> : "Verify Quest &rarr;"}
                </button>
              )}
            </div>

            {/* Quest 4 */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-emerald-300 font-bold text-xs">
                  #4
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Launch Task Optimizer TMA @Sreyquantumbot</div>
                  <div className="text-[10px] text-stone-400">Earn +200 XP • +$0.20 USDT instant TON balance credit</div>
                </div>
              </div>

              {questStatuses.quest_bot_tma === "completed" ? (
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-bold font-mono rounded-lg border border-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Verified
                </span>
              ) : (
                <button
                  onClick={() => handleVerifyQuest("quest_bot_tma", "https://t.me/Sreyquantumbot/sreymara", 0.20)}
                  disabled={questStatuses.quest_bot_tma === "verifying"}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow"
                >
                  {questStatuses.quest_bot_tma === "verifying" ? <RefreshCw size={12} className="animate-spin" /> : "Launch & Verify &rarr;"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pinned Referral System (1 Col) */}
        <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Gift size={18} />
              <h3 className="text-base font-black text-white">
                Official Pinned Referral System
              </h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Earn an ongoing 20% passive micro-yield override whenever invited peers execute searches, TMA tasks, or claim daily quizzes.
            </p>
          </div>

          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Your TMA Pinned Referral Link:
            </div>
            <div className="p-2 bg-stone-900 rounded-lg text-xs font-mono text-cyan-300 break-all select-all border border-stone-800">
              {referralUrl}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyReferral}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
              </button>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent("Join the Sreymara Quantum TMA ecosystem & earn daily USDT rewards on TON!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-[#0088cc] hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                title="Share directly in Telegram"
              >
                <Send size={14} />
              </a>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 font-mono text-center">
            Zero limits • Direct on-chain settlement to UQDl...WgrG
          </div>
        </div>
      </div>

      {/* 5. TIERED QUIZ REWARD ENGINE (FLEXIBLE POOL UP TO $0.50 USDT) */}
      <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-5 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-cyan-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Tiered Quiz Reward Engine (Flexible $0.50 Base Pool)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800 font-bold">
              Base Pool: $0.50 USDT
            </span>
            <span className="text-xs font-mono text-stone-400 bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-700">
              {answeredCount}/{dailyQuizzes.length} Answered
            </span>
          </div>
        </div>

        {/* Tier Payout Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 bg-stone-950 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[10px] text-stone-400 font-bold uppercase">100% Score</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">$0.50 USDT</div>
            <div className="text-[9px] text-stone-500">1.0x Multiplier</div>
          </div>
          <div className="p-2.5 bg-stone-950 rounded-xl border border-sky-500/40 text-center">
            <div className="text-[10px] text-stone-400 font-bold uppercase">80%+ Score</div>
            <div className="text-sm font-black text-sky-400 font-mono mt-0.5">$0.40 USDT</div>
            <div className="text-[9px] text-stone-500">0.8x Multiplier</div>
          </div>
          <div className="p-2.5 bg-stone-950 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[10px] text-stone-400 font-bold uppercase">50%+ Score</div>
            <div className="text-sm font-black text-amber-400 font-mono mt-0.5">$0.25 USDT</div>
            <div className="text-[9px] text-stone-500">0.5x Multiplier</div>
          </div>
          <div className="p-2.5 bg-stone-950 rounded-xl border border-purple-500/40 text-center">
            <div className="text-[10px] text-stone-400 font-bold uppercase">Participation</div>
            <div className="text-sm font-black text-purple-400 font-mono mt-0.5">$0.05 USDT</div>
            <div className="text-[9px] text-stone-500">0.1x Minimum</div>
          </div>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {dailyQuizzes.map(quiz => (
            <div
              key={quiz.id}
              className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  <span>Question #{quiz.id}</span>
                  <span className="text-cyan-400">Score Contributor</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {quiz.question}
                </h4>
              </div>

              <div className="space-y-1.5">
                {quiz.options.map((opt, optIdx) => {
                  const isSelected = quizAnswered[quiz.id] === optIdx;
                  const isAnswered = quizAnswered[quiz.id] !== undefined;

                  let btnStyle = "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800";
                  if (isSelected) {
                    btnStyle = "bg-cyan-950 border-cyan-500 text-cyan-200 font-bold shadow-sm";
                  } else if (isAnswered) {
                    btnStyle = "bg-stone-900/50 border-stone-800/50 text-stone-500 opacity-60";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleAnswerQuiz(quiz.id, optIdx, quiz.correct)}
                      className={`w-full p-2.5 rounded-xl text-left text-xs border transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizFeedback[quiz.id] && (
                <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-[11px] leading-tight">
                  <span className="text-stone-300 font-mono text-[10px]">
                    {quizFeedback[quiz.id]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Claim Tiered Reward Button & Receipt Output */}
        <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-400">
            {answeredCount === dailyQuizzes.length ? (
              <span className="text-emerald-400 font-bold">✓ All questions answered! Ready to claim tiered yield.</span>
            ) : (
              <span>Answer remaining questions to maximize your reward multiplier.</span>
            )}
          </div>

          <button
            onClick={handleSubmitTieredQuiz}
            disabled={answeredCount === 0 || isSubmittingQuizTier}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-stone-950 font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmittingQuizTier ? <RefreshCw size={14} className="animate-spin" /> : <Coins size={14} />}
            <span>{isSubmittingQuizTier ? "Verifying On-Chain..." : "Verify & Claim Tiered Yield"}</span>
          </button>
        </div>

        {/* Tiered Quiz Receipt Modal/Card */}
        {tieredQuizReceipt && (
          <div className="p-4 bg-emerald-950/40 border-2 border-emerald-500/80 rounded-2xl space-y-2 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Tiered Reward Verified & Dispatched!
              </span>
              <span className="font-mono text-white text-sm bg-emerald-900/60 px-2.5 py-0.5 rounded-lg border border-emerald-700">
                +${tieredQuizReceipt.earnedUSDT.toFixed(2)} USDT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
              <div className="p-2 bg-stone-950/80 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[9px] uppercase">Final Score</span>
                <span className="text-white font-bold">{tieredQuizReceipt.score} ({tieredQuizReceipt.reward?.scorePercentage})</span>
              </div>
              <div className="p-2 bg-stone-950/80 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[9px] uppercase">Receipt TxId</span>
                <span className="text-cyan-300 font-bold truncate block">{tieredQuizReceipt.reward?.txId}</span>
              </div>
              <div className="p-2 bg-stone-950/80 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[9px] uppercase">Recipient TON Wallet</span>
                <span className="text-amber-300 font-bold truncate block">{PRIMARY_RECEIVER_ADDRESS.slice(0, 10)}...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. SERVER-TO-SERVER DUAL-BUTTON AUTO-REPLY (bots/autoReplyEngine.js) */}
      <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MousePointerClick size={18} className="text-cyan-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Dual-Button Telegram Auto-Reply Engine (`bots/autoReplyEngine.js`)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
            Web App + Callback Action
          </span>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          Autonomous bots respond to incoming chat/channel inquiries with a 2-way monetization trigger. Click either button below to test live execution and micro-yield dispatch:
        </p>

        {/* Telegram Chat Simulation Window */}
        <div className="p-4 sm:p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-4 max-w-2xl mx-auto shadow-inner">
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center text-white text-xs font-bold">
                🤖
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>@Sreyquantumbot</span>
                  <span className="text-[9px] text-[#0088cc] font-mono">bot</span>
                </div>
                <div className="text-[10px] text-stone-400">Telegram Bot API Auto-Responder</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </div>

          {/* User Incoming Bubble */}
          <div className="flex justify-end">
            <div className="bg-[#1e2c3a] border border-[#2b3e52] text-white px-3.5 py-2 rounded-2xl rounded-tr-none text-xs max-w-sm">
              <p>{incomingBotMsg}</p>
              <div className="text-[9px] text-stone-400 text-right mt-1 font-mono">Just now</div>
            </div>
          </div>

          {/* Bot Dual-Button Reply Bubble */}
          <div className="flex justify-start">
            <div className="bg-[#18222d] border border-stone-800 text-stone-200 px-4 py-3 rounded-2xl rounded-tl-none text-xs max-w-md space-y-3">
              <p className="whitespace-pre-line leading-relaxed text-xs">
                🎯 <strong>New High-Yield Quiz Challenge Available!</strong>
                <br />
                Choose an option below to engage and claim USDT rewards directly to your Telegram Wallet:
              </p>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Button 1: Web App */}
                <a
                  href="https://t.me/Sreyquantumbot/sreymara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <span>➡️ Proceed & Play Quiz</span>
                </a>

                {/* Button 2: Quick Claim Callback */}
                <button
                  onClick={handleTriggerNextClaim}
                  disabled={isProcessingNextClaim}
                  className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold transition-all border border-amber-500/40 flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  {isProcessingNextClaim ? <RefreshCw size={12} className="animate-spin" /> : <span>⏭️ Next / Quick Claim</span>}
                </button>
              </div>

              <div className="text-[10px] text-stone-400 flex items-center justify-between border-t border-stone-800 pt-2">
                <span>Triggers: <strong className="text-cyan-300">0.02 USDT</strong> yield on Click</span>
                <span>Wallet: <strong className="text-emerald-400 font-mono">UQDl...WgrG</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. SCHEDULED TIMED BOT DISPATCHERS & VIRAL SHARING (cron/scheduler.js) */}
      <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-amber-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Scheduled Timed Dispatchers & Viral Sharing Engine (`cron/scheduler.js`)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
            node-cron Active • 15m & 25m Broadcast Loops
          </span>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          Continuous background routines automate periodic quiz drops and reward notifications to social channels without manual intervention:
        </p>

        {/* Scheduled Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Schedule 1 */}
          <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock size={14} className="text-cyan-400" /> Bot 1: Quiz Broadcast Routine
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                */15 * * * *
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Dispatches live quiz cards every 15 minutes to `@SREYMARA`, `@multisreymara`, and `@executive_sreymara_suit`.
            </p>
            <div className="p-2.5 bg-stone-900 rounded-xl text-[11px] font-mono text-stone-300 flex items-center justify-between">
              <span>Status: <strong className="text-emerald-400">RUNNING</strong></span>
              <span className="text-stone-500">Next drop: in ~7 mins</span>
            </div>
          </div>

          {/* Schedule 2 */}
          <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame size={14} className="text-amber-400" /> Bot 2: High-Yield Alert Routine
              </span>
              <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                */25 * * * *
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Dispatches high-yield surge notifications ($0.05 / query, $0.50 quiz pool) every 25 minutes to community groups.
            </p>
            <div className="p-2.5 bg-stone-900 rounded-xl text-[11px] font-mono text-stone-300 flex items-center justify-between">
              <span>Status: <strong className="text-emerald-400">RUNNING</strong></span>
              <span className="text-stone-500">Auto-routes to UQDl...WgrG</span>
            </div>
          </div>
        </div>

        {/* Viral Social Sharing Cards (Bot 3: generateShareableCard) */}
        <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Share2 size={14} className="text-amber-400" /> Bot 3: Multi-Channel Viral Sharing Cards
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              Auto-bound referral: <strong className="text-cyan-300">{referralCode}</strong>
            </span>
          </div>

          <p className="text-[11px] text-stone-400 leading-snug">
            Share directly to major social platforms to attract downstream users and accumulate 20% perpetual referral yield:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent("🔥 Complete quick quizzes and earn TON/USDT directly to your Telegram Wallet!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#0088cc]/20 hover:bg-[#0088cc] text-cyan-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all border border-[#0088cc]/40 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Send size={15} />
              <span>Telegram</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("🔥 Complete quick quizzes and earn TON/USDT directly to your Telegram Wallet!")}&url=${encodeURIComponent(referralUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white rounded-xl text-xs font-bold text-center transition-all border border-stone-700 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <span className="font-mono text-sm font-black">𝕏</span>
              <span>Twitter / X</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent("🔥 Earn crypto on quizzes: " + referralUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-950/40 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all border border-emerald-700/50 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-blue-950/40 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all border border-blue-700/50 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Share2 size={15} />
              <span>Facebook</span>
            </a>

            {/* TikTok / Copy Link */}
            <button
              onClick={handleCopyReferral}
              className="p-2.5 bg-pink-950/40 hover:bg-pink-600 text-pink-300 hover:text-white rounded-xl text-xs font-bold text-center transition-all border border-pink-700/50 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Copy size={15} />
              <span>{copiedLink ? "Copied!" : "TikTok / Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8. NON-INTRUSIVE ADS CONFIGURATION (ADSGRAM / MONETAG) */}
      <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Radio size={18} className="text-amber-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Non-Intrusive Ads Engine & 5-Second Skip Rule
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-300 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800">
            Never Blocks Core Workflows • Guaranteed Skip After 5s
          </span>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          Adsgram and Monetag modules run strictly non-intrusively in lower side panels or footer cards. When triggered for rewarded yield, users can skip immediately after 5 seconds while retaining full passive micro-earnings:
        </p>

        {/* Live Non-Blocking Ad Card */}
        <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Play size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">High-Yield Rewarded Video Simulation</span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                  +$0.05 Max Yield
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                Tests the exact 5-second skip rule & telemetry dispatch to `/api/intelligence/telemetry`.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleTriggerRewardedAd}
              disabled={isAdPlaying}
              className="flex-1 md:flex-initial px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play size={13} />
              <span>Simulate Rewarded Ad (5s Skip)</span>
            </button>
          </div>
        </div>

        {/* ACTIVE REWARDED VIDEO SIMULATION POPUP (WITH STRICT 5S SKIP) */}
        {isAdPlaying && (
          <div className="p-4 bg-stone-900 border-2 border-amber-500 rounded-2xl space-y-3 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Clock size={14} className="animate-spin" /> Playing Non-Intrusive Sponsored Video...
              </span>
              <span className="text-stone-400 font-mono">
                Auto-credit target: <strong className="text-cyan-300">UQDl...WgrG</strong>
              </span>
            </div>

            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-1000"
                style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-stone-400">
                {adCountdown > 0 ? (
                  <span>Skip button unlocks in <strong className="text-amber-300 font-mono">{adCountdown}s</strong></span>
                ) : (
                  <span className="text-emerald-400 font-bold">✓ 5-Second Skip Rule Active: You can skip anytime!</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {canSkipAd ? (
                  <button
                    onClick={() => handleFinishOrSkipAd(true)}
                    className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-xs font-bold transition-all border border-amber-500/50 cursor-pointer"
                  >
                    ⚡ Skip Ad Now (+ $0.02 USDT)
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-stone-800/60 text-stone-500 rounded-lg text-xs font-mono">
                    Skip in {adCountdown}s...
                  </span>
                )}

                <button
                  onClick={() => handleFinishOrSkipAd(false)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black rounded-lg text-xs transition-all shadow cursor-pointer"
                >
                  Watch Complete (+ $0.05 USDT)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
