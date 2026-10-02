# Tirada 5 — evidencia local y activación

Base: `8f792ed`. Rama `feature/tirada-5-final-backend` en worktree aislado. Bloque A: commit `5a4ec4f`. El Bloque B incorpora pedidos, infraestructura, Tu Sendero y permisos de Tesoros.

## Implementación

- Taxonomía: siete categorías anatómicas y diez necesidades administrables, relaciones explícitas, búsqueda AND sobre nombre normalizado y orden `is_kit ASC, created_at DESC`. Las asignaciones no se deducen del nombre. Admin ofrece `/admin/taxonomia` y `/admin/productos` como alias de productos.
- Búsqueda: debounce de 400 ms, cancelación, protección frente a respuestas atrasadas y URL reactiva con navegación atrás/adelante. Imágenes convertidas a WebP inferior a 800 KiB; el servidor verifica tamaño y firma.
- Sanity: Home con slides ordenados/activos e imágenes desktop/mobile; cabecera de Tienda y banners por línea vinculados mediante UUID estable de categoría.
- Pedidos: rectificación transaccional, versión, motivo, historial e idempotencia; diferencias de inventario y permisos reconciliadas. El pago original se conserva y las diferencias a cobrar/devolver se registran sin movimientos automáticos. PDF autenticado del resumen de orden, sin validez fiscal.
- Tu Sendero: membresías reales, pedidos y Tesoros autorizados; gestión en `/admin/contrataciones`. Recuperación en `/restablecer-password`, compatibilidad anterior y sincronización de email entre Auth y perfil.
- Tesoros: diez destinos centralizados, concesiones por compra aprobada, revocación por origen y permisos múltiples. Sesión y permiso vigentes son obligatorios incluso con QR o enlace firmado. Multimedia HTTPS administrable en `/admin/tesoros-config`.
- Infraestructura: HTML público revalidable, contenido privado sin almacenamiento, noindex en rutas privadas, versión por build en assets y retirada delimitada de Service Workers/cachés residuales. Variables obsoletas de branding, Twitter y mantenimiento desconectadas.

## Verificación local

- 43 archivos de pruebas, 320 pruebas aprobadas, incluyendo regresiones de Tiradas 3 y 4, SQL/PGlite, rectificación/idempotencia/conflictos, inventario, concesiones/revocaciones, autorización del PDF, recuperación y persistencia de plantillas.
- TypeScript sin errores y `npm run build` exitoso. Permanecen advertencias previas de lint y Browserslist; no impiden la compilación.
- Navegador Edge automatizado con respuestas de catálogo sustitutas: debounce de 400 ms, escritura preservada, URL reactiva y atrás/adelante sin recarga.
- Servidor de producción local: `/` y `/tienda` responden con `public, max-age=0, must-revalidate`; carrito, perfil, checkout, Tesoros y APIs privadas con `private, no-store`. Rutas privadas emiten noindex; visitantes anónimos conservan el destino al ir a login. APIs protegidas responden 401 sin sesión.
- CSS generado incluye versión del build y assets públicos usan la misma versión. No hay hojas de estilo existentes modificadas. La hoja de Tesoros copiada de Sol conserva SHA256 `3985F0E60787B0560678D94E6D8E0F6B58FE442C6C41F60C032DD7A3B4E028C9`.
- Las pruebas SQL verifican transacciones y conflictos de versión en PGlite local; no constituyen una prueba distribuida de carga. Auth, correo y Sanity usan sustitutos/configuración local: falta la comprobación con proveedores desplegados.

Comandos desde este worktree (dependencias compartidas con el repositorio principal):

```powershell
node ../../node_modules/vitest/vitest.mjs run
node ../../node_modules/typescript/bin/tsc --noEmit
npm run build
```

## Activación pendiente de despliegue

1. Respaldar y aplicar las migraciones después de las correspondientes a Tiradas 3 y 4, en este orden:
   - `20261003000000_catalog_taxonomy.sql`
   - `20261003000001_treasure_entitlements.sql`
   - `20261003000002_order_revisions.sql`
   - `20261003000003_sendero_auth_config.sql`
2. Asignar explícitamente términos, `is_kit` y permisos de Tesoros en cada producto. Los permisos históricos se reconstruyen solo para compras con cuenta asociada y productos con asignaciones explícitas; revisar compras antiguas sin esa asociación. No modificar precios base ni monedas.
3. Publicar los esquemas/documentos Sanity `homeSettings`, `tiendaSettings` y `lineSettings`. Configurar imágenes mobile/desktop, activación y orden; en cada línea usar el UUID de Supabase en `categoryId`. Incluir los tres tipos en el webhook de revalidación firmado y configurar `SANITY_WEBHOOK_SECRET`.
4. Configurar `TREASURE_LINK_SECRET` con al menos 32 caracteres aleatorios, exclusivamente en servidor. Sin este secreto el endpoint de generación de enlaces firmados responde 503; el acceso con sesión y permiso continúa siendo obligatorio.
5. Asociar los planes existentes a El Pulso, Génesis y Sintropía en `/admin/contrataciones`, y cargar las contrataciones con sus estados y fechas. Configurar URLs HTTPS de audio/PDF en `/admin/tesoros-config`; la protección posterior de enlaces externos depende del alojamiento.
6. Autorizar los destinos de Auth `/auth/callback` y `/restablecer-password` para los dominios usados. Revisar plantillas/token de recuperación y verificar con cuentas de prueba el registro tradicional, Google, recuperación por correo y cambios de email en Admin.
7. Ejecutar comprobaciones funcionales en el entorno desplegado tras migraciones y publicación: catálogo, descuentos/envíos de Tirada 4, compra aprobada, rectificación, PDF y acceso/revocación de Tesoros.

Esta ejecución no aplica migraciones de producción, publica Sanity, despliega ni hace merge a `main`. Las pantallas de Sol y sus dependencias se copiaron de forma delimitada, preservando sus estilos, layouts y tipografías.
