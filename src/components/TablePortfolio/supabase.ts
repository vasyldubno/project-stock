import { supabaseClient } from "@/config/supabaseClient";
import { IPortfolioStock } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

export const supabaseStockUpdate = (
  setState: Dispatch<SetStateAction<IPortfolioStock[]>>
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
        console.log("PAYLOAD");
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
                if (
                  a.gain_unrealized_percentage === null &&
                  b.gain_unrealized_percentage === null
                ) {
                  return 0;
                }

                if (a.gain_unrealized_percentage === null) {
                  return 1;
                }

                if (b.gain_unrealized_percentage === null) {
                  return -1;
                }

                return (
                  b.gain_unrealized_percentage - a.gain_unrealized_percentage
                );
              });

            return result;
          });
        }
      }
    )
    .subscribe();
};
