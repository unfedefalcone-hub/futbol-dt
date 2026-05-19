'use client'
import { useRanking } from '@/hooks/useSupabaseData'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import dynamic from 'next/dynamic'
const BotWrapper = dynamic(() => import('@/components/bot/BotWrapper'), { ssr: false })

export default function RankingPage() {
  const { ranking, loading } = useRanking()
  const { profile } = useAuthStore()
  const [tab, setTab] = useState<'fantasy' | 'prode'>('fantasy')
  const [search, setSearch] = useState('')

  const sorted = [...ranking]
    .sort((a, b) =>
      tab === 'fantasy'
        ? (b.fantasy_points || 0) - (a.fantasy_points || 0)
        : (b.prode_points || 0) - (a.prode_points || 0)
    )
    .filter(r => r.username?.toLowerCase().includes(search.toLowerCase()))

  const myPos = sorted.findIndex(r => r.id === profile?.id) + 1
  const myData = sorted.find(r => r.id === profile?.id)

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#07090f]">
      <div className="text-[#74ACDF] font-['Bebas_Neue'] text-2xl animate-pulse">
        Cargando ranking...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07090f] pb-24">
      {/* Header */}
      <div className="p-4 border-b border-[#74ACDF]/20">
        <h1 className="font-['Bebas_Neue'] text-2xl text-[#74ACDF] tracking-widest mb-3">
          RANKING GLOBAL
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          {(['fantasy', 'prode'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm border transition-all
                ${tab === t
                  ? 'bg-[#74ACDF] text-[#07090f] border-[#74ACDF]'
                  : 'border-[#74ACDF]/30 text-[#74ACDF]/60'
                }`}
            >
              {t === 'fantasy' ? '⚽ Fantasy' : '🎯 Prode'}
            </button>
          ))}
        </div>

        <input
          className="w-full bg-[#0d1117] border border-[#74ACDF]/30 rounded-xl px-4 py-2 text-white text-sm outline-none"
          placeholder="🔍 Buscar DT..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Mi posición (sticky card) */}
      {myData && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-[#003087]/40 border border-[#74ACDF]/40">
          <div className="flex items-center gap-3">
            <div className="font-['Bebas_Neue'] text-3xl text-[#f0c040] w-10 text-center">
              #{myPos}
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-sm">Vos</div>
              <div className="text-xs text-[#74ACDF]/60">{myData.username}</div>
            </div>
            <div className="font-['Bebas_Neue'] text-2xl text-[#f0c040]">
              {tab === 'fantasy' ? myData.fantasy_points : myData.prode_points} pts
            </div>
          </div>
        </div>
      )}

      {/* Podio top 3 */}
      {sorted.length >= 3 && (
        <div className="flex items-end justify-center gap-2 px-4 pt-6 pb-2">
          {[sorted[1], sorted[0], sorted[2]].map((r, i) => {
            const pos = i === 0 ? 2 : i === 1 ? 1 : 3
            const heights = ['h-20', 'h-28', 'h-16']
            const colors = ['#74ACDF', '#f0c040', '#cd7f32']
            return (
              <div key={r.id} className="flex-1 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0d1117] border-2 flex items-center justify-center text-lg mb-1"
                  style={{ borderColor: colors[i] }}>
                  {r.avatar_url
                    ? <img src={r.avatar_url} className="w-full h-full rounded-full object-cover" />
                    : '👤'
                  }
                </div>
                <div className="text-xs text-white truncate max-w-full text-center mb-1">
                  {r.username?.split(' ')[0]}
                </div>
                <div className={`${heights[i]} w-full rounded-t-xl flex flex-col items-center justify-center`}
                  style={{ background: `${colors[i]}22`, border: `1px solid ${colors[i]}44` }}>
                  <div className="font-['Bebas_Neue'] text-2xl" style={{ color: colors[i] }}>
                    #{pos}
                  </div>
                  <div className="text-xs text-white/60">
                    {tab === 'fantasy' ? r.fantasy_points : r.prode_points}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lista completa */}
      <div className="px-4 mt-2 space-y-1">
        {sorted.map((r, idx) => {
          const isMe = r.id === profile?.id
          const pts = tab === 'fantasy' ? r.fantasy_points : r.prode_points
          return (
            <div
              key={r.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                ${isMe
                  ? 'bg-[#003087]/30 border-[#74ACDF]/50'
                  : 'bg-[#0d1117] border-[#ffffff08]'
                }`}
            >
              <div className={`font-['Bebas_Neue'] text-xl w-8 text-center
                ${idx === 0 ? 'text-[#f0c040]' : idx === 1 ? 'text-[#74ACDF]' : idx === 2 ? 'text-[#cd7f32]' : 'text-white/40'}`}>
                {idx + 1}
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0d1117] border border-[#ffffff15] flex items-center justify-center text-sm overflow-hidden">
                {r.avatar_url ? <img src={r.avatar_url} className="w-full h-full object-cover" /> : '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm truncate ${isMe ? 'text-[#74ACDF]' : 'text-white'}`}>
                  {r.username} {isMe && '(vos)'}
                </div>
                {r.clubs?.name && (
                  <div className="text-xs text-white/40 truncate">{r.clubs.name}</div>
                )}
              </div>
              <div className="font-['Bebas_Neue'] text-xl text-[#f0c040] shrink-0">
                {pts || 0} pts
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}