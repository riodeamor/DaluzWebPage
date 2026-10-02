import { it, expect, vi, afterEach } from "vitest";
import { compressImage, IMAGE_LIMIT } from "./compress-image";
afterEach(() => vi.unstubAllGlobals());
it("reduce tamaño y calidad hasta obtener WebP inferior al límite", async () => {
  const close = vi.fn();
  vi.stubGlobal("createImageBitmap", async () => ({
    width: 4000,
    height: 3000,
    close,
  }));
  let calls = 0;
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({ drawImage: vi.fn() }),
    toBlob: (cb: (b: Blob) => void) =>
      cb(
        new Blob([new Uint8Array(++calls < 5 ? IMAGE_LIMIT + 1 : 1000)], {
          type: "image/webp",
        }),
      ),
  };
  vi.stubGlobal("document", { createElement: () => canvas });
  const file = await compressImage(
    new File(["image"], "foto.png", { type: "image/png" }),
  );
  expect(file.type).toBe("image/webp");
  expect(file.size).toBeLessThan(IMAGE_LIMIT);
  expect(canvas.width).toBeLessThan(2400);
  expect(close).toHaveBeenCalledOnce();
});
it("rechaza imágenes que no cumplen el límite", async () => {
  const close = vi.fn();
  vi.stubGlobal("createImageBitmap", async () => ({
    width: 4000,
    height: 3000,
    close,
  }));
  vi.stubGlobal("document", {
    createElement: () => ({
      getContext: () => ({ drawImage: vi.fn() }),
      toBlob: (cb: (b: Blob) => void) =>
        cb(new Blob([new Uint8Array(IMAGE_LIMIT)], { type: "image/webp" })),
    }),
  });
  await expect(
    compressImage(new File(["image"], "foto.png", { type: "image/png" })),
  ).rejects.toThrow("800 KB");
  expect(close).toHaveBeenCalledOnce();
});
