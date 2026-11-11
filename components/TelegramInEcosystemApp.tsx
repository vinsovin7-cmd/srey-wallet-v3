import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  CheckCircle2,
  Lock,
  Phone,
  Video,
  Info,
  ExternalLink,
  ChevronLeft,
  X,
  Volume2,
  Sparkles,
  Download,
  Copy,
  Wallet,
  Coins,
  QrCode,
  Maximize2,
  Minimize2,
  RefreshCw,
  Radio,
  LogOut,
  Mail,
  Music,
  Disc,
  ArrowRight
} from "lucide-react";
import { TelegramMusicHubSuite } from "./TelegramMusicHubSuite";

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  isVerified?: boolean;
  isBot?: boolean;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  pinned?: boolean;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "other";
  senderName?: string;
  text: string;
  timestamp: string;
  isMedia?: boolean;
  mediaUrl?: string;
  reactions?: string[];
}

interface TelegramInEcosystemAppProps {
  onOpenPhoneLogin?: () => void;
  onOpenApkHub?: () => void;
  onOpenTonWallet?: () => void;
  initialChat?: string;
  onNavigateHome?: () => void;
  onNavigateCinema?: () => void;
  onNavigateChat?: () => void;
}

export const TelegramInEcosystemApp: React.FC<TelegramInEcosystemAppProps> = ({
  onOpenPhoneLogin,
  onOpenApkHub,
  onOpenTonWallet,
  initialChat = "wallet",
  onNavigateHome,
  onNavigateCinema,
  onNavigateChat
}) => {
  // Session / Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("telegram_active_session") === "true";
  });
  const [sessionUser, setSessionUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("telegram_session_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Phone Sign-In State
  const [authCountryCode, setAuthCountryCode] = useState<string>("+1");
  const [authPhoneNumber, setAuthPhoneNumber] = useState<string>("");
  const [authReceiveMethod, setAuthReceiveMethod] = useState<"mobile_app" | "email">("email");
  const [authStep, setAuthStep] = useState<"phone" | "code">("phone");
  const [authVerificationCode, setAuthVerificationCode] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dispatchedCodeNotice, setDispatchedCodeNotice] = useState<string | null>(null);

  // App Navigation & Active Views
  const [viewMode, setViewMode] = useState<"messenger" | "music_hub" | "qr_sync">("messenger");
  const [activeChatId, setActiveChatId] = useState<string>(initialChat);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const tonAddress = "UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Contacts list
  const contacts: ChatContact[] = [
    {
      id: "mechat",
      name: "MeChatBot (Dating & Matchmaking)",
      avatar: "💖",
      avatarBg: "bg-gradient-to-tr from-pink-600 to-purple-600",
      isVerified: true,
      isBot: true,
      lastMessage: "💕 20s Fast Match: 14,280 active users in Isolated Love Suites!",
      time: "Live",
      unreadCount: 2,
      pinned: true
    },
    {
      id: "gmail_bot",
      name: "Gmail Bot (@GmailBot)",
      avatar: "✉️",
      avatarBg: "bg-rose-600",
      isVerified: true,
      isBot: true,
      lastMessage: "Your Telegram code is: 28636. Use it to access your account.",
      time: "10:32",
      unreadCount: 1,
      pinned: true
    },
    {
      id: "wallet",
      name: "Wallet",
      avatar: "💎",
      avatarBg: "bg-blue-600",
      isVerified: true,
      isBot: true,
      lastMessage: "Deposit Confirmed! Received 500.00 USDT on TON",
      time: "Just now",
      unreadCount: 1,
      pinned: true
    },
    {
      id: "notifications",
      name: "Telegram Notifications",
      avatar: "✈️",
      avatarBg: "bg-sky-600",
      isVerified: true,
      lastMessage: "Login code: 84920. Do not give this code to anyone...",
      time: "10:30",
      unreadCount: 1,
      pinned: true
    },
    {
      id: "cinema",
      name: "Sreymara Cinema Bot (@Sreyquantumbot)",
      avatar: "🎬",
      avatarBg: "bg-amber-600",
      isVerified: true,
      isBot: true,
      lastMessage: "WELCOME TO SREYMARA CINEMA! 🎬 Choose HOME, CINEMA, or CHAT.",
      time: "Live",
      unreadCount: 1,
      pinned: true
    },
    {
      id: "saved",
      name: "Saved Messages",
      avatar: "📁",
      avatarBg: "bg-stone-700",
      lastMessage: `Connected Address: ${tonAddress}`,
      time: "Yesterday"
    },
    {
      id: "news",
      name: "Telegram News",
      avatar: "📢",
      avatarBg: "bg-sky-700",
      isVerified: true,
      lastMessage: "Mini Apps 2.0: Fullscreen mode, device motion, and music stream integration.",
      time: "Sep 15"
    }
  ];

  // Dynamic message threads by chat ID
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    mechat: [
      {
        id: "mc-1",
        sender: "bot",
        senderName: "MeChatBot (@MeChatBot)",
        text: "💖 Welcome to @MeChatBot — The Official Ecosystem Dating & Matchmaking Engine!\n\n• 8 AI Matchmakers\n• 20-Second Auto Pairing Queue\n• Isolated Private Love Suites\n• Real-Time Admin Moderation Safeguards",
        timestamp: "Live"
      },
      {
        id: "mc-2",
        sender: "bot",
        senderName: "MeChatBot (@MeChatBot)",
        text: "✨ 14,280 verified profiles currently active. Tap below to launch your instant quiz or start pairing with compatible singles in your region!",
        timestamp: "Live"
      }
    ],
    gmail_bot: [
      {
        id: "gb-1",
        sender: "bot",
        senderName: "Gmail Bot (@GmailBot)",
        text: "Official Telegram Gmail Bot active for kansasnelly@gmail.com.\n\nAll security verification codes and critical ecosystem emails are synchronized in real time.",
        timestamp: "10:30"
      },
      {
        id: "gb-2",
        sender: "bot",
        senderName: "Gmail Bot (@GmailBot)",
        text: "Your code is: 28636. Use it to access your account inside the ecosystem. If you didn't request this code, your account security is intact.",
        timestamp: "10:32"
      }
    ],
    wallet: [
      {
        id: "w-1",
        sender: "bot",
        senderName: "Wallet (@wallet)",
        text: "💎 Official TON Ecosystem Treasury Connected!\n\nMaster Liquid Wallet: UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ\nJettons: 1,345.50 TON ($6,727.50)\nUSDT Balance: $14,890.00\nStatus: 100% On-Chain Confirmed",
        timestamp: "09:15"
      },
      {
        id: "w-2",
        sender: "bot",
        senderName: "Wallet (@wallet)",
        text: "⚡ Instant Withdrawals enabled for all verified Telegram users. Tap below to initiate transfer to Tonkeeper, MyTonWallet, or OKX.",
        timestamp: "Just now"
      }
    ],
    notifications: [
      {
        id: "n-1",
        sender: "bot",
        senderName: "Telegram",
        text: "Login code: 84920. Do not give this code to anyone, even if they say they are from Telegram!\n\nThis code can be used to log in to your Telegram account. We never ask it for anything else.",
        timestamp: "10:30"
      }
    ],
    cinema: [
      {
        id: "c-0",
        sender: "bot",
        senderName: "Sreymara Cinema Bot (@Sreyquantumbot)",
        text: "WELCOME TO SREYMARA CINEMA! 🎬\n\nI'M HERE TO HELP YOU NAVIGATE THE APP. CHOOSE AN OPTION BELOW, OR TYPE A WORD LIKE \"HOME\", \"CINEMA\" OR \"CHAT\".",
        timestamp: "Live"
      }
    ],
    saved: [
      {
        id: "s-1",
        sender: "user",
        text: `My TON Ecosystem Address:\n${tonAddress}`,
        timestamp: "Yesterday"
      }
    ],
    news: [
      {
        id: "news-1",
        sender: "bot",
        senderName: "Telegram News",
        text: "🎉 Telegram Mini Apps 2.0 has arrived! Experience fullscreen mini apps, custom home screen icons, motion sensors, and ecosystem multimedia synchronization.",
        timestamp: "Sep 15"
      }
    ]
  });

  const activeContact = contacts.find(c => c.id === activeChatId) || contacts[0];
  const activeMessages = chatMessages[activeChatId] || [];

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Request Official Phone Code
  const handleSendPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPhoneNumber.trim()) {
      setAuthError("Please enter your mobile phone number.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    setDispatchedCodeNotice(null);

    try {
      const fullPhone = `${authCountryCode} ${authPhoneNumber}`.trim();
      const res = await fetch("/api/telegram/official-auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: authPhoneNumber.trim(),
          countryCode: authCountryCode,
          receiveMethod: authReceiveMethod,
          email: "kansasnelly@gmail.com"
        })
      });

      const data = await res.json();
      if (data.success) {
        setAuthStep("code");
        if (data.code) {
          setAuthVerificationCode(data.code);
          setDispatchedCodeNotice(
            authReceiveMethod === "email"
              ? `Verification code (${data.code}) sent to kansasnelly@gmail.com & Gmail Bot! Code auto-filled below.`
              : `Verification code (${data.code}) sent to your mobile Telegram app on ${fullPhone}!`
          );
        } else {
          setDispatchedCodeNotice(`Verification code dispatched to ${fullPhone}! Please check your notifications.`);
        }
      } else {
        setAuthError(data.error || "Failed to dispatch verification code.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Network connection issue.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Verify Phone Code & Log In
  const handleVerifyPhoneCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authVerificationCode.trim()) {
      setAuthError("Please enter the 5-digit verification code.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const fullPhone = `${authCountryCode} ${authPhoneNumber}`.trim();
      const res = await fetch("/api/telegram/official-auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: fullPhone,
          code: authVerificationCode.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        const user = data.user || {
          first_name: "Kansas Nelly",
          username: "kansasnelly",
          phone: fullPhone
        };
        setIsAuthenticated(true);
        setSessionUser(user);
        localStorage.setItem("telegram_active_session", "true");
        localStorage.setItem("telegram_session_user", JSON.stringify(user));
        setAuthStep("phone");
        setAuthVerificationCode("");
        setDispatchedCodeNotice(null);
      } else {
        setAuthError(data.error || "Invalid verification code.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Verification connection issue.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Fast Demo Login
  const handleQuickDemoLogin = () => {
    const demoUser = {
      first_name: "Kansas Nelly",
      username: "kansasnelly",
      phone: "+1 310-849-2091"
    };
    setIsAuthenticated(true);
    setSessionUser(demoUser);
    localStorage.setItem("telegram_active_session", "true");
    localStorage.setItem("telegram_session_user", JSON.stringify(demoUser));
  };

  // Log Out / Change Number
  const handleLogOut = async () => {
    setIsAuthenticated(false);
    setSessionUser(null);
    localStorage.removeItem("telegram_active_session");
    localStorage.removeItem("telegram_session_user");
    setAuthPhoneNumber("");
    setAuthVerificationCode("");
    setAuthStep("phone");
    try {
      await fetch("/api/telegram/official-auth/logout", { method: "POST" });
    } catch (e) {}
  };

  // Send message in active chat
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputMessage.trim(),
      timestamp: "Just now"
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));

    setInputMessage("");

    // Simulated Bot Responses
    if (activeChatId === "mechat") {
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: "bot",
          senderName: "MeChatBot (@MeChatBot)",
          text: "💌 Query received! Your matchmaking preferences have been updated. 3 new profile matches found in your location!",
          timestamp: "Just now"
        };
        setChatMessages(prev => ({
          ...prev,
          mechat: [...(prev.mechat || []), botReply]
        }));
      }, 700);
    } else if (activeChatId === "gmail_bot") {
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: "bot",
          senderName: "Gmail Bot (@GmailBot)",
          text: "📨 Gmail sync status: Active & synchronized with kansasnelly@gmail.com. All incoming Telegram login tokens are monitored.",
          timestamp: "Just now"
        };
        setChatMessages(prev => ({
          ...prev,
          gmail_bot: [...(prev.gmail_bot || []), botReply]
        }));
      }, 700);
    } else if (activeChatId === "cinema") {
      const lower = inputMessage.trim().toLowerCase();
      setTimeout(() => {
        let replyText = "";
        if (lower.includes("home") || lower === "home") {
          replyText = `🏠 EXECUTIVE ECOSYSTEM — HOME SUITE 👑\n\nWelcome back! You are now in the Executive Ecosystem Home view.\n\n• Direct VIP Magnet: Ready & Verified\n• TON Treasury Pool: +$0.0400 USDT\n• Automated Node Status: 100% Active\n\n🔗 Direct VIP Magnet Link: ${window.location.origin}/?ref=executive_vip_meeting`;
          if (onNavigateHome) onNavigateHome();
          else window.dispatchEvent(new CustomEvent('ecosystem:navigate', { detail: { target: 'home' } }));
        } else if (lower.includes("cinema") || lower.includes("movie") || lower === "cinema") {
          replyText = `🎬 SREYMARA CINEMA & MOVIE STREAMING 🍿\n\nWelcome to Sreymara Cinema!\n• 25+ Continuous HD Cinema Channels & Movies\n• Featured Film: SitonicSA 'Fight for Me' Soundstage\n• Library: Hollywood, Nollywood, Afrobeats & Sci-Fi\n• Zero buffering • Rewarded streaming (+0.02 USDT per view)`;
          if (onNavigateCinema) onNavigateCinema();
          else window.dispatchEvent(new CustomEvent('ecosystem:navigate', { detail: { target: 'cinema' } }));
        } else if (lower.includes("chat") || lower === "chat") {
          replyText = `💬 COMMUNITY DISCUSSION & VIP MATCH SUITE 💕\n\nWelcome to Community Discussion!\n• Real-Time Discussions: Verified community members\n• Love Suite Room #108: 20-Second Fast-Match Active\n• Safe, respectful & verified atmosphere`;
          if (onNavigateChat) onNavigateChat();
          else window.dispatchEvent(new CustomEvent('ecosystem:navigate', { detail: { target: 'chat' } }));
        } else {
          replyText = `WELCOME TO SREYMARA CINEMA! 🎬\n\nI'M HERE TO HELP YOU NAVIGATE THE APP. CHOOSE AN OPTION BELOW, OR TYPE A WORD LIKE "HOME", "CINEMA" OR "CHAT".`;
        }

        const botReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: "bot",
          senderName: "Sreymara Cinema Bot (@Sreyquantumbot)",
          text: replyText,
          timestamp: "Just now"
        };
        setChatMessages(prev => ({
          ...prev,
          cinema: [...(prev.cinema || []), botReply]
        }));
      }, 500);
    }
  };

  const handleQuickCinemaAction = (type: "home" | "cinema" | "chat" | "tma" | "vip") => {
    if (type === "tma") {
      window.open("/tma", "_blank");
      return;
    }
    if (type === "vip") {
      window.location.href = "/?ref=executive_vip_meeting";
      return;
    }
    const label = type.toUpperCase();
    const userMsg: ChatMessage = {
      id: `quick-${Date.now()}`,
      sender: "user",
      text: label,
      timestamp: "Just now"
    };
    setChatMessages(prev => ({
      ...prev,
      cinema: [...(prev.cinema || []), userMsg]
    }));

    setTimeout(() => {
      let replyText = "";
      if (type === "home") {
        replyText = `🏠 EXECUTIVE ECOSYSTEM — HOME SUITE 👑\n\nWelcome back! You are now in the Executive Ecosystem Home view.\n\n• Direct VIP Magnet: Ready & Verified\n• TON Treasury Pool: +$0.0400 USDT\n• Automated Node Status: 100% Active\n\n🔗 Direct VIP Magnet Link: ${window.location.origin}/?ref=executive_vip_meeting`;
        if (onNavigateHome) onNavigateHome();
        else window.dispatchEvent(new CustomEvent('ecosystem:navigate', { detail: { target: 'home' } }));
      } else if (type === "cinema") {
        replyText = `🎬 SREYMARA CINEMA & MOVIE STREAMING 🍿\n\nWelcome to Sreymara Cinema!\n• 25+ Continuous HD Cinema Channels & Movies\n• Featured Film: SitonicSA 'Fight for Me' Soundstage\n• Library: Hollywood, Nollywood, Afrobeats & Sci-Fi\n• Zero buffering • Rewarded streaming (+0.02 USDT per view)`;
        if (onNavigateCinema) onNavigateCinema();
        else window.dispatchEvent(new CustomEvent('ecosystem:navigate', { detail: { target: 'cinema' } }));
      } else if (type === "chat") {
        replyText = `💬 COMMUNITY DISCUSSION & VIP MATCH SUITE 💕\n\nWelcome to Community Discussion!\n• Real-Time Discussions: Verified community members\n• Love Suite Room #108: 20-Second Fast-Match Active\n• Safe, respectful & verified atmosphere`;
        if (onNavigateChat) onNavigateChat();
        else window.dispatchEvent(new CustomEvent('ecosystem:navigate', { detail: { target: 'chat' } }));
      }

      const botReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: "bot",
        senderName: "Sreymara Cinema Bot (@Sreyquantumbot)",
        text: replyText,
        timestamp: "Just now"
      };
      setChatMessages(prev => ({
        ...prev,
        cinema: [...(prev.cinema || []), botReply]
      }));
    }, 400);
  };

  return (
    <div className={`w-full ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[640px] rounded-2xl"} bg-[#0e1621] text-white flex flex-col overflow-hidden border border-stone-800 shadow-2xl font-sans animate-fade-in`}>
      {/* Top Telegram Header Bar */}
      <div className="h-14 bg-[#17212b] border-b border-stone-800/80 px-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
            ✈️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                Telegram Web & Ecosystem Bridge
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded text-[9px] font-mono border border-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {isAuthenticated ? "AUTHENTICATED" : "OFFICIAL LOGIN"}
              </span>
            </div>
            <div className="text-[10px] text-stone-400 flex items-center gap-2">
              <span>{sessionUser?.phone || "Official Direct Client"}</span>
              <span className="text-stone-600">•</span>
              <span className="text-emerald-400 font-mono">Status: Online</span>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher: Messenger vs 40 Music Channels */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-stone-800 text-[11px] font-bold">
            <button
              onClick={() => setViewMode("messenger")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "messenger" ? "bg-sky-600 text-white shadow" : "text-stone-400 hover:text-white"
              }`}
            >
              <span>Chats</span>
            </button>
            <button
              onClick={() => setViewMode("music_hub")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "music_hub" ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow" : "text-stone-400 hover:text-white"
              }`}
            >
              <Music size={12} className="text-sky-300" />
              <span>Music Hub (40 Channels)</span>
            </button>
          </div>

          {/* QR Sync Trigger */}
          <button
            onClick={() => setViewMode(viewMode === "qr_sync" ? "messenger" : "qr_sync")}
            className="p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs transition-all border border-stone-700 cursor-pointer flex items-center gap-1"
            title="Scan Telegram QR Code to Link Mobile Device"
          >
            <QrCode size={14} className="text-sky-400" />
            <span className="text-[11px] hidden sm:inline">QR Sync</span>
          </button>

          {/* Log Out / Change Number */}
          {isAuthenticated ? (
            <button
              onClick={handleLogOut}
              className="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-xl text-[11px] font-bold transition-all border border-red-800 cursor-pointer flex items-center gap-1"
              title="Log out or switch phone number"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Switch Number</span>
            </button>
          ) : (
            <button
              onClick={handleQuickDemoLogin}
              className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl text-[11px] font-bold transition-all border border-emerald-800 cursor-pointer"
              title="Fast access with Kansas Nelly session"
            >
              Quick In
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs transition-all border border-stone-700 cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen App"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* VIEW: MUSIC HUB & 40 CHANNELS */}
      {viewMode === "music_hub" && (
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#0e1621]">
          <TelegramMusicHubSuite onClose={() => setViewMode("messenger")} />
        </div>
      )}

      {/* VIEW: QR CODE SYNC MODAL / VIEW */}
      {viewMode === "qr_sync" && (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-[#0e1621] space-y-4">
          <div className="p-6 bg-[#17212b] rounded-3xl border border-stone-700 text-center max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Log in to Telegram by QR Code</h3>
            <p className="text-xs text-stone-400">
              Open Telegram on your phone, go to <strong>Settings &gt; Devices &gt; Link Desktop Device</strong>, and point your phone at this screen.
            </p>
            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=tg://login?token=Ecosystem_Telegram_Direct_${Date.now()}`}
                alt="Telegram QR Login"
                className="w-48 h-48 object-contain"
              />
            </div>
            <div className="text-[11px] font-mono text-stone-500">
              Direct Bridge Token • Auto-refreshes every 30s
            </div>
            <button
              onClick={() => setViewMode("messenger")}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Back to Messenger
            </button>
          </div>
        </div>
      )}

      {/* VIEW: MESSENGER (SIGN-IN STATE VS ACTIVE CHATS) */}
      {viewMode === "messenger" && (
        <>
          {!isAuthenticated ? (
            /* REAL TELEGRAM PHONE NUMBER LOGIN SCREEN (NO FAKE NUMBERS!) */
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-gradient-to-b from-[#0e1621] via-[#111c29] to-[#0a1017]">
              <div className="max-w-md w-full bg-[#17212b] p-6 sm:p-8 rounded-3xl border border-stone-700/80 shadow-2xl space-y-6 animate-fade-in">
                {/* Telegram Logo & Title */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl">
                    ✈️
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Sign in to Telegram
                  </h3>
                  <p className="text-xs text-stone-400">
                    Please confirm your country code and enter your phone number to receive an official verification code.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl">
                    {authError}
                  </div>
                )}

                {dispatchedCodeNotice && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                    <span>{dispatchedCodeNotice}</span>
                  </div>
                )}

                {authStep === "phone" ? (
                  /* STEP 1: PHONE NUMBER INPUT */
                  <form onSubmit={handleSendPhoneCode} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-stone-300 block mb-1.5">
                        Your Mobile Phone Number:
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={authCountryCode}
                          onChange={(e) => setAuthCountryCode(e.target.value)}
                          className="px-3 py-2.5 bg-black/60 border border-stone-700 rounded-xl text-xs text-stone-200 font-mono focus:outline-none focus:border-sky-500 cursor-pointer"
                        >
                          <option value="+1">🇺🇸 / 🇨🇦 +1 (USA / Canada)</option>
                          <option value="+234">🇳🇬 +234 (Nigeria)</option>
                          <option value="+44">🇬🇧 +44 (UK)</option>
                          <option value="+855">🇰🇭 +855 (Cambodia)</option>
                          <option value="+233">🇬🇭 +233 (Ghana)</option>
                          <option value="+254">🇰🇪 +254 (Kenya)</option>
                          <option value="+27">🇿🇦 +27 (South Africa)</option>
                          <option value="+91">🇮🇳 +91 (India)</option>
                          <option value="+49">🇩🇪 +49 (Germany)</option>
                          <option value="+33">🇫🇷 +33 (France)</option>
                          <option value="+65">🇸🇬 +65 (Singapore)</option>
                          <option value="+971">🇦🇪 +971 (UAE)</option>
                        </select>

                        <input
                          type="tel"
                          value={authPhoneNumber}
                          onChange={(e) => setAuthPhoneNumber(e.target.value)}
                          placeholder="Enter your phone number"
                          className="flex-1 px-4 py-2.5 bg-black/60 border border-stone-700 rounded-xl text-xs text-white font-mono placeholder:text-stone-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    {/* Delivery Method Selector (Telegram App vs Gmail) */}
                    <div className="p-3 bg-black/40 rounded-2xl border border-stone-800 space-y-2">
                      <div className="text-xs font-bold text-stone-300">
                        Where do you want to receive the verification code?
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAuthReceiveMethod("email")}
                          className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center gap-2 ${
                            authReceiveMethod === "email"
                              ? "bg-sky-950/80 border-sky-500 text-white font-bold shadow"
                              : "bg-black/40 border-stone-800 text-stone-400 hover:text-white"
                          }`}
                        >
                          <Mail size={14} className="text-rose-400" />
                          <div className="min-w-0">
                            <div className="truncate">Gmail Inbox</div>
                            <div className="text-[10px] text-stone-400 truncate">kansasnelly@gmail.com</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAuthReceiveMethod("mobile_app")}
                          className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center gap-2 ${
                            authReceiveMethod === "mobile_app"
                              ? "bg-sky-950/80 border-sky-500 text-white font-bold shadow"
                              : "bg-black/40 border-stone-800 text-stone-400 hover:text-white"
                          }`}
                        >
                          <Phone size={14} className="text-sky-400" />
                          <div className="min-w-0">
                            <div className="truncate">Telegram App</div>
                            <div className="text-[10px] text-stone-400 truncate">Mobile / SMS notification</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading || !authPhoneNumber.trim()}
                      className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {authLoading ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Sending code...</span>
                        </>
                      ) : (
                        <>
                          <span>Next</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* STEP 2: CODE VERIFICATION INPUT */
                  <form onSubmit={handleVerifyPhoneCode} className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-stone-300">
                          Enter 5-Digit Verification Code:
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthStep("phone")}
                          className="text-[11px] text-sky-400 hover:underline cursor-pointer"
                        >
                          Change Number
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={authVerificationCode}
                        onChange={(e) => setAuthVerificationCode(e.target.value)}
                        placeholder="e.g. 28636"
                        className="w-full text-center tracking-[0.4em] px-4 py-3 bg-black/60 border border-sky-500 rounded-xl text-lg text-white font-mono placeholder:text-stone-700 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={authLoading || !authVerificationCode.trim()}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {authLoading ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Log In & Connect</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="text-xs text-stone-500 hover:text-stone-300 underline cursor-pointer"
                  >
                    Quick demo login as Kansas Nelly (+1 310-849-2091)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED CHAT INTERFACE */
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Chats List */}
              <div className="w-80 sm:w-88 border-r border-stone-800/80 bg-[#17212b] flex flex-col shrink-0">
                {/* Search Input */}
                <div className="p-3 border-b border-stone-800/60">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search chats, bots, channels..."
                      className="w-full bg-[#0e1621] text-xs text-white pl-9 pr-4 py-2 rounded-xl border border-stone-700/60 focus:outline-none focus:border-sky-500 placeholder:text-stone-500"
                    />
                  </div>
                </div>

                {/* Chats Scroll Area */}
                <div className="flex-1 overflow-y-auto divide-y divide-stone-800/30">
                  {contacts
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((contact) => {
                      const isActive = contact.id === activeChatId;
                      return (
                        <div
                          key={contact.id}
                          onClick={() => setActiveChatId(contact.id)}
                          className={`p-3 flex items-center gap-3 cursor-pointer transition-all ${
                            isActive
                              ? "bg-[#2b5278] text-white"
                              : "hover:bg-[#202b36] text-stone-300"
                          }`}
                        >
                          {/* Avatar */}
                          <div className={`w-11 h-11 rounded-full ${contact.avatarBg} flex items-center justify-center text-lg font-bold shrink-0 shadow`}>
                            {contact.avatar}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-xs font-bold truncate">
                                  {contact.name}
                                </span>
                                {contact.isVerified && (
                                  <CheckCircle2 size={12} className={isActive ? "text-sky-200" : "text-sky-400"} />
                                )}
                              </div>
                              <span className={`text-[10px] font-mono shrink-0 ${isActive ? "text-sky-200" : "text-stone-500"}`}>
                                {contact.time}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className={`text-[11px] truncate ${isActive ? "text-stone-200" : "text-stone-400"}`}>
                                {contact.lastMessage}
                              </p>
                              {contact.unreadCount && !isActive && (
                                <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 ml-1">
                                  {contact.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Bottom Quick Hub */}
                <div className="p-3 bg-[#111822] border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                  <button
                    onClick={() => setViewMode("music_hub")}
                    className="hover:text-sky-400 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Music size={13} className="text-sky-400" />
                    <span>Music Hub</span>
                  </button>
                  <button
                    onClick={handleLogOut}
                    className="hover:text-red-400 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Change Account</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Chat History & Interactive Composer */}
              <div className="flex-1 bg-[#0e1621] flex flex-col min-w-0">
                {/* Active Chat Header */}
                <div className="h-14 bg-[#17212b] border-b border-stone-800/80 px-4 flex items-center justify-between select-none shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full ${activeContact.avatarBg} flex items-center justify-center text-base shrink-0`}>
                      {activeContact.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white truncate">
                          {activeContact.name}
                        </span>
                        {activeContact.isVerified && (
                          <CheckCircle2 size={13} className="text-sky-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-sky-400 font-mono">
                        {activeContact.isBot ? "bot • official service" : "verified chat • online"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-400">
                    {activeContact.id === "wallet" && onOpenTonWallet && (
                      <button
                        onClick={onOpenTonWallet}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Wallet size={12} />
                        <span>Withdraw TON</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeMessages.map((msg) => {
                    const isMe = msg.sender === "user";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                            isMe
                              ? "bg-[#2b5278] text-white rounded-br-xs"
                              : "bg-[#182533] text-stone-200 rounded-bl-xs border border-stone-800/60"
                          }`}
                        >
                          {!isMe && msg.senderName && (
                            <div className="text-[10px] font-bold text-sky-400 mb-1">
                              {msg.senderName}
                            </div>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                          </p>
                          <div className={`text-[9px] font-mono mt-1 flex items-center justify-end gap-1 ${
                            isMe ? "text-sky-200" : "text-stone-500"
                          }`}>
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck size={12} className="text-sky-300" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Interactive Quick Navigation Keyboard for Cinema Bot */}
                {activeChatId === "cinema" && (
                  <div className="p-2.5 bg-[#141d26] border-t border-stone-800/80 shrink-0">
                    <div className="text-[10px] text-amber-400 font-mono font-bold mb-1.5 flex items-center justify-between">
                      <span>BOT KEYBOARD NAVIGATION:</span>
                      <span className="text-[9px] text-stone-400 font-normal">Click any button below</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                      <button
                        onClick={() => handleQuickCinemaAction("home")}
                        className="py-2 px-2 bg-[#202b36] hover:bg-[#2b5278] text-white text-xs font-bold rounded-xl transition border border-stone-700/60 flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow"
                      >
                        <span>🏠</span>
                        <span>HOME</span>
                      </button>
                      <button
                        onClick={() => handleQuickCinemaAction("cinema")}
                        className="py-2 px-2 bg-[#202b36] hover:bg-[#2b5278] text-white text-xs font-bold rounded-xl transition border border-stone-700/60 flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow"
                      >
                        <span>🎬</span>
                        <span>CINEMA</span>
                      </button>
                      <button
                        onClick={() => handleQuickCinemaAction("chat")}
                        className="py-2 px-2 bg-[#202b36] hover:bg-[#2b5278] text-white text-xs font-bold rounded-xl transition border border-stone-700/60 flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow"
                      >
                        <span>💬</span>
                        <span>CHAT</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleQuickCinemaAction("tma")}
                        className="py-1.5 px-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-[11px] font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow"
                      >
                        <span>🚀</span>
                        <span>LAUNCH MINI APP</span>
                      </button>
                      <button
                        onClick={() => handleQuickCinemaAction("vip")}
                        className="py-1.5 px-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-[11px] font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow"
                      >
                        <span>👑</span>
                        <span>DIRECT VIP MAGNET</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Input Composer */}
                <div className="p-3 bg-[#17212b] border-t border-stone-800/80 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Message ${activeContact.name}...`}
                    className="flex-1 bg-[#0e1621] text-xs text-white px-4 py-2.5 rounded-2xl border border-stone-700/60 focus:outline-none focus:border-sky-500 placeholder:text-stone-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-2xl transition cursor-pointer shadow"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
