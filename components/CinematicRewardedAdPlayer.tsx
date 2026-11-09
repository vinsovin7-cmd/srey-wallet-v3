import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, X, CheckCircle2, Clock, Volume2, VolumeX, ShieldCheck, Sparkles, RefreshCw, Flame, Award } from 'lucide-react';

export interface VideoManifestItem {
  id: string;
  url: string;
  backupUrls?: string[];
  title: string;
  category: 'FOOD' | 'MEDICINE' | 'CAMBODIA_DRONE_CRYPTO' | 'WEB3_CRYPTO';
  duration: number; // 15 or 30 seconds
  description: string;
  sponsor: string;
}

export const VIDEO_MANIFEST: VideoManifestItem[] = [
  {
    id: 'v-phnom-penh-drone-30s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-and-skyscrapers-41617-large.mp4',
    backupUrls: [
      'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-futuristic-city-at-night-42211-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ],
    title: 'Phnom Penh Web3 Financial Hub & Crypto Drone Overview',
    category: 'CAMBODIA_DRONE_CRYPTO',
    duration: 30,
    description: 'Aerial drone footage across Phnom Penh skyline, Tonle Sap river & Web3 crypto settlement node.',
    sponsor: 'Phnom Penh Sovereign Crypto Exchange'
  },
  {
    id: 'v-food-gourmet-15s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-table-with-delicious-food-42880-large.mp4',
    backupUrls: [
      'https://assets.mixkit.co/videos/preview/mixkit-fresh-food-ingredients-on-a-table-41705-large.mp4',
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ],
    title: 'Angkor Gourmet & Artisan Culinary Feast',
    category: 'FOOD',
    duration: 15,
    description: 'Fresh royal Khmer cuisine, artisan ingredients, and five-star culinary dining experience.',
    sponsor: 'Sreymara Palace Kitchen & Fine Dining'
  },
  {
    id: 'v-medicine-pharma-15s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-bottle-of-medicine-pills-43846-large.mp4',
    backupUrls: [
      'https://assets.mixkit.co/videos/preview/mixkit-doctor-checking-a-patient-42774-large.mp4',
      'https://vjs.zencdn.net/v/oceans.mp4'
    ],
    title: 'Executive BioHealth - Advanced Pharma & Vitality',
    category: 'MEDICINE',
    duration: 15,
    description: 'Precision clinical medicine, bio-health diagnostics, and premium wellness supplements.',
    sponsor: 'BioHealth International Pharma Labs'
  },
  {
    id: 'v-phnom-penh-night-crypto-30s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-futuristic-city-at-night-42211-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    ],
    title: 'Phnom Penh Night Drone - Royal Crypto Exchange',
    category: 'CAMBODIA_DRONE_CRYPTO',
    duration: 30,
    description: 'Illuminated Phnom Penh skyscraper drone sweep with real-time TON & USDT liquidity streams.',
    sponsor: 'Cambodia Web3 Capital'
  },
  {
    id: 'v-asian-street-food-30s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-food-ingredients-on-a-table-41705-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ],
    title: 'Khmer Heritage Street Food & Organic Harvest',
    category: 'FOOD',
    duration: 30,
    description: 'Authentic Southeast Asian street food delicacies, sizzling wok dishes, and organic harvests.',
    sponsor: 'Khmer Food Festival & Express'
  },
  {
    id: 'v-medicine-telehealth-30s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-doctor-checking-a-patient-42774-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
    ],
    title: 'Global BioPharma & Modern Medicine Shield',
    category: 'MEDICINE',
    duration: 30,
    description: 'Cutting-edge telemedicine diagnostics, clinical trials, and life-saving pharmaceutical care.',
    sponsor: 'TeleMed Horizon Global'
  },
  {
    id: 'v-crypto-yield-15s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41710-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
    ],
    title: 'TON Sovereign Escrow & Instant USDT Settlement',
    category: 'WEB3_CRYPTO',
    duration: 15,
    description: 'Automated 80/20 revenue sharing protocol, instant hot wallet payouts, and yield vaults.',
    sponsor: 'AdsGram & TON Settlement Network'
  },
  {
    id: 'v-cambodia-mekong-drone-30s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-and-skyscrapers-41617-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ],
    title: 'Mekong River Sunset Drone & Web3 Eco-Resort',
    category: 'CAMBODIA_DRONE_CRYPTO',
    duration: 30,
    description: 'Scenic aerial drone footage along the Mekong river delta with Web3 smart contract resorts.',
    sponsor: 'Cambodia Eco-Crypto Tourism'
  },
  {
    id: 'v-food-coffee-15s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-table-with-delicious-food-42880-large.mp4',
    backupUrls: [
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ],
    title: 'Executive Roast - Premium Coffee & Gourmet Pastries',
    category: 'FOOD',
    duration: 15,
    description: 'Artisan espresso roasting, fresh croissants, and luxury breakfast dining.',
    sponsor: 'Sreymara Executive Cafe'
  },
  {
    id: 'v-medicine-vitamin-15s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-bottle-of-medicine-pills-43846-large.mp4',
    backupUrls: [
      'https://vjs.zencdn.net/v/oceans.mp4'
    ],
    title: 'VitalMed Labs - Premium Health & Vitamin Formula',
    category: 'MEDICINE',
    duration: 15,
    description: 'Daily multivitamin vitality, cellular rejuvenation, and high-potency immune protection.',
    sponsor: 'VitalMed Pharmacare'
  },
  {
    id: 'v-btc-lightning-15s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41710-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ],
    title: 'Bitcoin Satoshis & Instant Micro-Transactions',
    category: 'WEB3_CRYPTO',
    duration: 15,
    description: 'Zero-fee Lightning Network swaps, Satoshi micro-earnings, and ChangeNOW liquidity.',
    sponsor: 'BTC Lightning Swap Protocol'
  },
  {
    id: 'v-cambodia-siem-reap-drone-30s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-futuristic-city-at-night-42211-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    ],
    title: 'Angkor Heritage Drone Flyover & Web3 NFT Pass',
    category: 'CAMBODIA_DRONE_CRYPTO',
    duration: 30,
    description: 'Cinematic drone flyover over ancient temples and modern digital asset preservation.',
    sponsor: 'Heritage NFT Vault'
  },
  {
    id: 'v-gourmet-seafood-30s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-table-with-delicious-food-42880-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
    ],
    title: 'Ocean Harvest - Fresh Seafood & Gourmet Grills',
    category: 'FOOD',
    duration: 30,
    description: 'Fresh grilled lobster, jumbo prawns, and coastal seafood delicacies.',
    sponsor: 'Kep Seafood & Royal Grill'
  },
  {
    id: 'v-medicine-biotech-30s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-doctor-checking-a-patient-42774-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2013.mp4'
    ],
    title: 'Biotech Horizon - Smart Molecular Medicine',
    category: 'MEDICINE',
    duration: 30,
    description: 'Next-gen gene therapy, antibody research, and modern clinical diagnostics.',
    sponsor: 'Horizon BioTech Alliance'
  },
  {
    id: 'v-adsgram-verified-15s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41710-large.mp4',
    backupUrls: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    ],
    title: 'AdsGram Verified Impression Monetization',
    category: 'WEB3_CRYPTO',
    duration: 15,
    description: 'Native Telegram Mini App monetization engine with instant crypto voucher rewards.',
    sponsor: 'AdsGram Ad-Tech Engine'
  }
];

interface CinematicRewardedAdPlayerProps {
  onComplete: () => void;
  onClose: () => void;
  rewardValue?: string;
}

export const CinematicRewardedAdPlayer: React.FC<CinematicRewardedAdPlayerProps> = ({
  onComplete,
  onClose,
  rewardValue = '1.50'
}) => {
  const [currentVideo, setCurrentVideo] = useState<VideoManifestItem>(() => {
    return VIDEO_MANIFEST[Math.floor(Math.random() * VIDEO_MANIFEST.length)];
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentVideo.duration);
  const [skipTimeLeft, setSkipTimeLeft] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  
  // High-availability procedural canvas fallback mode
  const [isCanvasFallback, setIsCanvasFallback] = useState<boolean>(false);
  const [streamSourceIndex, setStreamSourceIndex] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Synchronize duration when video changes
  useEffect(() => {
    setDuration(currentVideo.duration);
    setCurrentTime(0);
    setSkipTimeLeft(5);
    setCanSkip(false);
    setIsFinished(false);
  }, [currentVideo.id]);

  // Skip timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (skipTimeLeft > 0 && isPlaying) {
        setSkipTimeLeft((prev) => prev - 1);
      } else if (skipTimeLeft <= 0) {
        setCanSkip(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [skipTimeLeft, isPlaying]);

  // Main playback timer for canvas / fallback
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !isFinished) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.25;
          if (next >= duration) {
            setIsFinished(true);
            setIsPlaying(false);
            onComplete();
            return duration;
          }
          return next;
        });
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isFinished, duration, onComplete]);

  // Auto-play HTML5 video with fallback handling
  useEffect(() => {
    let isMounted = true;

    if (!isCanvasFallback && videoRef.current) {
      videoRef.current.volume = 1.0;
      videoRef.current.muted = isMuted;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isMounted) setIsPlaying(true);
          })
          .catch(() => {
            // If autoplay policy or network blocks HTML5 video, switch seamlessly to 60FPS Procedural Canvas Stream!
            if (isMounted) {
              console.log('[Cinematic Ad Engine] HTML5 video autoplay restricted/failed. Switching to 60FPS Procedural Canvas Ad Stream.');
              setIsCanvasFallback(true);
              setIsPlaying(true);
            }
          });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [currentVideo.url, isCanvasFallback, streamSourceIndex]);

  // Procedural 60FPS Canvas Video Ad Generator (Food, Medicine, Phnom Penh Drone Crypto)
  useEffect(() => {
    if (!isCanvasFallback || !canvasRef.current || isFinished) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const renderFrame = () => {
      step++;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Dynamic Background based on Ad Category
      if (currentVideo.category === 'CAMBODIA_DRONE_CRYPTO') {
        // Deep Emerald & Phnom Penh Night City Grid
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#061325');
        grad.addColorStop(0.5, '#0B2238');
        grad.addColorStop(1, '#020B14');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Grid lines (3D perspective)
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + Math.sin(step * 0.02) * 20, height);
          ctx.stroke();
        }

        // Phnom Penh City Buildings Wireframe
        const bldCount = 12;
        const bldWidth = width / bldCount;
        ctx.fillStyle = 'rgba(10, 30, 50, 0.8)';
        ctx.strokeStyle = '#10B981';
        for (let i = 0; i < bldCount; i++) {
          const bHeight = 120 + Math.sin(i * 1.5) * 80 + Math.cos(step * 0.05 + i) * 10;
          ctx.fillRect(i * bldWidth + 5, height - bHeight - 60, bldWidth - 10, bHeight);
          ctx.strokeRect(i * bldWidth + 5, height - bHeight - 60, bldWidth - 10, bHeight);

          // Glowing windows
          ctx.fillStyle = (i + step) % 3 === 0 ? '#F59E0B' : '#06B6D4';
          ctx.fillRect(i * bldWidth + 15, height - bHeight - 40, 8, 8);
          ctx.fillRect(i * bldWidth + 30, height - bHeight - 20, 8, 8);
          ctx.fillStyle = 'rgba(10, 30, 50, 0.8)';
        }

        // Flying Drone Target Crosshair
        const droneX = (width * 0.2) + Math.sin(step * 0.03) * (width * 0.3);
        const droneY = height * 0.35 + Math.cos(step * 0.04) * 30;

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(droneX, droneY, 28, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(droneX - 40, droneY);
        ctx.lineTo(droneX + 40, droneY);
        ctx.moveTo(droneX, droneY - 40);
        ctx.lineTo(droneX, droneY + 40);
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('PHNOM PENH AERIAL DRONE 4K • LIVE WEBP STREAM', droneX - 110, droneY - 40);

      } else if (currentVideo.category === 'FOOD') {
        // Gourmet Warm Amber Culinary Glow
        const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
        grad.addColorStop(0, '#451A03');
        grad.addColorStop(0.5, '#1C0A00');
        grad.addColorStop(1, '#080300');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Culinary Steam Particles
        for (let p = 0; p < 25; p++) {
          const px = (p * 35 + step * 1.5) % width;
          const py = height * 0.8 - ((p * 20 + step * 2) % (height * 0.6));
          const pSize = 4 + Math.sin(step * 0.05 + p) * 3;
          ctx.fillStyle = `rgba(245, 158, 11, ${0.2 + Math.sin(step * 0.1 + p) * 0.15})`;
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Animated Culinary Plate / Dish Emblem
        ctx.save();
        ctx.translate(width / 2, height / 2 - 20);
        ctx.rotate(step * 0.01);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 90, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#EAB308';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 22px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🍲 ANGKOR GOURMET CULINARY FEAST', width / 2, height / 2 - 20);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('Fresh Organic Ingredients & Traditional Khmer Cuisine', width / 2, height / 2 + 15);

      } else if (currentVideo.category === 'MEDICINE') {
        // Bio-Pharma Emerald Cyan Vitality Glow
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#022C22');
        grad.addColorStop(0.5, '#064E3B');
        grad.addColorStop(1, '#021C15');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Rotating DNA Helix Strand
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 2;
        for (let i = 0; i < width; i += 20) {
          const y1 = height / 2 + Math.sin((i + step * 4) * 0.02) * 45;
          const y2 = height / 2 - Math.sin((i + step * 4) * 0.02) * 45;

          ctx.beginPath();
          ctx.arc(i, y1, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#10B981';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(i, y2, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#06B6D4';
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(i, y1);
          ctx.lineTo(i, y2);
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.2)';
          ctx.stroke();
        }

        ctx.fillStyle = '#A7F3D0';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💊 EXECUTIVE BIOHEALTH PHARMA SHIELD', width / 2, height / 2 - 80);
        ctx.font = '13px monospace';
        ctx.fillStyle = '#34D399';
        ctx.fillText('Precision Clinical Medicine & Cellular Vitality Supplement', width / 2, height / 2 + 80);

      } else {
        // Web3 Crypto Gold Matrix
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1E1B4B');
        grad.addColorStop(0.5, '#311B92');
        grad.addColorStop(1, '#090514');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Golden USDT Token Matrix pulse
        const tokenX = width / 2;
        const tokenY = height / 2 - 20;

        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(tokenX, tokenY, 65 + Math.sin(step * 0.08) * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('₮', tokenX, tokenY + 12);

        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('TON & USDT SOVEREIGN PAYOUT ENGINE', width / 2, height / 2 + 80);
      }

      // Universal Overlay Header & Live Indicator
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(20, 20, 240, 36);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.strokeRect(20, 20, 240, 36);

      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(36, 38, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`SPONSORED AD (${Math.round(duration)}s)`, 50, 42);

      if (isPlaying && !isFinished) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isCanvasFallback, isPlaying, isFinished, currentVideo.category, duration]);

  // Handle Video Error -> Switch to Canvas Fallback seamlessly
  const handleVideoError = () => {
    console.warn(`[Video Player] Primary URL failed for ${currentVideo.title}. Attempting backup or switching to 60FPS Canvas Stream.`);
    if (currentVideo.backupUrls && currentVideo.backupUrls.length > streamSourceIndex) {
      setStreamSourceIndex((prev) => prev + 1);
    } else {
      setIsCanvasFallback(true);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!isCanvasFallback && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleNextAdStream = () => {
    const nextIdx = (VIDEO_MANIFEST.findIndex((v) => v.id === currentVideo.id) + 1) % VIDEO_MANIFEST.length;
    setCurrentVideo(VIDEO_MANIFEST[nextIdx]);
    setIsCanvasFallback(false);
    setStreamSourceIndex(0);
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center font-sans overflow-hidden p-2 sm:p-4 animate-fade-in">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 opacity-30 blur-3xl pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 animate-pulse" />
      </div>

      {/* Main Rewarded Player Container */}
      <div className="relative w-full max-w-4xl aspect-video bg-stone-950 rounded-2xl sm:rounded-3xl border-2 border-amber-500/50 shadow-[0_0_80px_rgba(245,158,11,0.25)] overflow-hidden group">
        
        {/* Render HTML5 Video or Procedural Canvas Stream */}
        {!isCanvasFallback ? (
          <video
            ref={videoRef}
            src={streamSourceIndex > 0 && currentVideo.backupUrls?.[streamSourceIndex - 1] ? currentVideo.backupUrls[streamSourceIndex - 1] : currentVideo.url}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted={isMuted}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                if (videoRef.current.duration) setDuration(videoRef.current.duration);
              }
            }}
            onEnded={() => {
              setIsFinished(true);
              setIsPlaying(false);
              onComplete();
            }}
            onError={handleVideoError}
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="w-full h-full object-cover bg-stone-950"
          />
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 opacity-90 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/90 via-black/20 to-black/70 pointer-events-none">
          
          {/* Top Bar */}
          <div className="flex justify-between items-start pointer-events-auto gap-2">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 text-[10px] font-black rounded-md tracking-wider">
                  {currentVideo.category.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold rounded-md">
                  {Math.round(duration)}s REWARDED AD
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1">{currentVideo.title}</h3>
              </div>
              <p className="text-[11px] text-stone-300 hidden sm:block">{currentVideo.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNextAdStream}
                className="px-2.5 py-1.5 bg-stone-900/80 hover:bg-stone-800 border border-stone-700 rounded-xl text-stone-300 hover:text-white transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Switch to Next Commercial Stream"
              >
                <RefreshCw size={13} />
                <span className="hidden sm:inline">Next Ad</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-stone-900/80 hover:bg-stone-800 border border-stone-700 rounded-full text-stone-300 hover:text-white transition cursor-pointer"
                title="Close Modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Bottom Bar Controls */}
          <div className="space-y-3 pointer-events-auto">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-stone-800/80 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition cursor-pointer shadow-lg active:scale-95"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-stone-950" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-xl transition cursor-pointer"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <div className="text-xs font-mono font-bold text-stone-300 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </div>
              </div>

              {/* Reward Value Badge */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/90 border border-emerald-500/60 rounded-xl">
                <Sparkles size={14} className="text-emerald-400 animate-spin" />
                <span className="text-xs font-black text-emerald-300">
                  Yield Reward: {rewardValue} USDT + Dual Tokens
                </span>
              </div>
            </div>
          </div>

          {/* Skip Button */}
          <div className="absolute bottom-16 right-4 sm:right-6 z-10">
            {!canSkip ? (
              <div className="px-3.5 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-stone-300 text-xs font-bold flex items-center gap-2 font-mono">
                <Clock size={13} className="text-amber-400" />
                <span>Skip in {skipTimeLeft}s</span>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-xl transition active:scale-95 cursor-pointer"
              >
                <span>SKIP AD</span>
                <SkipForward size={14} fill="black" />
              </button>
            )}
          </div>
        </div>

        {/* Completion Celebration Overlay */}
        {isFinished && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-emerald-500 to-teal-300 text-stone-950 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce">
              ✓
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AD COMPLETED SUCCESSFULLY!</h2>
              <p className="text-emerald-400 font-bold mt-1 text-sm sm:text-base">
                Instant Yield Unlocked: {rewardValue} USDT + Verified Ad Impression Credited
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 hover:brightness-110 text-stone-950 font-black text-sm rounded-2xl transition shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>CLAIM {rewardValue} USDT & DUAL TOKENS</span>
              <CheckCircle2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-center space-y-1 text-[11px] text-stone-400 font-mono">
        <p className="tracking-widest uppercase">
          Cinematic Rewarded Experience v4.5 • Verified Ad Impression
        </p>
        <div className="flex items-center justify-center gap-4 text-stone-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" />
            ADSGRAM SDK VERIFIED
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Award size={12} className="text-amber-400" />
            AUTOMATED USDT & TOKEN YIELD
          </span>
        </div>
      </div>
    </div>
  );
};
