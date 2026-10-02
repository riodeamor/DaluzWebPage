# Tirada 4 — Bloque A

Fecha local: 1 de octubre de 2026 (Argentina).
Rama: `feature/tirada-4-envios-cupones`.
Worktree: `scratch/tirada-4-envios-cupones`.
Base: `720ff92`, cierre de Tirada 3. Los cambios pendientes de los otros checkouts se conservaron.

## Comportamiento

- Carrito y Checkout consultan `POST /api/cart/quote`, con catálogo y configuración del servidor. Un total propuesto por el navegador nunca determina el precio: solo sirve para detectar cambios entre cotización y compra y pedir una nueva revisión.
- CP de cuatro dígitos y CPA argentino completo. Rangos inclusivos: Córdoba 5000–5999; Centro 1000–2999; Nacional 3000–4999 y 6000–7999; Patagonia 8000–9499. Los CP válidos restantes usan respaldo. Un CP mal formado produce error y no se interpreta como respaldo.
- `/admin/system`, pestaña Envíos: cinco tarifas regionales en ARS, transportista opcional por zona y rangos fijos. Las nuevas zonas no se editan/eliminan con el CRUD antiguo de CP individuales. Las tarifas regionales se guardan en `shipping_zones.regional_rate`; las tarifas antiguas se conservan para la gestión previa y no se suman otra vez al total regional.
- `free_shipping_threshold` conserva la fuente existente en `system_config`. Se compara estrictamente `subtotal post-cupón > umbral`, antes del descuento de transferencia. Si aplica envío gratis, una tarifa regional todavía sin configurar no impide el envío gratuito.
- `/admin/cupones`: alta, edición, pausa y baja. Código normalizado, porcentaje o ARS, mínimo, vencimiento, límite y `combinable_con_transferencia=true` por defecto. La baja archiva el cupón para conservar el historial.
- Cupón primero; descuento de transferencia sobre el saldo proporcional de cada producto, respetando el porcentaje existente por producto. Nunca se descuenta el envío. Un cupón no combinable permite pagar por transferencia, pero suprime el descuento adicional de ese medio. Los cálculos monetarios conservan centavos; se mantiene la moneda ARS del checkout.
- La cotización valida disponibilidad del cupón; al crear el pedido se vuelve a verificar bajo bloqueo del cupón, incluido su snapshot de edición. Los pendientes reservan cupo; cancelados/fallidos lo liberan. Una reserva repetida del mismo pedido es idempotente. No se confirma un pedido con cupón si no existe su reserva.
- El cliente conserva una clave por intento. Los reintentos de esa clave recuperan el pedido; cambiar su contenido genera conflicto. La restricción única en base evita duplicar el intento del mismo usuario.
- Pedidos guardan subtotal, cupón, descuento por transferencia, envío, zona, transportista y total. Mercado Pago cobra el total exacto, usando un concepto consolidado cuando difiere de las líneas originales; esas líneas mantienen sus precios de catálogo. Transferencia conserva las 72 horas y los datos bancarios existentes.
- `/admin/announcements`: mensaje, enlace interno/HTTPS, switch y orden. `GET /api/public/announcements` devuelve solo activos y sin caché. La barrita refresca al recuperar foco y cada minuto. `{{free_shipping_threshold}}` inserta el umbral público en un mensaje editable, sin fijar otro monto en el componente.
- No se modificaron archivos CSS, estilos de la barrita, precios base, monedas del catálogo ni lógica de tags.

## Verificación local

- Suite: 32 archivos, **290 pruebas aprobadas**.
- `tsc --noEmit`: aprobado.
- `next build`: aprobado. Advertencias de lint/Browserslist existentes en el proyecto.
- PostgreSQL/PGlite ejecuta la migración exacta con fixtures sintéticos: restricciones, defaults, reserva/reintento, límite, rechazo de snapshots obsoletos, cancelación, rollback por eliminación, RLS y permisos de RPC.
- Pruebas del handler real de Checkout con repositorios/proveedores sustituidos: precios/variantes del catálogo, autorización, cascada, no combinable, cupón agotado, reserva perdida, CP faltante, total cambiado y recuperación del mismo pedido.
- Pruebas de interfaz con DOM local: recotización, respuestas atrasadas y errores. Pruebas de preferencia con proveedor simulado: total exacto y catálogo inmutable.
- Cerco visual comprobado: ningún `.css` en el diff y bloque de estilos de la barrita idéntico al de la base.
- PGlite serializa conexiones: estas pruebas no acreditan contención distribuida en Supabase ni un pago real del proveedor.

## Activación posterior

1. Revisar/aplicar en el entorno elegido la migración heredada `20260928000000_payment_effects_outbox.sql` de Tirada 3 si sigue pendiente.
2. Aplicar `supabase/migrations/20261002000000_dynamic_commerce.sql` antes de desplegar esta rama.
3. Cargar las cinco tarifas reales en `/admin/system` → Envíos y revisar el umbral existente en ecommerce. La migración no inventa tarifas ni reemplaza el umbral actual.
4. Revisar los avisos iniciales migrados de la barrita y las campañas de cupones.
5. Verificar integración y concurrencia en una base aislada con el esquema completo antes de publicar.

No se hizo merge a `main`, no se aplicaron migraciones a Supabase ni se desplegó. No hubo transferencias de dinero o correos reales. El flujo requiere un total final positivo; un pedido totalmente gratuito necesita un flujo específico de confirmación y no se envía al proveedor de pagos.
