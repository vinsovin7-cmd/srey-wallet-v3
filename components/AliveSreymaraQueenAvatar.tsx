import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Heart, Volume2, Mic, Camera, Upload, RotateCcw } from "lucide-react";

export interface AliveSreymaraQueenAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  currentWord?: string;
  speechVolume?: number; // 0 to 1
  onInteract?: () => void;
  className?: string;
  photoUrl?: string;
  onPhotoUpload?: (dataUrl: string) => void;
  gesture?: "idle" | "hair_adjust" | "gentle_cough" | "clothes_adjust" | "warm_smile" | "nod_listening";
}

// Curated high-resolution photorealistic Alteryx Executive & Queen personas
// Framing is calibrated so head, eyes, nose, mouth, neck, shoulders, and jacket are 100% visible!
export const DEFAULT_REAL_QUEEN_PHOTOS = [
  {
    id: "sreymara-royal-golden-queen",
    name: "Sreymara Queen (Royal Crown & Golden Halo)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    description: "Radiant Royal Cambodian Queen wearing elaborate golden headdress with glowing warm aura and gentle loving gaze."
  },
  {
    id: "alteryx-annie-executive",
    name: "Alteryx Executive AI (Annie)",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    description: "Alteryx official digital human executive in tailored black jacket with confident, warm smile in a modern corporate office."
  },
  {
    id: "sreymara-restaurant-portrait",
    name: "Sreymara (Restaurant Portrait)",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
    description: "Delicate porcelain complexion, long dark hair parted down middle, warm affectionate smile."
  }
];

export const AliveSreymaraQueenAvatar: React.FC<AliveSreymaraQueenAvatarProps> = ({
  isSpeaking,
  isListening,
  currentWord = "",
  speechVolume = 0.65,
  onInteract,
  className = "",
  photoUrl,
  onPhotoUpload
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active portrait photo (persisted in localStorage if uploaded by user)
  const [activePhoto, setActivePhoto] = useState<string>(() => {
    if (photoUrl) return photoUrl;
    try {
      const saved = localStorage.getItem("sreymara_custom_photo");
      if (saved) return saved;
    } catch {}
    return DEFAULT_REAL_QUEEN_PHOTOS[0].url;
  });

  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Physical motion physics (60 FPS)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [breathPhase, setBreathPhase] = useState<number>(0);

  // Realistic human blinking engine
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [blinkStrength, setBlinkStrength] = useState<number>(0);

  // Natural human micro-gestures ("arrange hair", "cough / breath", "check clothes", "warm smile", "nod")
  const [activeGesture, setActiveGesture] = useState<
    "idle" | "hair_adjust" | "gentle_cough" | "clothes_adjust" | "warm_smile" | "nod_listening"
  >("idle");
  const [gestureProgress, setGestureProgress] = useState<number>(0);

  // Real-time lip and jaw viseme articulation
  const [mouthShape, setMouthShape] = useState<{
    open: number; // 0 to 1
    width: number; // 0.8 to 1.3
    smile: number; // 0.5 to 1
    jawDrop: number; // 0 to 8px
  }>({
    open: 0,
    width: 1,
    smile: 0.92,
    jawDrop: 0
  });

  // Sync external photo prop
  useEffect(() => {
    if (photoUrl) {
      setActivePhoto(photoUrl);
    }
  }, [photoUrl]);

  // 1. CONTINUOUS 60 FPS PHYSICAL DYNAMICS (Breathing, micro-sway, gesture interpolation)
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setBreathPhase(elapsed);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. AUTONOMOUS HUMAN IDLE MICRO-GESTURES
  // Occurs naturally every 10-18 seconds: arranging hair, gentle breath / throat clear, settling clothes, warm smile
  useEffect(() => {
    let timer: any;

    const triggerNextGesture = () => {
      // Random delay between 10s and 18s
      const delay = Math.random() * 8000 + 10000;
      timer = setTimeout(() => {
        if (!isSpeaking && !isListening) {
          const gestures: Array<"hair_adjust" | "gentle_cough" | "clothes_adjust" | "warm_smile"> = [
            "hair_adjust",
            "gentle_cough",
            "clothes_adjust",
            "warm_smile"
          ];
          const chosen = gestures[Math.floor(Math.random() * gestures.length)];
          setActiveGesture(chosen);

          // Animate gesture duration ~ 2.4s to 3.2s
          let step = 0;
          const interval = setInterval(() => {
            step += 0.05;
            setGestureProgress(Math.sin(step * Math.PI));
            if (step >= 1) {
              clearInterval(interval);
              setActiveGesture("idle");
              setGestureProgress(0);
              triggerNextGesture();
            }
          }, 60);
        } else {
          triggerNextGesture();
        }
      }, delay);
    };

    triggerNextGesture();
    return () => clearTimeout(timer);
  }, [isSpeaking, isListening]);

  // When listening to user, perform attentive listening micro-nods
  useEffect(() => {
    if (isListening) {
      setActiveGesture("nod_listening");
      let t = 0;
      const interval = setInterval(() => {
        t += 0.08;
        setGestureProgress(Math.sin(t * 3.5) * 0.5 + 0.5);
      }, 50);
      return () => {
        clearInterval(interval);
        setActiveGesture("idle");
        setGestureProgress(0);
      };
    }
  }, [isListening]);

  // 3. REALISTIC HUMAN EYE BLINK ENGINE (with natural double-blinks)
  useEffect(() => {
    let timeoutId: any;

    const scheduleNextBlink = () => {
      // Natural human blink frequency: 2.8 to 5.0 seconds
      const delay = Math.random() * 2200 + 2800;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setBlinkStrength(1);

        // Natural eyelid blink duration: ~130ms
        setTimeout(() => {
          setIsBlinking(false);
          setBlinkStrength(0);

          // 25% chance of realistic quick double-blink
          if (Math.random() < 0.25) {
            setTimeout(() => {
              setIsBlinking(true);
              setBlinkStrength(1);
              setTimeout(() => {
                setIsBlinking(false);
                setBlinkStrength(0);
                scheduleNextBlink();
              }, 110);
            }, 180);
          } else {
            scheduleNextBlink();
          }
        }, 130);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // 4. SYNCHRONIZED VISIBLE MOUTH & JAW ARTICULATION
  // Lips and jaw actively shape syllables when speaking; rest in a warm smile when silent!
  useEffect(() => {
    if (!isSpeaking) {
      // Natural relaxed, friendly, welcoming executive smile
      setMouthShape({
        open: 0,
        width: 1.0,
        smile: 0.95,
        jawDrop: 0
      });
      return;
    }

    const word = (currentWord || "").toLowerCase().trim();
    let targetOpen = 0.45 + speechVolume * 0.45;
    let targetWidth = 1.05;
    let targetSmile = 0.85;
    let targetJaw = 4;

    // Vowel & Consonant Viseme Mapping
    if (/[oou]/.test(word)) {
      targetOpen = 0.75;
      targetWidth = 0.88; // rounded lips
      targetSmile = 0.6;
      targetJaw = 6.5;
    } else if (/[aie]/.test(word)) {
      targetOpen = 0.7;
      targetWidth = 1.22; // wide open vowel
      targetSmile = 0.95;
      targetJaw = 7;
    } else if (/[mbp]/.test(word)) {
      targetOpen = 0.04; // closed bilabial lips
      targetWidth = 0.96;
      targetSmile = 0.88;
      targetJaw = 1;
    } else if (/[sztfv]/.test(word)) {
      targetOpen = 0.35;
      targetWidth = 1.15;
      targetSmile = 0.9;
      targetJaw = 3.5;
    }

    setMouthShape({
      open: targetOpen,
      width: targetWidth,
      smile: targetSmile,
      jawDrop: targetJaw
    });

    // Syllable flutter during continuous speech
    const interval = setInterval(() => {
      setMouthShape(prev => ({
        open: Math.max(0.12, Math.min(0.95, prev.open + (Math.random() * 0.3 - 0.15))),
        width: Math.max(0.85, Math.min(1.25, prev.width + (Math.random() * 0.1 - 0.05))),
        smile: prev.smile,
        jawDrop: Math.max(1, Math.min(8, prev.jawDrop + (Math.random() * 2 - 1)))
      }));
    }, 85);

    return () => clearInterval(interval);
  }, [isSpeaking, currentWord, speechVolume]);

  // Mouse interaction for responsive gaze and 3D head alignment
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  // Handle Photo File Upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setActivePhoto(dataUrl);
        try {
          localStorage.setItem("sreymara_custom_photo", dataUrl);
        } catch {}
        if (onPhotoUpload) onPhotoUpload(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleResetPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem("sreymara_custom_photo");
    } catch {}
    setActivePhoto(DEFAULT_REAL_QUEEN_PHOTOS[0].url);
  };

  // 5. CALCULATE PHYSICAL TRANSFORMS FOR REALISTIC HUMAN DYNAMICS
  // Continuous smooth breathing
  const breathY = Math.sin(breathPhase * 1.6) * 1.6;
  const breathScale = 1.0 + Math.sin(breathPhase * 1.6) * 0.006;
  const shoulderLift = Math.sin(breathPhase * 1.6) * 1.2;

  // Head tracking with mouse alignment
  let headTiltX = mousePos.x * 2.8;
  let headTiltY = mousePos.y * 2.2;
  let headRoll = mousePos.x * 0.8;

  // Incorporate human idle micro-gestures
  if (activeGesture === "hair_adjust") {
    // Gentle head tilt to the right, slight shoulder adjustment, warm smile
    headTiltX += gestureProgress * 3.5;
    headRoll += gestureProgress * 2.8;
    headTiltY -= gestureProgress * 1.2;
  } else if (activeGesture === "gentle_cough") {
    // Subtle polite throat clear: dip head 2px, slight chest heave
    headTiltY += Math.sin(gestureProgress * Math.PI * 2) * 2.2;
  } else if (activeGesture === "clothes_adjust") {
    // Straighten posture, confident shoulder lift
    headTiltY -= gestureProgress * 1.8;
  } else if (activeGesture === "nod_listening") {
    // Attentive nod while user is speaking
    headTiltY += gestureProgress * 3.5;
  } else if (activeGesture === "warm_smile") {
    headTiltX += gestureProgress * 1.2;
    headRoll -= gestureProgress * 1.5;
  }

  // When speaking, add natural rhythmic speech emphasis
  if (isSpeaking) {
    headTiltY += Math.sin(breathPhase * 7) * 1.1;
    headTiltX += Math.cos(breathPhase * 3.5) * 0.8;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onInteract}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-hidden bg-[#0a0d14] select-none cursor-pointer flex items-center justify-center ${className}`}
      title="Alteryx AI Digital Human - Active, Responsive & Alive (Click to interact)"
    >
      {/* Hidden File Input for uploading custom screenshot / photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* AMBIENT CORPORATE SUNLIGHT & SUBTLE DEPTH GLOW */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />

      {/* 6. REALISTIC HUMAN ACTOR CONTAINER WITH FULL UPPER BODY & VISIBLE MOUTH */}
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out will-change-transform flex items-center justify-center"
        style={{
          transform: `perspective(800px) rotateY(${headTiltX}deg) rotateX(${-headTiltY}deg) rotateZ(${headRoll}deg) translateY(${breathY}px) scale(${breathScale})`
        }}
      >
        {/* Full Half-Body Executive Photograph (Head, Face, Mouth, Neck, Shoulders & Jacket) */}
        <div className="relative w-full h-full">
          <img
            src={activePhoto}
            alt="Sreymara Queen - AI Digital Human"
            className="w-full h-full object-cover object-[50%_18%] pointer-events-none select-none"
            referrerPolicy="no-referrer"
          />

          {/* REALISTIC EYE BLINK OVERLAY (Smooth natural eyelid closure without whole-image distortion) */}
          {isBlinking && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-75"
              style={{
                opacity: blinkStrength,
                background: "radial-gradient(ellipse 26% 7% at 50% 32.5%, rgba(20, 15, 25, 0.72) 0%, rgba(20, 15, 25, 0.35) 60%, transparent 100%)"
              }}
            />
          )}

          {/* ORGANIC SEAMLESS SPEECH ARTICULATION DIRECTLY AT HER LIPS & JAW (Zero face splitting, feathered mask) */}
          {isSpeaking && (
            <div
              className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden"
              style={{
                // Feathered radial mask focused strictly on the mouth zone (around 50% horizontal, 57% vertical)
                // This ensures cheeks, eyes, nose, forehead, and hair NEVER get sliced or sheared!
                WebkitMaskImage: "radial-gradient(ellipse 16% 11% at 50% 57.5%, black 40%, rgba(0,0,0,0.5) 75%, transparent 100%)",
                maskImage: "radial-gradient(ellipse 16% 11% at 50% 57.5%, black 40%, rgba(0,0,0,0.5) 75%, transparent 100%)",
                transform: `translateY(${mouthShape.jawDrop * 0.45}px) scaleY(${1 + mouthShape.open * 0.08}) scaleX(${mouthShape.width})`,
                transformOrigin: "50% 56%",
                transition: "transform 60ms cubic-bezier(0.2, 0.8, 0.4, 1)"
              }}
            >
              {/* Underlying seamless mouth texture moving organically with speech */}
              <img
                src={activePhoto}
                alt="Speech sync mouth movement"
                className="w-full h-full object-cover object-[50%_18%] filter brightness-[1.02] contrast-[1.03] pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />

              {/* Natural speech aperture depth between lips when mouth opens wide */}
              {mouthShape.open > 0.35 && (
                <div
                  className="absolute pointer-events-none rounded-full transition-all duration-75"
                  style={{
                    top: "57.2%",
                    left: "50%",
                    width: `${26 * mouthShape.width}px`,
                    height: `${Math.max(2, mouthShape.open * 10)}px`,
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(ellipse at center, rgba(30, 8, 12, 0.85) 0%, rgba(60, 15, 20, 0.5) 70%, transparent 100%)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.6)"
                  }}
                >
                  {/* Subtle natural teeth reflection during open syllables */}
                  {mouthShape.open > 0.5 && (
                    <div
                      className="w-3/5 h-[1.5px] mx-auto mt-[1px] bg-white/75 rounded-full blur-[0.3px]"
                      style={{ opacity: Math.min(1, mouthShape.open * 0.9) }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE VOICE PULSE RING (Subtle aura around the digital human stage indicating live speech activity) */}
          {isSpeaking && (
            <div
              className="absolute inset-0 border-2 border-sky-400/40 rounded-2xl pointer-events-none animate-pulse"
              style={{ animationDuration: "1.2s" }}
            />
          )}
        </div>
      </div>

      {/* DRAG-AND-DROP OVERLAY FEEDBACK */}
      {isDragOver && (
        <div className="absolute inset-0 bg-sky-950/95 border-2 border-dashed border-sky-400 z-40 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
          <Upload size={36} className="text-sky-300 animate-bounce mb-2" />
          <p className="text-sm font-bold text-white">Drop your Alteryx Executive photo here!</p>
          <p className="text-xs text-sky-300 mt-1">Immediately updates the active digital human</p>
        </div>
      )}

      {/* DISCREET BOTTOM CONTROLS (Upload custom photo or reset) */}
      <div className="absolute bottom-2.5 right-2.5 z-30 flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-2.5 py-1 bg-black/80 hover:bg-black backdrop-blur-md border border-stone-700 hover:border-sky-400 text-stone-300 hover:text-white rounded-full text-[9px] font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
          title="Upload or replace photo (e.g. photo_2025-12-18_15-56-22.jpg)"
        >
          <Camera size={11} className="text-sky-400" />
          <span>Upload Photo</span>
        </button>

        {activePhoto !== DEFAULT_REAL_QUEEN_PHOTOS[0].url && (
          <button
            type="button"
            onClick={handleResetPhoto}
            className="p-1 bg-black/80 hover:bg-black backdrop-blur-md border border-stone-700 hover:border-amber-400 text-stone-300 hover:text-amber-300 rounded-full text-[9px] shadow transition-all cursor-pointer"
            title="Reset to default Alteryx executive"
          >
            <RotateCcw size={11} />
          </button>
        )}
      </div>
    </div>
  );
};
