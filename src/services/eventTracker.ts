/**
 * Client-Side Event-Tracking System
 * Logs user interactions securely and non-obstructively.
 * Transmits event telemetry in real-time to backend for micro-earnings calculation.
 */

export interface TrackedEventPayload {
  eventType: "click" | "page_view" | "ad_view" | "bot_message" | "wallet_interaction" | "duration_pulse";
  elementId?: string;
  actionName: string;
  metadata?: Record<string, any>;
  timestamp: string;
  sessionId: string;
}

export interface MicroEarningAccrual {
  eventId: string;
  eventType: string;
  grossAmountUsdt: number;
  platformShare80: number;
  userShare20: number;
  fixedPlatformRoyalty: number;
  netUserPayoutUsdt: number;
  newBalanceUsdt: number;
  timestamp: string;
}

export class ClientEventTracker {
  private static instance: ClientEventTracker;
  private sessionId: string;
  private queue: TrackedEventPayload[] = [];
  private isFlushing: boolean = false;
  private onMicroEarningCallback?: (earning: MicroEarningAccrual) => void;

  private constructor() {
    this.sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    this.initGlobalListeners();
    this.startPeriodicPulse();
  }

  public static getInstance(): ClientEventTracker {
    if (!ClientEventTracker.instance) {
      ClientEventTracker.instance = new ClientEventTracker();
    }
    return ClientEventTracker.instance;
  }

  public setOnMicroEarning(callback: (earning: MicroEarningAccrual) => void) {
    this.onMicroEarningCallback = callback;
  }

  private initGlobalListeners() {
    if (typeof window === "undefined") return;

    // Non-obstructive passive click listener
    window.addEventListener(
      "click",
      (e) => {
        try {
          const target = e.target as HTMLElement | null;
          if (!target) return;
          const button = target.closest("button, a, input, select");
          if (button) {
            const elementId = button.id || button.getAttribute("name") || button.textContent?.trim().slice(0, 30);
            this.trackEvent({
              eventType: "click",
              elementId: elementId || "unknown_button",
              actionName: `Clicked: ${elementId || button.tagName}`,
              metadata: {
                tagName: button.tagName,
                className: button.className?.toString().slice(0, 50)
              },
              timestamp: new Date().toISOString(),
              sessionId: this.sessionId
            });
          }
        } catch (err) {
          // Never obstruct UI
        }
      },
      { passive: true }
    );
  }

  private startPeriodicPulse() {
    if (typeof window === "undefined") return;

    // Send a pulse every 45 seconds for active session engagement micro-yields
    setInterval(() => {
      this.trackEvent({
        eventType: "duration_pulse",
        actionName: "Active Session Duration Accrual",
        metadata: {
          activeTab: window.location.hash || "home",
          url: window.location.pathname
        },
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      });
    }, 45000);
  }

  public trackEvent(event: TrackedEventPayload) {
    this.queue.push(event);
    this.flush();
  }

  private async flush() {
    if (this.isFlushing || this.queue.length === 0) return;
    this.isFlushing = true;

    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      const res = await fetch("/api/events/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: eventsToSend })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.accruals && Array.isArray(data.accruals)) {
          data.accruals.forEach((accrual: MicroEarningAccrual) => {
            if (this.onMicroEarningCallback) {
              this.onMicroEarningCallback(accrual);
            }
          });
        }
      }
    } catch (err) {
      // Re-queue non-fatally
      this.queue.unshift(...eventsToSend);
    } finally {
      this.isFlushing = false;
    }
  }
}

export const eventTracker = ClientEventTracker.getInstance();
