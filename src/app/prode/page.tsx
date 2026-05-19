'use client'
import { useState } from 'react'
import { useProde } from '@/hooks/useSupabaseData'
import { useAuthStore } from '@/store/authStore'
import dynamic from 'next/dynamic'
const BotWrapper = dynamic(() => import('@/components/bot/BotWrapper'), { ssr: false })

const ROUND_LABELS: Record<string, string> = {
  'group': 'Fase de Grupos',
  'r16': 'Octavos',
  'qf': 'Cuartos',
  'sf': 'Semis',
  'final': 'Final',
}

export default function ProdePage() {
  const { profile } = useAuthStore()
  const { matches, predictions, loading, savePrediction } = useProde(profile?.id ?? null)
  const [activeRound, setActiveRound] = useState('group')
  const [editing, setEditing] = useState<Record<string, { h: string; a: string }>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const rounds = [...new Set(matches.map(m => m.round))].filter(Boolean)
  const filtered = matches.filter(m => m.round === activeRound)

  async function handleSave(matchId: string) {
    const e = editing[matchId]
    if (!e || e.h === '' || e.a === '') return
    setSaving(matchId)
    await savePrediction(matchId, parseInt(e.h), parseInt(e.a))
    setSaving(null)
    setEditing(prev => { const n = { ...prev }; delete n[matchId]; return n })
  }

  function getResultClass(matchId: string) {
    const pred = predictions[matchId]
    if (!pred || pred.result_type == null) return ''
    if (pred.result_type === 'exact') return 'border-[#f0c040] bg-[#f0c040]/10'
    if (pred.result_type === 'correct') return 'border-green-500 bg-green-500/10'
    if (pred.result_type === 'wrong') return 'border-red-500/40 bg-red-500/5'
    return ''
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#07090f]">
      <div className="text-[#74ACDF] font-['Bebas_Neue'] text-2xl animate-pulse">
        Cargando prode...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07090f] pb-24">
      <BotWrapper />
      <div className="p-4 border-b border-[#74ACDF]/20">
        <h1 className="font-['Bebas_Neue'] text-2xl text-[#74ACDF] tracking-widest mb-3">
          PRODE
        </h1>

        {/* Rondas */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {rounds.map(round => (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                ${activeRound === round
                  ? 'bg-[#74ACDF] text-[#07090f] border-[#74ACDF]'
                  : 'border-[#74ACDF]/30 text-[#74ACDF]/60'
                }`}
            >
              {ROUND_LABELS[round] || round}
            </button>
          ))}
        </div>
      </div>

      {/* Stats resumen */}
      <div className="grid grid-cols-4 gap-2 p-4">
        {[
          { label: 'Exactos', value: Object.values(predictions).filter((p: any) => p.result_type === 'exact').length, color: '#f0c040' },
          { label: 'Ganador', value: Object.values(predictions).filter((p: any) => p.result_type === 'correct').length, color: '#4ade80' },
          { label: 'Puntos', value: Object.values(predictions).reduce((s: number, p: any) => s + (p.points || 0), 0), color: '#74ACDF' },
          { label: 'Jugados', value: Object.keys(predictions).length, color: '#a78bfa' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0d1117] rounded-xl p-2 text-center border border-[#ffffff08]">
            <div className="font-['Bebas_Neue'] text-2xl" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Partidos */}
      <div className="px-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center text-[#74ACDF]/40 py-16 text-sm">
            No hay partidos en esta fase
          </div>
        ) : (
          filtered.map(match => {
            const pred = predictions[match.id]
            const ed = editing[match.id]
            const isOpen = match.status === 'pending' || match.status === 'open'
            const isDone = match.status === 'done' || match.status === 'finished'
            const isLive = match.status === 'live'

            return (
              <div
                key={match.id}
                className={`rounded-xl border p-4 transition-all ${getResultClass(match.id) || 'bg-[#0d1117] border-[#ffffff08]'}`}
              >
                {/* Estado */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-white/40">
                    {new Date(match.match_date).toLocaleDateString('es-AR', {
                      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                    ${isLive ? 'bg-red-500/20 text-red-400' :
                      isDone ? 'bg-green-500/20 text-green-400' :
                      'bg-[#74ACDF]/20 text-[#74ACDF]'}`}>
                    {isLive ? '● EN VIVO' : isDone ? 'FINALIZADO' : 'ABIERTO'}
                  </span>
                </div>

                {/* Equipos */}
                <div className="flex items-center gap-2">
                  {/* Local */}
                  <div className="flex-1 flex flex-col items-center gap-1">
                    {match.home_nation?.flag_url && (
                      <img src={match.home_nation.flag_url} className="w-10 h-6 object-cover rounded" alt="" />
                    )}
                    <div className="text-white text-xs text-center font-bold truncate w-full">
                      {match.home_nation?.name}
                    </div>
                  </div>

                  {/* Marcador real / pronóstico */}
                  <div className="flex flex-col items-center gap-1">
                    {isDone ? (
                      <div className="font-['Bebas_Neue'] text-2xl text-white">
                        {match.home_score} - {match.away_score}
                      </div>
                    ) : isLive ? (
                      <div className="font-['Bebas_Neue'] text-2xl text-red-400 animate-pulse">
                        {match.home_score ?? 0} - {match.away_score ?? 0}
                      </div>
                    ) : (
                      <div className="font-['Bebas_Neue'] text-lg text-white/30">VS</div>
                    )}

                    {/* Pronóstico guardado */}
                    {pred && !ed && (
                      <div className="text-xs text-[#74ACDF] font-bold">
                        Tu prode: {pred.home_pred} - {pred.away_pred}
                        {pred.points > 0 && <span className="text-[#f0c040] ml-1">+{pred.points}pts</span>}
                      </div>
                    )}
                  </div>

                  {/* Visitante */}
                  <div className="flex-1 flex flex-col items-center gap-1">
                    {match.away_nation?.flag_url && (
                      <img src={match.away_nation.flag_url} className="w-10 h-6 object-cover rounded" alt="" />
                    )}
                    <div className="text-white text-xs text-center font-bold truncate w-full">
                      {match.away_nation?.name}
                    </div>
                  </div>
                </div>

                {/* Input pronóstico */}
                {isOpen && (
                  <div className="mt-3 flex items-center gap-2">
                    {ed ? (
                      <>
                        <input
                          type="number" min="0" max="20"
                          value={ed.h}
                          onChange={e => setEditing(prev => ({ ...prev, [match.id]: { ...prev[match.id], h: e.target.value } }))}
                          className="w-14 text-center bg-[#07090f] border border-[#74ACDF]/40 rounded-lg py-1.5 text-white text-lg font-bold outline-none"
                        />
                        <span className="text-white/40">-</span>
                        <input
                          type="number" min="0" max="20"
                          value={ed.a}
                          onChange={e => setEditing(prev => ({ ...prev, [match.id]: { ...prev[match.id], a: e.target.value } }))}
                          className="w-14 text-center bg-[#07090f] border border-[#74ACDF]/40 rounded-lg py-1.5 text-white text-lg font-bold outline-none"
                        />
                        <button
                          onClick={() => handleSave(match.id)}
                          disabled={saving === match.id}
                          className="flex-1 bg-[#f0c040] text-[#07090f] font-bold py-1.5 rounded-lg text-sm disabled:opacity-50"
                        >
                          {saving === match.id ? '...' : 'GUARDAR'}
                        </button>
                        <button
                          onClick={() => setEditing(prev => { const n = { ...prev }; delete n[match.id]; return n })}
                          className="text-white/30 text-sm px-2"
                        >✕</button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditing(prev => ({
                          ...prev,
                          [match.id]: { h: pred?.home_pred?.toString() ?? '', a: pred?.away_pred?.toString() ?? '' }
                        }))}
                        className={`w-full py-2 rounded-lg text-sm font-bold border transition-all
                          ${pred
                            ? 'border-[#74ACDF]/40 text-[#74ACDF] hover:bg-[#74ACDF]/10'
                            : 'bg-[#003087]/40 border-[#003087] text-white hover:bg-[#003087]/60'
                          }`}
                      >
                        {pred ? '✏️ Editar pronóstico' : '🎯 Ingresar pronóstico'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}