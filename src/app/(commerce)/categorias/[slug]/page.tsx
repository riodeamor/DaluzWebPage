"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ui/brand/ProductCard";
import { useReviewsVisibility } from "@/hooks/useReviewsVisibility";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Grid3X3, Grid2X2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Map category slugs to product line themes
const getLineThemeFromSlug = (slug: string): 'alma-terra' | 'ecos' | 'jade-ritual' | 'umbral' | 'utopica' | 'kits-experiencia' | 'default' => {
  const slugLower = slug.toLowerCase();
  if (slugLower.includes('alma-terra')) return 'alma-terra';
  if (slugLower.includes('ecos')) return 'ecos';
  if (slugLower.includes('jade-ritual')) return 'jade-ritual';
  if (slugLower.includes('kits')) return 'kits-experiencia';
  if (slugLower.includes('umbral')) return 'umbral';
  if (slugLower.includes('utopica') || slugLower.includes('prisma')) return 'utopica';
  return 'default';
};

interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  featured_image: string;
  inventory_quantity: number;
  is_featured: boolean;
  averageRating?: number;
  reviewCount?: number;
  product_variants?: Array<{
    id: string;
    title: string;
    price: number;
    inventory_quantity: number;
    option1?: string;
    is_default: boolean;
  }>;
  installments_3_enabled?: boolean;
  installments_6_enabled?: boolean;
  promotional_tag?: "none" | "lanzamiento" | "descuento" | "ultimas_unidades" | null;
  discount_transfer_percent?: number | null;
  discount_cash_percent?: number | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  products?: Product[];
}

export default function CategoryPage() {
  const params = useParams();
  const { addItem } = useCart();
  const showReviews = useReviewsVisibility();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridCols, setGridCols] = useState(3);

  // Detect product line theme from slug
  const lineTheme = params.slug ? getLineThemeFromSlug(params.slug as string) : 'default';

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      if (!params.slug) return;

      setLoading(true);
      try {
        // Fetch category by slug
        const categoryResponse = await fetch(`/api/categories/by-slug/${params.slug}`);
        if (!categoryResponse.ok) {
          toast.error('Categoría no encontrada');
          return;
        }

        const categoryData = await categoryResponse.json();
        setCategory(categoryData.category);

        // Fetch products for this category
        const productsResponse = await fetch(`/api/products?category=${categoryData.category.id}&limit=50`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.products);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Error al cargar la categoría');
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryAndProducts();
  }, [params.slug]);

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const defaultVariant = product.product_variants?.find(v => v.is_default) || product.product_variants?.[0];

    addItem({
      productId: product.id,
      variantId: defaultVariant?.id,
      name: product.name,
      price: defaultVariant?.price || product.price,
      originalPrice: product.compare_at_price,
      image: product.featured_image,
      stock: defaultVariant?.inventory_quantity || product.inventory_quantity,
      size: defaultVariant?.option1,
      sku: product.id,
      quantity,
      installments3Enabled: product.installments_3_enabled,
      installments6Enabled: product.installments_6_enabled,
    });

    toast.success(`${product.name} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-azul-profundo mb-4">Categoría no encontrada</h1>
        <Link href="/productos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Button>
        </Link>
      </div>
    );
  }

  const lineConfig: Record<string, { eyebrow: string; title: string; eyebrowColor: string; titleColor: string; vector: string }> = {
    umbral: { eyebrow: "AGUA • MEMORIA LÍQUIDA & GOCE", title: "LÍNEA UMBRAL SENS", eyebrowColor: "#C85A32", titleColor: "#4A0D10", vector: "/assets/lineas/solido-umbral.svg" },
    ecos: { eyebrow: "ÉTER • PURIFICACIÓN & CLARIDAD", title: "LÍNEA ECOS", eyebrowColor: "#005080", titleColor: "#16345F", vector: "/assets/lineas/solido-ecos.svg" },
    "alma-terra": { eyebrow: "TIERRA • ENRAIZAMIENTO & MATERIA", title: "LÍNEA ALMA TERRA", eyebrowColor: "#6E3B2B", titleColor: "#4A1E13", vector: "/assets/lineas/solido-almaterra.svg" },
    "jade-ritual": { eyebrow: "AIRE • COHERENCIA & LATIDO", title: "LÍNEA JADE RITUAL", eyebrowColor: "#1B4D3E", titleColor: "#1B4D3E", vector: "/assets/lineas/solido-jaderitual.svg" },
    utopica: { eyebrow: "FUEGO • SOBERANÍA & LUZ PROPIA", title: "LÍNEA PRISMA", eyebrowColor: "#B8860B", titleColor: "#8C6205", vector: "/assets/lineas/solido-prisma.svg" },
    "kits-experiencia": { eyebrow: "SINERGIA BOTÁNICA • RITUALES COMPLETOS", title: "KITS & CEREMONIAS", eyebrowColor: "#7D1D2B", titleColor: "#4A0D10", vector: "/assets/lineas/solido-kits.svg" },
  };
  const currentLine = lineConfig[lineTheme];
  const lineColors = { primary: currentLine?.titleColor || "#4A0D10" };
  const isCenteredDarkTheme = Boolean(currentLine);

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF7F2]">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm" style={{ color: lineColors.primary }}>
            <li><Link href="/" className="hover:opacity-80 transition-opacity">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/productos" className="hover:opacity-80 transition-opacity">Productos</Link></li>
            <li>/</li>
            <li className="font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <div className={`flex ${isCenteredDarkTheme ? 'flex-col justify-center items-center text-center gap-6' : 'items-center justify-between'} mb-4`}>
            <div className={isCenteredDarkTheme ? "flex w-full flex-col items-center" : ""}>
              {currentLine && <img src={currentLine.vector} alt="" aria-hidden="true" className="mx-auto mb-2 h-12 w-12 object-contain md:h-14 md:w-14" />}
              {currentLine && <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: currentLine.eyebrowColor, fontFamily: "var(--font-montserrat), sans-serif" }}>{currentLine.eyebrow}</p>}
              <h1 className="mb-2 text-3xl font-medium md:text-4xl" style={{ color: lineColors.primary, fontFamily: "var(--font-cormorant), serif" }}>{currentLine?.title || category.name}</h1>
              {category.description && <p className="mx-auto max-w-2xl text-xs font-normal leading-relaxed md:text-sm" style={{ color: lineColors.primary, opacity: 0.8, fontFamily: "var(--font-montserrat), sans-serif" }}>{category.description}</p>}
            </div>

            {/* Grid Controls */}
            <div className={`flex border rounded-md ${isCenteredDarkTheme ? 'self-end' : ''}`}>
              <Button
                variant={gridCols === 2 ? "default" : "ghost"}
                size="sm"
                onClick={() => setGridCols(2)}
                className="rounded-r-none"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridCols === 3 ? "default" : "ghost"}
                size="sm"
                onClick={() => setGridCols(3)}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Stats */}
          <div className={`flex items-center gap-4 ${isCenteredDarkTheme ? 'justify-center w-full' : ''}`}>
            <Badge variant="outline" style={{ borderColor: lineColors.primary, color: lineColors.primary }}>
              {products.length} productos
            </Badge>
            {products.some(p => p.is_featured) && (
              <Badge variant="secondary" style={{ backgroundColor: `${lineColors.primary}20`, color: lineColors.primary, borderColor: `${lineColors.primary}40` }}>
                Incluye productos destacados
              </Badge>
            )}
          </div>
        </div>

        {/* Botanical banner, preserving the existing 3:1 frame */}
        {currentLine && (
          <div className="relative mb-8 aspect-[3/1] overflow-hidden rounded-lg" style={{ borderRadius: "0px 15px" }}>
            <img src="/images/hero-botanical-background.jpg" alt="Textura botánica con luz natural" className="h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ backgroundColor: `${lineColors.primary}20` }} />
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: lineColors.primary, opacity: 0.8 }}>
              No hay productos disponibles en esta categoría
            </p>
            <Link href="/productos">
              <Button
                variant="outline"
                className="tienda-line-cta"
                style={{ "--line-cta": lineColors.primary } as React.CSSProperties}
              >
                Ver todos los productos
              </Button>
            </Link>
          </div>
        ) : (
          <div className={`grid gap-6 ${gridCols === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                description={product.short_description || ""}
                price={product.price}
                originalPrice={product.compare_at_price}
                category={category.name}
                imageUrl={product.featured_image}
                rating={product.averageRating || 0}
                reviewCount={product.reviewCount || 0}
                showReviews={showReviews}
                isNatural={true}
                isNew={false}
                isOnSale={!!product.compare_at_price}
                stock={product.inventory_quantity}
                size={product.product_variants?.find(v => v.is_default)?.option1}
                onAddToCart={handleAddToCart}
                lineTheme={lineTheme}
                promotionalTag={product.promotional_tag}
                discountTransferPercent={product.discount_transfer_percent}
                discountCashPercent={product.discount_cash_percent}
                installments3Enabled={product.installments_3_enabled}
                installments6Enabled={product.installments_6_enabled}
              />
            ))}
          </div>
        )}

        {/* Back to Products */}
        <div className="mt-12 text-center">
          <Link href="/productos">
            <Button
              variant="outline"
              className="tienda-line-cta"
              style={{ "--line-cta": lineColors.primary } as React.CSSProperties}
            >
              Ver todos los productos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 