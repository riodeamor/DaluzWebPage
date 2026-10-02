import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
vi.mock('@/contexts/CartContext',()=>({useCart:()=>({clearCart:vi.fn()})}));
import TransferInstructions from './TransferInstructions';
describe('instrucciones de transferencia',()=>{
  it('muestra CUIT y dirige el comprobante al WhatsApp configurado con el pedido',()=>{
    const html=renderToStaticMarkup(<TransferInstructions orderNumber="DL-TEST" amount="$ 1.800" cbu="1234567890123456789012" alias="prueba.alias" holder="Titular de prueba" bank="Banco de prueba" cuit="20123456789" whatsapp="5493512344580" expiresAt="4 de octubre" />);
    expect(html).toContain('20123456789');expect(html).toContain('https://wa.me/5493512344580?text=');expect(html).toContain('DL-TEST');expect(html).toContain('Enviar comprobante por WhatsApp');expect(html).toContain('prueba.alias');
  });
});
