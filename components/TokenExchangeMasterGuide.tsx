import React, { useState } from "react";
import { Coins, ExternalLink, Sparkles, ShieldCheck, ArrowRight, X, BookOpen, RefreshCw, Globe, CheckCircle2, ArrowLeftRight, Wallet } from "lucide-react";

interface TokenExchangeMasterGuideProps {
  onClose: () => void;
  onOpenTonWallet?: () => void;
}

export const TokenExchangeMasterGuide: React.FC<TokenExchangeMasterGuideProps> = ({ onClose, onOpenTonWallet }) => {
  const [activeStep, setActiveStep] = useState<number>(5); // Default to Step 5 as user explicitly requested cross-chain transfer

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl dark-exclusive-thunder-box rounded-3xl p-6 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-teal-400 to-purple-600 text-stone-950 font-black text-2xl flex items-center justify-center shadow-lg">
              💱
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
                Master Guide: Exchange & Transfer TON / USDT to TRON (TRC20)
              </h2>
              <p className="text-xs text-amber-300 font-mono">
                Transfer funds from TON USDT ($3.18 balance) ➔ TRON USDT TRC20 ($1.00)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Navigation Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { step: 1, title: "1. Connect Wallet", icon: "💎" },
            { step: 2, title: "2. Choose DEX", icon: "🌐" },
            { step: 3, title: "3. Swap TON", icon: "🔄" },
            { step: 4, title: "4. Cash-Out", icon: "💳" },
            { step: 5, title: "5. TON ➔ TRON", icon: "⚡" }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-2xl border text-left font-bold transition cursor-pointer flex items-center gap-2 ${
                activeStep === s.step
                  ? "bg-amber-500/20 text-amber-300 border-amber-400 shadow-lg ring-1 ring-amber-400/50"
                  : "bg-stone-900/80 text-stone-400 border-stone-800 hover:border-stone-700"
              }`}
            >
              <span className="text-base">{s.icon}</span>
              <div>
                <div className="font-black text-white text-[11px]">{s.title}</div>
                <div className="text-[9px] text-stone-400">Step {s.step}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Step Details Content */}
        <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-4 text-xs leading-relaxed">
          
          {/* STEP 5: SPECIAL FOCUS FOR USER'S SCREENSHOT & REQUEST */}
          {activeStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-black text-emerald-400">
                  <ArrowLeftRight size={18} />
                  <span>Step 5: Transfer $1.00 from USD₮ (TON) ➔ USDT (TRC20 - TRON)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 text-[10px] font-mono font-bold">
                  CROSS-CHAIN SWAP
                </span>
              </div>

              <div className="p-3.5 bg-stone-900/90 rounded-xl border border-stone-800 space-y-2">
                <div className="font-bold text-white flex items-center justify-between text-xs">
                  <span>Your Current Balance in Tonkeeper Pro:</span>
                  <span className="text-amber-300 font-mono font-bold">$8.72 Total</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="bg-black/50 p-2 rounded-lg border border-stone-800">
                    <span className="text-stone-400 block">TON Balance:</span>
                    <span className="text-cyan-300 font-bold">1.39 TON (~$7.38)</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-lg border border-stone-800">
                    <span className="text-stone-400 block">USD₮ (TON Jetton):</span>
                    <span className="text-emerald-300 font-bold">$0.98</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-lg border border-emerald-500/40">
                    <span className="text-stone-400 block">USDT (TRC20):</span>
                    <span className="text-amber-400 font-bold">$0.00 ➔ Target $1.00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-stone-200">
                <p className="font-bold text-white">How to Transfer $1.00 into your TRC20 Section (3 Simple Methods):</p>
                
                <div className="space-y-3 pl-1">
                  
                  {/* Method A: Tonkeeper Pro Built-in Swap */}
                  <div className="p-3 bg-stone-900 rounded-xl border border-cyan-500/40 space-y-1.5">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-cyan-400" />
                      <span>Method 1: Direct in Tonkeeper Pro (Desktop App)</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-stone-300 text-[11px] pl-1">
                      <li>In your Tonkeeper sidebar (shown on your screen), click <strong>⇄ Swap</strong>.</li>
                      <li>In the <strong>You Pay</strong> field, select <strong>USD₮ (TON)</strong> and enter <code>1.00</code>.</li>
                      <li>In the <strong>You Receive</strong> field, select <strong>USDT TRC20</strong> (TRON Network).</li>
                      <li>Click <strong>Swap</strong> and confirm with your passcode or Battery. Your $3.18 TON USDT becomes $2.18 TON USDT + $1.00 TRC20 USDT!</li>
                    </ol>
                  </div>

                  {/* Method B: ChangeNOW / FixedFloat Cross-Chain Bridge */}
                  <div className="p-3 bg-stone-900 rounded-xl border border-purple-500/40 space-y-1.5">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Globe size={14} className="text-purple-400" />
                      <span>Method 2: Non-KYC Instant Cross-Chain Bridge (ChangeNOW / FixedFloat)</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      If direct swap is busy, use instant cross-chain swap services with 0 registration:
                    </p>
                    <div className="flex gap-2 pt-1">
                      <a
                        href="https://changenow.io/?from=usdtton&to=usdttrc20&amount=1"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer shadow"
                      >
                        <span>Bridge $1 on ChangeNOW ↗</span>
                        <ExternalLink size={11} />
                      </a>
                      <a
                        href="https://ff.io/"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:brightness-110 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer shadow"
                      >
                        <span>Bridge on FixedFloat ↗</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Method C: STON.fi DEX Cross-Chain */}
                  <div className="p-3 bg-stone-900 rounded-xl border border-amber-500/40 space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Coins size={14} className="text-amber-400" />
                      <span>Method 3: STON.fi Omnichannel DEX</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Visit <a href="https://ston.fi" target="_blank" rel="noreferrer" className="text-amber-400 underline">ston.fi</a>, connect your Tonkeeper wallet, select USD₮ ➔ TRC20 USDT, and swap $1.00 directly.
                    </p>
                  </div>

                </div>
              </div>

              {onOpenTonWallet && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTonWallet();
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 font-black rounded-xl cursor-pointer hover:brightness-110 flex items-center justify-center gap-2 text-xs shadow-lg"
                >
                  <span>Open Ecosystem Wallet & Transfer Terminal</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm font-black text-amber-300">
                <span>💎 Step 1: Connect Your Non-Custodial Web3 Wallet</span>
              </div>
              <p className="text-stone-300">
                Before exchanging any virtual currency or tokens (TON, USDT, Vouchers, Stars), you must have an active non-custodial wallet connected. Non-custodial means <strong>you alone hold the private keys</strong>—neither the platform nor any exchange can access your funds without your approval.
              </p>
              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Recommended Wallets for This Ecosystem:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-400 pl-1">
                  <li><strong>Tonkeeper Pro</strong> (Best mobile & desktop app for TON, Battery & TRC20)</li>
                  <li><strong>Telegram @Wallet</strong> (Built directly into Telegram settings)</li>
                  <li><strong>MyTonWallet</strong> (Web3 browser extension & mobile app)</li>
                  <li><strong>OneKey / Phantom</strong> (Multi-chain Solana & TRON TRC-20)</li>
                </ul>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm font-black text-amber-300">
                <span>🌐 Step 2: Choose a Real Decentralized Exchange (DEX)</span>
              </div>
              <p className="text-stone-300">
                To swap your virtual tokens for real USDT, TON, or TRC20 assets without KYC or account registration, use audited decentralized automated market makers (AMMs):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                  <div className="font-bold text-white flex justify-between">
                    <span>STON.fi DEX</span>
                    <span className="text-[10px] text-amber-400 font-mono">STON.FI</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    The premier decentralized exchange on The Open Network (TON). Swap any Jetton instantly with lowest slippage and direct wallet connection.
                  </p>
                  <a
                    href="https://ston.fi"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>Open ston.fi ↗</span>
                    <ExternalLink size={11} />
                  </a>
                </div>

                <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                  <div className="font-bold text-white flex justify-between">
                    <span>DeDust.io</span>
                    <span className="text-[10px] text-cyan-400 font-mono">DEDUST.IO</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Advanced AMM on TON supporting multi-pool routing, staking pools, and decentralized limit orders.
                  </p>
                  <a
                    href="https://dedust.io"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>Open dedust.io ↗</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm font-black text-amber-300">
                <span>🔄 Step 3: Select Pair & Execute Swap</span>
              </div>
              <p className="text-stone-300">
                Follow these exact actions on STON.fi or DeDust:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-stone-300 pl-1">
                <li>Go to <a href="https://ston.fi" target="_blank" rel="noreferrer" className="text-amber-400 underline">ston.fi</a> and click <strong>Connect Wallet</strong>.</li>
                <li>In the "Send" field, select your token (e.g. TON, USDT, or pasted voucher token).</li>
                <li>In the "Receive" field, select the target currency you want to acquire (e.g. USDT stablecoin or TON).</li>
                <li>Review the estimated exchange rate, network gas fee (~0.05 TON), and price impact.</li>
                <li>Click <strong>Swap</strong> and approve the transaction prompt in your Tonkeeper or Telegram Wallet.</li>
                <li>Within 3–5 seconds, the swapped tokens appear in your wallet balance!</li>
              </ol>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm font-black text-amber-300">
                <span>💳 Step 4: Cash-Out to Bank, Visa, or Mastercard</span>
              </div>
              <p className="text-stone-300">
                Once you hold USDT or TON in your wallet, you can cash out to traditional fiat currency anytime:
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-300 pl-1">
                <li><strong>MoonPay / Mercuryo Ramp:</strong> Use the built-in compliant ramps to sell crypto directly to your Visa/Mastercard or bank account.</li>
                <li><strong>Telegram @Wallet P2P:</strong> Use the peer-to-peer marketplace inside Telegram to sell TON/USDT for bank transfer, PayPal, or cash.</li>
                <li><strong>Bybit / Exchangers:</strong> Deposit TON/USDT to Bybit or Binance to execute SEPA, wire transfers, or card withdrawals.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800">
          <span className="text-[10px] text-stone-400 font-mono">
            💡 All ecosystem earnings & voucher redemptions settle directly to your connected wallet.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-black text-xs rounded-xl cursor-pointer shadow-lg"
          >
            Got It, Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
