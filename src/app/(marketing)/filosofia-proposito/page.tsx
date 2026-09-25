import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/raices-filosofia.css'

export const metadata: Metadata = {
  title: 'Filosofía y Propósito | DA LUZ CONSCIENTE',
  description: 'Filosofía, propósito y los cuatro pilares de Da Luz Consciente.',
}

const pilares = [
  {
    title: '1. Naturaleza y Ancestralidad',
    text: 'En Da Luz, todo lo que ofrecemos está intrínsecamente conectado con la sabiduría de la Madre Tierra, la medicina herbal y las técnicas ancestrales de sanación. Creemos profundamente que estas herramientas primales son esenciales para recuperar el bioequilibrio y reconectar con el ritmo natural del Ser. Compromiso Sostenible: Utilizamos insumos libres de parabenos, ftalatos, disruptores endocrinos y toxinas, protegiendo al planeta, a los animales y a nuestra propia biología.',
  },
  {
    title: '2. Visión Integral y Autogestión',
    text: 'Entendemos que el equilibrio no proviene solo del cuerpo físico, sino de la sintonía fina con tus emociones, pensamientos y energía, así como de la atención a tu fisiología. Soberanía de los Cuerpos: Comprenderte como un ser integral te devuelve el poder de autogestionar tu salud. Por eso, honramos las diversas bio-individualidades. El Nuevo Paradigma: Inspirados en el Ayurveda, la Medicina China y la Sabiduría Floral, te brindamos un sendero práctico para acuerpar la información y pasar del estado de “supervivencia” a la “soberanía activa”.',
  },
  {
    title: '3. Ceremonia y Presencia',
    text: 'La magia de lo cotidiano. Te invitamos a vivir una Ceremonia diaria: un llamado a la presencia, a habitarte desde los sentidos, conectando con tu propio cuerpo desde una mirada de Amor y cuidado. Lo Cotidiano como Ritual: Cada propuesta es un portal para explorar tu sensorialidad, utilizando tu voz, tu respiración y tu cuerpo como herramientas de regulación. Acompañamos nuestras fórmulas con recursos somáticos diseñados para elevar tu rutina al plano de lo sagrado.',
  },
  {
    title: '4. Placer y Creatividad',
    text: 'Crear desde el placer es nuestro mantra. Te proponemos explorar nuevas formas de vincularte con tus procesos vitales. El goce no es un lujo; es la puerta de entrada a tu verdadero poder creador. Disolver la resistencia: Te invitamos al asombro en los pequeños detalles, a la curiosidad y la exploración. A través del disfrute de lo suave, lo sutil y lo profundo, reconectás con tus aguas internas y tu fuerza primal.',
  },
]

export default function FilosofiaPropositoPage() {
  return (
    <main className="filosofia-editorial-page">
      <section className="filosofia-editorial-hero">
        <div className="filosofia-editorial-wave">
          <h1>Filosofía y Propósito</h1>
        </div>
        <p className="filosofia-editorial-tagline">La vida se transforma cuando cada acción se convierte en un acto sagrado de atención y presencia.</p>
        <div className="filosofia-editorial-manifesto-shape">
          <div className="filosofia-editorial-manifesto">
            <p>Da Luz Consciente es una invitación a nutrir integralmente tu cuerpo, tus emociones, tu mente y tu espíritu. No somos una solución instantánea; somos el puente para quienes se comprometen a escuchar su propio pulso, a habitar la pausa y a comprender la salud como un proceso de autogestión y soberanía.</p>
            <p>Deseamos que el acto de cuidarte se convierta en un ritual diario, donde la Presencia, la gratitud y el goce acompañen cada uno de tus pasos. Nuestro propósito es acompañarte a construir un equilibrio genuino, sumergiéndote en un viaje alquímico hacia tu interior, donde tu cuerpo sea honrado como un templo. Acá, la pausa es un acto sagrado.</p>
          </div>
        </div>
      </section>

      <section className="filosofia-editorial-content" aria-labelledby="pilares-title">
        <h2 id="pilares-title">Los 4 Pilares Da Luz</h2>
        <div className="filosofia-editorial-grid">
          {pilares.map((pilar) => (
            <article className="filosofia-editorial-card" key={pilar.title}>
              <h3>{pilar.title}</h3>
              <p>{pilar.text}</p>
            </article>
          ))}
        </div>
        <Link href="/alkimya/biotipos-doshas" className="filosofia-editorial-cta">¡DESCUBRÍ TU BIOTIPO AHORA!</Link>
      </section>
    </main>
  )
}
