import { z } from "zod";

export const FRONT_INFO_MAX_LENGTH = 65;
export const frontInfoSchema = z.string({ invalid_type_error: "Info Frontal debe ser un texto." })
  .max(FRONT_INFO_MAX_LENGTH, "Info Frontal admite hasta 65 caracteres.")
  .nullable().optional();

export class ProductFrontInfoError extends Error {}

export function validateFrontInfo(value: unknown): string | null | undefined {
  const result = frontInfoSchema.safeParse(value);
  if (!result.success) throw new ProductFrontInfoError(result.error.issues[0].message);
  return result.data;
}
