import React, { useState } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { Zap, ArrowUpRight, CheckCircle2, Shield, Activity, RefreshCw } from 'lucide-react';

interface MinerDashboardProps {
  initialBalance?: number;
}

export default function MinerDashboard({ initialBalance = 0.051 }: MinerDashboardProps) {
  const userAddress = useTonAddress();
  const savedAddress = typeof window !== 'undefined' ? (localStorage.getItem('connected_ton_wallet') || '') : '';
  const effectiveAddress = userAddress || savedAddress;

  const [minedBalance, setMinedBalance] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cybernode_accumulated_ton') : null;
    return saved ? parseFloat(saved) : initialBalance;
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    txHash?: string;
  } | null>(null);

  const handleWithdrawal = async () => {
    if (!effectiveAddress) {
      alert("Please connect your Tonkeeper wallet first via TON Connect!");
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      // Trigger request to backend payout server
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWalletAddress: effectiveAddress,
          amountTon: minedBalance
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: `Payout of ${minedBalance.toFixed(4)} TON sent to ${effectiveAddress.substring(0, 6)}...${effectiveAddress.substring(effectiveAddress.length - 4)}!`,
          txHash: result.txHash
        });
        setMinedBalance(0);
        localStorage.setItem('cybernode_accumulated_ton', '0');
      } else {
        setStatusMessage({
          type: 'error',
          text: `Transaction Failed: ${result.error || 'Unknown error'}`
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Error executing payout request: ${err.message || 'Network error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#0a0e1a] border border-cyan-500/30 text-white rounded-2xl shadow-xl max-w-xl mx-auto space-y-6">
      {/* Wallet Connection Button */}
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Zap size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-serif">CyberNode VIP</h1>
            <p className="text-[11px] text-stone-400">TON Cloud Mining Vault</p>
          </div>
        </div>
        <TonConnectButton />
      </div>

      {/* Balance & Action */}
      <div className="text-center py-6 px-4 bg-stone-900/60 border border-stone-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 font-mono tracking-wider">
          <Activity size={14} className="text-cyan-400 animate-pulse" />
          <span>MINED BALANCE</span>
        </div>
        <div className="text-4xl font-mono font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          {minedBalance.toFixed(6)} TON
        </div>
        <div className="text-xs text-stone-400 font-mono">
          Rate: +0.051 TON/Day • PoS Network Escrow
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
            : 'bg-red-950/60 border-red-500/40 text-red-200'
        }`}>
          <div className="flex items-center gap-1.5 font-bold">
            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <Shield size={16} />}
            <span>{statusMessage.text}</span>
          </div>
          {statusMessage.txHash && (
            <div className="text-[10px] text-stone-400 truncate pt-1">
              Hash: {statusMessage.txHash}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleWithdrawal}
        disabled={loading || minedBalance <= 0}
        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-black text-sm uppercase rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>Processing Payout...</span>
          </>
        ) : (
          <>
            <Zap size={16} className="fill-current" />
            <span>WITHDRAW TO TONKEEPER</span>
            <ArrowUpRight size={16} />
          </>
        )}
      </button>

      {effectiveAddress && (
        <div className="text-[11px] text-stone-400 font-mono text-center truncate">
          Payout Destination: <span className="text-cyan-300 font-bold">{effectiveAddress}</span>
        </div>
      )}
    </div>
  );
}
