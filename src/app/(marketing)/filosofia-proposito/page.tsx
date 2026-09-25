import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/raices-filosofia.css'

export const metadata: Metadata = {
  title: 'Filosofía y Propósito | DA LUZ CONSCIENTE',
  description: 'Filosofía, propósito y los cuatro pilares de Da Luz Consciente.',
}

const PROCESOS_WRAPPER = 'raices-filosofia-pages raices-page'

export default function FilosofiaPropositoPage() {
  return (
    <div className={PROCESOS_WRAPPER}>
      <div className="raices-page-container">
        <div className="raices-page-bg raices-bg-general" aria-hidden />

        <div className="raices-hero-desktop-only">
          <section className="raices-header-band raices-title-band" aria-labelledby="raices-title">
            <div className="raices-header-band-inner">
              <h1 id="raices-title" className="raices-band-title raices-band-title-deep">RAÍCES DA LUZ</h1>
            </div>
          </section>
          <p id="filosofia-proposito" className="raices-band-subtitle raices-band-subtitle-white">FILOSOFÍA Y PROPÓSITO</p>
          <section className="raices-main-text-section">
            <p className="raices-intro raices-intro-deep raices-intro-1"><em>La vida se transforma cuando cada acción se convierte en un acto sagrado de atención y presencia.</em></p>
            <p className="raices-intro raices-intro-deep raices-intro-2"><strong>DA LUZ CONSCIENTE ES UNA INVITACIÓN</strong> a nutrir integralmente tu cuerpo, tus emociones, tu mente y tu espíritu. No somos una solución instantánea; somos el puente para quienes se comprometen a escuchar su propio pulso, a habitar la pausa y a comprender la salud como un proceso de <strong>autogestión y soberanía.</strong></p>
            <p className="raices-intro raices-intro-deep raices-intro-3">Deseamos que el acto de cuidarte se convierta en un ritual diario, donde la <strong>Presencia, la gratitud y el goce</strong> acompañen cada uno de tus pasos.</p>
            <p className="raices-intro raices-intro-deep raices-intro-4">Nuestro propósito es acompañarte a construir un equilibrio genuino.{' '}<strong>Te invitamos a sumergirte en un viaje alquímico hacia tu interior, donde tu cuerpo sea honrado como un templo.</strong></p>
            <div className="raices-small-quote-wrap"><p className="raices-small-quote-text">Acá, la pausa es un acto sagrado.</p></div>
          </section>
        </div>

        <div className="raices-hero-mobile-only">
          <section className="raices-header-band raices-hero-mobile-band" aria-labelledby="raices-title-mobile">
            <div className="raices-header-band-inner">
              <h1 id="raices-title-mobile" className="raices-band-title">RAÍCES DA LUZ</h1>
              <p id="filosofia-proposito-mobile" className="raices-band-subtitle">FILOSOFÍA Y PROPÓSITO</p>
            </div>
          </section>
          <div className="raices-content raices-hero-mobile-content">
            <p className="raices-intro"><em>La vida se transforma cuando cada acción se convierte en un acto sagrado de atención y presencia.</em></p>
            <p className="raices-intro"><strong>DA LUZ CONSCIENTE ES UNA INVITACIÓN</strong> a nutrir integralmente tu cuerpo, tus emociones, tu mente y tu espíritu. No somos una solución instantánea; somos el puente para quienes se comprometen a escuchar su propio pulso, a habitar la pausa y a comprender la salud como un proceso de <strong>autogestión y soberanía.</strong></p>
            <p className="raices-intro">Deseamos que el acto de cuidarte se convierta en un ritual diario, donde la <strong>Presencia, la gratitud y el goce</strong> acompañen cada uno de tus pasos.</p>
            <blockquote className="raices-quote">Acá, la pausa es un acto sagrado.</blockquote>
            <p className="raices-intro">Nuestro propósito es acompañarte a construir un equilibrio genuino.{' '}<strong>Te invitamos a sumergirte en un viaje alquímico hacia tu interior, donde tu cuerpo sea honrado como un templo.</strong></p>
          </div>
        </div>

        <div className="raices-content">
          <h2 className="pilares-section-title">LOS 4 PILARES DA LUZ</h2>
          <p className="pilares-section-subtitle">Viví en Presencia. Creá con Placer. Honrá tus Raíces.</p>
          <div className="raices-pilares-grid">
            <article className="raices-card">
              <h3 className="raices-card-title">1. Naturaleza y Ancestralidad</h3>
              <p>En Da Luz, todo lo que ofrecemos está intrínsecamente conectado con la sabiduría de la Madre Tierra, la medicina herbal y las técnicas ancestrales de sanación.</p>
              <p>Creemos profundamente que estas herramientas primales son esenciales para recuperar el <strong>bioequilibrio</strong> y reconectar con el ritmo natural del Ser.</p>
              <p><strong>Compromiso Sostenible:</strong> Utilizamos insumos libres de parabenos, ftalatos, disruptores endocrinos y toxinas, protegiendo al planeta, a los animales y a nuestra propia biología.</p>
              <p className="raices-card-subtitle"><em>Te invitamos a reconocer tus raíces, para nutrir tus frutos.</em></p>
            </article>
            <article className="raices-card">
              <h3 className="raices-card-title">2. Visión Integral y Autogestión</h3>
              <p>Entendemos que el equilibrio no proviene solo del cuerpo físico, sino de la sintonía fina con tus emociones, pensamientos y energía, así como de la atención a tu fisiología.</p>
              <p><strong>Soberanía de los Cuerpos:</strong> Comprenderte como un ser integral te devuelve el poder de autogestionar tu salud. Por eso, honramos las diversas bio-individualidades.</p>
              <p><strong>El Nuevo Paradigma:</strong> Inspirados en el Ayurveda, la Medicina China y la Sabiduría Floral, te brindamos un sendero práctico para acuerpar la información y pasar del estado de “supervivencia” a la <strong>“soberanía activa”.</strong></p>
            </article>
            <article className="raices-card">
              <h3 className="raices-card-title">3. Ceremonia y Presencia</h3>
              <p className="raices-card-subtitle"><strong>La magia de lo cotidiano.</strong></p>
              <p>Te invitamos a vivir una Ceremonia diaria: un llamado a la presencia, a habitarte desde los sentidos, conectando con tu propio cuerpo desde una mirada de Amor y cuidado.</p>
              <p><strong>Lo Cotidiano como Ritual:</strong> Cada propuesta es un portal para explorar tu sensorialidad, utilizando tu voz, tu respiración y tu cuerpo como herramientas de regulación.</p>
              <p>Acompañamos nuestras fórmulas con recursos somáticos diseñados para <strong>elevar tu rutina al plano de lo sagrado.</strong></p>
            </article>
            <article className="raices-card">
              <h3 className="raices-card-title">4. Placer y Creatividad</h3>
              <p className="raices-card-subtitle"><strong>Crear desde el placer es nuestro mantra.</strong></p>
              <p>Te proponemos explorar nuevas formas de vincularte con tus procesos vitales.</p>
              <p><strong>El goce no es un lujo; es la puerta de entrada a tu verdadero poder creador.</strong></p>
              <p><strong>Disolver la resistencia:</strong> Te invitamos al asombro en los pequeños detalles, a la curiosidad y la exploración. A través del disfrute de lo suave, lo sutil y lo profundo, reconectás con tus aguas internas y tu fuerza primal.</p>
            </article>
          </div>
          <section className="raices-cta-section">
            <p className="raices-cta-text">Tu bienestar empieza hoy, reconociendo tu esencia.</p>
            <Link href="/alkimya/biotipos-doshas" className="raices-cta-button">¡DESCUBRÍ TU BIOTIPO AHORA!</Link>
          </section>
        </div>
      </div>
    </div>
  )
}
