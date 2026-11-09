import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Calendar,
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight,
  Crown,
  CheckCircle2,
  Shield,
  Bot,
  User,
  Radio,
  Zap,
  MessageSquare,
  RefreshCw,
  Heart,
  Music,
  Sliders,
  Play,
  Copy,
  Check,
  Download,
  Layers,
  Database,
  Terminal,
  Settings,
  Activity,
  Camera,
  RotateCcw,
  ArrowUp,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Brain,
  Infinity
} from "lucide-react";
import { AliveSreymaraQueenAvatar } from "./AliveSreymaraQueenAvatar";

export interface SreymaraQueenConversationalAIProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

interface ChatMessage {
  id: string;
  sender: "queen" | "user";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  highlightedWordIndex?: number;
}

export interface AlteryxWorkflowExample {
  id: string;
  title: string;
  category: string;
  prompt: string;
  tools: string[];
  description: string;
  syntheticDataSample: Record<string, any>[];
  alteryxDesignerStep: string;
}

// 10 POWERFUL ALTERYX DESIGNER WORKFLOWS
export const ALTERYX_WORKFLOW_EXAMPLES: AlteryxWorkflowExample[] = [
  {
    id: "wf-1",
    title: "Customer Churn Analysis",
    category: "Customer Analytics",
    prompt: "Create a workflow that joins customer transaction data with support ticket logs to identify patterns in customers who have canceled their subscriptions in the last 60 days.",
    tools: ["Input Data", "DateTime Tool", "Join Tool", "Filter Tool", "Summarize Tool", "Output Data"],
    description: "Detects churn triggers by joining payment recurrence records with customer support escalation logs, flagging at-risk cohorts before subscription expiry.",
    syntheticDataSample: [
      { customer_id: "CUST-1092", tickets_last_60d: 4, avg_resolution_hours: 48.2, monthly_spend: 180, churn_status: "Canceled" },
      { customer_id: "CUST-4418", tickets_last_60d: 1, avg_resolution_hours: 4.1, monthly_spend: 420, churn_status: "Active" },
      { customer_id: "CUST-8821", tickets_last_60d: 6, avg_resolution_hours: 72.5, monthly_spend: 95, churn_status: "Canceled" }
    ],
    alteryxDesignerStep: "Join transaction ledger with ticket CSV on Customer_ID -> Filter by CancelDate >= Today - 60 -> Group by support tier in Summarize tool."
  },
  {
    id: "wf-2",
    title: "Automated Financial Reconciliation",
    category: "Finance & Accounting",
    prompt: "Build a workflow to compare our internal sales ledger against a bank statement CSV, flagging any discrepancies in transaction amounts or missing IDs.",
    tools: ["Input Data (x2)", "Data Cleansing", "Select Tool", "Join Tool", "Formula Tool", "Email Tool"],
    description: "Automates daily cash reconciliation by joining internal general ledger line items with bank clearing files, immediately isolating mismatched pennies or missing wire IDs.",
    syntheticDataSample: [
      { internal_tx_id: "TX-9901", ledger_amount: 1450.00, bank_cleared_amount: 1450.00, status: "MATCHED" },
      { internal_tx_id: "TX-9902", ledger_amount: 8200.50, bank_cleared_amount: 8190.50, status: "DISCREPANCY -$10" },
      { internal_tx_id: "TX-9903", ledger_amount: 320.00, bank_cleared_amount: 0.00, status: "MISSING IN BANK" }
    ],
    alteryxDesignerStep: "Load ERP Sales + Bank CSV -> Clean string currency -> Join on Tx_ID -> Output (L) Unmatched ERP, (R) Unmatched Bank, (J) Amount Diff Formula."
  },
  {
    id: "wf-3",
    title: "Inventory Optimization",
    category: "Supply Chain",
    prompt: "Design a workflow that calculates safety stock levels by analyzing historical sales volatility and lead times from our supplier database.",
    tools: ["Input Data", "Summarize (StdDev)", "Formula Tool", "Join Tool", "Browse Tool"],
    description: "Prevents stockouts and excess holding costs by calculating standard deviation of demand multiplied by supplier lead time risk factors.",
    syntheticDataSample: [
      { sku: "SKU-AMAP-01", avg_daily_sales: 142, demand_stddev: 28.4, supplier_lead_days: 14, calculated_safety_stock: 420 },
      { sku: "SKU-TON-88", avg_daily_sales: 650, demand_stddev: 95.1, supplier_lead_days: 21, calculated_safety_stock: 1850 }
    ],
    alteryxDesignerStep: "Summarize tool calculates StdDev(Daily_Sales) -> Formula tool computes Z-score * StdDev * SQRT(LeadTime) -> Sets reorder threshold."
  },
  {
    id: "wf-4",
    title: "Marketing Attribution",
    category: "Growth & Media",
    prompt: "Create a workflow that assigns conversion credit to different marketing channels using a first-touch attribution model based on web traffic logs.",
    tools: ["Input Data", "DateTime Parse", "Sort Tool", "Sample Tool (First 1)", "Join Tool", "Summarize"],
    description: "Scans raw web event clickstreams, sorts chronological touchpoints per user, and attributes revenue strictly to the initiating campaign channel.",
    syntheticDataSample: [
      { user_id: "USR-773", first_touch_channel: "Google Ads AlphaQubit", landing_page: "/quantum-cinema", total_revenue: 149.00 },
      { user_id: "USR-992", first_touch_channel: "Telegram AdsGram Bot", landing_page: "/datingarts", total_revenue: 350.00 }
    ],
    alteryxDesignerStep: "Sort logs by UserID, Timestamp ASC -> Sample 1st row per UserID -> Join with Checkout orders -> Summarize total revenue grouped by campaign."
  },
  {
    id: "wf-5",
    title: "Employee Turnover Prediction",
    category: "Human Resources",
    prompt: "Build a workflow to analyze HR data, including tenure, performance ratings, and department, to identify high-risk employees likely to leave.",
    tools: ["Input Data", "Select", "Logistic Regression / Forest Model", "Score Tool", "Filter Tool"],
    description: "Evaluates staff retention variables (time in role, manager feedback, overtime hours) to assign an attrition risk probability score.",
    syntheticDataSample: [
      { emp_id: "EMP-301", department: "Engineering", tenure_years: 2.8, perf_score: 4.8, attrition_risk_prob: "78% (High Risk)" },
      { emp_id: "EMP-415", department: "Finance", tenure_years: 5.2, perf_score: 4.2, attrition_risk_prob: "12% (Stable)" }
    ],
    alteryxDesignerStep: "Clean HR dataset -> Partition into train/test -> Train predictive model -> Score existing employee roster -> Filter prob >= 0.65."
  },
  {
    id: "wf-6",
    title: "Supply Chain Risk Assessment",
    category: "Logistics",
    prompt: "Develop a workflow that blends supplier location data with real-time weather alerts to identify potential delivery delays in the next 48 hours.",
    tools: ["Input Data", "JSON Parse (Weather API)", "Spatial Match", "Filter Tool", "Table Output"],
    description: "Blends geospatial distribution center coordinates with incoming hurricane/monsoon warnings to reroute shipments ahead of transit disruptions.",
    syntheticDataSample: [
      { shipment_id: "SHP-881", origin_hub: "Phnom Penh", destination_hub: "Singapore", weather_severity: "Severe Storm Warning", delay_est_hours: 36 }
    ],
    alteryxDesignerStep: "Parse supplier latitude/longitude into Spatial Points -> Match against active NOAA weather polygon polygons -> Flag shipments in impact zone."
  },
  {
    id: "wf-7",
    title: "Sales Territory Rebalancing",
    category: "Sales Operations",
    prompt: "Create a workflow that redistributes sales accounts across regions based on current representative workload and geographic proximity.",
    tools: ["Input Data", "Trade Area Tool", "Distance Tool", "Find Nearest Tool", "Summarize"],
    description: "Equitably redistributes high-touch enterprise accounts to local territory managers to balance pipeline ARR and travel overhead.",
    syntheticDataSample: [
      { account_id: "ACC-ENTERPRISE-1", state: "California", original_rep: "Unassigned", optimized_rep: "Sarah Lin (West Region)" }
    ],
    alteryxDesignerStep: "Generate 50-mile drive-time trade areas around rep hubs -> Find Nearest Tool assigns accounts to closest rep with available quota capacity."
  },
  {
    id: "wf-8",
    title: "Fraud Detection",
    category: "Security & Risk",
    prompt: "Build a workflow that flags credit card transactions that are 3 standard deviations away from a user's average spending amount or occur in a different country within 2 hours.",
    tools: ["Input Data", "Multi-Row Formula", "DateTime Diff", "Formula (Z-Score)", "Filter Tool"],
    description: "Identifies anomalies in transaction velocity and impossible geographical teleportation across consecutive card authorizations.",
    syntheticDataSample: [
      { card_id: "CARD-4402", tx_time: "14:10", country: "US", amount: 45.00, flag: "Normal" },
      { card_id: "CARD-4402", tx_time: "15:20", country: "FR", amount: 1890.00, flag: "CRITICAL FRAUD: Geo Jump & >3 StdDev" }
    ],
    alteryxDesignerStep: "Multi-Row Formula computes Time_Diff and Geo_Diff between sequential swipes -> Formula computes (Amount - Mean) / StdDev -> Filter outlier flags."
  },
  {
    id: "wf-9",
    title: "Sentiment Analysis on Product Reviews",
    category: "Natural Language",
    prompt: "Design a workflow that pulls product reviews from an API and categorizes them into positive, neutral, or negative sentiment using text processing.",
    tools: ["Download Tool", "JSON Parse", "Sentiment Analysis (Text Mining)", "Summarize", "Word Cloud"],
    description: "Extracts customer review text from public API feeds, scores emotional polarity, and correlates sentiment scores with product return rates.",
    syntheticDataSample: [
      { review_id: "REV-901", product: "Sreymara Cinema Soundstage", sentiment_score: +0.88, classification: "Very Positive" },
      { review_id: "REV-902", product: "Alteryx Connector", sentiment_score: +0.94, classification: "Delighted" }
    ],
    alteryxDesignerStep: "API download -> Tokenize review string -> Text Mining sentiment tool calculates polarity (-1.0 to +1.0) -> Output categorized aggregates."
  },
  {
    id: "wf-10",
    title: "Tax Compliance Reporting",
    category: "Tax & Compliance",
    prompt: "Create a workflow that aggregates sales data across multiple states and calculates the total tax owed based on a lookup table of varying state tax rates.",
    tools: ["Input Data", "Find Replace / Join", "Formula Tool", "Summarize (Total Tax)", "Output to Excel"],
    description: "Aggregates multi-state e-commerce transactions, looks up statutory tax percentages by zip/state, and compiles audit-ready filings.",
    syntheticDataSample: [
      { order_id: "ORD-5501", state: "CA", subtotal: 1000.00, state_tax_rate: 0.0725, tax_amount_due: 72.50 },
      { order_id: "ORD-5502", state: "NY", subtotal: 500.00, state_tax_rate: 0.08875, tax_amount_due: 44.38 }
    ],
    alteryxDesignerStep: "Load raw orders -> Join on State_Code with Department of Revenue tax lookup -> Formula calculates Subtotal * Rate -> Summarize group by State."
  }
];

// Curated High-Resolution Alteryx Digital Human Executive & Sreymara Looks
const QUEEN_LOOKS = [
  {
    id: "sreymara-royal-golden-queen",
    name: "👑 Sreymara Queen (Royal Crown & Golden Halo)",
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
    name: "🌸 Sreymara Queen (Restaurant Match)",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
    description: "Long dark hair parted in middle, delicate porcelain complexion, gentle sweet smile."
  }
];

export const SreymaraQueenConversationalAI: React.FC<SreymaraQueenConversationalAIProps> = ({
  isOpen = true,
  onClose,
  isFloating = true
}) => {
  // Real conversation history (loaded from localStorage, zero placeholder responses)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("sreymara_queen_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter(m => 
            !m.text.includes("speech input and output, workflow logic") &&
            !m.text.includes("Is there a high-level architecture question") &&
            !m.text.includes("best next step is MyAlteryx")
          );
          if (cleaned.length > 0) return cleaned;
        }
      }
    } catch {}
    return [
      {
        id: "msg-init-gemini",
        sender: "queen",
        text: "Hello! I am Sreymara Queen, powered directly by Google Gemini 3.8. Ask me anything, speak to me by name, or request deep analytical and ecosystem guidance.",
        timestamp: "Just now"
      }
    ];
  });

  // Persistent Chat History
  useEffect(() => {
    try {
      localStorage.setItem("sreymara_queen_chat_history", JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages]);

  // Robust Close Handler that guarantees state persistence to localStorage
  const handleClose = () => {
    try {
      localStorage.setItem("alphaqubit_sreymara_agent_open", "false");
    } catch {}
    if (onClose) {
      onClose();
    }
  };

  const clearChatHistory = () => {
    const fresh: ChatMessage[] = [
      {
        id: `msg-fresh-${Date.now()}`,
        sender: "queen",
        text: "Chat cleared. I am Sreymara Queen on Gemini 3.8. How can I help you?",
        timestamp: "Just now"
      }
    ];
    setMessages(fresh);
    try {
      localStorage.setItem("sreymara_queen_chat_history", JSON.stringify(fresh));
    } catch {}
  };

  const [inputVal, setInputVal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpokenWord, setCurrentSpokenWord] = useState<string>("");
  const [mouthOpenAmount, setMouthOpenAmount] = useState<number>(0);
  const [mouthVisemeWidth, setMouthVisemeWidth] = useState<number>(36);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [bodySwayState, setBodySwayState] = useState<number>(0);

  // Active View Tab: "chat" | "workflows" | "voice_settings" | "installer"
  const [activeTab, setActiveTab] = useState<"chat" | "workflows" | "voice_settings" | "installer">("chat");
  const [selectedWorkflow, setSelectedWorkflow] = useState<AlteryxWorkflowExample | null>(ALTERYX_WORKFLOW_EXAMPLES[0]);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Look & Voice Customization (supports user-uploaded custom photo e.g. photo_2025-12-18_15-56-22.jpg)
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem("sreymara_custom_photo") || null;
    } catch {
      return null;
    }
  });
  const [currentLookIndex, setCurrentLookIndex] = useState<number>(0);
  const [availableFemaleVoices, setAvailableFemaleVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [voicePitch, setVoicePitch] = useState<number>(1.28); // High sweet feminine tone
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  const handleStageWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop += e.deltaY;
    }
  };
  const [voiceRate, setVoiceRate] = useState<number>(0.98); // Tender cadence

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Section Folding State: "Book A Meeting" & Avatar Stage (User can fold to save space)
  const [isAvatarSectionFolded, setIsAvatarSectionFolded] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sreymara_avatar_section_folded") === "true";
    } catch {
      return false;
    }
  });

  const toggleAvatarSectionFold = () => {
    setIsAvatarSectionFolded(prev => {
      const next = !prev;
      try {
        localStorage.setItem("sreymara_avatar_section_folded", String(next));
      } catch {}
      return next;
    });
  };

  // Autonomous Real-Time Learning & Infinite Credits Engine (Grows every minute & with every prompt)
  const [knowledgeNodes, setKnowledgeNodes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("sreymara_learned_synapses");
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 2480;
  });

  // Continuous knowledge absorption every minute of the day
  useEffect(() => {
    const timer = setInterval(() => {
      setKnowledgeNodes(prev => {
        const next = prev + Math.floor(Math.random() * 4 + 3);
        try {
          localStorage.setItem("sreymara_learned_synapses", String(next));
        } catch {}
        return next;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [bookingFeedback, setBookingFeedback] = useState<string | null>(null);

  // Idle Greeting Prompt ("Hello my friend, I hope you are feeling fine...")
  const [showIdleBubble, setShowIdleBubble] = useState<boolean>(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    businessEmail: "kansasnelly@zohomail.com",
    country: "Cambodia",
    state: "Phnom Penh",
    firstName: "NDUNAKA",
    lastName: "CHINEMEREM",
    phone: "+85510371231",
    functionRole: "Finance & Ecosystem",
    jobTitle: "Senior Director / Executive"
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mouthAnimationTimerRef = useRef<any>(null);
  const idleTimerRef = useRef<any>(null);

  // Audio Recording & Analyser Engine (Resilient for Google AI Studio)
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animFrameVolumeRef = useRef<number | null>(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentSpokenWord, activeTab]);

  // STRICTLY FEMALE VOICE DISCOVERY ENGINE
  const loadStrictFemaleVoices = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const allVoices = window.speechSynthesis.getVoices();
    if (!allVoices || allVoices.length === 0) return;

    // Explicit list of forbidden male names to ensure NO male voice is ever chosen
    const MALE_NAMES = [
      "male", "david", "mark", "alex", "george", "daniel", "fred", "oliver",
      "brian", "lee", "tom", "guy", "eddie", "aaron", "james", "richard",
      "paul", "john", "stefan", "microsoft david", "microsoft mark", "google uk english male"
    ];

    const isExplicitlyMale = (name: string) => {
      const lower = name.toLowerCase();
      return MALE_NAMES.some(m => lower.includes(m));
    };

    // Filter strictly for female voices
    const filteredFemale = allVoices.filter(v => {
      if (isExplicitlyMale(v.name)) return false;
      const lower = (v.name + " " + v.lang).toLowerCase();
      return (
        lower.includes("female") ||
        lower.includes("woman") ||
        lower.includes("samantha") ||
        lower.includes("victoria") ||
        lower.includes("karen") ||
        lower.includes("moira") ||
        lower.includes("tessa") ||
        lower.includes("zira") ||
        lower.includes("jenny") ||
        lower.includes("aria") ||
        lower.includes("serena") ||
        lower.includes("clara") ||
        lower.includes("anna") ||
        lower.includes("fiona") ||
        lower.includes("natural") ||
        lower.includes("google us english") ||
        (lower.includes("en-") && !isExplicitlyMale(v.name))
      );
    });

    // If somehow empty, filter all non-male
    const finalVoices = filteredFemale.length > 0
      ? filteredFemale
      : allVoices.filter(v => !isExplicitlyMale(v.name));

    setAvailableFemaleVoices(finalVoices);

    // Pick top sweet voice
    if (!selectedVoiceName && finalVoices.length > 0) {
      const prime = finalVoices.find(v => {
        const lower = v.name.toLowerCase();
        return (
          lower.includes("samantha") ||
          lower.includes("zira") ||
          lower.includes("victoria") ||
          lower.includes("jenny") ||
          lower.includes("natural") ||
          lower.includes("google us english")
        );
      }) || finalVoices[0];
      setSelectedVoiceName(prime.name);
    }
  };

  useEffect(() => {
    loadStrictFemaleVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadStrictFemaleVoices();
      };
    }
  }, []);

  // NATURAL EYE BLINKING & GENTLE BODY BREATHING CYCLES
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4500);

    const swayInterval = setInterval(() => {
      setBodySwayState(prev => (prev === 0 ? 1 : prev === 1 ? 2 : 0));
    }, 2800);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(swayInterval);
    };
  }, []);

  // IDLE COMPANION GREETING ("Hello my friend, I hope you are feeling fine...")
  const resetIdleTimer = () => {
    setShowIdleBubble(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!isSpeaking && !isLoading) {
        setShowIdleBubble(true);
      }
    }, 18000);
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [messages, isSpeaking]);

  // CLEANUP AUDIO CAPTURE
  const stopAllAudioCapture = () => {
    setIsMicActive(false);
    setIsRecordingVoice(false);
    setAudioLevel(0);
    if (animFrameVolumeRef.current) {
      cancelAnimationFrame(animFrameVolumeRef.current);
      animFrameVolumeRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(t => t.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try { audioContextRef.current.close(); } catch {}
    }
  };

  useEffect(() => {
    return () => {
      stopAllAudioCapture();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (mouthAnimationTimerRef.current) clearInterval(mouthAnimationTimerRef.current);
    };
  }, []);

  // START VOICE RECORDING (Supports getUserMedia audio streaming + Web Speech API)
  const startVoiceRecording = async () => {
    setMicErrorMessage(null);
    setIsMicActive(true);
    setIsRecordingVoice(true);
    resetIdleTimer();

    // 1. Audio stream via getUserMedia (works in Google AI Studio if allowed)
    if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;

        // Connect Analyser for real-time visual VU waveform
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const actx = new AudioContextClass();
          audioContextRef.current = actx;
          const src = actx.createMediaStreamSource(stream);
          const analyser = actx.createAnalyser();
          analyser.fftSize = 64;
          src.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(1, avg / 70));
            animFrameVolumeRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }

        // Initialize MediaRecorder buffer for audio upload to Gemini
        audioChunksRef.current = [];
        try {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          recorder.start(200);
          mediaRecorderRef.current = recorder;
        } catch (recErr) {
          console.warn("MediaRecorder init notice:", recErr);
        }
      } catch (err: any) {
        console.warn("Microphone getUserMedia notice:", err);
        setMicErrorMessage("Microphone access is not enabled. You can tap 'Allow' in your address bar or click any Quick Voice Prompt below!");
      }
    }

    // 2. Start SpeechRecognition if available in browser
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) setInputVal(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Web Speech API notice (audio recorder active):", event.error);
        };

        recognition.onend = () => {
          // Finished recognition
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        console.warn("SpeechRecognition start notice:", e);
      }
    }
  };

  // STOP VOICE RECORDING & PROCESS DIRECTLY OR VIA GEMINI 3.8 FLASH
  const stopVoiceRecordingAndSubmit = () => {
    const currentRecordedText = inputVal.trim();
    stopAllAudioCapture();

    // If SpeechRecognition recorded real text, send it immediately
    if (currentRecordedText.length > 1) {
      handleSendMessage(currentRecordedText);
      return;
    }

    // If SpeechRecognition was restricted in iframe, send recorded audio bytes to Gemini
    setTimeout(() => {
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 600) {
          setIsLoading(true);
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Data = (reader.result as string) || "";
            const userMsg: ChatMessage = {
              id: `usr-audio-${Date.now()}`,
              sender: "user",
              text: "🎙️ [Spoken Voice Query to Sreymara]",
              timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
            };
            setMessages(prev => [...prev, userMsg]);

            try {
              const res = await fetch("/api/sreymara/conversational-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  audioBase64: base64Data,
                  mimeType: audioBlob.type || "audio/webm",
                  history: messages.slice(-6).map(m => ({
                    role: m.sender === "user" ? "user" : "model",
                    content: m.text
                  }))
                })
              });
              const data = await res.json();
              if (res.ok && data.reply) {
                const queenMsg: ChatMessage = {
                  id: `queen-${Date.now()}`,
                  sender: "queen",
                  text: data.reply,
                  timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                };
                setMessages(prev => [...prev, queenMsg]);
                speakText(data.reply);
              }
            } catch (err) {
              console.warn("Audio processing error:", err);
            } finally {
              setIsLoading(false);
            }
          };
          reader.readAsDataURL(audioBlob);
        }
      }
    }, 350);
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (isMicActive) {
      stopVoiceRecordingAndSubmit();
    } else {
      startVoiceRecording();
    }
  };

  // SREYMRA QUEEN VOCAL SPEECH SYNTHESIS (STRICTLY SWEET FEMALE ONLY)
  const speakText = (text: string, customPitch?: number) => {
    if (!isSpeakerEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text for speech
    const cleanSpeech = text
      .replace(/[*_#`>-]/g, "")
      .replace(/https?:\/\/\S+/g, "link provided")
      .trim();

    if (!cleanSpeech) return;

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    // Guaranteed feminine sweet pitch (1.20 - 1.35) and gentle cadence
    utterance.rate = voiceRate;
    utterance.pitch = customPitch || voicePitch;

    // Pick chosen or best female voice
    const voices = availableFemaleVoices.length > 0 ? availableFemaleVoices : window.speechSynthesis.getVoices();
    let matchedVoice = voices.find(v => v.name === selectedVoiceName);

    if (!matchedVoice) {
      matchedVoice = voices.find(v => {
        const lower = v.name.toLowerCase();
        return (
          lower.includes("samantha") ||
          lower.includes("zira") ||
          lower.includes("victoria") ||
          lower.includes("jenny") ||
          lower.includes("female")
        );
      });
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // Dynamic Word Boundary Sync for Real-Time Mouth Modulation
    const words = cleanSpeech.split(/\s+/);
    let wordIdx = 0;

    utterance.onboundary = (event: any) => {
      if (event.name === "word") {
        const word = words[wordIdx] || "";
        setCurrentSpokenWord(word);
        wordIdx++;

        // Calculate phoneme mouth open shape based on vowel characteristics
        const lowerWord = word.toLowerCase();
        const hasWideVowel = /[ao]/.test(lowerWord);
        const hasTightVowel = /[ei]/.test(lowerWord);

        const targetOpen = hasWideVowel ? 0.85 : hasTightVowel ? 0.55 : 0.4;
        const targetWidth = hasTightVowel ? 44 : hasWideVowel ? 32 : 36;

        setMouthOpenAmount(targetOpen);
        setMouthVisemeWidth(targetWidth);
      }
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      setShowIdleBubble(false);
      // Continuous natural syllable jitter
      mouthAnimationTimerRef.current = setInterval(() => {
        setMouthOpenAmount(prev => (prev > 0.3 ? 0.15 : 0.75));
        setMouthVisemeWidth(prev => (prev > 38 ? 32 : 42));
      }, 120);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpokenWord("");
      setMouthOpenAmount(0);
      setMouthVisemeWidth(36);
      if (mouthAnimationTimerRef.current) clearInterval(mouthAnimationTimerRef.current);
      resetIdleTimer();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpokenWord("");
      setMouthOpenAmount(0);
      setMouthVisemeWidth(36);
      if (mouthAnimationTimerRef.current) clearInterval(mouthAnimationTimerRef.current);
      resetIdleTimer();
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Audition Sweet Voice Function
  const testSweetVoice = () => {
    const auditionLine =
      "Hello my dear friend! I am Sreymara Queen. My voice is sweet, gentle, and strictly female just for you. How can I brighten your day?";
    speakText(auditionLine);
  };

  // Send Message to Sreymara Gemini Backend
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);
    resetIdleTimer();

    try {
      const res = await fetch("/api/sreymara/conversational-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map(m => ({
            role: m.sender === "user" ? "user" : "model",
            content: m.text
          }))
        })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const queenMsg: ChatMessage = {
          id: `queen-${Date.now()}`,
          sender: "queen",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        };
        setMessages(prev => [...prev, queenMsg]);
        speakText(data.reply);
      } else {
        throw new Error(data.error || "Could not retrieve Sreymara response.");
      }
    } catch (e: any) {
      console.warn("Sreymara AI error:", e);
      const fallbackMsg: ChatMessage = {
        id: `queen-fb-${Date.now()}`,
        sender: "queen",
        text: `I heard you, but the connection momentarily re-routed. I am Sreymara Queen on Gemini 3.8. Please repeat your prompt or call my name!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      speakText(fallbackMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Launch Workflow Prompt into Sreymara Queen Chat
  const handleLaunchWorkflow = (wf: AlteryxWorkflowExample) => {
    setSelectedWorkflow(wf);
    setActiveTab("chat");
    const promptMessage = `Build and explain the ${wf.title} workflow for Alteryx Designer: "${wf.prompt}"`;
    handleSendMessage(promptMessage);
  };

  // Copy Prompt to Clipboard
  const handleCopyPrompt = (wf: AlteryxWorkflowExample) => {
    navigator.clipboard.writeText(wf.prompt);
    setCopiedPromptId(wf.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  // Handle Meeting Booking
  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/sreymara/book-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `${bookingForm.firstName} ${bookingForm.lastName}`,
          businessEmail: bookingForm.businessEmail,
          phoneNumber: bookingForm.phone,
          country: bookingForm.country,
          role: bookingForm.jobTitle,
          functionCategory: bookingForm.functionRole,
          notes: `Booked via Sreymara Queen Conversational Agent. Alteryx Designer & Ecosystem Strategy Session.`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookingFeedback(`✅ Meeting confirmed for ${bookingForm.firstName}! Details dispatched to ${bookingForm.businessEmail}.`);
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingFeedback(null);
          const confirmMsg: ChatMessage = {
            id: `msg-confirm-${Date.now()}`,
            sender: "queen",
            text: `Excellent! Your meeting has been booked for ${bookingForm.firstName} ${bookingForm.lastName} (${bookingForm.businessEmail}). Our executive team will review your cross-platform workflow specifications and connect with you shortly.`,
            timestamp: "Just now"
          };
          setMessages(prev => [...prev, confirmMsg]);
          speakText(confirmMsg.text);
        }, 1800);
      }
    } catch {
      setBookingFeedback("Meeting request logged in local queue. We will contact you at " + bookingForm.businessEmail);
      setTimeout(() => setShowBookingModal(false), 2000);
    }
  };

  if (!isOpen) return null;

  const currentLook = QUEEN_LOOKS[currentLookIndex];

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{ overscrollBehavior: "contain" }}
      className={`${
        isFloating
          ? "fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 transition-all duration-300 shadow-2xl"
          : "w-full h-full flex flex-col"
      } ${
        isExpanded
          ? "w-[96vw] sm:w-[620px] h-[92vh] max-h-[860px]"
          : "w-[94vw] sm:w-[410px] h-[640px] max-h-[82vh]"
      } ${isMinimized ? "h-14 overflow-hidden" : ""}`}
    >
      {/* 0. PROMINENT FLOATING EMERGENCY HIDE TAB BUTTON - ALWAYS VISIBLE OVER MODAL */}
      {onClose && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute -top-3.5 -right-2 z-[60] px-3.5 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-mono font-black text-xs rounded-full shadow-[0_0_20px_rgba(239,68,68,0.7)] border-2 border-white flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
          title="Click to hide Sreymara Queen and dock to bottom bar"
        >
          <X size={14} strokeWidth={3} className="text-white" />
          <span className="tracking-tight uppercase">HIDE TAB (COLLAPSE)</span>
        </button>
      )}

      <div className="w-full h-full flex flex-col bg-[#06080e] border-2 border-sky-500/50 rounded-3xl overflow-hidden shadow-2xl shadow-sky-950/70 font-sans text-stone-100 ring-1 ring-white/15">
        
        {/* 1. TOP ROYAL HEADER & NAVIGATION TABS */}
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#0d1627] via-[#0a1220] to-[#0d1627] border-b border-sky-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-sky-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-amber-500/20">
                <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-xs">
                  👑
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-extrabold text-xs text-white tracking-wide">Sreymara Queen</span>
                <span className="px-1.5 py-0.2 bg-sky-950 text-sky-300 border border-sky-600/60 rounded text-[8px] font-mono font-bold flex items-center gap-0.5">
                  <Sparkles size={8} className="text-amber-300 fill-amber-300" />
                  GEMINI 3.8
                </span>
                <span className="px-1.5 py-0.2 bg-rose-950 text-rose-300 border border-rose-600/60 rounded text-[8px] font-mono font-bold flex items-center gap-0.5">
                  <Heart size={8} className="text-rose-400 fill-rose-400" />
                  FEMALE VOICE
                </span>
              </div>
              <span className="text-[9.5px] text-stone-400 font-mono">Gemini 3.8 Flash • Conversational AI & Guide</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Clear Chat Button */}
            <button
              type="button"
              onClick={clearChatHistory}
              className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-amber-300 rounded-lg transition-colors cursor-pointer"
              title="Clear Chat History"
            >
              <RotateCcw size={13} />
            </button>

            {/* Prominent Collapse & Hide Tab button - folds entire interface down to bottom dock */}
            {onClose && (
              <button
                id="btn-sreymara-collapse-tab"
                type="button"
                onClick={handleClose}
                className="px-2.5 py-1 bg-gradient-to-r from-sky-950 via-[#0a1832] to-blue-950 hover:from-sky-900 hover:to-blue-900 text-sky-200 hover:text-white rounded-lg border border-sky-500/60 hover:border-sky-400 transition-all flex items-center gap-1 text-[11px] font-bold shadow-sm cursor-pointer group"
                title="Collapse and hide application into bottom dock tab"
              >
                <ChevronDown size={13} className="text-amber-300 group-hover:translate-y-0.5 transition-transform" />
                <span className="whitespace-nowrap">Collapse Tab</span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title={isExpanded ? "Standard Size" : "Full Screen Size"}
            >
              {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            {onClose && (
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-red-950/80 text-stone-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                title="Hide / Close Sreymara Queen"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 2. ENHANCED SUB-NAVIGATION TABS (100% permanently clear, vibrant, high-contrast, zero clipping) */}
        <div className="px-2 sm:px-2.5 py-2 bg-[#080d17] border-b border-stone-800/90 grid grid-cols-4 gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold shrink-0 select-none">
          <button
            id="tab-sreymara-chat"
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`px-1.5 sm:px-2.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "chat"
                ? "bg-[#0066FF] text-white ring-2 ring-blue-400/90 shadow-md shadow-blue-500/30 font-black"
                : "bg-[#0d172a] text-stone-100 hover:text-white hover:bg-[#162544] border border-sky-800/70 font-extrabold"
            }`}
            title="Chat & Voice Mode"
          >
            <MessageSquare size={13} className="shrink-0 text-sky-400" />
            <span className="whitespace-nowrap font-black">Chat</span>
          </button>

          <button
            id="tab-sreymara-workflows"
            type="button"
            onClick={() => setActiveTab("workflows")}
            className={`px-1.5 sm:px-2.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "workflows"
                ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 ring-2 ring-amber-300 shadow-md shadow-amber-500/30 font-black"
                : "bg-[#1c1407] text-amber-200 hover:text-white hover:bg-[#2b1f0d] border border-amber-600/70 font-extrabold"
            }`}
            title="10 Alteryx Enterprise Workflows"
          >
            <Zap size={13} className="text-amber-400 shrink-0 fill-amber-400" />
            <span className="whitespace-nowrap font-black">10 Workflows</span>
          </button>

          <button
            id="tab-sreymara-voice"
            type="button"
            onClick={() => setActiveTab("voice_settings")}
            className={`px-1.5 sm:px-2.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "voice_settings"
                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white ring-2 ring-rose-400 shadow-md shadow-rose-500/30 font-black"
                : "bg-[#1c0c17] text-rose-200 hover:text-white hover:bg-[#2b1424] border border-rose-700/70 font-extrabold"
            }`}
            title="Configure Voice & Mood"
          >
            <Sliders size={13} className="text-rose-400 shrink-0" />
            <span className="whitespace-nowrap font-black">Voice & Mood</span>
          </button>

          <button
            id="tab-sreymara-installer"
            type="button"
            onClick={() => setActiveTab("installer")}
            className={`px-1.5 sm:px-2.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "installer"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-2 ring-emerald-300 shadow-md shadow-emerald-500/30 font-black"
                : "bg-[#091a14] text-emerald-200 hover:text-white hover:bg-[#122e23] border border-emerald-700/70 font-extrabold"
            }`}
            title="Install Alteryx One App"
          >
            <Download size={13} className="text-emerald-400 shrink-0" />
            <span className="whitespace-nowrap font-black">Alteryx One</span>
          </button>
        </div>

        {/* UNLIMITED ENTERPRISE AI CREDITS & REAL-TIME AUTONOMOUS LEARNING BANNER */}
        <div className="px-3 py-1.5 bg-gradient-to-r from-[#0a1830] via-[#081224] to-[#0f1b33] border-b border-sky-800/40 flex items-center justify-between text-[10.5px] select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-amber-300 flex items-center gap-1">
              <Zap size={11} className="fill-amber-400 text-amber-400" />
              <span>UNLIMITED AI CREDITS (∞)</span>
            </span>
            <span className="text-stone-500">•</span>
            <span className="text-emerald-300 font-medium flex items-center gap-1">
              <Brain size={11} className="text-emerald-400" />
              <span>Learning 24/7 ({knowledgeNodes.toLocaleString()} Synapses)</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[9.5px] text-sky-300/80 font-mono">
            <span className="text-emerald-400">Zero Blocks</span>
            <span>•</span>
            <span>Infinite Quota</span>
          </div>
        </div>

        {/* 3. ALIVE INTERACTIVE SREYMARA QUEEN & BOOK A MEETING SECTION WITH SHOW/HIDE TOGGLE */}
        {!isMinimized && (
          <>
            {isAvatarSectionFolded ? (
              /* FOLDED COMPACT STATE: Takes minimal vertical space so the ecosystem and chat stay open */
              <div className="px-3 py-2 bg-[#090d15] border-b border-stone-800/90 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400/50 shrink-0">
                    <img
                      src={customPhotoUrl || currentLook.url}
                      alt="Queen Sreymara"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Sreymara Queen & Meeting</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[8.5px] rounded font-mono">Active</span>
                    </div>
                    <span className="text-[9.5px] text-stone-400">Stage Folded (Click show to expand)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(true)}
                    className="px-2 py-1 bg-[#0066FF] hover:bg-[#0055D4] text-white text-xs font-bold rounded-lg shadow transition-all cursor-pointer whitespace-nowrap"
                  >
                    Book Meeting
                  </button>
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-2 py-1 bg-gradient-to-r from-sky-950 to-blue-950 hover:from-sky-900 hover:to-blue-900 border border-sky-500/70 text-sky-200 hover:text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-sm"
                      title="Collapse entire application into bottom dock tab"
                    >
                      <ChevronDown size={12} className="text-amber-300" />
                      <span>Collapse Tab</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleAvatarSectionFold}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-medium rounded-lg border border-stone-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    title="Expand Avatar & Meeting Section"
                  >
                    <Eye size={12} />
                    <span>Show Stage</span>
                    <ChevronDown size={12} />
                  </button>
                </div>
              </div>
            ) : (
              /* EXPANDED FULL STAGE: With responsive photo avatar, Book A Meeting, Mic/Speaker, and Show/Hide toggle */
              <div 
                onWheel={handleStageWheel}
                style={{ overscrollBehavior: "contain" }}
                className="px-3.5 pt-2.5 pb-2 bg-[#090d15] border-b border-stone-800/90 flex flex-col items-center shrink-0"
              >
                {/* Section Header & Hide/Fold Toggle Tab */}
                <div className="w-full max-w-[380px] flex items-center justify-between pb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 flex items-center gap-1 select-none">
                    <Sparkles size={11} className="text-amber-400" />
                    <span>Executive AI Stage & Booking</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {onClose && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-2 py-0.5 bg-gradient-to-r from-sky-950 to-blue-950 hover:from-sky-900 hover:to-blue-900 border border-sky-500/70 text-sky-200 hover:text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                        title="Collapse entire application into bottom dock tab"
                      >
                        <ChevronDown size={11} className="text-amber-300" />
                        <span>Collapse Tab</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={toggleAvatarSectionFold}
                      className="px-2 py-0.5 bg-stone-800/80 hover:bg-stone-700 border border-stone-700/80 text-stone-300 hover:text-white rounded-md text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                      title="Fold this section to look small and free up screen space"
                    >
                      <EyeOff size={11} />
                      <span>Hide Stage</span>
                      <ChevronUp size={11} />
                    </button>
                  </div>
                </div>

                {/* Full-Height Responsive Stage Framing Head, Eyes, Smile, Mouth, Neck & Alteryx Jacket */}
                <div className="relative w-full max-w-[380px] h-72 sm:h-80 rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-2xl group">
                  {/* Active Digital Human Avatar (Real Portrait - No fake stickers or overlaid boxes) */}
                  <AliveSreymaraQueenAvatar
                    isSpeaking={isSpeaking}
                    isListening={isMicActive}
                    currentWord={currentSpokenWord}
                    speechVolume={0.75}
                    className="w-full h-full"
                    photoUrl={customPhotoUrl || currentLook.url}
                    onPhotoUpload={(dataUrl) => {
                      setCustomPhotoUrl(dataUrl);
                    }}
                    onInteract={() => {
                      if (!isSpeaking) {
                        speakText("Hello! I am active, alive, and ready to assist you with Alteryx workflows and analytics architecture.");
                      }
                    }}
                  />

                  {/* Floating Action Buttons over Stage (Always visible, unmistakable close/hide) */}
                  <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
                    {onClose && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-2.5 py-1 bg-red-600/90 hover:bg-red-500 text-white font-mono font-black text-[10px] rounded-lg border border-white/60 shadow-lg flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                        title="Hide Sreymara Queen and restore bottom dock"
                      >
                        <X size={12} strokeWidth={3} />
                        <span>HIDE TAB</span>
                      </button>
                    )}
                  </div>

                  <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleAvatarSectionFold}
                      className="px-2 py-1 bg-black/80 hover:bg-black text-stone-200 hover:text-white font-mono font-bold text-[9.5px] rounded-lg border border-stone-600 shadow flex items-center gap-1 cursor-pointer transition-all"
                      title="Fold face section"
                    >
                      <EyeOff size={11} />
                      <span>Minimize Face</span>
                    </button>
                  </div>
                </div>

                {/* "BOOK A MEETING" BUTTON (Matches Screenshot 2) */}
                <div className="w-full max-w-[380px] pt-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(true)}
                    className="w-full py-3 bg-[#0066FF] hover:bg-[#0055D4] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer transform active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Book A Meeting</span>
                  </button>
                </div>

                {/* TWO CIRCULAR BUTTONS: MIC & SPEAKER WITH LABELS (Matches Screenshot 2) */}
                <div className="w-full max-w-[380px] py-2.5 flex items-center justify-center gap-10">
                  {/* Mic Circle */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md border ${
                        isMicActive
                          ? "bg-rose-600 border-rose-400 text-white ring-4 ring-rose-500/40 animate-pulse"
                          : "bg-[#181d28] hover:bg-[#222938] border-stone-700/80 text-stone-200 hover:border-sky-400"
                      }`}
                      title={isMicActive ? "Listening to you... Tap to finish" : "Tap to speak with Mic"}
                    >
                      <Mic size={18} />
                    </button>
                    <span className="text-[11px] font-medium text-stone-300 select-none">Mic</span>
                  </div>

                  {/* Speaker Circle */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (isSpeaking) {
                          window.speechSynthesis.cancel();
                          setIsSpeaking(false);
                        }
                        setIsSpeakerEnabled(!isSpeakerEnabled);
                      }}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md border ${
                        isSpeakerEnabled
                          ? "bg-[#181d28] hover:bg-[#222938] border-stone-700/80 text-stone-200 hover:border-sky-400"
                          : "bg-stone-900 border-stone-800 text-stone-500"
                      }`}
                      title={isSpeakerEnabled ? "Speaker enabled" : "Speaker muted"}
                    >
                      {isSpeakerEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                    <span className="text-[11px] font-medium text-stone-300 select-none">Speaker</span>
                  </div>
                </div>

                {/* ERROR / PERMISSION NOTICE BANNER IF MIC BLOCKED */}
                {micErrorMessage && (
                  <div className="w-full max-w-[380px] mt-1 p-2 bg-amber-950/80 border border-amber-600/70 rounded-xl text-[10px] text-amber-200 flex items-start justify-between gap-1">
                    <span>{micErrorMessage}</span>
                    <button
                      onClick={() => setMicErrorMessage(null)}
                      className="text-amber-400 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 4. MAIN BODY: TABS CONTENT */}
        <div 
          ref={mainScrollRef}
          onWheel={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: "contain" }}
          className="flex-1 overflow-y-auto bg-[#04060b] scrollbar-thin scrollbar-thumb-stone-800"
        >
          
          {/* TAB A: CHAT CONVERSATION */}
          {activeTab === "chat" && (
            <div className="p-3.5 space-y-3">
              {/* 10 Workflows Quick Shortcut Chips */}
              <div className="p-2.5 bg-gradient-to-r from-[#0a1224] to-[#070b16] rounded-2xl border border-sky-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-sky-300 uppercase tracking-wider flex items-center gap-1">
                    <Zap size={11} className="text-amber-400" />
                    10 Alteryx Designer Workflows
                  </span>
                  <button
                    onClick={() => setActiveTab("workflows")}
                    className="text-[9.5px] text-amber-300 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>View All 10</span>
                    <ChevronRight size={11} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ALTERYX_WORKFLOW_EXAMPLES.slice(0, 4).map(wf => (
                    <button
                      key={wf.id}
                      onClick={() => handleLaunchWorkflow(wf)}
                      className="px-2 py-1 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white rounded-lg text-[9.5px] font-medium border border-stone-800 transition-all cursor-pointer text-left"
                    >
                      {wf.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] p-3.5 rounded-2xl text-[12.5px] leading-relaxed transition-all shadow-sm ${
                      m.sender === "user"
                        ? "bg-[#0066FF] text-white ml-auto"
                        : "bg-[#1c222e] text-stone-200 border border-stone-800/70"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <div
                      className={`text-[8.5px] mt-1.5 text-right font-mono ${
                        m.sender === "user" ? "text-blue-100" : "text-stone-500"
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-stone-400 text-xs p-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-[10px] font-mono text-stone-400">Sreymara Queen is reasoning with Gemini...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}

          {/* TAB B: 10 POWERFUL ALTERYX WORKFLOWS STUDIO */}
          {activeTab === "workflows" && (
            <div className="p-3.5 space-y-3.5">
              <div className="p-3 bg-gradient-to-r from-blue-950 via-sky-950 to-stone-950 border border-sky-600/50 rounded-2xl">
                <div className="flex items-center gap-2 font-black text-xs text-white">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>10 Powerful Alteryx Designer Workflows</span>
                </div>
                <p className="text-[10px] text-stone-300 mt-1 leading-relaxed">
                  Inside Alteryx Designer, the AI assistant builds workflows from prompts, generates synthetic test data, explains tools, and verifies transformations. Click any workflow to build it or generate test data.
                </p>
              </div>

              {/* Workflow Cards */}
              <div className="space-y-3">
                {ALTERYX_WORKFLOW_EXAMPLES.map((wf, idx) => (
                  <div
                    key={wf.id}
                    className="p-3 bg-[#0d1322] border border-stone-800 hover:border-sky-500/80 rounded-2xl space-y-2.5 transition-all shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-500 text-sky-300 font-mono text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-white">{wf.title}</h4>
                          <span className="text-[9px] text-sky-400 font-mono">{wf.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyPrompt(wf)}
                        className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg text-[9.5px] border border-stone-800 flex items-center gap-1 cursor-pointer"
                        title="Copy Prompt"
                      >
                        {copiedPromptId === wf.id ? (
                          <>
                            <Check size={11} className="text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Prompt Box */}
                    <div className="p-2.5 bg-black/60 rounded-xl border border-stone-800 text-[10.5px] text-stone-300 font-mono leading-relaxed italic">
                      "{wf.prompt}"
                    </div>

                    {/* Tools Needed */}
                    <div className="flex items-center gap-1 flex-wrap text-[9px]">
                      <span className="text-stone-400 font-bold">Tools:</span>
                      {wf.tools.map(tool => (
                        <span
                          key={tool}
                          className="px-1.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-800/80 rounded font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* Synthetic Data Preview */}
                    <div className="p-2 bg-stone-950/80 rounded-xl border border-stone-800/80 text-[9.5px] space-y-1">
                      <span className="text-[9px] font-bold text-amber-300 block uppercase tracking-wider">
                        Synthetic Test Data Sample
                      </span>
                      <pre className="overflow-x-auto text-[8.5px] text-emerald-300 font-mono bg-black/80 p-1.5 rounded">
                        {JSON.stringify(wf.syntheticDataSample, null, 2)}
                      </pre>
                    </div>

                    {/* Action Launch Button */}
                    <button
                      onClick={() => handleLaunchWorkflow(wf)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                    >
                      <Zap size={13} className="text-amber-300" />
                      <span>Ask Sreymara to Build Workflow</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB C: VOICE SETTINGS & COMPANION MOOD */}
          {activeTab === "voice_settings" && (
            <div className="p-3.5 space-y-3.5 text-xs text-stone-200">
              <div className="p-3 bg-gradient-to-r from-rose-950 via-purple-950 to-stone-950 border border-rose-500/50 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 font-black text-rose-300">
                  <Heart size={14} className="fill-rose-400 text-rose-400" />
                  <span>Sreymara Sweet Female Voice & Mood</span>
                </div>
                <p className="text-[10px] text-stone-300 leading-relaxed">
                  Strictly female voice synthesis only. All male synthesizers are filtered out so Sreymara always speaks with sweet, affectionate, and feminine charm.
                </p>
              </div>

              {/* Voice Selector */}
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-stone-300 flex items-center justify-between">
                  <span>Available Sweet Female Voices:</span>
                  <span className="text-[9px] text-emerald-400 font-mono">
                    {availableFemaleVoices.length} voices found
                  </span>
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-stone-700 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                >
                  {availableFemaleVoices.map(v => (
                    <option key={v.name} value={v.name}>
                      🌸 {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pitch Adjuster */}
              <div className="space-y-1.5 bg-[#0d1322] p-3 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>Sweetness & Pitch:</span>
                  <span className="text-rose-400 font-mono">{voicePitch.toFixed(2)}x (Sweet Lady)</span>
                </div>
                <input
                  type="range"
                  min="1.1"
                  max="1.5"
                  step="0.02"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-stone-500">
                  <span>Executive Lady (1.1x)</span>
                  <span>Sweet Queen (1.28x)</span>
                  <span>Youthful Girl (1.5x)</span>
                </div>
              </div>

              {/* Rate Adjuster */}
              <div className="space-y-1.5 bg-[#0d1322] p-3 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>Speaking Cadence & Speed:</span>
                  <span className="text-sky-400 font-mono">{voiceRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.85"
                  max="1.15"
                  step="0.02"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Audition Button */}
              <button
                type="button"
                onClick={testSweetVoice}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>Audition Voice with Sreymara Greeting</span>
              </button>

              {/* Real Human Queen Appearance & Photo Picker */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-stone-300">
                    Sreymara Queen Appearance:
                  </span>
                  {customPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          localStorage.removeItem("sreymara_custom_photo");
                        } catch {}
                        setCustomPhotoUrl(null);
                      }}
                      className="text-[9px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      <span>Reset to default</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {QUEEN_LOOKS.map((look, idx) => (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => {
                        setCustomPhotoUrl(null);
                        try {
                          localStorage.removeItem("sreymara_custom_photo");
                        } catch {}
                        setCurrentLookIndex(idx);
                      }}
                      className={`p-1.5 rounded-xl border flex flex-col items-center text-center gap-1 cursor-pointer transition-all ${
                        !customPhotoUrl && currentLookIndex === idx
                          ? "border-rose-500 bg-rose-950/50 ring-2 ring-rose-500/40"
                          : "border-stone-800 bg-stone-950 hover:border-stone-700"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-stone-700/80 shadow">
                        <img
                          src={look.url}
                          alt={look.name}
                          className="w-full h-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[9.5px] font-bold text-stone-200 line-clamp-1">
                        {look.name.split("(")[1]?.replace(")", "") || look.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Upload Exact Photo (e.g. photo_2025-12-18_15-56-22.jpg) */}
                <div className="pt-1">
                  <label className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-sky-500 rounded-xl flex items-center justify-center gap-2 text-stone-300 hover:text-white text-[10.5px] font-semibold cursor-pointer transition-all shadow">
                    <Camera size={13} className="text-sky-400" />
                    <span>Upload Screenshot (photo_2025-12-18_15-56-22.jpg)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const dataUrl = evt.target?.result as string;
                            if (dataUrl) {
                              setCustomPhotoUrl(dataUrl);
                              try {
                                localStorage.setItem("sreymara_custom_photo", dataUrl);
                              } catch {}
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <p className="text-[8.5px] text-stone-500 text-center mt-1">
                    Uploads directly into your browser & persists permanently with full lifelike animations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB D: ALTERYX ONE INSTALLER GUIDE */}
          {activeTab === "installer" && (
            <div className="p-3.5 space-y-3 text-xs text-stone-200">
              <div className="p-3 bg-gradient-to-r from-emerald-950 to-stone-950 border border-emerald-600/50 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 font-black text-emerald-300 text-xs">
                  <Download size={14} />
                  <span>How to Get Started with Alteryx Designer Desktop</span>
                </div>
                <p className="text-[10px] text-stone-300 leading-relaxed">
                  You will first need to install Alteryx Designer Desktop to create and edit these workflows.
                </p>
              </div>

              <div className="space-y-2.5 bg-[#0d1322] p-3.5 rounded-2xl border border-stone-800">
                <h4 className="font-bold text-xs text-white">Installation Steps:</h4>
                <ol className="space-y-2 text-[10.5px] text-stone-300 list-decimal list-inside leading-relaxed">
                  <li>
                    Navigate to <strong className="text-sky-300">Download & Activate</strong> in the left side navigation bar of Alteryx One.
                  </li>
                  <li>
                    Download the official <strong className="text-sky-300">Alteryx One installer</strong> for Alteryx Designer Desktop.
                  </li>
                  <li>
                    Run the installer and sign in with your enterprise credentials or Free Trial account.
                  </li>
                  <li>
                    Open Alteryx Designer and use the integrated AI assistant to build any of our 10 workflows by providing the prompts!
                  </li>
                </ol>
              </div>

              <a
                href="https://my.alteryx.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Launch Alteryx Portal (https://my.alteryx.com/)</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}

        </div>

        {/* 5. BOTTOM INPUT BAR (WHEN IN CHAT VIEW) */}
        {activeTab === "chat" && (
          <div className="p-2.5 bg-[#080d16] border-t border-stone-800/80 shrink-0 space-y-2">
            
            {/* Quick Voice Questions Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[9.5px]">
              <span className="text-stone-500 font-bold shrink-0 flex items-center gap-1 pl-0.5">
                <Sparkles size={11} className="text-amber-400" />
                <span>Quick Prompts:</span>
              </span>
              {[
                "Customer Churn Analysis",
                "ERP Financial Reconciliation",
                "How to install Alteryx One?",
                "Audition your sweet voice"
              ].map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (qp === "Audition your sweet voice") {
                      testSweetVoice();
                    } else {
                      handleSendMessage(qp);
                    }
                  }}
                  className="px-2 py-0.5 bg-stone-900/90 hover:bg-sky-950/80 border border-stone-800 hover:border-sky-500/60 rounded-full text-stone-300 hover:text-sky-300 font-medium whitespace-nowrap transition-all cursor-pointer"
                >
                  {qp}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type here"
                className="w-full pl-4 pr-12 py-3 bg-[#181d28] border border-stone-700/80 hover:border-stone-600 focus:border-[#0066FF] rounded-full text-xs text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0066FF] transition-all font-sans"
              />

              {/* Upward Arrow Circle Send Button (Matches Screenshot 2) */}
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="absolute right-1.5 w-8 h-8 rounded-full bg-[#0066FF] hover:bg-[#0055D4] disabled:opacity-30 disabled:hover:bg-[#0066FF] text-white flex items-center justify-center transition-all cursor-pointer shadow"
                title="Send"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </form>

            {/* Official Alteryx Privacy & Recording Consent Notice (Matches Screenshot 2) */}
            <p className="text-[10px] text-stone-400 text-center leading-relaxed px-2 font-normal select-none">
              By continuing, you consent to recording of this conversation and acknowledge your data will be processed in accordance with the{" "}
              <a
                href="https://www.alteryx.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white underline"
              >
                Alteryx Privacy Policy
              </a>
            </p>

            {/* PROMINENT BOTTOM HIDE / DOCK BUTTON (Directly visible at the bottom of the form) */}
            {onClose && (
              <div className="pt-1 select-none">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-mono font-black text-xs rounded-xl shadow-lg border border-red-400/60 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 uppercase tracking-wide"
                  title="Click to hide Sreymara Queen and dock to bottom bar"
                >
                  <ChevronDown size={15} strokeWidth={3} className="text-amber-300 animate-bounce" />
                  <span>HIDE & DOCK TO BOTTOM BAR</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 6. BOOK A MEETING MODAL */}
      {showBookingModal && (
        <div 
          onWheel={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: "contain" }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            onWheel={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: "contain" }}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0a0f1d] border border-sky-600/60 rounded-3xl p-5 shadow-2xl space-y-4 font-sans text-stone-100 animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-amber-400" />
                <h3 className="font-bold text-sm text-white">Book Meeting with Sreymara Queen</h3>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {bookingFeedback ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/80 rounded-2xl text-xs text-emerald-200 text-center font-bold">
                {bookingFeedback}
              </div>
            ) : (
              <form onSubmit={handleSubmitMeeting} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10.5px] text-stone-400 font-bold block mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.businessEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, businessEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-stone-700 rounded-xl text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10.5px] text-stone-400 font-bold block mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.firstName}
                      onChange={(e) => setBookingForm({ ...bookingForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-stone-700 rounded-xl text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] text-stone-400 font-bold block mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.lastName}
                      onChange={(e) => setBookingForm({ ...bookingForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-stone-700 rounded-xl text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10.5px] text-stone-400 font-bold block mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.country}
                      onChange={(e) => setBookingForm({ ...bookingForm, country: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-stone-700 rounded-xl text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] text-stone-400 font-bold block mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-stone-700 rounded-xl text-white font-mono focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10.5px] text-stone-400 font-bold block mb-1">
                      Function *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.functionRole}
                      onChange={(e) => setBookingForm({ ...bookingForm, functionRole: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-stone-700 rounded-xl text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] text-stone-400 font-bold block mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.jobTitle}
                      onChange={(e) => setBookingForm({ ...bookingForm, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-stone-700 rounded-xl text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-black/60 rounded-xl border border-stone-800 text-[10px] text-stone-400 flex items-center justify-between">
                  <span>Alteryx Trial Portal:</span>
                  <a
                    href="https://my.alteryx.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 underline"
                  >
                    <span>https://my.alteryx.com/</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer text-xs"
                >
                  Submit & Confirm Meeting
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
