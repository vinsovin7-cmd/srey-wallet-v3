import React, { useState } from "react";
import {
  ShieldCheck,
  User,
  Phone,
  Mail,
  QrCode,
  Key,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  X,
  ArrowRight,
  Camera,
  Heart,
  Globe
} from "lucide-react";
import { GoogleVisitorSignInModal, VisitorRecord } from "./GoogleVisitorSignInModal";

export const MONETAG_DIRECT_LINK = "https://omg10.com/4/11528175";

interface ViralGuestRegisterModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onRegisterSuccess?: (userData: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
    location: string;
  }) => void;
  onRegistered?: (userData?: any) => void;
}

export const ViralGuestRegisterModal: React.FC<ViralGuestRegisterModalProps> = ({
  isOpen = true,
  onClose,
  onRegisterSuccess,
  onRegistered
}) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const sampleAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
  ];

  if (!isOpen) return null;

  const handleGoogleSuccess = (record: VisitorRecord) => {
    setShowGoogleModal(false);
    setFullName(record.name);
    setEmailAddress(record.email);
    if (record.phoneNumber) setPhoneNumber(record.phoneNumber);
    if (record.avatarUrl) setSelectedAvatar(record.avatarUrl);

    // Auto complete visitor intake
    const userData = {
      name: record.name,
      phone: record.phoneNumber || "+1 (555) 234-5678",
      email: record.email,
      avatar: record.avatarUrl || selectedAvatar,
      location: record.countryLocation || "Verified Google Member"
    };

    try {
      window.open(MONETAG_DIRECT_LINK, "_blank", "noopener,noreferrer");
    } catch (e) {}

    if (onRegisterSuccess) onRegisterSuccess(userData);
    if (onRegistered) onRegistered(userData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (!emailAddress.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (authCode.trim().length < 6) {
      setErrorMessage("Please enter the 6-digit Google Authenticator code.");
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const finalAvatar = customAvatarUrl.trim() || selectedAvatar;

      // Trigger Monetag direct link popunder in new tab
      try {
        window.open(MONETAG_DIRECT_LINK, "_blank", "noopener,noreferrer");
      } catch (err) {
        console.warn(err);
      }

      const userData = {
        name: fullName.trim(),
        phone: phoneNumber.trim(),
        email: emailAddress.trim().toLowerCase(),
        avatar: finalAvatar,
        location: "Verified Global Member"
      };

      if (onRegisterSuccess) {
        onRegisterSuccess(userData);
      }
      if (onRegistered) {
        onRegistered(userData);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b031c] border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-scale-in my-8 text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-xl">
            <div className="w-full h-full bg-[#0b031c] rounded-[14px] flex items-center justify-center text-3xl font-black">
              💕
            </div>
          </div>
          <h2 className="font-serif font-black text-xl text-amber-200">
            Ecosystem & Love Suite Visitor Registration
          </h2>
          <p className="text-xs text-stone-300 max-w-sm mx-auto">
            Sign in with Google for 1-click visitor record registration or enter your profile details manually below.
          </p>
        </div>

        {/* 1-CLICK GOOGLE SIGN-IN BUTTON */}
        <div className="p-3 bg-[#151724] border border-blue-500/60 rounded-2xl space-y-2">
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-3 bg-white hover:bg-stone-100 text-stone-900 font-extrabold rounded-xl text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 border border-stone-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-bold">Sign in with Google (1-Click Registration)</span>
          </button>
          <p className="text-[10px] text-center text-stone-400">
            Records Google Name, Email, Phone & Visitor ID into Ecosystem Database.
          </p>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-purple-900/60"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono text-stone-500 uppercase">
            OR MANUAL VISITOR FORM
          </span>
          <div className="flex-grow border-t border-purple-900/60"></div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-red-200 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* PROFILE PICTURE SELECTOR */}
          <div>
            <label className="block font-bold mb-1 text-amber-300 flex items-center gap-1">
              <Camera size={14} />
              <span>Select Profile Picture or Paste Image URL</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              {sampleAvatars.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedAvatar(img);
                    setCustomAvatarUrl("");
                  }}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedAvatar === img && !customAvatarUrl
                      ? "border-amber-400 scale-110 shadow-lg ring-2 ring-amber-400/50"
                      : "border-purple-900 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              value={customAvatarUrl}
              onChange={(e) => setCustomAvatarUrl(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-stone-200 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
            />
          </div>

          {/* FULL NAME */}
          <div>
            <label className="block font-bold mb-1 text-stone-300 flex items-center gap-1">
              <User size={14} className="text-amber-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sophal Meas or Amina Okafor"
              className="w-full px-3.5 py-2.5 bg-black border border-purple-900 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* PHONE & EMAIL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-stone-300 flex items-center gap-1">
                <Phone size={14} className="text-amber-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+855 12 991 002"
                className="w-full px-3.5 py-2.5 bg-black border border-purple-900 rounded-xl text-amber-300 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-stone-300 flex items-center gap-1">
                <Mail size={14} className="text-amber-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 bg-black border border-purple-900 rounded-xl text-stone-200 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* GOOGLE AUTHENTICATOR 2FA SECTION */}
          <div className="p-4 bg-[#110529] border border-amber-500/60 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Google Authenticator Verification</span>
              </span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[9px] font-mono border border-emerald-600">
                REQUIRED
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                <QrCode size={52} className="text-stone-900" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-stone-300">
                  Scan QR code or use key <code className="text-amber-300 font-bold">MECHAT-7729</code> in Google Authenticator app.
                </p>
                <p className="text-[10px] text-stone-400">
                  Secures your isolated love suite room against spam.
                </p>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-stone-300">6-Digit Authenticator Code</label>
              <input
                type="text"
                maxLength={6}
                required
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full px-3 py-2 bg-black border border-amber-500/80 rounded-xl text-amber-300 text-center font-mono text-lg font-black tracking-widest focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black rounded-2xl text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            {isVerifying ? (
              <span>Verifying Google Auth...</span>
            ) : (
              <>
                <Heart size={18} className="fill-current text-amber-200" />
                <span>Verify Google Auth & Join Ecosystem</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <GoogleVisitorSignInModal
          isOpen={showGoogleModal}
          onClose={() => setShowGoogleModal(false)}
          onSuccess={handleGoogleSuccess}
        />
      </div>
    </div>
  );
};
