export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  total_points: number
  fantasy_points: number
  prode_points: number
  trivia_points: number
  created_at: string
}

export interface Club {
  id: string
  user_id: string
  name: string
  shield_id: number
  primary_color: string
  secondary_color: string
  jersey_style: string
}

export interface Player {
  id: string
  nation_id: string
  name: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  value: number
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  fantasy_points: number
}

export interface Team {
  id: string
  user_id: string
  formation: string
  total_value: number
  confirmed: boolean
}

export interface Match {
  id: string
  home_nation_id: string
  away_nation_id: string
  match_date: string
  status: 'scheduled' | 'live' | 'finished'
  home_score: number
  away_score: number
  round: string
  venue: string
}

export interface League {
  id: string
  owner_id: string
  name: string
  invite_code: string
  max_members: number
}

export interface ProdeP {
  id: string
  user_id: string
  match_id: string
  predicted_home: number
  predicted_away: number
  points_earned: number
  is_locked: boolean
}