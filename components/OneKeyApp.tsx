import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Bell,
  Grid,
  Copy,
  Check,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  MoreHorizontal,
  SlidersHorizontal,
  Wallet,
  TrendingUp,
  Compass,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  QrCode,
  RefreshCw,
  X,
  Mail,
  LogOut,
  Send,
  Fuel,
  Info,
  DollarSign,
  Lock,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingDown,
  Share2,
  ChevronRight,
  Sparkles,
  Layers,
  Activity,
  Maximize2
} from "lucide-react";

export interface OneKeyToken {
  symbol: string;
  name: string;
  price: number;
  change: string;
  balance: number;
  usdValue: number;
  network: string;
  isGas?: boolean;
  iconUrl?: string;
}

export interface OneKeyTx {
  id: string;
  type: "deposit" | "transfer" | "swap" | "reward_claim";
  token: string;
  amount: number;
  source?: string;
  destination?: string;
  timestamp: string;
  status: "confirmed" | "completed" | "pending";
  txHash: string;
  network: string;
}

interface PerpPosition {
  id: string;
  pair: string;
  side: "long" | "short";
  leverage: number;
  sizeUsd: number;
  marginUsd: number;
  entryPrice: number;
  markPrice: number;
  pnlUsd: number;
  roePercent: number;
  liquidationPrice: number;
  openedAt: string;
}

interface OneKeyAppProps {
  onClose?: () => void;
  className?: string;
  isEmbedded?: boolean;
}

export const OneKeyApp: React.FC<OneKeyAppProps> = ({
  onClose,
  className = "",
  isEmbedded = false
}) => {
  // Account & Auth State
  const [userEmail, setUserEmail] = useState<string>("kansasnelly@gmail.com");
  const [userName, setUserName] = useState<string>("Kansas Nelly");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string>("TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG");
  const [accountName, setAccountName] = useState<string>("Account #1");

  // Balances & Data
  const [tokens, setTokens] = useState<OneKeyToken[]>([
    {
      symbol: "USDT",
      name: "Tether USD",
      price: 1.00,
      change: "+0.01%",
      balance: 4.35,
      usdValue: 4.35,
      network: "Tron (TRC-20)",
      isGas: false
    },
    {
      symbol: "TRX",
      name: "TRON",
      price: 0.339,
      change: "-0.73%",
      balance: 15.00,
      usdValue: 5.08,
      network: "Tron (TRC-20)",
      isGas: true
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      price: 1.00,
      change: "0.00%",
      balance: 0.0,
      usdValue: 0.0,
      network: "Tron (TRC-20)",
      isGas: false
    }
  ]);
  const [totalUsdValue, setTotalUsdValue] = useState<number>(4.35);
  const [transactions, setTransactions] = useState<OneKeyTx[]>([
    {
      id: "ok-init-1",
      type: "deposit",
      token: "USDT",
      amount: 4.35,
      source: "OneKey Mobile App Sync",
      destination: "TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG",
      timestamp: new Date().toISOString(),
      status: "confirmed",
      txHash: "f3353f8afbbcb78d3f6198dd3550201d5cf6547027d3d4c9e57dc510f77cf672",
      network: "Tron (TRC-20)"
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<string>("Just now");

  // Active Navigation
  const [activeTab, setActiveTab] = useState<"spot" | "history">("spot");
  const [bottomNav, setBottomNav] = useState<"wallet" | "trade" | "perps" | "discover">("wallet");

  // In-App Tronscan Explorer Sub-tab (Inside Discover)
  const [discoverTab, setDiscoverTab] = useState<"tronscan" | "dapps">("tronscan");
  const [tronscanSearchQuery, setTronscanSearchQuery] = useState<string>("");
  const [selectedTxDetail, setSelectedTxDetail] = useState<OneKeyTx | null>(null);

  // Modals & Popups
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [showSwapModal, setShowSwapModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);

  // Send Form State
  const [sendToken, setSendToken] = useState<string>("USDT");
  const [sendAmount, setSendAmount] = useState<string>("1.00");
  const [sendDestination, setSendDestination] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);

  // Swap Form State
  const [swapFrom, setSwapFrom] = useState<string>("USDT");
  const [swapTo, setSwapTo] = useState<string>("TRX");
  const [swapAmount, setSwapAmount] = useState<string>("1.00");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapFeedback, setSwapFeedback] = useState<string | null>(null);

  // Auth Form State
  const [inputEmail, setInputEmail] = useState<string>("kansasnelly@gmail.com");
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Manual Sync State (for matching phone app 4.35 USDT)
  const [syncUsdtInput, setSyncUsdtInput] = useState<string>("4.35");

  // UI Toast Copy
  const [copied, setCopied] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("02:15");

  // =========================================================================
  // PERPETUALS (PERPS) TRADING TERMINAL STATE
  // =========================================================================
  const [perpPair, setPerpPair] = useState<string>("TRX/USDT");
  const [perpSide, setPerpSide] = useState<"long" | "short">("long");
  const [perpLeverage, setPerpLeverage] = useState<number>(20);
  const [perpMarginAmount, setPerpMarginAmount] = useState<string>("2.00");
  const [perpOrderType, setPerpOrderType] = useState<"market" | "limit">("market");
  const [perpFeedback, setPerpFeedback] = useState<string | null>(null);
  const [perpChartTimeframe, setPerpChartTimeframe] = useState<string>("15m");

  // Pair Prices & Details
  const PERP_PAIRS: Record<string, { price: number; change24h: string; high: number; low: number; volume: string }> = {
    "TRX/USDT": { price: 0.3394, change24h: "+2.48%", high: 0.3448, low: 0.3280, volume: "148.6M" },
    "BTC/USDT": { price: 91420.5, change24h: "+1.95%", high: 92800.0, low: 89900.0, volume: "3.2B" },
    "ETH/USDT": { price: 3410.2, change24h: "+3.10%", high: 3480.0, low: 3310.0, volume: "1.4B" },
    "SOL/USDT": { price: 198.7, change24h: "+4.65%", high: 204.5, low: 189.0, volume: "890M" }
  };

  const currentPairData = PERP_PAIRS[perpPair] || PERP_PAIRS["TRX/USDT"];

  // Active Positions
  const [positions, setPositions] = useState<PerpPosition[]>([
    {
      id: "pos-1",
      pair: "TRX/USDT",
      side: "long",
      leverage: 20,
      sizeUsd: 40.0,
      marginUsd: 2.0,
      entryPrice: 0.3380,
      markPrice: 0.3394,
      pnlUsd: 0.165,
      roePercent: 8.25,
      liquidationPrice: 0.3225,
      openedAt: "10m ago"
    }
  ]);

  // Live PnL ticker effect for perps
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          const delta = (Math.random() - 0.48) * 0.015;
          const newPnl = parseFloat((pos.pnlUsd + delta).toFixed(3));
          const newRoe = parseFloat(((newPnl / pos.marginUsd) * 100).toFixed(2));
          return {
            ...pos,
            pnlUsd: newPnl,
            roePercent: newRoe
          };
        })
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Clock Update
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      setCurrentTime(`${h}:${m}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live state from backend & Tronscan
  const fetchOneKeyState = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/onekey/account");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.tokens)) setTokens(data.tokens);
          if (typeof data.totalUsdValue === "number") setTotalUsdValue(data.totalUsdValue);
          if (Array.isArray(data.transactions)) setTransactions(data.transactions);
          if (data.walletAddress) setWalletAddress(data.walletAddress);
          if (data.userEmail) setUserEmail(data.userEmail);
          if (data.userName) setUserName(data.userName);
          if (data.accountName) setAccountName(data.accountName);
          setIsLoggedIn(data.isLoggedIn ?? true);
          setLastSynced("Just now");
        }
      }
    } catch (err) {
      console.error("[OneKey UI] Failed to fetch account state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOneKeyState();
    const pollInterval = setInterval(fetchOneKeyState, 10000);
    return () => clearInterval(pollInterval);
  }, [fetchOneKeyState]);

  // Handle Copy Address
  const handleCopyAddress = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Google Auth Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail || !inputEmail.includes("@")) {
      setAuthFeedback("Please enter a valid email address.");
      return;
    }
    try {
      const res = await fetch("/api/onekey/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setUserEmail(data.userEmail);
        setUserName(data.userName);
        setIsLoggedIn(true);
        setAuthFeedback("✅ Successfully authenticated with Google!");
        setTimeout(() => setShowAuthModal(false), 1000);
        fetchOneKeyState();
      } else {
        setAuthFeedback("Authentication failed. Please try again.");
      }
    } catch (err: any) {
      setAuthFeedback(`Error: ${err.message}`);
    }
  };

  // Handle Send / Withdraw
  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      setSendFeedback("⚠️ Please enter a valid amount.");
      return;
    }
    if (!sendDestination.trim() || sendDestination.trim().length < 8) {
      setSendFeedback("⚠️ Please enter a valid destination TRC-20 wallet address.");
      return;
    }

    setIsSending(true);
    setSendFeedback(null);

    try {
      const res = await fetch("/api/onekey/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: sendToken,
          amount,
          destinationAddress: sendDestination.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSendFeedback(`🚀 Sent ${amount} ${sendToken} to ${sendDestination.slice(0, 6)}... Tx: ${data.tx?.txHash.slice(0, 10)}...`);
        fetchOneKeyState();
        setTimeout(() => {
          setShowSendModal(false);
          setSendFeedback(null);
        }, 2200);
      } else {
        setSendFeedback(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setSendFeedback(`❌ Network error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Handle Instant Swap
  const handleSwapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(swapAmount);
    if (isNaN(amount) || amount <= 0) {
      setSwapFeedback("⚠️ Please enter a valid amount to swap.");
      return;
    }

    setIsSwapping(true);
    setSwapFeedback(null);

    try {
      const res = await fetch("/api/onekey/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromToken: swapFrom,
          toToken: swapTo,
          amount
        })
      });
      const data = await res.json();
      if (data.success) {
        setSwapFeedback(`✅ Swapped ${amount} ${swapFrom} for ${data.receivedAmount} ${swapTo}!`);
        fetchOneKeyState();
        setTimeout(() => {
          setShowSwapModal(false);
          setSwapFeedback(null);
        }, 2200);
      } else {
        setSwapFeedback(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setSwapFeedback(`❌ Network error: ${err.message}`);
    } finally {
      setIsSwapping(false);
    }
  };

  // Handle Set Baseline Balance
  const handleSetBalance = async (targetBal: number) => {
    try {
      const res = await fetch("/api/onekey/set-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usdt: targetBal })
      });
      const data = await res.json();
      if (data.success) {
        fetchOneKeyState();
        setShowSyncModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Opening Perp Position
  const handleOpenPerpPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const margin = parseFloat(perpMarginAmount);
    if (isNaN(margin) || margin <= 0 || margin > totalUsdValue) {
      setPerpFeedback(`⚠️ Margin must be between $0.1 and available $${totalUsdValue.toFixed(2)} USDT.`);
      return;
    }

    const price = currentPairData.price;
    const size = margin * perpLeverage;
    const liqPrice =
      perpSide === "long"
        ? price * (1 - 0.9 / perpLeverage)
        : price * (1 + 0.9 / perpLeverage);

    const newPos: PerpPosition = {
      id: `pos-${Date.now()}`,
      pair: perpPair,
      side: perpSide,
      leverage: perpLeverage,
      sizeUsd: parseFloat(size.toFixed(2)),
      marginUsd: margin,
      entryPrice: price,
      markPrice: price,
      pnlUsd: 0.0,
      roePercent: 0.0,
      liquidationPrice: parseFloat(liqPrice.toFixed(4)),
      openedAt: "Just now"
    };

    setPositions([newPos, ...positions]);
    setPerpFeedback(`🚀 ${perpSide.toUpperCase()} Position opened: ${perpLeverage}x on ${perpPair}!`);
    setTimeout(() => setPerpFeedback(null), 3000);
  };

  // Handle Closing Perp Position
  const handleClosePosition = (posId: string) => {
    const pos = positions.find((p) => p.id === posId);
    if (!pos) return;
    const returnAmount = pos.marginUsd + pos.pnlUsd;
    setPositions(positions.filter((p) => p.id !== posId));
    // Settle into USDT balance
    handleSetBalance(parseFloat((totalUsdValue + pos.pnlUsd).toFixed(2)));
    setPerpFeedback(`✅ Position closed! Realized PnL: ${pos.pnlUsd >= 0 ? "+" : ""}$${pos.pnlUsd.toFixed(2)} USDT.`);
    setTimeout(() => setPerpFeedback(null), 3500);
  };

  // Token references
  const usdtToken = tokens.find((t) => t.symbol === "USDT") || tokens[0];
  const trxToken = tokens.find((t) => t.symbol === "TRX") || tokens[1];

  // In-app filtered transactions for Tronscan
  const filteredTxs = useMemo(() => {
    if (!tronscanSearchQuery.trim()) return transactions;
    const q = tronscanSearchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.txHash.toLowerCase().includes(q) ||
        tx.token.toLowerCase().includes(q) ||
        (tx.destination && tx.destination.toLowerCase().includes(q))
    );
  }, [transactions, tronscanSearchQuery]);

  return (
    <div
      className={`relative w-[360px] sm:w-[380px] h-[780px] max-h-[90vh] bg-[#090c10] text-stone-100 rounded-[44px] shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(0,230,118,0.12)] border-[3px] border-stone-800/90 overflow-hidden flex flex-col font-sans select-none ${className}`}
      style={{ overscrollBehavior: "contain" }}
    >
      {/* ==================================================================== */}
      {/* 1. LUXURIOUS TITANIUM STATUS BAR                                      */}
      {/* ==================================================================== */}
      <div className="pt-3 px-6 pb-1 bg-gradient-to-b from-[#090c10] via-[#0d1117] to-transparent flex items-center justify-between text-xs text-stone-300 font-medium shrink-0 z-20">
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-white font-mono text-[13px]">
          <span>{currentTime}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#00e676] animate-pulse" />
        </div>

        {/* Central Camera Island Cutout */}
        <div className="w-18 h-4 rounded-full bg-black/80 border border-stone-800 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700/60 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-500/60" />
          </div>
        </div>

        {/* Status Icons */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
          <span className="font-bold text-[10px] text-emerald-400 font-mono">5G</span>
          {/* Signal Bars */}
          <div className="flex items-end gap-0.5 h-2.5">
            <span className="w-0.5 h-1 bg-stone-300 rounded-xs" />
            <span className="w-0.5 h-1.5 bg-stone-300 rounded-xs" />
            <span className="w-0.5 h-2 bg-stone-300 rounded-xs" />
            <span className="w-0.5 h-2.5 bg-emerald-400 rounded-xs" />
          </div>
          {/* Battery */}
          <div className="w-4.5 h-2.5 border border-stone-400 rounded-xs p-0.5 flex items-center">
            <div className="h-full w-3 bg-emerald-400 rounded-xs" />
          </div>
          <span className="text-[10px] font-mono text-stone-300">92%</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. TOP ACTION & SEARCH BAR (Obsidian Metallic Finish)                */}
      {/* ==================================================================== */}
      <div className="px-4 py-2 flex items-center gap-2 shrink-0 z-10 bg-[#090c10]">
        <div className="flex-1 relative flex items-center">
          <Search size={14} className="absolute left-3.5 text-stone-400" />
          <input
            type="text"
            readOnly
            onClick={() => {
              setBottomNav("discover");
              setDiscoverTab("tronscan");
            }}
            placeholder="Search tokens, TRC-20, DApps..."
            className="w-full bg-[#121722] hover:bg-[#161d2b] border border-stone-800/90 rounded-2xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder:text-stone-500 outline-none transition-colors cursor-pointer"
          />
        </div>

        {/* Notifications Bell */}
        <button
          onClick={() => {
            setBottomNav("wallet");
            setActiveTab("history");
          }}
          className="relative p-2 rounded-2xl bg-[#121722] hover:bg-[#192233] border border-stone-800/80 text-stone-300 hover:text-white transition-all cursor-pointer"
          title="Transaction Notifications"
        >
          <Bell size={16} />
          {transactions.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#00e676]" />
          )}
        </button>

        {/* DApp & Tools Menu */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="p-2 rounded-2xl bg-[#121722] hover:bg-[#192233] border border-stone-800/80 text-stone-300 hover:text-white transition-all cursor-pointer"
          title="OneKey Menu"
        >
          <Grid size={16} />
        </button>

        {/* Google Authentication Status */}
        <button
          onClick={() => setShowAuthModal(true)}
          className="relative p-1 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-emerald-500/40 hover:border-emerald-400 text-white cursor-pointer shadow-sm"
          title={`Google Account: ${userEmail}`}
        >
          <div className="w-6 h-6 rounded-xl bg-black flex items-center justify-center font-bold text-[11px] text-white">
            {isLoggedIn ? (
              <span className="text-emerald-400 font-mono">G</span>
            ) : (
              <Mail size={12} className="text-stone-400" />
            )}
          </div>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer ml-0.5"
            title="Close OneKey App"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 3. SCROLLABLE CORE VIEWPORT (Obsidian Luxury Dark Canvas)            */}
      {/* ==================================================================== */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#090c10]">
        
        {/* ================================================================== */}
        {/* VIEW A: WALLET TAB (Matching user screenshot 6 in Luxury Dark)     */}
        {/* ================================================================== */}
        {bottomNav === "wallet" && (
          <div className="p-4 space-y-4">
            {/* Account Card (Pixel Avatar + Koala + Tron Badge) */}
            <div className="p-3.5 rounded-3xl bg-gradient-to-br from-[#121724] via-[#151c2e] to-[#0e131f] border border-emerald-500/25 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Pixel Avatar Block from screenshot */}
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/50 p-1 flex flex-col justify-center items-center gap-0.5">
                  <div className="w-4 h-1 bg-emerald-400 rounded-full" />
                  <div className="w-3 h-1 bg-teal-400 rounded-full" />
                  <div className="w-4 h-1 bg-emerald-500 rounded-full" />
                </div>

                {/* Koala Avatar from screenshot 6 */}
                <span className="text-base" title="OneKey Mascot">🐨</span>

                {/* Account Name Dropdown */}
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="font-extrabold text-xs text-white tracking-tight">{accountName}</span>
                  <ChevronDown size={13} className="text-stone-400" />
                </div>

                {/* Copy Address Button */}
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy TRC-20 Address"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>

              {/* Tron Red Badge (TRC-20) */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[10.5px] font-bold text-red-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono">Tron</span>
              </div>
            </div>

            {/* Total Balance Card (Anchor to user's real app: $4.35 base) */}
            <div className="pt-2 text-center relative">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl font-black text-white tracking-tight font-mono">
                  ${totalUsdValue.toFixed(2)}
                </span>
                <button
                  onClick={fetchOneKeyState}
                  className="p-1 text-stone-500 hover:text-emerald-400 transition-colors cursor-pointer"
                  title="Sync with on-chain Tronscan & Franz Rewards"
                >
                  <RefreshCw size={14} className={isLoading ? "animate-spin text-emerald-400" : ""} />
                </button>
              </div>

              {/* Sub-label matching screenshot 6 with exact app sync */}
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-stone-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Mobile App Sync Active</span>
                <span className="text-stone-600">•</span>
                <button
                  onClick={() => setShowSyncModal(true)}
                  className="text-emerald-400 hover:underline font-mono text-[11px] cursor-pointer"
                >
                  Set $4.35 ⚙
                </button>
              </div>
            </div>

            {/* Action Buttons: [+ Add money] [••• More] */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs shadow-[0_8px_20px_rgba(0,230,118,0.25)] flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-base leading-none font-bold">+</span>
                <span>Add money</span>
              </button>

              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="py-3 px-4 rounded-2xl bg-[#141a27] hover:bg-[#1a2335] border border-stone-800 text-stone-200 hover:text-white font-bold text-xs flex items-center justify-center cursor-pointer transition-all shadow-md"
                title="Send, Swap & Explorer Options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Sub-navigation Tabs: Spot | History */}
            <div className="flex items-center justify-between border-b border-stone-800/80 pt-2 pb-1 text-xs font-bold">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setActiveTab("spot")}
                  className={`pb-1.5 transition-all cursor-pointer ${
                    activeTab === "spot"
                      ? "text-emerald-400 border-b-2 border-emerald-400 shadow-[0_4px_12px_rgba(0,230,118,0.3)]"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Spot
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "history"
                      ? "text-emerald-400 border-b-2 border-emerald-400 shadow-[0_4px_12px_rgba(0,230,118,0.3)]"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <span>History</span>
                  {transactions.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">
                      {transactions.length}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => fetchOneKeyState()}
                className="p-1 text-stone-500 hover:text-stone-300 cursor-pointer"
                title="Filter & sort assets"
              >
                <SlidersHorizontal size={14} />
              </button>
            </div>

            {/* TAB 1: SPOT ASSETS LIST (Screenshot 6 Tokens in Luxury Dark) */}
            {activeTab === "spot" && (
              <div className="space-y-2.5">
                {/* 1. USDT TOKEN CARD (Primary Asset: $4.35) */}
                <div
                  onClick={() => setShowDepositModal(true)}
                  className="p-3 rounded-2xl bg-[#111724]/90 hover:bg-[#161e2e] border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-500/20">
                      ₮
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-white">USDT</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                          TRC-20
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 font-medium">
                        ${usdtToken.price.toFixed(4)}{" "}
                        <span className="text-emerald-400 font-mono">{usdtToken.change}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-xs text-white font-mono">
                      {usdtToken.balance.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono font-bold">
                      ${usdtToken.usdValue.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* 2. TRX TOKEN CARD (Gas Token) */}
                <div
                  onClick={() => setShowSwapModal(true)}
                  className="p-3 rounded-2xl bg-[#111724]/90 hover:bg-[#161e2e] border border-stone-800/80 hover:border-stone-700 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-600/90 flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-500/20">
                      <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 15 10-15-10-5zm0 3.3L18.4 7 12 16.6 5.6 7 12 5.3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-xs text-white">TRX</span>
                        <span title="Gas token for TRC-20 transfers">
                          <Fuel size={12} className="text-amber-400" />
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 font-medium">
                        ${trxToken.price}{" "}
                        <span className="text-rose-400 font-mono">{trxToken.change}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-xs text-white font-mono">
                      {trxToken.balance.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono">
                      TRC-20 Gas Reserve
                    </div>
                  </div>
                </div>

                {/* 3. USDC TOKEN CARD */}
                <div
                  onClick={() => setShowSwapModal(true)}
                  className="p-3 rounded-2xl bg-[#111724]/90 hover:bg-[#161e2e] border border-stone-800/80 hover:border-stone-700 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600/90 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
                      $
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-white">USDC</span>
                      <div className="text-[11px] text-stone-400 font-medium">$1.00</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-xs text-white font-mono">0.00</div>
                    <div className="text-[11px] text-stone-500 font-mono">$0.00</div>
                  </div>
                </div>

                {/* Fast Deposit Guide for User */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#101724] to-[#0e131e] border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-[11px] text-stone-300">
                      Withdraw from Franz Rewards to auto-credit here in real time.
                    </span>
                  </div>
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="text-[11px] text-emerald-400 hover:underline font-bold shrink-0 cursor-pointer"
                  >
                    Receive QR
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: HISTORY (Real-time Transactions & Franz Rewards Ledger) */}
            {activeTab === "history" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Transactions ({transactions.length})</span>
                  <button onClick={() => fetchOneKeyState()} className="text-emerald-400 hover:underline font-bold">
                    Refresh
                  </button>
                </div>

                {transactions.length === 0 ? (
                  <div className="text-center py-10 text-xs text-stone-500">
                    No transactions yet. Withdraw from Franz Rewards to see funds arrive in real time!
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl bg-[#111624] border border-stone-800/80 hover:border-emerald-500/30 transition-all flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[12px] shrink-0 ${
                            tx.type === "deposit"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                              : tx.type === "swap"
                              ? "bg-amber-950 text-amber-400 border border-amber-500/40"
                              : "bg-blue-950 text-blue-400 border border-blue-500/40"
                          }`}
                        >
                          {tx.type === "deposit" ? "↓" : tx.type === "swap" ? "⇄" : "↑"}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-white truncate text-[11.5px]">
                            {tx.source || (tx.type === "deposit" ? "Incoming Deposit" : "External Transfer")}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono">
                            {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {tx.network}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`font-black font-mono text-[12px] ${
                            tx.type === "deposit" ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {tx.type === "deposit" ? "+" : "-"}{tx.amount.toFixed(2)} {tx.token}
                        </div>
                        {/* IN-APP TRONSCAN LINK (Opens inside Discover tab without leaving app!) */}
                        <button
                          onClick={() => {
                            setSelectedTxDetail(tx);
                            setBottomNav("discover");
                            setDiscoverTab("tronscan");
                          }}
                          className="text-[9.5px] text-sky-400 hover:underline flex items-center gap-0.5 justify-end font-mono cursor-pointer"
                        >
                          <span>TxHash</span>
                          <ChevronRight size={10} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW B: PERPS TAB (Perpetuals Trading Terminal - Fully Interactive)*/}
        {/* ================================================================== */}
        {bottomNav === "perps" && (
          <div className="p-4 space-y-3.5 animate-fade-in">
            {/* Header: Pair Selector + 24h Stats */}
            <div className="p-3.5 rounded-3xl bg-[#111724] border border-emerald-500/20 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    value={perpPair}
                    onChange={(e) => setPerpPair(e.target.value)}
                    className="bg-[#182033] border border-stone-700/80 rounded-xl px-2.5 py-1 text-xs text-white font-extrabold outline-none cursor-pointer"
                  >
                    <option value="TRX/USDT">TRX/USDT Perp</option>
                    <option value="BTC/USDT">BTC/USDT Perp</option>
                    <option value="ETH/USDT">ETH/USDT Perp</option>
                    <option value="SOL/USDT">SOL/USDT Perp</option>
                  </select>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                    {perpLeverage}x
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-sm text-emerald-400">
                    ${currentPairData.price}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold">
                    {currentPairData.change24h}
                  </div>
                </div>
              </div>

              {/* 24h High/Low Stats */}
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-stone-800 text-[10px] text-stone-400 font-mono">
                <div>
                  <span className="block text-stone-500">24h High</span>
                  <span className="text-white">${currentPairData.high}</span>
                </div>
                <div>
                  <span className="block text-stone-500">24h Low</span>
                  <span className="text-white">${currentPairData.low}</span>
                </div>
                <div>
                  <span className="block text-stone-500">Funding / 8h</span>
                  <span className="text-emerald-400">+0.0100%</span>
                </div>
              </div>
            </div>

            {/* Dynamic Real-time Mini Chart Simulation */}
            <div className="p-3 rounded-2xl bg-[#0f1420] border border-stone-800/90 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                <span className="font-bold text-white flex items-center gap-1">
                  <Activity size={12} className="text-emerald-400" />
                  Live Candlestick Feed
                </span>
                <div className="flex gap-1.5">
                  {["1m", "5m", "15m", "1h", "1D"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setPerpChartTimeframe(tf)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        perpChartTimeframe === tf ? "bg-emerald-500/20 text-emerald-300 font-bold" : "hover:text-stone-200"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Candlestick Bars */}
              <div className="h-16 flex items-end justify-between gap-1 pt-2 px-1">
                {[45, 52, 48, 60, 58, 65, 72, 68, 80, 75, 88, 92, 85, 96].map((val, idx) => {
                  const isUp = idx === 0 || val >= [45, 52, 48, 60, 58, 65, 72, 68, 80, 75, 88, 92, 85, 96][idx - 1];
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className={`w-0.5 h-full ${isUp ? "bg-emerald-400/40" : "bg-rose-400/40"}`} />
                      <div
                        className={`w-full rounded-xs ${isUp ? "bg-emerald-400" : "bg-rose-500"}`}
                        style={{ height: `${val}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Formulation Form */}
            <form onSubmit={handleOpenPerpPosition} className="p-3.5 rounded-3xl bg-[#111724] border border-stone-800 space-y-3">
              {/* Long / Short Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0b0e14] border border-stone-800">
                <button
                  type="button"
                  onClick={() => setPerpSide("long")}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    perpSide === "long"
                      ? "bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/30"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  Buy / Long
                </button>
                <button
                  type="button"
                  onClick={() => setPerpSide("short")}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    perpSide === "short"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  Sell / Short
                </button>
              </div>

              {/* Leverage Selector */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                  <span>Leverage</span>
                  <span className="font-bold text-white font-mono">{perpLeverage}x Isolated</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[2, 5, 10, 20, 50].map((lev) => (
                    <button
                      key={lev}
                      type="button"
                      onClick={() => setPerpLeverage(lev)}
                      className={`py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        perpLeverage === lev
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                          : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-white"
                      }`}
                    >
                      {lev}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin Input */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                  <span>Margin (USDT)</span>
                  <span className="font-mono text-emerald-400">Avail: ${totalUsdValue.toFixed(2)}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={totalUsdValue}
                    value={perpMarginAmount}
                    onChange={(e) => setPerpMarginAmount(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-stone-500 font-mono">USDT</span>
                </div>

                {/* Percentage Buttons */}
                <div className="flex gap-1.5 mt-1.5">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPerpMarginAmount(((totalUsdValue * pct) / 100).toFixed(2))}
                      className="flex-1 py-1 rounded-md bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[10px] text-stone-300 font-mono font-bold cursor-pointer"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Calculations */}
              <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-stone-800/80 text-[10.5px] space-y-1 font-mono text-stone-400">
                <div className="flex justify-between">
                  <span>Position Size:</span>
                  <span className="text-white font-bold">
                    ${(parseFloat(perpMarginAmount || "0") * perpLeverage).toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Liquidation:</span>
                  <span className="text-amber-400 font-bold">
                    ${(
                      currentPairData.price *
                      (perpSide === "long" ? 1 - 0.9 / perpLeverage : 1 + 0.9 / perpLeverage)
                    ).toFixed(4)}
                  </span>
                </div>
              </div>

              {perpFeedback && (
                <div className="p-2 bg-stone-900 border border-emerald-500/40 rounded-xl text-[11px] text-emerald-300">
                  {perpFeedback}
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-2xl font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  perpSide === "long"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 shadow-emerald-500/20 hover:brightness-110"
                    : "bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-rose-600/20 hover:brightness-110"
                }`}
              >
                <span>Open {perpSide.toUpperCase()} ({perpLeverage}x)</span>
              </button>
            </form>

            {/* Active Positions List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">Active Positions ({positions.length})</span>
              {positions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800/80 text-center text-xs text-stone-500">
                  No open perpetual positions.
                </div>
              ) : (
                positions.map((pos) => (
                  <div key={pos.id} className="p-3 rounded-2xl bg-[#111724] border border-stone-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                          pos.side === "long" ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40" : "bg-rose-950 text-rose-400 border border-rose-500/40"
                        }`}>
                          {pos.side.toUpperCase()} {pos.leverage}x
                        </span>
                        <span className="text-white">{pos.pair}</span>
                      </div>
                      <div className={`font-mono font-black ${pos.pnlUsd >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {pos.pnlUsd >= 0 ? "+" : ""}${pos.pnlUsd.toFixed(3)} ({pos.roePercent >= 0 ? "+" : ""}{pos.roePercent}%)
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[10px] text-stone-400 font-mono">
                      <div>
                        <span className="block text-stone-500">Size</span>
                        <span className="text-white">${pos.sizeUsd}</span>
                      </div>
                      <div>
                        <span className="block text-stone-500">Margin</span>
                        <span className="text-white">${pos.marginUsd}</span>
                      </div>
                      <div>
                        <span className="block text-stone-500">Liq. Price</span>
                        <span className="text-amber-400">${pos.liquidationPrice}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClosePosition(pos.id)}
                      className="w-full py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      Market Close (Settle PnL to OneKey USDT)
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW C: DISCOVER TAB (Authentic In-App Tronscan & Web3 Browser)   */}
        {/* ================================================================== */}
        {bottomNav === "discover" && (
          <div className="p-3.5 space-y-3 animate-fade-in">
            {/* Embedded Web3 Browser Address Bar */}
            <div className="p-2.5 rounded-2xl bg-[#111724] border border-stone-800 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                <Lock size={10} />
                <span>SSL</span>
              </div>
              <div className="flex-1 font-mono text-[11px] text-stone-300 truncate">
                https://tronscan.org/#/address/{walletAddress.slice(0, 10)}...
              </div>
              <button
                onClick={() => fetchOneKeyState()}
                className="p-1 hover:text-emerald-400 text-stone-400 transition-colors cursor-pointer"
                title="Reload Tronscan Explorer"
              >
                <RefreshCw size={13} className={isLoading ? "animate-spin text-emerald-400" : ""} />
              </button>
            </div>

            {/* In-App Discover Sub-Navigation */}
            <div className="flex items-center gap-2 border-b border-stone-800 pb-2 text-xs font-bold">
              <button
                onClick={() => {
                  setDiscoverTab("tronscan");
                  setSelectedTxDetail(null);
                }}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  discoverTab === "tronscan"
                    ? "bg-red-950 text-red-300 border border-red-500/40 shadow-sm"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                TRONSCAN Explorer
              </button>
              <button
                onClick={() => setDiscoverTab("dapps")}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  discoverTab === "dapps"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Tron Web3 DApps
              </button>
            </div>

            {/* C1. TRONSCAN OFFICIAL BLOCKCHAIN EXPLORER VIEW */}
            {discoverTab === "tronscan" && (
              <div className="space-y-3">
                {/* Specific Transaction Detail Card (if clicked from History) */}
                {selectedTxDetail && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/70 to-stone-900 border border-red-500/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-red-400">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Tronscan Confirmed Transaction</span>
                      </div>
                      <button
                        onClick={() => setSelectedTxDetail(null)}
                        className="p-1 text-stone-400 hover:text-white rounded"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <div className="text-[11px] font-mono text-stone-300 space-y-1">
                      <div>Hash: <span className="text-white break-all">{selectedTxDetail.txHash}</span></div>
                      <div>Type: <span className="text-emerald-400 uppercase">{selectedTxDetail.type}</span></div>
                      <div>Amount: <span className="text-white font-bold">{selectedTxDetail.amount} {selectedTxDetail.token}</span></div>
                      <div>Block Confirmations: <span className="text-emerald-400 font-bold">19 Confirmed</span></div>
                    </div>
                  </div>
                )}

                {/* Tronscan Account Overview Card */}
                <div className="p-3.5 rounded-3xl bg-[#111724] border border-red-500/25 shadow-lg space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-[10px]">
                        T
                      </div>
                      <span className="font-extrabold text-xs text-white">TRON Account Overview</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold">
                      Verified
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#0b0e14] border border-stone-800 text-[10.5px] font-mono text-stone-300 break-all">
                    {walletAddress}
                  </div>

                  {/* Resource Gauges (Bandwidth & Energy) */}
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
                    <div className="p-2 rounded-xl bg-[#0b0e14] border border-stone-800">
                      <span className="text-stone-400 block text-[9.5px]">Bandwidth</span>
                      <span className="text-emerald-400 font-bold">1,500 / 1,500</span>
                      <span className="text-stone-500 block text-[9px]">Free quota active</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0b0e14] border border-stone-800">
                      <span className="text-stone-400 block text-[9.5px]">Energy</span>
                      <span className="text-sky-400 font-bold">32,000 / 32,000</span>
                      <span className="text-stone-500 block text-[9px]">TRC-20 Optimized</span>
                    </div>
                  </div>
                </div>

                {/* Search Bar inside Tronscan */}
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={tronscanSearchQuery}
                    onChange={(e) => setTronscanSearchQuery(e.target.value)}
                    placeholder="Search Tronscan TxHash or Address..."
                    className="w-full bg-[#111724] border border-stone-800 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-200 placeholder:text-stone-500 outline-none font-mono"
                  />
                </div>

                {/* Tronscan Live Transfers Ledger */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white block">TRC-20 Token Transfers</span>
                  {filteredTxs.length === 0 ? (
                    <div className="text-center py-6 text-xs text-stone-500">No transfers found.</div>
                  ) : (
                    filteredTxs.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-2.5 rounded-2xl bg-[#111724] border border-stone-800/80 space-y-1.5 text-[11px] font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 font-bold truncate max-w-[170px]">
                            {tx.txHash.slice(0, 16)}...
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold">
                            CONFIRMED
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-stone-400 text-[10px]">
                          <span>Amount: <b className="text-white">{tx.amount} {tx.token}</b></span>
                          <span>Fee: <b className="text-emerald-400">0 TRX</b></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* C2. TRON WEB3 DAPPS DIRECTORY */}
            {discoverTab === "dapps" && (
              <div className="space-y-2.5">
                {[
                  { name: "SunSwap V3", desc: "Top Tron DEX & TRC-20 Liquidity Pool", category: "DeFi", color: "#FF5252" },
                  { name: "JustLend DAO", desc: "Decentralized Lending & TRX Staking", category: "Lending", color: "#00E676" },
                  { name: "TronLink Bridge", desc: "Multi-Chain Cross Asset Bridge", category: "Bridge", color: "#2979FF" },
                  { name: "OneKey Cloud Vault", desc: "Secure Web3 Hardware Key Backup", category: "Security", color: "#00B812" }
                ].map((dapp, idx) => (
                  <div
                    key={idx}
                    onClick={() => setShowSwapModal(true)}
                    className="p-3 rounded-2xl bg-[#111724] hover:bg-[#161e2e] border border-stone-800 hover:border-emerald-500/30 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-md"
                        style={{ backgroundColor: dapp.color }}
                      >
                        {dapp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-white group-hover:text-emerald-400 transition-colors">
                          {dapp.name}
                        </div>
                        <div className="text-[10.5px] text-stone-400 truncate max-w-[190px]">
                          {dapp.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-stone-900 text-stone-400 border border-stone-700 font-mono">
                      {dapp.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ==================================================================== */}
      {/* 4. LUXURY OBSIDIAN BOTTOM NAVIGATION DOCK (Wallet | Trade | Perps | Discover) */}
      {/* ==================================================================== */}
      <div className="py-2.5 px-6 bg-[#0c1017] border-t border-stone-800/90 flex items-center justify-between text-stone-400 shrink-0 z-20">
        <button
          onClick={() => {
            setBottomNav("wallet");
            setActiveTab("spot");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            bottomNav === "wallet"
              ? "text-emerald-400 font-bold scale-105"
              : "hover:text-stone-200"
          }`}
        >
          <Wallet size={18} />
          <span className="text-[10px]">Wallet</span>
        </button>

        <button
          onClick={() => {
            setBottomNav("trade");
            setShowSwapModal(true);
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            bottomNav === "trade"
              ? "text-emerald-400 font-bold scale-105"
              : "hover:text-stone-200"
          }`}
        >
          <ArrowRightLeft size={18} />
          <span className="text-[10px]">Trade</span>
        </button>

        <button
          onClick={() => {
            setBottomNav("perps");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            bottomNav === "perps"
              ? "text-emerald-400 font-bold scale-105"
              : "hover:text-stone-200"
          }`}
        >
          <BarChart3 size={18} />
          <span className="text-[10px]">Perps</span>
        </button>

        <button
          onClick={() => {
            setBottomNav("discover");
            setDiscoverTab("tronscan");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            bottomNav === "discover"
              ? "text-emerald-400 font-bold scale-105"
              : "hover:text-stone-200"
          }`}
        >
          <Compass size={18} />
          <span className="text-[10px]">Discover</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 5. ANDROID SYSTEM NAVIGATION BAR (Matching screenshot 6: ||| ⬭ <)    */}
      {/* ==================================================================== */}
      <div className="py-1 px-8 bg-[#090c10] flex items-center justify-around text-stone-500 shrink-0 text-sm">
        <button
          onClick={() => {
            setBottomNav("wallet");
            setActiveTab("spot");
          }}
          className="hover:text-stone-200 cursor-pointer font-bold tracking-widest text-xs"
        >
          |||
        </button>
        <button
          onClick={() => {
            setBottomNav("wallet");
          }}
          className="hover:text-stone-200 cursor-pointer font-bold text-xs"
        >
          ⬭
        </button>
        <button
          onClick={() => {
            if (bottomNav !== "wallet") setBottomNav("wallet");
          }}
          className="hover:text-stone-200 cursor-pointer font-bold text-base"
        >
          ‹
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: RECEIVE / DEPOSIT MODAL (QR CODE + TRC-20 ADDRESS)          */}
      {/* ==================================================================== */}
      {showDepositModal && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-[#111724] border border-emerald-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">Deposit Tether (TRC-20)</h4>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              {/* Dynamic QR Code Canvas */}
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${walletAddress}`}
                  alt="Tron TRC-20 QR"
                  className="w-36 h-36"
                />
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Your OneKey TRC-20 Wallet Address</span>
                <div
                  onClick={handleCopyAddress}
                  className="px-3 py-2 rounded-xl bg-[#0b0e14] border border-stone-700/80 font-mono text-[11px] text-emerald-400 break-all cursor-pointer flex items-center justify-between gap-2 hover:border-emerald-500 transition-colors"
                >
                  <span>{walletAddress}</span>
                  {copied ? <Check size={14} className="text-emerald-400 shrink-0" /> : <Copy size={14} className="text-stone-400 shrink-0" />}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[10.5px] text-amber-300 text-left">
                ⚠️ Send only <b>TRC-20 (Tron)</b> Tether USDT or TRX to this address. Incoming deposits reflect in real time.
              </div>
            </div>

            <button
              onClick={handleCopyAddress}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-black text-xs shadow-md cursor-pointer hover:brightness-110"
            >
              {copied ? "✓ Address Copied!" : "Copy TRC-20 Address"}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: SEND / WITHDRAW MODAL (Transfer out to another address)     */}
      {/* ==================================================================== */}
      {showSendModal && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-[#111724] border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-sky-400" />
                <h4 className="font-extrabold text-sm text-white">Send / Transfer Crypto</h4>
              </div>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {sendFeedback && (
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200">
                {sendFeedback}
              </div>
            )}

            <form onSubmit={handleSendSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-400 block mb-1">Asset:</label>
                <select
                  value={sendToken}
                  onChange={(e) => setSendToken(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="USDT">USDT (Tether - Available: {usdtToken.balance.toFixed(2)})</option>
                  <option value="TRX">TRX (Tron - Available: {trxToken.balance.toFixed(2)})</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 block mb-1">Amount:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSendAmount(usdtToken.balance.toFixed(2))}
                    className="absolute right-2 top-2 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 block mb-1">Destination Address:</label>
                <input
                  type="text"
                  required
                  value={sendDestination}
                  onChange={(e) => setSendDestination(e.target.value)}
                  placeholder="T... (TRC-20 Address)"
                  className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Sign & Broadcast Transfer</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: SWAP MODAL (Instant TRC-20 Swap inside OneKey)              */}
      {/* ==================================================================== */}
      {showSwapModal && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-[#111724] border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft size={16} className="text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">OneKey Instant Swap</h4>
              </div>
              <button
                onClick={() => setShowSwapModal(false)}
                className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {swapFeedback && (
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200">
                {swapFeedback}
              </div>
            )}

            <form onSubmit={handleSwapSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-400 block mb-1">Pay From:</label>
                  <select
                    value={swapFrom}
                    onChange={(e) => setSwapFrom(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="USDT">USDT ({usdtToken.balance.toFixed(2)})</option>
                    <option value="TRX">TRX ({trxToken.balance.toFixed(2)})</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-400 block mb-1">Receive:</label>
                  <select
                    value={swapTo}
                    onChange={(e) => setSwapTo(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="TRX">TRX</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 block mb-1">Amount to Swap:</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-stone-800 text-[10.5px] font-mono text-stone-400 flex items-center justify-between">
                <span>Rate:</span>
                <span className="text-emerald-400 font-bold">1 USDT ≈ 2.94 TRX</span>
              </div>

              <button
                type="submit"
                disabled={isSwapping}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5 hover:brightness-110"
              >
                {isSwapping ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRightLeft size={14} />}
                <span>Execute Instant Swap</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: GOOGLE AUTHENTICATION MODAL                                  */}
      {/* ==================================================================== */}
      {showAuthModal && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-[#111724] border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">Google Account Authentication</h4>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {authFeedback && (
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200">
                {authFeedback}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-400 block mb-1">Google Email Address:</label>
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[10.5px] text-emerald-300">
                ✓ Logged in as: <b>{userEmail}</b>. Account balances and transactions synchronize with your profile.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-black text-xs shadow-md cursor-pointer hover:brightness-110"
              >
                Sign In with Google
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: MORE MENU POPUP                                             */}
      {/* ==================================================================== */}
      {showMoreMenu && (
        <div
          onClick={() => setShowMoreMenu(false)}
          className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[280px] bg-[#111724] border border-stone-800 rounded-3xl p-4 shadow-2xl space-y-2 text-xs"
          >
            <div className="font-extrabold text-white text-xs pb-2 border-b border-stone-800 flex justify-between items-center">
              <span>Quick Actions</span>
              <button onClick={() => setShowMoreMenu(false)} className="text-stone-400 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <button
              onClick={() => {
                setShowMoreMenu(false);
                setShowSendModal(true);
              }}
              className="w-full p-2.5 rounded-xl hover:bg-[#161f30] text-stone-200 flex items-center gap-2.5 cursor-pointer text-left"
            >
              <Send size={15} className="text-sky-400" />
              <span>Send / External Transfer</span>
            </button>

            <button
              onClick={() => {
                setShowMoreMenu(false);
                setShowSwapModal(true);
              }}
              className="w-full p-2.5 rounded-xl hover:bg-[#161f30] text-stone-200 flex items-center gap-2.5 cursor-pointer text-left"
            >
              <ArrowRightLeft size={15} className="text-emerald-400" />
              <span>Instant Swap (USDT ⇄ TRX)</span>
            </button>

            <button
              onClick={() => {
                setShowMoreMenu(false);
                setBottomNav("discover");
                setDiscoverTab("tronscan");
              }}
              className="w-full p-2.5 rounded-xl hover:bg-[#161f30] text-stone-200 flex items-center gap-2.5 cursor-pointer text-left"
            >
              <Globe size={15} className="text-red-400" />
              <span>In-App TRONSCAN Explorer</span>
            </button>

            <button
              onClick={() => {
                setShowMoreMenu(false);
                setShowSyncModal(true);
              }}
              className="w-full p-2.5 rounded-xl hover:bg-[#161f30] text-stone-200 flex items-center gap-2.5 cursor-pointer text-left border-t border-stone-800 pt-2"
            >
              <RefreshCw size={15} className="text-amber-400" />
              <span>Sync $4.35 Mobile App Balance</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 6: SET EXACT MOBILE APP BALANCE ($4.35)                        */}
      {/* ==================================================================== */}
      {showSyncModal && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-[#111724] border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">Mobile App Balance Alignment</h4>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Align your OneKey dashboard balance to exactly match your real mobile app balance (e.g. $4.35 USDT).
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-400 block">Target Balance (USDT):</label>
              <input
                type="number"
                step="0.01"
                value={syncUsdtInput}
                onChange={(e) => setSyncUsdtInput(e.target.value)}
                className="w-full bg-[#0b0e14] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSetBalance(4.35)}
                className="flex-1 py-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold cursor-pointer hover:bg-emerald-900/50"
              >
                Reset to $4.35
              </button>
              <button
                type="button"
                onClick={() => handleSetBalance(parseFloat(syncUsdtInput) || 4.35)}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 text-xs font-black cursor-pointer hover:brightness-110"
              >
                Apply Custom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
