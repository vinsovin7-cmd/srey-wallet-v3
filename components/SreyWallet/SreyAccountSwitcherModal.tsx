import React from 'react';
import { X, Check, Plus, Shield, Copy } from 'lucide-react';
import { SreyAccount } from './sreyWalletStore';

interface SreyAccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: SreyAccount[];
  activeAccountId: string;
  onSelectAccount: (acc: SreyAccount) => void;
  onAddNewAccount: () => void;
}

export const SreyAccountSwitcherModal: React.FC<SreyAccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  accounts,
  activeAccountId,
  onSelectAccount,
  onAddNewAccount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0d111c] border border-stone-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl relative text-white font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold">
              ⚔️
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Switch Srey Accounts</h3>
              <p className="text-[10px] text-stone-400">Manage Multi-Account Non-Custodial Vaults</p>
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

        {/* Accounts List */}
        <div className="space-y-2">
          {accounts.map((acc) => {
            const isActive = acc.id === activeAccountId;
            const shortTon = `${acc.tonAddress.slice(0, 8)}...${acc.tonAddress.slice(-6)}`;

            return (
              <div
                key={acc.id}
                onClick={() => {
                  onSelectAccount(acc);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-md'
                    : 'bg-[#07090e] border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-300'
                  }`}>
                    {acc.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>{acc.name}</span>
                      {isActive && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      {shortTon}
                    </div>
                  </div>
                </div>

                {isActive && <Check size={18} className="text-amber-400" />}
              </div>
            );
          })}
        </div>

        {/* Add Account Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onAddNewAccount();
          }}
          className="w-full py-3 bg-[#07090e] hover:bg-[#141a2b] border border-dashed border-stone-700 hover:border-amber-500 text-stone-300 hover:text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus size={16} className="text-amber-400" />
          <span>Derive New Srey Account (Wallet {accounts.length + 1})</span>
        </button>

      </div>
    </div>
  );
};
