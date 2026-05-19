# FUTBOL DT — Estado Actual del Proyecto
## Actualizado: Mayo 2026

---

## 🚀 PRODUCCIÓN
- **URL**: https://futbol-dt.vercel.app
- **Repo GitHub**: https://github.com/unfedefalcone-hub/futbol-dt
- **Rama activa**: `master` (deploy automático a Vercel)
- **Nota Vercel**: cada push va a Preview — hacer "Promote to Production" manualmente

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

### Pantallas migradas
| Pantalla | Ruta | Estado |
|----------|------|--------|
| Login | `/` | ✅ Google OAuth + redirect a /club |
| Club | `/club` | ✅ Escudos + camisetas SVG + Supabase |
| Jugadores | `/jugadores` | ✅ Datos reales de Supabase + filtros |
| Equipo | `/equipo` | ✅ Campo SVG + formaciones |
| Ranking | `/ranking` | ✅ Datos reales de Supabase |
| Ligas | `/ligas` | ✅ Crear + unirse |
| Prode | `/prode` | ✅ Datos reales + guardar pronósticos |
| Perfil | `/perfil` | ✅ 5 tabs + logros |

### Componentes y archivos clave
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

---

## ⏳ PENDIENTE

### Prioridad Alta
- Cargar jugadores reales del Mundial en tabla `players`
- Cargar fixture real del Mundial 2026 en tabla `matches`
- Sistema de bloqueo del prode al kickoff
- Calcular puntos del prode automáticamente post-partido

### Prioridad Media
- Panel de administración del torneo
- Ventana de cambios post fase de grupos
- Agregar DieBOT a pantallas individualmente (actualmente via ClientLayout)

### Prioridad Baja
- Modo oscuro/claro
- Compartir resultados en redes sociales
- Drag & drop en el campo de juego

---

## 📌 PARA INICIAR PRÓXIMA SESIÓN
Pegá este resumen al inicio del chat:

> "Proyecto FUTBOL DT en Next.js 14 deployado en https://futbol-dt.vercel.app (rama master en GitHub). Supabase con 11 tablas, 16 selecciones, 65 jugadores y 8 partidos demo. Login Google OAuth funcionando. 8 pantallas migradas y conectadas a Supabase. DieBOT en todas las pantallas via ClientLayout. scoreEngine.ts y useRealtime.ts creados. Próximo paso: cargar jugadores y fixture real del Mundial 2026 en Supabase."