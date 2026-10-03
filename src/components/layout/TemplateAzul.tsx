import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./TemplateAzul.module.css";

export interface TemplateAzulProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  quote?: string;
  children: ReactNode;
  buttonText: string;
  buttonLink: string;
}

/** Base layout for the individual Procesos and Sesiones Integrales pages. */
export default function TemplateAzul({
  kicker,
  title,
  subtitle,
  quote,
  children,
  buttonText,
  buttonLink,
}: TemplateAzulProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {kicker && <p className={styles.kicker}>{kicker}</p>}
          <h1 className={styles.title}>{title}</h1>
          <Image
            className={styles.divider}
            src="/svg/procesos/onda-titulo.svg"
            width={210}
            height={28}
            alt=""
            aria-hidden="true"
          />
          {quote && <blockquote className={styles.quote}>{quote}</blockquote>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <Link className={styles.button} href={buttonLink}>
            {buttonText}
          </Link>
        </div>
      </main>
    </div>
  );
}
