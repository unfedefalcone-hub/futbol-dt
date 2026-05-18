'use client'

import { useState, useEffect, useCallback } from 'react'

const IMGS: Record<string, string> = {
  Hola: "https://i.ibb.co/tMSrntN4/Hola.png",
  Reglamento: "https://i.ibb.co/QvCHDWGx/Reglamento.png",
  DT: "https://i.ibb.co/dJpydPPw/DT.png",
  MuyBien: "https://i.ibb.co/KjBGTSWy/MuyBien.png",
  Patear: "https://i.ibb.co/7x9D6m8r/Patear.png",
  Penal: "https://i.ibb.co/dwWs66sN/Penal.png",
  Amarilla: "https://i.ibb.co/mV8hZ8FD/Amarilla.png",
  Roja: "https://i.ibb.co/SXB5bS44/Roja.png",
  Gol: "https://i.ibb.co/7dKQTcL6/Gol.png",
  Fulbo: "https://i.ibb.co/XfBCD98M/Fulbo.png",
  Bandera: "https://i.ibb.co/6RmJjYym/Bandera.png",
  Mundial: "https://i.ibb.co/hJpTvxGD/Mundial.png",
  Trivia: "https://i.ibb.co/W4hbscnC/Trivia.png",
  TriviaCorrecta: "https://i.ibb.co/gZGLKmhG/Trivia_Correcta.png",
  TriviaIncorrecta: "https://i.ibb.co/chPrRDQh/Trivia_Incorrecta.png",
  TriviaOK: "https://i.ibb.co/BHjcxFBX/Trivia_OK.png",
  Jajaja: "https://i.ibb.co/HfYm8K9n/Jajaja.png",
  Papelitos: "https://i.ibb.co/tptm07Px/Papelitos.png",
  Aburrido: "https://i.ibb.co/fYBF2ydP/Aburrido.png",
  DAB: "https://i.ibb.co/qFDb82qQ/DAB.png",
  Enojado: "https://i.ibb.co/6JfFhs8L/Enojado.png",
  Sorpresa: "https://i.ibb.co/yFWWCCzp/Sorpresa.png",
  Baila: "https://i.ibb.co/1J8b9NbR/Baila.png",
  Llora: "https://i.ibb.co/F4bc7frK/Llora.png",
  Festejo: "https://i.ibb.co/ns0L3p67/Festejo.png",
  WTF: "https://i.ibb.co/L4bBCtg/WTF.png",
}

const AMBIENT = ['Jajaja', 'Papelitos', 'Aburrido', 'DAB', 'Enojado', 'Sorpresa', 'Baila', 'Llora', 'Festejo', 'WTF']

const TRIVIA = [
  { q: '¿En qué año se jugó el primer Mundial?', opts: ['1926', '1930', '1934', '1938'], ans: 1 },
  { q: '¿Cuántos goles hizo Klose en Mundiales?', opts: ['14', '15', '16', '17'], ans: 2 },
  { q: '¿Qué país ganó el Mundial 2022?', opts: ['Francia', 'Brasil', 'Argentina', 'Croacia'], ans: 2 },
  { q: '¿En qué ciudad fue la final del Mundial 2014?', opts: ['São Paulo', 'Brasilia', 'Río de Janeiro', 'Buenos Aires'], ans: 2 },
  { q: '¿Goleador del Mundial 1986?', opts: ['Platini', 'Lineker', 'Maradona', 'Butragueño'], ans: 1 },
]

type ModalType = 'hola' | 'reglamento' | 'trivia' | null

export default function BotFloat() {
  const [ambientIdx, setAmbientIdx] = useState(0)
  const [currentImg, setCurrentImg] = useState(IMGS.Jajaja)
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)
  const [triviaIdx, setTriviaIdx] = useState(0)
  const [triviaScore, setTriviaScore] = useState(0)
  const [triviaResult, setTriviaResult] = useState('')
  const [triviaFinished, setTriviaFinished] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setAmbientIdx(prev => {
        const next = (prev + 1) % AMBIENT.length
        setCurrentImg(IMGS[AMBIENT[next]])
        return next
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [paused])

  const openModal = (type: ModalType, img: string) => {
    setPaused(true)
    setCurrentImg(IMGS[img])
    setModal(type)
    setBubbleOpen(false)
  }

  const closeModal = () => {
    setModal(null)
    setPaused(false)
    setCurrentImg(IMGS[AMBIENT[ambientIdx]])
  }

  const startTrivia = () => {
    setTriviaIdx(0)
    setTriviaScore(0)
    setTriviaResult('')
    setTriviaFinished(false)
    openModal('trivia', 'Trivia')
  }

  const answerTrivia = (idx: number) => {
    const q = TRIVIA[triviaIdx]
    const ok = idx === q.ans
    if (ok) {
      setTriviaScore(prev => prev + 1)
      setCurrentImg(IMGS.TriviaCorrecta)
      setTriviaResult('¡Correcto! +1 punto')
    } else {
      setCurrentImg(IMGS.TriviaIncorrecta)
      setTriviaResult(`Incorrecto. Era: ${q.opts[q.ans]}`)
    }
    setTimeout(() => {
      if (triviaIdx + 1 < TRIVIA.length) {
        setTriviaIdx(prev => prev + 1)
        setTriviaResult('')
        setCurrentImg(IMGS.Trivia)
      } else {
        setTriviaFinished(true)
        setCurrentImg(IMGS.TriviaOK)
      }
    }, 1600)
  }

  return (
    <>
      {/* BOT FLOTANTE */}
      <div style={{ position: 'fixed', bottom: '70px', right: '16px', zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>

        {/* BUBBLE */}
        {bubbleOpen && (
          <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.3)', borderRadius: '12px', padding: '10px 14px', maxWidth: '200px', fontSize: '12px', color: '#ddeeff', lineHeight: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}>
            <div style={{ fontWeight: 700, marginBottom: '6px', color: '#74ACDF' }}>Diego MaraBOTona 🇦🇷</div>
            <div style={{ marginBottom: '8px' }}>¡Hola! Estoy acá para ayudarte 🤙</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button onClick={() => openModal('hola', 'Hola')}
                style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(116,172,223,0.3)', background: 'transparent', color: '#74ACDF', fontSize: '11px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textAlign: 'left' }}>
                📋 Ver reglamento
              </button>
              <button onClick={startTrivia}
                style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(240,192,64,0.3)', background: 'transparent', color: '#f0c040', fontSize: '11px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textAlign: 'left' }}>
                🎯 Jugar trivia
              </button>
            </div>
          </div>
        )}

        {/* BOT IMAGE */}
        <div onClick={() => setBubbleOpen(prev => !prev)} style={{ cursor: 'pointer', width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(116,172,223,0.4)', boxShadow: '0 4px 20px rgba(0,0,0,.4)', background: '#161b22' }}>
          <img src={currentImg} alt="DieBOT" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      </div>

      {/* MODAL HOLA */}
      {modal === 'hola' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.2)', borderRadius: '16px', padding: '1.5rem', maxWidth: '340px', width: '100%', textAlign: 'center' }}>
            <img src={IMGS.Hola} alt="Hola" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '.04em', marginBottom: '8px' }}>¡Hola! Soy Diego MaraBOTona</div>
            <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6, marginBottom: '1rem' }}>
              ¡Hola! Te voy a acompañar en el juego 🇦🇷<br /><br />
              <strong style={{ color: '#ddeeff' }}>FUTBOL DT</strong> es el fantasy del <strong style={{ color: '#ddeeff' }}>Mundial 2026</strong>.<br />
              Armá tu equipo de 23 jugadores y competí contra miles de DTs. 🏆
            </div>
            <button onClick={() => { closeModal(); setTimeout(() => openModal('reglamento', 'Reglamento'), 300) }}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg,#4a8ac4,#003087)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Ver reglamento →
            </button>
          </div>
        </div>
      )}

      {/* MODAL REGLAMENTO */}
      {modal === 'reglamento' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.2)', borderRadius: '16px', padding: '1.5rem', maxWidth: '340px', width: '100%', textAlign: 'center' }}>
            <img src={IMGS.Reglamento} alt="Reglamento" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '.04em', marginBottom: '8px' }}>Reglamento</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 2, marginBottom: '1rem', textAlign: 'left' }}>
              ⚽ 23 jugadores por equipo<br />
              💰 Presupuesto: $500M USD<br />
              🌍 Máx. 3 jugadores por selección<br />
              🔄 1 ventana de cambios post grupos<br />
              🏆 Suplentes que juegan también puntúan<br />
              ⚡ Puntos por cada evento del partido
            </div>
            <button onClick={closeModal}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg,#4a8ac4,#003087)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

      {/* MODAL TRIVIA */}
      {modal === 'trivia' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#161b22', border: '1px solid rgba(116,172,223,0.2)', borderRadius: '16px', padding: '1.5rem', maxWidth: '340px', width: '100%', textAlign: 'center' }}>
            <img src={currentImg} alt="Trivia" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />

            {!triviaFinished ? (
              <>
                <div style={{ fontSize: '11px', color: '#6a88aa', marginBottom: '8px' }}>Pregunta {triviaIdx + 1} de {TRIVIA.length}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.4 }}>{TRIVIA[triviaIdx].q}</div>
                {triviaResult ? (
                  <div style={{ fontSize: '13px', color: triviaResult.includes('Correcto') ? '#3fb950' : '#f85149', marginBottom: '1rem' }}>{triviaResult}</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
                    {TRIVIA[triviaIdx].opts.map((opt, i) => (
                      <button key={i} onClick={() => answerTrivia(i)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(116,172,223,0.27)', background: '#1c2333', color: '#ddeeff', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', marginBottom: '8px' }}>¡Trivia finalizada!</div>
                <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Acertaste {triviaScore} de {TRIVIA.length}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#f0c040', marginBottom: '1rem' }}>+{triviaScore} pts</div>
                <button onClick={closeModal}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg,#4a8ac4,#003087)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  ¡Genial!
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}