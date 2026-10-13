# Entrega independiente Admin/SEO + delivered

Revisión: 13/10/2026. Rama local `codex/entrega-admin-seo-delivered`, checkout `.worktrees/entrega-admin-seo-delivered`. Sin commit nuevo, push, integración, publicación ni escritura en producción.

## Base publicada

Main remoto sigue en `706cd3f2bc0377a90a2e35a42abe4401455f4af6`. El panel autenticado de Vercel confirma el mismo commit en Production, estado Ready, deployment `FfdUmffWKmkb3FdhLGNABhE3ExG3`, URL `daluz-web-page-bgd1orc7y-daluz1.vercel.app` y dominio asignado `www.daluzconsciente.com`. El dominio respondió 200. No fue necesario actualizar la base. La comparación inicial de archivos del deployment redirigía al login y no demostraba diferencias; el panel autenticado permitió confirmar la asignación vigente.

## Cambios y efectos

- Admin: guardado explícito para texto, números, listas y JSON. Teclear no guarda; un fallo conserva el borrador y permite reintentar. El interruptor booleano guarda al accionarlo. La pantalla incorpora el valor devuelto sólo después de un resultado exitoso.
- SEO: valida y guarda claves SEO en `system_config`, con las columnas existentes. Aplica título, descripción, palabras clave, metadatos sociales y verificaciones al HTML público; revalida caché después del guardado. Un valor inválido no suprime los demás válidos. No habilita por sí solo scripts de analítica. Guardar modifica únicamente las claves SEO enviadas y sus atributos de visibilidad; no se ejecutó ese guardado hospedado.
- Estados: reemplaza la opción `completed` por `delivered`. Una entrega modifica su estado y fecha, sin confirmar pago ni convertir pedidos históricos.
- Nuevo envío o entrega requiere `payment_status=paid`. Preparación `processing` sigue permitida sin pago. Comprobantes y pagos pendientes, fallidos o reembolsados no habilitan una nueva entrega. La API condiciona la actualización a que el pedido conserve el estado leído y siga pagado; un cambio concurrente exige revisión. Esta condición utiliza columnas actuales, sin nuevos RPC o integraciones de pagos.
- Indicadores: entregados se cuentan por estado de entrega. Importe pagado considera únicamente `payment_status=paid`, incluyendo envío y según fecha de creación; no representa acreditaciones, ganancias ni caja. Ranking usa importes de líneas antes de descuentos. Clientes acumulan pedidos pagados. Un histórico entregado sin pago suma entregas, pero no importe pagado.

### Pedidos sin pago confirmado

Permanecen pendientes o en preparación hasta comprobar la acreditación mediante el proceso existente. Recibir un comprobante no confirma un pago. Este paquete no amplía la aprobación de transferencias ni resuelve las incompatibilidades preexistentes de ese proceso con Supabase: si falla, queda para revisión. No se debe forzar "pagado" para habilitar entrega. Los históricos entregados sin pago conservan sus datos y requieren revisión operativa separada.

## Separación del comercio

El diff no incluye migraciones, SQL, paquetes npm nuevos, checkout, anuncios, cupones, outbox, funciones de stock, regiones, tarifas ni confirmación de pagos. Los paneles antiguos de envíos ya importados permanecen sin cambios. No incorpora dependencias de la propuesta comercial. Argentina/Mendoza, la tarifa 38 y sus asociaciones no cambian. Se excluyeron el informe histórico y la prueba del cron payment-effects del paquete independiente.

Diff definitivo: `Docs/testing/entrega-independiente-admin-seo-delivered.diff` en el proyecto principal. Manifiesto con archivos y hashes en `.local-verification/entrega-manifest.json` del checkout independiente.

## Pruebas y límites

- 366 pruebas correctas, 49 archivos; tipos correctos, lint sin errores y compilación Next correcta, 140 páginas. Lint conserva advertencias existentes.
- Siete comprobaciones PostgreSQL 17.4: tipos, defaults y nullabilidad de las 16 tablas relevadas; entrega conserva pago, stock y filas antiguas; guardado SEO con columnas existentes y RLS administrativa; lectura del estado por administrador activo; dos conexiones rechazan una entrega si cambia el pago; dos entregas simultáneas permiten sólo una transición. La fixture utiliza triggers y helpers del catálogo actual sin SQL comercial. Datos sintéticos, sin reproducción completa de auth/storage y servicios hospedados.
- Lecturas actuales Supabase GET limit=0: orders/order_items, products, profiles, admin_users y system_config respondieron 200; SEO público anónimo también 200. Sin extraer clientes ni probar escrituras hospedadas.
- Siete comprobaciones visuales con componentes React reales: teclear sin escribir, fallo conserva borrador, reintento guarda, fallo/reintento SEO, entrega deshabilitada con comprobante y preparación permitida, entrega pagada conserva pagos e histórico. API visual simulada; API y SQL probados por separado. Conexiones externas bloqueadas.

Demostración: `http://127.0.0.1:4180/`, pestañas Configuración, SEO y Pedidos e indicadores. Datos ficticios en memoria; el primer guardado Admin y SEO falla intencionalmente al iniciar el servidor. Capturas, scripts y resultados en `.local-verification` del checkout independiente. No demuestra autenticación hospedada ni correo real.

Quedan para un ensayo posterior autorizado el login Admin hospedado, todas las cuentas administradoras y el correo existente de entrega. No probar una entrega sobre un histórico real para verificar el despliegue. Comercio y propuesta separada de permisos siguen pendientes; esta entrega no los resuelve.

## Publicación y recuperación: procedimiento no ejecutado

1. Aprobar el diff y alcance. Inmediatamente antes de publicar, comprobar nuevamente main remoto y Production en Vercel. Si cambian, actualizar la base conservando esos cambios y repetir verificaciones afectadas.
2. Crear el commit sólo con archivos del manifiesto de esta rama. Excluir .env.local, node_modules, .local-verification y archivos comerciales. Registrar SHA nuevo y deployment anterior. No publicar la rama de envíos ni el commit completo de recuperación.
3. Con autorización posterior, subir esta rama para revisión. Vercel puede publicar Preview automáticamente al hacer push: preparar antes un entorno aislado con el esquema actual y administradores ficticios, sin cron, pasarelas ni correo real. Probar login, guardado/error/reintento, HTML SEO, entrega pagada y rechazo sin pago.
4. Tras aprobar el ensayo y la publicación, integrar el commit revisado a main mediante el flujo del proyecto. Vercel actualmente indica que main actualiza Production. Publicar juntos interfaz, API, metadatos y tipos. No ejecutar migraciones ni cambiar tarifas o variables de producción para este paquete.
5. Confirmar SHA, Ready y dominio en Vercel. Comprobar por lectura HTML SEO, login Admin, valores existentes, estados e indicadores. Una configuración o entrega real requiere un caso operativo autorizado y registrar sus valores anteriores; no hacer escrituras de prueba en históricos.
6. Ante fallo, detener nuevas operaciones y ejecutar Instant Rollback al deployment anterior registrado: actualmente `FfdUmffWKmkb3FdhLGNABhE3ExG3`. Verificar SHA y dominio. Preparar también una reversión Git del commit concreto para mantener main coherente; requiere autorización y nueva publicación. No restaurar una base antigua ni ejecutar reversión SQL. El rollback de código no deshace valores o estados guardados: revisar cualquier corrección individual con trazabilidad.

Después se revisarán SQL comercial, permisos y envíos por separado. Los tres puntos incompletos permanecen como borradores inactivos, sin tarifas inventadas ni nuevas regiones activadas. El anuncio de la otra propuesta sigue inactivo.
