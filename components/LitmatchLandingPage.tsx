import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Heart,
  MessageCircle,
  Mic,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Users,
  Download,
  Star,
  Lock,
  Play,
  Volume2,
  ExternalLink,
  Gift,
  ArrowRight,
  Smile,
  Radio,
  CheckCircle2,
  Flame,
  Globe,
  Award,
  ChevronDown,
  X
} from "lucide-react";

// =========================================================================
// LITMATCH OFFICIAL COLOR PALETTE
// =========================================================================
// Primary Purple: #8F6DEF (Tailwind equivalent / custom hex)
// Hover Purple: #7149E2
// Deep Purple Dark: #120D24, #1B1038
// Light Purple Canvas: #F7F4FF, #ECE4FC
// Accent Yellow/Gold: #FFD13B
// Mascot Pink: #FF6584, Turquoise: #00F2FE

export interface LitmatchLandingPageProps {
  onClose?: () => void;
  onOpenApp?: () => void;
}

export const LitmatchLandingPage: React.FC<LitmatchLandingPageProps> = ({
  onClose,
  onOpenApp
}) => {
  // Navigation State
  const [activeNav, setActiveNav] = useState<"home" | "safety" | "about">("home");
  const [isSafetyDropdownOpen, setIsSafetyDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Soul Game Simulation State
  const [soulCountdown, setSoulCountdown] = useState(172); // 2:52 remaining
  const [soulIsLiked, setSoulIsLiked] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Voice Game Audio Visualizer Simulation
  const [isVoiceActive, setIsVoiceActive] = useState(true);

  // Soul game timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSoulCountdown((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `0${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Authentic Litmatch Community Stories
  const STORIES = [
    {
      id: 1,
      name: "Bella & Kevin",
      location: "Jakarta, Indonesia",
      badge: "Soul Game Match · Married 💍",
      avatar: "bg-purple-500",
      quote: "Kenal dia dari ngeroom bareng di Litmatch, berlanjut sampai nikah! Terima kasih Litmatch sudah mempertemukan kami.",
      subText: "Started from a 3-minute Soul Game countdown in 2022, bonded over acoustic indie playlists, and tied the knot last December.",
      tags: ["#SoulMatch", "#WeddingStory", "#LitmatchCouple"]
    },
    {
      id: 2,
      name: "Maya Lin",
      location: "Singapore",
      badge: "Voice Game · 2 Years Friends 🎧",
      avatar: "bg-pink-500",
      quote: "When I felt alone during university finals, I hopped into a 7-minute Voice Game. Found a lifelong friend who stayed up to support me.",
      subText: "No awkward pressure, just warm voices and authentic empathy when the real world felt too exhausting.",
      tags: ["#WarmVoice", "#RealFriendship", "#LateNightTalks"]
    },
    {
      id: 3,
      name: "Aris & Collective",
      location: "Kuala Lumpur, Malaysia",
      badge: "Party Room Hosts · 40K Fans 🎤",
      avatar: "bg-indigo-500",
      quote: "We started co-hosting Party Rooms singing covers at 2 AM. Today our music circle has members from 8 different countries!",
      subText: "Litmatch gave us a welcoming stage without judging how we looked—people just fell in love with our voices and energy.",
      tags: ["#PartyChat", "#AcousticNights", "#VoiceTalent"]
    },
    {
      id: 4,
      name: "Danial K.",
      location: "Bangkok, Thailand",
      badge: "Community Mentor · 3 Years 🌟",
      avatar: "bg-emerald-500",
      quote: "Zero filters, zero fake flexing. Just pure honest thoughts on the Feed and people who genuinely care about your day.",
      subText: "As an introvert, finding a space that doesn't force camera selfies allowed me to open up and build true self-confidence.",
      tags: ["#SafeCommunity", "#NoAppearancePressure", "#DailyFeed"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F0A1C] text-white font-sans antialiased overflow-x-hidden selection:bg-[#8F6DEF] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR (.nav-top)                                          */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0A1C]/80 backdrop-blur-xl border-b border-[#8F6DEF]/20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Left Brand: Logo & Mascot */}
          <div className="flex items-center gap-3">
            <a href="#home" className="flex items-center gap-2.5 group">
              {/* Cute Litmatch Flame Monster Icon */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8F6DEF] via-[#A78BFA] to-[#FF6584] p-0.5 shadow-[0_0_20px_rgba(143,109,239,0.5)] group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-[#1A1036] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <span className="text-xl">👾</span>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FFD13B] animate-pulse" />
                </div>
              </div>

              {/* Wordmark */}
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono flex items-center gap-1">
                  <span>Litmatch</span>
                  <span className="w-2 h-2 rounded-full bg-[#8F6DEF]" />
                </span>
                <span className="text-[10px] text-purple-300/70 font-medium tracking-wide hidden sm:block">
                  Safe & Warm Community
                </span>
              </div>
            </a>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#home"
              onClick={() => setActiveNav("home")}
              className={`transition-colors py-1 relative ${
                activeNav === "home" ? "text-white font-bold" : "text-purple-200/70 hover:text-white"
              }`}
            >
              <span>Home</span>
              {activeNav === "home" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8F6DEF] rounded-full" />
              )}
            </a>

            {/* Safety Center Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsSafetyDropdownOpen(true)}
              onMouseLeave={() => setIsSafetyDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-purple-200/70 hover:text-white py-1 transition-colors cursor-pointer"
              >
                <span>Safety Center</span>
                <ChevronDown size={14} className={isSafetyDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>

              {isSafetyDropdownOpen && (
                <div className="absolute top-full left-0 w-56 pt-2 animate-fade-in">
                  <div className="bg-[#1B1038] border border-[#8F6DEF]/40 rounded-2xl p-2 shadow-2xl backdrop-blur-xl space-y-1">
                    <a href="#safety" className="block px-3 py-2 rounded-xl text-xs text-purple-200 hover:bg-[#8F6DEF] hover:text-white transition">
                      🛡️ Safety Approach
                    </a>
                    <a href="#safety" className="block px-3 py-2 rounded-xl text-xs text-purple-200 hover:bg-[#8F6DEF] hover:text-white transition">
                      👶 Protecting Teens
                    </a>
                    <a href="#safety" className="block px-3 py-2 rounded-xl text-xs text-purple-200 hover:bg-[#8F6DEF] hover:text-white transition">
                      📜 Community Guidelines
                    </a>
                    <a href="#safety" className="block px-3 py-2 rounded-xl text-xs text-purple-200 hover:bg-[#8F6DEF] hover:text-white transition">
                      ⚖️ Law Enforcement
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsAboutDropdownOpen(true)}
              onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-purple-200/70 hover:text-white py-1 transition-colors cursor-pointer"
              >
                <span>About Us</span>
                <ChevronDown size={14} className={isAboutDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>

              {isAboutDropdownOpen && (
                <div className="absolute top-full left-0 w-48 pt-2 animate-fade-in">
                  <div className="bg-[#1B1038] border border-[#8F6DEF]/40 rounded-2xl p-2 shadow-2xl backdrop-blur-xl space-y-1">
                    <a href="#about" className="block px-3 py-2 rounded-xl text-xs text-purple-200 hover:bg-[#8F6DEF] hover:text-white transition">
                      💖 Our Story & Mission
                    </a>
                    <a href="#stories" className="block px-3 py-2 rounded-xl text-xs text-purple-200 hover:bg-[#8F6DEF] hover:text-white transition">
                      ✨ Member Stories
                    </a>
                    <a href="#voice" className="block px-3 py-2 rounded-xl text-xs text-purple-200 hover:bg-[#8F6DEF] hover:text-white transition">
                      🎙️ Audio Rooms
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#stories"
              className="text-purple-200/70 hover:text-white transition-colors py-1"
            >
              Stories
            </a>
          </nav>

          {/* Right Actions: App Store / Play / Close Button */}
          <div className="flex items-center gap-3">
            {/* Download CTA Button */}
            <a
              href="https://apps.apple.com/app/litmatch-make-new-friends/id1498179261"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8F6DEF] hover:bg-[#7149E2] text-white text-xs font-bold transition-all shadow-[0_0_25px_rgba(143,109,239,0.4)] hover:shadow-[0_0_35px_rgba(143,109,239,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download size={14} />
              <span>Download App</span>
            </a>

            {/* Close / Return Button if displayed inside workspace */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-purple-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
                title="Return to Ecosystem"
              >
                <X size={20} />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-purple-200 hover:text-white cursor-pointer"
            >
              <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                <span className="block w-4 h-0.5 bg-white rounded-full"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#150D29] border-b border-[#8F6DEF]/30 px-6 py-4 space-y-3 animate-fade-in text-sm font-medium">
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-white">Home</a>
            <a href="#soul" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-purple-200">Soul Game</a>
            <a href="#stories" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-purple-200">Stories</a>
            <a href="#voice" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-purple-200">Voice Rooms</a>
            <a href="#safety" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-purple-200">Safety Center</a>
            <div className="pt-2 border-t border-purple-900/50 flex gap-2">
              <a
                href="https://apps.apple.com/app/litmatch-make-new-friends/id1498179261"
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-2.5 rounded-full bg-[#8F6DEF] text-white font-bold text-xs"
              >
                Download for iOS & Android
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (.section-l1)                                             */}
      {/* "Meet people's emotional needs through interactive technology"            */}
      {/* ========================================================================= */}
      <section id="home" className="relative pt-28 sm:pt-36 pb-20 sm:pb-32 overflow-hidden">
        {/* Ambient Glowing Orbs Background */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8F6DEF]/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF6584]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Text & Download CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              
              {/* Top Warmth Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8F6DEF]/20 via-[#A78BFA]/20 to-[#FF6584]/20 border border-[#8F6DEF]/50 text-xs font-medium text-purple-200 shadow-inner">
                <Sparkles size={14} className="text-[#FFD13B] animate-spin" />
                <span>50M+ Young People Connecting Worldwide</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-mono">
                Meet people's <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4B5FD] via-[#8F6DEF] to-[#FF6584]">
                  emotional needs
                </span> <br className="hidden sm:block" />
                through technology
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-purple-200/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Litmatch is a safe and warm community for young people to share honest thoughts, discover authentic soul connections, and make real friends with zero appearance pressure.
              </p>

              {/* Download Buttons Stack */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {/* App Store Button */}
                <a
                  href="https://apps.apple.com/app/litmatch-make-new-friends/id1498179261"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-purple-500/40 hover:border-[#8F6DEF] transition-all shadow-xl hover:scale-105 active:scale-95 group cursor-pointer"
                >
                  <div className="text-2xl"></div>
                  <div className="text-left font-sans">
                    <p className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold">Download on the</p>
                    <p className="text-sm font-bold text-white group-hover:text-[#C4B5FD]">App Store</p>
                  </div>
                </a>

                {/* Google Play Button */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.litatom.litmatch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-purple-500/40 hover:border-[#8F6DEF] transition-all shadow-xl hover:scale-105 active:scale-95 group cursor-pointer"
                >
                  <div className="text-2xl">▶</div>
                  <div className="text-left font-sans">
                    <p className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold">Get it on</p>
                    <p className="text-sm font-bold text-white group-hover:text-[#C4B5FD]">Google Play</p>
                  </div>
                </a>

                {/* Live Demo Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("soul");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#8F6DEF] hover:bg-[#7149E2] text-white font-bold text-sm shadow-[0_0_30px_rgba(143,109,239,0.5)] hover:shadow-[0_0_40px_rgba(143,109,239,0.8)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles size={16} className="text-[#FFD13B]" />
                  <span>Try Soul Match</span>
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-purple-300/80 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Verified 16+ Safe Community</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-[#FFD13B] fill-[#FFD13B]" />
                  <span>4.8★ App Store</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock size={16} className="text-[#00F2FE]" />
                  <span>Zero Appearance Pressure</span>
                </div>
              </div>

            </div>

            {/* Right Column: High-Fidelity Mobile App Showcase (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center relative">
              
              {/* Floating Litmatch Monster Avatar Badge */}
              <div className="absolute -top-6 -left-6 sm:left-4 z-20 bg-[#1F143D] border-2 border-[#8F6DEF] rounded-2xl p-3 shadow-2xl flex items-center gap-3 animate-bounce duration-1000">
                <span className="text-2xl">👾</span>
                <div>
                  <p className="text-xs font-bold text-white font-mono">Lulu The Monster</p>
                  <p className="text-[10px] text-emerald-400 font-bold">● Soul Match Active</p>
                </div>
              </div>

              {/* Floating Heart Notification */}
              <div className="absolute -bottom-4 -right-4 sm:right-6 z-20 bg-gradient-to-r from-[#FF6584] to-[#8F6DEF] rounded-2xl p-3 shadow-2xl text-white flex items-center gap-2.5 animate-pulse">
                <Heart size={18} className="fill-white" />
                <span className="text-xs font-bold font-mono">Mutual Match! Reveal Profile?</span>
              </div>

              {/* Mobile Phone Mockup */}
              <div className="w-[280px] sm:w-[320px] h-[580px] sm:h-[620px] bg-[#120D24] border-4 border-stone-800 rounded-[42px] shadow-[0_0_60px_rgba(143,109,239,0.35)] overflow-hidden flex flex-col relative">
                
                {/* iPhone Dynamic Island / Notch */}
                <div className="h-6 bg-black flex items-center justify-center relative">
                  <div className="w-24 h-4 bg-stone-900 rounded-full flex items-center justify-end px-2">
                    <div className="w-2 h-2 rounded-full bg-blue-900" />
                  </div>
                </div>

                {/* Litmatch App Screen UI */}
                <div className="flex-1 bg-gradient-to-b from-[#1A1036] via-[#120D24] to-[#0A0714] p-4 flex flex-col justify-between select-none">
                  
                  {/* In-App Header */}
                  <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👾</span>
                      <span className="font-mono font-bold text-sm text-white">Litmatch</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/80 border border-[#8F6DEF]/40 text-[10px] font-mono text-purple-300">
                      <span>💎 240</span>
                    </div>
                  </div>

                  {/* Soul Game Pairing Radar Card */}
                  <div className="my-auto text-center space-y-4 py-4">
                    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-[#8F6DEF]/30 animate-ping duration-1000" />
                      <div className="absolute inset-2 rounded-full border border-[#8F6DEF]/50" />
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8F6DEF] to-[#FF6584] p-1 shadow-2xl flex items-center justify-center">
                        <div className="w-full h-full bg-[#1F143D] rounded-full flex items-center justify-center text-3xl">
                          🔮
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="px-3 py-1 rounded-full bg-[#8F6DEF]/20 border border-[#8F6DEF]/60 text-[#C4B5FD] text-[11px] font-mono font-bold">
                        Soul Game • Limited 3:00
                      </span>
                      <h3 className="text-white font-bold text-sm mt-2">Connecting by Heart</h3>
                      <p className="text-[11px] text-purple-300/70">Matching with someone listening to indie beats...</p>
                    </div>

                    {/* Chat Bubble Simulation */}
                    <div className="space-y-2 text-left text-xs font-sans">
                      <div className="bg-[#241748] p-2.5 rounded-2xl rounded-tl-none border border-purple-500/20 text-purple-200">
                        "Hey there! What made you smile today? 😊"
                      </div>
                      <div className="bg-[#8F6DEF] text-white p-2.5 rounded-2xl rounded-tr-none ml-auto max-w-[85%] font-medium">
                        "Just discovered a new cozy cafe and listening to acoustic jazz ☕"
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation in Mockup */}
                  <div className="bg-[#150D2E] rounded-2xl p-2.5 border border-purple-900/40 flex items-center justify-around text-xs text-purple-300">
                    <div className="flex flex-col items-center text-[#C4B5FD] font-bold">
                      <span>🔮</span>
                      <span className="text-[9px]">Soul</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>🎙️</span>
                      <span className="text-[9px]">Voice</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>💬</span>
                      <span className="text-[9px]">Chat</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>📖</span>
                      <span className="text-[9px]">Feed</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SOUL GAME SECTION (.section-l2)                                        */}
      {/* "Make Friends with Soul" - 3 Minute Limited Anonymous Chat               */}
      {/* ========================================================================= */}
      <section id="soul" className="py-20 sm:py-28 bg-gradient-to-b from-[#130E26] via-[#1B1038] to-[#120D24] relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Interactive 3-Minute Soul Game Stage Mockup (5 Cols) */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
              <div className="w-[300px] sm:w-[340px] bg-[#1A1136] border-2 border-[#8F6DEF]/70 rounded-3xl p-5 shadow-[0_0_50px_rgba(143,109,239,0.3)] space-y-4">
                
                {/* Top Status & Live Countdown */}
                <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-purple-200">SOUL MATCH LIVE</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-purple-900/80 border border-purple-500/40 font-mono font-bold text-xs text-[#FFD13B]">
                    ⏳ {formatTime(soulCountdown)}
                  </div>
                </div>

                {/* Matched Avatar Profiles */}
                <div className="flex items-center justify-around py-3 bg-[#130A26] rounded-2xl border border-purple-900/50">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8F6DEF] to-purple-400 flex items-center justify-center text-2xl shadow">
                      🦊
                    </div>
                    <span className="text-xs font-bold text-white font-mono">You (Fox)</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono text-purple-400 font-bold">98% SYNC</span>
                    <Heart size={20} className="text-[#FF6584] fill-[#FF6584] animate-pulse my-1" />
                    <span className="text-[10px] text-purple-300">Listening...</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6584] to-pink-400 flex items-center justify-center text-2xl shadow">
                      🐰
                    </div>
                    <span className="text-xs font-bold text-white font-mono">Secret Bunny</span>
                  </div>
                </div>

                {/* Conversation Stream */}
                <div className="space-y-2.5 text-xs font-sans">
                  <div className="p-3 bg-[#241748] rounded-2xl rounded-tl-none border border-purple-500/20 text-purple-100">
                    "I love that we both write poetry late at night. It's so rare to find someone who gets that mood."
                  </div>
                  <div className="p-3 bg-[#8F6DEF] rounded-2xl rounded-tr-none text-white ml-auto max-w-[90%] font-medium">
                    "Right?! In the quiet hours, words finally feel honest without all the daytime noise."
                  </div>
                </div>

                {/* Mutual Like Heart Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSoulIsLiked(!soulIsLiked)}
                    className={`w-full py-3 rounded-2xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      soulIsLiked
                        ? "bg-gradient-to-r from-rose-500 to-[#FF6584] text-white shadow-lg"
                        : "bg-[#2A1B54] hover:bg-[#342268] text-purple-200 border border-purple-500/40"
                    }`}
                  >
                    <Heart size={16} className={soulIsLiked ? "fill-white" : "text-[#FF6584]"} />
                    <span>{soulIsLiked ? "Liked! Waiting for Bunny's Mutual Tap" : "Tap Like to Stay Connected"}</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Right: Feature Descriptions (7 Cols) */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              
              <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-[#8F6DEF] uppercase tracking-wider">
                <span>01. SOUL GAME PROTOCOL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-mono">
                Make Friends <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#8F6DEF] to-[#FF6584]">
                  With True Soul
                </span>
              </h2>

              <p className="text-base text-purple-200/80 leading-relaxed font-sans">
                A 3-minute limited anonymous chat. Break the ice naturally without appearance anxiety—talk about your day, your dreams, and discover emotional resonance.
              </p>

              {/* 3 Core Pillars */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#170E30] border border-purple-900/50 hover:border-[#8F6DEF]/60 transition">
                  <div className="w-10 h-10 rounded-xl bg-[#8F6DEF]/20 border border-[#8F6DEF]/50 flex items-center justify-center text-lg shrink-0">
                    ⏱️
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">3-Minute Fast Icebreaker</h3>
                    <p className="text-xs text-purple-200/70 mt-1">
                      No pressure to maintain endless small talk. A concise 3-minute window keeps energy high and genuine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#170E30] border border-purple-900/50 hover:border-[#8F6DEF]/60 transition">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6584]/20 border border-[#FF6584]/50 flex items-center justify-center text-lg shrink-0">
                    🎭
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">Zero Appearance Judgment</h3>
                    <p className="text-xs text-purple-200/70 mt-1">
                      Interact using customized Litmatch avatars and honest words. Personality and empathy take center stage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#170E30] border border-purple-900/50 hover:border-[#8F6DEF]/60 transition">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD13B]/20 border border-[#FFD13B]/50 flex items-center justify-center text-lg shrink-0">
                    💖
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">Mutual Like Reveal</h3>
                    <p className="text-xs text-purple-200/70 mt-1">
                      You only become mutual friends and unlock persistent direct messages if both of you tap the heart before time runs out.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <a
                  href="https://apps.apple.com/app/litmatch-make-new-friends/id1498179261"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8F6DEF] hover:bg-[#7149E2] text-white font-mono font-bold text-xs transition shadow-[0_0_25px_rgba(143,109,239,0.4)]"
                >
                  <span>Experience Soul Match Now</span>
                  <ArrowRight size={14} />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COMMUNITY STORIES FEED (.section-l3)                                   */}
      {/* "My Story With Litmatch" - User Testimonials & Proof                     */}
      {/* ========================================================================= */}
      <section id="stories" className="py-20 sm:py-28 bg-[#0D091A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <span className="text-xs font-mono font-bold text-[#8F6DEF] uppercase tracking-wider">
              COMMUNITY VOICES & STORIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
              My Story With Litmatch
            </h2>
            <p className="text-sm sm:text-base text-purple-200/70 font-sans">
              Millions of young people share their heartfelt reflections, daily joys, and life-changing connections on Litmatch every day.
            </p>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STORIES.map((story, idx) => (
              <div
                key={story.id}
                className="bg-[#170F2C] border-2 border-purple-900/40 hover:border-[#8F6DEF] rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="space-y-4">
                  {/* Badge & Avatar */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#8F6DEF]/20 border border-[#8F6DEF]/50 flex items-center justify-center text-2xl shadow">
                      {idx === 0 ? "💍" : idx === 1 ? "🎧" : idx === 2 ? "🎤" : "✨"}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-950 text-[#C4B5FD] border border-purple-800/60">
                      {story.badge}
                    </span>
                  </div>

                  {/* Main Quote */}
                  <blockquote className="text-sm font-medium text-white italic leading-relaxed">
                    "{story.quote}"
                  </blockquote>

                  {/* Story Description */}
                  <p className="text-xs text-purple-200/70 leading-relaxed font-sans">
                    {story.subText}
                  </p>
                </div>

                {/* Footer Author & Tags */}
                <div className="pt-4 border-t border-purple-900/50 space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono">{story.name}</span>
                    <span className="text-[11px] text-purple-300/60">{story.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {story.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-purple-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Social Proof Stats Banner */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1E113C] via-[#2A1654] to-[#1E113C] border border-[#8F6DEF]/40 shadow-2xl flex flex-wrap items-center justify-around gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white font-mono">50,000,000+</p>
              <p className="text-xs text-purple-300 font-mono mt-1">Global Active Downloads</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-purple-800/60" />
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#FFD13B] font-mono">1.2 Billion+</p>
              <p className="text-xs text-purple-300 font-mono mt-1">Soul Games Played</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-purple-800/60" />
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#FF6584] font-mono">98.4%</p>
              <p className="text-xs text-purple-300 font-mono mt-1">Positive Friendship Rating</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-purple-800/60" />
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">24 / 7</p>
              <p className="text-xs text-purple-300 font-mono mt-1">Proactive Community Moderation</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VOICE GAME & PARTY ROOMS (.section-l4)                                 */}
      {/* "Warm Voice, Genuine Resonance"                                           */}
      {/* ========================================================================= */}
      <section id="voice" className="py-20 sm:py-28 bg-[#140D2B] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Text & Features (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono font-bold text-[#8F6DEF] uppercase tracking-wider">
                02. AUDIO RESIDENCY & STAGES
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight leading-tight">
                Warm Voice, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#8F6DEF] to-[#FF6584]">
                  Genuine Resonance
                </span>
              </h2>

              <p className="text-base text-purple-200/80 leading-relaxed font-sans">
                Hop into 7-minute voice calls or lively Party Chat rooms. Sing karaoke, share hidden talents, listen to ambient sleep rooms, or just talk late into the night.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#1B1138] border border-purple-900/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#FFD13B] font-mono font-bold text-sm">
                    <Mic size={16} />
                    <span>7-Min Voice Game</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    Feel someone's warmth and mood through real spoken tone before deciding to connect permanently.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1B1138] border border-purple-900/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#00F2FE] font-mono font-bold text-sm">
                    <Radio size={16} />
                    <span>Party Audio Rooms</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    Multi-seat audio stages where friends chat, play trivia games, and enjoy music together.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1B1138] border border-purple-900/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#FF6584] font-mono font-bold text-sm">
                    <Gift size={16} />
                    <span>Animated Virtual Gifts</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    Send sparkling rockets, lucky diamonds, and cute bouquets to celebrate your favorite hosts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1B1138] border border-purple-900/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
                    <Volume2 size={16} />
                    <span>Background Audio</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    Seamlessly browse other apps or text friends while remaining tuned into your favorite voice room.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://apps.apple.com/app/litmatch-make-new-friends/id1498179261"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8F6DEF] hover:bg-[#7149E2] text-white font-mono font-bold text-xs transition shadow-[0_0_25px_rgba(143,109,239,0.4)]"
                >
                  <span>Join a Live Voice Room →</span>
                </a>
              </div>

            </div>

            {/* Right: Live Voice Room Simulation (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[300px] sm:w-[350px] bg-[#1B1038] border-2 border-[#8F6DEF]/70 rounded-3xl p-5 shadow-[0_0_60px_rgba(143,109,239,0.35)] space-y-4">
                
                {/* Room Header */}
                <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">🌙 Midnight Acoustic Cafe</h4>
                    <p className="text-[10px] text-purple-300">Room #8892 • 342 Listeners</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ON AIR</span>
                  </span>
                </div>

                {/* 8-Seat Audio Stage Grid */}
                <div className="grid grid-cols-4 gap-3 py-2 text-center text-xs font-mono">
                  {[
                    { name: "Host Lulu", icon: "👾", isSpeaking: true, role: "Host" },
                    { name: "Aria", icon: "🐱", isSpeaking: true, role: "Speaker" },
                    { name: "Leo", icon: "🦁", isSpeaking: false, role: "Speaker" },
                    { name: "Pipi", icon: "🦄", isSpeaking: false, role: "Speaker" },
                    { name: "Zen", icon: "🐼", isSpeaking: false, role: "Speaker" },
                    { name: "Mika", icon: "🦊", isSpeaking: false, role: "Speaker" },
                    { name: "Koko", icon: "🐨", isSpeaking: false, role: "Speaker" },
                    { name: "+ Sit", icon: "💺", isSpeaking: false, role: "Open" }
                  ].map((seat, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all relative ${
                        seat.isSpeaking
                          ? "bg-[#8F6DEF] border-2 border-[#FFD13B] shadow-[0_0_15px_rgba(255,209,59,0.5)] scale-105"
                          : "bg-[#120A24] border border-purple-800/50"
                      }`}>
                        <span>{seat.icon}</span>
                        {seat.isSpeaking && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                            <Mic size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-white truncate max-w-[60px]">{seat.name}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Audio Spectrum Waveform */}
                <div className="p-3 bg-[#110924] rounded-2xl border border-purple-900/50 flex items-center justify-between gap-1 h-12 px-4">
                  {[20, 60, 90, 45, 80, 100, 70, 30, 85, 40, 95, 60, 75, 50, 85, 30, 70, 90, 40, 20].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-gradient-to-t from-[#8F6DEF] to-[#FF6584] rounded-full transition-all duration-300"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Virtual Gift Bar */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-purple-300 text-[11px] font-mono">Send Gift:</span>
                  <div className="flex items-center gap-2">
                    <button className="px-2.5 py-1 bg-purple-950 border border-purple-700 rounded-xl hover:scale-110 transition cursor-pointer">
                      🌹 10
                    </button>
                    <button className="px-2.5 py-1 bg-purple-950 border border-purple-700 rounded-xl hover:scale-110 transition cursor-pointer">
                      💎 50
                    </button>
                    <button className="px-2.5 py-1 bg-purple-950 border border-purple-700 rounded-xl hover:scale-110 transition cursor-pointer">
                      🚀 200
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SAFE & WARM COMMUNITY GUARDIAN (.section-l5)                           */}
      {/* "Safe, Warm, and Always Protected"                                        */}
      {/* ========================================================================= */}
      <section id="safety" className="py-20 sm:py-28 bg-[#0F0A1C] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-[#1C1236] via-[#241544] to-[#160D2E] border-2 border-[#8F6DEF]/50 rounded-[36px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#8F6DEF]/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero Tolerance for Harmful Conduct</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                Safe, Warm, and Always Protected
              </h2>

              <p className="text-base text-purple-200/80 leading-relaxed font-sans">
                Our primary mission is to keep Litmatch a sanctuary of kindness, inclusivity, and emotional security. We combine real-time AI moderation with human trust & safety specialists who review reports 24 hours a day, 7 days a week.
              </p>

              {/* 4 Safety Safeguard Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                
                <div className="p-4 rounded-2xl bg-[#140A26]/80 border border-purple-800/40 space-y-1">
                  <div className="text-emerald-400 font-bold font-mono text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>24/7 AI Shield & Keyword Filter</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    Offensive messages, harassment, and inappropriate content are blocked automatically in milliseconds.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#140A26]/80 border border-purple-800/40 space-y-1">
                  <div className="text-emerald-400 font-bold font-mono text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>Protecting Teens & Minors</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    Strict age enforcement (16+), restricted content filters, and prompt investigation for suspicious accounts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#140A26]/80 border border-purple-800/40 space-y-1">
                  <div className="text-emerald-400 font-bold font-mono text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>Privacy First Identity</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    Your real phone number, location, and credentials are never made public without your explicit consent.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#140A26]/80 border border-purple-800/40 space-y-1">
                  <div className="text-emerald-400 font-bold font-mono text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>One-Tap Reporting & Blocking</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    Instant user reporting in every chat room, voice stage, and feed post with dedicated human review.
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="https://apps.apple.com/app/litmatch-make-new-friends/id1498179261"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-[#8F6DEF] hover:bg-[#7149E2] text-white font-mono font-bold text-xs transition shadow-lg"
                >
                  Join Safe Community
                </a>
                <a
                  href="#home"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs transition border border-white/20"
                >
                  Read Community Guidelines
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER (.nav-bottom & .nav-footer)                                     */}
      {/* ========================================================================= */}
      <footer className="bg-[#0A0614] border-t border-purple-900/40 pt-16 pb-12 text-sm text-purple-300/70 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-900/40">
            
            {/* Col 1 & 2: Brand & Mission Statement */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#8F6DEF] flex items-center justify-center text-lg shadow">
                  👾
                </div>
                <span className="text-2xl font-black text-white font-mono">Litmatch</span>
              </div>
              <p className="text-xs text-purple-200/70 max-w-sm leading-relaxed">
                Meet people's emotional needs through interactive technology. A safe, warm, and friendly home to express your authentic feelings and find caring companions.
              </p>
              <p className="text-[11px] text-purple-400 font-mono">
                CONSTRUCT TECHNOLOGY PTE. LTD.
              </p>
            </div>

            {/* Col 3: Product */}
            <div className="space-y-3 text-xs">
              <h4 className="text-white font-mono font-bold text-sm">Product</h4>
              <ul className="space-y-2">
                <li><a href="#soul" className="hover:text-white transition">Soul Game (3-Min Chat)</a></li>
                <li><a href="#voice" className="hover:text-white transition">Voice Game (7-Min Audio)</a></li>
                <li><a href="#voice" className="hover:text-white transition">Party Audio Rooms</a></li>
                <li><a href="#stories" className="hover:text-white transition">Community Feed</a></li>
                <li><a href="#home" className="hover:text-white transition">Monster Avatars</a></li>
              </ul>
            </div>

            {/* Col 4: Safety & Support */}
            <div className="space-y-3 text-xs">
              <h4 className="text-white font-mono font-bold text-sm">Safety Center</h4>
              <ul className="space-y-2">
                <li><a href="#safety" className="hover:text-white transition">Safety Approach</a></li>
                <li><a href="#safety" className="hover:text-white transition">Protecting Teens</a></li>
                <li><a href="#safety" className="hover:text-white transition">Community Guidelines</a></li>
                <li><a href="#safety" className="hover:text-white transition">Law Enforcement</a></li>
                <li><a href="#safety" className="hover:text-white transition">Report an Issue</a></li>
              </ul>
            </div>

            {/* Col 5: Company & Legal */}
            <div className="space-y-3 text-xs">
              <h4 className="text-white font-mono font-bold text-sm">Legal & Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-white transition">About Litmatch</a></li>
                <li><a href="#about" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#about" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#about" className="hover:text-white transition">Cookie Policy</a></li>
                <li><a href="#about" className="hover:text-white transition">Careers & Press</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar (.nav-footer) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-purple-400/60">
            <p>© 2026 Litmatch. CONSTRUCT TECHNOLOGY PTE. LTD. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-purple-300 cursor-pointer">English (US)</span>
              <span>·</span>
              <span className="hover:text-purple-300 cursor-pointer">Privacy & Terms</span>
              <span>·</span>
              <span className="text-emerald-400">● Global Servers Online</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LitmatchLandingPage;
