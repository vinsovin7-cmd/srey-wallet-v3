// src/data/pricingConstants.ts
export const PRICING_TIERS = {
  MINIMUM: 1.00,
  STANDARD: 2.50,
  EXECUTIVE: 5.00,
};

export const MASTER_WALLET = "UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ";

export const TON_PRICE_USD = 5.50; // Reference price for conversions

export function usdToTon(usdAmount: number): number {
  return +(usdAmount / TON_PRICE_USD).toFixed(4);
}

export function tonToUsd(tonAmount: number): number {
  return +(tonAmount * TON_PRICE_USD).toFixed(2);
}
