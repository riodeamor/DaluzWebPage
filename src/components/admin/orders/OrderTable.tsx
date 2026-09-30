"use client";

import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Mail,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { Order } from "@/types/admin";
import { formatCurrency as formatPrice, getStatusLabel, getStatusColor } from "@/lib/admin-display";

interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
  updating?: string | null;
  deletingOrder?: string | null;
  currentPage?: number;
  totalPages?: number;
  totalOrders?: number;
  ordersPerPage?: number;
  onUpdateStatus?: (orderId: string, status: string) => void;
  onUpdatePaymentStatus?: (orderId: string, status: string) => void;
  onViewDetails?: (order: Order) => void;
  onSendNotification?: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
  onPageChange?: (page: number) => void;
}

// Helpers

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadge(status: string) {
  const colors = getStatusColor(status);
  return <Badge style={{ backgroundColor: colors.bg, color: colors.text }}>{getStatusLabel(status)}</Badge>;
}

const getPaymentBadge = getStatusBadge;

function OrderActions({
  order,
  onViewDetails,
  onUpdateStatus,
  onSendNotification,
  onDeleteOrder,
  isU,
  isD,
}: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Más acciones para pedido"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onViewDetails && (
          <DropdownMenuItem onClick={() => onViewDetails(order)}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {order.payment_method === "bank_transfer" &&
          order.payment_status === "awaiting_transfer" && (
            <DropdownMenuItem
              onClick={async () => {
                if (
                  !confirm(
                    `¿Confirmar que recibiste la transferencia del pedido ${order.order_number}? Esto descuenta stock y le avisa al cliente.`,
                  )
                ) {
                  return;
                }
                const res = await fetch(
                  `/api/admin/orders/${order.id}/confirm-transfer`,
                  { method: "POST" },
                );
                if (res.ok) {
                  window.location.reload();
                } else {
                  const data = await res.json();
                  alert(data.error || "No se pudo confirmar");
                }
              }}
            >
              <Package className="h-4 w-4 mr-2" />
              Confirmar transferencia
            </DropdownMenuItem>
          )}
        {order.status === "pending" && onUpdateStatus && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(order.id, "processing")}
            disabled={isU}
          >
            <Package className="h-4 w-4 mr-2" />
            Procesando
          </DropdownMenuItem>
        )}
        {order.status === "processing" && onUpdateStatus && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(order.id, "shipped")}
            disabled={isU}
          >
            <Truck className="h-4 w-4 mr-2" />
            Enviado
          </DropdownMenuItem>
        )}
        {(order.status === "shipped" || order.status === "delivered") &&
          onUpdateStatus && (
            <DropdownMenuItem
              onClick={() => onUpdateStatus(order.id, "completed")}
              disabled={isU}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completado
            </DropdownMenuItem>
          )}
        <DropdownMenuSeparator />
        {onSendNotification && (
          <DropdownMenuItem onClick={() => onSendNotification(order)}>
            <Mail className="h-4 w-4 mr-2" />
            Notificación
          </DropdownMenuItem>
        )}
        {order.mp_payment_id && (
          <DropdownMenuItem asChild>
            <a
              href={`https://www.mercadopago.com.ar/activities?id=${order.mp_payment_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              MercadoPago
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {onDeleteOrder && (
          <DropdownMenuItem
            onClick={() => onDeleteOrder(order.id)}
            disabled={isD}
            className="text-[#AE0000]"
          >
            {isD ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </>
            )}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusSelector({ value, onValueChange, disabled, type }: any) {
  const statusColor = getStatusColor(value);


  const opts =
    type === "order"
      ? [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "completed",
          "cancelled",
          "refunded",
        ]
      : ["pending", "paid", "failed", "refunded"];

  const label = getStatusLabel(value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className="w-[120px] h-8 px-2 border-0 bg-transparent focus:ring-0 shadow-none hover:bg-opacity-80 transition-all cursor-pointer"
        style={{
          padding: "4px 8px",
          backgroundColor: statusColor.bg,
        }}
      >
        <SelectValue>
          {/* Badge simple con indicador de editable */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: statusColor.text }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusColor.text }}
            />
            {label}
            <svg
              className="w-3 h-3 ml-0.5 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className="min-w-[150px]"
        style={{
          backgroundColor: "var(--admin-bg-primary)",
          border: "1px solid var(--admin-border-secondary)",
        }}
      >
        {opts.map((status) => {
          const optColor = getStatusColor(status);
          const optLabel = getStatusLabel(status);
          return (
            <SelectItem
              key={status}
              value={status}
              className="text-xs py-2 cursor-pointer"
              style={{
                color:
                  value === status
                    ? optColor.text
                    : "var(--admin-text-primary)",
                backgroundColor: value === status ? optColor.bg : "transparent",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: optColor.text }}
                />
                <span>{optLabel}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

const OrderTable = memo(function OrderTable(props: OrderTableProps) {
  const {
    orders,
    loading,
    updating,
    deletingOrder,
    currentPage = 1,
    totalPages = 1,
    totalOrders = 0,
    ordersPerPage = 10,
    onUpdateStatus,
    onUpdatePaymentStatus,
    onViewDetails,
    onSendNotification,
    onDeleteOrder,
    onPageChange,
  } = props;
  const isUpdating = (id: string) => updating === id;

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "var(--admin-bg-tertiary)" }}>
              <TableHead
                className="font-semibold"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Pedido
              </TableHead>
              <TableHead
                className="font-semibold"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Cliente
              </TableHead>
              <TableHead
                className="font-semibold"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Fecha
              </TableHead>
              <TableHead
                className="font-semibold"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Estado
              </TableHead>
              <TableHead
                className="font-semibold"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Pago
              </TableHead>
              <TableHead
                className="font-semibold"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Total
              </TableHead>
              <TableHead
                className="w-[50px]"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={order.id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? "var(--admin-bg-primary)"
                      : "var(--admin-bg-tertiary)",
                  borderBottom: "1px solid var(--admin-border-secondary)",
                }}
                className="hover:bg-opacity-50 transition-colors"
              >
                <TableCell className="py-4">
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: "var(--admin-accent-secondary)" }}
                    >
                      #{order.order_number}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--admin-text-tertiary)" }}
                    >
                      {(order.order_items || []).length} producto
                      {(order.order_items || []).length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: "var(--admin-text-primary)" }}
                    >
                      {order.customer_name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--admin-text-secondary)" }}
                    >
                      {order.customer_email}
                    </p>
                  </div>
                </TableCell>
                <TableCell
                  className="py-4 text-sm"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  {formatDate(order.created_at)}
                </TableCell>
                <TableCell className="py-4">
                  {onUpdateStatus ? (
                    <StatusSelector
                      type="order"
                      value={order.status}
                      onValueChange={(v: string) => onUpdateStatus(order.id, v)}
                      disabled={isUpdating(order.id)}
                    />
                  ) : (
                    getStatusBadge(order.status)
                  )}
                </TableCell>
                <TableCell className="py-4">
                  {onUpdatePaymentStatus ? (
                    <StatusSelector
                      type="payment"
                      value={order.payment_status}
                      onValueChange={(v: string) =>
                        onUpdatePaymentStatus(order.id, v)
                      }
                      disabled={isUpdating(order.id)}
                    />
                  ) : (
                    getPaymentBadge(order.payment_status)
                  )}
                </TableCell>
                <TableCell
                  className="py-4 font-bold"
                  style={{ color: "var(--admin-success)" }}
                >
                  {formatPrice(order.total_amount)}
                </TableCell>
                <TableCell className="py-4">
                  <OrderActions
                    order={order}
                    onViewDetails={onViewDetails}
                    onUpdateStatus={onUpdateStatus}
                    onSendNotification={onSendNotification}
                    onDeleteOrder={onDeleteOrder}
                    isU={isUpdating(order.id)}
                    isD={deletingOrder === order.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {orders.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: "var(--admin-text-tertiary)" }}
          />
          <p style={{ color: "var(--admin-text-secondary)" }}>No hay pedidos</p>
        </div>
      )}

      {totalPages > 1 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4"
          style={{ borderTop: "1px solid var(--admin-border-secondary)" }}
        >
          {/* Info */}
          <div
            className="text-sm order-2 sm:order-1"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            Mostrando <strong>{(currentPage - 1) * ordersPerPage + 1}</strong> a{" "}
            <strong>
              {Math.min(currentPage * ordersPerPage, totalOrders)}
            </strong>{" "}
            de <strong>{totalOrders}</strong> pedidos
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              style={{
                borderColor: "var(--admin-border-secondary)",
                color: "var(--admin-text-primary)",
              }}
            >
              ← Anterior
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2)
                pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  disabled={loading}
                  style={{
                    backgroundColor:
                      currentPage === pageNum
                        ? "var(--admin-bg-secondary)"
                        : "transparent",
                    color:
                      currentPage === pageNum
                        ? "white"
                        : "var(--admin-text-primary)",
                    borderColor: "var(--admin-border-secondary)",
                  }}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onPageChange?.(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || loading}
              style={{
                borderColor: "var(--admin-border-secondary)",
                color: "var(--admin-text-primary)",
              }}
            >
              Siguiente →
            </Button>
          </div>
        </div>
      )}
    </>
  );
});

export default OrderTable;
