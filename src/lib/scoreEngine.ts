// src/lib/scoreEngine.ts
import { createClient } from '@/lib/supabase'

const supabase = createClient()

// ── Puntos por evento según reglamento oficial ─────────────
export const POINTS: Record<string, number> = {
  // Goles por posición
  goal_fwd:        8,
  goal_mid:        10,
  goal_def:        12,
  goal_gk:         15,
  // Otros eventos
  assist:          5,
  penalty_scored:  6,
  penalty_missed: -4,
  clean_sheet_gk:  8,
  clean_sheet_def: 6,
  penalty_saved:   12,
  yellow_card:    -2,
  red_card:       -6,
  double_yellow:  -5,
  own_goal:       -8,
  motm:           10, // figura del partido
  trivia_correct:  1,
}

// ── Calcular puntos de un evento ───────────────────────────
export function calcEventPoints(eventType: string, position: string): number {
  if (eventType === 'goal') {
    const key = `goal_${position.toLowerCase()}`
    return POINTS[key] ?? 0
  }
  return POINTS[eventType] ?? 0
}

// ── Calcular puntos totales de un jugador en un partido ────
export async function calcPlayerMatchPoints(
  playerId: string,
  matchId: string
): Promise<number> {
  const { data: events } = await supabase
    .from('match_events')
    .select('event_type, player_id, players(position)')
    .eq('match_id', matchId)
    .eq('player_id', playerId)

  if (!events) return 0

  return events.reduce((total: number, event: any) => {
    const position = event.players?.position ?? 'FWD'
    return total + calcEventPoints(event.event_type, position)
  }, 0)
}

// ── Calcular puntos de un equipo en un partido ─────────────
export async function calcTeamMatchPoints(
  teamId: string,
  matchId: string
): Promise<number> {
  // Traer jugadores del equipo
  const { data: teamPlayers } = await supabase
    .from('team_players')
    .select('player_id, is_starter, is_captain')
    .eq('team_id', teamId)

  if (!teamPlayers) return 0

  let totalPoints = 0

  for (const tp of teamPlayers) {
    const pts = await calcPlayerMatchPoints(tp.player_id, matchId)
    // Capitán duplica puntos
    const multiplier = tp.is_captain ? 2 : 1
    totalPoints += pts * multiplier
  }

  return totalPoints
}

// ── Calcular puntos del prode ──────────────────────────────
export function calcProdePoints(
  homePred: number,
  awayPred: number,
  homeReal: number,
  awayReal: number
): { points: number; resultType: 'exact' | 'correct' | 'wrong' } {
  // Resultado exacto
  if (homePred === homeReal && awayPred === awayReal) {
    return { points: 25, resultType: 'exact' }
  }

  // Ganador correcto
  const predWinner = homePred > awayPred ? 'h' : homePred < awayPred ? 'a' : 'd'
  const realWinner = homeReal > awayReal ? 'h' : homeReal < awayReal ? 'a' : 'd'

  if (predWinner === realWinner) {
    return { points: 10, resultType: 'correct' }
  }

  return { points: 0, resultType: 'wrong' }
}

// ── Actualizar puntos del prode después de un partido ──────
export async function updateProdePoints(matchId: string): Promise<void> {
  // Traer resultado real del partido
  const { data: match } = await supabase
    .from('matches')
    .select('home_score, away_score')
    .eq('id', matchId)
    .single()

  if (!match || match.home_score === null) return

  // Traer todos los pronósticos de ese partido
  const { data: predictions } = await supabase
    .from('prode_predictions')
    .select('id, user_id, home_pred, away_pred')
    .eq('match_id', matchId)

  if (!predictions) return

  // Calcular y actualizar puntos de cada pronóstico
  for (const pred of predictions) {
    const { points, resultType } = calcProdePoints(
      pred.home_pred,
      pred.away_pred,
      match.home_score,
      match.away_score
    )

    await supabase
      .from('prode_predictions')
      .update({ points, result_type: resultType })
      .eq('id', pred.id)

    // Actualizar prode_points en el perfil del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('prode_points')
      .eq('id', pred.user_id)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({ prode_points: (profile.prode_points ?? 0) + points })
        .eq('id', pred.user_id)
    }
  }
}