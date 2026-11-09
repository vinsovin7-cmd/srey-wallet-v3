// public/js/adManager.js

const ADSGRAM_BLOCK_ID = "YOUR_ADSGRAM_BLOCK_ID";
const PAYOUT_WALLET = "UQAUc97F293041920384729103948572910293";

export async function showNonIntrusiveAd(onComplete) {
  try {
    if (typeof window !== "undefined" && window.Adsgram) {
      const AdController = window.Adsgram.init({ 
        blockId: ADSGRAM_BLOCK_ID,
        debug: false 
      });

      // Show ad with non-blocking skip handler (5-second skip rule)
      AdController.show({
        allowSkip: true,
        skipDelay: 5
      })
        .then((result) => {
          console.log("Ad completed/skipped normally:", result);
          recordYieldEvent("AD_WATCH_COMPLETE");
          if (onComplete) onComplete();
        })
        .catch((err) => {
          console.log("Ad skipped or closed early:", err);
          recordYieldEvent("AD_SKIPPED_EARLY");
          if (onComplete) onComplete(); // Proceed without interrupting chat/search
        });
    } else {
      // Passive simulated ad-yield when SDK is loading
      recordYieldEvent("PASSIVE_BANNER_IMPRESSION");
      if (onComplete) onComplete();
    }
  } catch (e) {
    console.warn("Ad execution error fallback:", e);
    if (onComplete) onComplete();
  }
}

export async function recordYieldEvent(eventType) {
  try {
    const yieldAmount = eventType === "AD_WATCH_COMPLETE" ? 0.05 : 0.02;
    await fetch("/api/intelligence/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: eventType,
        wallet: PAYOUT_WALLET,
        activeKey: "5dd2...ecb2",
        yieldAmount,
        timestamp: new Date().toISOString()
      })
    });
  } catch (err) {
    console.warn("Could not post ad telemetry:", err);
  }
}

export { PAYOUT_WALLET, ADSGRAM_BLOCK_ID };
