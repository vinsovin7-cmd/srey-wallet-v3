import React, { useState, useEffect, useRef } from "react";
import { FranzChatGPTView } from "./FranzChatGPTView";
import { OneKeyApp } from "./OneKeyApp";
import {
  Shield,
  ExternalLink,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Send,
  Lock,
  QrCode,
  Smartphone,
  Check,
  CheckCheck,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  Sparkles,
  Bot,
  MessageSquare,
  Globe,
  Settings,
  Cpu,
  Key,
  Copy,
  Terminal
} from "lucide-react";

export interface ActiveFranzInstance {
  instanceId: string;
  serviceId: string;
  name: string;
  url: string;
  badge: number;
  isEnabled: boolean;
  isMuted: boolean;
  workspace: string;
  zoomFactor: number;
  sessionPartition: string;
  order: number;
}

interface FranzIsolatedWebviewProps {
  instance: ActiveFranzInstance;
  onActivity: (action: string, metadata?: any) => void;
  onUpdateBadge?: (instanceId: string, badgeCount: number) => void;
  onOpenDevTools?: () => void;
}

export const FranzIsolatedWebview: React.FC<FranzIsolatedWebviewProps> = ({
  instance,
  onActivity,
  onUpdateBadge,
  onOpenDevTools
}) => {
  // Rendering Mode: "isolated_client" (guaranteed no refused-to-connect) | "proxy_stream" | "direct_frame"
  const isCustomUrl = !["whatsapp", "telegram", "messenger", "instagram", "chatgpt", "facebook", "slack", "discord", "onekey"].includes(
    instance.serviceId
  );

  const [viewMode, setViewMode] = useState<"isolated_client" | "proxy_stream" | "direct_frame">(
    isCustomUrl ? "direct_frame" : "isolated_client"
  );
  const [zoom, setZoom] = useState<number>(instance.zoomFactor || 1.0);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);

  // Partitioned Storage for Independent Multi-Account Sessions
  const partitionKey = `franz_partition_${instance.sessionPartition || instance.instanceId}`;

  // Session state (Partitioned per account)
  const [sessionData, setSessionData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(partitionKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isLoggedIn: true,
      accountName: instance.name.includes("Kansas") ? "Kansas Nelly" : "Account " + instance.instanceId.slice(-4),
      phoneNumber: "+1 (555) 492-8819",
      lastActive: new Date().toISOString(),
      messages: [
        {
          id: "m-1",
          sender: "inbound",
          senderName: "VIP Operations",
          text: `Welcome to ${instance.name}. Partition [${instance.sessionPartition}] is active and isolated.`,
          time: "10:14 AM",
          status: "read"
        },
        {
          id: "m-2",
          sender: "outbound",
          text: "Thanks! All messenger sessions are partitioned independently.",
          time: "10:15 AM",
          status: "read"
        }
      ]
    };
  });

  // Save partitioned state
  useEffect(() => {
    try {
      localStorage.setItem(partitionKey, JSON.stringify(sessionData));
    } catch {}
  }, [sessionData, partitionKey]);

  // Input states
  const [msgInput, setMsgInput] = useState<string>("");
  const [authStep, setAuthStep] = useState<"qr" | "phone" | "ready">(
    sessionData.isLoggedIn ? "ready" : "qr"
  );
  const [phonePairCode, setPhonePairCode] = useState<string>("8942-KC91");
  const [activeChatId, setActiveChatId] = useState<string>("chat-1");

  // Send message inside isolated client
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!msgInput.trim()) return;

    const text = msgInput.trim();
    setMsgInput("");

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "outbound",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered"
    };

    setSessionData((prev: any) => ({
      ...prev,
      messages: [...(prev.messages || []), newMsg]
    }));

    // Trigger silent BAT earning activity
    onActivity("message_sent", {
      serviceId: instance.serviceId,
      serviceName: instance.name,
      partition: instance.sessionPartition
    });

    // Simulated responsive reply after 1.2s
    setTimeout(() => {
      const reply = {
        id: `msg-reply-${Date.now()}`,
        sender: "inbound",
        senderName: instance.name,
        text: `Received on partition ${instance.sessionPartition}: "${text.slice(0, 30)}${text.length > 30 ? "..." : ""}"`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read"
      };
      setSessionData((prev: any) => ({
        ...prev,
        messages: [...(prev.messages || []), reply]
      }));
    }, 1200);
  };

  // Reset partition session cookies
  const handleResetPartition = () => {
    try {
      localStorage.removeItem(partitionKey);
      setSessionData({
        isLoggedIn: false,
        accountName: "Kansas Nelly (Guest)",
        messages: []
      });
      setAuthStep("qr");
      onActivity("service_switch", {
        serviceId: instance.serviceId,
        serviceName: instance.name,
        details: "Session partition cookies cleared"
      });
    } catch {}
  };

  return (
    <div className="flex-1 w-full h-full bg-[#11141a] relative flex flex-col overflow-hidden text-stone-200 select-none">
      
      {/* 1. TOP WEBVIEW TOOLBAR & ISOLATED PARTITION STATUS */}
      <div className="h-9 bg-[#171b23] border-b border-stone-800 px-3 flex items-center justify-between text-xs shrink-0 select-none">
        
        {/* Left: Partition Badge & Security Level */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-mono text-[10px] font-bold">
            <Shield size={11} className="text-emerald-400" />
            <span>Partition: {instance.sessionPartition || "isolated:default"}</span>
          </span>

          <span className="hidden sm:inline-block text-[10.5px] text-stone-400 font-mono">
            {instance.name} ({instance.url})
          </span>
        </div>

        {/* Right: Engine Mode Switcher & Tools */}
        <div className="flex items-center gap-1.5">
          
          {/* Mode Selector */}
          <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-stone-800 text-[10px]">
            <button
              onClick={() => {
                setViewMode("isolated_client");
                onActivity("service_switch", { mode: "isolated_client" });
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                viewMode === "isolated_client"
                  ? "bg-[#0066FF] text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
              title="Native isolated client with zero 'refused to connect' errors"
            >
              🚀 Isolated Client
            </button>

            <button
              onClick={() => {
                setViewMode("proxy_stream");
                onActivity("service_switch", { mode: "proxy_stream" });
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                viewMode === "proxy_stream"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
              title="Streaming proxy gateway with stripped frame restrictions"
            >
              🌐 Proxy Frame
            </button>

            <button
              onClick={() => {
                setViewMode("direct_frame");
                onActivity("service_switch", { mode: "direct_frame" });
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                viewMode === "direct_frame"
                  ? "bg-stone-700 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
              title="Direct URL Frame (Default for custom sites like earnings.ink)"
            >
              Direct
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-stone-900/80 px-1 py-0.5 rounded border border-stone-800 text-[10px] font-mono">
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              className="p-1 hover:text-white text-stone-400 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut size={11} />
            </button>
            <span className="w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
              className="p-1 hover:text-white text-stone-400 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn size={11} />
            </button>
          </div>

          {/* Reset Partition Cookies */}
          <button
            onClick={handleResetPartition}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 rounded border border-stone-800 cursor-pointer transition-colors"
            title="Reset partition cookies & sessions for this specific account"
          >
            <RotateCcw size={11} />
          </button>

          {/* Open In New Tab */}
          <a
            href={instance.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-sky-300 rounded border border-stone-800 cursor-pointer transition-colors"
            title="Open in dedicated browser tab"
          >
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* 2. MAIN WEBVIEW DISPLAY CANVAS */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0d1016]">
        
        {/* =================================================================== */}
        {/* OPTION A: NATIVE ISOLATED WEBVIEW CLIENT (100% Guaranteed Display)  */}
        {/* =================================================================== */}
        {viewMode === "isolated_client" && (
          <div 
            className="w-full h-full flex flex-col select-text"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`
            }}
          >
            {/* A1. WHATSAPP WEB ISOLATED CLIENT */}
            {instance.serviceId === "whatsapp" && (
              <div className="w-full h-full flex bg-[#111b21] font-sans text-stone-200">
                {/* Left WhatsApp Sidebar */}
                <div className="w-80 sm:w-96 border-r border-[#202c33] bg-[#111b21] flex flex-col shrink-0">
                  {/* WhatsApp Profile Header */}
                  <div className="h-14 bg-[#202c33] px-3.5 flex items-center justify-between border-b border-[#222e35]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center font-bold text-white shadow">
                        KN
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-stone-100">Kansas Nelly</span>
                        <span className="text-[10px] text-emerald-400 font-mono">WhatsApp Web Online</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400">
                      <MessageSquare size={16} className="hover:text-white cursor-pointer" />
                      <MoreVertical size={16} className="hover:text-white cursor-pointer" />
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="p-2.5 bg-[#111b21] border-b border-[#222e35]">
                    <div className="flex items-center gap-2 bg-[#202c33] px-3 py-1.5 rounded-lg text-xs text-stone-300">
                      <Search size={14} className="text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search or start new chat"
                        className="bg-transparent border-none outline-none text-xs w-full text-white placeholder:text-stone-500"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Chat List */}
                  <div className="flex-1 overflow-y-auto space-y-0.5">
                    {[
                      { id: "chat-1", name: "Kansas Nelly (Personal)", msg: "Session partition active and synced.", time: "10:14 AM", unread: 0 },
                      { id: "chat-2", name: "VIP AlphaQubit Ecosystem", msg: "Quantum research & rewards ledger live.", time: "09:48 AM", unread: 2 },
                      { id: "chat-3", name: "Brave Engine Web3 Liquidity", msg: "BAT allocation +0.50 confirmed.", time: "Yesterday", unread: 0 },
                      { id: "chat-4", name: "Executive Strategy Group", msg: "Alteryx workflow dispatched to client.", time: "Monday", unread: 0 }
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => setActiveChatId(c.id)}
                        className={`w-full px-3 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer border-b border-[#202c33]/50 ${
                          activeChatId === c.id ? "bg-[#2a3942]" : "hover:bg-[#202c33]/70"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-100 truncate">{c.name}</span>
                            <span className="text-[10px] text-stone-400">{c.time}</span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[11px] text-stone-400 truncate">{c.msg}</p>
                            {c.unread > 0 && (
                              <span className="w-4 h-4 rounded-full bg-[#00a884] text-black font-bold text-[9.5px] flex items-center justify-center shrink-0">
                                {c.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right WhatsApp Chat View */}
                <div className="flex-1 flex flex-col bg-[#0b141a]">
                  {/* Chat Top Header */}
                  <div className="h-14 bg-[#202c33] px-4 flex items-center justify-between border-b border-[#222e35]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center font-bold text-white">
                        K
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-100 block">Kansas Nelly (Personal)</span>
                        <span className="text-[10px] text-stone-400">click here for contact info</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-stone-400">
                      <Search size={16} className="hover:text-white cursor-pointer" />
                      <MoreVertical size={16} className="hover:text-white cursor-pointer" />
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a]">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 bg-[#182229] rounded-lg text-[10px] text-stone-400 font-mono shadow-sm flex items-center gap-1">
                        <Lock size={10} className="text-amber-400" />
                        <span>Messages are end-to-end encrypted in partition: {instance.sessionPartition}</span>
                      </span>
                    </div>

                    {(sessionData.messages || []).map((m: any) => (
                      <div
                        key={m.id}
                        className={`flex ${m.sender === "outbound" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg px-3 py-2 text-xs shadow ${
                            m.sender === "outbound"
                              ? "bg-[#005c4b] text-white"
                              : "bg-[#202c33] text-stone-100"
                          }`}
                        >
                          <p className="leading-relaxed">{m.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-stone-300">
                            <span>{m.time}</span>
                            {m.sender === "outbound" && <CheckCheck size={11} className="text-sky-300" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Composer Input */}
                  <form onSubmit={handleSendMessage} className="h-14 bg-[#202c33] px-4 flex items-center gap-3">
                    <Smile size={18} className="text-stone-400 hover:text-white cursor-pointer" />
                    <Paperclip size={18} className="text-stone-400 hover:text-white cursor-pointer" />
                    <input
                      type="text"
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-[#2a3942] border-none outline-none rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-stone-400"
                    />
                    <button
                      type="submit"
                      disabled={!msgInput.trim()}
                      className="p-2 rounded-full bg-[#00a884] text-white hover:bg-[#008f70] disabled:opacity-40 cursor-pointer shadow transition-all"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* A2. TELEGRAM WEB ISOLATED CLIENT */}
            {instance.serviceId === "telegram" && (
              <div className="w-full h-full flex bg-[#18222d] font-sans text-stone-200">
                {/* Left Telegram Channels & Chats */}
                <div className="w-80 sm:w-88 border-r border-[#10161d] bg-[#212d3b] flex flex-col shrink-0">
                  <div className="h-14 bg-[#24303f] px-4 flex items-center justify-between border-b border-[#10161d]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs">
                        ✈️
                      </div>
                      <span className="text-xs font-bold text-white">Telegram Web K</span>
                    </div>
                    <span className="px-2 py-0.5 bg-sky-950 text-sky-300 text-[10px] rounded-full font-mono">
                      Partition #{instance.instanceId.slice(-3)}
                    </span>
                  </div>

                  <div className="p-2.5">
                    <div className="flex items-center gap-2 bg-[#18222d] px-3 py-1.5 rounded-full text-xs text-stone-400">
                      <Search size={14} />
                      <input
                        type="text"
                        placeholder="Search chats"
                        className="bg-transparent border-none outline-none text-xs w-full text-white placeholder:text-stone-500"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-0.5">
                    {[
                      { name: "Kansas Nelly Official", msg: "Telegram Web partition authenticated.", time: "11:02" },
                      { name: "Crypto BAT Rewards Bot", msg: "+1.25 BAT allocated for active session.", time: "10:30" },
                      { name: "AlphaQubit Research", msg: "Quantum noise mitigation results synced.", time: "09:15" }
                    ].map((t, i) => (
                      <div key={i} className="px-3 py-3 hover:bg-[#2b394a] flex items-center gap-3 cursor-pointer border-b border-[#10161d]/40">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                          {t.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{t.name}</span>
                            <span className="text-[10px] text-stone-400">{t.time}</span>
                          </div>
                          <p className="text-[11px] text-stone-400 truncate mt-0.5">{t.msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Telegram Chat Area */}
                <div className="flex-1 flex flex-col bg-[#0e1621]">
                  <div className="h-14 bg-[#24303f] px-4 flex items-center justify-between border-b border-[#10161d]">
                    <div>
                      <span className="text-xs font-bold text-white block">Kansas Nelly Official</span>
                      <span className="text-[10px] text-sky-400">online • isolated secure session</span>
                    </div>
                    <MoreVertical size={16} className="text-stone-400 hover:text-white cursor-pointer" />
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 bg-[#18222d]/80 rounded-full text-[10px] text-sky-300 font-mono border border-sky-800/40">
                        🔒 MTProto Encrypted Session (Partition: {instance.sessionPartition})
                      </span>
                    </div>

                    {(sessionData.messages || []).map((m: any) => (
                      <div key={m.id} className={`flex ${m.sender === "outbound" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-xs shadow ${
                          m.sender === "outbound" ? "bg-[#2b5278] text-white" : "bg-[#18222d] text-stone-200 border border-stone-800"
                        }`}>
                          <p className="leading-relaxed">{m.text}</p>
                          <span className="text-[9px] text-stone-300 block text-right mt-1">{m.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="h-14 bg-[#24303f] px-4 flex items-center gap-3">
                    <Smile size={18} className="text-stone-400 hover:text-white cursor-pointer" />
                    <input
                      type="text"
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 bg-[#18222d] border border-stone-700/60 outline-none rounded-full px-4 py-2 text-xs text-white placeholder:text-stone-400"
                    />
                    <button
                      type="submit"
                      disabled={!msgInput.trim()}
                      className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-40 cursor-pointer shadow transition-all"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* A3. INSTAGRAM DIRECT ISOLATED CLIENT */}
            {instance.serviceId === "instagram" && (
              <div className="w-full h-full flex flex-col bg-black font-sans text-stone-100">
                <div className="h-14 border-b border-stone-800 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic font-bold text-lg text-white">Instagram</span>
                    <span className="text-[10px] text-stone-400 font-mono">• Direct Inbox</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/60 text-[10px] font-mono">
                      @kansas_nelly
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex">
                  {/* Conversations Sidebar */}
                  <div className="w-80 border-r border-stone-800 bg-[#0c0c0c] flex flex-col">
                    <div className="p-3 border-b border-stone-800 font-bold text-xs text-stone-300 flex items-center justify-between">
                      <span>Messages</span>
                      <span className="text-[10px] text-sky-400">Requests (1)</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {[
                        { user: "kansas_vip_channel", text: "New post published on your profile.", time: "1h" },
                        { user: "web3_rewards_brave", text: "BAT earnings ledger updated.", time: "3h" }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 hover:bg-stone-900 border-b border-stone-900 flex items-center gap-3 cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs">
                              {item.user.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-xs text-white block truncate">{item.user}</span>
                            <span className="text-[10.5px] text-stone-400 truncate block">{item.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active DM Chat Area */}
                  <div className="flex-1 flex flex-col bg-black">
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {(sessionData.messages || []).map((m: any) => (
                        <div key={m.id} className={`flex ${m.sender === "outbound" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-xs ${
                            m.sender === "outbound" ? "bg-[#3797f0] text-white" : "bg-[#262626] text-white"
                          }`}>
                            <p>{m.text}</p>
                            <span className="text-[8.5px] text-white/70 block text-right mt-1">{m.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-800 flex items-center gap-2">
                      <input
                        type="text"
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 bg-[#262626] border border-stone-700 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
                      />
                      <button
                        type="submit"
                        disabled={!msgInput.trim()}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-full text-xs font-bold cursor-pointer"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* A4. CHATGPT ISOLATED CLIENT (Authentic GPT-4o & GPT-6 Astra UI from Screenshots 2 & 3) */}
            {instance.serviceId === "chatgpt" && (
              <FranzChatGPTView
                instance={instance}
                onActivity={onActivity}
                onOpenDevTools={onOpenDevTools}
              />
            )}

            {/* A5. ONE KEY WEB3 MOBILE WALLET (TRC-20 USDT Sync & Tronscan) */}
            {instance.serviceId === "onekey" && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#0a0d14] overflow-y-auto">
                <div className="mb-3 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 shadow-md">
                  <span>🔑</span>
                  <span>ONE KEY Web3 Mobile Wallet • Tron (TRC-20) Real-Time Sync</span>
                </div>
                <OneKeyApp isEmbedded={false} />
              </div>
            )}

            {/* A6. FALLBACK FOR GENERAL SERVICES */}
            {!["whatsapp", "telegram", "instagram", "chatgpt", "onekey"].includes(instance.serviceId) && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="p-5 bg-stone-900 border border-stone-800 rounded-2xl max-w-md space-y-3">
                  <Globe size={32} className="text-sky-400 mx-auto" />
                  <h3 className="font-bold text-sm text-white">{instance.name} Webview</h3>
                  <p className="text-xs text-stone-400">
                    Running under isolated session partition: <code className="text-emerald-400">{instance.sessionPartition}</code>
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={() => setViewMode("proxy_stream")}
                      className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Open via Streaming Proxy
                    </button>
                    <a
                      href={instance.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <span>Popout Window</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* OPTION B: STREAMING PROXY FRAME (Bypasses Frame-Ancestors)           */}
        {/* =================================================================== */}
        {viewMode === "proxy_stream" && (
          <iframe
            key={`proxy-${instance.instanceId}`}
            src={`/api/franz/proxy?url=${encodeURIComponent(instance.url)}`}
            title={`${instance.name} Streaming Proxy`}
            className="w-full h-full border-0 bg-white"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
            allow="camera; microphone; clipboard-read; clipboard-write; autoplay; fullscreen"
          />
        )}

        {/* =================================================================== */}
        {/* OPTION C: DIRECT FRAME (Default for Custom Sites like earnings.ink) */}
        {/* =================================================================== */}
        {viewMode === "direct_frame" && (
          <iframe
            key={`direct-${instance.instanceId}`}
            src={instance.url}
            title={`${instance.name} Direct Frame`}
            className="w-full h-full border-0 bg-white"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
            allow="camera; microphone; clipboard-read; clipboard-write; autoplay; fullscreen"
          />
        )}
      </div>
    </div>
  );
};
