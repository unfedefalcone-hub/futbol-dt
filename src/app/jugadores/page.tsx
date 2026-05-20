'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayers } from '@/hooks/useSupabaseData'
import { useTeamStore } from '@/store/teamStore'
import { useAuthStore } from '@/store/authStore'
import dynamic from 'next/dynamic'

const BotWrapper = dynamic(() => import('@/components/bot/BotWrapper'), { ssr: false })

const POSITION_LABEL: Record<string, string> = {
  GK: '🧤 Arquero', DEF: '🛡️ Defensor',
  MID: '⚡ Mediocampista', FWD: '⚽ Delantero'
}
const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD']
const BUDGET = 500

const FLAG_EMOJIS: Record<string, string> = {
  AR: '🇦🇷', BR: '🇧🇷', FR: '🇫🇷', ES: '🇪🇸', DE: '🇩🇪',
  EN: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', GB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', PT: '🇵🇹', IT: '🇮🇹', NL: '🇳🇱',
  MX: '🇲🇽', US: '🇺🇸', CA: '🇨🇦', UY: '🇺🇾', CO: '🇨🇴',
  JP: '🇯🇵', KR: '🇰🇷', MA: '🇲🇦', SN: '🇸🇳', NG: '🇳🇬',
  HR: '🇭🇷', BE: '🇧🇪', CH: '🇨🇭', NO: '🇳🇴', SE: '🇸🇪',
  PL: '🇵🇱', UZ: '🇺🇿', SA: '🇸🇦', EG: '🇪🇬', IR: '🇮🇷',
  AU: '🇦🇺', NZ: '🇳🇿', GH: '🇬🇭', PA: '🇵🇦', EC: '🇪🇨',
  PY: '🇵🇾', TR: '🇹🇷', AT: '🇦🇹', DZ: '🇩🇿', JO: '🇯🇴',
  QA: '🇶🇦', BA: '🇧🇦', CZ: '🇨🇿', ZA: '🇿🇦', CI: '🇨🇮',
  TN: '🇹🇳', CV: '🇨🇻', CD: '🇨🇩', HT: '🇭🇹', CW: '🇨🇼',
  'GB-SCT': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'GB-ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
}

export default function JugadoresPage() {
  const router = useRouter()
  const { players, loading } = usePlayers()
  const { selectedPlayers, addPlayer, removePlayer } = useTeamStore()
  const { profile } = useAuthStore()

  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState('ALL')
  const [nationFilter, setNationFilter] = useState('ALL')

  const spent = selectedPlayers.reduce((s: number, p: any) => s + (p.value || 0), 0)
  const remaining = BUDGET - spent

  // Naciones únicas para el filtro
  const nations = useMemo(() => {
    const set = new Set(players.map((p: any) => p.nations?.name).filter(Boolean))
    return Array.from(set).sort() as string[]
  }, [players])

  const filtered = useMemo(() => players.filter((p: any) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nations?.name?.toLowerCase().includes(search.toLowerCase())
    const matchPos = posFilter === 'ALL' || p.position === posFilter
    const matchNation = nationFilter === 'ALL' || p.nations?.name === nationFilter
    return matchSearch && matchPos && matchNation
  }), [players, search, posFilter, nationFilter])

  const isSelected = (id: string) => selectedPlayers.some((p: any) => p.id === id)

  function togglePlayer(player: any) {
    if (isSelected(player.id)) {
      removePlayer(player.id)
    } else {
      if (selectedPlayers.length >= 15) return
      if (remaining < player.value) return
      addPlayer(player)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#07090f]">
      <div className="text-[#74ACDF] font-['Bebas_Neue'] text-2xl animate-pulse">
        Cargando jugadores...
      </div>
    </div>
  )

  filtered.map((player: any) => {
  console.log(player.name, player.nations)
  
  return (
    <div className="min-h-screen bg-[#07090f] pb-24">
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
              {selectedPlayers.length}/15 jugadores
            </div>
          </div>
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
            const canAdd = !sel && selectedPlayers.length < 15 && remaining >= player.value
            return (
              <div
                key={player.id}
                onClick={() => togglePlayer(player)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer
                  ${sel
                    ? 'bg-[#74ACDF]/10 border-[#74ACDF] shadow-[0_0_12px_#74ACDF33]'
                    : canAdd
                      ? 'bg-[#0d1117] border-[#ffffff10] hover:border-[#74ACDF]/40'
                      : 'bg-[#0d1117] border-[#ffffff08] opacity-50'
                  }`}
              >
                {/* Bandera */}
                <div className="w-8 h-6 flex items-center justify-center">
                  <img 
                    src={`https://flagcdn.com/w40/${player.nations?.flag_emoji?.toLowerCase()}.png`}
                    alt={player.nations?.name}
                    className="w-8 h-5 object-cover rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm truncate">{player.name}</div>
                  <div className="text-xs text-[#74ACDF]/60">
                    {POSITION_LABEL[player.position]} · {player.nations?.name}
                  </div>
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

      {/* FAB → Equipo */}
      {selectedPlayers.length > 0 && (
        <div className="fixed bottom-20 right-4 z-20">
          <button
            onClick={() => router.push('/equipo')}
            className="bg-[#f0c040] text-[#07090f] font-['Bebas_Neue'] text-lg px-5 py-3 rounded-2xl shadow-lg shadow-[#f0c040]/30 hover:scale-105 transition-transform"
          >
            VER EQUIPO ({selectedPlayers.length})
          </button>
        </div>
      )}
    </div>
  )
}