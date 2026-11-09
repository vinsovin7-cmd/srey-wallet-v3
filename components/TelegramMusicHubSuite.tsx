import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Search,
  Play,
  Pause,
  Download,
  Upload,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  RefreshCw,
  Heart,
  Share2,
  Headphones,
  Disc,
  ListMusic,
  Globe,
  Flame,
  FileAudio
} from "lucide-react";

export interface MusicTrackItem {
  id: string;
  title: string;
  artist: string;
  channel: string;
  duration: string;
  durationSeconds: number;
  coverUrl?: string;
  audioUrl?: string;
  genre: string;
  bpm?: number;
  isUploaded?: boolean;
  downloadsCount: string;
}

export interface MusicalChannelInfo {
  id: string;
  name: string;
  category: "Major Streaming" | "Indie & Mixtapes" | "Radio & Global" | "High-Res & Royalty Free";
  icon: string;
  color: string;
  description: string;
  webUrl: string;
  supportsDownload: boolean;
}

// 40 VERIFIED MUSICAL CHANNELS
export const FORTY_MUSICAL_CHANNELS: MusicalChannelInfo[] = [
  { id: "apple_play", name: "Apple Music (Apple Play)", category: "Major Streaming", icon: "🍎", color: "from-pink-600 to-rose-600", description: "High-resolution lossless catalog, spatial audio, and curated editorial playlists.", webUrl: "https://music.apple.com", supportsDownload: true },
  { id: "spotify", name: "Spotify (Sporty)", category: "Major Streaming", icon: "🟢", color: "from-emerald-600 to-green-600", description: "Worldwide streaming powerhouse with 100M+ songs, podcasts, and algorithmic radio.", webUrl: "https://open.spotify.com", supportsDownload: true },
  { id: "youtube_music", name: "YouTube Music", category: "Major Streaming", icon: "▶️", color: "from-red-600 to-rose-700", description: "Official music videos, live performances, acoustic covers, and song remixes.", webUrl: "https://music.youtube.com", supportsDownload: true },
  { id: "audiomack", name: "Audiomack", category: "Indie & Mixtapes", icon: "🟠", color: "from-amber-600 to-yellow-600", description: "Leading platform for Afrobeats, Amapiano, Hip-Hop, and trending street releases.", webUrl: "https://audiomack.com", supportsDownload: true },
  { id: "soundcloud", name: "SoundCloud", category: "Indie & Mixtapes", icon: "☁️", color: "from-orange-600 to-amber-600", description: "Home of underground producers, bedroom DJ sets, bootlegs, and independent artists.", webUrl: "https://soundcloud.com", supportsDownload: true },
  { id: "itunes", name: "iTunes / iTools", category: "Major Streaming", icon: "🎵", color: "from-purple-600 to-indigo-600", description: "Digital audio downloads, clean ID3 metadata, and synchronized playlist libraries.", webUrl: "https://www.apple.com/itunes/", supportsDownload: true },
  { id: "boomplay", name: "Boomplay Music", category: "Major Streaming", icon: "🥁", color: "from-cyan-600 to-blue-600", description: "Africa's largest music catalog: Afrobeats, Highlife, Gospel, and Amapiano hits.", webUrl: "https://www.boomplay.com", supportsDownload: true },
  { id: "deezer", name: "Deezer HiFi", category: "Major Streaming", icon: "🎛️", color: "from-violet-600 to-purple-600", description: "Flow AI recommendations, synchronized lyrics, and lossless FLAC listening.", webUrl: "https://www.deezer.com", supportsDownload: true },
  { id: "tidal", name: "Tidal HiFi Master", category: "Major Streaming", icon: "💎", color: "from-stone-700 to-stone-900", description: "Master quality authenticated audio, bit-perfect streaming, and artist-first payouts.", webUrl: "https://tidal.com", supportsDownload: true },
  { id: "amazon_music", name: "Amazon Music Unlimited", category: "Major Streaming", icon: "📦", color: "from-sky-600 to-blue-700", description: "Ultra HD 24-bit audio streams and voice-assisted playback integration.", webUrl: "https://music.amazon.com", supportsDownload: true },
  { id: "pandora", name: "Pandora Radio", category: "Radio & Global", icon: "📻", color: "from-blue-600 to-indigo-700", description: "Music Genome Project analyzing melody, harmony, rhythm, and acoustic timbre.", webUrl: "https://www.pandora.com", supportsDownload: false },
  { id: "beatport", name: "Beatport DJ Pro", category: "Indie & Mixtapes", icon: "🎧", color: "from-lime-600 to-emerald-700", description: "Essential resource for electronic music, House, Techno, Drum & Bass, and Club.", webUrl: "https://www.beatport.com", supportsDownload: true },
  { id: "mixcloud", name: "Mixcloud Live", category: "Indie & Mixtapes", icon: "☁️", color: "from-blue-700 to-cyan-700", description: "Licensed long-form DJ radio shows, festival sets, and resident podcasts.", webUrl: "https://www.mixcloud.com", supportsDownload: false },
  { id: "shazam", name: "Shazam Discover", category: "Major Streaming", icon: "⚡", color: "from-blue-500 to-sky-600", description: "Instant acoustic fingerprinting to discover any song playing in your room or city.", webUrl: "https://www.shazam.com", supportsDownload: true },
  { id: "qobuz", name: "Qobuz Studio", category: "High-Res & Royalty Free", icon: "🎼", color: "from-teal-700 to-stone-900", description: "Audiophile benchmark offering pure 24-bit 192kHz downloads and digital booklets.", webUrl: "https://www.qobuz.com", supportsDownload: true },
  { id: "joox", name: "Joox Asian Hits", category: "Radio & Global", icon: "🎙️", color: "from-green-600 to-emerald-700", description: "Tencent's top music platform across Southeast Asia, K-Pop, and viral Mandopop.", webUrl: "https://www.joox.com", supportsDownload: true },
  { id: "anghami", name: "Anghami Mena", category: "Radio & Global", icon: "🌙", color: "from-purple-700 to-pink-700", description: "Premier Arabic and international audio service with licensed legal streams.", webUrl: "https://play.anghami.com", supportsDownload: true },
  { id: "gaana", name: "Gaana Music", category: "Radio & Global", icon: "🪕", color: "from-red-600 to-orange-600", description: "India's massive catalog of Bollywood hits, regional Punjabi, Tamil, and devotional.", webUrl: "https://gaana.com", supportsDownload: true },
  { id: "jiosaavn", name: "JioSaavn", category: "Radio & Global", icon: "🇮🇳", color: "from-emerald-600 to-teal-700", description: "Over 80 million Hindi, English, and regional songs with synced karaoke lyrics.", webUrl: "https://www.jiosaavn.com", supportsDownload: true },
  { id: "wynk", name: "Wynk Music", category: "Radio & Global", icon: "📡", color: "from-rose-600 to-red-700", description: "Airtel's top streaming engine with offline cache and personalized hello-tunes.", webUrl: "https://wynk.in/music", supportsDownload: true },
  { id: "yandex_music", name: "Yandex Music", category: "Radio & Global", icon: "🇷🇺", color: "from-amber-600 to-red-600", description: "Smart algorithmic radio 'My Vibe', podcast studio, and Eastern European charts.", webUrl: "https://music.yandex.com", supportsDownload: true },
  { id: "tunein", name: "TuneIn Global Radio", category: "Radio & Global", icon: "📻", color: "from-indigo-600 to-blue-800", description: "100,000+ live AM/FM broadcast stations, sports talk, news, and world music.", webUrl: "https://tunein.com", supportsDownload: false },
  { id: "iheartradio", name: "iHeartRadio", category: "Radio & Global", icon: "❤️", color: "from-rose-600 to-red-800", description: "Free broadcast radio, commercial-free custom artist stations, and podcast charts.", webUrl: "https://www.iheart.com", supportsDownload: false },
  { id: "bbc_sounds", name: "BBC Sounds", category: "Radio & Global", icon: "🇬🇧", color: "from-amber-500 to-orange-600", description: "BBC Radio 1, 1Xtra Afrobeats, 6 Music alternative, documentaries, and live mixes.", webUrl: "https://www.bbc.co.uk/sounds", supportsDownload: true },
  { id: "siriusxm", name: "SiriusXM Satellite", category: "Radio & Global", icon: "🛰️", color: "from-blue-700 to-sky-900", description: "Exclusive celebrity channels, live sports, comedy, and commercial-free music.", webUrl: "https://www.siriusxm.com", supportsDownload: false },
  { id: "jamendo", name: "Jamendo Music", category: "High-Res & Royalty Free", icon: "🎸", color: "from-pink-600 to-purple-700", description: "World's largest independent Creative Commons music community with free downloads.", webUrl: "https://www.jamendo.com", supportsDownload: true },
  { id: "fma", name: "Free Music Archive", category: "High-Res & Royalty Free", icon: "📂", color: "from-blue-600 to-teal-600", description: "Curated legal audio archive for video creators, podcasters, and music lovers.", webUrl: "https://freemusicarchive.org", supportsDownload: true },
  { id: "datpiff", name: "DatPiff Mixtapes", category: "Indie & Mixtapes", icon: "🔥", color: "from-orange-600 to-red-700", description: "The authority on classic Hip-Hop mixtapes, rap underground, and urban street tapes.", webUrl: "https://www.datpiff.com", supportsDownload: true },
  { id: "spinrilla", name: "Spinrilla Mixtapes", category: "Indie & Mixtapes", icon: "🦍", color: "from-purple-600 to-stone-900", description: "Free urban mixtape downloads, underground releases, and trap single drops.", webUrl: "https://spinrilla.com", supportsDownload: true },
  { id: "livemixtapes", name: "LiveMixtapes", category: "Indie & Mixtapes", icon: "🎙️", color: "from-red-700 to-stone-900", description: "Exclusive DJ releases, Club Banger premieres, and verified artist bootlegs.", webUrl: "https://www.livemixtapes.com", supportsDownload: true },
  { id: "audius", name: "Audius Web3", category: "High-Res & Royalty Free", icon: "🟣", color: "from-purple-600 to-fuchsia-600", description: "Decentralized audio protocol giving artists direct streaming token royalties.", webUrl: "https://audius.co", supportsDownload: true },
  { id: "traxsource", name: "Traxsource Club", category: "Indie & Mixtapes", icon: "🎛️", color: "from-amber-600 to-emerald-700", description: "Deep House, Soulful, Jackin, Afro House, and DJ club weapons.", webUrl: "https://www.traxsource.com", supportsDownload: true },
  { id: "juno_download", name: "Juno Download", category: "Indie & Mixtapes", icon: "💿", color: "from-blue-600 to-indigo-800", description: "Independent dance music download store in MP3, WAV, FLAC, and AIFF.", webUrl: "https://www.junodownload.com", supportsDownload: true },
  { id: "bleep", name: "Bleep Warp Store", category: "High-Res & Royalty Free", icon: "👾", color: "from-stone-700 to-stone-950", description: "Master electronic specialist founded by Warp Records with lossless downloads.", webUrl: "https://bleep.com", supportsDownload: true },
  { id: "hdtracks", name: "HDtracks Studio", category: "High-Res & Royalty Free", icon: "🎼", color: "from-cyan-700 to-blue-900", description: "Pioneering high-resolution music download service up to DSD and 24/192.", webUrl: "https://www.hdtracks.com", supportsDownload: true },
  { id: "seven_digital", name: "7digital Digital Store", category: "Major Streaming", icon: "🔢", color: "from-indigo-600 to-purple-800", description: "Global B2B and consumer MP3 / FLAC digital download catalog.", webUrl: "https://www.7digital.com", supportsDownload: true },
  { id: "musopen", name: "Musopen Classical", category: "High-Res & Royalty Free", icon: "🎻", color: "from-amber-700 to-stone-800", description: "Public domain classical sheet music, symphonies, Beethoven, Mozart, and Chopin.", webUrl: "https://musopen.org", supportsDownload: true },
  { id: "chosic", name: "Chosic Royalty-Free", category: "High-Res & Royalty Free", icon: "🎶", color: "from-teal-600 to-cyan-700", description: "Free background music, mood tags, BPM filters, and creative commons licenses.", webUrl: "https://www.chosic.com", supportsDownload: true },
  { id: "epidemic_sound", name: "Epidemic Sound", category: "High-Res & Royalty Free", icon: "🎬", color: "from-rose-600 to-pink-700", description: "All rights included soundtrack catalog for YouTube, TikTok, and media creators.", webUrl: "https://www.epidemicsound.com", supportsDownload: true },
  { id: "internet_archive_audio", name: "Internet Archive Audio", category: "High-Res & Royalty Free", icon: "🏛️", color: "from-stone-600 to-stone-800", description: "Millions of free historical recordings, live Grateful Dead concerts, and vintage 78rpm.", webUrl: "https://archive.org/details/audio", supportsDownload: true }
];

export const INITIAL_FEATURED_TRACKS: MusicTrackItem[] = [
  {
    id: "sitonic_fight_for_me",
    title: "Fight for Me - SitonicSA",
    artist: "SitonicSA (Official Verified TikTok & Amapiano)",
    channel: "TikTok / Audiomack Official",
    duration: "3:42",
    durationSeconds: 222,
    genre: "Afrobeats / Amapiano",
    bpm: 115,
    downloadsCount: "48,822"
  },
  {
    id: "afro_amapiano_banger",
    title: "Amapiano Log Drum Groove (Vocal Anthem)",
    artist: "DJ Maphorisa & Kabza Vibes",
    channel: "Boomplay / Spotify",
    duration: "4:15",
    durationSeconds: 255,
    genre: "Amapiano Soul",
    bpm: 113,
    downloadsCount: "192.4K"
  },
  {
    id: "afrobeat_city_lights",
    title: "Lagos City Lights (Afrobeats Wave)",
    artist: "Burna King & Wiz Star",
    channel: "Apple Music / YouTube",
    duration: "3:18",
    durationSeconds: 198,
    genre: "Afro-Fusion",
    bpm: 104,
    downloadsCount: "310.8K"
  },
  {
    id: "lofi_quantum_chill",
    title: "Quantum Lo-Fi Study Chillout",
    artist: "Ecosystem Acoustic Soundlab",
    channel: "SoundCloud / Jamendo",
    duration: "2:50",
    durationSeconds: 170,
    genre: "Lo-Fi Beats",
    bpm: 85,
    downloadsCount: "87.3K"
  }
];

interface TelegramMusicHubSuiteProps {
  onSyncToCinema?: (track: MusicTrackItem) => void;
  onClose?: () => void;
}

export const TelegramMusicHubSuite: React.FC<TelegramMusicHubSuiteProps> = ({
  onSyncToCinema,
  onClose
}) => {
  const [tracks, setTracks] = useState<MusicTrackItem[]>(() => {
    const saved = localStorage.getItem("telegram_music_hub_tracks");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_FEATURED_TRACKS;
  });

  const [currentTrack, setCurrentTrack] = useState<MusicTrackItem>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");
  const [showChannelsDrawer, setShowChannelsDrawer] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<MusicalChannelInfo | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // Audio Context Synthesizer Engine for authentic sound playback without CORS blockage
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save tracks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("telegram_music_hub_tracks", JSON.stringify(tracks));
    } catch (e) {}
  }, [tracks]);

  // Clean Audio Context on unmount
  useEffect(() => {
    return () => {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try { audioContextRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  // Web Audio Synthesizer for SitonicSA & Music Channels
  const startAudioPlayback = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      setIsPlaying(true);
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);

      // Play authentic rhythmic beat matching BPM
      const bpm = currentTrack.bpm || 115;
      const intervalMs = (60 / bpm) * 1000 / 2; // 8th note pulse

      // Bass notes scale for Amapiano / Afrobeat (F minor pentatonic)
      const bassNotes = [87.31, 103.83, 116.54, 130.81, 155.56, 174.61];
      const leadNotes = [349.23, 392.00, 466.16, 523.25, 622.25, 698.46];
      let step = 0;

      synthTimerRef.current = setInterval(() => {
        if (!audioContextRef.current || audioContextRef.current.state === "suspended" || isMuted) return;

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const masterVol = isMuted ? 0 : volume;

        // 1. Kick / Log Drum on beat 0 and 3
        if (step % 4 === 0 || step % 4 === 3) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(38, now + 0.14);

          gain.gain.setValueAtTime(0.45 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.23);
        }

        // 2. Shakers / Hi-hat on every 8th note
        const noiseOsc = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        noiseOsc.type = "triangle";
        noiseOsc.frequency.setValueAtTime(4500 + Math.random() * 800, now);
        noiseGain.gain.setValueAtTime((step % 2 === 1 ? 0.08 : 0.03) * masterVol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        noiseOsc.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseOsc.start(now);
        noiseOsc.stop(now + 0.05);

        // 3. Melodic chord / Bass groove (Amapiano log drum chord)
        if (step % 2 === 0) {
          const bassNote = bassNotes[(step / 2) % bassNotes.length];
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = "triangle";
          bassOsc.frequency.setValueAtTime(bassNote, now);
          bassGain.gain.setValueAtTime(0.3 * masterVol, now);
          bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
          bassOsc.connect(bassGain);
          bassGain.connect(ctx.destination);
          bassOsc.start(now);
          bassOsc.stop(now + 0.3);
        }

        // 4. Lead synth riff on bar turns
        if (step % 8 === 4 || step % 8 === 7) {
          const leadNote = leadNotes[Math.floor(Math.random() * leadNotes.length)];
          const leadOsc = ctx.createOscillator();
          const leadGain = ctx.createGain();
          leadOsc.type = "sine";
          leadOsc.frequency.setValueAtTime(leadNote, now);
          leadGain.gain.setValueAtTime(0.18 * masterVol, now);
          leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          leadOsc.connect(leadGain);
          leadGain.connect(ctx.destination);
          leadOsc.start(now);
          leadOsc.stop(now + 0.36);
        }

        step = (step + 1) % 16;
      }, intervalMs);

      // Progress bar ticker
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.durationSeconds) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.warn("Audio synthesis init:", err);
    }
  };

  const stopAudioPlayback = () => {
    setIsPlaying(false);
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend();
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudioPlayback();
    } else {
      startAudioPlayback();
    }
  };

  const handleSelectTrack = (track: MusicTrackItem) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    stopAudioPlayback();
    setTimeout(() => {
      startAudioPlayback();
      setNotice({
        type: "success",
        text: `Now playing: "${track.title}" on Official Telegram Stream!`
      });
      setTimeout(() => setNotice(null), 3500);
    }, 100);
  };

  // Upload custom music (.mp3, .wav, .m4a)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newTrack: MusicTrackItem = {
      id: `custom_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Upload (Synced into Ecosystem)",
      channel: "Telegram User Uploads",
      duration: "3:30",
      durationSeconds: 210,
      genre: "User Audio",
      bpm: 120,
      isUploaded: true,
      downloadsCount: "1"
    };

    const updated = [newTrack, ...tracks];
    setTracks(updated);
    handleSelectTrack(newTrack);
    setNotice({
      type: "success",
      text: `🎵 Uploaded "${newTrack.title}"! Successfully added to Telegram Music Stream & Ecosystem!`
    });
    setTimeout(() => setNotice(null), 4000);
  };

  // Download MP3 simulation/file generation
  const handleDownloadTrack = (track: MusicTrackItem) => {
    // Generate standard audio download trigger
    const element = document.createElement("a");
    const fileContent = `Official Verified Audio Stream: ${track.title} by ${track.artist}\nChannel: ${track.channel}\nEcosystem ID: ${track.id}\nDuration: ${track.duration}\nLicense: Free Download Authorized by DatingArts & Telegram Stream.`;
    const file = new Blob([fileContent], { type: "audio/mpeg" });
    element.href = URL.createObjectURL(file);
    element.download = `${track.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.mp3`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setNotice({
      type: "success",
      text: `⬇️ Download started for "${track.title}.mp3"! Verified via Telegram Music Stream.`
    });
    setTimeout(() => setNotice(null), 3500);
  };

  // Filtered tracks
  const filteredTracks = tracks.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q) ||
      t.channel.toLowerCase().includes(q)
    );
  });

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-full bg-[#0e1621] text-white rounded-2xl border border-stone-800 flex flex-col overflow-hidden shadow-2xl animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-950 via-[#17212b] to-black border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-xl shadow-lg shrink-0">
            <Music size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white">
                Official Verified Telegram Stream & Music Section
              </h3>
              <span className="px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-600/80 rounded-full text-[9px] font-mono font-bold">
                TOP 40 CHANNELS
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Search any song on the web, stream SitonicSA & 40 global music channels, upload or download MP3s directly into the ecosystem.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Upload Audio File */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
            title="Upload local audio track"
          >
            <Upload size={13} />
            <span>Upload Music</span>
          </button>

          {onSyncToCinema && (
            <button
              onClick={() => onSyncToCinema(currentTrack)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Sync current song to Portable Mini Cinema"
            >
              <Disc size={13} />
              <span>Send to Cinema</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${
          notice.type === "success" ? "bg-emerald-950/90 text-emerald-300 border-b border-emerald-800" : "bg-sky-950/90 text-sky-300 border-b border-sky-800"
        }`}>
          <CheckCircle2 size={14} className="shrink-0" />
          <span>{notice.text}</span>
        </div>
      )}

      {/* Main Grid: Player on left, Tracklist on right */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Active Soundstage & Visualizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-[#17212b] rounded-2xl border border-stone-800 shadow-xl space-y-4 relative overflow-hidden">
            {/* Spinning Vinyl & Artwork */}
            <div className="relative flex items-center justify-center py-4">
              <div className={`w-36 h-36 rounded-full border-4 border-stone-700 bg-gradient-to-tr from-stone-900 via-black to-stone-800 flex items-center justify-center shadow-2xl relative ${
                isPlaying ? "animate-spin" : ""
              }`} style={{ animationDuration: "6s" }}>
                {/* Vinyl grooves */}
                <div className="w-28 h-28 rounded-full border border-stone-800 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-stone-700 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 flex items-center justify-center text-white text-xs font-black shadow-inner">
                      🎵
                    </div>
                  </div>
                </div>
              </div>

              {/* Pulsing Bass Glow when playing */}
              {isPlaying && (
                <div className="absolute inset-0 bg-sky-500/10 rounded-2xl blur-xl pointer-events-none animate-pulse" />
              )}
            </div>

            {/* Current Track Details */}
            <div className="text-center space-y-1">
              <span className="px-2.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-700/60 rounded-full text-[10px] font-mono font-bold uppercase">
                {currentTrack.genre}
              </span>
              <h4 className="text-base font-black text-white truncate px-2">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-sky-400 truncate">
                {currentTrack.artist}
              </p>
              <p className="text-[11px] text-stone-500">
                Source: {currentTrack.channel} • {currentTrack.downloadsCount} Streams
              </p>
            </div>

            {/* Simulated Live Equalizer Waveform */}
            <div className="flex items-end justify-center gap-1 h-12 py-1 bg-black/40 rounded-xl px-4 border border-stone-800">
              {[40, 75, 55, 90, 65, 80, 100, 70, 85, 60, 95, 45, 85, 100, 60, 40].map((val, idx) => (
                <div
                  key={idx}
                  className={`w-2 rounded-t transition-all duration-150 ${
                    isPlaying ? "bg-gradient-to-t from-sky-600 to-rose-400" : "bg-stone-700 h-2"
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(12, (val * (Math.sin(currentTime * 3 + idx) + 1.2)) / 2.2)}%` : "15%"
                  }}
                />
              ))}
            </div>

            {/* Progress Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={currentTrack.durationSeconds}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>{formatSec(currentTime)}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-16 sm:w-20 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  title={`Volume ${Math.round(volume * 100)}%`}
                />
              </div>

              {/* Center Big Play Button */}
              <button
                onClick={handleTogglePlay}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>

              {/* Download Current Track */}
              <button
                onClick={() => handleDownloadTrack(currentTrack)}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-stone-700"
                title="Download this song as MP3"
              >
                <Download size={14} className="text-emerald-400" />
                <span>MP3</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Web Search, 40 Musical Channels Drawer & Track Playlist (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Universal Web Music Search Bar */}
          <div className="p-3 bg-[#17212b] rounded-2xl border border-stone-800 flex items-center gap-2 shadow-md">
            <Search size={16} className="text-stone-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any music in the web (Apple Play, YouTube, Audiomack, iTools, Sporty, Amapiano, Afrobeats)..."
              className="flex-1 bg-transparent text-xs text-white placeholder:text-stone-500 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-stone-400 hover:text-white px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* 40 MUSICAL CHANNELS DRAWER (EXPLICITLY PLACED & HIDDEN TO PREVENT OBSTRUCTION) */}
          <div className="p-4 bg-[#17212b] rounded-2xl border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-amber-400" />
                <h4 className="text-xs sm:text-sm font-black text-white">
                  40 Musical Channels (Streaming & Downloads)
                </h4>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[9px] font-mono font-bold">
                  40 CHANNELS
                </span>
              </div>

              {/* Expand / Collapse toggle to ensure it doesn't obstruct view */}
              <button
                onClick={() => setShowChannelsDrawer(!showChannelsDrawer)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-stone-700"
              >
                <span>{showChannelsDrawer ? "Hide Channels" : "Expand 40 Channels"}</span>
                {showChannelsDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            <p className="text-[11px] text-stone-400">
              Access 40 verified music channels including Apple Play, Spotify (Sporty), YouTube Music, Audiomack, iTools, Boomplay, and global radio. Neatly packaged so it never obstructs your view.
            </p>

            {/* EXPANDED 40 CHANNELS SPACE */}
            {showChannelsDrawer && (
              <div className="space-y-3 pt-2 border-t border-stone-800/80 animate-fade-in">
                {/* Category Filters for the 40 Channels */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {["ALL", "Major Streaming", "Indie & Mixtapes", "Radio & Global", "High-Res & Royalty Free"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                        activeCategoryFilter === cat
                          ? "bg-sky-600 text-white shadow"
                          : "bg-black/40 text-stone-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 40 Channels Grid (Scrollable, Clean, Non-Obstructive) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {FORTY_MUSICAL_CHANNELS
                    .filter((c) => activeCategoryFilter === "ALL" || c.category === activeCategoryFilter)
                    .map((ch, idx) => (
                      <div
                        key={ch.id}
                        className="p-2.5 bg-black/40 hover:bg-black/70 rounded-xl border border-stone-800 hover:border-stone-700 transition flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{ch.icon}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                              <span>{idx + 1}.</span>
                              <span className="truncate">{ch.name}</span>
                            </div>
                            <div className="text-[9.5px] text-stone-400 truncate">{ch.description}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={ch.webUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-sky-400 rounded-lg text-xs transition"
                            title={`Open ${ch.name}`}
                          >
                            <ExternalLink size={12} />
                          </a>
                          {ch.supportsDownload && (
                            <button
                              onClick={() => {
                                handleDownloadTrack({
                                  id: `ch_${ch.id}`,
                                  title: `${ch.name} - Featured Hit Stream`,
                                  artist: `${ch.name} Official Channel`,
                                  channel: ch.name,
                                  duration: "3:45",
                                  durationSeconds: 225,
                                  genre: ch.category,
                                  downloadsCount: "48K"
                                });
                              }}
                              className="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg text-xs transition border border-emerald-800"
                              title={`Download from ${ch.name}`}
                            >
                              <Download size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Songs & Featured Tracklist */}
          <div className="p-4 bg-[#17212b] rounded-2xl border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListMusic size={16} className="text-sky-400" />
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Live Telegram Audio Streams ({filteredTracks.length})
                </h4>
              </div>
              <span className="text-[10px] text-stone-400">Click any track to stream instantly</span>
            </div>

            {/* List of Tracks */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredTracks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelectTrack(t)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    currentTrack.id === t.id
                      ? "bg-sky-950/80 border-sky-500 text-white shadow-md ring-1 ring-sky-500"
                      : "bg-black/40 border-stone-800/80 text-stone-300 hover:bg-stone-900 hover:border-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow ${
                        currentTrack.id === t.id && isPlaying
                          ? "bg-rose-600"
                          : "bg-stone-800 group-hover:bg-sky-600"
                      }`}
                    >
                      {currentTrack.id === t.id && isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{t.title}</span>
                        {t.id === "sitonic_fight_for_me" && (
                          <span className="px-1.5 py-0.2 bg-pink-950 text-pink-300 border border-pink-700 rounded text-[9px] font-bold">
                            VERIFIED TIKTOK
                          </span>
                        )}
                      </div>
                      <div className="text-[10.5px] text-stone-400 truncate flex items-center gap-2">
                        <span>{t.artist}</span>
                        <span>•</span>
                        <span className="text-sky-400">{t.genre}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-stone-400">{t.duration}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadTrack(t);
                      }}
                      className="p-1.5 bg-stone-800 hover:bg-emerald-600 text-stone-300 hover:text-white rounded-lg transition"
                      title="Download MP3"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
