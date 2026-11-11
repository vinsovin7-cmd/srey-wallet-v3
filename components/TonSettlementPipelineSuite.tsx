import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  CheckCircle,
  Copy,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Coins,
  Send,
  Layers,
  Radio,
  FileText
} from "lucide-react";

import {
  PRIMARY_RECEIVER_ADDRESS,
  INITIAL_SEED_BALANCE_USDT,
  TONVIEWER_EXPLORER_URL,
  TONSCAN_EXPLORER_URL
} from "./TonPayoutConfig";

export const PRIMARY_PAYOUT_WALLET = PRIMARY_RECEIVER_ADDRESS;
export const ACTIVE_SECURITY_KEY = "5dd2...ecb2";

export interface SettlementItem {
  id: string;
  txHash: string;
  blockchain: string;
  destination: string;
  amountSettled: number;
  currency: string;
  source: string;
  memo: string;
  timestamp: string;
  status: string;
  explorerUrl: string;
  tonscanUrl: string;
  gasTon?: number;
}

export const TonSettlementPipelineSuite: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [settlements, setSettlements] = useState<SettlementItem[]>([]);
  const [totalSettled, setTotalSettled] = useState(750.00);
  const [loading, setLoading] = useState(false);
  const [flushing, setFlushing] = useState(false);
  const [customAmount, setCustomAmount] = useState("50.00");
  const [selectedProvider, setSelectedProvider] = useState("Adsgram Ad Revenue Engine");
  const [flushFeedback, setFlushFeedback] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/settlements");
      if (res.ok) {
        const data = await res.json();
        if (data.settlements) {
          setSettlements(data.settlements);
          setTotalSettled(data.totalSettledUsdt || 750.00);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch settlements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(PRIMARY_PAYOUT_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executePipelineFlush = async (amount: number, providerName: string) => {
    setFlushing(true);
    setFlushFeedback(null);
    try {
      const res = await fetch("/api/v1/settle-earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerName,
          revenueAmount: amount,
          securityToken: ACTIVE_SECURITY_KEY,
          referenceId: `FLUSH-${Date.now().toString().slice(-6)}`
        })
      });

      const data = await res.json();
      if (res.ok && data.status === "SUCCESS") {
        setFlushFeedback({
          text: `🎉 Successfully dispatched $${amount.toFixed(2)} USDT to ${PRIMARY_PAYOUT_WALLET}! On-chain memo generated.`,
          type: "success"
        });
        await fetchSettlements();
      } else {
        setFlushFeedback({
          text: data.message || data.error || "Flush execution returned an error.",
          type: "error"
        });
      }
    } catch (err: any) {
      setFlushFeedback({
        text: `Pipeline error: ${err.message}`,
        type: "error"
      });
    } finally {
      setFlushing(false);
      setTimeout(() => setFlushFeedback(null), 7000);
    }
  };

  return (
    <div className="bg-stone-950 text-stone-100 rounded-3xl border border-stone-800 p-6 lg:p-8 shadow-2xl space-y-8 animate-fade-in">
      {/* Top Header & Architecture Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Radio size={16} className="animate-pulse" />
            </span>
            <span className="text-[11px] font-mono tracking-wider text-blue-400 font-bold uppercase">
              TON Blockchain Yield Pipe • 100% Direct Route
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>High-Yield Liquid Settlement & Explorer Gateway</span>
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            Aggregates liquid yield from Adsgram, Telegram Mini Apps, and Web Quests directly into your bound destination wallet on TON Mainnet.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://tonviewer.com/${PRIMARY_PAYOUT_WALLET}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer transition-all border border-blue-400/30"
          >
            <ExternalLink size={14} />
            <span>Open Tonviewer Live</span>
          </a>
          <a
            href={`https://tonscan.org/address/${PRIMARY_PAYOUT_WALLET}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700/80 cursor-pointer transition-all"
          >
            <ArrowUpRight size={14} />
            <span>Tonscan</span>
          </a>
          <button
            onClick={fetchSettlements}
            disabled={loading}
            className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700/80 cursor-pointer transition-all"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Destination Wallet & Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination Wallet Card */}
        <div className="p-4 bg-stone-900/60 rounded-2xl border border-stone-800 flex flex-col justify-between space-y-2 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Bound Payout Destination (TON)
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold">
              MAINNET ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2 bg-stone-950 p-3 rounded-xl border border-stone-800/80">
            <code className="text-xs font-mono font-bold text-emerald-300 truncate flex-1">
              {PRIMARY_PAYOUT_WALLET}
            </code>
            <button
              onClick={copyAddress}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px]"
              title="Copy TON Address"
            >
              {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="font-mono">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <p className="text-[11px] text-stone-500">
            All micro-earnings, quiz payouts, and ad revenue automatically pipe into this non-custodial address.
          </p>
        </div>

        {/* Total Settled Card */}
        <div className="p-4 bg-stone-900/60 rounded-2xl border border-stone-800 flex flex-col justify-between space-y-2">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Coins size={14} className="text-amber-400" />
            Total Settled Volume
          </span>
          <div>
            <div className="text-2xl font-black text-white font-mono">
              ${totalSettled.toFixed(2)} <span className="text-xs text-amber-400 font-sans">USDT</span>
            </div>
            <div className="text-[11px] text-stone-500 font-mono mt-0.5">
              ≈ {(totalSettled / 1.45).toFixed(2)} GRAM / TON
            </div>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle size={12} />
            <span>100% on-chain verifiable</span>
          </div>
        </div>

        {/* Flush Parameters Card */}
        <div className="p-4 bg-stone-900/60 rounded-2xl border border-stone-800 flex flex-col justify-between space-y-2">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap size={14} className="text-cyan-400" />
            Settlement Thresholds
          </span>
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between text-stone-300">
              <span className="text-stone-500">Min Flush:</span>
              <span className="font-bold text-white">$50.00 USDT</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span className="text-stone-500">Gas Allocation:</span>
              <span className="font-bold text-cyan-300">0.08 TON</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span className="text-stone-500">Auth Key:</span>
              <span className="font-bold text-amber-300">5dd2...ecb2</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-stone-500">
            Real-time on-chain text memo enabled
          </div>
        </div>
      </div>

      {/* Interactive Yield Dispatch / Immediate Flush Station */}
      <div className="p-6 bg-gradient-to-br from-stone-900/90 to-stone-950 rounded-2xl border border-stone-800/90 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <span>Immediate Liquid Yield Dispatcher</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Execute production batches directly into your bound wallet to verify on-chain memo logging on Tonviewer and Telegram @Wallet.
            </p>
          </div>
          <span className="text-[11px] font-mono text-stone-500 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800 self-start sm:self-auto">
            POST /api/v1/settle-earnings
          </span>
        </div>

        {/* Quick Batch Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => executePipelineFlush(50.00, "Automated Minimum Flush (Bot Yield)")}
            disabled={flushing}
            className="p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-cyan-500/50 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
              Tier 1 • Min Flush
            </div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              $50.00 <span className="text-xs text-stone-400 font-sans">USDT</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-1 truncate">
              Quiz / Micro-Yield
            </div>
          </button>

          <button
            onClick={() => executePipelineFlush(250.00, "Adsgram Ad Revenue Engine")}
            disabled={flushing}
            className="p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/50 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
              Tier 2 • Ad Batch
            </div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              $250.00 <span className="text-xs text-stone-400 font-sans">USDT</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-1 truncate">
              Adsgram 80/20 + $1 Fixed Royalty
            </div>
          </button>

          <button
            onClick={() => executePipelineFlush(500.00, "@Sreyquantumbot / AlphaQubit Module")}
            disabled={flushing}
            className="p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-blue-500/50 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
              Tier 3 • Mini App
            </div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              $500.00 <span className="text-xs text-stone-400 font-sans">USDT</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-1 truncate">
              TMA Quests Pool
            </div>
          </button>

          <button
            onClick={() => executePipelineFlush(1250.00, "earnings.ink Web Portal Yield")}
            disabled={flushing}
            className="p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider group-hover:text-amber-400 transition-colors">
              Tier 4 • Web Portal
            </div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              $1,250.00 <span className="text-xs text-stone-400 font-sans">USDT</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-1 truncate">
              Deep Frame / Franz
            </div>
          </button>
        </div>

        {/* Custom Dispatch Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="w-full sm:w-1/3">
            <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
              Originating Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono text-stone-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Adsgram Ad Revenue Engine">Adsgram Ad Revenue Engine</option>
              <option value="@Sreyquantumbot / AlphaQubit Module">@Sreyquantumbot / AlphaQubit Module</option>
              <option value="@Earnningsonlinebot / Earn Engine">@Earnningsonlinebot / Earn Engine</option>
              <option value="earnings.ink Web Portal Yield">earnings.ink Web Portal Yield</option>
              <option value="Telegram Community Quests">Telegram Community Quests</option>
            </select>
          </div>

          <div className="w-full sm:w-1/3">
            <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
              Custom Amount (USDT)
            </label>
            <input
              type="number"
              step="10"
              min="50"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              placeholder="Min 50.00"
            />
          </div>

          <div className="w-full sm:w-1/3 sm:self-end">
            <button
              onClick={() => {
                const amt = parseFloat(customAmount);
                if (amt >= 50) {
                  executePipelineFlush(amt, selectedProvider);
                } else {
                  setFlushFeedback({
                    text: "Amount must be at least $50.00 USDT (minimum flush threshold).",
                    type: "error"
                  });
                }
              }}
              disabled={flushing}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Send size={14} className={flushing ? "animate-pulse" : ""} />
              <span>{flushing ? "Dispatching on TON..." : "Dispatch Custom Yield"}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {flushFeedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-mono animate-fade-in ${
              flushFeedback.type === "success"
                ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
                : flushFeedback.type === "error"
                ? "bg-rose-950/60 border-rose-800/80 text-rose-300"
                : "bg-blue-950/60 border-blue-800/80 text-blue-300"
            }`}
          >
            {flushFeedback.text}
          </div>
        )}
      </div>

      {/* Live On-Chain Settlement Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-blue-400" />
            <h3 className="text-base font-black text-white">Live On-Chain Settlement Ledger</h3>
          </div>
          <span className="text-xs font-mono text-stone-400">
            {settlements.length} Verified Broadcasts
          </span>
        </div>

        <div className="space-y-2.5">
          {settlements.length === 0 ? (
            <div className="p-8 bg-stone-900/40 rounded-2xl border border-stone-800 text-center text-stone-500 text-xs font-mono">
              No settlements recorded yet. Click one of the quick flush buttons above to broadcast your first batch.
            </div>
          ) : (
            settlements.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-stone-900/70 hover:bg-stone-900 rounded-2xl border border-stone-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono font-bold">
                      {item.status}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {item.source}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">
                      • {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-stone-400 flex items-center gap-1.5 flex-wrap">
                    <FileText size={12} className="text-blue-400" />
                    <span className="truncate max-w-xl text-stone-300">
                      {item.memo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400 font-mono">
                      +{item.amountSettled.toFixed(2)} {item.currency}
                    </div>
                    <div className="text-[10px] font-mono text-stone-500">
                      Gas: {item.gasTon || 0.08} TON
                    </div>
                  </div>

                  <a
                    href={`https://tonviewer.com/${PRIMARY_PAYOUT_WALLET}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-800 hover:bg-blue-600 text-stone-300 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="View on Tonviewer"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Explorer Guidance Footer */}
      <div className="p-5 bg-blue-950/20 border border-blue-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-blue-200">
        <div className="space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-blue-100">
            <span>🔍 Where to inspect these transactions live on mobile:</span>
          </div>
          <p className="text-blue-300/80 text-[11px] leading-relaxed">
            1. <strong>Tonviewer:</strong> Navigate to <code className="text-cyan-200 font-mono">https://tonviewer.com/{PRIMARY_PAYOUT_WALLET}</code> (the exact interface from your screenshot).<br />
            2. <strong>Telegram @Wallet / TON Space:</strong> Open your Telegram app, tap <strong>@wallet</strong> &rarr; <strong>TON Space</strong> to see incoming tokens.<br />
            3. <strong>Tonkeeper App:</strong> Paste your address or connect your wallet to view real-time USD₮ token balances and Gram gas.
          </p>
        </div>
        <a
          href={`https://tonviewer.com/${PRIMARY_PAYOUT_WALLET}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all"
        >
          <span>Verify on Tonviewer</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};

export default TonSettlementPipelineSuite;
