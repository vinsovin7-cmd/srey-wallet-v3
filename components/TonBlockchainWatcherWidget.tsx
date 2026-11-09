import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, RefreshCw, Coins, ArrowUpRight, ShieldCheck, Radio, Wallet, ExternalLink, Check, Copy, Sparkles } from 'lucide-react';
import { getTonviewerLink } from '../src/utils/tonAddressHelper';

export interface BlockchainTransaction {
  id: string;
  txHash: string;
  network: string;
  token: string;
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

export function TonBlockchainWatcherWidget({ onOpenStaking }: { onOpenStaking?: () => void }) {
  const [balanceUsdt, setBalanceUsdt] = useState<number>(1245.80);
  const [tonBalance, setTonBalance] = useState<number>(12.4426);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lastIncrement, setLastIncrement] = useState<{ amount: number; stream: string } | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const walletAddress = "UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ";

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/blockchain/status");
      const data = await res.json();
      if (data.success) {
        setBalanceUsdt(data.totalPlatformBalanceUsdt);
        setTonBalance(data.totalTonBalance);
        if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        }
      }
    } catch (err) {
      console.error("Failed to fetch blockchain status", err);
    }
  };

  useEffect(() => {
    fetchStatus();

    const es = new EventSource("/api/blockchain/stream");
    es.onopen = () => setIsLiveActive(true);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "CONNECTED" && data.payload) {
          setBalanceUsdt(data.payload.totalPlatformBalanceUsdt);
          setTonBalance(data.payload.totalTonBalance);
          if (Array.isArray(data.payload.transactions)) {
            setTransactions(data.payload.transactions);
          }
        } else if (data.event === "BALANCE_INCREMENT" && data.payload) {
          const { newBalanceUsdt, newTonBalance, transaction, usdValue, streamType } = data.payload;
          setBalanceUsdt(newBalanceUsdt);
          if (newTonBalance !== undefined) setTonBalance(newTonBalance);
          if (transaction) {
            setTransactions(prev => [transaction, ...prev.slice(0, 49)]);
          }
          setLastIncrement({
            amount: usdValue || transaction?.usdEquivalent || 5.0,
            stream: streamType || "Micro-Deposit"
          });
          setTimeout(() => setLastIncrement(null), 4000);
        }
      } catch (e) {
        console.error("SSE Parse error", e);
      }
    };
    es.onerror = () => {
      setIsLiveActive(false);
      es.close();
    };

    return () => {
      es.close();
    };
  }, []);

  const handlePollNow = async () => {
    setIsPolling(true);
    try {
      const res = await fetch("/api/blockchain/poll-now", { method: "POST" });
      const data = await res.json();
      if (data.success && data.status) {
        setBalanceUsdt(data.status.totalPlatformBalanceUsdt);
        setTonBalance(data.status.totalTonBalance);
        if (Array.isArray(data.status.transactions)) {
          setTransactions(data.status.transactions);
        }
      }
    } catch (err) {
      console.error("Poll failed", err);
    } finally {
      setTimeout(() => setIsPolling(false), 800);
    }
  };

  const handleSimulateDeposit = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/blockchain/simulate-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 12.50, streamType: "Manual Test Micro-Deposit" })
      });
      const data = await res.json();
      if (data.success) {
        setBalanceUsdt(data.newBalanceUsdt);
        if (data.transaction) {
          setTransactions(prev => [data.transaction, ...prev]);
        }
        setLastIncrement({ amount: 12.50, stream: "Manual Test Micro-Deposit" });
        setTimeout(() => setLastIncrement(null), 4000);
      }
    } catch (err) {
      console.error("Simulate failed", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="w-full bg-[#0d121f] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Radio className="text-white animate-pulse" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-100 font-serif">Toncenter API v2 Blockchain Watcher</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${isLiveActive ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLiveActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                {isLiveActive ? 'LIVE WS / SSE' : 'RECONNECTING'}
              </span>
            </div>
            <p className="text-xs text-stone-400 font-mono">Monitored Wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePollNow}
            disabled={isPolling}
            className="px-3 py-1.5 bg-[#151b2b] hover:bg-[#1e263d] border border-stone-700 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Poll Toncenter API v2 JSON-RPC immediately"
          >
            <RefreshCw size={13} className={isPolling ? "animate-spin" : ""} />
            <span>{isPolling ? "Polling..." : "Poll RPC Now"}</span>
          </button>

          <button
            onClick={handleSimulateDeposit}
            disabled={isSimulating}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Zap size={13} className="fill-stone-950" />
            <span>Simulate Micro-Deposit</span>
          </button>
        </div>
      </div>

      {/* Floating Increment Banner */}
      {lastIncrement && (
        <div className="mb-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl p-3 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={18} />
            <span className="text-xs font-mono text-emerald-200">
              New micro-deposit received from <strong className="text-white">{lastIncrement.stream}</strong>!
            </span>
          </div>
          <span className="text-sm font-bold font-mono text-emerald-300">
            +${lastIncrement.amount.toFixed(2)} USDT
          </span>
        </div>
      )}

      {/* Balance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#121826] border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">Accumulated USDT Balance</span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              ${balanceUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-mono text-stone-500 mt-0.5">Compounding in real-time</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            💵
          </div>
        </div>

        <div className="bg-[#121826] border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">Accumulated TON Balance</span>
            <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
              {tonBalance.toFixed(4)} TON
            </div>
            <div className="text-[11px] font-mono text-stone-500 mt-0.5">Gas reserve & staking rewards</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold">
            💎
          </div>
        </div>
      </div>

      {/* Wallet Address Copy Bar */}
      <div className="bg-[#151c2e] border border-stone-800 rounded-2xl p-3 flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-cyan-400" />
          <span className="text-xs font-mono text-stone-300 font-medium">Target Address:</span>
          <code className="text-xs font-mono text-amber-300 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800">
            {walletAddress}
          </code>
        </div>
        <button
          onClick={() => handleCopy(walletAddress, 'addr')}
          className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          {copiedKey === 'addr' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span>{copiedKey === 'addr' ? 'Copied!' : 'Copy Address'}</span>
        </button>
      </div>

      {/* Incoming Transaction Ticker Log (Tonkeeper / History Layout) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-stone-200 font-serif">Live Incoming Transactions & Micro-Deposits</h3>
          </div>
          <span className="text-xs font-mono text-stone-400">{transactions.length} recorded</span>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-[#121826] border border-stone-800 rounded-2xl p-8 text-center">
            <Activity className="mx-auto text-stone-600 mb-2 animate-pulse" size={28} />
            <p className="text-xs font-mono text-stone-400">Listening to Toncenter RPC for incoming micro-deposits...</p>
            <button
              onClick={handleSimulateDeposit}
              className="mt-3 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs rounded-xl border border-cyan-500/45 transition cursor-pointer"
            >
              Simulate First Deposit Now
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div
                key={tx.id || tx.txHash}
                className="bg-[#121826] hover:bg-[#161f33] border border-stone-800 hover:border-cyan-500/40 rounded-2xl p-3.5 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-200 font-serif">{tx.streamTitle || "Incoming Micro-Deposit"}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {tx.token || "USDT"}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-stone-400 flex items-center gap-2 mt-0.5">
                      <span>Sender: <strong className="text-stone-300">{tx.source || "UQ...7b92"}</strong></span>
                      <span>•</span>
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="text-xs font-bold font-mono text-emerald-400">
                      +{tx.amount} {tx.token || "USDT"}
                    </div>
                    <div className="text-[10px] font-mono text-stone-500">
                      ≈ ${tx.usdEquivalent?.toFixed(2) || tx.amount} USD
                    </div>
                  </div>

                  <a
                    href={getTonviewerLink('address', walletAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-900 hover:bg-stone-800 text-cyan-400 rounded-xl border border-stone-800 transition opacity-80 group-hover:opacity-100"
                    title="View on Tonviewer (Master Wallet Activity)"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
