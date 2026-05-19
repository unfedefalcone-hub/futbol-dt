'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import Avatar from '@/components/ui/Avatar'
const BotWrapper = dynamic(() => import('@/components/bot/BotWrapper'), { ssr: false })

const BADGES = [
  { ic: '⚽', nm: 'Goleador', desc: 'FWD hicieron 10+ goles', ok: true },
  { ic: '🏆', nm: 'El DT', desc: 'Top 5 del ranking', ok: true },
  { ic: '🎯', nm: 'Adivinador', desc: '3 exactos en el prode', ok: true },
  { ic: '🛡️', nm: 'Defensor', desc: 'Arco en cero 5 veces', ok: true },
  { ic: '⭐', nm: 'Estrella', desc: 'Elegiste al figura', ok: true },
  { ic: '🤖', nm: 'Fan del Diego', desc: '10 trivias respondidas', ok: true },
  { ic: '🎊', nm: 'Campeón', desc: 'Ganaste una liga', ok: true },
  { ic: '🔥', nm: 'Racha', desc: 'Top 3 x 3 jornadas', ok: false, pct: 67 },
  { ic: '💰', nm: 'DT Millonario', desc: 'Usaste 95%+ presupuesto', ok: false, pct: 80 },
  { ic: '🌍', nm: 'Mundial', desc: '8+ selecciones en tu equipo', ok: false, pct: 75 },
  { ic: '📊', nm: 'Analista', desc: 'Revisá stats 20 veces', ok: false, pct: 60 },
  { ic: '👥', nm: 'Social', desc: '3 ligas de amigos', ok: false, pct: 67 },
  { ic: '🏅', nm: 'Prode Pro', desc: '10 pronósticos exactos', ok: false, pct: 40 },
  { ic: '⚡', nm: 'Veloz', desc: 'Prode en menos de 1 min', ok: false, pct: 0 },
  { ic: '🇦🇷', nm: 'Albiceleste', desc: '9 jugadores argentinos', ok: false, pct: 33 },
]

const TOP_PLAYERS = [
  { name: 'L. Messi', nation: '🇦🇷', pos: 'FWD', pts: 45, g: 2, a: 3 },
  { name: 'J. Álvarez', nation: '🇦🇷', pos: 'FWD', pts: 32, g: 3, a: 1 },
  { name: 'Bellingham', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'MID', pts: 28, g: 2, a: 1 },
  { name: 'Mac Allister', nation: '🇦🇷', pos: 'MID', pts: 22, g: 1, a: 1 },
  { name: 'E. Martínez', nation: '🇦🇷', pos: 'GK', pts: 18, g: 0, a: 0 },
]

const HIST = [
  { j: 'G7', teams: '🇺🇸 vs 🇨🇷', pred: '2-0', result: '2-0', type: 'exact', pts: 25 },
  { j: 'G8', teams: '🇦🇷 vs 🇵🇱', pred: '2-1', result: '3-1', type: 'winner', pts: 10 },
  { j: 'G9', teams: '🇫🇷 vs 🏴󠁧󠁢󠁥󠁮󠁧󠁿', pred: '1-2', result: '1-1', type: 'wrong', pts: 0 },
  { j: 'G10', teams: '🇧🇷 vs 🇪🇸', pred: '1-0', result: '0-0', type: 'wrong', pts: 0 },
  { j: 'G1', teams: '🇦🇷 vs 🇲🇽', pred: '2-0', result: '—', type: 'pending', pts: null },
]

const POS_COLOR: Record<string, string> = { GK: '#f0c040', DEF: '#74ACDF', MID: '#3fb950', FWD: '#f85149' }

const TABS = [
  { key: 'datos', label: '👤 Datos' },
  { key: 'stats', label: '📊 Stats' },
  { key: 'logros', label: '🏅 Logros' },
  { key: 'hist', label: '📋 Historial' },
  { key: 'cfg', label: '⚙️ Config' },
]

export default function PerfilPage() {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState('datos')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const s = {
    card: { background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden', marginBottom: '.8rem' } as React.CSSProperties,
    cardHdr: { padding: '10px 14px', borderBottom: '1px solid rgba(116,172,223,0.13)', fontSize: '10px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#6a88aa' },
    cardBody: { padding: '12px 14px' } as React.CSSProperties,
  }

  return (
    <main style={{ minHeight: '100vh', background: '#07090f', color: '#ddeeff', fontFamily: "'DM Sans', sans-serif", paddingBottom: '5rem' }}>
      <BotWrapper />

      {/* TOPBAR */}
      <div style={{ height: '54px', background: 'rgba(7,9,15,.97)', borderBottom: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', padding: '0 1rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#f8faff' }}>
          FUTBOL <span style={{ color: '#74ACDF' }}>DT</span>
        </div>
        <button onClick={() => router.push('/jugadores')}
          style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(116,172,223,0.27)', background: 'transparent', color: '#74ACDF', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          ← Volver
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>

        {/* HEADER PERFIL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
          <div style={{ borderRadius: '50%', border: '2px solid #74ACDF', overflow: 'hidden', flexShrink: 0 }}>
            <Avatar seed="DT2026" size={60} />
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '.04em' }}>Mi Perfil</div>
            <div style={{ fontSize: '12px', color: '#6a88aa' }}>DT desde el Mundial 2026</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'center' as const }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#f0c040' }}>247</div>
            <div style={{ fontSize: '10px', color: '#6a88aa' }}>PUNTOS</div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', overflowX: 'auto' as const, paddingBottom: '2px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '7px 12px', borderRadius: '8px', border: `1px solid ${tab === t.key ? '#74ACDF' : 'rgba(116,172,223,0.2)'}`, background: tab === t.key ? 'rgba(116,172,223,.15)' : 'transparent', color: tab === t.key ? '#74ACDF' : '#6a88aa', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB DATOS */}
        {tab === 'datos' && (
          <>
            <div style={s.card}>
              <div style={s.cardHdr}>Mi Club</div>
              <div style={s.cardBody}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(116,172,223,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛡️</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Mi Club FC</div>
                    <div style={{ fontSize: '11px', color: '#6a88aa' }}>El Monumental · La Hinchada</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardHdr}>Resumen de puntos</div>
              <div style={{ ...s.cardBody, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {[
                  { val: 162, label: 'Fantasy', color: '#74ACDF' },
                  { val: 75, label: 'Prode', color: '#f0c040' },
                  { val: 10, label: 'Trivia', color: '#3fb950' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' as const, background: '#1c2333', borderRadius: '8px', padding: '10px 4px' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: '10px', color: '#6a88aa' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB STATS */}
        {tab === 'stats' && (
          <div style={s.card}>
            <div style={s.cardHdr}>Top jugadores de mi equipo</div>
            <div style={s.cardBody}>
              {TOP_PLAYERS.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(116,172,223,0.06)' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#3a5068', minWidth: '20px', textAlign: 'center' as const }}>{i + 1}</div>
                  <span style={{ fontSize: '16px' }}>{p.nation}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '10px', color: '#6a88aa' }}>⚽ {p.g} · 🅰️ {p.a}</div>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: POS_COLOR[p.pos] + '22', color: POS_COLOR[p.pos] }}>{p.pos}</span>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#3fb950' }}>+{p.pts}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB LOGROS */}
        {tab === 'logros' && (
          <>
            <div style={{ fontSize: '12px', color: '#6a88aa', marginBottom: '1rem' }}>
              {BADGES.filter(b => b.ok).length}/{BADGES.length} logros desbloqueados
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
              {BADGES.map((b, i) => (
                <div key={i} style={{ background: b.ok ? 'rgba(116,172,223,.08)' : '#161b22', border: `1px solid ${b.ok ? 'rgba(116,172,223,.3)' : 'rgba(116,172,223,0.1)'}`, borderRadius: '10px', padding: '10px 8px', textAlign: 'center' as const, opacity: b.ok ? 1 : 0.6 }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px', filter: b.ok ? 'none' : 'grayscale(100%)' }}>{b.ic}</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>{b.nm}</div>
                  <div style={{ fontSize: '9px', color: '#6a88aa', lineHeight: 1.3 }}>{b.desc}</div>
                  {!b.ok && b.pct !== undefined && (
                    <div style={{ marginTop: '6px', height: '3px', background: '#1c2333', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.pct}%`, background: '#74ACDF', borderRadius: '2px' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB HISTORIAL */}
        {tab === 'hist' && (
          <div style={s.card}>
            <div style={s.cardHdr}>Historial de pronósticos</div>
            <div style={s.cardBody}>
              {HIST.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(116,172,223,0.06)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#3a5068', minWidth: '28px' }}>{h.j}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px' }}>{h.teams}</div>
                    <div style={{ fontSize: '10px', color: '#6a88aa' }}>Prode: {h.pred} · Real: {h.result}</div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: h.type === 'exact' ? '#f0c040' : h.type === 'winner' ? '#3fb950' : h.type === 'wrong' ? '#f85149' : '#6a88aa' }}>
                    {h.type === 'exact' ? '🎯' : h.type === 'winner' ? '✅' : h.type === 'wrong' ? '❌' : '⏳'}
                    {h.pts !== null ? ` +${h.pts}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONFIG */}
        {tab === 'cfg' && (
          <div style={s.card}>
            <div style={s.cardHdr}>Configuración</div>
            <div style={s.cardBody}>
              <button onClick={() => router.push('/club')}
                style={{ width: '100%', padding: '11px', borderRadius: '9px', background: 'rgba(116,172,223,.1)', border: '1px solid rgba(116,172,223,.3)', color: '#74ACDF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: '8px' }}>
                ✏️ Editar mi club
              </button>
              <button onClick={handleSignOut}
                style={{ width: '100%', padding: '11px', borderRadius: '9px', background: 'rgba(248,81,73,.08)', border: '1px solid rgba(248,81,73,.3)', color: '#f85149', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                🚪 Cerrar sesión
              </button>
            </div>
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
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6a88aa' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </main>
  )
}