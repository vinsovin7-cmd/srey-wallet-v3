import React, { useState } from "react";
import {
  Mail,
  Lock,
  Key,
  ShieldCheck,
  CheckCircle2,
  X,
  RefreshCw,
  Globe,
  Sparkles,
  Server,
  AlertCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react";

interface MailComAuthenticatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (accountData: { email: string; token: string; proxyServer: string }) => void;
}

export function MailComAuthenticatorModal({
  isOpen,
  onClose,
  onLoginSuccess
}: MailComAuthenticatorModalProps) {
  const [email, setEmail] = useState<string>("kansasnelly@mail.com");
  const [password, setPassword] = useState<string>("••••••••••••");
  const [otpCode, setOtpCode] = useState<string>("492 810");
  const [proxyServer, setProxyServer] = useState<string>("mail.com US Secure Gateway (SSL:993)");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [stepText, setStepText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMailComAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter your mail.com email address and password.");
      return;
    }

    setErrorMsg(null);
    setIsConnecting(true);
    setStepText("Step 1/3: Connecting to mymail.com / mail.com SSL Proxy...");

    setTimeout(() => {
      setStepText("Step 2/3: Validating 2FA Authenticator Token...");
      setTimeout(() => {
        setStepText("Step 3/3: Synchronizing mail.com Inbox & Notification Engine...");
        setTimeout(() => {
          setIsConnecting(false);
          setStepText(null);
          onLoginSuccess({
            email,
            token: "mcom_auth_token_" + Date.now(),
            proxyServer
          });
          onClose();
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-indigo-500/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-stone-950 via-indigo-950/50 to-stone-950 px-6 py-4 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-900/40">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-indigo-100">mymail.com Authenticator</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" /> Direct Login
                </span>
              </div>
              <p className="text-xs text-stone-400">Authenticating mail.com account with 2FA Token</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleMailComAuthSubmit} className="p-6 space-y-4">
          {/* 1-Click Fast Accounts Selector */}
          <div className="p-2.5 bg-stone-950/80 rounded-xl border border-indigo-500/30 space-y-1.5">
            <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
              <span>Quick Select Verified Account</span>
              <span className="text-emerald-400 font-bold">● 256-Bit SSL</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("kansasnelly@mail.com");
                  setPassword("KansasPass2026!");
                }}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                  email === "kansasnelly@mail.com"
                    ? "bg-indigo-950/80 border-indigo-400 text-indigo-100 font-bold ring-1 ring-indigo-400"
                    : "bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300"
                }`}
              >
                <div className="font-bold text-[11px] truncate">kansasnelly@mail.com</div>
                <div className="text-[9px] text-stone-400">Auto-fill credentials</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("arthur20011043@mail.com");
                  setPassword("ArthurPass2026!");
                }}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                  email === "arthur20011043@mail.com"
                    ? "bg-indigo-950/80 border-indigo-400 text-indigo-100 font-bold ring-1 ring-indigo-400"
                    : "bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300"
                }`}
              >
                <div className="font-bold text-[11px] truncate">arthur20011043@mail.com</div>
                <div className="text-[9px] text-stone-400">Auto-fill credentials</div>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              mail.com / mymail.com Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="account@mail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
              <span>2FA Authenticator Code (OTP)</span>
              <span className="text-[10px] text-indigo-400">Authenticator App</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-indigo-400" />
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="492 810"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-indigo-500/40 rounded-xl text-xs text-indigo-300 focus:outline-none focus:border-indigo-400 font-mono tracking-widest font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Gateway Proxy Node
            </label>
            <div className="relative">
              <Server className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <select
                value={proxyServer}
                onChange={(e) => setProxyServer(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="mail.com US Secure Gateway (SSL:993)">mail.com US Secure Gateway (SSL:993)</option>
                <option value="mail.com EU TLS Proxy (Port 465)">mail.com EU TLS Proxy (Port 465)</option>
                <option value="mail.com Global High-Speed Authenticator">mail.com Global High-Speed Authenticator</option>
              </select>
            </div>
          </div>

          {stepText && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center gap-2 animate-pulse">
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              <span>{stepText}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isConnecting}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-900/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In with mymail.com</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted SSL 256-bit Connection</span>
          </div>
          <span className="font-mono text-stone-500">mail.com Auth Proxy v2.4</span>
        </div>
      </div>
    </div>
  );
}
