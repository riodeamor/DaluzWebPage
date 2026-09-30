import { sanitizeProductRichText } from "@/lib/products/rich-text";
import { cn } from "@/lib/utils";

interface ProductRichTextProps {
  content: string;
  className?: string;
}

export default function ProductRichText({ content, className }: ProductRichTextProps) {
  if (!content) return null;
  return (
    <div
      className={cn("product-rich-text", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeProductRichText(content) }}
    />
  );
}
