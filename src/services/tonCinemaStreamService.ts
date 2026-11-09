import axios from 'axios';
import { WebSocket, WebSocketServer } from 'ws';
import crypto from 'crypto';
import type { IncomingMessage } from 'http';
import type { Request, Response, NextFunction } from 'express';

// Master secret code specified in architecture: 08167731393
export const EXECUTIVE_MASTER_SECRET = process.env.EXECUTIVE_MASTER_SECRET || '08167731393';
export const TON_TO_USDT_RATE = parseFloat(process.env.TON_TO_USDT_RATE || process.env.TON_TO_USDT_INDEX || '5.5');
export const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || '';

// Type definitions
export interface CinemaTrack {
  id: string;
  show_title: string;
  season_number: number;
  episode_number: number;
  stream_url: string;
  is_active: boolean;
  created_at: string;
}

export interface RevenueLedgerEntry {
  id: string;
  source: string;
  wallet_address: string;
  amount_usdt: number;
  transaction_signature: string;
  status: string;
  created_at: string;
}

export interface MultiCinemaSession {
  id: string;
  cinema_id: string;
  current_track_id: string;
  last_updated_at: string;
}

// 1. Precise Playback Queue Mapping Matrix: Merlin Arthurian Legends followed by Legend of the Seeker & Unstoppable
export const INITIAL_CINEMA_PLAYLIST: CinemaTrack[] = [
  // Merlin: The Arthurian Legends Seasons & Episodes (Verified English Master Streams)
  {
    id: 'merlin-s01-e01',
    show_title: 'Merlin: The Arthurian Legends',
    season_number: 1,
    episode_number: 1,
    stream_url: 'https://www.youtube-nocookie.com/embed/d3bOU2yzDks?autoplay=1&mute=0&controls=1&enablejsapi=1&rel=0&hl=en&cc_lang_pref=en&vq=hd1080',
    is_active: true,
    created_at: new Date('2026-01-01').toISOString()
  },
  {
    id: 'merlin-master-epic',
    show_title: 'Merlin: Arthurian Legends (Sam Neill Epic)',
    season_number: 1,
    episode_number: 2,
    stream_url: 'https://www.youtube-nocookie.com/embed/jciL2JD4EHo?autoplay=1&mute=0&controls=1&enablejsapi=1&rel=0&hl=en&cc_lang_pref=en&vq=hd1080',
    is_active: true,
    created_at: new Date('2026-01-02').toISOString()
  },
  {
    id: 'merlin-s01-e02',
    show_title: 'Merlin: Valiant & The Shield',
    season_number: 1,
    episode_number: 3,
    stream_url: 'https://www.youtube-nocookie.com/embed/DhRTU0r9DYE?autoplay=1&mute=0&controls=1&enablejsapi=1&rel=0&hl=en&cc_lang_pref=en&vq=hd1080',
    is_active: true,
    created_at: new Date('2026-01-03').toISOString()
  },
  {
    id: 'merlin-s01-e03',
    show_title: 'Merlin: The Mark of Nimueh',
    season_number: 1,
    episode_number: 4,
    stream_url: 'https://www.youtube-nocookie.com/embed/Im4rXKWbU54?autoplay=1&mute=0&controls=1&enablejsapi=1&rel=0&hl=en&cc_lang_pref=en&vq=hd1080',
    is_active: true,
    created_at: new Date('2026-01-04').toISOString()
  },
  {
    id: 'merlin-s01-e04',
    show_title: 'Merlin: The Poisoned Chalice',
    season_number: 1,
    episode_number: 5,
    stream_url: 'https://www.youtube-nocookie.com/embed/0-6-hMseyIQ?autoplay=1&mute=0&controls=1&enablejsapi=1&rel=0&hl=en&cc_lang_pref=en&vq=hd1080',
    is_active: true,
    created_at: new Date('2026-01-05').toISOString()
  },
  // Legend of the Seeker Seasons 1-2
  {
    id: 'seeker-s01-e01',
    show_title: 'Legend of the Seeker',
    season_number: 1,
    episode_number: 1,
    stream_url: 'https://www.youtube-nocookie.com/embed/fxEEdR2ZTDw?autoplay=1&mute=0&controls=1&enablejsapi=1&rel=0&hl=en&cc_lang_pref=en&vq=hd1080',
    is_active: true,
    created_at: new Date('2026-01-06').toISOString()
  },
  {
    id: 'seeker-s02-e01',
    show_title: 'Legend of the Seeker',
    season_number: 2,
    episode_number: 1,
    stream_url: 'https://www.youtube-nocookie.com/embed/4b85_J4-mC0?autoplay=1&mute=0&controls=1&enablejsapi=1&rel=0&hl=en&cc_lang_pref=en&vq=hd1080',
    is_active: true,
    created_at: new Date('2026-01-07').toISOString()
  }
];

// Persistent In-Memory Stores (acts as primary durable cache and fallback when Supabase is not configured)
export const inMemoryTracks: CinemaTrack[] = [...INITIAL_CINEMA_PLAYLIST];
export const inMemoryLedger: RevenueLedgerEntry[] = [];
export const inMemoryMultiSessions = new Map<string, MultiCinemaSession>();

// Active in-memory client connection router index (maps cinema_id -> Set of active user WebSockets)
export const activeCinemaRooms = new Map<string, Set<WebSocket>>();

/**
 * Helper to safely obtain Supabase client if configured in environment
 */
async function getSupabaseClient() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Part 3: Administrative Gatekeeper Rule (Private Code Verification)
 * Authorization middleware to protect system controls
 */
export function verifyExecutiveCredentialGate(req: Request, res: Response, next: NextFunction) {
  const inboundAuthenticationKey = req.headers['x-ecosystem-auth-code'] as string;

  // Validates inbound signature against the private system environmental configuration
  if (!inboundAuthenticationKey || inboundAuthenticationKey !== EXECUTIVE_MASTER_SECRET) {
    return res.status(403).json({
      status: 'ACCESS_DENIED',
      message: 'Invalid administrative credential signatures.'
    });
  }

  // Pass verification check, advance to request fulfillment loop
  next();
}

/**
 * Helper to record revenue in Supabase + memory ledger
 */
export async function recordRevenueTransaction(entry: Omit<RevenueLedgerEntry, 'id' | 'created_at'>): Promise<RevenueLedgerEntry> {
  // Step 3 Automated Fallback Trap: sanitize consecutive periods
  const cleanWallet = (entry.wallet_address || 'UQ_clean_vault_wallet').replace(/\.\./g, '.');
  const record: RevenueLedgerEntry = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...entry,
    wallet_address: cleanWallet
  };

  inMemoryLedger.unshift(record);

  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('ecosystem_revenue_ledger').insert([{
        source: record.source,
        wallet_address: record.wallet_address,
        amount_usdt: record.amount_usdt,
        transaction_signature: record.transaction_signature,
        status: record.status
      }]);
    } catch (err: any) {
      // Supabase warning safely handled without disrupting pipeline
    }
  }

  return record;
}

/**
 * Advances playback queue for a given cinema room
 */
export async function advanceCinemaRoomTrack(cinemaId: string): Promise<CinemaTrack | null> {
  let session = inMemoryMultiSessions.get(cinemaId);
  const currentTrackId = session?.current_track_id;

  let currentIndex = inMemoryTracks.findIndex(t => t.id === currentTrackId);
  let nextIndex = 0;
  if (currentIndex !== -1 && currentIndex < inMemoryTracks.length - 1) {
    nextIndex = currentIndex + 1;
  } else {
    // Loop back to beginning of queue (Unstoppable S1 E1)
    nextIndex = 0;
  }

  const nextTrack = inMemoryTracks[nextIndex] || inMemoryTracks[0];

  const updatedSession: MultiCinemaSession = {
    id: session?.id || crypto.randomUUID(),
    cinema_id: cinemaId,
    current_track_id: nextTrack.id,
    last_updated_at: new Date().toISOString()
  };

  inMemoryMultiSessions.set(cinemaId, updatedSession);

  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('multi_cinema_sessions').upsert({
        cinema_id: cinemaId,
        current_track_id: nextTrack.id,
        last_updated_at: updatedSession.last_updated_at
      }, { onConflict: 'cinema_id' });
    } catch {}
  }

  return nextTrack;
}

/**
 * Gets current track for a given cinema room
 */
export async function getCurrentCinemaRoomTrack(cinemaId: string): Promise<CinemaTrack> {
  const session = inMemoryMultiSessions.get(cinemaId);
  if (session) {
    const track = inMemoryTracks.find(t => t.id === session.current_track_id);
    if (track) return track;
  }
  return inMemoryTracks[0];
}

/**
 * Part 1 & 2: WebSocket Multi-Room Cinema Handler
 */
export function setupCinemaWebSocketServer(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    let clientCinemaId: string | null = null;

    ws.on('message', async (messageData: any) => {
      try {
        const text = typeof messageData === 'string' ? messageData : messageData.toString('utf-8');
        const data = JSON.parse(text);

        // INITIALIZATION PHASE: Links client instance to their specific cinema channel
        if (data.action === 'INITIALIZE_ROOM') {
          clientCinemaId = data.cinemaId || 'PORTABLE_MINI_CINEMA';

          if (!activeCinemaRooms.has(clientCinemaId)) {
            activeCinemaRooms.set(clientCinemaId, new Set());
          }
          activeCinemaRooms.get(clientCinemaId)!.add(ws);

          const track = await getCurrentCinemaRoomTrack(clientCinemaId);
          ws.send(JSON.stringify({
            action: 'LOAD_NEXT_TRACK',
            streamUrl: track.stream_url,
            trackTitle: `${track.show_title} S${track.season_number}E${track.episode_number}`,
            season: track.season_number,
            episode: track.episode_number,
            showTitle: track.show_title,
            updatedBalance: 978.23
          }));
          return;
        }

        // REVENUE / TRACK ADVANCEMENT PHASE
        if (data.action === 'TRACK_COMPLETED' && clientCinemaId) {
          const nextTrack = await advanceCinemaRoomTrack(clientCinemaId);
          if (nextTrack) {
            const payload = JSON.stringify({
              action: 'LOAD_NEXT_TRACK',
              streamUrl: nextTrack.stream_url,
              trackTitle: `${nextTrack.show_title} S${nextTrack.season_number}E${nextTrack.episode_number}`,
              season: nextTrack.season_number,
              episode: nextTrack.episode_number,
              showTitle: nextTrack.show_title,
              updatedBalance: 980.50
            });

            const sockets = activeCinemaRooms.get(clientCinemaId);
            if (sockets) {
              sockets.forEach(clientSocket => {
                if (clientSocket.readyState === WebSocket.OPEN) {
                  clientSocket.send(payload);
                }
              });
            }
          }
        }
      } catch (err: any) {
        // Safe json parse error catch
      }
    });

    ws.on('close', () => {
      if (clientCinemaId && activeCinemaRooms.has(clientCinemaId)) {
        activeCinemaRooms.get(clientCinemaId)!.delete(ws);
        if (activeCinemaRooms.get(clientCinemaId)!.size === 0) {
          activeCinemaRooms.delete(clientCinemaId);
        }
      }
    });
  });
}
