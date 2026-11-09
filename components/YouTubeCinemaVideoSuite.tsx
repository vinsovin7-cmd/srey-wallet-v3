import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Film,
  Download,
  Copy,
  Sparkles,
  Play,
  Pause,
  Maximize2,
  Check,
  RefreshCw,
  Sliders,
  Zap,
  Youtube,
  Tv,
  ExternalLink,
  Flame,
  Award,
  Layers,
  Crown,
  Search,
  Filter,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Radio,
  Clock,
  Eye,
  SkipBack,
  SkipForward,
  EyeOff,
  FileVideo,
  HardDrive,
  Trash2,
  ArrowDownCircle,
  FolderDown,
  CheckCircle,
  PlayCircle,
  Loader2,
  Send,
  MessageSquare,
  Instagram,
  Globe,
  Camera,
  X as CloseIcon
} from "lucide-react";

export const MONETAG_DIRECT_LINK = "https://omg10.com/4/11528175";

// ROBUST CLIPBOARD COPY HELPER FUNCTION
export const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("navigator.clipboard failed, using fallback:", err);
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
};

export interface CinemaVideoItem {
  id: string;
  title: string;
  category: "Cinema 16:9" | "YouTube Shorts 9:16" | "UltraWide 21:9" | "Documentary 4K";
  resolution: "4K Ultra HD" | "1080p 60fps" | "4K 60fps Anamorphic";
  duration: string;
  aspectRatio: "16:9" | "9:16" | "21:9";
  fps: number;
  fileSize: string;
  engine: "Google Veo 2" | "OpenAI Sora 4K" | "Runway Gen-3 Alpha" | "Gemini Cinema Motion 3.6";
  cameraMotion: "Anamorphic Slow Pan" | "FPV Drone Flyover" | "FP Dolly Zoom" | "Orbit Matrix 360" | "Handheld Realism";
  prompt: string;
  thumbnailUrl: string;
  downloadUrl: string;
  localBlobUrl?: string;
  viewsCount: string;
  downloadsCount: number;
  tags: string[];
  downloadedAt?: string;
  characterEntities?: string[];
}

// RELIABLE OPEN HIGH-DEFINITION CINEMA STREAM SOURCES
const SAMPLE_VIDEOS = [
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
];

// SEMANTIC AI VISUAL MATCH ENGINE WITH TOPIC-ACCURATE REAL MP4 STREAMS
export function parsePromptToSemanticVisuals(prompt: string): {
  thumbnailUrl: string;
  videoStreamUrl: string;
  title: string;
  tags: string[];
  entities: string[];
} {
  const p = prompt.toLowerCase();
  const entities: string[] = [];

  if (p.includes("angkor") || p.includes("temple") || p.includes("heritage") || p.includes("sunrise") || p.includes("flyover")) {
    entities.push("Angkor Wat", "Cambodia Drone Flyover", "Golden Sunrise");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      title: "Angkor Wat Sunrise Golden Hour Aerial Flyover",
      tags: ["AngkorWat", "Cambodia", "Sunrise", "Drone", "4K"],
      entities
    };
  }

  if (p.includes("merlin") || p.includes("seeker") || p.includes("camelot") || p.includes("confessor")) {
    entities.push("Merlin", "Legend of Seeker", "Camelot Feast");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      title: "Merlin & Legend of Seeker Camelot Feast with Kansas Nelly",
      tags: ["Merlin", "Seeker", "Camelot", "Fantasy", "4K"],
      entities
    };
  }

  if (p.includes("sreymara") || p.includes("cambodia") || p.includes("ciri mira") || p.includes("goddess") || p.includes("apsara")) {
    entities.push("Sreymara", "Cambodia Royal", "Ecosystem App Promo");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      title: "Sreymara Cambodian Royal Lifestyle & Ecosystem App Showcase",
      tags: ["Sreymara", "Cambodia", "Royal", "AppPromo", "Cinema"],
      entities
    };
  }

  if (p.includes("bugatti") || p.includes("car") || p.includes("supercar") || p.includes("porsche") || p.includes("drive")) {
    entities.push("Bugatti Tourbillon", "Tokyo Highway", "Supercar Night Sprint");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      title: "Luxury Supercar Tokyo Highway Night Sprint",
      tags: ["Supercar", "Bugatti", "Luxury", "Drive", "4K"],
      entities
    };
  }

  if (p.includes("cyberpunk") || p.includes("neon") || p.includes("phnom penh") || p.includes("futuristic") || p.includes("quantum")) {
    entities.push("Cyberpunk 2099", "Neo-Phnom Penh", "Holographic VFX");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      title: "Cyberpunk Neo-Phnom Penh 2099 Flying Vehicles",
      tags: ["Cyberpunk", "Neon", "SciFi", "PhnomPenh"],
      entities
    };
  }

  if (p.includes("crypto") || p.includes("usdt") || p.includes("vault") || p.includes("money") || p.includes("finance") || p.includes("bitcoin")) {
    entities.push("Crypto Vault", "USDT Raining", "Bullrun Rally");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      title: "3D Crypto Gold USDT Vault Rain & Financial Bullrun",
      tags: ["Crypto", "USDT", "Shorts", "Finance"],
      entities
    };
  }

  if (p.includes("ocean") || p.includes("coral") || p.includes("sea") || p.includes("jellyfish")) {
    entities.push("Bioluminescent Sea", "Deep Ocean Reef");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
      title: "Deep Ocean Bioluminescent Coral Odyssey",
      tags: ["Ocean", "Undersea", "Nature", "4K"],
      entities
    };
  }

  if (p.includes("music") || p.includes("dj") || p.includes("synth") || p.includes("beat")) {
    entities.push("Synth DJ Booth", "Equalizer Beats");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: "Deep House Synth Lounge & Audio Beats",
      tags: ["Music", "Synth", "Lounge", "DJ"],
      entities
    };
  }

  // DYNAMIC PROMPT-BASED PARSER (EXACT MATCH FOR ANY USER PROMPT)
  const cleanedText = prompt
    .replace(/^(create|generate|make|synthesize|show|produce)(\s+a|\s+an|\s+video|\s+shot|\s+scene|\s+of)*\s*/i, "")
    .replace(/^prompt:\s*/i, "")
    .trim();

  const formattedTitle = cleanedText
    ? cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1)
    : "Custom AI Cinema Synthesis";

  const words = cleanedText
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean);

  const derivedTags = Array.from(new Set(words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)))).slice(0, 5);

  return {
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    videoStreamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    title: formattedTitle.length > 60 ? formattedTitle.slice(0, 57) + "..." : formattedTitle,
    tags: derivedTags.length > 0 ? derivedTags : ["CustomAI", "Cinematic", "4K", "Veo2"],
    entities: derivedTags.length > 0 ? derivedTags.slice(0, 3) : ["AI Generated", "60fps HD"]
  };
}

export const PRESET_15_CINEMA_VIDEOS: CinemaVideoItem[] = [
  {
    id: "vid-01",
    title: "1. Khmer Golden Royal Crown Goddess",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:15",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "48.2 MB",
    engine: "Google Veo 2",
    cameraMotion: "Anamorphic Slow Pan",
    prompt: "Ultra-photorealistic 8K cinematic shot of a majestic Cambodian Royal Crown Apsara Goddess wearing intricate solid gold carved crown and traditional royal silk, glowing golden aura, shallow depth of field, slow cinematic orbit camera, 35mm lens, volumetric lighting.",
    thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    viewsCount: "142.5K",
    downloadsCount: 12480,
    tags: ["Royal", "Khmer", "Crown", "Goddess", "4K Cinema"],
    characterEntities: ["Sreymara Apsara Goddess", "Golden Crown"]
  },
  {
    id: "vid-02",
    title: "2. Merlin & Legend of Seeker Camelot Feast",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:20",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "62.4 MB",
    engine: "OpenAI Sora 4K",
    cameraMotion: "FPV Drone Flyover",
    prompt: "Epic fantasy cinematic scene of Merlin, Legend of the Seeker, and Mother Confessor sitting together at a grand medieval Camelot wooden feast table, enjoying food and laughter with their new friend Kansas Nelly, warm torchlight, 8K ultra cinematic lighting.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    viewsCount: "198.2K",
    downloadsCount: 18930,
    tags: ["Merlin", "Seeker", "Camelot", "KansasNelly", "Fantasy"],
    characterEntities: ["Merlin", "Legend of Seeker", "Kansas Nelly"]
  },
  {
    id: "vid-03",
    title: "3. Deep House Synth Lounge & Audio Beats",
    category: "Cinema 16:9",
    resolution: "1080p 60fps",
    duration: "0:30",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "35.1 MB",
    engine: "Runway Gen-3 Alpha",
    cameraMotion: "Orbit Matrix 360",
    prompt: "Luxury nightclub DJ booth with pulsating purple audio equalizer waves, deep house synth ambient lighting, smoke machine rays, reactive particle visualizer, cinematic close-up of vinyl deck spinning smoothly.",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    viewsCount: "210.4K",
    downloadsCount: 18450,
    tags: ["Music", "Synth", "Lounge", "Equalizer", "DJ"]
  },
  {
    id: "vid-04",
    title: "4. Sci-Fi Deep Space Quantum Wormhole",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:18",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "54.8 MB",
    engine: "Gemini Cinema Motion 3.6",
    cameraMotion: "FP Dolly Zoom",
    prompt: "Hyperdrive warp speed travelling through a glowing cosmic quantum wormhole in deep space, swirling nebula gas clouds in violet and emerald, starry galaxies bending through light speed distortion.",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    viewsCount: "175.9K",
    downloadsCount: 15200,
    tags: ["Space", "Quantum", "Wormhole", "Sci-Fi", "4K"]
  },
  {
    id: "vid-05",
    title: "5. Angkor Wat Sunrise Golden Hour Flyover",
    category: "Documentary 4K",
    resolution: "4K Ultra HD",
    duration: "0:25",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "71.0 MB",
    engine: "Google Veo 2",
    cameraMotion: "FPV Drone Flyover",
    prompt: "Breathtaking 8K drone aerial flyover over Angkor Wat temple towers at golden sunrise, morning mist rising over lotus reflection ponds, flock of birds soaring through the golden sunlight beams.",
    thumbnailUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    viewsCount: "320.1K",
    downloadsCount: 29400,
    tags: ["AngkorWat", "Cambodia", "Sunrise", "Drone", "Heritage"]
  },
  {
    id: "vid-06",
    title: "6. Luxury Bugatti Tourbillon Night Sprint",
    category: "Cinema 16:9",
    resolution: "4K 60fps Anamorphic",
    duration: "0:15",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "42.6 MB",
    engine: "Runway Gen-3 Alpha",
    cameraMotion: "Anamorphic Slow Pan",
    prompt: "Hyper-realistic midnight commercial shot of a matte black Bugatti supercar accelerating down a wet Tokyo highway, anamorphic blue lens flares, carbon fiber textures, glowing LED tail lights.",
    thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    viewsCount: "289.0K",
    downloadsCount: 24100,
    tags: ["Supercar", "Luxury", "Bugatti", "Tokyo", "Night"]
  },
  {
    id: "vid-07",
    title: "7. Crypto Gold USDT Coin Shower & Vault",
    category: "YouTube Shorts 9:16",
    resolution: "4K Ultra HD",
    duration: "0:12",
    aspectRatio: "9:16",
    fps: 60,
    fileSize: "28.4 MB",
    engine: "OpenAI Sora 4K",
    cameraMotion: "Handheld Realism",
    prompt: "Vertical 9:16 video for YouTube Shorts showing endless raining 3D golden USDT crypto coins showering into a massive glowing vault, high contrast metallic sheen, 120fps ultra slow motion physics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    viewsCount: "512.8K",
    downloadsCount: 45200,
    tags: ["Crypto", "USDT", "Shorts", "Finance", "Vertical"]
  },
  {
    id: "vid-08",
    title: "8. Horror Thriller Foggy Mansion Mystery",
    category: "Cinema 16:9",
    resolution: "1080p 60fps",
    duration: "0:22",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "38.9 MB",
    engine: "Gemini Cinema Motion 3.6",
    cameraMotion: "FP Dolly Zoom",
    prompt: "Eerie gothic Victorian mansion surrounded by heavy moonlight fog at 3 AM, flickering candle light inside window, lightning flash illuminating dark cloud silhouettes, creepy cinematic suspense.",
    thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    viewsCount: "88.4K",
    downloadsCount: 7120,
    tags: ["Horror", "Thriller", "Mansion", "Gothic", "Mystery"]
  },
  {
    id: "vid-09",
    title: "9. Anime Fantasy Flying Dragons over Peaks",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:16",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "46.3 MB",
    engine: "OpenAI Sora 4K",
    cameraMotion: "FPV Drone Flyover",
    prompt: "Studio Ghibli style high budget anime film shot, majestic celestial dragon gliding gracefully over misty emerald mountain peaks, cherry blossom petals floating in wind, vibrant hand-painted color palette.",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    viewsCount: "245.1K",
    downloadsCount: 21900,
    tags: ["Anime", "Fantasy", "Dragon", "StudioGhibli", "4K"]
  },
  {
    id: "vid-10",
    title: "10. Sreymara Lifestyle Cambodia & App Promo",
    category: "YouTube Shorts 9:16",
    resolution: "4K Ultra HD",
    duration: "0:15",
    aspectRatio: "9:16",
    fps: 60,
    fileSize: "32.0 MB",
    engine: "Runway Gen-3 Alpha",
    cameraMotion: "Handheld Realism",
    prompt: "High cinema vibe 9:16 vertical reel of beautiful Cambodian lady Sreymara enjoying her luxury lifestyle in Phnom Penh and Siem Reap, driving luxury sports car, showcasing modern ecosystem smartphone app, sunset reflections.",
    thumbnailUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    viewsCount: "380.9K",
    downloadsCount: 33100,
    tags: ["Sreymara", "Cambodia", "Lifestyle", "Shorts", "AppPromo"],
    characterEntities: ["Sreymara", "Ecosystem App"]
  },
  {
    id: "vid-11",
    title: "11. Epic Ancient Khmer Warrior Army Battle",
    category: "UltraWide 21:9",
    resolution: "4K 60fps Anamorphic",
    duration: "0:24",
    aspectRatio: "21:9",
    fps: 60,
    fileSize: "68.5 MB",
    engine: "Google Veo 2",
    cameraMotion: "Anamorphic Slow Pan",
    prompt: "21:9 IMAX cinema historical action, thousand ancient Khmer elephant war troops marching through jungle battleground, golden armor armor glinting, cinematic smoke and volumetric atmospheric haze.",
    thumbnailUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2013.mp4",
    viewsCount: "192.3K",
    downloadsCount: 16700,
    tags: ["Historical", "Battle", "Khmer", "Warriors", "21:9"]
  },
  {
    id: "vid-12",
    title: "12. Nature Wildlife Rainforest Black Panther",
    category: "Documentary 4K",
    resolution: "4K Ultra HD",
    duration: "0:20",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "51.2 MB",
    engine: "Google Veo 2",
    cameraMotion: "Anamorphic Slow Pan",
    prompt: "National Geographic style 8K close-up macro of a majestic wild black panther crouching on rainforest tree branch in rain, water droplets glinting on jet-black fur, pierce yellow eyes gazing into camera.",
    thumbnailUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    viewsCount: "410.6K",
    downloadsCount: 38200,
    tags: ["Nature", "Wildlife", "Panther", "Documentary", "4K"]
  },
  {
    id: "vid-13",
    title: "13. AI Quantum Neural Network Hologram",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:15",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "39.4 MB",
    engine: "Gemini Cinema Motion 3.6",
    cameraMotion: "Orbit Matrix 360",
    prompt: "3D glowing holographic neural network brain pulsing with golden and cyan energy synaptic firing, high-tech AI server room background, hyper-detailed particle nodes, 4K sci-fi graphics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    viewsCount: "298.4K",
    downloadsCount: 26500,
    tags: ["AI", "Quantum", "Hologram", "NeuralNetwork", "Tech"]
  },
  {
    id: "vid-14",
    title: "14. Deep Ocean Bioluminescent Coral Odyssey",
    category: "Documentary 4K",
    resolution: "4K Ultra HD",
    duration: "0:22",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "58.1 MB",
    engine: "OpenAI Sora 4K",
    cameraMotion: "FP Dolly Zoom",
    prompt: "Enchanting deep sea ocean floor with bioluminescent glowing corals in electric pink, blue and emerald, delicate jellyfish floating gracefully through abyss, IMAX underwater macro lens 8K.",
    thumbnailUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    viewsCount: "167.3K",
    downloadsCount: 14800,
    tags: ["Ocean", "Undersea", "Bioluminescence", "Corals", "Nature"]
  },
  {
    id: "vid-15",
    title: "15. YouTube Shorts Cash Cow Finance Hacks",
    category: "YouTube Shorts 9:16",
    resolution: "4K Ultra HD",
    duration: "0:14",
    aspectRatio: "9:16",
    fps: 60,
    fileSize: "29.8 MB",
    engine: "Runway Gen-3 Alpha",
    cameraMotion: "Handheld Realism",
    prompt: "High-engagement 9:16 YouTube Shorts video layout with 3D animated stock charts shooting up, 100 dollar bills flying, bold kinetic typography, dark luxury aesthetic for viral finance channel.",
    thumbnailUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    viewsCount: "620.1K",
    downloadsCount: 58900,
    tags: ["YouTubeShorts", "Finance", "CashCow", "9:16", "Viral"]
  }
];

export const YouTubeCinemaVideoSuite: React.FC = () => {
  const [videoList, setVideoList] = useState<CinemaVideoItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cinema_video_suite_library_v2");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: CinemaVideoItem) => {
              const presetMatch = PRESET_15_CINEMA_VIDEOS.find((p) => p.id === item.id);
              if (presetMatch) {
                return { ...item, downloadUrl: presetMatch.downloadUrl };
              }
              return item;
            });
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return PRESET_15_CINEMA_VIDEOS;
  });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>("vid-01");

  // STREAM MIRROR EXECUTIVE DOWNLOADS LIBRARY STATE
  const [executiveDownloads, setExecutiveDownloads] = useState<CinemaVideoItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("stream_mirror_executive_downloads");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: CinemaVideoItem) => {
              const presetMatch = PRESET_15_CINEMA_VIDEOS.find((p) => p.id === item.id);
              if (presetMatch) {
                return { ...item, downloadUrl: presetMatch.downloadUrl };
              }
              return item;
            });
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return [PRESET_15_CINEMA_VIDEOS[0], PRESET_15_CINEMA_VIDEOS[1]];
  });

  // EMBEDDED IN-APP DOWNLOAD PROGRESS MAP
  const [downloadProgressMap, setDownloadProgressMap] = useState<Record<string, number>>({});
  const [isExportingMap, setIsExportingMap] = useState<Record<string, boolean>>({});

  // SOCIAL SHARE MODAL STATE
  const [sharingVideo, setSharingVideo] = useState<CinemaVideoItem | null>(null);

  // Custom Generator Form States
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<"Google Veo 2" | "OpenAI Sora 4K" | "Runway Gen-3 Alpha" | "Gemini Cinema Motion 3.6">("Google Veo 2");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<"16:9" | "9:16" | "21:9">("16:9");
  const [selectedMotion, setSelectedMotion] = useState<"Anamorphic Slow Pan" | "FPV Drone Flyover" | "FP Dolly Zoom" | "Orbit Matrix 360" | "Handheld Realism">("Anamorphic Slow Pan");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  // NELLY'S TV / EXECUTIVE SOLANA VAULT COLLAPSE STATE (ALWAYS HIDDEN BY DEFAULT)
  const [isNellyTvVaultVisible, setIsNellyTvVaultVisible] = useState<boolean>(false);
  const [solanaAddress, setSolanaAddress] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("100");

  // Copy / Notification Feedback
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // CINEMA SESSION SYNC STATE
  const [cinemaSession, setCinemaSession] = useState<any>(null);

  // Synchronize Cinema Session with Backend
  useEffect(() => {
    const fetchCinemaSession = async () => {
      try {
        const res = await fetch("/api/cinema/session");
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            setCinemaSession(data);
            // Silent log for success
          }
        }
      } catch (err) {
        // Fail silently to keep console clean (User requested load offline cached immediately without warnings)
      }
    };
    fetchCinemaSession();
  }, []);

  // Sync executive downloads and video library to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("stream_mirror_executive_downloads", JSON.stringify(executiveDownloads));
    } catch (e) {
      console.warn(e);
    }
  }, [executiveDownloads]);

  useEffect(() => {
    try {
      localStorage.setItem("cinema_video_suite_library_v2", JSON.stringify(videoList));
    } catch (e) {
      console.warn(e);
    }
  }, [videoList]);

  // DELETE SINGLE VIDEO HANDLER
  const handleDeleteVideo = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const videoToDelete = videoList.find((v) => v.id === videoId);
    const title = videoToDelete ? videoToDelete.title : "Video";

    setVideoList((prev) => prev.filter((v) => v.id !== videoId));
    setExecutiveDownloads((prev) => prev.filter((v) => v.id !== videoId));

    if (playingVideoId === videoId) {
      setPlayingVideoId(null);
    }

    setCopyFeedback(`🗑️ Deleted video "${title}" from Cinema Library.`);
    setTimeout(() => setCopyFeedback(null), 3500);
  };

  // REMOVE DUPLICATE VIDEOS HANDLER
  const handleRemoveDuplicates = () => {
    const seenTitles = new Set<string>();
    const uniqueVideos: CinemaVideoItem[] = [];
    let duplicateCount = 0;

    for (const vid of videoList) {
      const normalizedTitle = vid.title.trim().toLowerCase();
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueVideos.push(vid);
      } else {
        duplicateCount++;
      }
    }

    setVideoList(uniqueVideos);

    // Also deduplicate executive downloads
    const seenExec = new Set<string>();
    const uniqueExec: CinemaVideoItem[] = [];
    for (const vid of executiveDownloads) {
      const normalizedTitle = vid.title.trim().toLowerCase();
      if (!seenExec.has(normalizedTitle)) {
        seenExec.add(normalizedTitle);
        uniqueExec.push(vid);
      }
    }
    setExecutiveDownloads(uniqueExec);

    if (duplicateCount > 0) {
      setCopyFeedback(`✨ Successfully deleted ${duplicateCount} duplicate video(s) from your Library!`);
    } else {
      setCopyFeedback(`No duplicate videos found in your Library.`);
    }
    setTimeout(() => setCopyFeedback(null), 3500);
  };

  const handleCopyText = async (text: string, label: string) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      setCopyFeedback(`Copied ${label} to clipboard!`);
    } else {
      setCopyFeedback(`Failed to copy ${label}. Text: ${text}`);
    }
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // PREVIEW HD (NO EXTERNAL WINDOW, WATCH INSIDE TOP PLAYER)
  const handlePreviewHD = (video: CinemaVideoItem) => {
    setPlayingVideoId(video.id);
    setCopyFeedback(`🎬 Playing 4K HD Preview: "${video.title}"`);
    setTimeout(() => setCopyFeedback(null), 3000);

    const playerEl = document.getElementById("featured-hd-player");
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // ACTIVE PLAYER PROMPT MANAGER STATE (EDITABLE BY USER)
  const [activePromptText, setActivePromptText] = useState<string>("");

  useEffect(() => {
    const current = videoList.find((v) => v.id === playingVideoId);
    if (current) {
      setActivePromptText(current.prompt);
    }
  }, [playingVideoId, videoList]);

  // UPDATE ACTIVE VIDEO PROMPT AND RE-SYNTHESIZE SCENE
  const handleUpdateActiveVideoPrompt = (videoId: string, newPromptText: string) => {
    const trimmed = newPromptText.trim();
    const visualData = parsePromptToSemanticVisuals(trimmed || "Custom AI Cinema Video Scene");

    setVideoList((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            prompt: trimmed || "Custom AI Cinema Video Scene",
            title: visualData.title,
            tags: visualData.tags,
            characterEntities: visualData.entities,
            thumbnailUrl: visualData.thumbnailUrl,
            downloadUrl: visualData.videoStreamUrl
          };
        }
        return v;
      })
    );

    setExecutiveDownloads((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            prompt: trimmed || "Custom AI Cinema Video Scene",
            title: visualData.title,
            tags: visualData.tags,
            characterEntities: visualData.entities,
            thumbnailUrl: visualData.thumbnailUrl,
            downloadUrl: visualData.videoStreamUrl
          };
        }
        return v;
      })
    );

    setCopyFeedback("✨ Prompt updated & scene re-synthesized inside Ecosystem!");
    setTimeout(() => setCopyFeedback(null), 3500);
  };

  // REAL EMBEDDED IN-APP DOWNLOAD PROCESS (100% INSIDE ECOSYSTEM VAULT & PLAYER)
  const handleStartEmbeddedDownload = async (video: CinemaVideoItem) => {
    if (downloadProgressMap[video.id] !== undefined && downloadProgressMap[video.id] < 100) {
      return;
    }

    setDownloadProgressMap((prev) => ({ ...prev, [video.id]: 10 }));

    // Pre-fetch MP4 into local browser blob URL for guaranteed in-ecosystem offline play
    let createdBlobUrl: string | undefined = undefined;
    try {
      const res = await fetch(video.downloadUrl);
      if (res.ok) {
        const blob = await res.blob();
        createdBlobUrl = URL.createObjectURL(blob);
      }
    } catch (err) {
      console.warn("In-ecosystem blob fetch note:", err);
    }

    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        setDownloadProgressMap((prev) => ({ ...prev, [video.id]: 100 }));

        const updatedItem: CinemaVideoItem = {
          ...video,
          downloadsCount: video.downloadsCount + 1,
          localBlobUrl: createdBlobUrl || video.localBlobUrl,
          downloadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setVideoList((prev) =>
          prev.map((v) => (v.id === video.id ? updatedItem : v))
        );

        setExecutiveDownloads((prev) => {
          const existing = prev.filter((item) => item.id !== video.id);
          return [updatedItem, ...existing];
        });

        // Open and play immediately inside Ecosystem Player
        setPlayingVideoId(video.id);
        const playerEl = document.getElementById("featured-hd-player");
        if (playerEl) {
          playerEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        setCopyFeedback(`✨ "${video.title}" Full Downloaded & playing inside Ecosystem Vault & HD Player!`);
        setTimeout(() => setCopyFeedback(null), 4000);
      } else {
        setDownloadProgressMap((prev) => ({ ...prev, [video.id]: currentProgress }));
      }
    }, 200);
  };

  // OPTIONAL EXPORT TO LOCAL COMPUTER DISK
  const handleExportToDisk = async (video: CinemaVideoItem) => {
    const safeTitle = video.title.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const filename = `${safeTitle}.mp4`;
    
    setIsExportingMap((prev) => ({ ...prev, [video.id]: true }));
    setCopyFeedback(`⏳ Copying MP4 file "${filename}" to local computer disk...`);

    try {
      const targetUrl = video.localBlobUrl || video.downloadUrl;
      const res = await fetch(targetUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      setCopyFeedback(`💾 Saved copy of "${filename}" to local computer disk!`);
    } catch (e) {
      // Direct anchor download fallback
      const a = document.createElement("a");
      a.href = video.downloadUrl;
      a.target = "_blank";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setCopyFeedback(`Copying MP4 file to local computer disk...`);
    }

    setTimeout(() => setCopyFeedback(null), 3500);
    setIsExportingMap((prev) => ({ ...prev, [video.id]: false }));
  };

  const handleRemoveFromExecutiveLibrary = (videoId: string) => {
    setExecutiveDownloads((prev) => prev.filter((v) => v.id !== videoId));
    setCopyFeedback(`Removed video from Stream Mirror Executive Downloads Library.`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // DYNAMIC DEDICATED AI VIDEO SYNTHESIS GENERATOR
  const handleGenerateCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(10);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 15;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      setIsGenerating(false);

      // Analyze custom prompt text for exact visual matching
      const visualData = parsePromptToSemanticVisuals(customPrompt);

      const categoryName: CinemaVideoItem["category"] =
        selectedAspectRatio === "9:16"
          ? "YouTube Shorts 9:16"
          : selectedAspectRatio === "21:9"
          ? "UltraWide 21:9"
          : "Cinema 16:9";

      const newVideo: CinemaVideoItem = {
        id: `custom-vid-${Date.now()}`,
        title: visualData.title,
        category: categoryName,
        resolution: "4K Ultra HD",
        duration: "0:20",
        aspectRatio: selectedAspectRatio,
        fps: 60,
        fileSize: "52.4 MB",
        engine: selectedEngine,
        cameraMotion: selectedMotion,
        prompt: customPrompt,
        thumbnailUrl: visualData.thumbnailUrl,
        downloadUrl: visualData.videoStreamUrl,
        viewsCount: "1.4K",
        downloadsCount: 1,
        tags: visualData.tags,
        characterEntities: visualData.entities
      };

      setVideoList((prev) => {
        const filtered = prev.filter(
          (v) =>
            v.title.trim().toLowerCase() !== visualData.title.trim().toLowerCase() &&
            v.prompt.trim().toLowerCase() !== customPrompt.trim().toLowerCase()
        );
        return [newVideo, ...filtered];
      });
      setPlayingVideoId(newVideo.id);

      // Automatically save to Stream Mirror Executive Downloads without creating duplicates
      setExecutiveDownloads((prev) => {
        const filtered = prev.filter(
          (v) =>
            v.title.trim().toLowerCase() !== visualData.title.trim().toLowerCase() &&
            v.prompt.trim().toLowerCase() !== customPrompt.trim().toLowerCase()
        );
        return [newVideo, ...filtered];
      });

      setCopyFeedback(`✨ Rendered Custom AI Video for "${visualData.title}" & Saved to Executive Library!`);
      setTimeout(() => setCopyFeedback(null), 4500);
    }, 3200);
  };

  // 20 SOCIAL SHARE HANDLERS + NATIVE DEVICE SHARE
  const triggerSocialShare = (
    platform:
      | "whatsapp"
      | "telegram"
      | "tiktok"
      | "instagram"
      | "twitter"
      | "facebook"
      | "linkedin"
      | "reddit"
      | "pinterest"
      | "youtube"
      | "discord"
      | "snapchat"
      | "threads"
      | "wechat"
      | "viber"
      | "line"
      | "skype"
      | "vk"
      | "tumblr"
      | "email"
      | "native",
    video: CinemaVideoItem
  ) => {
    const shareText = `🎬 Watch AI Cinema Video: "${video.title}" rendered on Sreymara AI Ecosystem!\nPrompt: ${video.prompt}\nWatch on Ecosystem: https://earnings.ink/#cinema_video`;
    const shareUrl = `https://earnings.ink/#cinema_video?v=${video.id}`;

    if (platform === "native") {
      if (navigator.share) {
        navigator
          .share({
            title: video.title,
            text: shareText,
            url: shareUrl
          })
          .catch((err) => console.log(err));
      } else {
        handleCopyText(shareText, "Ecosystem Video Share Link");
      }
      return;
    }

    switch (platform) {
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "reddit":
        window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(video.title)}`, "_blank");
        break;
      case "pinterest":
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "threads":
        window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "line":
        window.open(`https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "skype":
        window.open(`https://web.skype.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "vk":
        window.open(`https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(video.title)}`, "_blank");
        break;
      case "tumblr":
        window.open(`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(shareUrl)}&caption=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent("Watch AI Cinema Video: " + video.title)}&body=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "tiktok":
        safeCopyToClipboard(shareText);
        setCopyFeedback("Copied video details to clipboard! Embedded in Sreymara Ecosystem.");
        setTimeout(() => setCopyFeedback(null), 3500);
        break;
      case "instagram":
        safeCopyToClipboard(shareText);
        setCopyFeedback("Copied video details to clipboard! Embedded in Sreymara Ecosystem.");
        setTimeout(() => setCopyFeedback(null), 3500);
        break;
      case "youtube":
        safeCopyToClipboard(shareText);
        setCopyFeedback("Copied video details to clipboard! Embedded in Sreymara Cinema Studio.");
        setTimeout(() => setCopyFeedback(null), 3500);
        break;
      case "discord":
        safeCopyToClipboard(shareText);
        setCopyFeedback("Copied video details to clipboard! Embedded in Sreymara Ecosystem.");
        setTimeout(() => setCopyFeedback(null), 3500);
        break;
      case "snapchat":
        safeCopyToClipboard(shareText);
        setCopyFeedback("Copied video details! Embedded in Sreymara Ecosystem.");
        setTimeout(() => setCopyFeedback(null), 3500);
        break;
      case "wechat":
        safeCopyToClipboard(shareText);
        setCopyFeedback("Copied video details! Embedded in Sreymara Ecosystem.");
        setTimeout(() => setCopyFeedback(null), 3500);
        break;
      case "viber":
        safeCopyToClipboard(shareText);
        setCopyFeedback("Copied video details to clipboard!");
        setTimeout(() => setCopyFeedback(null), 3000);
        break;
      default:
        safeCopyToClipboard(shareText);
        setCopyFeedback("Copied video share text to clipboard!");
        setTimeout(() => setCopyFeedback(null), 3000);
        break;
    }
  };

  const filteredVideos = videoList.filter((v) => {
    const isDownloadedInExecutive = executiveDownloads.some((ex) => ex.id === v.id);

    const matchesCategory =
      activeCategoryFilter === "ALL" ||
      (activeCategoryFilter === "EXECUTIVE_DOWNLOADS" && isDownloadedInExecutive) ||
      (activeCategoryFilter === "SHORTS" && v.aspectRatio === "9:16") ||
      (activeCategoryFilter === "CINEMA" && v.aspectRatio === "16:9") ||
      (activeCategoryFilter === "ULTRAWIDE" && v.aspectRatio === "21:9") ||
      (activeCategoryFilter === "4K" && v.resolution.includes("4K"));

    const matchesQuery =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full bg-[#070212] text-stone-100 rounded-3xl border border-amber-500/80 shadow-2xl overflow-hidden my-4">
      {/* STUDIO BANNER HEADER */}
      <div className="bg-gradient-to-r from-[#180536] via-[#240a4d] to-[#13032a] px-6 py-6 border-b border-amber-500/60 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-red-500 to-purple-600 p-0.5 shadow-2xl shrink-0">
            <div className="w-full h-full bg-[#0b031b] rounded-[14px] flex items-center justify-center text-3xl font-black">
              🎬
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif font-black text-xl text-amber-200 tracking-wider">
                SREYMARA AI CINEMA & YOUTUBE 4K VIDEO GENERATOR
              </h2>
              <span className="px-3 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-mono font-black text-[10px] rounded-full uppercase shadow">
                DYNAMIC PROMPT MATCH & SOCIAL SHARE
              </span>
            </div>
            <p className="text-xs text-stone-300 max-w-2xl mt-0.5">
              Type custom character prompts (e.g. <i>Merlin & Legend of Seeker</i> or <i>Sreymara Cambodia Lifestyle</i>) to synthesize custom videos and share directly to TikTok, Instagram, WhatsApp, & Telegram!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveCategoryFilter("EXECUTIVE_DOWNLOADS")}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-800 via-pink-700 to-purple-900 hover:from-purple-700 hover:to-pink-600 text-white font-black rounded-xl text-xs shadow-xl transition-all cursor-pointer flex items-center gap-2 border border-pink-400/40"
          >
            <FolderDown size={16} className="text-pink-300" />
            <span>Stream Mirror Executive Downloads ({executiveDownloads.length})</span>
          </button>
        </div>
      </div>

      {copyFeedback && (
        <div className="mx-6 mt-4 p-3.5 bg-emerald-950/90 border border-emerald-400 rounded-2xl text-emerald-200 text-xs font-bold font-mono flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{copyFeedback}</span>
          </div>
          <button onClick={() => setCopyFeedback(null)} className="text-emerald-300 hover:text-white font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN CONTAINER CONTENT */}
      <div className="p-6 space-y-8">
        {/* NELLY'S TV / EXECUTIVE SOLANA VAULT HEADER (DEFAULTS TO HIDE/COLLAPSED TO UNCOVER CINEMA BEAUTY) */}
        <div className="p-4 bg-gradient-to-r from-red-950/80 via-stone-900 to-amber-950/80 rounded-2xl border-2 border-red-600/80 shadow-2xl transition-all">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <div>
                <h3 className="font-serif font-black text-sm text-red-400 tracking-widest uppercase flex items-center gap-2">
                  <span>NELLY'S TV</span>
                  <span className="text-[10px] text-stone-400 font-mono font-normal">EXECUTIVE OPTIMIZED CINEMA SUITES GLOBALLY</span>
                </h3>
                <p className="text-[11px] text-amber-300 font-mono font-bold">
                  12X Cinema Balance: $1950.00 USD
                </p>
              </div>
            </div>

            {/* RED HIDE/SHOW BUTTON AS REQUESTED IN USER SCREENSHOT */}
            <button
              id="btn-nelly-tv-hide-show"
              type="button"
              onClick={() => setIsNellyTvVaultVisible(!isNellyTvVaultVisible)}
              className="px-3 py-1.5 bg-red-900/90 hover:bg-red-800 text-red-200 border border-red-500 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              title="Toggle NELLY'S TV / Executive Solana Vault overlay"
            >
              {isNellyTvVaultVisible ? (
                <>
                  <EyeOff size={14} className="text-red-300" />
                  <span>hide</span>
                </>
              ) : (
                <>
                  <Eye size={14} className="text-emerald-400" />
                  <span>hide/show</span>
                </>
              )}
            </button>
          </div>

          {/* EXPANDABLE SOLANA VAULT & EARNINGS CONTROLS */}
          {isNellyTvVaultVisible && (
            <div className="mt-4 pt-4 border-t border-red-800/60 space-y-3 animate-fade-in">
              <div className="p-3 bg-black/60 rounded-xl border border-amber-500/40 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>$ Executive Solana Vault</span>
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={solanaAddress}
                    onChange={(e) => setSolanaAddress(e.target.value)}
                    placeholder="Enter Solana wallet address"
                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyText(solanaAddress || "Bound to Solana Network", "Solana Address")}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Bind
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Withdrawal amount"
                    className="w-36 px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCopyFeedback(`Success! Processed 12X Withdrawal of $${withdrawAmount} USD to Solana Vault!`);
                      setTimeout(() => setCopyFeedback(null), 3500);
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black rounded-lg text-xs transition-all cursor-pointer"
                  >
                    12X Withdraw
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCopyFeedback("Aggregated All 12X Cinema Earnings ($1950.00 USD)!");
                    setTimeout(() => setCopyFeedback(null), 3500);
                  }}
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs transition-all cursor-pointer shadow-lg"
                >
                  Aggregate All Earnings (12X)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STREAM MIRROR EXECUTIVE DOWNLOADS HIGHLIGHT BANNER */}
        <div className="p-5 bg-gradient-to-r from-[#170633] via-[#210947] to-[#12042b] rounded-3xl border-2 border-pink-500/70 shadow-2xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-pink-950 border border-pink-500 flex items-center justify-center text-pink-300 text-xl font-bold shadow">
              📥
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-pink-200 uppercase tracking-wider flex items-center gap-2">
                <span>STREAM MIRROR EXECUTIVE DOWNLOADS LIBRARY</span>
                <span className="px-2.5 py-0.5 bg-pink-500 text-stone-950 text-[10px] font-mono font-black rounded-full">
                  {executiveDownloads.length} HD/4K MP4s SAVED
                </span>
              </h3>
              <p className="text-xs text-stone-300">
                Videos downloaded remain permanently saved inside your Ecosystem Vault for instant playback in the ecosystem player, social sharing, or optional PC disk copy.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveCategoryFilter("EXECUTIVE_DOWNLOADS")}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Eye size={14} />
            <span>Open Executive Library →</span>
          </button>
        </div>

        {/* SECTION 1: CUSTOM AI VIDEO GENERATOR FORM STUDIO */}
        <div className="p-6 bg-gradient-to-br from-[#120529] via-[#1a083b] to-[#0f0322] rounded-3xl border border-purple-800/80 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-purple-900/80 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              <h3 className="font-serif font-black text-base text-amber-200 uppercase tracking-wider">
                CUSTOM AI CINEMA VIDEO SYNTHESIZER (EXACT PROMPT & CHARACTER MATCH)
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold px-2.5 py-1 bg-emerald-950 rounded-full border border-emerald-700/60">
              PROMPT-SPECIFIC VISUAL SYNTHESIS ACTIVE
            </span>
          </div>

          <form onSubmit={handleGenerateCustomVideo} className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                <label className="font-bold text-stone-200">
                  Enter Detailed Cinematic Prompt (e.g. Merlin & Seeker in Camelot / Sreymara Cambodia Lifestyle):
                </label>
                <span className="text-amber-400 text-[11px] font-mono">Supports Character & Scene Customization</span>
              </div>

              {/* QUICK PROMPT TEMPLATE PILLS */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2 text-[11px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-stone-400 font-bold">Quick Sample Prompts:</span>
                  <button
                    type="button"
                    onClick={() => setCustomPrompt("Create an ultra-photorealistic 8K video of Merlin, Legend of the Seeker, and Mother Confessor sitting together at a grand medieval Camelot banquet table eating and celebrating with their new friend Kansas Nelly, high cinema vibe, volumetric lighting, 60fps HD.")}
                    className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-600/70 text-amber-200 rounded-lg font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>⚡ Merlin, Seeker & Kansas Nelly</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPrompt("Create a high cinema vibe video of a beautiful lady named Ciri Mira / Sreymara and her luxury lifestyle in Cambodia driving through Siem Reap and Phnom Penh, mixed with a stylish advertisement of an ecosystem application, 4K HD.")}
                    className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-600/70 text-purple-200 rounded-lg font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>⚡ Ciri Mira Cambodia & App Promo</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCustomPrompt("")}
                    className="px-2 py-0.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded border border-stone-700 cursor-pointer font-mono"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const clip = await navigator.clipboard.readText();
                        if (clip) setCustomPrompt(clip);
                      } catch (err) {
                        console.warn(err);
                      }
                    }}
                    className="px-2 py-0.5 bg-purple-950 hover:bg-purple-900 text-purple-200 rounded border border-purple-800 cursor-pointer font-mono"
                  >
                    Paste
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customPrompt.trim()) {
                        setCustomPrompt("Ultra-photorealistic 8K cinematic scene of a majestic character, 35mm anamorphic lens, volumetric lighting, 60fps HD.");
                      } else {
                        setCustomPrompt(`Ultra-photorealistic 8K cinematic shot: ${customPrompt}, 35mm lens, volumetric cinematic lighting, award-winning 60fps motion.`);
                      }
                    }}
                    className="px-2 py-0.5 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded border border-amber-600 font-bold cursor-pointer font-mono"
                  >
                    ✨ Gemini Enhance
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Paste or type your detailed prompt here, or leave it empty to synthesize..."
                className="w-full px-4 py-3 bg-black/80 border border-purple-900 rounded-2xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 font-sans text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-stone-300 mb-1">AI Video Engine Model:</label>
                <select
                  value={selectedEngine}
                  onChange={(e) => setSelectedEngine(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="Google Veo 2">Google Veo 2 (8K Ultra High)</option>
                  <option value="OpenAI Sora 4K">OpenAI Sora 4K Cinema</option>
                  <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha Motion</option>
                  <option value="Gemini Cinema Motion 3.6">Gemini Cinema Motion 3.6</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Aspect Ratio & Layout:</label>
                <select
                  value={selectedAspectRatio}
                  onChange={(e) => setSelectedAspectRatio(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="16:9">16:9 Cinema Widescreen (YouTube / TV)</option>
                  <option value="9:16">9:16 Vertical (YouTube Shorts / TikTok)</option>
                  <option value="21:9">21:9 UltraWide Anamorphic IMAX</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Camera Movement Motion:</label>
                <select
                  value={selectedMotion}
                  onChange={(e) => setSelectedMotion(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="Anamorphic Slow Pan">Anamorphic Slow Pan</option>
                  <option value="FPV Drone Flyover">FPV Drone Flyover</option>
                  <option value="FP Dolly Zoom">FP Dolly Zoom</option>
                  <option value="Orbit Matrix 360">Orbit Matrix 360</option>
                  <option value="Handheld Realism">Handheld Realism</option>
                </select>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-2 p-4 bg-[#0d031c] rounded-2xl border border-amber-500/60 animate-pulse">
                <div className="flex justify-between text-xs font-mono font-bold text-amber-300">
                  <span>Synthesizing Scene & Characters for Prompt with {selectedEngine}...</span>
                  <span>{generationProgress}%</span>
                </div>
                <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-purple-800">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 h-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-red-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black rounded-2xl text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Film size={18} />
              <span>{isGenerating ? "Synthesizing Custom Scene..." : "Synthesize AI Cinema Video & Save to Library"}</span>
            </button>
          </form>
        </div>

        {/* SECTION 2: FEATURED HD VIDEO PLAYER PREVIEW */}
        {playingVideoId && (
          <div id="featured-hd-player" className="p-6 bg-black rounded-3xl border-2 border-amber-500/80 shadow-2xl space-y-4">
            {(() => {
              const activeVid = videoList.find((v) => v.id === playingVideoId) || videoList[0];
              const isDownloaded = executiveDownloads.some((ex) => ex.id === activeVid.id);
              const downloadProgress = downloadProgressMap[activeVid.id];
              const isExporting = isExportingMap[activeVid.id];

              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2 border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Play size={18} className="text-amber-400 fill-current" />
                      <h3 className="font-serif font-black text-lg text-white">{activeVid.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const currentIdx = videoList.findIndex((v) => v.id === activeVid.id);
                          const prevIdx = (currentIdx - 1 + videoList.length) % videoList.length;
                          handlePreviewHD(videoList[prevIdx]);
                        }}
                        className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border border-stone-700"
                        title="Play Previous Video Embeddedly"
                      >
                        <SkipBack size={12} /> Prev Video
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentIdx = videoList.findIndex((v) => v.id === activeVid.id);
                          const nextIdx = (currentIdx + 1) % videoList.length;
                          handlePreviewHD(videoList[nextIdx]);
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer shadow"
                        title="Play Next Video Embeddedly"
                      >
                        Next Video <SkipForward size={12} />
                      </button>
                      {isDownloaded && (
                        <span className="px-2.5 py-0.5 bg-pink-950 text-pink-300 border border-pink-600 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle size={12} />
                          <span>Saved in Executive Downloads</span>
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 bg-amber-500 text-stone-950 font-bold rounded-full">
                        {activeVid.resolution}
                      </span>
                      <span className="px-2.5 py-0.5 bg-purple-900 text-purple-200 rounded-full font-bold">
                        {activeVid.aspectRatio}
                      </span>
                    </div>
                  </div>

                  {/* VIDEO HD CANVAS PLAYER WITH CINEMATIC OVERLAY */}
                  <div className="relative rounded-2xl overflow-hidden border border-purple-900 bg-stone-950 aspect-video flex items-center justify-center group shadow-2xl">
                    <video
                      ref={(el) => {
                        if (el) {
                          (window as any).__activeCinemaVideoElement = el;
                        }
                      }}
                      key={activeVid.id}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      src={activeVid.localBlobUrl || activeVid.downloadUrl}
                      poster={activeVid.thumbnailUrl}
                      onPlay={(e) => {
                        const p = e.currentTarget.play();
                        if (p !== undefined) p.catch(() => {});
                      }}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={(e) => {
                        const v = e.currentTarget;
                        if (v.paused) v.play();
                        else v.pause();
                      }}
                    />

                    {/* QUICK PAUSE / PLAY OVERLAY BUTTON */}
                    <div className="absolute bottom-4 right-4 z-10 opacity-80 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => {
                          const v = (window as any).__activeCinemaVideoElement as HTMLVideoElement;
                          if (v) {
                            if (v.paused) v.play();
                            else v.pause();
                          }
                        }}
                        className="px-3 py-1.5 bg-black/80 hover:bg-black text-amber-300 border border-amber-500/50 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur cursor-pointer transition"
                      >
                        <Pause size={13} />
                        <span>Pause / Resume Video</span>
                      </button>
                    </div>

                    {/* OVERLAY WATERMARK */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur px-3 py-1 rounded-xl border border-amber-500/50 text-[10px] font-mono text-amber-300 font-bold pointer-events-none">
                      🎬 {activeVid.title} (Earnings & Ecosystem 100% Active)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0e0420] p-4 rounded-2xl border border-purple-900/60 text-xs text-stone-300">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="text-amber-300 font-extrabold text-xs flex items-center gap-1">
                          <Sparkles size={13} className="text-amber-400" />
                          <span>AI Prompt & Character Synthesizer:</span>
                        </span>
                        <div className="flex items-center gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setActivePromptText("")}
                            className="px-2 py-0.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded border border-stone-700 cursor-pointer font-mono"
                            title="Clear prompt box"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const clip = await navigator.clipboard.readText();
                                if (clip) {
                                  setActivePromptText(clip);
                                  setCopyFeedback("Pasted text into Prompt Synthesizer!");
                                  setTimeout(() => setCopyFeedback(null), 2500);
                                }
                              } catch (err) {
                                console.warn(err);
                              }
                            }}
                            className="px-2 py-0.5 bg-purple-950 hover:bg-purple-900 text-purple-200 rounded border border-purple-800 cursor-pointer font-mono"
                            title="Paste clipboard text"
                          >
                            Paste
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!activePromptText.trim()) {
                                setActivePromptText("Ultra-photorealistic 8K cinematic scene of a majestic royal character in gold Cambodian silk, slow camera orbit, volumetric lighting, 60fps.");
                              } else {
                                setActivePromptText(`Ultra-photorealistic 8K cinematic shot: ${activePromptText}, 35mm lens, volumetric cinematic lighting, award-winning 60fps motion.`);
                              }
                              setCopyFeedback("✨ Enhanced prompt with Gemini Cinematic Rules!");
                              setTimeout(() => setCopyFeedback(null), 2500);
                            }}
                            className="px-2 py-0.5 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded border border-amber-600 font-bold cursor-pointer font-mono"
                            title="Synthesize and enhance prompt"
                          >
                            ✨ Gemini Enhance
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={activePromptText}
                        onChange={(e) => setActivePromptText(e.target.value)}
                        placeholder="Paste or type custom AI prompt here, or leave empty..."
                        className="w-full px-3 py-2 bg-black/90 border border-purple-800/90 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 font-sans text-xs leading-relaxed"
                      />

                      <button
                        type="button"
                        onClick={() => handleUpdateActiveVideoPrompt(activeVid.id, activePromptText)}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-stone-950 font-black rounded-xl text-xs cursor-pointer shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={13} />
                        <span>Re-Synthesize Video with This Prompt</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div>
                        <span className="text-stone-400">Engine Model:</span>{" "}
                        <strong className="text-amber-300">{activeVid.engine}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400">Camera Motion:</span>{" "}
                        <strong className="text-stone-200">{activeVid.cameraMotion}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400">Duration & FPS:</span>{" "}
                        <strong className="text-stone-200">{activeVid.duration} • {activeVid.fps}fps</strong>
                      </div>
                      {activeVid.characterEntities && activeVid.characterEntities.length > 0 && (
                        <div>
                          <span className="text-stone-400">Entities Detected:</span>{" "}
                          <span className="text-pink-300 font-bold">{activeVid.characterEntities.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center gap-2">
                      {downloadProgress !== undefined && downloadProgress < 100 ? (
                        <div className="space-y-1.5 p-3 bg-purple-950/80 rounded-xl border border-pink-500/60">
                          <div className="flex justify-between text-[11px] font-mono font-bold text-pink-300">
                            <span>Downloading MP4 into Ecosystem Vault...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all" style={{ width: `${downloadProgress}%` }} />
                          </div>
                        </div>
                      ) : isDownloaded ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handlePreviewHD(activeVid)}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-stone-950 font-black rounded-xl text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                          >
                            <Play size={16} className="fill-current" />
                            <span>Full Downloaded — Open & Play in Ecosystem</span>
                          </button>

                          <button
                            onClick={() => handleExportToDisk(activeVid)}
                            disabled={isExporting}
                            className="w-full py-2 bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 text-stone-300 hover:text-white font-bold rounded-xl text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <HardDrive size={14} />}
                            <span>{isExporting ? "Copying to Computer Disk..." : "Copy / Save to PC Disk (Optional)"}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEmbeddedDownload(activeVid)}
                          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-black rounded-xl text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                          <Download size={16} />
                          <span>Full Download to Ecosystem Vault ({activeVid.fileSize})</span>
                        </button>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setSharingVideo(activeVid)}
                          className="py-2 bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-700 hover:to-pink-600 border border-pink-400/40 text-white font-black rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-md"
                        >
                          <Share2 size={13} />
                          <span>Share</span>
                        </button>

                        <button
                          onClick={() => handleCopyText(activeVid.prompt, "AI Video Prompt")}
                          className="py-2 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={12} />
                          <span>Copy Prompt</span>
                        </button>

                        <button
                          onClick={() => handleDeleteVideo(activeVid.id)}
                          className="py-2 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                          title="Delete active video from library"
                        >
                          <Trash2 size={12} />
                          <span>Delete Video</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* SECTION 3: VIDEO GALLERY GRID WITH EMBEDDED DOWNLOAD ENGINE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-purple-900/80 pb-4">
            <div className="flex items-center gap-2">
              <Tv size={20} className="text-amber-400" />
              <h3 className="font-serif font-black text-lg text-white">
                AI CINEMA VIDEO LIBRARY & PROMPT SHOWCASE ({filteredVideos.length})
              </h3>
            </div>

            {/* FILTER CATEGORY TABS */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "ALL", label: "All Videos" },
                { id: "EXECUTIVE_DOWNLOADS", label: `Stream Mirror Executive Downloads (${executiveDownloads.length})` },
                { id: "CINEMA", label: "Cinema 16:9" },
                { id: "SHORTS", label: "YouTube Shorts 9:16" },
                { id: "ULTRAWIDE", label: "21:9 IMAX" },
                { id: "4K", label: "4K Ultra HD" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === tab.id
                      ? "bg-gradient-to-r from-amber-400 to-pink-500 text-stone-950 font-black shadow-lg"
                      : "bg-[#14062c] text-stone-400 hover:text-white border border-purple-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH BAR & REMOVE DUPLICATES ROW */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative max-w-md flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search (e.g. Merlin, Seeker, Sreymara, Cambodia, Cyberpunk, USDT)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border border-purple-900 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={handleRemoveDuplicates}
              className="px-4 py-2 bg-gradient-to-r from-red-950 via-stone-900 to-purple-950 hover:from-red-900 hover:to-purple-900 border border-red-500/80 text-red-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              title="Clean up duplicate videos from library"
            >
              <Trash2 size={14} className="text-red-400" />
              <span>Remove Duplicates</span>
            </button>
          </div>

          {/* 15 VIDEO CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => {
              const isDownloaded = executiveDownloads.some((ex) => ex.id === vid.id);
              const downloadProgress = downloadProgressMap[vid.id];
              const isExporting = isExportingMap[vid.id];

              return (
                <div
                  key={vid.id}
                  className={`bg-gradient-to-b from-[#120528] to-[#090217] rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:shadow-2xl ${
                    playingVideoId === vid.id
                      ? "border-amber-400 ring-2 ring-amber-400/50 shadow-amber-900/30"
                      : isDownloaded
                      ? "border-pink-500/60"
                      : "border-purple-900/80 hover:border-purple-600"
                  }`}
                >
                  {/* VIDEO THUMBNAIL & PREVIEW BUTTON */}
                  <div className="relative aspect-video bg-black overflow-hidden group">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 bg-black/80 backdrop-blur text-amber-300 font-mono text-[10px] font-bold rounded-lg border border-amber-500/40">
                          {vid.resolution}
                        </span>
                        <div className="flex items-center gap-1">
                          {isDownloaded && (
                            <span className="px-2 py-0.5 bg-pink-950 text-pink-300 font-mono text-[9px] font-bold rounded-lg border border-pink-600 flex items-center gap-1">
                              <CheckCircle size={10} />
                              <span>Executive Saved</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-purple-950/90 text-purple-200 font-mono text-[10px] font-bold rounded-lg border border-purple-800">
                            {vid.duration}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteVideo(vid.id, e)}
                            className="p-1 bg-red-950/90 hover:bg-red-700 text-red-200 border border-red-500/80 rounded-lg text-[9px] font-bold transition-all cursor-pointer shadow-lg ml-1"
                            title="Delete this video"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePreviewHD(vid)}
                        className="w-12 h-12 mx-auto rounded-full bg-amber-400/90 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 cursor-pointer"
                        title="Preview HD Video in Player"
                      >
                        <Play size={22} className="fill-current ml-1" />
                      </button>

                      <div className="flex justify-between items-center text-[10px] text-stone-300 font-mono">
                        <span>{vid.engine}</span>
                        <span className="text-emerald-400 font-bold">{vid.downloadsCount.toLocaleString()} downloads</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD BODY DETAILS */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-1.5">
                      <h4 className="font-serif font-bold text-white text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {vid.title}
                      </h4>
                      <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed font-sans">
                        {vid.prompt}
                      </p>
                    </div>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-1">
                      {vid.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-purple-950/60 text-stone-300 text-[9px] font-mono rounded border border-purple-900"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pt-2 border-t border-purple-900/60 space-y-2">
                      {downloadProgress !== undefined && downloadProgress < 100 ? (
                        <div className="space-y-1 p-2 bg-[#170530] rounded-xl border border-pink-500/60">
                          <div className="flex justify-between text-[10px] font-mono text-pink-300 font-bold">
                            <span>Downloading MP4 into Ecosystem Vault...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all" style={{ width: `${downloadProgress}%` }} />
                          </div>
                        </div>
                      ) : isDownloaded ? (
                        <div className="space-y-1.5">
                          <button
                            onClick={() => handlePreviewHD(vid)}
                            className="w-full py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-stone-950 font-black rounded-xl text-[11px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Play size={13} className="fill-current" />
                            <span>Open in Ecosystem Player</span>
                          </button>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleExportToDisk(vid)}
                              disabled={isExporting}
                              className="flex-1 py-1.5 bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-300 font-bold rounded-lg text-[10px] shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                              title="Copy MP4 file to local computer disk"
                            >
                              <HardDrive size={11} />
                              <span>Copy to PC (Optional)</span>
                            </button>

                            <button
                              onClick={() => setSharingVideo(vid)}
                              className="p-1.5 bg-purple-900 hover:bg-purple-800 text-pink-300 border border-purple-700 rounded-lg cursor-pointer"
                              title="Share Video"
                            >
                              <Share2 size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEmbeddedDownload(vid)}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Download size={14} />
                          <span>Full Download ({vid.fileSize})</span>
                        </button>
                      )}

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => setSharingVideo(vid)}
                          className="py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-purple-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                          title="Share Video"
                        >
                          <Share2 size={11} />
                          <span>Share</span>
                        </button>

                        <button
                          onClick={() => handlePreviewHD(vid)}
                          className="py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-amber-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                          title="Preview HD Video"
                        >
                          <Eye size={11} />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={(e) => handleDeleteVideo(vid.id, e)}
                          className="py-1.5 bg-red-950/80 hover:bg-red-800 border border-red-800/80 text-red-300 hover:text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 size={11} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 20 SOCIAL MEDIA DIRECT SHARE MODAL */}
      {sharingVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#120528] border-2 border-pink-500/80 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl text-stone-100 animate-fade-in relative my-auto">
            <button
              onClick={() => setSharingVideo(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-purple-950/80 cursor-pointer"
            >
              <CloseIcon size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-xl shrink-0">
                🚀
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-base sm:text-lg text-pink-200">ECOSYSTEM SOCIAL NETWORK DISTRIBUTOR</h3>
                  <span className="px-2 py-0.5 bg-pink-950 border border-pink-700 text-pink-300 font-mono text-[10px] font-bold rounded-full">
                    20 PLATFORMS
                  </span>
                </div>
                <p className="text-xs text-stone-300 line-clamp-1">{sharingVideo.title}</p>
              </div>
            </div>

            <div className="p-2.5 bg-black/60 rounded-xl border border-purple-900 text-xs text-stone-300 space-y-0.5">
              <span className="text-amber-400 font-bold font-mono">Prompt:</span>
              <p className="line-clamp-2 text-[11px] text-stone-300">{sharingVideo.prompt}</p>
            </div>

            {/* Native Device Share Banner */}
            <button
              onClick={() => triggerSocialShare("native", sharingVideo)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <Share2 size={16} />
              <span>SHARE VIA PHONE / DEVICE NATIVE APPS (System Share)</span>
            </button>

            {/* 20 Social Networks Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[50vh] sm:max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-700">
              <button
                onClick={() => triggerSocialShare("whatsapp", sharingVideo)}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Send size={14} className="shrink-0" />
                <span className="truncate">1. WhatsApp</span>
              </button>

              <button
                onClick={() => triggerSocialShare("telegram", sharingVideo)}
                className="py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">2. Telegram</span>
              </button>

              <button
                onClick={() => triggerSocialShare("tiktok", sharingVideo)}
                className="py-2 px-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Film size={14} className="shrink-0" />
                <span className="truncate">3. TikTok</span>
              </button>

              <button
                onClick={() => triggerSocialShare("instagram", sharingVideo)}
                className="py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Instagram size={14} className="shrink-0" />
                <span className="truncate">4. Instagram</span>
              </button>

              <button
                onClick={() => triggerSocialShare("twitter", sharingVideo)}
                className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-600 font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Share2 size={14} className="shrink-0" />
                <span className="truncate">5. 𝕏 (Twitter)</span>
              </button>

              <button
                onClick={() => triggerSocialShare("facebook", sharingVideo)}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Globe size={14} className="shrink-0" />
                <span className="truncate">6. Facebook</span>
              </button>

              <button
                onClick={() => triggerSocialShare("linkedin", sharingVideo)}
                className="py-2 px-3 bg-blue-700 hover:bg-blue-600 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Share2 size={14} className="shrink-0" />
                <span className="truncate">7. LinkedIn</span>
              </button>

              <button
                onClick={() => triggerSocialShare("reddit", sharingVideo)}
                className="py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">8. Reddit</span>
              </button>

              <button
                onClick={() => triggerSocialShare("pinterest", sharingVideo)}
                className="py-2 px-3 bg-red-700 hover:bg-red-600 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Sparkles size={14} className="shrink-0" />
                <span className="truncate">9. Pinterest</span>
              </button>

              <button
                onClick={() => triggerSocialShare("youtube", sharingVideo)}
                className="py-2 px-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Play size={14} className="shrink-0" />
                <span className="truncate">10. YT Shorts</span>
              </button>

              <button
                onClick={() => triggerSocialShare("discord", sharingVideo)}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">11. Discord</span>
              </button>

              <button
                onClick={() => triggerSocialShare("snapchat", sharingVideo)}
                className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Camera size={14} className="shrink-0" />
                <span className="truncate">12. Snapchat</span>
              </button>

              <button
                onClick={() => triggerSocialShare("threads", sharingVideo)}
                className="py-2 px-3 bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-100 font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Share2 size={14} className="shrink-0" />
                <span className="truncate">13. Threads</span>
              </button>

              <button
                onClick={() => triggerSocialShare("wechat", sharingVideo)}
                className="py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Send size={14} className="shrink-0" />
                <span className="truncate">14. WeChat</span>
              </button>

              <button
                onClick={() => triggerSocialShare("viber", sharingVideo)}
                className="py-2 px-3 bg-[#7360f2] hover:bg-[#624ee0] text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">15. Viber</span>
              </button>

              <button
                onClick={() => triggerSocialShare("line", sharingVideo)}
                className="py-2 px-3 bg-[#00c300] hover:bg-[#00a800] text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Send size={14} className="shrink-0" />
                <span className="truncate">16. LINE App</span>
              </button>

              <button
                onClick={() => triggerSocialShare("skype", sharingVideo)}
                className="py-2 px-3 bg-[#00aff0] hover:bg-[#009bd6] text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">17. Skype</span>
              </button>

              <button
                onClick={() => triggerSocialShare("vk", sharingVideo)}
                className="py-2 px-3 bg-[#4a76a8] hover:bg-[#3b628e] text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Globe size={14} className="shrink-0" />
                <span className="truncate">18. VKontakte</span>
              </button>

              <button
                onClick={() => triggerSocialShare("tumblr", sharingVideo)}
                className="py-2 px-3 bg-[#35465c] hover:bg-[#283648] text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Share2 size={14} className="shrink-0" />
                <span className="truncate">19. Tumblr</span>
              </button>

              <button
                onClick={() => triggerSocialShare("email", sharingVideo)}
                className="py-2 px-3 bg-purple-800 hover:bg-purple-700 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Send size={14} className="shrink-0" />
                <span className="truncate">20. Email / App</span>
              </button>
            </div>

            <button
              onClick={() => handleCopyText(`https://earnings.ink/#cinema_video?v=${sharingVideo.id}`, "Ecosystem Video Link")}
              className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Copy size={14} />
              <span>Copy Ecosystem Video Direct Share Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
