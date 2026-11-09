// src/services/adManager.ts

export const ADSGRAM_BLOCK_ID = "YOUR_ADSGRAM_BLOCK_ID";
export const PAYOUT_WALLET = "UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ";
export const ACTIVE_AUTH_KEY = "5dd2...ecb2";

export interface AdYieldRecord {
  event: string;
  wallet: string;
  yieldAmount: number;
  timestamp: string;
  integrity: string;
}

export async function recordYieldEvent(eventType: string, customYield?: number): Promise<void> {
  try {
    const yieldAmount = customYield !== undefined ? customYield : (eventType === "AD_WATCH_COMPLETE" ? 0.05 : 0.02);
    await fetch("/api/intelligence/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: eventType,
        wallet: PAYOUT_WALLET,
        activeKey: ACTIVE_AUTH_KEY,
        yieldAmount,
        timestamp: new Date().toISOString()
      })
    });
  } catch (err) {
    console.warn("Could not post ad telemetry:", err);
  }
}

export async function showNonIntrusiveAd(onComplete?: () => void): Promise<void> {
  try {
    const win = typeof window !== "undefined" ? (window as any) : null;
    if (win && win.Adsgram) {
      const AdController = win.Adsgram.init({
        blockId: ADSGRAM_BLOCK_ID,
        debug: false
      });

      // 5-second skip rule for rewarded ads
      AdController.show({
        allowSkip: true,
        skipDelay: 5
      })
        .then((result: any) => {
          recordYieldEvent("AD_WATCH_COMPLETE", 0.05);
          if (onComplete) onComplete();
        })
        .catch((err: any) => {
          // Passive yield even if skipped after 5s or closed early
          recordYieldEvent("AD_SKIPPED_EARLY", 0.02);
          if (onComplete) onComplete();
        });
    } else {
      // Passive ad-yield fallback
      recordYieldEvent("PASSIVE_BANNER_YIELD", 0.01);
      if (onComplete) onComplete();
    }
  } catch (e) {
    console.warn("Ad execution fallback error:", e);
    if (onComplete) onComplete();
  }
}
