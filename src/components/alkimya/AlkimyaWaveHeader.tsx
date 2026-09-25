import type { ReactNode } from 'react';

type AlkimyaWaveHeaderProps = { title: string; children?: ReactNode };

export default function AlkimyaWaveHeader({ title, children }: AlkimyaWaveHeaderProps) {
  return (
    <header className="alkimya-wave-header">
      <div className="alkimya-wave-header__shape" aria-hidden="true" />
      <div className="alkimya-wave-header__content">
        <h1>{title.toLocaleLowerCase('es')}</h1>
        {children}
      </div>
    </header>
  );
}
