// src/hooks/useSupabaseData.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

const FLAG_MAP: Record<string, string> = {
  AR: '🇦🇷', BR: '🇧🇷', FR: '🇫🇷', ES: '🇪🇸', DE: '🇩🇪',
  PT: '🇵🇹', NL: '🇳🇱', MX: '🇲🇽', US: '🇺🇸', CA: '🇨🇦',
  UY: '🇺🇾', CO: '🇨🇴', JP: '🇯🇵', KR: '🇰🇷', MA: '🇲🇦',
  SN: '🇸🇳', HR: '🇭🇷', BE: '🇧🇪', CH: '🇨🇭', NO: '🇳🇴',
  SE: '🇸🇪', PL: '🇵🇱', UZ: '🇺🇿', SA: '🇸🇦', EG: '🇪🇬',
  IR: '🇮🇷', AU: '🇦🇺', NZ: '🇳🇿', GH: '🇬🇭', PA: '🇵🇦',
  EC: '🇪🇨', PY: '🇵🇾', TR: '🇹🇷', AT: '🇦🇹', DZ: '🇩🇿',
  JO: '🇯🇴', QA: '🇶🇦', BA: '🇧🇦', CZ: '🇨🇿', ZA: '🇿🇦',
  CI: '🇨🇮', TN: '🇹🇳', CV: '🇨🇻', CD: '🇨🇩', HT: '🇭🇹',
  CW: '🇨🇼', 'GB-SCT': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'GB-ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
}

// ── Jugadores ──────────────────────────────────────────────
export function usePlayers() {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: nationsData } = await supabase
        .from('nations')
        .select('id, name, flag_emoji, group_name')

      const { data: playersData, error } = await supabase
        .from('players')
        .select('id, nation_id, name, position, value, goals, assists, yellow_cards, red_cards')
        .order('value', { ascending: false })

      if (error) console.error('Error:', error)

      if (playersData && nationsData) {
        const nationsMap: Record<string, any> = {}
        nationsData.forEach(n => { nationsMap[n.id] = n })

        const merged = playersData.map(p => ({
          ...p,
          nations: nationsMap[p.nation_id] ? {
          ...nationsMap[p.nation_id],
          flag_emoji: FLAG_MAP[nationsMap[p.nation_id].flag_emoji] || '🏳️',
          flag_code: nationsMap[p.nation_id].flag_emoji?.toLowerCase()
        } : null
        }))
        setPlayers(merged)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  return { players, loading }
}

// ── Ranking ────────────────────────────────────────────────
export function useRanking() {
  const [ranking, setRanking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, username, avatar_url, total_points, fantasy_points, prode_points,
          clubs ( name, primary_color, secondary_color, shield_type )
        `)
        .order('total_points', { ascending: false })
        .limit(50)

      if (!error && data) setRanking(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return { ranking, loading }
}

// ── Partidos + Prode ───────────────────────────────────────
export function useProde(userId: string | null) {
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: matchData } = await supabase
        .from('matches')
        .select(`
          id, match_date, status, home_score, away_score, round,
          home_nation:nations!matches_home_nation_id_fkey ( id, name, flag_emoji ),
          away_nation:nations!matches_away_nation_id_fkey ( id, name, flag_emoji )
        `)
        .order('match_date', { ascending: true })

      if (matchData) setMatches(matchData)

      if (userId) {
        const { data: predData } = await supabase
          .from('prode_predictions')
          .select('match_id, home_pred, away_pred, points, result_type')
          .eq('user_id', userId)

        if (predData) {
          const map: Record<string, any> = {}
          predData.forEach((p: any) => { map[p.match_id] = p })
          setPredictions(map)
        }
      }

      setLoading(false)
    }
    fetchData()
  }, [userId])

  async function savePrediction(matchId: string, home: number, away: number) {
    if (!userId) return
    const { error } = await supabase
      .from('prode_predictions')
      .upsert({
        user_id: userId,
        match_id: matchId,
        home_pred: home,
        away_pred: away,
      }, { onConflict: 'user_id,match_id' })

    if (!error) {
      setPredictions(prev => ({
        ...prev,
        [matchId]: { ...prev[matchId], home_pred: home, away_pred: away }
      }))
    }
    return !error
  }

  return { matches, predictions, loading, savePrediction }
}