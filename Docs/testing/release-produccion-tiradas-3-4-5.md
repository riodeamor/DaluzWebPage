# Release de producción — Tiradas 3, 4 y 5

Fecha: 2026-10-02. Integración local en `main`, merge `6644af2`, desde `feature/tirada-5-final-backend` (`48a9700`). Base funcional de Tirada 4: `8f792ed`; cierre de Tirada 5: `59356f5`.

## Auditoría del checkout original

Los 13 archivos modificados contenían exclusivamente ajustes visuales del Admin: azules institucionales, superficies neutras, texto blanco con mayor contraste, bordes y estados hover. No había cambios pendientes de lógica de pagos, permisos o precios. Se preservaron íntegramente, sin rediseño, en el commit separado `e606c27` antes del merge.

| Archivos | Contenido preservado |
| --- | --- |
| `src/app/admin/blogs/page.tsx`, `reviews/page.tsx` | Hover neutro en tablas y botón de eliminación |
| `src/app/admin/customers/[id]/page.tsx` | Botones y hover de pedidos/ítems |
| `src/app/admin/diagnostics/page.tsx`, `system/page.tsx` | Colores de acciones de diagnóstico y backups |
| `src/app/admin/layout.tsx` | Contraste del sidebar/header, badges y texto sin opacidad |
| `src/app/globals.css` | Variables visuales y controles del Admin; superficies blancas y bordes neutros |
| `src/components/admin/AdminNotificationDropdown.tsx`, `shared/NotificationItem.tsx` | Colores de notificaciones, separadores y acciones |
| `src/components/admin/ShippingManager.tsx` | Botones de eliminación de zonas/tarifas/transportistas |
| `src/components/admin/dashboard/QuickActions.tsx` | Botón de stock bajo |
| `src/components/admin/products/ProductForm.tsx`, `ProductGrid.tsx` | Iconos y estados hover de eliminación |

No se descartó ningún trabajo de Sol. Los originales sin seguimiento de las diez pantallas de Tesoros y sus dependencias quedaron respaldados en el stash con identidad `2a2b123a4797bcd70feae3807064fe32538b5406` (mensaje «Respaldo pantallas originales Sol antes de integrar Tirada 5»). Su versión integrada conserva el diseño y añade la autorización en servidor. No reaplicar ese stash sobre las rutas integradas: usarlo solo como referencia/recuperación en otra carpeta.

Las carpetas `scratch/` son checkouts locales de trabajo, no archivos de release: ahora se excluyen del seguimiento. La configuración `.env.local` y los logs de verificación permanecen ignorados. Los antiguos bundles versionados `dist/` y `dotenv_config_path=.env.local/` se dejaron intactos; el nuevo build de Studio usa `.sanity/build` y no depende de esos artefactos.

## SQL consolidado

Archivo: `scripts/sql/deploy-produccion-tiradas-3-4-5.sql`.

Incluye en este orden:

1. `20260804000000_add_bank_transfer_support.sql`
2. `20260804000001_bank_transfer_email_templates.sql`
3. `20260928000000_payment_effects_outbox.sql`
4. `20260929000000_product_info_frontal.sql`
5. `20261002000000_dynamic_commerce.sql`
6. `20261003000000_catalog_taxonomy.sql`
7. `20261003000001_treasure_entitlements.sql`
8. `20261003000002_order_revisions.sql`
9. `20261003000003_sendero_auth_config.sql`

Ejecutar el archivo completo en SQL Editor con el rol `postgres`, previa copia de seguridad. Requiere el esquema histórico existente (Auth, catálogo, pedidos, inventario, configuración, envíos, membresías y Tesoros anteriores), incluyendo las migraciones previas de descuentos y snapshots de productos en pedidos. No es un instalador para una base vacía. El preflight detiene la ejecución si falta alguna tabla requerida.

Una sola transacción y un advisory lock evitan aplicaciones simultáneas del mismo consolidado. Un error revierte toda la transacción. Tablas, columnas e índices usan comprobaciones de existencia; funciones se reemplazan y triggers/policies se recrean por nombre. Seeds no duplican filas ni sobrescriben contenido administrado. Los backfills de permisos/programas se ejecutan únicamente cuando se introduce su columna, conservando posteriores asignaciones y retiradas del Admin. No se modifica el precio base, moneda ni lógica de tags.

Las pruebas PostgreSQL/PGlite verifican ejecución repetida, fuentes aplicadas individualmente antes del consolidado, conservación de tarifas/precios/plantillas/asignaciones y rechazo de una base sin prerrequisitos. No se aplicó SQL a producción.

Para regenerar y verificar que el consolidado coincide con sus fuentes:

```sh
node scripts/build-production-sql.cjs
node scripts/build-production-sql.cjs --check
```

## Runtime y Sanity Studio

Node 24 fijado en `.nvmrc` y `engines.node`, con lockfile sincronizado. La CLI de Sanity instalada falla localmente con Node 26 por la carga de `yargs`; Node 24.19.0 pasó las pruebas y compiló Studio.

Los scripts `studio`, `studio:build` y `studio:deploy` cargan `.env.local` mediante `scripts/sanity-cli.cjs`. El argumento de dotenv deja de interpretarse como carpeta de salida. Configuración/cache de CLI y build quedan en `.sanity/`, ignorado por Git.

Once APIs existentes de búsqueda, estadísticas, estado, plantillas, reseñas, configuración y usuarios se declaran `force-dynamic`: requieren cookies o parámetros de la petición y no deben ejecutarse como páginas estáticas durante el build. Se conserva su lógica y autorización.

`npm run studio:build` genera `.sanity/build`. Se comprobó en el bundle compilado la presencia de `homeSettings`, `heroSlides`, `imagenDesktop`, `imagenMobile`, `tiendaSettings`, `lineSettings`, `heroBanner` y `categoryId`. La compilación local no publica Studio ni documentos en Sanity.

## Verificación final sobre main

- Suite completa: 44 archivos y 324 pruebas aprobadas, incluyendo regresiones de Tiradas 3 y 4 y las cuatro nuevas pruebas del consolidado.
- `npm run type-check`: aprobado, cero errores TypeScript.
- `npm run build`: aprobado con Node 24, compilación y generación de 130 páginas completadas; cero errores de TypeScript y sin mensajes de fallo de prerenderizado dinámico.
- Sanity Studio: compilación exitosa y comprobación de campos en el bundle.
- Consolidado: coincide con sus fuentes; no requiere un registro externo de migraciones para admitir una segunda ejecución.
- Merge sin conflictos; los cambios visuales auditados se mantienen.

Persisten advertencias anteriores de lint (por ejemplo, usos de `any` e imports no utilizados) y Browserslist. No se declara una auditoría de lint sin advertencias ni una validación real de proveedores a partir de estos checks locales.

## Activación antes de publicar

1. Aplicar el consolidado sobre Supabase con respaldo y revisar el resultado antes de habilitar el código nuevo.
2. Configurar tarifas regionales/respaldo y umbral de envío gratis, asignaciones explícitas de taxonomía/kits/Tesoros, programas contratados y URLs externas HTTPS.
3. Configurar variables del entorno de producción, incluyendo Supabase, Sanity, `SANITY_WEBHOOK_SECRET` y `TREASURE_LINK_SECRET` (al menos 32 caracteres aleatorios; solo servidor).
4. Publicar Studio y documentos de cabeceras; configurar el webhook firmado de los tres tipos. Usar UUID de Supabase para vincular cada línea.
5. Autorizar destinos de Auth y verificar registro tradicional/Google, recuperación de contraseña y correo con cuentas de prueba reales.
6. Realizar el smoke test de compra, transferencia, cupón/envío, comprobante PDF, rectificación y permisos/revocación de Tesoros en el entorno desplegado.

El repositorio queda preparado localmente para la release. En esta fase se autorizaron el merge y las verificaciones; no se ejecutaron push, despliegue automático, publicación de Sanity ni migraciones de producción.
