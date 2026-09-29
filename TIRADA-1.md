# Tirada 1 — verificación del 29/09/2026

Estado: Tirada 1 cerrada localmente y verificada. Por decisión del usuario, la migración SQL de info_frontal queda preparada para aplicarse al preparar el despliegue a producción. No se publicó ni se modificaron datos remotos.

## Checkout correcto

Rama: `codex/catalogo-info-frontal`.
Directorio: `C:/PROYECTOS/CODEX/PAGINA DA LUZ/scratch/catalogo-info-frontal`.
Es un worktree de otro repositorio, cuyo directorio Git común está en el proyecto original DaluzWebPage-main. Por eso no aparecía en `git worktree list` del checkout principal `fix-ceremonias-ui`.

Aquí ya estaban ProductForm, las API de productos, los tipos, la validación de info_frontal, sus pruebas, la migración y los assets SEO. El checkout principal se dejó intacto.

## Resultado del cotejo

- Categorías: Header, Footer, filtro lateral y ProductGrid consumen categorías activas. FeaturedLineSection conserva selección aleatoria entre categorías activas con productos disponibles; sus enlaces y consultas usan el registro real. Crear, editar o eliminar categorías invalida su caché.
- Kits: Supabase devuelve actualmente nombre `Kits y Ceremonias`, slug `kits-y-ceremonias`, ID `2196c12a-3e6a-42b1-b137-770837530f46` y 8 productos activos. La ruta antigua `linea-kits-y-experiencia` resuelve ese ID y la página pasa al slug vigente. No se renombró el registro remoto.
- Ficha: reseñas, valoración y pestañas condicionadas a `reviews_enabled`; si se apaga con reseñas abiertas vuelve al contenido de descripción. No se modificaron clases, anchos ni CSS de la ficha. Se corrigieron condiciones numéricas que imprimían cero y se retiró el texto de 12 cuotas y el bloque de 6, conservando el bloque real de 3.
- Moderación: las reseñas nuevas ya se creaban con `is_approved: false`. Una regresión prueba que también se ignora un `is_approved: true` enviado por el cliente.
- Tarjetas: enlace VER ALKIMYA en desktop / VER en móvil con borde de 1 px bordó; botón AÑADIR sólido bordó que suma exactamente una unidad. El enlace sigue disponible sin stock; añadir queda deshabilitado.
- Info frontal: máximo 65 caracteres en formulario y API, tipos completos, propagación a tarjetas y texto bajo el título con `text-[#7D1D2B]/80`. Código preexistente verificado.
- SEO: og-image.jpg de 1200 × 630, favicon y PNG con fondo Azul Ancla #051341, metadatos y sitemap con /tienda prioridad 0.9. Código y assets preexistentes verificados.
- Auth: el proyecto usa Supabase y formularios propios, no Clerk/NextAuth. Documento en es-AR y mensajes públicos de login, registro y recuperación localizados con fallback en español.
- Se preservaron títulos/precios/monedas de productos, pasarela y lógica de tags de pago del admin.

## Verificación

- `npm test`: 89 pruebas aprobadas en 13 archivos (84 iniciales + 5 regresiones).
- `npm run type-check`: aprobado.
- `node scripts/verify-tirada-1.cjs`: aprobado en 1440 px y 390 px. Fixtures para productos/configuración/categorías; se bloquean métodos de escritura. Comprueba estilos y dimensiones de botonera, carrito +1, info frontal, categoría nueva, ruta antigua, reseñas ON/OFF y ausencia de ceros huérfanos.
- Capturas revisadas en `test-results/tirada-1/`.
- API local usando Supabase real, sólo lectura: categorías activas 200; alias de Kits 200 con slug vigente; productos de Kits 200 con 8 registros; sitemap 200 con tienda y prioridad 0.9.
- Diff revisado con `core.whitespace=cr-at-eol`, sin errores. Los archivos del proyecto usan finales de línea CRLF, algunos mezclados con LF.

## Paso reservado para el despliegue a producción

La consulta real a `products.info_frontal` devuelve `column products.info_frontal does not exist`.

Aplicar `supabase/migrations/20260929000000_product_info_frontal.sql` antes de publicar/habilitar el formulario actualizado. Es una migración aditiva: columna nullable, límite de 65 caracteres y comentario. Luego verificar creación/edición y lectura de productos en un entorno autorizado.

El entorno disponible tiene URL, clave pública y service-role de la API, pero no conexión SQL ni herramienta de migraciones conectada. No se consideró completada esta integración sólo por pasar las pruebas locales.
