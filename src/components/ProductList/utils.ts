import type Product from "./types";

export const calculateTotalPriceByCategory = (
  products: Product[],
  category: string
): number => {
  return products
    .filter((product) => product.category === category)
    .reduce((acc, product) => acc + product.price, 0);
};
