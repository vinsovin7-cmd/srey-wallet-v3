// bots/autoReplyEngine.ts
import { Telegraf, Markup } from 'telegraf';
import { isAddressQuarantined } from '../src/services/securityQuarantine.ts';

// RESTORED: Telegraf Bot Token for @Geminisreybot
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.PROCESS_ENV_BOT_TOKEN || "8513756424:AAFBTFeIiQA5fglLOz4HXxSixylSwGjGsgA";
export const WEB_APP_URL = "https://ais-pre-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app";
export const LANDING_URL = "https://ais-pre-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app";
export const MINI_APP_URL = "https://t.me/gemini_srey_bot/sreymara";
export const MINI_APP_ALT_URL = "https://t.me/Geminisreybot/sreymara";
export const ACTIVE_KEY = "5dd2...ecb2";

export let bot: Telegraf | null = null;
export let isBotActive: boolean = false;

if (BOT_TOKEN) {
  try {
    bot = new Telegraf(BOT_TOKEN);
    isBotActive = true;

    // Handle all incoming messages across channels and chats
    bot.on('message', async (ctx: any) => {
      // Avoid responding to own bot outputs
      if (ctx.from && ctx.from.is_bot) return;

      const replyText = "🎯 **New High-Yield Challenge & Sreymara Ecosystem Active!**\nChoose an option below to engage and claim USDT rewards directly to your Telegram Wallet:";

      const inlineKeyboard = Markup.inlineKeyboard([
        [
          // CRITICAL: webApp button requires the direct HTTPS web URL, NOT a t.me link
          Markup.button.webApp("➡️ Open Web App", WEB_APP_URL),
          Markup.button.callback("⏭️ Next / Quick Claim", "ACTION_NEXT_CLAIM")
        ],
        [
          Markup.button.url("⚡ Open Telegram Mini App", MINI_APP_URL)
        ]
      ]);

      await ctx.reply(replyText, { parse_mode: 'Markdown', ...inlineKeyboard }).catch((err: any) => {
        console.warn("[Telegraf] Bot message reply warning:", err?.message || err);
      });
    });

    // Callback handler for "Next / Quick Claim" button
    bot.action("ACTION_NEXT_CLAIM", async (ctx: any) => {
      await ctx.answerCbQuery("Processing micro-yield allocation...").catch(() => {});

      const userWallet = ctx.from?.username || ctx.from?.id ? `tg_user_${ctx.from?.id}` : "active_user_wallet";
      
      // Security Check: Block quarantined attacker addresses
      if (isAddressQuarantined(userWallet)) {
        console.warn(`[SECURITY INTERCEPT] Quarantined address attempted ACTION_NEXT_CLAIM: ${userWallet}`);
        return;
      }

      const baseUrl = `http://127.0.0.1:${process.env.PORT || 3000}`;

      // Trigger real-time ledger dispatch for "Next" interaction
      await fetch(`${baseUrl}/api/intelligence/telemetry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "INTERACTION_NEXT_BUTTON_CLICK",
          wallet: userWallet,
          yieldUSDT: 1.00,
          activeKey: ACTIVE_KEY,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.warn("Next button telemetry warning:", err?.message || err));

      await ctx.reply(`✅ Micro-yield registered! Open the app to complete quests: ${MINI_APP_URL}`).catch(() => {});
    });

    console.log("[BOT ENGINE] Telegraf bot listeners successfully re-initialized and active.");
  } catch (err: any) {
    console.warn("[Telegraf] AutoReplyEngine initialization warning:", err?.message || err);
  }
}

/**
 * Programmatic execution & simulation helper for the Dual-Button Engine
 */
export async function executeNextClaim(customWallet?: string) {
  // Security Quarantine check: strictly reject compromised attacker addresses
  if (customWallet && isAddressQuarantined(customWallet)) {
    console.warn("[SECURITY INTERCEPT] executeNextClaim blocked for quarantined address:", customWallet);
    return {
      event: "BLOCKED_SECURITY_QUARANTINE",
      status: "BLOCKED",
      message: "Security quarantine active. Transaction blocked for compromised wallet."
    };
  }

  const activeWallet = customWallet || "valid_user_connected_wallet";

  const result = {
    event: "INTERACTION_NEXT_BUTTON_CLICK",
    wallet: activeWallet,
    yieldUSDT: 1.00,
    activeKey: ACTIVE_KEY,
    timestamp: new Date().toISOString(),
    status: "PROCESSED",
    redirectUrl: MINI_APP_URL
  };

  const baseUrl = typeof window !== "undefined" ? "" : `http://127.0.0.1:${process.env.PORT || 3000}`;

  await fetch(`${baseUrl}/api/intelligence/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result)
  }).catch(err => console.warn("Dual button telemetry sync error:", err?.message || err));

  return result;
}
