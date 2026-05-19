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

### Pantallas migradas y conectadas a Supabase
| Pantalla | Ruta | Estado |
|----------|------|--------|
| Login | `/` | ✅ Google OAuth + redirect a /club |
| Club | `/club` | ✅ Escudos + camisetas SVG + Supabase |
| Jugadores | `/jugadores` | ✅ Datos reales de Supabase + filtros |
| Equipo | `/equipo` | ✅ Campo SVG + formaciones |
| Ranking | `/ranking` | ✅ Datos reales de Supabase |
| Ligas | `/ligas` | ✅ Crear + unirse |
| Prode | `/prode` | ✅ 72 partidos reales + guardar pronósticos |
| Perfil | `/perfil` | ✅ 5 tabs + logros |

### Archivos clave creados
- `src/components/bot/BotFloat.tsx` — Bot DieBOT
- `src/components/bot/BotWrapper.tsx` — Wrapper SSR
- `src/components/ClientLayout.tsx` — Layout cliente con DieBOT global
- `src/hooks/useSupabaseData.ts` — usePlayers, useRanking, useProde
- `src/hooks/useRealtime.ts` — Realtime hooks para eventos en vivo
- `src/lib/scoreEngine.ts` — Motor de puntajes con reglamento oficial
- `src/app/layout.tsx` — Layout global con ClientLayout

### Bot DieBOT
- 26 PNGs en ImgBB
- Aparece en TODAS las pantallas via ClientLayout
- Ambient, trivia, modales Hola y Reglamento

### Base de datos Supabase
- 11 tablas con RLS
- 48 selecciones del Mundial 2026 cargadas (Grupos A-L)
- 72 partidos de fase de grupos cargados
- Jugadores: tabla vacía — pendiente cargar

---

## ⏳ PENDIENTE

### Prioridad Alta
- Cargar jugadores reales del Mundial en tabla `players`
- Verificar que Prode muestre los 72 partidos correctamente
- Sistema de bloqueo del prode al kickoff
- Calcular puntos del prode automáticamente post-partido

### Prioridad Media
- Panel de administración del torneo
- Ventana de cambios post fase de grupos
- Supabase Realtime en vivo (hooks creados, falta activar)

### Prioridad Baja
- Modo oscuro/claro
- Compartir resultados en redes sociales
- Drag & drop en el campo de juego

---

## 📌 PARA INICIAR PRÓXIMA SESIÓN
Pegá este resumen al inicio del chat:

> "Proyecto FUTBOL DT en Next.js 14 deployado en https://futbol-dt.vercel.app (rama master en GitHub). Supabase con 11 tablas, 48 selecciones y 72 partidos de fase de grupos cargados. Login Google OAuth funcionando. 8 pantallas migradas y conectadas a Supabase. DieBOT en todas las pantallas via ClientLayout. scoreEngine.ts y useRealtime.ts creados. Tabla players vacía. Próximo paso: cargar jugadores reales del Mundial 2026 y verificar Prode con 72 partidos."