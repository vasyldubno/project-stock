import { supabaseClient } from "@/config/supabaseClient";
import { PortfolioService } from "@/services/PortfolioService";
import { StockPortfolioService } from "@/services/StockPortfolioService";
import { ISupaPortfolio, ISupaStockPortfolio, IUser } from "@/types/types";
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
          setState(newValue ?? null);
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
          setState(newValue ?? null);
        }
      }
    )
    .subscribe();
};

export const portfolioInsert = (
  setPortfolios: Dispatch<SetStateAction<ISupaPortfolio[] | null>>,
  user: IUser | null
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
      async (payload) => {
        const portfolios = await PortfolioService.getPortfolios(user);
        if (portfolios?.data) {
          setPortfolios(portfolios.data);
        }
      }
    )
    .subscribe();
};

export const portfolioDelete = (
  setPortfolios: Dispatch<SetStateAction<ISupaPortfolio[] | null>>,
  setSelectedPortfolio: Dispatch<SetStateAction<ISupaPortfolio | null>>
) => {
  return supabaseClient
    .channel("portfolio-delete")
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "portfolio",
      },
      (payload) => {
        setPortfolios((prev) => {
          if (prev) {
            const result = prev.filter((item) => item.id !== payload.old.id);
            setSelectedPortfolio(result[0]);
            return [...result];
          }
          return null;
        });
      }
    )
    .subscribe();
};
