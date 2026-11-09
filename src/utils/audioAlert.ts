// src/utils/audioAlert.ts
// Pure Web Audio API Synthesizer - 100% Reliable (No external audio file dependencies)

let audioContextInstance: AudioContext | null = null;
let isMuted: boolean = false;
let globalVolume: number = 0.8;

// Initialize or resume the shared AudioContext safely across browsers & Telegram WebApps
function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioContextInstance || audioContextInstance.state === 'closed') {
      audioContextInstance = new AudioCtx();
    }
    if (audioContextInstance.state === 'suspended') {
      audioContextInstance.resume().catch(() => {});
    }
    return audioContextInstance;
  } catch (err) {
    console.warn('[AudioAlert] Web Audio not available:', err);
    return null;
  }
}

/**
 * Plays a sparkling, multi-tone cash register & coin ringing bell chime
 * whenever a blockchain balance increase or micro-yield payout is recorded.
 */
export function playCryptoChimeSound(type: 'blockchain_increase' | 'price_alert' | 'voucher_claimed' = 'blockchain_increase') {
  if (isMuted) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (type === 'price_alert') {
      // 🔔 High-pitched 2-tone alert chime (Alert notification)
      const alertNotes = [880.00, 1174.66, 1760.00]; // A5, D6, A6
      alertNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25 * globalVolume, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.45);
      });
    } else {
      // 💰 Crisp golden crypto win & deposit ringing bell (C5, E5, G5, C6, E6)
      const chordFrequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      chordFrequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        // Gentle envelope with sparkling metallic ringing sustain
        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.3 * globalVolume, now + i * 0.06 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.7);
      });
    }

    // Trigger haptic vibration on mobile / Telegram devices if activated
    try {
      if (
        typeof navigator !== 'undefined' && 
        navigator.vibrate && 
        (navigator as any).userActivation?.hasBeenActive
      ) {
        navigator.vibrate([60, 40, 80]);
      }
    } catch {}

  } catch {}
}

/**
 * Event emitter / listener for global blockchain increase triggers
 */
type IncreaseListener = (detail: { amount: number; token: string; source: string }) => void;
const increaseListeners: IncreaseListener[] = [];

export function subscribeToBlockchainIncrease(listener: IncreaseListener) {
  increaseListeners.push(listener);
  return () => {
    const idx = increaseListeners.indexOf(listener);
    if (idx !== -1) increaseListeners.splice(idx, 1);
  };
}

export function notifyBlockchainIncrease(amount: number, token: string = 'USDT', source: string = 'Blockchain Deposit') {
  playCryptoChimeSound('blockchain_increase');
  increaseListeners.forEach(fn => {
    try {
      fn({ amount, token, source });
    } catch {}
  });
}

export function setChimeMuted(muted: boolean) {
  isMuted = muted;
}

export function getChimeMuted(): boolean {
  return isMuted;
}

export function setChimeVolume(vol: number) {
  globalVolume = Math.max(0, Math.min(1, vol));
}

export function getChimeVolume(): number {
  return globalVolume;
}
