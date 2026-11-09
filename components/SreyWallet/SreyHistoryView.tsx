import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Repeat, ExternalLink, Filter, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { SreyTransaction } from './sreyWalletStore';

interface SreyHistoryViewProps {
  transactions: SreyTransaction[];
  onOpenExplorer: (txHash: string) => void;
}

export const SreyHistoryView: React.FC<SreyHistoryViewProps> = ({
  transactions,
  onOpenExplorer
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'SEND' | 'RECEIVE' | 'SWAP'>('ALL');

  const filtered = transactions.filter(
    (t) => filterType === 'ALL' || t.type === filterType
  );

  return (
    <div className="w-full space-y-4 animate-fade-in">
      
      {/* Header & Filter Chips */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Clock size={16} className="text-amber-400" />
          <span>Activity & Transaction History</span>
        </h3>

        <div className="flex items-center gap-1 bg-[#0d111c] p-1 rounded-xl border border-stone-800">
          {(['ALL', 'SEND', 'RECEIVE', 'SWAP'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                filterType === type
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-[#0d111c] border border-stone-800/80 rounded-2xl space-y-2">
          <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-stone-500 mx-auto text-xl">
            📜
          </div>
          <h4 className="font-bold text-sm text-white">No Transactions Yet</h4>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            Your transfer, swap, and deposit activities will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-stone-850 bg-[#07090e] rounded-2xl border border-stone-850/80 overflow-hidden shadow-xl">
          {filtered.map((tx) => {
            const isReceive = tx.type === 'RECEIVE';
            const isSwap = tx.type === 'SWAP';

            return (
              <div
                key={tx.id}
                className="p-3.5 flex items-center justify-between hover:bg-[#0e1322] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                    isReceive
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                      : isSwap
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                  }`}>
                    {isReceive ? <ArrowDownLeft size={16} /> : isSwap ? <Repeat size={16} /> : <ArrowUpRight size={16} />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">
                        {tx.type === 'SEND' ? 'Sent' : tx.type === 'RECEIVE' ? 'Received' : 'Swapped'} {tx.symbol}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-stone-900 border border-stone-800 text-[9px] font-mono text-stone-400">
                        {tx.network}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-stone-500 flex items-center gap-2">
                      <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span className="text-emerald-400">Confirmed</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className={`font-mono font-bold text-xs ${
                    isReceive ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {isReceive ? '+' : '-'}{tx.amount} {tx.symbol}
                  </div>
                  <div className="text-[10px] font-mono text-stone-500">
                    ${tx.fiatValueUsd.toFixed(2)} USD
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
