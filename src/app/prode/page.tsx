'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MATCHES = [
  { id: 'g1', h: '🇦🇷', hn: 'Argentina', a: '🇲🇽', an: 'México', date: '11 Jun · 21:00', status: 'open', result: null },
  { id: 'g2', h: '🇫🇷', hn: 'Francia', a: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', an: 'Inglaterra', date: '12 Jun · 18:00', status: 'open', result: null },
  { id: 'g3', h: '🇧🇷', hn: 'Brasil', a: '🇩🇪', an: 'Alemania', date: '12 Jun · 21:00', status: 'open', result: null },
  { id: 'g4', h: '🇪🇸', hn: 'España', a: '🇵🇹', an: 'Portugal', date: '13 Jun · 18:00', status: 'open', result: null },
  { id: 'g7', h: '🇺🇸', hn: 'USA', a: '🇨🇷', an: 'Costa Rica', date: '14 Jun · 15:00', status: 'done', result: { h: 2, a: 0 } },
  { id: 'g8', h: '🇦🇷', hn: 'Argentina', a: '🇵🇱', an: 'Polonia', date: '14 Jun · 18:00', status: 'done', result: { h: 3, a: 1 } },
]

const RANKING_PRODE = [
  { rank: 1, name: 'El_Pibe_DT', pts: 185, exact: 4, winner: 11, av: 'EP', color: '#74ACDF' },
  { rank: 2, name: 'DT_Campeón', pts: 160, exact: 3, winner: 9, av: 'DC', color: '#f0c040' },
  { rank: 3, name: 'Vos', pts: 135, exact: 2, winner: 8, av: 'YO', color: '#4a8ac4', me: true },
  { rank: 4, name: 'LaScaloneta10', pts: 110, exact: 1, winner: 7, av: 'LS', color: '#3fb950' },
  { rank: 5, name: 'MatchDay_FC', pts: 95, exact: 1, winner: 6, av: 'MF', color: '#d2a8ff' },
]

type Prediction = { h: number; a: number }
type Predictions = Record<string, Prediction>

function getPts(pred: Prediction, result: { h: number; a: number } | null) {
  if (!pred || !result) return null
  if (pred.h === result.h && pred.a === result.a) return { pts: 25, type: 'exact' }
  const pw = pred.h > pred.a ? 'h' : pred.h < pred.a ? 'a' : 'd'
  const rw = result.h > result.a ? 'h' : result.h < result.a ? 'a' : 'd'
  return pw === rw ? { pts: 10, type: 'correct' } : { pts: 0, type: 'wrong' }
}

export default function ProdePage() {
  const router = useRouter()
  const [tab, setTab] = useState<'pronosticos' | 'ranking'>('pronosticos')
  const [predictions, setPredictions] = useState<Predictions>({
    g7: { h: 2, a: 0 },
    g8: { h: 2, a: 1 },
  })
  const [inputs, setInputs] = useState<Record<string, { h: string; a: string }>>({})
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const saveP = (id: string) => {
    const inp = inputs[id]
    if (!inp) { showToast('Ingresá un resultado'); return }
    const h = parseInt(inp.h), a = parseInt(inp.a)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) { showToast('Resultado inválido'); return }
    setPredictions(prev => ({ ...prev, [id]: { h, a } }))
    showToast('Pronóstico guardado ✓')
  }

  const totalPts = Object.entries(predictions).reduce((sum, [id, pred]) => {
    const match = MATCHES.find(m => m.id === id)
    const res = getPts(pred, match?.result ?? null)
    return sum + (res?.pts ?? 0)
  }, 0)

  const exactCount = Object.entries(predictions).filter(([id, pred]) => {
    const match = MATCHES.find(m => m.id === id)
    return getPts(pred, match?.result ?? null)?.type === 'exact'
  }).length

  return (
    <main style={{ minHeight: '100vh', background: '#07090f', color: '#ddeeff', fontFamily: "'DM Sans', sans-serif", paddingBottom: '5rem' }}>
      {/* TOPBAR */}
      <div style={{ height: '54px', background: 'rgba(7,9,15,.97)', borderBottom: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', padding: '0 1rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#f8faff' }}>
          FUTBOL <span style={{ color: '#74ACDF' }}>DT</span>
        </div>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '.04em', margin: '0 0 .2rem' }}>Prode</div>
        <div style={{ fontSize: '12px', color: '#6a88aa', marginBottom: '1rem' }}>Predecí los resultados del Mundial</div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
          {[
            { key: 'pronosticos', label: '⚽ Pronósticos' },
            { key: 'ranking', label: '🏆 Ranking' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${tab === t.key ? '#74ACDF' : 'rgba(116,172,223,0.27)'}`, background: tab === t.key ? 'rgba(116,172,223,.15)' : 'transparent', color: tab === t.key ? '#74ACDF' : '#6a88aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB PRONÓSTICOS */}
        {tab === 'pronosticos' && (
          <>
            {/* PUNTOS STRIP */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '1rem' }}>
              {[
                { icon: '🎯', val: '+25', label: 'Exacto', color: '#f0c040' },
                { icon: '✅', val: '+10', label: 'Ganador', color: '#3fb950' },
                { icon: '❌', val: '0', label: 'Errado', color: '#f85149' },
                { icon: '📊', val: `${Object.keys(predictions).length}/48`, label: 'Cargados', color: '#74ACDF' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '10px', padding: '6px 10px' }}>
                  <span style={{ fontSize: '14px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: '9px', color: '#6a88aa', letterSpacing: '.04em' }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* MI PROGRESO */}
            <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(116,172,223,0.13)', fontSize: '10px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#6a88aa' }}>Mi progreso</div>
              <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[
                  { val: totalPts, label: 'Puntos', color: '#f0c040' },
                  { val: '#3', label: 'Posición', color: '#74ACDF' },
                  { val: exactCount, label: 'Exactos', color: '#3fb950' },
                  { val: Object.keys(predictions).length, label: 'Cargados', color: '#ffa657' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' as const, background: '#1c2333', borderRadius: '8px', padding: '8px 4px' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: '9px', color: '#6a88aa' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PARTIDOS */}
            {MATCHES.map(m => {
              const pred = predictions[m.id]
              const pts = getPts(pred, m.result)
              const isLocked = m.status !== 'open'
              const inp = inputs[m.id] || { h: pred?.h?.toString() || '', a: pred?.a?.toString() || '' }

              const ptsBg = pts?.type === 'exact' ? 'rgba(240,192,64,.08)' : pts?.type === 'correct' ? 'rgba(63,185,80,.08)' : pts?.type === 'wrong' ? 'rgba(248,81,73,.08)' : 'transparent'
              const ptsBorder = pts?.type === 'exact' ? '#f0c040' : pts?.type === 'correct' ? '#3fb950' : pts?.type === 'wrong' ? '#f85149' : 'rgba(116,172,223,0.13)'

              return (
                <div key={m.id} style={{ background: ptsBg, border: `1px solid ${ptsBorder}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '.8rem' }}>
                  {/* HEADER */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid rgba(116,172,223,0.08)' }}>
                    <span style={{ fontSize: '11px', color: '#6a88aa' }}>{m.date}</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px', background: m.status === 'open' ? 'rgba(63,185,80,.15)' : m.status === 'live' ? 'rgba(248,81,73,.15)' : 'rgba(116,172,223,.1)', color: m.status === 'open' ? '#3fb950' : m.status === 'live' ? '#f85149' : '#6a88aa', letterSpacing: '.06em' }}>
                      {m.status === 'open' ? 'ABIERTO' : m.status === 'live' ? 'EN VIVO' : 'FINALIZADO'}
                    </span>
                  </div>

                  {/* EQUIPOS */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '12px', gap: '8px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '28px' }}>{m.h}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, textAlign: 'center' as const }}>{m.hn}</span>
                    </div>

                    {/* INPUTS O RESULTADO */}
                    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px', minWidth: '100px' }}>
                      {isLocked && m.result ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', background: '#1c2333', borderRadius: '6px', padding: '2px 10px' }}>{m.result.h}</span>
                            <span style={{ color: '#3a5068', fontSize: '16px' }}>–</span>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', background: '#1c2333', borderRadius: '6px', padding: '2px 10px' }}>{m.result.a}</span>
                          </div>
                          {pred && <div style={{ fontSize: '10px', color: '#6a88aa' }}>Tu prode: {pred.h}–{pred.a}</div>}
                        </>
                      ) : isLocked ? (
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#3a5068' }}>VS</div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input type="number" min="0" max="20" value={inp.h} placeholder="0"
                            onChange={e => setInputs(prev => ({ ...prev, [m.id]: { ...inp, h: e.target.value } }))}
                            style={{ width: '44px', textAlign: 'center' as const, background: '#1c2333', border: '1px solid rgba(116,172,223,0.27)', borderRadius: '7px', padding: '6px 4px', color: '#ddeeff', fontSize: '16px', fontFamily: "'Bebas Neue', sans-serif", outline: 'none' }} />
                          <span style={{ color: '#3a5068', fontWeight: 700 }}>–</span>
                          <input type="number" min="0" max="20" value={inp.a} placeholder="0"
                            onChange={e => setInputs(prev => ({ ...prev, [m.id]: { ...inp, a: e.target.value } }))}
                            style={{ width: '44px', textAlign: 'center' as const, background: '#1c2333', border: '1px solid rgba(116,172,223,0.27)', borderRadius: '7px', padding: '6px 4px', color: '#ddeeff', fontSize: '16px', fontFamily: "'Bebas Neue', sans-serif", outline: 'none' }} />
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '28px' }}>{m.a}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, textAlign: 'center' as const }}>{m.an}</span>
                    </div>
                  </div>

                  {/* RESULTADO PRODE */}
                  {pts && (
                    <div style={{ margin: '0 12px 10px', padding: '6px 10px', borderRadius: '7px', background: pts.type === 'exact' ? 'rgba(240,192,64,.1)' : pts.type === 'correct' ? 'rgba(63,185,80,.1)' : 'rgba(248,81,73,.1)', textAlign: 'center' as const, fontSize: '12px', fontWeight: 600, color: pts.type === 'exact' ? '#f0c040' : pts.type === 'correct' ? '#3fb950' : '#f85149' }}>
                      {pts.type === 'exact' ? `🎯 ¡Exacto! +${pts.pts} pts` : pts.type === 'correct' ? `✅ Ganador correcto +${pts.pts} pts` : '❌ Errado · 0 pts'}
                    </div>
                  )}

                  {!isLocked && (
                    <div style={{ padding: '0 12px 10px' }}>
                      <button onClick={() => saveP(m.id)}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', background: pred ? 'rgba(116,172,223,.1)' : 'rgba(116,172,223,.2)', border: '1px solid rgba(116,172,223,0.3)', color: '#74ACDF', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        {pred ? '✓ Guardado — Modificar' : 'Guardar pronóstico'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}

        {/* TAB RANKING */}
        {tab === 'ranking' && (
          <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '38px 1fr 50px 50px 58px', padding: '7px 13px', borderBottom: '1px solid rgba(116,172,223,0.13)', fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: '#3a5068' }}>
              <div style={{ textAlign: 'center' as const }}>#</div>
              <div>DT</div>
              <div style={{ textAlign: 'center' as const }}>🎯</div>
              <div style={{ textAlign: 'center' as const }}>✅</div>
              <div style={{ textAlign: 'center' as const }}>PTS</div>
            </div>
            {RANKING_PRODE.map(p => (
              <div key={p.rank} style={{ display: 'grid', gridTemplateColumns: '38px 1fr 50px 50px 58px', alignItems: 'center', padding: '9px 13px', borderBottom: '1px solid rgba(116,172,223,0.06)', background: p.me ? 'rgba(116,172,223,.06)' : 'transparent', borderLeft: p.me ? '3px solid #74ACDF' : '3px solid transparent' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '17px', color: p.rank === 1 ? '#f0c040' : p.rank === 2 ? '#aabbd0' : p.rank === 3 ? '#c07030' : '#3a5068', textAlign: 'center' as const }}>{p.rank}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: p.color + '22', color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{p.av}</div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{p.name}{p.me ? ' 👈' : ''}</div>
                </div>
                <div style={{ fontSize: '10px', color: '#6a88aa', textAlign: 'center' as const }}>{p.exact}</div>
                <div style={{ fontSize: '10px', color: '#6a88aa', textAlign: 'center' as const }}>{p.winner}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '17px', color: '#f0c040', textAlign: 'center' as const }}>{p.pts}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '4rem', left: '50%', transform: 'translateX(-50%)', background: '#161b22', border: '1px solid rgba(116,172,223,0.3)', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, color: '#ddeeff', zIndex: 999, whiteSpace: 'nowrap' as const }}>
          {toast}
        </div>
      )}

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
            <span style={{ fontSize: '10px', fontWeight: 600, color: item.path === '/prode' ? '#74ACDF' : '#6a88aa' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </main>
  )
}