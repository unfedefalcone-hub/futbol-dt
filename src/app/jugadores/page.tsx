'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BotFloat from '@/components/bot/BotFloat'

const PLAYERS = [
  { id: 1, name: 'E. Martínez', nation: '🇦🇷', pos: 'GK', value: 40 },
  { id: 2, name: 'F. Armani', nation: '🇦🇷', pos: 'GK', value: 12 },
  { id: 3, name: 'N. Molina', nation: '🇦🇷', pos: 'DEF', value: 45 },
  { id: 4, name: 'C. Romero', nation: '🇦🇷', pos: 'DEF', value: 65 },
  { id: 5, name: 'L. Martínez', nation: '🇦🇷', pos: 'DEF', value: 55 },
  { id: 6, name: 'L. Messi', nation: '🇦🇷', pos: 'FWD', value: 200 },
  { id: 7, name: 'J. Álvarez', nation: '🇦🇷', pos: 'FWD', value: 90 },
  { id: 8, name: 'Mac Allister', nation: '🇦🇷', pos: 'MID', value: 75 },
  { id: 9, name: 'R. De Paul', nation: '🇦🇷', pos: 'MID', value: 60 },
  { id: 10, name: 'M. Maignan', nation: '🇫🇷', pos: 'GK', value: 50 },
  { id: 11, name: 'K. Mbappé', nation: '🇫🇷', pos: 'FWD', value: 180 },
  { id: 12, name: 'A. Griezmann', nation: '🇫🇷', pos: 'FWD', value: 55 },
  { id: 13, name: 'Tchouaméni', nation: '🇫🇷', pos: 'MID', value: 80 },
  { id: 14, name: 'Bellingham', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'MID', value: 180 },
  { id: 15, name: 'Alisson', nation: '🇧🇷', pos: 'GK', value: 45 },
  { id: 16, name: 'Vinicius Jr', nation: '🇧🇷', pos: 'FWD', value: 150 },
  { id: 17, name: 'Rodrygo', nation: '🇧🇷', pos: 'FWD', value: 90 },
  { id: 18, name: 'Casemiro', nation: '🇧🇷', pos: 'MID', value: 40 },
  { id: 19, name: 'Marquinhos', nation: '🇧🇷', pos: 'DEF', value: 45 },
  { id: 20, name: 'H. Kane', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'FWD', value: 100 },
  { id: 21, name: 'P. Foden', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'MID', value: 150 },
  { id: 22, name: 'J. Kimmich', nation: '🇩🇪', pos: 'MID', value: 70 },
  { id: 23, name: 'L. Yamal', nation: '🇪🇸', pos: 'FWD', value: 120 },
  { id: 24, name: 'R. Dias', nation: '🇵🇹', pos: 'DEF', value: 80 },
  { id: 25, name: 'F. Valverde', nation: '🇺🇾', pos: 'MID', value: 100 },
]

const BUDGET = 500
const MAX_PLAYERS = 23
const MAX_PER_NATION = 3
const POS_LABEL: Record<string, string> = { GK: 'ARQ', DEF: 'DEF', MID: 'MED', FWD: 'DEL' }
const POS_COLOR: Record<string, string> = { GK: '#f0c040', DEF: '#74ACDF', MID: '#3fb950', FWD: '#f85149' }

const FILTERS = [
  { key: 'ALL', label: 'Todos' },
  { key: 'GK', label: 'Arquero' },
  { key: 'DEF', label: 'Defensor' },
  { key: 'MID', label: 'Mediocampista' },
  { key: 'FWD', label: 'Delantero' },
]

export default function JugadoresPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState('ALL')

  const budgetUsed = PLAYERS.filter(p => selected.has(p.id)).reduce((sum, p) => sum + p.value, 0)
  const budgetLeft = BUDGET - budgetUsed

  const nationCount = (nation: string) =>
    PLAYERS.filter(p => selected.has(p.id) && p.nation === nation).length

  const togglePlayer = (player: typeof PLAYERS[0]) => {
    const next = new Set(selected)
    if (next.has(player.id)) {
      next.delete(player.id)
    } else {
      if (next.size >= MAX_PLAYERS) return
      if (budgetLeft < player.value) return
      if (nationCount(player.nation) >= MAX_PER_NATION) return
      next.add(player.id)
    }
    setSelected(next)
  }

  const filtered = filter === 'ALL' ? PLAYERS : PLAYERS.filter(p => p.pos === filter)

  const s = {
    page: { minHeight: '100vh', background: '#07090f', color: '#ddeeff', fontFamily: "'DM Sans', sans-serif", paddingBottom: '5rem' } as React.CSSProperties,
    inner: { maxWidth: '500px', margin: '0 auto', padding: '1rem' } as React.CSSProperties,
  }

  return (
    <main style={s.page}>
      {/* TOPBAR */}
      <div style={{ height: '54px', background: 'rgba(7,9,15,.97)', borderBottom: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '1rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#f8faff' }}>
          FUTBOL <span style={{ color: '#74ACDF' }}>DT</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#161b22', border: '1px solid rgba(116,172,223,0.27)', borderRadius: '20px', padding: '4px 12px' }}>
          <span style={{ fontSize: '10px', color: '#6a88aa', fontWeight: 600, letterSpacing: '.06em' }}>PRESUPUESTO</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#f0c040' }}>${budgetLeft}M</span>
        </div>
      </div>

      <div style={s.inner}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '.04em', margin: '1rem 0 .2rem' }}>Selección de Jugadores</div>
        <div style={{ fontSize: '12px', color: '#6a88aa', marginBottom: '1rem' }}>Armá tu equipo de 23 jugadores respetando el presupuesto</div>

        {/* BUDGET BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#161b22', border: '1px solid rgba(116,172,223,0.27)', borderRadius: '20px', padding: '4px 12px' }}>
            <span style={{ fontSize: '10px', color: '#6a88aa', fontWeight: 600, letterSpacing: '.06em' }}>SELECCIONADOS</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '17px', color: '#f0c040' }}>
              <strong style={{ color: '#f8faff' }}>{selected.size}</strong>/{MAX_PLAYERS}
            </span>
          </div>
          <button
            onClick={() => router.push('/equipo')}
            style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: '7px', border: '1px solid #74ACDF', background: 'rgba(116,172,223,.1)', color: '#74ACDF', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Ver mi equipo →
          </button>
        </div>

        {/* FILTROS */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const, marginBottom: '1rem' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ fontSize: '11px', padding: '5px 11px', borderRadius: '20px', border: `1px solid ${filter === f.key ? '#74ACDF' : 'rgba(116,172,223,0.27)'}`, background: filter === f.key ? 'rgba(116,172,223,.12)' : 'transparent', color: filter === f.key ? '#74ACDF' : '#6a88aa', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all .15s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* GRID DE JUGADORES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
          {filtered.map(p => {
            const sel = selected.has(p.id)
            const canAdd = !sel && selected.size < MAX_PLAYERS && budgetLeft >= p.value && nationCount(p.nation) < MAX_PER_NATION
            return (
              <div key={p.id} onClick={() => togglePlayer(p)}
                style={{
                  background: sel ? 'rgba(116,172,223,.15)' : '#161b22',
                  border: `1.5px solid ${sel ? '#74ACDF' : 'rgba(116,172,223,0.13)'}`,
                  borderRadius: '10px', overflow: 'hidden', cursor: canAdd || sel ? 'pointer' : 'not-allowed',
                  opacity: !sel && !canAdd ? 0.45 : 1, transition: 'all .2s',
                }}>
                <div style={{ height: '60px', background: sel ? 'rgba(116,172,223,.2)' : '#1c2333', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: '28px' }}>
                  {p.nation}
                  <span style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: POS_COLOR[p.pos] + '33', color: POS_COLOR[p.pos] }}>
                    {POS_LABEL[p.pos]}
                  </span>
                  {sel && (
                    <span style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '11px', background: '#74ACDF', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000e2e', fontWeight: 700 }}>✓</span>
                  )}
                </div>
                <div style={{ padding: '7px 8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '2px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: '10px', color: '#6a88aa' }}>{p.nation}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#f0c040', marginTop: '2px' }}>${p.value}M</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', height: '58px', background: 'rgba(7,9,15,.97)', borderTop: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 .3rem', zIndex: 200 }}>
        {[
          { label: 'Jugadores', icon: '👥', path: '/jugadores' },
          { label: 'Equipo', icon: '⚽', path: '/equipo' },
          { label: 'Ranking', icon: '🏆', path: '/ranking' },
          { label: 'Ligas', icon: '🔗', path: '/ligas' },
          { label: 'Prode', icon: '🎯', path: '/prode' },
        ].map(item => (
          <button key={item.path} onClick={() => router.push(item.path)}
            style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '3px', cursor: 'pointer', padding: '5px 10px', borderRadius: '10px', border: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", flex: 1 }}>
            <span style={{ fontSize: '19px', lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: item.path === '/jugadores' ? '#74ACDF' : '#6a88aa' }}>{item.label}</span>
          </button>
        ))}
      </div>

      <BotFloat />
    </main>
  )
}