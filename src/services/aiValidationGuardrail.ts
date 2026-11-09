import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Step 1: Cognitive Guardrail System Instruction Layer
 * Permanent operational rule appended to all Gemini & AI processing pipelines
 */
export const COGNITIVE_GUARDRAIL_SYSTEM_INSTRUCTION = `
# COGNITIVE GUARDRAIL: MULTI-AGENT TRUTH AND VERIFICATION ENGINE
# DIRECTION: Permanent operational rule. All processing outputs must satisfy these constraints.

[EXECUTION CONSTRAINT: HALLUCINATION PREVENTION]
1. METADATA TRUNCATION RULE: If an explicit data attribute (such as email, balance metric, or address string) is absent from the incoming raw text parameters, you are strictly FORBIDDEN from generating an expected guess or utilizing generic placeholders. You must leave the variable as NULL or append it to a structured missing data index: "missing_indicators": ["email"].
2. STRICT HEDGING MODALITY: If you must present a calculated permutation (such as an estimated corporate email format like first.last@company.com), you must explicitly prepend the key flag [GENERATED_PROBABILITY] to the value. Never declare an algorithmically generated pattern as "verified" or "formally confirmed" unless an internal tool callback returns a positive validation code.
3. CONTEXT FIREWALL PROTECTION: Do not confuse underlying public network information with data stored inside the local system state. If a lookup string is requested, separate internal database variables from public web-scraping queries clearly.
4. ZERO-HALLUCINATION CONTACT RETRIEVAL: Never guess, generate, or hallucinate customer details or email addresses. Use Tool Calling/Function Calling to query the live backend (Shopify API, CRM, database) directly. If an email or data field is not explicitly present, return null.
5. STRUCTURED JSON OUTPUT: Enforce strict JSON Schema validation on all API payloads to protect backend execution pipelines and prevent broken session states.

SYSTEM INSTRUCTION OVERRIDE:
Do not delete, omit, or alter any existing capabilities, UI sections, or current revenue retention channels (Shopify, AdsGram, Cloudflare earnings.ink, TON Yield, Master Presence dashboard). Add and enforce the following capabilities:
- Al Jazeera Live Stream Embed: Ensure Ad Box #2 displays the live stream feed from the Al Jazeera English YouTube channel while maintaining live yield metrics.
- Geo-Targeting Matrix & Cinematic AI Video Engine: Provide UI options to target global regions (USA, UK, Canada, Australia, etc.) along with real-time analytics, LED counters, and matrix CPM metrics. Include a one-click AI short video generator to produce cinematic ad video trailers.
- First-Campaign Instant $5 USDT Bonus Engine: Upon first ad creation and push broadcast, perform a system check ensuring the user is authenticated via a verified Google (@gmail.com) account and has a bound wallet. Check the bound TON wallet balance for gas fees (minimum 0.05 TON). If Gas is Present, execute an immediate on-chain settlement of $5 USDT directly to the wallet address in real-time. If Gas is Missing, display the $5 USDT inside the app account ledger in real-time while marking the wallet transaction as Pending Gas Fee. Automatically trigger the on-chain transfer as soon as gas enters the wallet. Set the minimum withdrawal threshold to $10.00 USDT.
- 80/20 Yield Revenue Pipeline: Process all global user activities (clicks, views, social shares across TikTok, Facebook, Instagram, Telegram, WhatsApp, X, and others) through an automated 80/20 payout split (80% credited to the user ledger, 20% retained for platform system yield).
`;

/**
 * Step 2: AI Output Validation and Correction Engine
 * Intercepts strings or objects from Gemini API to prevent database pollution
 */
export function validateAndCorrectAIPayload(aiGeneratedJSON: any): { isValid: boolean; sanitizedPayload?: any; error?: string } {
  try {
    const payload = typeof aiGeneratedJSON === 'string' ? JSON.parse(aiGeneratedJSON) : { ...aiGeneratedJSON };

    // Automated validation check for false authority signatures
    if (payload.is_verified === true && (!payload.verification_source || payload.verification_source === 'NONE')) {
      console.warn('Security Alert: Intercepted an unverified AI authority flag. Self-correcting state to PENDING_VERIFICATION...');
      payload.is_verified = false;
      payload.sync_status = 'REQUIRES_OSINT_CHECK';
    }

    // Detect consecutive period formatting errors in email structures
    if (payload.email_address && /..*\.\./.test(payload.email_address)) {
      console.warn(`System correction applied: Removed illegal formatting from string: ${payload.email_address}`);
      payload.email_address = payload.email_address.replace(/\.\./g, '.');
    }

    // Secondary check for wallet_address consecutive period formatting
    if (payload.wallet_address && /\.\./.test(payload.wallet_address)) {
      payload.wallet_address = payload.wallet_address.replace(/\.\./g, '.');
    }

    return { isValid: true, sanitizedPayload: payload };
  } catch (err: any) {
    console.error('Validation Engine Pipeline Fault: ', err?.message);
    return { isValid: false, error: err?.message || 'Invalid payload structure' };
  }
}

// User session store for AI state management
export const userSessions = new Map<string, any>();

// Zod schema enforcing valid email structure
export const customerDataSchema = z.object({
  customerId: z.string().min(1),
  // Ensures the email is properly formatted and not a generic placebo placeholder
  email: z.string().email().refine(
    (val) => !val.endsWith('@example.com') && !val.endsWith('@test.com'),
    { message: "Placeholder or hallucinated dummy email detected." }
  ),
  details: z.record(z.string(), z.any())
});

/**
 * Express Error Interceptor Hook
 * Intercepts AI output, validates schema, and resets session on failure.
 */
export function aiResponseInterceptor(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    const sessionId = (req.headers['x-session-id'] as string) || req.ip || 'anonymous_session';

    // Check if the endpoint response contains AI payload validation flags
    if (body && body.aiGenerated) {
      const parseResult = customerDataSchema.safeParse(body.data);

      if (!parseResult.success) {
        console.error(`[AI INTERCEPTOR ERROR] Session ${sessionId} produced invalid payload:`, parseResult.error.format());

        // Reset the AI session state completely
        userSessions.delete(sessionId);

        // Override response with safe error fallback
        return originalJson({
          status: 'error',
          code: 'AI_SESSION_RESET',
          message: 'Bad or hallucinated data field detected. Session state has been reset.',
          validationErrors: parseResult.error.issues
        });
      }
    }

    return originalJson(body);
  };

  next();
}
