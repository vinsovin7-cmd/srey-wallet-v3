import React, { useState, useEffect } from "react";
import {
  Download,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Mail,
  Send,
  Search,
  Shield,
  Layers,
  Plus,
  Trash2,
  ExternalLink,
  Bot,
  Terminal,
  Cpu,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  AppWindow,
  Smartphone,
  Check,
  Grid
} from "lucide-react";
import { WebsiteToAppConverter } from "./WebsiteToAppConverter";
import { AdsGramTonPayoutSuite } from "./AdsGramTonPayoutSuite";

export interface InstalledApp {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  version: string;
  embedUrl?: string;
  type: "internal_suite" | "custom_embed";
  internalTabKey?: string;
  isInstalled: boolean;
  installedAt?: string;
}

const DEFAULT_ECOSYSTEM_APPS: InstalledApp[] = [
  {
    id: "app-webtoapp",
    name: "Convert Website to App (Google Play)",
    category: "Android & Monetization",
    icon: "📱",
    description: "Convert websites into Android apps with AdMob monetization, offline support, push notifications, and export APK & Android Studio ZIP.",
    version: "v3.6.2",
    type: "internal_suite",
    internalTabKey: "web_to_app",
    isInstalled: true,
    installedAt: "2026-09-19"
  },
  {
    id: "app-adsgram-ton",
    name: "AdsGram & TON Micro-Payout Studio",
    category: "Finance & Monetization",
    icon: "💎",
    description: "AdsGram SDK mini-app with TON Connect, 80/20 revenue split, 0.1% transaction fee, and automated USDT micro-payouts.",
    version: "v4.0",
    type: "internal_suite",
    internalTabKey: "adsgram_ton",
    isInstalled: true,
    installedAt: "2026-09-19"
  },
  {
    id: "app-mechat",
    name: "MeChat Global Matchmaker",
    category: "Social & Dating",
    icon: "🔥",
    description: "Global 5-second fast matchmaking across Phnom Penh, Sihanoukville, Thailand, Vietnam, Nigeria & Telegram channels.",
    version: "v4.2",
    type: "internal_suite",
    internalTabKey: "mechat",
    isInstalled: true,
    installedAt: "2026-09-17"
  },
  {
    id: "app-mailcom",
    name: "Mail.com Webmail & AI Studio",
    category: "Productivity & AI",
    icon: "✉️",
    description: "Fully interactive Mail.com inbox, compose editor, drafts, trash, and Multi Sreymara AI assistant.",
    version: "v3.8",
    type: "internal_suite",
    internalTabKey: "mail_ai",
    isInstalled: true,
    installedAt: "2026-09-17"
  },
  {
    id: "app-videogram",
    name: "Sreymara Videogram & Telegram",
    category: "Communication",
    icon: "📡",
    description: "In-ecosystem Telegram Web client, video messaging, and global group ingestion bridge.",
    version: "v2.5",
    type: "internal_suite",
    internalTabKey: "telegram_auth",
    isInstalled: true,
    installedAt: "2026-09-17"
  },
  {
    id: "app-truthfinder",
    name: "TruthFinder OSINT Intelligence",
    category: "Security & OSINT",
    icon: "🔍",
    description: "Public records search, email verification, state permits, and identity dossier generator.",
    version: "v1.9",
    type: "internal_suite",
    internalTabKey: "truthfinder",
    isInstalled: true,
    installedAt: "2026-09-17"
  },
  {
    id: "app-expressvpn",
    name: "ExpressVPN US Proxy Web Browser",
    category: "Security & Web",
    icon: "🌐",
    description: "Secure US East Atlanta proxy browser for unrestricted web access inside the ecosystem.",
    version: "v5.0",
    type: "internal_suite",
    internalTabKey: "browser",
    isInstalled: false
  },
  {
    id: "app-solscan",
    name: "Solscan Solana Fast Relay",
    category: "Blockchain & DeFi",
    icon: "⚡",
    description: "Live Solana SPL-USDT token tracking, transaction explorer, and wallet balance inspector.",
    version: "v2.1",
    type: "internal_suite",
    internalTabKey: "solscan",
    isInstalled: true,
    installedAt: "2026-09-17"
  },
  {
    id: "app-tonwallet",
    name: "TON Quantum Treasury Wallet",
    category: "Finance & Crypto",
    icon: "💎",
    description: "Phantom & Telegram @Wallet yield tracking with automatic 20% user dividend distribution.",
    version: "v3.0",
    type: "internal_suite",
    internalTabKey: "ton_wallet",
    isInstalled: false
  }
];

interface SreymaraAppzInstallerProps {
  onLaunchApp?: (app: InstalledApp) => void;
  onClose?: () => void;
}

export const SreymaraAppzInstaller: React.FC<SreymaraAppzInstallerProps> = ({
  onLaunchApp,
  onClose
}) => {
  const [apps, setApps] = useState<InstalledApp[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sreymara_appz_installed_apps");
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return DEFAULT_ECOSYSTEM_APPS;
  });

  const [activeApp, setActiveApp] = useState<InstalledApp | null>(null);
  const [customAppName, setCustomAppName] = useState("");
  const [customAppUrl, setCustomAppUrl] = useState("");
  const [customAppIcon, setCustomAppIcon] = useState("🚀");
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [installFeedback, setInstallFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("sreymara_appz_installed_apps", JSON.stringify(apps));
    } catch (e) {
      console.warn(e);
    }
  }, [apps]);

  const handleInstallToggle = (id: string) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const nextState = !app.isInstalled;
          if (nextState) {
            setInstallFeedback(`Installed "${app.name}" into sreymara APPZ!`);
          } else {
            setInstallFeedback(`Uninstalled "${app.name}" from sreymara APPZ.`);
          }
          setTimeout(() => setInstallFeedback(null), 2500);
          return {
            ...app,
            isInstalled: nextState,
            installedAt: nextState ? new Date().toISOString().slice(0, 10) : undefined
          };
        }
        return app;
      })
    );
  };

  const handleAddCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAppName.trim() || !customAppUrl.trim()) return;

    let formattedUrl = customAppUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    const newApp: InstalledApp = {
      id: `custom-app-${Date.now()}`,
      name: customAppName.trim(),
      category: "Custom Web App",
      icon: customAppIcon || "🚀",
      description: "Custom web app package installed into sreymara APPZ ecosystem.",
      version: "v1.0",
      embedUrl: formattedUrl,
      type: "custom_embed",
      isInstalled: true,
      installedAt: new Date().toISOString().slice(0, 10)
    };

    setApps((prev) => [newApp, ...prev]);
    setCustomAppName("");
    setCustomAppUrl("");
    setShowAddCustomModal(false);
    setInstallFeedback(`Successfully installed custom app "${newApp.name}"!`);
    setTimeout(() => setInstallFeedback(null), 3000);
  };

  const handleLaunch = (app: InstalledApp) => {
    setActiveApp(app);
    if (onLaunchApp) {
      onLaunchApp(app);
    }
  };

  const installedList = apps.filter((a) => a.isInstalled);

  return (
    <div className="w-full bg-[#080312] text-stone-100 rounded-3xl border border-purple-900/80 shadow-2xl overflow-hidden my-4">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-[#0d051f] via-[#14082e] to-[#0d051f] px-6 py-4 border-b border-purple-900/60 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#0d051f] rounded-[14px] flex items-center justify-center text-xl font-bold">
              📱
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black text-lg text-white tracking-wide">
                sreymara APPZ
              </h2>
              <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-purple-600 text-stone-950 font-mono font-black text-[10px] rounded-full uppercase shadow">
                In-Ecosystem Installer
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Install and run apps directly inside our ecosystem window without opening outside tabs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCustomModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Install Custom Web App</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {installFeedback && (
        <div className="mx-6 mt-4 p-3 bg-emerald-950/80 border border-emerald-500/80 rounded-2xl text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{installFeedback}</span>
        </div>
      )}

      {/* EMBEDDED RUNNING APP CONTAINER (WHEN LAUNCHED) */}
      {activeApp ? (
        <div className="p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between p-3 bg-[#110726] rounded-2xl border border-purple-800/60 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeApp.icon}</span>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{activeApp.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px] font-mono border border-emerald-700">
                    RUNNING IN ECOSYSTEM
                  </span>
                </h3>
                <p className="text-[11px] text-stone-400">{activeApp.description}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveApp(null)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl text-xs font-bold border border-stone-700 transition-all cursor-pointer flex items-center gap-1"
            >
              <X size={14} />
              <span>Close App & Back to Dock</span>
            </button>
          </div>

          <div className="w-full h-[700px] rounded-2xl border border-purple-900/80 overflow-hidden bg-black relative shadow-2xl">
            {activeApp.internalTabKey === "web_to_app" ? (
              <div className="w-full h-full overflow-y-auto p-2 bg-[#07090e]">
                <WebsiteToAppConverter onClose={() => setActiveApp(null)} />
              </div>
            ) : activeApp.internalTabKey === "adsgram_ton" ? (
              <div className="w-full h-full overflow-y-auto p-2 bg-[#07090e]">
                <AdsGramTonPayoutSuite onClose={() => setActiveApp(null)} />
              </div>
            ) : activeApp.type === "custom_embed" && activeApp.embedUrl ? (
              <iframe
                src={activeApp.embedUrl}
                title={activeApp.name}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#0e0621] to-[#070312] space-y-4">
                <span className="text-5xl">{activeApp.icon}</span>
                <h3 className="text-xl font-bold text-purple-200">{activeApp.name} ({activeApp.version})</h3>
                <p className="text-xs text-stone-400 max-w-md">
                  This core ecosystem app is active inside sreymara APPZ. Use the top navigation tabs to interact with its live controls.
                </p>
                <button
                  onClick={() => setActiveApp(null)}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                >
                  Return to sreymara APPZ Ecosystem Store
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MAIN APP STORE & INSTALLED DOCK VIEW */
        <div className="p-6 space-y-8">
          {/* SECTION 1: INSTALLED APPS DOCK ("sreymara APPZ") */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-purple-200 uppercase tracking-wider flex items-center gap-2">
                <Grid size={16} className="text-amber-400" />
                <span>INSTALLED IN SREYMARA APPZ ({installedList.length})</span>
              </h3>
              <span className="text-xs text-stone-500 font-mono">
                Click any app to run directly inside the ecosystem
              </span>
            </div>

            {installedList.length === 0 ? (
              <div className="p-8 text-center bg-[#0d051f]/50 rounded-2xl border border-dashed border-purple-900/60 text-stone-400 text-xs">
                No apps installed yet. Browse the Ecosystem Directory below to install apps into sreymara APPZ.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {installedList.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-gradient-to-b from-[#110729] to-[#0a0418] rounded-2xl border border-purple-800/60 hover:border-amber-500/60 transition-all shadow-xl flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl group-hover:scale-110 transition-transform">{app.icon}</span>
                        <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 rounded text-[9px] font-mono font-bold">
                          INSTALLED
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                          {app.name}
                        </h4>
                        <p className="text-[10px] text-purple-300/80 font-mono">{app.category} • {app.version}</p>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                        {app.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLaunch(app)}
                        className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-stone-950 font-black rounded-xl text-xs transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Play size={13} />
                        <span>Open in Ecosystem</span>
                      </button>

                      <button
                        onClick={() => handleInstallToggle(app.id)}
                        className="p-2 text-stone-400 hover:text-red-400 bg-black/40 hover:bg-red-950/60 rounded-xl transition-all cursor-pointer"
                        title="Remove from sreymara APPZ"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: ECOSYSTEM APP STORE DIRECTORY */}
          <div className="space-y-4 pt-4 border-t border-purple-900/60">
            <h3 className="font-serif font-bold text-sm text-stone-300 uppercase tracking-wider flex items-center gap-2">
              <Download size={16} className="text-cyan-400" />
              <span>ECOSYSTEM APP DIRECTORY</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-[#0d051f]/80 rounded-2xl border border-purple-950 hover:border-purple-800 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl shrink-0">{app.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-stone-100 flex items-center gap-1.5">
                        <span>{app.name}</span>
                        <span className="text-[9px] font-mono text-stone-500">{app.version}</span>
                      </h4>
                      <p className="text-[10px] text-stone-400 line-clamp-1">{app.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInstallToggle(app.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                      app.isInstalled
                        ? "bg-stone-900 text-stone-400 border border-stone-800 hover:text-red-300"
                        : "bg-purple-900 hover:bg-purple-800 text-purple-100 border border-purple-600 shadow"
                    }`}
                  >
                    {app.isInstalled ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span>Installed</span>
                      </>
                    ) : (
                      <>
                        <Download size={12} />
                        <span>Install</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM APP INSTALL MODAL */}
      {showAddCustomModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0621] border border-purple-600/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-purple-900/80 pb-3">
              <h3 className="font-bold text-sm text-purple-200 flex items-center gap-2">
                <Plus size={16} className="text-amber-400" />
                <span>Install Custom App into sreymara APPZ</span>
              </h3>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomApp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-stone-300">App Icon (Emoji)</label>
                <input
                  type="text"
                  value={customAppIcon}
                  onChange={(e) => setCustomAppIcon(e.target.value)}
                  maxLength={2}
                  className="w-20 px-3 py-2 bg-black border border-purple-900 rounded-xl text-center text-lg focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-300">App Name</label>
                <input
                  type="text"
                  required
                  value={customAppName}
                  onChange={(e) => setCustomAppName(e.target.value)}
                  placeholder="e.g. My Telegram Bot Dashboard"
                  className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-300">Web App / Embed URL</label>
                <input
                  type="url"
                  required
                  value={customAppUrl}
                  onChange={(e) => setCustomAppUrl(e.target.value)}
                  placeholder="https://example.com/myapp"
                  className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  Will embed and run seamlessly inside sreymara APPZ container.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-purple-900/60">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 bg-stone-900 text-stone-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-stone-950 font-black rounded-xl shadow cursor-pointer"
                >
                  Install into sreymara APPZ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
