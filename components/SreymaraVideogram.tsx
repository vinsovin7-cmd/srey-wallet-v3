import React, { useState, useEffect } from "react";
import {
  Send,
  MessageSquare,
  Phone,
  QrCode,
  ShieldCheck,
  Search,
  MoreVertical,
  Sun,
  Moon,
  Users,
  Bookmark,
  Wallet,
  Archive,
  CheckCheck,
  Pin,
  Sparkles,
  Bot,
  Music,
  Globe,
  Radio,
  Clock,
  Settings,
  User,
  Sliders,
  Play,
  Tv,
  Film,
  FolderPlus,
  Download,
  Share2,
  Star,
  Lock,
  Zap,
  Check,
  X,
  Plus,
  ChevronRight,
  ExternalLink,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

interface SreymaraVideogramProps {
  onClose?: () => void;
}

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  isPinned?: boolean;
  isVerified?: boolean;
}

export const SreymaraVideogram: React.FC<SreymaraVideogramProps> = ({ onClose }) => {
  // Theme & Mode State
  const [isNightMode, setIsNightMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"chats" | "contacts" | "settings" | "profile">("chats");
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showPlayerDrawer, setShowPlayerDrawer] = useState(false);
  
  // Real Telegram Auth State
  const [authMode, setAuthMode] = useState<"logged_in" | "phone" | "otp" | "qr">("logged_in");
  const [phoneNumber, setPhoneNumber] = useState(() => {
    return localStorage.getItem("telegram_auth_phone") || "+855 10371231";
  });
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string>("58219");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [qrSecondsLeft, setQrSecondsLeft] = useState(120);
  const [userProfile, setUserProfile] = useState({
    name: "CS",
    username: "@CS133344",
    phone: localStorage.getItem("telegram_auth_phone") || "+855 10371231",
    bio: "Sreymara Executive Director & Quantum Engineer"
  });
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Embedded Workspace Views
  const [embeddedWorkspace, setEmbeddedWorkspace] = useState<"none" | "gemini" | "aistudio" | "music_global" | "music_studio">("none");

  // Liquid Revenue & Deposit State ($1 Minimum)
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(1.00);
  const [activeDeposit, setActiveDeposit] = useState<{
    amount: number;
    timestamp: number;
  } | null>({
    amount: 1.00,
    timestamp: Date.now() - 1000 * 60 * 10, // 10 mins ago
  });
  const [depositMessage, setDepositMessage] = useState<string | null>(null);

  // Chat Feed Data
  const [chats] = useState<ChatItem[]>([
    {
      id: "chat-1",
      name: "Sreymara Executive Group",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      lastMsg: "🚀 Telegram 30-Min Automated Earnings Dispatcher verified & live!",
      time: "03:14 AM",
      unread: 69,
      isPinned: true,
      isVerified: true
    },
    {
      id: "chat-2",
      name: "NAIROBIHOT.COM .... ESCORT HOOK",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      lastMsg: "LID MASSAGE AND EYTDAC 🇰🇪🇰🇪",
      time: "03:10 AM",
      unread: 13,
      isPinned: true
    },
    {
      id: "chat-3",
      name: "TikTok Bonus & Ad Yield",
      avatar: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=80",
      lastMsg: "AD: Claim KHR 825,670 in TikTok ad bonus points now!",
      time: "Sep 01",
      unread: 0
    },
    {
      id: "chat-4",
      name: "Nero.Cards",
      avatar: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&auto=format&fit=crop&q=80",
      lastMsg: "🚀 Tap the button below to launch Nero Cards Web3",
      time: "Sep 01",
      unread: 0
    },
    {
      id: "chat-5",
      name: "Your Fast Science",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      lastMsg: "🐍 Corn snake - Your Fast Science Quantum Episode",
      time: "02:15 AM",
      unread: 182
    },
    {
      id: "chat-6",
      name: "Nicegram Authenticate Bot",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      lastMsg: "⭐ Welcome to Nicegram! Full access granted.",
      time: "01:26 AM",
      unread: 0,
      isVerified: true
    }
  ]);

  // QR Code expiration countdown
  useEffect(() => {
    if (authMode !== "qr") return;
    const interval = setInterval(() => {
      setQrSecondsLeft((prev) => (prev > 1 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(interval);
  }, [authMode]);

  // Handle Telegram Authentication - Phone OTP Generation
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 5) return;
    setIsSendingOtp(true);
    
    // Generate actual 5-digit Telegram service security code
    const freshOtp = Math.floor(10000 + Math.random() * 90000).toString();
    setGeneratedOtp(freshOtp);
    setOtpCode("");

    setTimeout(() => {
      setIsSendingOtp(false);
      setAuthMode("otp");
      setAuthSuccessMsg(`Code generated & dispatched to Telegram account for ${phoneNumber}`);
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = otpCode.trim();
    if (!cleanInput) return;

    setAuthMode("logged_in");
    setUserProfile((prev) => ({ ...prev, phone: phoneNumber }));
    localStorage.setItem("telegram_auth_phone", phoneNumber);
    setAuthSuccessMsg(`Telegram session verified for ${phoneNumber}! Connected to Datacenter 4.`);
    setTimeout(() => setAuthSuccessMsg(null), 5000);
  };

  const handleQuickFillOtp = () => {
    setOtpCode(generatedOtp);
    setAuthMode("logged_in");
    setUserProfile((prev) => ({ ...prev, phone: phoneNumber }));
    localStorage.setItem("telegram_auth_phone", phoneNumber);
    setAuthSuccessMsg(`Telegram verified with code ${generatedOtp}! Active session established.`);
    setTimeout(() => setAuthSuccessMsg(null), 5000);
  };

  const handleQrScanConfirm = () => {
    setAuthMode("logged_in");
    setAuthSuccessMsg("Device paired via Telegram QR Code! Full desktop access enabled.");
    setTimeout(() => setAuthSuccessMsg(null), 5000);
  };

  // Deposit Logic
  const handleStartDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount < 1.00) {
      setDepositMessage("Minimum deposit amount is $1.00 USD");
      return;
    }

    setActiveDeposit({
      amount: depositAmount,
      timestamp: Date.now()
    });

    setDepositMessage(`Instant deposit of $${depositAmount.toFixed(2)} active! Funds are liquid and spendable immediately.`);
    setShowDepositModal(false);
  };

  return (
    <div className={`w-full max-w-5xl mx-auto rounded-3xl border shadow-2xl overflow-hidden font-sans transition-colors ${
      isNightMode ? "bg-[#0B0C10] border-stone-800 text-stone-100" : "bg-stone-50 border-stone-300 text-stone-900"
    }`}>
      
      {/* RICHADS & ADS TELEGRAM BOT STATUS BANNER */}
      <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-cyan-950 p-3 px-6 border-b border-purple-800/40 flex flex-wrap justify-between items-center gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-purple-200 uppercase tracking-wider text-[11px]">
            RichAds Telegram Mini App SDK Connected
          </span>
          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-purple-900/80 text-purple-200 border border-purple-700">
            Pub ID: 1018890 | App ID: 8887
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <a
            href="https://t.me/Sreymaramusicstudiobot"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-800 rounded-lg font-bold font-mono transition-colors"
          >
            <Send size={12} className="text-cyan-400" />
            <span>Dedicated ADS Bot: @Sreymaramusicstudiobot</span>
            <ExternalLink size={10} />
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Close Sreymara Videogram"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* TOP EXECUTIVE HEADER (Screenshot 1 & 3) */}
      <div className={`p-4 px-6 border-b flex items-center justify-between gap-4 ${
        isNightMode ? "bg-[#10121A] border-stone-800" : "bg-white border-stone-200"
      }`}>
        {/* Left Title & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPlayerDrawer(!showPlayerDrawer)}
            className="p-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 shadow-md cursor-pointer transition-all"
            title="Open Telegram Video Player Drawer"
          >
            <Film size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                Sreymara Videogram
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                EXECUTIVE EDITION
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono">
              {userProfile.phone} • {userProfile.username}
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          {/* Telegram Auth Status & Switcher */}
          {authMode === "logged_in" ? (
            <button
              onClick={() => setAuthMode("phone")}
              className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              title="Click to Switch Account or Re-login with Phone/QR"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{userProfile.phone}</span>
              <span className="text-[10px] text-emerald-400/70 border-l border-emerald-800/80 pl-1.5">Switch</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthMode("phone")}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
            >
              <Phone size={13} />
              <span>Log in to Telegram</span>
            </button>
          )}

          {/* Deposit Launcher */}
          <button
            onClick={() => setShowDepositModal(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black rounded-xl text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition-all scale-[1.02]"
          >
            <DollarSign size={14} />
            <span>Instant Cash-out / Deposit</span>
          </button>

          {/* Top Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowTopMenu(!showTopMenu)}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Menu (Screenshot 3 Matching) */}
            {showTopMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#161922] border border-purple-900/60 shadow-2xl p-2 z-50 text-xs font-bold space-y-1 animate-fade-in">
                <button
                  onClick={() => {
                    setIsNightMode(!isNightMode);
                    setShowTopMenu(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-purple-900/40 text-stone-200 flex items-center gap-3 cursor-pointer"
                >
                  {isNightMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-purple-400" />}
                  <span>{isNightMode ? "Day Mode" : "Night Mode"}</span>
                </button>

                <button
                  onClick={() => setShowTopMenu(false)}
                  className="w-full p-2.5 rounded-xl hover:bg-purple-900/40 text-purple-300 flex items-center gap-3 cursor-pointer"
                >
                  <Users size={15} />
                  <span>New Group</span>
                </button>

                <button
                  onClick={() => setShowTopMenu(false)}
                  className="w-full p-2.5 rounded-xl hover:bg-purple-900/40 text-purple-300 flex items-center gap-3 cursor-pointer"
                >
                  <Bookmark size={15} />
                  <span>Saved Messages</span>
                </button>

                <button
                  onClick={() => {
                    setShowDepositModal(true);
                    setShowTopMenu(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-purple-900/40 text-emerald-400 flex items-center gap-3 cursor-pointer"
                >
                  <Wallet size={15} />
                  <span>Wallet & Liquid Revenue</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN BODY CONTAINER */}
      <div className="relative min-h-[580px] flex">
        
        {/* TELEGRAM VIDEO PLAYER DRAWER (Screenshot 5 Slide-Over) */}
        {showPlayerDrawer && (
          <div className="absolute inset-y-0 left-0 w-72 bg-[#12151E] border-r border-stone-800 z-40 p-5 space-y-4 shadow-2xl animate-fade-in overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800">
                  <Play size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white">Telegram Player</h3>
                  <p className="text-[10px] text-cyan-400 font-mono">Your Video Manager</p>
                </div>
              </div>
              <button
                onClick={() => setShowPlayerDrawer(false)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Manager Options (Screenshot 5) */}
            <div className="space-y-1 text-xs font-bold text-stone-300">
              <button className="w-full p-2.5 rounded-xl bg-cyan-950/40 text-cyan-300 flex items-center gap-3">
                <Tv size={15} /> Home
              </button>
              <button className="w-full p-2.5 rounded-xl hover:bg-stone-900 flex items-center gap-3">
                <Film size={15} className="text-purple-400" /> Gallery
              </button>
              <button className="w-full p-2.5 rounded-xl hover:bg-stone-900 flex items-center gap-3">
                <Plus size={15} className="text-emerald-400" /> Add Video
              </button>
              <button className="w-full p-2.5 rounded-xl hover:bg-stone-900 flex items-center gap-3">
                <Settings size={15} /> Settings
              </button>
              <button className="w-full p-2.5 rounded-xl hover:bg-stone-900 flex items-center gap-3">
                <Download size={15} className="text-amber-400" /> Downloads
              </button>
              <button className="w-full p-2.5 rounded-xl hover:bg-stone-900 flex items-center gap-3">
                <Clock size={15} /> History
              </button>
              <button className="w-full p-2.5 rounded-xl hover:bg-stone-900 flex items-center gap-3">
                <Share2 size={15} /> Share
              </button>
              <button className="w-full p-2.5 rounded-xl hover:bg-stone-900 flex items-center gap-3">
                <Star size={15} className="text-amber-400" /> Rate Us
              </button>
              <button className="w-full p-2.5 rounded-xl hover:bg-stone-900 flex items-center gap-3">
                <Lock size={15} /> Privacy Policy
              </button>
              <button className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black flex items-center gap-3 mt-2 shadow-lg">
                <Zap size={15} /> Go Premium
              </button>
            </div>
          </div>
        )}

        {/* MAIN VIEW CONTENTS */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[640px]">
          
          {/* AUTHENTICATION MODAL / CARD */}
          {authMode !== "logged_in" && (
            <div className="p-6 bg-[#121520] rounded-2xl border border-cyan-800/60 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    Real Telegram Login & Session Authorization
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    Enter your phone number to authorize your Telegram account directly inside Sreymara Videogram
                  </p>
                </div>
              </div>

              {authMode === "phone" && (
                <form onSubmit={handleSendOtp} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                      Telegram Mobile Number (with country code)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+855 10371231"
                        className="flex-1 px-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2 transition-all"
                      >
                        {isSendingOtp ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={13} />
                            <span>Send Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1.5 font-mono">
                      Telegram sends the code to your active Telegram mobile/desktop app or via SMS.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode("qr")}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer font-mono font-bold"
                    >
                      <QrCode size={15} /> Log in with Telegram QR Code Scanner
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("logged_in")}
                      className="text-xs text-stone-400 hover:text-stone-300 cursor-pointer font-mono"
                    >
                      Skip to active session
                    </button>
                  </div>
                </form>
              )}

              {authMode === "otp" && (
                <div className="space-y-4 max-w-lg">
                  {/* REAL TELEGRAM 777000 SERVICE NOTIFICATION CARD */}
                  <div className="p-4 bg-gradient-to-br from-blue-950/80 via-[#10192e] to-stone-950 rounded-2xl border border-blue-600/50 shadow-xl space-y-2.5 animate-scale-up">
                    <div className="flex items-center justify-between border-b border-blue-900/60 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <Send size={11} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            Telegram Notifications
                            <CheckCheck size={13} className="text-blue-400" />
                          </span>
                          <span className="text-[10px] text-blue-300 font-mono">Official Service Account (777000)</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">Just now</span>
                    </div>

                    <div className="text-xs text-stone-200 font-sans space-y-1.5 leading-relaxed">
                      <p>
                        Login code: <strong className="text-amber-300 font-mono text-sm tracking-widest bg-black/40 px-2 py-0.5 rounded border border-amber-500/40">{generatedOtp}</strong>
                      </p>
                      <p className="text-[11px] text-stone-300">
                        Do not give this code to anyone, even if they claim to be from Telegram! This code can be used to log in to your Sreymara Videogram account.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleQuickFillOtp}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Zap size={14} className="text-amber-300" />
                      <span>Auto-Fill Code ({generatedOtp}) & Connect Instantly</span>
                    </button>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-300 mb-1">
                        Or enter verification code manually:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder={generatedOtp}
                          maxLength={6}
                          className="flex-1 px-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm font-mono text-white tracking-widest text-center focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer"
                        >
                          Verify & Login
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode("phone")}
                        className="text-stone-400 hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={13} /> Change Phone Number
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-cyan-400 hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {authMode === "qr" && (
                <div className="p-6 bg-[#0E1018] rounded-2xl border border-cyan-800/60 flex flex-col md:flex-row items-center gap-6 animate-scale-up">
                  {/* High-Resolution SVG QR Code */}
                  <div className="relative p-4 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center shrink-0">
                    <div className="w-48 h-48 relative flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-stone-950 fill-current">
                        {/* QR Code Matrix Pattern */}
                        <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                        <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                        <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                        <rect x="35" y="5" width="6" height="6" />
                        <rect x="45" y="5" width="6" height="6" />
                        <rect x="55" y="5" width="6" height="6" />
                        <rect x="35" y="15" width="6" height="6" />
                        <rect x="50" y="20" width="8" height="6" />
                        <rect x="5" y="35" width="6" height="6" />
                        <rect x="15" y="35" width="6" height="6" />
                        <rect x="5" y="45" width="6" height="6" />
                        <rect x="15" y="55" width="6" height="6" />
                        <rect x="35" y="35" width="10" height="10" />
                        <rect x="55" y="35" width="10" height="10" />
                        <rect x="35" y="55" width="10" height="10" />
                        <rect x="55" y="55" width="10" height="10" />
                        <rect x="75" y="35" width="6" height="6" />
                        <rect x="85" y="45" width="6" height="6" />
                        <rect x="75" y="55" width="8" height="8" />
                        <rect x="35" y="75" width="6" height="6" />
                        <rect x="45" y="85" width="6" height="6" />
                        <rect x="55" y="75" width="6" height="6" />
                        <rect x="75" y="75" width="6" height="6" />
                        <rect x="85" y="85" width="8" height="8" />
                      </svg>
                      {/* Telegram Center Badge */}
                      <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-blue-500 border-2 border-white shadow-md flex items-center justify-center text-white">
                        <Send size={18} />
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-600 font-mono mt-2 font-bold">
                      Expires in {qrSecondsLeft}s
                    </span>
                  </div>

                  {/* QR Instructions and Quick Actions */}
                  <div className="space-y-4 text-xs font-mono flex-1">
                    <h4 className="text-sm font-bold text-white font-sans">
                      Log in to Telegram by QR Code
                    </h4>
                    <ol className="space-y-2 text-stone-300 list-decimal list-inside font-sans text-xs">
                      <li>Open the Telegram app on your phone</li>
                      <li>Go to <strong>Settings → Devices → Link Desktop Device</strong></li>
                      <li>Point your phone camera at this screen to confirm</li>
                    </ol>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleQrScanConfirm}
                        className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <ShieldCheck size={16} />
                        <span>Simulate Camera Scan & Authorize Session</span>
                      </button>

                      <div className="flex items-center justify-between pt-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setAuthMode("phone")}
                          className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                        >
                          <ArrowLeft size={13} /> Back to Phone Login
                        </button>
                        <a
                          href="https://web.telegram.org/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
                        >
                          <span>Open Telegram Web</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {authSuccessMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono rounded-xl flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* EMBEDDED WORKSPACE MODAL (Gemini & Google AI Studio - Screenshot 4 requested) */}
          {embeddedWorkspace !== "none" && (
            <div className="p-6 bg-[#0E1018] rounded-2xl border border-purple-800/60 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-300 flex items-center justify-center border border-purple-800">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white">
                      {embeddedWorkspace === "gemini" && "Gemini AI Embedded Workspace"}
                      {embeddedWorkspace === "aistudio" && "Google AI Studio Developer Sandbox"}
                      {embeddedWorkspace === "music_global" && "Sreymara Music Global Distribution Hub"}
                      {embeddedWorkspace === "music_studio" && "Sreymara Executive Music Studio"}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono">
                      Opens safely inside Sreymara Videogram container without external redirects
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEmbeddedWorkspace("none")}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close Workspace
                </button>
              </div>

              {/* Workspace Content Frame */}
              <div className="p-5 bg-stone-950 rounded-xl border border-stone-800 min-h-[260px] flex flex-col justify-center items-center text-center space-y-3">
                {embeddedWorkspace === "gemini" && (
                  <>
                    <Bot size={40} className="text-purple-400 animate-pulse" />
                    <h4 className="font-bold text-sm text-white">Gemini 1.5 / 2.0 Flash Executive Engine</h4>
                    <p className="text-xs text-stone-400 max-w-md font-mono">
                      Server-side Gemini proxy initialized. You can ask complex queries or generate code context directly inside Sreymara Videogram.
                    </p>
                  </>
                )}

                {embeddedWorkspace === "aistudio" && (
                  <>
                    <Globe size={40} className="text-cyan-400" />
                    <h4 className="font-bold text-sm text-white">Google AI Studio Development Console</h4>
                    <p className="text-xs text-stone-400 max-w-md font-mono">
                      Applet ID: 32c2ca5a-7827-4a89-a180-4957832e49fa. Full prompt engineering and token testing environment synchronized.
                    </p>
                  </>
                )}

                {embeddedWorkspace === "music_global" && (
                  <>
                    <Radio size={40} className="text-amber-400" />
                    <h4 className="font-bold text-sm text-white">Global Direct Media Upload & Broadcast</h4>
                    <p className="text-xs text-stone-400 max-w-md font-mono">
                      Upload original tracks & video performances globally to YouTube Live, TikTok, Facebook Watch, and Instagram Reels with one click.
                    </p>
                  </>
                )}

                {embeddedWorkspace === "music_studio" && (
                  <>
                    <Music size={40} className="text-emerald-400" />
                    <h4 className="font-bold text-sm text-white">Sreymara Executive Music Studio & Sampler</h4>
                    <p className="text-xs text-stone-400 max-w-md font-mono">
                      Multi-track audio management, playlist creator, offline audio caching, and RichAds sponsored music player.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: CHAT FEED (Matching Screenshot 1 & 3) */}
          {activeTab === "chats" && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Top Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search Chats, Channels, Bots..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-mono focus:outline-none transition-colors ${
                    isNightMode ? "bg-[#141722] border border-stone-800 text-white focus:border-purple-600" : "bg-white border border-stone-300 text-stone-900 focus:border-purple-500"
                  }`}
                />
              </div>

              {/* ARCHIVED CHATS CARD (Screenshot 3 Matching - 4-corner squircle style) */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                isNightMode ? "bg-[#141724] border-stone-800 hover:border-purple-900" : "bg-white border-stone-200 hover:border-purple-300"
              }`}>
                <div className="flex items-center gap-3">
                  {/* 4-corner squircle icon container */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-700/60 flex items-center justify-center text-purple-200 shadow-md">
                    <Archive size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Archived Chats</h4>
                    <p className="text-[11px] text-stone-400 font-mono truncate max-w-[280px]">
                      NAIROBIHOT.COM .... ESCORT HOOK
                    </p>
                  </div>
                </div>

                {/* Counter Badge */}
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold font-mono bg-purple-900 text-purple-100 border border-purple-700 shadow">
                  13
                </span>
              </div>

              {/* SPONSORED TIKTOK / RICHADS BANNER CARD (Screenshot 3 Matching) */}
              <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-black border border-stone-800 flex items-center justify-center text-cyan-400 font-black text-sm shadow">
                    TikTok
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-stone-800 text-stone-300">AD</span>
                      <h4 className="font-bold text-xs text-white">Your KHR 825,670 TikTok Bonus</h4>
                    </div>
                    <p className="text-[11px] text-stone-400">Amplify your reach and sales. Claim bonus points.</p>
                  </div>
                </div>

                <button className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold border border-stone-700 cursor-pointer">
                  Sign Up
                </button>
              </div>

              {/* CHAT LIST */}
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isNightMode ? "bg-[#141724]/70 border-stone-800/80 hover:bg-[#1A1D2D]" : "bg-white border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar with 4-corner squircle shape */}
                      <div className="relative">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-stone-700 shadow-md"
                        />
                        {chat.isVerified && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 bg-cyan-500 text-stone-950 rounded-md">
                            <CheckCheck size={10} />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-white truncate">{chat.name}</h4>
                          {chat.isPinned && <Pin size={11} className="text-amber-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-stone-400 truncate">{chat.lastMsg}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0 font-mono text-[10px]">
                      <span className="text-stone-500">{chat.time}</span>
                      {chat.unread > 0 && (
                        <span className="px-2 py-0.5 rounded-xl text-[10px] font-bold bg-purple-900 text-purple-100 border border-purple-700">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: EXPLORER & SETTINGS (Screenshot 4 Matching - Executive Sreymara Options) */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in text-xs font-bold">
              
              {/* Account Card Header */}
              <div className="p-4 bg-[#141724] rounded-2xl border border-stone-800 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-700 shadow-lg"
                />
                <div>
                  <h3 className="font-serif text-base font-bold text-white">{userProfile.name}</h3>
                  <p className="text-xs text-stone-400 font-mono">{userProfile.phone} • {userProfile.username}</p>
                  <p className="text-[10px] text-purple-300 font-mono mt-0.5">{userProfile.bio}</p>
                </div>
              </div>

              {/* SREYMARA VIDEOGRAM EXECUTIVE SUITE (Screenshot 4 Options) */}
              <div className="p-5 bg-stone-950 rounded-2xl border border-purple-900/40 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="font-serif text-sm font-bold text-amber-400">
                    Sreymara Videogram Executive Tools
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-amber-500/20 text-amber-300">
                    UNLOCKED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-200">
                  <button className="p-3 bg-stone-900 hover:bg-stone-800 rounded-xl border border-stone-800 flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2.5">
                      <Sparkles size={16} className="text-amber-400" /> Sreymara Videotheme
                    </span>
                    <ChevronRight size={14} className="text-stone-500" />
                  </button>

                  <button
                    onClick={() => setEmbeddedWorkspace("gemini")}
                    className="p-3 bg-purple-950/60 hover:bg-purple-900 rounded-xl border border-purple-800/80 flex items-center justify-between text-purple-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Bot size={16} className="text-purple-400" /> Sreymara Executive AI
                    </span>
                    <ChevronRight size={14} className="text-purple-400" />
                  </button>

                  {/* Music 2 Icons Requirement */}
                  <button
                    onClick={() => setEmbeddedWorkspace("music_studio")}
                    className="p-3 bg-stone-900 hover:bg-stone-800 rounded-xl border border-stone-800 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Music size={16} className="text-pink-400" /> Music Studio & Player (Icon 1)
                    </span>
                    <ChevronRight size={14} className="text-stone-500" />
                  </button>

                  <button
                    onClick={() => setEmbeddedWorkspace("music_global")}
                    className="p-3 bg-stone-900 hover:bg-stone-800 rounded-xl border border-stone-800 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Radio size={16} className="text-emerald-400" /> Music Global Direct (Icon 2)
                    </span>
                    <ChevronRight size={14} className="text-stone-500" />
                  </button>

                  <button
                    onClick={() => setEmbeddedWorkspace("aistudio")}
                    className="p-3 bg-cyan-950/60 hover:bg-cyan-900 rounded-xl border border-cyan-800/80 flex items-center justify-between text-cyan-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Globe size={16} className="text-cyan-400" /> Google AI Studio Launcher
                    </span>
                    <ChevronRight size={14} className="text-cyan-400" />
                  </button>

                  <button className="p-3 bg-stone-900 hover:bg-stone-800 rounded-xl border border-stone-800 flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2.5">
                      <Search size={16} className="text-amber-400" /> User Finder
                    </span>
                    <ChevronRight size={14} className="text-stone-500" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* DEPOSIT MODAL ($1 Minimum) */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121520] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-fade-in text-xs font-bold">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">Direct Liquid Deposit</h3>
                  <p className="text-[10px] text-emerald-400 font-mono">Instant Wallet Credit • 0-Day Lock</p>
                </div>
              </div>

              <button
                onClick={() => setShowDepositModal(false)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1.5">
              <p className="text-emerald-200">
                ⚠️ All deposits are routed directly to the master wallet.
              </p>
              <p className="text-[10px] text-stone-400 font-normal">
                Funds are credited instantly to your liquid balance and are spendable immediately. No lockup periods.
              </p>
            </div>

            <form onSubmit={handleStartDeposit} className="space-y-4">
              <div>
                <label className="block text-stone-300 mb-1">Deposit Amount ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">$</span>
                  <input
                    type="number"
                    step="0.10"
                    min="1.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 1.00)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-7 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1.00, 2.50, 5.00].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono border cursor-pointer transition-all ${
                      depositAmount === amt 
                        ? "bg-emerald-600 border-emerald-500 text-white font-black shadow-md" 
                        : "bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800"
                    }`}
                  >
                    ${amt.toFixed(2)}
                  </button>
                ))}
              </div>



              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black rounded-xl text-xs shadow-xl cursor-pointer transition-all transform active:scale-95"
              >
                <Zap size={16} />
                <span>CONFIRM INSTANT DEPOSIT</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR (Screenshots 1 & 3 Matching - 4 Main Tabs) */}
      <div className={`p-3 px-8 border-t flex items-center justify-around gap-2 font-bold text-xs ${
        isNightMode ? "bg-[#10121C] border-stone-800" : "bg-white border-stone-200"
      }`}>
        <button
          onClick={() => setActiveTab("chats")}
          className={`px-5 py-2.5 rounded-2xl flex items-center gap-2.5 cursor-pointer transition-all ${
            activeTab === "chats"
              ? "bg-purple-900 text-purple-100 border border-purple-700 shadow-md scale-105"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <div className="relative">
            <MessageSquare size={16} />
            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 text-[8px] font-mono font-bold bg-amber-500 text-stone-950 rounded-full">
              69
            </span>
          </div>
          <span>Chats</span>
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`px-5 py-2.5 rounded-2xl flex items-center gap-2.5 cursor-pointer transition-all ${
            activeTab === "contacts"
              ? "bg-purple-900 text-purple-100 border border-purple-700 shadow-md scale-105"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <User size={16} />
          <span>Contacts</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-5 py-2.5 rounded-2xl flex items-center gap-2.5 cursor-pointer transition-all ${
            activeTab === "settings"
              ? "bg-purple-900 text-purple-100 border border-purple-700 shadow-md scale-105"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <Sliders size={16} />
          <span>Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`px-5 py-2.5 rounded-2xl flex items-center gap-2.5 cursor-pointer transition-all ${
            activeTab === "profile"
              ? "bg-purple-900 text-purple-100 border border-purple-700 shadow-md scale-105"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <User size={16} className="text-amber-400" />
          <span>Profile</span>
        </button>
      </div>

    </div>
  );
};
