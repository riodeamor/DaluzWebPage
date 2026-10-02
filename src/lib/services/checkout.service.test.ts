import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { CheckoutService } from './checkout.service';
import type { OrdersRepository } from '@/lib/repositories/orders.repository';
import { getMercadoPagoConfig, getMercadoPagoAccessToken } from '@/lib/mercadopago/config';
import { createServiceRoleClient } from '@/utils/supabase/server';
const provider = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn() }));
vi.mock('mercadopago', () => ({ MercadoPagoConfig: class {}, Preference: class { create = provider.create; } }));
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

describe('total enviado al proveedor', () => {
  beforeEach(() => {
    provider.create.mockReset().mockResolvedValue({ id: 'mp1', init_point: 'https://example.com/pay' });
    provider.update.mockReset().mockResolvedValue(undefined);
    vi.mocked(getMercadoPagoAccessToken).mockResolvedValue('test-token');
    vi.mocked(getMercadoPagoConfig).mockResolvedValue({ paymentMethods: [], autoReturn: false, binaryMode: false } as never);
    vi.mocked(createServiceRoleClient).mockReturnValue({ from: () => ({ select: () => ({ in: async () => ({ data: [], error: null }) }) }) } as never);
  });
  const paymentService = new CheckoutService({ update: provider.update } as unknown as OrdersRepository);
  const cart = [{ productId: 'p1', name: 'Producto', price: 10000, quantity: 1 }];
  const customer = { email: 'test@example.com', addressNumber: '123' };
  it('cobra cupón, descuento en cascada y envío con el total exacto, sin modificar catálogo', async () => {
    await paymentService.createMercadoPagoPreference({ id: 'o1', order_number: 'DL-1', total_amount: 8200 }, cart, customer);
    expect(provider.create.mock.calls[0][0].body.items).toEqual([expect.objectContaining({ quantity: 1, unit_price: 8200, currency_id: 'ARS' })]);
    expect(cart[0].price).toBe(10000);
    expect(provider.update).toHaveBeenCalledWith('o1', { mercadopago_preference_id: 'mp1' });
  });
  it('conserva las líneas originales cuando su suma coincide con el pedido', async () => {
    await paymentService.createMercadoPagoPreference({ id: 'o1', order_number: 'DL-1', total_amount: 10000 }, cart, customer);
    expect(provider.create.mock.calls[0][0].body.items).toEqual([expect.objectContaining({ id: 'p1', unit_price: 10000 })]);
  });
});
