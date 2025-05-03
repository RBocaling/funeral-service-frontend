import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getLocalStorage = (key: string): any =>
  JSON.parse(window.localStorage.getItem(key) || "null");
const setLocalStorage = (key: string, value: any): void =>
  window.localStorage.setItem(key, JSON.stringify(value));

export { getLocalStorage, setLocalStorage };
type PriceParam = {
  price: number;
};

type PriceRange = 
  | { range: "No Range" }
  | { range: number }
  | { range: { min: number; max: number } };

export const getPriceRange = (prices: PriceParam[]): PriceRange => {
  if (!prices.length) {
    return { range: "No Range" };
  }

  const priceValues = prices.map(p => p.price);

  if (priceValues.length === 1) {
    return { range: priceValues[0] };
  }

  const min = Math.min(...priceValues);
  const max = Math.max(...priceValues);

  return { range: { min, max } };
};


export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(amount);
};