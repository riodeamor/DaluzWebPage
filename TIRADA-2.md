# Tirada 2

Implementación local en `scratch/catalogo-info-frontal`, rama `codex/catalogo-info-frontal`.

## Cambios

- Pedidos: estados y medios de pago en español; colores suaves por estado. Nombres desde facturación, envío o usuario del correo, tanto en listado como en métricas recientes.
- Moneda: formateador ARS `es-AR` con dos decimales compartido por las tablas, métricas y formularios de admin.
- Clientes: Sintonía, Maestría y Sin Membresía / El Pulso, conservando los valores internos de los enums.
- Administradores: consulta real de nombres del perfil, edición de nombre/apellido y eliminación del badge de estado duplicado.
- Productos: `info_frontal` en Detalles, con el límite de 65 caracteres ya validado en formulario/API; cinco atributos fijos tipados `as const`.
- Soporte: retiradas las cuatro páginas y cinco APIs, su navegación y referencias del diagnóstico. Los datos históricos no se borraron. Las rutas retiradas quedan recuperables en Git.
- Tienda: consultas por `category_id` explícito, sin fallback al catálogo; validación de pertenencia y aislamiento de respuestas de una línea anterior. Se prueban Ecos, Jade Ritual, Umbral Sens, Alma Terra y Prisma.
- Sanity: webhook con verificación oficial `next-sanity/webhook`; invalidación de `tienda-settings`, `/api/sanity/tienda-settings` y `/tienda`. El navegador y la respuesta de la API no guardan caché. La consulta Sanity tiene una etiqueta invalidable y respaldo de revalidación de 60 segundos.
- Punto 7 pospuesto a Tirada 6: `/perfil` y `/mi-membresia` sin cambios. CSS visual y pasarela sin cambios.

## Verificación local

- `npm test`: 101 pruebas aprobadas en 16 archivos.
- `npm run type-check`: código de salida 0.
- Build de producción: código de salida 0; hay advertencias preexistentes de lint y del runtime, no errores de compilación.
- `git -c core.whitespace=cr-at-eol diff --check`: sin errores.

## Requisitos remotos antes del despliegue

1. La consulta real a Supabase todavía devuelve `column products.info_frontal does not exist`. Aplicar `supabase/migrations/20260929000000_product_info_frontal.sql`, preparada en Tirada 1, antes de publicar. No se dispone de conexión SQL, contraseña de base ni token de gestión; las claves REST no permiten ejecutar esta migración.
2. Los tokens configurados de Sanity devuelven 401 al consultar webhooks: falta `sanity.project.webhooks/read`. No se pudo verificar ni modificar la configuración remota.

   Configurar un webhook de documento a `https://<dominio-de-producción>/api/revalidate`, habilitado para crear/actualizar/eliminar, filtro `_type == "tiendaSettings"`, proyección `{_id, _type}`, sin borradores, con el mismo secreto que `SANITY_WEBHOOK_SECRET` en producción. Si ya existe un webhook general, incluir `tiendaSettings` en su filtro conservando los otros tipos. El secreto no debe compartirse en el chat.

   Referencia: https://www.sanity.io/docs/http-reference/webhooks

No se aplicaron migraciones ni cambios de configuración remota. La publicación queda pendiente de esos requisitos; un build exitoso no los valida.
