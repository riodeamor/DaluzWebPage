export const IMAGE_LIMIT = 800 * 1024;
export async function compressImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp|avif)$/i.test(file.type))
    throw new Error("Usá una imagen JPEG, PNG, WebP o AVIF.");
  if (file.size > 30 * 1024 * 1024)
    throw new Error("La imagen original supera 30 MB.");
  const image = await createImageBitmap(file);
  try {
    if (image.width * image.height > 80000000)
      throw new Error("La imagen tiene demasiados píxeles.");
    let dimension = Math.min(2400, Math.max(image.width, image.height));
    for (
      let resize = 0;
      resize < 8;
      resize++, dimension = Math.floor(dimension * 0.8)
    ) {
      const ratio = Math.min(
        1,
        dimension / Math.max(image.width, image.height),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * ratio));
      canvas.height = Math.max(1, Math.round(image.height * ratio));
      const context = canvas.getContext("2d");
      if (!context)
        throw new Error("Tu navegador no permite comprimir imágenes.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.9, 0.75, 0.6, 0.45]) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/webp", quality),
        );
        if (blob?.type === "image/webp" && blob.size < IMAGE_LIMIT)
          return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", {
            type: "image/webp",
          });
      }
    }
    throw new Error("No pudimos reducir la imagen a menos de 800 KB.");
  } finally {
    image.close();
  }
}
