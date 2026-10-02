import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { beforeAll, afterAll, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
// Real Supabase Auth, catalog, config, checkout repositories and payment RPCs.
// Only Next's request cookie context and outbound email provider are replaced.
vi.mock('next/headers',()=>({cookies:()=>({get:()=>undefined,getAll:()=>[],set:()=>{}})}));
vi.mock('@/lib/email/notifications',()=>({EmailNotificationService:{
  sendBankTransferInstructions:vi.fn(async()=>true),
  prepareOrderConfirmation:vi.fn(async()=>({templateId:null,message:{to:'test@example.invalid',subject:'synthetic',html:'synthetic'}})),
}}));
vi.mock('@/lib/email/template-loader',()=>({incrementTemplateUsage:vi.fn(async()=>{})}));
vi.mock('@/lib/email/durable-delivery',()=>({
  EmailDeliveryError:class extends Error { manualReview=false; },
  deliverPreparedEmail:vi.fn(async()=> 'synthetic-provider'),
}));

const config=JSON.parse(readFileSync('.local-verification/test-supabase.json','utf8'));
if(config.url!=='https://pdxgpfnxsewulpieqdrf.supabase.co') throw new Error('Test project required');
process.env.NEXT_PUBLIC_SUPABASE_URL=config.url;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=config.anon;
process.env.SUPABASE_SERVICE_ROLE_KEY=config.key;
const db=createClient(config.url,config.key,{auth:{persistSession:false,autoRefreshToken:false}});
const client=createClient(config.url,config.anon,{auth:{persistSession:false,autoRefreshToken:false}});
const pid=randomUUID(); const email=`tirada3-${randomUUID()}@example.invalid`;
let uid:string; let token:string; let oid:string;
const keys=['bank_transfer_bank','bank_transfer_holder','bank_transfer_cbu','bank_transfer_alias','bank_transfer_cuit','whatsapp_phone'];
function checked<R extends {data:unknown;error:unknown}>(res:R):R['data'] {if(res.error) throw res.error; return res.data;}
beforeAll(async()=>{
  const password=randomUUID()+'Aa1!';
  const user=checked(await db.auth.admin.createUser({email,password,email_confirm:true})); uid=user.user!.id;
  token=checked(await client.auth.signInWithPassword({email,password})).session!.access_token;
  checked(await db.from('products').insert({id:pid,name:'Synthetic checkout',slug:pid,price:500,status:'active',inventory_quantity:10,stock_quantity:10,discount_transfer_percent:10}));
  const values=['Test bank','Synthetic holder','0000000000000000000000','test.only.alias','00000000000','5490000000000'];
  checked(await db.from('system_config').insert(keys.map((config_key,i)=>({config_key,config_value:JSON.stringify(values[i])}))));
});
afterAll(async()=>{
  const orders=checked(await db.from('orders').select('id').eq('email',email))||[];
  for(const o of orders){checked(await db.from('payment_effects').delete().eq('order_id',o.id)); checked(await db.from('order_items').delete().eq('order_id',o.id)); checked(await db.from('orders').delete().eq('id',o.id));}
  checked(await db.from('stock_movements').delete().eq('product_id',pid));
  checked(await db.from('products').delete().eq('id',pid));
  checked(await db.from('system_config').delete().in('config_key',keys));
  if(uid) checked(await db.auth.admin.deleteUser(uid));
});
it('real authenticated transfer checkout, concurrent confirmations, exclusive workers and delivery recovery',async()=>{
  const {POST}=await import('@/app/api/checkout/route');
  const {OrdersRepository}=await import('@/lib/repositories/orders.repository');
  const {PaymentEffectsRepository}=await import('@/lib/repositories/payment-effects.repository');
  const {PaymentEffectsService}=await import('@/lib/services/payment-effects.service');
  const {deliverPreparedEmail}=await import('@/lib/email/durable-delivery');
  const payload={paymentMethod:'bank_transfer',items:[{productId:pid,name:'Client name',price:500,quantity:2}],customerInfo:{email,firstName:'Synthetic',lastName:'Customer',address:'Test street',addressNumber:'123',city:'Test',postalCode:'5000'}};
  function request(body:unknown,auth=true){return new NextRequest('http://localhost/api/checkout',{method:'POST',headers:{'content-type':'application/json',...(auth?{authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)});}
  expect((await POST(request(payload,false))).status).toBe(401);
  expect((await POST(request({...payload,items:[{...payload.items[0],price:1}]}))).status).toBe(409);
  const response=await POST(request(payload)); expect(response.status).toBe(200);
  const body=await response.json(); expect(body.method).toBe('bank_transfer'); oid=body.redirectUrl.split('/').pop();
  const orders=new OrdersRepository(db); const order=await orders.findById(oid);
  expect(order).toMatchObject({user_id:uid,subtotal:1000,discount_amount:100,total_amount:900,currency:'ARS',payment_status:'awaiting_transfer',shipping_address_1:'Test street 123'});
  expect(new Date(order.transfer_expires_at).getTime()-new Date(order.created_at).getTime()).toBeGreaterThan(71.99*3600000);
  expect(new Date(order.transfer_expires_at).getTime()-new Date(order.created_at).getTime()).toBeLessThan(72.01*3600000);
  // Eight independent HTTP RPC requests compete for the same row lock.
  const confirmations=await Promise.all(Array.from({length:8},()=>new OrdersRepository(createClient(config.url,config.key,{auth:{persistSession:false}})).confirmPayment(order,{})));
  expect(confirmations.filter(Boolean)).toHaveLength(1);
  expect(checked(await db.from('products').select('inventory_quantity,stock_quantity').eq('id',pid).single())).toEqual({inventory_quantity:8,stock_quantity:8});
  expect(checked(await db.from('stock_movements').select('id').eq('product_id',pid))).toHaveLength(1);
  expect(checked(await db.from('payment_effects').select('id').eq('order_id',oid))).toHaveLength(1);
  const claims=await Promise.all(Array.from({length:8},()=>new PaymentEffectsRepository(createClient(config.url,config.key,{auth:{persistSession:false}})).claim(oid)));
  expect(claims.filter(Boolean)).toHaveLength(1);
  const effects=new PaymentEffectsRepository(db); const effect=claims.find(Boolean)!;
  await effects.prepare(effect,{templateId:null,message:{to:email,subject:'synthetic',html:'original'}} as never);
  await effects.finish(effect,{success:false,error:'synthetic network interruption'});
  // Make only our disposable task immediately available, then run the real worker.
  checked(await db.from('payment_effects').update({available_at:new Date(Date.now()-1000).toISOString()}).eq('id',effect.id));
  const worker=new PaymentEffectsService(effects,orders);
  vi.mocked(deliverPreparedEmail).mockRejectedValueOnce(new Error('synthetic provider outage'));
  expect(await worker.drain(oid)).toEqual({succeeded:0,failed:1});
  checked(await db.from('payment_effects').update({available_at:new Date(Date.now()-1000).toISOString()}).eq('id',effect.id));
  expect(await worker.drain(oid)).toEqual({succeeded:1,failed:0});
  expect(await worker.drain(oid)).toEqual({succeeded:0,failed:0});
  const calls=vi.mocked(deliverPreparedEmail).mock.calls;
  expect(calls).toHaveLength(2); expect(calls[0]).toEqual(calls[1]);
  expect(checked(await db.from('payment_effects').select('state,provider_id').eq('id',effect.id).single())).toEqual({state:'succeeded',provider_id:'synthetic-provider'});
  writeFileSync('Docs/testing/tirada3/remote-integration-result.json',JSON.stringify({project:'pdxgpfnxsewulpieqdrf',verifiedAt:new Date().toISOString(),checkout:'authenticated real Supabase Auth + repositories',discount:'10% per product, total 900 ARS',expiryHours:72,concurrentConfirmations:8,successfulConfirmations:1,concurrentClaims:8,activeClaims:1,stock:8,auditMovements:1,effects:1,recovery:'failed provider -> retry -> success, same payload and idempotency key',externalEmails:'stubbed; no real messages sent'},null,2));
});
