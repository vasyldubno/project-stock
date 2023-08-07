import { supabaseClient } from "@/config/supabaseClient";
import { StockPortfolioService } from "@/services/StockPortfolioService";
import { ISupaPortfolio, ISupaStockPortfolio } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

export const stockPortfolioInsert = (
  selectedPortfolio: ISupaPortfolio | null,
  setState: Dispatch<SetStateAction<ISupaStockPortfolio[] | null>>
) => {
  return supabaseClient
    .channel("stockPortfolio-insert")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "stock_portfolio",
      },
      async (payload) => {
        if (selectedPortfolio) {
          const newValue = await StockPortfolioService.getStocks(
            selectedPortfolio
          );
          setState(newValue.data);
        }
      }
    )
    .subscribe();
};

export const stockPortfolioUpdate = (
  selectedPortfolio: ISupaPortfolio | null,
  setState: Dispatch<SetStateAction<ISupaStockPortfolio[] | null>>
) => {
  return supabaseClient
    .channel("stockPortfolio-update")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "stock_portfolio",
      },
      async (payload) => {
        if (selectedPortfolio) {
          const newValue = await StockPortfolioService.getStocks(
            selectedPortfolio
          );
          setState(newValue.data);
        }
      }
    )
    .subscribe();
};

export const portfolioInsert = (
  setPortfolios: Dispatch<SetStateAction<ISupaPortfolio[] | null>>,
  setSelectedPortfolio: Dispatch<SetStateAction<ISupaPortfolio | null>>
) => {
  return supabaseClient
    .channel("portfolio-insert")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "portfolio",
      },
      (payload) => {
        const newValue = payload.new as ISupaPortfolio;
        setPortfolios((prev) => {
          if (prev) {
            [...prev, newValue];
          }
          return null;
        });
        setSelectedPortfolio(newValue);
      }
    )
    .subscribe();
};
