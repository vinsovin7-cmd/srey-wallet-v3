import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, ShieldCheck, ArrowDownLeft, Sparkles } from 'lucide-react';
import { SreyAccount } from './sreyWalletStore';

interface SreyReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: SreyAccount;
}

export const SreyReceiveModal: React.FC<SreyReceiveModalProps> = ({
  isOpen,
  onClose,
  account
}) => {
  const [selectedChain, setSelectedChain] = useState<'TON' | 'EVM' | 'BTC' | 'TRX'>('TON');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAddress =
    selectedChain === 'TON'
      ? account.tonAddress
      : selectedChain === 'EVM'
      ? account.evmAddress
      : selectedChain === 'BTC'
      ? account.btcAddress
      : account.trxAddress;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My Srey Wallet ${selectedChain} Address`,
        text: currentAddress
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0d111c] border border-stone-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl relative text-white font-sans text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold">
              <ArrowDownLeft size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Receive Crypto</h3>
              <p className="text-[10px] text-stone-400">Scan QR Code or Copy Address</p>
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

        {/* Chain Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 bg-[#07090e] p-1 rounded-xl border border-stone-800 max-w-xs mx-auto text-xs font-mono">
          {(['TON', 'EVM', 'BTC', 'TRX'] as const).map((chain) => (
            <button
              key={chain}
              type="button"
              onClick={() => setSelectedChain(chain)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedChain === chain
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl max-w-[200px] mx-auto border-4 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentAddress)}`}
            alt="QR Code"
            className="w-full h-auto aspect-square rounded-lg"
          />
        </div>

        {/* Address Display */}
        <div className="bg-[#07090e] p-3 rounded-xl border border-stone-800 text-left space-y-1">
          <span className="text-[10px] font-mono text-stone-500 block font-bold">
            Your {selectedChain} Deposit Address:
          </span>
          <p className="text-xs font-mono text-stone-200 break-all leading-relaxed select-all">
            {currentAddress}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs rounded-xl border border-stone-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 size={15} />
            <span>Share Address</span>
          </button>
        </div>

        <p className="text-[10px] font-mono text-stone-500">
          Send only {selectedChain}-compatible tokens to this address.
        </p>

      </div>
    </div>
  );
};
