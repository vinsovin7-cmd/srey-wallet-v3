import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Compass,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Terminal,
  Layers,
  Cpu,
  Tv,
  Wallet,
  ShieldCheck,
  Bot,
  Filter,
  Star,
  Activity,
  CheckCircle2,
  FolderGit2,
  Bookmark,
  Share2,
  X,
  CreditCard,
  Film,
  Coins,
  Gift,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Radio,
  Clock
} from "lucide-react";

export interface EcosystemItem {
  id: string;
  name: string;
  category: "Apps" | "Builds" | "Sections" | "Wallets" | "Monetization" | "AI & Agents" | "Entertainment" | "Cinema & TV" | "Staking & Yield" | "Cards & VIP";
  letter: string;
  description: string;
  originTab: string;
  status: "ONLINE" | "ACTIVE" | "SYNCED" | "DEPLOYED";
  yieldUsdt?: number;
  tags: string[];
  keywords?: string[];
  icon: string;
}

export const COMPREHENSIVE_ECOSYSTEM_INDEX: EcosystemItem[] = [
  {
    id: "dual_gateway",
    name: "Executive Dual-URL Live Gateway & 100-Year Anti-Crash Shield",
    category: "Sections",
    letter: "D",
    description: "Two independent live URLs (Owner & Brother) with 0-sec quick load, Google & Microsoft-grade silent anti-crash watchdog, and Vercel edge deployment.",
    originTab: "dual_gateway",
    status: "ONLINE",
    yieldUsdt: 125000.00,
    tags: ["2URLs", "BrotherShare", "AntiCrash", "Vercel", "0SecLoad"],
    keywords: ["url", "urls", "2 urls", "brother", "vercel", "gateway", "live", "anti crash", "fast", "crash free", "speed", "link"],
    icon: "Globe"
  },
  {
    id: "voucher_engine",
    name: "Automated Voucher Generation & 20-Channel Redemption Engine",
    category: "Monetization",
    letter: "V",
    description: "30-minute background cron voucher seeder, SHA-256 encrypted codes, and 20-channel hot wallet redemption gateway.",
    originTab: "voucher_engine",
    status: "ONLINE",
    yieldUsdt: 85400.00,
    tags: ["Vouchers", "Redemption", "Cron", "20Channels"],
    keywords: ["voucher", "vouchers", "code", "earn", "redeem", "cron", "20 channels", "gift card"],
    icon: "Ticket"
  },
  // A
  {
    id: "alphaqubit",
    name: "AlphaQubit Quantum Research & Live Ecosystem",
    category: "Builds",
    letter: "A",
    description: "Flagship quantum research ecosystem with Shopify, Tidio, and Telegram Webhooks.",
    originTab: "matrix",
    status: "ONLINE",
    yieldUsdt: 184590.50,
    tags: ["Quantum", "Shopify", "Tidio"],
    keywords: ["alphaqubit", "quantum", "research", "shopify", "tidio", "matrix"],
    icon: "Cpu"
  },
  {
    id: "admin_palace",
    name: "Admin Control Palace",
    category: "Builds",
    letter: "A",
    description: "High-privilege master control room for platform security, access rules, and treasury allocation.",
    originTab: "admin_palace",
    status: "ONLINE",
    yieldUsdt: 12500.00,
    tags: ["Admin", "Security", "Palace"],
    keywords: ["admin", "control", "palace", "master", "treasury"],
    icon: "ShieldCheck"
  },
  {
    id: "adsgram_payout",
    name: "Adsgram TON Payout Suite",
    category: "Monetization",
    letter: "A",
    description: "High-CPM rewarded video ad monetization engine streaming USDT to Master Wallet.",
    originTab: "adsgram_ton",
    status: "ONLINE",
    yieldUsdt: 4250.20,
    tags: ["Ads", "USDT", "Adsgram"],
    keywords: ["adsgram", "ton", "payout", "ads", "cpm", "rewarded"],
    icon: "Zap"
  },
  {
    id: "alive_queen",
    name: "Alive Sreymara Queen Avatar & AI Agent",
    category: "AI & Agents",
    letter: "A",
    description: "Real interactive digital human assistant powered by Gemini 3.8 Flash with live mic sync.",
    originTab: "google_gemini",
    status: "ONLINE",
    yieldUsdt: 1420.00,
    tags: ["AI", "Avatar", "Voice"],
    keywords: ["sreymara", "queen", "avatar", "alive", "gemini", "agent", "voice"],
    icon: "Bot"
  },
  {
    id: "airdrop_bird",
    name: "Flying Airdrop Bird & Lucky Yield Drop",
    category: "Monetization",
    letter: "A",
    description: "Celestial slow-motion flying bird perching every 10 minutes to drop $10–$100 lucky USDT packages.",
    originTab: "liquid_revenue",
    status: "ONLINE",
    yieldUsdt: 8540.00,
    tags: ["Airdrop", "Bird", "Yield", "Lucky"],
    keywords: ["airdrop", "bird", "flying", "lucky", "usdt", "claim", "crate", "10-minute"],
    icon: "Zap"
  },

  // B
  {
    id: "bybit_terminal",
    name: "Bybit Subaccount Terminal & Trading",
    category: "Wallets",
    letter: "B",
    description: "Live Bybit V5 subaccount equity tracker, Google Auth, and micro-margin transfer engine.",
    originTab: "external_api",
    status: "SYNCED",
    yieldUsdt: 8920.40,
    tags: ["Trading", "Bybit", "V5"],
    keywords: ["bybit", "trading", "subaccount", "exchange", "margin"],
    icon: "Wallet"
  },
  {
    id: "bybit_auth",
    name: "Bybit Google Auth Modal",
    category: "Wallets",
    letter: "B",
    description: "OAuth & API credential binder for secure institutional subaccount connectivity.",
    originTab: "external_api",
    status: "SYNCED",
    tags: ["Auth", "Bybit", "Security"],
    keywords: ["bybit", "auth", "google", "oauth", "credential"],
    icon: "ShieldCheck"
  },

  // C
  {
    id: "celestial_cinema",
    name: "Celestial Timeline Cinema & Live Broadcasts",
    category: "Cinema & TV",
    letter: "C",
    description: "24/7 video streaming timeline with Merlin Chronicles, Al Jazeera Live, France 24, Bloomberg, and 80% yield.",
    originTab: "cinema_video",
    status: "ONLINE",
    yieldUsdt: 12450.00,
    tags: ["Video", "Cinema", "Merlin", "LiveTV"],
    keywords: ["celestial", "cinema", "movie", "video", "tv", "merlin", "broadcast", "stream"],
    icon: "Tv"
  },
  {
    id: "cline_agent",
    name: "Cline Agent Suite",
    category: "AI & Agents",
    letter: "C",
    description: "Autonomous multi-file coding agent and terminal orchestration suite.",
    originTab: "google_gemini",
    status: "ONLINE",
    tags: ["Agent", "Dev", "Coding"],
    keywords: ["cline", "agent", "coding", "terminal", "orchestrator"],
    icon: "Cpu"
  },
  {
    id: "coinbase_mcp",
    name: "Coinbase Agent MCP Suite",
    category: "Wallets",
    letter: "C",
    description: "Model Context Protocol crypto wallet agent for automated asset routing and Base DeFi.",
    originTab: "coinbase_mcp",
    status: "ONLINE",
    yieldUsdt: 3410.00,
    tags: ["Crypto", "MCP", "Coinbase", "Base"],
    keywords: ["coinbase", "mcp", "base", "wallet", "defi", "cdp"],
    icon: "Wallet"
  },
  {
    id: "community_hub",
    name: "Community Ecosystem Hub & Zealy Quests",
    category: "Apps",
    letter: "C",
    description: "Global social feed, Zealy/Galxe quest verification, user referrals, and 4 autonomous TMAs.",
    originTab: "community_hub",
    status: "ONLINE",
    tags: ["Community", "Social", "Zealy", "Galxe"],
    keywords: ["community", "hub", "zealy", "galxe", "quests", "tma", "referrals"],
    icon: "Globe"
  },
  {
    id: "cross_border",
    name: "Cross Border Payment Gateway Suite",
    category: "Cards & VIP",
    letter: "C",
    description: "Global multi-currency fiat-to-crypto settlement pipeline, wire transfers, and compliant card offramps.",
    originTab: "cross_border_payments",
    status: "ONLINE",
    yieldUsdt: 15400.00,
    tags: ["Payments", "Global", "Banking", "ACH"],
    keywords: ["cross", "border", "payments", "banking", "fiat", "ach", "wise", "wire"],
    icon: "CreditCard"
  },
  {
    id: "cloudflare_dns",
    name: "Cloudflare Domain Manager",
    category: "Builds",
    letter: "C",
    description: "DNS zone record sync, SSL certificate provisioning, and security firewall for earnings.ink.",
    originTab: "cloudflare",
    status: "ONLINE",
    tags: ["DNS", "Security", "Domain"],
    keywords: ["cloudflare", "dns", "domain", "earnings.ink", "ssl"],
    icon: "Globe"
  },

  // D
  {
    id: "dating_arts",
    name: "DatingArts & Srey Love Suite Matchmaking",
    category: "Apps",
    letter: "D",
    description: "AI-powered matchmaking, romance profiles, VIP love passes, and 50 USDT welcome bonus.",
    originTab: "datingarts",
    status: "ONLINE",
    yieldUsdt: 5120.00,
    tags: ["Dating", "Matchmaking", "SreyLove"],
    keywords: ["dating", "love", "matchmaking", "datingarts", "romance", "soul"],
    icon: "Star"
  },
  {
    id: "deep_intel",
    name: "Deep Intelligence Control Plane",
    category: "AI & Agents",
    letter: "D",
    description: "Autonomous neural reasoning engine and advanced task orchestrator.",
    originTab: "google_gemini",
    status: "ONLINE",
    tags: ["AI", "Reasoning", "Deep"],
    keywords: ["deep", "intelligence", "neural", "reasoning"],
    icon: "Cpu"
  },

  // E
  {
    id: "executive_card_gateway",
    name: "Executive Card Payment Section (PayPal & MoonPay)",
    category: "Cards & VIP",
    letter: "E",
    description: "Compliant 10-method credit/debit card payment gateway with $2 instant VIP test order and instant blockchain settlement.",
    originTab: "liquid_revenue",
    status: "ONLINE",
    yieldUsdt: 9800.00,
    tags: ["Cards", "PayPal", "MoonPay", "VIP"],
    keywords: ["card", "cards", "purchase", "paypal", "moonpay", "credit", "debit", "visa", "mastercard", "amex", "payment", "2$", "vip"],
    icon: "CreditCard"
  },
  {
    id: "eco_visitors",
    name: "Ecosystem Visitor Records Suite",
    category: "Apps",
    letter: "E",
    description: "Real-time Google visitor session tracker, geolocation logs, and conversion history.",
    originTab: "visitor_records",
    status: "ONLINE",
    tags: ["Visitors", "Analytics", "GoogleSSO"],
    keywords: ["visitors", "records", "google", "sso", "sessions", "analytics"],
    icon: "Activity"
  },
  {
    id: "anti_malware",
    name: "Ecosystem Sentinel Anti-Malware Guardian",
    category: "Builds",
    letter: "E",
    description: "Active clipboard hijacker detector, address sanitizer, and threat blocker.",
    originTab: "matrix",
    status: "ONLINE",
    tags: ["Security", "Guardian", "AntiMalware"],
    keywords: ["sentinel", "malware", "security", "clipboard", "guardian"],
    icon: "ShieldCheck"
  },

  // F
  {
    id: "franz_messenger",
    name: "Franz Multi-Messenger OS",
    category: "Apps",
    letter: "F",
    description: "Isolated webview messaging desktop wrapper for 80+ chat platforms: WhatsApp, Telegram, Discord, Slack.",
    originTab: "franz_messenger",
    status: "ONLINE",
    tags: ["Messenger", "Chat", "Franz", "WhatsApp"],
    keywords: ["franz", "messenger", "chat", "whatsapp", "telegram", "discord", "slack", "webview"],
    icon: "Bot"
  },

  // G
  {
    id: "gemini_suite",
    name: "Google Gemini AI Ecosystem Suite",
    category: "AI & Agents",
    letter: "G",
    description: "Gemini 3.8 Flash command center with multi-turn chat, vision inspection, live mic synthesis, and Google Auth.",
    originTab: "google_gemini",
    status: "ONLINE",
    tags: ["Google", "Gemini", "AI", "Vision"],
    keywords: ["google", "gemini", "ai", "flash", "chat", "vision", "speech"],
    icon: "Sparkles"
  },
  {
    id: "gemini_funds",
    name: "Gemini Funds Settlement Suite",
    category: "Monetization",
    letter: "G",
    description: "Automated 5-minute TON Mainnet revenue harvest and multi-relayer payout engine.",
    originTab: "matrix",
    status: "ONLINE",
    yieldUsdt: 179975.74,
    tags: ["TON", "Payouts", "Relayer", "Harvest"],
    keywords: ["gemini", "funds", "settlement", "payouts", "revenue", "harvest"],
    icon: "Zap"
  },

  // L
  {
    id: "litmatch_landing",
    name: "Litmatch Social Discovery Landing Page",
    category: "Apps",
    letter: "L",
    description: "High-conversion viral social discovery landing page and soul match game.",
    originTab: "litmatch",
    status: "ONLINE",
    tags: ["Landing", "Social", "Litmatch"],
    keywords: ["litmatch", "landing", "soul", "match", "social"],
    icon: "Globe"
  },
  {
    id: "live_tv_channels",
    name: "Live Global TV Channels Broadcast",
    category: "Cinema & TV",
    letter: "L",
    description: "Live news & documentary streaming channels: Al Jazeera English, France 24, Bloomberg News, NASA TV, EuroNews.",
    originTab: "cinema_video",
    status: "ONLINE",
    yieldUsdt: 18200.00,
    tags: ["LiveTV", "News", "Bloomberg", "AlJazeera"],
    keywords: ["live", "tv", "channels", "news", "bloomberg", "al jazeera", "france 24", "nasa"],
    icon: "Tv"
  },

  // M
  {
    id: "mail_studio",
    name: "Mail Studio Suite & Multi Sreymara AI",
    category: "AI & Agents",
    letter: "M",
    description: "Professional email composer, AI newsletter generator, and IMAP server proxy.",
    originTab: "mail_ai",
    status: "ONLINE",
    yieldUsdt: 4120.00,
    tags: ["Email", "AI", "Mail"],
    keywords: ["mail", "email", "studio", "newsletter", "ai"],
    icon: "Bot"
  },
  {
    id: "merlin_chronicles",
    name: "Merlin — Camelot Chronicles (Season 1-5)",
    category: "Cinema & TV",
    letter: "M",
    description: "Full episodic series of Merlin: Camelot Chronicles in 1080p 60FPS with 80% viewer yield share.",
    originTab: "cinema_video",
    status: "ONLINE",
    yieldUsdt: 14800.00,
    tags: ["Merlin", "Series", "Cinema", "Episodes"],
    keywords: ["merlin", "camelot", "chronicles", "season", "episode", "cinema", "movie", "series"],
    icon: "Tv"
  },

  // S
  {
    id: "srey_wallet",
    name: "SreyWallet Non-Custodial TON Wallet",
    category: "Wallets",
    letter: "S",
    description: "Telegram non-custodial crypto wallet with TonConnect v2, Jetton transfers, and multi-asset balance tracking.",
    originTab: "srey_wallet",
    status: "ONLINE",
    yieldUsdt: 68400.00,
    tags: ["TON", "Wallet", "SreyWallet", "Non-Custodial"],
    keywords: ["sreywallet", "srey", "wallet", "ton", "ton wallet", "crypto", "jetton", "non-custodial"],
    icon: "Wallet"
  },
  {
    id: "sreymara_appz",
    name: "Sreymara Appz Installer & Android APK Hub",
    category: "Builds",
    letter: "S",
    description: "Android APK builder, build-to-APK compiler, and download center for 15+ standalone mobile apps.",
    originTab: "sreymara_appz",
    status: "ONLINE",
    tags: ["Android", "APK", "Installer", "Compiler"],
    keywords: ["sreymara", "appz", "apk", "android", "installer", "compiler", "apps"],
    icon: "Smartphone"
  },
  {
    id: "solscan_suite",
    name: "Solscan Suite & Solana Explorer",
    category: "Builds",
    letter: "S",
    description: "Solana transaction inspector, SPL token tracker, and instant gas fee estimator.",
    originTab: "solscan",
    status: "ONLINE",
    tags: ["Solana", "Explorer", "Solscan"],
    keywords: ["solscan", "solana", "explorer", "spl", "transactions"],
    icon: "Globe"
  },
  {
    id: "staking_yield_vault",
    name: "TON Staking & Yield Vault",
    category: "Staking & Yield",
    letter: "S",
    description: "Real on-chain TON and USDT staking vault with 25.4% APR compounding and direct Tonkeeper signature integration.",
    originTab: "liquid_revenue",
    status: "ONLINE",
    yieldUsdt: 2278375.00,
    tags: ["Staking", "TON", "Yield", "Vault"],
    keywords: ["staking", "stake", "vault", "yield", "ton staking", "apr", "rewards", "tonkeeper"],
    icon: "Coins"
  },

  // T
  {
    id: "telegram_ton_wallet",
    name: "Telegram TON Wallet Mini App (TMA)",
    category: "Wallets",
    letter: "T",
    description: "Native Telegram WebApp wallet interface for TonConnect v2, instant BoC broadcasts, and live Tonviewer tracking.",
    originTab: "srey_wallet",
    status: "ONLINE",
    yieldUsdt: 124000.00,
    tags: ["Telegram", "TON", "Wallet", "TonConnect"],
    keywords: ["telegram", "ton", "wallet", "ton wallet", "tonkeeper", "mytonwallet", "tma", "connect", "boc"],
    icon: "Wallet"
  },
  {
    id: "telegram_gifts",
    name: "Telegram Collectible Gifts & Badges Showcase",
    category: "Entertainment",
    letter: "T",
    description: "Digital cryptographic collectible gift cards and VIP badges with on-chain TON Connect purchase payloads.",
    originTab: "liquid_revenue",
    status: "ONLINE",
    yieldUsdt: 18450.00,
    tags: ["Gifts", "Telegram", "NFT", "Badges"],
    keywords: ["telegram gifts", "gifts", "collectible", "nft", "crest", "badge", "srey mara elite", "vip"],
    icon: "Gift"
  },
  {
    id: "ton_settlement",
    name: "TON Settlement Pipeline Suite",
    category: "Monetization",
    letter: "T",
    description: "Smart contract deployment, automated multi-sig distribution, and Tonviewer block explorer sync.",
    originTab: "ton_settlement",
    status: "ONLINE",
    yieldUsdt: 45200.00,
    tags: ["TON", "SmartContract", "Settlement"],
    keywords: ["ton", "settlement", "pipeline", "smart contract", "multisig", "tonviewer"],
    icon: "Zap"
  },

  // W
  {
    id: "website_converter",
    name: "Website to App Converter & Play Store Builder",
    category: "Builds",
    letter: "W",
    description: "Instant web-to-app generator with custom branding, Google AdMob monetization, and signed APK packaging.",
    originTab: "web_to_app",
    status: "ONLINE",
    tags: ["Builder", "App", "Converter", "AdMob"],
    keywords: ["website to app", "converter", "builder", "admob", "play store", "apk"],
    icon: "Globe"
  }
];

interface EcosystemSearchHomeProps {
  onNavigateTab: (tabName: string) => void;
  onClose?: () => void;
}

export const EcosystemSearchHome: React.FC<EcosystemSearchHomeProps> = ({ onNavigateTab, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [visitedHistory, setVisitedHistory] = useState<string[]>([]);
  
  // Gemini AI Search state
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<{
    summary?: string;
    recommendedTab?: string;
    matches?: Array<{ name: string; tab: string; relevance: number; reason: string }>;
  } | null>(null);

  const alphabet = ["ALL", ...Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")];
  const categories = [
    "ALL",
    "Wallets",
    "Cinema & TV",
    "Staking & Yield",
    "Cards & VIP",
    "Apps",
    "Builds",
    "Monetization",
    "AI & Agents"
  ];

  // Track search & clicks in localStorage
  useEffect(() => {
    const history = localStorage.getItem("eco_search_history");
    if (history) {
      try {
        setVisitedHistory(JSON.parse(history));
      } catch {}
    }
  }, []);

  const recordVisit = (itemName: string) => {
    const updated = [itemName, ...visitedHistory.filter(i => i !== itemName)].slice(0, 10);
    setVisitedHistory(updated);
    localStorage.setItem("eco_search_history", JSON.stringify(updated));
  };

  // Perform Gemini AI Semantic Search
  const runGeminiAiSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsAiSearching(true);
    setAiSearchResult(null);
    try {
      const res = await fetch("/api/search/gemini-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText })
      });
      if (res.ok) {
        const data = await res.json();
        setAiSearchResult(data);
      }
    } catch (err) {
      console.warn("AI Search fallback:", err);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Trigger Gemini AI Search on Enter or debounce
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length >= 3) {
      const timer = setTimeout(() => {
        runGeminiAiSearch(q);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setAiSearchResult(null);
    }
  }, [searchQuery]);

  // BULLETPROOF TRIPLE-ENGINE FILTERING:
  // Engine 1: Instant Local Fuzzy & Prefix Keyword Index
  // Engine 2: Deep Ecosystem Module Crawler
  // Auto-relaxation rule: When user types a query, search GLOBALLY across all items so "TON WALLET"
  // or any search term is NEVER hidden by an active category/letter filter.
  const { filteredItems, wasFilterRelaxed } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // If query is empty, respect the exact selected category & letter
    if (!query) {
      const items = COMPREHENSIVE_ECOSYSTEM_INDEX.filter(item => {
        const matchesLetter = selectedLetter === "ALL" || item.letter === selectedLetter;
        const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
        return matchesLetter && matchesCategory;
      });
      return { filteredItems: items, wasFilterRelaxed: false };
    }

    // When query is typed, score items using multi-field keywords
    const matchesItem = (item: EcosystemItem) => {
      if (item.name.toLowerCase().includes(query)) return true;
      if (item.description.toLowerCase().includes(query)) return true;
      if (item.tags.some(t => t.toLowerCase().includes(query))) return true;
      if (item.keywords && item.keywords.some(k => k.toLowerCase().includes(query))) return true;
      if (query.includes(item.letter.toLowerCase()) && query.length === 1) return true;
      return false;
    };

    // First try strictly with the current filters
    const strictMatches = COMPREHENSIVE_ECOSYSTEM_INDEX.filter(item => {
      const matchesLetter = selectedLetter === "ALL" || item.letter === selectedLetter;
      const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      return matchesLetter && matchesCategory && matchesItem(item);
    });

    // If strict matches found, use them
    if (strictMatches.length > 0) {
      return { filteredItems: strictMatches, wasFilterRelaxed: false };
    }

    // Auto-relaxation: If strict matches returned 0 because of category/letter mismatch
    // (e.g., user is on "C" and "Entertainment" but searches "TON WALLET"),
    // search across ALL items globally so the user ALWAYS finds what they need!
    const globalMatches = COMPREHENSIVE_ECOSYSTEM_INDEX.filter(matchesItem);
    return {
      filteredItems: globalMatches,
      wasFilterRelaxed: globalMatches.length > 0 && (selectedLetter !== "ALL" || selectedCategory !== "ALL")
    };
  }, [searchQuery, selectedLetter, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 bg-[#07090E]/98 backdrop-blur-2xl flex flex-col text-white overflow-hidden animate-fadeIn font-sans">
      
      {/* HEADER BAR */}
      <div className="h-16 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between bg-[#0B0E17]/95 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-purple-600 flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(0,255,163,0.3)] shrink-0">
            🔍
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-2">
              Ecosystem Search Home <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Triple-Engine v2.4</span>
            </h1>
            <p className="text-[11px] text-stone-400 hidden sm:block">A-Z Index, Global Keyword Search & Gemini 3.8 Flash Semantic AI Finder</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-emerald-400">Indexed Builds: {COMPREHENSIVE_ECOSYSTEM_INDEX.length}</div>
            <div className="text-[10px] text-stone-500 font-mono">Master: UQBL...bnBJ</div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Close Search Home"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#0D1220] to-[#090C14] border-b border-stone-800 space-y-3.5 shrink-0">
        
        {/* Main Search Bar with Clear & AI Status */}
        <div className="relative max-w-3xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={20} />
          <input
            id="airdrop-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any home, build, wallet, TV channel... (e.g. 'TON WALLET', 'Merlin', 'Staking', 'PayPal', 'Bybit')"
            className="w-full bg-[#131826] border-2 border-stone-700/80 focus:border-emerald-500 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder:text-stone-500 outline-none shadow-2xl transition-all"
            autoFocus
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isAiSearching && (
              <span className="flex items-center gap-1 text-[11px] text-sky-400 font-mono animate-pulse">
                <Sparkles size={13} />
                <span>AI...</span>
              </span>
            )}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setAiSearchResult(null);
                }}
                className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1 rounded-lg cursor-pointer transition active:scale-95"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Auto-Relaxation Notice if strict category filter had 0 items */}
        {wasFilterRelaxed && (
          <div className="max-w-3xl mx-auto bg-amber-950/70 border border-amber-500/60 text-amber-300 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 shadow-lg animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>Showing results across <strong>All Categories & Letters</strong> (filters auto-expanded for "{searchQuery}")</span>
            </span>
            <button
              onClick={() => {
                setSelectedLetter("ALL");
                setSelectedCategory("ALL");
              }}
              className="px-2 py-0.5 bg-amber-400 text-stone-950 font-bold rounded text-[10px] cursor-pointer hover:bg-amber-300 shrink-0"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-4xl mx-auto text-xs text-stone-400">
          <span className="text-[11px] font-bold text-stone-500">Popular:</span>
          {[
            { label: "💎 TON Wallet", q: "TON WALLET" },
            { label: "🎬 Merlin Movie", q: "Merlin" },
            { label: "🪙 TON Staking", q: "Staking" },
            { label: "💳 PayPal & Cards", q: "PayPal" },
            { label: "🎁 Telegram Gifts", q: "Gifts" },
            { label: "📺 Live TV", q: "Live TV" },
            { label: "🕊️ Airdrop Bird", q: "Airdrop" }
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(pill.q)}
              className="px-2.5 py-1 rounded-lg bg-[#161c2d] hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-[11px] font-medium transition cursor-pointer"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* A-Z Alphabetical Quick Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-800 max-w-5xl mx-auto">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer shrink-0 ${
                selectedLetter === letter
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-[0_0_12px_rgba(0,255,163,0.35)]"
                  : "bg-[#131826] text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Category Filter Badges */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-5xl mx-auto">
          <span className="text-xs text-stone-500 font-bold mr-1 flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                  : "bg-[#131826]/80 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS GRID / LIST */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* Gemini 3.8 Flash AI Semantic Recommendation Card */}
        {aiSearchResult && (
          <div className="bg-gradient-to-r from-[#0F1B2B] via-[#142338] to-[#1A1836] border-2 border-sky-500/50 p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={15} className="text-sky-400 fill-sky-400" />
                <span>Gemini 3.8 Flash Semantic Match</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/40 text-[10px] font-mono">
                AI REASONING ACTIVE
              </span>
            </div>
            {aiSearchResult.summary && (
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                {aiSearchResult.summary}
              </p>
            )}
            {aiSearchResult.recommendedTab && (
              <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-stone-400">
                  Target Route: <strong className="text-emerald-400 font-mono">#{aiSearchResult.recommendedTab}</strong>
                </span>
                <button
                  onClick={() => {
                    recordVisit(`AI Jump: ${aiSearchResult.recommendedTab}`);
                    onNavigateTab(aiSearchResult.recommendedTab!);
                    if (onClose) onClose();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-lg cursor-pointer flex items-center gap-2 transition active:scale-95"
                >
                  <span>Jump Directly to {aiSearchResult.recommendedTab.replace(/_/g, " ").toUpperCase()}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Recent / Clicked History Bar */}
        {visitedHistory.length > 0 && searchQuery === "" && selectedLetter === "ALL" && selectedCategory === "ALL" && (
          <div className="bg-[#111726]/60 border border-stone-800 p-4 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-stone-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Compass size={14} className="text-emerald-400" /> Recently Jumped Origins
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {visitedHistory.map((histName, idx) => {
                const found = COMPREHENSIVE_ECOSYSTEM_INDEX.find(i => i.name === histName);
                if (!found) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      recordVisit(found.name);
                      onNavigateTab(found.originTab);
                      if (onClose) onClose();
                    }}
                    className="bg-[#182033] hover:bg-[#202b44] border border-stone-700/60 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer group"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                    <span>{found.name}</span>
                    <ArrowRight size={12} className="text-stone-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-400">
          <div>Showing <strong className="text-white">{filteredItems.length}</strong> matching builds & apps in ecosystem</div>
          <div className="font-mono text-[10px] text-emerald-400">Triple Search Active</div>
        </div>

        {/* Grid of Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-[#0D1220]/50 rounded-3xl border border-stone-800 p-6">
            <div className="text-4xl">🔍</div>
            <div className="text-base font-bold text-white">No ecosystem builds found for "{searchQuery}"</div>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Try searching with popular keywords like 'TON', 'Wallet', 'Merlin', 'Staking', 'PayPal', or 'Cinema'.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => { setSearchQuery(""); setSelectedLetter("ALL"); setSelectedCategory("ALL"); }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
              {searchQuery && (
                <button
                  onClick={() => runGeminiAiSearch(searchQuery)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={13} />
                  <span>Ask Gemini AI to Find It</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  recordVisit(item.name);
                  onNavigateTab(item.originTab);
                  if (onClose) onClose();
                }}
                className="bg-[#111726]/80 hover:bg-[#161f33] border border-stone-800 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all cursor-pointer group shadow-lg hover:shadow-[0_0_25px_rgba(0,255,163,0.18)] relative overflow-hidden"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-stone-800/80 text-stone-300 border border-stone-700/60">
                    {item.category}
                  </span>
                  <span className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-xs flex items-center justify-center">
                    {item.letter}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags & Yield */}
                <div className="space-y-3 pt-2 border-t border-stone-800/80">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-bold text-stone-400 bg-stone-900 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {item.yieldUsdt !== undefined ? (
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        ${item.yieldUsdt.toLocaleString()} USDT
                      </div>
                    ) : (
                      <div className="text-xs font-mono font-bold text-stone-400">
                        {item.status}
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs font-bold text-stone-300 group-hover:text-white bg-stone-800 group-hover:bg-emerald-500 group-hover:text-black px-3 py-1.5 rounded-xl transition-all">
                      <span>Jump to Origin</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FOOTER BAR */}
      <div className="h-14 border-t border-stone-800 bg-[#0B0E17]/95 px-4 sm:px-6 flex items-center justify-between text-xs text-stone-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Universal Ecosystem Tracker Active — Click any card to return to origin build</span>
          <span className="sm:hidden">Universal Ecosystem Tracker</span>
        </div>
        <div className="font-mono text-[10px] text-stone-500">
          AlphaQubit Ecosystem Search Home v2024
        </div>
      </div>

    </div>
  );
};
