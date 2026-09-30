import { Metadata } from 'next'
import AlkimyaWaveHeader from '@/components/alkimya/AlkimyaWaveHeader';
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import TesorosPortalCarousel from '@/components/alkimya/TesorosPortalCarousel'

export const metadata: Metadata = {
  title: 'Tesoros Da Luz | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Tu ritualización comienza aquí. Descubrí los Tesoros Da Luz: papel semilla, portal de inmersión y herramientas de transformación con cada producto.',
}

const PORTAL_CARDS = [
  {
    title: 'ALMA TERRA | El Ancla del Presente',
    portal: 'Portal de Enraizamiento',
    frequency: 'Hexaedro / Elemento Tierra',
    experiences: [
      ['Frecuencia Acústica de Autor', 'Sesión inmersiva guiada para descender la velocidad mental y frenar la rumiación del sistema nervioso.'],
      ['Activación Somática', 'Maniobra física de descarga y arraigo corporal para indicarle a tus células que están seguras y sostenidas.'],
      ['Código de Reprogramación', 'Secuencia verbal de integración para anclar presencia biológica en el aquí y ahora.'],
    ],
    effect: 'Disuelve la sensación de vértigo y la fatiga por sobreexigencia; te devuelve el suelo firme para habitar tu día sin dispersión.',
    variant: 'alma' as const,
  },
  {
    title: 'ECOS | El Susurro Sagrado',
    portal: 'Portal de Purificación & Claridad',
    frequency: 'Dodecaedro / Elemento Éter',
    experiences: [
      ['Frecuencia Acústica de Autor', 'Viaje sonoro de vacío fértil para disolver la sobrecarga electromagnética de la mente.'],
      ['Activación Somática', 'Descompresión fascial del canal laríngeo y de la base del cráneo para liberar la tensión acumulada por el control.'],
      ['Código de Reprogramación', 'Protocolo de depuración del eje palabra-pensamiento para conectar con tu verdad interna.'],
    ],
    effect: 'Drena la carga en cuello y hombros, disuelve los nudos de lo no dicho y despeja la cabeza para que tu voz recupere su cauce natural.',
    variant: 'ecos' as const,
  },
  {
    title: 'UMBRAL SENS | La Memoria Líquida',
    portal: 'Portal de la Sacralidad & el Goce',
    frequency: 'Icosaedro / Elemento Agua',
    experiences: [
      ['Frecuencia Acústica de Autor', 'Inmersión somática en tu red hídrica para ablandar la armadura del estrés y entrar en estado receptivo.'],
      ['Activación Somática', 'Masaje miofascial de descompresión en el eje rostro-sacro (la conexión biológica directa entre la boca y tu pelvis).'],
      ['Código de Reprogramación', 'Apertura celular para disolver la rigidez y rehabilitar la capacidad biológica de placer.'],
    ],
    effect: 'Descongela la coraza corporal, relaja las facciones del rostro desde la raíz y despierta tu vitalidad sensorial y creativa.',
    variant: 'umbral' as const,
  },
  {
    title: 'PRISMA | La Fragua Solar',
    portal: 'Portal de la Identidad & la Voluntad',
    frequency: 'Tetraedro / Elemento Fuego',
    experiences: [
      ['Frecuencia Acústica de Autor', 'Activación bioenergética de la mirada y el fuego propio frente al espejo.'],
      ['Activación Somática', 'Restauración del eje térmico y foco del Plexo Solar para alinear tu postura y tu centro de poder.'],
      ['Código de Reprogramación', 'Decreto de autoridad para desarmar la timidez y reclamar tu soberanía sin disculpas.'],
    ],
    effect: 'Transforma el momento de maquillarte o cuidar tu piel en un acto de afirmación; enciende tu determinación y te impulsa a hacerte visible con magnetismo.',
    variant: 'utopica' as const,
  },
  {
    title: 'JADE RITUAL | El Latido Coherente',
    portal: 'Portal del Corazón & la Coherencia',
    frequency: 'Octaedro / Elemento Aire',
    experiences: [
      ['Frecuencia Acústica de Autor', 'Calibración inmersiva para sincronizar tu pulso orgánico con la frecuencia armónica de la Tierra.'],
      ['Activación Somática', 'Maniobra de sostén térmico y contención física de los centros cardiorrespiratorios.'],
      ['Código de Reprogramación', 'Secuencia rítmica de autorregulación para enviar una señal biológica de descanso a cada órgano.'],
    ],
    effect: 'Calma la opresión en el pecho y las palpitaciones por estrés; restablece la paz celular y te devuelve a un estado de profunda compasión y orden interno.',
    variant: 'jade' as const,
  },
]
const TESORO_UNIVERSAL_ITEMS = [
  {
    title: 'La Intención y el Biotipo (Guía PDF)',
    description: 'El manifiesto de la marca junto con pautas claras para decodificar el lenguaje de tu terreno (Serena, Ilumina, Renace, etc.) y personalizar tu ritual.',
  },
  {
    title: 'Anclaje de la Presencia (Audio de Autor)',
    description: 'Práctica breve de respiración consciente para regular el sistema nervioso e instalar el hábito de la conexión diaria.',
  },
  {
    title: 'Frecuencia y Música Medicina',
    description: 'Enlace a la Playlist exclusiva en 432 Hz de Da Luz para sintonizar el ambiente de tu ceremonia.',
  },
]

const PLUS_SINERGIA_ITEMS = [
  {
    title: 'El Protocolo Alquímico (Guía Galénica)',
    description: 'Secuencia óptima y sustento técnico sobre la biodisponibilidad, orden de capas y sinergia molecular de los activos.',
  },
  {
    title: 'El Ritual de la Fusión (Audio Guiado)',
    description: 'Ceremonia sonora para transformar la aplicación combinada de tus alquimias en una experiencia meditativa y sensorial.',
  },
  {
    title: 'El Ancla de la Ceremonia (Práctica Somática)',
    description: 'Maniobras corporales y preguntas de auto-indagación para sellar la intención biológica en el cuerpo.',
  },
]

export default function TesorosDaLuzPage() {
  return (
    <div className="tesoros-page tesoros-watermark min-h-screen">
      <AlkimyaWaveHeader title="Tesoros Da Luz" />

      <div className="tesoros-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10 md:space-y-14">
        {/* Hero intro */}
        <section className="text-center space-y-6">
          <h2 className="tesoros-subtitle font-title text-center">
            Tu Ritualización Comienza Acá: Dos Llaves de Transformación
          </h2>
          <p className="font-text text-lg md:text-xl text-text-primary leading-relaxed max-w-3xl mx-auto">
            Con cada Alkimya física que recibís, desbloqueás el acceso a su Tesoro digital privado: un portal interactivo diseñado con frecuencias acústicas de autor, maniobras somáticas y códigos de reprogramación celular para que tu cuidado diario no quede en la superficie, sino que ordene tu sistema nervioso y tu terreno interno.
          </p>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 1: Papel Semilla */}
        <section className="space-y-6">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            Llave 1: El Papel Semilla y la Siembra de la Intención
          </h3>

          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Con la compra de cada Alkimya o Kit Alkímico, te llevás de regalo un papel semilla artesanal: una invitación viva a honrar a la Madre Tierra mientras habitás tu propio templo.
              </p>
              <p className="tesoros-card-text font-text text-lg leading-relaxed mt-4">
                <strong>Un acto sagrado:</strong> Si no vas a sembrarlo ahora, regaláselo a alguien que ame las plantas. Por favor, no lo tires: ahí habita vida, nutrición y memoria vegetal.
              </p>
            </CardContent>
          </Card>

          <h4 className="font-subtitle text-xl text-brand-primary italic mt-6">
            El Ritual de Siembra
          </h4>
          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Para activar tu semilla, te invitamos a un acto de presencia: escribí tu intención en un papel aparte y remojá el papel semilla durante 10 minutos antes de pasarlo a tierra fértil. Al plantarlo, activás tu enraizamiento y confianza en los ciclos orgánicos de la vida.
              </p>
              <Link
                href="/blog"
                className="font-subtitle italic inline-block mt-4"
              >
                ✦ GUÍA COMPLETA: ¿CÓMO CUIDO MI BROTE?
              </Link>
            </CardContent>
          </Card>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 2: Portal de Inmersión */}
        <section className="space-y-8">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            Llave 2: Tu Portal de Inmersión
          </h3>

          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Con cada fórmula Da Luz que adquirís, accedés a una infraestructura privada de regulación y autocuidado consciente.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h4 className="font-subtitle text-xl text-brand-primary italic">
              A. El Tesoro Universal (Regalo fijo incluido en todas las compras)
            </h4>
            <p className="tesoros-intro-copy font-text text-lg leading-relaxed italic">
              Tu base de regulación y conexión con la filosofía Da Luz:
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
              B. El Tesoro Específico (El Ritual Exclusivo de tu Línea)
            </h4>
            <p className="tesoros-intro-copy font-text text-lg leading-relaxed">
              Según la Alkimya que elijas, desbloqueás un Portal de Inmersión diseñado para transformar tu aplicación en un acto de soberanía:
            </p>
            <TesorosPortalCarousel cards={PORTAL_CARDS} />
          </div>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 3: Plus de la Sinergia */}
        <section className="space-y-6">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            3. La Sinergia de los Kits (Nivel Maestría)
          </h3>
          <p className="tesoros-intro-copy font-text text-lg leading-relaxed">
            Al elegir un Kit Alkímico, el valor de tu experiencia se multiplica. Desbloqueás la totalidad de los Tesoros Base (Universal + Específicos de cada línea incluida) más tres herramientas exclusivas de integración profunda:
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
            ¿Cómo Desbloqueo mi Tesoro?
          </h3>
          <ul className="font-text text-lg text-text-primary leading-relaxed space-y-2 list-disc list-inside">
            <li><strong>Compra en la Web:</strong> Se acredita automáticamente en tu perfil de usuario una vez confirmado tu pedido.</li>
            <li><strong>Compra Externa (Showroom / WhatsApp):</strong> Creá tu cuenta en la web y validamos tu acceso enviándonos por WhatsApp tu email junto a una foto del producto, número de lote o palabra clave.</li>
          </ul>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 5: Maestría */}
        <Card variant="brand" className="tesoros-content-card">
          <CardContent className="pt-6">
            <h3 className="tesoros-card-title font-subtitle text-xl md:text-2xl italic mb-4">
              La Maestría de la Autogestión: Tu Próximo Paso
            </h3>
            <p className="tesoros-card-text font-text text-lg leading-relaxed">
              Los Tesoros son tu portal de bienvenida. Si sentís el llamado a profundizar con prácticas somáticas de integración, autoconocimiento biológico y masterclasses de autor, te invitamos a explorar la Membresía Da Luz.
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
            <strong>El Tesoro es nuestra forma de honrar tu confianza</strong> y asegurar que cada gota de Alkimya cumpla su propósito sagrado de transformación celular.
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
