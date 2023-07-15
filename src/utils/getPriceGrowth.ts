import { StockRecord } from "@/types/xata";
import { SelectedPick } from "@xata.io/client";

export const getPriceGrowth = (
  priceTarget: number | null,
  priceCurrent: number | null
) => {
  if (priceTarget && priceCurrent) {
    return Number(
      (((priceTarget - priceCurrent) / priceCurrent) * 100).toFixed(2)
    );
  }
  return null;
};
