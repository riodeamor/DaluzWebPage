import styles from "./ProcesosContent.module.css";

export function ProcesosBadges({ items }: { items: string[] }) {
  return (
    <ul
      className={styles.badges}
      aria-label="Características del acompañamiento"
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ProcesosTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <div
      className={styles.tableRegion}
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table className={styles.table}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th scope="row" key={cellIndex}>
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProcesosQuote({
  text,
  attribution,
}: {
  text: string;
  attribution?: string;
}) {
  return (
    <figure className={styles.quote}>
      <blockquote>{text}</blockquote>
      {attribution && <figcaption>— {attribution}</figcaption>}
    </figure>
  );
}
