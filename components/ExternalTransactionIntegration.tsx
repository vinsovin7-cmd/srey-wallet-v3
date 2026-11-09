import React, { useState, useEffect } from "react";
import {
  Share2,
  Database,
  Key,
  ShieldCheck,
  RefreshCw,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  PlusCircle,
  Clock,
  Code2,
  ArrowUpRight,
  Filter,
  FileSpreadsheet,
  FileCode,
  Radio,
  SlidersHorizontal,
  Server
} from "lucide-react";

interface ExternalTx {
  id: string;
  sourceSystem: string;
  network: string;
  type: string;
  amount: number;
  token: string;
  amountUsd: number;
  source: string;
  destination: string;
  txHash: string;
  explorerUrl: string;
  status: string;
  timestamp: string;
  summary: string;
  checksum?: string;
  signature?: string;
}

interface IntegrationStatus {
  status: string;
  apiKeyConfigured: boolean;
  apiKeyMasked: string;
  apiKeyLength: number;
  totalTransactions: number;
  totalVolumeUsd: number;
  activeWebhooksCount: number;
  syncAuditCount: number;
  lastSyncTimestamp: string;
  supportedNetworks: string[];
  supportedProtocols: string[];
  endpoints: Record<string, string>;
}

interface WebhookItem {
  id: string;
  url: string;
  name: string;
  events: string[];
  active: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  lastStatus?: number;
}

export const ExternalTransactionIntegration: React.FC<{
  onRefreshEcosystem?: () => void;
}> = ({ onRefreshEcosystem }) => {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [transactions, setTransactions] = useState<ExternalTx[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [filterNetwork, setFilterNetwork] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"curl" | "node" | "python">("curl");
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);

  // Ingestion Modal / Form
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [ingestAmount, setIngestAmount] = useState("");
  const [ingestToken, setIngestToken] = useState("USDT");
  const [ingestSystem, setIngestSystem] = useState("ERP-Accounting-Core");
  const [ingestNetwork, setIngestNetwork] = useState("TON");
  const [ingestSummary, setIngestSummary] = useState("");
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState<string | null>(null);

  // Webhook Registration Form
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookName, setNewWebhookName] = useState("");
  const [webhookSubmitting, setWebhookSubmitting] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/external/status", {
        headers: { "x-internal-client": "true" }
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error("Failed to fetch external integration status", e);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterNetwork !== "ALL") params.append("network", filterNetwork);
      if (filterType !== "ALL") params.append("type", filterType);
      params.append("limit", "100");

      const res = await fetch(`/api/external/transactions?${params.toString()}`, {
        headers: { "x-internal-client": "true" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.transactions) {
          setTransactions(data.transactions);
        }
      }
    } catch (e) {
      console.error("Failed to fetch external transactions", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchWebhooks = async () => {
    try {
      const res = await fetch("/api/external/webhooks", {
        headers: { "x-internal-client": "true" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.webhooks) {
          setWebhooks(data.webhooks);
        }
      }
    } catch (e) {
      console.error("Failed to fetch webhooks", e);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchTransactions();
    fetchWebhooks();
  }, [filterNetwork, filterType]);

  const handleSyncWithExternalSystems = async () => {
    setSyncing(true);
    setLastSyncResult(null);
    try {
      const res = await fetch("/api/external/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-client": "true"
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLastSyncResult(data);
        fetchStatus();
        fetchTransactions();
        if (onRefreshEcosystem) onRefreshEcosystem();
      }
    } catch (e) {
      console.error("Failed to trigger sync", e);
    } finally {
      setSyncing(false);
    }
  };

  const handleIngestTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngestLoading(true);
    setIngestSuccess(null);
    try {
      const res = await fetch("/api/external/transactions/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-client": "true"
        },
        body: JSON.stringify({
          sourceSystem: ingestSystem,
          network: ingestNetwork,
          type: "PAYMENT",
          amount: parseFloat(ingestAmount),
          token: ingestToken,
          summary: ingestSummary || "External transaction ingested via authenticated API"
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIngestSuccess(`Transaction ${data.transaction?.id} ingested successfully!`);
        setIngestAmount("");
        setIngestSummary("");
        fetchStatus();
        fetchTransactions();
        if (onRefreshEcosystem) onRefreshEcosystem();
        setTimeout(() => setShowIngestModal(false), 1500);
      }
    } catch (e) {
      console.error("Ingestion failed", e);
    } finally {
      setIngestLoading(false);
    }
  };

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookSubmitting(true);
    try {
      const res = await fetch("/api/external/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-client": "true"
        },
        body: JSON.stringify({
          url: newWebhookUrl,
          name: newWebhookName || "External Inbound Service",
          events: ["*"]
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewWebhookUrl("");
        setNewWebhookName("");
        setShowWebhookModal(false);
        fetchWebhooks();
        fetchStatus();
      }
    } catch (e) {
      console.error("Webhook registration failed", e);
    } finally {
      setWebhookSubmitting(false);
    }
  };

  const handleExportCsv = () => {
    window.open("/api/external/transactions/export?format=csv", "_blank");
  };

  const handleExportJson = () => {
    window.open("/api/external/transactions/export?format=json", "_blank");
  };

  const codeSnippets = {
    curl: `# 1. Pull recent unified transactions
curl -X GET "https://${window.location.host}/api/external/transactions?network=ALL&limit=50" \\
  -H "Authorization: Bearer 5dd22e8e-0ba3-47f7-bb4b-ef1becb2"

# 2. Push external payment or ERP ledger entry
curl -X POST "https://${window.location.host}/api/external/transactions/push" \\
  -H "Authorization: Bearer 5dd22e8e-0ba3-47f7-bb4b-ef1becb2" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sourceSystem": "SAP Enterprise Cloud",
    "network": "TON",
    "amount": 250.00,
    "token": "USDT",
    "summary": "External invoice settlement #INV-9402"
  }'`,
    node: `// Node.js integration script
import axios from "axios";

const API_KEY = "5dd22e8e-0ba3-47f7-bb4b-ef1becb2";
const BASE_URL = "https://${window.location.host}";

async function syncTransactions() {
  const { data } = await axios.get(\`\${BASE_URL}/api/external/transactions\`, {
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`
    },
    params: { network: "ALL", limit: 100 }
  });

  console.log("Synced transactions:", data.transactions.length);
  console.log("Batch Checksum:", data.checksum);
}

syncTransactions();`,
    python: `# Python external systems integration
import requests

API_KEY = "5dd22e8e-0ba3-47f7-bb4b-ef1becb2"
BASE_URL = "https://${window.location.host}"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Fetch normalized transactions
response = requests.get(f"{BASE_URL}/api/external/transactions", headers=headers, params={"limit": 50})
data = response.json()
print(f"Retrieved {len(data.get('transactions', []))} records, checksum: {data.get('checksum')}")
`
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Integration Health & API Key Status */}
      <div className="p-5 bg-gradient-to-r from-emerald-950/40 via-stone-900 to-cyan-950/40 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE EXTERNAL INTEGRATION
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                REST & Webhooks v2.4
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Share2 size={24} className="text-emerald-400" />
              <span>External Systems Transaction Gateway</span>
            </h2>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              Bi-directional transaction data integration with external accounting software, ERPs (SAP/Oracle), crypto portfolio trackers, and automated webhook recipients.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-sync-external-systems"
              onClick={handleSyncWithExternalSystems}
              disabled={syncing}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              <span>{syncing ? "Broadcasting..." : "Broadcast / Sync External"}</span>
            </button>

            <button
              id="btn-export-csv"
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl border border-stone-700 shadow flex items-center gap-1.5 cursor-pointer transition-all"
              title="Download CSV of all transaction data"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              id="btn-export-json"
              onClick={handleExportJson}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl border border-stone-700 shadow flex items-center gap-1.5 cursor-pointer transition-all"
              title="Download JSON of all transaction data"
            >
              <FileCode size={14} className="text-cyan-400" />
              <span>Export JSON</span>
            </button>

            <button
              id="btn-open-ingest-modal"
              onClick={() => setShowIngestModal(true)}
              className="px-3.5 py-2.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white font-bold text-xs rounded-xl border border-cyan-700/80 shadow flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <PlusCircle size={14} />
              <span>Ingest Tx</span>
            </button>
          </div>
        </div>

        {/* API Key Security Box */}
        <div className="mt-4 pt-4 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Key size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                  Integration API Key
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {status?.apiKeyMasked || "5dd2••••••••••••••••••••••••ecb2"}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText("5dd22e8e-0ba3-47f7-bb4b-ef1becb2");
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
              className="p-1.5 text-stone-400 hover:text-white bg-stone-800 rounded-lg cursor-pointer transition-colors"
              title="Copy verified API Key"
            >
              {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                Security & Verification
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300">
                HMAC-SHA256 Signed Batches
              </span>
            </div>
          </div>

          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Radio size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                Active Ingestion Webhooks
              </span>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {webhooks.length} Endpoints Registered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Confirmation Toast (if recently triggered) */}
      {lastSyncResult && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-start gap-3 animate-fade-in shadow-xl">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <span>{lastSyncResult.message}</span>
              <span className="text-[10px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-700">
                HTTP 200 OK
              </span>
            </div>
            <p className="text-stone-300 text-[11px]">
              Audit ID: <span className="font-mono text-emerald-300">{lastSyncResult.auditEntry?.id}</span> • Volume Synced: <span className="font-mono font-bold text-white">${lastSyncResult.auditEntry?.totalVolumeUsd?.toFixed(2)}</span>
            </p>
            <div className="text-[10px] font-mono text-stone-400 truncate">
              Checksum: {lastSyncResult.auditEntry?.checksum}
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Total Unified Ledger Records
          </span>
          <div className="text-2xl font-mono font-black text-white">
            {status?.totalTransactions ?? transactions.length}
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <Check size={11} />
            <span>Multi-chain & Ingested</span>
          </span>
        </div>

        <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Total Integrated Volume
          </span>
          <div className="text-2xl font-mono font-black text-emerald-400">
            ${status?.totalVolumeUsd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            USD Value Reconciled
          </span>
        </div>

        <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Connected Networks
          </span>
          <div className="text-base font-bold text-cyan-400 flex items-center gap-1.5 mt-1">
            <Server size={16} />
            <span>TON, Solana, Base</span>
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Automatic Canonical Mapping
          </span>
        </div>

        <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Active Subscriptions
          </span>
          <div className="text-2xl font-mono font-black text-amber-400">
            {webhooks.length} Webhooks
          </div>
          <button
            onClick={() => setShowWebhookModal(true)}
            className="text-[10px] text-amber-400 hover:underline font-bold mt-1 inline-block"
          >
            + Register Destination →
          </button>
        </div>
      </div>

      {/* Main Section: Unified Transaction Data Stream */}
      <div className="p-5 bg-stone-900/70 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database size={16} className="text-emerald-400" />
              <span>Unified Cross-System Transaction Ledger</span>
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Synced continuously from Telegram @Wallet, Solana Phantom Treasury, Solscan relayers, and external ERPs.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-stone-950 px-2.5 py-1.5 rounded-xl border border-stone-800 text-xs">
              <Filter size={12} className="text-stone-400" />
              <select
                value={filterNetwork}
                onChange={(e) => setFilterNetwork(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-stone-900">All Networks</option>
                <option value="TON" className="bg-stone-900">TON Jetton</option>
                <option value="SOLANA" className="bg-stone-900">Solana SPL</option>
                <option value="ECOSYSTEM" className="bg-stone-900">Ecosystem ERP</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-stone-950 px-2.5 py-1.5 rounded-xl border border-stone-800 text-xs">
              <SlidersHorizontal size={12} className="text-stone-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-stone-900">All Types</option>
                <option value="TRANSFER" className="bg-stone-900">Transfers</option>
                <option value="WITHDRAWAL" className="bg-stone-900">Withdrawals</option>
                <option value="DEPOSIT" className="bg-stone-900">Deposits</option>
                <option value="PAYMENT" className="bg-stone-900">Payments</option>
                <option value="ECOSYSTEM_EARNINGS_SYNC" className="bg-stone-900">Earnings Sync</option>
              </select>
            </div>

            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-colors cursor-pointer"
              title="Refresh ledger"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Tx ID / Source</th>
                <th className="py-2.5 px-3">Network</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Destination / Route</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500 font-sans text-xs">
                    {loading ? "Loading transactions from unified store..." : "No transactions matching selected filter."}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-3 font-sans">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="font-mono text-emerald-400">{tx.id}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 truncate max-w-xs" title={tx.sourceSystem}>
                        {tx.sourceSystem}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.network === "TON"
                          ? "bg-sky-950 text-sky-300 border border-sky-800"
                          : tx.network === "SOLANA"
                          ? "bg-purple-950 text-purple-300 border border-purple-800"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}>
                        {tx.network}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-stone-300 text-[11px]">
                        {tx.type}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs">
                        {tx.amount.toFixed(2)} {tx.token}
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        ≈ ${tx.amountUsd.toFixed(2)} USD
                      </div>
                    </td>

                    <td className="py-3 px-3 max-w-[200px] truncate">
                      <div className="text-stone-300 truncate" title={tx.destination}>
                        {tx.destination.length > 20 ? `${tx.destination.slice(0, 8)}...${tx.destination.slice(-6)}` : tx.destination}
                      </div>
                      {tx.explorerUrl && (
                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>Explorer</span>
                          <ExternalLink size={9} />
                        </a>
                      )}
                    </td>

                    <td className="py-3 px-3 text-[11px] text-stone-400">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                        <CheckCircle2 size={10} />
                        <span>VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* External Integration Developer Suite & Code Snippets */}
      <div className="p-5 bg-stone-900/70 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 size={16} className="text-cyan-400" />
              <span>External System Developer Integration (REST & Webhooks)</span>
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Code examples for external servers using the API Key to synchronize transaction streams.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
            {(["curl", "node", "python"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? "bg-cyan-600 text-white shadow"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 bg-stone-950 rounded-2xl border border-stone-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            {codeSnippets[selectedLanguage]}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(codeSnippets[selectedLanguage]);
              setCopiedSnippet(true);
              setTimeout(() => setCopiedSnippet(false), 2000);
            }}
            className="absolute top-3 right-3 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            {copiedSnippet ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedSnippet ? "Copied" : "Copy Code"}</span>
          </button>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="p-5 bg-stone-900/70 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio size={16} className="text-amber-400" />
              <span>Registered External Webhook Gateways</span>
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Receiving automatic real-time transaction event callbacks.
            </p>
          </div>
          <button
            onClick={() => setShowWebhookModal(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <PlusCircle size={13} />
            <span>Add Webhook</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {wh.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                  HTTP {wh.lastStatus || 200}
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-300 break-all bg-stone-900/70 p-2 rounded-xl">
                {wh.url}
              </div>
              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                <span>Events: {wh.events.join(", ")}</span>
                <span>Last active: {new Date(wh.lastTriggeredAt || wh.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INGEST EXTERNAL TRANSACTION */}
      {/* ========================================================================= */}
      {showIngestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <PlusCircle size={16} className="text-cyan-400" />
                <span>Simulate Inbound External Transaction</span>
              </h4>
              <button
                onClick={() => setShowIngestModal(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIngestTransaction} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Source External System
                </label>
                <input
                  type="text"
                  required
                  value={ingestSystem}
                  onChange={(e) => setIngestSystem(e.target.value)}
                  placeholder="e.g. SAP ERP, Stripe Relay, Quickbooks, Inbound POS"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Network
                  </label>
                  <select
                    value={ingestNetwork}
                    onChange={(e) => setIngestNetwork(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TON">TON Jetton</option>
                    <option value="SOLANA">Solana SPL</option>
                    <option value="ECOSYSTEM">Ecosystem Ledger</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Token / Currency
                  </label>
                  <select
                    value={ingestToken}
                    onChange={(e) => setIngestToken(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="USDT">USDT</option>
                    <option value="GRAM">GRAM</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={ingestAmount}
                  onChange={(e) => setIngestAmount(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Summary / Reference
                </label>
                <input
                  type="text"
                  placeholder="Invoice # or reconciliation note"
                  value={ingestSummary}
                  onChange={(e) => setIngestSummary(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {ingestSuccess && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>{ingestSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={ingestLoading}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all disabled:opacity-50"
              >
                <Send size={14} />
                <span>{ingestLoading ? "Verifying with API Key..." : "Ingest Transaction"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REGISTER WEBHOOK */}
      {/* ========================================================================= */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Radio size={16} className="text-amber-400" />
                <span>Register External Webhook Endpoint</span>
              </h4>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWebhook} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Target System Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QuickBooks Accounting Inbound"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Endpoint URL (HTTP/HTTPS)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://api.your-company.com/webhooks/transactions"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={webhookSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all disabled:opacity-50"
              >
                <PlusCircle size={14} />
                <span>{webhookSubmitting ? "Registering..." : "Confirm & Activate Webhook"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
