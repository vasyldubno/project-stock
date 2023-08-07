import { supabaseClient } from "@/config/supabaseClient";
import { ISupaStockPortfolio } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

export const supabaseStockUpdate = (
  setState: Dispatch<SetStateAction<ISupaStockPortfolio[]>>
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
        const updatedStock = await supabaseClient
          .from("stock_portfolio")
          .select()
          .eq("ticker", payload.new.ticker)
          .single();

        if (updatedStock.data) {
          setState((prev) => {
            const result = prev
              .map((item) =>
                item.ticker === payload.new.ticker ? updatedStock.data : item
              )
              .sort((a, b) => {
                if (a.price_growth === null && b.price_growth === null) {
                  return 0;
                }

                if (a.price_growth === null) {
                  return 1;
                }

                if (b.price_growth === null) {
                  return -1;
                }

                return a.price_growth - b.price_growth;
              });

            console.log(result);

            return result;
          });
        }
      }
    )
    .subscribe();
};
