'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayers } from '@/hooks/useSupabaseData'
import { useTeamStore } from '@/store/teamStore'
import { useAuthStore } from '@/store/authStore'
import { createClient } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const BotWrapper = dynamic(() => import('@/components/bot/BotWrapper'), { ssr: false })

const POSITION_LABEL: Record<string, string> = {
  GK: '🧤 Arquero', DEF: '🛡️ Defensor',
  MID: '⚡ Mediocampista', FWD: '⚽ Delantero'
}
const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD']
const BUDGET = 500
const MAX_PER_NATION = 3
const TOTAL_PLAYERS = 23

const FORMATION_LIMITS: Record<string, Record<string, number>> = {
  '4-3-3': { GK: 2, DEF: 8, MID: 7, FWD: 6 },
  '4-4-2': { GK: 2, DEF: 8, MID: 8, FWD: 5 },
  '5-3-2': { GK: 2, DEF: 9, MID: 7, FWD: 5 },
}

const FORMATIONS = ['4-3-3', '4-4-2', '5-3-2']

export default function JugadoresPage() {
  const router = useRouter()
  const supabase = createClient()
  const { players, loading } = usePlayers()
  const { selectedPlayers, addPlayer, removePlayer } = useTeamStore()
  const { profile } = useAuthStore()

  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState('ALL')
  const [formation, setFormation] = useState('4-3-3')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const spent = selectedPlayers.reduce((s: number, p: any) => s + (p.value || 0), 0)
  const remaining = BUDGET - spent

  // Contadores por posición y nación
  const countByPos = useMemo(() => {
    const c: Record<string, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
    selectedPlayers.forEach((p: any) => { if (c[p.position] !== undefined) c[p.position]++ })
    return c
  }, [selectedPlayers])

  const countByNation = useMemo(() => {
    const c: Record<string, number> = {}
    selectedPlayers.forEach((p: any) => {
      const n = p.nation_id || p.nations?.id
      if (n) c[n] = (c[n] || 0) + 1
    })
    return c
  }, [selectedPlayers])

  const limits = FORMATION_LIMITS[formation]

  const filtered = useMemo(() => players.filter((p: any) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nations?.name?.toLowerCase().includes(search.toLowerCase())
    const matchPos = posFilter === 'ALL' || p.position === posFilter
    return matchSearch && matchPos
  }), [players, search, posFilter])

  const isSelected = (id: string) => selectedPlayers.some((p: any) => p.id === id)

  function canAddPlayer(player: any): { ok: boolean; reason: string } {
    if (isSelected(player.id)) return { ok: true, reason: '' }
    if (selectedPlayers.length >= TOTAL_PLAYERS) return { ok: false, reason: 'Equipo completo' }
    if (remaining < player.value) return { ok: false, reason: 'Sin presupuesto' }
    if (countByPos[player.position] >= limits[player.position])
      return { ok: false, reason: `Límite de ${POSITION_LABEL[player.position]} alcanzado` }
    const nationId = player.nation_id || player.nations?.id
    if (nationId && (countByNation[nationId] || 0) >= MAX_PER_NATION)
      return { ok: false, reason: 'Máx. 3 por selección' }
    return { ok: true, reason: '' }
  }

  function togglePlayer(player: any) {
    if (isSelected(player.id)) {
      removePlayer(player.id)
      return
    }
    const { ok, reason } = canAddPlayer(player)
    if (!ok) {
      showToast(`⚠️ ${reason}`)
      return
    }
    addPlayer(player)
  }

  async function handleConfirm() {
    if (selectedPlayers.length < TOTAL_PLAYERS) {
      showToast(`⚠️ Necesitás ${TOTAL_PLAYERS - selectedPlayers.length} jugadores más`)
      return
    }
    if (!profile?.id) {
      showToast('⚠️ Iniciá sesión primero')
      return
    }

    setSaving(true)
    try {
      // Guardar o actualizar el equipo en Supabase
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .upsert({
          profile_id: profile.id,
          formation,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'profile_id' })
        .select()
        .single()

      if (teamError) throw teamError

      // Borrar jugadores anteriores
      await supabase.from('team_players').delete().eq('team_id', team.id)

      // Insertar nuevos jugadores
      const teamPlayers = selectedPlayers.map((p: any, idx: number) => ({
        team_id: team.id,
        player_id: p.id,
        is_starter: idx < 11,
        is_captain: idx === 0,
      }))

      const { error: playersError } = await supabase
        .from('team_players')
        .insert(teamPlayers)

      if (playersError) throw playersError

      showToast('✅ ¡Equipo guardado!')
      setTimeout(() => router.push('/equipo'), 1000)
    } catch (err) {
      console.error(err)
      showToast('❌ Error al guardar el equipo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#07090f]">
      <div className="text-[#74ACDF] font-['Bebas_Neue'] text-2xl animate-pulse">
        Cargando jugadores...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07090f] pb-32">
      <BotWrapper />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#07090f]/95 backdrop-blur border-b border-[#74ACDF]/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-['Bebas_Neue'] text-2xl text-[#74ACDF] tracking-widest">
            JUGADORES
          </h1>
          <div className="text-right">
            <div className="text-[#f0c040] font-bold text-lg font-['Bebas_Neue']">
              ${remaining.toFixed(1)}M
            </div>
            <div className="text-xs text-[#74ACDF]/60">
              {selectedPlayers.length}/{TOTAL_PLAYERS} jugadores
            </div>
          </div>
        </div>

        {/* Selector de formación */}
        <div className="flex gap-2 mb-3">
          {FORMATIONS.map(f => (
            <button
              key={f}
              onClick={() => setFormation(f)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all
                ${formation === f
                  ? 'bg-[#003087] text-white border-[#74ACDF]'
                  : 'border-[#74ACDF]/30 text-[#74ACDF]/60'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Contadores por posición */}
        <div className="flex gap-2 mb-3">
          {POSITION_ORDER.map(pos => (
            <div key={pos} className={`flex-1 text-center rounded-lg py-1 border text-xs
              ${countByPos[pos] >= limits[pos]
                ? 'border-[#f85149]/50 bg-[#f85149]/10 text-[#f85149]'
                : 'border-[#74ACDF]/20 text-[#74ACDF]/60'
              }`}>
              <div className="font-bold">{pos}</div>
              <div>{countByPos[pos]}/{limits[pos]}</div>
            </div>
          ))}
        </div>

        {/* Búsqueda */}
        <input
          className="w-full bg-[#0d1117] border border-[#74ACDF]/30 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#74ACDF] mb-2"
          placeholder="🔍 Buscar jugador o selección..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Filtros posición */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['ALL', ...POSITION_ORDER].map(pos => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-all
                ${posFilter === pos
                  ? 'bg-[#74ACDF] text-[#07090f] border-[#74ACDF]'
                  : 'border-[#74ACDF]/30 text-[#74ACDF]/60 hover:border-[#74ACDF]/60'
                }`}
            >
              {pos === 'ALL' ? 'Todos' : POSITION_LABEL[pos]}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de jugadores */}
      <div className="p-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center text-[#74ACDF]/40 py-16 text-sm">
            No se encontraron jugadores
          </div>
        ) : (
          filtered.map((player: any) => {
            const sel = isSelected(player.id)
            const { ok, reason } = canAddPlayer(player)
            const blocked = !sel && !ok

            return (
              <div
                key={player.id}
                onClick={() => togglePlayer(player)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer
                  ${sel
                    ? 'bg-[#74ACDF]/10 border-[#74ACDF] shadow-[0_0_12px_#74ACDF33]'
                    : blocked
                      ? 'bg-[#0d1117] border-[#ffffff08] opacity-40 cursor-not-allowed'
                      : 'bg-[#0d1117] border-[#ffffff10] hover:border-[#74ACDF]/40'
                  }`}
              >
                {/* Bandera */}
                <div className="w-8 h-5 overflow-hidden rounded flex-shrink-0">
                  <img
                    src={`https://flagcdn.com/w40/${player.nations?.flag_emoji?.toLowerCase()}.png`}
                    alt={player.nations?.name || ''}
                    width={32}
                    height={20}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm truncate">{player.name}</div>
                  <div className="text-xs text-[#74ACDF]/60">
                    {POSITION_LABEL[player.position]} · {player.nations?.name}
                  </div>
                  {blocked && (
                    <div className="text-xs text-[#f85149]/70 mt-0.5">{reason}</div>
                  )}
                </div>

                {/* Stats rápidos */}
                <div className="flex gap-2 text-xs text-[#74ACDF]/50 shrink-0">
                  {player.goals > 0 && <span>⚽{player.goals}</span>}
                  {player.assists > 0 && <span>🅰️{player.assists}</span>}
                </div>

                {/* Valor + check */}
                <div className="text-right shrink-0">
                  <div className={`font-['Bebas_Neue'] text-lg ${sel ? 'text-[#f0c040]' : 'text-white'}`}>
                    ${player.value}M
                  </div>
                  {sel && <div className="text-[#f0c040] text-xs">✓ Selec.</div>}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Botón confirmar equipo */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#07090f]/95 backdrop-blur border-t border-[#74ACDF]/20 z-20">
        <button
          onClick={handleConfirm}
          disabled={saving || selectedPlayers.length < TOTAL_PLAYERS}
          className={`w-full py-3 rounded-2xl font-['Bebas_Neue'] text-xl transition-all
            ${selectedPlayers.length === TOTAL_PLAYERS
              ? 'bg-[#f0c040] text-[#07090f] shadow-lg shadow-[#f0c040]/30 hover:scale-[1.02]'
              : 'bg-[#161b22] text-[#74ACDF]/40 border border-[#74ACDF]/20'
            }`}
        >
          {saving
            ? 'GUARDANDO...'
            : selectedPlayers.length === TOTAL_PLAYERS
              ? '✅ CONFIRMAR EQUIPO'
              : `SELECCIONÁ ${TOTAL_PLAYERS - selectedPlayers.length} JUGADORES MÁS`
          }
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#161b22] border border-[#74ACDF]/30 rounded-xl px-5 py-3 text-sm font-bold text-white z-50 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}