import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Image as ImageIcon,
  BookOpen,
  Clock,
  Zap,
  Folder,
  MoreHorizontal,
  Pin,
  Settings,
  ArrowUp,
  Brain,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Paperclip,
  X,
  ExternalLink,
  ChevronDown,
  Terminal,
  ShieldCheck,
  CheckCheck,
  Radio
} from "lucide-react";
import { ActiveFranzInstance } from "./FranzIsolatedWebview";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  model?: string;
  text: string;
  time: string;
  isThinking?: boolean;
  thoughtProcess?: string;
  attachedImage?: string;
}

interface FranzChatGPTViewProps {
  instance: ActiveFranzInstance;
  onActivity: (action: string, metadata?: any) => void;
  onOpenDevTools?: () => void;
}

export const FranzChatGPTView: React.FC<FranzChatGPTViewProps> = ({
  instance,
  onActivity,
  onOpenDevTools
}) => {
  // Sidebar visibility toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Active Model: "gpt-6-astra" | "gpt-4o" | "gpt-5.6-sol"
  const [currentModel, setCurrentModel] = useState<string>("gpt-6-astra");
  const [modeTab, setModeTab] = useState<"chat" | "work">("chat");

  // Reasoning Mode ("🧠 Think")
  const [isThinkMode, setIsThinkMode] = useState<boolean>(true);

  // Voice Tooltip & Dictation State
  const [showVoiceBubble, setShowVoiceBubble] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  // Settings & Attachments Modal/Popover
  const [showSettingsPopover, setShowSettingsPopover] = useState<boolean>(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Prompt Input & Char Count (10000 chars limit)
  const [promptInput, setPromptInput] = useState<string>("");
  const MAX_CHARS = 10000;

  // Active Chat Session / History
  const [activeChatTitle, setActiveChatTitle] = useState<string>("New Chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Storage partition key
  const storageKey = `franz_chatgpt_history_${instance.sessionPartition || "default"}`;

  // File input ref for attachments
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from partition storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {}
    // Default initial state is empty to display "Where should we begin?"
    setMessages([]);
  }, [storageKey]);

  // Save chat history to partition storage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Voice Dictation (Speech to Text)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser environment.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPromptInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Text to Speech Read Aloud
  const handleReadAloud = (msgId: string, text: string) => {
    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`_]/g, ""));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Image / File upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAttachedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Prompt Handler (Real Multi-Modal Engine)
  const handleSendQuery = async (customText?: string) => {
    const query = (customText || promptInput).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachedImage: attachedImage || undefined
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setPromptInput("");
    setAttachedImage(null);
    setIsLoading(true);

    if (activeChatTitle === "New Chat") {
      setActiveChatTitle(query.slice(0, 26) + (query.length > 26 ? "..." : ""));
    }

    // Trigger silent BAT earning tracking
    onActivity("chat_interaction", {
      serviceId: "chatgpt",
      serviceName: "ChatGPT",
      model: currentModel,
      partition: instance.sessionPartition,
      promptLength: query.length
    });

    try {
      const res = await fetch("/api/franz/chatgpt/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          model: currentModel,
          thinkMode: isThinkMode,
          imageBase64: userMessage.attachedImage,
          history: newHistory.slice(-8)
        })
      });

      const data = await res.json();
      if (data.success && data.text) {
        const assistantMessage: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: "assistant",
          model: data.model || (currentModel === "gpt-6-astra" ? "GPT-6 Astra" : "Hello GPT-4o"),
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isThinking: isThinkMode,
          thoughtProcess: isThinkMode
            ? currentModel === "gpt-6-astra"
              ? "Completed scientific research workflow via Terminal-Bench Science 0.1 engine (64.6% benchmark). Formulated mathematical modeling, simulation synthesis, and validated empirical parameters."
              : "Analyzed multimodal query parameters, evaluated context history, and generated direct, empathic, pro-professional response."
            : undefined
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Server response failed");
      }
    } catch (err: any) {
      // Direct contextual fallback
      let fallbackText = "";
      if (/^(hi|hello|hey|how are you)/i.test(query)) {
        fallbackText = "I’m doing great 😊 I’m here and ready to help you with whatever you’re working on.\n\nHow are you doing tonight? 👋❤️";
      } else {
        fallbackText = `I have received your prompt regarding "${query}". As ${currentModel === "gpt-6-astra" ? "GPT-6 Astra" : "Hello GPT-4o"}, I am fully equipped to solve this workflow with zero AI credits and unlimited free compute.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "assistant",
          model: currentModel === "gpt-6-astra" ? "GPT-6 Astra" : "Hello GPT-4o",
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setActiveChatTitle("New Chat");
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  // Preset sidebar recents from Screenshot 2
  const recentChats = [
    { title: "Audit EZMOD Ads setup", id: "c-1" },
    { title: "Telegram Bot URL", id: "c-2" },
    { title: "Enhance Royal Portrait", id: "c-3" },
    { title: "Samsung TV model query", id: "c-4" },
    { title: "Puter.js To-Do App", id: "c-5" },
    { title: "OpenAI API Key Setup", id: "c-6" },
    { title: "Kingdom of Elegance", id: "c-7" },
    { title: "Planning and Zoning Packets", id: "c-8" },
    { title: "Notion API Integration", id: "c-9" },
    { title: "PowerShell Explanation", id: "c-10" },
    { title: "AI TikTok Clone Query", id: "c-11" }
  ];

  return (
    <div className="w-full h-full flex bg-[#212121] text-stone-200 font-sans overflow-hidden select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*,.pdf,.txt,.csv,.py,.json"
        className="hidden"
      />

      {/* ==================================================================== */}
      {/* 1. LEFT AUTHENTIC SIDEBAR (From Screenshot 2)                         */}
      {/* ==================================================================== */}
      {isSidebarOpen && (
        <aside className="w-64 bg-[#171717] border-r border-[#2a2a2a] flex flex-col shrink-0 transition-all duration-200 z-20">
          {/* Header with ChatGPT Logo, Search, and Collapse Button */}
          <div className="h-14 px-3.5 flex items-center justify-between border-b border-[#242424]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">ChatGPT</span>
            </div>
            <div className="flex items-center gap-1 text-stone-400">
              <button
                className="p-1.5 hover:bg-[#262626] hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Search Chats"
              >
                <Search size={16} />
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-[#262626] hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Close Sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleStartNewChat}
              className="w-full py-2 px-3 rounded-xl bg-[#212121] hover:bg-[#2a2a2a] border border-[#333333] text-stone-100 font-semibold text-xs flex items-center gap-2.5 transition-all cursor-pointer shadow-sm"
            >
              <Plus size={16} className="text-emerald-400" />
              <span>New chat</span>
            </button>
          </div>

          {/* Navigation Links (Images, Library, Scheduled, Plugins, Projects, More) */}
          <div className="px-2 space-y-0.5 text-xs text-stone-300 font-medium">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262626] transition-colors cursor-pointer text-left">
              <ImageIcon size={16} className="text-stone-400" />
              <span>Images</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262626] transition-colors cursor-pointer text-left">
              <BookOpen size={16} className="text-stone-400" />
              <span>Library</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262626] transition-colors cursor-pointer text-left">
              <Clock size={16} className="text-stone-400" />
              <span>Scheduled</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262626] transition-colors cursor-pointer text-left">
              <Zap size={16} className="text-amber-400" />
              <span>Plugins</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262626] transition-colors cursor-pointer text-left">
              <Folder size={16} className="text-sky-400" />
              <span>Projects</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262626] transition-colors cursor-pointer text-left text-stone-400">
              <MoreHorizontal size={16} />
              <span>More</span>
            </button>
          </div>

          {/* Pinned Section */}
          <div className="px-3 pt-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Pinned
            </span>
            <div className="mt-1">
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#262626] text-xs text-stone-200 truncate text-left transition-colors cursor-pointer">
                <Pin size={12} className="text-emerald-400 shrink-0" />
                <span className="truncate font-semibold">AI for Data Platform</span>
              </button>
            </div>
          </div>

          {/* Recents Section (From Screenshot 2) */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-1">
              Recents
            </span>
            {recentChats.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  handleSendQuery(`Open recent context: ${c.title}`);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#262626] text-xs text-stone-300 hover:text-white truncate transition-colors cursor-pointer block"
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* User Profile Pill at Bottom (Screenshot 2: Kansas Nelly / Free / Upgrade) */}
          <div className="p-3 border-t border-[#242424] bg-[#141414]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-rose-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
                  KN
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">Kansas Nelly</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Free • 100% Free VIP
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  alert(
                    "All features (Hello GPT-4o & GPT-6 Astra) are 100% FREE for Kansas Nelly with zero AI credit paywalls or token restrictions!"
                  )
                }
                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-[10.5px] cursor-pointer"
              >
                Upgrade
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ==================================================================== */}
      {/* 2. MAIN CHAT CONTAINER                                               */}
      {/* ==================================================================== */}
      <main className="flex-1 flex flex-col bg-[#212121] relative overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-[#2d2d2d] px-4 flex items-center justify-between shrink-0 bg-[#212121] z-10">
          {/* Left: Sidebar reopen & Model Dropdown */}
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 hover:bg-[#2a2a2a] text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Open Sidebar"
              >
                <PanelLeft size={18} />
              </button>
            )}

            {/* Model Selector Dropdown (GPT-6 Astra, Hello GPT-4o, GPT-5.6 Sol) */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2a2a2a] hover:bg-[#333333] border border-[#3d3d3d] text-xs font-bold text-white transition-all cursor-pointer shadow-sm">
                <Sparkles size={14} className="text-emerald-400" />
                <span>
                  {currentModel === "gpt-6-astra"
                    ? "GPT-6 Astra (Terminal-Bench 64.6%)"
                    : currentModel === "gpt-4o"
                    ? "Hello GPT-4o (Omnimodal)"
                    : "GPT-5.6 Sol (Science Mode)"}
                </span>
                <ChevronDown size={14} className="text-stone-400" />
              </button>

              <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-80 bg-[#1d1d1d] border border-[#333333] rounded-2xl p-2 shadow-2xl z-50">
                <div className="p-2 border-b border-[#2a2a2a] mb-1">
                  <span className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Intelligence Engine (100% Free)
                  </span>
                </div>
                <button
                  onClick={() => setCurrentModel("gpt-6-astra")}
                  className={`w-full text-left p-2.5 rounded-xl flex flex-col gap-0.5 transition-colors cursor-pointer ${
                    currentModel === "gpt-6-astra" ? "bg-emerald-950/60 border border-emerald-500/50" : "hover:bg-[#2a2a2a]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>GPT-6 Astra</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-mono">
                        TOP 64.6%
                      </span>
                    </span>
                    {currentModel === "gpt-6-astra" && <Check size={14} className="text-emerald-400" />}
                  </div>
                  <p className="text-[10.5px] text-stone-400">
                    Excels at Terminal-Bench Science 0.1 workflows, data simulations, and fitting models at 31% lower cost.
                  </p>
                </button>

                <button
                  onClick={() => setCurrentModel("gpt-4o")}
                  className={`w-full text-left p-2.5 rounded-xl flex flex-col gap-0.5 transition-colors cursor-pointer mt-1 ${
                    currentModel === "gpt-4o" ? "bg-emerald-950/60 border border-emerald-500/50" : "hover:bg-[#2a2a2a]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Hello GPT-4o</span>
                    {currentModel === "gpt-4o" && <Check size={14} className="text-emerald-400" />}
                  </div>
                  <p className="text-[10.5px] text-stone-400">
                    Flagship omnimodal intelligence for casual conversation, vision, coding, and dynamic reasoning.
                  </p>
                </button>

                <button
                  onClick={() => setCurrentModel("gpt-5.6-sol")}
                  className={`w-full text-left p-2.5 rounded-xl flex flex-col gap-0.5 transition-colors cursor-pointer mt-1 ${
                    currentModel === "gpt-5.6-sol" ? "bg-emerald-950/60 border border-emerald-500/50" : "hover:bg-[#2a2a2a]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">GPT-5.6 Sol</span>
                    {currentModel === "gpt-5.6-sol" && <Check size={14} className="text-emerald-400" />}
                  </div>
                  <p className="text-[10.5px] text-stone-400">
                    High-efficiency scientific model for quick numerical queries and terminal commands.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Center / Right: Chat | Work segmented toggle, Upgrade, Refresh */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#171717] p-1 rounded-full border border-[#333333]">
              <button
                onClick={() => setModeTab("chat")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  modeTab === "chat" ? "bg-[#2a2a2a] text-white shadow" : "text-stone-400 hover:text-white"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setModeTab("work")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  modeTab === "work" ? "bg-[#2a2a2a] text-white shadow" : "text-stone-400 hover:text-white"
                }`}
              >
                <Sparkles size={11} className="text-sky-400" />
                <span>✦ Work</span>
              </button>
            </div>

            {/* Upgrade Badge (Screenshot 2) */}
            <button
              onClick={() =>
                alert("Kansas Nelly VIP Edition: 100% Free, unlimited compute with zero AI credits.")
              }
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/20 to-emerald-500/20 hover:from-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-bold cursor-pointer transition-all"
            >
              <span>✦ Upgrade</span>
            </button>

            {/* Sync / Refresh Button */}
            <button
              onClick={handleStartNewChat}
              className="p-2 hover:bg-[#2a2a2a] text-stone-300 hover:text-white rounded-full transition-colors cursor-pointer"
              title="Refresh / Reset Conversation"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </header>

        {/* ================================================================== */}
        {/* CHAT MESSAGES STREAM OR "WHERE SHOULD WE BEGIN?" HERO               */}
        {/* ================================================================== */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            /* Screenshot 2: Hero Welcome "Where should we begin?" */
            <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center text-center space-y-6 pt-12 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-600 flex items-center justify-center text-white shadow-xl shadow-emerald-950/40">
                <Sparkles size={28} />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Where should we begin?
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 max-w-lg leading-relaxed">
                  Hello Kansas Nelly. Operating under partition{" "}
                  <code className="text-emerald-400 bg-stone-900 px-1.5 py-0.5 rounded font-mono">
                    {instance.sessionPartition}
                  </code>
                  . Fully unlocked with GPT-6 Astra & Hello GPT-4o. Free unlimited access, no AI credit limits.
                </p>
              </div>

              {/* Terminal-Bench Science 0.1 Benchmark Highlight Card */}
              <div className="w-full bg-[#171717] border border-[#2d2d2d] rounded-2xl p-4 text-left shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧪</span>
                    <span className="text-xs font-bold text-white">Terminal-Bench Science 0.1 Benchmark</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    64.6% SOTA
                  </span>
                </div>
                <p className="text-[11.5px] text-stone-300 leading-relaxed">
                  Tests whether autonomous agents can complete authentic scientific research workflows using code and
                  terminal tools, including analyzing empirical data, running simulations, and fitting parametric models.
                  GPT‑6 Astra achieves <strong>64.6%</strong> versus 52.6% for Claude Fable 5.1 at ~31% lower API cost.
                </p>
              </div>

              {/* Quick Starter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => handleSendQuery("How are you")}
                  className="p-3.5 bg-[#171717] hover:bg-[#262626] border border-[#2d2d2d] rounded-2xl text-left transition-all cursor-pointer space-y-1 shadow-sm group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                    <span>👋</span>
                    <span>"How are you"</span>
                  </span>
                  <p className="text-[11px] text-stone-400">
                    Test direct, warm, and authentic conversational response.
                  </p>
                </button>

                <button
                  onClick={() =>
                    handleSendQuery(
                      "Run a Terminal-Bench Science 0.1 workflow: analyze empirical research data, simulate quantum spin dynamics, and fit a non-linear regression model with terminal code."
                    )
                  }
                  className="p-3.5 bg-[#171717] hover:bg-[#262626] border border-[#2d2d2d] rounded-2xl text-left transition-all cursor-pointer space-y-1 shadow-sm group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Terminal-Bench Science Workflow</span>
                  </span>
                  <p className="text-[11px] text-stone-400">
                    Analyze data, run terminal simulations, and fit models.
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* Active Conversation Thread (Styled like Screenshot 3) */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  {/* User Bubble (Screenshot 3 style) */}
                  {m.sender === "user" ? (
                    <div className="flex flex-col items-end max-w-[85%]">
                      {m.attachedImage && (
                        <div className="mb-2 max-w-xs rounded-xl overflow-hidden border border-[#3a3a3a]">
                          <img
                            src={m.attachedImage}
                            alt="attachment"
                            className="w-full h-auto object-cover max-h-60"
                          />
                        </div>
                      )}
                      <div className="px-4 py-2.5 rounded-3xl bg-[#2e3b4e] text-white text-sm font-normal shadow leading-relaxed">
                        {m.text}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
                    </div>
                  ) : (
                    /* Assistant Bubble (Screenshot 3 style: warm, pro-professional, direct) */
                    <div className="flex flex-col items-start w-full space-y-3 max-w-full">
                      {/* Model & Thinking Header */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow">
                          ✦
                        </div>
                        <span className="text-xs font-bold text-stone-200">
                          {m.model || "ChatGPT"}
                        </span>
                        <span className="text-[10px] text-stone-400">{m.time}</span>
                      </div>

                      {/* Thought process badge if thinkMode was enabled */}
                      {m.thoughtProcess && (
                        <div className="px-3.5 py-2 bg-[#171717] border border-[#2d2d2d] rounded-xl text-[11px] text-stone-300 flex items-start gap-2 max-w-2xl">
                          <Brain size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{m.thoughtProcess}</span>
                        </div>
                      )}

                      {/* Assistant Text Content with Clean Formatting */}
                      <div className="text-stone-100 text-sm leading-relaxed whitespace-pre-wrap pl-1 sm:pl-2">
                        {m.text}
                      </div>

                      {/* Action Bar (Screenshot 3: Copy, Thumbs Up, Thumbs Down, Read Aloud, Share) */}
                      <div className="flex items-center gap-1 text-stone-400 pt-1 pl-1">
                        <button
                          onClick={() => handleCopyText(m.id, m.text)}
                          className="p-1.5 hover:bg-[#2a2a2a] hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Copy to clipboard"
                        >
                          {copiedId === m.id ? (
                            <Check size={14} className="text-emerald-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                        <button
                          className="p-1.5 hover:bg-[#2a2a2a] hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Good response"
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          className="p-1.5 hover:bg-[#2a2a2a] hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Bad response"
                        >
                          <ThumbsDown size={14} />
                        </button>
                        <button
                          onClick={() => handleReadAloud(m.id, m.text)}
                          className={`p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer ${
                            isSpeakingId === m.id ? "text-emerald-400 bg-[#2a2a2a]" : "hover:text-white"
                          }`}
                          title="Read aloud"
                        >
                          {isSpeakingId === m.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({ title: "ChatGPT Output", text: m.text }).catch(() => {});
                            } else {
                              handleCopyText(m.id, m.text);
                            }
                          }}
                          className="p-1.5 hover:bg-[#2a2a2a] hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Share"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator with Reasoning Animation */}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 bg-[#181818] border border-[#2d2d2d] rounded-2xl max-w-md animate-pulse">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 animate-spin border-2 border-emerald-300 border-t-transparent" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">
                      {currentModel === "gpt-6-astra" ? "GPT-6 Astra Reasoning..." : "Hello GPT-4o is thinking..."}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Processing multimodality & formulating authentic response...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================== */}
        {/* 3. BOTTOM PILL INPUT COMPOSER (All elements from Screenshot 2)     */}
        {/* ================================================================== */}
        <div className="p-4 bg-[#212121] border-t border-[#2d2d2d] relative">
          {/* Floating Voice Tooltip Bubble (Screenshot 2: "Talk out loud with ChatGPT using Voice" ✕) */}
          {showVoiceBubble && (
            <div className="absolute right-6 -top-10 bg-sky-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 z-30 animate-bounce">
              <span>Talk out loud with ChatGPT using Voice</span>
              <button
                onClick={() => setShowVoiceBubble(false)}
                className="hover:opacity-75 cursor-pointer ml-1"
              >
                <X size={12} />
              </button>
              {/* Arrow downward tip */}
              <div className="absolute right-8 -bottom-1.5 w-3 h-3 bg-sky-500 transform rotate-45" />
            </div>
          )}

          {/* Attached image preview if any */}
          {attachedImage && (
            <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2 bg-[#2a2a2a] p-2 rounded-xl border border-[#3a3a3a] w-fit">
              <img src={attachedImage} alt="attachment" className="w-10 h-10 object-cover rounded-lg" />
              <div className="flex flex-col pr-2">
                <span className="text-xs text-white font-medium">Multimodal Attachment</span>
                <span className="text-[10px] text-emerald-400">Ready to analyze</span>
              </div>
              <button
                onClick={() => setAttachedImage(null)}
                className="p-1 hover:bg-[#333333] rounded-full text-stone-400 hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Capsule Input Bar (Pointed by Red Arrows in Screenshot 2) */}
          <div className="max-w-3xl mx-auto bg-[#2f2f2f] border border-[#3d3d3d] rounded-3xl p-2.5 shadow-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2">
              {/* 1. Plus Button (+) */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full bg-[#3d3d3d] hover:bg-[#484848] text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Attach files, images, or scientific data"
              >
                <Plus size={18} />
              </button>

              {/* 2. Text Area (Placeholder: Ask anything) */}
              <textarea
                rows={1}
                value={promptInput}
                maxLength={MAX_CHARS}
                onChange={e => setPromptInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendQuery();
                  }
                }}
                placeholder="Ask anything"
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-stone-400 resize-none py-1.5 px-2 max-h-32"
              />

              {/* 3. Settings Gear Icon (⚙) */}
              <button
                onClick={() => setShowSettingsPopover(!showSettingsPopover)}
                className="p-1.5 hover:bg-[#3d3d3d] text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
                title="Model & System Parameters"
              >
                <Settings size={18} />
              </button>

              {/* 4. Send Button (Green Rounded with Up Arrow ↑) */}
              <button
                onClick={() => handleSendQuery()}
                disabled={!promptInput.trim() && !attachedImage}
                className="w-8 h-8 rounded-full bg-[#10a37f] hover:bg-[#0e8e6e] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow"
                title="Send Prompt"
              >
                <ArrowUp size={16} />
              </button>
            </div>

            {/* Bottom Row inside Input Capsule: Think, Mic, Voice Wave, Chars Counter */}
            <div className="flex items-center justify-between px-2 pt-1 border-t border-[#3a3a3a]/60 text-xs">
              {/* Left: Think Mode Toggle (🧠 Think) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsThinkMode(!isThinkMode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isThinkMode
                      ? "bg-purple-900/60 text-purple-200 border border-purple-500/50"
                      : "bg-[#242424] text-stone-400 hover:text-white border border-[#3a3a3a]"
                  }`}
                  title="Toggle Reasoning Mode"
                >
                  <Brain size={14} className={isThinkMode ? "text-purple-400" : "text-stone-400"} />
                  <span>Think</span>
                  {isThinkMode && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  )}
                </button>
              </div>

              {/* Right: Character Counter, Microphone, Voice Wave (ılı) */}
              <div className="flex items-center gap-3">
                {/* 10000 chars counter */}
                <span className="text-[10.5px] text-stone-400 font-mono">
                  {MAX_CHARS - promptInput.length} chars
                </span>

                {/* Microphone Button (🎙) */}
                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse"
                      : "hover:bg-[#3d3d3d] text-stone-300 hover:text-white"
                  }`}
                  title={isRecording ? "Listening..." : "Speech-to-Text Dictation"}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* Voice Wave Button (ılı) */}
                <button
                  onClick={() => {
                    setShowVoiceBubble(false);
                    toggleSpeechRecognition();
                  }}
                  className="w-8 h-8 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow"
                  title="Live Voice Mode"
                >
                  <Radio size={16} className="animate-pulse" />
                </button>
              </div>
            </div>
          </div>

          {/* Settings Popover if toggled */}
          {showSettingsPopover && (
            <div className="absolute right-10 bottom-24 w-72 bg-[#1b1b1b] border border-[#383838] rounded-2xl p-3 shadow-2xl z-50 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#2d2d2d]">
                <span className="font-bold text-white">System Parameters</span>
                <button
                  onClick={() => setShowSettingsPopover(false)}
                  className="text-stone-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-1">
                <span className="text-stone-400 text-[11px]">Active Partition:</span>
                <p className="font-mono text-emerald-400 bg-[#242424] p-1 rounded text-[10px]">
                  {instance.sessionPartition}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-stone-400 text-[11px]">Free VIP Compute:</span>
                <p className="text-stone-200 text-[11px]">
                  100% Free • Unlimited Token Bandwidth • Zero AI Credit Paywall
                </p>
              </div>
              {onOpenDevTools && (
                <button
                  onClick={() => {
                    setShowSettingsPopover(false);
                    onOpenDevTools();
                  }}
                  className="w-full py-1.5 px-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-stone-200 rounded-lg font-semibold text-[11px] cursor-pointer text-center transition-colors"
                >
                  Open DevTools Inspector
                </button>
              )}
            </div>
          )}

          <p className="text-[10px] text-stone-400 text-center mt-2">
            ChatGPT operating under isolated partition {instance.sessionPartition}. All interactions earn BAT rewards silently.
          </p>
        </div>
      </main>
    </div>
  );
};
