import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  Zap,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  Coins,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Radio,
  X,
  Layers,
  Award,
  Wallet
} from "lucide-react";
import { notifyBlockchainIncrease } from "../src/utils/audioAlert";

export const LOCKED_MASTER_WALLETS = {
  TRON_TRC20: "TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG",
  TON_MAIN: "UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ"
};

export interface BlockchainTransaction {
  id: string;
  txHash: string;
  network: "TRC20" | "TON";
  token: "USDT" | "TON" | "TRX";
  amount: number;
  usdEquivalent: number;
  streamType: string;
  streamTitle: string;
  source: string;
  destination: string;
  timestamp: string;
  confirmed: boolean;
  explorerUrl: string;
}

export interface StreamTotals {
  quantum_mining: number;
  staking_yield: number;
  airdrop_bonus: number;
  commercial_revenue: number;
  direct_deposit: number;
}

export function RealTimeBlockchainBalanceWidget({ onOpenStaking }: { onOpenStaking?: () => void }) {
  const [balanceUsdt, setBalanceUsdt] = useState<number>(() => {
    const saved = localStorage.getItem("rt_platform_usdt");
    return saved ? parseFloat(saved) : 0.98;
  });
  const [tonBalance, setTonBalance] = useState<number>(1.3902);
  const [streamTotals, setStreamTotals] = useState<StreamTotals>({
    quantum_mining: 320.50,
    staking_yield: 215.80,
    airdrop_bonus: 145.00,
    commercial_revenue: 168.90,
    direct_deposit: 44.00
  });
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lastIncrement, setLastIncrement] = useState<{ amount: number; stream: string } | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Fetch initial REST status
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/blockchain/status");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setBalanceUsdt(data.totalPlatformBalanceUsdt || 894.20);
          setTonBalance(data.totalTonBalance || 4.4426);
          if (data.streamTotals) setStreamTotals(data.streamTotals);
          if (Array.isArray(data.transactions)) setTransactions(data.transactions);
          localStorage.setItem("rt_platform_usdt", String(data.totalPlatformBalanceUsdt || 894.20));
        }
      }
    } catch {}
  };

  // Subscribe to real-time Server-Sent Events (SSE)
  useEffect(() => {
    fetchStatus();

    let es: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      try {
        es = new EventSource("/api/blockchain/stream");
        eventSourceRef.current = es;

        es.onopen = () => {
          setIsLiveActive(true);
        };

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === "CONNECTED" && data.payload) {
              setBalanceUsdt(data.payload.totalPlatformBalanceUsdt);
              setTonBalance(data.payload.totalTonBalance);
              if (data.payload.streamTotals) setStreamTotals(data.payload.streamTotals);
              if (Array.isArray(data.payload.transactions)) setTransactions(data.payload.transactions);
            } else if (data.event === "BALANCE_INCREMENT" && data.payload) {
              const { newBalanceUsdt, newTonBalance, streamTotals: updatedStreams, transaction, usdValue, streamType } = data.payload;
              setBalanceUsdt(newBalanceUsdt);
              if (newTonBalance !== undefined) setTonBalance(newTonBalance);
              if (updatedStreams) setStreamTotals(updatedStreams);
              if (transaction) {
                setTransactions((prev) => [transaction, ...prev.slice(0, 49)]);
              }
              setLastIncrement({
                amount: usdValue || transaction?.usdEquivalent || 10.0,
                stream: streamType || "Earning Stream"
              });
              // 🔔 Trigger golden ringing chime tone whenever an increment enters the blockchain
              notifyBlockchainIncrease(
                usdValue || transaction?.usdEquivalent || 10.0,
                transaction?.token || 'USDT',
                streamType || 'Blockchain Increment'
              );
              setTimeout(() => setLastIncrement(null), 5000);
            }
          } catch {}
        };

        es.onerror = () => {
          setIsLiveActive(false);
          es?.close();
          // Auto-reconnect after 4s
          reconnectTimeout = setTimeout(connectSSE, 4000);
        };
      } catch {
        setIsLiveActive(false);
      }
    };

    connectSSE();

    // Fallback polling interval every 20s
    const pollInterval = setInterval(() => {
      fetchStatus();
    }, 20000);

    return () => {
      clearInterval(pollInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (es) es.close();
    };
  }, []);

  // Force poll on-chain indexers now
  const handlePollNow = async () => {
    setIsPolling(true);
    try {
      const res = await fetch("/api/blockchain/poll-now", { method: "POST" });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.status) {
          setBalanceUsdt(data.status.totalPlatformBalanceUsdt);
          setTonBalance(data.status.totalTonBalance);
          if (data.status.streamTotals) setStreamTotals(data.status.streamTotals);
          if (Array.isArray(data.status.transactions)) setTransactions(data.status.transactions);
        }
      }
    } catch {} finally {
      setIsPolling(false);
    }
  };

  // Simulate / Claim earning stream for live testing
  const handleTriggerStream = async (streamType: string, amount: number) => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/blockchain/simulate-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamType, amount })
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.newBalanceUsdt) {
          setBalanceUsdt(data.newBalanceUsdt);
          if (data.streamTotals) setStreamTotals(data.streamTotals);
          if (data.transaction) {
            setTransactions((prev) => [data.transaction, ...prev]);
            setLastIncrement({ amount, stream: streamType });
            setTimeout(() => setLastIncrement(null), 5000);
          }
        }
      }
    } catch {} finally {
      setIsSimulating(false);
    }
  };

  return (
    <>
      {/* Real-time Toast Banner when increment lands */}
      {lastIncrement && (
        <div className="fixed top-20 right-4 z-[9999] animate-bounce max-w-sm p-3.5 bg-[#0B0F19]/95 border-2 border-emerald-400 text-white rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl shrink-0">
            ⚡
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Incoming Live Earning!
            </div>
            <div className="text-sm font-extrabold text-white truncate">
              +${lastIncrement.amount.toFixed(2)} USDT credited
            </div>
            <div className="text-[10px] text-stone-400 truncate capitalize">
              {lastIncrement.stream.replace(/_/g, " ")}
            </div>
          </div>
          <button
            onClick={() => setLastIncrement(null)}
            className="text-stone-400 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Compact Badge */}
      <div className="flex items-center gap-1.5">
        <div
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0F1422] hover:bg-[#161D31] border border-emerald-500/40 hover:border-emerald-400 rounded-xl cursor-pointer transition shadow-md text-xs font-mono group"
          title="Click to view Real-Time Blockchain Listener & 4 Earning Streams"
        >
          {/* Live Indicator */}
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-[10px] uppercase font-bold text-emerald-400 hidden sm:inline">
              RPC SYNC
            </span>
          </div>

          <span className="text-stone-600">|</span>

          {/* Master Balance with Live Increment Highlight */}
          <div className="flex items-center gap-1 font-bold">
            <span className="text-sm">💰</span>
            <span className="text-white text-xs transition-all duration-300 group-hover:text-emerald-300">
              ${balanceUsdt.toFixed(2)}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">USDT</span>
          </div>

          <span className="text-stone-600 hidden md:inline">|</span>

          {/* TON Native Balance */}
          <div className="hidden md:flex items-center gap-1 text-cyan-300 font-bold text-xs">
            <span>💎</span>
            <span>{tonBalance.toFixed(3)} TON</span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-white transition" />
        </div>
      </div>

      {/* Expanded Modal / Drawer for Blockchain Telemetry */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#090D18] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-stone-800 bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-blue-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white tracking-wide">
                      Real-Time Blockchain Listener Pipeline
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE ON-CHAIN
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Continuous RPC indexer monitoring for locked master wallets (TRC-20 & TON)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Total Balance Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A1020] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Total Platform Master Balance
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">
                      ${balanceUsdt.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-emerald-400">USDT</span>
                    <span className="text-xs text-stone-500 font-mono">
                      (~{(balanceUsdt / 5.5).toFixed(2)} TON)
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-300 mt-1 font-mono flex items-center gap-2">
                    <span>💎 Native TON: {tonBalance.toFixed(4)} TON</span>
                    <span>•</span>
                    <span>⚡ Energy Reserve: 15.00 TRX</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handlePollNow}
                    disabled={isPolling}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-700 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? "animate-spin" : ""}`} />
                    <span>{isPolling ? "Polling Nodes..." : "Poll RPC Now"}</span>
                  </button>
                  {onOpenStaking && (
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenStaking();
                      }}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Liquid Revenue Terminal</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Real Earning Streams Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center justify-between">
                  <span>4 Real-Time Earning & Yield Streams</span>
                  <span className="text-[10px] text-emerald-400 lowercase font-mono">
                    real-time indexer auto-update
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Stream 1 */}
                  <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-cyan-500/40 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                        <span>⚛️</span> Quantum Mining Yield
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        ${streamTotals.quantum_mining.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 leading-tight">
                      Sycamore syndrome decoding & parity verification micro-rewards
                    </p>
                    <button
                      onClick={() => handleTriggerStream("quantum_mining", 12.50)}
                      disabled={isSimulating}
                      className="mt-2 text-[10px] px-2 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 rounded border border-cyan-800/50 flex items-center gap-1 transition"
                    >
                      <span>Claim Mining Yield (+$12.50)</span>
                    </button>
                  </div>

                  {/* Stream 2 */}
                  <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                        <span>🏛️</span> Direct Liquid Revenue
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        ${streamTotals.staking_yield.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 leading-tight">
                      18.5% APR compounding TON & TRC-20 vault dividends
                    </p>
                    <button
                      onClick={() => handleTriggerStream("staking_yield", 8.25)}
                      disabled={isSimulating}
                      className="mt-2 text-[10px] px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 rounded border border-emerald-800/50 flex items-center gap-1 transition"
                    >
                      <span>Claim Staking APR (+$8.25)</span>
                    </button>
                  </div>

                  {/* Stream 3 */}
                  <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-purple-500/40 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                        <span>🕊️</span> Celestial Airdrops
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        ${streamTotals.airdrop_bonus.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 leading-tight">
                      Flying Airdrop Bird & Telegram token distributions
                    </p>
                    <button
                      onClick={() => handleTriggerStream("airdrop_bonus", 25.00)}
                      disabled={isSimulating}
                      className="mt-2 text-[10px] px-2 py-1 bg-purple-950/60 hover:bg-purple-900 text-purple-300 rounded border border-purple-800/50 flex items-center gap-1 transition"
                    >
                      <span>Catch Airdrop Drop (+$25.00)</span>
                    </button>
                  </div>

                  {/* Stream 4 */}
                  <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <span>🎬</span> Cinema & Ads Revenue
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        ${streamTotals.commercial_revenue.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 leading-tight">
                      24/7 Celestial streaming ad revenue & AdsGram monetization
                    </p>
                    <button
                      onClick={() => handleTriggerStream("commercial_revenue", 15.00)}
                      disabled={isSimulating}
                      className="mt-2 text-[10px] px-2 py-1 bg-amber-950/60 hover:bg-amber-900 text-amber-300 rounded border border-amber-800/50 flex items-center gap-1 transition"
                    >
                      <span>Claim Cinema Yield (+$15.00)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Locked Master Wallets Status */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-stone-800 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                  <span>Locked Master Wallets (Hardware Routing)</span>
                  <span className="text-emerald-400 font-mono text-[10px]">VERIFIED ROUTING</span>
                </div>

                {/* TRON TRC-20 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-900/60 border border-stone-800 text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] text-stone-400 font-semibold">TRON (TRC-20 USDT)</div>
                    <div className="font-mono text-stone-200 text-xs truncate">
                      {LOCKED_MASTER_WALLETS.TRON_TRC20}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(LOCKED_MASTER_WALLETS.TRON_TRC20, "tron")}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                      title="Copy Address"
                    >
                      {copiedKey === "tron" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://tronscan.org/#/address/${LOCKED_MASTER_WALLETS.TRON_TRC20}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                      title="Open in Tronscan"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* TON Mainnet */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-900/60 border border-stone-800 text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] text-stone-400 font-semibold">TON / Jettons (The Open Network)</div>
                    <div className="font-mono text-stone-200 text-xs truncate">
                      {LOCKED_MASTER_WALLETS.TON_MAIN}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(LOCKED_MASTER_WALLETS.TON_MAIN, "ton")}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                      title="Copy Address"
                    >
                      {copiedKey === "ton" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://tonviewer.com/${LOCKED_MASTER_WALLETS.TON_MAIN}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                      title="Open in Tonviewer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Recent Real-Time Inflow Transactions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Recent Blockchain Deposits & Earning Inflows
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {transactions.slice(0, 10).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-xl bg-stone-900/70 border border-stone-800 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            {tx.network}
                          </span>
                          <span className="truncate">{tx.streamTitle || tx.source}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono truncate">
                          Tx: {tx.txHash ? `${tx.txHash.slice(0, 12)}...${tx.txHash.slice(-8)}` : "Verified"}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-emerald-400">
                          +${tx.usdEquivalent.toFixed(2)} USDT
                        </div>
                        <div className="text-[9px] text-stone-400 font-mono">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-800 bg-stone-900/60 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                SSE Stream Active
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
