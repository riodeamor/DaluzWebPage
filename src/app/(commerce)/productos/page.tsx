"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ui/brand/ProductCard";
import TiendaHero from "@/components/commerce/TiendaHero";
import Link from "next/link";
import { useReviewsVisibility } from "@/hooks/useReviewsVisibility";
import TiendaSidebar from "@/components/commerce/TiendaSidebar";
import StoreCategoryNavigation from "@/components/commerce/StoreCategoryNavigation";
import FeaturedLineSection from "@/components/commerce/FeaturedLineSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Heart,
  Tag,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLike } from "@/contexts/LikeContext";
import { toast } from "sonner";
import { useCatalogTerms } from "@/hooks/useCatalogTerms";
import { searchTokens } from "@/lib/catalog/search";

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
  gallery?: string[];
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
  promotional_tag?:
  | "none"
  | "lanzamiento"
  | "descuento"
  | "ultimas_unidades"
  | null;
  discount_transfer_percent?: number | null;
  discount_cash_percent?: number | null;
  installments_3_enabled?: boolean;
  installments_6_enabled?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const terms = useCatalogTerms();
  const requestRef = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const ownUrl = useRef<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const { addItem } = useCart();
  const showReviews = useReviewsVisibility();
  const { isLiked, likedProducts } = useLike();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedSkinType, setSelectedSkinType] = useState(
    searchParams.get("skin_type") || "",
  );
  const [selectedHairType, setSelectedHairType] = useState(
    searchParams.get("hair_type") || "",
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") || "featured",
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("min_price") || "",
    max: searchParams.get("max_price") || "",
  });
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9, // Changed from 12 to 9
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [gridCols, setGridCols] = useState(3);
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    filters: false,
    sort: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [selectedSynergy, setSelectedSynergy] = useState<string | null>(searchParams.get("need"));
  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSynergy(null);
    setCurrentPage(1);
  };
  const selectSynergy = (synergy: string) => {
    setSelectedSynergy((current) => current === synergy ? null : synergy);

    setCurrentPage(1);
  };

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories?active=true");
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => { const timer = setTimeout(() => { setDebouncedSearch(searchTerm); }, 400); return () => clearTimeout(timer); }, [searchTerm]);
  useEffect(() => {
    if (ownUrl.current === searchParams.toString()) { ownUrl.current = null; return; }
    setDebouncedSearch(searchParams.get("search") || "");
    setSearchTerm(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedSynergy(searchParams.get("need"));
    setCurrentPage(Math.max(1, Number(searchParams.get("page")) || 1));
  }, [searchParams]);
  useEffect(() => {
    requestRef.current?.abort();
    const controller = new AbortController(); requestRef.current = controller;
    const requestId = ++sequence.current;
    const params = new URLSearchParams();
    try { searchTokens(debouncedSearch); } catch (error) { toast.error((error as Error).message); setLoading(false); return; }
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory.startsWith("line:")) params.set("line", selectedCategory.slice(5));
    else if (selectedCategory && selectedCategory !== "all") {
      if (/^[0-9a-f-]{36}$/i.test(selectedCategory)) params.set("category_id", selectedCategory);
      else params.set("anatomy", selectedCategory);
    }
    if (selectedSynergy) params.set("need", selectedSynergy);
    if (selectedSkinType && selectedSkinType !== "all") params.set("skin_type", selectedSkinType);
    if (selectedHairType && selectedHairType !== "all") params.set("hair_type", selectedHairType);
    if (priceRange.min) params.set("min_price", priceRange.min);
    if (priceRange.max) params.set("max_price", priceRange.max);
    if (showOnlySale) params.set("on_sale", "true");
    params.set("page", String(currentPage)); params.set("limit", "9"); params.set("in_stock", "true");
    const url = new URLSearchParams(params); url.delete("line"); url.delete("anatomy"); url.delete("category_id"); url.delete("limit"); url.delete("in_stock");
    if (selectedCategory) url.set("category", selectedCategory);
    if (url.toString() !== searchParams.toString()) { ownUrl.current = url.toString(); router.replace("/productos?" + url, { scroll: false }); }
    setLoading(true);
    fetch("/api/products?" + params, { signal: controller.signal }).then(async response => {
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Error al cargar productos");
      if (requestId === sequence.current && !controller.signal.aborted) { setProducts(data.products); setPagination(data.pagination); }
    }).catch(error => { if (!controller.signal.aborted) toast.error(error.message); }).finally(() => { if (requestId === sequence.current && !controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [debouncedSearch, selectedCategory, selectedSynergy, selectedSkinType, selectedHairType, priceRange, currentPage, showOnlySale, router]);

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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSynergy(null);
    setSelectedSkinType("");
    setSelectedHairType("");
    setPriceRange({ min: "", max: "" });
    setSortBy("featured");
    setCurrentPage(1);
    setShowOnlyFavorites(false);
    setShowOnlySale(false);
  };

  const hasActiveFilters = Boolean(
    searchTerm ||
    selectedCategory ||
    selectedSynergy ||
    (selectedSkinType && selectedSkinType !== "all") ||
    (selectedHairType && selectedHairType !== "all") ||
    priceRange.min ||
    priceRange.max ||
    showOnlyFavorites ||
    showOnlySale,
  );

  const displayedProducts = showOnlyFavorites
    ? products.filter((p) => isLiked(p.id))
    : products;

  const skinTypes = ["seca", "grasa", "mixta", "sensible", "normal"];

  return (
    <div className="tienda-page min-h-screen overflow-hidden bg-[#FAF7F2]">
      {/* Hero Section */}
      <TiendaHero />
      <section className="mx-auto max-w-6xl px-4 pt-7 pb-2 text-center" aria-label="Encontrá tu ritual">
        <Link href="/alkimya/biotipos" className="block rounded-[0_18px] border border-[#7D1D2B]/20 bg-[#FFF2E9] px-5 py-5 text-sm font-medium leading-relaxed text-[#4A0D10] shadow-sm transition-colors hover:bg-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          ¿No sabés qué Alkimya necesita tu piel en este ciclo? Descubrí tu Biotipo Cutáneo y encontrá tu ritual exacto →
        </Link>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 bg-transparent">
        {/* Mobile Filters - 3x1 Horizontal Grid */}
        <div className="lg:hidden mb-4">
          {/* Search Card - Always Open */}
                      <div className="col-span-3">
                        <Card variant="artisanal" className="tienda-card p-3">
                          <div className="tienda-section-title flex items-center gap-2 mb-2">
                            <Search className="h-4 w-4" />
                            <span className="text-sm">Buscar</span>
                          </div>
                          <div className="relative">
                            <Input
                              variant="tienda"
                              placeholder="Buscar productos..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                        </Card>
                      </div>

          <Button className="tienda-mobile-open w-full h-[44px]" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filtrar
          </Button>
          {showFilters && (
            <div className="tienda-drawer-backdrop" onClick={() => setShowFilters(false)}>
              <div className="tienda-drawer-panel" role="dialog" aria-modal="true" aria-label="Filtros" onClick={(event) => event.stopPropagation()}>
                <div className="tienda-drawer-scroll">
          <div className="grid grid-cols-3 gap-2">


            {/* Categories Card - Collapsible */}
            <div className="col-span-1">
              <Card variant="artisanal" className="tienda-card p-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      categories: !prev.categories,
                    }))
                  }
                >
                  <div className="tienda-section-title flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    {/* Sin tilde: Synthese.otf no incluye el glifo "Í" y caería a otra fuente */}
                    <span className="text-xs">Categorias</span>
                  </div>
                  {expandedSections.categories ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </div>
                {expandedSections.categories && (
                  <div className="mt-2">
                    <StoreCategoryNavigation selectedCategory={selectedCategory} onSelect={selectCategory} compact />
                  </div>
                )}
              </Card>
            </div>

            {/* Filters Card - Collapsible */}
            <div className="col-span-1">
              <Card variant="artisanal" className="tienda-card p-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      filters: !prev.filters,
                    }))
                  }
                >
                  <div className="tienda-section-title flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    <span className="text-xs">Filtros</span>
                  </div>
                  {expandedSections.filters ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </div>
                {expandedSections.filters && (
                  <div className="mt-2 space-y-2">
                    <Select
                      value={selectedSkinType}
                      onValueChange={setSelectedSkinType}
                    >
                      <SelectTrigger className="tienda-select-trigger h-6 text-xs">
                        <SelectValue placeholder="Piel" />
                      </SelectTrigger>
                      <SelectContent className="tienda-select-panel">
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="dry">Piel Seca</SelectItem>
                        <SelectItem value="oily">Piel Grasa</SelectItem>
                        <SelectItem value="combination">Piel Mixta</SelectItem>
                        <SelectItem value="sensitive">Piel Sensible</SelectItem>
                        <SelectItem value="normal">Piel Normal</SelectItem>
                        <SelectItem value="mature">Piel Madura</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedHairType}
                      onValueChange={setSelectedHairType}
                    >
                      <SelectTrigger className="tienda-select-trigger h-6 text-xs">
                        <SelectValue placeholder="Cabello" />
                      </SelectTrigger>
                      <SelectContent className="tienda-select-panel">
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="oily">Graso</SelectItem>
                        <SelectItem value="dry">Seco</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="combination">Mixto</SelectItem>
                        <SelectItem value="curly">Rizado</SelectItem>
                        <SelectItem value="straight">Lacio</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Price Range */}
                    <div className="space-y-1">
                      <label className="tienda-field-label">Precio</label>
                      <div className="grid grid-cols-2 gap-1">
                        {/* Sin tilde: Synthese.otf no trae los glifos "í"/"á" */}
                        <Input
                          variant="tienda"
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: e.target.value,
                            })
                          }
                          className="h-6 text-xs"
                        />
                        <Input
                          variant="tienda"
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: e.target.value,
                            })
                          }
                          className="h-6 text-xs"
                        />
                      </div>
                    </div>

                    {/* Los iconos aparecen solo en estado activo */}
                    <Button
                      variant="outline"
                      data-active={showOnlyFavorites || undefined}
                      onClick={() => setShowOnlyFavorites((v) => !v)}
                      className="tienda-action-button w-full text-xs h-6"
                    >
                      {showOnlyFavorites && (
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                      )}
                      MIS FAVORITOS
                    </Button>

                    <Button
                      variant="outline"
                      data-active={showOnlySale || undefined}
                      onClick={() => { setShowOnlySale((v) => !v); setCurrentPage(1); }}
                      className="tienda-action-button w-full text-xs h-6"
                    >
                      {showOnlySale && <Tag className="h-3 w-3 mr-1" />}
                      SOLO OFERTAS
                    </Button>

                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="tienda-action-button w-full text-xs h-6"
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Sort Card - Collapsible */}
            <div className="col-span-1">
              <Card variant="artisanal" className="tienda-card p-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      sort: !prev.sort,
                    }))
                  }
                >
                  <div className="tienda-section-title flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3" />
                    <span className="text-xs">Ordenar</span>
                  </div>
                  {expandedSections.sort ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </div>
                {expandedSections.sort && (
                  <div className="mt-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="tienda-select-trigger h-6 text-xs">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent className="tienda-select-panel">
                        {/* Etiquetas sin "á" ni ":": Synthese.otf no trae esos
                            glifos y el panel usa esa tipografía */}
                        <SelectItem value="featured">Destacados</SelectItem>
                        <SelectItem value="price_asc">
                          Precio menor a mayor
                        </SelectItem>
                        <SelectItem value="price_desc">
                          Precio mayor a menor
                        </SelectItem>
                        <SelectItem value="name_asc">Nombre A-Z</SelectItem>
                        <SelectItem value="name_desc">Nombre Z-A</SelectItem>
                        <SelectItem value="newest">Recientes</SelectItem>
                        <SelectItem value="rating">Mejor Valorados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </Card>
            </div>
          </div>
                </div>
                <Button className="tienda-drawer-apply" onClick={() => setShowFilters(false)}>APLICAR FILTROS</Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <TiendaSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={selectCategory}
              selectedSkinType={selectedSkinType}
              setSelectedSkinType={setSelectedSkinType}
              selectedHairType={selectedHairType}
              setSelectedHairType={setSelectedHairType}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              gridCols={gridCols}
              setGridCols={setGridCols}
              categories={categories}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              showOnlyFavorites={showOnlyFavorites}
              setShowOnlyFavorites={setShowOnlyFavorites}
              showOnlySale={showOnlySale}
              setShowOnlySale={(v) => {
                setShowOnlySale(v);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="alkimya-synergy-ribbons mb-6" aria-label="Filtrar por sinergia">
              <div className="alkimya-synergy-row">
                <span className="alkimya-synergy-heading">Cuidado facial</span>
                {terms.filter(term => term.kind === "need" && term.group_name === "facial").map(({slug: id, label}) => (
                  <button key={id} type="button" className="alkimya-synergy-button" aria-pressed={selectedSynergy === id} onClick={() => selectSynergy(id)}>{label}</button>
                ))}
              </div>
              <div className="alkimya-synergy-row">
                <span className="alkimya-synergy-heading">Cuidado capilar</span>
                {terms.filter(term => term.kind === "need" && term.group_name === "capilar").map(({slug: id, label}) => (
                  <button key={id} type="button" className="alkimya-synergy-button" aria-pressed={selectedSynergy === id} onClick={() => selectSynergy(id)}>{label}</button>
                ))}
              </div>
            </div>
            {/* Results Info */}
            <div className="mb-6 flex justify-between items-center"></div>

            {/* Products Grid */}
            {loading ? (
              <div
                className={`grid gap-3 sm:gap-4 lg:gap-6 ${gridCols === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 sm:h-80 lg:h-96 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-12">
                {showOnlyFavorites && likedProducts.size === 0 ? (
                  <>
                    <Heart className="h-12 w-12 text-tierra-media mx-auto mb-4" />
                    <p className="text-tierra-media mb-2 text-lg font-medium">
                      Todavía no tenés favoritos
                    </p>
                    <p className="text-gray-500 mb-4 text-sm">
                      Marcá productos con el corazón para verlos acá.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowOnlyFavorites(false)}
                    >
                      Ver todos los productos
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-tierra-media mb-4">
                      {showOnlyFavorites
                        ? "Ninguno de tus favoritos coincide con los filtros actuales"
                        : "No se encontraron productos"}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters}>
                        Limpiar filtros
                      </Button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-3 sm:gap-4 lg:gap-6 ${gridCols === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
              >
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    infoFrontal={product.info_frontal}
                    description={
                      product.short_description || product.description
                    }
                    price={product.price}
                    originalPrice={product.compare_at_price}
                    category={product.categories?.name || ""}
                    imageUrl={product.featured_image}
                    rating={product.averageRating || 0}
                    reviewCount={product.reviewCount || 0}
                    showReviews={showReviews}
                    isNatural={true}
                    isNew={false}
                    isOnSale={!!product.compare_at_price}
                    stock={product.inventory_quantity}
                    size={
                      product.product_variants?.find((v) => v.is_default)
                        ?.option1
                    }
                    onAddToCart={handleAddToCart}
                    variant="elegant"
                    className="p-[0]"
                    promotionalTag={product.promotional_tag}
                    discountTransferPercent={product.discount_transfer_percent}
                    discountCashPercent={product.discount_cash_percent}
                    installments3Enabled={product.installments_3_enabled}
                    installments6Enabled={product.installments_6_enabled}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && !showOnlyFavorites && (
              <div className="mt-12 flex justify-center gap-2 relative z-10 px-4 lg:px-0">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="alkimya-pagination"
                >
                  Anterior
                </Button>

                {/* Desktop: Full pagination */}
                <div className="hidden lg:flex gap-2">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let page;
                      if (pagination.totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        page = pagination.totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant="outline"
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="alkimya-pagination"
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </Button>
                      );
                    },
                  )}
                </div>

                {/* Mobile: Simplified pagination */}
                <div className="lg:hidden flex gap-1">
                  {Array.from(
                    { length: Math.min(3, pagination.totalPages) },
                    (_, i) => {
                      let page;
                      if (pagination.totalPages <= 3) {
                        page = i + 1;
                      } else if (currentPage <= 2) {
                        page = i + 1;
                      } else if (currentPage >= pagination.totalPages - 1) {
                        page = pagination.totalPages - 2 + i;
                      } else {
                        page = currentPage - 1 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant="outline"
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="alkimya-pagination text-xs px-2 py-1 h-8 min-w-[2rem]"
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </Button>
                      );
                    },
                  )}
                  {pagination.totalPages > 3 &&
                    currentPage < pagination.totalPages - 1 && (
                      <span className="text-xs text-gray-500 px-1">...</span>
                    )}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="alkimya-pagination"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Linea Separadora SVG */}
      <div className="my-8 flex justify-center">
        <img
          src="/svg/linea-separadora.svg"
          alt="Separador decorativo"
          className="w-full max-w-[70rem] h-auto z-20"
        />
      </div>

      {/* Featured Line Section */}
      <FeaturedLineSection />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-azul-profundo mb-2">
              Nuestros Productos
            </h1>
            <p className="text-gray-600">
              Descubre nuestra línea completa de biocosmética artesanal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

