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
} from "lucide-react";

// Blog post interface
interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
}

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
  fullDescription = false,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
  textColor?: string;
  fullDescription?: boolean;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
        >
          <div
            className="text-sm font-subtitle font-medium leading-none"
            style={{ color: textColor === "#72111A" ? "#4A0D10" : textColor, fontFamily: "var(--font-cormorant), serif" }}
          >
            {title}
          </div>
          <p
            className={fullDescription ? "text-xs font-text leading-relaxed" : "line-clamp-2 text-sm font-text leading-snug"}
            style={{ color: textColor === "#72111A" ? "#7D1D2B" : "#16345F", opacity: textColor === "#72111A" ? 0.8 : 0.75 }}
          >
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

const BlogListItem = ({
  href,
  title,
  subtitle,
  textColor = "#051341",
}: {
  href: string;
  title: string;
  subtitle: string;
  textColor?: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
        >
          <div
            className="text-sm font-subtitle font-medium leading-none"
            style={{ color: textColor, fontFamily: "var(--font-cormorant), serif" }}
          >
            {title}
          </div>
          <p
            className="line-clamp-2 text-sm font-text leading-snug"
            style={{ color: "#16345F", opacity: 0.75 }}
          >
            {subtitle}
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

const isAlkimyaOrTiendaPage = (pathname: string) =>
  pathname === "/productos" ||
  pathname.startsWith("/productos/") ||
  pathname.startsWith("/categorias/") ||
  pathname.startsWith("/producto/") ||
  pathname === "/alkimya" ||
  pathname.startsWith("/alkimya/");

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthContext();
  const { itemCount, toggleCart } = useCart();
  const { currentTheme, currentLine } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  const headerBg = isAlkimyaOrTiendaPage(pathname ?? "")
    ? BORDO_ALKIMYA
    : AZUL_PROFUNDO;

  // Fetch latest blog posts
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch("/api/blog/latest?limit=2", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setLatestPosts(data.posts || []);
        } else {
          console.error("Error fetching latest posts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      }
    };

    fetchLatestPosts();
    const interval = setInterval(fetchLatestPosts, 60000);
    return () => clearInterval(interval);
  }, []);

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
            <NavigationMenu className="header-main-nav hidden xl:flex">
              <NavigationMenuList className="space-x-1">
                
                {/* 1. TIENDA (Bordó al abrir) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent hover:!bg-[#72111A]/40 focus:!bg-[#72111A] data-[active]:!bg-[#72111A] data-[state=open]:!bg-[#72111A] text-base lg:text-lg px-3 py-1.5 normal-case tracking-wide shadow-none transition-colors duration-200"
                    style={{ color: "#FFF4E0", fontFamily: "var(--font-synthese), sans-serif", textShadow: "none" }}
                  >
                    Tienda
                  </NavigationMenuTrigger>
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
                              backgroundColor: "#FFFFFF",
                              backgroundImage: "url(/svg/header/bgtiendadaluz.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
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
                      <ListItem href="/categorias/linea-umbral" title="LINEA UMBRAL" textColor="#72111A">
                        Tonicos, Cremas faciales y corporales, Serums
                      </ListItem>
                      <ListItem href="/categorias/linea-ecos" title="LINEA ECOS" textColor="#72111A">
                        Shampoo´s, Acondicionador, Pasta dental, Limpiadores Faciales, Mascarillas
                      </ListItem>
                      <ListItem href="/categorias/linea-alma-terra" title="LINEA ALMA TERRA" textColor="#72111A">
                        Brumas aromáticas en Spray, Pocimas Roll-On de aromaterapia
                      </ListItem>
                    </ul>
                    <ul className="grid grid-cols-2 gap-3 p-4 pt-0 md:w-[500px] lg:w-[600px]">
                      <ListItem href="/categorias/linea-jade-ritual" title="LINEA JADE RITUAL" textColor="#72111A">
                        Tinturas Madre para desequilibrios organicos, Flores de Bach
                      </ListItem>
                      <ListItem href="/categorias/linea-prisma" title="LINEA PRISMA" textColor="#72111A">
                        Sombras en polvo, Barra labial, Iluminadores
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 2. ALKIMYA (Bordó al abrir) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent hover:!bg-[#72111A]/40 focus:!bg-[#72111A] data-[active]:!bg-[#72111A] data-[state=open]:!bg-[#72111A] text-sm lg:text-base px-3 py-1.5 normal-case tracking-wide shadow-none transition-colors duration-200"
                    style={{ color: "#FFF4E0", fontFamily: "var(--font-synthese), sans-serif", textShadow: "none" }}
                  >
                    Alkimya
                  </NavigationMenuTrigger>
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
                              backgroundColor: "#FFFFFF",
                              backgroundImage: "url(/svg/header/bg%20manifiesto.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
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
                                Nuestra visión y propósito fundamental.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="row-span-3 flex flex-col justify-evenly">
                        <ListItem href="/alkimya/activos-origen" title="Activos y Origen" textColor="#72111A">
                          Ingredientes naturales y su procedencia
                        </ListItem>
                        <ListItem href="/alkimya/biotipos-doshas" title="Biotipos y Doshas" textColor="#72111A">
                          Personalización según tu naturaleza
                        </ListItem>
                        <ListItem href="/alkimya/tu-ceremonia" title="Tu Ceremonia" textColor="#72111A">
                          Rituales y ceremonias personalizadas
                        </ListItem>
                        <ListItem href="/alkimya/tesoros-daluz" title="Tesoros Da Luz" textColor="#72111A">
                          Productos especiales y exclusivos
                        </ListItem>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. RAÍCES DA LUZ (Celeste al abrir) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent hover:!bg-[#0085B1]/40 focus:!bg-[#0085B1] data-[active]:!bg-[#0085B1] data-[state=open]:!bg-[#0085B1] text-sm lg:text-base px-3 py-1.5 normal-case tracking-wide shadow-none transition-colors duration-200"
                    style={{ color: "#FFF4E0", fontFamily: "var(--font-synthese), sans-serif", textShadow: "none" }}
                  >
                    Raíces Da Luz
                  </NavigationMenuTrigger>
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
                              backgroundColor: "#FFFFFF",
                              backgroundImage: "url(/svg/header/bg%20origen.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
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
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#16345F", opacity: 0.75 }}
                              >
                                De la sombra a la alkimia: el viaje.
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
                              backgroundColor: "#FFFFFF",
                              backgroundImage: "url(/svg/header/bg%20filosofia%20y%20rpoposito.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/filosofia-proposito"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full bg-white/40 backdrop-blur-[2px]">
                              <DropdownVector src="/svg/logo.svg" color="#0A1D4A" label="Isotipo Da Luz Consciente" />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
                              >
                                FILOSOFÍA Y PROPÓSITO
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#16345F", opacity: 0.75 }}
                              >
                                Nuestra visión y valores.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. PROCESOS (Celeste al abrir) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent hover:!bg-[#0085B1]/40 focus:!bg-[#0085B1] data-[active]:!bg-[#0085B1] data-[state=open]:!bg-[#0085B1] text-sm lg:text-base px-3 py-1.5 normal-case tracking-wide shadow-none transition-colors duration-200"
                    style={{ color: "#FFF4E0", fontFamily: "var(--font-synthese), sans-serif", textShadow: "none" }}
                  >
                    Procesos
                  </NavigationMenuTrigger>
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
                              backgroundColor: "#FFFFFF",
                              backgroundImage: "url(/svg/header/bg%20procesos%20holisticos.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/servicios/procesos"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full bg-white/40 backdrop-blur-[2px]">
                              <DropdownVector src="/svg/header/Procesos%20holisticos.svg" color="#0A1D4A" label="Procesos holísticos" />
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
                                Terapias para el bienestar integral.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="row-span-3 flex flex-col justify-evenly">
                        <ListItem href="/servicios/procesos/ciclos-alquimicos" title="Ciclos Alquímicos" textColor="#051341">
                          Procesos transformadores cíclicos
                        </ListItem>
                        <ListItem href="/servicios/procesos/sesiones-integrales" title="Sesiones Integrales" textColor="#051341">
                          Sesiones holísticas personalizadas
                        </ListItem>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 5. BLOG (Celeste al abrir) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent hover:!bg-[#0085B1]/40 focus:!bg-[#0085B1] data-[active]:!bg-[#0085B1] data-[state=open]:!bg-[#0085B1] text-sm lg:text-base px-3 py-1.5 normal-case tracking-wide shadow-none transition-colors duration-200"
                    style={{ color: "#FFF4E0", fontFamily: "var(--font-synthese), sans-serif", textShadow: "none" }}
                  >
                    Blog
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/blog"
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#FFFFFF",
                              backgroundImage: "url(/svg/header/bgBlog.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
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
                                Lee nuestras últimas publicaciones.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {latestPosts.map((post) => (
                        <BlogListItem
                          key={post._id}
                          href={`/blog/${post.slug.current}`}
                          title={post.title}
                          subtitle={
                            post.excerpt ||
                            `Artículo publicado el ${new Date(
                              post.publishedAt,
                            ).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}`
                          }
                          textColor="#051341"
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 6. EXPERIENCIAS (Azul al abrir) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent hover:!bg-[#0085B1]/40 focus:!bg-[#0085B1] data-[active]:!bg-[#0085B1] data-[state=open]:!bg-[#0085B1] text-sm lg:text-base px-3 py-1.5 normal-case tracking-wide shadow-none transition-colors duration-200"
                    style={{ color: "#FFF4E0", fontFamily: "var(--font-synthese), sans-serif", textShadow: "none" }}
                  >
                    Experiencias
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <div className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#FFFFFF",
                              backgroundImage: "url(/svg/header/bg%20programa7.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/programa-transformacion"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full bg-white/40 backdrop-blur-[2px]">
                              <DropdownVector src="/assets/vectores/gota-cristal-facetada.svg" color="#0A1D4A" label="Gota de cristal facetada" />
                              <div
                                className="mb-2 text-xl font-title font-semibold"
                                style={{ color: AZUL_PROFUNDO, fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
                              >
                                Portal de Experiencias
                              </div>
                              <p
                                className="text-xs font-text font-medium leading-relaxed"
                                style={{ color: "#16345F", opacity: 0.75 }}
                              >
                                Caminos vivos para habitar la soberanía de tu cuerpo y tu energía. Una mirada integral para acompañar el ritmo de tu biología.
                              </p>
                              <span className="mt-4 text-xs font-medium" style={{ color: "#16345F" }}>
                                Explorar todas las experiencias →
                              </span>
                              <span className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: "#16345F", opacity: 0.75 }}>
                                PRÓXIMAMENTE
                              </span>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="flex flex-col justify-evenly space-y-2">
                        <ListItem href="/programa-transformacion" title="Génesis | Tecnología del Ser" textColor="#051341" fullDescription>
                          El viaje de 8 meses hacia la soberanía biológica: transformá tu terreno y desprogramá el estrés de raíz.
                        </ListItem>
                        <ListItem href="/mi-membresia" title="El Pulso | Membresía" textColor="#051341" fullDescription>
                          Tu mantenimiento de soberanía: sintonización mensual de tu eje biológico, contenidos vivos y beneficios en red.
                        </ListItem>
                        <div className="select-none space-y-1 rounded-md p-3 leading-none">
                          <div className="text-sm font-medium leading-none" style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                            Sintropía | Recalibración
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "#16345F", opacity: 0.75 }}>
                            Intervención intensiva de 33 días: desactivá la señal de alarma interna y pasá del ruido al orden funcional.
                          </p>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: "#16345F", opacity: 0.75 }}>
                            PRÓXIMAMENTE
                          </span>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            {/* FAQ Link - Desktop */}
            <Link
              href="/faq"
              className="header-top-link hidden xl:flex items-center px-3 py-2 hover:bg-white/10 transition-colors rounded-md shadow-none"
              style={{ color: "#FFF4E0", fontFamily: "var(--font-synthese), sans-serif", textShadow: "none" }}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              FAQ
            </Link>

            {/* User Menu / Auth Buttons - DESKTOP ONLY */}
            <div className="hidden xl:flex items-center space-x-4">
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
                    className="w-56 border border-gray-200 shadow-lg"
                    align="end"
                    style={{ backgroundColor: "#fff4e0" }}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p
                          className="text-sm font-subtitle font-medium leading-none"
                          style={{ color: "#16345F" }}
                        >
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p
                          className="text-xs font-caption leading-none"
                          style={{ color: "#16345F", opacity: 0.6 }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <div className="h-px mx-2 my-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/perfil"
                        className="flex items-center hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                        style={{ color: "#16345F" }}
                      >
                        <User className="mr-2 h-4 w-4" style={{ color: "#2A2543" }} />
                        <span className="font-text">Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/mis-pedidos"
                        className="flex items-center hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                        style={{ color: "#16345F" }}
                      >
                        <Package className="mr-2 h-4 w-4" style={{ color: "#2A2543" }} />
                        <span className="font-text">Mis Pedidos</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/mi-membresia"
                        className="flex items-center hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                        style={{ color: "#16345F" }}
                      >
                        <BookOpen className="mr-2 h-4 w-4" style={{ color: "#2A2543" }} />
                        <span className="font-text">Tu Sendero</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/configuracion"
                        className="flex items-center hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                        style={{ color: "#16345F" }}
                      >
                        <Settings className="mr-2 h-4 w-4" style={{ color: "#2A2543" }} />
                        <span className="font-text">Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    <div className="h-px mx-2 my-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />
                    <DropdownMenuItem
                      onSelect={handleSignOut}
                      className="hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                      style={{ color: "#16345F" }}
                    >
                      <LogOut className="mr-2 h-4 w-4" style={{ color: "#2A2543" }} />
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
                  className="w-[320px] sm:w-[400px] flex flex-col h-full"
                  style={{ backgroundColor: "#fff4e0" }}
                >
                  <SheetHeader className="border-b border-brand-primary/20 pb-4">
                    <SheetTitle
                      className="font-title text-left"
                      style={{ color: "#2A2543" }}
                    >
                      Menú de Navegación
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    <nav className="flex flex-col space-y-1 mt-6">
                      <div className="mb-4">
                        <div className="text-lg font-title font-medium mb-3" style={{ color: "#72111A" }}>
                          Tienda
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link href="/productos" className="block py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Todos los Productos</Link>
                          <Link href="/categorias/linea-umbral" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Línea Umbral</Link>
                          <Link href="/categorias/linea-ecos" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Línea Ecos</Link>
                          <Link href="/categorias/linea-alma-terra" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Línea Alma Terra</Link>
                          <Link href="/categorias/linea-jade-ritual" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Línea Jade Ritual</Link>
                          <Link href="/categorias/linea-prisma" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Línea Prisma</Link>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-lg font-title font-medium mb-3" style={{ color: "#72111A" }}>
                          Alkimya
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link href="/alkimya" className="block py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Manifiesto</Link>
                          <Link href="/alkimya/activos-origen" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Activos y Origen</Link>
                          <Link href="/alkimya/biotipos-doshas" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Biotipos y Doshas</Link>
                          <Link href="/alkimya/tu-ceremonia" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Tu Ceremonia</Link>
                          <Link href="/alkimya/tesoros-daluz" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#7D1D2B" }} onClick={() => setMobileMenuOpen(false)}>Tesoros Da Luz</Link>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-lg font-title font-medium mb-3" style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                          Raíces Da Luz
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link href="/filosofia-proposito" className="block py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>Filosofía y propósito</Link>
                          <Link href="/raices" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>Raíces</Link>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-lg font-title font-medium mb-3" style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                          Procesos
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link href="/servicios/procesos" className="block py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>Procesos</Link>
                          <Link href="/servicios/procesos/ciclos-alquimicos" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>Ciclos Alquímicos</Link>
                          <Link href="/servicios/procesos/sesiones-integrales" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>Sesiones Integrales</Link>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-lg font-title font-medium mb-3" style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                          Blog
                        </div>
                        <div className="ml-4 flex items-center gap-3">
                          <Link href="/blog" className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-brand-primary)]/15 hover:bg-[var(--color-brand-primary)]/25 transition-colors border border-[var(--color-brand-primary)]/30 shrink-0" style={{ color: "#051341", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }} onClick={() => setMobileMenuOpen(false)} aria-label="Ir al blog">
                            <BookOpen className="w-6 h-6" />
                          </Link>
                          <Link href="/blog" className="block py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>Artículos y novedades</Link>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-lg font-title font-medium mb-3" style={{ color: "#16345F" }}>
                          Membresía
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link href="/programa-transformacion" className="block py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>Programa de 7 Meses</Link>
                          <Link href="/mi-membresia" className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>Tu Sendero</Link>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Link href="/faq" className="flex items-center gap-3 py-2 text-base font-text hover:text-brand-primary transition-colors" style={{ color: "#16345F" }} onClick={() => setMobileMenuOpen(false)}>
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
