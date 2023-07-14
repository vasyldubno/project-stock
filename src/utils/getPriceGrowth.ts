import { StockRecord } from "@/types/xata";
import { SelectedPick } from "@xata.io/client";

export const getPriceGrowth = (
  xataStock: Readonly<SelectedPick<StockRecord, ["*"]>>
) => {
  if (xataStock.priceTarget && xataStock.priceCurrent) {
    return Number(
      (
        ((xataStock.priceTarget - xataStock.priceCurrent) /
          xataStock.priceCurrent) *
        100
      ).toFixed(2)
    );
  }
  return null;
};
