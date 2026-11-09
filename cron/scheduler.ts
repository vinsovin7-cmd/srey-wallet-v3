// cron/scheduler.ts
import cron from 'node-cron';

export const TARGET_WALLET = "UQBLz9rXINTlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVIbnBJ";
export const MINI_APP_LINK = "https://t.me/GeminiSreymaraBot/sreymara";
export const ACTIVE_AUTH_KEY = "5dd2...ecb2";

export interface BroadcastLog {
  id: string;
  type: string;
  interval: string;
  targetChannels: string[];
  payload: any;
  timestamp: string;
}

export const broadcastLogs: BroadcastLog[] = [];

// 1. Bot 1: Broadcasts Quiz Cards every 15 minutes
export const quizBroadcastTask = cron.schedule('*/15 * * * *', async () => {
  try {
    const logEntry: BroadcastLog = {
      id: `cron-quiz-${Date.now()}`,
      type: "QUIZ_CARD_BROADCAST",
      interval: "15m",
      targetChannels: ["@SREYMARA", "@multisreymara", "@executive_sreymara_suit"],
      payload: {
        title: "🎯 15-Minute Live Quiz Drop",
        rewardPool: "0.50 USDT Max (Tiered)",
        link: MINI_APP_LINK
      },
      timestamp: new Date().toISOString()
    };
    broadcastLogs.unshift(logEntry);
    if (broadcastLogs.length > 50) broadcastLogs.pop();

    const baseUrl = `http://127.0.0.1:${process.env.PORT || 3000}`;
    fetch(`${baseUrl}/api/intelligence/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "SCHEDULED_QUIZ_BROADCAST_15M",
        ledgerData: logEntry,
        wallet: TARGET_WALLET,
        activeKey: ACTIVE_AUTH_KEY
      })
    }).catch(() => {});
  } catch {
    // Quiet error
  }
});

// 2. Bot 2: Broadcasts High-Yield Alerts every 25 minutes
export const alertBroadcastTask = cron.schedule('*/25 * * * *', async () => {
  try {
    const logEntry: BroadcastLog = {
      id: `cron-alert-${Date.now()}`,
      type: "HIGH_YIELD_ALERT_BROADCAST",
      interval: "25m",
      targetChannels: ["@SREYMARA", "@multisreymara", "@CUSTOMERSERVEVICETOPUP"],
      payload: {
        alert: "⚡ High Yield Surge: 0.05 USDT / Search + 0.50 USDT Quiz Tier Active",
        recipientWallet: TARGET_WALLET,
        link: MINI_APP_LINK
      },
      timestamp: new Date().toISOString()
    };
    broadcastLogs.unshift(logEntry);
    if (broadcastLogs.length > 50) broadcastLogs.pop();

    const baseUrl = `http://127.0.0.1:${process.env.PORT || 3000}`;
    fetch(`${baseUrl}/api/intelligence/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "SCHEDULED_YIELD_ALERT_BROADCAST_25M",
        ledgerData: logEntry,
        wallet: TARGET_WALLET,
        activeKey: ACTIVE_AUTH_KEY
      })
    }).catch(() => {});
  } catch (err) {
    console.warn("[Scheduler Alert Error]:", err);
  }
});

// 3. Bot 3: Generates Social Sharing Cards (TikTok, X, FB, WhatsApp, Telegram)
export function generateShareableCard(userId: string = "vip_guest") {
  const referralLink = `${MINI_APP_LINK}?startapp=ref_${userId}`;
  const shareText = `🔥 Complete quick quizzes and earn TON/USDT directly to your Telegram Wallet!`;

  return {
    shareText,
    referralLink,
    socialUrls: {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + referralLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      tiktok: `https://www.tiktok.com/tag/sreymara?referral=${encodeURIComponent(referralLink)}`
    }
  };
}

export function getSchedulerStatus() {
  return {
    active: true,
    targetWallet: TARGET_WALLET,
    miniAppLink: MINI_APP_LINK,
    schedules: [
      { name: "3-Minute Multi-Chain Micro-Payout", cron: "*/3 * * * *", interval: "Every 3 Minutes", status: "RUNNING", channels: ["TON", "USDT Jetton", "GRAM", "TRC-20 USDT"] },
      { name: "Quiz Broadcast", cron: "*/15 * * * *", interval: "Every 15 Minutes", status: "RUNNING" },
      { name: "Reward Alert Broadcast", cron: "*/25 * * * *", interval: "Every 25 Minutes", status: "RUNNING" }
    ],
    recentLogs: broadcastLogs.slice(0, 10)
  };
}
