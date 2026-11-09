import React, { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  X,
  Lock,
  Zap,
  Coins,
  Link2,
  Unlink,
  Layers,
  Clock
} from "lucide-react";
import {
  PRIMARY_RECEIVER_ADDRESS,
  INITIAL_SEED_BALANCE_USDT,
  TONVIEWER_EXPLORER_URL,
  TONSCAN_EXPLORER_URL
} from "./TonPayoutConfig";

export interface EcosystemWalletWithdrawalModalProps {
  availableBalanceUsdt: number;
  onBalanceUpdated: (newBalance: number) => void;
  onWithdrawalExecuted: (record: {
    id: string;
    source: string;
    badge: string;
    color: string;
    region: string;
    text: string;
    timestamp: string;
    rewardUsdt: number;
  }) => void;
  onClose: () => void;
}

export interface WithdrawalReceipt {
  id: string;
  txHash: string;
  amount: number;
  fee: number;
  netAmount: number;
  network: "TON" | "TRC20" | "ERC20";
  destinationAddress: string;
  status: "CONFIRMED" | "PROCESSING" | "BROADCASTED";
  explorerUrl: string;
  timestamp: string;
}

export const EcosystemWalletWithdrawalModal: React.FC<EcosystemWalletWithdrawalModalProps> = ({
  availableBalanceUsdt,
  onBalanceUpdated,
  onWithdrawalExecuted,
  onClose
}) => {
  // Active Tab: 'withdraw' | 'wallet_management' | 'history'
  const [activeTab, setActiveTab] = useState<"withdraw" | "wallet_management" | "history">("withdraw");

  // Bound Wallet State (defaults directly to verified primary TON destination address)
  const [boundAddress, setBoundAddress] = useState<string>(() => {
    return localStorage.getItem("mini_cinema_bound_wallet_address") || PRIMARY_RECEIVER_ADDRESS;
  });
  const [boundNetwork, setBoundNetwork] = useState<"TON" | "TRC20" | "ERC20">(() => {
    const saved = localStorage.getItem("mini_cinema_bound_wallet_network");
    return (saved as "TON" | "TRC20" | "ERC20") || "TON";
  });
  const [isBinding, setIsBinding] = useState<boolean>(false);
  const [bindError, setBindError] = useState<string | null>(null);
  const [bindSuccess, setBindSuccess] = useState<string | null>(null);

  // Form input for binding address
  const [inputAddress, setInputAddress] = useState<string>(boundAddress);
  const [inputNetwork, setInputNetwork] = useState<"TON" | "TRC20" | "ERC20">(boundNetwork);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [latestReceipt, setLatestReceipt] = useState<WithdrawalReceipt | null>(null);
  const [copiedTx, setCopiedTx] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  // Withdrawal History
  const [history, setHistory] = useState<WithdrawalReceipt[]>(() => {
    try {
      const saved = localStorage.getItem("mini_cinema_withdraw_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate Fee & Net Amount
  const numAmount = parseFloat(withdrawAmount) || 0;
  const networkFee = boundNetwork === "TON" ? 0.005 : boundNetwork === "TRC20" ? 0.05 : 0.08;
  const netDisbursed = Math.max(0, numAmount - networkFee);

  // Address validation helper
  const validateAddressSyntax = (addr: string, net: "TON" | "TRC20" | "ERC20"): boolean => {
    const trimmed = addr.trim();
    if (!trimmed) return false;
    if (net === "TON") {
      return (
        trimmed.startsWith("EQ") ||
        trimmed.startsWith("UQ") ||
        trimmed.startsWith("@") ||
        trimmed.length >= 32
      );
    }
    if (net === "TRC20") {
      return trimmed.startsWith("T") && trimmed.length === 34;
    }
    if (net === "ERC20") {
      return trimmed.startsWith("0x") && trimmed.length === 42;
    }
    return false;
  };

  // 1. Handle Bind Address
  const handleBindAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setBindError(null);
    setBindSuccess(null);

    const trimmed = inputAddress.trim();
    if (!validateAddressSyntax(trimmed, inputNetwork)) {
      setBindError(
        inputNetwork === "TON"
          ? "Invalid TON Address. Must start with EQ, UQ, or @wallet (e.g. UQCeMpY4...)."
          : inputNetwork === "TRC20"
          ? "Invalid TRON Address. Must start with 'T' and be 34 characters."
          : "Invalid ERC20 Address. Must start with '0x' and be 42 characters."
      );
      return;
    }

    setIsBinding(true);
    try {
      const res = await fetch("/api/ecosystem/wallet/bind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: trimmed, network: inputNetwork })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to bind wallet address.");
      }

      setBoundAddress(trimmed);
      setBoundNetwork(inputNetwork);
      localStorage.setItem("mini_cinema_bound_wallet_address", trimmed);
      localStorage.setItem("mini_cinema_bound_wallet_network", inputNetwork);
      setBindSuccess(`Securely bound ${inputNetwork} address: ${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`);
      
      // Auto-switch to withdraw view after 1s
      setTimeout(() => {
        setActiveTab("withdraw");
        setBindSuccess(null);
      }, 1200);
    } catch (err: any) {
      setBindError(err.message || "Failed to bind wallet.");
    } finally {
      setIsBinding(false);
    }
  };

  // 2. Handle Unbind Address
  const handleUnbindAddress = async () => {
    if (!confirm("Are you sure you want to unbind this external USDT address?")) return;
    try {
      await fetch("/api/ecosystem/wallet/unbind", { method: "POST" });
    } catch (e) {
      console.warn("Unbind call failed:", e);
    }
    setBoundAddress("");
    setInputAddress("");
    localStorage.removeItem("mini_cinema_bound_wallet_address");
    setBindSuccess("Wallet address unbound successfully.");
    setTimeout(() => setBindSuccess(null), 2000);
  };

  // 3. Quick Preset Percentage
  const handleSetPreset = (percent: number) => {
    const val = Number(((availableBalanceUsdt * percent) / 100).toFixed(4));
    setWithdrawAmount(val > 0 ? String(val) : "0");
    setWithdrawError(null);
  };

  // 4. Execute Real-Time Micro-USDT Withdrawal
  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);

    if (!boundAddress) {
      setWithdrawError("Please bind your external USDT wallet address first.");
      setActiveTab("wallet_management");
      return;
    }

    if (!numAmount || numAmount <= 0) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }

    if (numAmount < 0.05) {
      setWithdrawError("Minimum micro-USDT withdrawal amount is 0.05 USDT.");
      return;
    }

    if (numAmount > availableBalanceUsdt) {
      setWithdrawError(`Amount exceeds your available balance of ${availableBalanceUsdt.toFixed(4)} USDT.`);
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await fetch("/api/ecosystem/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          address: boundAddress,
          network: boundNetwork
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Withdrawal failed to process.");
      }

      const receipt: WithdrawalReceipt = data.receipt || {
        id: `wd_${Date.now()}`,
        txHash: `tx_${Date.now().toString(16)}`,
        amount: numAmount,
        fee: networkFee,
        netAmount: netDisbursed,
        network: boundNetwork,
        destinationAddress: boundAddress,
        status: "CONFIRMED",
        explorerUrl: boundNetwork === "TON"
          ? `https://tonviewer.com`
          : boundNetwork === "TRC20"
          ? `https://tronscan.org`
          : `https://etherscan.io`,
        timestamp: new Date().toISOString()
      };

      // Deduct balance in real-time
      const newBalance = Number(Math.max(0, availableBalanceUsdt - numAmount).toFixed(4));
      onBalanceUpdated(newBalance);
      localStorage.setItem("mini_cinema_notif_earnings", String(newBalance));

      // Append to local history
      const updatedHistory = [receipt, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem("mini_cinema_withdraw_history", JSON.stringify(updatedHistory));

      // Log to Notification Board
      onWithdrawalExecuted({
        id: `notif_withdraw_${Date.now()}`,
        source: "Micro-USDT Payout Executed",
        badge: "PAID OUT",
        color: "emerald",
        region: `${boundNetwork} Destination: ${boundAddress.slice(0, 6)}...${boundAddress.slice(-4)}`,
        text: `Transferred ${netDisbursed.toFixed(4)} USDT (Net). TxHash: ${receipt.txHash.slice(0, 14)}...`,
        timestamp: "Just now",
        rewardUsdt: -numAmount
      });

      setLatestReceipt(receipt);
      setWithdrawAmount("");
    } catch (err: any) {
      setWithdrawError(err.message || "Failed to execute withdrawal.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const copyToClipboard = (text: string, isTx: boolean) => {
    navigator.clipboard.writeText(text);
    if (isTx) {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  return (
    <div className="p-3 bg-[#080B14] max-h-80 overflow-y-auto space-y-2.5 text-xs font-mono select-none animate-fade-in">
      
      {/* Top Header */}
      <div className="flex justify-between items-center text-[10px] text-stone-400 border-b border-stone-800 pb-1.5">
        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
          <Coins size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-white">SECURE MICRO-USDT PAYOUT TERMINAL</span>
        </span>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
        >
          <X size={12} /> Close
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-lg border border-stone-800 text-[9px] font-bold">
        <button
          type="button"
          onClick={() => {
            setActiveTab("withdraw");
            setLatestReceipt(null);
          }}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            activeTab === "withdraw"
              ? "bg-emerald-600 text-stone-950 font-black shadow"
              : "text-stone-400 hover:text-white"
          }`}
        >
          Withdraw Funds
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("wallet_management");
            setLatestReceipt(null);
          }}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            activeTab === "wallet_management"
              ? "bg-emerald-600 text-stone-950 font-black shadow"
              : "text-stone-400 hover:text-white"
          }`}
        >
          {boundAddress ? "Bound Wallet" : "Bind Wallet"}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("history");
            setLatestReceipt(null);
          }}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-emerald-600 text-stone-950 font-black shadow"
              : "text-stone-400 hover:text-white"
          }`}
        >
          History ({history.length})
        </button>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: WITHDRAWAL REQUEST INTERFACE                           */}
      {/* ============================================================== */}
      {activeTab === "withdraw" && !latestReceipt && (
        <form onSubmit={handleExecuteWithdrawal} className="space-y-2">
          
          {/* Balance Display Card */}
          <div className="p-2.5 bg-gradient-to-r from-emerald-950/60 via-stone-900 to-emerald-950/60 rounded-xl border border-emerald-800/60 flex items-center justify-between">
            <div>
              <div className="text-[8.5px] uppercase font-bold text-stone-400 tracking-wider">
                Available Micro-USDT Balance
              </div>
              <div className="text-base font-serif font-black text-emerald-300 flex items-center gap-1">
                <span>${availableBalanceUsdt.toFixed(4)}</span>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">USDT</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/60 font-mono">
                INSTANT S2S
              </span>
              <div className="text-[8px] text-stone-400 mt-0.5">Min: 0.05 USDT</div>
            </div>
          </div>

          {/* Bound Destination Address Indicator */}
          <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[8.5px] text-stone-400 uppercase font-bold flex items-center gap-1">
                <span>Destination Wallet:</span>
                <span className="text-amber-400">[{boundNetwork}]</span>
              </div>
              {boundAddress ? (
                <div className="text-[10px] font-bold text-emerald-400 truncate font-mono">
                  {boundAddress}
                </div>
              ) : (
                <div className="text-[9.5px] text-red-400 font-bold flex items-center gap-1">
                  <AlertTriangle size={10} /> No wallet bound! Click Bind Wallet tab.
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={TONVIEWER_EXPLORER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded text-[8.5px] flex items-center gap-1 shadow cursor-pointer transition"
                title="Inspect Real-Time On-Chain Ledger on Tonviewer"
              >
                <span>Inspect Ledger</span>
                <ExternalLink size={9} />
              </a>

              <button
                type="button"
                onClick={() => setActiveTab("wallet_management")}
                className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[8.5px] border border-stone-600 cursor-pointer"
              >
                {boundAddress ? "Change" : "Bind Now"}
              </button>
            </div>
          </div>

          {/* Withdrawal Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[9px] text-stone-300 font-bold">Withdraw Amount (USDT):</label>
              <div className="flex items-center gap-1 text-[8.5px]">
                <button
                  type="button"
                  onClick={() => handleSetPreset(25)}
                  className="px-1.5 py-0.2 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 cursor-pointer"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPreset(50)}
                  className="px-1.5 py-0.2 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 cursor-pointer"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPreset(100)}
                  className="px-1.5 py-0.2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded cursor-pointer font-bold"
                >
                  MAX
                </button>
              </div>
            </div>

            <input
              type="number"
              step="0.0001"
              min="0.05"
              max={availableBalanceUsdt}
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
                setWithdrawError(null);
              }}
              required
              placeholder="0.0500"
              className="w-full px-2.5 py-2 bg-black border border-stone-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Real-time Fee & Net Breakdown */}
          {numAmount > 0 && (
            <div className="p-2 bg-black/60 rounded-lg border border-stone-800 text-[9px] space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Requested Amount:</span>
                <span className="text-white font-bold">{numAmount.toFixed(4)} USDT</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>{boundNetwork} Gas/Network Fee:</span>
                <span className="text-amber-400">-{networkFee.toFixed(4)} USDT</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-stone-800 pt-1">
                <span>Net Transfer Amount:</span>
                <span>${netDisbursed.toFixed(4)} USDT</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {withdrawError && (
            <div className="p-2 bg-red-950/80 border border-red-700 rounded text-[9px] text-red-200 flex items-center gap-1.5">
              <AlertTriangle size={12} className="shrink-0 text-red-400" />
              <span>{withdrawError}</span>
            </div>
          )}

          {/* Submit Withdrawal Button */}
          <button
            type="submit"
            disabled={isWithdrawing || !boundAddress || availableBalanceUsdt < 0.05}
            className={`w-full py-2.5 rounded-lg font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isWithdrawing || !boundAddress || availableBalanceUsdt < 0.05
                ? "bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700"
                : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-stone-950 border border-emerald-300 transform active:scale-95"
            }`}
          >
            {isWithdrawing ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw size={13} className="animate-spin" />
                <span>Broadcasting to {boundNetwork} Node...</span>
              </span>
            ) : (
              <>
                <ArrowUpRight size={14} className="stroke-[3]" />
                <span>EXECUTE REAL-TIME WITHDRAWAL</span>
              </>
            )}
          </button>

          {/* Quick link to Cross-Border Banking & ACH */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                window.location.hash = "#cross_border_payments";
              }}
              className="w-full py-1.5 px-2 bg-stone-900/90 hover:bg-stone-800 border border-amber-500/40 rounded-lg text-[9px] text-amber-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <span>🏛️ Need ACH, Wire, or Nigeria NGN Bank Payout? Open Cross-Border Banking →</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: CONFIRMED TRANSACTION RECEIPT (UPON SUCCESSFUL WITHDRAW)*/}
      {/* ============================================================== */}
      {latestReceipt && (
        <div className="space-y-2 animate-fade-in">
          <div className="p-3 bg-gradient-to-b from-emerald-950/90 to-[#0c141c] border-2 border-emerald-500/80 rounded-xl space-y-2 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-1.5">
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 size={15} className="text-emerald-400" />
                TRANSACTION CONFIRMED & BROADCASTED
              </span>
              <span className="text-[8px] bg-emerald-900 text-emerald-200 px-1.5 py-0.5 rounded font-bold">
                CONFIRMED
              </span>
            </div>

            <div className="text-center py-1">
              <div className="text-[9px] text-stone-400 uppercase tracking-wider">Net Amount Transferred</div>
              <div className="text-xl font-serif font-black text-white drop-shadow">
                ${latestReceipt.netAmount.toFixed(4)} <span className="text-xs font-mono text-emerald-400">USDT</span>
              </div>
              <div className="text-[8.5px] text-amber-300 font-mono font-bold mt-0.5">
                (Note: 1.3025 USDT = approx. $1.30 USD, not 1,300 USDT)
              </div>
            </div>

            <div className="p-2 bg-black/70 rounded border border-stone-800 text-[9px] space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-400">Network:</span>
                <span className="text-amber-400 font-bold">{latestReceipt.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Destination:</span>
                <span className="text-stone-200 font-bold truncate max-w-[200px]">
                  {latestReceipt.destinationAddress}
                </span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="text-stone-400">Tx Hash:</span>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-300 font-mono text-[8px]">
                    {latestReceipt.txHash.slice(0, 16)}...
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(latestReceipt.txHash, true)}
                    className="text-stone-400 hover:text-white cursor-pointer"
                    title="Copy Tx Hash"
                  >
                    {copiedTx ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Prototype Sandbox Transparency Note */}
            <div className="p-1.5 bg-stone-900/90 rounded border border-stone-800 text-[8.5px] text-stone-400 leading-snug">
              <span className="text-amber-400 font-bold">Prototype Demonstration:</span> This transaction is registered in the applet's internal reward ledger. Because this is a sandboxed prototype without real custody keys, tokens will not arrive on the live external blockchain.
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={latestReceipt.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-600 flex items-center justify-center gap-1 text-[9px] font-bold"
                title="Open block explorer"
              >
                <ExternalLink size={10} />
                <span>View on Explorer</span>
              </a>
              <button
                type="button"
                onClick={() => setLatestReceipt(null)}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded text-[9px] cursor-pointer shadow"
                title="Dismiss receipt and return to Cinema"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: WALLET MANAGEMENT MODULE (BIND / UNBIND)              */}
      {/* ============================================================== */}
      {activeTab === "wallet_management" && (
        <form onSubmit={handleBindAddress} className="space-y-2.5 animate-fade-in">
          
          <div className="p-2 bg-stone-900/60 rounded border border-stone-800 text-[9px] text-stone-300 leading-relaxed">
            Bind your personal external USDT wallet address. Micro-earnings transfer directly into this destination with zero intermediary holding.
          </div>

          {/* Select Network */}
          <div>
            <label className="text-[9px] text-stone-400 block mb-1 font-bold">Select Blockchain Network:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "TON", name: "TON Jetton", fee: "~0.005 USDT" },
                { id: "TRC20", name: "TRON (TRC20)", fee: "~0.05 USDT" },
                { id: "ERC20", name: "ERC20 (ETH)", fee: "~0.08 USDT" }
              ].map((net) => (
                <button
                  key={net.id}
                  type="button"
                  onClick={() => setInputNetwork(net.id as any)}
                  className={`p-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    inputNetwork === net.id
                      ? "bg-emerald-950 border-emerald-500 text-white"
                      : "bg-black/60 border-stone-800 text-stone-400 hover:text-white"
                  }`}
                >
                  <div className="text-[9.5px] font-bold">{net.name}</div>
                  <div className="text-[7.5px] text-emerald-400 font-mono mt-0.5">{net.fee}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Address Input */}
          <div>
            <label className="text-[9px] text-stone-400 block mb-1 font-bold">
              External {inputNetwork} USDT Wallet Address:
            </label>
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => {
                setInputAddress(e.target.value);
                setBindError(null);
              }}
              required
              placeholder={
                inputNetwork === "TON"
                  ? "UQCeMpY46o_P3qA20vK-89f41b4904558ecb2_HLNt or @wallet"
                  : inputNetwork === "TRC20"
                  ? "TLa2f6VPqDgRE67v1736s7bJ8Ray5wPdh6"
                  : "0x71C...497441"
              }
              className="w-full px-2.5 py-2 bg-black border border-stone-700 rounded-lg text-white font-mono text-[10px] focus:outline-none focus:border-emerald-500"
            />
          </div>

          {bindError && (
            <div className="p-2 bg-red-950/80 border border-red-700 rounded text-[9px] text-red-200 flex items-center gap-1.5">
              <AlertTriangle size={12} className="shrink-0 text-red-400" />
              <span>{bindError}</span>
            </div>
          )}

          {bindSuccess && (
            <div className="p-2 bg-emerald-950/80 border border-emerald-700 rounded text-[9px] text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
              <span>{bindSuccess}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            {boundAddress && (
              <button
                type="button"
                onClick={handleUnbindAddress}
                className="px-3 py-2 bg-red-950 hover:bg-red-900 text-red-300 font-bold text-[10px] rounded-lg border border-red-800 flex items-center gap-1 cursor-pointer"
              >
                <Unlink size={11} />
                <span>Unbind</span>
              </button>
            )}

            <button
              type="submit"
              disabled={isBinding}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-[11px] rounded-lg shadow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Link2 size={13} />
              <span>{isBinding ? "Validating & Binding..." : boundAddress ? "Update Bound Address" : "Bind USDT Address"}</span>
            </button>
          </div>

          {boundAddress && (
            <div className="p-2 bg-stone-900/90 rounded border border-emerald-800/60 flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-1 text-emerald-400 font-bold truncate">
                <ShieldCheck size={12} />
                <span className="truncate">Currently Bound: {boundAddress}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(boundAddress, false)}
                className="text-stone-400 hover:text-white shrink-0 ml-1"
                title="Copy Address"
              >
                {copiedAddress ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              </button>
            </div>
          )}
        </form>
      )}

      {/* ============================================================== */}
      {/* VIEW 4: WITHDRAWAL HISTORY LEDGER                             */}
      {/* ============================================================== */}
      {activeTab === "history" && (
        <div className="space-y-1.5 animate-fade-in">
          {history.length === 0 ? (
            <div className="p-4 text-center text-stone-500 text-[10px]">
              No withdrawals executed yet. Submit a withdrawal request to test real-time disbursement.
            </div>
          ) : (
            history.map((rec) => (
              <div
                key={rec.id}
                className="p-2 bg-stone-900/80 rounded-lg border border-stone-800 text-[9.5px] space-y-0.5"
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-400">-${rec.amount.toFixed(4)} USDT</span>
                  <span className="text-[8px] bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded border border-emerald-800">
                    {rec.status}
                  </span>
                </div>
                <div className="text-stone-400 text-[8.5px] truncate">
                  To: {rec.destinationAddress} ({rec.network})
                </div>
                <div className="flex justify-between text-[8px] text-stone-500 pt-0.5">
                  <span className="truncate">Tx: {rec.txHash.slice(0, 16)}...</span>
                  <a
                    href={rec.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    Explorer <ExternalLink size={8} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
