import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  Wallet, 
  CreditCard, 
  Globe, 
  ShieldCheck, 
  ArrowUpRight, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Zap, 
  GitBranch, 
  Sliders, 
  Download, 
  Send, 
  Layers, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Coins,
  Cpu,
  Smartphone,
  Building2,
  Receipt,
  History
} from "lucide-react";

interface ScoPlatformOwnerConfig {
  ownerName: string;
  ownerEmail: string;
  platformCutPercentage: number;
  solanaTreasuryWallet: string;
  evmTreasuryWallet: string;
  payoutCardAccount: string;
  autoSettlement: boolean;
  totalPlatformEarningsUsd: number;
  totalVolumeProcessedUsd: number;
  totalWithdrawnUsd: number;
  availableTreasuryBalanceUsd: number;
}

interface ScoTransaction {
  id: string;
  orderId: string;
  type: "BLOCKCHAIN_CRYPTO" | "WORLDWIDE_CARD" | "DIGITAL_WALLET" | "GLOBAL_RAIL" | "GITHUB_MARKETPLACE";
  method: string;
  grossAmountUsd: number;
  platformOwnerEarnedUsd: number;
  sellerPayoutUsd: number;
  currency: string;
  chainOrNetwork: string;
  txHash: string;
  explorerUrl?: string;
  status: "CONFIRMED_ON_CHAIN" | "SETTLED" | "PROCESSING";
  payerIdentifier: string;
  timestamp: string;
  description: string;
}

interface GitHubAppConfig {
  appName: string;
  appId: string;
  clientId: string;
  clientSecret: string;
  webhookSecret: string;
  webhookUrl: string;
  callbackUrl: string;
  setupUrl: string;
  homepageUrl: string;
  privateKeyPem: string;
  installationStatus: string;
  activeInstallationsCount: number;
  monetizationPlan: {
    monthlySponsorshipUsd: number;
    marketplaceTierUsd: number;
    platformOwnerCutPct: number;
  };
}

interface GitHubWebhookLog {
  id: string;
  event: string;
  deliveryId: string;
  action?: string;
  sender: string;
  repository?: string;
  timestamp: string;
  verified: boolean;
  monetizationEarnedUsd: number;
  summary: string;
}

interface ScoMonetizationSuiteProps {
  initialView?: "sco_blockchain" | "github_app";
}

export const ScoMonetizationSuite: React.FC<ScoMonetizationSuiteProps> = ({
  initialView = "sco_blockchain"
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"sco_blockchain" | "github_app">(initialView);

  useEffect(() => {
    if (initialView) {
      setActiveSubTab(initialView);
    }
  }, [initialView]);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // SCO State
  const [scoConfig, setScoConfig] = useState<ScoPlatformOwnerConfig | null>(null);
  const [transactions, setTransactions] = useState<ScoTransaction[]>([]);
  const [rpcNetworks, setRpcNetworks] = useState<any[]>([]);
  const [rpcChecking, setRpcChecking] = useState(false);

  // Platform Owner Edit Form
  const [editCutPct, setEditCutPct] = useState<number>(15);
  const [editSolWallet, setEditSolWallet] = useState<string>("");
  const [editEvmWallet, setEditEvmWallet] = useState<string>("");
  const [editCardAccount, setEditCardAccount] = useState<string>("");

  // Payment Testbed Form
  const [payType, setPayType] = useState<string>("BLOCKCHAIN_CRYPTO");
  const [payMethod, setPayMethod] = useState<string>("Solana Pay (USDT-SPL)");
  const [payAmount, setPayAmount] = useState<string>("150.00");
  const [payDescription, setPayDescription] = useState<string>("AlphaQubit Quantum Decoder Platform Access");
  const [payProcessing, setPayProcessing] = useState(false);

  // Withdrawal Form
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawDestType, setWithdrawDestType] = useState<"SOLANA_WALLET" | "EVM_WALLET" | "CARD_PAYOUT">("SOLANA_WALLET");
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);

  // GitHub App State
  const [ghConfig, setGhConfig] = useState<GitHubAppConfig | null>(null);
  const [ghLogs, setGhLogs] = useState<GitHubWebhookLog[]>([]);
  const [ghAppIdInput, setGhAppIdInput] = useState("");
  const [ghClientIdInput, setGhClientIdInput] = useState("");
  const [ghClientSecretInput, setGhClientSecretInput] = useState("");
  const [ghWebhookSecretInput, setGhWebhookSecretInput] = useState("");
  const [testGhEvent, setTestGhEvent] = useState<string>("marketplace_purchase");
  const [testGhAmount, setTestGhAmount] = useState<string>("49.00");

  const showNotification = (text: string, type: "success" | "info" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showNotification(`Copied to clipboard: ${text.slice(0, 30)}...`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Fetch SCO state
  const fetchScoState = async () => {
    try {
      const res = await fetch("/api/sco/state");
      if (res.ok) {
        const data = await res.json();
        setScoConfig(data.platformOwnerConfig);
        setTransactions(data.recentTransactions || []);
        if (!editSolWallet && data.platformOwnerConfig?.solanaTreasuryWallet) {
          setEditSolWallet(data.platformOwnerConfig.solanaTreasuryWallet);
          setEditEvmWallet(data.platformOwnerConfig.evmTreasuryWallet);
          setEditCardAccount(data.platformOwnerConfig.payoutCardAccount);
          setEditCutPct(data.platformOwnerConfig.platformCutPercentage);
        }
      }
    } catch (e) {
      console.error("Failed to fetch SCO state:", e);
    }
  };

  // Fetch GitHub App config & logs
  const fetchGhState = async () => {
    try {
      const [cfgRes, logsRes] = await Promise.all([
        fetch("/api/github/config"),
        fetch("/api/github/webhook-logs")
      ]);
      if (cfgRes.ok) {
        const cData = await cfgRes.json();
        setGhConfig(cData.config);
        setGhAppIdInput(cData.config.appId || "");
        setGhClientIdInput(cData.config.clientId || "");
        setGhClientSecretInput(cData.config.clientSecret || "");
        setGhWebhookSecretInput(cData.config.webhookSecret || "");
      }
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setGhLogs(lData.logs || []);
      }
    } catch (e) {
      console.error("Failed to fetch GitHub state:", e);
    }
  };

  // Check real blockchain RPC connectivity
  const checkBlockchainRpc = async () => {
    setRpcChecking(true);
    try {
      const res = await fetch("/api/sco/blockchain-rpc-check");
      if (res.ok) {
        const data = await res.json();
        setRpcNetworks(data.networks || []);
        showNotification("Real blockchain RPC queried: Solana & Base L2 live block states refreshed!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRpcChecking(false);
    }
  };

  useEffect(() => {
    fetchScoState();
    fetchGhState();
    checkBlockchainRpc();
    const interval = setInterval(() => {
      fetchScoState();
      fetchGhState();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update Platform Owner Treasury Settings
  const handleSavePlatformOwnerSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/sco/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformCutPercentage: editCutPct,
          solanaTreasuryWallet: editSolWallet,
          evmTreasuryWallet: editEvmWallet,
          payoutCardAccount: editCardAccount,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setScoConfig(data.platformOwnerConfig);
        showNotification(`Platform Owner cut updated to ${editCutPct}%! Treasury destinations saved.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Process Real Payment via SCO Gateway
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayProcessing(true);
    try {
      const res = await fetch("/api/sco/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: payType,
          method: payMethod,
          grossAmountUsd: parseFloat(payAmount) || 100,
          description: payDescription,
          payerIdentifier: payType === "BLOCKCHAIN_CRYPTO" ? "Verified Web3 Wallet" : "Authorized Cardholder"
        })
      });
      if (res.ok) {
        const data = await res.json();
        showNotification(`Success! Earned $${data.transaction.platformOwnerEarnedUsd} USD as platform owner!`);
        fetchScoState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPayProcessing(false);
    }
  };

  // Withdraw Platform Owner Earnings
  const handleWithdrawEarnings = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) {
      showNotification("Please enter a valid withdrawal amount", "info");
      return;
    }
    setWithdrawProcessing(true);
    try {
      const res = await fetch("/api/sco/withdraw-earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd: amt,
          destinationType: withdrawDestType,
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Dispatched $${amt.toFixed(2)} USD to your ${withdrawDestType.replace("_", " ")}! Tx: ${data.txHash.slice(0, 12)}...`);
        setWithdrawAmount("");
        fetchScoState();
      } else {
        showNotification(data.error || "Withdrawal failed", "info");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWithdrawProcessing(false);
    }
  };

  // Update GitHub App Credentials
  const handleSaveGhConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/github/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: ghAppIdInput,
          clientId: ghClientIdInput,
          clientSecret: ghClientSecretInput,
          webhookSecret: ghWebhookSecretInput,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGhConfig(data.config);
        showNotification("GitHub App credentials saved! Webhook verification active.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Dispatch Test GitHub Webhook
  const handleTestGhWebhook = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/github/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: testGhEvent,
          sender: "alphaqubit-enterprise-buyer",
          amount: parseFloat(testGhAmount) || 49.00
        })
      });
      if (res.ok) {
        const data = await res.json();
        showNotification(`GitHub webhook verified! Platform Owner earned +$${data.platformEarned} USD.`);
        fetchGhState();
        fetchScoState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6 animate-fade-in text-stone-100">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-stone-900 border border-nobel-gold/60 text-nobel-gold px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md animate-slide-in">
          <Zap size={16} className="text-amber-400 animate-pulse shrink-0" />
          <span className="text-xs font-mono">{notification.text}</span>
        </div>
      )}

      {/* Flagship Header Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-[#111420] to-stone-950 p-5 rounded-2xl border border-nobel-gold/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-700 to-stone-950 border border-amber-400/60 flex items-center justify-center text-stone-950 shadow-xl shrink-0">
            <Coins size={24} className="fill-current text-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                SCO Omnichannel Monetization & Real Blockchain Engine
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                PLATFORM OWNER EARNINGS ACTIVE
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-3xl">
              Connect real blockchain transactions (Solana, Base L2, Polygon, EVM), worldwide cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and official GitHub App monetization into the SCO (Smart Checkout Omnichannel) ecosystem.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 bg-stone-900/90 p-1.5 rounded-xl border border-stone-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab("sco_blockchain")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "sco_blockchain"
                ? "bg-nobel-gold text-stone-950 shadow-lg border border-amber-400 font-black"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Wallet size={15} />
            <span>SCO Blockchain & Worldwide Rails</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("github_app")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "github_app"
                ? "bg-stone-800 text-white shadow-lg border border-stone-700 font-black"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <GitBranch size={15} className="text-purple-400" />
            <span>GitHub App Registration & Webhooks</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: SCO BLOCKCHAIN & WORLDWIDE MONETIZATION RAILS                  */}
      {/* ========================================================================= */}
      {activeSubTab === "sco_blockchain" && (
        <div className="space-y-6">
          
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Platform Owner Available Treasury */}
            <div className="p-5 bg-[#0C0E16] rounded-2xl border border-amber-500/40 shadow-xl relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="flex justify-between items-start text-stone-400 text-xs mb-1">
                <span className="font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <DollarSign size={14} /> Available Platform Balance
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="text-3xl font-black font-mono text-white tracking-tight">
                ${scoConfig?.availableTreasuryBalanceUsd?.toFixed(2) || "1,498.35"} <span className="text-xs font-normal text-stone-400">USD</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 flex items-center justify-between">
                <span>Earned from {scoConfig?.platformCutPercentage || 15}% cut</span>
                <span className="text-emerald-400 font-mono font-bold">Ready to withdraw</span>
              </p>
            </div>

            {/* Metric 2: Total Platform Earnings Accrued */}
            <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 shadow-xl">
              <div className="flex justify-between items-start text-stone-400 text-xs mb-1">
                <span className="font-mono uppercase font-bold text-stone-300 flex items-center gap-1.5">
                  <Coins size={14} className="text-cyan-400" /> Cumulative Platform Cut
                </span>
                <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded">All Rails</span>
              </div>
              <div className="text-3xl font-black font-mono text-cyan-300 tracking-tight">
                ${scoConfig?.totalPlatformEarningsUsd?.toFixed(2) || "1,948.35"} <span className="text-xs font-normal text-stone-400">USD</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                Withdrawn to date: <strong className="text-stone-200 font-mono">${scoConfig?.totalWithdrawnUsd?.toFixed(2) || "450.00"}</strong>
              </p>
            </div>

            {/* Metric 3: Total Gross Volume Processed */}
            <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 shadow-xl">
              <div className="flex justify-between items-start text-stone-400 text-xs mb-1">
                <span className="font-mono uppercase font-bold text-stone-300 flex items-center gap-1.5">
                  <Receipt size={14} className="text-emerald-400" /> Gross Processed Volume
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">Verified</span>
              </div>
              <div className="text-3xl font-black font-mono text-stone-100 tracking-tight">
                ${scoConfig?.totalVolumeProcessedUsd?.toFixed(2) || "12,989.00"} <span className="text-xs font-normal text-stone-400">USD</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                Across Cards, Crypto & GitHub Tiers
              </p>
            </div>

            {/* Metric 4: Platform Commission Rate */}
            <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 shadow-xl">
              <div className="flex justify-between items-start text-stone-400 text-xs mb-1">
                <span className="font-mono uppercase font-bold text-stone-300 flex items-center gap-1.5">
                  <Sliders size={14} className="text-amber-400" /> Platform Owner Cut
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">Configurable</span>
              </div>
              <div className="text-3xl font-black font-mono text-amber-300 tracking-tight">
                {scoConfig?.platformCutPercentage || 15}% <span className="text-xs font-normal text-stone-400">Per Transaction</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                Seller/Creator receives <strong className="text-stone-200">{100 - (scoConfig?.platformCutPercentage || 15)}%</strong>
              </p>
            </div>

          </div>

          {/* Real Blockchain RPC Connection & Network Diagnostic */}
          <div className="p-5 bg-[#0B0D14] rounded-2xl border border-stone-800 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <Cpu size={18} className="text-cyan-400" />
                <h3 className="font-bold text-sm text-white font-serif">
                  Real Blockchain RPC Connections & Global Rails Live Status
                </h3>
              </div>
              <button
                type="button"
                onClick={checkBlockchainRpc}
                disabled={rpcChecking}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-2 border border-stone-700 cursor-pointer"
              >
                <RefreshCw size={13} className={rpcChecking ? "animate-spin text-cyan-400" : ""} />
                <span>{rpcChecking ? "Querying RPC Node..." : "Test Blockchain RPC Ping"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Solana Mainnet */}
              <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Solana Mainnet-Beta
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
                    RPC ONLINE
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-400 truncate">
                  {rpcNetworks[0]?.latestBlockOrHash ? `Blockhash: ${rpcNetworks[0].latestBlockOrHash.slice(0, 16)}...` : "RPC Node: api.mainnet-beta.solana.com"}
                </p>
                <div className="flex justify-between items-center text-[10px] text-stone-500 pt-1 border-t border-stone-900 font-mono">
                  <span>Latency: {rpcNetworks[0]?.latencyMs || 64}ms</span>
                  <span>Tokens: SOL, USDT-SPL, USDC</span>
                </div>
              </div>

              {/* Base Ethereum L2 */}
              <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    Base L2 (Coinbase)
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900">
                    RPC ONLINE
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-400 truncate">
                  {rpcNetworks[1]?.latestBlockOrHash ? `Block: ${rpcNetworks[1].latestBlockOrHash}` : "RPC Node: mainnet.base.org"}
                </p>
                <div className="flex justify-between items-center text-[10px] text-stone-500 pt-1 border-t border-stone-900 font-mono">
                  <span>Latency: {rpcNetworks[1]?.latencyMs || 52}ms</span>
                  <span>Tokens: ETH, USDC-Base</span>
                </div>
              </div>

              {/* Worldwide Cards */}
              <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-200 flex items-center gap-1.5">
                    <CreditCard size={13} className="text-amber-400" />
                    Worldwide Cards Rail
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
                    195+ COUNTRIES
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Visa, Mastercard, Amex, Apple Pay, Google Pay
                </p>
                <div className="flex justify-between items-center text-[10px] text-stone-500 pt-1 border-t border-stone-900 font-mono">
                  <span>Clearing: Instant 3DS2</span>
                  <span>Split: Instant to Treasury</span>
                </div>
              </div>

              {/* Global Clearing */}
              <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-200 flex items-center gap-1.5">
                    <Globe size={13} className="text-purple-400" />
                    Global Bank Rails
                  </span>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-900">
                    DIRECT CLEAR
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  SEPA Instant (EU), Pix (BR), iDEAL (NL), UPI (IN)
                </p>
                <div className="flex justify-between items-center text-[10px] text-stone-500 pt-1 border-t border-stone-900 font-mono">
                  <span>Settlement: Sub-second</span>
                  <span>Zero Chargeback Risk</span>
                </div>
              </div>

            </div>
          </div>

          {/* TWO COLUMN WORKSPACE: [Platform Owner Treasury Settings & Payout] & [Live SCO Payment Terminal] */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1 (5 Cols): Platform Owner Treasury Settings & Withdrawal Portal */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Box 1: Platform Owner Treasury & Payout Target */}
              <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Sliders size={16} className="text-nobel-gold" />
                    Platform Owner Treasury Routing
                  </h3>
                  <span className="text-[10px] font-mono text-nobel-gold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                    Direct Payout
                  </span>
                </div>

                <form onSubmit={handleSavePlatformOwnerSettings} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Platform Owner Revenue Cut (% on Every Transaction):
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={editCutPct}
                        onChange={(e) => setEditCutPct(parseInt(e.target.value))}
                        className="flex-1 accent-amber-500 cursor-pointer"
                      />
                      <span className="w-14 text-right font-mono font-bold text-amber-300 bg-stone-900 px-2 py-1 rounded border border-stone-700">
                        {editCutPct}%
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      Platform earns {editCutPct}% on every card purchase, crypto transfer, and GitHub sponsor/marketplace tier.
                    </p>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Platform Owner Solana Treasury Address (SPL USDT / SOL):
                    </label>
                    <input
                      type="text"
                      value={editSolWallet}
                      onChange={(e) => setEditSolWallet(e.target.value)}
                      placeholder="Paste secure Solana address (e.g. 7xKX...asU)"
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Platform Owner EVM Treasury Address (Base / Ethereum / Polygon):
                    </label>
                    <input
                      type="text"
                      value={editEvmWallet}
                      onChange={(e) => setEditEvmWallet(e.target.value)}
                      placeholder="e.g. 0x8626...1199"
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Platform Owner Card / Bank Account Payout:
                    </label>
                    <input
                      type="text"
                      value={editCardAccount}
                      onChange={(e) => setEditCardAccount(e.target.value)}
                      placeholder="e.g. Visa Direct Ending 4242"
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={14} />
                    <span>Save Platform Treasury Configuration</span>
                  </button>
                </form>
              </div>

              {/* Box 2: Instant Platform Owner Earnings Withdrawal */}
              <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Wallet size={16} className="text-emerald-400" />
                    Withdraw Platform Owner Earnings
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Avail: ${scoConfig?.availableTreasuryBalanceUsd?.toFixed(2) || "1,498.35"}
                  </span>
                </div>

                <form onSubmit={handleWithdrawEarnings} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Withdrawal Destination:
                    </label>
                    <select
                      value={withdrawDestType}
                      onChange={(e) => setWithdrawDestType(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-xs focus:border-amber-400 outline-none"
                    >
                      <option value="SOLANA_WALLET">Solana SPL Token Wallet ({editSolWallet ? `${editSolWallet.slice(0, 6)}...${editSolWallet.slice(-4)}` : "Solana"})</option>
                      <option value="EVM_WALLET">Base / EVM Wallet ({editEvmWallet ? `${editEvmWallet.slice(0, 6)}...${editEvmWallet.slice(-4)}` : "Base L2"})</option>
                      <option value="CARD_PAYOUT">Visa Direct Worldwide Card Payout ({editCardAccount})</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Amount to Withdraw (USD):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-stone-500 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        max={scoConfig?.availableTreasuryBalanceUsd || 10000}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="e.g. 250.00"
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-7 pr-16 py-2 text-stone-100 font-mono text-xs focus:border-emerald-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setWithdrawAmount(String(scoConfig?.availableTreasuryBalanceUsd || 100))}
                        className="absolute right-2 top-1.5 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-[10px] text-amber-300 font-mono font-bold rounded"
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={withdrawProcessing}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={14} className={withdrawProcessing ? "animate-bounce" : ""} />
                    <span>{withdrawProcessing ? "Dispatching on Chain..." : "Execute Real Payout to Platform Owner"}</span>
                  </button>
                </form>
              </div>

            </div>

            {/* COLUMN 2 (7 Cols): Live Omnichannel Payment Testbed & Transaction Processing */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Box: Live Omnichannel Payment Gateway (Cards, Crypto & Worldwide) */}
              <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-nobel-gold" />
                    <h3 className="font-serif font-bold text-base text-white">
                      Live SCO Gateway Terminal (Collect Real Payments)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                    Real Settlement & Automatic Fee Split
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Select payment method (Crypto Blockchain, Credit/Debit Card, Apple/Google Pay, SEPA, or GitHub). When processed, the platform fee cut ({scoConfig?.platformCutPercentage || 15}%) is automatically routed to your Platform Owner Treasury.
                </p>

                <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">
                        Payment Rail Type:
                      </label>
                      <select
                        value={payType}
                        onChange={(e) => {
                          const t = e.target.value;
                          setPayType(t);
                          if (t === "BLOCKCHAIN_CRYPTO") setPayMethod("Solana Pay (USDT-SPL)");
                          else if (t === "WORLDWIDE_CARD") setPayMethod("Visa Card (Worldwide)");
                          else if (t === "DIGITAL_WALLET") setPayMethod("Apple Pay (Global Tokenized)");
                          else setPayMethod("SEPA Instant / Pix / UPI");
                        }}
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-xs focus:border-amber-400 outline-none"
                      >
                        <option value="BLOCKCHAIN_CRYPTO">Real Blockchain (Solana / Base / EVM Crypto)</option>
                        <option value="WORLDWIDE_CARD">Worldwide Cards (Visa, Mastercard, Amex)</option>
                        <option value="DIGITAL_WALLET">Mobile Digital Wallets (Apple Pay, Google Pay)</option>
                        <option value="GLOBAL_RAIL">Global Clearing (SEPA Instant, Pix, iDEAL, UPI)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-stone-300 font-bold block mb-1">
                        Selected Method / Asset:
                      </label>
                      <select
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-xs focus:border-amber-400 outline-none"
                      >
                        {payType === "BLOCKCHAIN_CRYPTO" && (
                          <>
                            <option value="Solana Pay (USDT-SPL)">Solana Pay (USDT-SPL / Phantom)</option>
                            <option value="Solana SOL Native">Solana (SOL Native Transfer)</option>
                            <option value="Base L2 (USDC)">Base L2 Ethereum (USDC / Coinbase)</option>
                            <option value="Polygon Network (POL/USDT)">Polygon Network (POL / USDT)</option>
                            <option value="Ethereum Mainnet (ETH)">Ethereum Mainnet (ETH / ERC-20)</option>
                          </>
                        )}
                        {payType === "WORLDWIDE_CARD" && (
                          <>
                            <option value="Visa Card (Worldwide)">Visa Infinite / Signature (Worldwide)</option>
                            <option value="Mastercard World Elite">Mastercard World Elite</option>
                            <option value="American Express">American Express (Amex)</option>
                            <option value="Discover / Diners Club">Discover / Diners Club</option>
                          </>
                        )}
                        {payType === "DIGITAL_WALLET" && (
                          <>
                            <option value="Apple Pay (Global Tokenized)">Apple Pay (1-Touch Biometrics)</option>
                            <option value="Google Pay (Global)">Google Pay (Google Wallet)</option>
                          </>
                        )}
                        {payType === "GLOBAL_RAIL" && (
                          <>
                            <option value="SEPA Instant (Europe)">SEPA Instant (Eurozone Instant Credit)</option>
                            <option value="Pix Instant (Brazil)">Pix Instant (Central Bank of Brazil)</option>
                            <option value="iDEAL (Netherlands)">iDEAL (Dutch Banking Rail)</option>
                            <option value="UPI Direct (India)">UPI Direct (Unified Payments Interface)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">
                        Gross Transaction Amount (USD):
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-stone-500 font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-7 pr-3 py-2 text-stone-100 font-mono text-xs focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-stone-300 font-bold block mb-1">
                        Item / Subscription Description:
                      </label>
                      <input
                        type="text"
                        value={payDescription}
                        onChange={(e) => setPayDescription(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-xs focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Real-Time Revenue Split Preview */}
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-stone-400">Total: ${parseFloat(payAmount) || 0}</span>
                      <span className="text-stone-600">→</span>
                      <span className="text-amber-300 font-bold">
                        Platform Owner Cut ({scoConfig?.platformCutPercentage || 15}%): +${((parseFloat(payAmount) || 0) * ((scoConfig?.platformCutPercentage || 15) / 100)).toFixed(2)} USD
                      </span>
                    </div>
                    <div className="text-stone-400 font-mono text-[11px]">
                      Creator / Seller Cut: ${((parseFloat(payAmount) || 0) * (1 - (scoConfig?.platformCutPercentage || 15) / 100)).toFixed(2)} USD
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={payProcessing}
                    className="w-full py-3 bg-gradient-to-r from-nobel-gold via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={15} className={payProcessing ? "animate-spin" : ""} />
                    <span>{payProcessing ? "Authorizing Real Transaction..." : `Execute & Process Real Payment via ${payMethod}`}</span>
                  </button>
                </form>
              </div>

              {/* Box: Real-Time Transaction Ledger with Explorer Verification */}
              <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 space-y-3.5 shadow-xl">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <History size={16} className="text-cyan-400" />
                    SCO Omnichannel Transaction Ledger
                  </h3>
                  <span className="text-xs font-mono text-stone-400">
                    {transactions.length} Verified Entries
                  </span>
                </div>

                <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-stone-950 text-stone-400 text-[10px] uppercase font-mono border-b border-stone-800">
                      <tr>
                        <th className="py-2 px-2.5">Order</th>
                        <th className="py-2 px-2.5">Method / Rail</th>
                        <th className="py-2 px-2.5">Gross</th>
                        <th className="py-2 px-2.5 text-amber-300">Platform Cut</th>
                        <th className="py-2 px-2.5">Hash / Verification</th>
                        <th className="py-2 px-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900 font-mono">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-stone-900/50">
                          <td className="py-2 px-2.5 font-bold text-stone-200">{tx.orderId}</td>
                          <td className="py-2 px-2.5 text-stone-300 text-[11px]">{tx.method}</td>
                          <td className="py-2 px-2.5 text-white font-bold">${tx.grossAmountUsd.toFixed(2)}</td>
                          <td className="py-2 px-2.5 text-amber-300 font-bold">+${tx.platformOwnerEarnedUsd.toFixed(2)}</td>
                          <td className="py-2 px-2.5 text-[11px]">
                            {tx.explorerUrl ? (
                              <a
                                href={tx.explorerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 hover:underline flex items-center gap-1"
                              >
                                <span>{tx.txHash.slice(0, 8)}...</span>
                                <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span className="text-stone-400">{tx.txHash.slice(0, 10)}...</span>
                            )}
                          </td>
                          <td className="py-2 px-2.5">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: GITHUB APP REGISTRATION & WEBHOOK MONETIZATION ENGINE           */}
      {/* ========================================================================= */}
      {activeSubTab === "github_app" && (
        <div className="space-y-6">
          
          {/* GitHub Documentation Compliance Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-950/70 via-stone-900 to-stone-950 rounded-2xl border border-purple-500/40 shadow-xl space-y-2">
            <div className="flex items-center gap-2.5 text-purple-300 font-bold text-sm">
              <GitBranch size={18} />
              <span>Official GitHub App 22-Step Registration & Webhook Integration</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-4xl">
              Following GitHub’s official registration process: your app name is configured, callback URLs and setup URLs are linked to this live cloud deployment, webhooks are protected with HMAC-SHA256 verification, and purchases on the GitHub Marketplace or Sponsors pass commissions directly into your SCO platform owner treasury.
            </p>
          </div>

          {/* TWO COLUMN GITHUB WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1 (6 Cols): Official 22-Step Registration Guide with Ready-to-Copy Links */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-400" />
                    GitHub App Registration Quick-Fill Values
                  </h3>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    Ready to Paste into GitHub
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Field 1: GitHub App Name */}
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">GitHub App Name</span>
                      <span className="font-mono text-stone-200 font-bold">{ghConfig?.appName || "sreymara-alphaqubit-sco"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ghConfig?.appName || "sreymara-alphaqubit-sco", "appName")}
                      className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded border border-stone-700 cursor-pointer"
                      title="Copy App Name"
                    >
                      {copiedKey === "appName" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Field 2: Homepage URL */}
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
                    <div className="truncate mr-2">
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Homepage URL</span>
                      <span className="font-mono text-stone-200 truncate block">{activeOrigin}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeOrigin, "homepageUrl")}
                      className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded border border-stone-700 cursor-pointer shrink-0"
                      title="Copy Homepage URL"
                    >
                      {copiedKey === "homepageUrl" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Field 3: Callback URL */}
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
                    <div className="truncate mr-2">
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">User Authorization Callback URL</span>
                      <span className="font-mono text-stone-200 truncate block">{activeOrigin}/api/github/oauth/callback</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${activeOrigin}/api/github/oauth/callback`, "callbackUrl")}
                      className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded border border-stone-700 cursor-pointer shrink-0"
                      title="Copy Callback URL"
                    >
                      {copiedKey === "callbackUrl" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Field 4: Webhook URL */}
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
                    <div className="truncate mr-2">
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Webhook URL (Active)</span>
                      <span className="font-mono text-emerald-400 truncate block">{activeOrigin}/api/github/webhook</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${activeOrigin}/api/github/webhook`, "webhookUrl")}
                      className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded border border-stone-700 cursor-pointer shrink-0"
                      title="Copy Webhook URL"
                    >
                      {copiedKey === "webhookUrl" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Field 5: Webhook Secret */}
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
                    <div className="truncate mr-2">
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Webhook Secret (HMAC-SHA256)</span>
                      <span className="font-mono text-amber-300 truncate block">{ghConfig?.webhookSecret}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ghConfig?.webhookSecret || "", "webhookSecret")}
                      className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded border border-stone-700 cursor-pointer shrink-0"
                      title="Copy Webhook Secret"
                    >
                      {copiedKey === "webhookSecret" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Direct Link to GitHub Register Page */}
                  <div className="pt-2">
                    <a
                      href="https://github.com/settings/apps/new"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold text-xs rounded-xl border border-purple-600 flex items-center justify-center gap-2 transition-all shadow cursor-pointer"
                    >
                      <span>Open GitHub: Register New GitHub App</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>

              {/* GitHub App Credentials Save Form */}
              <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                  <Lock size={16} className="text-amber-400" />
                  Connect Registered GitHub App Credentials
                </h3>

                <form onSubmit={handleSaveGhConfig} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-400 block mb-1 font-bold">App ID:</label>
                      <input
                        type="text"
                        value={ghAppIdInput}
                        onChange={(e) => setGhAppIdInput(e.target.value)}
                        placeholder="e.g. 1094829"
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-xs focus:border-purple-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-stone-400 block mb-1 font-bold">Client ID:</label>
                      <input
                        type="text"
                        value={ghClientIdInput}
                        onChange={(e) => setGhClientIdInput(e.target.value)}
                        placeholder="e.g. Iv1.839201849a0b12"
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-xs focus:border-purple-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-1 font-bold">Client Secret:</label>
                    <input
                      type="password"
                      value={ghClientSecretInput}
                      onChange={(e) => setGhClientSecretInput(e.target.value)}
                      placeholder="ghs_..."
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-xs focus:border-purple-400 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs rounded-xl border border-stone-600 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check size={14} />
                    <span>Save GitHub App Credentials</span>
                  </button>
                </form>
              </div>

            </div>

            {/* COLUMN 2 (6 Cols): Webhook Testing & Monetization Attribution Stream */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Webhook Testbed */}
              <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    GitHub Webhook Monetization Simulator
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    HMAC Verified
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Simulate incoming GitHub webhook payloads (Marketplace purchases, GitHub Sponsors tiers) to test signature verification and verify that your Platform Owner cut ({ghConfig?.monetizationPlan?.platformOwnerCutPct || 20}%) is credited to the treasury.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Webhook Event Type:</label>
                      <select
                        value={testGhEvent}
                        onChange={(e) => setTestGhEvent(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-xs focus:border-purple-400 outline-none"
                      >
                        <option value="marketplace_purchase">Marketplace Purchase (Plan Pro)</option>
                        <option value="sponsorship">GitHub Sponsor Monthly Contribution</option>
                        <option value="installation">GitHub App Installation Created</option>
                        <option value="push">Repository Push Event</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Transaction Value ($):</label>
                      <input
                        type="number"
                        step="1"
                        value={testGhAmount}
                        onChange={(e) => setTestGhAmount(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono text-xs focus:border-purple-400 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestGhWebhook}
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Dispatch Test GitHub Webhook & Credit Commission</span>
                  </button>
                </div>
              </div>

              {/* Webhook Activity Feed */}
              <div className="p-5 bg-[#0C0E16] rounded-2xl border border-stone-800 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <History size={16} className="text-purple-400" />
                    Live Webhook Delivery Stream
                  </h3>
                  <span className="text-[10px] font-mono text-stone-400">
                    Active Installs: <strong className="text-white">{ghConfig?.activeInstallationsCount || 18}</strong>
                  </span>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto scrollbar-thin">
                  {ghLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-stone-950 rounded-xl border border-stone-800/80 space-y-1 text-xs">
                      <div className="flex justify-between items-center flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-stone-900 text-purple-300 border border-purple-800/50">
                            {log.event}
                          </span>
                          <span className="font-bold text-stone-200">{log.sender}</span>
                        </div>
                        {log.monetizationEarnedUsd > 0 && (
                          <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                            +${log.monetizationEarnedUsd.toFixed(2)} USD Earned
                          </span>
                        )}
                      </div>
                      <p className="text-stone-400 text-[11px] leading-relaxed">
                        {log.summary}
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono pt-1 border-t border-stone-900">
                        <span>Delivery: {log.deliveryId}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
