import sanitizeHtml from "sanitize-html";

const allowedTags = ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "div"];

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags,
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

/** Accept existing plain text, Markdown emphasis, and basic legacy HTML. */
export function normalizeProductRichText(value: string): string {
  if (!value?.trim()) return "";

  if (/<\/?(?:p|br|strong|b|em|i|u|ul|ol|li|div)\b/i.test(value)) {
    return sanitizeHtml(value, sanitizeOptions);
  }

  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__([\s\S]+?)__/g, "<u>$1</u>")
    .replace(/\*([\s\S]+?)\*/g, "<em>$1</em>");

  return escaped
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function sanitizeProductRichText(value: string): string {
  return sanitizeHtml(normalizeProductRichText(value), sanitizeOptions);
}

export function productRichTextPlainText(value: string): string {
  return sanitizeHtml(normalizeProductRichText(value), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .trim();
}
