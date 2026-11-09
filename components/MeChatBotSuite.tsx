import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Sparkles,
  User,
  Users,
  Shield,
  ShieldCheck,
  Zap,
  Clock,
  MessageSquare,
  Send,
  Gift,
  Flame,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Radio,
  Search,
  Play,
  Pause,
  X,
  Award,
  Volume2,
  Smile,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  Crown,
  Activity,
  Maximize2,
  Minimize2,
  Sliders,
  Key,
  DollarSign,
  Coins,
  Copy,
  Check,
  Share2,
  Terminal,
  Settings
} from "lucide-react";
import { AdminControlPalace, CAMBODIAN_CROWN_PREVIEW_IMG, MONETAG_DIRECT_LINK } from "./AdminControlPalace";
import { ViralGuestRegisterModal } from "./ViralGuestRegisterModal";

interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  verified: boolean;
  interests: string[];
  bio?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isIcebreaker?: boolean;
  isGift?: boolean;
  giftType?: string;
}

interface LoveSuite {
  id: string;
  user1: UserProfile;
  user2: UserProfile;
  matchMakerUsed: string;
  compatibilityScore: number;
  matchedAt: string;
  status: "ACTIVE_ISOLATED_SUITE" | "ENDED" | "ADMIN_MODERATED";
  ruleComplianceScore: number;
  warningsCount: number;
  giftsCount: number;
  messages: Message[];
}

interface AIMatchmaker {
  id: string;
  name: string;
  version: string;
  desc: string;
  accuracy: string;
}

interface MeChatBotSuiteProps {
  onClose?: () => void;
}

const renderAvatar = (avatarUrl: string, imgClasses = "w-full h-full object-cover rounded-2xl") => {
  if (avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))) {
    return <img src={avatarUrl} alt="Real User Profile" className={imgClasses} />;
  }
  return <span className="text-2xl">{avatarUrl || "👤"}</span>;
};

export const MeChatBotSuite: React.FC<MeChatBotSuiteProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "matchmaker" | "love_suite" | "nearby_engine" | "ai_engines" | "bot_control" | "monetization" | "admin_monitor"
  >("matchmaker");

  // Modals & Viral Ecosystem States
  const [showAdminPalaceModal, setShowAdminPalaceModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [shareCopyNotice, setShareCopyNotice] = useState<string | null>(null);

  // Bot Status Data
  const [onlineCount, setOnlineCount] = useState<number>(14280);
  const [activeSuitesCount, setActiveSuitesCount] = useState<number>(845);

  // Bot Token Control States
  const [botTokenInput, setBotTokenInput] = useState<string>("");
  const [adminTelegramIdInput, setAdminTelegramIdInput] = useState<string>("admin_master_1001");
  const [adminTonWalletInput, setAdminTonWalletInput] = useState<string>("UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ");
  const [botConfigData, setBotConfigData] = useState<any>(null);
  const [botStatusMsg, setBotStatusMsg] = useState<string | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);

  // Monetization States
  const [monetizationData, setMonetizationData] = useState<any>(null);
  const [monoNotice, setMonoNotice] = useState<string | null>(null);
  const [payoutInProgress, setPayoutInProgress] = useState<boolean>(false);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);

  // Fetch bot config & monetization on mount
  useEffect(() => {
    fetchBotConfig();
    fetchMonetizationStats();
    checkIncomingInviteParams();
  }, []);

  const checkIncomingInviteParams = () => {
    if (typeof window === "undefined") return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash || "";
      const phoneParam = searchParams.get("phone") || (hash.includes("phone=") ? hash.split("phone=")[1]?.split("&")[0] : null);
      const userParam = searchParams.get("user") || (hash.includes("user=") ? decodeURIComponent(hash.split("user=")[1]?.split("&")[0]) : null);

      if (phoneParam || userParam || searchParams.get("invite") || hash.includes("invite=")) {
        const cleanDigits = phoneParam ? phoneParam.replace(/[^0-9]/g, "") : "85510371231";
        const isKansas = cleanDigits.includes("85510371231") || (userParam && userParam.toLowerCase().includes("kansas"));
        const invitedName = userParam || (isKansas ? "Kansas Nelly" : `WhatsApp User (+${cleanDigits})`);
        const formattedPhone = `+${cleanDigits}`;

        const inviteSuite: LoveSuite = {
          id: `invite-suite-${Date.now()}`,
          user1: {
            id: "u-invited",
            name: `${invitedName}`,
            age: 24,
            location: "Phnom Penh, Cambodia 🇰🇭",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            verified: true,
            interests: ["Matchmaking", "Lovesuite", "WhatsApp VIP"]
          },
          user2: {
            id: "u-cupid",
            name: "Sreymara (Royal Match)",
            age: 23,
            location: "Phnom Penh (0.3 km away)",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            verified: true,
            interests: ["Cambodia", "Love", "Chatting"]
          },
          matchMakerUsed: "24/7 AI WhatsApp Matchmaker",
          compatibilityScore: 99.8,
          matchedAt: "Just now",
          status: "ACTIVE_ISOLATED_SUITE",
          ruleComplianceScore: 100,
          warningsCount: 0,
          giftsCount: 1,
          messages: [
            {
              id: "m-inv-1",
              senderId: "SYSTEM",
              senderName: "🤖 24/7 AI MATCHMAKING WELCOME BOT",
              text: `🎉 WELCOME TO THE CHATTING LOVESUITE ECOSYSTEM! Welcome ${invitedName} (${formattedPhone})! Your WhatsApp invite link is active. The 24/7 AI Matchmaker is online to welcome you and introduce love matches!`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isIcebreaker: true
            },
            {
              id: "m-inv-2",
              senderId: "u-cupid",
              senderName: "Sreymara",
              text: `Hello ${invitedName}! 💕 Welcome inside the Chatting Lovesuite ecosystem! I'm so glad you accepted the WhatsApp invite link. How are you doing today?`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          ]
        };

        setLoveSuites((prev) => [inviteSuite, ...prev]);
        setSelectedSuiteId(inviteSuite.id);
        setActiveTab("love_suite");
      }
    } catch (err) {
      console.warn("Failed to parse invite URL params", err);
    }
  };

  const fetchBotConfig = async () => {
    try {
      const res = await fetch("/api/mechat/bot/config");
      const data = await res.json();
      if (data.success && data.config) {
        setBotConfigData(data.config);
        if (data.config.botToken) setBotTokenInput(data.config.botToken);
        if (data.config.adminTelegramId) setAdminTelegramIdInput(data.config.adminTelegramId);
        if (data.config.adminTonWallet) setAdminTonWalletInput(data.config.adminTonWallet);
      }
    } catch (err) {
      console.error("Failed to fetch bot config", err);
    }
  };

  const fetchMonetizationStats = async () => {
    try {
      const res = await fetch("/api/mechat/monetization/stats");
      const data = await res.json();
      if (data.success && data.monetization) {
        setMonetizationData(data.monetization);
      }
    } catch (err) {
      console.error("Failed to fetch monetization stats", err);
    }
  };

  const handleSaveBotConfig = async () => {
    setBotStatusMsg("Binding Telegram Bot Token & Registering Webhook...");
    try {
      const res = await fetch("/api/mechat/bot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken: botTokenInput,
          adminTelegramId: adminTelegramIdInput,
          adminTonWallet: adminTonWalletInput,
          autoMonetizationEnabled: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setBotStatusMsg(`✅ ${data.message}`);
        fetchBotConfig();
      } else {
        setBotStatusMsg(`❌ Error: ${data.error || "Failed to update config"}`);
      }
    } catch (err) {
      setBotStatusMsg("❌ Network error connecting to Telegram Bot API");
    }
  };

  const handleTestBotWebhookCommand = async (cmd: string) => {
    try {
      const res = await fetch("/api/mechat/bot/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: { text: cmd, chat: { id: "test_chat_999" }, from: { first_name: "Master Admin" } } })
      });
      const data = await res.json();
      if (data.success) {
        setBotStatusMsg(`🤖 Telegram Command '${cmd}' Dispatch Output: "${data.replyMessage}"`);
      }
    } catch (err) {
      console.error("Command test failed", err);
    }
  };

  const handleBuyMicroItem = async (itemKey: string) => {
    setPurchaseLoading(true);
    setMonoNotice(null);
    try {
      const res = await fetch("/api/mechat/monetization/buy-micro-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemKey,
          userName: "Telegram_User_" + Math.floor(Math.random() * 8999 + 1000)
        })
      });
      const data = await res.json();
      if (data.success) {
        setMonoNotice(`✨ ${data.message}`);
        fetchMonetizationStats();
      }
    } catch (err) {
      setMonoNotice("❌ Error processing micro transaction");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleWithdrawEarnings = async () => {
    setPayoutInProgress(true);
    setMonoNotice(null);
    try {
      const res = await fetch("/api/mechat/monetization/withdraw-creator-funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationWallet: adminTonWalletInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setMonoNotice(`💎 ${data.message} TxHash: ${data.txHash.slice(0, 16)}...`);
        fetchMonetizationStats();
      }
    } catch (err) {
      setMonoNotice("❌ Payout dispatch failed");
    } finally {
      setPayoutInProgress(false);
    }
  };
  const [matchmakers, setMatchmakers] = useState<AIMatchmaker[]>([
    { id: "cupid", name: "Aura Cupid AI", version: "v4.2", desc: "Deep personality matrix & romantic intent alignment", accuracy: "98.7%" },
    { id: "quantum", name: "Quantum Compatibility Engine", version: "v3.1", desc: "Quantum-inspired feature vector similarity for instant synergy", accuracy: "99.2%" },
    { id: "vibe", name: "Vibe & Voice Resonance AI", version: "v2.0", desc: "Audio pitch, cadence & emotional tone harmony calculator", accuracy: "96.4%" },
    { id: "zodiac", name: "Zodiac & Cosmic Synergy AI", version: "v1.8", desc: "Celestial astrology & birth-chart compatibility index", accuracy: "94.1%" },
    { id: "hobbies", name: "Hobbies & Passion Graph AI", version: "v3.0", desc: "Shared interest, lifestyle & core values mapping", accuracy: "97.8%" },
    { id: "romance", name: "Romance Core AI", version: "v4.0", desc: "Emotional intelligence, love language & attachment style analysis", accuracy: "98.9%" },
    { id: "vetting", name: "Safety & Vetting Sentinel AI", version: "v5.0", desc: "Real-time identity verification & anti-scam shield", accuracy: "99.9%" },
    { id: "icebreaker", name: "Conversational Icebreaker AI", version: "v2.5", desc: "Generates personalized 20s dynamic icebreakers based on mutual sparks", accuracy: "97.5%" }
  ]);

  // Queue & Matchmaking States
  const [selectedEngine, setSelectedEngine] = useState<string>("cupid");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(20);
  const [pairingProgress, setPairingProgress] = useState<number>(0);
  const [matchedSuite, setMatchedSuite] = useState<LoveSuite | null>(null);

  // Love Suites state
  const [loveSuites, setLoveSuites] = useState<LoveSuite[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>("suite-101");
  const [chatInputText, setChatInputText] = useState<string>("");
  const [isAudioRecording, setIsAudioRecording] = useState<boolean>(false);
  const [audioSeconds, setAudioSeconds] = useState<number>(0);

  // Virtual Gifts
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);

  // Admin Monitoring
  const [adminNotice, setAdminNotice] = useState<string | null>(null);
  const [searchFilterAdmin, setSearchFilterAdmin] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (force = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 140;
    if (force || isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Fetch suites from server on mount & poll every 3.5 seconds for non-stop live background engine
  useEffect(() => {
    fetchSuites();
    const bgPollTimer = setInterval(() => {
      fetchSuites();
    }, 3500);
    return () => clearInterval(bgPollTimer);
  }, []);

  const fetchSuites = async () => {
    try {
      const res = await fetch("/api/mechat/suites");
      const data = await res.json();
      if (data.success && data.suites) {
        setLoveSuites(data.suites);
        if (data.suites.length > 0 && !selectedSuiteId) {
          setSelectedSuiteId(data.suites[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch love suites", err);
    }
  };

  // Scroll chat to bottom on selected suite change
  useEffect(() => {
    scrollToBottom(true);
  }, [selectedSuiteId]);

  // Scroll chat on incoming background poll only if user is already near bottom
  useEffect(() => {
    scrollToBottom(false);
  }, [loveSuites]);

  const handleIngestSocialMatch = async (source: string) => {
    try {
      const res = await fetch("/api/mechat/ingest-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelSource: source })
      });
      const data = await res.json();
      if (data.success && data.suite) {
        setLoveSuites((prev) => [data.suite, ...prev]);
        setSelectedSuiteId(data.suite.id);
        setActiveTab("love_suite");
        setTimeout(() => scrollToBottom(true), 100);
      }
    } catch (err) {
      console.error("Error ingesting social match", err);
    }
  };

  // 20-Second Fast Pairing Queue Countdown Timer
  useEffect(() => {
    let timer: any = null;
    if (isSearching) {
      timer = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            setIsSearching(false);
            // Trigger Instant Match
            triggerInstantMatch();
            return 20;
          }
          const elapsed = 20 - (prev - 1);
          setPairingProgress(Math.floor((elapsed / 20) * 100));
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdownSeconds(20);
      setPairingProgress(0);
    }
    return () => clearInterval(timer);
  }, [isSearching]);

  // Audio recording simulation timer
  useEffect(() => {
    let interval: any = null;
    if (isAudioRecording) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setAudioSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isAudioRecording]);

  const triggerInstantMatch = (customPartner?: any) => {
    const partnerName = customPartner ? customPartner.name : "Jessica Taylor";
    const partnerAge = customPartner ? customPartner.age : 24;
    const partnerLoc = customPartner ? customPartner.location : "Los Angeles, CA (0.4 km away)";
    const partnerAvatar = customPartner ? customPartner.avatar : "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80";

    const newSuite: LoveSuite = {
      id: `suite-${Date.now().toString().slice(-4)}`,
      user1: {
        id: "u-current",
        name: "You (Verified)",
        age: 24,
        location: "Global / Local GPS",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        verified: true,
        interests: ["Crypto", "AI", "Travel"]
      },
      user2: {
        id: `u-${Math.floor(Math.random() * 900 + 100)}`,
        name: partnerName,
        age: partnerAge,
        location: partnerLoc,
        avatar: partnerAvatar,
        verified: true,
        interests: ["Fitness", "Fashion", "Crypto"]
      },
      matchMakerUsed: matchmakers.find((m) => m.id === selectedEngine)?.name || "Aura Cupid AI",
      compatibilityScore: Number((Math.random() * 4 + 95.8).toFixed(1)),
      matchedAt: "Just now",
      status: "ACTIVE_ISOLATED_SUITE",
      ruleComplianceScore: 100,
      warningsCount: 0,
      giftsCount: 0,
      messages: [
        {
          id: `m-init-1`,
          senderId: "SYSTEM",
          senderName: "✨ AI CUPID MATCHMAKER",
          text: `🎉 MATCH MERGED! You have been connected with ${partnerName} in an Isolated Love Suite!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isIcebreaker: true
        },
        {
          id: `m-init-2`,
          senderId: "u-match",
          senderName: partnerName,
          text: `Hi there! I love that the AI matched us in 20 seconds 💕 What are you up to today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };

    setLoveSuites((prev) => [newSuite, ...prev]);
    setSelectedSuiteId(newSuite.id);
    setMatchedSuite(newSuite);
    setActiveTab("love_suite");
  };

  const handleSendMessage = async () => {
    if (!chatInputText.trim() || !selectedSuiteId) return;
    const textToSend = chatInputText;
    setChatInputText("");

    try {
      const res = await fetch("/api/mechat/suite/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selectedSuiteId,
          senderId: "user-current",
          senderName: "You",
          text: textToSend
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchSuites();
      }
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleSendGift = async (giftType: string) => {
    if (!selectedSuiteId) return;
    setShowGiftModal(false);
    try {
      const res = await fetch("/api/mechat/suite/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selectedSuiteId,
          giftType,
          senderName: "You"
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchSuites();
      }
    } catch (err) {
      console.error("Error sending gift", err);
    }
  };

  const handleSendVoiceNote = () => {
    if (!isAudioRecording) {
      setIsAudioRecording(true);
    } else {
      setIsAudioRecording(false);
      // Dispatch simulated voice note message
      if (!selectedSuiteId) return;
      const voiceText = `🎙️ Secret Audio Message (${audioSeconds}s)`;
      fetch("/api/mechat/suite/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selectedSuiteId,
          senderId: "user-current",
          senderName: "You",
          text: voiceText
        })
      }).then(() => fetchSuites());
    }
  };

  const handleAdminAction = async (action: string, suiteId: string) => {
    try {
      const res = await fetch("/api/mechat/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, suiteId })
      });
      const data = await res.json();
      if (data.success) {
        setAdminNotice(`Admin Action executed: ${action} on suite ${suiteId}`);
        setTimeout(() => setAdminNotice(null), 4000);
        fetchSuites();
      }
    } catch (err) {
      console.error("Error executing admin action", err);
    }
  };

  const activeSuite = loveSuites.find((s) => s.id === selectedSuiteId) || loveSuites[0];

  return (
    <div className="w-full bg-[#0d0914] text-stone-100 rounded-3xl border border-purple-900/50 overflow-hidden shadow-2xl font-sans">
      {/* HEADER BANNER WITH BOT LINK & STATS */}
      <div className="bg-gradient-to-r from-purple-950 via-[#180d2b] to-fuchsia-950 p-6 border-b border-purple-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-600 flex items-center justify-center text-2xl shadow-xl border border-pink-400/40 transform hover:rotate-6 transition-transform">
              💖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-wide">
                  @MeChatBot Matchmaking & Isolated Love Suite
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-700">
                  OFFICIAL ECOSYSTEM INTEGRATION
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE PAIRING
                </span>
              </div>
              <p className="text-xs text-purple-300/80 mt-1 flex items-center gap-2 flex-wrap">
                <span>Direct Bot Access:</span>
                <a
                  href="https://t.me/MeChatBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 font-bold underline flex items-center gap-1 font-mono"
                >
                  <span>https://t.me/MeChatBot</span>
                  <ExternalLink size={12} />
                </a>
                <span>• 8 AI Matchmakers • 20s Fast Pairing</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3.5 py-2 bg-black/50 border border-purple-800/80 rounded-xl text-xs flex items-center gap-2">
              <Users size={14} className="text-pink-400" />
              <div>
                <span className="text-[10px] text-stone-400 block font-mono">ONLINE SEARCHING</span>
                <span className="font-bold font-mono text-white">{onlineCount.toLocaleString()} Users</span>
              </div>
            </div>

            <div className="px-3.5 py-2 bg-black/50 border border-purple-800/80 rounded-xl text-xs flex items-center gap-2">
              <Heart size={14} className="text-fuchsia-400" />
              <div>
                <span className="text-[10px] text-stone-400 block font-mono">ACTIVE LOVE SUITES</span>
                <span className="font-bold font-mono text-white">{activeSuitesCount.toLocaleString()} Suites</span>
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer border border-emerald-400/40"
              title="Share ecosystem link on WhatsApp, TikTok, Facebook, Telegram"
            >
              <Share2 size={14} className="text-emerald-200" />
              <span>Share & Earn ($10k Cup)</span>
            </button>

            <button
              onClick={() => setShowAdminPalaceModal(true)}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer border border-amber-300 ring-2 ring-amber-400/30"
              title="Open Ecosystem Admin Control Dashboard"
            >
              <Crown size={14} />
              <span>Admin Palace</span>
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-3.5 py-2.5 bg-gradient-to-r from-purple-800 to-pink-800 hover:from-purple-700 hover:to-pink-700 text-purple-100 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all cursor-pointer border border-pink-500/50"
              title="Register as real user in ecosystem"
            >
              <UserCheck size={14} className="text-pink-300" />
              <span>{registeredUser ? registeredUser.fullName : "Guest Register"}</span>
            </button>

            <a
              href="https://t.me/MeChatBot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Send size={14} />
              <span>Launch @MeChatBot</span>
            </a>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 rounded-xl text-xs font-bold border border-stone-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 px-6 pt-3 bg-[#0a0710] border-b border-purple-900/40 overflow-x-auto [scrollbar-width:none]">
        <button
          onClick={() => setActiveTab("matchmaker")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "matchmaker"
              ? "bg-[#130b22] text-pink-400 border-pink-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Sparkles size={15} />
          <span>20s Fast Pairing Queue</span>
          {isSearching && (
            <span className="px-2 py-0.5 bg-pink-950 text-pink-300 text-[10px] rounded-full font-mono font-bold animate-pulse">
              SEARCHING ({countdownSeconds}s)
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("love_suite")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "love_suite"
              ? "bg-[#130b22] text-pink-400 border-pink-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Heart size={15} />
          <span>Isolated Love Suite (Chat)</span>
          <span className="px-2 py-0.5 bg-purple-950 text-purple-300 text-[10px] rounded-full font-mono border border-purple-700">
            PRIVATE 1-ON-1
          </span>
        </button>

        <button
          onClick={() => setActiveTab("nearby_engine")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "nearby_engine"
              ? "bg-[#130b22] text-amber-400 border-amber-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Flame size={15} className="text-amber-400 animate-pulse" />
          <span>🔥 LitMatch People Nearby</span>
          <span className="px-2 py-0.5 bg-amber-950 text-amber-300 text-[10px] rounded-full font-mono border border-amber-700 font-bold">
            NON-STOP ENGINE
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ai_engines")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "ai_engines"
              ? "bg-[#130b22] text-pink-400 border-pink-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Zap size={15} />
          <span>8 AI Matchmaker Engines</span>
        </button>

        <button
          onClick={() => setActiveTab("bot_control")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "bot_control"
              ? "bg-[#130b22] text-amber-400 border-amber-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Key size={15} className="text-amber-400" />
          <span>Bot Token & Telegram Control</span>
          <span className="px-2 py-0.5 bg-amber-950 text-amber-300 text-[10px] rounded-full font-mono border border-amber-700 font-bold">
            @BotFather
          </span>
        </button>

        <button
          onClick={() => setActiveTab("monetization")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "monetization"
              ? "bg-[#130b22] text-emerald-400 border-emerald-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Coins size={15} className="text-emerald-400" />
          <span>Micro USDT Monetization & Yield ($)</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] rounded-full font-mono border border-emerald-700 font-bold">
            80% CREATOR CUT
          </span>
        </button>

        <button
          onClick={() => setActiveTab("admin_monitor")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "admin_monitor"
              ? "bg-[#130b22] text-emerald-400 border-emerald-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <ShieldCheck size={15} />
          <span>Admin Real-Time Chat Monitor</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] rounded-full font-mono border border-emerald-700 font-bold">
            MODERATOR MODE
          </span>
        </button>
      </div>

      {/* TAB 1: 20s AUTO MATCHMAKER & FAST PAIRING QUEUE */}
      {activeTab === "matchmaker" && (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* Main Pairing Stage Banner */}
          <div className="p-8 bg-gradient-to-b from-[#180c2f] via-[#120822] to-[#0d0718] rounded-3xl border border-purple-800/80 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.15)_0,transparent_70%)] pointer-events-none"></div>

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-950/80 border border-pink-700 text-pink-300 rounded-full text-xs font-mono font-bold">
                <Sparkles size={14} />
                <span>20-SECOND QUANTUM MATCHMAKING ENGINE</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Connect Real People in 20 Seconds into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">Isolated Love Suite</span>
              </h1>

              <p className="text-sm text-stone-300 leading-relaxed">
                Choose one of our 8 specialized AI Matchmaker Engines to scan real user profiles, calculate vector affinity, and merge two compatible people into an isolated private room.
              </p>

              {/* Engine Selector Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left pt-2">
                {matchmakers.map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => setSelectedEngine(engine.id)}
                    className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                      selectedEngine === engine.id
                        ? "bg-pink-950/90 border-pink-500 shadow-xl text-white ring-2 ring-pink-500/50"
                        : "bg-black/50 border-purple-900/60 text-stone-300 hover:border-purple-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-pink-300">{engine.name}</span>
                      <span className="text-[10px] font-mono font-bold bg-pink-900/60 text-pink-200 px-1.5 py-0.5 rounded">
                        {engine.accuracy}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-2">{engine.desc}</p>
                  </button>
                ))}
              </div>

              {/* Start Search Action Button or Countdown Radar */}
              <div className="pt-4 flex flex-col items-center justify-center space-y-4">
                {!isSearching ? (
                  <button
                    onClick={() => setIsSearching(true)}
                    className="px-8 py-4 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-base rounded-2xl shadow-2xl flex items-center gap-3 transition-all transform hover:scale-105 cursor-pointer ring-4 ring-pink-500/30"
                  >
                    <Heart size={20} className="animate-bounce" />
                    <span>START 20s AUTO MATCHMAKING</span>
                    <Zap size={18} className="text-amber-300" />
                  </button>
                ) : (
                  <div className="w-full max-w-md p-6 bg-black/80 rounded-3xl border border-pink-500/80 space-y-4 animate-pulse">
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-pink-500/30 animate-ping"></div>
                      <div className="absolute inset-2 rounded-full border-4 border-fuchsia-500/60 animate-spin"></div>
                      <div className="text-2xl font-mono font-black text-white">{countdownSeconds}s</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono font-bold text-pink-300">
                        <span>SCANNING GLOBAL USER VECTORS...</span>
                        <span>{pairingProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-900 rounded-full h-3 overflow-hidden border border-purple-900">
                        <div
                          className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 h-full transition-all duration-300"
                          style={{ width: `${pairingProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={triggerInstantMatch}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        ⚡ Fast-Forward Match Now
                      </button>
                      <button
                        onClick={() => setIsSearching(false)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Cancel Search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Active Love Suite Previews */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Heart size={16} className="text-pink-400" />
                <span>Live Active Isolated Love Suites</span>
              </h3>
              <span className="text-xs text-stone-400 font-mono">Real-time Encrypted P2P Channels</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loveSuites.map((suite) => (
                <div
                  key={suite.id}
                  onClick={() => {
                    setSelectedSuiteId(suite.id);
                    setActiveTab("love_suite");
                  }}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                    selectedSuiteId === suite.id
                      ? "bg-purple-950/70 border-pink-500 shadow-xl"
                      : "bg-[#110a1f] border-purple-900/60 hover:border-purple-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-700">
                      {suite.matchMakerUsed}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles size={12} />
                      {suite.compatibilityScore}% Synergy
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-2 bg-black/40 rounded-2xl border border-purple-900/40">
                    <div className="text-center flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-pink-500/50 shadow">
                        {renderAvatar(suite.user1.avatar)}
                      </div>
                      <span className="text-xs font-bold text-white block mt-1">{suite.user1.name.split(" ")[0]}</span>
                      <span className="text-[10px] text-stone-400 block font-mono">{suite.user1.location}</span>
                    </div>

                    <div className="text-pink-500 font-bold text-xl animate-pulse">❤️</div>

                    <div className="text-center flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-fuchsia-500/50 shadow">
                        {renderAvatar(suite.user2.avatar)}
                      </div>
                      <span className="text-xs font-bold text-white block mt-1">{suite.user2.name.split(" ")[0]}</span>
                      <span className="text-[10px] text-stone-400 block font-mono">{suite.user2.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-stone-400 pt-1">
                    <span>{suite.messages.length} Messages exchanged</span>
                    <span className="text-pink-400 font-bold hover:underline">Join Private Chat →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ISOLATED LOVE SUITE (1-ON-1 PRIVATE CHAT ROOM) */}
      {activeTab === "love_suite" && activeSuite && (
        <div className="p-6 space-y-5 animate-fade-in bg-[#07030d] rounded-3xl border border-purple-950/80 shadow-2xl">
          {/* LUXURY ISOLATED ROOM SELECTOR STRIP */}
          <div className="p-2.5 bg-[#0e071c] rounded-2xl border border-amber-500/30 flex items-center justify-between gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-900">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-purple-900/40 border border-amber-500/50 rounded-xl text-[11px] font-mono font-black text-amber-300 flex items-center gap-1.5 shrink-0">
                <Crown size={13} className="text-amber-400" />
                <span>ISOLATED ROOM SELECTOR</span>
              </span>

              {/* DYNAMIC ROOM BUTTONS */}
              {loveSuites.map((suite, idx) => (
                <button
                  key={suite.id}
                  onClick={() => setSelectedSuiteId(suite.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border shrink-0 ${
                    selectedSuiteId === suite.id
                      ? "bg-gradient-to-r from-pink-950 via-purple-900 to-pink-950 text-white border-pink-500 shadow-lg ring-2 ring-pink-500/40 font-black"
                      : "bg-black/60 text-stone-400 hover:text-white border-purple-900/60"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
                  <span>ROOM {idx + 1}: {suite.user1.name.split(" ")[0]} & {suite.user2.name.split(" ")[0]}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-pink-900/80 text-pink-200 rounded font-bold">
                    {suite.compatibilityScore}%
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => handleIngestSocialMatch("Telegram @MeChat Phnom Penh")}
                className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 rounded-xl text-[10px] font-bold border border-amber-600 transition-all cursor-pointer flex items-center gap-1"
                title="Ingest real match from Phnom Penh, Cambodia"
              >
                <span>🇰🇭 Phnom Penh</span>
              </button>
              <button
                onClick={() => handleIngestSocialMatch("Telegram @bchat Sihanoukville")}
                className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 rounded-xl text-[10px] font-bold border border-amber-600 transition-all cursor-pointer flex items-center gap-1"
                title="Ingest real match from Sihanoukville, Cambodia"
              >
                <span>🏖️ Sihanoukville</span>
              </button>
              <button
                onClick={() => handleIngestSocialMatch("Telegram @bot_chat Thailand")}
                className="px-2.5 py-1 bg-[#1d0b30] hover:bg-purple-900 text-purple-300 rounded-xl text-[10px] font-bold border border-purple-600 transition-all cursor-pointer flex items-center gap-1"
                title="Ingest real match from Thailand"
              >
                <span>🇹🇭 Thailand</span>
              </button>
              <button
                onClick={() => handleIngestSocialMatch("Telegram @chatbota Vietnam")}
                className="px-2.5 py-1 bg-[#0b2430] hover:bg-cyan-900 text-cyan-300 rounded-xl text-[10px] font-bold border border-cyan-600 transition-all cursor-pointer flex items-center gap-1"
                title="Ingest real match from Vietnam"
              >
                <span>🇻🇳 Vietnam</span>
              </button>
              <button
                onClick={() => handleIngestSocialMatch("Telegram @chatbott Nigeria")}
                className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl text-[10px] font-bold border border-emerald-600 transition-all cursor-pointer flex items-center gap-1"
                title="Ingest real match from Nigeria"
              >
                <span>🇳🇬 Nigeria</span>
              </button>
              <button
                onClick={() => handleIngestSocialMatch("Telegram @MeChat Channel")}
                className="px-2.5 py-1 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-xl text-[10px] font-bold border border-blue-600 transition-all cursor-pointer flex items-center gap-1"
                title="Pull real match from Telegram @bot_chat, @bchat, @MeChat"
              >
                <span>📡 Telegram Global</span>
              </button>
              <button
                onClick={() => triggerInstantMatch()}
                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-black transition-all shadow cursor-pointer flex items-center gap-1"
              >
                <Zap size={13} />
                <span>+ FAST 5s MATCH</span>
              </button>
            </div>
          </div>

          {/* FIRST TIME MEETING & MATCH ANNOUNCEMENT BANNER */}
          <div className="p-5 bg-gradient-to-r from-[#18092a] via-[#120621] to-[#1c0a32] rounded-3xl border border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-wrap justify-between items-center gap-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12)_0,transparent_60%)] pointer-events-none"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="flex -space-x-3 items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 border-2 border-amber-400 flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-pink-500/20">
                  {renderAvatar(activeSuite.user1.avatar)}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 border-2 border-amber-400 flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-fuchsia-500/20">
                  {renderAvatar(activeSuite.user2.avatar)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-950 text-amber-300 border border-amber-600 tracking-wider">
                    FIRST TIME MEETING & ISOLATED SUITE
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles size={11} />
                    {activeSuite.compatibilityScore}% QUANTUM SYNERGY
                  </span>
                </div>
                <h2 className="text-base font-black text-white mt-1 flex items-center gap-2">
                  <span>{activeSuite.user1.name}</span>
                  <span className="text-pink-500">❤️</span>
                  <span>{activeSuite.user2.name}</span>
                </h2>
                <p className="text-[11px] text-stone-300 font-mono">
                  Engine: <span className="text-amber-300 font-bold">{activeSuite.matchMakerUsed}</span> • Encrypted Private Channel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => setShowGiftModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
              >
                <Gift size={14} />
                <span>Send Gift</span>
              </button>

              <button
                onClick={() => triggerInstantMatch()}
                className="px-3.5 py-2 bg-black/70 hover:bg-stone-900 text-stone-200 rounded-xl text-xs font-bold transition-all border border-purple-800/80 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={13} />
                <span>Next Partner ⏭️</span>
              </button>

              <button
                onClick={() => setActiveTab("admin_monitor")}
                className="px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-700 cursor-pointer flex items-center gap-1.5"
              >
                <Shield size={13} />
                <span>Admin View</span>
              </button>
            </div>
          </div>

          {/* LUXURY PRIVATE CHAT INTERFACE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Left Sidebar: Partner Profile & Vetting Card */}
            <div className="md:col-span-1 p-5 bg-gradient-to-b from-[#120822] to-[#0a0414] rounded-3xl border border-purple-900/80 space-y-4 shadow-xl">
              <div className="text-center space-y-2">
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-amber-500 mx-auto flex items-center justify-center shadow-2xl border-2 border-amber-400/80 overflow-hidden">
                  {renderAvatar(activeSuite.user2.avatar)}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[10px] text-black font-black z-10">
                    ✓
                  </div>
                </div>

                <h4 className="text-base font-black text-white flex items-center justify-center gap-1.5">
                  <span>{activeSuite.user2.name}</span>
                  {activeSuite.user2.verified && <CheckCircle2 size={15} className="text-amber-400" />}
                </h4>

                <span className="text-xs text-amber-300/80 font-mono block">
                  {activeSuite.user2.age} yrs • {activeSuite.user2.location}
                </span>
              </div>

              <div className="p-3.5 bg-black/60 rounded-2xl border border-purple-900/60 space-y-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  MUTUAL PASSION VECTORS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSuite.user2.interests.map((int, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-purple-950/90 text-amber-200 rounded-lg text-[10px] font-bold border border-amber-500/40 shadow-sm"
                    >
                      #{int}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-black/60 rounded-2xl border border-emerald-900/60 space-y-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase tracking-wider">
                  256-BIT ISOLATED SHIELD
                </span>
                <div className="flex items-center gap-1.5 text-emerald-300 font-mono font-bold text-[11px]">
                  <Lock size={12} className="text-emerald-400" />
                  <span>Isolated P2P Room Active</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleSendGift("🌹 Virtual Rose")}
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-950 to-purple-950 hover:from-pink-900 hover:to-purple-900 text-pink-200 rounded-xl text-xs font-bold border border-pink-700/80 flex items-center justify-center gap-1 cursor-pointer shadow-md"
                >
                  <Heart size={14} className="text-pink-400" />
                  <span>Send Rose 💕</span>
                </button>

                <button
                  onClick={() => triggerInstantMatch()}
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl text-xs font-bold border border-stone-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Skip ⏭️</span>
                </button>
              </div>
            </div>

            {/* Right Main Chat Canvas */}
            <div className="md:col-span-3 flex flex-col h-[580px] bg-gradient-to-b from-[#0e071c] via-[#090414] to-[#07030e] rounded-3xl border border-purple-900/80 overflow-hidden shadow-2xl">
              {/* Messages Area */}
              <div ref={messagesContainerRef} className="flex-1 p-5 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
                {activeSuite.messages.map((msg) => {
                  const isMe = msg.senderId === "user-current" || msg.senderName === "You";
                  const isSystem = msg.senderId === "SYSTEM" || msg.senderId === "ADMIN_SYSTEM";

                  if (isSystem) {
                    return (
                      <div
                        key={msg.id}
                        className="p-3 bg-[#170b2c] border border-amber-500/40 rounded-2xl text-center text-xs text-amber-200 font-mono space-y-1 shadow-lg"
                      >
                        <span className="font-bold text-amber-300 block flex items-center justify-center gap-1">
                          <Sparkles size={12} />
                          {msg.senderName}
                        </span>
                        <p>{msg.text}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mb-1 px-1 font-mono">
                        <span className="font-bold text-stone-300">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed shadow-lg ${
                          isMe
                            ? "bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 text-white rounded-tr-none border border-pink-400/30"
                            : msg.isGift
                            ? "bg-gradient-to-r from-amber-950/90 via-[#261c07] to-amber-950/90 border border-amber-400/80 text-amber-200 rounded-tl-none font-bold shadow-xl"
                            : "bg-[#181128] border border-purple-800/80 text-purple-100 rounded-tl-none shadow-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-[#120822] border-t border-purple-900/80 space-y-2">
                {isAudioRecording && (
                  <div className="p-2.5 bg-pink-950/90 border border-pink-600 rounded-xl text-xs text-pink-200 font-mono flex items-center justify-between animate-pulse">
                    <span className="flex items-center gap-2">
                      <Volume2 size={15} className="text-pink-400" />
                      <span>Recording Secret Audio Message ({audioSeconds}s)...</span>
                    </span>
                    <button
                      onClick={handleSendVoiceNote}
                      className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Send Voice Note
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendVoiceNote}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isAudioRecording
                        ? "bg-red-600 text-white border-red-500 animate-bounce"
                        : "bg-black/60 text-stone-300 border-purple-900 hover:border-purple-600"
                    }`}
                    title="Record Voice Note"
                  >
                    <Volume2 size={16} />
                  </button>

                  <button
                    onClick={() => setShowGiftModal(true)}
                    className="p-3.5 bg-gradient-to-r from-amber-950 to-amber-900 hover:from-amber-900 hover:to-amber-800 text-amber-300 rounded-2xl border border-amber-600 transition-all cursor-pointer"
                    title="Send Gift"
                  >
                    <Gift size={16} />
                  </button>

                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type private message in Love Suite..."
                    className="flex-1 px-4 py-3 bg-black/70 border border-purple-900/80 rounded-2xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-pink-500 font-sans shadow-inner"
                  />

                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl text-xs font-black shadow-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send size={15} />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LITMATCH PEOPLE NEARBY & NON-STOP REAL-TIME AI ENGINE */}
      {activeTab === "nearby_engine" && (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* Header Live Stream Status */}
          <div className="p-6 bg-gradient-to-r from-amber-950/80 via-[#1c0d2e] to-purple-950 rounded-3xl border border-amber-500/40 flex flex-wrap justify-between items-center gap-4 shadow-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500 text-stone-950 font-black text-[11px] rounded-full flex items-center gap-1 font-mono">
                  <Flame size={13} className="animate-bounce" /> NON-STOP MATCHMAKING ENGINE
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  14,280 Real Users Online Nearby
                </span>
              </div>
              <h3 className="text-xl font-black text-white">TikTok / LitMatch Real People Engine</h3>
              <p className="text-xs text-stone-300">
                Non-stop background radar matching real nearby people using HD profile portraits, distance metrics, and 20s fast-pairing.
              </p>
            </div>

            <button
              onClick={() => triggerInstantMatch()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105"
            >
              <Zap size={16} />
              <span>⚡ AUTO PAIR WITH NEARBY REAL USER</span>
            </button>
          </div>

          {/* People Nearby Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { id: "p-1", name: "Jessica Taylor", age: 24, location: "Los Angeles, CA", distance: "0.4 km away", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80", verified: true, interests: ["Fitness", "Fashion", "Crypto"], bio: "Looking for meaningful 20s matches & real conversations! ✨" },
              { id: "p-2", name: "David Miller", age: 26, location: "Toronto, Canada", distance: "1.1 km away", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80", verified: true, interests: ["Tech", "Hiking", "Coffee"], bio: "AI developer & travel enthusiast. Let's talk!" },
              { id: "p-3", name: "Amara Jackson", age: 23, location: "Atlanta, GA", distance: "0.7 km away", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80", verified: true, interests: ["Music", "Dance", "Startups"], bio: "Music creator & vibe curator. Fast 20s match ready 🎵" },
              { id: "p-4", name: "Marcus Vance", age: 27, location: "Miami, FL", distance: "1.8 km away", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80", verified: true, interests: ["Yachts", "Finance", "Fitness"], bio: "Miami founder. Passionate about real conversations & crypto." },
              { id: "p-5", name: "Elena Rostova", age: 22, location: "Zurich, Switzerland", distance: "2.3 km away", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", verified: true, interests: ["Art", "Architecture", "Design"], bio: "Designer exploring AI & quantum matchmaking." },
              { id: "p-6", name: "Lucas Moreau", age: 27, location: "Paris, France", distance: "3.1 km away", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", verified: true, interests: ["Web3", "Photography", "Gourmet"], bio: "French photographer & Web3 enthusiast. Let me take your portrait!" }
            ].map((person) => (
              <div
                key={person.id}
                className="p-5 bg-gradient-to-b from-[#140b24] to-[#0a0514] rounded-3xl border border-purple-900/80 hover:border-amber-500/60 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-purple-800/60 shadow-inner">
                    <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>{person.distance}</span>
                    </div>
                    {person.verified && (
                      <div className="absolute top-2 right-2 px-2.5 py-1 bg-amber-500/90 text-black font-black text-[10px] rounded-full flex items-center gap-1 shadow">
                        <CheckCircle2 size={12} /> VERIFIED REAL
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-black text-white">{person.name}, {person.age}</h4>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">{person.location.split("(")[0]}</span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2">{person.bio}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {person.interests.map((int, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-950 text-purple-200 text-[10px] font-bold rounded-md border border-purple-800">
                        #{int}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2 border-t border-purple-900/40">
                  <button
                    onClick={() => triggerInstantMatch(person)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg cursor-pointer"
                  >
                    <Zap size={14} />
                    <span>Instant Match</span>
                  </button>
                  <button
                    onClick={() => handleSendGift("🌹 Virtual Rose")}
                    className="px-3 py-2.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-bold rounded-xl text-xs border border-amber-600 cursor-pointer"
                    title="Send Rose"
                  >
                    <Heart size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 8 INTELLIGENT AI MATCHMAKER ENGINES */}
      {activeTab === "ai_engines" && (
        <div className="p-6 space-y-6 animate-fade-in">
          <div className="p-6 bg-gradient-to-r from-purple-950 via-[#190d30] to-fuchsia-950 rounded-3xl border border-purple-800/80 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Zap size={18} className="text-pink-400" />
                <span>8 Specialized AI Matchmaker Neural Engines</span>
              </h3>
              <p className="text-xs text-purple-300/80 mt-1">
                Engineered for @MeChatBot to perform multi-dimensional profile vectors matching, real-time audio resonance, and romance intent pairing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {matchmakers.map((engine, idx) => (
              <div
                key={engine.id}
                className="p-5 bg-[#120a20] rounded-3xl border border-purple-900/70 space-y-3 hover:border-pink-500/60 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-pink-950 text-pink-300 border border-pink-800 font-mono font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    {engine.accuracy} ACCURACY
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{engine.name}</h4>
                  <span className="text-[10px] font-mono text-purple-300 block">{engine.version}</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">{engine.desc}</p>

                <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>Latency: 12ms</span>
                  <button
                    onClick={() => {
                      setSelectedEngine(engine.id);
                      setActiveTab("matchmaker");
                    }}
                    className="text-pink-400 hover:underline font-bold cursor-pointer"
                  >
                    Select Engine →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADMIN REAL-TIME CHAT MONITOR & RULE COMPLIANCE DASHBOARD */}
      {activeTab === "admin_monitor" && (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* Admin Header Notification */}
          {adminNotice && (
            <div className="p-3.5 bg-emerald-950/90 border border-emerald-700 rounded-2xl text-xs text-emerald-200 font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>{adminNotice}</span>
              </span>
              <button onClick={() => setAdminNotice(null)} className="text-stone-400 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="p-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 rounded-3xl border border-emerald-800/80 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-emerald-300 border border-emerald-600 flex items-center justify-center font-bold text-xl shadow-lg">
                🛡️
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Admin Live Moderation & Safety Sentinel</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    REAL-TIME MONITOR
                  </span>
                </h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Monitor active Isolated Love Suites in real-time, inspect message streams, enforce rule compliance, and maintain a safe environment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 bg-black/60 rounded-xl border border-emerald-800 text-xs font-mono">
                <span className="text-stone-400 block text-[10px]">RULE COMPLIANCE RATE</span>
                <span className="font-bold text-emerald-400 text-sm">99.8% Compliant</span>
              </div>
            </div>
          </div>

          {/* Active Suites Moderation Table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Eye size={16} className="text-emerald-400" />
                <span>Active Monitored Love Suites</span>
              </h4>

              <input
                type="text"
                value={searchFilterAdmin}
                onChange={(e) => setSearchFilterAdmin(e.target.value)}
                placeholder="Search user or suite ID..."
                className="px-3.5 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loveSuites
                .filter((s) => s.user1.name.toLowerCase().includes(searchFilterAdmin.toLowerCase()) || s.user2.name.toLowerCase().includes(searchFilterAdmin.toLowerCase()) || s.id.includes(searchFilterAdmin))
                .map((suite) => (
                  <div key={suite.id} className="p-5 bg-[#0e1412] rounded-3xl border border-emerald-900/60 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 rounded-lg text-[10px] font-mono font-bold border border-emerald-800">
                          {suite.id}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {suite.user1.name} ❤️ {suite.user2.name}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          suite.ruleComplianceScore >= 90
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                            : "bg-amber-950 text-amber-300 border border-amber-700"
                        }`}
                      >
                        {suite.ruleComplianceScore}% Compliant
                      </span>
                    </div>

                    {/* Chat Snippet Stream */}
                    <div className="p-3 bg-black/60 rounded-2xl border border-stone-800 max-h-36 overflow-y-auto space-y-2 text-xs font-mono">
                      {suite.messages.slice(-3).map((m) => (
                        <div key={m.id} className="flex items-start gap-1.5 text-stone-300 text-[11px]">
                          <span className="font-bold text-emerald-400 shrink-0">{m.senderName}:</span>
                          <span className="text-stone-300">{m.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Admin Moderation Actions */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <button
                        onClick={() => handleAdminAction("INJECT_ICEBREAKER", suite.id)}
                        className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-200 rounded-xl text-xs font-bold border border-purple-700 cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles size={12} />
                        <span>Inject Icebreaker</span>
                      </button>

                      <button
                        onClick={() => handleAdminAction("WARN", suite.id)}
                        className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded-xl text-xs font-bold border border-amber-700 cursor-pointer flex items-center gap-1"
                      >
                        <AlertTriangle size={12} />
                        <span>Warn Room</span>
                      </button>

                      <button
                        onClick={() => handleAdminAction("MARK_COMPLIANT", suite.id)}
                        className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-700 cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        <span>Mark Verified</span>
                      </button>

                      <button
                        onClick={() => handleAdminAction("FORCE_END", suite.id)}
                        className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded-xl text-xs font-bold border border-red-800 cursor-pointer flex items-center gap-1"
                      >
                        <X size={12} />
                        <span>End Suite</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TELEGRAM BOT TOKEN & WEBHOOK CONTROL CENTER */}
      {activeTab === "bot_control" && (
        <div className="p-6 space-y-6 animate-fade-in">
          <div className="p-6 bg-gradient-to-r from-amber-950/60 via-[#1e1309] to-amber-950/40 rounded-3xl border border-amber-800/80 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-800/50 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Key size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-200">
                    Telegram Bot Father Token & Webhook Gateway
                  </h3>
                  <p className="text-xs text-amber-300/80">
                    Connect your live Telegram Bot Token to take full control of @MeChatBot and monetize micro USDT transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-950 text-emerald-300 rounded-full text-xs font-mono font-bold border border-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  WEBHOOK LISTENER ACTIVE
                </span>
              </div>
            </div>

            {botStatusMsg && (
              <div className="p-3.5 bg-black/60 border border-amber-500/50 rounded-2xl text-xs font-mono text-amber-300 flex items-center gap-2">
                <Terminal size={14} className="text-amber-400 shrink-0" />
                <span>{botStatusMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BOT TOKEN & PARAMETER FORM */}
              <div className="bg-black/50 p-5 rounded-2xl border border-amber-900/60 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Settings size={14} />
                  <span>1. Configure @BotFather Token & Admin Key</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-stone-300 block mb-1">
                      Telegram Bot Token (from @BotFather):
                    </label>
                    <input
                      type="password"
                      value={botTokenInput}
                      onChange={(e) => setBotTokenInput(e.target.value)}
                      placeholder="e.g. 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                      className="w-full px-3.5 py-2.5 bg-[#0a0710] border border-amber-800/80 rounded-xl text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-stone-400 block mt-1">
                      Get your token by messaging Telegram's official <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">@BotFather</a>.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-stone-300 block mb-1">
                      Master Admin Telegram ID or Username:
                    </label>
                    <input
                      type="text"
                      value={adminTelegramIdInput}
                      onChange={(e) => setAdminTelegramIdInput(e.target.value)}
                      placeholder="e.g. admin_master_1001"
                      className="w-full px-3.5 py-2.5 bg-[#0a0710] border border-amber-800/80 rounded-xl text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-stone-300 block mb-1">
                      Connected TON / Telegram Wallet Address (for Micro USDT earnings):
                    </label>
                    <input
                      type="text"
                      value={adminTonWalletInput}
                      onChange={(e) => setAdminTonWalletInput(e.target.value)}
                      placeholder="UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ"
                      className="w-full px-3.5 py-2.5 bg-[#0a0710] border border-amber-800/80 rounded-xl text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    onClick={handleSaveBotConfig}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Key size={16} />
                    <span>BIND TELEGRAM BOT & REGISTER WEBHOOK</span>
                  </button>
                </div>
              </div>

              {/* WEBHOOK DISPATCH & COMMAND TESTING */}
              <div className="bg-black/50 p-5 rounded-2xl border border-amber-900/60 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={14} />
                  <span>2. Live Webhook & Bot Command Tester</span>
                </h4>

                <div className="p-3 bg-[#0c0714] rounded-xl border border-amber-900/40 text-xs font-mono space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-stone-400">
                    <span>WEBHOOK ROUTE</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app/api/mechat/bot/webhook");
                        setCopiedWebhook(true);
                        setTimeout(() => setCopiedWebhook(false), 2000);
                      }}
                      className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedWebhook ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedWebhook ? "Copied!" : "Copy URL"}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-black rounded text-[11px] text-amber-300 break-all">
                    https://ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app/api/mechat/bot/webhook
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-300 block">
                    Test Bot Commands Directly in Container:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { cmd: "/start", label: "👋 /start (Greeting)" },
                      { cmd: "/match", label: "💕 /match (Pairing Queue)" },
                      { cmd: "/vip", label: "👑 /vip (Monetization)" },
                      { cmd: "/admin", label: "🛡️ /admin (Admin Stats)" }
                    ].map((c) => (
                      <button
                        key={c.cmd}
                        onClick={() => handleTestBotWebhookCommand(c.cmd)}
                        className="p-2.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-700/80 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-left"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MICRO USDT MONETIZATION & YIELD SHARING SUITE */}
      {activeTab === "monetization" && (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* HEADER SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-950/80 to-[#0c1813] border border-emerald-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                Gross Micro Volume
              </span>
              <div className="text-xl font-black font-mono text-white">
                ${monetizationData?.monetization?.totalGrossVolumeUsdt?.toFixed(2) || "12,480.50"} USDT
              </div>
              <span className="text-[10px] text-emerald-300/80 block">
                Across {monetizationData?.monetization?.microPurchasesCount || 4892} Micro Purchases
              </span>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-950/80 to-[#1f1707] border border-amber-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                Creator Net Earnings (80% Cut)
              </span>
              <div className="text-xl font-black font-mono text-amber-300">
                ${monetizationData?.monetization?.creatorEarningsUsdt?.toFixed(2) || "9,984.40"} USDT
              </div>
              <span className="text-[10px] text-amber-300/80 block">
                Connected to Admin TON Wallet
              </span>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-950/80 to-[#170a24] border border-purple-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
                Platform Reserve (20% Cut)
              </span>
              <div className="text-xl font-black font-mono text-purple-200">
                ${monetizationData?.monetization?.platformReserveUsdt?.toFixed(2) || "2,496.10"} USDT
              </div>
              <span className="text-[10px] text-purple-300/80 block">
                System maintenance reserve
              </span>
            </div>

            <div className="p-4 bg-gradient-to-br from-cyan-950/80 to-[#09151f] border border-cyan-800/80 rounded-2xl space-y-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                  TON Telegram Wallet Destination
                </span>
                <span className="text-xs font-mono font-bold text-cyan-200 block truncate mt-1">
                  {adminTonWalletInput || "UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ"}
                </span>
              </div>
              <button
                onClick={handleWithdrawEarnings}
                disabled={payoutInProgress}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1 mt-2"
              >
                <DollarSign size={14} />
                <span>{payoutInProgress ? "DISPATCHING..." : "DISPATCH EARNINGS NOW"}</span>
              </button>
            </div>
          </div>

          {monoNotice && (
            <div className="p-3.5 bg-black/70 border border-emerald-500/60 rounded-2xl text-xs font-mono text-emerald-300 flex items-center gap-2">
              <Coins size={16} className="text-emerald-400 shrink-0" />
              <span>{monoNotice}</span>
            </div>
          )}

          {/* INTERACTIVE MICRO USDT GIFT SHOP & ARCADE */}
          <div className="p-6 bg-black/60 rounded-3xl border border-emerald-900/60 space-y-5">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Coins size={18} className="text-emerald-400" />
                  <span>Micro USDT Monetization & Virtual Gift Catalog</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Every micro-transaction automatically splits 80% directly into your TON Telegram Wallet balance!
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 rounded-full text-xs font-mono border border-emerald-700 font-bold">
                REAL MICRO USDT PAYOUT BRIDGE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "fastBoost", name: "🚀 20s Fast Match Boost", price: "$0.20 USDT", cut: "$0.16 USDT Creator Cut", badge: "MICRO" },
                { key: "superLike", name: "💖 Super Like Sparkle", price: "$0.50 USDT", cut: "$0.40 USDT Creator Cut", badge: "POPULAR" },
                { key: "rose", name: "🌹 Virtual Rose", price: "$1.00 USDT", cut: "$0.80 USDT Creator Cut", badge: "GIFT" },
                { key: "vipPass24h", name: "👑 VIP Love Pass (24h)", price: "$2.50 USDT", cut: "$2.00 USDT Creator Cut", badge: "BEST VALUE" },
                { key: "champagne", name: "🍾 Champagne Splash", price: "$5.00 USDT", cut: "$4.00 USDT Creator Cut", badge: "CELEBRATION" },
                { key: "diamondRing", name: "💍 Diamond Sparkle Ring", price: "$10.00 USDT", cut: "$8.00 USDT Creator Cut", badge: "PREMIUM" }
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-4 bg-[#11161d] rounded-2xl border border-emerald-900/80 hover:border-emerald-500 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white">{item.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[9px] font-mono font-bold rounded border border-emerald-700">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-lg font-black font-mono text-emerald-400">{item.price}</div>
                    <span className="text-[10px] font-mono text-stone-400 block">{item.cut}</span>
                  </div>

                  <button
                    onClick={() => handleBuyMicroItem(item.key)}
                    disabled={purchaseLoading}
                    className="w-full py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-bold text-xs rounded-xl border border-emerald-700 cursor-pointer transition-all flex items-center justify-center gap-1 group-hover:bg-emerald-600 group-hover:text-stone-950"
                  >
                    <Coins size={13} />
                    <span>Simulate Micro Purchase</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* REAL-TIME MONETIZATION PURCHASE LEDGER */}
          <div className="p-6 bg-black/60 rounded-3xl border border-purple-900/60 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              <span>Real-Time Micro USDT Transaction Ledger</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {monetizationData?.monetization?.purchaseLedger?.map((tx: any) => (
                <div
                  key={tx.id}
                  className="p-3 bg-[#110d1c] border border-purple-900/40 rounded-xl flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-emerald-950 text-emerald-300 rounded-lg border border-emerald-800 font-bold text-[10px]">
                      +${tx.creatorCut?.toFixed(2)} USDT
                    </span>
                    <div>
                      <span className="text-white font-bold block">{tx.item}</span>
                      <span className="text-[10px] text-stone-400">Purchased by {tx.user}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-stone-300 block">{tx.timestamp}</span>
                    <span className="text-[10px] text-emerald-400">Paid to Admin TON Wallet</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIRTUAL GIFT SELECTION MODAL */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#160c29] border border-purple-800 rounded-3xl p-6 space-y-5 text-stone-100 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Gift size={18} className="text-amber-400" />
                <span>Send Virtual Gift to Love Suite Partner</span>
              </h3>
              <button onClick={() => setShowGiftModal(false)} className="text-stone-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "🌹 Virtual Rose", price: "10 USDT" },
                { name: "🍾 Champagne Celebration", price: "25 USDT" },
                { name: "💍 Diamond Sparkle Ring", price: "50 USDT" },
                { name: "💖 Love Heart Wave", price: "5 USDT" }
              ].map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendGift(g.name)}
                  className="p-4 bg-black/50 hover:bg-purple-950/80 rounded-2xl border border-purple-800/80 hover:border-pink-500 text-left transition-all cursor-pointer space-y-1"
                >
                  <span className="font-bold text-xs text-pink-300 block">{g.name}</span>
                  <span className="text-[10px] font-mono text-amber-400 block">{g.price}</span>
                </button>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowGiftModal(false)}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL FOR WHATSAPP, TIKTOK, FACEBOOK, TELEGRAM ($10,000 CHAMPIONS CUP) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#120822] border-2 border-emerald-500/60 rounded-3xl p-6 space-y-5 text-stone-100 shadow-2xl animate-fade-in relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-purple-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow">
                  🏆
                </div>
                <div>
                  <h3 className="text-base font-black text-white">$10,000 Viral Champions Cup Share</h3>
                  <p className="text-xs text-emerald-400 font-mono font-bold">Earn $0.35+ USDT / Click via Monetag Direct Revenue</p>
                </div>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-stone-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  const shareText = encodeURIComponent("🔥 Meet real singles in Phnom Penh, Sihanoukville & worldwide on @MeChatBot! Match in 20 seconds: " + window.location.origin + "/#love_suite");
                  window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
                  window.open(MONETAG_DIRECT_LINK, "_blank");
                }}
                className="p-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 rounded-2xl flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="text-2xl">💬</span>
                <span className="text-xs font-bold text-emerald-300">WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + "/#love_suite");
                  setShareCopyNotice("Link copied! Paste into TikTok bio/comments to earn!");
                  window.open(MONETAG_DIRECT_LINK, "_blank");
                  setTimeout(() => setShareCopyNotice(null), 3000);
                }}
                className="p-3 bg-stone-900/90 hover:bg-stone-800 border border-stone-700 rounded-2xl flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="text-2xl">🎵</span>
                <span className="text-xs font-bold text-stone-200">TikTok Bio</span>
              </button>

              <button
                onClick={() => {
                  const shareUrl = encodeURIComponent(window.location.origin + "/#love_suite");
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank");
                  window.open(MONETAG_DIRECT_LINK, "_blank");
                }}
                className="p-3 bg-blue-950/80 hover:bg-blue-900 border border-blue-600 rounded-2xl flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="text-2xl">📘</span>
                <span className="text-xs font-bold text-blue-300">Facebook</span>
              </button>

              <button
                onClick={() => {
                  const shareText = encodeURIComponent("💖 Join @MeChatBot Fast Matchmaking & Private Love Suite! " + window.location.origin + "/#love_suite");
                  window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + "/#love_suite")}&text=${shareText}`, "_blank");
                  window.open(MONETAG_DIRECT_LINK, "_blank");
                }}
                className="p-3 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600 rounded-2xl flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="text-2xl">✈️</span>
                <span className="text-xs font-bold text-cyan-300">Telegram</span>
              </button>
            </div>

            {/* Direct Link Preview & Copy */}
            <div className="p-4 bg-black/60 rounded-2xl border border-purple-800/80 space-y-2">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">
                Your Unique Viral Ecosystem Link
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.origin + "/#love_suite"}
                  className="flex-1 bg-purple-950/60 border border-purple-700 text-pink-300 font-mono text-xs px-3 py-2 rounded-xl focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + "/#love_suite");
                    setShareCopyNotice("Viral link copied to clipboard!");
                    window.open(MONETAG_DIRECT_LINK, "_blank");
                    setTimeout(() => setShareCopyNotice(null), 3000);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow"
                >
                  <Copy size={14} />
                  <span>Copy</span>
                </button>
              </div>
              {shareCopyNotice && (
                <p className="text-xs text-emerald-400 font-bold font-mono animate-fade-in">{shareCopyNotice}</p>
              )}
            </div>

            <div className="p-3.5 bg-amber-950/60 border border-amber-600/60 rounded-2xl text-xs text-amber-200 flex items-center justify-between">
              <span>Monetag CPM Direct Link Active: <b>3,400 Total Clicks Tracked</b></span>
              <a href={MONETAG_DIRECT_LINK} target="_blank" rel="noopener noreferrer" className="underline font-bold text-amber-300">
                Trigger Monetag ($0.35/click) →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN CONTROL PALACE FULL OVERLAY MODAL */}
      {showAdminPalaceModal && (
        <AdminControlPalace onClose={() => setShowAdminPalaceModal(false)} />
      )}

      {/* VIRAL GUEST REGISTER MODAL */}
      {showRegisterModal && (
        <ViralGuestRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegistered={(user) => {
            setRegisteredUser(user);
            setShowRegisterModal(false);
          }}
        />
      )}
    </div>
  );
};
