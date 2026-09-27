"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { usePublicConfig } from "@/hooks/usePublicConfig";

// Default values as fallbacks (used until config is loaded or if not set in DB)
const DEFAULT_CONTACT_EMAIL = "contacto@daluzconsciente.com";
const DEFAULT_PHONE = "+54 9 351 234-4580";
const DEFAULT_ADDRESS = "Córdoba, Argentina";
const DEFAULT_WHATSAPP = "5493512344580";
const DEFAULT_INSTAGRAM = "https://instagram.com/daluzconsciente";
const DEFAULT_FACEBOOK = "https://facebook.com/daluzconsciente";

/* Alkimya y Tienda comparten el bordó del encabezado. */
const ALKIMYA_BG = "#72111A";
const ALKIMYA_BORDER = "#4A0D10";
const isAlkimyaOrTiendaPage = (pathname: string) =>
  pathname === "/alkimya" ||
  pathname.startsWith("/alkimya/") ||
  pathname === "/productos" ||
  pathname.startsWith("/productos/") ||
  pathname.startsWith("/producto/") ||
  pathname.startsWith("/categorias/");

/* Procesos pages: green theme matching page background */
const PROCESOS_BG = "#051341";
const PROCESOS_BORDER = "#16345F";
const isProcesosPage = (pathname: string) =>
  pathname === "/servicios/procesos" ||
  pathname.startsWith("/servicios/procesos/");

/* Raíces & Filosofía pages: blue theme */
const RAICES_BG = "#0f3460";
const RAICES_BORDER = "#1a4a7a";
const isRaicesPage = (pathname: string) =>
  pathname === "/raices" || pathname === "/filosofia-proposito";

/* FAQ, Ayuda y Envíos: enlaza con el final del degradado azul de la página */
const FAQ_BG = "#005080";
const FAQ_BORDER = "#0085B1";
const isFaqPage = (pathname: string) =>
  pathname === "/faq" ||
  pathname === "/ayuda" ||
  pathname === "/politicas/envio" ||
  pathname === "/politicas/terminos" ||
  pathname === "/politicas/privacidad" ||
  pathname === "/politicas/arrepentimiento";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
  Heart,
  Leaf,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Fetch public contact config from system_config table
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

  // Derive contact values from config with fallbacks
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

  // Social media from config (ensure string type for phone numbers)
  const socialInstagram = contactConfig?.social_instagram || DEFAULT_INSTAGRAM;
  const socialFacebook = contactConfig?.social_facebook || DEFAULT_FACEBOOK;
  const socialWhatsApp = String(
    contactConfig?.social_whatsapp || contactConfig?.whatsapp_phone || DEFAULT_WHATSAPP,
  );

  const footerBg = isAlkimyaOrTiendaPage(pathname ?? "")
    ? ALKIMYA_BG
    : isRaicesPage(pathname ?? "")
    ? RAICES_BG
    : isProcesosPage(pathname ?? "")
      ? PROCESOS_BG
      : isFaqPage(pathname ?? "")
        ? FAQ_BG
        : "#051341";
  const footerBorder = isAlkimyaOrTiendaPage(pathname ?? "")
    ? ALKIMYA_BORDER
    : isRaicesPage(pathname ?? "")
    ? RAICES_BORDER
    : isProcesosPage(pathname ?? "")
      ? PROCESOS_BORDER
      : isFaqPage(pathname ?? "")
        ? FAQ_BORDER
        : "#051341";

  const footerSections = [
    {
      title: "Botica",
      links: [
        { name: "Ver toda la tienda", href: "/productos" },
        { name: "Línea Umbral", href: "/categorias/linea-umbral" },
        { name: "Línea Ecos", href: "/categorias/linea-ecos" },
        { name: "Línea Alma Terra", href: "/categorias/linea-alma-terra" },
        { name: "Línea Jade Ritual", href: "/categorias/linea-jade-ritual" },
        { name: "Línea Prisma", href: "/categorias/linea-prisma" },
        { name: "Kits y Experiencia", href: "/categorias/kits-y-experiencia" },
      ],
    },
    {
      title: "Procesos",
      links: [
        { name: "Ciclos Alquímicos", href: "/servicios/procesos/ciclos-alquimicos" },
        { name: "Génesis", href: "/servicios/procesos/ciclos-alquimicos#ciclos-genesis-title" },
        { name: "Metamorfosis", href: "/servicios/procesos/ciclos-alquimicos#ciclos-metamorfosis-title" },
        { name: "Oasis", href: "/servicios/procesos/ciclos-alquimicos#ciclos-oasis-title" },
        { name: "Sesiones Integrales", href: "/servicios/procesos/sesiones-integrales" },
      ],
    },
    {
      title: "Experiencias",
      links: [
        { name: "Programa de 7 Meses", href: "/programa-transformacion" },
        { name: "Mi Membresía", href: "/mi-membresia" },
        { name: "Blog y Saberes", href: "/blog" },
      ],
    },
    {
      title: "Cuidado y soporte",
      links: [
        { name: "Centro de Ayuda", href: "/ayuda" },
        { name: "Preguntas Frecuentes", href: "/faq" },
        { name: "Políticas de Envío", href: "/politicas/envio" },
        { name: "Mi Perfil", href: "/perfil" },
        { name: "Términos y Condiciones", href: "/politicas/terminos" },
        { name: "Política de Privacidad", href: "/politicas/privacidad" },
        {
          name: "Botón de Arrepentimiento",
          href: "/politicas/arrepentimiento",
          isSpecial: true,
        },
      ],
    },
  ];

  return (
    <footer
      className="border-t transition-all duration-300 z-30"
      style={{
        backgroundColor: footerBg,
        borderTopColor: footerBorder,
        borderTopWidth: "2px",
        borderTopStyle: "solid",
      }}
    >
      {/* 📱 MOBILE FOOTER - Simplified Design */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-6 py-8 min-w-0 z-30">
          {/* Brand Section - Mobile */}
          <div className="text-center space-y-4 mb-8">
            <h3
              className="text-xl font-display font-normal"
              style={{ color: "#FFFFFF" }}
            >
              DA LUZ CONSCIENTE
            </h3>
            <div
              className="text-xs font-caption"
              style={{ color: "#FFFFFF", opacity: 0.8 }}
            >
              Alkimya Botánica y Experiencias Integrales
            </div>
          </div>

          {/* Contact Info - Mobile Optimized */}
          <div className="space-y-4 mb-8">
            <h4
              className="font-title font-medium text-center text-lg"
              style={{ color: "#FFFFFF" }}
            >
              Contacto
            </h4>
            <div
              className="space-y-4 font-text"
              style={{ color: "#FFFFFF", opacity: 0.9 }}
            >
              {/* Email */}
              <div className="flex items-center justify-center gap-2">
                <Mail
                  className="h-4 w-4 flex-shrink-0 lucide"
                  style={{ color: "#FFF2E9" }}
                />
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm hover:text-white transition-colors duration-300"
                  style={{ wordBreak: "normal", overflowWrap: "break-word" }}
                >
                  {contactEmail}
                </a>
              </div>
              {/* Phone / WhatsApp */}
              <div className="flex items-center justify-center gap-2">
                <Phone
                  className="h-4 w-4 flex-shrink-0 lucide"
                  style={{ color: "#FFF2E9" }}
                />
                <a
                  href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  {contactPhone}
                </a>
              </div>
              {/* Address */}
              <div className="flex items-center justify-center gap-2">
                <MapPin
                  className="h-4 w-4 flex-shrink-0 lucide"
                  style={{ color: "#FFF2E9" }}
                />
                <span className="text-sm">
                  {contactAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Social Media - Mobile */}
          <div className="flex justify-center gap-6 mb-8">
            <a
              href={socialInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-[#005080] transition-colors duration-300"
              style={{ color: "#FFFFFF" }}
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 lucide" />
            </a>
            <a
              href={socialFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-[#005080] transition-colors duration-300"
              style={{ color: "#FFFFFF" }}
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 lucide" />
            </a>
            <a
              href={`https://wa.me/${socialWhatsApp.replace(/\s+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-[#005080] transition-colors duration-300"
              style={{ color: "#FFFFFF" }}
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5 lucide" />
            </a>
          </div>

          {/* Quick Links - Mobile Simplified */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-center">
            <div>
              <h4
                className="font-title font-medium mb-3 text-sm"
                style={{ color: "#FFFFFF" }}
              >
                Botica
              </h4>
              <div className="space-y-2">
                <Link
                  href="/productos"
                  className="block text-xs font-text"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  Ver toda la tienda
                </Link>
                <Link
                  href="/categorias/kits-y-experiencia"
                  className="block text-xs font-text"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  Kits y Experiencia
                </Link>
              </div>
            </div>
            <div>
              <h4
                className="font-title font-medium mb-3 text-sm"
                style={{ color: "#FFFFFF" }}
              >
                Experiencias
              </h4>
              <div className="space-y-2">
                <Link
                  href="/programa-transformacion"
                  className="block text-xs font-text"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  Programa de 7 Meses
                </Link>
                <Link
                  href="/servicios/procesos/sesiones-integrales"
                  className="block text-xs font-text"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  Sesiones Integrales
                </Link>
              </div>
            </div>
          </div>

          {/* Values - Mobile */}
          <div
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6 font-caption"
            style={{ color: "#FFFFFF", opacity: 0.9 }}
          >
            <div className="flex items-center space-x-1">
              <Leaf className="h-3 w-3 lucide" style={{ color: "#FFF2E9" }} />
              <span className="whitespace-nowrap text-xs">100% Origen Vegetal</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3 lucide" style={{ color: "#FFF2E9" }} />
              <span className="whitespace-nowrap text-xs">Libre de Crueldad</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles
                className="h-3 w-3 lucide"
                style={{ color: "#FFF2E9" }}
              />
              <span className="whitespace-nowrap text-xs">Fórmulas de Autora</span>
            </div>
          </div>

          {/* Copyright - Mobile */}
          <div
            className="text-center text-xs font-text pt-4 border-t border-white/20"
            style={{ color: "#FFFFFF", opacity: 0.8 }}
          >
            <div>© {currentYear} DA LUZ CONSCIENTE</div>
            <div className="mt-1">Todos los derechos reservados</div>
            <p className="mx-auto mt-3 max-w-sm font-sans !text-[11px] leading-relaxed">Aviso: Fórmulas botánicas artesanales y rituales de bienestar consciente. No constituyen medicamentos ni reemplazan el diagnóstico o tratamiento médico profesional.</p>
          </div>
        </div>
      </div>

      {/* 💻 DESKTOP FOOTER - Full Design */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <h3
                  className="text-2xl font-display font-normal"
                  style={{ color: "#FFFFFF" }}
                >
                  DA LUZ CONSCIENTE
                </h3>
                <div
                  className="text-xs font-caption"
                  style={{ color: "#FFFFFF", opacity: 0.8 }}
                >
                  Alkimya Botánica y Experiencias Integrales
                </div>
              </div>

              <p
                className="text-sm font-text leading-relaxed"
                style={{ color: "#FFFFFF", opacity: 0.9 }}
              >
                Formulaciones botánicas vivas, rituales conscientes y experiencias
                de autoconocimiento. Un puente sensible entre la biología de tu piel
                y los ciclos de la naturaleza.
              </p>

              {/* Contact Info */}
              <div
                className="space-y-2 text-sm font-text"
                style={{ color: "#FFFFFF", opacity: 0.9 }}
              >
                <div className="flex items-center gap-2">
                  <Mail
                    className="h-4 w-4 lucide"
                    style={{ color: "#FFF2E9" }}
                  />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="transition-colors duration-300 hover:bg-white/10 hover:text-white px-2 py-1 rounded"
                  >
                    {contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone
                    className="h-4 w-4 lucide"
                    style={{ color: "#FFF2E9" }}
                  />
                  <a
                    href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                    className="transition-colors duration-300 hover:bg-white/10 hover:text-white px-2 py-1 rounded"
                  >
                    {contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin
                    className="h-4 w-4 lucide"
                    style={{ color: "#FFF2E9" }}
                  />
                  <span>{contactAddress}</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex gap-4">
                <a
                  href={socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#005080] transition-colors duration-300"
                  style={{ color: "#FFFFFF" }}
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 lucide" />
                </a>
                <a
                  href={socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#005080] transition-colors duration-300"
                  style={{ color: "#FFFFFF" }}
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 lucide" />
                </a>
                <a
                  href={`https://wa.me/${socialWhatsApp.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#005080] transition-colors duration-300"
                  style={{ color: "#FFFFFF" }}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 lucide" />
                </a>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4
                  className="font-title font-medium"
                  style={{ color: "#FFFFFF" }}
                >
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {(link as any).isSpecial ? (
                        <Link
                          href={link.href as any}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:scale-105 hover:shadow-lg"
                          style={{
                            backgroundColor: "#F59E0B",
                            color: "#1c1b1a",
                            boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
                          }}
                        >
                          <ShieldCheck className="h-4 w-4" aria-hidden="true" /> {link.name}
                        </Link>
                      ) : (
                        <Link
                          href={link.href as any}
                          className="text-sm font-text transition-colors duration-300 block px-2 py-1 rounded hover:bg-white/10 hover:text-white"
                          style={{ color: "#FFFFFF", opacity: 0.9 }}
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px mx-4 my-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />

        {/* Bottom Footer */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div
                className="flex items-center space-x-4 text-sm font-text"
                style={{ color: "#FFFFFF", opacity: 0.8 }}
              >
                <span>© {currentYear} DA LUZ CONSCIENTE</span>
                <span>•</span>
                <span>Todos los derechos reservados</span>
              </div>
              {/* Aviso Legal / Disclaimer */}
              <p
                className="text-xs font-text"
                style={{ color: "#FFFFFF", opacity: 0.6, maxWidth: "600px" }}
              >
                Aviso: Fórmulas botánicas artesanales y rituales de bienestar consciente.
                No constituyen medicamentos ni reemplazan el diagnóstico o tratamiento médico profesional.
              </p>
            </div>

            {/* Values Icons */}
            <div
              className="flex items-center space-x-6 font-caption"
              style={{ color: "#FFFFFF", opacity: 0.9 }}
            >
              <div className="flex items-center space-x-1 text-xs">
                <Leaf className="h-4 w-4 lucide" style={{ color: "#FFF2E9" }} />
                <span>100% Origen Vegetal</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <Heart
                  className="h-4 w-4 lucide"
                  style={{ color: "#FFF2E9" }}
                />
                <span>Libre de Crueldad</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <Sparkles
                  className="h-4 w-4 lucide"
                  style={{ color: "#FFF2E9" }}
                />
                <span>Fórmulas de Autora</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div
              className="flex items-center space-x-2 text-xs font-caption"
              style={{ color: "#FFFFFF", opacity: 0.9 }}
            >
              <span>Aceptamos:</span>
              <Badge
                variant="outline"
                className="text-xs border-white/30 text-white/90 hover:bg-white/10 transition-all duration-300"
              >
                Mercado Pago
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-white/30 text-white/90 hover:bg-white/10 transition-all duration-300"
              >
                Transferencia bancaria
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
