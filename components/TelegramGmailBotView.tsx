import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Mail,
  Heart,
  ChevronDown,
  Columns,
  Maximize2
} from "lucide-react";

export interface GmailBotMessageItem {
  id: string;
  from: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  bodyText: string;
  date: string;
  timestamp: number;
  code?: string;
  category: "telegram_auth" | "datingarts_match" | "ecosystem" | "system";
  isRead: boolean;
  actions?: string[];
}

interface TelegramGmailBotViewProps {
  onBack?: () => void;
  onCodeSelect?: (code: string) => void;
  onAutoLogin?: (code: string) => void;
  activePhone?: string;
}

export const TelegramGmailBotView: React.FC<TelegramGmailBotViewProps> = ({
  onBack,
  onCodeSelect,
  onAutoLogin,
  activePhone
}) => {
  const [messages, setMessages] = useState<GmailBotMessageItem[]>([
    {
      id: "gm-da-1",
      from: "DatingArts <noreply@datingarts.com>",
      senderName: "DatingArts",
      senderEmail: "noreply@datingarts.com",
      subject: "You have a new match! See who it is",
      bodyText:
        "****************************************************************\n****************************************************************\n****************************************************************\n****************************************************************\n****************************************************************\n****************************************",
      date: "1:54 PM",
      timestamp: Date.now() - 240000,
      category: "datingarts_match",
      isRead: false,
      actions: ["↓ Show more", "Actions »"]
    },
    {
      id: "gm-tg-1",
      from: "Telegram <noreply@telegram.org>",
      senderName: "Telegram",
      senderEmail: "noreply@telegram.org",
      subject: "Your Code - 28636",
      bodyText:
        "Dear C'S,\nYour code is: 28636. Use it to access your account.\nIf you didn't request this, simply ignore this message.\nYours,\nThe Telegram Team",
      date: "1:56 PM",
      timestamp: Date.now() - 120000,
      code: "28636",
      category: "telegram_auth",
      isRead: false,
      actions: ["Actions »"]
    }
  ]);

  const [inputMessage, setInputMessage] = useState<string>("");
  const [showMenuDrawer, setShowMenuDrawer] = useState<boolean>(false);
  const [showMoreActionsId, setShowMoreActionsId] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [botStatusText, setBotStatusText] = useState<string | null>(null);
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [userEmail] = useState<string>("kansasnelly@gmail.com");

  // Fetch live messages from backend
  const fetchBotMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/telegram/gmail-bot/messages");
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.warn("Failed to fetch Gmail bot messages:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBotMessages();
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchBotMessages();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle Copy Code
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    if (onCodeSelect) {
      onCodeSelect(code);
    }
    setBotStatusText(`📋 Telegram Code (${code}) copied to clipboard and auto-filled!`);
    setTimeout(() => {
      setCopiedCodeId(null);
      setBotStatusText(null);
    }, 3500);
  };

  // Handle Instant Auto-Login
  const handleTriggerAutoLogin = (code: string) => {
    if (onAutoLogin) {
      onAutoLogin(code);
    } else if (onCodeSelect) {
      onCodeSelect(code);
    }
    setBotStatusText(`⚡ Verification code ${code} submitted for instant login!`);
    setTimeout(() => setBotStatusText(null), 3500);
  };

  // Handle Sending a Message to @GmailBot
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    // Push user message to list
    const userMsgItem: GmailBotMessageItem = {
      id: `usr-${Date.now()}`,
      from: `You <${userEmail}>`,
      senderName: "You",
      senderEmail: userEmail,
      subject: "Query to @GmailBot",
      bodyText: userText,
      date: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      timestamp: Date.now(),
      category: "system",
      isRead: true
    };
    setMessages((prev) => [userMsgItem, ...prev]);

    // Bot automatic reply
    setTimeout(async () => {
      let replySubject = "Gmail Bot Status Report";
      let replyBody = `Connected to ${userEmail}. Syncing unread messages and incoming security codes...`;
      let codeVal: string | undefined = undefined;

      if (userText.toLowerCase().includes("code") || userText.toLowerCase().includes("telegram")) {
        const freshCode = String(Math.floor(10000 + Math.random() * 90000));
        codeVal = freshCode;
        replySubject = `Your Code - ${freshCode}`;
        replyBody = `Dear C'S,\nYour code is: ${freshCode}. Use it to access your account.\nIf you didn't request this, simply ignore this message.\nYours,\nThe Telegram Team`;

        // Send to backend
        try {
          await fetch("/api/telegram/gmail-bot/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject: replySubject,
              bodyText: replyBody,
              from: "Telegram <noreply@telegram.org>",
              category: "telegram_auth",
              code: freshCode
            })
          });
        } catch (e) {}
      } else if (userText.toLowerCase().includes("match") || userText.toLowerCase().includes("dating")) {
        replySubject = "You have a new match! See who it is";
        replyBody = "❤️ New VIP match recommendation for Kansas Nelly! Adesuwa Okonkwo sent you an invitation. Open DatingArts to view photo and video profile.";
        try {
          await fetch("/api/telegram/gmail-bot/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject: replySubject,
              bodyText: replyBody,
              from: "DatingArts <noreply@datingarts.com>",
              category: "datingarts_match"
            })
          });
        } catch (e) {}
      }

      fetchBotMessages();
    }, 600);
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      m.subject.toLowerCase().includes(q) ||
      m.bodyText.toLowerCase().includes(q) ||
      m.from.toLowerCase().includes(q) ||
      (m.code && m.code.includes(q))
    );
  });

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0f1721] rounded-2xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col h-[740px] text-stone-100 font-sans">
      
      {/* 1. Header matching Telegram screenshot */}
      <div className="bg-[#17212b] px-4 py-3 border-b border-stone-800/80 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="Back to Telegram Hub"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[15px] text-white tracking-tight">Gmail Bot</h3>
              {/* Verified Blue Badge */}
              <div
                className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white shrink-0"
                title="Verified Official Telegram Bot"
              >
                <Check size={10} strokeWidth={3.5} />
              </div>
            </div>
            {/* Monthly Users in Coral/Red */}
            <p className="text-xs text-rose-500 font-medium leading-none mt-0.5">
              39,661 monthly users
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-1 text-stone-400">
          <button
            type="button"
            onClick={() => setShowSearchBox(!showSearchBox)}
            className="p-2 hover:text-white hover:bg-stone-800 rounded-lg transition cursor-pointer"
            title="Search Messages"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={fetchBotMessages}
            className={`p-2 hover:text-white hover:bg-stone-800 rounded-lg transition cursor-pointer ${
              isLoading ? "animate-spin text-sky-400" : ""
            }`}
            title="Refresh Gmail Feed"
          >
            <RefreshCw size={18} />
          </button>
          <button
            type="button"
            onClick={() => setShowMoreActionsId(showMoreActionsId ? null : "header_menu")}
            className="p-2 hover:text-white hover:bg-stone-800 rounded-lg transition cursor-pointer relative"
            title="Menu"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Optional Search Bar */}
      {showSearchBox && (
        <div className="bg-[#121c27] px-4 py-2 border-b border-stone-800 flex items-center gap-2">
          <Search size={14} className="text-stone-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search emails, codes, or senders..."
            className="bg-transparent text-xs text-white placeholder-stone-500 w-full focus:outline-none"
            autoFocus
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="text-stone-400 hover:text-white text-xs px-1"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Sync Status Banner */}
      <div className="bg-[#131d2a] px-3.5 py-1.5 border-b border-stone-800/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-stone-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>
            Connected Email: <strong className="text-emerald-400 font-mono">{userEmail}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-400 font-mono">
            @GmailBot
          </span>
          <button
            type="button"
            onClick={async () => {
              const freshCode = String(Math.floor(10000 + Math.random() * 90000));
              try {
                await fetch("/api/telegram/gmail-bot/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    subject: `Your Code - ${freshCode}`,
                    bodyText: `Dear C'S,\nYour code is: ${freshCode}. Use it to access your account.\nIf you didn't request this, simply ignore this message.\nYours,\nThe Telegram Team`,
                    from: "Telegram <noreply@telegram.org>",
                    category: "telegram_auth",
                    code: freshCode
                  })
                });
                fetchBotMessages();
                setBotStatusText(`✉️ Dispatched fresh Telegram login code (${freshCode}) to ${userEmail}!`);
                setTimeout(() => setBotStatusText(null), 3500);
              } catch (e) {}
            }}
            className="text-[10px] bg-sky-950 text-sky-300 hover:bg-sky-900 border border-sky-700 px-2 py-0.5 rounded font-bold transition cursor-pointer"
          >
            + Request New Code
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {botStatusText && (
        <div className="bg-emerald-950/90 border-b border-emerald-600/70 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span className="font-medium">{botStatusText}</span>
          </div>
          <button
            onClick={() => setBotStatusText(null)}
            className="text-stone-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Message History Area (Telegram themed dark blue canvas) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0e1621] relative">
        
        {/* Unread messages pill separator */}
        <div className="flex items-center justify-center my-2">
          <div className="bg-[#182533] text-stone-300 text-xs px-3 py-1 rounded-full border border-stone-800/80 shadow-sm font-medium tracking-wide">
            Unread messages
          </div>
        </div>

        {/* Message Cards */}
        {filteredMessages.map((msg) => {
          const isTelegramCode = msg.category === "telegram_auth" || !!msg.code;
          const isDatingArts = msg.category === "datingarts_match";
          const isExpanded = expandedMatchId === msg.id;

          return (
            <div key={msg.id} className="space-y-1.5 max-w-xl">
              
              {/* Telegram Email Card Bubble */}
              <div className="bg-[#182533] rounded-2xl p-4 border border-stone-800/80 shadow-md text-stone-200 space-y-2">
                
                {/* Email From Line */}
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <span className="text-sm">✉️</span>
                  <span>{msg.from}</span>
                </div>

                {/* Email Subject Line in Bright Green */}
                <div className="text-emerald-300 font-bold text-[13.5px] leading-snug">
                  {msg.subject}
                </div>

                {/* Email Body Content */}
                <div className="text-xs text-emerald-400/95 font-sans leading-relaxed whitespace-pre-line">
                  {isDatingArts && !isExpanded ? (
                    <div className="space-y-1 font-mono tracking-widest text-[11px] text-emerald-400/90 break-all select-none">
                      {msg.bodyText}
                    </div>
                  ) : (
                    <div>{msg.bodyText}</div>
                  )}
                </div>

                {/* Timestamp at bottom right */}
                <div className="flex justify-end text-[11px] text-stone-400 font-mono pt-1">
                  {msg.date}
                </div>
              </div>

              {/* Telegram Inline Keyboard Buttons Under Bubble */}
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                {isDatingArts && (
                  <button
                    type="button"
                    onClick={() => setExpandedMatchId(isExpanded ? null : msg.id)}
                    className="flex-1 py-2 px-3 bg-[#242f3d] hover:bg-[#2c3a4b] text-sky-400 text-xs font-semibold rounded-xl transition border border-stone-800 cursor-pointer text-center"
                  >
                    {isExpanded ? "↑ Collapse preview" : "↓ Show more"}
                  </button>
                )}

                {/* Actions Button */}
                <button
                  type="button"
                  onClick={() =>
                    setShowMoreActionsId(showMoreActionsId === msg.id ? null : msg.id)
                  }
                  className="flex-1 py-2 px-3 bg-[#242f3d] hover:bg-[#2c3a4b] text-sky-400 text-xs font-semibold rounded-xl transition border border-stone-800 cursor-pointer text-center"
                >
                  Actions »
                </button>

                {/* 1-Tap Copy Code button for Telegram Verification code */}
                {isTelegramCode && msg.code && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(msg.code!, msg.id)}
                      className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedCodeId === msg.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedCodeId === msg.id ? "Code Copied!" : `Copy Code (${msg.code})`}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerAutoLogin(msg.code!)}
                      className="py-2 px-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Auto-Fill & Log In Telegram</span>
                    </button>
                  </>
                )}
              </div>

              {/* Actions Dropdown Drawer */}
              {showMoreActionsId === msg.id && (
                <div className="bg-[#17212b] p-3 rounded-xl border border-stone-700/80 space-y-2 text-xs text-stone-300 shadow-xl mt-1 animate-fadeIn">
                  <div className="font-bold text-white text-[11px] uppercase tracking-wider border-b border-stone-800 pb-1">
                    Message Actions ({msg.senderName})
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {msg.code && (
                      <button
                        onClick={() => handleCopyCode(msg.code!, msg.id)}
                        className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-emerald-300 font-bold flex items-center gap-1.5"
                      >
                        <Copy size={13} />
                        <span>Copy Code: {msg.code}</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        window.location.hash = "#datingarts";
                        const el = document.getElementById("btn-nav-datingarts");
                        if (el) el.click();
                      }}
                      className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-pink-300 font-bold flex items-center gap-1.5"
                    >
                      <Heart size={13} />
                      <span>Open in DatingArts</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.bodyText);
                        setBotStatusText("📋 Full email text copied to clipboard!");
                        setTimeout(() => setBotStatusText(null), 3000);
                      }}
                      className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-200 flex items-center gap-1.5"
                    >
                      <Mail size={13} />
                      <span>Copy Full Email</span>
                    </button>
                    <button
                      onClick={() => setShowMoreActionsId(null)}
                      className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-400 flex items-center gap-1.5"
                    >
                      <span>Close Menu</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12 text-stone-500 text-xs">
            No matching messages found in Gmail Bot.
          </div>
        )}
      </div>

      {/* Menu Drawer */}
      {showMenuDrawer && (
        <div className="bg-[#17212b] border-t border-stone-800 p-3 space-y-2 text-xs animate-fadeIn">
          <div className="flex items-center justify-between text-stone-400 pb-1 border-b border-stone-800">
            <span className="font-bold text-stone-300">Gmail Bot Commands</span>
            <button onClick={() => setShowMenuDrawer(false)} className="text-stone-400 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => {
                setInputMessage("/refresh");
                setShowMenuDrawer(false);
              }}
              className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-left text-sky-300 font-mono text-[11px]"
            >
              /refresh - Sync Inbox
            </button>
            <button
              onClick={() => {
                setInputMessage("/get_code");
                setShowMenuDrawer(false);
              }}
              className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-left text-emerald-300 font-mono text-[11px]"
            >
              /get_code - Request Auth Code
            </button>
            <button
              onClick={() => {
                setInputMessage("/status");
                setShowMenuDrawer(false);
              }}
              className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-left text-amber-300 font-mono text-[11px]"
            >
              /status - Email Link Status
            </button>
          </div>
        </div>
      )}

      {/* 3. Bottom Input Bar matching Telegram screenshot */}
      <form
        onSubmit={handleSendMessage}
        className="bg-[#17212b] px-3 py-2.5 border-t border-stone-800/80 flex items-center gap-2 shrink-0 shadow-lg"
      >
        {/* Green "Menu" pill button */}
        <button
          type="button"
          onClick={() => setShowMenuDrawer(!showMenuDrawer)}
          className="px-3.5 py-1.5 bg-[#2ea64e] hover:bg-[#289244] text-white font-bold text-xs rounded-full shadow transition-all cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>Menu</span>
        </button>

        {/* Paperclip attachment icon */}
        <button
          type="button"
          onClick={() => setBotStatusText("📎 Attachments enabled for Gmail drafts.")}
          className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition cursor-pointer shrink-0"
          title="Attach"
        >
          <Paperclip size={19} />
        </button>

        {/* Input text */}
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-transparent text-xs text-white placeholder-stone-400 focus:outline-none px-1"
        />

        {/* Emoji smile icon */}
        <button
          type="button"
          onClick={() => setInputMessage((prev) => prev + " 😊")}
          className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition cursor-pointer shrink-0"
          title="Emoji"
        >
          <Smile size={19} />
        </button>

        {/* Microphone / Send icon */}
        {inputMessage.trim() ? (
          <button
            type="submit"
            className="p-1.5 text-sky-400 hover:text-sky-300 rounded-full hover:bg-stone-800 transition cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send size={19} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setBotStatusText("🎙️ Voice message recording ready.")}
            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition cursor-pointer shrink-0"
            title="Voice message"
          >
            <Mic size={19} />
          </button>
        )}
      </form>
    </div>
  );
};
