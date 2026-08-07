export function extractLowestPrice(prices: string[]): number {
  return Math.min(
    ...prices.map((price) => {
      const normalized = price
        .replace("R$", "")
        .trim()
        .split(",")[0]
        .replace(/\./g, "");

      return parseInt(normalized, 10);
    }),
  );
}
