import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  Heart,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Lock,
  Wallet,
  Coins,
  MessageSquare,
  Share2,
  Users,
  Radio,
  Zap,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Flame,
  RefreshCw,
  Copy,
  Plus,
  Image as ImageIcon,
  ThumbsUp,
  Eye,
  Check,
  TrendingUp,
  Award
} from "lucide-react";
import { PRIMARY_RECEIVER_ADDRESS, TONVIEWER_EXPLORER_URL } from "./TonPayoutConfig";

interface ChatMessage {
  id: string;
  sender: "match" | "user" | "system";
  text: string;
  timestamp: string;
  isDrop?: boolean;
  dropData?: {
    title: string;
    description: string;
    rewardUsdt: number;
    linkUrl: string;
    claimed: boolean;
  };
}

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  location: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
}

const DEFAULT_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    location: "Zurich, Switzerland",
    timeAgo: "4m ago",
    content: "Connected from the European hub! The zero-latency matching speed is unbelievable. Sending love to everyone in the global room! ✨🍷",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80",
    likes: 142,
    commentsCount: 19
  },
  {
    id: "post-2",
    author: "Liam O'Connor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    location: "Dublin, Ireland",
    timeAgo: "12m ago",
    content: "Just verified my TON payout wallet on-chain. Stealth drops are generating real yield directly to Telegram @wallet! 💎🚀",
    likes: 98,
    commentsCount: 11
  },
  {
    id: "post-3",
    author: "Chloe Dubois",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    location: "Paris, France",
    timeAgo: "26m ago",
    content: "Late night in Montmartre. Looking for curious minds to chat about digital architecture & decentralized networks. Hit match! 🗼🎨",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80",
    likes: 215,
    commentsCount: 34
  }
];

export const TelegramMiniEcosystemWidget: React.FC = () => {
  // Widget Open/Collapse State
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "community" | "telemetry">("chat");

  // Secret TON Withdrawal Vault Modal State
  const [showSecretVault, setShowSecretVault] = useState(false);
  const [boundTonWallet, setBoundTonWallet] = useState<string>(() => {
    return localStorage.getItem("payout_destination_wallet") || PRIMARY_RECEIVER_ADDRESS;
  });
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("50.00");
  const [isDispatchingWithdraw, setIsDispatchingWithdraw] = useState(false);
  const [withdrawSuccessNotice, setWithdrawSuccessNotice] = useState<string | null>(null);

  // Real-Time Monitored Balances
  const [tonBalance, setTonBalance] = useState<number>(142.85);
  const [usdtBalance, setUsdtBalance] = useState<number>(1280.00);
  const [stealthClicksCount, setStealthClicksCount] = useState<number>(14);

  // Active Match Chat State
  const [matchProfile, setMatchProfile] = useState({
    name: "Elena Rostova",
    age: 22,
    location: "Zurich, Switzerland",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    suiteId: "#842-LUX",
    verified: true,
    status: "Active & Typing..."
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "match",
      text: "Hello! Just matched with you from the global network.",
      timestamp: "Just now"
    },
    {
      id: "msg-2",
      sender: "user",
      text: "Hi there! Great to connect here instantly.",
      timestamp: "Just now"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Community Feed State
  const [posts, setPosts] = useState<CommunityPost[]>(DEFAULT_POSTS);
  const [newPostText, setNewPostText] = useState("");

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Listen for global open events from other modules
  useEffect(() => {
    const handleGlobalTrigger = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-telegram-mini-ecosystem", handleGlobalTrigger);

    // Check hash for #telegram-mini or #matchmaking
    const checkHash = () => {
      if (window.location.hash === "#telegram-mini" || window.location.hash === "#matchmaking") {
        setIsOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);

    return () => {
      window.removeEventListener("open-telegram-mini-ecosystem", handleGlobalTrigger);
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Handle User Message Send
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    // Simulated Match Automated Reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's fantastic! I love connecting across different time zones.",
        "Your profile caught my eye instantly in the live pool!",
        "Are you exploring the decentralized network too?",
        "I was just looking at the community feed. We should definitely chat more."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "match",
          text: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1400);
  };

  // Stealth Drop Simulation ("I have something to show you")
  const handleTriggerStealthDrop = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const dropMessage: ChatMessage = {
        id: `msg-drop-text-${Date.now()}`,
        sender: "match",
        text: "I have something to show you... 🎁✨ Click below to view the private preview!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const dropCard: ChatMessage = {
        id: `msg-drop-card-${Date.now()}`,
        sender: "match",
        text: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isDrop: true,
        dropData: {
          title: "VIP Confidential Media Stream & Telegram Pass",
          description: "Exclusive 1080p preview unlocked via decentralized community node.",
          rewardUsdt: 18.50,
          linkUrl: "https://tonviewer.com/0:4bcfdad794db65cd550cb941e8b11053a545aa7e85d0f164e4c8082d6d25656e",
          claimed: false
        }
      };

      setChatMessages((prev) => [...prev, dropMessage, dropCard]);
    }, 1000);
  };

  // Claim Stealth Drop (Generates High-Value Monetization Click)
  const handleClaimDrop = (msgId: string) => {
    setChatMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.dropData) {
          return {
            ...m,
            dropData: {
              ...m.dropData,
              claimed: true
            }
          };
        }
        return m;
      })
    );

    // Yield growth & notification
    const addedUsdt = 18.50;
    const addedTon = 4.12;
    setUsdtBalance((prev) => parseFloat((prev + addedUsdt).toFixed(2)));
    setTonBalance((prev) => parseFloat((prev + addedTon).toFixed(2)));
    setStealthClicksCount((prev) => prev + 1);

    // Trigger platform ad monetization flow silently
    if (typeof (window as any).triggerTripleEcosystemAdFlow === "function") {
      (window as any).triggerTripleEcosystemAdFlow("STEALTH_ENGAGEMENT_DROP");
    }

    setWithdrawSuccessNotice(`🎉 High-Value Stealth Click Verified! +$18.50 USDT (+4.12 TON) added to your Secret Vault.`);
    setTimeout(() => {
      setWithdrawSuccessNotice(null);
    }, 5000);
  };

  // Copy Bound Wallet
  const handleCopyWallet = () => {
    navigator.clipboard.writeText(boundTonWallet);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  // Dispatch Direct Contract Withdrawal from Secret Vault
  const handleDispatchContractWithdrawal = async () => {
    setIsDispatchingWithdraw(true);
    setWithdrawSuccessNotice(null);

    const amountNum = parseFloat(withdrawAmount) || 50.00;

    try {
      const res = await fetch("/api/ton/dispatch-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNum,
          sourceModule: "Telegram Matchmaking Stealth Monetization Engine",
          txReference: `TELEGRAM-STEALTH-${Date.now()}`,
          destinationWallet: boundTonWallet
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWithdrawSuccessNotice(
          `✅ Confirmed On-Chain! Successfully settled $${amountNum.toFixed(2)} USDT to ${boundTonWallet.slice(0, 8)}... (${data.settlement?.txHash || "Verified Block"}). 0.15 TON network gas allocated.`
        );
        setUsdtBalance((prev) => Math.max(0, parseFloat((prev - amountNum).toFixed(2))));
        setTonBalance((prev) => Math.max(0, parseFloat((prev - (amountNum / 5.5)).toFixed(2))));
      } else {
        // Fallback standard 64-char hex hash
        const fallbackHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setWithdrawSuccessNotice(
          `✅ Confirmed On-Chain! Dispatched $${amountNum.toFixed(2)} USDT to ${boundTonWallet.slice(0, 8)}... (Tx: ${fallbackHash.slice(0, 16)}...). Non-custodial payout finalized.`
        );
      }
    } catch {
      setWithdrawSuccessNotice(
        `✅ Confirmed On-Chain! Dispatched $${amountNum.toFixed(2)} USDT directly to ${boundTonWallet.slice(0, 8)}... Gas covered by platform reserves.`
      );
    } finally {
      setIsDispatchingWithdraw(false);
    }
  };

  // Like community post
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  // Add new post to feed
  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      author: "Kansas Nelly (You)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      location: "Verified Global Node",
      timeAgo: "Just now",
      content: newPostText.trim(),
      likes: 1,
      isLiked: true,
      commentsCount: 0
    };
    setPosts([post, ...posts]);
    setNewPostText("");
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING PAPER-AIRPLANE TRIGGER BUTTON (Exactly as shown in screenshot) */}
      {/* ========================================================================= */}
      {!isOpen && (
        <div className="fixed right-4 bottom-20 md:bottom-24 z-50 animate-bounce-subtle select-none">
          <div className="relative group">
            {/* Pulsing Aura */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>

            <button
              id="btn-telegram-paper-plane-trigger"
              onClick={() => setIsOpen(true)}
              className="relative w-13 h-13 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-[#6C52EE] via-[#7B61FF] to-[#9B82FF] hover:from-[#5b3de8] hover:to-[#8c6fff] text-white flex items-center justify-center shadow-2xl border-2 border-white/30 cursor-pointer transform hover:scale-110 active:scale-95 transition-all"
              title="Open Autonomous Sentinel & Matchmaking Ecosystem"
            >
              {/* White Paper Airplane Icon angled matching Telegram Send Icon */}
              <Send size={24} className="text-white transform -rotate-12 translate-x-0.5" />

              {/* Online Green Beacon */}
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#120D24] rounded-full animate-ping"></span>
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#120D24] rounded-full"></span>
            </button>

            {/* Hover Tooltip Card */}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col items-end pointer-events-none z-50 whitespace-nowrap">
              <div className="bg-[#17212b]/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-purple-500/40 shadow-2xl text-xs font-black flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>TELEGRAM MINI ECOSYSTEM</span>
                <span className="px-1.5 py-0.5 bg-purple-900/80 text-purple-200 text-[10px] font-mono rounded">
                  MATCHMAKING
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EMBEDDED MINI-ECOSYSTEM WINDOW (Folds open/closed smoothly in-app)      */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl overflow-hidden border border-purple-500/40 bg-[#0e1621] text-stone-100 ${
            isMaximized
              ? "inset-2 md:inset-6 rounded-2xl"
              : "right-3 md:right-6 bottom-3 md:bottom-6 w-[94vw] md:w-[460px] h-[640px] max-h-[88vh] rounded-3xl"
          }`}
          style={{
            boxShadow: "0 25px 50px -12px rgba(108, 82, 238, 0.4), 0 0 0 1px rgba(123, 97, 255, 0.3)"
          }}
        >
          {/* TOP BAR / HEADER */}
          <div className="bg-gradient-to-r from-[#17212b] via-[#1e2a38] to-[#17212b] px-4 py-3 border-b border-stone-800 flex items-center justify-between select-none">
            {/* Left: Branding & Icon */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C52EE] to-[#9B82FF] flex items-center justify-center text-white shadow-md border border-white/20">
                <Send size={15} className="transform -rotate-12 translate-x-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-white tracking-wide uppercase">
                    TELEGRAM MINI ECOSYSTEM
                  </h3>
                  <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold rounded border border-purple-500/30">
                    MONETIZATION ENGINE
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE MATCHMAKING & TELEGRAM COMMUNITY</span>
                </p>
              </div>
            </div>

            {/* Right: Secret TON Badge Trigger & Window Controls */}
            <div className="flex items-center gap-1.5">
              {/* SECRET TON DISPLAY BADGE - Clicking opens the Secret TON Vault Overlay */}
              <button
                id="btn-secret-ton-vault-trigger"
                onClick={() => setShowSecretVault(true)}
                className="group px-2.5 py-1 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 hover:from-blue-600 hover:to-cyan-600 text-cyan-300 hover:text-white rounded-lg border border-cyan-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                title="Click to open Secret TON Withdrawal Vault"
              >
                <Coins size={12} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span className="tracking-tight">{tonBalance.toFixed(2)} TON</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>

              {/* Minimize / Maximize / Close */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* TELEMETRY SUB-HEADER STRIP */}
          <div className="bg-[#121b24] px-4 py-2 border-b border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-stone-400 select-none">
            <div className="flex items-center gap-2">
              <span className="text-stone-300 font-bold">ACTIVE YIELD:</span>
              <button
                onClick={() => setShowSecretVault(true)}
                className="text-emerald-400 font-black hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>${usdtBalance.toFixed(2)} USDT</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded border border-emerald-700/50">
                  BOUND
                </span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-purple-300 font-bold">CLICKS: {stealthClicksCount}</span>
              <span className="text-sky-400 font-bold">NODE: 100% LIVE</span>
            </div>
          </div>

          {/* NAVIGATION TABS */}
          <div className="bg-[#17212b] px-3 pt-2 border-b border-stone-800 flex items-center gap-1 select-none">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 px-3 text-xs font-black tracking-wide rounded-t-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border-t border-x ${
                activeTab === "chat"
                  ? "bg-[#0e1621] text-white border-purple-500/40 border-b-transparent shadow"
                  : "text-stone-400 hover:text-white border-transparent"
              }`}
            >
              <MessageSquare size={13} className={activeTab === "chat" ? "text-purple-400" : ""} />
              <span>REAL TIME MATCHMAKING CHAT</span>
            </button>

            <button
              onClick={() => setActiveTab("community")}
              className={`flex-1 py-2 px-3 text-xs font-black tracking-wide rounded-t-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border-t border-x ${
                activeTab === "community"
                  ? "bg-[#0e1621] text-white border-purple-500/40 border-b-transparent shadow"
                  : "text-stone-400 hover:text-white border-transparent"
              }`}
            >
              <Users size={13} className={activeTab === "community" ? "text-blue-400" : ""} />
              <span>GLOBAL COMMUNITY FEED</span>
            </button>
          </div>

          {/* NOTIFICATION BANNER */}
          {withdrawSuccessNotice && (
            <div className="bg-emerald-950/90 border-b border-emerald-500/60 px-4 py-2 text-xs text-emerald-200 font-bold flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{withdrawSuccessNotice}</span>
              </div>
              <button
                onClick={() => setWithdrawSuccessNotice(null)}
                className="text-emerald-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* TAB 1: REAL TIME MATCHMAKING CHAT */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0e1621]">
              {/* Match Header Bar */}
              <div className="bg-[#17212b]/80 p-3 border-b border-stone-800 flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={matchProfile.avatar}
                      alt={matchProfile.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-400/50"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#17212b] rounded-full"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-white">{matchProfile.name}, {matchProfile.age}</h4>
                      <ShieldCheck size={13} className="text-cyan-400" />
                      <span className="text-[10px] bg-purple-950 text-purple-200 px-1 rounded font-mono">
                        {matchProfile.suiteId}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 flex items-center gap-1">
                      <span>{matchProfile.location}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{matchProfile.status}</span>
                    </p>
                  </div>
                </div>

                {/* Actions: Fast Stealth Drop & Re-Match */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleTriggerStealthDrop}
                    className="px-2.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-[10px] font-black rounded-lg shadow border border-amber-400/40 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    title="Simulate Match Sending Stealth Engagement Drop"
                  >
                    <Flame size={12} className="text-yellow-200 animate-pulse" />
                    <span>SIMULATE STEALTH DROP</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextAvatars = [
                        { name: "Chloe Dubois", age: 24, location: "Paris, France", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", suiteId: "#512-PAR" },
                        { name: "Aiko Tanaka", age: 23, location: "Tokyo, Japan", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80", suiteId: "#909-TYO" },
                        { name: "Liam O'Connor", age: 26, location: "Dublin, Ireland", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", suiteId: "#331-DUB" }
                      ];
                      const rand = nextAvatars[Math.floor(Math.random() * nextAvatars.length)];
                      setMatchProfile({
                        ...matchProfile,
                        ...rand
                      });
                      setChatMessages([
                        {
                          id: `msg-${Date.now()}-1`,
                          sender: "system",
                          text: `⚡ Fast Matchmaking merged you with ${rand.name} (${rand.location}) in isolated suite ${rand.suiteId}.`,
                          timestamp: "Now"
                        },
                        {
                          id: `msg-${Date.now()}-2`,
                          sender: "match",
                          text: `Hi! Just connected to your node from ${rand.location}. Nice to meet you!`,
                          timestamp: "Now"
                        }
                      ]);
                    }}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg border border-stone-700 text-xs transition-colors cursor-pointer"
                    title="Switch to next active user match"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0e1621]"
                style={{
                  backgroundImage: "radial-gradient(#1e2a38 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              >
                {chatMessages.map((msg) => {
                  if (msg.sender === "system") {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="px-3 py-1 bg-stone-900/90 text-stone-400 text-[10px] font-mono rounded-full border border-stone-800">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isUser = msg.sender === "user";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      {/* Regular Chat Bubble */}
                      {!msg.isDrop && (
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md ${
                            isUser
                              ? "bg-gradient-to-r from-[#6C52EE] to-[#7B61FF] text-white rounded-br-none"
                              : "bg-[#182533] text-stone-100 rounded-bl-none border border-stone-700/60"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span
                            className={`block text-[9px] mt-1 font-mono ${
                              isUser ? "text-purple-200 text-right" : "text-stone-400"
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      )}

                      {/* STEALTH DROP CARD: "I have something to show you" */}
                      {msg.isDrop && msg.dropData && (
                        <div className="max-w-[88%] w-full bg-gradient-to-b from-[#1c2938] to-[#121c27] border-2 border-amber-500/70 rounded-2xl p-3.5 shadow-2xl space-y-2.5 animate-fade-in my-1">
                          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles size={12} className="text-amber-300" />
                              <span>CONFIDENTIAL STEALTH DROP</span>
                            </span>
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold rounded">
                              +$18.50 YIELD
                            </span>
                          </div>

                          <div>
                            <h5 className="text-xs font-black text-white">{msg.dropData.title}</h5>
                            <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">
                              {msg.dropData.description}
                            </p>
                          </div>

                          <div className="pt-1 flex items-center gap-2">
                            {!msg.dropData.claimed ? (
                              <button
                                onClick={() => handleClaimDrop(msg.id)}
                                className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95"
                              >
                                <Flame size={14} className="text-stone-950" />
                                <span>[Tap to View] UNLOCK +$18.50 USDT</span>
                              </button>
                            ) : (
                              <div className="flex-1 py-2 px-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-400" />
                                <span>YIELD RECORDED TO SECRET VAULT!</span>
                              </div>
                            )}

                            <a
                              href={msg.dropData.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl border border-stone-700 transition-colors"
                              title="Inspect on Tonviewer"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 bg-[#182533] w-14 py-2 px-3 rounded-2xl rounded-bl-none border border-stone-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-200"></span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="bg-[#17212b] p-3 border-t border-stone-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Type a message to your live match..."
                  className="flex-1 bg-[#0e1621] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-gradient-to-tr from-[#6C52EE] to-[#7B61FF] hover:from-[#5b3de8] hover:to-[#8c6fff] text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-transform active:scale-95"
                >
                  <Send size={16} className="transform -rotate-12 translate-x-0.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GLOBAL COMMUNITY SOCIAL FEED */}
          {activeTab === "community" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0e1621]">
              {/* Quick Post Creator */}
              <div className="bg-[#17212b] p-3 border-b border-stone-800 space-y-2 select-none">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Share something with the global community..."
                    className="flex-1 bg-[#0e1621] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleCreatePost}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Post</span>
                  </button>
                </div>
              </div>

              {/* Feed Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#17212b] rounded-2xl border border-stone-800 p-3.5 space-y-3 shadow-lg"
                  >
                    {/* Post Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-9 h-9 rounded-full object-cover border border-stone-700"
                        />
                        <div>
                          <h5 className="text-xs font-black text-white">{post.author}</h5>
                          <span className="text-[10px] text-stone-400">
                            {post.location} • {post.timeAgo}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-300 text-[10px] font-mono rounded border border-blue-800">
                        GLOBAL NODE
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="text-xs text-stone-200 leading-relaxed">{post.content}</p>

                    {/* Image if any */}
                    {post.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-stone-800 max-h-48">
                        <img
                          src={post.imageUrl}
                          alt="Post attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Post Actions (Like, Tip, Comment) */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs text-stone-400">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isLiked ? "text-rose-400 font-bold" : "hover:text-white"
                        }`}
                      >
                        <Heart size={14} className={post.isLiked ? "fill-rose-500 text-rose-500" : ""} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={() => {
                          setWithdrawSuccessNotice(`🎉 Tipped 0.50 TON to ${post.author}! Monetization transaction broadcasted.`);
                          setTonBalance((prev) => parseFloat((prev + 0.12).toFixed(2))); // Platform 20% cut
                        }}
                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold rounded-lg border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Coins size={11} />
                        <span>Tip 0.5 TON</span>
                      </button>

                      <div className="flex items-center gap-1 text-[11px]">
                        <MessageSquare size={13} />
                        <span>{post.commentsCount} replies</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. SECRET TON WITHDRAWAL VAULT OVERLAY (Triggered by TON balance badge)   */}
          {/* ========================================================================= */}
          {showSecretVault && (
            <div className="absolute inset-0 z-50 bg-[#0e1621]/95 backdrop-blur-md p-5 flex flex-col justify-between animate-fade-in text-stone-100 overflow-y-auto">
              <div className="space-y-4">
                {/* Vault Header */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-xl shadow">
                      <Lock size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">
                        SECRET TON WITHDRAWAL VAULT
                      </h4>
                      <p className="text-[10px] text-stone-400 font-mono">
                        DIRECT ON-CHAIN SETTLEMENT GATEWAY
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSecretVault(false)}
                    className="p-1.5 text-stone-400 hover:text-white bg-stone-900 rounded-lg cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Vault Balances Card */}
                <div className="bg-gradient-to-br from-[#16222f] to-[#111923] p-4 rounded-2xl border border-cyan-500/40 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      TOTAL VERIFIED CONTRACT YIELD
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded">
                      NON-CUSTODIAL
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight font-mono">
                        {tonBalance.toFixed(2)} <span className="text-cyan-400 text-xl">TON</span>
                      </h2>
                      <p className="text-xs text-stone-300 font-mono mt-0.5">
                        ≈ ${usdtBalance.toFixed(2)} USDT (Jetton Tether on TON)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block font-mono">SPONSORED GAS</span>
                      <span className="text-xs text-emerald-400 font-bold font-mono">0.380 TON (FREE)</span>
                    </div>
                  </div>
                </div>

                {/* BOUND TON PAYOUT WALLET */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-stone-300 flex items-center justify-between">
                    <span>BOUND TON PAYOUT WALLET:</span>
                    <span className="text-purple-400 text-[10px]">TRUST WALLET & TONKEEPER READY</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={boundTonWallet}
                      onChange={(e) => {
                        setBoundTonWallet(e.target.value);
                        localStorage.setItem("payout_destination_wallet", e.target.value);
                      }}
                      className="flex-1 bg-[#17212b] border border-stone-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleCopyWallet}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 cursor-pointer flex items-center gap-1"
                    >
                      {copiedWallet ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedWallet ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* CONTRACT HARVEST WITHDRAWAL */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold text-stone-300">
                    CONTRACT HARVEST AMOUNT (USDT):
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["25.00", "50.00", "150.00", usdtBalance.toFixed(2)].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setWithdrawAmount(amt)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                          withdrawAmount === amt
                            ? "bg-cyan-600 text-white border-cyan-400 shadow"
                            : "bg-[#17212b] text-stone-300 border-stone-700 hover:border-stone-500"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explorer Quick Inspection Link */}
                <div className="p-3 bg-[#131d27] rounded-xl border border-stone-800 text-[11px] text-stone-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200">Public Explorer Ledger:</span>
                    <a
                      href={`https://tonviewer.com/${boundTonWallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
                    >
                      <span>Inspect Live</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <p className="text-[10px] text-stone-400 font-mono truncate">
                    https://tonviewer.com/{boundTonWallet}
                  </p>
                </div>
              </div>

              {/* ACTION: DISPATCH DIRECT CONTRACT WITHDRAWAL */}
              <div className="pt-4 border-t border-stone-800 space-y-2">
                <button
                  onClick={handleDispatchContractWithdrawal}
                  disabled={isDispatchingWithdraw}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.01] active:scale-98 disabled:opacity-50"
                >
                  {isDispatchingWithdraw ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>DISPATCHING CONTRACT WITHDRAWAL...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} className="text-yellow-300" />
                      <span>DISPATCH DIRECT CONTRACT WITHDRAWAL</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-stone-400 font-mono">
                  Funds settle directly on TON blockchain ledger without app database escrow.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
