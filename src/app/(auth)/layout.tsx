import { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    /* ── ¡Magia acá! Cambiamos el fondo beige por el degradé en azules ── */
    <div className="min-h-screen bg-gradient-to-br from-[#051341] to-[#16345F]">
      <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* DA LUZ Brand Header */}
          <div className="text-center mb-5">
            <Link href="/" className="inline-block">
              {/* Pasamos el título a color hueso/blanco para que contraste con el fondo */}
              <h1 className="text-4xl font-display font-bold text-[#FFF2E9] mb-2 transition-opacity hover:opacity-80">
                DA LUZ CONSCIENTE
              </h1>
            </Link>
            {/* Pasamos la bajada al mismo color pero un poquito más suave */}
            <p className="text-[#FFF2E9]/80 text-sm font-text tracking-wide">
              Alkimyas para alma y cuerpo
            </p>
          </div>
          
          {/* Acá adentro se inyectan las hermosas tarjetas que armaste */}
          {children}
        </div>
      </div>
    </div>
  );
}