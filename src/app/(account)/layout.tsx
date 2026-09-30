"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./account.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  Package,
  Sparkles,
  LogOut,
  Loader2,
  Shield,
} from "lucide-react";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { user, profile, loading, signOut } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#005080] mx-auto" />
            <p className="text-[#16345F]">Cargando tu cuenta...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Check if user has active membership (placeholder logic)
  const hasActiveMembership = false; // TODO: Implement membership check

  const navigationItems = [
    {
      href: "/perfil",
      label: "Mi Perfil",
      icon: User,
      description: "Información personal y contacto",
    },
    {
      href: "/mis-tesoros",
      label: "Mis Tesoros",
      icon: null,
      iconSrc: "/svg/header/Filosofia%20y%20proposito.svg",
      description: "Contenido exclusivo de tus compras",
    },
    {
      href: "/mis-pedidos",
      label: "Mis Pedidos",
      icon: Package,
      description: "Historial de compras y envíos",
    },
    {
      href: "/mi-membresia",
      label: "Tu Sendero",
      icon: null,
      iconSrc: "/assets/vectores/gota-cristal-facetada.svg",
      description: "Tus experiencias en Da Luz",
      badge: hasActiveMembership ? "Activa" : undefined,
    },
    {
      href: "/configuracion",
      label: "Configuración",
      icon: Settings,
      description: "Preferencias y seguridad",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div
          className="account-area min-h-screen"
          style={{
            backgroundColor: "var(--admin-bg-tertiary)",
            background: "#FAF7F2",
            backgroundImage: "none",
          }}
        >
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <div className="hidden lg:block lg:col-span-1">
                <Card
                  className="sticky top-24"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(10,29,74,0.12)" }}
                >
                  <CardContent className="p-6">
                    {/* User Info */}
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-[#16345F]/10 flex items-center justify-center mx-auto mb-4">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover object-top"
                          />
                        ) : (
                          <User className="h-10 w-10 text-azul-profundo" />
                        )}
                      </div>
                      <h2 className="font-semibold text-azul-profundo">
                        {profile?.first_name} {profile?.last_name}
                      </h2>
                      <p className="text-sm text-[#16345F]">{user.email}</p>
                      {hasActiveMembership && (
                        <Badge className="mt-2 bg-[#16345F] text-[#FFF2E9]">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Miembro Activo
                        </Badge>
                      )}
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href as any}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#005080]/10 transition-colors group"
                        >
                          {item.icon ? <item.icon className="h-5 w-5 text-[#0A1D4A]" /> : item.href === "/mis-tesoros" ? <span className="account-tesoros-vector h-5 w-5" aria-hidden="true" /> : <Image src={item.iconSrc} alt="" width={20} height={20} className="h-5 w-5 object-contain" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[#0A1D4A] text-lg" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-[#16345F]/10 text-azul-profundo"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-[#16345F]">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </nav>

                    {/* Sign Out */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        className="account-primary w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </Button>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-4 p-3 bg-[#005080]/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-[#005080] mt-0.5" />
                        <div className="text-xs text-[#16345F]">
                          <p className="font-medium text-azul-profundo mb-1">
                            Cuenta Protegida
                          </p>
                          <p>
                            Tu información está segura con cifrado de extremo a
                            extremo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 min-w-0">
                <nav aria-label="Cuenta" className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4">
                  {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href as any} className="shrink-0 inline-flex items-center gap-2 border border-[#005080]/20 px-3 py-2 text-xs font-medium text-[#051341] bg-white">
                      {item.icon ? <item.icon className="h-4 w-4 text-[#0A1D4A]" /> : item.href === "/mis-tesoros" ? <span className="account-tesoros-vector h-4 w-4" aria-hidden="true" /> : <Image src={item.iconSrc} alt="" width={16} height={16} className="h-4 w-4 object-contain" />}
                      {item.label}
                    </Link>
                  ))}
                </nav>
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
