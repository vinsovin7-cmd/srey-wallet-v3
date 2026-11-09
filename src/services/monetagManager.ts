// Global Monetag Ecosystem Auto-Monetizer Manager
let userActionCount = 0;
const ACTIONS_BETWEEN_ADS = 5; // Show an ad every 5 user actions

export function recordEcosystemActivity() {
  userActionCount++;
  if (userActionCount >= ACTIONS_BETWEEN_ADS) {
    userActionCount = 0; // Reset counter
    triggerAutomaticAd();
  }
}

export function triggerAutomaticAd() {
  if (typeof (window as any).show_11896240 === 'function') {
    (window as any).show_11896240()
      .then(() => {})
      .catch(() => {});
  } else {
    if ((window as any).TelegramAdsController && typeof (window as any).TelegramAdsController.showAd === 'function') {
      (window as any).TelegramAdsController.showAd().catch(() => {});
    }
  }
}

// Make globally available across all components/pages
if (typeof window !== 'undefined') {
  (window as any).recordEcosystemActivity = recordEcosystemActivity;
  (window as any).triggerAutomaticAd = triggerAutomaticAd;
}
