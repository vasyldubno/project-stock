import { supabaseClient } from "@/config/supabaseClient";
import { PortfolioService } from "@/services/PortfolioService";
import { StockService } from "@/services/StockService";
import { ISupaStock } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

export const SupaStockUpdate = (
  setState: Dispatch<SetStateAction<ISupaStock[]>>,
  selectedScreener: "Dividend" | "Growth"
) => {
  const channel = supabaseClient
    .channel("stock-update")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "stock_portfolio",
      },
      async (payload) => {
        console.log("PAYLOAD SUPABASE", selectedScreener);
        console.log(payload);
        if (selectedScreener === "Growth") {
          const response = await PortfolioService.getStocks();

          if (response) {
            setState(response);
          }
        }

        if (selectedScreener === "Dividend") {
          const response = await StockService.getStocksDividends();

          if (response) {
            setState(response);
          }
        }
      }
    )
    .subscribe();
  return () => channel.unsubscribe();
};
