import express from "express";
import {
  processVoucherRedemption,
  batchGenerateVouchers,
  getActiveVouchers,
  getVoucherStats
} from "../src/services/voucherEngine.ts";

const router = express.Router();

// 20 Supported Multi-Channel Redemption Mappings
export const REDEMPTION_CHANNELS = [
  { id: "MINI_APP_NATIVE_WALLET", name: "1. Telegram Mini App Native Wallet", icon: "📱" },
  { id: "EXTERNAL_NON_CUSTODIAL_WALLET", name: "2. External Non-Custodial Wallets (Tonkeeper/MyTonWallet/Trust)", icon: "💎" },
  { id: "TELEGRAM_STARS_CONVERSION", name: "3. Telegram Stars In-App Conversion", icon: "⭐" },
  { id: "TELEGRAM_BOT_COMMAND", name: "4. Telegram Bot Chat Command Claim (/claim)", icon: "🤖" },
  { id: "DIRECT_WEB_PORTAL", name: "5. Direct Web Portal / Universal Gateway", icon: "🌐" },
  { id: "WHATSAPP_SCRM_WAPLUS", name: "6. WhatsApp SCRM / WAPlus Automated Bot Payouts", icon: "💬" },
  { id: "EMAIL_AUTOMATED_CLAIM", name: "7. Email Automated Reward Claim Links (Nodemailer)", icon: "✉️" },
  { id: "ADSGRAM_MEGAGRAN_REWARD", name: "8. AdsGram / Megagran Instant Rewarded Ads Cash-out", icon: "🎬" },
  { id: "VAULT_STAKING_INJECTION", name: "9. Liquid Deposit Yield Injection (Direct APY Pool)", icon: "🪙" },
  { id: "RETAIL_PHYSICAL_PRINT_QR", name: "10. Retail / Physical Paper Print QR Code Scanner", icon: "📷" },
  { id: "B2B_WHITE_LABEL_WHOLESALE", name: "11. B2B White-Label Merchant Gift Card API", icon: "🏷️" },
  { id: "VIRAL_LINKDROP_EVENT", name: "12. Viral Telegram LinkDrop / Group Event Drops", icon: "🚀" },
  { id: "CROSS_PLATFORM_IFRAME_SDK", name: "13. Cross-Platform iFrame / Embedded Web SDK Widget", icon: "🔲" },
  { id: "GASLESS_RELAYER_PAYOUT", name: "14. Gasless Relayer Network Payouts (Sponsored Gas)", icon: "⛽" },
  { id: "FIAT_OFFRAMP_PARTNER", name: "15. Direct Fiat-to-Crypto Partner Off-Ramp Bridge", icon: "🏦" },
  { id: "BYBIT_MARGIN_LIQUIDITY", name: "16. Bybit Institutional Margin Liquidity Voucher Injection", icon: "📈" },
  { id: "AI_QUEEN_VOICE_COMMAND", name: "17. AI Sreymara Queen Interactive Voice Command Voucher Unlock", icon: "👑" },
  { id: "CELESTIAL_CINEMA_WATCH_EARN", name: "18. Celestial Cinema Watch-To-Earn Episode Voucher Drop", icon: "🍿" },
  { id: "CROSS_BORDER_WIRE_BRIDGE", name: "19. Cross-Border ACH/Wire Fiat Cash-out Voucher Bridge", icon: "💳" },
  { id: "MICRO_STAKING_NFT_FUSION", name: "20. Micro-Staking NFT Collectible Pass Voucher Fusion", icon: "🖼️" }
];

/**
 * 1. Primary Redemption Endpoint: POST /api/v1/redeem-voucher
 */
router.post("/v1/redeem-voucher", async (req, res) => {
  try {
    const { voucherCode, recipientAddress, channel, additionalMeta } = req.body || {};

    if (!voucherCode) {
      return res.status(400).json({ success: false, message: "Missing required parameter: voucherCode." });
    }

    const result = await processVoucherRedemption(
      voucherCode,
      recipientAddress || "UQBLz9rXINTlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVIbnBJ",
      channel || "MINI_APP_NATIVE_WALLET",
      additionalMeta || {}
    );

    if (result.success) {
      return res.json({ success: true, ...result });
    } else {
      return res.status(400).json({ success: false, ...result });
    }
  } catch (err: any) {
    console.error("[Voucher Router Error]:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Internal server error during voucher redemption."
    });
  }
});

/**
 * 2. Manual Batch Voucher Generation: POST /api/v1/generate-vouchers
 */
router.post("/v1/generate-vouchers", (req, res) => {
  try {
    const { count = 10, amount = 2.00, currency = "USDT", campaignId = "MANUAL_ADMIN_BATCH" } = req.body || {};
    const generated = batchGenerateVouchers(Number(count), Number(amount), currency, campaignId);
    return res.json({
      success: true,
      count: generated.length,
      vouchers: generated
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || "Batch generation failed." });
  }
});

/**
 * 3. List Active Redeemable Vouchers: GET /api/v1/vouchers/active
 */
router.get("/v1/vouchers/active", (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const vouchers = getActiveVouchers(limit);
    return res.json({ success: true, count: vouchers.length, vouchers });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to fetch active vouchers." });
  }
});

/**
 * 4. Voucher Engine Stats & 20 Channels: GET /api/v1/vouchers/stats
 */
router.get("/v1/vouchers/stats", (req, res) => {
  try {
    const stats = getVoucherStats();
    return res.json({
      success: true,
      stats,
      channels: REDEMPTION_CHANNELS
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to fetch stats." });
  }
});

/**
 * 5. Channel-Specific Redemption Trigger: POST /api/v1/channel-redeem/:channelId
 */
router.post("/v1/channel-redeem/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { voucherCode, recipientAddress } = req.body || {};

    const matchedChannel = REDEMPTION_CHANNELS.find(c => c.id.toLowerCase() === channelId.toLowerCase());
    const channelName = matchedChannel ? matchedChannel.id : "MINI_APP_NATIVE_WALLET";

    const result = await processVoucherRedemption(
      voucherCode,
      recipientAddress || "UQBLz9rXINTlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVIbnBJ",
      channelName
    );

    return res.json({ success: result.success, channel: channelName, ...result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || "Channel redemption failed." });
  }
});

export default router;
