"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Star,
  Sparkles,
  Eye,

  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLike } from "@/contexts/LikeContext";
import FlameIcon from "@/components/ui/brand/icons/FlameIcon";
import StarBurstIcon from "@/components/ui/brand/icons/StarBurstIcon";
import AlertHexagonIcon from "@/components/ui/brand/icons/AlertHexagonIcon";

interface ProductCardProps {
  id: string;
  slug?: string;
  name: string;
  description: string;
  infoFrontal?: string | null;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isNatural?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  stock: number;
  size?: string;
  className?: string;
  variant?: "default" | "elegant" | "artisanal" | "glass";
  lineTheme?:
  | "alma-terra"
  | "ecos"
  | "jade-ritual"
  | "umbral"
  | "utopica"
  | "kits-experiencia"
  | "default";
  onAddToCart?: (productId: string, quantity: number) => void;
  // New fields from migration 20260325000000
  promotionalTag?:
  | "none"
  | "lanzamiento"
  | "descuento"
  | "ultimas_unidades"
  | null;
  discountTransferPercent?: number | null;
  discountCashPercent?: number | null;
  installments3Enabled?: boolean;
  installments6Enabled?: boolean;
  showReviews?: boolean;
}

const cardVariants = {
  default: "bg-white border-border",
  elegant:
    "bg-gradient-to-br from-[#f6fbd6] to-[white] border-gold-200 shadow-elegant",
  artisanal: "bg-cream border-earth-200 shadow-artisanal",
  glass: "bg-white/80 backdrop-blur-md border-white/20 shadow-glass",
};

const lineThemeClasses = {
  "alma-terra": {
    accent: "text-alma-primary",
    badge: "bg-alma-primary/10 text-alma-primary border-alma-primary/20",
    button: "bg-alma-primary hover:bg-alma-primary/90 text-white",
    star: "fill-alma-secondary text-alma-secondary",
    background:
      "linear-gradient(145deg, #FFEFCC 0%, #FFEFC6 50%, #FFD699 100%)",
    backgroundEnd: "#FFD699",
    border: "#9B201A",
  },
  ecos: {
    accent: "text-ecos-primary",
    badge: "bg-ecos-primary/10 text-ecos-primary border-ecos-primary/20",
    button: "bg-ecos-primary hover:bg-ecos-primary/90 text-white",
    star: "fill-ecos-secondary text-ecos-secondary",
    background:
      "linear-gradient(145deg, #B7DFE5 0%, #A5D4DB 50%, #8FC9D1 100%)",
    backgroundEnd: "#8FC9D1",
    border: "#12406F",
  },
  "jade-ritual": {
    accent: "text-jade-primary",
    badge: "bg-jade-primary/10 text-jade-primary border-jade-primary/20",
    button: "bg-jade-primary hover:bg-jade-primary/90 text-white",
    star: "fill-jade-secondary text-jade-secondary",
    background:
      "linear-gradient(145deg, #D3E1BE 0%, #C5D6AD 50%, #B7CB9C 100%)",
    backgroundEnd: "#B7CB9C",
    border: "#04412D",
  },
  umbral: {
    accent: "text-umbral-primary",
    badge: "bg-umbral-primary/10 text-umbral-primary border-umbral-primary/20",
    button: "bg-umbral-primary hover:bg-umbral-primary/90 text-white",
    star: "fill-umbral-secondary text-umbral-secondary",
    background:
      "linear-gradient(145deg, #FFF2DB 0%, #FFE8C2 50%, #FFDEA9 100%)",
    backgroundEnd: "#FFDEA9",
    border: "#EA4F12",
  },
  utopica: {
    accent: "text-utopica-primary",
    badge:
      "bg-utopica-primary/10 text-utopica-primary border-utopica-primary/20",
    button: "bg-utopica-primary hover:bg-utopica-primary/90 text-white",
    star: "fill-utopica-secondary text-utopica-secondary",
    background:
      "linear-gradient(145deg, #F9F5C5 0%, #F7F1B5 50%, #F5EDA5 100%)",
    backgroundEnd: "#F5EDA5",
    border: "#392E13",
  },
  "kits-experiencia": {
    accent: "text-brand-primary",
    badge: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    button: "bg-brand-primary hover:bg-brand-primary/90 text-white",
    star: "fill-gold-500 text-gold-500",
    background:
      "linear-gradient(145deg, #F6FBD6 0%, #F3F9C4 50%, #F0F7B2 100%)",
    backgroundEnd: "#F0F7B2",
    border: "#AE0000",
  },
  default: {
    accent: "text-brand-primary",
    badge: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    button: "bg-brand-primary hover:bg-brand-primary/90 text-white",
    star: "fill-gold-500 text-gold-500",
    background:
      "linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 50%, #F5F5F5 100%)",
    backgroundEnd: "#F5F5F5",
    border: "hsl(var(--border))",
  },
};

export default function ProductCard({
  id,
  slug,
  name,
  description,
  infoFrontal,
  price,
  originalPrice,
  category,
  imageUrl,
  rating,
  reviewCount,
  isNatural = true,
  isNew = false,
  isOnSale = false,
  stock,
  size,
  className = "",
  variant = "default",
  lineTheme = "default",
  onAddToCart,
  promotionalTag = "none",
  discountTransferPercent,
  discountCashPercent,
  installments3Enabled = false,
  installments6Enabled = false,
  showReviews = false,
}: ProductCardProps) {
  const productHref = `/productos/${slug || id}`;
  const cardSummary = description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/)[0]?.slice(0, 115) || "";

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (addedTimer.current) clearTimeout(addedTimer.current);
  }, []);

  // Use LikeContext for like functionality
  const { toggleLike, isLiked, isLoading: likeLoading } = useLike();
  const isFavorite = isLiked(id);

  const theme = lineThemeClasses[lineTheme];

  const handleAddToCart = () => {
    if (onAddToCart && stock > 0) {
      onAddToCart(id, 1);
      setIsAdded(true);
      if (addedTimer.current) clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleToggleFavorite = async () => {
    console.log("Toggle favorite clicked for product:", id);
    await toggleLike(id);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatInstallment = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  // Get discount price based on percentage
  const getDiscountPrice = (basePrice: number, discountPercent: number) => {
    if (!discountPercent || discountPercent <= 0) return null;
    return basePrice * (1 - discountPercent / 100);
  };

  // Calculate discount percent from compare_at_price (originalPrice)
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  // Promotional tag badges (DaLuz style, per-tag color scheme)
  const tagConfig = {
    lanzamiento: {
      label: "Lanzamiento",
      icon: FlameIcon,
      bgColor: "#7D1D2B",
      textColor: "#ffffff",
    },
    destacado: {
      label: "Destacado",
      icon: StarBurstIcon,
      bgColor: "#97000d",
      textColor: "#ffffff",
    },
    descuento: {
      label: discountPercent ? `-${discountPercent}%` : "Descuento",
      icon: null as typeof FlameIcon | null,
      bgColor: "#7D1D2B",
      textColor: "#ffffff",
    },
    ultimas_unidades: {
      label: "Últimas Unidades",
      icon: AlertHexagonIcon,
      bgColor: "#7D1D2B",
      textColor: "#ffffff",
    },
  };

  const renderBadge = (key: keyof typeof tagConfig) => {
    const config = tagConfig[key];
    const Icon = config.icon;
    return (
      <Badge
        key={key}
        className={cn("shadow-sm text-xs px-2 py-1", key === "descuento" && "rounded-full px-3", key === "ultimas_unidades" && "rounded-full text-[10px] px-2 py-0.5")}
        style={{
          backgroundColor: config.bgColor,
          color: config.textColor,
          fontFamily: "var(--font-montserrat), sans-serif",
          fontStyle: "normal",
          fontWeight: 500,
          border: "none",
        }}
      >
        {Icon && <Icon className="product-card-badge-icon h-3 w-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  const renderPromotionalTagBadges = () => {
    const explicitTag =
      promotionalTag && promotionalTag !== "none"
        ? (promotionalTag as keyof typeof tagConfig)
        : null;

    // Show explicit tag (if any) + discount badge (if there's a price discount and
    // the explicit tag isn't already "descuento")
    const badges: Array<keyof typeof tagConfig> = [];
    if (explicitTag) badges.push(explicitTag);
    if (discountPercent && explicitTag !== "descuento") badges.push("descuento");

    if (badges.length === 0) return null;
    return badges.map((key) => renderBadge(key));
  };

  // Calculate discounted prices
  const transferDiscountPrice = discountTransferPercent
    ? getDiscountPrice(price, discountTransferPercent)
    : null;
  const cashDiscountPrice = discountCashPercent
    ? getDiscountPrice(price, discountCashPercent)
    : null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 transition-colors ${index < Math.floor(rating) ? theme.star : "text-gray-300"
          }`}
      />
    ));
  };

  return (
    <Card
      className={cn(
        "product-card group relative overflow-hidden transition-all duration-500 flex flex-col box-border",
        "hover:shadow-xl h-[480px] sm:h-[520px] lg:h-[540px]",
        className,
      )}
      style={{
        pointerEvents: "auto",
        borderRadius: "0px 15px",
        background: "#fff2e9",
        borderColor: lineTheme !== "default" ? `${theme.border}33` : undefined,
        borderWidth: lineTheme !== "default" ? "1px" : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-col h-full box-border">
        {/* Product Image - 40% of card height */}
        <div className="relative h-[192px] sm:h-[208px] lg:h-[216px] overflow-hidden bg-gradient-to-br from-bg-light to-bg-cream flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          <Link href={productHref} aria-label={`Ver ${name}`} className="absolute inset-0 block">
          <Image
            src={
              imageUrl && !imageUrl.startsWith("file://")
                ? imageUrl
                : "/images/placeholder-product.jpg"
            }
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700",
              "group-hover:scale-110 group-hover:brightness-105",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          </Link>

          {/* Top Left Overlay Badges (all promotional tags) */}
          <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1 max-w-[calc(100%-1rem)]">
            {renderPromotionalTagBadges()}
          </div>

          {/* Like Button - Bottom Right */}
          <div className="absolute bottom-2 right-2 z-20">
            <Heart
              className={cn(
                "h-5 w-5 sm:h-6 sm:w-6 cursor-pointer transition-all duration-300 hover:scale-110 drop-shadow-md",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-white/90 hover:text-red-500 hover:fill-red-500",
                likeLoading && "opacity-50",
              )}
              onClick={handleToggleFavorite}
            />
          </div>

          {/* Hover Overlay - Ver Producto */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <Link href={productHref} className="block">
              <div className="bg-white/90 text-gray-800 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 text-xs sm:text-sm">
                Ver producto
              </div>
            </Link>
          </div>

          {/* Stock Warning */}
          {stock <= 5 && stock > 0 && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
              <Badge
                variant="outline"
                className="bg-white/95 text-orange-600 border-orange-300 shadow-md backdrop-blur-sm animate-pulse-gentle text-[10px] sm:text-xs px-1.5 py-0.5"
              >
                ¡Solo {stock}!
              </Badge>
            </div>
          )}

          {stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm pointer-events-none">
              <Badge
                variant="secondary"
                className="bg-white text-gray-800 shadow-xl px-4 py-2 text-base"
              >
                Sin Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent padding="none" className="flex min-h-0 flex-1 flex-col p-2 sm:p-3">
          <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
            <Link href={productHref} className="block group/link">
              <h3 className="product-card-title line-clamp-2 text-center text-lg font-semibold leading-tight transition-colors lg:text-2xl" style={{ fontFamily: "var(--font-cormorant), serif" }}>{name}</h3>
              <div className="mx-auto mt-1.5 h-px w-3/5" style={{ background: "linear-gradient(to right, transparent, #920000 50%, transparent)" }} />
            </Link>
            {infoFrontal && <p className="line-clamp-2 text-[11px] font-medium leading-snug text-[#7D1D2B]/80" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{infoFrontal}</p>}
            {cardSummary && <p className="line-clamp-2 text-[11px] leading-snug text-[#7D1D2B]/80" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{cardSummary}</p>}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-[#4A0D10] lg:text-xl">{formatPrice(price)}</span>
              {originalPrice && originalPrice > price && <span className="text-xs text-text-secondary line-through">{formatPrice(originalPrice)}</span>}
            </div>
            {originalPrice && originalPrice > price && <p className="text-xs font-medium text-[#7D1D2B]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Ahorrás {formatPrice(originalPrice - price)}</p>}
            {(installments3Enabled || installments6Enabled || transferDiscountPrice || cashDiscountPrice) && (
              <div className="flex flex-col gap-1 text-xs text-[#7D1D2B]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {installments3Enabled && <div className="flex items-center gap-1.5 rounded-md border border-[#4A0D10]/15 bg-[#FFF2E9] px-2 py-1"><CreditCard className="h-3.5 w-3.5 shrink-0" /><span>3 cuotas sin interés de {formatInstallment(price / 3)}</span></div>}
                {installments6Enabled && <div className="flex items-center gap-1.5 rounded-md border border-[#4A0D10]/15 bg-[#FFF2E9] px-2 py-1"><CreditCard className="h-3.5 w-3.5 shrink-0" /><span>6 cuotas sin interés de {formatInstallment(price / 6)}</span></div>}
                {transferDiscountPrice && <p className="product-card-payment-detail text-xs font-normal leading-snug text-[#7D1D2B]/80">Transferencia: {formatPrice(transferDiscountPrice)}{discountTransferPercent ? ` (-${discountTransferPercent}%)` : ""}</p>}
                {cashDiscountPrice && <p className="product-card-payment-detail text-xs font-normal leading-snug text-[#7D1D2B]/80">Efectivo: {formatPrice(cashDiscountPrice)}{discountCashPercent ? ` (-${discountCashPercent}%)` : ""}</p>}
              </div>
            )}
            {showReviews && reviewCount > 0 && <div className="flex items-center gap-1.5" aria-label={`${rating} de 5 estrellas, ${reviewCount} reseñas`}><div className="flex items-center gap-0.5">{renderStars(rating)}</div><span className="text-xs text-[#7D1D2B]/80">({reviewCount})</span></div>}
            {size && <div className="flex items-center text-xs text-text-secondary"><Sparkles className="mr-1 h-3 w-3 text-gold-500" /><span>{size}</span></div>}
          </div>
          <div className="mt-auto flex shrink-0 gap-2 pt-2">
            <Link href={productHref} className="alkimya-cta-outline flex h-11 min-w-0 flex-1 items-center justify-center rounded-[0_15px] px-2 text-center text-xs font-bold uppercase tracking-wider shadow-[0_4px_10px_rgba(74,13,16,0.18)]" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Ver Alkimya</Link>
            <Button onClick={handleAddToCart} disabled={stock === 0} data-added={isAdded} className="alkimya-card-add h-11 min-w-0 flex-1 rounded-[0_15px] px-2 text-xs font-bold uppercase tracking-wider shadow-[0_4px_10px_rgba(74,13,16,0.18)] disabled:opacity-50" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{stock > 0 ? isAdded ? "✓ ¡AÑADIDO!" : <><ShoppingCart className="mr-1 h-3.5 w-3.5 shrink-0" />Añadir</> : "Sin stock"}</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
