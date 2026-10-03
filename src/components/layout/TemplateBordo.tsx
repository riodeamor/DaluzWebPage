import type { ReactNode } from 'react';
import Link from 'next/link';
import styles from './TemplateBordo.module.css';

export interface TemplateBordoProps {
  kicker: string;
  title: string;
  /** First exact occurrence within title; absent words leave the title intact. */
  highlightedWord?: string;
  introduction?: ReactNode;
  quote?: ReactNode;
  heroTone?: 'bordo' | 'ivory';
  ctaTone?: 'ivory' | 'gold';
  children: ReactNode;
  cta?: {
    href: string;
    label: string;
    title?: string;
    description?: ReactNode;
  };
}

/** Server-rendered editorial shell; interactive content can be passed as children. */
export default function TemplateBordo({
  kicker, title, highlightedWord, introduction, quote, children, cta,
  heroTone = 'bordo', ctaTone = 'ivory',
}: TemplateBordoProps) {
  const highlightIndex = highlightedWord ? title.indexOf(highlightedWord) : -1;

  return (
    <div className={styles.page}>
      <header className={`${styles.hero} ${heroTone === 'ivory' ? styles.heroIvory : ''}`}>
        <div className={styles.heroInner}>
          <span className={styles.isotype} aria-hidden="true" />
          <p className={styles.kicker}>{kicker}</p>
          <h1 className={styles.title}>
            {highlightedWord && highlightIndex >= 0 ? <>
              {title.slice(0, highlightIndex)}
              <span>{highlightedWord}</span>
              {title.slice(highlightIndex + highlightedWord.length)}
            </> : title}
          </h1>
          <span className={styles.divider} aria-hidden="true" />
          {introduction && <div className={styles.introduction}>{introduction}</div>}
          {quote && <blockquote className={styles.quote}>{quote}</blockquote>}
        </div>
      </header>
      <div className={styles.content}>{children}</div>
      {cta && <footer className={styles.footer}>
        {cta.title && <h2>{cta.title}</h2>}
        {cta.description && <div className={styles.ctaDescription}>{cta.description}</div>}
        <Link href={cta.href} className={`${styles.button} ${ctaTone === 'gold' ? styles.buttonGold : ''}`}>{cta.label}</Link>
      </footer>}
    </div>
  );
}

export function BordoSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className={styles.section}><h2>{title}</h2>{children}</section>;
}

export function BordoGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}

export function BordoCard({ title, children }: { title: string; children: ReactNode }) {
  return <article className={styles.card}><h3>{title}</h3>{children}</article>;
}

export function BordoCallout({ title, children }: { title: string; children: ReactNode }) {
  return <aside className={styles.callout}><h3>{title}</h3>{children}</aside>;
}

/** Pass a semantic table including caption, thead and scoped column headers. */
export function BordoTable({ label, children }: { label: string; children: ReactNode }) {
  return <div className={styles.tableScroll} role="region" aria-label={label} tabIndex={0}>{children}</div>;
}
