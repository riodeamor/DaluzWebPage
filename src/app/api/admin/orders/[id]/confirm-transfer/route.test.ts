import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
const mocks = vi.hoisted(() => ({ auth:vi.fn(), find:vi.fn(), confirm:vi.fn(), service:vi.fn() }));
vi.mock('@/lib/auth/helpers', () => ({ requireAdmin:mocks.auth, getServiceClient:mocks.service }));
vi.mock('@/lib/repositories/orders.repository', () => ({ OrdersRepository:class { findById=mocks.find; }, PaymentConflictError:class extends Error {} }));
vi.mock('@/lib/repositories/payment-effects.repository', () => ({ PaymentEffectsRepository:class {} }));
vi.mock('@/lib/services/payment-effects.service', () => ({ PaymentEffectsService:class {} }));
vi.mock('@/lib/services/order-payment.service', () => ({ OrderPaymentService:class { confirmOrderPayment=mocks.confirm; } }));
import { POST } from './route';
const call=()=>POST(new NextRequest('http://localhost/api/admin/orders/o1/confirm-transfer',{method:'POST'}),{params:{id:'o1'}});
beforeEach(()=>{vi.clearAllMocks();mocks.auth.mockResolvedValue({ok:true});mocks.find.mockResolvedValue({id:'o1',payment_method:'bank_transfer',payment_status:'awaiting_transfer'});mocks.confirm.mockResolvedValue(true);});
describe('confirmación administrativa de transferencia',()=>{
  it('rechaza usuarios no administradores antes de consultar datos',async()=>{mocks.auth.mockResolvedValue({ok:false,response:NextResponse.json({}, {status:403})});expect((await call()).status).toBe(403);expect(mocks.service).not.toHaveBeenCalled();});
  it('acepta la confirmación y permite repetirla para reanudar efectos',async()=>{expect((await call()).status).toBe(200);mocks.find.mockResolvedValue({id:'o1',payment_method:'bank_transfer',payment_status:'paid'});mocks.confirm.mockResolvedValue(false);expect((await call()).status).toBe(200);expect(mocks.confirm).toHaveBeenCalledTimes(2);});
  it('rechaza otro medio de pago',async()=>{mocks.find.mockResolvedValue({payment_method:'mercadopago'});expect((await call()).status).toBe(400);expect(mocks.confirm).not.toHaveBeenCalled();});
  it('rechaza un pedido cancelado',async()=>{mocks.find.mockResolvedValue({payment_method:'bank_transfer',payment_status:'failed'});expect((await call()).status).toBe(409);expect(mocks.confirm).not.toHaveBeenCalled();});
});
