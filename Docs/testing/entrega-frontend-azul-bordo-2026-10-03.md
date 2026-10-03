# Entrega frontend: Azul, Bordó y Sesiones Integrales

Fecha: 2026-10-03. Repositorio: riodeamor/DaluzWebPage.

## template-azul-base

Siete páginas nuevas:

- /servicios/procesos/botiquin-botanico
- /servicios/procesos/cofre-vibracional
- /servicios/procesos/metamorfosis
- /servicios/procesos/oasis
- /servicios/procesos/sesiones-integrales/sesion-umbral
- /servicios/procesos/sesiones-integrales/pausa-vital
- /servicios/procesos/sesiones-integrales/alquimia-chamanica

Página existente actualizada:

- /servicios/procesos/sesiones-integrales: conserva la cabecera, el diseño y los textos previos. Suma la introducción Recuperá el Diálogo con tu Propio Templo, Tres Puertas de Entrada, Estado/Dinámica/Formato en cada ficha, comparativa, FAQ y WhatsApp. Cuerpo de tarjetas Montserrat de 14 px.

Componentes y assets:

- src/components/layout/TemplateAzul.tsx y TemplateAzul.module.css
- src/components/marketing/ProcesosContent.tsx y ProcesosContent.module.css
- src/components/marketing/SesionAction.tsx y SesionAction.module.css
- public/svg/procesos/onda-titulo.svg
- SesionesHub.module.css y ajustes en sesiones.css

Tienda y navegación:

- Header.tsx y globals.css: alineación del mega menú Tienda, prioridad de capas y puente de hover.
- /productos: diez etiquetas oficiales de necesidades faciales y capilares; conserva los identificadores y filtros existentes.
- .gitignore excluye /.worktrees/ para evitar incorporar checkouts aislados al repositorio.

## template-bordo-base

Tres páginas nuevas:

- /origen/ciencia-verde
- /origen/materia-prima: 118 ingredientes, 11 tablas, tres pestañas, búsqueda por palabras sin distinción de mayúsculas o tildes, navegación por teclado y desplazamiento horizontal en móvil.
- /origen/saber-seguro

Componentes y assets:

- src/components/layout/TemplateBordo.tsx y TemplateBordo.module.css; variantes de cabecera marfil y CTA dorado.
- Cada página incorpora sus estilos; MateriaPrimaExplorer.tsx y materia-prima.json contienen el explorador y los datos.
- public/svg/origen/isotipo-cuatro-petalos.svg y onda-titulo.svg.
- /alkimya/activos-origen: conecta los tres botones a sus páginas.

El contenido conserva estructura y beneficios con los matices acordados para tolerancia individual, infancia, reacciones persistentes y uso interno sujeto a evaluación profesional.

## Integración

Ambas ramas nacen de 1015a07. Al revisar origin/main el 2026-10-03 había nueve commits compartidos anteriores que todavía no estaban en el remoto. Integrar ambas ramas para incluir las dos tandas y comprobar después el build final sobre main junto al trabajo de Astra. No se ha desplegado producción desde este chat.

Validación realizada: TypeScript, ESLint en los archivos frontend nuevos/modificados y comprobaciones locales con Chrome/Playwright de las páginas creadas en este chat, navegación, metadatos, tablas, FAQ, búsqueda, teclado y móvil. Las siete páginas Azul también fueron verificadas en el chat Ajustar mega menú y biotipos.

## Pendientes de otros checkouts

Revisión de solo lectura al preparar esta entrega:

- scratch/astra-admin-funcional, rama codex/astra-admin-funcional: cambios sin commitear de Admin, SEO, iconos, Sanity/category banners, API pública y revalidación; también hay capturas, patches y scripts locales. Astra debe seleccionar y cerrar sus propios archivos antes del despliegue.
- scratch/tirada-4-envios-cupones: limpio.
- scratch/tirada-5-final-backend: limpio.

Estos pendientes de Astra no se incluyen en los commits frontend de esta entrega.
