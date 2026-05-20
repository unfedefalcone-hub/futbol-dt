'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
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

const POS_COLOR: Record<string, string> = { GK: '#f0c040', DEF: '#74ACDF', MID: '#3fb950', FWD: '#f85149' }
const POS_LABEL: Record<string, string> = { GK: 'ARQ', DEF: 'DEF', MID: 'MED', FWD: 'DEL' }

export default function EquipoPage() {
  const router = useRouter()
  const supabase = createClient()
  const { profile } = useAuth()

  const [teamPlayers, setTeamPlayers] = useState<any[]>([])
  const [formation, setFormation] = useState('4-3-3')
  const [captainId, setCaptainId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    if (!profile?.id) return
    async function fetchTeam() {
      setLoading(true)
      const { data: team } = await supabase
        .from('teams')
        .select('id, formation')
        .eq('user_id', profile!.id)
        .single()

      if (!team) { setLoading(false); return }

      setFormation(team.formation || '4-3-3')

      const { data: tp } = await supabase
        .from('team_players')
        .select(`
          id, role, position_slot,
          players!inner ( id, name, position,
            nations ( name, flag_emoji )
          )
        `)
        .eq('team_id', team.id)
        .order('position_slot', { ascending: true })

      if (tp) {
        setTeamPlayers(tp)
        const cap = tp.find((p: any) => p.role === 'captain')
        if (cap) setCaptainId((cap.players as any)?.id)
      }
      setLoading(false)
    }
    fetchTeam()
  }, [profile?.id])

  async function handleSetCaptain(playerId: string) {
    if (!profile?.id) return
    setCaptainId(playerId)

    const { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('user_id', profile.id)
      .single()

    if (!team) return

    // Resetear todos a starter
    await supabase
      .from('team_players')
      .update({ role: 'starter' })
      .eq('team_id', team.id)

    // Setear capitán
    const tp = teamPlayers.find((p: any) => p.players?.id === playerId)
    if (tp) {
      await supabase
        .from('team_players')
        .update({ role: 'captain' })
        .eq('id', tp.id)
    }

    showToast('✅ Capitán actualizado')
  }

  const starters = teamPlayers.filter((p: any) => p.role !== 'bench').slice(0, 11)
  const bench = teamPlayers.filter((p: any) => p.role === 'bench')
  const totalPts = 0 // se conecta con scoreEngine cuando haya partidos

  const slots = FORMATIONS[formation] || FORMATIONS['4-3-3']
  const byPos: Record<string, any[]> = { GK: [], DEF: [], MID: [], FWD: [] }
  starters.forEach((tp: any) => {
    const pos = tp.players?.position
    if (pos && byPos[pos]) byPos[pos].push(tp)
  })
  const cnt: Record<string, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#07090f' }}>
      <div style={{ color: '#74ACDF', fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px' }}>
        Cargando equipo...
      </div>
    </div>
  )

  if (teamPlayers.length === 0) return (
    <main style={{ minHeight: '100vh', background: '#07090f', color: '#ddeeff', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '48px' }}>⚽</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#74ACDF' }}>
        Todavía no armaste tu equipo
      </div>
      <button
        onClick={() => router.push('/jugadores')}
        style={{ padding: '12px 24px', borderRadius: '12px', background: '#f0c040', color: '#07090f', fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', border: 'none', cursor: 'pointer' }}>
        IR A JUGADORES
      </button>
    </main>
  )

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
        <div style={{ fontSize: '12px', color: '#6a88aa', marginBottom: '1rem' }}>
          Formación: <strong style={{ color: '#74ACDF' }}>{formation}</strong>
        </div>

        {/* CAMPO SVG */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,.5)', marginBottom: '1rem' }}>
          <svg width="100%" viewBox="0 0 320 490" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <defs>
              <filter id="sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,.5)" /></filter>
            </defs>
            <rect width="320" height="490" fill="#1a6e2e" />
            <rect y="0" width="320" height="49" fill="#1f8035" />
            <rect y="98" width="320" height="49" fill="#1f8035" />
            <rect y="196" width="320" height="49" fill="#1f8035" />
            <rect y="294" width="320" height="49" fill="#1f8035" />
            <rect y="392" width="320" height="49" fill="#1f8035" />
            <rect x="20" y="20" width="280" height="450" rx="4" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
            <line x1="20" y1="245" x2="300" y2="245" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
            <circle cx="160" cy="245" r="40" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
            <rect x="80" y="20" width="160" height="70" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
            <rect x="80" y="400" width="160" height="70" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
            <rect x="128" y="14" width="64" height="10" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
            <rect x="128" y="466" width="64" height="10" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />

            {slots.map((slot, i) => {
              const pl = byPos[slot.pos]?.[cnt[slot.pos]++]
              const cx = (slot.x / 100) * 320
              const cy = (slot.y / 100) * 490
              if (!pl) return (
                <circle key={i} cx={cx} cy={cy} r="16" fill="rgba(116,172,223,.12)" stroke="rgba(116,172,223,.3)" strokeDasharray="4 2" />
              )
              const isCap = pl.players?.id === captainId
              const flagCode = pl.players?.nations?.flag_emoji?.toLowerCase()
              return (
                <g key={i} style={{ cursor: 'pointer' }}>
                  <circle cx={cx} cy={cy} r="18" fill="#4a8ac4" stroke={isCap ? '#f0c040' : '#74ACDF'} strokeWidth={isCap ? 3 : 2} filter="url(#sh)" />
                  {flagCode && (
                    <image href={`https://flagcdn.com/w40/${flagCode}.png`} x={cx - 12} y={cy - 8} width="24" height="16" clipPath="url(#circle-clip)" style={{ borderRadius: '50%' }} />
                  )}
                  {isCap && <>
                    <circle cx={cx + 13} cy={cy - 13} r="7" fill="#f0c040" />
                    <text x={cx + 13} y={cy - 9} textAnchor="middle" fontSize="8" fontWeight="700" fill="#000e2e" fontFamily="sans-serif">C</text>
                  </>}
                  <rect x={cx - 20} y={cy + 20} width="40" height="12" rx="3" fill="rgba(7,9,15,.85)" />
                  <rect x={cx - 22} y={cy + 33} width="44" height="11" rx="2" fill="rgba(0,0,0,.6)" />
                  <text x={cx} y={cy + 42} textAnchor="middle" fontSize="7" fill="white" fontFamily="sans-serif">
                    {(pl.players?.name || '').length > 10 ? (pl.players?.name || '').slice(0, 9) + '…' : (pl.players?.name || '')}
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
            Titulares — tocá un jugador para hacerlo capitán
          </div>
          <div style={{ padding: '8px 14px' }}>
            {['GK', 'DEF', 'MID', 'FWD'].map(pos =>
              starters.filter((tp: any) => tp.players?.position === pos).map((tp: any) => {
                const isCap = tp.players?.id === captainId
                const flagCode = tp.players?.nations?.flag_emoji?.toLowerCase()
                return (
                  <div
                    key={tp.id}
                    onClick={() => handleSetCaptain(tp.players?.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(116,172,223,0.06)', cursor: 'pointer', background: isCap ? 'rgba(240,192,64,0.05)' : 'transparent', borderRadius: '8px', paddingLeft: '4px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: POS_COLOR[pos] + '22', color: POS_COLOR[pos], minWidth: '28px', textAlign: 'center' as const }}>{POS_LABEL[pos]}</span>
                    {flagCode && (
                      <img src={`https://flagcdn.com/w40/${flagCode}.png`} alt="" style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
                    )}
                    <span style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>
                      {tp.players?.name}
                      {isCap && <span style={{ color: '#f0c040', marginLeft: '6px', fontSize: '11px' }}>© Capitán</span>}
                    </span>
                    {isCap && <span style={{ fontSize: '16px' }}>⭐</span>}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* SUPLENTES */}
        <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(116,172,223,0.13)', fontSize: '10px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#6a88aa' }}>
            Suplentes
          </div>
          <div style={{ padding: '8px 14px' }}>
            {bench.map((tp: any) => {
              const flagCode = tp.players?.nations?.flag_emoji?.toLowerCase()
              return (
                <div key={tp.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(116,172,223,0.06)', opacity: 0.7 }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: POS_COLOR[tp.players?.position] + '22', color: POS_COLOR[tp.players?.position], minWidth: '28px', textAlign: 'center' as const }}>{POS_LABEL[tp.players?.position]}</span>
                  {flagCode && (
                    <img src={`https://flagcdn.com/w40/${flagCode}.png`} alt="" style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
                  )}
                  <span style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>{tp.players?.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* BTN IR A JUGADORES */}
        <button
          onClick={() => router.push('/jugadores')}
          style={{ width: '100%', marginTop: '1rem', padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid rgba(116,172,223,0.3)', color: '#74ACDF', fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', cursor: 'pointer' }}>
          ✏️ MODIFICAR EQUIPO
        </button>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', background: '#161b22', border: '1px solid rgba(116,172,223,0.3)', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, color: '#ddeeff', zIndex: 999 }}>
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
            <span style={{ fontSize: '10px', fontWeight: 600, color: item.path === '/equipo' ? '#74ACDF' : '#6a88aa' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </main>
  )
}