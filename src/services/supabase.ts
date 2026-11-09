import type { ExecutionState } from '../types/agent.ts';

// In-memory durable checkpoint store with optional persistent backing
const inMemoryRuns = new Map<string, ExecutionState>();

export class DurableStateManager {
  static async saveCheckpoint(state: ExecutionState): Promise<void> {
    try {
      state.lastCheckpoint = new Date().toISOString();
      inMemoryRuns.set(state.runId, { ...state, memoryDump: { ...state.memoryDump } });
      
      // If Supabase credentials exist, upsert asynchronously
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        // Optional Supabase persistence hook
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
          );
          await supabase.from('agent_runs').upsert({
            id: state.runId,
            user_id: state.userId,
            status: state.status,
            loop_count: state.loopCount,
            max_loops: state.maxLoops,
            memory_dump: state.memoryDump,
            updated_at: state.lastCheckpoint
          });
        } catch (dbErr) {
          console.warn('[DURABLE STATE] Supabase sync warning (operating on local durable state):', dbErr);
        }
      }
    } catch (err) {
      console.error(`[CRITICAL] Checkpoint save failed for run ${state.runId}:`, err);
    }
  }

  static async fetchActiveRun(runId: string): Promise<ExecutionState | null> {
    try {
      if (inMemoryRuns.has(runId)) {
        return inMemoryRuns.get(runId) || null;
      }

      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
          );
          const { data, error } = await supabase
            .from('agent_runs')
            .select('*')
            .eq('id', runId)
            .single();

          if (!error && data) {
            const state: ExecutionState = {
              runId: data.id,
              userId: data.user_id,
              status: data.status,
              loopCount: data.loop_count,
              maxLoops: data.max_loops,
              memoryDump: data.memory_dump || {},
              lastCheckpoint: data.updated_at
            };
            inMemoryRuns.set(state.runId, state);
            return state;
          }
        } catch (e) {
          console.warn('[DURABLE STATE] Supabase fetch fallback to memory:', e);
        }
      }
    } catch (err) {
      console.error(`[DURABLE STATE] Error fetching run ${runId}:`, err);
    }
    return null;
  }

  static async listAllRuns(): Promise<ExecutionState[]> {
    return Array.from(inMemoryRuns.values()).sort((a, b) => 
      new Date(b.lastCheckpoint).getTime() - new Date(a.lastCheckpoint).getTime()
    );
  }
}

export async function getSupabaseClient() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    } catch (e) {
      return null;
    }
  }
  return null;
}

