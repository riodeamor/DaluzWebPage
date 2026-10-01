# Tirada 3 — verificación del 1 de octubre de 2026

Rama: `codex/astra-admin-funcional`. Alcance: checkout y transferencias, precios del servidor, confirmación idempotente y recuperación de correos. Tirada 4 no iniciada.

## Implementado

- Se integró el trabajo previo de `codex/checkout-precios-servidor` y `codex/webhooks-idempotentes` preservando sus checkouts originales.
- El checkout contrasta productos, variantes, precios y moneda contra el catálogo del servidor antes de crear pedidos.
- Se conserva el descuento configurable por producto y el vencimiento de 72 horas.
- La confirmación compartida utiliza una transacción SQL para pago, inventario y cola de confirmaciones. Los reintentos no duplican stock ni tareas.
- Recuperación de correos con contenido inmutable, claves idempotentes y revisión manual fuera de la ventana segura.
- La cancelación por vencimiento solo notifica si su actualización efectivamente modificó el pedido; evita notificar cancelaciones después de una confirmación concurrente.
- CUIT y enlace de comprobante por WhatsApp conectados a configuración, tanto en pantalla como en correo. Fechas de transferencia en zona Argentina.
- Datos oficiales cargados en `system_config` del proyecto `xdvemkyvgnfnibntfbwq`: banco, titular, CBU, alias, CUIT, WhatsApp y enlace social. Relectura exacta de siete valores satisfactoria. Los valores privados y el respaldo no se incorporan al repositorio.

## Evidencia local

- `npm run test`: 29 archivos, **221 pruebas aprobadas**.
- `npm run type-check`: aprobado.
- `npm run build`: aprobado, con advertencias preexistentes de lint y Browserslist.
- Las pruebas incluyen precios alterados, variantes ajenas, autorización, descuentos, 72 horas, confirmación repetida, rollback transaccional, recuperación tras fallos, arrendamientos, permisos SQL, vencimiento concurrente y destino del comprobante.
- SQL ejecutado en PostgreSQL/PGlite en memoria con datos sintéticos. No equivale a una prueba de concurrencia con dos conexiones independientes ni a un checkout completo en Supabase de pruebas.

## Pendiente para operación remota

- Consulta GET real a `payment_effects` en Supabase: 404, tabla inexistente. Una consulta HEAD previa no informó error y no se usa como prueba de existencia.
- La API de Supabase tampoco expone los cinco RPC de recuperación. La migración `20260928000000_payment_effects_outbox.sql` continúa pendiente en el servicio remoto.
- Aplicar y verificar primero la migración en una base de pruebas equivalente; ejecutar el flujo completo y concurrencia multiconexión. No se hicieron pagos ni envíos de correos reales durante las pruebas.
- Revisar `CRON_SECRET`, credenciales de correo y tareas programadas en el entorno de despliegue.
- No se hizo merge ni despliegue. No se puede declarar el flujo remoto 100% cerrado mientras estos puntos sigan pendientes.

La siguiente tanda funcional permanece detenida por instrucción del usuario.
