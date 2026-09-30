'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuButton,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import CartSidebar from "@/components/commerce/CartSidebar";
import ZenAnnouncementBar from "./ZenAnnouncementBar";
import { getAllPosts } from "@/lib/sanity/client";
import {
  Menu,
  User,
  LogOut,
  Settings,
  ShoppingBag,
  Heart,
  Package,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const DropdownVector = ({ src, color, label }: { src: string; color: string; label: string }) => (
  <span
    role="img"
    aria-label={label}
    className="mb-3 block h-16 w-16"
    style={{
      backgroundColor: color,
      maskImage: `url("${src}")`,
      WebkitMaskImage: `url("${src}")`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskPosition: "center",
      WebkitMaskPosition: "center",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
    }}
  />
);

// Component definitions con color dinámico y fondo blanco puro
const ListItem = ({
  href,
  title,
  children,
  textColor = "#051341", 
  singleLine = false,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
  textColor?: string;
  singleLine?: boolean;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md px-3 py-2.5 leading-none no-underline outline-none transition-all duration-150 hover:translate-x-1 hover:bg-[#FFF2E9]/70 focus-visible:bg-[#FFF2E9]/70"
        >
          <div
            className="text-[17px] font-subtitle font-medium leading-tight"
            style={{ color: textColor === "#72111A" ? "#4A0D10" : textColor, fontFamily: "var(--font-cormorant), serif" }}
          >
            {title}
          </div>
          <p
            className={`text-[11px] leading-snug ${singleLine ? "whitespace-nowrap" : ""}`}
            style={{ color: textColor === "#72111A" ? "#7D1D2B" : "#16345F", opacity: textColor === "#72111A" ? 0.8 : 0.75, fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

/* ===========================
   LÓGICA DE RUTAS Y COLORES
   =========================== */
const BORDO_ALKIMYA = "#72111A"; // Para Tienda y Alkimya
const AZUL_PROFUNDO = "#051341"; // Para Raíces, Procesos, FAQ, Legales, Landing y el resto
const featuredCardBackground = {
  backgroundColor: "#FFFFFF",
  backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.63), rgba(255, 255, 255, 0.63)), url(/svg/header/bgBlog.webp)",
  backgroundSize: "calc(100% + 36px) calc(100% + 36px)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

function HeaderNavControl({
  label,
  href,
  tone,
  isOpen,
  onHover,
}: {
  label: string;
  href: string | null;
  tone: "burgundy" | "blue";
  isOpen: boolean;
  onHover: () => void;
}) {
  const toneClass = tone === "burgundy"
    ? "hover:bg-[#72111A]/40"
    : "hover:bg-[#0085B1]/40";
  const openClass = isOpen
    ? tone === "burgundy" ? "bg-[#72111A]" : "bg-[#0085B1]"
    : "";

  return (
    <div
      className={`site-header-nav-control flex items-center rounded-md transition-colors duration-200 ${toneClass} ${openClass}`}
      onMouseEnter={onHover}
    >
      {href ? (
        <NavigationMenuLink asChild>
          <Link href={href} className="inline-flex h-9 items-center pl-3 pr-1 text-xs font-medium uppercase tracking-[0.18em] text-[#FFF2E9] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            {label}
          </Link>
        </NavigationMenuLink>
      ) : (
        <button type="button" onClick={onHover} aria-expanded={isOpen} className="inline-flex h-9 items-center pl-3 pr-1 text-xs font-medium uppercase tracking-[0.18em] text-[#FFF2E9] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          {label}
        </button>
      )}
      <NavigationMenuTrigger
        aria-label={`Abrir menú de ${label}`}
        className="h-9 w-6 rounded-none bg-transparent px-0 py-0 text-[#FFF2E9] shadow-none hover:!bg-transparent hover:!text-white focus:!bg-transparent focus:!text-white data-[state=open]:!bg-transparent data-[state=open]:!text-white"
      />
    </div>
  );
}

function MobileNavSection({
  id,
  label,
  href,
  tone,
  open,
  onToggle,
  onNavigate,
  children,
}: {
  id: string;
  label: string;
  href: string | null;
  tone: "burgundy" | "blue";
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className={`mb-2 mobile-nav-section mobile-nav-section--${tone}`}>
      <div
        className="flex items-center overflow-hidden rounded-lg shadow-sm"
        style={{ background: tone === "burgundy" ? "linear-gradient(135deg, #7D1D2B 0%, #4A0D10 100%)" : "linear-gradient(135deg, #16345F 0%, #005080 100%)" }}
      >
        {href ? (
          <Link
            href={href}
            onClick={onNavigate}
            className="flex min-h-11 min-w-0 flex-1 items-center px-3 py-2 font-sans text-xs font-medium uppercase tracking-[0.18em] text-[#FFF2E9] transition-colors hover:bg-white/10"
          >
            {label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={`mobile-nav-${id}`}
            className="flex min-h-11 min-w-0 flex-1 items-center px-3 py-2 text-left font-sans text-xs font-medium uppercase tracking-[0.18em] text-[#FFF2E9] transition-colors hover:bg-white/10"
          >
            {label}
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[#FFF2E9] transition-colors duration-150 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFF2E9]"
          aria-label={`${open ? "Cerrar" : "Abrir"} opciones de ${label}`}
          aria-expanded={open}
          aria-controls={`mobile-nav-${id}`}
        >
          <ChevronDown className={`h-5 w-5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <div id={`mobile-nav-${id}`} className={`my-2 ml-4 space-y-1 border-l pl-4 ${tone === "burgundy" ? "border-[#4A0D10]/20" : "border-[#16345F]/20"}`}>
          {children}
        </div>
      )}
    </section>
  );
}

import { useStoreCategories } from "@/hooks/useStoreCategories";

const isAlkimyaOrTiendaPage = (pathname: string) =>
  pathname === "/tienda" ||
  pathname === "/productos" ||
  pathname.startsWith("/productos/") ||
  pathname.startsWith("/categorias/") ||
  pathname.startsWith("/producto/") ||
  pathname === "/alkimya" ||
  pathname.startsWith("/alkimya/");

export default function Header() {
  const categories = useStoreCategories();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthContext();
  const { itemCount, toggleCart } = useCart();
  const { currentTheme, currentLine } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState("");

  const headerBg = isAlkimyaOrTiendaPage(pathname ?? "")
    ? BORDO_ALKIMYA
    : AZUL_PROFUNDO;

  useEffect(() => setOpenMenu(""), [pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{ backgroundColor: headerBg }}
      >
        <ZenAnnouncementBar />
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src="/svg/logo.svg"
                  alt="Isotipo Da Luz Consciente"
                  width={40}
                  height={40}
                  className="transition-transform duration-300 hover:scale-105"
                  style={{}}
                />
              </div>

              <span className="flex h-6 items-center overflow-hidden xl:h-7">
                <Image
                  src="/assets/logo-header-da-luz.png"
                  alt="Da Luz Consciente"
                  width={149}
                  height={40}
                  className="h-9 w-auto max-w-none object-contain xl:h-10"
                  unoptimized
                />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className={`site-header-nav hidden xl:flex ${openMenu === "blog" ? "site-header-nav--blog-open" : ""}`} value={openMenu} onValueChange={setOpenMenu}>
              <NavigationMenuList className="space-x-1">
                
                {/* 1. TIENDA (Bordó al abrir) */}
                <NavigationMenuItem value="tienda">
                  <HeaderNavControl label="Tienda" href="/productos" tone="burgundy" isOpen={openMenu === "tienda"} onHover={() => setOpenMenu("tienda")} />
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <ul className="grid w-[960px] grid-cols-[220px_repeat(2,minmax(0,1fr))] grid-rows-3 gap-2 p-4">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              ...featuredCardBackground,
                              minHeight: 220,
                            }}
                            href="/productos"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full bg-white/40 backdrop-blur-[2px]">
                              <DropdownVector src="/svg/header/Tienda%20Da%20luz.svg" color="#7D1D2B" label="Alkimya Da Luz" />
                              <div
                                className="text-xl font-medium uppercase tracking-[0.2em]"
                                style={{ color: "#4A0D10", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
                              >
                                TIENDA
                              </div>
                              <div
                                className="mb-2 text-xs font-medium uppercase tracking-[0.2em]"
                                style={{ color: "#7D1D2B", opacity: 0.8, fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                              >
                                Alkimya Da Luz
                              </div>
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: "#7D1D2B", opacity: 0.8, fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                              >
                                Explorá nuestras fórmulas botánicas vivas y rituales de cuidado consciente.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/categorias/linea-umbral" title="LÍNEA UMBRAL SENS" textColor="#72111A" singleLine>Nutrición dérmica, sérums y elixires faciales.</ListItem>
                      <ListItem href="/categorias/linea-ecos" title="LÍNEA ECOS" textColor="#72111A" singleLine>Limpieza consciente de rostro, cabello y cuerpo.</ListItem>
                      <ListItem href="/categorias/linea-alma-terra" title="LÍNEA ALMA TERRA" textColor="#72111A" singleLine>Aromaterapia, brumas herbales y calma.</ListItem>
                      <ListItem href="/categorias/linea-jade-ritual" title="LÍNEA JADE RITUAL" textColor="#72111A" singleLine>Fitoterapia viva, tinturas madre y extractos.</ListItem>
                      <ListItem href="/categorias/linea-prisma" title="LÍNEA PRISMA" textColor="#72111A" singleLine>Maquillaje de la tierra y pigmentos botánicos.</ListItem>
                      <ListItem href="/categorias/linea-kits-y-experiencia" title="KITS & CEREMONIAS" textColor="#72111A" singleLine>Sinergias integrales y rituales completos.</ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 2. ALKIMYA (Bordó al abrir) */}
                <NavigationMenuItem value="alkimya">
                  <HeaderNavControl label="Alkimya" href="/alkimya" tone="burgundy" isOpen={openMenu === "alkimya"} onHover={() => setOpenMenu("alkimya")} />
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              ...featuredCardBackground,
                              minHeight: 220,
                            }}
                            href="/alkimya"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full bg-white/40 backdrop-blur-[2px]">
                              <DropdownVector src="/svg/header/Tienda%20Da%20luz.svg" color="#7D1D2B" label="Isotipo Alkimya Da Luz" />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#4A0D10", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
                              >
                                MANIFIESTO
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#7D1D2B", opacity: 0.8 }}
                              >
                                El latido, la visión y la filosofía que inspiran cada fórmula.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="row-span-3">
                        <ul className="flex h-full flex-col justify-evenly list-none">
                        <ListItem href="/alkimya/activos-origen" title="Activos y Origen" textColor="#72111A">
                          Transparencia radical: la sinergia exacta entre botánica viva y biotecnología verde.
                        </ListItem>
                        <ListItem href="/alkimya/biotipos-doshas" title="Biotipos y Doshas" textColor="#72111A">
                          Reconocé tu bio-individualidad y elegí la alquimia que tu terreno necesita.
                        </ListItem>
                        <ListItem href="/alkimya/tu-ceremonia" title="Tu Ceremonia" textColor="#72111A">
                          Rituales conscientes para elevar tu cuidado diario.
                        </ListItem>
                        <ListItem href="/alkimya/tesoros-daluz" title="Tesoros Da Luz" textColor="#72111A">
                          Más que cosmética viva: explorá las herramientas digitales exclusivas que acompañan tu ritual.
                        </ListItem>
                        </ul>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. RAÍCES DA LUZ (Celeste al abrir) */}
                <NavigationMenuItem value="raices">
                  <HeaderNavControl label="Raíces Da Luz" href="/raices" tone="blue" isOpen={openMenu === "raices"} onHover={() => setOpenMenu("raices")} />
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              ...featuredCardBackground,
                              minHeight: 220,
                            }}
                            href="/raices"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full bg-white/40 backdrop-blur-[2px]">
                              <DropdownVector src="/svg/header/origen.svg" color="#0A1D4A" label="Vórtice solar" />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
                              >
                                ORIGEN ALQUÍMICO
                              </div>
                              <p
                                className="text-sm font-text font-medium leading-snug"
                                style={{ color: "#051341" }}
                              >
                                De la desconexión al goce: la historia vital que dio origen a nuestro universo.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              ...featuredCardBackground,
                              minHeight: 220,
                            }}
                            href="/filosofia-proposito"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/Filosofia%20y%20proposito.svg"
                                alt="Filosofía y Propósito"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
                              >
                                FILOSOFÍA Y PROPÓSITO
                              </div>
                              <p
                                className="text-sm font-text font-medium leading-snug"
                                style={{ color: "#051341" }}
                              >
                                El corazón de Da Luz: los cuatro pilares vivos que sostienen todo nuestro universo.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. PROCESOS (Celeste al abrir) */}
                <NavigationMenuItem value="procesos">
                  <HeaderNavControl label="Procesos" href="/servicios/procesos" tone="blue" isOpen={openMenu === "procesos"} onHover={() => setOpenMenu("procesos")} />
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              ...featuredCardBackground,
                              minHeight: 220,
                            }}
                            href="/servicios/procesos"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/Procesos%20holisticos.svg"
                                alt="Procesos Holísticos"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
                              >
                                PROCESOS
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#16345F", opacity: 0.75 }}
                              >
                                Acompañamiento profundo para tu evolución consciente.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="row-span-3">
                        <ul className="flex h-full flex-col justify-evenly list-none">
                        <ListItem href="/servicios/procesos/ciclos-alquimicos" title="Ciclos Alquímicos" textColor="#051341">
                          Caminos de transformación cíclica y profunda.
                        </ListItem>
                        <ListItem href="/servicios/procesos/sesiones-integrales" title="Sesiones Integrales" textColor="#051341">
                          Encuentros 1:1 para mapear, regular y transformar tu terreno biológico y emocional.
                        </ListItem>
                        </ul>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 5. BLOG (Celeste al abrir) */}
                <NavigationMenuItem value="blog">
                  <HeaderNavControl label="Blog" href="/blog" tone="blue" isOpen={openMenu === "blog"} onHover={() => setOpenMenu("blog")} />
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <ul className="w-[400px] max-w-[calc(100vw-2rem)] space-y-3 p-4">
                      <li className="flex min-h-[220px]">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/blog"
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              ...featuredCardBackground,
                              minHeight: 220,
                            }}
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full bg-white/40 backdrop-blur-[2px]">
                              <DropdownVector src="/assets/vectores/mandala-experiencias.svg" color="#0A1D4A" label="Mandala de múltiples pétalos" />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
                              >
                                BLOG
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#16345F", opacity: 0.75 }}
                              >
                                Nuestra bitácora de saberes botánicos, neurocosmética y evolución personal.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 6. EXPERIENCIAS (Celeste al abrir) */}
                <NavigationMenuItem value="experiencias">
                  <HeaderNavControl label="Experiencias" href={null} tone="blue" isOpen={openMenu === "experiencias"} onHover={() => setOpenMenu("experiencias")} />
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[680px]">
                      <div className="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-md" style={{ borderRadius: "0px 15px", ...featuredCardBackground }}>
                        <Image src="/svg/header/Programa7.svg" alt="" width={64} height={64} className="mb-3" unoptimized />
                        <div className="font-serif text-xl font-semibold leading-tight text-[#051341]">Portal de Experiencias</div>
                        <p className="mt-3 font-sans text-xs leading-relaxed text-[#16345F]/80">
                          Caminos vivos para habitar la soberanía de tu cuerpo y tu energía. Una mirada integral para acompañar el ritmo de tu biología.
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#16345F]/70">
                          Explorar todas las experiencias <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="mt-1 font-sans text-[10px] uppercase tracking-widest text-[#16345F]/60">Próximamente</span>
                      </div>
                      <ul className="flex flex-col justify-center gap-2 list-none">
                        <ListItem href="/programa-transformacion" title="Génesis | Tecnología del Ser" textColor="#051341">
                          El viaje de 8 meses hacia la soberanía biológica: transformá tu terreno y desprogramá el estrés de raíz.
                        </ListItem>
                        <ListItem href="/membresia" title="El Pulso | Membresía" textColor="#051341">
                          Tu mantenimiento de soberanía: sintonización mensual de tu eje biológico, contenidos vivos y beneficios en red.
                        </ListItem>
                        <li className="px-3 py-2.5" aria-label="Sintropía, próximamente">
                          <div className="font-subtitle text-base font-semibold leading-tight text-[#051341]">Sintropía | Recalibración</div>
                          <p className="mt-1 font-sans text-xs leading-relaxed text-[#16345F]/75">Intervención intensiva de 33 días: desactivá la señal de alarma interna y pasá del ruido al orden funcional.</p>
                          <span className="mt-1 block font-sans text-[10px] uppercase tracking-widest text-[#16345F]/60">Próximamente</span>
                        </li>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            {/* FAQ Link - Desktop */}
            <Link
              href="/faq"
              className="site-header-faq hidden xl:flex items-center px-3 py-2 text-sm lg:text-base hover:bg-white/10 transition-colors rounded-md shadow-none normal-case"
              style={{ color: "#FFF4E0", fontFamily: "var(--font-synthese), sans-serif", textShadow: "none" }}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              FAQ
            </Link>

            {/* User Menu / Auth Buttons - DESKTOP ONLY */}
            <div className="site-header-auth hidden xl:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-white/10"
                style={{ color: "#FFF4E0" }}
                onClick={toggleCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-white text-brand-primary text-xs font-bold"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:bg-white/10"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={profile?.avatar_url || ""}
                          alt="Avatar"
                        />
                        <AvatarFallback
                          className="text-brand-primary"
                          style={{ backgroundColor: "#FFF4E0" }}
                        >
                          {profile?.first_name?.charAt(0) ||
                            user.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="profile-avatar-menu w-56 border border-[#D1E3DD]/35 shadow-lg"
                    align="end"
                    style={{ background: "linear-gradient(135deg, #051341 0%, #16345F 50%, #005080 100%)" }}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p
                          className="text-sm font-subtitle font-medium leading-none"
                          style={{ color: "#FFF2E9" }}
                        >
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p
                          className="text-xs font-caption leading-none"
                          style={{ color: "#FFF2E9" }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <div className="h-px mx-2 my-1 bg-gradient-to-r from-transparent via-[#D1E3DD] to-transparent opacity-60" />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/perfil"
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4 text-[#D1E3DD]" />
                        <span className="font-text">Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/mis-pedidos"
                        className="flex items-center"
                      >
                        <Package className="mr-2 h-4 w-4 text-[#D1E3DD]" />
                        <span className="font-text">Mis Pedidos</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/mi-membresia"
                        className="flex items-center"
                      >
                        <BookOpen className="mr-2 h-4 w-4 text-[#D1E3DD]" />
                        <span className="font-text">Mi Membresía</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/configuracion"
                        className="flex items-center"
                      >
                        <Settings className="mr-2 h-4 w-4 text-[#D1E3DD]" />
                        <span className="font-text">Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    <div className="h-px mx-2 my-1 bg-gradient-to-r from-transparent via-[#D1E3DD] to-transparent opacity-60" />
                    <DropdownMenuItem
                      onSelect={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-[#D1E3DD]" />
                      <span className="font-text">Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="header-top-link relative hover:bg-white/10"
                    style={{ color: "#FFF4E0" }}
                    type="button"
                    onClick={() => router.push("/login")}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="header-top-link relative hover:bg-white/10"
                    style={{ color: "#FFF4E0" }}
                    type="button"
                    onClick={() => router.push("/signup")}
                  >
                    Registro
                  </Button>
                </div>
              )}
            </div>

            {/* MOBILE/TABLET MENU */}
            <div className="flex xl:hidden items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-white/10"
                style={{ color: "#FFF4E0" }}
                onClick={toggleCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-white text-brand-primary text-xs font-bold"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-white/10"
                    style={{ color: "#FFF4E0" }}
                    size="sm"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="mobile-nav-drawer w-[320px] sm:w-[400px] flex flex-col h-full [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:text-[#051341] [&>button]:opacity-100"
                  style={{ backgroundColor: "#fff4e0" }}
                >
                  <SheetHeader className="border-b border-[#16345F]/20 pb-4">
                    <SheetTitle
                      className="mobile-nav-title pr-9 text-left text-2xl font-medium"
                      style={{ color: "#051341" }}
                    >
                      Menú de Navegación
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    <nav className="mobile-nav-menu flex flex-col space-y-1 mt-6">
                      <MobileNavSection id="tienda" label="Tienda" href="/productos" tone="burgundy" open={openMobileSection === "tienda"} onToggle={() => setOpenMobileSection(openMobileSection === "tienda" ? null : "tienda")} onNavigate={() => setMobileMenuOpen(false)}>
                          <Link href="/productos" className="block py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#1C1B1A" }} onClick={() => setMobileMenuOpen(false)}>Todos los Productos</Link>
                          {categories.map((category) => (
                            <Link key={category.id} href={`/categorias/${encodeURIComponent(category.slug)}`} className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#1C1B1A" }} onClick={() => setMobileMenuOpen(false)}>{category.name}</Link>
                          ))}
                      </MobileNavSection>

                      <MobileNavSection id="alkimya" label="Alkimya" href="/alkimya" tone="burgundy" open={openMobileSection === "alkimya"} onToggle={() => setOpenMobileSection(openMobileSection === "alkimya" ? null : "alkimya")} onNavigate={() => setMobileMenuOpen(false)}>
                          <Link href="/alkimya" className="block py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#1C1B1A" }} onClick={() => setMobileMenuOpen(false)}>Manifiesto</Link>
                          <Link href="/alkimya/activos-origen" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#1C1B1A" }} onClick={() => setMobileMenuOpen(false)}>Activos y Origen</Link>
                          <Link href="/alkimya/biotipos-doshas" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#1C1B1A" }} onClick={() => setMobileMenuOpen(false)}>Biotipos y Doshas</Link>
                          <Link href="/alkimya/tu-ceremonia" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#1C1B1A" }} onClick={() => setMobileMenuOpen(false)}>Tu Ceremonia</Link>
                          <Link href="/alkimya/tesoros-daluz" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#1C1B1A" }} onClick={() => setMobileMenuOpen(false)}>Tesoros Da Luz</Link>
                      </MobileNavSection>

                      <MobileNavSection id="raices" label="Raíces Da Luz" href="/raices" tone="blue" open={openMobileSection === "raices"} onToggle={() => setOpenMobileSection(openMobileSection === "raices" ? null : "raices")} onNavigate={() => setMobileMenuOpen(false)}>
                          <Link href="/filosofia-proposito" className="block py-2 text-base font-text text-[#051341] hover:text-[#005080] transition-colors" onClick={() => setMobileMenuOpen(false)}>Filosofía y propósito</Link>
                          <Link href="/raices" className="block py-1 text-sm font-text text-[#051341] hover:text-[#005080] transition-colors opacity-80" onClick={() => setMobileMenuOpen(false)}>Raíces</Link>
                      </MobileNavSection>

                      <MobileNavSection id="procesos" label="Procesos" href="/servicios/procesos" tone="blue" open={openMobileSection === "procesos"} onToggle={() => setOpenMobileSection(openMobileSection === "procesos" ? null : "procesos")} onNavigate={() => setMobileMenuOpen(false)}>
                          <Link href="/servicios/procesos" className="block py-2 text-base font-text text-[#051341] hover:text-[#005080] transition-colors" onClick={() => setMobileMenuOpen(false)}>Procesos</Link>
                          <Link href="/servicios/procesos/ciclos-alquimicos" className="block py-1 text-sm font-text text-[#051341] hover:text-[#005080] transition-colors opacity-80" onClick={() => setMobileMenuOpen(false)}>Ciclos Alquímicos</Link>
                          <Link href="/servicios/procesos/sesiones-integrales" className="block py-1 text-sm font-text text-[#051341] hover:text-[#005080] transition-colors opacity-80" onClick={() => setMobileMenuOpen(false)}>Sesiones Integrales</Link>
                      </MobileNavSection>

                      <MobileNavSection id="blog" label="Blog" href="/blog" tone="blue" open={openMobileSection === "blog"} onToggle={() => setOpenMobileSection(openMobileSection === "blog" ? null : "blog")} onNavigate={() => setMobileMenuOpen(false)}>
                        <Link href="/blog" className="block" onClick={() => setMobileMenuOpen(false)}>Artículos y novedades</Link>
                      </MobileNavSection>

                      <MobileNavSection id="experiencias" label="Experiencias" href={null} tone="blue" open={openMobileSection === "experiencias"} onToggle={() => setOpenMobileSection(openMobileSection === "experiencias" ? null : "experiencias")} onNavigate={() => setMobileMenuOpen(false)}>
                          <span className="block px-3 py-2 text-xs font-semibold text-[#16345F]/70">Portal de Experiencias · Próximamente</span>
                          <Link href="/programa-transformacion" className="block rounded-md px-3 py-2 text-sm font-text text-[#051341] transition-colors hover:bg-[#FFF2E9]/70" onClick={() => setMobileMenuOpen(false)}>Génesis | Tecnología del Ser</Link>
                          <Link href="/membresia" className="block rounded-md px-3 py-2 text-sm font-text text-[#051341] transition-colors hover:bg-[#FFF2E9]/70" onClick={() => setMobileMenuOpen(false)}>El Pulso | Membresía</Link>
                          <span className="block px-3 py-2 text-sm font-text text-[#16345F]/70">Sintropía | Recalibración · Próximamente</span>
                      </MobileNavSection>

                      <div className="mb-4">
                        <Link href="/faq" className="flex items-center gap-3 py-2 text-base font-text text-[#051341] hover:text-[#005080] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          <HelpCircle className="h-5 w-5" />
                          Preguntas Frecuentes
                        </Link>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar />
    </>
  );
}
