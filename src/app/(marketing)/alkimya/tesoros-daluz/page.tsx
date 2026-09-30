import { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import TesorosPortalCarousel from '@/components/TesorosPortalCarousel'

export const metadata: Metadata = {
  title: 'Tesoros Da Luz | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Tu ritualización comienza aquí. Descubrí los Tesoros Da Luz: papel semilla, portal de inmersión y herramientas de transformación con cada producto.',
}

const PORTAL_CARDS = [
  {
    title: 'ALMA TERRA | El Ancla del Presente',
    subtitle: 'Portal de Enraizamiento · Hexaedro / Elemento Tierra',
    items: [
      'Sesión inmersiva guiada para descender la velocidad mental y frenar la rumiación del sistema nervioso.',
      'Maniobra física de descarga y arraigo corporal para indicarle a tus células que están seguras y sostenidas.',
      'Secuencia verbal de integración para anclar presencia biológica en el aquí y ahora.',
    ],
    effect: 'Disuelve la sensación de vértigo y la fatiga por sobreexigencia; te devuelve el suelo firme para habitar tu día sin dispersión.',
    variant: 'alma' as const,
  },
  {
    title: 'ECOS | El Susurro Sagrado',
    subtitle: 'Portal de Purificación & Claridad · Dodecaedro / Elemento Éter',
    items: [
      'Viaje sonoro de vacío fértil para disolver la sobrecarga electromagnética de la mente.',
      'Descompresión fascial del canal laríngeo y de la base del cráneo para liberar la tensión acumulada por el control.',
      'Protocolo de depuración del eje palabra-pensamiento para conectar con tu verdad interna.',
    ],
    effect: 'Drena la carga en cuello y hombros, disuelve los nudos de lo no dicho y despeja la cabeza para que tu voz recupere su cauce natural.',
    variant: 'ecos' as const,
  },
  {
    title: 'UMBRAL SENS | La Memoria Líquida',
    subtitle: 'Portal de la Sacralidad & el Goce · Icosaedro / Elemento Agua',
    items: [
      'Inmersión somática en tu red hídrica para ablandar la armadura del estrés y entrar en estado receptivo.',
      'Masaje miofascial de descompresión en el eje rostro-sacro (la conexión biológica directa entre la boca y tu pelvis).',
      'Apertura celular para disolver la rigidez y rehabilitar la capacidad biológica de placer.',
    ],
    effect: 'Descongela la coraza corporal, relaja las facciones del rostro desde la raíz y despierta tu vitalidad sensorial y creativa.',
    variant: 'umbral' as const,
  },
  {
    title: 'PRISMA | La Fragua Solar',
    subtitle: 'Portal de la Identidad & la Voluntad · Tetraedro / Elemento Fuego',
    items: [
      'Activación bioenergética de la mirada y el fuego propio frente al espejo.',
      'Restauración del eje térmico y foco del Plexo Solar para alinear tu postura y tu centro de poder.',
      'Decreto de autoridad para desarmar la timidez y reclamar tu soberanía sin disculpas.',
    ],
    effect: 'Transforma el momento de maquillarte o cuidar tu piel en un acto de afirmación; enciende tu determinación y te impulsa a hacerte visible con magnetismo.',
    variant: 'utopica' as const,
  },
  {
    title: 'JADE RITUAL | El Latido Coherente',
    subtitle: 'Portal del Corazón & la Coherencia · Octaedro / Elemento Aire',
    items: [
      'Calibración inmersiva para sincronizar tu pulso orgánico con la frecuencia armónica de la Tierra.',
      'Maniobra de sostén térmico y contención física de los centros cardiorrespiratorios.',
      'Secuencia rítmica de autorregulación para enviar una señal biológica de descanso a cada órgano.',
    ],
    effect: 'Calma la opresión en el pecho y las palpitaciones por estrés; restablece la paz celular y te devuelve a un estado de profunda compasión y orden interno.',
    variant: 'jade' as const,
  },
]

const TESORO_UNIVERSAL_ITEMS = [
  {
    title: 'La Intención y el Biotipo (PDF Guía)',
    description: 'Recibís el manifiesto de la marca en un formato breve, junto con tips y ejemplos para aprender a intencionar y conectar con la energía de tu Biotipo (Serena, Ilumina, Renace, etc.).',
  },
  {
    title: 'Anclaje de la Presencia (Audio)',
    description: 'Práctica breve de respiración consciente para centrarte y crear el hábito de la conexión.',
  },
  {
    title: 'Música Medicina',
    description: 'Un link a la Playlist exclusiva de Da Luz para ambientar tu ceremonia.',
  },
]

const PLUS_SINERGIA_ITEMS = [
  {
    title: 'EL PROTOCOLO ALQUÍMICO (Guía Teórica)',
    description: 'Secuencia óptima y soporte teórico de la fusión de activos.',
  },
  {
    title: 'EL RITUAL DE LA FUSIÓN (audio)',
    description: 'Ceremonia guiada para transformar la aplicación del Kit en una experiencia meditativa y sinérgica.',
  },
  {
    title: 'EL ANCLA DE LA CEREMONIA',
    description: 'Ejercicios somáticos y de reflexión para integrar la intención.',
  },
]

export default function TesorosDaLuzPage() {
  return (
    <div className="tesoros-page tesoros-watermark min-h-screen">
      {/* Full-width title band */}
      <section className="tesoros-header-band">
        <div className="tesoros-header-band-inner">
          <h1 className="tesoros-page-title">tesoros da luz</h1>
        </div>
        <svg className="tesoros-header-wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H1440V10C1250 110 1080 130 900 95C690 55 580 35 390 70C220 100 130 135 0 155Z" fill="white" />
        </svg>
      </section>

      <div className="tesoros-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10 md:space-y-14">
        {/* Hero intro */}
        <section className="text-center space-y-6">
          <h2 className="tesoros-subtitle font-title text-center">
            Tu Ritualización Comienza Aquí: Dos Llaves de Transformación
          </h2>
          <p className="font-text text-lg md:text-xl text-text-primary leading-relaxed max-w-3xl mx-auto">
            Con cada Alkimya física que recibís, desbloqueás el acceso a su Tesoro digital privado: un portal interactivo diseñado con audios inmersivos, mudras y decretos biológicos para que tu cuidado diario no quede en la superficie, sino que ordene tu sistema nervioso y tu terreno interno.
          </p>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 1: Papel Semilla */}
        <section className="space-y-6">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            1: Papel Semilla y la Siembra de la Intención
          </h3>

          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Con la compra de una Alquimia o de un Kit Alkímico, te llevas de regalo un papel semilla: una invitación a honrar a la Madre Tierra mientras honrás tu propio templo.
              </p>
              <p className="tesoros-card-text font-text text-lg leading-relaxed mt-4">
                Un acto sagrado: Si no vas a sembrarlo ahora, regalalo a alguien que ame las plantas. Por favor, no lo tires; ahí habita vida y nutrición.
              </p>
            </CardContent>
          </Card>

          <h4 className="font-subtitle text-xl text-brand-primary italic mt-6">
            EL RITUAL DE SIEMBRA
          </h4>
          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Para activar tu semilla, te invitamos a un acto de presencia: escribí tu intención en un papel aparte y remojá el papel semilla 10 minutos antes de pasarlo a tierra fértil. Al plantarlo, activás tu Chakra Raíz, practicando el enraizamiento y la confianza en los ciclos de la vida.
              </p>
              <Link
                href="/blog"
                className="font-subtitle italic inline-block mt-4"
              >
                Guía completa: ¿Cómo cuido mi brote?
              </Link>
            </CardContent>
          </Card>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 2: Portal de Inmersión */}
        <section className="space-y-8">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            2. TU PORTAL DE INMERSIÓN
          </h3>

          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Con cada producto Da Luz que adquirís accedés a un <strong>Paquete de Bienvenida</strong> diseñado para la ritualización de tu autocuidado.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h4 className="font-subtitle text-xl text-brand-primary italic">
              A. EL TESORO UNIVERSAL (Regalo Fijo para todas las compras)
            </h4>
            <p className="font-text text-lg text-text-primary leading-relaxed italic">
              Tu infraestructura de regulación y conexión con la filosofía Da Luz:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TESORO_UNIVERSAL_ITEMS.map((item) => (
                <Card key={item.title} variant="brand" className="tesoros-content-card h-full">
                  <CardHeader>
                    <CardTitle className="tesoros-card-title font-subtitle text-base italic">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="tesoros-card-text font-text text-base leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-subtitle text-xl text-brand-primary italic">
              B. EL TESORO ESPECÍFICO (El Ritual de tu Línea)
            </h4>
            <p className="font-text text-lg text-text-primary leading-relaxed">
              Según la Alkimya que elijas, desbloqueás un Portal de Inmersión diseñado para transformar tu rutina en un acto de poder:
            </p>
            <TesorosPortalCarousel cards={PORTAL_CARDS} />
          </div>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 3: Plus de la Sinergia */}
        <section className="space-y-6">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            3. EL PLUS DE LA SINERGIA (Kits Da Luz)
          </h3>
          <p className="font-text text-lg text-text-primary leading-relaxed">
            Si elegís un kit, el valor de tu Tesoro se multiplica. Recibís TODO lo del Nivel Base (Tesoro Universal + Específico de cada línea incluida) MÁS tres herramientas de Maestría exclusivas, diseñadas para la sinergia e integración profunda:
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PLUS_SINERGIA_ITEMS.map((item) => (
              <Card key={item.title} variant="brand" className="tesoros-content-card h-full">
                <CardHeader>
                  <CardTitle className="tesoros-card-title font-subtitle text-base italic">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="tesoros-card-text font-text text-base leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 4: Cómo desbloquear */}
        <section className="space-y-4">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            ¿CÓMO LO DESBLOQUEO?
          </h3>
          <ul className="font-text text-lg text-text-primary leading-relaxed space-y-2 list-disc list-inside">
            <li><strong>Compra en Web:</strong> Se acredita automáticamente en tu perfil tras confirmar tu pedido.</li>
            <li><strong>Compra Externa (Local/WhatsApp):</strong> Registrate en la web y validá tu compra enviándonos tu mail y una foto del producto, número de lote o palabra clave por WhatsApp.</li>
          </ul>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 5: Maestría */}
        <Card variant="brand" className="tesoros-content-card">
          <CardContent className="pt-6">
            <h3 className="tesoros-card-title font-subtitle text-xl md:text-2xl italic mb-4">
              LA MAESTRÍA DE LA AUTOGESTIÓN: TU PRÓXIMO PASO
            </h3>
            <p className="tesoros-card-text font-text text-lg leading-relaxed">
              Estos Tesoros son un portal de bienvenida. Si deseás profundizar con ejercicios extensos y meditaciones de visualización avanzada, te invitamos a explorar la Membresía Da Luz.
            </p>
            <Link
              href="/membresia/programa"
              className="font-subtitle italic inline-block mt-4"
            >
              Explorar la Membresía Da Luz
            </Link>
          </CardContent>
        </Card>

        <hr className="border-brand-primary/30" />

        {/* Cierre y CTA */}
        <section className="text-center space-y-8">
          <p className="font-text text-lg text-text-primary leading-relaxed italic max-w-2xl mx-auto">
            El Tesoro es nuestra forma de honrar tu confianza y asegurar que cada gota de Alkimya cumpla su propósito de transformación.
          </p>
          <Link
            href="/productos"
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'btn tesoros-cta-link font-title uppercase tracking-wider w-full sm:w-auto justify-center px-6 py-4 sm:px-8 text-center no-underline'
            )}
          >
            EXPLORAR LA TIENDA Y OBTENER MI TESORO
          </Link>
        </section>
      </div>
    </div>
  )
}
