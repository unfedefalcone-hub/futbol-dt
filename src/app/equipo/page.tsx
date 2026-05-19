'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
const BotWrapper = dynamic(() => import('@/components/bot/BotWrapper'), { ssr: false })

const FORMATIONS: Record<string, { pos: string; x: number; y: number }[]> = {
  '4-3-3': [
    { pos: 'GK', x: 50, y: 92 },
    { pos: 'DEF', x: 15, y: 75 }, { pos: 'DEF', x: 38, y: 75 }, { pos: 'DEF', x: 62, y: 75 }, { pos: 'DEF', x: 85, y: 75 },
    { pos: 'MID', x: 20, y: 52 }, { pos: 'MID', x: 50, y: 52 }, { pos: 'MID', x: 80, y: 52 },
    { pos: 'FWD', x: 20, y: 25 }, { pos: 'FWD', x: 50, y: 20 }, { pos: 'FWD', x: 80, y: 25 },
  ],
  '4-4-2': [
    { pos: 'GK', x: 50, y: 92 },
    { pos: 'DEF', x: 15, y: 75 }, { pos: 'DEF', x: 38, y: 75 }, { pos: 'DEF', x: 62, y: 75 }, { pos: 'DEF', x: 85, y: 75 },
    { pos: 'MID', x: 15, y: 52 }, { pos: 'MID', x: 38, y: 52 }, { pos: 'MID', x: 62, y: 52 }, { pos: 'MID', x: 85, y: 52 },
    { pos: 'FWD', x: 35, y: 22 }, { pos: 'FWD', x: 65, y: 22 },
  ],
  '5-3-2': [
    { pos: 'GK', x: 50, y: 92 },
    { pos: 'DEF', x: 10, y: 75 }, { pos: 'DEF', x: 30, y: 75 }, { pos: 'DEF', x: 50, y: 75 }, { pos: 'DEF', x: 70, y: 75 }, { pos: 'DEF', x: 90, y: 75 },
    { pos: 'MID', x: 20, y: 50 }, { pos: 'MID', x: 50, y: 50 }, { pos: 'MID', x: 80, y: 50 },
    { pos: 'FWD', x: 35, y: 22 }, { pos: 'FWD', x: 65, y: 22 },
  ],
}

const DEMO_PLAYERS = [
  { id: 6, name: 'L. Messi', nation: '🇦🇷', pos: 'FWD', value: 200, pts: 45, starter: true, captain: true },
  { id: 11, name: 'K. Mbappé', nation: '🇫🇷', pos: 'FWD', value: 180, pts: 32, starter: true, captain: false },
  { id: 14, name: 'Bellingham', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'MID', value: 180, pts: 28, starter: true, captain: false },
  { id: 8, name: 'Mac Allister', nation: '🇦🇷', pos: 'MID', value: 75, pts: 22, starter: true, captain: false },
  { id: 13, name: 'Tchouaméni', nation: '🇫🇷', pos: 'MID', value: 80, pts: 15, starter: true, captain: false },
  { id: 3, name: 'N. Molina', nation: '🇦🇷', pos: 'DEF', value: 45, pts: 12, starter: true, captain: false },
  { id: 4, name: 'C. Romero', nation: '🇦🇷', pos: 'DEF', value: 65, pts: 18, starter: true, captain: false },
  { id: 5, name: 'L. Martínez', nation: '🇦🇷', pos: 'DEF', value: 55, pts: 14, starter: true, captain: false },
  { id: 19, name: 'Marquinhos', nation: '🇧🇷', pos: 'DEF', value: 45, pts: 10, starter: true, captain: false },
  { id: 1, name: 'E. Martínez', nation: '🇦🇷', pos: 'GK', value: 40, pts: 18, starter: true, captain: false },
  { id: 7, name: 'J. Álvarez', nation: '🇦🇷', pos: 'FWD', value: 90, pts: 20, starter: false, captain: false },
  { id: 16, name: 'Vinicius Jr', nation: '🇧🇷', pos: 'FWD', value: 150, pts: 15, starter: false, captain: false },
]

const POS_COLOR: Record<string, string> = { GK: '#f0c040', DEF: '#74ACDF', MID: '#3fb950', FWD: '#f85149' }
const POS_LABEL: Record<string, string> = { GK: 'ARQ', DEF: 'DEF', MID: 'MED', FWD: 'DEL' }

export default function EquipoPage() {
  const router = useRouter()
  const [formation, setFormation] = useState('4-3-3')

  const slots = FORMATIONS[formation]
  const starters = DEMO_PLAYERS.filter(p => p.starter)
  const bench = DEMO_PLAYERS.filter(p => !p.starter)

  const byPos: Record<string, typeof DEMO_PLAYERS> = { GK: [], DEF: [], MID: [], FWD: [] }
  starters.forEach(p => byPos[p.pos]?.push(p))
  const cnt: Record<string, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 }

  const totalPts = DEMO_PLAYERS.filter(p => p.starter).reduce((sum, p) => sum + p.pts, 0)

  return (
    <main style={{ minHeight: '100vh', background: '#07090f', color: '#ddeeff', fontFamily: "'DM Sans', sans-serif", paddingBottom: '5rem' }}>
      <BotWrapper />
      {/* TOPBAR */}
      <div style={{ height: '54px', background: 'rgba(7,9,15,.97)', borderBottom: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '1rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#f8faff' }}>
          FUTBOL <span style={{ color: '#74ACDF' }}>DT</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', background: '#161b22', border: '1px solid rgba(116,172,223,0.27)', borderRadius: '20px', padding: '4px 12px' }}>
          <span style={{ fontSize: '10px', color: '#6a88aa', fontWeight: 600, letterSpacing: '.06em' }}>MIS PUNTOS</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#f0c040' }}>{totalPts}</span>
        </div>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '.04em', margin: '0 0 .2rem' }}>Mi Equipo</div>
        <div style={{ fontSize: '12px', color: '#6a88aa', marginBottom: '1rem' }}>Formación y puntajes en tiempo real</div>

        {/* FORMACIONES */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
          {Object.keys(FORMATIONS).map(f => (
            <button key={f} onClick={() => setFormation(f)}
              style={{ padding: '6px 14px', borderRadius: '7px', border: `1px solid ${formation === f ? '#74ACDF' : 'rgba(116,172,223,0.27)'}`, background: formation === f ? 'rgba(116,172,223,.15)' : 'transparent', color: formation === f ? '#74ACDF' : '#6a88aa', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              {f}
            </button>
          ))}
        </div>

        {/* CAMPO SVG */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,.5)', marginBottom: '1rem' }}>
          <svg width="100%" viewBox="0 0 320 490" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <defs>
              <filter id="sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,.5)" /></filter>
            </defs>
            {/* CAMPO */}
            <rect width="320" height="490" fill="#1a6e2e" />
            <rect y="0" width="320" height="49" fill="#1f8035" />
            <rect y="98" width="320" height="49" fill="#1f8035" />
            <rect y="196" width="320" height="49" fill="#1f8035" />
            <rect y="294" width="320" height="49" fill="#1f8035" />
            <rect y="392" width="320" height="49" fill="#1f8035" />
            {/* LÍNEAS */}
            <rect x="20" y="20" width="280" height="450" rx="4" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
            <line x1="20" y1="245" x2="300" y2="245" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
            <circle cx="160" cy="245" r="40" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
            <rect x="80" y="20" width="160" height="70" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
            <rect x="80" y="400" width="160" height="70" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
            <rect x="128" y="14" width="64" height="10" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
            <rect x="128" y="466" width="64" height="10" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />

            {/* TOKENS */}
            {slots.map((slot, i) => {
              const pl = byPos[slot.pos]?.[cnt[slot.pos]++]
              const cx = (slot.x / 100) * 320
              const cy = (slot.y / 100) * 490
              if (!pl) return (
                <circle key={i} cx={cx} cy={cy} r="16" fill="rgba(116,172,223,.12)" stroke="rgba(116,172,223,.3)" strokeDasharray="4 2" />
              )
              return (
                <g key={i} style={{ cursor: 'pointer' }}>
                  <circle cx={cx} cy={cy} r="18" fill="#4a8ac4" stroke="#74ACDF" strokeWidth="2.5" filter="url(#sh)" />
                  <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13">{pl.nation}</text>
                  {pl.captain && <>
                    <circle cx={cx + 13} cy={cy - 13} r="7" fill="#f0c040" />
                    <text x={cx + 13} y={cy - 9} textAnchor="middle" fontSize="8" fontWeight="700" fill="#000e2e" fontFamily="sans-serif">C</text>
                  </>}
                  <rect x={cx - 20} y={cy + 20} width="40" height="12" rx="3" fill="rgba(7,9,15,.85)" />
                  <text x={cx} y={cy + 29} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#74ACDF" fontFamily="sans-serif">{pl.pts}pts</text>
                  <rect x={cx - 22} y={cy + 33} width="44" height="11" rx="2" fill="rgba(0,0,0,.6)" />
                  <text x={cx} y={cy + 42} textAnchor="middle" fontSize="7" fill="white" fontFamily="sans-serif">
                    {pl.name.length > 10 ? pl.name.slice(0, 9) + '…' : pl.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* LISTA TITULARES */}
        <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden', marginBottom: '.8rem' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(116,172,223,0.13)', fontSize: '10px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#6a88aa', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3fb950', display: 'inline-block' }} />
            Titulares
          </div>
          <div style={{ padding: '8px 14px' }}>
            {['GK', 'DEF', 'MID', 'FWD'].map(pos =>
              DEMO_PLAYERS.filter(p => p.starter && p.pos === pos).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(116,172,223,0.06)' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: POS_COLOR[p.pos] + '22', color: POS_COLOR[p.pos], minWidth: '28px', textAlign: 'center' as const }}>{POS_LABEL[p.pos]}</span>
                  <span style={{ fontSize: '14px' }}>{p.nation}</span>
                  <span style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>{p.name}{p.captain ? ' ©' : ''}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: p.pts > 0 ? '#3fb950' : '#6a88aa' }}>{p.pts > 0 ? '+' : ''}{p.pts}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SUPLENTES */}
        <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(116,172,223,0.13)', fontSize: '10px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#6a88aa' }}>
            Suplentes
          </div>
          <div style={{ padding: '8px 14px' }}>
            {bench.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(116,172,223,0.06)', opacity: 0.7 }}>
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: POS_COLOR[p.pos] + '22', color: POS_COLOR[p.pos], minWidth: '28px', textAlign: 'center' as const }}>{POS_LABEL[p.pos]}</span>
                <span style={{ fontSize: '14px' }}>{p.nation}</span>
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#6a88aa' }}>{p.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', height: '58px', background: 'rgba(7,9,15,.97)', borderTop: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 200 }}>
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
            <span style={{ fontSize: '10px', fontWeight: 600, color: item.path === '/equipo' ? '#74ACDF' : '#6a88aa' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </main>
  )
}