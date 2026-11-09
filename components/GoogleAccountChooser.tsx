import React, { useState, useEffect } from "react";
import { 
  User, 
  UserPlus, 
  UserMinus, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  HelpCircle, 
  Globe, 
  Check, 
  Lock, 
  Sparkles,
  ChevronDown,
  KeyRound,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { googleSignIn } from "../src/lib/firebaseAuth";

export interface GoogleAccount {
  id: string;
  displayName: string;
  email: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
  signedIn: boolean;
  savedPassword?: string;
}

export const INITIAL_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    id: "g-acc-sovin",
    displayName: "Sovin",
    email: "vinsovin7@gmail.com",
    initials: "S",
    avatarBg: "bg-[#D81B60]", // Official Google Pink matching Screenshot 5
    signedIn: false
  },
  {
    id: "g-acc-ndunaka",
    displayName: "NDUNAKA (Kansas)",
    email: "kansasnelly@gmail.com",
    initials: "N",
    avatarBg: "bg-[#1E88E5]", // Official Google Blue
    signedIn: false
  },
  {
    id: "g-acc-kansas",
    displayName: "KANSAS:ii",
    email: "kansasiinelly@gmail.com",
    initials: "K",
    avatarBg: "bg-[#00897B]", // Official Google Teal
    signedIn: false
  },
  {
    id: "g-acc-nelly",
    displayName: "Nelly",
    email: "everestmeek842@gmail.com",
    initials: "N",
    avatarBg: "bg-[#5E35B1]", // Official Google Purple
    signedIn: false
  },
  {
    id: "g-acc-prosper",
    displayName: "PROSPER",
    email: "prosper.ndunaka@gmail.com",
    initials: "P",
    avatarBg: "bg-[#6D4C41]", // Official Google Brown
    signedIn: false
  },
  {
    id: "g-acc-ggg",
    displayName: "ggg",
    email: "ggg.user@gmail.com",
    initials: "G",
    avatarBg: "bg-[#43A047]", // Official Google Green
    signedIn: false
  }
];

interface GoogleAccountChooserProps {
  onAccountAuthenticated: (account: GoogleAccount) => void;
  onCancel?: () => void;
}

export const GoogleAccountChooser: React.FC<GoogleAccountChooserProps> = ({
  onAccountAuthenticated,
  onCancel
}) => {
  const [accounts, setAccounts] = useState<GoogleAccount[]>(() => {
    try {
      const saved = localStorage.getItem("google_accounts_list");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed reading saved accounts:", e);
    }
    return INITIAL_GOOGLE_ACCOUNTS;
  });

  const [selectedAccount, setSelectedAccount] = useState<GoogleAccount | null>(null);
  const [authMethod, setAuthMethod] = useState<"password" | "authenticator">("password");
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberAccount, setRememberAccount] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("google_accounts_list", JSON.stringify(accounts));
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  }, [accounts]);

  const handleAccountClick = (account: GoogleAccount) => {
    setSelectedAccount(account);
    setPassword("");
    setAuthCode("");
    setErrorMsg(null);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    if (authMethod === "password" && !password.trim()) {
      setErrorMsg("Please enter your Google account password.");
      return;
    }

    if (authMethod === "authenticator" && authCode.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit Google Authenticator code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const updatedAccount: GoogleAccount = {
        ...selectedAccount,
        signedIn: true
      };

      const updatedList = accounts.map(a => 
        a.id === updatedAccount.id ? updatedAccount : a
      );

      setAccounts(updatedList);
      localStorage.setItem("google_active_session_account", JSON.stringify(updatedAccount));
      setIsLoading(false);
      onAccountAuthenticated(updatedAccount);
    }, 600);
  };

  const handleAddNewAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setErrorMsg("Please enter a valid Google email address.");
      return;
    }

    const cleanEmail = newEmail.trim().toLowerCase();
    const name = newName.trim() || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    const newAcc: GoogleAccount = {
      id: `g-acc-${Date.now()}`,
      displayName: name,
      email: cleanEmail,
      initials: name.charAt(0).toUpperCase() || "G",
      avatarBg: "bg-[#1E88E5]",
      signedIn: false
    };

    setAccounts(prev => [...prev, newAcc]);
    setIsAddingNew(false);
    setSelectedAccount(newAcc);
    setPassword("");
    setErrorMsg(null);
  };

  // Real Google Consent Popup Flow (accounts.google.com/signin/oauth)
  const handleRealGooglePopup = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await googleSignIn();
      if (user && user.email) {
        const matchingAcc = accounts.find(a => a.email.toLowerCase() === user.email.toLowerCase());
        const updatedAcc: GoogleAccount = matchingAcc ? {
          ...matchingAcc,
          displayName: user.name || matchingAcc.displayName,
          signedIn: true
        } : {
          id: `g-acc-${Date.now()}`,
          displayName: user.name,
          email: user.email,
          initials: user.name.charAt(0).toUpperCase() || "G",
          avatarBg: "bg-[#1E88E5]",
          signedIn: true
        };

        const updatedList = accounts.some(a => a.email.toLowerCase() === user.email.toLowerCase())
          ? accounts.map(a => a.email.toLowerCase() === user.email.toLowerCase() ? updatedAcc : a)
          : [updatedAcc, ...accounts];

        setAccounts(updatedList);
        localStorage.setItem("google_active_session_account", JSON.stringify(updatedAcc));
        onAccountAuthenticated(updatedAcc);
      }
    } catch (err: any) {
      console.warn("Google popup note:", err);
      setErrorMsg("Google Sign-In: " + (err?.message || "Please complete authentication in popup."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F9] text-[#1F1F1F] flex flex-col justify-between items-center p-4 sm:p-6 font-sans select-none">
      
      {/* Top Google Logo & Breadcrumb */}
      <div className="w-full max-w-md pt-4 flex justify-between items-center">
        <div className="flex items-center gap-1 text-slate-700">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span className="font-semibold text-lg tracking-tight ml-1 text-slate-800">Google</span>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Main Google Sign-In Card */}
      <div className="w-full max-w-[460px] bg-white rounded-[28px] border border-slate-200/80 p-8 sm:p-10 shadow-xl my-auto">
        
        {/* State 1: Choose an Account */}
        {!selectedAccount && !isAddingNew && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-normal text-[#1F1F1F] tracking-tight">
                Choose an account
              </h1>
              <p className="text-sm text-slate-600">
                to continue to <strong className="text-slate-900">Google Gemini & Ecosystem</strong>
              </p>
            </div>

            {/* Official Google OAuth 2.0 Popup Trigger */}
            <button
              type="button"
              onClick={handleRealGooglePopup}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow text-slate-800 font-semibold rounded-2xl text-sm flex items-center justify-center gap-3 transition-all cursor-pointer group active:scale-[0.99]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isLoading ? "Opening Google Consent Window..." : "Sign in with Google Account (Real Popup)"}</span>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                OAUTH 2.0 ↗
              </span>
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">or choose existing account</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* List of Real Google Accounts */}
            <div className="divide-y divide-slate-100 border-t border-b border-slate-100 py-1">
              {accounts.map(acc => (
                <div
                  key={acc.id}
                  onClick={() => handleAccountClick(acc)}
                  className="flex items-center justify-between py-3.5 px-3 hover:bg-slate-50/90 rounded-2xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm group-hover:ring-2 group-hover:ring-blue-400 transition-all`}>
                      {acc.initials}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#1F1F1F] truncate group-hover:text-blue-600 transition-colors">
                        {acc.displayName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {acc.email}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Select →
                  </span>
                </div>
              ))}
            </div>

            {/* Add another account */}
            <div
              onClick={() => {
                setIsAddingNew(true);
                setErrorMsg(null);
              }}
              className="flex items-center gap-3.5 py-3 px-3 hover:bg-slate-50 rounded-2xl cursor-pointer text-slate-700 transition"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <UserPlus size={18} />
              </div>
              <span className="text-sm font-medium text-slate-800">
                Use another account
              </span>
            </div>
          </div>
        )}

        {/* State 2: Enter Password or Google Authenticator Code */}
        {selectedAccount && !isAddingNew && (
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {/* Header with selected user chip */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-normal text-[#1F1F1F] tracking-tight">
                Welcome
              </h1>
              
              <div 
                onClick={() => setSelectedAccount(null)}
                className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-xs text-slate-700 cursor-pointer transition"
                title="Switch to another account"
              >
                <div className={`w-4 h-4 rounded-full ${selectedAccount.avatarBg} text-white font-bold flex items-center justify-center text-[9px]`}>
                  {selectedAccount.initials}
                </div>
                <span className="font-medium truncate max-w-[200px]">{selectedAccount.email}</span>
                <ChevronDown size={12} className="text-slate-500" />
              </div>
            </div>

            {/* Auth Method Switcher (Password vs Google Authenticator) */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("password");
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  authMethod === "password" ? "bg-white text-blue-600 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <KeyRound size={13} />
                <span>Password</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("authenticator");
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  authMethod === "authenticator" ? "bg-white text-blue-600 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone size={13} />
                <span>Google Authenticator</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Password Input */}
            {authMethod === "password" && (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoFocus
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Authenticator Code Input */}
            {authMethod === "authenticator" && (
              <div className="space-y-2">
                <div className="text-xs text-slate-600 leading-relaxed">
                  Open your <strong>Google Authenticator</strong> app and enter the 6-digit verification code:
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  autoFocus
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-center font-mono text-lg tracking-widest text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#0B57D0] hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isLoading ? "Signing in..." : "Next"}
              </button>
            </div>
          </form>
        )}

        {/* State 3: Add New Google Account */}
        {isAddingNew && (
          <form onSubmit={handleAddNewAccountSubmit} className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-normal text-[#1F1F1F]">Sign in</h1>
              <p className="text-xs text-slate-600">with your Google Account</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email or phone"
                autoFocus
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              />

              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0B57D0] hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-md text-center text-xs text-slate-500 py-3">
        English (United States) • Help • Privacy • Terms
      </div>
    </div>
  );
};

export default GoogleAccountChooser;
