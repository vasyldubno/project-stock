import { StockRecord } from "@/types/xata";
import { SelectedPick } from "@xata.io/client";
import axios from "axios";

export const getPE = async (
  xataStock: Readonly<SelectedPick<StockRecord, ["*"]>>
) => {
  if (xataStock) {
    const response = await axios.get<{ c: number }>(
      `https://finnhub.io/api/v1/quote?symbol=${xataStock.ticker}&token=cenkaeiad3i2t1u14mvgcenkaeiad3i2t1u14n00`
    );

    if (response && xataStock.eps) {
      return Number(
        (Number(response.data.c.toFixed(2)) / xataStock.eps).toFixed(2)
      );
    }
  }
  return null;
};
