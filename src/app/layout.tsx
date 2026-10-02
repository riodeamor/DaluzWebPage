import ResidualWorkerCleanup from "@/components/infra/ResidualWorkerCleanup";
import type { Metadata } from "next";
import { Inter, Playfair_Display, EB_Garamond, Montserrat, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider";
import { ThemeProvider as ProductLineThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LikeProvider } from "@/contexts/LikeContext";
import { Analytics } from "@/components/Analytics";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

// Custom DA LUZ Fonts
const malisha = localFont({
  src: "../../public/fonts/Malisha.ttf",
  variable: "--font-malisha",
  display: "swap",
});

const velista = localFont({
  src: "../../public/fonts/VELISTA.ttf",
  variable: "--font-velista",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daluzconsciente.com"),
  title: {
    default: "DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo",
    template: "%s | DA LUZ CONSCIENTE",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  description:
    'DA LUZ CONSCIENTE presenta "Alkimyas para alma y cuerpo", unificando productos biocosmecéticos artesanales y servicios holísticos para la vida consciente.',
  keywords: [
    "alkimyas",
    "biocosmética artesanal",
    "productos naturales",
    "vida consciente",
    "transformación personal",
    "ceramica personalizada",
    "flores silvestres",
    "viveros",
  ],
  authors: [{ name: "DA LUZ CONSCIENTE" }],
  creator: "DA LUZ CONSCIENTE",
  publisher: "DA LUZ CONSCIENTE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://daluzconsciente.com",
    title: "DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo",
    description:
      "Productos biocosmecéticos artesanales y servicios holísticos para la vida consciente.",
    siteName: "DA LUZ CONSCIENTE",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Da Luz Consciente" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
    title: "DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo",
    description:
      "Productos biocosmecéticos artesanales y servicios holísticos para la vida consciente.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${montserrat.variable} ${cormorant.variable} ${playfair.variable} ${ebGaramond.variable} ${malisha.variable} ${velista.variable} font-text antialiased`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ProductLineThemeProvider>
            <ResidualWorkerCleanup />
        <AuthProvider>
              <CartProvider>
                <LikeProvider>
                  {children}
                  <Toaster position="bottom-right" />
                  <Analytics />
                </LikeProvider>
              </CartProvider>
            </AuthProvider>
          </ProductLineThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
