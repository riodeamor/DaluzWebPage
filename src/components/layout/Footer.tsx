"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Heart,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { usePublicConfig } from "@/hooks/usePublicConfig";

const DEFAULT_CONTACT_EMAIL = "contacto@daluzconsciente.com";
const DEFAULT_PHONE = "+54 9 351 234-4580";
const DEFAULT_ADDRESS = "Córdoba, Argentina";
const DEFAULT_WHATSAPP = "5493512344580";
const DEFAULT_INSTAGRAM = "https://instagram.com/daluzconsciente";
const DEFAULT_FACEBOOK = "https://facebook.com/daluzconsciente";

const ALKIMYA_BG = "#72111A";
const ALKIMYA_BORDER = "#4A0D10";
const PROCESOS_BG = "#051341";
const PROCESOS_BORDER = "#16345F";
const RAICES_BG = "#0f3460";
const RAICES_BORDER = "#1a4a7a";
const FAQ_BG = "#005080";
const FAQ_BORDER = "#0085B1";

const isAlkimyaOrTiendaPage = (pathname: string) =>
  pathname === "/alkimya" ||
  pathname.startsWith("/alkimya/") ||
  pathname === "/productos" ||
  pathname.startsWith("/productos/") ||
  pathname.startsWith("/producto/") ||
  pathname.startsWith("/categorias/");

const isProcesosPage = (pathname: string) =>
  pathname === "/servicios/procesos" ||
  pathname.startsWith("/servicios/procesos/");

const isRaicesPage = (pathname: string) =>
  pathname === "/raices" || pathname === "/filosofia-proposito";

const isFaqPage = (pathname: string) =>
  pathname === "/faq" ||
  pathname === "/ayuda" ||
  pathname === "/politicas/envio" ||
  pathname === "/politicas/terminos" ||
  pathname === "/politicas/privacidad" ||
  pathname === "/politicas/arrepentimiento";

type FooterEntry = { name: string; href?: string };
type FooterSection = { title: string; links: FooterEntry[] };

const footerSections: FooterSection[] = [
  {
    title: "Botica",
    links: [
      { name: "Ver toda la tienda", href: "/productos" },
      { name: "Línea Umbral", href: "/categorias/linea-umbral" },
      { name: "Línea Ecos", href: "/categorias/linea-ecos" },
      { name: "Línea Alma Terra", href: "/categorias/linea-alma-terra" },
      { name: "Línea Jade Ritual", href: "/categorias/linea-jade-ritual" },
      { name: "Línea Prisma", href: "/categorias/linea-prisma" },
      { name: "Kits de Cuidado", href: "/categorias/kits-y-experiencia" },
    ],
  },
  {
    title: "Universo Da Luz",
    links: [
      { name: "Manifiesto Alkimyco", href: "/alkimya" },
      { name: "Filosofía y Propósito", href: "/filosofia-proposito" },
      { name: "Activos y Origen", href: "/alkimya/activos-origen" },
      { name: "Biotipos y Doshas", href: "/alkimya/biotipos-doshas" },
      { name: "Tu Ceremonia Diaria", href: "/alkimya/tu-ceremonia" },
      { name: "Tesoros Da Luz", href: "/alkimya/tesoros-daluz" },
      { name: "Origen Alquímico", href: "/raices" },
    ],
  },
  {
    title: "Experiencias",
    links: [
      { name: "Portal de Experiencias" },
      { name: "Génesis (8 meses)", href: "/programa-transformacion" },
      { name: "Sintropía (33 días)" },
      { name: "El Pulso (Membresía)", href: "/membresia" },
      { name: "Sesiones Integrales", href: "/servicios/procesos/sesiones-integrales" },
      { name: "Blog & Saberes Vivos", href: "/blog" },
    ],
  },
  {
    title: "Cuidado & Soporte",
    links: [
      { name: "Preguntas Frecuentes", href: "/faq" },
      { name: "Políticas de Envío", href: "/politicas/envio" },
      { name: "Mi Cuenta / Pedidos", href: "/mis-pedidos" },
      { name: "Términos y Condiciones", href: "/politicas/terminos" },
      { name: "Política de Privacidad", href: "/politicas/privacidad" },
    ],
  },
];

function FooterColumn({ section }: { section: FooterSection }) {
  return (
    <section className="min-w-0">
      <div role="heading" aria-level={3} className="mb-4 font-semibold uppercase text-[11px] leading-snug text-[#FFF2E9] lg:text-xs">
        {section.title}
      </div>
      <ul className="space-y-2.5">
        {section.links.map((entry) => (
          <li key={entry.name} className="min-w-0 text-xs leading-relaxed">
            {entry.href ? (
              <Link
                href={entry.href}
                className="block rounded px-1 py-0.5 text-[#FFF2E9]/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {entry.name}
              </Link>
            ) : (
              <span className="block px-1 py-0.5 text-[#FFF2E9]/65">
                {entry.name}
                <span className="block text-[10px] italic">Próximamente</span>
              </span>
            )}
          </li>
        ))}
      </ul>
      {section.title === "Cuidado & Soporte" && (
        <ArrepentimientoLink className="mt-4 hidden lg:inline-flex" />
      )}
    </section>
  );
}

function ArrepentimientoLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/politicas/arrepentimiento"
      className={"inline-flex items-center justify-center gap-2 rounded-md border border-[#FFF2E9]/40 px-3 py-1.5 text-xs text-[#FFF2E9] transition-colors hover:bg-[#FFF2E9]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF2E9] " + className}
    >
      <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
      Botón de Arrepentimiento
    </Link>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const { config: contactConfig } = usePublicConfig({
    keys: [
      "contact_email",
      "phone_number",
      "whatsapp_phone",
      "address",
      "city",
      "country",
      "social_instagram",
      "social_facebook",
      "social_whatsapp",
    ],
  });

  const contactEmail = contactConfig?.contact_email || DEFAULT_CONTACT_EMAIL;
  const contactPhone = contactConfig?.phone_number || DEFAULT_PHONE;
  const addressParts = [contactConfig?.address, contactConfig?.city, contactConfig?.country]
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
    .flatMap((value) => value.split(",").map((part) => part.trim()).filter(Boolean));
  const contactAddress = addressParts.length
    ? addressParts.filter((part, index) =>
        addressParts.findIndex((other) => other.toLocaleLowerCase("es") === part.toLocaleLowerCase("es")) === index,
      ).join(", ")
    : DEFAULT_ADDRESS;
  const socialInstagram = contactConfig?.social_instagram || DEFAULT_INSTAGRAM;
  const socialFacebook = contactConfig?.social_facebook || DEFAULT_FACEBOOK;
  const socialWhatsApp = String(
    contactConfig?.social_whatsapp || contactConfig?.whatsapp_phone || DEFAULT_WHATSAPP,
  );

  const isAlkimya = isAlkimyaOrTiendaPage(pathname ?? "");
  const footerBg = isAlkimya
    ? ALKIMYA_BG
    : isRaicesPage(pathname ?? "")
      ? RAICES_BG
      : isProcesosPage(pathname ?? "")
        ? PROCESOS_BG
        : isFaqPage(pathname ?? "")
          ? FAQ_BG
          : "#051341";
  const footerBorder = isAlkimya
    ? ALKIMYA_BORDER
    : isRaicesPage(pathname ?? "")
      ? RAICES_BORDER
      : isProcesosPage(pathname ?? "")
        ? PROCESOS_BORDER
        : isFaqPage(pathname ?? "")
          ? FAQ_BORDER
          : "#051341";

  return (
    <footer
      className="relative z-30 border-t text-[#FFF2E9]"
      style={{
        backgroundColor: footerBg,
        borderTopColor: footerBorder,
        borderTopWidth: "2px",
        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-5 pb-9 pt-12 sm:px-8 lg:px-10">
        <div className="grid gap-9 lg:grid-cols-[minmax(230px,1.35fr)_minmax(0,4fr)] lg:gap-7">
          <div className="min-w-0 text-center lg:text-left">
            <div
              role="heading"
              aria-level={2}
              className="text-2xl font-normal leading-tight"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
            >
              DA LUZ CONSCIENTE
            </div>
            <p className="mt-2 text-xs uppercase text-[#FFF2E9]/70">
              Alkimya Botánica y Experiencias Integrales
            </p>
            <p className="mx-auto mt-5 max-w-sm text-[13px] leading-relaxed text-[#FFF2E9]/80 lg:mx-0">
              Formulaciones botánicas vivas, rituales conscientes y experiencias de autoconocimiento. Un puente sensible entre la biología de tu piel y los ciclos de la naturaleza.
            </p>
            <div className="mt-6 space-y-3 text-sm text-[#FFF2E9]/85">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a href={"mailto:" + contactEmail} className="min-w-0 break-all hover:text-white">{contactEmail}</a>
              </div>
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a href={"tel:" + contactPhone.replace(/[^\d+]/g, "")} className="hover:text-white">{contactPhone}</a>
              </div>
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{contactAddress}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-3 lg:justify-start">
              <a href={socialInstagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF2E9]/10 text-[#FFF2E9] transition-colors hover:bg-[#005080] lg:h-10 lg:w-10">
                <Instagram className="footer-social-icon h-5 w-5" aria-hidden="true" />
              </a>
              <a href={"https://wa.me/" + socialWhatsApp.replace(/\s+/g, "")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF2E9]/10 text-[#FFF2E9] transition-colors hover:bg-[#005080] lg:h-10 lg:w-10">
                <MessageCircle className="footer-social-icon h-5 w-5" aria-hidden="true" />
              </a>
              <a href={socialFacebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF2E9]/10 text-[#FFF2E9] transition-colors hover:bg-[#005080] lg:h-10 lg:w-10">
                <Facebook className="footer-social-icon h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Enlaces del pie de página" className="grid min-w-0 grid-cols-2 gap-x-5 gap-y-9 border-t border-[#FFF2E9]/15 pt-8 lg:grid-cols-4 lg:gap-x-6 lg:border-0 lg:pt-0">
            {footerSections.map((section) => <FooterColumn key={section.title} section={section} />)}
          </nav>
        </div>
        <div className="mt-8 flex justify-center lg:hidden">
          <ArrepentimientoLink />
        </div>
      </div>

      <div className="border-t border-[#FFF2E9]/15">
        <div className="mx-auto grid max-w-[1600px] gap-5 px-5 py-6 text-center sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_auto] lg:items-start lg:gap-8 lg:px-10 lg:text-left">
          <div className="text-[11px] leading-relaxed text-[#FFF2E9]/75">
            <div>© {currentYear} DA LUZ CONSCIENTE · Todos los derechos reservados.</div>
            <div className="mt-2">Aviso: Fórmulas botánicas artesanales y rituales de bienestar consciente. No constituyen medicamentos ni reemplazan el diagnóstico o tratamiento médico profesional.</div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-[#FFF2E9]/85 lg:justify-start">
            <span className="inline-flex items-center gap-1"><Leaf className="h-3.5 w-3.5" aria-hidden="true" />100% Origen Vegetal</span>
            <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" aria-hidden="true" />Libre de Crueldad</span>
            <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />Fórmulas de Autora</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#FFF2E9]/85 lg:justify-end">
            <span>Aceptamos:</span>
            <span className="rounded-md border border-[#FFF2E9]/25 px-2 py-1">Mercado Pago</span>
            <span className="rounded-md border border-[#FFF2E9]/25 px-2 py-1">Transferencia bancaria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
