import { supabaseClient } from "@/config/supabaseClient";
import { PortfolioService } from "@/services/PortfolioService";
import { ISupaStock } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

export const SupaStockUpdate = (
  setState: Dispatch<SetStateAction<ISupaStock[]>>
) => {
  return supabaseClient
    .channel("stock-update")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "stock_portfolio",
      },
      async (payload) => {
        const response = await PortfolioService.getStocks();

        if (response) {
          setState(response);
        }

        console.log(response);
        console.log("PAYLOAD");
      }
    )
    .subscribe();
};
