'use client';

import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { BordoTable } from '@/components/layout/TemplateBordo';
import ingredients from './materia-prima.json';
import styles from './MateriaPrima.module.css';

const tabs = [
  'Plantas Medicinales & Minerales',
  'Activos Cosméticos & Biotecnología',
  'Lípidos Vegetales, Mantecas & Ceras',
];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
}

export default function MateriaPrimaExplorer() {
  const id = useId();
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState('');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    return ingredients.map(group => ({
      ...group,
      rows: group.rows.filter(row => {
        const text = normalize(row.join(' '));
        return words.every(word => text.includes(word));
      }),
    }));
  }, [query]);
  const counts = tabs.map((_, tab) => filtered.filter(group => group.tab === tab).reduce((sum, group) => sum + group.rows.length, 0));
  const activeGroups = filtered.filter(group => group.tab === activeTab && group.rows.length > 0);

  function selectTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % tabs.length; break;
      case 'ArrowLeft': next = (index + tabs.length - 1) % tabs.length; break;
      case 'Home': next = 0; break;
      case 'End': next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={styles.explorer}>
      <nav className={styles.navigation} aria-label="Navegación de la bitácora">
        <Link href="/alkimya/activos-origen">← Activos y Origen</Link>
        <Link href="/origen/saber-seguro">Consultar Saber Seguro →</Link>
      </nav>
      <div className={styles.filters}>
        <label htmlFor={`${id}-search`} className={styles.searchLabel}>Buscá el alma de tu fórmula</label>
        <div className={styles.searchField}>
          <Search size={20} aria-hidden="true" />
          <input
            id={`${id}-search`}
            ref={searchRef}
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar por planta, activo o necesidad (ej: Lavanda, Niacinamida, Acné, Barrera, Manchas)..."
            aria-describedby={`${id}-help`}
          />
          {query && <button type="button" onClick={() => { setQuery(''); searchRef.current?.focus(); }} aria-label="Limpiar búsqueda"><X size={18} aria-hidden="true" /></button>}
        </div>
        <p id={`${id}-help`} className={styles.help}>Buscá por ingrediente, función o Alkimya. El filtro se aplica a la pestaña que estás explorando; los contadores te muestran coincidencias en las demás.</p>
        <div className={styles.tabs} role="tablist" aria-label="Familias de materias primas" aria-orientation="horizontal">
          {tabs.map((tab, index) => <button
            key={tab}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={activeTab === index}
            tabIndex={activeTab === index ? 0 : -1}
            ref={element => { tabRefs.current[index] = element; }}
            onClick={() => setActiveTab(index)}
            onKeyDown={event => selectTab(event, index)}
          >{tab}<span className={styles.count}>{counts[index]}</span></button>)}
        </div>
        <p className={styles.resultCount} role="status" aria-live="polite" aria-atomic="true">{counts[activeTab]} {counts[activeTab] === 1 ? 'ingrediente' : 'ingredientes'}{query.trim() ? ` para «${query.trim()}»` : ' para explorar'} en {tabs[activeTab]}.</p>
      </div>

      {tabs.map((tab, index) => <div key={tab} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={activeTab !== index} tabIndex={0} className={styles.panel}>
        {activeTab === index && <>
          {index === 2 && <section className={styles.lipidGuide} aria-labelledby={`${id}-lipid-guide`}>
            <p className={styles.eyebrow}>Una mirada sobre los lípidos</p>
            <h2 id={`${id}-lipid-guide`}>Desmitificar los Aceites</h2>
            <p>Tu piel produce lípidos que acompañan su barrera protectora. Un aceite vegetal puede aportar emoliencia, pero su afinidad depende de la fórmula, la cantidad aplicada y tu piel. La escala comedogénica es orientativa: no predice con exactitud la respuesta de cada persona ni garantiza que un producto no genere brotes.</p>
            <dl className={styles.scale}>
              <div><dt>Grado 0 – 1</dt><dd>Potencial comedogénico bajo según la escala declarada. Evaluá la tolerancia individual.</dd></div>
              <div><dt>Grado 2</dt><dd>Potencial bajo. La cantidad y la fórmula completa también importan.</dd></div>
              <div><dt>Grado 3</dt><dd>Potencial medio. Moderá si tu piel tiene tendencia a brotes.</dd></div>
              <div><dt>Grado 4 – 5</dt><dd>Potencial alto. Texturas nutritivas para zonas secas según su etiqueta.</dd></div>
            </dl>
          </section>}
          <aside className={styles.safetyNote}>
            <strong>Conocer para cuidar.</strong> La tolerancia depende de la fórmula completa. Realizá una prueba de parche según su etiqueta; ante ardor o enrojecimiento persistente, suspendé y consultá. Para bebés, embarazo, lactancia o medicación crónica, revisá el uso con tu profesional de salud.
          </aside>
          {activeGroups.length === 0 ? <div className={styles.empty}>
            <h2>No encontramos coincidencias en esta familia.</h2>
            <p>Probá otro ingrediente o explorá las otras pestañas conservando tu búsqueda.</p>
            <button type="button" onClick={() => { setQuery(''); searchRef.current?.focus(); }}>Limpiar búsqueda</button>
          </div> : activeGroups.map(group => <section className={styles.group} key={group.id} aria-labelledby={`${id}-${group.id}`}>
            <h2 id={`${id}-${group.id}`}>{group.title}</h2>
            <p>{group.description}</p>
            <p className={styles.scrollHint}>Deslizá horizontalmente para explorar todas las columnas.</p>
            <BordoTable label={`Tabla de ${group.title}`}>
              <table>
                <caption className={styles.tableCaption}>{group.rows.length} {group.rows.length === 1 ? 'ingrediente' : 'ingredientes'} · {group.title}</caption>
                <thead><tr>{group.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
                <tbody>{group.rows.map(row => <tr key={row[0]}>{row.map((cell, cellIndex) => cellIndex === 0
                  ? <th scope="row" key={cellIndex}>{cell}</th>
                  : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </BordoTable>
          </section>)}
        </>}
      </div>)}
      <p className={styles.provenance}>Las Alkimyas, los orígenes y los grados de esta bitácora corresponden a la información declarada por Da Luz. Verificá siempre la composición y las indicaciones del envase que tenés en tus manos.</p>
    </div>
  );
}
