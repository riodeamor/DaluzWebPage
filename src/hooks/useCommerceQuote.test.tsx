// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { useCommerceQuote } from "./useCommerceQuote";
const items = [{ id: "p1", productId: "p1", name: "Producto", price: 100, quantity: 1, stock: 10, image: "" }];
let root: Root, host: HTMLDivElement;
function Harness({ cp = "5000", code = "" }: { cp?: string; code?: string }) {
  const result = useCommerceQuote(items, cp, code);
  return <output>{JSON.stringify(result)}</output>;
}
beforeEach(() => {
  vi.useFakeTimers();
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.useRealTimers(); vi.unstubAllGlobals(); });
const result = () => JSON.parse(host.textContent!);
describe("cotización dinámica en interfaz", () => {
  it("invalida el total al cambiar CP y revalida al volver a aplicar el mismo cupón", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ quote: { total: 110 } }) });
    vi.stubGlobal("fetch", fetcher);
    await act(async () => root.render(<Harness code="PROMO" />));
    expect(result().pending).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(251); });
    expect(result().quote.total).toBe(110);
    await act(async () => root.render(<Harness cp="8000" code="PROMO" />));
    expect(result().quote).toBe(null);
    await act(async () => { await vi.advanceTimersByTimeAsync(251); });
    await act(async () => window.dispatchEvent(new Event("daluz-quote-refresh")));
    await act(async () => { await vi.advanceTimersByTimeAsync(251); });
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(JSON.parse(fetcher.mock.calls[2][1].body)).toMatchObject({ postalCode: "8000", couponCode: "PROMO" });
  });
  it("descarta respuestas anteriores cuando el carrito cambia", async () => {
    let finish: (value: unknown) => void = () => {};
    vi.stubGlobal("fetch", vi.fn().mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValue({ ok: true, json: async () => ({ quote: { total: 300 } }) }));
    await act(async () => root.render(<Harness />));
    await act(async () => { await vi.advanceTimersByTimeAsync(251); });
    await act(async () => root.render(<Harness cp="8000" />));
    await act(async () => { await vi.advanceTimersByTimeAsync(251); });
    await act(async () => finish({ ok: true, json: async () => ({ quote: { total: 110 } }) }));
    expect(result().quote.total).toBe(300);
  });
  it("un fallo del backend elimina el total anterior y muestra el error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Cupón agotado" }) }));
    await act(async () => root.render(<Harness code="PROMO" />));
    await act(async () => { await vi.advanceTimersByTimeAsync(251); });
    expect(result()).toMatchObject({ quote: null, pending: false, error: "Cupón agotado" });
  });
});
