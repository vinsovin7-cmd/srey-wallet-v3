import express, { type Request, type Response } from "express";
import {
  getGeminiFundsState,
  executeAiDecisionCycle,
  triggerSyntheticPulse,
  retryQuarantinedTx,
  updateTollFeeConfig,
  geminiFundsEvents
} from "../src/services/geminiFundsEngine.ts";

const router = express.Router();

// 1. Full Gemini Funds State & KPI Metrics
router.get("/overview", (req: Request, res: Response) => {
  try {
    const state = getGeminiFundsState();
    res.json({
      success: true,
      state
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to get overview" });
  }
});

// 2. High-Frequency Stream Matrix
router.get("/streams", (req: Request, res: Response) => {
  try {
    const state = getGeminiFundsState();
    res.json({
      success: true,
      streams: state.activeStreams,
      gross24hUsd: state.gross24hUsd
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to get streams" });
  }
});

// 3. Live On-Chain Settlement Ticker
router.get("/ticker", (req: Request, res: Response) => {
  try {
    const state = getGeminiFundsState();
    res.json({
      success: true,
      ticker: state.ticker
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to get ticker" });
  }
});

// 4. Batch Queue
router.get("/batch-queue", (req: Request, res: Response) => {
  try {
    const state = getGeminiFundsState();
    res.json({
      success: true,
      batchQueue: state.batchQueue,
      totalPendingUsdt: state.batchQueue.reduce((acc, i) => acc + i.amountUsdt, 0)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to get batch queue" });
  }
});

// 5. Quarantine & Retry List
router.get("/quarantine", (req: Request, res: Response) => {
  try {
    const state = getGeminiFundsState();
    res.json({
      success: true,
      quarantinedList: state.quarantinedList
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to get quarantine list" });
  }
});

// 6. Retry Quarantined Transaction
router.post("/quarantine/retry", async (req: Request, res: Response) => {
  try {
    const { txId } = req.body || {};
    const result = await retryQuarantinedTx(txId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to retry tx" });
  }
});

// 7. W5 Contract Telemetry
router.get("/w5-telemetry", (req: Request, res: Response) => {
  try {
    const state = getGeminiFundsState();
    res.json({
      success: true,
      telemetry: state.w5Telemetry,
      gasEstimateTon: state.tonGasCurrentTon
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to get W5 telemetry" });
  }
});

// 8. Execute / Run AI Decision Cycle Manually
router.post("/run-ai-cycle", async (req: Request, res: Response) => {
  try {
    const { forced } = req.body || {};
    const result = await executeAiDecisionCycle(forced !== false);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to execute AI cycle" });
  }
});

// 8b. Manual Force Dispatch Endpoint (By Fire By Force - Immediate W5 Relayer Execution)
router.post("/force-dispatch", async (req: Request, res: Response) => {
  try {
    const result = await executeAiDecisionCycle(true);
    res.json({
      success: true,
      status: "SETTLED_ON_CHAIN",
      message: "Forced dispatch executed on-chain via TON W5 Gasless Relayer.",
      ...result
    });
  } catch (err: any) {
    console.error("[Force Dispatch Route Error]:", err);
    res.status(500).json({ success: false, error: err?.message || "Failed to force dispatch" });
  }
});

router.get("/force-dispatch", async (req: Request, res: Response) => {
  try {
    const result = await executeAiDecisionCycle(true);
    res.json({
      success: true,
      status: "SETTLED_ON_CHAIN",
      message: "Forced dispatch executed on-chain via TON W5 Gasless Relayer.",
      ...result
    });
  } catch (err: any) {
    console.error("[Force Dispatch Route Error]:", err);
    res.status(500).json({ success: false, error: err?.message || "Failed to force dispatch" });
  }
});

// 9. Simulate Synthetic Pulse
router.post("/simulate-pulse", async (req: Request, res: Response) => {
  try {
    const { streamId, amount } = req.body || {};
    const result = await triggerSyntheticPulse(streamId || "stream_adsgram", parseFloat(amount) || 15.00);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to simulate pulse" });
  }
});

// 10. Update Platform Toll Fee Slicing (1.5% - 3.5%)
router.post("/update-slicing", (req: Request, res: Response) => {
  try {
    const { tollFeePercentage } = req.body || {};
    const updated = updateTollFeeConfig(parseFloat(tollFeePercentage) || 2.5);
    res.json({
      success: true,
      tollFeePercentage: updated,
      message: `Toll fee slicing updated to ${updated}%`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to update slicing" });
  }
});

// 11. SSE Live Telemetry Stream
router.get("/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (payload: any) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  // Send initial state
  sendEvent({
    event: "INIT_STATE",
    data: getGeminiFundsState()
  });

  const listener = (payload: any) => {
    sendEvent(payload);
  };

  geminiFundsEvents.on("settlement_event", listener);

  // Heartbeat ping every 15s
  const interval = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(interval);
    geminiFundsEvents.removeListener("settlement_event", listener);
  });
});

export default router;
