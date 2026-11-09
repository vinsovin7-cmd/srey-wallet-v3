import { z } from 'zod';

// Schema ensuring the LLM always returns a predictable structure
export const AgentResponseSchema = z.object({
  nextStep: z.enum(['CALL_TOOL', 'RESPOND_TO_USER', 'ERROR_FALLBACK']),
  toolName: z.string().optional(),
  toolArgs: z.record(z.string(), z.any()).optional(),
  userMessage: z.string().optional(),
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;

export interface ExecutionState {
  runId: string;
  userId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  loopCount: number;
  maxLoops: number;
  memoryDump: Record<string, any>;
  lastCheckpoint: string;
}

export interface CircuitBreakerStatus {
  failureCount: number;
  failureThreshold: number;
  isTripped: boolean;
  breakerTrippedUntil: number;
  lastFailureMessage?: string;
  totalCallsHandled: number;
  successfulCalls: number;
  fallbackCalls: number;
}
