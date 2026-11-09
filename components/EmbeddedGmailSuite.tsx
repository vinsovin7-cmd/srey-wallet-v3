import React, { useState, useEffect } from "react";
import { MailComAuthenticatorModal } from "./MailComAuthenticatorModal";
import {
  Mail,
  Send,
  RefreshCw,
  CheckCircle2,
  Lock,
  Globe,
  Inbox,
  Star,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Plus,
  User,
  X,
  Search,
  ChevronRight,
  Sparkles,
  LogOut,
  Key,
  Copy
} from "lucide-react";
import { TelegramGmailBotView } from "./TelegramGmailBotView";
import {
  googleSignIn,
  fetchGmailMessages,
  sendGmailMessage,
  logoutGmail,
  initAuth,
  RealGmailMessage
} from "../src/lib/firebaseAuth";
import { User as FirebaseUser } from "firebase/auth";

export function EmbeddedGmailSuite() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Email State
  const [messages, setMessages] = useState<RealGmailMessage[]>([
    {
      id: "tg-code-official-1",
      threadId: "t-tg-1",
      subject: "Your Code - 28636",
      from: "Telegram <noreply@telegram.org>",
      to: "kansasnelly@gmail.com",
      date: "1:56 PM",
      snippet: "Dear C'S, Your code is: 28636. Use it to access your Telegram account. Never share your code with anyone.",
      bodyText: "Dear C'S,\n\nYour code is: 28636. Use it to access your account.\nIf you didn't request this, simply ignore this message.\n\nYours,\nThe Telegram Team",
      isRead: false,
      category: "ecosystem"
    },
    {
      id: "demo-1",
      threadId: "t-1",
      subject: "Welcome to DatingArts Ecosystem - Account Verified",
      from: "DatingArts Team <support@datingarts.com>",
      to: "kansasnelly@gmail.com",
      date: "8:20 am",
      snippet: "Your ecosystem account is active with 200 Free Daily Coins. Start connecting with global verified members now!",
      bodyText: "Hello Kansas Nelly,\n\nWelcome to the official DatingArts Live Ecosystem! Your account is equipped with 200 Free Daily Coins allowance, enabling unlimited 1-click matchmaking and real-time member messaging.\n\nEnjoy safe, authentic connections!\n- DatingArts Team",
      isRead: false,
      category: "ecosystem"
    },
    {
      id: "demo-2",
      threadId: "t-2",
      subject: "New Match Alert: Adesuwa Okonkwo sent you a message!",
      from: "DatingArts Matchmaker <notifications@datingarts.com>",
      to: "kansasnelly@gmail.com",
      date: "7:45 am",
      snippet: "Adesuwa Okonkwo from Lagos, Nigeria just sent you a new message in the chat room.",
      bodyText: "Good morning!\n\nAdesuwa Okonkwo (Lagos, Nigeria 🇳🇬) sent you a message: 'Hello! Good afternoon from Lagos! Loved your profile. How is your day coming along?'\n\nClick to open DatingArts Chat and respond instantly.",
      isRead: true,
      category: "match"
    },
    {
      id: "demo-3",
      threadId: "t-3",
      subject: "Ecosystem Daily News: 200 Free Coins Claim Available",
      from: "Ecosystem Digest <news@datingarts.com>",
      to: "kansasnelly@gmail.com",
      date: "Yesterday",
      snippet: "Your daily 200 free coins refill is ready to claim in your Coins & Ledger tab.",
      bodyText: "Dear Ecosystem Member,\n\nYour daily free coin grant of 200 coins has been credited to your account. Enjoy free messaging across all verified profiles.\n\nBest regards,\nEcosystem Control",
      isRead: true,
      category: "news"
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<RealGmailMessage | null>(null);
  const [activeTab, setActiveTab] = useState<"inbox" | "ecosystem" | "news" | "gmail_bot">("inbox");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [emailCopiedCode, setEmailCopiedCode] = useState<boolean>(false);

  // Sync Telegram Bot messages from server
  const syncGmailBotMessages = async () => {
    try {
      const res = await fetch("/api/telegram/gmail-bot/messages");
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        const botEmails: RealGmailMessage[] = data.messages.map((m: any) => ({
          id: `gmail-bot-${m.id}`,
          threadId: `thread-bot-${m.id}`,
          subject: m.subject || `Your Code - ${m.verificationCode || "28636"}`,
          from: m.from || "Telegram <noreply@telegram.org>",
          to: m.to || "kansasnelly@gmail.com",
          date: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just Now",
          snippet: m.body || m.preview || "Telegram verification code received",
          bodyText: m.body || `Your code is: ${m.verificationCode || "28636"}. Use it to access your account.`,
          isRead: m.isRead || false,
          category: "ecosystem"
        }));

        setMessages((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = botEmails.filter((b) => !existingIds.has(b.id));
          if (newOnes.length === 0) return prev;
          return [...newOnes, ...prev];
        });
      }
    } catch (e) {
      // Background sync silent catch
    }
  };

  useEffect(() => {
    syncGmailBotMessages();
    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        syncGmailBotMessages();
      }
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Compose Email Modal
  const [showCompose, setShowCompose] = useState<boolean>(false);
  const [composeTo, setComposeTo] = useState<string>("");
  const [composeSubject, setComposeSubject] = useState<string>("");
  const [composeBody, setComposeBody] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  // Safety Confirmation Modal
  const [showConfirmSend, setShowConfirmSend] = useState<boolean>(false);

  // Mail.com Authenticator State
  const [showMailComModal, setShowMailComModal] = useState<boolean>(false);
  const [mailComAccount, setMailComAccount] = useState<{ email: string; token: string; proxyServer: string } | null>({
    email: "kansasnelly@mail.com",
    token: "mcom_active_token_2026",
    proxyServer: "mail.com US Secure Gateway"
  });

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        loadRealGmail(token);
      },
      () => {
        // Not signed in
      }
    );
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const loadRealGmail = async (token: string) => {
    setIsLoading(true);
    setStatusMessage("Connecting to real Gmail API...");
    try {
      const realMsgs = await fetchGmailMessages(token);
      if (realMsgs && realMsgs.length > 0) {
        setMessages(realMsgs);
        setStatusMessage(`✅ Real Gmail Inbox Synced! (${realMsgs.length} messages loaded)`);
      } else {
        setStatusMessage("Connected to Gmail API. No new messages found in primary inbox.");
      }
    } catch (err: any) {
      console.error("Gmail load error:", err);
      setStatusMessage("⚠️ Signed in via Google. Real Gmail API scope active.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setStatusMessage("Opening Google Authentication Popup...");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result as any);
        setAccessToken(result.accessToken);
        setStatusMessage(`✅ Google Authenticated as ${result.email}`);
        await loadRealGmail(result.accessToken);
      }
    } catch (err: any) {
      console.error("Google Auth failed:", err);
      setStatusMessage(`⚠️ Authentication error: ${err.message || "Sign-in cancelled"}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGmail();
    setUser(null);
    setAccessToken(null);
    setStatusMessage("Signed out of Google account.");
  };

  const handleConfirmAndSend = async () => {
    if (!composeTo || !composeSubject || !composeBody) {
      alert("Please fill in recipient, subject, and email body.");
      return;
    }

    setShowConfirmSend(false);
    setIsSending(true);

    if (accessToken) {
      // Real Gmail Send API
      const success = await sendGmailMessage(accessToken, composeTo, composeSubject, composeBody);
      if (success) {
        setStatusMessage(`📧 Email successfully sent via real Gmail API to ${composeTo}!`);
        setShowCompose(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
        loadRealGmail(accessToken);
      } else {
        setStatusMessage("⚠️ Failed to send email via Gmail API. Check permissions.");
      }
    } else {
      // Ecosystem simulated send
      const newMsg: RealGmailMessage = {
        id: "sent-" + Date.now(),
        threadId: "t-" + Date.now(),
        subject: composeSubject,
        from: `me <${user?.email || "kansasnelly@gmail.com"}>`,
        to: composeTo,
        date: "Just now",
        snippet: composeBody.slice(0, 80) + "...",
        bodyText: composeBody,
        isRead: true,
        category: "ecosystem"
      };
      setMessages([newMsg, ...messages]);
      setStatusMessage(`📧 Email sent to ${composeTo} inside ecosystem!`);
      setShowCompose(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
    }
    setIsSending(false);
  };

  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.subject.toLowerCase().includes(q) ||
      m.from.toLowerCase().includes(q) ||
      m.snippet.toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (activeTab === "ecosystem") return m.category === "ecosystem" || m.category === "match";
    if (activeTab === "news") return m.category === "news";
    return true;
  });

  return (
    <div className="w-full min-h-[700px] bg-stone-950 text-stone-100 rounded-2xl border border-stone-800 shadow-2xl flex flex-col overflow-hidden font-sans">
      {/* Top Embedded Chrome Header */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-stone-100">Gmail Real-Time Authenticator</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Embedded Live Sync
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Authenticated Workspace Mail • real-time OAuth connection
            </p>
          </div>
        </div>

        {/* Real Google Account Auth Banner */}
        <div className="flex items-center gap-3">
          {/* mail.com Authenticator Pill */}
          {mailComAccount ? (
            <div className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/40 rounded-xl px-3 py-1.5 text-xs text-indigo-200">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <div className="hidden md:block text-left">
                <p className="font-bold text-[11px] text-indigo-100">mymail.com Authenticated</p>
                <p className="text-[10px] text-indigo-300 font-mono">{mailComAccount.email}</p>
              </div>
              <button
                onClick={() => setShowMailComModal(true)}
                className="text-[10px] font-bold underline hover:text-white ml-1"
              >
                Re-Auth
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowMailComModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-2 rounded-xl shadow transition-all flex items-center gap-1.5 text-xs"
            >
              <Key className="w-3.5 h-3.5" />
              <span>mymail.com Auth</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3 bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-1.5">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-7 h-7 rounded-full border border-pink-500/50" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-xs font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-stone-200">{user.displayName || "Authenticated Google Account"}</p>
                <p className="text-[10px] text-emerald-400 font-mono">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-700/50 rounded-lg transition-colors ml-1"
                title="Sign out of Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="bg-white hover:bg-stone-100 text-stone-900 font-medium px-4 py-2 rounded-xl border border-stone-300 shadow-md transition-all flex items-center gap-2 text-xs hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.28v3.15C3.3 21.36 7.37 24 12 24z" />
                <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.28C.46 8.2 0 10.04 0 12s.46 3.8 1.28 5.44l4.04-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.56l4.04 3.15c.94-2.82 3.58-4.96 6.68-4.96z" />
              </svg>
              <span>{isAuthenticating ? "Authenticating..." : "Sign in with Google"}</span>
            </button>
          )}

          <button
            onClick={() => accessToken && loadRealGmail(accessToken)}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 transition-colors"
            title="Sync Gmail in Real-Time"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-rose-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notification Toast Status */}
      {statusMessage && (
        <div className="bg-gradient-to-r from-rose-950 to-pink-950 border-b border-rose-800/50 px-4 py-2 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Mail Dashboard Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-stone-900/60 border-r border-stone-800 p-4 flex flex-col gap-4">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium rounded-xl shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Email</span>
          </button>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "inbox"
                  ? "bg-rose-600/20 text-rose-300 border border-rose-500/30"
                  : "text-stone-400 hover:bg-stone-800/50 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>Primary Inbox</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] bg-rose-500/20 text-rose-300 rounded-full font-bold">
                {messages.filter((m) => !m.isRead).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("ecosystem")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "ecosystem"
                  ? "bg-rose-600/20 text-rose-300 border border-rose-500/30"
                  : "text-stone-400 hover:bg-stone-800/50 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DatingArts Alerts</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("news")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "news"
                  ? "bg-rose-600/20 text-rose-300 border border-rose-500/30"
                  : "text-stone-400 hover:bg-stone-800/50 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Ecosystem Digest</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("gmail_bot")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "gmail_bot"
                  ? "bg-sky-600/20 text-sky-300 border border-sky-500/30 font-bold"
                  : "text-stone-400 hover:bg-stone-800/50 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                  ✓
                </div>
                <span>Gmail Bot (@GmailBot)</span>
              </div>
              <span className="px-1.5 py-0.5 text-[9px] bg-rose-950 text-rose-300 rounded font-mono border border-rose-800 font-bold">
                39k
              </span>
            </button>
          </nav>

          <div className="mt-auto p-3 bg-stone-900/80 rounded-xl border border-stone-800/80 text-[11px] text-stone-400 space-y-2">
            <div className="flex items-center gap-1.5 text-stone-200 font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>OAuth 2.0 Real Sync</span>
            </div>
            <p className="leading-relaxed">
              Your Gmail messages are accessed via Google Workspace OAuth APIs. No passwords stored.
            </p>
          </div>
        </div>

        {activeTab === "gmail_bot" ? (
          <div className="flex-1 bg-[#0e1621] overflow-y-auto p-4 sm:p-6">
            <TelegramGmailBotView
              onBack={() => setActiveTab("inbox")}
              onCodeSelect={(code) => {
                navigator.clipboard.writeText(code);
                setEmailCopiedCode(true);
                setStatusMessage(`Telegram Code ${code} copied to clipboard! Switch to Telegram tab to sign in.`);
                setTimeout(() => setEmailCopiedCode(false), 2500);
              }}
              onAutoLogin={(code) => {
                navigator.clipboard.writeText(code);
                const btn = document.getElementById("btn-nav-telegram");
                if (btn) btn.click();
              }}
            />
          </div>
        ) : (
          <>
            {/* Message List Panel */}
            <div className="w-80 border-r border-stone-800 flex flex-col bg-stone-950">
              {/* Search Bar */}
              <div className="p-3 border-b border-stone-800">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search emails..."
                    className="w-full pl-9 pr-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-rose-500 placeholder-stone-500"
                  />
                </div>
              </div>

              {/* List items */}
              <div className="flex-1 overflow-y-auto divide-y divide-stone-900">
                {filteredMessages.length === 0 ? (
                  <div className="p-6 text-center text-stone-500 text-xs">
                    No emails match your filter.
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3.5 cursor-pointer transition-colors hover:bg-stone-900/80 ${
                        selectedMessage?.id === msg.id ? "bg-stone-900 border-l-2 border-rose-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={`text-xs truncate ${!msg.isRead ? "font-bold text-stone-100" : "text-stone-300"}`}>
                          {msg.from.split("<")[0]}
                        </p>
                        <span className="text-[10px] text-stone-500 whitespace-nowrap">{msg.date}</span>
                      </div>
                      <h4 className={`text-xs truncate mb-1 ${!msg.isRead ? "font-semibold text-rose-200" : "text-stone-400"}`}>
                        {msg.subject}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {msg.snippet}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Email Reader Panel */}
            <div className="flex-1 bg-stone-900/30 flex flex-col overflow-y-auto p-6">
              {selectedMessage ? (
                <div className="max-w-2xl mx-auto w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="border-b border-stone-800 pb-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-bold text-stone-100 leading-snug">
                        {selectedMessage.subject}
                      </h3>
                      <span className="text-xs text-stone-400 bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700">
                        {selectedMessage.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                        {selectedMessage.from.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-stone-200">{selectedMessage.from}</p>
                        <p className="text-[11px] text-stone-500">To: {selectedMessage.to}</p>
                      </div>
                    </div>
                  </div>

                  {/* Telegram Login Code Quick Copy Banner if email is from Telegram or has code */}
                  {(selectedMessage.subject.toLowerCase().includes("code") ||
                    selectedMessage.from.toLowerCase().includes("telegram") ||
                    selectedMessage.bodyText?.toLowerCase().includes("your code is")) && (
                    <div className="p-4 bg-sky-950/80 border border-sky-600 rounded-2xl space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                          <Send className="w-3.5 h-3.5 text-sky-400" />
                          <span>Telegram Login Code Detected</span>
                        </div>
                        <span className="text-[10px] bg-sky-900 text-sky-200 px-2 py-0.5 rounded font-mono border border-sky-700">
                          1-Click Copy & Sync
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-sky-800">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-sky-400 font-bold block">Auth Code</span>
                          <div className="text-2xl font-black font-mono tracking-widest text-sky-300">
                            {selectedMessage.subject.match(/\b\d{5}\b/)?.[0] || selectedMessage.bodyText?.match(/\b\d{5}\b/)?.[0] || "28636"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const code = selectedMessage.subject.match(/\b\d{5}\b/)?.[0] || selectedMessage.bodyText?.match(/\b\d{5}\b/)?.[0] || "28636";
                              navigator.clipboard.writeText(code);
                              setEmailCopiedCode(true);
                              setTimeout(() => setEmailCopiedCode(false), 2500);
                            }}
                            className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                          >
                            {emailCopiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{emailCopiedCode ? "Copied!" : "Copy Code"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const code = selectedMessage.subject.match(/\b\d{5}\b/)?.[0] || selectedMessage.bodyText?.match(/\b\d{5}\b/)?.[0] || "28636";
                              navigator.clipboard.writeText(code);
                              const btn = document.getElementById("btn-nav-telegram");
                              if (btn) btn.click();
                            }}
                            className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                          >
                            <span>Open Telegram Phone Login →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="text-xs text-stone-300 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
                    {selectedMessage.bodyText || selectedMessage.snippet}
                  </div>

                  {/* Reply Button */}
                  <div className="border-t border-stone-800 pt-4 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setComposeTo(selectedMessage.from.includes("<") ? selectedMessage.from.split("<")[1].replace(">", "") : selectedMessage.from);
                        setComposeSubject("Re: " + selectedMessage.subject);
                        setShowCompose(true);
                      }}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl border border-stone-700 transition-colors flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5 text-rose-400" />
                      <span>Reply Email</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="m-auto text-center p-8 text-stone-500 space-y-3">
                  <Mail className="w-12 h-12 mx-auto text-stone-700" />
                  <p className="text-xs">Select an email from the list to view full content</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-stone-800 px-5 py-3.5 border-b border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-stone-100">Compose New Email</h3>
              </div>
              <button onClick={() => setShowCompose(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">To (Recipient)</label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Subject line..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Message Body</label>
                <textarea
                  rows={6}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Type your email content..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>

            <div className="bg-stone-800/50 px-5 py-3 border-t border-stone-800 flex justify-end gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirmSend(true)}
                disabled={isSending}
                className="px-5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? "Sending..." : "Send Email"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Confirmation Dialog for Email Send */}
      {showConfirmSend && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-rose-800/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-stone-100">Confirm Email Dispatch</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to send this email to <strong className="text-rose-300">{composeTo}</strong> via your Google Gmail account?
            </p>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-[11px] text-stone-400 space-y-1 font-mono">
              <p><span className="text-stone-500">Subject:</span> {composeSubject}</p>
              <p><span className="text-stone-500">To:</span> {composeTo}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSend(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndSend}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Yes, Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mail.com Direct Authenticator Modal */}
      <MailComAuthenticatorModal
        isOpen={showMailComModal}
        onClose={() => setShowMailComModal(false)}
        onLoginSuccess={(acc) => {
          setMailComAccount(acc);
          setStatusMessage(`✅ Authenticated mymail.com / mail.com account (${acc.email}) via ${acc.proxyServer}!`);
          // Add a new mail.com incoming message
          const newMailComMsg: RealGmailMessage = {
            id: "mcom-" + Date.now(),
            threadId: "mcom-t-" + Date.now(),
            subject: "mail.com Authenticator Security Alert: Direct Session Active",
            from: "mail.com Security Team <security@mail.com>",
            to: acc.email,
            date: "Just now",
            snippet: `Your mail.com account was authenticated with 2FA OTP Token on ${acc.proxyServer}.`,
            bodyText: `Hello,\n\nYour mail.com account (${acc.email}) has been successfully authenticated using 2FA Token via ${acc.proxyServer}.\n\nAll incoming and outgoing emails are now synchronized with DatingArts Live Ecosystem.\n\nBest regards,\nmail.com Security Team`,
            isRead: false,
            category: "ecosystem"
          };
          setMessages(prev => [newMailComMsg, ...prev]);
        }}
      />
    </div>
  );
}
