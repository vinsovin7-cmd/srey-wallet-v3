import React, { useState } from 'react';
import { X, Send, ArrowUpRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { SreyToken, SreyTransaction } from './sreyWalletStore';

interface SreySendModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: SreyToken[];
  defaultToken?: SreyToken;
  onSendSuccess: (tx: SreyTransaction) => void;
}

export const SreySendModal: React.FC<SreySendModalProps> = ({
  isOpen,
  onClose,
  tokens,
  defaultToken,
  onSendSuccess
}) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string>(defaultToken?.id || tokens[0]?.id || 'srey');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentToken = tokens.find((t) => t.id === selectedTokenId) || tokens[0];
  const parsedAmount = parseFloat(amount) || 0;
  const estimatedFee = 0.005; // 0.005 TON fee

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      setStatusMessage('Please enter a recipient address or username.');
      return;
    }
    if (parsedAmount <= 0) {
      setStatusMessage('Please enter a valid amount.');
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    // Simulate fast on-chain broadcast
    setTimeout(() => {
      setIsSending(false);
      const randomHex = Math.random().toString(16).substring(2, 10);
      const newTx: SreyTransaction = {
        id: `tx-${Date.now()}`,
        type: 'SEND',
        symbol: currentToken.symbol,
        amount: parsedAmount,
        fiatValueUsd: parsedAmount * currentToken.priceUsd,
        recipientOrSender: recipient,
        txHash: `0x${randomHex}...${Date.now().toString(16)}`,
        timestamp: Date.now(),
        status: 'COMPLETED',
        network: currentToken.network,
        fee: estimatedFee
      };

      onSendSuccess(newTx);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0d111c] border border-stone-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl relative text-white font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold">
              <ArrowUpRight size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Send Assets</h3>
              <p className="text-[10px] text-stone-400">Non-Custodial Multi-Chain Transfer</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 bg-amber-950/60 border border-amber-500/60 rounded-xl text-xs text-amber-200 font-bold">
            {statusMessage}
          </div>
        )}

        {/* Send Form */}
        <form onSubmit={handleSend} className="space-y-3 text-xs">
          
          {/* Asset Selector */}
          <div>
            <label className="text-[11px] font-mono text-stone-400 block mb-1">Select Token:</label>
            <select
              value={selectedTokenId}
              onChange={(e) => setSelectedTokenId(e.target.value)}
              className="w-full bg-[#07090e] border border-stone-800 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-amber-500 cursor-pointer"
            >
              {tokens.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.symbol}) — {t.network} [Bal: {t.balance} {t.symbol}]
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="text-[11px] font-mono text-stone-400 block mb-1">Recipient Address or @Username:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. UQAUc97F... or @username"
              className="w-full bg-[#07090e] border border-stone-800 rounded-xl p-3 text-xs font-mono text-white placeholder:text-stone-600 outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-stone-400 block">Amount:</label>
              <button
                type="button"
                onClick={() => setAmount(String(currentToken.balance))}
                className="text-[10px] font-mono text-amber-400 hover:underline"
              >
                Max: {currentToken.balance} {currentToken.symbol}
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#07090e] border border-stone-800 rounded-xl p-3 text-sm font-mono text-white placeholder:text-stone-600 outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-3 text-xs font-mono text-stone-400 font-bold">
                {currentToken.symbol}
              </span>
            </div>
            <div className="text-[10px] font-mono text-stone-500 pt-1">
              ≈ ${(parsedAmount * currentToken.priceUsd).toFixed(2)} USD
            </div>
          </div>

          {/* Fee & Network Info */}
          <div className="p-3 bg-black/40 rounded-xl border border-stone-850 text-[11px] font-mono space-y-1 text-stone-400">
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="text-stone-200">{currentToken.networkName}</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Gas Fee:</span>
              <span className="text-emerald-400 font-bold">~{estimatedFee} TON ($0.02)</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-stone-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {isSending ? (
              <span>Broadcasting to Blockchain...</span>
            ) : (
              <>
                <Send size={15} />
                <span>Confirm & Send {currentToken.symbol}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
