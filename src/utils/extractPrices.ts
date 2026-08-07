const priceRegex = /R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g;

export function extractPrices(message: string): string[] {
  return message.match(priceRegex) ?? [];
}
