import type { Metadata } from 'next';
import TemplateBordo from '@/components/layout/TemplateBordo';
import MateriaPrimaExplorer from './MateriaPrimaExplorer';

export const metadata: Metadata = {
  title: { absolute: 'Bitácora de Materias Primas | Trazabilidad y Cosmética Viva Da Luz' },
  description: 'Vademécum completo de materias primas botánicas, biotecnológicas y lípidos puros. Conocé el origen de cada activo, en qué Alkimya vive y su guía de uso seguro.',
};

export default function MateriaPrimaPage() {
  return (
    <TemplateBordo
      heroTone="ivory"
      kicker="TRANSPARENCIA BOTÁNICA & TRAZABILIDAD MOLECULAR"
      title="La Anatomía de nuestras Fórmulas: Sin Secretos."
      introduction={<p>Creemos que la confianza no se impone: se demuestra con rigor biológico. Ponemos a tu disposición nuestras materias primas, su método de obtención declarado, su función en el cuidado, el producto Da Luz en el que habita y las precauciones de uso para una convivencia armónica con la cosmética viva.</p>}
      cta={{
        href: '/origen/saber-seguro',
        label: 'EXPLORAR SABER SEGURO →',
        title: 'Conocer la materia también es aprender a cuidarte.',
        description: <p>Profundizá en las pautas de conservación, fotosensibilidad y uso responsable para acompañar tu ritual.</p>,
      }}
    >
      <MateriaPrimaExplorer />
    </TemplateBordo>
  );
}
