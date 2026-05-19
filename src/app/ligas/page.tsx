'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
const BotWrapper = dynamic(() => import('@/components/bot/BotWrapper'), { ssr: false })

const LIGAS_DEMO = [
  {
    ico: '🏠', nm: 'Los Pibes del Barrio', members: 8, max: 10, myRank: 2, code: 'PIBES26',
    top: [
      { r: 1, n: 'El_Pibe_DT', pts: 312, av: 'EP', c: '#74ACDF' },
      { r: 2, n: 'Vos', pts: 247, av: 'YO', c: '#4a8ac4', me: true },
      { r: 3, n: 'Carlitos', pts: 231, av: 'CA', c: '#3fb950' },
    ]
  },
  {
    ico: '👨‍👩‍👧‍👦', nm: 'Familia Champions', members: 6, max: 10, myRank: 1, code: 'FAMILIA26',
    top: [
      { r: 1, n: 'Vos', pts: 247, av: 'YO', c: '#4a8ac4', me: true },
      { r: 2, n: 'HermanoDT', pts: 198, av: 'HD', c: '#74ACDF' },
      { r: 3, n: 'PrimoCrack', pts: 175, av: 'PC', c: '#3fb950' },
    ]
  },
]

export default function LigasPage() {
  const router = useRouter()
  const [newLiga, setNewLiga] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const createLiga = () => {
    if (!newLiga.trim()) { showToast('Ingresá un nombre'); return }
    showToast(`Liga "${newLiga}" creada ✓`)
    setNewLiga('')
  }

  const joinLiga = () => {
    if (!joinCode.trim()) { showToast('Ingresá un código'); return }
    showToast(`¡Te uniste a la liga ${joinCode}! 🏆`)
    setJoinCode('')
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    showToast(`Código copiado: ${code}`)
  }

  const s = {
    card: { background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden', marginBottom: '.8rem' } as React.CSSProperties,
    cardBody: { padding: '12px 14px' } as React.CSSProperties,
    input: { width: '100%', background: '#1c2333', border: '1px solid rgba(116,172,223,0.27)', borderRadius: '9px', padding: '9px 11px', color: '#ddeeff', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", outline: 'none', marginBottom: '8px' } as React.CSSProperties,
    btnCel: { width: '100%', padding: '9px', borderRadius: '8px', background: '#74ACDF', color: '#000e2e', border: 'none', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' } as React.CSSProperties,
    btnSm: { width: '100%', padding: '9px', borderRadius: '8px', background: 'transparent', color: '#74ACDF', border: '1px solid #74ACDF', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' } as React.CSSProperties,
  }

  return (
    <main style={{ minHeight: '100vh', background: '#07090f', color: '#ddeeff', fontFamily: "'DM Sans', sans-serif", paddingBottom: '5rem' }}>
      <BotWrapper />
      {/* TOPBAR */}
      <div style={{ height: '54px', background: 'rgba(7,9,15,.97)', borderBottom: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', padding: '0 1rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#f8faff' }}>
          FUTBOL <span style={{ color: '#74ACDF' }}>DT</span>
        </div>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '.04em', margin: '0 0 .2rem' }}>Mis Ligas</div>
        <div style={{ fontSize: '12px', color: '#6a88aa', marginBottom: '1.2rem' }}>Competí con tus amigos y familia</div>

        {/* ACCIONES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
          {/* CREAR */}
          <div style={s.card}>
            <div style={s.cardBody}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>🏆 Crear liga</div>
              <div style={{ fontSize: '11px', color: '#6a88aa', marginBottom: '10px' }}>Invitá amigos con un código único</div>
              <input style={s.input} placeholder="Nombre de la liga" value={newLiga} onChange={e => setNewLiga(e.target.value)} />
              <button style={s.btnCel} onClick={createLiga}>Crear</button>
            </div>
          </div>

          {/* UNIRSE */}
          <div style={s.card}>
            <div style={s.cardBody}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>🔗 Unirse</div>
              <div style={{ fontSize: '11px', color: '#6a88aa', marginBottom: '10px' }}>Ingresá el código de tu amigo</div>
              <input style={{ ...s.input, textTransform: 'uppercase' as const }} placeholder="Código (ej: PIBES26)" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} />
              <button style={s.btnSm} onClick={joinLiga}>Unirse</button>
            </div>
          </div>
        </div>

        {/* MIS LIGAS */}
        {LIGAS_DEMO.map(liga => (
          <div key={liga.code} style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden', marginBottom: '.8rem' }}>
            {/* HEADER LIGA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderBottom: '1px solid rgba(116,172,223,0.08)' }}>
              <div style={{ fontSize: '24px' }}>{liga.ico}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{liga.nm}</div>
                <div style={{ fontSize: '11px', color: '#6a88aa' }}>
                  {liga.members}/{liga.max} miembros · <span style={{ color: '#74ACDF', fontWeight: 600 }}>{liga.code}</span>
                </div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#f0c040' }}>#{liga.myRank}</div>
            </div>

            {/* TOP 3 */}
            <div style={{ padding: '8px 14px' }}>
              {liga.top.map(p => (
                <div key={p.r} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(116,172,223,0.06)', background: p.me ? 'rgba(116,172,223,.04)' : 'transparent' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: p.r === 1 ? '#f0c040' : p.r === 2 ? '#aabbd0' : '#c07030', minWidth: '20px', textAlign: 'center' as const }}>{p.r}</div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: p.c + '22', color: p.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{p.av}</div>
                  <div style={{ flex: 1, fontSize: '12px', fontWeight: p.me ? 700 : 500 }}>{p.n}{p.me ? ' 👈' : ''}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#f0c040' }}>{p.pts}</div>
                </div>
              ))}
              <div style={{ fontSize: '10px', color: '#3a5068', textAlign: 'center' as const, padding: '6px 0' }}>
                + {liga.members - liga.top.length} más
              </div>
              <button onClick={() => copyCode(liga.code)}
                style={{ width: '100%', padding: '6px', borderRadius: '7px', border: '1px solid rgba(116,172,223,0.2)', background: 'transparent', color: '#6a88aa', fontSize: '11px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                📋 Copiar código
              </button>
            </div>
          </div>
        ))}
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
            <span style={{ fontSize: '10px', fontWeight: 600, color: item.path === '/ligas' ? '#74ACDF' : '#6a88aa' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </main>
  )
}