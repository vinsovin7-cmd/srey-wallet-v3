import React, { useState, useEffect, useRef } from "react";
import { FranzIsolatedWebview } from "./FranzIsolatedWebview";
import { FranzRewardsCenterModal, FranzRewardLedgerEntry } from "./FranzRewardsCenterModal";
import { OneKeyApp } from "./OneKeyApp";
import {
  ALL_FRANZ_SERVICES,
  INITIAL_USER_INSTANCES,
  FranzServiceDefinition,
  ActiveFranzInstance
} from "../src/data/franzCatalog";
import {
  Plus,
  Settings,
  Grid,
  Bell,
  BellOff,
  CheckSquare,
  Search,
  RefreshCw,
  Code,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  Star,
  User,
  Coins,
  ArrowRightLeft,
  Wallet,
  Users,
  Power,
  Trash2,
  Globe,
  Lock,
  FolderOpen,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Shield,
  Layers,
  Terminal,
  Database,
  Cpu,
  ArrowRight,
  MessageSquare,
  Share2,
  Sliders,
  Compass,
  Monitor
} from "lucide-react";

export interface FranzMultiMessengerWrapperProps {
  onCloseToMain?: () => void;
  isStandalone?: boolean;
}

export const FranzMultiMessengerWrapper: React.FC<FranzMultiMessengerWrapperProps> = ({
  onCloseToMain,
  isStandalone = false
}) => {
  // 1. Persistent User Instances & Settings
  const [instances, setInstances] = useState<ActiveFranzInstance[]>(() => {
    try {
      const saved = localStorage.getItem("alphaqubit_franz_instances");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load Franz instances from storage:", e);
    }
    return INITIAL_USER_INSTANCES;
  });

  const [activeInstanceId, setActiveInstanceId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("alphaqubit_franz_active_instance");
      if (saved && INITIAL_USER_INSTANCES.some(i => i.instanceId === saved)) {
        return saved;
      }
    } catch {}
    return INITIAL_USER_INSTANCES[0]?.instanceId || "inst-chatgpt-1";
  });

  // Workspaces State
  const [workspaces, setWorkspaces] = useState<string[]>([
    "all",
    "private",
    "office",
    "support"
  ]);
  const [activeWorkspace, setActiveWorkspace] = useState<string>("all");

  // Owner Mode State (Owner administration bypasses all subscription & wait limits)
  const [isOwnerBypassActive, setIsOwnerBypassActive] = useState<boolean>(true);
  const [showWaitScreenTest, setShowWaitScreenTest] = useState<boolean>(false);
  const [waitTimerSeconds, setWaitTimerSeconds] = useState<number>(0);

  // Modal / Drawer State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<
    "available" | "your_services" | "workspaces" | "account" | "team" | "settings" | "custom_recipes" | "invite"
  >("available");
  const [catalogSubTab, setCatalogSubTab] = useState<"popular" | "all" | "custom">("popular");
  const [catalogSearch, setCatalogSearch] = useState<string>("");
  const [yourServicesSearch, setYourServicesSearch] = useState<string>("");

  // DevTools Panel State for active webview
  const [isDevToolsOpen, setIsDevToolsOpen] = useState<boolean>(false);
  const [devToolsTab, setDevToolsTab] = useState<"console" | "network" | "storage" | "elements">("console");
  const [devLogs, setDevLogs] = useState<Array<{ type: "log" | "info" | "warn" | "error"; text: string; time: string }>>([
    { type: "info", text: "Franz Webview Engine v5.11.0 Initialized (Isolated Sandbox Container)", time: "06:40:01" },
    { type: "log", text: "Session Partition loaded: persist:sandbox_partition", time: "06:40:02" },
    { type: "log", text: "Content Security Policy: frame-ancestors unrestricted in sandboxed iframe", time: "06:40:03" },
    { type: "info", text: "Owner administration account: KANSAS NELLY (Unlimited features unlocked)", time: "06:40:04" }
  ]);
  const [evalInput, setEvalInput] = useState<string>("");

  // Custom Service / Website Creation Form
  const [newCustomName, setNewCustomName] = useState<string>("");
  const [newCustomUrl, setNewCustomUrl] = useState<string>("https://earnings.ink");
  const [newCustomWorkspace, setNewCustomWorkspace] = useState<string>("office");
  const [newCustomIcon, setNewCustomIcon] = useState<string>("globe");

  // General App Settings (matching screenshot 2 & 3)
  const [settingsState, setSettingsState] = useState({
    launchOnStart: true,
    keepInBackground: true,
    showInTray: true,
    minimizeToTray: false,
    keepWorkspacesLoaded: true,
    displayDisabledTabs: true,
    showUnreadBadge: true,
    joinDarkSide: true,
    language: "English",
    spellChecking: true,
    enableGPU: true,
    includeBeta: true,
    cacheSize: "1.91 GB"
  });

  // Webview iframe reload key
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isNotificationsMuted, setIsNotificationsMuted] = useState<boolean>(false);
  const [proxyMode, setProxyMode] = useState<boolean>(false);

  // Rewards Management Engine State & Activity Tracking
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState<boolean>(false);
  const [isOneKeyModalOpen, setIsOneKeyModalOpen] = useState<boolean>(false);
  const [rewardsState, setRewardsState] = useState<{
    batBalance: number;
    usdtBalance: number;
    usdtRate: number;
    equivalentUsdt: number;
    totalBatEarned: number;
    lifetimeActivities: number;
    unreadCount: number;
    ledger: FranzRewardLedgerEntry[];
  }>({
    batBalance: 19.50,
    usdtBalance: 1.80,
    usdtRate: 0.2485,
    equivalentUsdt: 4.84,
    totalBatEarned: 26.75,
    lifetimeActivities: 45,
    unreadCount: 1,
    ledger: []
  });

  // Fetch Rewards Balance from Backend
  const fetchRewards = async () => {
    try {
      const res = await fetch("/api/franz/rewards/balance");
      const data = await res.json();
      if (data.success) {
        setRewardsState({
          batBalance: data.batBalance,
          usdtBalance: data.usdtBalance,
          usdtRate: data.usdtRate,
          equivalentUsdt: data.equivalentUsdt,
          totalBatEarned: data.totalBatEarned,
          lifetimeActivities: data.lifetimeActivities,
          unreadCount: data.unreadCount,
          ledger: data.ledger || []
        });
      }
    } catch {}
  };

  useEffect(() => {
    fetchRewards();
    const interval = setInterval(fetchRewards, 12000);
    return () => clearInterval(interval);
  }, []);

  // Track Action in Backend silently (NO annoying screen toast!)
  const handleTrackActivity = async (action: string, metadata?: any) => {
    try {
      const res = await fetch("/api/franz/rewards/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, serviceId: activeInstanceId, metadata })
      });
      const data = await res.json();
      if (data.success) {
        setRewardsState(prev => ({
          ...prev,
          batBalance: data.batBalance,
          usdtBalance: data.usdtBalance,
          totalBatEarned: data.totalBatEarned,
          unreadCount: data.unreadCount,
          ledger: [data.entry, ...(prev.ledger || [])]
        }));
      }
    } catch {}
  };

  // Mark all notifications as read in ledger
  const handleMarkNotificationsRead = async () => {
    try {
      await fetch("/api/franz/rewards/notifications/mark-read", { method: "POST" });
      setRewardsState(prev => ({
        ...prev,
        unreadCount: 0,
        ledger: prev.ledger.map(l => ({ ...l, read: true }))
      }));
    } catch {}
  };

  // Sync instances to localStorage & backend
  useEffect(() => {
    try {
      localStorage.setItem("alphaqubit_franz_instances", JSON.stringify(instances));
      localStorage.setItem("alphaqubit_franz_active_instance", activeInstanceId);
      // Background sync to backend API
      fetch("/api/franz/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: instances, workspaces, settings: settingsState })
      }).catch(() => {});
    } catch {}
  }, [instances, activeInstanceId, workspaces, settingsState]);

  // Current active instance
  const currentInstance = instances.find(i => i.instanceId === activeInstanceId) || instances[0];
  const currentDef = ALL_FRANZ_SERVICES.find(s => s.id === currentInstance?.serviceId) || {
    id: "custom",
    name: currentInstance?.name || "Service",
    category: "custom" as const,
    defaultUrl: currentInstance?.url || "https://earnings.ink",
    iconType: "custom-website",
    brandColor: "#0088ff",
    description: "Web application container"
  };

  // Filtered instances by active workspace
  const visibleInstances = instances.filter(inst => {
    if (!settingsState.displayDisabledTabs && !inst.isEnabled) return false;
    if (activeWorkspace === "all") return true;
    return inst.workspace === activeWorkspace;
  });

  // Switch active service
  const handleSelectInstance = (id: string) => {
    setActiveInstanceId(id);
    setIframeKey(Date.now());
    // Add log to DevTools & track activity
    const target = instances.find(i => i.instanceId === id);
    if (target) {
      handleTrackActivity("service_switch", {
        serviceName: target.name,
        partition: target.sessionPartition,
        serviceId: target.serviceId
      });
      setDevLogs(prev => [
        ...prev.slice(-30),
        {
          type: "info",
          text: `Switched partition to: ${target.sessionPartition} (${target.name})`,
          time: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  // Add new service from catalog
  const handleAddService = (def: FranzServiceDefinition, customName?: string, customUrl?: string) => {
    const newId = `inst-${def.id}-${Date.now().toString(36)}`;
    const newInstance: ActiveFranzInstance = {
      instanceId: newId,
      serviceId: def.id,
      name: customName || def.name,
      url: customUrl || def.defaultUrl,
      badge: 0,
      isEnabled: true,
      isMuted: false,
      workspace: activeWorkspace === "all" ? "office" : activeWorkspace,
      zoomFactor: 1.0,
      sessionPartition: `persist:${def.id}_${Date.now()}`,
      order: instances.length
    };

    setInstances(prev => [...prev, newInstance]);
    setActiveInstanceId(newId);
    setIsModalOpen(false);

    handleTrackActivity("account_paired", {
      serviceName: newInstance.name,
      partition: newInstance.sessionPartition,
      serviceId: newInstance.serviceId
    });
  };

  // Toggle instance enabled state
  const handleToggleInstance = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInstances(prev =>
      prev.map(item =>
        item.instanceId === id ? { ...item, isEnabled: !item.isEnabled } : item
      )
    );
  };

  // Delete instance
  const handleDeleteInstance = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInstances(prev => {
      const filtered = prev.filter(item => item.instanceId !== id);
      if (activeInstanceId === id && filtered.length > 0) {
        setActiveInstanceId(filtered[0].instanceId);
      }
      return filtered;
    });
  };

  // Execute DevTools Console input
  const handleRunConsoleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalInput.trim()) return;
    const cmd = evalInput.trim();
    setDevLogs(prev => [
      ...prev,
      { type: "log", text: `> ${cmd}`, time: new Date().toLocaleTimeString() }
    ]);
    try {
      if (cmd.toLowerCase() === "clear") {
        setDevLogs([]);
      } else if (cmd.toLowerCase() === "help") {
        setDevLogs(prev => [
          ...prev,
          {
            type: "info",
            text: "Available commands: clear, reload, zoom(factor), info, partition, cookies, bypass",
            time: new Date().toLocaleTimeString()
          }
        ]);
      } else if (cmd.toLowerCase() === "reload") {
        setIframeKey(Date.now());
        setDevLogs(prev => [
          ...prev,
          { type: "info", text: "Container reload triggered.", time: new Date().toLocaleTimeString() }
        ]);
      } else if (cmd.toLowerCase() === "info") {
        setDevLogs(prev => [
          ...prev,
          {
            type: "info",
            text: `Active Service: ${currentInstance.name} | URL: ${currentInstance.url} | Partition: ${currentInstance.sessionPartition}`,
            time: new Date().toLocaleTimeString()
          }
        ]);
      } else if (cmd.toLowerCase() === "bypass") {
        setIsOwnerBypassActive(true);
        setShowWaitScreenTest(false);
        setDevLogs(prev => [
          ...prev,
          { type: "info", text: "Owner level bypass activated for all services.", time: new Date().toLocaleTimeString() }
        ]);
      } else {
        setDevLogs(prev => [
          ...prev,
          {
            type: "info",
            text: `Evaluated expression [${cmd}]: Isolated Partition scope executed safely.`,
            time: new Date().toLocaleTimeString()
          }
        ]);
      }
    } catch (err: any) {
      setDevLogs(prev => [
        ...prev,
        { type: "error", text: `Error: ${err?.message}`, time: new Date().toLocaleTimeString() }
      ]);
    }
    setEvalInput("");
  };

  // Helper to render icon for any service
  const renderServiceIcon = (iconType: string, className: string = "w-6 h-6", name?: string) => {
    switch (iconType) {
      case "whatsapp":
        return (
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.997.545 1.764.834 2.8.835h.005c3.182 0 5.768-2.586 5.769-5.766.001-3.182-2.585-5.77-5.77-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-1.996-.466-1.503-.623-2.483-2.158-2.56-2.258-.076-.101-.611-.814-.611-1.554 0-.74.385-1.103.522-1.252.137-.149.3-.187.4-.187.1 0 .2 0 .288.005.093.004.218-.035.341.261.127.306.435 1.06.474 1.137.039.077.065.168.013.269-.052.101-.078.163-.156.253-.078.09-.164.201-.235.27-.078.077-.16.16-.068.318.092.158.408.673.875 1.09.601.536 1.108.702 1.266.78.158.078.251.066.345-.043.094-.109.404-.471.512-.632.109-.161.218-.135.367-.08.149.055.945.446 1.107.527.163.081.272.122.312.19.04.068.04.394-.104.799z" />
            </svg>
          </div>
        );
      case "telegram":
        return (
          <div className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-sm">
            <svg className="w-4.5 h-4.5 fill-current translate-x-[-1px] translate-y-[1px]" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
            </svg>
          </div>
        );
      case "instagram":
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5] p-0.5 flex items-center justify-center text-white shadow-sm">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
        );
      case "onekey":
        return (
          <div className="w-8 h-8 rounded-xl bg-black border border-emerald-500/60 p-0.5 flex items-center justify-center text-white shadow-sm overflow-hidden">
            <span className="text-sm">🔑</span>
          </div>
        );
      case "chatgpt":
        return (
          <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
        );
      case "celestimind":
        return (
          <div className="w-8 h-8 rounded-xl bg-[#1e1e24] border border-orange-500/60 p-1 flex flex-col justify-center items-center gap-0.5 shadow-sm">
            <div className="w-5 h-1 bg-orange-500 rounded-full" />
            <div className="w-4 h-1 bg-amber-400 rounded-full" />
            <div className="w-5 h-1 bg-rose-500 rounded-full" />
          </div>
        );
      case "franz-todos":
        return (
          <div className="w-8 h-8 rounded-xl bg-[#1DA1F2] flex items-center justify-center text-white shadow-sm">
            <CheckSquare className="w-5 h-5" />
          </div>
        );
      case "messenger":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0078ff] flex items-center justify-center text-white shadow-sm">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
        );
      case "slack":
        return (
          <div className="w-8 h-8 rounded-xl bg-[#4A154B] flex items-center justify-center text-white shadow-sm">
            <Layers className="w-4.5 h-4.5 text-amber-300" />
          </div>
        );
      case "gmail":
        return (
          <div className="w-8 h-8 rounded-xl bg-white border border-stone-700 flex items-center justify-center text-rose-500 shadow-sm">
            <span className="font-extrabold text-sm tracking-tighter">M</span>
          </div>
        );
      case "discord":
        return (
          <div className="w-8 h-8 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-sm">
            <Cpu className="w-4.5 h-4.5" />
          </div>
        );
      case "custom-website":
      case "earnings-ink":
        return (
          <div className="w-8 h-8 rounded-full bg-sky-950 border border-sky-400/50 flex items-center justify-center text-sky-300 shadow-sm">
            <Globe className="w-4.5 h-4.5" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shadow-sm">
            <span className="font-bold text-xs uppercase">
              {name ? name.substring(0, 2) : "FZ"}
            </span>
          </div>
        );
    }
  };

  // Filter available services
  const filteredCatalog = ALL_FRANZ_SERVICES.filter(service => {
    const matchesSearch =
      service.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      service.description.toLowerCase().includes(catalogSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (catalogSubTab === "popular") return service.isPopular;
    if (catalogSubTab === "custom") return service.category === "custom";
    return true; // "all"
  });

  return (
    <div className="w-full h-full flex flex-col bg-[#16191d] text-stone-100 font-sans select-none overflow-hidden border border-stone-800 shadow-2xl">
      {/* ==================================================================== */}
      {/* 1. TOP WINDOW BAR (Franz Desktop Header with Title, Menu & Live URL) */}
      {/* ==================================================================== */}
      <div className="h-10 bg-[#0f1115] border-b border-[#252a34] px-3.5 flex items-center justify-between text-xs shrink-0 select-none shadow-sm">
        {/* Left: Franz Logo & Title */}
        <div className="flex items-center gap-2">
          {/* Franz Mustache Logo Icon */}
          <div className="w-5 h-5 rounded-full bg-[#1da1f2] flex items-center justify-center text-white shadow-sm">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
            </svg>
          </div>
          <span className="font-bold text-stone-100 text-xs sm:text-[13px] tracking-tight">Franz</span>
          <span className="text-stone-400 font-bold text-xs">:</span>

          {/* Top Menu Dropdown items - Portable, clear, medium-bold contrast */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-stone-300 pl-2">
            <button
              onClick={() => {
                setModalTab("available");
                setIsModalOpen(true);
              }}
              className="px-2 py-1 rounded-md hover:bg-stone-800/80 hover:text-white transition-colors cursor-pointer"
            >
              File
            </button>
            <button
              onClick={() => setIframeKey(Date.now())}
              className="px-2 py-1 rounded-md hover:bg-stone-800/80 hover:text-white transition-colors cursor-pointer"
            >
              View
            </button>
            <button
              onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
              className="px-2 py-1 rounded-md hover:bg-stone-800/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Developer Tools</span>
              {isDevToolsOpen && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />}
            </button>
            <button
              onClick={() => {
                setModalTab("workspaces");
                setIsModalOpen(true);
              }}
              className="px-2 py-1 rounded-md hover:bg-stone-800/80 hover:text-white transition-colors cursor-pointer"
            >
              Workspaces
            </button>
            <button
              onClick={() => {
                setModalTab("account");
                setIsModalOpen(true);
              }}
              className="px-2 py-1 rounded-md hover:bg-stone-800/80 hover:text-white transition-colors cursor-pointer"
            >
              Help
            </button>
          </div>
        </div>

        {/* Center: Live Browser URL & Owner Status Badge */}
        <div className="flex items-center gap-2.5">
          {/* Live Web URL indicator for user */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171f2b] border border-sky-600/40 text-[11px] text-sky-200 font-semibold font-mono shadow-inner">
            <Globe size={12} className="text-sky-400" />
            <span className="truncate max-w-[280px]">ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app</span>
          </div>

          {/* Owner Privilege Status Pill */}
          <button
            onClick={() => {
              setModalTab("account");
              setIsModalOpen(true);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
              isOwnerBypassActive
                ? "bg-gradient-to-r from-amber-500/25 via-emerald-500/25 to-sky-500/25 text-amber-300 border border-amber-500/60 hover:border-amber-400"
                : "bg-red-950 text-red-300 border border-red-800"
            }`}
            title="Owner Account: Kansas Nelly (Unlimited VIP Lifetime Edition)"
          >
            <span>👑</span>
            <span className="tracking-wide">OWNER VIP: UNLOCKED</span>
          </button>

          {/* TON Community & TMA Deep Link Button */}
          <a
            href="/#community"
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/50 text-[11px] text-amber-300 font-bold hover:bg-amber-900 transition-colors shadow-sm"
            title="Open Zealy/Galxe Community Hub & TMAs"
          >
            <span>💎</span>
            <span>TON Hub & TMAs</span>
            <span className="font-mono text-[10px] text-emerald-400">UQDl...WgrG</span>
          </a>
        </div>

        {/* Right: Window Control buttons (_ □ ✕) */}
        <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
          <button
            onClick={() => setShowWaitScreenTest(!showWaitScreenTest)}
            className="px-2.5 py-1 hover:bg-stone-800 hover:text-white bg-stone-900/80 border border-stone-700/60 rounded-md text-[11px] cursor-pointer transition-colors"
            title="Toggle Wait Screen Simulation"
          >
            Wait Screen: <span className={showWaitScreenTest ? "text-amber-400" : "text-stone-400"}>{showWaitScreenTest ? "ON" : "OFF"}</span>
          </button>
          <button
            onClick={() => setProxyMode(!proxyMode)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
              proxyMode
                ? "bg-sky-900/90 text-sky-200 border-sky-500"
                : "bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-stone-700/60 hover:text-white"
            }`}
            title="Toggle Webview Proxy Engine"
          >
            Proxy Mode
          </button>
          <button
            className="w-8 h-7 flex items-center justify-center hover:bg-stone-800 hover:text-white rounded-md cursor-pointer text-xs font-bold transition-colors"
            title="Minimize"
          >
            —
          </button>
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="w-8 h-7 flex items-center justify-center hover:bg-stone-800 hover:text-white rounded-md cursor-pointer text-xs font-bold transition-colors"
            title="Maximize / Fullscreen"
          >
            □
          </button>
          {onCloseToMain && (
            <button
              onClick={onCloseToMain}
              className="w-8 h-7 flex items-center justify-center hover:bg-red-600 hover:text-white rounded-md cursor-pointer text-xs font-bold transition-colors"
              title="Close Franz"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN BODY (Left Vertical Sidebar + Center Webview Container)      */}
      {/* ==================================================================== */}
      <div className="w-full flex-1 flex overflow-hidden relative">
        {/* ------------------------------------------------------------------ */}
        {/* LEFT VERTICAL NAVIGATION SIDEBAR (Matching screenshots strictly)  */}
        {/* ------------------------------------------------------------------ */}
        <div className="w-[68px] bg-[#191c21] border-r border-[#242932] flex flex-col items-center justify-between py-3 shrink-0 z-20 select-none">
          {/* Top Section: Brand Avatar + Active Services Icons List */}
          <div className="w-full flex flex-col items-center gap-2 overflow-y-auto no-scrollbar max-h-[calc(100vh-220px)]">
            {/* Top Franz Globe Icon */}
            <button
              onClick={() => {
                setModalTab("workspaces");
                setIsModalOpen(true);
              }}
              className="w-11 h-11 rounded-2xl bg-[#14233a] hover:bg-[#1e3456] border border-sky-600/40 flex items-center justify-center text-sky-400 shadow-md cursor-pointer transition-all hover:scale-105 mb-1"
              title="Switch Workspace or Manage Services"
            >
              <Globe size={22} className="text-sky-400" />
            </button>

            {/* List of Active Services (WhatsApp, Telegrams, Instagrams, ChatGPT, Custom Sites) */}
            {visibleInstances.map((inst, idx) => {
              const isSelected = inst.instanceId === activeInstanceId;
              const def = ALL_FRANZ_SERVICES.find(s => s.id === inst.serviceId);

              return (
                <div key={inst.instanceId} className="relative w-full flex items-center justify-center py-0.5">
                  {/* Left Active Selection Indicator Bar (as in screenshot 1) */}
                  {isSelected && (
                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r shadow-[0_0_8px_white]" />
                  )}

                  <button
                    onClick={() => handleSelectInstance(inst.instanceId)}
                    className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-[#252a33] shadow-lg ring-1 ring-white/20 scale-105"
                        : "hover:bg-[#20252d] opacity-85 hover:opacity-100"
                    } ${!inst.isEnabled ? "grayscale opacity-40" : ""}`}
                    title={`${inst.name} (${inst.url})`}
                  >
                    {renderServiceIcon(def?.iconType || "custom-website", "w-6 h-6", inst.name)}

                    {/* Unread Message Badge (e.g. '3' on Instagram from screenshot 1) */}
                    {inst.badge > 0 && settingsState.showUnreadBadge && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-600 text-white font-bold text-[10px] rounded-full border-2 border-[#191c21] shadow-md animate-pulse">
                        {inst.badge}
                      </span>
                    )}

                    {/* Muted Indicator Icon */}
                    {inst.isMuted && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-stone-900 border border-stone-600 flex items-center justify-center text-[7px] text-stone-400">
                        🔕
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Bar on Sidebar (Fixed navigation items from screenshots 1-11) */}
          <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-[#252b36]">
            {/* 1. Franz ToDos / Tasks button */}
            <button
              onClick={() => {
                const todoInst = instances.find(i => i.serviceId === "franz-todos");
                if (todoInst) {
                  handleSelectInstance(todoInst.instanceId);
                } else {
                  const todoDef = ALL_FRANZ_SERVICES.find(s => s.id === "franz-todos");
                  if (todoDef) handleAddService(todoDef);
                }
              }}
              className="w-10 h-10 rounded-xl hover:bg-[#252a33] flex items-center justify-center text-stone-400 hover:text-sky-300 transition-colors cursor-pointer"
              title="Franz ToDos & Tasks"
            >
              <CheckSquare size={19} />
            </button>

            {/* 2. Available Services Catalog Grid button */}
            <button
              onClick={() => {
                setModalTab("available");
                setIsModalOpen(true);
              }}
              className="w-10 h-10 rounded-xl hover:bg-[#252a33] flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Available Services Catalog"
            >
              <Grid size={19} />
            </button>

            {/* 3. Notifications Bell (Toggle Mute) */}
            <button
              onClick={() => setIsNotificationsMuted(!isNotificationsMuted)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isNotificationsMuted
                  ? "bg-rose-950/60 text-rose-400"
                  : "hover:bg-[#252a33] text-stone-400 hover:text-white"
              }`}
              title={isNotificationsMuted ? "Unmute all notifications" : "Mute notifications"}
            >
              {isNotificationsMuted ? <BellOff size={19} /> : <Bell size={19} />}
            </button>

            {/* 4. '+' Button (Add New Service) */}
            <button
              id="btn-franz-add-service"
              onClick={() => {
                setModalTab("available");
                setIsModalOpen(true);
              }}
              className="w-10 h-10 rounded-xl bg-[#242b37] hover:bg-[#2c3646] text-white flex items-center justify-center shadow-md border border-[#353f50] hover:border-sky-500 cursor-pointer transition-all hover:scale-105 active:scale-95"
              title="Add a new service"
            >
              <Plus size={20} strokeWidth={2.5} className="text-stone-200" />
            </button>

            {/* 5. '⚙' Gear Icon (Settings & Workspaces Drawer) */}
            <button
              id="btn-franz-settings"
              onClick={() => {
                setModalTab("settings");
                setIsModalOpen(true);
              }}
              className="w-10 h-10 rounded-xl hover:bg-[#252a33] flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Settings & Account"
            >
              <Settings size={19} />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CENTER DASHBOARD / ISOLATED WEBVIEW CONTAINER                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex-1 flex flex-col bg-[#111317] overflow-hidden relative">
          {/* Top Service Utility Bar (Submenus for Reload, DevTools, Zoom, Mute) */}
          <div className="h-10 bg-[#161a21] border-b border-[#242932] px-3.5 flex items-center justify-between text-xs shrink-0 select-none">
            {/* Left: Active Service Meta */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2">
                {renderServiceIcon(currentDef?.iconType || "custom-website", "w-4 h-4", currentInstance.name)}
                <span className="font-bold text-white text-sm tracking-tight">{currentInstance.name}</span>
              </div>

              {/* URL & Partition Pill */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-700">
                <span className="px-2 py-0.5 rounded bg-[#101318] border border-stone-700/60 font-mono text-[10px] text-stone-400 max-w-[260px] truncate">
                  {currentInstance.url}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-mono text-[9px] border border-sky-800/60 flex items-center gap-1">
                  <Lock size={9} />
                  <span>{currentInstance.sessionPartition}</span>
                </span>
              </div>
            </div>

            {/* Right: Submenus & Controls */}
            <div className="flex items-center gap-1.5 text-stone-300">
              {/* Reload Applet / Service Container */}
              <button
                onClick={() => setIframeKey(Date.now())}
                className="p-1.5 hover:bg-[#242932] hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Reload this service container"
              >
                <RefreshCw size={13} />
                <span className="hidden md:inline text-[11px]">Reload</span>
              </button>

              {/* Toggle Developer Tools */}
              <button
                onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  isDevToolsOpen ? "bg-sky-900 text-sky-200" : "hover:bg-[#242932] hover:text-white"
                }`}
                title="Toggle Web Developer Inspection Tools"
              >
                <Code size={13} />
                <span className="hidden md:inline text-[11px]">DevTools</span>
              </button>

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center bg-[#101318] rounded-lg border border-stone-800 p-0.5">
                <button
                  onClick={() => {
                    setInstances(prev =>
                      prev.map(i =>
                        i.instanceId === activeInstanceId
                          ? { ...i, zoomFactor: Math.max(0.6, i.zoomFactor - 0.1) }
                          : i
                      )
                    );
                  }}
                  className="p-1 hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={12} />
                </button>
                <span className="px-1 font-mono text-[10px] text-stone-400">
                  {Math.round(currentInstance.zoomFactor * 100)}%
                </span>
                <button
                  onClick={() => {
                    setInstances(prev =>
                      prev.map(i =>
                        i.instanceId === activeInstanceId
                          ? { ...i, zoomFactor: Math.min(1.8, i.zoomFactor + 0.1) }
                          : i
                      )
                    );
                  }}
                  className="p-1 hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={12} />
                </button>
              </div>

              {/* Mute Service Audio / Notification */}
              <button
                onClick={() => {
                  setInstances(prev =>
                    prev.map(i =>
                      i.instanceId === activeInstanceId ? { ...i, isMuted: !i.isMuted } : i
                    )
                  );
                }}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  currentInstance.isMuted ? "text-amber-400 bg-amber-950/40" : "hover:bg-[#242932]"
                }`}
                title={currentInstance.isMuted ? "Unmute Service" : "Mute Service"}
              >
                {currentInstance.isMuted ? <BellOff size={13} /> : <Bell size={13} />}
              </button>

              {/* BAT / USDT Rewards Engine Status Button */}
              <button
                onClick={() => setIsRewardsModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                title="Franz BAT/USDT Rewards & Liquidity Engine"
              >
                <span>🦁</span>
                <span>{rewardsState.batBalance.toFixed(2)} BAT</span>
                <span className="text-stone-500">|</span>
                <span className="text-emerald-400">${(rewardsState.batBalance * rewardsState.usdtRate).toFixed(2)} USDT</span>
              </button>

              {/* ONE KEY Web3 Mobile Wallet Quick-Launcher Button */}
              <button
                onClick={() => setIsOneKeyModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="ONE KEY Tether TRC-20 Mobile Wallet (TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG)"
              >
                <span>🔑</span>
                <span>ONE KEY</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-mono">
                  $4.35
                </span>
              </button>

              {/* Notification Records Button (Silent BAT Earning Ledger) */}
              <button
                onClick={() => setIsRewardsModalOpen(true)}
                className="relative p-1.5 hover:bg-[#242932] text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Notification Records (Silent BAT earnings ledger)"
              >
                <Bell size={13} />
                {rewardsState.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[9px] font-bold font-mono">
                    {rewardsState.unreadCount}
                  </span>
                )}
              </button>

              {/* Open in external browser tab */}
              <a
                href={currentInstance.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-[#242932] hover:text-white rounded-lg transition-colors"
                title="Open in external browser window"
              >
                <ExternalLink size={13} />
              </a>

              {/* Edit / Configure Service */}
              <button
                onClick={() => {
                  setModalTab("your_services");
                  setIsModalOpen(true);
                }}
                className="p-1.5 hover:bg-[#242932] hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Service Configuration"
              >
                <Sliders size={13} />
              </button>

              {/* Direct Franz URL badge */}
              <button
                onClick={() => {
                  const url = `${window.location.origin}/franz`;
                  navigator.clipboard.writeText(url);
                  alert(`Franz Dedicated URL copied:\n${url}`);
                }}
                className="hidden lg:flex items-center gap-1 px-2 py-1 rounded bg-[#202530] hover:bg-[#2a3140] text-sky-300 border border-sky-700/50 text-[11px] font-mono cursor-pointer"
                title="Copy direct URL to Franz Multi-Messenger"
              >
                <span>/franz</span>
                <Share2 size={11} />
              </button>

              {/* Switch to AlphaQubit Ecosystem */}
              {onCloseToMain && (
                <button
                  onClick={onCloseToMain}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                  title="Switch to AlphaQubit Quantum Research & Live Ecosystem"
                >
                  <span>AlphaQubit (/)</span>
                </button>
              )}
            </div>
          </div>

          {/* ================================================================ */}
          {/* WAIT SCREEN SIMULATION & OWNER BYPASS (Screenshot 1 Replication) */}
          {/* ================================================================ */}
          {showWaitScreenTest && !isOwnerBypassActive && (
            <div className="absolute inset-0 z-30 bg-[#16191d] flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none">
              <h1 className="text-3xl sm:text-4xl font-light text-stone-100 tracking-wide mb-6">
                Upgrade your Franz plan to skip the wait
              </h1>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => {
                    setIsOwnerBypassActive(true);
                    setShowWaitScreenTest(false);
                  }}
                  className="px-6 py-2.5 rounded border border-sky-500 text-sky-400 hover:bg-sky-500/10 font-medium text-sm transition-all cursor-pointer"
                >
                  Upgrade Franz
                </button>

                <button
                  onClick={() => setShowWaitScreenTest(false)}
                  className="text-sky-400 hover:underline text-sm cursor-pointer"
                >
                  Continue to Franz
                </button>

                {/* PROMINENT 1-CLICK OWNER BYPASS BUTTON */}
                <div className="mt-8 p-4 rounded-xl bg-[#1d232c] border border-amber-500/40 max-w-md">
                  <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm mb-1">
                    <span>👑</span>
                    <span>OWNER-LEVEL BACKEND PRIVILEGE</span>
                  </div>
                  <p className="text-xs text-stone-400 mb-3">
                    Bypassing subscription and skip-the-wait screens permanently for administration account:{" "}
                    <strong className="text-white">KANSAS NELLY</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setIsOwnerBypassActive(true);
                      setShowWaitScreenTest(false);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-black text-xs rounded shadow-lg uppercase tracking-wider cursor-pointer"
                  >
                    Bypass Wait as Owner (Unlimited VIP)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* ISOLATED PARTITIONED WEBVIEW CONTAINER                           */}
          {/* ================================================================ */}
          <div className="flex-1 w-full h-full bg-[#1e2229] relative overflow-hidden flex flex-col">
            <FranzIsolatedWebview
              key={currentInstance.instanceId}
              instance={currentInstance}
              onActivity={handleTrackActivity}
              onOpenDevTools={() => setIsDevToolsOpen(true)}
            />
          </div>

          {/* ================================================================ */}
          {/* DEVELOPER TOOLS PANEL (Chrome/Electron Style DevTools)           */}
          {/* ================================================================ */}
          {isDevToolsOpen && (
            <div className="h-64 bg-[#1e2229] border-t border-[#313744] flex flex-col shrink-0 select-text font-mono text-xs z-20">
              {/* DevTools Tab Bar */}
              <div className="h-7 bg-[#16191f] border-b border-[#2b313d] px-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="font-bold text-stone-300 flex items-center gap-1">
                    <Terminal size={12} className="text-sky-400" />
                    Developer Tools — {currentInstance.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDevToolsTab("console")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        devToolsTab === "console" ? "bg-[#2c3240] text-sky-300 font-bold" : "text-stone-400 hover:text-white"
                      }`}
                    >
                      Console
                    </button>
                    <button
                      onClick={() => setDevToolsTab("network")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        devToolsTab === "network" ? "bg-[#2c3240] text-sky-300 font-bold" : "text-stone-400 hover:text-white"
                      }`}
                    >
                      Network
                    </button>
                    <button
                      onClick={() => setDevToolsTab("storage")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        devToolsTab === "storage" ? "bg-[#2c3240] text-sky-300 font-bold" : "text-stone-400 hover:text-white"
                      }`}
                    >
                      Storage & Partitions
                    </button>
                    <button
                      onClick={() => setDevToolsTab("elements")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        devToolsTab === "elements" ? "bg-[#2c3240] text-sky-300 font-bold" : "text-stone-400 hover:text-white"
                      }`}
                    >
                      Elements
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setIsDevToolsOpen(false)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* DevTools Content Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-[#15181e] text-[11px]">
                {devToolsTab === "console" && (
                  <>
                    {devLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 ${
                          log.type === "error"
                            ? "text-rose-400 bg-rose-950/20 px-1 py-0.5 rounded"
                            : log.type === "warn"
                            ? "text-amber-300"
                            : log.type === "info"
                            ? "text-sky-300"
                            : "text-stone-300"
                        }`}
                      >
                        <span className="text-stone-600 select-none">[{log.time}]</span>
                        <span>{log.text}</span>
                      </div>
                    ))}
                  </>
                )}

                {devToolsTab === "network" && (
                  <div className="space-y-1">
                    <div className="grid grid-cols-5 text-stone-500 font-bold border-b border-stone-800 pb-1">
                      <span>Name</span>
                      <span>Status</span>
                      <span>Type</span>
                      <span>Initiator</span>
                      <span>Time</span>
                    </div>
                    <div className="grid grid-cols-5 text-stone-300">
                      <span className="text-emerald-400 truncate">{currentInstance.url}</span>
                      <span className="text-emerald-400">200 OK</span>
                      <span>document</span>
                      <span>webview_host</span>
                      <span>142 ms</span>
                    </div>
                    <div className="grid grid-cols-5 text-stone-400">
                      <span className="truncate">bundle.min.js</span>
                      <span className="text-emerald-400">200 OK</span>
                      <span>script</span>
                      <span>inline</span>
                      <span>45 ms</span>
                    </div>
                  </div>
                )}

                {devToolsTab === "storage" && (
                  <div className="space-y-2 text-stone-300">
                    <div className="flex items-center gap-2 text-sky-400 font-bold">
                      <Database size={13} />
                      <span>Isolated IndexedDB / LocalStorage Session Partition</span>
                    </div>
                    <div className="p-2 rounded bg-[#1c2028] border border-stone-800 space-y-1">
                      <div>Partition Identifier: <code className="text-amber-300">{currentInstance.sessionPartition}</code></div>
                      <div>Service Domain: <code className="text-emerald-400">{currentInstance.url}</code></div>
                      <div>Cookie Scope: <span className="text-sky-300">Isolated (No cross-account leakage)</span></div>
                      <div>Disk Cache: <span className="text-stone-400">1.91 GB persistent</span></div>
                    </div>
                  </div>
                )}

                {devToolsTab === "elements" && (
                  <div className="text-stone-400 font-mono">
                    <div>&lt;<span className="text-rose-400">webview-container</span> <span className="text-amber-300">id</span>=<span className="text-emerald-300">"{currentInstance.instanceId}"</span> <span className="text-amber-300">partition</span>=<span className="text-emerald-300">"{currentInstance.sessionPartition}"</span>&gt;</div>
                    <div className="pl-4">&lt;<span className="text-rose-400">iframe</span> <span className="text-amber-300">src</span>=<span className="text-emerald-300">"{currentInstance.url}"</span> <span className="text-amber-300">sandbox</span>=<span className="text-emerald-300">"unrestricted"</span> /&gt;</div>
                    <div>&lt;/<span className="text-rose-400">webview-container</span>&gt;</div>
                  </div>
                )}
              </div>

              {/* Console Input Bar */}
              {devToolsTab === "console" && (
                <form onSubmit={handleRunConsoleCommand} className="h-7 bg-[#16191f] border-t border-[#2b313d] px-2 flex items-center gap-2">
                  <span className="text-sky-400 font-bold select-none">&gt;</span>
                  <input
                    type="text"
                    value={evalInput}
                    onChange={e => setEvalInput(e.target.value)}
                    placeholder="Evaluate JavaScript expression or command (clear, reload, info, bypass)..."
                    className="flex-1 bg-transparent border-0 outline-none text-stone-200 placeholder-stone-600 font-mono text-xs"
                  />
                  <button type="submit" className="text-sky-400 hover:text-white px-2 cursor-pointer">
                    Run
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. SETTINGS & SERVICES MODAL (Strictly Replicating Screenshots 2-11)  */}
      {/* ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
          <div className="w-full max-w-4xl h-[88vh] max-h-[720px] bg-[#1e2227] border border-[#333b47] rounded-xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
            {/* Top Bright Blue Header (Matching screenshots 2-11) */}
            <div className="h-12 bg-[#1fa2f2] px-4 flex items-center justify-between text-white shrink-0 shadow-md">
              <span className="font-medium text-base tracking-wide capitalize">
                {modalTab === "available"
                  ? "Available services"
                  : modalTab === "your_services"
                  ? "Your services"
                  : modalTab === "workspaces"
                  ? "Your workspaces"
                  : modalTab === "account"
                  ? "Account"
                  : modalTab === "team"
                  ? "Manage Team"
                  : modalTab === "settings"
                  ? "Settings"
                  : modalTab === "custom_recipes"
                  ? "Custom 3rd Party Recipes"
                  : "Invite Friends"}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded hover:bg-black/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Orange Warning / Unlocked Owner Banner (Screenshots 2, 6, 8) */}
            {isOwnerBypassActive ? (
              <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 px-4 py-2 flex items-center justify-between text-white text-xs font-medium shadow-inner shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">👑</span>
                  <span>
                    <strong>OWNER ADMINISTRATION PRIVILEGE:</strong> {instances.length} active services loaded. All paywalls, wait times, and 3-service limits bypassed permanently for Kansas Nelly.
                  </span>
                </div>
                <button
                  onClick={() => setIsOwnerBypassActive(false)}
                  className="px-2 py-0.5 bg-black/30 hover:bg-black/50 text-emerald-200 rounded text-[11px] cursor-pointer"
                >
                  Test Free Limits
                </button>
              </div>
            ) : (
              <div className="bg-[#ff9900] px-4 py-2 flex items-center justify-between text-white text-xs font-medium shadow-inner shrink-0">
                <span>
                  You have added {instances.length} out of 3 services that are included in your plan. Please upgrade your account to add more services.
                </span>
                <button
                  onClick={() => setIsOwnerBypassActive(true)}
                  className="px-3 py-1 bg-transparent hover:bg-white/20 border border-white rounded text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Upgrade account
                </button>
              </div>
            )}

            {/* Modal Body: Left Menu + Right Content Panel */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Menu inside Modal (Screenshots 2-11) */}
              <div className="w-56 bg-[#181b20] border-r border-[#262c37] flex flex-col justify-between py-2 shrink-0">
                <div className="flex flex-col text-xs font-medium text-stone-300">
                  <button
                    onClick={() => setModalTab("available")}
                    className={`px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      modalTab === "available" ? "bg-[#262c38] text-white font-bold" : "hover:bg-[#1f242d]"
                    }`}
                  >
                    <span>Available services</span>
                  </button>

                  <button
                    onClick={() => setModalTab("your_services")}
                    className={`px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      modalTab === "your_services" ? "bg-[#262c38] text-white font-bold" : "hover:bg-[#1f242d]"
                    }`}
                  >
                    <span>Your services</span>
                    <span className="px-2 py-0.5 rounded bg-stone-700/60 text-stone-300 font-mono text-[11px]">
                      {isOwnerBypassActive ? `${instances.length}/∞` : `${instances.length}/3`}
                    </span>
                  </button>

                  <button
                    onClick={() => setModalTab("workspaces")}
                    className={`px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      modalTab === "workspaces" ? "bg-[#262c38] text-white font-bold" : "hover:bg-[#1f242d]"
                    }`}
                  >
                    <span>Your workspaces</span>
                    <span className="w-4 h-4 rounded bg-[#1fa2f2] text-white flex items-center justify-center text-[10px]">
                      ★
                    </span>
                  </button>

                  <button
                    onClick={() => setModalTab("account")}
                    className={`px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      modalTab === "account" ? "bg-[#262c38] text-white font-bold" : "hover:bg-[#1f242d]"
                    }`}
                  >
                    <span>Account</span>
                  </button>

                  <button
                    onClick={() => setModalTab("team")}
                    className={`px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      modalTab === "team" ? "bg-[#262c38] text-white font-bold" : "hover:bg-[#1f242d]"
                    }`}
                  >
                    <span>Manage Team</span>
                    <span className="w-4 h-4 rounded bg-[#1fa2f2] text-white flex items-center justify-center text-[10px]">
                      ★
                    </span>
                  </button>

                  <button
                    onClick={() => setModalTab("settings")}
                    className={`px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      modalTab === "settings" ? "bg-[#262c38] text-white font-bold" : "hover:bg-[#1f242d]"
                    }`}
                  >
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => setModalTab("invite")}
                    className={`px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      modalTab === "invite" ? "bg-[#262c38] text-white font-bold" : "hover:bg-[#1f242d]"
                    }`}
                  >
                    <span>Invite Friends</span>
                  </button>
                </div>

                <div className="px-4 py-2 border-t border-[#262c37]">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-stone-400 hover:text-white text-xs cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Right Content Panel inside Modal */}
              <div className="flex-1 bg-[#1a1d22] overflow-y-auto p-5 text-sm text-stone-200">
                {/* -------------------------------------------------------- */}
                {/* A. AVAILABLE SERVICES TAB (Screenshots 8, 9, 10, 11)    */}
                {/* -------------------------------------------------------- */}
                {modalTab === "available" && (
                  <div className="space-y-4">
                    {/* Top Search Input (Screenshots 8-10) */}
                    <div className="relative w-full">
                      <Search size={15} className="absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={e => setCatalogSearch(e.target.value)}
                        placeholder="Search service"
                        className="w-full bg-[#16181d] border border-stone-700/80 rounded-lg pl-9 pr-3 py-2 text-stone-100 placeholder-stone-500 text-xs outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>

                    {/* Filter Tabs & "Missing a service?" Link */}
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => setCatalogSubTab("popular")}
                          className={`px-3 py-1 rounded font-medium cursor-pointer transition-colors ${
                            catalogSubTab === "popular"
                              ? "bg-[#1fa2f2] text-white"
                              : "bg-[#272c36] text-stone-300 hover:text-white"
                          }`}
                        >
                          Most popular
                        </button>
                        <button
                          onClick={() => setCatalogSubTab("all")}
                          className={`px-3 py-1 rounded font-medium cursor-pointer transition-colors ${
                            catalogSubTab === "all"
                              ? "bg-[#1fa2f2] text-white"
                              : "bg-[#272c36] text-stone-300 hover:text-white"
                          }`}
                        >
                          All services
                        </button>
                        <button
                          onClick={() => setCatalogSubTab("custom")}
                          className={`px-3 py-1 rounded font-medium cursor-pointer transition-colors ${
                            catalogSubTab === "custom"
                              ? "bg-[#1fa2f2] text-white"
                              : "bg-[#272c36] text-stone-300 hover:text-white"
                          }`}
                        >
                          Custom Services
                        </button>
                      </div>

                      <a
                        href="https://meetfranz.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:underline text-xs flex items-center gap-1"
                      >
                        <span>Missing a service?</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>

                    {/* If Custom Services is selected, render Custom 3rd Party Recipes (Screenshot 11) */}
                    {catalogSubTab === "custom" ? (
                      <div className="space-y-5 pt-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-base font-medium text-white mb-2">
                            <span>Custom 3rd Party Recipes</span>
                            <span className="w-4 h-4 rounded bg-[#1fa2f2] text-white flex items-center justify-center text-[10px]">
                              ★
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mb-3">
                            To add a custom service recipe, place the folder in:
                          </p>

                          <div className="w-full bg-[#16181d] border border-stone-800 rounded p-2.5 font-mono text-xs text-stone-300 select-all mb-3">
                            C:\Users\PC\AppData\Roaming\Franz\recipes\dev
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => alert("Recipe developer directory opened: C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev")}
                              className="px-4 py-1.5 bg-[#444a57] hover:bg-[#525968] text-white font-medium text-xs rounded transition-colors cursor-pointer"
                            >
                              Open folder
                            </button>
                            <a
                              href="https://github.com/meetfranz/plugins"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-1.5 bg-[#444a57] hover:bg-[#525968] text-white font-medium text-xs rounded transition-colors"
                            >
                              Developer Documentation
                            </a>
                          </div>
                        </div>

                        {/* Interactive Add Custom Website / Domain Form */}
                        <div className="mt-6 p-4 rounded-xl bg-[#16181d] border border-stone-800 space-y-3">
                          <h4 className="font-bold text-sm text-white flex items-center gap-2">
                            <Globe size={15} className="text-sky-400" />
                            <span>Add Custom Website or Domain</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="text-stone-400 block mb-1">Service Name</label>
                              <input
                                type="text"
                                value={newCustomName}
                                onChange={e => setNewCustomName(e.target.value)}
                                placeholder="e.g. earnings.ink or My Portal"
                                className="w-full bg-[#20242c] border border-stone-700 rounded p-2 text-stone-100 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-stone-400 block mb-1">Service URL</label>
                              <input
                                type="url"
                                value={newCustomUrl}
                                onChange={e => setNewCustomUrl(e.target.value)}
                                placeholder="https://earnings.ink"
                                className="w-full bg-[#20242c] border border-stone-700 rounded p-2 text-stone-100 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-stone-400 block mb-1">Assign Workspace</label>
                              <select
                                value={newCustomWorkspace}
                                onChange={e => setNewCustomWorkspace(e.target.value)}
                                className="w-full bg-[#20242c] border border-stone-700 rounded p-2 text-stone-100 outline-none"
                              >
                                <option value="all">All Services</option>
                                <option value="office">Office</option>
                                <option value="private">Private</option>
                                <option value="support">Support</option>
                              </select>
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const customDef = ALL_FRANZ_SERVICES.find(s => s.id === "custom-website")!;
                                  handleAddService(customDef, newCustomName || "Custom Website", newCustomUrl);
                                  setNewCustomName("");
                                }}
                                className="w-full py-2 bg-[#1fa2f2] hover:bg-sky-500 text-white font-bold rounded cursor-pointer transition-colors shadow-md"
                              >
                                + Add Custom Website to Sidebar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 4-Columns Service Grid (Screenshots 8, 9, 10) */
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {filteredCatalog.map(service => (
                          <div
                            key={service.id}
                            onClick={() => handleAddService(service)}
                            className="bg-[#242932] hover:bg-[#2e3440] border border-stone-700/50 hover:border-sky-500/80 rounded-xl p-3 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-all hover:scale-102 hover:shadow-lg group"
                          >
                            <div className="group-hover:scale-110 transition-transform">
                              {renderServiceIcon(service.iconType, "w-8 h-8", service.name)}
                            </div>
                            <span className="font-medium text-xs text-stone-200 group-hover:text-white truncate max-w-full">
                              {service.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* B. YOUR SERVICES TAB (Screenshots 6 & 7)                */}
                {/* -------------------------------------------------------- */}
                {modalTab === "your_services" && (
                  <div className="space-y-4">
                    {/* Search Service Input */}
                    <div className="relative w-full">
                      <Search size={15} className="absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        value={yourServicesSearch}
                        onChange={e => setYourServicesSearch(e.target.value)}
                        placeholder="Search service"
                        className="w-full bg-[#16181d] border border-stone-700/80 rounded-lg pl-9 pr-3 py-2 text-stone-100 placeholder-stone-500 text-xs outline-none"
                      />
                    </div>

                    {/* Services List with Power Toggle and Delete (Screenshots 6 & 7) */}
                    <div className="divide-y divide-stone-800/80 rounded-lg border border-stone-800 bg-[#16181d]">
                      {instances
                        .filter(inst =>
                          inst.name.toLowerCase().includes(yourServicesSearch.toLowerCase()) ||
                          inst.url.toLowerCase().includes(yourServicesSearch.toLowerCase())
                        )
                        .map(inst => {
                          const def = ALL_FRANZ_SERVICES.find(s => s.id === inst.serviceId);
                          return (
                            <div
                              key={inst.instanceId}
                              onClick={() => handleSelectInstance(inst.instanceId)}
                              className="px-4 py-3 flex items-center justify-between hover:bg-[#1f242d] transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                {renderServiceIcon(def?.iconType || "custom-website", "w-7 h-7", inst.name)}
                                <div>
                                  <div className="font-semibold text-xs text-white">{inst.name}</div>
                                  <div className="text-[11px] text-stone-500 font-mono">{inst.url}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-400 text-[10px] uppercase font-mono">
                                  {inst.workspace}
                                </span>

                                {/* Power on/off toggle button (Screenshot 7) */}
                                <button
                                  type="button"
                                  onClick={e => handleToggleInstance(inst.instanceId, e)}
                                  className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                                    inst.isEnabled
                                      ? "text-sky-400 hover:bg-sky-950"
                                      : "text-stone-600 hover:bg-stone-800"
                                  }`}
                                  title={inst.isEnabled ? "Disable service" : "Enable service"}
                                >
                                  <Power size={14} />
                                </button>

                                {/* Delete service button */}
                                <button
                                  type="button"
                                  onClick={e => handleDeleteInstance(inst.instanceId, e)}
                                  className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-full cursor-pointer transition-colors"
                                  title="Delete service"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* C. YOUR WORKSPACES TAB (Screenshot 5)                   */}
                {/* -------------------------------------------------------- */}
                {modalTab === "workspaces" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-light text-white mb-2">
                        Less is More: Introducing Franz Workspaces
                      </h2>
                      <div className="inline-block px-2.5 py-0.5 rounded bg-[#1fa2f2] text-white text-xs font-bold mb-4">
                        Franz Professional Required • 👑 Owner Privilege Active
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
                          <p>
                            Franz Workspaces let you focus on what's important right now. Set up different sets of services and easily switch between them at any time.
                          </p>
                          <p>
                            You decide which services you need when and where, so we can help you stay on top of your game - or easily switch off from work whenever you want.
                          </p>

                          {/* Interactive Workspace Switcher Buttons */}
                          <div className="pt-2 space-y-2">
                            <label className="font-bold text-stone-400 block text-xs">Switch Active Workspace:</label>
                            <div className="flex flex-wrap gap-2">
                              {workspaces.map(ws => (
                                <button
                                  key={ws}
                                  onClick={() => setActiveWorkspace(ws)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer transition-all ${
                                    activeWorkspace === ws
                                      ? "bg-[#1fa2f2] text-white shadow-md ring-2 ring-sky-300/40"
                                      : "bg-[#252a33] text-stone-300 hover:bg-[#2e3440]"
                                  }`}
                                >
                                  {ws} ({instances.filter(i => ws === "all" || i.workspace === ws).length})
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Workspaces Mock Graphic (Matching Screenshot 5) */}
                        <div className="bg-[#111317] border border-stone-800 rounded-xl p-4 shadow-xl text-xs space-y-2">
                          <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-stone-800">
                            <span className="font-bold text-white">Workspaces</span>
                            <Settings size={14} />
                          </div>
                          <div className="p-2 rounded bg-sky-950/60 border border-sky-600/50 text-sky-200">
                            <div className="font-bold">All services</div>
                            <div className="text-[10px] text-stone-400 truncate">ChatGPT, Telegram, WhatsApp, Instagram...</div>
                          </div>
                          <div className="p-2 rounded hover:bg-stone-900 border border-stone-800 text-stone-300">
                            <div className="font-bold">Private</div>
                            <div className="text-[10px] text-stone-500">Messenger, WhatsApp, Telegram</div>
                          </div>
                          <div className="p-2 rounded hover:bg-stone-900 border border-stone-800 text-stone-300">
                            <div className="font-bold">Office</div>
                            <div className="text-[10px] text-stone-500">Slack, Trello, earnings.ink</div>
                          </div>
                          <div className="p-2 rounded hover:bg-stone-900 border border-stone-800 text-stone-300">
                            <div className="font-bold">Support</div>
                            <div className="text-[10px] text-stone-500">Zendesk, Gmail, Telegram Support</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* D. ACCOUNT TAB (Screenshot 4)                           */}
                {/* -------------------------------------------------------- */}
                {modalTab === "account" && (
                  <div className="space-y-5">
                    {/* User Profile Card (Matching Screenshot 4) */}
                    <div className="bg-[#16181d] border border-stone-800 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-[#1fa2f2] p-1 flex items-center justify-center text-white shadow-lg">
                          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white">KANSAS NELLY</h3>
                          <p className="text-xs text-stone-400 font-mono">kansasiinelly@gmail.com</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-bold">
                            👑 OWNER LEVEL ADMINISTRATION
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert("Account settings for Kansas Nelly (All enterprise privileges active)")}
                        className="px-4 py-1.5 bg-transparent hover:bg-sky-500/10 border border-sky-500 text-sky-400 font-medium text-xs rounded transition-colors cursor-pointer"
                      >
                        Edit account
                      </button>
                    </div>

                    {/* Paid Plans / Owner Unlocked Box (Matching Screenshot 4) */}
                    <div className="p-5 rounded-xl bg-[#16181d] border border-stone-800 space-y-4">
                      <div>
                        <h4 className="font-bold text-base text-white mb-1">
                          Franz Owner VIP Plan: Fully Unlocked
                        </h4>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          All premium and owner features are active on this machine with lifetime administrative bypass.
                        </p>
                      </div>

                      <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                        <div className="font-bold text-stone-400 mb-2">Paid Franz Plans include:</div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span>Add unlimited services</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span>Spellchecker support</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span>Workspaces</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span>Add Custom Websites & Domains (earnings.ink, portals)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span>On-premise & other Hosted Services</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span>Skip-the-wait screen bypassed permanently</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* E. SETTINGS TAB (Screenshots 2 & 3)                      */}
                {/* -------------------------------------------------------- */}
                {modalTab === "settings" && (
                  <div className="space-y-6">
                    {/* 1. General Section */}
                    <div>
                      <h4 className="font-bold text-sm text-stone-200 mb-3">General</h4>
                      <div className="space-y-3 text-xs">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Launch Franz on start</span>
                          <input
                            type="checkbox"
                            checked={settingsState.launchOnStart}
                            onChange={e => setSettingsState({ ...settingsState, launchOnStart: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Keep Franz in background when closing the window</span>
                          <input
                            type="checkbox"
                            checked={settingsState.keepInBackground}
                            onChange={e => setSettingsState({ ...settingsState, keepInBackground: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Show Franz in system tray</span>
                          <input
                            type="checkbox"
                            checked={settingsState.showInTray}
                            onChange={e => setSettingsState({ ...settingsState, showInTray: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Minimize Franz to system tray</span>
                          <input
                            type="checkbox"
                            checked={settingsState.minimizeToTray}
                            onChange={e => setSettingsState({ ...settingsState, minimizeToTray: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Keep all workspaces loaded</span>
                          <input
                            type="checkbox"
                            checked={settingsState.keepWorkspacesLoaded}
                            onChange={e => setSettingsState({ ...settingsState, keepWorkspacesLoaded: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    {/* 2. Appearance Section */}
                    <div className="pt-2 border-t border-stone-800">
                      <h4 className="font-bold text-sm text-stone-200 mb-3">Appearance</h4>
                      <div className="space-y-3 text-xs">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Display disabled services tabs</span>
                          <input
                            type="checkbox"
                            checked={settingsState.displayDisabledTabs}
                            onChange={e => setSettingsState({ ...settingsState, displayDisabledTabs: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Show unread message badge when notifications are disabled</span>
                          <input
                            type="checkbox"
                            checked={settingsState.showUnreadBadge}
                            onChange={e => setSettingsState({ ...settingsState, showUnreadBadge: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Join the Dark Side</span>
                          <input
                            type="checkbox"
                            checked={settingsState.joinDarkSide}
                            onChange={e => setSettingsState({ ...settingsState, joinDarkSide: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    {/* 3. Language & Spellchecking */}
                    <div className="pt-2 border-t border-stone-800">
                      <h4 className="font-bold text-sm text-stone-200 mb-2">Language</h4>
                      <select
                        value={settingsState.language}
                        onChange={e => setSettingsState({ ...settingsState, language: e.target.value })}
                        className="w-full bg-[#16181d] border border-stone-700 rounded p-2 text-xs text-stone-100 outline-none mb-3"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="German">German</option>
                        <option value="French">French</option>
                      </select>

                      {/* Premium Feature Box: Spell checking (Screenshot 2 & 3) */}
                      <div className="p-3 rounded-lg border border-sky-600/50 bg-[#161d27] flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-sky-400 block">Premium Feature • 👑 Unlocked</span>
                          <span className="text-xs text-stone-300">Enable spell checking</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={settingsState.spellChecking}
                          onChange={e => setSettingsState({ ...settingsState, spellChecking: e.target.checked })}
                          className="w-4 h-4 accent-sky-500 rounded"
                        />
                      </div>
                    </div>

                    {/* 4. Advanced, Cache & Updates (Screenshot 3) */}
                    <div className="pt-2 border-t border-stone-800 space-y-4">
                      <h4 className="font-bold text-sm text-stone-200">Advanced</h4>
                      <label className="flex items-center justify-between cursor-pointer text-xs">
                        <div>
                          <span className="block text-stone-200">Enable GPU Acceleration</span>
                          <span className="text-[10px] text-stone-500">Changes require restart</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={settingsState.enableGPU}
                          onChange={e => setSettingsState({ ...settingsState, enableGPU: e.target.checked })}
                          className="w-4 h-4 accent-sky-500 rounded"
                        />
                      </label>

                      {/* Cache */}
                      <div>
                        <div className="font-bold text-xs text-stone-300 mb-1">Cache</div>
                        <div className="text-xs text-stone-400 mb-2">
                          Franz cache is currently using {settingsState.cacheSize} of disk space.
                        </div>
                        <button
                          onClick={() => {
                            setSettingsState({ ...settingsState, cacheSize: "0 KB" });
                            alert("Franz cache cleared successfully.");
                          }}
                          className="px-4 py-1.5 bg-[#3a414e] hover:bg-[#4a5363] text-stone-200 font-medium text-xs rounded transition-colors cursor-pointer"
                        >
                          Clear cache
                        </button>
                      </div>

                      {/* Updates */}
                      <div>
                        <div className="font-bold text-xs text-stone-300 mb-2">Updates</div>
                        <button
                          onClick={() => alert("Checking for updates... You are running the latest version of Franz 5.11.0 (Owner Edition).")}
                          className="px-4 py-1.5 bg-[#3a414e] hover:bg-[#4a5363] text-stone-200 font-medium text-xs rounded transition-colors cursor-pointer mb-2"
                        >
                          Check for updates
                        </button>
                        <div className="text-xs text-stone-400 mb-2">
                          You are using the latest version of Franz
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300 mb-2">
                          <input
                            type="checkbox"
                            checked={settingsState.includeBeta}
                            onChange={e => setSettingsState({ ...settingsState, includeBeta: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                          <span>Include beta versions</span>
                        </label>
                        <div className="text-[11px] text-stone-500 font-mono">
                          Current version: 5.11.0 (Owner Edition)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* F. MANAGE TEAM TAB                                       */}
                {/* -------------------------------------------------------- */}
                {modalTab === "team" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white">Manage Team</h3>
                    <p className="text-xs text-stone-400">
                      Collaborate and deploy shared service configurations across your organization.
                    </p>
                    <div className="p-4 rounded-xl bg-[#16181d] border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-white">Kansas Nelly Team Workspace</div>
                          <div className="text-[11px] text-stone-500">18 Shared Services • Unlimited Seats</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-bold">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* G. INVITE FRIENDS TAB                                    */}
                {/* -------------------------------------------------------- */}
                {modalTab === "invite" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white">Invite Friends to Franz</h3>
                    <p className="text-xs text-stone-400">
                      Share the Franz multi-messenger experience with your team and colleagues.
                    </p>
                    <div className="p-3 rounded-lg bg-[#16181d] border border-stone-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-sky-300 truncate">https://ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app/#franz</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("https://ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app/#franz");
                          alert("Link copied to clipboard!");
                        }}
                        className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold cursor-pointer"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. BAT / USDT REWARDS MANAGEMENT ENGINE & NOTIFICATIONS MODAL */}
      <FranzRewardsCenterModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        batBalance={rewardsState.batBalance}
        usdtBalance={rewardsState.usdtBalance}
        usdtRate={rewardsState.usdtRate}
        equivalentUsdt={rewardsState.equivalentUsdt}
        totalBatEarned={rewardsState.totalBatEarned}
        lifetimeActivities={rewardsState.lifetimeActivities}
        ledger={rewardsState.ledger}
        onRefresh={fetchRewards}
        onMarkNotificationsRead={handleMarkNotificationsRead}
      />

      {/* 10. FLOATING ONE KEY MOBILE WALLET MODAL */}
      {isOneKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none">
          <OneKeyApp onClose={() => setIsOneKeyModalOpen(false)} />
        </div>
      )}
    </div>
  );
};
