import Link from "next/link";

export default function PoliticasEnvioPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-12 text-[#0A1D4A] md:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="font-title text-3xl font-semibold uppercase leading-tight text-[#0A1D4A] md:text-5xl">
            Políticas de Envío, Despacho y Logística Viva
          </h1>
          <p className="mx-auto mt-6 max-w-3xl font-text text-sm leading-relaxed md:text-base">
            En Da Luz Consciente tratamos cada envío como la entrega de un objeto sagrado. Nuestras alquimias se elaboran en lotes pequeños y se envasan artesanalmente en vidrio ámbar. Para asegurar que lleguen a tus manos con su fuerza vital intacta, contamos con un circuito de despacho cuidado y embalaje 100% libre de plástico innecesario.
          </p>
        </header>

        <div className="space-y-8">
          <section className="rounded-[0_20px] bg-white p-6 shadow-md md:p-8">
            <h2 className="mb-4 font-subtitle text-2xl font-semibold">1. Tiempos de Preparación y Despacho</h2>
            <ul className="list-disc space-y-3 pl-5 font-text text-sm leading-relaxed md:text-base">
              <li><strong>Elaboración y Armado:</strong> Cada pedido ingresa a nuestro laboratorio botánico y se despacha dentro de las <strong>24 a 48 horas hábiles</strong> posteriores a la acreditación del pago.</li>
              <li><strong>Días de Despacho:</strong> Realizamos salidas de encomiendas los días <strong>martes y jueves</strong> para optimizar los tiempos de viaje y evitar que los preparados queden estancados en depósitos logísticos durante los fines de semana.</li>
            </ul>
          </section>

          <section className="rounded-[0_20px] bg-white p-6 shadow-md md:p-8">
            <h2 className="mb-4 font-subtitle text-2xl font-semibold">2. Tiempos de Entrega Estimados</h2>
            <p className="mb-3 font-text text-sm leading-relaxed md:text-base">Una vez despachado el paquete por el correo, los plazos habituales de tránsito son:</p>
            <ul className="list-disc space-y-3 pl-5 font-text text-sm leading-relaxed md:text-base">
              <li><strong>Córdoba Capital y Alrededores:</strong> 24 a 48 horas hábiles.</li>
              <li><strong>Interior de Córdoba y Provincias Centrales (CABA, GBA, Santa Fe):</strong> 2 a 4 días hábiles.</li>
              <li><strong>Resto del País (Noroeste, Cuyo, Litoral y Patagonia):</strong> 3 a 6 días hábiles.</li>
            </ul>
            <p className="mt-4 font-text text-sm italic leading-relaxed">(En localidades remotas o rurales los tiempos pueden extenderse según la frecuencia de distribución del correo).</p>
          </section>

          <section className="rounded-[0_20px] bg-white p-6 shadow-md md:p-8">
            <h2 className="mb-4 font-subtitle text-2xl font-semibold">3. Costos y Beneficio de Envío Gratis</h2>
            <ul className="list-disc space-y-3 pl-5 font-text text-sm leading-relaxed md:text-base">
              <li><strong>Calculador en Carrito:</strong> El costo exacto se calcula automáticamente al ingresar tu Código Postal antes de abonar.</li>
              <li><strong>ENVÍO GRATIS:</strong> Brindamos <strong>Envío Bonificado a todo el país</strong> en compras que superen el umbral oficial vigente (<strong>$ 77.000</strong>). Este beneficio se aplica de forma automática al momento de confirmar tu carrito.</li>
            </ul>
          </section>

          <section className="rounded-[0_20px] bg-white p-6 shadow-md md:p-8">
            <h2 className="mb-4 font-subtitle text-2xl font-semibold">4. Seguimiento de tu Encomienda</h2>
            <p className="font-text text-sm leading-relaxed md:text-base">
              En cuanto tu paquete es admitido por el correo, el sistema te envía un correo electrónico automático con tu <strong>Código de Seguimiento (Tracking)</strong> y el enlace directo para monitorear el recorrido en tiempo real hasta tu domicilio o sucursal seleccionada.
            </p>
          </section>

          <section className="rounded-[0_20px] bg-white p-6 shadow-md md:p-8">
            <h2 className="mb-4 font-subtitle text-2xl font-semibold">5. Punto de Retiro en Córdoba (Pick-up Gratuito)</h2>
            <p className="mb-3 font-text text-sm leading-relaxed md:text-base">Si residís en Córdoba o estás de paso, podés retirar tu pedido sin costo de envío:</p>
            <ul className="list-disc space-y-3 pl-5 font-text text-sm leading-relaxed md:text-base">
              <li><strong>Ubicación:</strong> Zona Norte de Córdoba Capital.</li>
              <li><strong>Días de Entrega:</strong> Miércoles y Viernes.</li>
              <li><strong>Dinámica:</strong> Una vez que tu pedido esté preparado, te contactamos vía WhatsApp para coordinar la franja horaria exacta de retiro.</li>
            </ul>
          </section>

          <section className="rounded-[0_20px] bg-white p-6 shadow-md md:p-8">
            <h2 className="mb-4 font-subtitle text-2xl font-semibold">6. Compromiso de Llegada y Cuidado del Vidrio</h2>
            <p className="mb-3 font-text text-sm leading-relaxed md:text-base">Embalamos cada frasco con protectores acolchados biodegradables diseñados para resistir el impacto del transporte.</p>
            <ul className="list-disc space-y-3 pl-5 font-text text-sm leading-relaxed md:text-base">
              <li><strong>Garantía de Reposición:</strong> Si por alguna eventualidad del transporte tu paquete sufriera daños o rotura durante el viaje, simplemente envianos una foto del paquete dentro de las <strong>primeras 24 horas de haberlo recibido</strong> por WhatsApp o a <Link href="mailto:hola@daluzconsciente.com" className="underline underline-offset-2">hola@daluzconsciente.com</Link>, y te reponemos la alquimia de inmediato sin costo adicional.</li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}

