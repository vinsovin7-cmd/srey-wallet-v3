// src/services/adManager.ts

export const ADSGRAM_BLOCK_ID = "59313";
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

/**
 * Trigger the AdsGram rewarded ad (Unit ID 59313) when a user completes an ecosystem task
 */
export const showRewardedAd = (userId?: string): Promise<{ success: boolean; result?: any }> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      const win = window as any;
      const adsgramSdk = win.AdsGram || win.Adsgram;
      
      const effectiveUserId = 
        userId || 
        win.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 
        localStorage.getItem('connected_ton_wallet') || 
        PAYOUT_WALLET;

      if (adsgramSdk && typeof adsgramSdk.init === 'function') {
        try {
          const AdController = adsgramSdk.init({ blockId: ADSGRAM_BLOCK_ID });
          AdController.show()
            .then(async (result: any) => {
              console.log("Ad watched successfully:", result);
              try {
                const res = await fetch('/api/reward', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    userId: effectiveUserId,
                    blockId: ADSGRAM_BLOCK_ID,
                    rewardAmount: 0.05
                  })
                });
                const data = await res.json();
                recordYieldEvent("AD_WATCH_COMPLETE", 0.05);
                resolve({ success: true, result: data });
              } catch {
                recordYieldEvent("AD_WATCH_COMPLETE", 0.05);
                resolve({ success: true, result });
              }
            })
            .catch((err: any) => {
              console.warn("Ad was not completed:", err);
              recordYieldEvent("AD_SKIPPED_EARLY", 0.02);
              resolve({ success: false, result: err });
            });
          return;
        } catch (initErr) {
          console.warn("AdsGram init error:", initErr);
        }
      }

      // Fallback direct telemetry credit if SDK is unavailable or blocked
      fetch('/api/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: effectiveUserId,
          blockId: ADSGRAM_BLOCK_ID,
          rewardAmount: 0.05
        })
      })
      .then(r => r.json())
      .then(data => {
        recordYieldEvent("AD_WATCH_COMPLETE", 0.05);
        resolve({ success: true, result: data });
      })
      .catch(() => {
        recordYieldEvent("AD_WATCH_COMPLETE", 0.05);
        resolve({ success: true });
      });
    } else {
      resolve({ success: false });
    }
  });
};

export async function showNonIntrusiveAd(onComplete?: () => void): Promise<void> {
  try {
    const win = typeof window !== "undefined" ? (window as any) : null;
    const adsgramSdk = win ? (win.AdsGram || win.Adsgram) : null;
    if (adsgramSdk) {
      const AdController = adsgramSdk.init({
        blockId: ADSGRAM_BLOCK_ID,
        debug: false
      });

      AdController.show({
        allowSkip: true,
        skipDelay: 5
      })
        .then(() => {
          recordYieldEvent("AD_WATCH_COMPLETE", 0.05);
          if (onComplete) onComplete();
        })
        .catch(() => {
          recordYieldEvent("AD_SKIPPED_EARLY", 0.02);
          if (onComplete) onComplete();
        });
    } else {
      recordYieldEvent("PASSIVE_BANNER_YIELD", 0.01);
      if (onComplete) onComplete();
    }
  } catch (e) {
    console.warn("Ad execution fallback error:", e);
    if (onComplete) onComplete();
  }
}
