// src/hooks/useRealtime.ts
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

// ── Escuchar eventos en vivo de un partido ─────────────────
export function useMatchEvents(
  matchId: string | null,
  onNewEvent: (event: any) => void
) {
  useEffect(() => {
    if (!matchId) return

    const channel = supabase
      .channel(`match-events-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_events',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          onNewEvent(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])
}

// ── Escuchar cambios en el ranking ─────────────────────────
export function useRankingRealtime(onUpdate: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('ranking-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          onUpdate()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}

// ── Escuchar cambios en partidos (marcador en vivo) ────────
export function useMatchScore(
  matchId: string | null,
  onScoreUpdate: (match: any) => void
) {
  useEffect(() => {
    if (!matchId) return

    const channel = supabase
      .channel(`match-score-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          onScoreUpdate(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])
}