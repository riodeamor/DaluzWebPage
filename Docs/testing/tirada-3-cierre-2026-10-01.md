# Tirada 3 — verificación del 1 de octubre de 2026

Rama: `codex/astra-admin-funcional`. Alcance: checkout y transferencias, precios del servidor, confirmación idempotente y recuperación de correos. Tirada 3 cerrada en la rama y verificada en Supabase de pruebas. Tirada 4 no iniciada.

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
- SQL ejecutado en PostgreSQL/PGlite en memoria con datos sintéticos; complementado con las pruebas remotas descritas abajo.

## Verificación remota completada

- Proyecto aislado `daluz-pruebas-tirada3.` / `pdxgpfnxsewulpieqdrf`, PostgreSQL 17.11. No se aplicó esta migración a producción.
- La base estaba vacía. Se crearon los prerrequisitos de pago a partir de las migraciones del repositorio, incluyendo restricciones, relaciones con Auth y RLS. Es un subconjunto del esquema necesario para este flujo, no un clon completo de producción. `system_config` omite metadatos exclusivos del Admin.
- Migración exacta `20260928000000_payment_effects_outbox.sql` aplicada dentro de una transacción: **Success. No rows returned**. Cinco funciones y tabla con RLS verificadas.
- `tirada3/remote-assertions.sql`: **PASS** en Supabase real. Verifica permisos, rollback ante fallo de auditoría, snapshot obsoleto, confirmación repetida, stock único, exclusividad y recuperación de arrendamientos, contenido inmutable, backoff, cierre y revisión manual tras 23 horas. Sus datos sintéticos se revierten en una subtransacción.
- Integración adicional: **1 prueba remota aprobada**. Ejecuta el handler real de checkout con Supabase Auth real, catálogo/configuración/repositorios reales y un usuario sintético. Solo se sustituyen el contexto de cookies de Next y el proveedor de correo saliente; no se sustituye la autenticación ni la base.
- Checkout sin sesión: 401. Precio alterado: 409. Compra válida: 200, pedido con descuento del 10% por producto (1000 → 900 ARS), dirección guardada y vencimiento de 72 horas.
- Ocho solicitudes HTTP independientes simultáneas de confirmación: **una ganadora**, stock 10 → 8, un movimiento de auditoría y una tarea. Ocho solicitudes de trabajo: **un arrendamiento activo**.
- Worker real con proveedor simulado: fallo → reintento → éxito, conservando contenido y clave idempotente; después del éxito no vuelve a enviar.
- Datos oficiales de configuración releídos nuevamente: siete valores coinciden. Los datos sintéticos del proyecto de prueba se eliminaron al terminar; consulta final muestra cero pedidos, productos y tareas.
- Evidencias: `tirada3/remote-integration-result.json`, `tirada3/supabase-sql-pass.png`, `tirada3/supabase-final-verification.png`.
- No se hicieron transferencias de dinero ni envíos de correos reales. Esta verificación cubre el handler y los servicios; no una navegación completa por la interfaz del checkout.

## Paso posterior: publicación

- En producción `xdvemkyvgnfnibntfbwq`, la última comprobación encontró ausentes la tabla y los cinco RPC. La migración continúa pendiente allí y debe aplicarse antes del worker nuevo.
- Revisar `CRON_SECRET`, credenciales de correo y tareas programadas en el entorno de despliegue.
- No se hizo merge ni despliegue. El cierre de esta tanda corresponde a código y pruebas en la rama; la nueva implementación aún no está publicada ni validada con un correo real del proveedor.

La siguiente tanda funcional permanece detenida por instrucción del usuario.
