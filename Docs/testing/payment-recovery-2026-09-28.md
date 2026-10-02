# Recuperacion durable de pagos: validacion y despliegue

Estado: implementacion local, NO desplegada. Migracion NO aplicada a Supabase.
Rama: `codex/webhooks-idempotentes`. Base: `1397bacc7d774cb85f35ddc97660f7b10594595f`.
La correccion de precios de checkout sigue en una rama separada. Esta tanda no
modifica textos, colores, componentes visuales ni datos de produccion.

## Contrato

- Mercado Pago y confirmacion de transferencia utilizan el mismo RPC.
- Tesoros queda fuera de alcance: no se crean tareas ni se otorgan accesos.
  La recuperacion de pagos no depende de sus funciones SQL ni de su implementacion.
- El RPC bloquea el pedido, verifica la instantanea y confirma pago, stock,
  movimiento de inventario y tareas pendientes en una sola transaccion.
- Un fallo en cualquiera de esas escrituras revierte toda la transaccion.
- Una confirmacion repetida no vuelve a descontar stock ni crea nuevas tareas.
- Los pedidos historicos pagados NO se vuelven a procesar ni se rellenan
  retroactivamente. Cualquier reparacion historica requiere conciliacion aparte.
- Se conserva la politica de inventario existente (stock base, piso cero).
  Reservas, faltantes y stock por variante quedan fuera de esta tanda.
- Cada tarea tiene clave unica por pedido/tipo, intentos, arrendamiento temporal
  de cinco minutos y token de propietario. Un propietario anterior no puede
  cerrar la tarea que otro proceso recupero.
- Los correos guardan destinatario, remitente, asunto y contenido antes de enviar.
  Los reintentos usan ese contenido y `order-confirmation/<task-id>` como clave.
- El envio manual desde Admin conserva su comportamiento; no forma parte de la
  deduplicacion automatica. No usarlo para reparar pendientes sin conciliar.

## Limites y operacion

Resend conserva sus claves de idempotencia durante 24 horas. Se utiliza una
ventana conservadora de 23 horas desde el primer intento de envio. Si un envio
queda incierto fuera de esa ventana, o una tarea alcanza doce intentos, pasa a
`manual_review`: no se reinicia el reloj ni se inventa otra clave automaticamente.
Esto evita prometer entrega exactamente una vez fuera de la garantia del proveedor.

El webhook intenta enviar la confirmacion inmediatamente. El pago se reconoce cuando
la transaccion queda confirmada, aunque sus efectos externos sigan pendientes.
Otro webhook aprobado puede reanudar trabajo pendiente sin volver a cobrar ni
descontar inventario. Tambien hay dos rutas cron protegidas por `CRON_SECRET`,
cada una diaria (02:00 y 14:00 UTC), compatibles con la frecuencia diaria de Hobby.
Un turno procesa como maximo ocho tareas, con presupuesto aproximado de 15 segundos;
un envio individual tiene timeout de ocho segundos. Los turnos no garantizan
vaciar una acumulacion de pedidos. Revisar volumen y capacidad antes de activar.
Errores de envio y tareas en revision devuelven 503 desde cron; los pendientes
por demora deben monitorearse aparte. No se ha configurado un servicio de alertas.

La tabla contiene datos personales del correo preparado. RLS y permisos excluyen
anonimos y usuarios autenticados; solo el servidor opera los RPC. No copiar
payloads, tokens o secretos a logs, tickets o este informe. Definir retencion de
payloads completados antes de una operacion prolongada.

Referencias de contrato:
- [Resend: claves de idempotencia](https://resend.com/docs/dashboard/emails/idempotency-keys).
- [Vercel: frecuencia y limites de cron](https://vercel.com/docs/cron-jobs/usage-and-pricing).

## Validacion local

Validacion posterior a la exclusion de Tesoros (2026-09-28): `npm test` 134/134,
`npm run type-check` y `npm run build` terminaron correctamente.
No se ejecutaron E2E contra Supabase de pruebas ni se verifico concurrencia
multiconexion en esta tanda.

Pruebas unitarias con proveedores simulados; no se enviaron correos ni pagos reales.
`payment-effects.database.test.ts` ejecuta la migracion real en PostgreSQL/PGlite
en memoria sobre un esquema minimo de prueba. Comprueba rollback, reintentos,
instantaneas obsoletas, pedidos historicos, contenido inmutable, permisos y leases.
No equivale a aplicar todas las migraciones de Supabase ni a probar contencion
entre multiples conexiones: PGlite serializa las consultas de esta instancia.

Las pruebas del worker cubren el corte despues del envio y antes del acuse en DB,
reutilizacion de clave/contenido, errores permanentes, reembolsos y rechazo de tareas
fuera de alcance. La migracion solo admite tareas de confirmacion por correo.
Las rutas cron rechazan el acceso sin secreto antes de crear el cliente privilegiado.

## Nota para la implementacion futura de Tesoros (no bloquea esta tanda)

En `20260323000000_create_user_treasures.sql`, `grant_treasure_access` devuelve
`(granted boolean, access_id text, message text)`, mientras que su envoltorio
`grant_treasures_from_order` declara `(access_id text, granted boolean, message text)`
y utiliza `SELECT *`. Ejecutar esas definiciones en PGlite reproduce SQLSTATE 42804:
`Returned type boolean does not match expected type text in column access_id`.

No se ha inspeccionado la definicion efectiva de produccion; puede haber divergencias.
El usuario confirmo que Tesoros aun no esta en funcionamiento ni implementacion.
El hallazgo queda archivado para esa fase futura; no es un bloqueo de pagos.
No se modificaron ni activaron sus funciones o paginas. El nuevo flujo no invoca
el otorgamiento de accesos ni genera tareas de Tesoros. La migracion de esta rama
aun no se aplico a ningun entorno externo; no hay tareas desplegadas que convertir.

## Puertas obligatorias antes de publicar

1. Revisar y aprobar el diff; integrar en orden con la rama de precios sin perder
   cambios. Revalidar `origin/main` antes de cualquier integracion.
2. Usar una base Supabase de pruebas con datos sinteticos y esquema equivalente.
   Aplicar alli `20260928000000_payment_effects_outbox.sql`, nunca a produccion
   como parte de ejecutar las pruebas locales.
3. Probar autorizacion Admin,
   confirmacion bancaria duplicada y webhook firmado con cuentas de prueba.
4. Con dos conexiones independientes: aprobar simultaneamente el mismo pedido,
   comprar el mismo producto en pedidos distintos, competir con rechazo/reembolso,
   matar el worker despues del envio y recuperar tras expirar su lease.
5. Verificar un solo movimiento por producto, una tarea de correo por pedido y
   un correo en el proveedor, sin tareas ni concesion de accesos a Tesoros.
6. Reejecutar `npm test`, `npm run type-check`, `npm run build` y pruebas de API/E2E
   con configuracion de prueba. No usar cuentas/clientes ni pagos reales.
7. Comprobar secretos existentes en Vercel Production sin imprimirlos:
   `CRON_SECRET`, `RESEND_API_KEY`, remitente verificado y credenciales servidor
   de Supabase. Confirmar ambos cron y monitoreo de pendientes/errores/revision.
8. Con autorizacion de despliegue y respaldo, aplicar la migracion ANTES del
   codigo que llama sus RPC. Esperar el refresco de esquema de PostgREST y comprobar
   firmas/permisos. Luego publicar y vigilar tareas pendientes y errores.

Consulta de monitoreo sin datos personales (solo lectura):

```sql
select kind, state, count(*) as tasks, min(created_at) as oldest_created,
       min(first_send_at) as oldest_attempt, max(attempts) as max_attempts
from public.payment_effects
group by kind, state
order by kind, state;
```

## Reversion

Conservar la tabla, tareas, claves, payloads y migracion si se revierte el codigo.
No borrar ni poner en pendiente tareas completadas. No repetir descuentos de
stock ni modificar estados financieros para aparentar exito. Un despliegue
anterior desconoce esta cola: revertirlo NO resuelve las tareas pendientes.
Coordinar la pausa de confirmaciones y cron durante una incidencia, conservar
webhooks para reintento y conciliar antes de reanudar. Una revision manual de
correo incierto consulta al proveedor antes de autorizar cualquier reenvio.
No ejecutar una migracion destructiva de rollback durante cobros activos.
