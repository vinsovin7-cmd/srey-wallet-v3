import React, { useState } from 'react';
import { ShieldCheck, Lock, Copy, Check, ArrowRight, KeyRound, AlertTriangle, Sparkles, RefreshCw, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';
import { generate24WordMnemonic, isValidMnemonic, normalizeMnemonic, deriveAddressesFromMnemonic, SreyAccount } from './sreyWalletStore';

interface SreyWalletOnboardingProps {
  onComplete: (account: SreyAccount) => void;
  onClose?: () => void;
}

export const SreyWalletOnboarding: React.FC<SreyWalletOnboardingProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState<'splash' | 'backup' | 'verify' | 'import'>('splash');
  const [generatedPhrase, setGeneratedPhrase] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [revealPhrase, setRevealPhrase] = useState<boolean>(true);

  // Verification State: 3 random indices from 0..23
  const [verifyIndices, setVerifyIndices] = useState<number[]>([2, 8, 16]); // 1-indexed: #3, #9, #17
  const [userSelectedWords, setUserSelectedWords] = useState<{ [index: number]: string }>({});
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Import State
  const [importInput, setImportInput] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  // Start creation flow
  const handleStartCreate = () => {
    const mnemonic = generate24WordMnemonic();
    const wordArray = mnemonic.split(' ');
    setGeneratedPhrase(mnemonic);
    setWords(wordArray);

    // Pick 3 random distinct indices for verification
    const allIndices = Array.from({ length: 24 }, (_, i) => i);
    const shuffled = allIndices.sort(() => 0.5 - Math.random());
    const selectedThree = shuffled.slice(0, 3).sort((a, b) => a - b);
    setVerifyIndices(selectedThree);
    setUserSelectedWords({});
    setVerifyError(null);

    setStep('backup');
  };

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(generatedPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Verification
  const handleConfirmVerification = () => {
    setVerifyError(null);
    for (const idx of verifyIndices) {
      const expected = words[idx];
      const actual = userSelectedWords[idx]?.trim().toLowerCase();
      if (!actual || actual !== expected) {
        setVerifyError(`Incorrect word for #${idx + 1}. Please review your backup.`);
        return;
      }
    }

    // Success! Create account
    const addresses = deriveAddressesFromMnemonic(generatedPhrase);
    const newAccount: SreyAccount = {
      id: 'wallet-1',
      name: 'Wallet 1',
      mnemonic: generatedPhrase,
      tonAddress: addresses.tonAddress,
      evmAddress: addresses.evmAddress,
      btcAddress: addresses.btcAddress,
      trxAddress: addresses.trxAddress,
      solAddress: addresses.solAddress,
      createdAt: Date.now(),
      isBackedUp: true
    };

    onComplete(newAccount);
  };

  // Import existing wallet
  const handleConfirmImport = () => {
    setImportError(null);
    const cleanPhrase = normalizeMnemonic(importInput);
    if (!isValidMnemonic(cleanPhrase)) {
      setImportError('Invalid recovery phrase. Please enter a valid 12, 18, or 24-word recovery phrase.');
      return;
    }

    const addresses = deriveAddressesFromMnemonic(cleanPhrase);
    const newAccount: SreyAccount = {
      id: 'wallet-1',
      name: 'Wallet 1',
      mnemonic: cleanPhrase,
      tonAddress: addresses.tonAddress,
      evmAddress: addresses.evmAddress,
      btcAddress: addresses.btcAddress,
      trxAddress: addresses.trxAddress,
      solAddress: addresses.solAddress,
      createdAt: Date.now(),
      isBackedUp: true
    };

    // Global wallet sync across all modules and TonConnect hooks
    localStorage.setItem('connected_ton_wallet', addresses.tonAddress);
    localStorage.setItem('connected_trust_wallet', addresses.evmAddress);
    localStorage.setItem('srey_connected_address', addresses.tonAddress);
    localStorage.setItem('srey_connected_type', 'Trust Wallet (Seed Import)');
    localStorage.setItem('srey_wallet_connected_at', Date.now().toString());
    window.dispatchEvent(new Event('walletConnected'));
    window.dispatchEvent(new Event('storage'));

    onComplete(newAccount);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gradient-to-b from-amber-500/15 via-cyan-500/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-gradient-to-t from-blue-600/10 to-transparent rounded-full blur-[90px]" />
      </div>

      {/* 1. SPLASH SCREEN */}
      {step === 'splash' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-6 max-w-md mx-auto w-full">
          {/* Prominent Close X Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-stone-900/90 border-2 border-stone-700 hover:border-amber-400 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
              title="Close Srey Wallet & Return to Dashboard"
            >
              <X size={20} className="text-stone-200" />
            </button>
          )}

          {/* Header */}
          <div className="flex items-center justify-center pt-8 pb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-300 text-[11px] font-mono tracking-wider">
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
              <span>NON-CUSTODIAL TMA WALLET</span>
            </div>
          </div>

          {/* Center Logo & Branding */}
          <div className="text-center space-y-6 my-auto py-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#1b2234] via-[#0f1422] to-[#07090e] border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex items-center justify-center mx-auto transition-transform hover:scale-105">
                <span className="text-4xl sm:text-5xl font-black text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                  👑
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 font-bold">
                TON + EVM
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
                SREY WALLET
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                Your sovereign, non-custodial Web3 portal on Telegram. Zero KYC, client-side cryptography.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono text-stone-400 max-w-xs mx-auto">
              <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                <div className="text-amber-400 font-bold">BIP-39</div>
                <div className="text-[9px]">24 Words</div>
              </div>
              <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                <div className="text-cyan-400 font-bold">Multi-Chain</div>
                <div className="text-[9px]">TON • BTC • EVM</div>
              </div>
              <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                <div className="text-emerald-400 font-bold">100% Client</div>
                <div className="text-[9px]">No Custody</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-6">
            <button
              type="button"
              onClick={handleStartCreate}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm rounded-2xl shadow-[0_4px_25px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Create New Wallet</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => setStep('import')}
              className="w-full py-3.5 bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white font-bold text-xs rounded-2xl border border-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound size={15} />
              <span>I already have a wallet (Import)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. BACKUP RECOVERY PHRASE SCREEN */}
      {step === 'backup' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-5 max-w-md mx-auto w-full">
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('splash')}
                className="text-stone-400 hover:text-white text-xs font-bold"
              >
                ← Back
              </button>
              <span className="text-[11px] font-mono text-amber-400 font-bold">STEP 1 OF 2</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Secret Recovery Phrase
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Write down these <strong>24 words</strong> in order and keep them safe. They are the <em>only</em> way to restore your wallet.
              </p>
            </div>

            {/* Warning Callout */}
            <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-2xl flex items-start gap-2.5 text-amber-300 text-[11px] leading-snug">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Never share this phrase!</strong> Srey Wallet team will never ask for your recovery phrase.
              </span>
            </div>

            {/* Word Grid (24 Words) */}
            <div className="relative bg-[#0d111c] border border-stone-800 rounded-2xl p-4 shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {words.map((word, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-[#080a12] border border-stone-800/80 rounded-xl px-2.5 py-2 text-xs font-mono"
                  >
                    <span className="text-[10px] text-stone-500 font-bold w-4 text-right">
                      {idx + 1}.
                    </span>
                    <span className="text-white font-bold tracking-wide">
                      {revealPhrase ? word : '••••••'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Toggle Reveal & Copy */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-800/80 text-xs">
                <button
                  type="button"
                  onClick={() => setRevealPhrase(!revealPhrase)}
                  className="text-stone-400 hover:text-white flex items-center gap-1.5 font-mono text-[11px]"
                >
                  {revealPhrase ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{revealPhrase ? 'Hide Words' : 'Reveal Words'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPhrase}
                  className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-mono font-bold flex items-center gap-1.5 transition"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied 24 Words' : 'Copy All'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 pb-6">
            <button
              type="button"
              onClick={() => setStep('verify')}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>I Have Saved My Phrase</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 3. STRICT VERIFICATION SCREEN */}
      {step === 'verify' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-5 max-w-md mx-auto w-full">
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('backup')}
                className="text-stone-400 hover:text-white text-xs font-bold"
              >
                ← Back to Words
              </button>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">STEP 2 OF 2</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Verify Recovery Phrase
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Confirm you saved your phrase. Select or enter the exact words at positions below:
              </p>
            </div>

            {verifyError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/70 rounded-2xl text-xs text-rose-300 font-bold">
                {verifyError}
              </div>
            )}

            {/* Inputs for Required Indices */}
            <div className="space-y-3">
              {verifyIndices.map((idx) => {
                const position = idx + 1;
                const expectedWord = words[idx];
                // Generate 4 candidate chips (1 correct + 3 random from other words)
                const otherWords = words.filter((w) => w !== expectedWord);
                const shuffledCandidates = [expectedWord, ...otherWords.slice(0, 3)].sort();

                return (
                  <div key={idx} className="bg-[#0d111c] border border-stone-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        Word #{position}
                      </span>
                      {userSelectedWords[idx] === expectedWord && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Correct
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {shuffledCandidates.map((candidate, cIdx) => {
                        const isSelected = userSelectedWords[idx] === candidate;
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => {
                              setUserSelectedWords((prev) => ({ ...prev, [idx]: candidate }));
                              setVerifyError(null);
                            }}
                            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-amber-500 text-stone-950 shadow-md'
                                : 'bg-[#07090e] border border-stone-800 text-stone-300 hover:border-stone-700'
                            }`}
                          >
                            <span>{candidate}</span>
                            {isSelected && <Check size={13} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 pb-6">
            <button
              type="button"
              onClick={handleConfirmVerification}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <ShieldCheck size={18} />
              <span>Verify & Unlock Srey Wallet</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. IMPORT WALLET SCREEN */}
      {step === 'import' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-5 max-w-md mx-auto w-full">
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('splash')}
                className="text-stone-400 hover:text-white text-xs font-bold"
              >
                ← Back
              </button>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">IMPORT WALLET</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Import Existing Wallet
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Paste your 12 or 24-word Secret Recovery Phrase to restore your assets.
              </p>
            </div>

            {importError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/70 rounded-2xl text-xs text-rose-300 font-bold">
                {importError}
              </div>
            )}

            <div className="bg-[#0d111c] border border-stone-800 rounded-2xl p-4 space-y-3">
              <label className="text-[11px] font-mono text-stone-400 block font-bold">
                Secret Recovery Phrase (12 or 24 words):
              </label>
              <textarea
                rows={4}
                value={importInput}
                onChange={(e) => {
                  setImportInput(e.target.value);
                  setImportError(null);
                }}
                placeholder="e.g. apple banana cherry diamond eagle flame galaxy horizon..."
                className="w-full bg-[#07090e] border border-stone-800 rounded-xl p-3 text-xs font-mono text-white placeholder:text-stone-600 outline-none focus:border-cyan-500 transition resize-none"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                <span>Words separated by spaces</span>
                <span>{importInput.trim() ? importInput.trim().split(/\s+/).length : 0} words entered</span>
              </div>
            </div>
          </div>

          <div className="pt-4 pb-6">
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={!importInput.trim()}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <KeyRound size={18} />
              <span>Restore & Access Wallet</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Telegram Tag */}
      <div className="py-2 text-center text-[11px] font-mono text-stone-600 border-t border-stone-900/60">
        @SREY_WALLET_BOT
      </div>

    </div>
  );
};
