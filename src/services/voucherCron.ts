import cron from "node-cron";
import { batchGenerateVouchers, getVoucherStats } from "./voucherEngine.ts";

let isCronRunning = false;
let cronTask: any = null;

/**
 * Initialize 10-Minute Automated Voucher Generation Cron Job
 * Interval: Every 10 minutes
 */
export function startVoucherCronJob() {
  if (isCronRunning) {
    console.log("[Voucher Cron] Worker is already active and running.");
    return;
  }

  console.log("[Voucher Cron] Starting 10-Minute Automated Voucher Generator (Cron: '*/10 * * * *')...");

  // Initial immediate seeding on server start so vouchers are ready instantly
  try {
    batchGenerateVouchers(5, 2.50, "USDT", "SERVER_STARTUP_SEED");
    batchGenerateVouchers(3, 0.50, "TON", "SERVER_STARTUP_TON_SEED");
  } catch (e) {
    console.warn("[Voucher Cron] Initial seed note:", e);
  }

  // Schedule recurring 10-minute worker
  cronTask = cron.schedule("*/10 * * * *", () => {
    console.log(`[Voucher Cron ⏰ ${new Date().toISOString()}] Executing 10-minute voucher generation pulse...`);
    try {
      // 1. Generate 5 random USDT vouchers ($1.00 - $5.00)
      const usdtAmount = Number((Math.random() * 4 + 1).toFixed(2));
      batchGenerateVouchers(5, usdtAmount, "USDT", "10MIN_CRON_USDT_POOL");

      // 2. Generate 3 random TON vouchers (0.2 - 1.0 TON)
      const tonAmount = Number((Math.random() * 0.8 + 0.2).toFixed(2));
      batchGenerateVouchers(3, tonAmount, "TON", "10MIN_CRON_TON_POOL");

      // 3. Generate 2 Telegram Stars vouchers
      batchGenerateVouchers(2, 100, "STARS", "10MIN_CRON_STARS_POOL");

      const stats = getVoucherStats();
      console.log(`[Voucher Cron Success] Total Vouchers in Ledger: ${stats.totalGenerated} | Active: ${stats.totalActive}`);
    } catch (err) {
      console.error("[Voucher Cron Error]:", err);
    }
  });

  isCronRunning = true;
}

/**
 * Stop cron worker
 */
export function stopVoucherCronJob() {
  if (cronTask) {
    cronTask.stop();
    isCronRunning = false;
    console.log("[Voucher Cron] Worker stopped.");
  }
}
