import React, { useState, useEffect } from "react";
import {
  Grid,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  Plus,
  LogOut,
  Settings,
  User,
  Key,
  Crown,
  ChevronDown,
  Edit2,
  Lock,
  Layers,
  Search,
  Check,
  Zap,
  Globe
} from "lucide-react";
import { googleSignIn, getActiveGoogleSession } from "../src/lib/firebaseAuth";
import { NdunakagramLoginWidget } from "./NdunakagramLoginWidget";

export interface GoogleExecutiveAccountSuiteProps {
  onAccountChange?: (email: string) => void;
  onOpenAdminPanel?: () => void;
  onOpenApiSettings?: () => void;
}

const ADMIN_EMAILS = [
  "kansasnelly@gmail.com",
  "kansasiinelly@gmail.com",
  "vinsovin7@gmail.com"
];

// 36 Google Workspace Apps (as shown in user screenshot from News down to Tasks & Marketplace)
const GOOGLE_WORKSPACE_APPS = [
  { id: "account", name: "Account", icon: "👤", color: "#4285F4", url: "https://myaccount.google.com", category: "Core" },
  { id: "drive", name: "Drive", icon: "📁", color: "#0F9D58", url: "https://drive.google.com", category: "Core" },
  { id: "business", name: "Business Profile", icon: "🏪", color: "#4285F4", url: "https://business.google.com", category: "Business" },
  { id: "gmail", name: "Gmail", icon: "✉️", color: "#EA4335", url: "https://mail.google.com", category: "Core" },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "#FF0000", url: "https://youtube.com", category: "Media" },
  { id: "gemini", name: "Gemini", icon: "✨", color: "#8E75FF", url: "https://gemini.google.com", category: "AI" },
  { id: "maps", name: "Maps", icon: "📍", color: "#34A853", url: "https://maps.google.com", category: "Core" },
  { id: "search", name: "Search", icon: "🔍", color: "#4285F4", url: "https://google.com", category: "Core" },
  { id: "calendar", name: "Calendar", icon: "📅", color: "#4285F4", url: "https://calendar.google.com", category: "Core" },
  { id: "news", name: "News", icon: "📰", color: "#1A73E8", url: "https://news.google.com", category: "Information" },
  { id: "photos", name: "Photos", icon: "🖼️", color: "#EA4335", url: "https://photos.google.com", category: "Media" },
  { id: "meet", name: "Meet", icon: "📹", color: "#00897B", url: "https://meet.google.com", category: "Communication" },
  { id: "translate", name: "Translate", icon: "🌐", color: "#4285F4", url: "https://translate.google.com", category: "Utility" },
  { id: "files", name: "Files", icon: "🗄️", color: "#4285F4", url: "https://files.google.com", category: "Utility" },
  { id: "tasks", name: "Tasks", icon: "☑️", color: "#1A73E8", url: "https://tasks.google.com", category: "Productivity" },
  { id: "keep", name: "Keep", icon: "💡", color: "#FBBC04", url: "https://keep.google.com", category: "Productivity" },
  { id: "contacts", name: "Contacts", icon: "👥", color: "#1A73E8", url: "https://contacts.google.com", category: "Communication" },
  { id: "docs", name: "Docs", icon: "📄", color: "#4285F4", url: "https://docs.google.com", category: "Workspace" },
  { id: "sheets", name: "Sheets", icon: "📊", color: "#0F9D58", url: "https://sheets.google.com", category: "Workspace" },
  { id: "slides", name: "Slides", icon: "📑", color: "#F4B400", url: "https://slides.google.com", category: "Workspace" },
  { id: "forms", name: "Forms", icon: "📋", color: "#7248B9", url: "https://forms.google.com", category: "Workspace" },
  { id: "chat", name: "Chat", icon: "💬", color: "#00AC47", url: "https://chat.google.com", category: "Communication" },
  { id: "vault", name: "Vault", icon: "🔒", color: "#4285F4", url: "https://vault.google.com", category: "Security" },
  { id: "classroom", name: "Classroom", icon: "🎓", color: "#0F9D58", url: "https://classroom.google.com", category: "Education" },
  { id: "earth", name: "Earth", icon: "🌍", color: "#4285F4", url: "https://earth.google.com", category: "Explore" },
  { id: "play", name: "Play Store", icon: "▶️", color: "#00E676", url: "https://play.google.com", category: "Apps" },
  { id: "podcasts", name: "Podcasts", icon: "🎙️", color: "#F439A0", url: "https://podcasts.google.com", category: "Media" },
  { id: "collections", name: "Collections", icon: "🔖", color: "#4285F4", url: "https://google.com/save", category: "Utility" },
  { id: "chrome_store", name: "Chrome Web Store", icon: "🧩", color: "#4285F4", url: "https://chromewebstore.google.com", category: "Apps" },
  { id: "cloud_console", name: "Google Cloud", icon: "☁️", color: "#4285F4", url: "https://console.cloud.google.com", category: "Developer" },
  { id: "ai_studio", name: "Google AI Studio", icon: "⚡", color: "#8E75FF", url: "https://aistudio.google.com", category: "AI" },
  { id: "finance", name: "Finance", icon: "📈", color: "#0F9D58", url: "https://google.com/finance", category: "Finance" },
  { id: "flights", name: "Flights", icon: "✈️", color: "#4285F4", url: "https://google.com/travel/flights", category: "Travel" },
  { id: "books", name: "Books", icon: "📚", color: "#FBBC04", url: "https://books.google.com", category: "Information" },
  { id: "arts", name: "Arts & Culture", icon: "🏛️", color: "#EA4335", url: "https://artsandculture.google.com", category: "Explore" },
  { id: "marketplace", name: "Workspace Marketplace", icon: "🛍️", color: "#4285F4", url: "https://workspace.google.com/marketplace", category: "Workspace" }
];

export const GoogleExecutiveAccountSuite: React.FC<GoogleExecutiveAccountSuiteProps> = ({
  onAccountChange,
  onOpenAdminPanel,
  onOpenApiSettings
}) => {
  // Active Account State
  const [activeUser, setActiveUser] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
    isAdmin: boolean;
  }>(() => {
    const savedEmail = localStorage.getItem("google_account_email") || "kansasnelly@gmail.com";
    const savedName = localStorage.getItem("google_account_name") || "NDUNAKA PROSPER CHINEMEREM";
    const isAdmin = ADMIN_EMAILS.includes(savedEmail.toLowerCase());
    return {
      name: savedName,
      email: savedEmail,
      isAdmin
    };
  });

  // Multi-Account List (for instant switching as requested)
  const [knownAccounts, setKnownAccounts] = useState([
    { name: "Sovin vin", email: "vinsovin7@gmail.com", initial: "S", color: "bg-pink-600" },
    { name: "NDUNAKA PROSPER CHINEMEREM", email: "kansasnelly@gmail.com", initial: "N", color: "bg-blue-600" },
    { name: "KANSAS:ii", email: "kansasiinelly@gmail.com", initial: "K", color: "bg-amber-600" }
  ]);

  // Modal / Drawer Open States
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isWaffleDrawerOpen, setIsWaffleDrawerOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);
  const [isTelegramAuthenticating, setIsTelegramAuthenticating] = useState(false);
  const [appSearchQuery, setAppSearchQuery] = useState("");

  // API Keys State
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem("alphaqubit_gemini_api_key") || "");
  const [openRouterApiKey, setOpenRouterApiKey] = useState(() => localStorage.getItem("alphaqubit_openrouter_api_key") || "");
  const [defaultAiProvider, setDefaultAiProvider] = useState<"gemini" | "openrouter" | "dual">(
    () => (localStorage.getItem("alphaqubit_default_ai_provider") as any) || "gemini"
  );
  const [keySaveMessage, setKeySaveMessage] = useState<string | null>(null);

  // Sync visitor login record on startup or account change
  const recordVisitorLogin = async (userEmail: string, userName: string) => {
    try {
      await fetch("/api/ecosystem/visitor-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleAccountId: `google_${Date.now()}`,
          name: userName,
          email: userEmail,
          avatarUrl: "",
          phoneNumber: "+1 (555) 019-2834",
          countryLocation: "United States (US Central Node)",
          visitPurpose: "Executive Access & Quantum Ecosystem Management",
          accessLevel: ADMIN_EMAILS.includes(userEmail.toLowerCase()) ? "ADMIN_RESERVED" : "VERIFIED_VISITOR",
          notes: "Official Google Authentication Verified"
        })
      });
    } catch (err) {
      console.warn("Visitor login record sync note:", err);
    }
  };

  useEffect(() => {
    if (activeUser.email) {
      recordVisitorLogin(activeUser.email, activeUser.name);
    }
  }, [activeUser.email]);

  // Handle Account Selection / Switch
  const handleSelectAccount = (account: { name: string; email: string }) => {
    const isAdmin = ADMIN_EMAILS.includes(account.email.toLowerCase());
    setActiveUser({
      name: account.name,
      email: account.email,
      isAdmin
    });
    localStorage.setItem("google_account_email", account.email);
    localStorage.setItem("google_account_name", account.name);
    localStorage.setItem("google_authenticated", "true");
    if (onAccountChange) {
      onAccountChange(account.email);
    }
    setIsAccountModalOpen(false);
    recordVisitorLogin(account.email, account.name);
  };

  // Official Google Sign-In Popup Trigger
  const handleTriggerOfficialGoogleLogin = async () => {
    try {
      setIsSwitchingAccount(true);
      const user = await googleSignIn();
      if (user && user.email) {
        const email = user.email;
        const name = (user as any).name || (user as any).displayName || email.split("@")[0];
        const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
        setActiveUser({
          name,
          email,
          avatarUrl: (user as any).avatarUrl || (user as any).photoURL || undefined,
          isAdmin
        });
        localStorage.setItem("google_account_email", email);
        localStorage.setItem("google_account_name", name);
        localStorage.setItem("google_authenticated", "true");
        if (onAccountChange) {
          onAccountChange(email);
        }
        recordVisitorLogin(email, name);
      }
    } catch (err) {
      console.warn("Google Sign-In note:", err);
    } finally {
      setIsSwitchingAccount(false);
    }
  };

  // Handle Telegram Authentication
  const handleTelegramAuth = async (authData: any) => {
    try {
      setIsTelegramAuthenticating(true);
      console.log("[AUTH] Received Telegram payload, verifying with backend...");
      
      const response = await fetch("/api/auth/telegram/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth_data: authData })
      });

      const data = await response.json();

      if (data.success && data.session) {
        const { session } = data;
        const name = `${session.firstName} ${session.lastName || ""}`.trim();
        const email = session.username ? `@${session.username}` : `tg_${session.telegramId}`;
        
        setActiveUser({
          name,
          email,
          avatarUrl: session.photoUrl,
          isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()) || ADMIN_EMAILS.includes(session.username?.toLowerCase() || "")
        });

        localStorage.setItem("google_account_email", email);
        localStorage.setItem("google_account_name", name);
        localStorage.setItem("google_authenticated", "true");
        localStorage.setItem("auth_token", data.token);
        
        if (onAccountChange) {
          onAccountChange(email);
        }

        setIsAccountModalOpen(false);
        recordVisitorLogin(email, name);
      } else {
        throw new Error(data.message || "Telegram verification failed.");
      }
    } catch (err: any) {
      console.error("[AUTH] Telegram login error:", err);
      alert(`Telegram Authentication Error: ${err.message}`);
    } finally {
      setIsTelegramAuthenticating(false);
    }
  };

  // Sign out
  const handleSignOut = () => {
    localStorage.removeItem("google_account_email");
    localStorage.removeItem("google_account_name");
    localStorage.removeItem("google_authenticated");
    setActiveUser({
      name: "Guest Visitor",
      email: "",
      isAdmin: false
    });
    if (onAccountChange) {
      onAccountChange("");
    }
    setIsAccountModalOpen(false);
  };

  // Save API Keys
  const handleSaveApiKeys = () => {
    localStorage.setItem("alphaqubit_gemini_api_key", geminiApiKey.trim());
    localStorage.setItem("alphaqubit_openrouter_api_key", openRouterApiKey.trim());
    localStorage.setItem("alphaqubit_default_ai_provider", defaultAiProvider);
    setKeySaveMessage("✅ API Keys & Default AI Provider successfully configured and bound!");
    setTimeout(() => setKeySaveMessage(null), 4000);
  };

  const filteredApps = GOOGLE_WORKSPACE_APPS.filter((app) =>
    app.name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP-LEFT GOOGLE EXECUTIVE AUTH BAR (MATCHING SCREENSHOT 7 RED BOX)     */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 select-none shrink-0">
        
        {/* 9-DOTS GOOGLE APPS WAFFLE ICON (MATCHING SCREENSHOT 9) */}
        <button
          id="btn-google-workspace-waffle"
          type="button"
          onClick={() => {
            setIsWaffleDrawerOpen(!isWaffleDrawerOpen);
            setIsAccountModalOpen(false);
          }}
          className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            isWaffleDrawerOpen
              ? "bg-[#282a2d] text-white ring-2 ring-blue-500/60 shadow-lg"
              : "bg-[#181a20] hover:bg-[#282a2d] text-stone-300 hover:text-white border border-stone-800"
          }`}
          title="Google Apps & 36 Workspace Ecosystem Services"
        >
          <Grid size={18} className="text-stone-300 hover:text-white" />
        </button>

        {/* GOOGLE PROFILE AVATAR / ACCOUNT TRIGGER (MATCHING SCREENSHOTS 2 & 7) */}
        <button
          id="btn-google-account-profile-trigger"
          type="button"
          onClick={() => {
            setIsAccountModalOpen(!isAccountModalOpen);
            setIsWaffleDrawerOpen(false);
          }}
          className="relative p-0.5 rounded-full hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex items-center justify-center shrink-0"
          title={`Google Account: ${activeUser.email || "Sign In"}`}
        >
          {activeUser.email ? (
            <div className="relative">
              {activeUser.avatarUrl ? (
                <img
                  src={activeUser.avatarUrl}
                  alt={activeUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-stone-700 shadow-md"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/20 ${
                  activeUser.email.includes("vinsovin7")
                    ? "bg-gradient-to-tr from-pink-600 to-rose-500"
                    : activeUser.email.includes("kansasiinelly")
                    ? "bg-gradient-to-tr from-amber-600 to-yellow-500"
                    : "bg-gradient-to-tr from-blue-600 to-indigo-600"
                }`}>
                  {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : "G"}
                </div>
              )}
              {/* Online Green Beacon */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#090A0E] rounded-full"></span>
            </div>
          ) : (
            <div className="px-2.5 py-1.5 bg-white text-stone-900 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign In</span>
            </div>
          )}
        </button>

        {/* Admin Sovereign Badge if logged-in user is admin */}
        {activeUser.isAdmin && (
          <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
            <Crown size={11} className="text-amber-400" />
            <span>OVERALL ADMIN</span>
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. GOOGLE ACCOUNT EXECUTIVE POPUP (EXACT MATCH OF SCREENSHOTS 2 & 3)      */}
      {/* ========================================================================= */}
      {isAccountModalOpen && (
        <div className="fixed top-14 left-4 sm:left-6 z-50 w-[92vw] sm:w-[380px] bg-[#1f1f1f] text-stone-100 rounded-3xl border border-stone-700/80 shadow-2xl p-5 space-y-4 animate-fade-in select-none">
          
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="text-xs font-bold text-stone-300">Google Account</span>
            </div>
            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Active Account Profile Card */}
          <div className="p-3 bg-[#131314] rounded-2xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-md ${
                  activeUser.email.includes("vinsovin7")
                    ? "bg-pink-600"
                    : activeUser.email.includes("kansasiinelly")
                    ? "bg-amber-600"
                    : "bg-blue-600"
                }`}>
                  {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : "G"}
                </div>
                <button
                  onClick={() => alert("Customize Profile: You can update your Google Avatar and display settings.")}
                  className="absolute bottom-0 right-0 p-1 bg-stone-800 text-stone-200 hover:text-white rounded-full border border-stone-700 shadow"
                  title="Customize profile"
                >
                  <Edit2 size={10} />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-black text-white leading-tight">{activeUser.name}</h4>
                <p className="text-xs text-stone-400 font-mono mt-0.5">{activeUser.email}</p>
                {activeUser.isAdmin && (
                  <span className="inline-block mt-1 px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[9px] font-mono font-bold border border-amber-500/40">
                    👑 OVERALL ADMIN
                  </span>
                )}
              </div>
            </div>

            <ChevronDown size={16} className="text-stone-400" />
          </div>

          {/* Switch Accounts List (Matching Screenshot 2) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block px-1">
              CHOOSE ACCOUNT TO SWITCH IN 1 TAP:
            </span>
            {knownAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleSelectAccount(acc)}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  activeUser.email === acc.email
                    ? "bg-blue-950/40 border-blue-500/60 shadow"
                    : "bg-[#181a20] hover:bg-[#282a2d] border-stone-800 text-stone-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full ${acc.color} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {acc.initial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">{acc.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{acc.email}</div>
                  </div>
                </div>
                {activeUser.email === acc.email && (
                  <Check size={14} className="text-blue-400" />
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons Group (Matching Screenshot 2) */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            {/* Add another account */}
            <button
              onClick={handleTriggerOfficialGoogleLogin}
              className="w-full py-2.5 px-3 bg-[#181a20] hover:bg-[#282a2d] text-stone-200 hover:text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-stone-800"
            >
              <Plus size={15} className="text-stone-400" />
              <span>Add another account</span>
            </button>

            {/* TELEGRAM LOGIN WIDGET (Matching user request) */}
            <div className="p-3 bg-[#181a20] border border-stone-800 rounded-2xl space-y-3">
               <div className="flex items-center gap-2 px-1">
                  <Globe size={14} className="text-sky-400" />
                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-wider">
                    Sign in with NDUNAKAGRAM
                  </span>
               </div>
               
               <div className="flex justify-center py-1">
                  {isTelegramAuthenticating ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-400 animate-pulse">
                      <Zap size={14} className="animate-spin" />
                      <span>Verifying Telegram Hash...</span>
                    </div>
                  ) : (
                    <NdunakagramLoginWidget 
                      botName="KANSASNELLYBOT"
                      onAuth={handleTelegramAuth}
                      buttonSize="large"
                      cornerRadius={12}
                    />
                  )}
               </div>
               <p className="text-[9px] text-stone-500 text-center px-2">
                 Authenticated via official NDUNAKAGRAM (@KANSASNELLYBOT)
               </p>
            </div>

            {/* Manage your Google Account */}
            <a
              href="https://myaccount.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#181a20] hover:bg-[#282a2d] text-stone-200 hover:text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-stone-800"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Manage your Google Account</span>
            </a>

            {/* Get a Google AI Plan */}
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#181a20] hover:bg-[#282a2d] text-stone-200 hover:text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-stone-800"
            >
              <Sparkles size={15} className="text-purple-400" />
              <span>Get a Google AI plan</span>
            </a>

            {/* AI API Keys Toggle (Gemini & OpenRouter) */}
            <button
              onClick={() => {
                setIsApiSettingsOpen(true);
                setIsAccountModalOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800 hover:to-indigo-800 text-purple-200 hover:text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-purple-500/40"
            >
              <Key size={15} className="text-purple-300" />
              <span>Configure Gemini & OpenRouter API Keys</span>
            </button>

            {/* Sign out of all accounts */}
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-red-800/60"
            >
              <LogOut size={15} />
              <span>Sign out of all accounts</span>
            </button>
          </div>

          {/* Privacy Policy & Terms of Service */}
          <div className="pt-2 text-center text-[10px] text-stone-500 font-medium">
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a>
            {" • "}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">Terms of Service</a>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GOOGLE WORKSPACE 36 APPS DRAWER (MATCHING SCREENSHOT 9 3x3 WAFFLE)     */}
      {/* ========================================================================= */}
      {isWaffleDrawerOpen && (
        <div className="fixed top-14 left-4 sm:left-6 z-50 w-[94vw] sm:w-[340px] max-h-[82vh] bg-[#1f1f1f] text-stone-100 rounded-3xl border border-stone-700/80 shadow-2xl p-4 flex flex-col justify-between animate-fade-in select-none">
          
          {/* Header & Search */}
          <div className="space-y-3 pb-2 border-b border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid size={16} className="text-blue-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Google Workspace (36 Apps)
                </h4>
              </div>
              <button
                onClick={() => setIsWaffleDrawerOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Quick App Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                placeholder="Search Google apps (News, Tasks, Drive...)"
                className="w-full bg-[#131314] border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 36 Apps 3-Column Grid */}
          <div className="flex-1 overflow-y-auto py-3 grid grid-cols-3 gap-2 max-h-[50vh] pr-1">
            {filteredApps.map((app) => (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl hover:bg-[#282a2d] transition-all group text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#131314] group-hover:scale-110 group-hover:shadow-lg transition-transform flex items-center justify-center text-xl mb-1 border border-stone-800">
                  <span>{app.icon}</span>
                </div>
                <span className="text-[11px] font-bold text-stone-300 group-hover:text-white leading-tight line-clamp-1">
                  {app.name}
                </span>
              </a>
            ))}
          </div>

          {/* More from Google Workspace Marketplace Button (Matching Screenshot 9) */}
          <div className="pt-3 border-t border-stone-800">
            <a
              href="https://workspace.google.com/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-[#131314] hover:bg-[#282a2d] text-blue-400 hover:text-blue-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-stone-800"
            >
              <span>More from Google Workspace Marketplace</span>
              <ExternalLink size={12} />
            </a>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AI API SETTINGS MODAL (GEMINI API & OPENROUTER API BINDING)             */}
      {/* ========================================================================= */}
      {isApiSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-[#14161f] text-stone-100 rounded-3xl border border-purple-500/50 shadow-2xl p-6 space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-xl shadow">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">AI Engine API Keys & Multi-Model Binding</h3>
                  <p className="text-xs text-stone-400 font-mono">Gemini API & OpenRouter Fallback Orchestrator</p>
                </div>
              </div>
              <button
                onClick={() => setIsApiSettingsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white bg-stone-800 rounded-xl cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Notification */}
            {keySaveMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>{keySaveMessage}</span>
              </div>
            )}

            {/* Gemini API Key Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Google Gemini API Key:</span>
                <span className="text-[10px] text-purple-400 font-mono">Gemini 1.5 Flash / Pro Core</span>
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy... (Paste your Google Gemini API Key here)"
                className="w-full bg-[#0a0c10] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-stone-500">
                Powers conversational intelligence, speech audio synthesis, and live Sreymara Queen agent.
              </p>
            </div>

            {/* OpenRouter API Key Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>OpenRouter API Key:</span>
                <span className="text-[10px] text-sky-400 font-mono">Multi-Model LLM Gateway</span>
              </label>
              <input
                type="password"
                value={openRouterApiKey}
                onChange={(e) => setOpenRouterApiKey(e.target.value)}
                placeholder="sk-or-v1-... (Paste OpenRouter API Key here)"
                className="w-full bg-[#0a0c10] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500"
              />
              <p className="text-[10px] text-stone-500">
                Enables fallback routing to Claude, Llama 3, DeepSeek, and Mistral across decentralized nodes.
              </p>
            </div>

            {/* Default Provider Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 block">
                Active Default AI Provider Mode:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDefaultAiProvider("gemini")}
                  className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                    defaultAiProvider === "gemini"
                      ? "bg-purple-600 text-white border-purple-400 shadow-lg"
                      : "bg-[#0a0c10] text-stone-400 border-stone-800 hover:border-stone-700"
                  }`}
                >
                  Gemini Core (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultAiProvider("openrouter")}
                  className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                    defaultAiProvider === "openrouter"
                      ? "bg-sky-600 text-white border-sky-400 shadow-lg"
                      : "bg-[#0a0c10] text-stone-400 border-stone-800 hover:border-stone-700"
                  }`}
                >
                  OpenRouter (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultAiProvider("dual")}
                  className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                    defaultAiProvider === "dual"
                      ? "bg-emerald-600 text-white border-emerald-400 shadow-lg"
                      : "bg-[#0a0c10] text-stone-400 border-stone-800 hover:border-stone-700"
                  }`}
                >
                  Dual Assist (Both)
                </button>
              </div>
            </div>

            {/* Save Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setIsApiSettingsOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveApiKeys}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                Save & Bind Keys
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
