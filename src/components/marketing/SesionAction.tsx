import Link from "next/link";
import styles from "./SesionAction.module.css";

/** First call to action below the session's hero. The closing CTA lives in TemplateAzul. */
export default function SesionAction({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note?: string;
}) {
  return (
    <div className={styles.action}>
      <Link href={href} className={styles.button}>
        {label}
      </Link>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
