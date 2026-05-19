'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import dynamic from 'next/dynamic'
const BotWrapper = dynamic(() => import('@/components/bot/BotWrapper'), { ssr: false })

const COLORS = [
  { name: 'Celeste', hex: '#74ACDF' }, { name: 'Azul', hex: '#003087' },
  { name: 'Rojo', hex: '#e63030' }, { name: 'Verde', hex: '#1a8040' },
  { name: 'Amarillo', hex: '#f0c040' }, { name: 'Blanco', hex: '#f0f4ff' },
  { name: 'Negro', hex: '#222233' }, { name: 'Violeta', hex: '#6030c0' },
  { name: 'Naranja', hex: '#f07820' }, { name: 'Bordó', hex: '#801830' },
  { name: 'Dorado', hex: '#c89010' }, { name: 'Turquesa', hex: '#20a0c0' },
]

const SHIELDS = [
  { id: 'classic', label: 'Clásico' }, { id: 'round', label: 'Redondo' },
  { id: 'star', label: 'Estrella' }, { id: 'diamond', label: 'Diamante' },
  { id: 'crest', label: 'Heráldico' }, { id: 'modern', label: 'Moderno' },
  { id: 'pentagon', label: 'Pentágono' }, { id: 'hexagon', label: 'Hexágono' },
]

const JERSEYS = [
  { id: 'solid', label: 'Sólida' }, { id: 'stripes', label: 'Rayas V' },
  { id: 'horiz', label: 'Rayas H' }, { id: 'diagonal', label: 'Diagonal' },
  { id: 'halves', label: 'Mitades' }, { id: 'sash', label: 'Banda' },
  { id: 'quarters', label: 'Cuartos' }, { id: 'collar', label: 'Cuello V' },
]

function getInitials(name: string): string {
  if (!name || name.trim() === '') return 'FC'
  const words = name.trim().split(' ').filter(w => w.length > 0)
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase()
  if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase()
  return (words[0][0] + words[1][0] + words[2][0]).toUpperCase()
}

function shieldSVG(id: string, c1: string, c2: string, clubName: string = '') {
  const label = getInitials(clubName)
  const s: Record<string, string> = {
    classic: `
      <path d="M22 2L40 8L40 24Q40 36 22 42Q4 36 4 24L4 8Z" fill="${c1}"/>
      <path d="M22 2L31 5L31 24Q31 33 22 38Q13 33 13 24L13 5Z" fill="${c2}" opacity=".7"/>
      <text x="22" y="28" text-anchor="middle" font-size="${label.length > 2 ? '8' : '11'}" font-weight="700" fill="white" font-family="'Bebas Neue', sans-serif" letter-spacing="1">${label}</text>`,
    round: `
      <circle cx="22" cy="22" r="19" fill="${c1}"/>
      <circle cx="22" cy="22" r="13" fill="${c2}" opacity=".7"/>
      <text x="22" y="26" text-anchor="middle" font-size="${label.length > 2 ? '7' : '10'}" font-weight="700" fill="white" font-family="'Bebas Neue', sans-serif" letter-spacing="1">${label}</text>`,
    star: `
      <polygon points="22,2 27,15 41,15 30,24 34,38 22,30 10,38 14,24 3,15 17,15" fill="${c1}"/>
      <polygon points="22,8 26,18 36,18 28,24 31,34 22,28 13,34 16,24 8,18 18,18" fill="${c2}" opacity=".7"/>
      <text x="22" y="27" text-anchor="middle" font-size="${label.length > 2 ? '6' : '9'}" font-weight="700" fill="white" font-family="'Bebas Neue', sans-serif">${label}</text>`,
    diamond: `
      <polygon points="22,2 40,22 22,42 4,22" fill="${c1}"/>
      <polygon points="22,9 33,22 22,35 11,22" fill="${c2}" opacity=".7"/>
      <text x="22" y="26" text-anchor="middle" font-size="${label.length > 2 ? '6' : '9'}" font-weight="700" fill="white" font-family="'Bebas Neue', sans-serif">${label}</text>`,
    crest: `
      <path d="M22 2L38 6L38 20Q38 34 22 42Q6 34 6 20L6 6Z" fill="${c1}"/>
      <path d="M22 8L32 11L32 22Q32 31 22 37Q12 31 12 22L12 11Z" fill="${c2}" opacity=".6"/>
      <text x="22" y="28" text-anchor="middle" font-size="${label.length > 2 ? '7' : '10'}" font-weight="700" fill="white" font-family="'Bebas Neue', sans-serif">${label}</text>`,
    modern: `
      <rect x="4" y="4" width="36" height="36" rx="8" fill="${c1}"/>
      <rect x="10" y="10" width="24" height="24" rx="5" fill="${c2}" opacity=".7"/>
      <text x="22" y="28" text-anchor="middle" font-size="${label.length > 2 ? '8' : '11'}" font-weight="700" fill="white" font-family="'Bebas Neue', sans-serif" letter-spacing="1">${label}</text>`,
    pentagon: `
      <polygon points="22,2 40,15 33,36 11,36 4,15" fill="${c1}"/>
      <polygon points="22,8 34,18 29,32 15,32 10,18" fill="${c2}" opacity=".7"/>
      <text x="22" y="27" text-anchor="middle" font-size="${label.length > 2 ? '7' : '10'}" font-weight="700" fill="white" font-family="'Bebas Neue', sans-serif">${label}</text>`,
    hexagon: `
      <polygon points="22,2 38,12 38,32 22,42 6,32 6,12" fill="${c1}"/>
      <polygon points="22,9 32,15 32,29 22,35 12,29 12,15" fill="${c2}" opacity=".7"/>
      <text x="22" y="27" text-anchor="middle" font-size="${label.length > 2 ? '7' : '10'}" font-weight="700" fill="white" font-family="'Bebas Neue', sans-serif">${label}</text>`,
  }
  return s[id] || s.classic
}

function jerseySVG(id: string, c1: string, c2: string) {
  const shape = `M15 4L8 10L2 8L2 20L10 20L10 52L40 52L40 20L48 20L48 8L42 10L35 4Q30 0 25 0Q20 0 15 4Z`
  const bodyOnly = `M10 20L10 52L40 52L40 20Z`
  
  const patterns: Record<string, string> = {
    solid: '',
    stripes: `
      <rect x="12" y="0" width="7" height="56" fill="${c2}" opacity=".85"/>
      <rect x="25" y="0" width="7" height="56" fill="${c2}" opacity=".85"/>
      <rect x="38" y="0" width="7" height="56" fill="${c2}" opacity=".85"/>`,
    horiz: `
      <rect x="0" y="15" width="50" height="8" fill="${c2}" opacity=".85"/>
      <rect x="0" y="29" width="50" height="8" fill="${c2}" opacity=".85"/>
      <rect x="0" y="43" width="50" height="8" fill="${c2}" opacity=".85"/>`,
    diagonal: `
      <polygon points="0,0 50,0 50,40 0,56" fill="${c2}" opacity=".75"/>`,
    halves: `
      <rect x="25" y="0" width="25" height="56" fill="${c2}" opacity=".85"/>`,
    sash: `
      <polygon points="12,0 28,0 38,52 22,52" fill="${c2}" opacity=".8"/>`,
    quarters: `
      <rect x="2" y="28" width="21" height="24" fill="${c2}" opacity=".85"/>
      <rect x="27" y="0" width="21" height="24" fill="${c2}" opacity=".85"/>`,
    collar: `
      <path d="M17 6Q25 15 33 6" stroke="${c2}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  }

  const clipId = `jc-${id}-${c1.replace('#','')}`

  return `
    <defs>
      <clipPath id="${clipId}">
        <path d="${shape}"/>
      </clipPath>
    </defs>
    
    <!-- Base -->
    <path d="${shape}" fill="${c1}"/>
    
    <!-- Patron contenido dentro de la camiseta -->
    <g clip-path="url(#${clipId})">
      ${patterns[id] || ''}
    </g>
    
    <!-- Cuello encima de todo (sin clipPath) -->
    <path d="M17 5Q25 14 33 5" stroke="rgba(0,0,0,.3)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M17 5Q25 13 33 5" stroke="${c1}" stroke-width="2" fill="none" stroke-linecap="round"/>
    
    <!-- Borde camiseta -->
    <path d="${shape}" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="1"/>
    
    <!-- Sombra mangas -->
    <path d="M2 8L8 10L10 20" stroke="rgba(0,0,0,.1)" stroke-width="1.5" fill="none"/>
    <path d="M48 8L42 10L40 20" stroke="rgba(0,0,0,.1)" stroke-width="1.5" fill="none"/>
  `
}

export default function ClubPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const [name, setName] = useState('')
  const [stadium, setStadium] = useState('')
  const [hinchada, setHinchada] = useState('')
  const [grito, setGrito] = useState('')
  const [colorP, setColorP] = useState('#74ACDF')
  const [colorS, setColorS] = useState('#f0f4ff')
  const [shield, setShield] = useState('classic')
  const [jerseyH, setJerseyH] = useState('stripes')
  const [jerseyA, setJerseyA] = useState('solid')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const confirmClub = async () => {
    if (!name.trim()) { showToast('Ingresá el nombre del club'); return }
    if (!stadium.trim()) { showToast('Ingresá el nombre del estadio'); return }
    if (!hinchada.trim()) { showToast('Ingresá el nombre de la hinchada'); return }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const { error } = await supabase.from('clubs').upsert({
      user_id: user.id,
      name: name.trim(),
      shield_id: SHIELDS.findIndex(s => s.id === shield) + 1,
      primary_color: colorP,
      secondary_color: colorS,
      jersey_style: jerseyH,
    }, { onConflict: 'user_id' })

    setSaving(false)
    if (error) { showToast('Error al guardar. Intentá de nuevo.'); return }
    showToast('¡Club creado! 🎉')
    setTimeout(() => router.push('/jugadores'), 1200)
  }

  const colorName = (hex: string) => COLORS.find(c => c.hex === hex)?.name || hex

  const s = {
    page: { minHeight: '100vh', background: '#07090f', color: '#ddeeff', fontFamily: "'DM Sans', sans-serif", paddingBottom: '2rem' } as React.CSSProperties,
    inner: { maxWidth: '500px', margin: '0 auto', padding: '1rem' } as React.CSSProperties,
    card: { background: '#161b22', border: '1px solid rgba(116,172,223,0.13)', borderRadius: '12px', overflow: 'hidden', marginBottom: '.8rem' } as React.CSSProperties,
    cardHdr: { padding: '10px 14px', borderBottom: '1px solid rgba(116,172,223,0.13)', fontSize: '10px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#6a88aa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    cardBody: { padding: '12px 14px' } as React.CSSProperties,
    label: { fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: '#6a88aa', marginBottom: '5px' },
    input: { width: '100%', background: '#1c2333', border: '1px solid rgba(116,172,223,0.27)', borderRadius: '9px', padding: '9px 11px', color: '#ddeeff', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", outline: 'none', marginBottom: '7px' } as React.CSSProperties,
    btnPrimary: { width: '100%', padding: '13px', borderRadius: '10px', background: 'linear-gradient(135deg,#4a8ac4,#003087)', color: '#f8faff', border: 'none', fontSize: '15px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginTop: '.5rem' } as React.CSSProperties,
  }

  return (
    <main style={s.page}>
      {/* TOPBAR */}
      <div style={{ height: '54px', background: 'rgba(7,9,15,.97)', borderBottom: '1px solid rgba(116,172,223,0.13)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '1rem' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '.05em', color: '#f8faff' }}>
          FUTBOL <span style={{ color: '#74ACDF' }}>DT</span>
        </div>
      </div>

      <div style={s.inner}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '.04em', margin: '1rem 0 .2rem' }}>Crear mi Club</div>
        <div style={{ fontSize: '12px', color: '#6a88aa', marginBottom: '1.2rem' }}>Diseñá la identidad de tu club</div>

        {/* PREVIEW */}
        <div style={s.card}>
          <div style={s.cardHdr}>Vista previa</div>
          <div style={{ ...s.cardBody, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <svg width="52" height="52" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"
              dangerouslySetInnerHTML={{ __html: shieldSVG(shield, colorP, colorS, name) }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{name || 'Mi Club'}</div>
              <div style={{ fontSize: '11px', color: '#6a88aa' }}>{stadium || 'Estadio'} · {hinchada || 'La Hinchada'}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <svg width="36" height="42" viewBox="0 0 50 56" xmlns="http://www.w3.org/2000/svg"
                  dangerouslySetInnerHTML={{ __html: jerseySVG(jerseyH, colorP, colorS) }} />
                <div style={{ fontSize: '9px', color: '#3a5068', textTransform: 'uppercase' }}>Local</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <svg width="36" height="42" viewBox="0 0 50 56" xmlns="http://www.w3.org/2000/svg"
                  dangerouslySetInnerHTML={{ __html: jerseySVG(jerseyA, colorS, colorP) }} />
                <div style={{ fontSize: '9px', color: '#3a5068', textTransform: 'uppercase' }}>Visitante</div>
              </div>
            </div>
          </div>
        </div>

        {/* IDENTIDAD */}
        <div style={s.card}>
          <div style={s.cardHdr}>🏟️ Identidad del Club</div>
          <div style={s.cardBody}>
            <div style={s.label}>Nombre del Club</div>
            <input style={s.input} placeholder="ej: Club Atlético Los Pibes" maxLength={40} value={name} onChange={e => setName(e.target.value)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '.3rem' }}>
              <div>
                <div style={s.label}>Estadio</div>
                <input style={s.input} placeholder="ej: El Monumental" maxLength={40} value={stadium} onChange={e => setStadium(e.target.value)} />
              </div>
              <div>
                <div style={s.label}>Hinchada</div>
                <input style={s.input} placeholder="ej: La Barra del Sur" maxLength={40} value={hinchada} onChange={e => setHinchada(e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: '.3rem' }}>
              <div style={s.label}>Grito de guerra</div>
              <input style={s.input} placeholder="ej: ¡Dale dale, vamos Los Pibes!" maxLength={60} value={grito} onChange={e => setGrito(e.target.value)} />
            </div>
          </div>
        </div>

        {/* COLORES */}
        <div style={s.card}>
          <div style={s.cardHdr}>🎨 Colores del Club</div>
          <div style={s.cardBody}>
            <div style={s.label}>Color primario</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
              {COLORS.map(c => (
                <div key={c.hex} onClick={() => setColorP(c.hex)} title={c.name}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', background: c.hex, cursor: 'pointer', border: `2.5px solid ${colorP === c.hex ? 'white' : 'transparent'}`, boxShadow: colorP === c.hex ? '0 0 0 2px rgba(255,255,255,.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 700, transition: 'all .18s' }}>
                  {colorP === c.hex ? '✓' : ''}
                </div>
              ))}
            </div>
            <div style={s.label}>Color secundario</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {COLORS.map(c => (
                <div key={c.hex} onClick={() => setColorS(c.hex)} title={c.name}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', background: c.hex, cursor: 'pointer', border: `2.5px solid ${colorS === c.hex ? 'white' : 'transparent'}`, boxShadow: colorS === c.hex ? '0 0 0 2px rgba(255,255,255,.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 700, transition: 'all .18s' }}>
                  {colorS === c.hex ? '✓' : ''}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', background: '#1c2333', borderRadius: '9px', padding: '10px 12px' }}>
              <div style={{ display: 'flex', borderRadius: '7px', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ width: '36px', height: '36px', background: colorP }} />
                <div style={{ width: '36px', height: '36px', background: colorS }} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>{colorName(colorP)} y {colorName(colorS)}</div>
            </div>
          </div>
        </div>

        {/* ESCUDOS */}
        <div style={s.card}>
          <div style={s.cardHdr}>🛡️ Escudo del Club</div>
          <div style={s.cardBody}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(70px,1fr))', gap: '7px' }}>
              {SHIELDS.map(sh => (
                <div key={sh.id} onClick={() => setShield(sh.id)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 5px', borderRadius: '9px', border: `1.5px solid ${shield === sh.id ? '#f0c040' : 'rgba(116,172,223,0.27)'}`, background: shield === sh.id ? 'rgba(240,192,64,.07)' : 'transparent', cursor: 'pointer', transition: 'all .18s' }}>
                  <svg width="38" height="38" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"
                    dangerouslySetInnerHTML={{ __html: shieldSVG(sh.id, colorP, colorS, name) }} />
                  <div style={{ fontSize: '9px', color: '#6a88aa', textAlign: 'center' }}>{sh.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CAMISETAS */}
        <div style={s.card}>
          <div style={s.cardHdr}>👕 Camisetas</div>
          <div style={s.cardBody}>
            <div style={s.label}>Titular</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: '7px', marginBottom: '12px' }}>
              {JERSEYS.map(j => (
                <div key={j.id} onClick={() => setJerseyH(j.id)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 5px', borderRadius: '9px', border: `1.5px solid ${jerseyH === j.id ? '#74ACDF' : 'rgba(116,172,223,0.27)'}`, background: jerseyH === j.id ? 'rgba(116,172,223,.07)' : 'transparent', cursor: 'pointer', transition: 'all .18s' }}>
                  <svg width="44" height="50" viewBox="0 0 50 56" xmlns="http://www.w3.org/2000/svg"
                    dangerouslySetInnerHTML={{ __html: jerseySVG(j.id, colorP, colorS) }} />
                  <div style={{ fontSize: '9px', color: '#6a88aa', textAlign: 'center' }}>{j.label}</div>
                </div>
              ))}
            </div>
            <div style={s.label}>Alternativa</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: '7px' }}>
              {JERSEYS.map(j => (
                <div key={j.id} onClick={() => setJerseyA(j.id)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 5px', borderRadius: '9px', border: `1.5px solid ${jerseyA === j.id ? '#74ACDF' : 'rgba(116,172,223,0.27)'}`, background: jerseyA === j.id ? 'rgba(116,172,223,.07)' : 'transparent', cursor: 'pointer', transition: 'all .18s' }}>
                  <svg width="44" height="50" viewBox="0 0 50 56" xmlns="http://www.w3.org/2000/svg"
                    dangerouslySetInnerHTML={{ __html: jerseySVG(j.id, colorS, colorP) }} />
                  <div style={{ fontSize: '9px', color: '#6a88aa', textAlign: 'center' }}>{j.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button style={s.btnPrimary} onClick={confirmClub} disabled={saving}>
          {saving ? 'Guardando...' : '¡Confirmar Club y Armar Equipo! ⚽'}
        </button>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#161b22', border: '1px solid rgba(116,172,223,0.3)', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, color: '#ddeeff', zIndex: 999, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}
    </main>
  )
}