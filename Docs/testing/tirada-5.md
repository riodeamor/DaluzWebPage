# Tirada 5 — evidencia local

Base: 8f792ed. Rama feature/tirada-5-final-backend en worktree aislado.

## Bloque A
- 290 regresiones previas: pasan. Cuatro pruebas nuevas PostgreSQL/PGlite: pasan.
- TypeScript sin errores; npm run build exitoso (advertencias preexistentes de lint y Browserslist).
- Migración 20261003000000: siete categorías, diez necesidades, relaciones explícitas, nombre NFD y orden kits. No infiere asignaciones.
- Admin: /admin/taxonomia y /admin/productos (alias). Imágenes producto se convierten a WebP <800 KiB en selección/arrastre; servidor verifica límite y firma.
- Sanity: documentos homeSettings, tiendaSettings, lineSettings; publicar y configurar webhook firmado incluyendo los tres tipos. categoryId es el UUID de Supabase.
- Proveedores reales no modificados; configuración de Sanity se verifica con esquemas/consumo local, publicación pendiente del despliegue.

## Activación
Aplicar migraciones en orden con respaldo, asignar términos explícitamente y publicar cabeceras antes del despliegue. Sin merge, despliegue ni migración de producción durante esta ejecución.
