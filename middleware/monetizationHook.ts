// middleware/monetizationHook.ts

export const PRIMARY_TON_PAYOUT_ADDRESS = "UQAUc97F293041920384729103948572910293";
export const QUERY_YIELD_USDT = 0.05; // Base per-query earning trigger
export const ACTIVE_AUTH_KEY = "5dd2...ecb2";

export interface SearchYieldTransactionRecord {
  txId: string;
  network: "TON";
  type: string;
  amount: number;
  currency: string;
  destination: string;
  timestamp: string;
  integrity: string;
}

export async function processSearchYield(req?: any, res?: any, next?: any) {
  try {
    const searchResult = typeof next === "function" ? await next() : null;

    const transactionRecord: SearchYieldTransactionRecord = {
      txId: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      network: "TON",
      type: "AI_SEARCH_MICRO_EARNING",
      amount: QUERY_YIELD_USDT,
      currency: "USDT",
      destination: PRIMARY_TON_PAYOUT_ADDRESS,
      timestamp: new Date().toISOString(),
      integrity: "VERIFIED"
    };

    const baseUrl = typeof window !== "undefined"
      ? ""
      : `http://127.0.0.1:${process.env.PORT || 3000}`;

    try {
      if (typeof fetch === "function") {
        await fetch(`${baseUrl}/api/intelligence/telemetry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "QUERY_MONETIZATION_EVENT",
            ledgerData: transactionRecord,
            activeKey: ACTIVE_AUTH_KEY,
            wallet: PRIMARY_TON_PAYOUT_ADDRESS,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.warn("Ledger telemetry sync warning:", err));
      }
    } catch (telemetryErr) {
      console.warn("Ledger telemetry sync error caught:", telemetryErr);
    }

    return searchResult;
  } catch (error) {
    console.error("Monetization middleware error:", error);
  }
}
