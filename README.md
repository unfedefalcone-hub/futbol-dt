# FUTBOL DT — Estado Actual del Proyecto
## Actualizado: Mayo 2026

---

## 🚀 PRODUCCIÓN
- **URL**: https://futbol-dt.vercel.app
- **Repo GitHub**: https://github.com/unfedefalcone-hub/futbol-dt
- **Rama activa**: `master`
- **⚠️ Nota Vercel**: cada push va a Preview — hacer "Promote to Production" manualmente en Deployments

---

## 🔑 CREDENCIALES
NEXT_PUBLIC_SUPABASE_URL=https://mfgtwfjeflnrmwqdacos.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
---

## ✅ COMPLETADO

### Infraestructura
- Next.js 14 + TypeScript + Tailwind
- Supabase con 11 tablas y RLS configurado
- Google OAuth funcionando
- Deploy en Vercel
- Variables de entorno configuradas en Vercel
- DiceBear instalado (`@dicebear/core` + `@dicebear/collection`)

### Pantallas migradas y conectadas a Supabase
| Pantalla | Ruta | Estado |
|----------|------|--------|
| Login | `/` | ✅ Google OAuth + redirect a /club |
| Club | `/club` | ✅ Escudos SVG + camisetas SVG mejoradas + iniciales en escudo |
| Jugadores | `/jugadores` | ✅ Datos reales + banderas con flagcdn.com + $500M presupuesto |
| Equipo | `/equipo` | ✅ Campo SVG + formaciones |
| Ranking | `/ranking` | ✅ Datos reales de Supabase |
| Ligas | `/ligas` | ✅ Crear + unirse |
| Prode | `/prode` | ✅ 72 partidos reales + guardar pronósticos |
| Perfil | `/perfil` | ✅ 5 tabs + logros + galería avatares DiceBear |

### Archivos clave
- `src/components/bot/BotFloat.tsx` — Bot DieBOT
- `src/components/bot/BotWrapper.tsx` — Wrapper SSR
- `src/components/ClientLayout.tsx` — Layout cliente con DieBOT global
- `src/components/ui/Avatar.tsx` — Avatares DiceBear (18 opciones, 4 estilos)
- `src/hooks/useSupabaseData.ts` — usePlayers, useRanking, useProde + merge manual nations
- `src/hooks/useRealtime.ts` — Realtime hooks para eventos en vivo
- `src/lib/scoreEngine.ts` — Motor de puntajes con reglamento oficial
- `src/app/layout.tsx` — Layout global con ClientLayout

### Bot DieBOT
- 26 PNGs en ImgBB
- Aparece en TODAS las pantallas via ClientLayout
- Ambient, trivia, modales Hola y Reglamento

### Base de datos Supabase
- 11 tablas con RLS
- RLS policies públicas en `players` y `nations`
- 48 selecciones del Mundial 2026 cargadas (Grupos A-L)
- 72 partidos de fase de grupos cargados
- 118 jugadores reales cargados (Brasil, Francia, Bélgica, Portugal, Croacia, Japón, Escocia, Noruega)

### Mejoras de diseño completadas
- ✅ Camisetas SVG con clipPath — patrones contenidos dentro de la forma
- ✅ Iniciales del club en el escudo en tiempo real
- ✅ Galería de 18 avatares DiceBear en perfil (avataaars, bottts, pixelArt, funEmoji)
- ✅ Banderas de países con flagcdn.com (código ISO → imagen)
- ✅ Presupuesto corregido a $500M

---

## ⏳ PENDIENTE

### Datos (urgente — antes del 11 de junio)
- Cargar jugadores confirmados restantes: Argentina, España, Inglaterra, Alemania, Países Bajos, Colombia (se confirman entre 21-30 mayo)
- Verificar que Prode muestre los 72 partidos correctamente
- Sistema de bloqueo del prode al kickoff
- Calcular puntos del prode automáticamente post-partido

### Diseño (antes del lanzamiento)
- Más opciones de camisetas + previews más grandes
- Rediseño de bubbles y modales del bot
- Conectar equipo con jugadores reales de Supabase (actualmente usa DEMO_PLAYERS)

### Post lanzamiento
- Panel de administración del torneo
- Ventana de cambios post fase de grupos
- Supabase Realtime en vivo
- Modo oscuro/claro
- Compartir resultados en redes sociales

---

## 📌 PARA INICIAR PRÓXIMA SESIÓN
Pegá este resumen al inicio del chat:

> "Proyecto FUTBOL DT en Next.js 14 deployado en https://futbol-dt.vercel.app (rama master en GitHub). Supabase con 11 tablas, 48 selecciones, 72 partidos y 118 jugadores reales cargados. RLS policies públicas en players y nations. Login Google OAuth funcionando. 8 pantallas migradas y conectadas a Supabase. DieBOT en todas las pantallas via ClientLayout. Banderas con flagcdn.com. Avatares DiceBear en perfil. Próximo paso: cargar jugadores de Argentina, España, Inglaterra, Alemania, Países Bajos y Colombia cuando confirmen sus listas (entre 21-30 mayo)."