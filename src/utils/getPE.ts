import { StockRecord } from "@/types/xata";
import { SelectedPick } from "@xata.io/client";
import axios from "axios";

export const getPE = async (ticker: string, eps: number | null) => {
  const response = await axios.get<{ c: number }>(
    `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=cenkaeiad3i2t1u14mvgcenkaeiad3i2t1u14n00`
  );

  if (eps) {
    return Number((Number(response.data.c.toFixed(2)) / eps).toFixed(2));
  }
};
