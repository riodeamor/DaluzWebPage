"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, ShoppingBag, Trash2, Package, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import "./cart-sidebar.css";

export default function CartSidebar() {
  const {
    items,
    total,
    itemCount,
    isOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent
        className="cart-sidebar w-full sm:max-w-lg overflow-hidden flex flex-col p-0 text-[#FFF2E9]"
        style={{ borderRadius: '0px 15px 0 0' }}
      >
        {/* Header */}
        <SheetHeader
          className="border-b border-[#FFF2E9]/10 px-6 pb-4 pt-6 pr-16"
        >
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-title text-2xl font-medium text-[#FFF2E9]">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.2} />
              Carrito de Compras
              {itemCount > 0 && (
                <Badge className="bg-[#FFF2E9] text-[#4A0D10] font-text font-semibold">
                  {itemCount}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
              <ShoppingBag className="mb-6 h-12 w-12 text-[#FFF2E9]/60" strokeWidth={1.2} aria-hidden="true" />
              <h3 className="mb-2 font-title text-2xl font-medium text-[#FFF2E9]">
                Tu Carrito Está Vacío
              </h3>
              <p className="cart-empty-subtitle mb-6 max-w-sm text-center text-xs leading-relaxed text-[#FFF2E9]/80">
                Explorá nuestras fórmulas vivas y ceremonias para comenzar tu ritual.
              </p>
              <Link href="/productos" onClick={() => setCartOpen(false)}>
                <Button
                  className="cart-empty-action bg-[#FFF2E9] px-6 text-xs font-semibold uppercase tracking-widest text-[#4A0D10] transition-colors hover:bg-white hover:text-[#4A0D10]"
                  style={{ borderRadius: '0px 15px' }}
                >
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable */}
              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white rounded-lg border transition-all hover:shadow-md"
                    style={{
                      backgroundColor: '#FFF2E9',
                      borderStyle: 'solid',
                      borderWidth: '1px',
                      borderColor: 'rgba(74, 13, 16, 0.12)',
                      borderRadius: '0px 15px'
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/images/placeholder-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-title font-semibold text-[#4A0D10] text-sm line-clamp-2 mb-1">
                            {item.name}
                          </h4>
                          {item.size && (
                            <p className="text-xs text-[#4A0D10] font-text">
                              Talle: {item.size}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-[#4A0D10]/60 hover:text-[#4A0D10] hover:bg-[#4A0D10]/10 flex-shrink-0"
                          onClick={() => removeItem(item.id)}
                          style={{ borderRadius: '0px 15px' }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center border rounded-md overflow-hidden"
                          style={{
                            borderColor: '#4A0D10',
                            borderRadius: '0px 15px'
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#4A0D10] hover:bg-[#7D1D2B] hover:text-white"
                            aria-label={`Quitar una unidad de ${item.name}`}
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            style={{ borderRadius: 0 }}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="px-3 text-sm font-text font-medium text-[#4A0D10] min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#4A0D10] hover:bg-[#7D1D2B] hover:text-white"
                            aria-label={`Agregar una unidad de ${item.name}`}
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            style={{ borderRadius: 0 }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-title font-bold text-[#4A0D10] text-base">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-xs text-[#4A0D10]/50 line-through font-text">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </p>
                          )}
                          {item.quantity > 1 && (
                            <p className="text-xs text-[#4A0D10] font-text">
                              {formatPrice(item.price)} c/u
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Low Stock Warning */}
                      {item.stock <= 5 && (
                        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded font-text"
                          style={{ borderRadius: '0px 15px' }}
                        >
                          <Package className="h-3 w-3" />
                          Solo quedan {item.stock} en stock
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer - Fixed */}
              <div
                className="space-y-4 border-t border-[#FFF2E9]/10 px-6 pb-6 pt-4"
              >
                {/* Order Summary */}
                {(() => {
                  const blocking = items.filter(
                    (i) => !i.installments3Enabled,
                  );
                  const eligible = items.filter(
                    (i) => i.installments3Enabled,
                  );
                  if (blocking.length === 0 || eligible.length === 0) return null;
                  const blockingNames = blocking.map((i) => i.name).join(", ");
                  return (
                    <div
                      className="flex gap-2 p-3 rounded-lg text-xs leading-relaxed"
                      style={{
                        backgroundColor: "#FEF3C7",
                        border: "1px solid #FCD34D",
                        color: "#92400E",
                        borderRadius: "0px 15px",
                      }}
                    >
                      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>{blockingNames}</strong>{" "}
                        {blocking.length === 1 ? "no tiene" : "no tienen"} 3
                        cuotas sin interés habilitadas. Si{" "}
                        {blocking.length === 1 ? "lo retirás" : "los retirás"} del
                        carrito, podés pagar el resto en 3 cuotas sin interés.
                      </div>
                    </div>
                  );
                })()}

                <div
                  className="space-y-3 p-4 rounded-lg"
                  style={{
                    backgroundColor: '#FFF2E9',
                    borderRadius: '0px 15px',
                    border: '1px solid rgba(74, 13, 16, 0.12)'
                  }}
                >
                  <div className="flex justify-between text-sm font-text">
                    <span className="text-[#4A0D10]/70">Subtotal:</span>
                    <span className="text-[#4A0D10] font-medium">{formatPrice(total)}</span>
                  </div>
                  <Separator className="my-2 bg-[#4A0D10]/20" />
                  <div className="flex justify-between font-title text-lg">
                    <span className="text-[#4A0D10] font-bold">Total:</span>
                    <span className="text-[#4A0D10] font-bold">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-[#4A0D10]/70 font-text pt-1">
                    El costo de envío se coordina por separado.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block" onClick={() => setCartOpen(false)}>
                    <Button
                      className="alkimya-cta w-full font-text font-semibold py-6 text-base"
                      style={{ borderRadius: '0px 15px' }}
                    >
                      Finalizar Compra
                    </Button>
                  </Link>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCartOpen(false)}
                      className="alkimya-cta-outline flex-1 font-text font-semibold"
                      style={{ borderRadius: '0px 15px' }}
                    >
                      Seguir Comprando
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="font-text text-[#FFF2E9]/80 hover:bg-[#FFF2E9]/10 hover:text-white"
                      style={{ borderRadius: '0px 15px' }}
                    >
                      Vaciar
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
