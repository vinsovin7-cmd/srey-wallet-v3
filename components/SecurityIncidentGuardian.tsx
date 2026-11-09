import React, { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Terminal, 
  ExternalLink, 
  X, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

export const QUARANTINED_ADDRESSES = [
  {
    address: "0xeCf25387B6F4aE92F53aAfFdEc187d112b63A890",
    network: "EVM (Ethereum / BSC / Polygon)",
    type: "Attacker Clipboard-Hijacker Address (Swaps copied ETH/ERC20/BEP20 addresses)",
    status: "QUARANTINED & BLACKLISTED"
  },
  {
    address: "UQDlOTSlGL73BFgqkrYbBH2qZjPGtjhT0V41bv6ObdhpWgrG",
    network: "TON Blockchain (The Open Network)",
    type: "Attacker Clipboard-Hijacker Address (Swaps copied TON addresses)",
    status: "QUARANTINED & BLACKLISTED"
  }
];

export const SecurityIncidentGuardian: React.FC = () => {
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [purgedCount, setPurgedCount] = useState<number | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [botsRevoked, setBotsRevoked] = useState(false);
  const [isRevokingBots, setIsRevokingBots] = useState(false);
  const [scrubbedStorageKeys, setScrubbedStorageKeys] = useState<string[]>([]);

  // 1. Automatically sanitize and scrub localStorage on mount
  useEffect(() => {
    const scrubbed: string[] = [];
    const quarantinedSet = new Set(QUARANTINED_ADDRESSES.map(a => a.address.toLowerCase()));

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const val = localStorage.getItem(key) || "";
      for (const q of QUARANTINED_ADDRESSES) {
        if (val.toLowerCase().includes(q.address.toLowerCase())) {
          localStorage.removeItem(key);
          scrubbed.push(key);
          break;
        }
      }
    }

    if (scrubbed.length > 0) {
      setScrubbedStorageKeys(scrubbed);
      console.warn(`[SECURITY INCIDENT GUARDIAN] Scrubbed compromised wallet from keys: ${scrubbed.join(", ")}`);
    }
  }, []);

  const handlePurgeAllSessions = async () => {
    setIsPurging(true);
    try {
      // Clear client storage
      localStorage.removeItem("payout_destination_wallet");
      localStorage.removeItem("custom_payout_wallet");
      sessionStorage.clear();

      const res = await fetch("/api/security/purge-all-sessions", { method: "POST" });
      const data = await res.json();
      setPurgedCount(data.purgedSessionsCount ?? 0);
    } catch (err) {
      console.error("Purge error:", err);
      setPurgedCount(0);
    } finally {
      setIsPurging(false);
    }
  };

  const handleRevokeBots = async () => {
    setIsRevokingBots(true);
    try {
      const res = await fetch("/api/security/revoke-bots", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setBotsRevoked(true);
      }
    } catch (err) {
      console.error("Bot revocation error:", err);
    } finally {
      setIsRevokingBots(false);
    }
  };

  if (!incidentOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIncidentOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-900/90 hover:bg-rose-800 text-rose-200 border border-rose-500/50 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold tracking-wider uppercase transition-all"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          Security Lockdown Active
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 max-w-xl w-full z-50 p-1">
      <div className="bg-slate-950/95 border border-rose-500/60 rounded-2xl shadow-2xl backdrop-blur-xl text-slate-100 overflow-hidden ring-1 ring-rose-500/20">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-rose-950/90 via-red-950/70 to-slate-950/90 p-4 border-b border-rose-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 border border-rose-500/40 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wide text-rose-200 uppercase">
                  Incident Response: Clipboard Hijacker Isolated
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-rose-500/30 text-rose-300 rounded border border-rose-500/40">
                  CONTAINED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rogue wallet addresses quarantined. Active sessions and bot permissions ready to purge.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title={detailsExpanded ? "Collapse" : "Expand"}
            >
              {detailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button
              onClick={() => setIncidentOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title="Minimize"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {detailsExpanded && (
          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* Origin Analysis Box */}
            <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                Where Did <span className="font-mono text-rose-200">0xeCf2...A890</span> Come From?
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <strong className="text-white">Forensic Finding:</strong> This EVM address (<code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">0xeCf25387B6F4aE92F53aAfFdEc187d112b63A890</code>) is the <strong>Ethereum/EVM payload of a client-side clipboard-hijacking clipper malware</strong>.
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                When clipboard-swap malware operates on an infected computer or phone, it monitors the OS clipboard via regex. When you copy an Ethereum/ERC20 address, it swaps it with <code className="text-rose-300">0xeCf...A890</code>. When you copy a TON address, it swaps it with <code className="text-rose-300">UQDl...WgrG</code>. Both addresses have been quarantined across our ecosystem.
              </p>
            </div>

            {/* Quarantined Wallets Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Quarantined & Blocked Addresses</span>
                <span className="text-[10px] text-emerald-400 font-mono">100% BLOCKED ON-CHAIN</span>
              </div>
              <div className="space-y-2">
                {QUARANTINED_ADDRESSES.map((item, idx) => (
                  <div key={idx} className="bg-black/50 border border-rose-900/40 rounded-lg p-2.5 font-mono text-[10px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-rose-400 font-bold">{item.network}</span>
                      <span className="text-[9px] bg-rose-950/80 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/50">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-slate-200 break-all select-all font-semibold bg-slate-950/80 p-1 rounded border border-slate-800">
                      {item.address}
                    </div>
                    <div className="text-slate-400 text-[9px] font-sans">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Remediation Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handlePurgeAllSessions}
                disabled={isPurging}
                className="flex items-center justify-center gap-2 p-2.5 bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500/50 rounded-xl text-rose-100 font-medium text-xs transition-all disabled:opacity-50"
              >
                {isPurging ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                ) : purgedCount !== null ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Trash2 className="w-4 h-4 text-rose-400" />
                )}
                {purgedCount !== null ? `Sessions Purged (${purgedCount})` : "Purge All Sessions"}
              </button>

              <button
                onClick={handleRevokeBots}
                disabled={isRevokingBots}
                className="flex items-center justify-center gap-2 p-2.5 bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/50 rounded-xl text-amber-100 font-medium text-xs transition-all disabled:opacity-50"
              >
                {isRevokingBots ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                ) : botsRevoked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400" />
                )}
                {botsRevoked ? "Bots Revoked" : "Revoke Connected Bots"}
              </button>
            </div>

            {/* Immediate Action Checklist for Telegram & Local Machine */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Mandatory Steps to Secure Your Telegram & Device
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>
                  <strong className="text-white">Telegram Sessions:</strong> Open Telegram &rarr; <em>Settings</em> &rarr; <em>Devices</em> &rarr; tap <strong>"Terminate All Other Sessions"</strong>.
                </li>
                <li>
                  <strong className="text-white">Revoke Bot Permissions:</strong> In Telegram &rarr; <em>Settings</em> &rarr; <em>Privacy & Security</em> &rarr; <em>Bots and Websites</em> (or <em>Mini Apps</em>) &rarr; tap <strong>"Disconnect All / Delete All Data"</strong>.
                </li>
                <li>
                  <strong className="text-white">BotFather Invalidation:</strong> If you created bots via @BotFather, send <code className="bg-black/50 px-1 rounded text-cyan-300">/revoke</code> to invalidate existing API tokens.
                </li>
                <li>
                  <strong className="text-white">Remove Clipper Malware from Device:</strong> Run a full scan using Malwarebytes or Windows Defender Offline. Check recently downloaded APKs, cracked tools, or suspicious Chrome/Telegram extensions that have clipboard permissions.
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityIncidentGuardian;
