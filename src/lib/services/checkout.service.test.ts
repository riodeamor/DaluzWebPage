import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { CheckoutService } from './checkout.service';
import type { OrdersRepository } from '@/lib/repositories/orders.repository';
vi.mock('@/lib/mercadopago/config',()=>({getMercadoPagoConfig:vi.fn(),getMercadoPagoAccessToken:vi.fn()}));
vi.mock('@/utils/supabase/server',()=>({createServiceRoleClient:vi.fn()}));
const insert=vi.fn();
const service=new CheckoutService({insert} as unknown as OrdersRepository);
beforeEach(()=>{vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-01T12:00:00Z'));insert.mockResolvedValue({id:'test'});});
afterEach(()=>vi.useRealTimers());
describe('creación de transferencia',()=>{
  it('mantiene 72 horas, moneda y descuento calculado por el servidor',async()=>{
    await service.createOrder('user',{email:'test@example.com',address:'Calle',addressNumber:'123'},[{productId:'p1',name:'Producto',price:1000,quantity:2}],'bank_transfer',{subtotal:2000,discount:200,total:1800});
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({payment_status:'awaiting_transfer',payment_method:'bank_transfer',currency:'ARS',subtotal:2000,discount_amount:200,total_amount:1800,transfer_expires_at:'2026-10-04T12:00:00.000Z',shipping_address_1:'Calle 123'}));
  });
});
