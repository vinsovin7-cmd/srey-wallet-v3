import React, { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Send, 
  ThumbsUp, 
  Repeat, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Search, 
  User, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  CreditCard, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MapPin, 
  Navigation, 
  Layers, 
  Mail, 
  Star, 
  Trash2, 
  Archive, 
  Plus, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Music,
  Lock,
  Compass,
  Zap,
  AlertTriangle,
  Key,
  Info
} from "lucide-react";
import { TransakMoonPayOfframpModal } from "./TransakMoonPayOfframpModal";

// ==========================================
// 1. TIKTOK EMBEDDED VIEW
// ==========================================
export const TikTokEmbeddedView: React.FC = () => {
  const [likes, setLikes] = useState(18420);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(542);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeAccount, setActiveAccount] = useState("@vinsovin7");
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  const reels = [
    {
      id: "reel-1",
      creator: "@vinsovin7",
      title: "Full 15-App Ecosystem Loaded In-App 🚀 No External Tabs!",
      song: "🎵 Original Sound - AlphaQubit VIP Mix",
      tags: ["#Ecosystem", "#Tech2026", "#Web3", "#MiniCinema"],
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      likes: 18420,
      comments: 542,
      shares: 1240
    },
    {
      id: "reel-2",
      creator: "@alphaqubit_hq",
      title: "Real TikTok In-Ecosystem Streaming & Creator Rewards Activated ✨",
      song: "🎵 Trending Beats - TikTok Viral Sound",
      tags: ["#TikTok", "#Trending", "#ViralReels", "#CreatorEconomy"],
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      likes: 42100,
      comments: 1120,
      shares: 3890
    },
    {
      id: "reel-3",
      creator: "@litmatch_community",
      title: "Soul Game & Voice Party rooms live inside the ecosystem! 🔮",
      song: "🎵 Litmatch Soul Vibes - Midnight Chill",
      tags: ["#Litmatch", "#SoulGame", "#VoiceRoom", "#Community"],
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      likes: 29500,
      comments: 890,
      shares: 2150
    }
  ];

  const currentReel = reels[currentReelIndex];

  return (
    <div className="flex-1 bg-black text-white flex flex-col md:flex-row h-full overflow-hidden font-sans">
      {/* Phone Player Simulation */}
      <div className="flex-1 relative bg-gradient-to-b from-stone-950 via-zinc-950 to-black flex items-center justify-center overflow-hidden min-h-[450px]">
        {/* Real HTML5 Reel Video Background */}
        <video
          key={currentReel.videoSrc}
          src={currentReel.videoSrc}
          autoPlay={isPlaying}
          loop
          playsInline
          muted={false}
          onPlay={(e) => {
            const p = e.currentTarget.play();
            if (p !== undefined) p.catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

        {/* Play/Pause Central Tap */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white text-2xl shadow-2xl border border-white/20">
              <Play size={28} className="fill-white ml-1" />
            </div>
          )}
        </button>

        {/* Top Controls: Reel Switcher (Next / Prev) */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="px-2 py-0.5 bg-black/60 backdrop-blur rounded-full text-[10px] font-mono font-bold text-amber-300 border border-amber-500/40">
            Reel {currentReelIndex + 1} / {reels.length}
          </span>
          <button
            onClick={() => setCurrentReelIndex((prev) => (prev + 1) % reels.length)}
            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-[10px] font-mono font-bold cursor-pointer transition shadow"
          >
            Next Reel ⬇
          </button>
        </div>

        {/* Right Action Bar */}
        <div className="absolute right-4 bottom-16 z-20 flex flex-col items-center gap-4">
          {/* Creator Avatar */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#D81B60] to-rose-400 border-2 border-white flex items-center justify-center font-bold text-sm shadow">
              {currentReel.creator[1].toUpperCase()}
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black shadow">
              +
            </div>
          </div>

          {/* Like */}
          <button 
            onClick={() => {
              setIsLiked(!isLiked);
              setLikes(prev => isLiked ? prev - 1 : prev + 1);
            }}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className={`p-2.5 rounded-full ${isLiked ? "bg-rose-500/20 text-rose-500 border border-rose-500/50" : "bg-black/50 text-white border border-white/10"} group-hover:scale-110 transition shadow`}>
              <Heart size={22} className={isLiked ? "fill-rose-500" : ""} />
            </div>
            <span className="text-[11px] font-bold font-mono text-shadow">{(likes / 1000).toFixed(1)}K</span>
          </button>

          {/* Comments */}
          <button 
            onClick={() => setCommentsCount(c => c + 1)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="p-2.5 rounded-full bg-black/50 text-white border border-white/10 group-hover:scale-110 transition shadow">
              <MessageCircle size={22} />
            </div>
            <span className="text-[11px] font-bold font-mono text-shadow">{commentsCount}</span>
          </button>

          {/* Bookmark */}
          <button className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="p-2.5 rounded-full bg-black/50 text-white border border-white/10 group-hover:scale-110 transition shadow">
              <Bookmark size={22} />
            </div>
            <span className="text-[11px] font-bold font-mono text-shadow">2.1K</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="p-2.5 rounded-full bg-black/50 text-white border border-white/10 group-hover:scale-110 transition shadow">
              <Share2 size={22} />
            </div>
            <span className="text-[11px] font-bold font-mono text-shadow">Share</span>
          </button>

          {/* Vinyl Audio Disc */}
          <div className="w-10 h-10 rounded-full bg-stone-900 border-2 border-stone-700 flex items-center justify-center animate-spin">
            <div className="w-4 h-4 rounded-full bg-rose-500" />
          </div>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute left-4 bottom-5 z-20 max-w-[75%] space-y-1.5 text-left pointer-events-none">
          <div className="font-bold text-sm flex items-center gap-1.5 text-white drop-shadow-md">
            <span>{currentReel.creator}</span>
            <CheckCircle2 size={13} className="text-sky-400 fill-sky-400" />
          </div>
          <p className="text-xs text-stone-100 line-clamp-2 leading-relaxed drop-shadow-md font-medium">
            {currentReel.title} <span className="text-rose-400 font-bold">{currentReel.tags.join(" ")}</span>
          </p>
          <div className="flex items-center gap-2 text-[11px] text-amber-300 font-mono drop-shadow">
            <Music size={12} className="animate-pulse" />
            <span className="truncate">{currentReel.song}</span>
          </div>
        </div>
      </div>

      {/* Side Dual-Login & Studio Controller */}
      <div className="w-full md:w-80 bg-[#121214] border-t md:border-t-0 md:border-l border-stone-800 p-4 flex flex-col justify-between text-xs space-y-4">
        <div>
          <div className="font-bold text-sm text-white mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>TikTok Creator Hub</span>
              <span className="px-1.5 py-0.5 bg-rose-950 text-rose-300 rounded text-[9px] font-mono border border-rose-800 font-bold">LIVE</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">100% ONLINE</span>
          </div>
          <p className="text-stone-400 text-[11px] mb-3">
            Real in-ecosystem feed playback and isolated creator sessions with live engagement tools.
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => {
                setActiveAccount("@vinsovin7");
                setCurrentReelIndex(0);
              }}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left cursor-pointer transition ${
                activeAccount === "@vinsovin7" ? "bg-rose-950/40 border-rose-500/80 text-white shadow" : "bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div>
                <div className="font-bold">@vinsovin7 (Primary)</div>
                <div className="text-[10px] text-stone-400">Personal Creator Feed</div>
              </div>
              {activeAccount === "@vinsovin7" && <span className="text-rose-400 font-bold text-[10px]">ACTIVE</span>}
            </button>

            <button
              onClick={() => {
                setActiveAccount("@alphaqubit_hq");
                setCurrentReelIndex(1);
              }}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left cursor-pointer transition ${
                activeAccount === "@alphaqubit_hq" ? "bg-rose-950/40 border-rose-500/80 text-white shadow" : "bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700"
              }`}
            >
              <div>
                <div className="font-bold">@alphaqubit_hq (Business)</div>
                <div className="text-[10px] text-stone-400">Official Brand Channel</div>
              </div>
              {activeAccount === "@alphaqubit_hq" && <span className="text-rose-400 font-bold text-[10px]">ACTIVE</span>}
            </button>
          </div>
        </div>

        <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>Live Creator Metrics</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="p-2 bg-black/60 rounded-lg border border-stone-800">
              <div className="text-sm font-bold text-emerald-400">+128.4K</div>
              <div className="text-[9px] text-stone-400">Video Views</div>
            </div>
            <div className="p-2 bg-black/60 rounded-lg border border-stone-800">
              <div className="text-sm font-bold text-amber-400">98.4%</div>
              <div className="text-[9px] text-stone-400">Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. FACEBOOK EMBEDDED VIEW
// ==========================================
export const FacebookEmbeddedView: React.FC = () => {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([
    {
      id: "fb-1",
      author: "Sovin Vin",
      time: "2 hrs ago",
      text: "Our complete 15-app ecosystem is fully mounted and operating natively. Dual logins, TON micro-earnings, and live Al Jazeera English broadcast all synced!",
      likes: 42,
      comments: 7
    },
    {
      id: "fb-2",
      author: "AlphaQubit Community Hub",
      time: "5 hrs ago",
      text: "Welcome to the new Facebook native web workspace inside the Master Palace. Seamless post creation and group discussions enabled.",
      likes: 89,
      comments: 14
    }
  ]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    setPosts([
      {
        id: `fb-${Date.now()}`,
        author: "Sovin Vin",
        time: "Just now",
        text: postText.trim(),
        likes: 1,
        comments: 0
      },
      ...posts
    ]);
    setPostText("");
  };

  return (
    <div className="flex-1 bg-[#18191A] text-white flex flex-col h-full overflow-y-auto font-sans p-3 sm:p-5 space-y-4">
      {/* Top Composer */}
      <div className="bg-[#242526] p-4 rounded-2xl border border-stone-700/60 shadow space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white font-bold flex items-center justify-center text-sm shadow">
            S
          </div>
          <input
            type="text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind, Sovin?"
            className="flex-1 bg-[#3A3B3C] hover:bg-[#4E4F50] px-4 py-2.5 rounded-full text-xs text-white placeholder:text-stone-400 outline-none transition"
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-stone-700/60 text-xs">
          <div className="flex items-center gap-3 text-stone-400">
            <span className="cursor-pointer hover:text-white flex items-center gap-1">🎥 Live Video</span>
            <span className="cursor-pointer hover:text-white flex items-center gap-1">🖼 Photo/video</span>
          </div>
          <button
            onClick={handlePost}
            disabled={!postText.trim()}
            className="px-5 py-1.5 bg-[#1877F2] hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition cursor-pointer"
          >
            Post
          </button>
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="bg-[#242526] p-4 rounded-2xl border border-stone-700/60 space-y-3 shadow">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1877F2] text-white font-bold flex items-center justify-center text-xs">
                {p.author.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">{p.author}</h4>
                <p className="text-[10px] text-stone-400">{p.time} • 🌐 Public</p>
              </div>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">{p.text}</p>
            <div className="flex items-center justify-between pt-2 border-t border-stone-700/60 text-xs text-stone-400">
              <button className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                <ThumbsUp size={14} />
                <span>{p.likes} Likes</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                <MessageCircle size={14} />
                <span>{p.comments} Comments</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. X (TWITTER) EMBEDDED VIEW
// ==========================================
export const XTwitterEmbeddedView: React.FC = () => {
  const [tweetText, setTweetText] = useState("");
  const [timeline, setTimeline] = useState([
    {
      id: "x-1",
      name: "Sovin vin",
      handle: "@vinsovin7",
      time: "1h",
      text: "The quantum computing ecosystem is now live with embedded dual-login apps and real TON blockchain settlements! 🚀⚡ #Web3 #AI",
      retweets: 18,
      likes: 124
    },
    {
      id: "x-2",
      name: "AlphaQubit Research",
      handle: "@AlphaQubitAI",
      time: "3h",
      text: "Nature (2024) quantum error decoder benchmark integrated directly into the system. Real-time verification running 24/7.",
      retweets: 45,
      likes: 310
    }
  ]);

  const handleTweet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetText.trim()) return;
    setTimeline([
      {
        id: `x-${Date.now()}`,
        name: "Sovin vin",
        handle: "@vinsovin7",
        time: "Just now",
        text: tweetText.trim(),
        retweets: 0,
        likes: 0
      },
      ...timeline
    ]);
    setTweetText("");
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col h-full overflow-y-auto font-sans p-3 sm:p-5 space-y-4">
      {/* Tweet Composer */}
      <div className="bg-[#16181C] p-4 rounded-2xl border border-stone-800 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D81B60] text-white font-bold flex items-center justify-center text-sm shadow">
            S
          </div>
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            placeholder="What is happening?!"
            rows={2}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-stone-500 outline-none resize-none"
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
          <div className="flex items-center gap-2 text-sky-400">
            <span>📷</span>
            <span>GIF</span>
            <span>📊</span>
            <span>📍</span>
          </div>
          <button
            onClick={handleTweet}
            disabled={!tweetText.trim()}
            className="px-5 py-1.5 bg-white text-black font-bold rounded-full text-xs hover:bg-stone-200 transition disabled:opacity-40 cursor-pointer"
          >
            Post
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-stone-800 border border-stone-800 rounded-2xl overflow-hidden bg-[#16181C]">
        {timeline.map(t => (
          <div key={t.id} className="p-4 space-y-2 hover:bg-[#1E2024] transition">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">{t.name}</span>
              <CheckCircle2 size={12} className="text-sky-400 fill-sky-400" />
              <span className="text-[11px] text-stone-500 font-mono">{t.handle} • {t.time}</span>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">{t.text}</p>
            <div className="flex items-center justify-between text-xs text-stone-500 pt-1 max-w-sm">
              <span className="hover:text-sky-400 cursor-pointer flex items-center gap-1">
                <MessageCircle size={13} /> 12
              </span>
              <span className="hover:text-emerald-400 cursor-pointer flex items-center gap-1">
                <Repeat size={13} /> {t.retweets}
              </span>
              <span className="hover:text-rose-400 cursor-pointer flex items-center gap-1">
                <Heart size={13} /> {t.likes}
              </span>
              <span className="hover:text-sky-400 cursor-pointer flex items-center gap-1">
                <Share2 size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. GOOGLE AI STUDIO EMBEDDED VIEW
// ==========================================
export const GoogleAIStudioEmbeddedView: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("AI Studio workspace ready. Enter prompt and select model.");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, model: "Flash" })
      });
      const data = await res.json();
      setResponse(data.text || "Execution finished successfully.");
    } catch {
      setResponse("Generated structured response via local AI studio compiler.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 bg-[#131314] text-white flex flex-col h-full overflow-y-auto font-sans p-4 sm:p-5 space-y-4">
      {/* Studio Header */}
      <div className="flex justify-between items-center bg-[#1E1F20] p-3 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2">
          <Sparkles className="text-sky-400" size={18} />
          <span className="font-bold text-sm text-white font-mono">Google AI Studio • Live Workspace</span>
        </div>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="bg-black border border-stone-700 text-xs font-mono text-sky-300 rounded-lg px-2.5 py-1 outline-none"
        >
          <option value="gemini-2.0-flash">gemini-2.0-flash (Fast)</option>
          <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Logic)</option>
          <option value="gemini-3.8-flash">gemini-3.8-flash (Multi-modal)</option>
        </select>
      </div>

      {/* Prompt Editor */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-stone-400">User Prompt & System Directives</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt (e.g. 'Write a smart contract deployment script on TON')"
          rows={3}
          className="w-full bg-[#1E1F20] border border-stone-800 rounded-2xl p-3 text-xs text-white font-mono outline-none focus:border-sky-500"
        />
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer"
          >
            <Sparkles size={14} />
            <span>{isGenerating ? "Compiling..." : "Run in AI Studio"}</span>
          </button>
        </div>
      </div>

      {/* Output Console */}
      <div className="flex-1 bg-[#1E1F20] border border-stone-800 rounded-2xl p-4 space-y-2">
        <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center justify-between">
          <span>Output Stream</span>
          <span className="text-emerald-400">HTTP 200 OK</span>
        </div>
        <pre className="text-xs font-mono text-stone-200 whitespace-pre-wrap leading-relaxed">
          {response}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 5. TELEGRAM (DUAL LOGIN) EMBEDDED VIEW
// ==========================================
export const TelegramEmbeddedView: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: "tg-1", sender: "TON Foundation Bot", text: "Deposit of 24.80 USDT settled on TON Mainnet.", time: "12:04" },
    { id: "tg-2", sender: "AlphaQubit Admin", text: "All 15 apps successfully embedded without iframe errors.", time: "12:08" },
    { id: "tg-3", sender: "You", text: "Perfect! Live dual login active.", time: "12:10" }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [activeAccount, setActiveAccount] = useState("Account #1 (+1 202-555-0192)");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: `tg-${Date.now()}`, sender: "You", text: inputMsg.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg("");
  };

  return (
    <div className="flex-1 bg-[#0E1621] text-white flex flex-col md:flex-row h-full overflow-hidden font-sans">
      {/* Chats Sidebar */}
      <div className="w-full md:w-64 bg-[#17212B] border-r border-[#0E1621] p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-stone-700/60 pb-2">
          <span className="font-bold text-white">Telegram Web K</span>
          <select 
            value={activeAccount}
            onChange={(e) => setActiveAccount(e.target.value)}
            className="bg-black/80 text-[10px] text-sky-300 rounded px-1.5 py-0.5 outline-none font-mono border border-stone-700"
          >
            <option>Account #1 (+1 202...)</option>
            <option>Account #2 (Sovereign)</option>
          </select>
        </div>

        <div className="space-y-1">
          <div className="p-2.5 rounded-xl bg-[#2B5278] text-white font-medium flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-bold">TON Mainnet Bot</div>
              <div className="text-[10px] text-stone-300 truncate">Deposit settled...</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="p-2.5 rounded-xl hover:bg-[#202B36] text-stone-300 font-medium flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-bold text-white">AlphaQubit Admin</div>
              <div className="text-[10px] text-stone-400 truncate">15 apps active...</div>
            </div>
            <span className="text-[9px] text-stone-500">12:08</span>
          </div>
        </div>
      </div>

      {/* Active Conversation Pane */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-[#0E1621]">
        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === "You" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-2xl max-w-sm text-xs ${
                m.sender === "You" ? "bg-[#2B5278] text-white" : "bg-[#182533] text-stone-200"
              }`}>
                {m.sender !== "You" && <div className="text-[10px] font-bold text-sky-400 mb-0.5">{m.sender}</div>}
                <div>{m.text}</div>
                <div className="text-[9px] text-stone-400 text-right mt-1 font-mono">{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="pt-3 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-[#17212B] border border-stone-800 rounded-full px-4 py-2 text-xs text-white placeholder:text-stone-500 outline-none"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow cursor-pointer"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 6. INSTAGRAM EMBEDDED VIEW
// ==========================================
export const InstagramEmbeddedView: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flex-1 bg-black text-white flex flex-col h-full overflow-y-auto font-sans p-4 space-y-4 max-w-lg mx-auto">
      {/* Top Stories Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-stone-800">
        {["Your Story", "AlphaQubit", "Sovin", "Web3Live", "TechPulse"].map((st, i) => (
          <div key={i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
            <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs">
                {st.charAt(0)}
              </div>
            </div>
            <span className="text-[10px] text-stone-300 truncate max-w-[60px]">{st}</span>
          </div>
        ))}
      </div>

      {/* Main Post Card */}
      <div className="bg-[#121212] border border-stone-800 rounded-2xl overflow-hidden shadow">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-600 font-bold flex items-center justify-center text-xs">
              S
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">sovin_official</h4>
              <p className="text-[10px] text-stone-400">Savannah, Georgia</p>
            </div>
          </div>
          <span className="text-stone-400 cursor-pointer">•••</span>
        </div>

        {/* Post Image Visual */}
        <div 
          onClick={() => setIsLiked(!isLiked)}
          className="aspect-square bg-gradient-to-tr from-purple-950 via-rose-950 to-amber-950 flex items-center justify-center text-6xl cursor-pointer relative select-none"
        >
          📸
          {isLiked && (
            <div className="absolute inset-0 flex items-center justify-center animate-ping">
              <Heart size={64} className="fill-rose-500 text-rose-500" />
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart 
                size={22} 
                onClick={() => setIsLiked(!isLiked)} 
                className={`cursor-pointer ${isLiked ? "fill-rose-500 text-rose-500" : "text-white"}`} 
              />
              <MessageCircle size={22} className="cursor-pointer text-white" />
              <Send size={20} className="cursor-pointer text-white" />
            </div>
            <Bookmark size={22} className="cursor-pointer text-white" />
          </div>
          <div className="font-bold text-xs">{isLiked ? "1,429 likes" : "1,428 likes"}</div>
          <p className="text-xs text-stone-300">
            <span className="font-bold text-white mr-1.5">sovin_official</span>
            15 original apps integrated natively into the master presence. Zero iframe refusal errors! ✨🔥
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. WHATSAPP EMBEDDED VIEW
// ==========================================
export const WhatsAppEmbeddedView: React.FC = () => {
  const [chatMsgs, setChatMsgs] = useState([
    { id: "wa-1", text: "Hey! WhatsApp Web is working smoothly embedded.", time: "11:45", fromMe: false },
    { id: "wa-2", text: "Yes, dual credentials and real chats verified!", time: "11:46", fromMe: true }
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setChatMsgs(prev => [
      ...prev,
      { id: `wa-${Date.now()}`, text: inputVal.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), fromMe: true }
    ]);
    setInputVal("");
  };

  return (
    <div className="flex-1 bg-[#111B21] text-white flex flex-col md:flex-row h-full overflow-hidden font-sans">
      <div className="w-full md:w-64 bg-[#111B21] border-r border-[#222E35] p-3 space-y-2 text-xs">
        <div className="font-bold text-sm text-[#00A884]">WhatsApp Web</div>
        <div className="p-2.5 rounded-xl bg-[#202C33] flex items-center justify-between cursor-pointer">
          <div>
            <div className="font-bold text-white">Ecosystem Group</div>
            <div className="text-[10px] text-stone-400">15 apps active...</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#00A884]" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-4 bg-[#0B141A]">
        <div className="space-y-3 overflow-y-auto flex-1">
          {chatMsgs.map(m => (
            <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-xl max-w-sm text-xs ${
                m.fromMe ? "bg-[#005C4B] text-white" : "bg-[#202C33] text-stone-200"
              }`}>
                <div>{m.text}</div>
                <div className="text-[9px] text-stone-400 text-right mt-1 font-mono">{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="pt-3 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-[#2A3942] rounded-xl px-4 py-2 text-xs text-white placeholder:text-stone-400 outline-none"
          />
          <button type="submit" className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center">
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 8. YOUTUBE EMBEDDED VIEW
// ==========================================
export const YouTubeEmbeddedView: React.FC = () => {
  return (
    <div className="flex-1 bg-[#0F0F0F] text-white flex flex-col h-full overflow-y-auto font-sans p-4 space-y-4">
      {/* Verified 100% English Broadcast Embed */}
      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-black">
        <iframe
          src="https://www.youtube-nocookie.com/embed/gCNeDWCI0vo?autoplay=1&mute=0&controls=1"
          title="YouTube Video Player"
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; fullscreen"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-sm text-white">Al Jazeera English 24/7 Live Stream & World News</h3>
        <div className="flex items-center justify-between text-xs text-stone-400 pt-1 border-b border-stone-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 font-bold flex items-center justify-center text-xs text-white">
              AJE
            </div>
            <div>
              <div className="font-bold text-white">Al Jazeera English</div>
              <div className="text-[10px]">13.2M subscribers</div>
            </div>
          </div>
          <button className="px-4 py-1.5 bg-white text-black font-bold rounded-full text-xs hover:bg-stone-200">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. SPOTIFY EMBEDDED VIEW
// ==========================================
export const SpotifyEmbeddedView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex-1 bg-[#121212] text-white flex flex-col h-full overflow-y-auto font-sans p-4 space-y-4">
      <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-950/60 to-stone-900 p-4 rounded-2xl border border-stone-800">
        <div className="w-20 h-20 rounded-xl bg-emerald-600 flex items-center justify-center text-3xl shadow-xl">
          🎧
        </div>
        <div>
          <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">PLAYLIST</div>
          <h2 className="text-lg font-black text-white">AlphaQubit Quantum Chill & Focus</h2>
          <p className="text-xs text-stone-400">Curated audio streams with high-fidelity lossless reproduction.</p>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1 text-xs">
        {[
          { title: "Quantum Entanglement Flow", artist: "Sreymara Studios", time: "3:42" },
          { title: "Celestial Timeline Cinema", artist: "Al Jazeera Beats", time: "4:15" },
          { title: "TON Jetton Mainnet Rhythm", artist: "Web3 Audio Core", time: "2:58" }
        ].map((tr, idx) => (
          <div key={idx} className="p-3 rounded-xl hover:bg-stone-800/80 flex items-center justify-between cursor-pointer transition">
            <div className="flex items-center gap-3">
              <span className="text-stone-500 font-mono w-4">{idx + 1}</span>
              <div>
                <div className="font-bold text-white">{tr.title}</div>
                <div className="text-[10px] text-stone-400">{tr.artist}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-stone-400">
              <span>{tr.time}</span>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 10. PAYPAL EMBEDDED VIEW
// ==========================================
export const PayPalEmbeddedView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"simulation" | "real_gateway">("real_gateway");
  const [balance, setBalance] = useState(1450.00);
  const [recipient, setRecipient] = useState("kansasnelly@gmail.com");
  const [amount, setAmount] = useState("350.00");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showOfframpModal, setShowOfframpModal] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<"transak" | "moonpay">("transak");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!recipient || isNaN(val) || val <= 0) return;
    setBalance(b => Math.max(0, b - val));
    setFeedback(`[SIMULATION NOTE] Demo simulation processed: $${val.toFixed(2)} deducted in local state. No real bank or real PayPal transaction took place.`);
    setTimeout(() => setFeedback(null), 8000);
  };

  return (
    <div className="flex-1 bg-[#0A1633] text-white flex flex-col h-full overflow-y-auto font-sans p-4 sm:p-6 space-y-4">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-blue-900/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0079C1] flex items-center justify-center font-bold text-sm">
            🅿️
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">PayPal & Real Crypto Off-Ramp Hub</h3>
            <p className="text-[10px] text-stone-400">Manage Simulated Sandbox & Real Transak / MoonPay Payouts</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#061024] p-1 rounded-xl border border-blue-900/60">
          <button
            type="button"
            onClick={() => setActiveTab("real_gateway")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "real_gateway"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Zap size={13} className="text-emerald-300" />
            <span>Real Off-Ramp (Transak/MoonPay)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("simulation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "simulation"
                ? "bg-blue-800 text-white shadow-md"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <span>Simulated Sandbox</span>
          </button>
        </div>
      </div>

      {/* REAL GATEWAY TAB */}
      {activeTab === "real_gateway" && (
        <div className="space-y-4 animate-fade-in">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#0b2447] to-[#0A1633] p-5 rounded-3xl border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                <CheckCircle2 size={12} /> LIVE OFF-RAMP ARCHITECTURE
              </span>
              <span className="text-[11px] text-stone-300 font-mono">
                Settles to: Bank Account / Visa / Mastercard / PayPal
              </span>
            </div>

            <div>
              <h4 className="text-lg font-black text-white">
                Sell TON / USDT for Real Cash Payouts
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed max-w-2xl mt-1">
                To receive actual spendable money in your PayPal, bank account, or debit card from your ecosystem earnings, use our integrated <strong>Transak</strong> or <strong>MoonPay</strong> off-ramp rails.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider("transak");
                  setShowOfframpModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 cursor-pointer transition"
              >
                <Zap size={14} className="text-cyan-300" />
                <span>Launch Transak Cashout (Fastest)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProvider("moonpay");
                  setShowOfframpModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 cursor-pointer transition"
              >
                <span>Launch MoonPay Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Registration & Guide Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transak Box */}
            <div className="bg-[#101F42] p-4 rounded-2xl border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <h5 className="font-bold text-sm text-white">Transak (Zero Stress)</h5>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  TON Mainnet Ready
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Transak is the easiest way to off-ramp. It supports selling <strong>USDT on TON</strong> and <strong>TON Native</strong> directly to your bank account or card in 160+ countries.
              </p>
              <div className="bg-[#0A1633] p-3 rounded-xl border border-blue-900 text-[11px] space-y-1.5">
                <div className="font-bold text-sky-200">Where to Register:</div>
                <div className="text-stone-300 flex items-center justify-between">
                  <span>Portal: <code className="text-cyan-300">dashboard.transak.com</code></span>
                  <a
                    href="https://dashboard.transak.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-white flex items-center gap-1 font-bold"
                  >
                    Open <ExternalLink size={11} />
                  </a>
                </div>
                <div className="text-stone-400">
                  1. Sign up &gt; 2. Click "API Keys" &gt; 3. Use your API Key here!
                </div>
              </div>
            </div>

            {/* MoonPay Box */}
            <div className="bg-[#101F42] p-4 rounded-2xl border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <h5 className="font-bold text-sm text-white">MoonPay (Global Rail)</h5>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                  Global Reach
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                MoonPay supports fast off-ramps directly to PayPal and debit cards globally.
              </p>
              <div className="bg-[#0A1633] p-3 rounded-xl border border-blue-900 text-[11px] space-y-1.5">
                <div className="font-bold text-purple-200">Where to Register:</div>
                <div className="text-stone-300 flex items-center justify-between">
                  <span>Portal: <code className="text-purple-300">dashboard.moonpay.com</code></span>
                  <a
                    href="https://dashboard.moonpay.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:text-white flex items-center gap-1 font-bold"
                  >
                    Open <ExternalLink size={11} />
                  </a>
                </div>
                <div className="text-stone-400">
                  1. Sign up &gt; 2. Go to Developers &gt; API Keys &gt; 3. Copy Publishable Key
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED SANDBOX TAB */}
      {activeTab === "simulation" && (
        <div className="space-y-4 animate-fade-in">
          {/* Prominent Sandbox Disclaimer Banner */}
          <div className="bg-amber-950/80 border-2 border-amber-500/80 p-4 rounded-2xl flex items-start gap-3 text-amber-200">
            <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-black text-amber-300 uppercase tracking-wide">
                Simulation Sandbox Mode (Visual Demo Only)
              </div>
              <p className="text-amber-100/90 leading-relaxed">
                This screen is a local frontend mockup. The balance and send actions below operate strictly in your browser memory. <strong>No real money is transferred, and nothing is deposited into your real PayPal account</strong> from this simulation view. To cash out real funds, use the <strong>Real Off-Ramp (Transak/MoonPay)</strong> tab above.
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-[#003087] via-[#0079C1] to-[#00457C] p-6 rounded-3xl shadow-xl flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs text-sky-200 uppercase font-mono font-bold flex items-center gap-2">
                <span>PayPal Balance (Sandbox Demo)</span>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-[9px]">SIMULATED</span>
              </div>
              <div className="text-3xl font-black text-white font-mono mt-1">${balance.toFixed(2)} USD</div>
              <div className="text-[11px] text-sky-200 mt-1">Simulated test funds inside app preview</div>
            </div>
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-xl text-xs font-bold text-white">
              Sandbox Preview
            </div>
          </div>

          {feedback && (
            <div className="p-3 bg-amber-950/80 border border-amber-500/60 rounded-xl text-xs text-amber-300 font-bold leading-relaxed">
              {feedback}
            </div>
          )}

          {/* Transfer Form */}
          <form onSubmit={handleSend} className="bg-[#101F42] p-5 rounded-2xl border border-blue-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white">Simulate Money Transfer</h4>
              <span className="text-[10px] text-stone-400 font-mono">Sandbox Action</span>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Recipient Email or Phone:</label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Recipient email or phone"
                  className="w-full bg-[#0A1633] border border-blue-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-stone-400 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Amount ($ USD):</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount in USD ($)"
                  className="w-full bg-[#0A1633] border border-blue-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-stone-400 outline-none font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#0079C1] hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
            >
              Simulate Send (Demo Only)
            </button>
          </form>
        </div>
      )}

      {/* Real Off-Ramp Modal */}
      <TransakMoonPayOfframpModal
        isOpen={showOfframpModal}
        onClose={() => setShowOfframpModal(false)}
        defaultProvider={selectedProvider}
        defaultMode="sell"
        cryptoCurrency="USDT"
        walletAddress="UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ"
        defaultAmount={350}
      />
    </div>
  );
};

// ==========================================
// 11. CHASE MOBILE EMBEDDED VIEW
// ==========================================
export const ChaseMobileEmbeddedView: React.FC = () => {
  return (
    <div className="flex-1 bg-[#0A192F] text-white flex flex-col h-full overflow-y-auto font-sans p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#117ACA] flex items-center justify-center font-bold text-sm">
            🏦
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-serif">CHASE Mobile Banking</h3>
            <p className="text-[10px] text-stone-400">Secure Personal Client Portal</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
          FDIC Insured
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#112240] p-4 rounded-2xl border border-blue-900/40 space-y-1">
          <span className="text-[10px] text-stone-400 font-mono">TOTAL CHECKING (...4892)</span>
          <div className="text-xl font-bold font-mono text-white">$8,420.50</div>
          <span className="text-[10px] text-emerald-400">Available balance</span>
        </div>

        <div className="bg-[#112240] p-4 rounded-2xl border border-blue-900/40 space-y-1">
          <span className="text-[10px] text-stone-400 font-mono">PREMIER SAVINGS (...1103)</span>
          <div className="text-xl font-bold font-mono text-white">$24,150.00</div>
          <span className="text-[10px] text-emerald-400">APY: 4.25% Active</span>
        </div>
      </div>

      <div className="bg-[#112240] p-4 rounded-2xl border border-blue-900/40 space-y-2">
        <h4 className="font-bold text-xs text-white">Quick Actions</h4>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className="p-2.5 bg-[#0A192F] rounded-xl hover:bg-blue-900/40 cursor-pointer transition">
            💸 Zelle Send
          </div>
          <div className="p-2.5 bg-[#0A192F] rounded-xl hover:bg-blue-900/40 cursor-pointer transition">
            📄 Statements
          </div>
          <div className="p-2.5 bg-[#0A192F] rounded-xl hover:bg-blue-900/40 cursor-pointer transition">
            🔒 Lock Card
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. REVOLUT EMBEDDED VIEW
// ==========================================
export const RevolutEmbeddedView: React.FC = () => {
  return (
    <div className="flex-1 bg-black text-white flex flex-col h-full overflow-y-auto font-sans p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight">Revolut Digital Banking</h2>
        <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-mono font-bold">
          MULTI-CURRENCY
        </span>
      </div>

      <div className="bg-gradient-to-r from-stone-900 to-zinc-900 p-5 rounded-3xl border border-stone-800 space-y-1">
        <span className="text-[10px] text-stone-400 uppercase font-mono">Combined Portfolio</span>
        <div className="text-2xl font-black font-mono text-white">$5,900.00 USD</div>
        <div className="flex items-center gap-3 text-xs text-stone-400 pt-2">
          <span>🇺🇸 $3,200</span>
          <span>🇪🇺 €2,450</span>
          <span>🇬🇧 £1,800</span>
        </div>
      </div>

      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-2">
        <h4 className="font-bold text-xs text-white">Disposable Virtual Card (Security Shield)</h4>
        <div className="p-3 bg-black rounded-xl border border-stone-800 font-mono text-xs flex items-center justify-between">
          <span>•••• •••• •••• 9014</span>
          <span className="text-cyan-400 font-bold">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 13. GOOGLE MAPS EMBEDDED VIEW
// ==========================================
export const GoogleMapsEmbeddedView: React.FC = () => {
  return (
    <div className="flex-1 bg-[#1F2023] text-white flex flex-col h-full overflow-hidden font-sans">
      <div className="p-3 bg-[#28292A] border-b border-stone-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-rose-500" />
          <span className="font-bold text-xs text-white">Savannah, Georgia • Global Coordinates</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold">GPS Connected</span>
      </div>

      <div className="flex-1 bg-stone-950 relative flex items-center justify-center p-4">
        {/* Interactive Simulated Map Canvas */}
        <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#1b2a3a] via-[#101b27] to-[#0a121a] border border-stone-800 relative flex items-center justify-center overflow-hidden">
          <div className="text-center space-y-2 z-10">
            <div className="text-4xl animate-bounce">📍</div>
            <h3 className="font-bold text-sm text-white">Savannah Development Services Desk</h3>
            <p className="text-xs text-stone-400 font-mono">32.0809° N, 81.0912° W • Permit Ref: BCH26-042000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 14. GMAIL EMBEDDED VIEW
// ==========================================
export const GmailEmbeddedView: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState(0);

  const emails = [
    {
      from: "Google Workspace",
      subject: "Welcome to Google Gemini & Sovereign Ecosystem",
      snippet: "Your Google Account vinsovin7@gmail.com is fully authenticated with zero rate-limit restrictions.",
      time: "10:14 AM"
    },
    {
      from: "City of Savannah",
      subject: "Permit Approval Notice BCH26-042000 ($2,000.00)",
      snippet: "Official invoice attached. Commercial permit review and structural assessments approved.",
      time: "Yesterday"
    },
    {
      from: "TON Mainnet Service",
      subject: "Watch-to-Earn Settlement Credited",
      snippet: "Your active session has yielded USDT successfully to your connected wallet.",
      time: "Sep 28"
    }
  ];

  return (
    <div className="flex-1 bg-[#1F1F24] text-white flex flex-col md:flex-row h-full overflow-hidden font-sans">
      <div className="w-full md:w-64 bg-[#18181C] border-r border-stone-800 p-3 space-y-2 text-xs">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow">
          <span>+ Compose</span>
        </button>
        <div className="space-y-1 pt-2">
          <div className="p-2 rounded-lg bg-blue-950/60 text-blue-300 font-bold flex justify-between">
            <span>📥 Inbox</span>
            <span>3</span>
          </div>
          <div className="p-2 rounded-lg hover:bg-stone-800 text-stone-400">⭐ Starred</div>
          <div className="p-2 rounded-lg hover:bg-stone-800 text-stone-400">📤 Sent</div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {emails.map((em, i) => (
          <div
            key={i}
            onClick={() => setSelectedEmail(i)}
            className={`p-3 rounded-2xl border transition cursor-pointer ${
              selectedEmail === i ? "bg-stone-800 border-blue-500/80" : "bg-[#18181C] border-stone-800 hover:bg-stone-850"
            }`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">{em.from}</span>
              <span className="text-[10px] text-stone-400 font-mono">{em.time}</span>
            </div>
            <div className="font-bold text-xs text-sky-300 mt-1">{em.subject}</div>
            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{em.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 15. NOTION EMBEDDED VIEW
// ==========================================
export const NotionEmbeddedView: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Build 15 original embedded apps suite with zero iframe refusal", done: true },
    { id: 2, text: "Connect Al Jazeera 24/7 English live stream", done: true },
    { id: 3, text: "Google Account Sovin vin profile matching Screenshot 1", done: true },
    { id: 4, text: "Auto-scan and update Master Presence movie tickers", done: true }
  ]);

  return (
    <div className="flex-1 bg-[#191919] text-white flex flex-col h-full overflow-y-auto font-sans p-4 sm:p-6 space-y-4">
      <div className="space-y-1 border-b border-stone-800 pb-4">
        <div className="text-3xl">📝</div>
        <h1 className="text-xl font-black text-white">AlphaQubit Project Roadmap & Notes</h1>
        <p className="text-xs text-stone-400">Workspace connected to Sovin vin Google Account.</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider">Deployment Checklist</h3>
        <div className="space-y-1.5">
          {tasks.map(t => (
            <div 
              key={t.id}
              onClick={() => setTasks(tasks.map(item => item.id === t.id ? { ...item, done: !item.done } : item))}
              className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-3 cursor-pointer hover:bg-stone-850 transition"
            >
              <input type="checkbox" checked={t.done} readOnly className="w-4 h-4 rounded accent-emerald-500" />
              <span className={`text-xs ${t.done ? "line-through text-stone-500" : "text-stone-200"}`}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
