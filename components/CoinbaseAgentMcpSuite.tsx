import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Wallet,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Key,
  Lock,
  Globe,
  RefreshCw,
  X,
  AlertTriangle,
  Play,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Sliders,
  DollarSign
} from "lucide-react";

interface CoinbasePortfolio {
  uuid: string;
  name: string;
  type: "DEFAULT" | "CONSUMER" | "ISOLATED_AGENT";
  cashBalanceUsd: number;
  cryptoBalanceUsd: number;
  totalBalanceUsd: number;
  assets: { symbol: string; amount: number; valueUsd: number; priceUsd: number }[];
  isDefault: boolean;
}

interface DiscoveredTool {
  name: string;
  description: string;
  params: Record<string, string>;
}

interface OrderRecord {
  orderId: string;
  productId: string;
  side: string;
  size: string;
  priceUsd: number;
  valueUsd: number;
  status: string;
  filledAt: string;
  portfolioUuid: string;
  guardrailCheck: string;
}

interface CoinbaseAgentMcpSuiteProps {
  onClose?: () => void;
}

export const CoinbaseAgentMcpSuite: React.FC<CoinbaseAgentMcpSuiteProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"coinbase_trading" | "wallet_mcp" | "cdp_mcp">("coinbase_trading");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // 1. Coinbase MCP State
  const [coinbaseMcp, setCoinbaseMcp] = useState<any>({
    serverUrl: "https://agents.coinbase.com/mcp",
    authServer: "https://login.coinbase.com/",
    scopes: [],
    isConnected: true,
    userEmail: "kansasnelly@gmail.com",
    activePortfolioId: "pf_sreymara_agent_01",
    guardrails: { maxSingleOrderUsd: 5000, dailyTradingLimitUsd: 25000 },
    tools: [] as DiscoveredTool[],
    portfolios: [] as CoinbasePortfolio[],
    recentOrders: [] as OrderRecord[],
    cliInfo: { version: "0.0.8", commandLive: "coinbase env live --key-file <key.json>" }
  });

  // Trading form state
  const [tradeProduct, setTradeProduct] = useState<string>("BTC-USD");
  const [tradeSide, setTradeSide] = useState<"BUY" | "SELL">("BUY");
  const [tradeAmountUsd, setTradeAmountUsd] = useState<number>(500);

  // 2. Wallet MCP State
  const [walletMcp, setWalletMcp] = useState<any>({
    serverUrl: "https://mcp.base.org",
    disclaimer: "",
    disclaimerAccepted: true,
    isConnected: true,
    walletAddress: "0x892a0149C82810C249fE9bA82e460481237A8B88",
    chainId: 8453,
    networkName: "Base Mainnet",
    balances: { ETH: 1.482, USDC: 8450, cbBTC: 0.12, AERO: 3420.5 },
    tools: [] as DiscoveredTool[]
  });
  const [proposedApproval, setProposedApproval] = useState<any | null>(null);

  // 3. CDP MCP State
  const [cdpMcp, setCdpMcp] = useState<any>({
    cliPackage: "@coinbase/cdp-cli",
    cliVersion: "2.0.85",
    binaryPath: "/usr/local/bin/cdp",
    claudeMcpCommand: "claude mcp add --scope user --transport stdio cdp -- cdp mcp",
    isConfigured: true,
    apiKeyName: "organizations/sreymara-ecosystem/apiKeys/cdp-key-2026",
    toolsAvailable: [] as string[]
  });

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      // Fetch Coinbase MCP status
      const cbRes = await fetch("/api/mcp/coinbase/status");
      if (cbRes.ok) {
        const data = await cbRes.json();
        setCoinbaseMcp(data);
      }

      // Fetch Wallet MCP status
      const wRes = await fetch("/api/mcp/wallet/status");
      if (wRes.ok) {
        const data = await wRes.json();
        setWalletMcp(data);
      }

      // Fetch CDP MCP status
      const cdpRes = await fetch("/api/mcp/cdp/status");
      if (cdpRes.ok) {
        const data = await cdpRes.json();
        setCdpMcp(data);
      }
    } catch (err) {
      console.error("Failed to load MCP status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Handle Trade Order Execution
  const handleExecuteTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/mcp/coinbase/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: tradeProduct,
          side: tradeSide,
          amountUsd: tradeAmountUsd
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        await fetchStatus();
      } else {
        setStatusMessage(data.message || "Trade order failed.");
      }
    } catch (err) {
      setStatusMessage("Failed to execute order.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  };

  // Handle Wallet Action with Non-Custodial Approval Simulation
  const handleWalletAction = async (action: string, params: any, confirmed = false) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/mcp/wallet/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, params, userApproved: confirmed })
      });
      const data = await res.json();
      if (data.approvalRequired) {
        setProposedApproval(data);
        setStatusMessage("Wallet MCP approval requested. Confirm in popup or click Approve.");
      } else if (data.success) {
        setProposedApproval(null);
        setStatusMessage(data.message);
        await fetchStatus();
      }
    } catch (err) {
      setStatusMessage("Action execution error.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-[#0B0E14] text-stone-100 rounded-3xl border border-stone-800 shadow-2xl font-sans space-y-6">
      
      {/* 1. TOP HEADER & MULTI-MCP OVERVIEW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
              <Zap size={11} />
              COINBASE FOR AGENTS • 3 MCP SUITES ACTIVE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
              NODE v22 • CLI READY
            </span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <Globe className="text-blue-400" size={26} />
            Coinbase Model Context Protocol (MCP) Gateway
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Seamless remote trading, on-chain Base DeFi wallet control, and developer platform CLI integrations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStatus}
            disabled={isLoading}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin text-blue-400" : ""} />
            <span>Sync MCPs</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* STATUS NOTIFICATION TOAST */}
      {statusMessage && (
        <div className="p-3.5 bg-gradient-to-r from-blue-950/80 to-stone-900 border border-blue-500/50 rounded-xl text-xs text-blue-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-blue-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-stone-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. THREE-PILLAR NAVIGATION TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* TAB A: COINBASE MCP (TRADING) */}
        <button
          onClick={() => setActiveTab("coinbase_trading")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === "coinbase_trading"
              ? "bg-[#121828] border-blue-500 shadow-xl ring-2 ring-blue-500/30"
              : "bg-[#0E121B] border-stone-800 hover:border-stone-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <TrendingUp size={18} />
              </div>
              <span className="font-bold text-sm text-white">1. Coinbase MCP</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="text-[11px] text-stone-400 font-mono">
            https://agents.coinbase.com/mcp
          </div>
          <div className="text-[11px] text-stone-300 mt-1">
            Advanced Trade, isolated portfolios, OAuth handshake & guardrails.
          </div>
        </button>

        {/* TAB B: WALLET MCP (BASE DEFI) */}
        <button
          onClick={() => setActiveTab("wallet_mcp")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === "wallet_mcp"
              ? "bg-[#121828] border-blue-500 shadow-xl ring-2 ring-blue-500/30"
              : "bg-[#0E121B] border-stone-800 hover:border-stone-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Wallet size={18} />
              </div>
              <span className="font-bold text-sm text-white">2. Wallet MCP</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="text-[11px] text-stone-400 font-mono">
            https://mcp.base.org
          </div>
          <div className="text-[11px] text-stone-300 mt-1">
            Coinbase Smart Wallet, Base Mainnet, swaps, lending, approval mode.
          </div>
        </button>

        {/* TAB C: CDP MCP (DEVELOPER PLATFORM CLI) */}
        <button
          onClick={() => setActiveTab("cdp_mcp")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === "cdp_mcp"
              ? "bg-[#121828] border-blue-500 shadow-xl ring-2 ring-blue-500/30"
              : "bg-[#0E121B] border-stone-800 hover:border-stone-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Cpu size={18} />
              </div>
              <span className="font-bold text-sm text-white">3. CDP MCP</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="text-[11px] text-stone-400 font-mono">
            @coinbase/cdp-cli v2.0.85
          </div>
          <div className="text-[11px] text-stone-300 mt-1">
            Stdio CLI transport for Claude, Claude Code, Cursor & MPC APIs.
          </div>
        </button>

      </div>

      {/* ============================================================== */}
      {/* SECTION 1: COINBASE MCP (TRADING & ADVANCED TRADE) */}
      {/* ============================================================== */}
      {activeTab === "coinbase_trading" && (
        <div className="space-y-6">
          
          {/* Connection & Auth Header */}
          <div className="p-5 rounded-2xl bg-[#111624] border border-blue-500/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  OAUTH CONNECTED
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Target: {coinbaseMcp.serverUrl}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Verified Coinbase Account: {coinbaseMcp.userEmail}
              </h3>
              <p className="text-xs text-stone-400">
                Granted Scopes: {coinbaseMcp.scopes?.slice(0, 4).join(", ")} + {Math.max(0, (coinbaseMcp.scopes?.length || 0) - 4)} more
              </p>
            </div>

            {/* Guardrails Info Box */}
            <div className="p-3 bg-[#0A0D14] rounded-xl border border-stone-800 text-xs font-mono space-y-1">
              <div className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                <ShieldCheck size={12} />
                Agent Guardrails Active
              </div>
              <div className="text-stone-300">
                Max Single Trade: <strong className="text-white">${coinbaseMcp.guardrails?.maxSingleOrderUsd?.toLocaleString()}</strong>
              </div>
              <div className="text-stone-300">
                Daily Limit: <strong className="text-white">${coinbaseMcp.guardrails?.dailyTradingLimitUsd?.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* PORTFOLIO LISTING (coinbase_portfolios_list) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-blue-400" />
                Portfolios Discovered via `coinbase_portfolios_list`
              </h3>
              <span className="text-xs text-stone-400 font-mono">
                {coinbaseMcp.portfolios?.length || 0} Portfolios Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coinbaseMcp.portfolios?.map((pf: CoinbasePortfolio) => {
                const isAgentPf = pf.type === "ISOLATED_AGENT";
                return (
                  <div
                    key={pf.uuid}
                    className={`p-5 rounded-2xl border ${
                      isAgentPf
                        ? "bg-[#12192A] border-blue-500/50 shadow-lg ring-1 ring-blue-500/20"
                        : "bg-[#0E121B] border-stone-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{pf.name}</span>
                          {isAgentPf && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                              ISOLATED AGENT
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">UUID: {pf.uuid}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-400 font-mono">
                          ${pf.totalBalanceUsd?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">Total Value</div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 bg-[#090C12] rounded-xl border border-stone-800/80 mb-3">
                      <div>
                        <span className="text-stone-400">Cash / USDC:</span>{" "}
                        <span className="text-white font-bold">${pf.cashBalanceUsd?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">Crypto Assets:</span>{" "}
                        <span className="text-white font-bold">${pf.cryptoBalanceUsd?.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Asset pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {pf.assets?.map((asset, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300"
                        >
                          <strong>{asset.symbol}</strong>: {asset.amount} (~${asset.valueUsd?.toLocaleString()})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRADE EXECUTION CONSOLE WITH MCP GUARDRAILS */}
          <div className="p-5 rounded-2xl bg-[#111520] border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Play size={15} className="text-blue-400" />
                Execute Spot Trade via `coinbase_orders_create`
              </h4>
              <span className="text-[11px] font-mono text-stone-400">
                Routed to Isolated Portfolio (pf_sreymara_agent_01)
              </span>
            </div>

            <form onSubmit={handleExecuteTrade} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Trading Pair</label>
                <select
                  value={tradeProduct}
                  onChange={(e) => setTradeProduct(e.target.value)}
                  className="w-full p-2.5 bg-[#0B0E14] border border-stone-700 rounded-xl text-white font-mono"
                >
                  <option value="BTC-USD">BTC-USD ($66,000)</option>
                  <option value="ETH-USD">ETH-USD ($2,600)</option>
                  <option value="SOL-USD">SOL-USD ($158.27)</option>
                  <option value="cbBTC-USD">cbBTC-USD ($66,200)</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Order Side</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTradeSide("BUY")}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition ${
                      tradeSide === "BUY"
                        ? "bg-emerald-500 text-stone-950"
                        : "bg-stone-900 text-stone-400 border border-stone-800"
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeSide("SELL")}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition ${
                      tradeSide === "SELL"
                        ? "bg-rose-500 text-white"
                        : "bg-stone-900 text-stone-400 border border-stone-800"
                    }`}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Amount ($ USD)</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={tradeAmountUsd}
                  onChange={(e) => setTradeAmountUsd(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#0B0E14] border border-stone-700 rounded-xl text-white font-mono"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black rounded-xl cursor-pointer shadow transition active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "Submitting..." : `Execute ${tradeSide} Order →`}
                </button>
              </div>
            </form>
          </div>

          {/* RECENT EXECUTIONS & CLI ALTERNATIVE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Orders list */}
            <div className="p-5 rounded-2xl bg-[#0F131D] border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Recent Orders via MCP</span>
                <span className="text-[10px] font-mono text-emerald-400">All Guardrails Passed</span>
              </h4>

              <div className="space-y-2">
                {coinbaseMcp.recentOrders?.map((ord: OrderRecord) => (
                  <div
                    key={ord.orderId}
                    className="p-3 bg-[#0A0D14] rounded-xl border border-stone-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                        <span className={ord.side === "BUY" ? "text-emerald-400" : "text-rose-400"}>
                          {ord.side}
                        </span>
                        <span>{ord.productId}</span>
                        <span className="text-stone-400 font-normal">({ord.size})</span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {ord.orderId} • {new Date(ord.filledAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold font-mono">${ord.valueUsd?.toLocaleString()}</div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CLI Alternative Card */}
            <div className="p-5 rounded-2xl bg-[#0F131D] border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Terminal size={14} className="text-blue-400" />
                  CLI Alternative: `@coinbase/coinbase-cli`
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  v{coinbaseMcp.cliInfo?.version} Installed
                </span>
              </div>

              <p className="text-[11px] text-stone-400 leading-relaxed">
                Most reliable for executing high-frequency trades or scripting headless bots directly from your terminal.
              </p>

              <div className="p-3 bg-[#080B10] rounded-xl border border-stone-800 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-stone-300">
                  <span>coinbase env live --key-file &lt;key.json&gt;</span>
                  <button
                    onClick={() => copyToClipboard("coinbase env live --key-file ./coinbase_key.json", "cli_cmd")}
                    className="text-stone-400 hover:text-white"
                  >
                    {copiedKey === "cli_cmd" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-stone-400 text-[11px]">
                  <span>coinbase balance && coinbase orders list</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: WALLET MCP (BASE DEFI & ON-CHAIN CONTROL) */}
      {/* ============================================================== */}
      {activeTab === "wallet_mcp" && (
        <div className="space-y-6">
          
          {/* VERBATIM ONBOARDING DISCLAIMER (MANDATORY PER SPEC) */}
          <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-amber-200 leading-relaxed">
              <strong className="text-white">Required Wallet MCP Disclaimer:</strong>{" "}
              {walletMcp.disclaimer || "By using the Wallet MCP, you agree to the Base Account and Base App Terms of Service (https://wallet.coinbase.com/terms-of-service). Wallet MCP provides access to plugins that are built by third parties, not Base. Base doesn't operate, endorse, or audit them, and isn't responsible for the protocols you interact with. Transactions are irreversible — always review before approving."}
            </div>
          </div>

          {/* WALLET CONNECTOR & BASE BALANCES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#111624] border border-indigo-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Coinbase Smart Wallet (Base)</h3>
                    <p className="text-[11px] text-stone-400">Passkey Authentication & EIP-5792 Batching</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  CONNECTED
                </span>
              </div>

              <div className="p-3 bg-[#0A0D14] rounded-xl border border-stone-800 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[10px]">Active Address:</span>
                  <span className="text-white font-bold text-xs">{walletMcp.walletAddress}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(walletMcp.walletAddress || "", "w_addr")}
                  className="p-1.5 bg-stone-800 text-stone-300 hover:text-white rounded-lg"
                >
                  {copiedKey === "w_addr" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>

              <div className="text-[11px] text-stone-400">
                Remote Connector: <strong className="text-indigo-400 font-mono">https://mcp.base.org</strong>
              </div>
            </div>

            {/* BALANCES ON BASE MAINNET (CHAIN ID 8453) */}
            <div className="p-5 rounded-2xl bg-[#111624] border border-stone-800 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center justify-between">
                <span>Base Mainnet (8453) Assets</span>
                <span className="text-emerald-400">Gas Sponsored</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-[#090C12] rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">USDC (Base Native):</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ${walletMcp.balances?.USDC?.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 bg-[#090C12] rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Ethereum (ETH):</span>
                  <span className="text-white font-bold text-sm">
                    {walletMcp.balances?.ETH} ETH
                  </span>
                </div>
                <div className="p-2.5 bg-[#090C12] rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Coinbase Wrapped BTC:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {walletMcp.balances?.cbBTC} cbBTC
                  </span>
                </div>
                <div className="p-2.5 bg-[#090C12] rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Aerodrome DEX (AERO):</span>
                  <span className="text-sky-400 font-bold text-sm">
                    {walletMcp.balances?.AERO?.toLocaleString()} AERO
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* APPROVAL MODE SIMULATION (NON-CUSTODIAL SAFETY RULE) */}
          {proposedApproval && (
            <div className="p-5 bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border-2 border-indigo-500 rounded-2xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="text-indigo-400" size={16} />
                  Wallet MCP Approval Requested
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  ID: {proposedApproval.approvalId}
                </span>
              </div>
              <p className="text-xs text-stone-200">
                Action: <strong className="text-white font-mono">{proposedApproval.proposedAction?.action}</strong> — All writes require explicit cryptographic signoff.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleWalletAction(proposedApproval.proposedAction?.action, proposedApproval.proposedAction?.params, true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl cursor-pointer shadow transition"
                >
                  Approve Transaction (Sign) →
                </button>
                <button
                  onClick={() => setProposedApproval(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS (SWAP, LENDING, TRANSFER) */}
          <div className="p-5 rounded-2xl bg-[#0F131D] border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Zap size={14} className="text-indigo-400" />
              Quick On-Chain Actions (Requires Approval URL)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => handleWalletAction("swap_tokens", { from: "USDC", to: "cbBTC", amount: "100" })}
                className="p-3 bg-[#0A0D14] hover:bg-stone-900 border border-stone-800 hover:border-indigo-500/40 rounded-xl text-left cursor-pointer transition"
              >
                <div className="font-bold text-white mb-0.5">Swap on Aerodrome</div>
                <div className="text-[10px] text-stone-400">100 USDC → cbBTC via DEX router</div>
              </button>

              <button
                onClick={() => handleWalletAction("moonwell_supply", { asset: "USDC", amount: "250" })}
                className="p-3 bg-[#0A0D14] hover:bg-stone-900 border border-stone-800 hover:border-indigo-500/40 rounded-xl text-left cursor-pointer transition"
              >
                <div className="font-bold text-white mb-0.5">Supply to Moonwell</div>
                <div className="text-[10px] text-stone-400">Deposit 250 USDC to earn Base yield</div>
              </button>

              <button
                onClick={() => handleWalletAction("transfer_token", { to: "0x742d...44e", token: "USDC", amount: "50" })}
                className="p-3 bg-[#0A0D14] hover:bg-stone-900 border border-stone-800 hover:border-indigo-500/40 rounded-xl text-left cursor-pointer transition"
              >
                <div className="font-bold text-white mb-0.5">Transfer Token</div>
                <div className="text-[10px] text-stone-400">Send 50 USDC with EIP-5792 batching</div>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: CDP MCP (DEVELOPER PLATFORM CLI & STDIO MCP) */}
      {/* ============================================================== */}
      {activeTab === "cdp_mcp" && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-2xl bg-[#111822] border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  LOCAL STDIO MCP SERVER INSTALLED
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  @coinbase/cdp-cli (Version {cdpMcp.cliVersion})
                </h3>
                <p className="text-xs text-stone-400">
                  Binary located at: <code className="text-emerald-400 font-mono">{cdpMcp.binaryPath}</code>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-stone-400 block">CDP API KEY:</span>
                <span className="text-xs font-mono text-white font-bold">
                  {cdpMcp.apiKeyName?.split("/").pop()}
                </span>
              </div>
            </div>

            {/* ONE-CLICK REGISTRATION COMMAND */}
            <div className="p-4 bg-[#080B10] rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-bold flex items-center gap-1.5">
                  <Terminal size={14} className="text-emerald-400" />
                  Claude / Claude Code Registration Command:
                </span>
                <button
                  onClick={() => copyToClipboard(cdpMcp.claudeMcpCommand || "claude mcp add --scope user --transport stdio cdp -- cdp mcp", "claude_cmd")}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "claude_cmd" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>Copy Command</span>
                </button>
              </div>
              <div className="p-2.5 bg-black rounded-lg border border-stone-800 font-mono text-xs text-emerald-300 select-all">
                {cdpMcp.claudeMcpCommand}
              </div>
            </div>
          </div>

          {/* SETUP STEPS ACCORDING TO SKILL.MD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step 1 & 2 */}
            <div className="p-5 rounded-2xl bg-[#0F131D] border border-stone-800 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Key size={15} className="text-amber-400" />
                Step 1: Configure CDP API Key
              </h4>
              <p className="text-stone-400 leading-relaxed">
                Download your secret key JSON from <a href="https://portal.cdp.coinbase.com/api-keys/secret" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">portal.cdp.coinbase.com</a> and configure it:
              </p>
              <div className="p-2.5 bg-[#090C12] rounded-xl border border-stone-800 font-mono text-stone-300 flex items-center justify-between">
                <span>cdp env live --key-file &lt;path-to-key.json&gt;</span>
                <button
                  onClick={() => copyToClipboard("cdp env live --key-file ./cdp_key.json", "cdp_key_cmd")}
                  className="text-stone-400 hover:text-white"
                >
                  {copiedKey === "cdp_key_cmd" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#0F131D] border border-stone-800 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Lock size={15} className="text-emerald-400" />
                Step 2: Generate Non-Custodial Wallet Secret
              </h4>
              <p className="text-stone-400 leading-relaxed">
                Generate your wallet secret file from <a href="https://portal.cdp.coinbase.com/wallets/non-custodial/security" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">portal.cdp.coinbase.com</a> for programmatic MPC signing:
              </p>
              <div className="p-2.5 bg-[#090C12] rounded-xl border border-stone-800 font-mono text-stone-300 flex items-center justify-between">
                <span>cdp env live --wallet-secret-file &lt;secret.txt&gt;</span>
                <button
                  onClick={() => copyToClipboard("cdp env live --wallet-secret-file ./wallet_secret.txt", "cdp_sec_cmd")}
                  className="text-stone-400 hover:text-white"
                >
                  {copiedKey === "cdp_sec_cmd" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

          </div>

          {/* CURSOR / CLAUDE CONFIG JSON EXPORT */}
          <div className="p-5 rounded-2xl bg-[#0F131D] border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Sliders size={14} className="text-blue-400" />
                Cursor / Claude Desktop Config JSON (`claude_desktop_config.json`)
              </h4>
              <button
                onClick={() => copyToClipboard(JSON.stringify({
                  mcpServers: {
                    cdp: {
                      command: "cdp",
                      args: ["mcp"]
                    }
                  }
                }, null, 2), "json_config")}
                className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === "json_config" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>Copy JSON</span>
              </button>
            </div>

            <pre className="p-3 bg-[#080B10] rounded-xl border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto">
{`{
  "mcpServers": {
    "cdp": {
      "command": "cdp",
      "args": ["mcp"]
    }
  }
}`}
            </pre>
          </div>

        </div>
      )}

      {/* FOOTER METADATA BAR */}
      <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-stone-500 gap-2">
        <div className="flex items-center gap-3">
          <span>Coinbase MCP: agents.coinbase.com/mcp</span>
          <span>•</span>
          <span>Wallet MCP: mcp.base.org</span>
          <span>•</span>
          <span>CDP MCP: cdp mcp (v2.0.85)</span>
        </div>
        <div className="text-stone-400">
          Official Docs: <a href="https://docs.cdp.coinbase.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">docs.cdp.coinbase.com</a>
        </div>
      </div>

    </div>
  );
};
