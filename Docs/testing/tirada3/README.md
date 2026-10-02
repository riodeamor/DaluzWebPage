# Tirada 3: pruebas remotas

Destino único autorizado: `pdxgpfnxsewulpieqdrf` (daluz-pruebas-tirada3.). No ejecutar estos prerrequisitos en producción.

Orden utilizado:

1. `test-prerequisites.sql` sobre la base vacía.
2. `supabase/migrations/20260928000000_payment_effects_outbox.sql`, con `BEGIN` / `COMMIT`.
3. `remote-assertions.sql`; sus fixtures se revierten automáticamente.
4. `checkout-prerequisites.sql`.
5. `node node_modules/vitest/vitest.mjs run --config Docs/testing/tirada3/vitest.remote.config.ts`.

La integración requiere `.local-verification/test-supabase.json` con `url`, `key` (service_role) y `anon`. Este archivo está ignorado por Git. La prueba rechaza cualquier URL distinta del proyecto indicado. Nunca incorporar claves al repositorio.

La prueba crea un usuario Auth y productos/configuración sintéticos y los elimina al finalizar. Ejecutar solo sobre este entorno dedicado, sin otros consumidores simultáneos. Los correos salientes están sustituidos por un proveedor simulado. El handler del checkout, Supabase Auth y las consultas/RPC son reales. La prueba remota se ejecuta por separado de la suite local para evitar accesos remotos accidentales.

Las capturas y el resultado JSON documentan la ejecución del 1 de octubre de 2026 (Argentina).
