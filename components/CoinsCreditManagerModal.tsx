import React, { useState, useEffect } from "react";
import {
  Coins,
  Sparkles,
  Gift,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  ShieldCheck,
  Zap,
  Settings,
  RefreshCw,
  Plus
} from "lucide-react";

interface CoinsCreditManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
  onUpdateCredits: (newCredits: number) => void;
}

export function CoinsCreditManagerModal({
  isOpen,
  onClose,
  credits,
  onUpdateCredits
}: CoinsCreditManagerModalProps) {
  const [ledger, setLedger] = useState<any[]>([
    { id: "l-1", type: "grant", amount: 200, description: "Daily Free 200 Coins Allowance", date: "Today, 8:00 AM" },
    { id: "l-2", type: "grant", amount: 500, description: "Welcome Free Ecosystem Coins Bonus", date: "Today, 7:30 AM" },
    { id: "l-3", type: "spend", amount: -2, description: "Chat Message with Thi Thanh Thao", date: "Today, 6:20 PM" },
    { id: "l-4", type: "spend", amount: -2, description: "Chat Message with Adesuwa Okonkwo", date: "Today, 6:18 PM" },
    { id: "l-5", type: "spend", amount: -10, description: "Private Gallery Photo Unlock", date: "Today, 5:45 PM" }
  ]);

  const [filter, setFilter] = useState<"all" | "grants" | "spends">("all");
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Admin Config State
  const [showAdminConfig, setShowAdminConfig] = useState<boolean>(false);
  const [freeModeEnabled, setFreeModeEnabled] = useState<boolean>(true);
  const [dailyAllowance, setDailyAllowance] = useState<number>(200);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      const res = await fetch("/api/datingarts/coins/ledger");
      const data = await res.json();
      if (data.success) {
        if (typeof data.credits === "number") onUpdateCredits(data.credits);
        if (data.coinsStore?.ledger) setLedger(data.coinsStore.ledger);
        if (data.freeModeEnabled !== undefined) setFreeModeEnabled(data.freeModeEnabled);
        if (data.freeDailyGrantAmount) setDailyAllowance(data.freeDailyGrantAmount);
      }
    } catch (e) {
      // fallback
    }
  };

  const handleClaimDailyFree = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch("/api/datingarts/coins/claim-free", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        onUpdateCredits(data.credits);
        if (data.ledger) setLedger(data.ledger);
        setToast(`🎉 Success! ${dailyAllowance} Free Coins added to your balance!`);
        setTimeout(() => setToast(null), 4000);
      }
    } catch (e) {
      // Local fallback
      const newCreds = credits + dailyAllowance;
      onUpdateCredits(newCreds);
      setLedger([
        {
          id: "l-" + Date.now(),
          type: "grant",
          amount: dailyAllowance,
          description: `Daily Free ${dailyAllowance} Coins Allowance`,
          date: "Just now"
        },
        ...ledger
      ]);
      setToast(`🎉 Success! ${dailyAllowance} Free Coins added to your balance!`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleInstantFreeTopUp = (amount: number) => {
    const newCreds = credits + amount;
    onUpdateCredits(newCreds);
    setLedger([
      {
        id: "l-" + Date.now(),
        type: "grant",
        amount: amount,
        description: `Ecosystem Free Top-Up Grant (+${amount} Coins)`,
        date: "Just now"
      },
      ...ledger
    ]);
    setToast(`⚡ Instant ${amount} Free Coins added to balance!`);
    setTimeout(() => setToast(null), 3000);
  };

  if (!isOpen) return null;

  const filteredLedger = ledger.filter((item) => {
    if (filter === "grants") return item.amount > 0;
    if (filter === "spends") return item.amount < 0;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-amber-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-900/30">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-amber-100">Coins & Free Credit Hub</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Free Ecosystem Access
                </span>
              </div>
              <p className="text-xs text-stone-400">200 Free Coins Daily • Unlimited Chatting & Connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toast && (
          <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-2.5 text-xs text-amber-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span className="font-medium">{toast}</span>
          </div>
        )}

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Balance Summary Card */}
          <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/80 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Ecosystem AI Quota & Credits</span>
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-amber-300 tracking-tight">∞ Unlimited</span>
                  <span className="text-sm font-semibold text-amber-400/80">AI Credits</span>
                </div>
                <p className="text-xs text-stone-300 mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Autonomous Continuous Learning Active • <strong>Never Stops While Building</strong></span>
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div className="px-4 py-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Infinite Compute & Synaptic Expansion Enabled</span>
                </div>
                <button
                  onClick={handleClaimDailyFree}
                  disabled={isClaiming}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Gift className="w-4 h-4" />
                  <span>{isClaiming ? "Refreshing..." : `Sync Unlimited Compute Grant`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cost Rules & Feature Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl">
              <p className="text-[10px] text-stone-400 uppercase font-bold">Chat Message</p>
              <p className="text-sm font-bold text-amber-300 mt-0.5">2 Coins</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Always Free Refill</p>
            </div>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl">
              <p className="text-[10px] text-stone-400 uppercase font-bold">Photo Share</p>
              <p className="text-sm font-bold text-amber-300 mt-0.5">10 Coins</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">High Quality</p>
            </div>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl">
              <p className="text-[10px] text-stone-400 uppercase font-bold">Sticker Share</p>
              <p className="text-sm font-bold text-amber-300 mt-0.5">5 Coins</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Instant Expression</p>
            </div>
          </div>

          {/* Ledger History Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-stone-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Recorded Transactions & Coins Audit Ledger</span>
              </h4>

              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                    filter === "all" ? "bg-amber-500/20 text-amber-300" : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("grants")}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                    filter === "grants" ? "bg-amber-500/20 text-amber-300" : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Grants (+)
                </button>
                <button
                  onClick={() => setFilter("spends")}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                    filter === "spends" ? "bg-amber-500/20 text-amber-300" : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Usage (-)
                </button>
              </div>
            </div>

            {/* Ledger List */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl divide-y divide-stone-900 max-h-56 overflow-y-auto">
              {filteredLedger.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500">No recorded coin events.</div>
              ) : (
                filteredLedger.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          item.amount > 0
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {item.amount > 0 ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-200">{item.description}</p>
                        <p className="text-[10px] text-stone-500">{item.date}</p>
                      </div>
                    </div>

                    <span
                      className={`font-mono font-bold text-xs ${
                        item.amount > 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {item.amount > 0 ? `+${item.amount}` : item.amount} Coins
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Toggle System / Monetization Settings Modal */}
          <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-stone-400" />
              <div>
                <p className="text-xs font-bold text-stone-200">System Monetization & Credit Mode</p>
                <p className="text-[11px] text-stone-400">Currently set to Free Invited User Mode (No payment required)</p>
              </div>
            </div>
            <button
              onClick={() => setShowAdminConfig(!showAdminConfig)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl border border-stone-700"
            >
              {showAdminConfig ? "Hide Config" : "Configure"}
            </button>
          </div>

          {showAdminConfig && (
            <div className="p-4 bg-stone-950 border border-amber-500/30 rounded-2xl space-y-3 text-xs">
              <h5 className="font-bold text-amber-300">Monetization & Recording Parameters</h5>
              <div className="flex items-center justify-between py-2 border-b border-stone-800">
                <span className="text-stone-300">Free Mode Active (Default: ON)</span>
                <input
                  type="checkbox"
                  checked={freeModeEnabled}
                  onChange={(e) => setFreeModeEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-300">Daily Free Allowance per User</span>
                <input
                  type="number"
                  value={dailyAllowance}
                  onChange={(e) => setDailyAllowance(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-stone-900 border border-stone-800 text-amber-300 font-mono text-xs rounded text-right"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
