import { Metadata } from 'next';
import Link from 'next/link';
import {
  ProcesosBackground,
  ProcesosOvalBox,
} from '@/components/svg/ProcesosPageComponents';
import '../procesos-pages.css';
import './ciclos.css';

const PROCESOS_WRAPPER = 'procesos-pages';

export const metadata: Metadata = {
  title: 'Ciclos Alquímicos | DA LUZ CONSCIENTE',
  description:
    'Rutas de transformación consciente: Oasis, Metamorfosis y Génesis. Depuración natural y acompañamiento holístico para recuperar tu bioequilibrio.',
  openGraph: {
    title: 'Ciclos Alquímicos - DA LUZ CONSCIENTE',
    description:
      'Oasis, Metamorfosis y Génesis. Programas de sanación y purificación para tu viaje alquímico.',
    type: 'website',
  },
};

export default function CiclosAlquimicosPage() {
  return (
    <div className={`${PROCESOS_WRAPPER} ciclos-page`}>
      <div className="procesos-page-container">
        <ProcesosBackground variant="general" />

        {/* Cabecera - full width como Sesiones */}
        <section
          className="ciclos-header-band"
          aria-labelledby="ciclos-section-title"
        >
          <div className="ciclos-header-band-inner">
            <h1 id="ciclos-section-title" className="ciclos-section-header">
              Ciclos Alquímicos: La Maestría de la Continuidad
            </h1>
          </div>
        </section>

        <main className="ciclos-main" id="ciclos-content">
          {/* Bloque 1: Introducción */}
          <section
            className="ciclos-intro"
            aria-labelledby="ciclos-intro-heading"
          >
            <h2 id="ciclos-intro-heading" className="sr-only">
              Introducción a los Ciclos Alquímicos
            </h2>
            <p className="ciclos-intro-item ciclos-intro-left-1">
              <strong>La verdadera alquimia requiere maduración.</strong>
            </p>
            <p className="ciclos-intro-item ciclos-intro-right">
              Procesos de mediano y largo plazo concebidos para desarticular corazas crónicas, depurar órganos y reeducar el subconsciente mediante hábitos escalonados sin agresión.
            </p>
            <p className="ciclos-intro-item ciclos-intro-left-2">
              Estos programas están creados para quienes eligen desarmar automatismos y reconstruir su fisiología paso a paso.
            </p>

          </section>
          {/* Bloque 2: OASIS */}
          <article
            className="ciclos-cycle-block"
            aria-labelledby="ciclos-oasis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-oasis-title" className="ciclos-cycle-title">
                OASIS
              </h2>
              <p className="ciclos-cycle-subtitle">
              Navegando Mis Aguas: Calibración &amp; Depuración Emocional
            </p>
            </div>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>Enfoque:</strong> Depuración Emocional, Alquimia Vibracional &amp; Reconfiguración Subconsciente.
                <br /><br />
                <strong>Duración &amp; Formato:</strong> Proceso individual continuo (Encuentros 1:1 quincenales o mensuales).
                <br /><br />
                <strong>Tecnologías:</strong> Péndulo Evolutivo, Terapia Floral de Precisión, Aromaterapia Límbica y Regulación Somática.
                <br /><br />
                <strong>Para qué sirve:</strong> Un espacio de calibración y contención profunda para cuando el cuerpo empieza a hablar a través del cansancio crónico, la reactividad ansiosa o la sensación constante de incoherencia. No venimos a forzar cambios drásticos, sino a desarmar automatismos de defensa y devolverle el tono parasimpático a tu sistema nervioso.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Ideal para:</strong> Mujeres y personas que sostienen demasiado hacia afuera (proyectos, equipos, familias) y sienten el costo en la materia: sobrecarga mental, reactividad del sistema simpático y fatiga emocional, o la postergación sistemática de su propio sentir. Para quienes buscan un espacio íntimo y seguro de calibración a medida, sin recetas enlatadas, para ordenar sus aguas internas y recuperar la calma biológica.
                <br /><br />
                <strong>La Metodología (4 Niveles):</strong> Integramos en cada encuentro el rastreo subconsciente (péndulo), la indagación biopsicoemocional de la raíz, la reeducación celular (Flores de Bach + Elixir aromático) y la descarga fascial en el cuerpo.
                <br /><br />
                <strong>Incluye:</strong> Sesiones 1:1 personalizadas + Medicina botánica viva formulada mes a mes + Hoja de ruta sobre tus Ejes Arquetípicos + Soporte continuo entre sesiones.
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES COMPLETOS DE OASIS
              </Link>
            </div>
          </article>

          {/* Bloque 4: METAMORFOSIS */}
          <article
            className="ciclos-cycle-block"
            aria-labelledby="ciclos-metamorfosis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-metamorfosis-title" className="ciclos-cycle-title">
                METAMORFOSIS
              </h2>
              <p className="ciclos-cycle-subtitle">
                El Futuro es Volver al Origen: Acompañamiento Biopsicoemocional a Medida
              </p>
            </div>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>Enfoque:</strong> Acompañamiento Biopsicoemocional, Depuración de Filtros Orgánicos y Desprogramación Celular.
                <br /><br />
                <strong>Duración:</strong> 5 Meses (El Sendero de los 5 Elementos y Emuntorios Biológicos).
                <br /><br />
                <strong>Tecnologías:</strong> Fitoterapia Clínica de Precisión, Biodecodificación, Radiestesia Evolutiva y Liberación Fascial.
                <br /><br />
                <strong>Para qué sirve:</strong> Un proceso somático individual donde no hay recetas rígidas: tu momento presente y tus síntomas marcan la puerta de entrada. Aunque contamos con una estructura base de 5 estaciones orgánicas, el sendero se adapta a tu terreno. Es un espacio para escuchar el diálogo íntimo entre tu biología y tu mundo emocional: decodificar qué te está diciendo la inflamación recurrente, qué frustración retiene el hígado, qué miedos enfrían los riñones o qué duelos no llorados cargan tus pulmones. Al aflojar el terreno físico con medicina vegetal viva, las aguas emocionales se mueven solas, permitiendo que la emoción reprimida emerja para ser compostada, integrada y transformada en ligereza.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Ideal para:</strong> Quienes experimentan síntomas físicos o saturación emocional (hinchazón recurrente, desajustes del ciclo, pesadez hepática, angustia sin causa aparente o fatiga crónica) y buscan un acompañamiento cercano, clínico y personalizado. Para mujeres que no buscan que nadie les imponga qué hacer, sino que eligen un espacio seguro donde contar con el sostén, las plantas y las herramientas somáticas necesarias para decodificar su propio malestar, limpiar sus filtros biológicos y atravesar su metamorfosis desde la Transgozación: haciendo del proceso un camino de autodescubrimiento, presencia y verdadero goce.
                <br /><br />
                <strong>La Hoja de Ruta (5 Estaciones):</strong> Intestino &amp; Mente (Mes 1), Colon &amp; Linaje Ancestral (Mes 2), Hígado &amp; Poder Personal (Mes 3), Útero, Huesos &amp; Límites (Mes 4), hasta culminar en el Sistema Nervioso y la integración de tu Adulta Soberana (Mes 5).
                <br /><br />
                <strong>Incluye:</strong> 1 Sesión individual mensual de 90 min (1:1) + Kit mensual de Fitoterapia Viva (tinturas madre, elixires y pócimas) + Bitácora Da Luz de trabajo somático + Acompañamiento y soporte continuo por canal de voz VIP.
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES COMPLETOS DE METAMORFOSIS
              </Link>
            </div>
          </article>

          {/* Bloque 5: GENESIS */}
          <article
            className="ciclos-cycle-block ciclos-cycle-block-last"
            aria-labelledby="ciclos-genesis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-genesis-title" className="ciclos-cycle-title">
                GÉNESIS
              </h2>
              <p className="ciclos-cycle-subtitle">
                La Tecnología del Ser: Escuela de Soberanía Celular &amp; Reestructuración Somática
              </p>
            </div>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>Enfoque:</strong> Formación y Reestructuración Somática, Biológica y Transgeneracional.
                <br /><br />
                <strong>Duración:</strong> 7 a 8 Meses (El tiempo biológico necesario para reeducar la fascia, los hábitos y la memoria celular).
                <br /><br />
                <strong>Tecnologías:</strong> Los 5 Pilares Da Luz: Fitoterapia Clínica, Anatomía de la Fascia, Psicomagia Subconsciente, Resonancia Sensorial y Vaciado Nervioso.
                <br /><br />
                <strong>Para qué sirve:</strong> Es la inmersión formativa, biológica y experiencial más profunda de Da Luz. Su cimiento físico es un protocolo completo de depuración herbal de 8 meses, concebido para limpiar progresivamente tus filtros orgánicos, desintoxicar tu química celular y renovar tus tejidos. Mientras tu cuerpo experimenta esta depuración mes a mes, recorremos la arquitectura de 6 Ejes teóricos y prácticos que integran chakras, mapas de personalidad, neurobiología, anatomía de la fascia y laboratorios somáticos. No es una consulta puntual, sino un máster de autogestión para comprender y habitar la ingeniería viva de tu propio ser.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Ideal para:</strong> Quienes buscan una inmersión integral y con sustento teórico profundo, más allá de aliviar un síntoma del momento. Para mujeres decididas a dominar las herramientas de su propio autoconocimiento (arquetipos, centros energéticos, psicología del subconsciente y medicina de los sentidos), comprometiéndose a vivir en carne propia un protocolo de depuración herbal de 8 meses para reeducar su organismo, desmantelar los mandatos del sacrificio o la complacencia y convertirse en las soberanas absolutas de su salud, su energía vital y su realidad material.
                <br /><br />
                <strong>El Recorrido (Matriz de Estaciones):</strong> El Vacío (Mes 0), Raíces e Intestino (Eje 1), Hígado y Fuego (Eje 2), Centro Creativo &amp; Pelvis (Eje 3), El Puente del Corazón (Eje 4), La Voz Laríngea (Eje 5), hasta anclar en la glándula pineal y la integración de tu autogestión (Eje 6).
                <br /><br />
                <strong>Formatos de participación:</strong> Modalidad Autogestión: acceso completo, clases grabadas, bitácoras clínicas y audios de integración somática. Modalidad Mentoría 1:1: programa completo + sesiones mensuales individuales de 90 min con Guadalupe + canal de soporte prioritario. (Ambas disponibles en versión 100% Digital o sumando el Botiquín Alquímico Físico con fórmulas botánicas vivas).
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES Y FORMATOS DE GÉNESIS
              </Link>
            </div>
          </article>
        </main>
        <section className="ciclos-intro ciclos-intro--preventive" aria-labelledby="ciclos-preventive-title">
          <h2 id="ciclos-preventive-title" className="ciclos-cycle-title">No Necesitás Estar Rota para Prestarte Atención</h2>
          <p className="ciclos-intro-item">Aprender a usar tu propia tecnología biológica a favor.</p>
          <p className="ciclos-intro-item">La mayoría de las personas esperan a que el cuerpo colapse para mirarse. Si no tenés un diagnóstico concreto pero sentís curiosidad por conocer tu biotipo, experimentar tu primera depuración herbal noble y afinar tu energía, nuestros espacios te enseñan a leer las señales sutiles de tu terreno antes de que se transformen en grito.</p>
          <div className="ciclos-cycle-cta">
            <Link href="/alkimya/biotipos-doshas" className="procesos-btn-cream ciclos-detail-link">REALIZAR EL TEST DE BIOTIPOS Y TERRENO</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
