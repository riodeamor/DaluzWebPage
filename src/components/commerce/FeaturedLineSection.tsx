"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/brand/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useStoreCategories } from "@/hooks/useStoreCategories";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  info_frontal?: string | null;
  price: number;
  compare_at_price?: number;
  featured_image: string;
  category_id: string;
  skin_type: string[];
  benefits: string[];
  inventory_quantity: number;
  is_featured: boolean;
  averageRating?: number;
  reviewCount?: number;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
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
}

interface FeaturedLineSectionProps {
  className?: string;
}

// Presentation themes only; category membership and URLs come from Supabase.
const lineThemes = [
  {
    id: "alma-terra",
    name: "Alma Terra",
    description: "Conexión con la tierra",
    color: "text-alma-primary",
    bgColor: "bg-alma-primary/10",
    borderColor: "border-alma-primary/20",
    buttonColor: "bg-alma-primary hover:bg-alma-primary/90",
  },
  {
    id: "ecos",
    name: "Ecos",
    description: "Ritmos naturales",
    color: "text-ecos-primary",
    bgColor: "bg-ecos-primary/10",
    borderColor: "border-ecos-primary/20",
    buttonColor: "bg-ecos-primary hover:bg-ecos-primary/90",
  },
  {
    id: "jade-ritual",
    name: "Jade Ritual",
    description: "Ceremonias sagradas",
    color: "text-jade-primary",
    bgColor: "bg-jade-primary/10",
    borderColor: "border-jade-primary/20",
    buttonColor: "bg-jade-primary hover:bg-jade-primary/90",
  },
  {
    id: "umbral",
    name: "Umbral",
    description: "Transformación interior",
    color: "text-umbral-primary",
    bgColor: "bg-umbral-primary/10",
    borderColor: "border-umbral-primary/20",
    buttonColor: "bg-umbral-primary hover:bg-umbral-primary/90",
  },
  {
    id: "utopica",
    slug: "prisma",
    name: "Prisma",
    description: "Visión elevada",
    color: "text-utopica-primary",
    bgColor: "bg-utopica-primary/10",
    borderColor: "border-utopica-primary/20",
    buttonColor: "bg-utopica-primary hover:bg-utopica-primary/90",
  },
];

export default function FeaturedLineSection({
  className,
}: FeaturedLineSectionProps) {
  const categories = useStoreCategories();
  const availableLines = categories.map(category => {
    const theme = lineThemes.find(line => category.slug.includes("slug" in line ? line.slug! : line.id));
    return {
      color: "text-brand-primary", bgColor: "bg-brand-primary/10",
      buttonColor: "bg-brand-primary hover:bg-brand-primary/90",
      ...theme, ...category, description: category.description ?? "",
      lineTheme: theme?.id ?? "default",
    };
  });
  const [selectedId, setSelectedId] = useState<string>();
  const selectedLine = availableLines.find(line => line.id === selectedId);
  const selectedCategoryId = selectedLine?.id;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  // Keep the existing random featured-line behavior, using actual active categories.
  useEffect(() => {
    if (!categories.length) return;
    const controller = new AbortController();
    fetch("/api/products?limit=100&in_stock=true", { signal: controller.signal })
      .then(async response => {
        if (!response.ok) return;
        const { products = [] } = await response.json();
        const eligible = categories.filter(category => products.some((product: Product) => product.category_id === category.id));
        setSelectedId(current => eligible.some(category => category.id === current)
          ? current : eligible[Math.floor(Math.random() * eligible.length)]?.id);
      })
      .catch(() => { /* Leave the featured section hidden if unavailable. */ });
    return () => controller.abort();
  }, [categories]);

  useEffect(() => {
    if (!selectedCategoryId) { setLoading(false); return; }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/products?category=${encodeURIComponent(selectedCategoryId)}&limit=4&in_stock=true`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("No se pudieron cargar los productos");
        setProducts((await response.json()).products ?? []);
      })
      .catch(error => { if (error.name !== "AbortError") setProducts([]); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [selectedCategoryId]);

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const defaultVariant =
      product.product_variants?.find((v) => v.is_default) ||
      product.product_variants?.[0];

    addItem({
      productId: product.id,
      variantId: defaultVariant?.id,
      name: product.name,
      price: defaultVariant?.price || product.price,
      originalPrice: product.compare_at_price,
      image: product.featured_image,
      stock: defaultVariant?.inventory_quantity || product.inventory_quantity,
      size: defaultVariant?.option1,
      sku: product.slug,
      quantity,
      installments3Enabled: product.installments_3_enabled,
      installments6Enabled: product.installments_6_enabled,
    });

    toast.success(`${product.name} agregado al carrito`);
  };

  if (!selectedLine) return null;

  if (loading) {
    return (
      <div
        className={cn("py-12 relative overflow-hidden", className)}
        style={{
          background: `linear-gradient(135deg, ${selectedLine.bgColor.replace("bg-", "")} 0%, ${selectedLine.bgColor.replace("bg-", "")}CC 100%)`,
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-white/20 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0 || availableLines.length === 0) {
    return null; // Don't show section if no products or no available lines
  }

  return (
    <div
      className={cn("py-12 relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, ${selectedLine.bgColor.replace("bg-", "")} 0%, ${selectedLine.bgColor.replace("bg-", "")}CC 100%)`,
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">


          <h2
            className={cn(
              "text-3xl md:text-4xl font-semibold mb-4 leading-tight tracking-wider text-center",
              selectedLine.color,
            )}
            style={{
              fontFamily: "Playfair Display, var(--font-playfair), serif",
              fontWeight: 600,
              fontStyle: "normal",
            }}
          >
            Descubrí la línea {selectedLine.name}
          </h2>

          <p
            className="text-lg text-tierra-media max-w-2xl mx-auto mb-6 text-center"
            style={{ fontFamily: "EB Garamond, var(--font-text), serif" }}
          >
            {selectedLine.description}. Una selección especial de productos
            cuidadosamente elegidos para tu bienestar.
          </p>

          <Link href={`/categorias/${encodeURIComponent(selectedLine.slug)}`} className="tienda-line-button inline-flex items-center justify-center px-8 py-3 mt-2">
            VER TODA LA LÍNEA
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              description={product.short_description || product.description}
              infoFrontal={product.info_frontal}
              price={product.price}
              originalPrice={product.compare_at_price}
              category={product.categories?.name || selectedLine.name}
              imageUrl={product.featured_image}
              rating={product.averageRating || 0}
              reviewCount={product.reviewCount || 0}
              isNatural={true}
              isNew={false}
              isOnSale={!!product.compare_at_price}
              stock={product.inventory_quantity}
              size={
                product.product_variants?.find((v) => v.is_default)?.option1
              }
              lineTheme={selectedLine.lineTheme as any}
              onAddToCart={handleAddToCart}
              variant="elegant"
              className="p-[0]"
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Link href={`/categorias/${encodeURIComponent(selectedLine.slug)}`}>
            <Button
              className={cn(
                "tienda-line-button group relative px-10 py-4 text-lg font-semibold text-white transition-all duration-500 transform hover:scale-105 overflow-hidden",
                selectedLine.buttonColor,
              )}
              style={{
                borderRadius: "0 15px",
              }}
            >
              <span className="relative z-10">
                VER MÁS PRODUCTOS DE {selectedLine.name}
              </span>
              <div className="absolute inset-0 -top-1 -left-1 w-[calc(100%+8px)] h-[calc(100%+8px)] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
