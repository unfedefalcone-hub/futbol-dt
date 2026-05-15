'use client'

import { useRouter } from 'next/navigation'

const RANKING = [
  { rank: 1, name: 'El_Pibe_DT', team: 'Maradona Forever', pts: 312, delta: +2, av: 'EP', color: '#74ACDF' },
  { rank: 2, name: 'DT_Campeón', team: 'Los Crack', pts: 289, delta: -1, av: 'DC', color: '#f0c040' },
  { rank: 3, name: 'Vos', team: 'Mi Equipo', pts: 247, delta: +5, av: 'YO', color: '#4a8ac4', me: true },
  { rank: 4, name: 'LaScaloneta10', team: 'Celeste y Blanca', pts: 231, delta: -2, av: 'LS', color: '#3fb950' },
  { rank: 5, name: 'MatchDay_FC', team: 'Los Cracks 2026', pts: 218, delta: 0, av: 'MF', color: '#d2a8ff' },
  { rank: 6, name: 'TacticaMaestra', team: 'El Dream Team', pts: 205, delta: +3, av: 'TM', color: '#ffa657' },
  { rank: 7, name: 'CrackTotal', team: 'Los Pibes FC', pts: 198, delta: -1, av: 'CT', color: '#f85149' },
  { rank: 8, name: 'ElMaestroDT', team: 'Dream XI', pts: 185, delta: +2, av: 'EM', color: '#74ACDF' },
]

const MEDAL = ['🥇', '🥈', '🥉']

export default function RankingPage() {
  const router = useRouter()
  const top3 = RANKING.slice(0, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]]
  const heights = [60, 80, 48]
  const nums = ['2', '1', '3']
  const borderColors = ['#aaa', '#f0c040', '#c07030']

  return (
    <main style={{ minHeight: '100vh', background: '#07090f', color: '#ddeeff', fontFamily: "'DM Sans', sans-serif", paddingBottom: '5rem' }}>
      {/* TOPBAR */}
      <div style={{ height: '54px', background: 'rgba(7,9,15,.97)', borderBottom: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', padding: '0 1rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#f8faff' }}>
          FUTBOL <span style={{ color: '#74ACDF' }}>DT</span>
        </div>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '.04em', margin: '0 0 .2rem' }}>Ranking Global</div>
        <div style={{ fontSize: '12px', color: '#6a88aa', marginBottom: '1.5rem' }}>Posición en tiempo real entre todos los DTs</div>

        {/* PODIO */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '14px', padding: '1rem 1rem 0', overflow: 'hidden', marginBottom: '1rem' }}>
          {podiumOrder.map((p, i) => (
            <div key={p.rank} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '130px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: p.color + '22', color: p.color, border: `2px solid ${borderColors[i]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                {p.av}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, textAlign: 'center', marginBottom: '2px', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                {p.name}{p.me ? ' 👈' : ''}
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#f0c040', marginBottom: '5px' }}>{p.pts}</div>
              <div style={{ width: '100%', borderRadius: '5px 5px 0 0', background: p.color + '22', color: p.color, height: `${heights[i]}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px' }}>
                #{nums[i]}
              </div>
            </div>
          ))}
        </div>

        {/* LISTA */}
        <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden' }}>
          {/* HEADER */}
          <div style={{ display: 'grid', gridTemplateColumns: '38px 1fr 60px', padding: '7px 13px', borderBottom: '1px solid rgba(116,172,223,0.13)', fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: '#3a5068' }}>
            <div style={{ textAlign: 'center' as const }}>#</div>
            <div>DT</div>
            <div style={{ textAlign: 'center' as const }}>PTS</div>
          </div>

          {/* ROWS */}
          {RANKING.map(p => (
            <div key={p.rank} style={{ display: 'grid', gridTemplateColumns: '38px 1fr 60px', alignItems: 'center', padding: '10px 13px', borderBottom: '1px solid rgba(116,172,223,0.06)', background: p.me ? 'rgba(116,172,223,.06)' : 'transparent', borderLeft: p.me ? '3px solid #74ACDF' : '3px solid transparent' }}>
              {/* RANK */}
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: p.rank === 1 ? '#f0c040' : p.rank === 2 ? '#aabbd0' : p.rank === 3 ? '#c07030' : '#3a5068', textAlign: 'center' as const }}>
                {p.rank <= 3 ? MEDAL[p.rank - 1] : p.rank}
              </div>

              {/* INFO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: p.color + '22', color: p.color, border: `1.5px solid ${p.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                  {p.av}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}{p.me ? ' 👈' : ''}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6a88aa', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.team}</div>
                </div>
              </div>

              {/* PUNTOS + DELTA */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#f0c040' }}>{p.pts}</div>
                <div style={{ fontSize: '10px', color: p.delta > 0 ? '#3fb950' : p.delta < 0 ? '#f85149' : '#3a5068' }}>
                  {p.delta > 0 ? `↑+${p.delta}` : p.delta < 0 ? `↓${p.delta}` : '—'}
                </div>
              </div>
            </div>
          ))}
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
            <span style={{ fontSize: '10px', fontWeight: 600, color: item.path === '/ranking' ? '#74ACDF' : '#6a88aa' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </main>
  )
}