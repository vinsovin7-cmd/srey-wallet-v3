import React, { useState } from "react";
import { OneKeyApp } from "./OneKeyApp";
import {
  X,
  Coins,
  ArrowRightLeft,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Bell,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Zap,
  TrendingUp,
  Sliders,
  DollarSign,
  Smartphone
} from "lucide-react";

export interface FranzRewardLedgerEntry {
  id: string;
  timestamp: string;
  type: "earn" | "swap" | "withdraw";
  action: string;
  batAmount: number;
  usdtAmount?: number;
  details: string;
  status: "confirmed" | "completed";
  txHash?: string;
  read: boolean;
}

interface FranzRewardsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  batBalance: number;
  usdtBalance: number;
  usdtRate: number;
  equivalentUsdt: number;
  totalBatEarned: number;
  lifetimeActivities: number;
  ledger: FranzRewardLedgerEntry[];
  onRefresh: () => void;
  onMarkNotificationsRead: () => void;
}

export const FranzRewardsCenterModal: React.FC<FranzRewardsCenterModalProps> = ({
  isOpen,
  onClose,
  batBalance,
  usdtBalance,
  usdtRate,
  equivalentUsdt,
  totalBatEarned,
  lifetimeActivities,
  ledger,
  onRefresh,
  onMarkNotificationsRead
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "swap" | "withdraw" | "notifications">("overview");

  // Swap State
  const [swapBatAmount, setSwapBatAmount] = useState<string>("5.00");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapFeedback, setSwapFeedback] = useState<string | null>(null);

  // Withdrawal State
  const [withdrawToken, setWithdrawToken] = useState<"USDT" | "BAT">("USDT");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("1.00");
  const [withdrawAddress, setWithdrawAddress] = useState<string>("TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG");
  const [withdrawNetwork, setWithdrawNetwork] = useState<string>("Tron (TRC-20)");
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawFeedback, setWithdrawFeedback] = useState<string | null>(null);

  // OneKey Companion Phone Visibility (Matching Screenshot 5 Right Section)
  const [showOneKeyCompanion, setShowOneKeyCompanion] = useState<boolean>(true);

  if (!isOpen) return null;

  // Execute Swap via Brave Liquidity Engine
  const handleExecuteSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(swapBatAmount);
    if (isNaN(amount) || amount <= 0 || amount > batBalance) {
      setSwapFeedback(`⚠️ Please enter a valid BAT amount between 0.1 and ${batBalance.toFixed(2)} BAT.`);
      return;
    }

    setIsSwapping(true);
    setSwapFeedback(null);

    try {
      const res = await fetch("/api/franz/rewards/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batAmount: amount })
      });
      const data = await res.json();
      if (data.success) {
        setSwapFeedback(`✅ Successfully swapped ${amount.toFixed(2)} BAT for ${data.receivedUsdt.toFixed(4)} USDT! Recorded in notifications.`);
        onRefresh();
      } else {
        setSwapFeedback(`❌ Swap failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setSwapFeedback(`❌ Network error executing swap: ${err?.message}`);
    } finally {
      setIsSwapping(false);
    }
  };

  // Execute Withdrawal via Web3 Provider
  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    const max = withdrawToken === "USDT" ? usdtBalance : batBalance;
    if (isNaN(amount) || amount <= 0 || amount > max) {
      setWithdrawFeedback(`⚠️ Insufficient ${withdrawToken} balance. Max available: ${max.toFixed(2)}.`);
      return;
    }
    if (!withdrawAddress.trim()) {
      setWithdrawFeedback("⚠️ Please enter a destination Web3 wallet address.");
      return;
    }

    setIsWithdrawing(true);
    setWithdrawFeedback(null);

    try {
      const res = await fetch("/api/franz/rewards/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: withdrawToken,
          amount,
          walletAddress: withdrawAddress.trim(),
          network: withdrawNetwork
        })
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawFeedback(`🚀 Dispatched ${amount.toFixed(2)} ${withdrawToken} to ${withdrawAddress.slice(0, 8)}... TxHash: ${data.txHash.slice(0, 10)}... (Logged in notifications)`);
        onRefresh();
      } else {
        setWithdrawFeedback(`❌ Withdrawal error: ${data.error || "Execution failed"}`);
      }
    } catch (err: any) {
      setWithdrawFeedback(`❌ Network error dispatching withdrawal: ${err?.message}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const unreadCount = ledger.filter(l => !l.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in font-sans select-none">
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-5 max-w-[1300px] w-full my-auto py-2">
        
        {/* LEFT CONTAINER: Franz BAT / USDT Rewards Management Engine */}
        <div 
          className="w-full max-w-2xl bg-[#0e1219] border-2 border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl text-stone-200 flex flex-col max-h-[92vh]"
          style={{ overscrollBehavior: "contain" }}
        >
          
          {/* TOP MODAL HEADER */}
          <div className="p-4 bg-gradient-to-r from-[#171b26] via-[#121620] to-[#1a1f2e] border-b border-stone-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-stone-950 font-black text-lg shadow-lg shadow-amber-500/20">
                🦁
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Franz BAT / USDT Rewards Management Engine
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 font-mono text-[9.5px] font-bold">
                    Brave Web3
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Silent Activity Tracking Module • Brave Liquidity Swap • External Web3 Wallet Provider
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* OneKey Companion Toggle */}
              <button
                onClick={() => setShowOneKeyCompanion(!showOneKeyCompanion)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  showOneKeyCompanion
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm"
                    : "bg-stone-800 text-stone-400 border-stone-700 hover:text-white"
                }`}
                title="Toggle ONE KEY Companion App"
              >
                <Smartphone size={13} />
                <span>ONE KEY {showOneKeyCompanion ? "Active" : "Closed"}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

        {/* NAVIGATION TABS */}
        <div className="px-4 pt-2.5 pb-0 bg-[#0a0d14] border-b border-stone-800 flex items-center gap-2 text-xs font-bold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#161a24] text-amber-400 border-t-2 border-amber-400"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Coins size={14} />
            <span>Balance & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab("swap")}
            className={`px-3.5 py-2 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "swap"
                ? "bg-[#161a24] text-amber-400 border-t-2 border-amber-400"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <ArrowRightLeft size={14} />
            <span>Swap BAT → USDT</span>
          </button>

          <button
            onClick={() => setActiveTab("withdraw")}
            className={`px-3.5 py-2 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "withdraw"
                ? "bg-[#161a24] text-amber-400 border-t-2 border-amber-400"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Wallet size={14} />
            <span>External Wallet Withdrawal</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("notifications");
              onMarkNotificationsRead();
            }}
            className={`px-3.5 py-2 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === "notifications"
                ? "bg-[#161a24] text-amber-400 border-t-2 border-amber-400"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Bell size={14} />
            <span>Notification Records</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* MODAL BODY */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#0a0d14] space-y-4"
          style={{ overscrollBehavior: "contain" }}
        >
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              
              {/* Balances Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* BAT Balance */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1c24] to-[#12141c] border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Coins size={14} className="text-amber-400" />
                      <span>Available BAT Balance</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">Brave Rewards</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      {batBalance.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-stone-300">BAT</span>
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-800">
                    <span>≈ ${(batBalance * usdtRate).toFixed(2)} USDT</span>
                    <span className="text-emerald-400 font-mono">1 BAT = ${usdtRate} USDT</span>
                  </div>
                </div>

                {/* USDT Balance */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121c18] to-[#0c1410] border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-emerald-400" />
                      <span>Swapped USDT Balance</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Tether USD</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-400 font-mono">
                      {usdtBalance.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-stone-300">USDT</span>
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-800">
                    <span>Withdrawable on Web3</span>
                    <span className="text-sky-400 font-mono">Instant Tx</span>
                  </div>
                </div>
              </div>

              {/* Ecosystem Stats */}
              <div className="p-3.5 rounded-2xl bg-[#141824] border border-stone-800 flex items-center justify-around text-center text-xs">
                <div>
                  <span className="text-[10.5px] text-stone-400 block">Total Lifetime BAT</span>
                  <span className="text-base font-extrabold text-amber-300 font-mono">{totalBatEarned.toFixed(2)} BAT</span>
                </div>
                <div className="w-[1px] h-8 bg-stone-800" />
                <div>
                  <span className="text-[10.5px] text-stone-400 block">Tracked Activities</span>
                  <span className="text-base font-extrabold text-sky-300 font-mono">{lifetimeActivities} events</span>
                </div>
                <div className="w-[1px] h-8 bg-stone-800" />
                <div>
                  <span className="text-[10.5px] text-stone-400 block">Notification Ledger</span>
                  <span className="text-base font-extrabold text-emerald-300 font-mono">{ledger.length} records</span>
                </div>
              </div>

              {/* Explanation of Silent Tracking */}
              <div className="p-3.5 bg-sky-950/40 border border-sky-600/40 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-300">
                  <ShieldCheck size={14} />
                  <span>Silent Earning Policy Active</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  As requested, real BAT allocations for actions in the Franz ecosystem (switching tabs, sending messages, custom URL interactions) are calculated silently by the back-end service. <strong>No distracting popup toasts appear on screen</strong>; every reward is safely recorded in your Notification Records ledger.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setActiveTab("swap")}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowRightLeft size={14} />
                  <span>Exchange BAT to USDT</span>
                </button>

                <button
                  onClick={() => setActiveTab("withdraw")}
                  className="flex-1 py-2.5 bg-[#1b2232] hover:bg-[#242d42] border border-sky-500/50 text-sky-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Wallet size={14} />
                  <span>Withdraw to External Wallet</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SWAP BAT -> USDT */}
          {activeTab === "swap" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-300 block">Brave Web3 Liquidity Pool</span>
                  <span className="text-[10.5px] text-stone-400">Direct engine conversion at standard market depth</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">1 BAT = ${usdtRate} USDT</span>
              </div>

              {swapFeedback && (
                <div className="p-3 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-200">
                  {swapFeedback}
                </div>
              )}

              <form onSubmit={handleExecuteSwap} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="text-stone-400 font-bold">You Swap (BAT):</label>
                    <span className="text-[10.5px] text-stone-400">
                      Available: <strong className="text-amber-400">{batBalance.toFixed(2)} BAT</strong>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      max={batBalance}
                      value={swapBatAmount}
                      onChange={(e) => setSwapBatAmount(e.target.value)}
                      className="w-full bg-black border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setSwapBatAmount(batBalance.toString())}
                      className="absolute right-2 top-2 px-2 py-1 bg-stone-800 text-[10px] font-bold text-amber-400 rounded cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="flex justify-center text-stone-500">
                  <ArrowRightLeft size={18} />
                </div>

                <div>
                  <label className="text-stone-400 text-xs font-bold block mb-1">
                    You Receive (Estimated USDT):
                  </label>
                  <div className="w-full bg-[#161a22] border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-mono font-bold">
                    {(parseFloat(swapBatAmount || "0") * usdtRate).toFixed(4)} USDT
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSwapping || batBalance <= 0}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  {isSwapping ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRightLeft size={14} />}
                  <span>Execute Instant Swap in Brave Engine</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WITHDRAWAL */}
          {activeTab === "withdraw" && (
            <div className="space-y-4">
              <div className="p-3 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">External Web3 Wallet Transfer</span>
                  <span className="text-[10.5px] text-stone-400">Direct on-chain payout to your personal external wallet</span>
                </div>
                <Wallet size={18} className="text-sky-400" />
              </div>

              {/* Quick Select OneKey TRC-20 Wallet Card */}
              <div className="p-3 bg-gradient-to-r from-emerald-950/70 via-stone-900 to-stone-900 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="text-sm">🔑</span>
                    <span>OneKey TRC-20 Tether Wallet (Real-Time Sync)</span>
                  </div>
                  <p className="text-[11px] text-stone-300 font-mono truncate mt-0.5">
                    TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG
                  </p>
                  <p className="text-[10px] text-emerald-400/80 mt-0.5">
                    ✓ Connected to Kansas Nelly • Dispatched funds reflect on the right instantly
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawToken("USDT");
                    setWithdrawNetwork("Tron (TRC-20)");
                    setWithdrawAddress("TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG");
                    setShowOneKeyCompanion(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all shrink-0"
                >
                  ⚡ Select OneKey
                </button>
              </div>

              {withdrawFeedback && (
                <div className="p-3 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-200">
                  {withdrawFeedback}
                </div>
              )}

              <form onSubmit={handleExecuteWithdrawal} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-stone-400 text-[11px] font-bold block mb-1">Token:</label>
                    <select
                      value={withdrawToken}
                      onChange={(e) => setWithdrawToken(e.target.value as any)}
                      className="w-full bg-black border border-stone-700 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="USDT">USDT (Tether - Available: {usdtBalance.toFixed(2)})</option>
                      <option value="BAT">BAT (Basic Attention - Available: {batBalance.toFixed(2)})</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-400 text-[11px] font-bold block mb-1">Network:</label>
                    <select
                      value={withdrawNetwork}
                      onChange={(e) => setWithdrawNetwork(e.target.value)}
                      className="w-full bg-black border border-stone-700 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="Tron (TRC-20)">Tron (TRC-20) - OneKey Native</option>
                      <option value="Ethereum (ERC-20)">Ethereum (ERC-20)</option>
                      <option value="Polygon (PoS)">Polygon (PoS)</option>
                      <option value="Solana Web3">Solana Web3</option>
                      <option value="The Open Network (TON)">The Open Network (TON)</option>
                      <option value="BNB Chain (BEP-20)">BNB Chain (BEP-20)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-stone-400 text-[11px] font-bold block mb-1">Amount to Withdraw:</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-black border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-stone-400 text-[11px] font-bold">Destination Web3 Wallet Address:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWithdrawAddress("UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ");
                          setWithdrawNetwork("The Open Network (TON)");
                        }}
                        className="text-[10px] text-cyan-400 hover:underline cursor-pointer font-bold"
                      >
                        Use Verified TON Wallet (UQBL...bnBJ)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWithdrawAddress("TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG");
                          setWithdrawNetwork("Tron (TRC-20)");
                        }}
                        className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        Use OneKey
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="0x... or Tron/Solana address"
                    className="w-full bg-black border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-sky-500"
                  />
                </div>

                {/* Live Sync Confirmation Badge */}
                {(withdrawAddress.includes("TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG") || withdrawNetwork === "Tron (TRC-20)") && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-400 shrink-0" />
                    <span>OneKey Real-Time Sync Active: Withdrawal will credit directly into the OneKey app on the right!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  {isWithdrawing ? <RefreshCw size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}
                  <span>Sign & Broadcast Withdrawal to External Wallet</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS LEDGER */}
          {activeTab === "notifications" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>All Background Earning & Transaction Records:</span>
                <button
                  onClick={onMarkNotificationsRead}
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-2">
                {ledger.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-6">No records in ledger yet.</p>
                ) : (
                  ledger.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs transition-colors ${
                        item.read
                          ? "bg-[#10141d] border-stone-800 text-stone-300"
                          : "bg-[#182030] border-amber-500/50 text-white"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase font-mono ${
                            item.type === "earn"
                              ? "bg-amber-950 text-amber-300 border border-amber-700/60"
                              : item.type === "swap"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-700/60"
                              : "bg-purple-950 text-purple-300 border border-purple-700/60"
                          }`}>
                            {item.type}
                          </span>
                          <span className="font-bold text-xs">{item.details}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-stone-400 font-mono">
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                          {item.txHash && <span>Tx: {item.txHash.slice(0, 12)}...</span>}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {item.type === "earn" && (
                          <span className="text-amber-400 font-bold font-mono text-xs">
                            +{item.batAmount.toFixed(2)} BAT
                          </span>
                        )}
                        {item.type === "swap" && (
                          <div className="flex flex-col text-right">
                            <span className="text-rose-400 font-bold font-mono text-xs">
                              {item.batAmount.toFixed(2)} BAT
                            </span>
                            <span className="text-emerald-400 font-bold font-mono text-[10px]">
                              +{item.usdtAmount?.toFixed(4)} USDT
                            </span>
                          </div>
                        )}
                        {item.type === "withdraw" && (
                          <span className="text-purple-400 font-bold font-mono text-xs">
                            Withdrawn
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-3.5 bg-[#0e1219] border-t border-stone-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-[10px] text-stone-500 font-mono">
            Earning Rate: Active Session Continuous Tracking
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>

      {/* RIGHT CONTAINER: ONE KEY Applet Companion (Screenshot 5 Red Outline Box) */}
      {showOneKeyCompanion && (
        <div className="shrink-0 flex flex-col items-center animate-fade-in relative z-10">
          {/* Subtle label indicating OneKey Applet */}
          <div className="flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[11px] font-bold text-emerald-300 shadow-md">
            <span>🔑</span>
            <span>ONE KEY Web3 Mobile Wallet (TRC-20 Real-Time Sync)</span>
          </div>

          <OneKeyApp
            isEmbedded={false}
            onClose={() => setShowOneKeyCompanion(false)}
            className="shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </div>
      )}

      </div>
    </div>
  );
};
