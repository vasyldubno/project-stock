import { supabaseClient } from "@/config/supabaseClient";
import { Dividend, ShareLots, Transaction } from "./types";
import { Dispatch, SetStateAction } from "react";
import { IUser } from "@/types/types";
import { useQuery } from "react-query";
import { ROUND } from "@/utils/round";
import moment from "moment";

export const useShareLots = (
  user: IUser | null,
  ticker: string | undefined,
  portfolioId: string
) => {
  const { data } = useQuery({
    queryKey: ["shareLots", { user, ticker }],
    queryFn: async () => {
      const supaStockPortfolio = await supabaseClient
        .from("stock_portfolio")
        .select()
        .eq("ticker", ticker)
        .eq("portfolio_id", portfolioId)
        .single();

      const supaStock = await supabaseClient
        .from("stock")
        .select()
        .eq("ticker", ticker)
        .single();

      if (supaStockPortfolio.data && supaStock.data) {
        const cost =
          Number(supaStockPortfolio.data.amount_active_shares) *
          Number(supaStockPortfolio.data.average_cost_per_share);
        const value =
          Number(supaStockPortfolio.data.amount_active_shares) *
          Number(supaStock.data.price_current);

        return {
          id: supaStock.data.id,
          averagePrice: supaStockPortfolio.data.average_cost_per_share,
          gain: ROUND(((value - cost) / cost) * 100),
          marketPrice: supaStock.data.price_current,
          shares: supaStockPortfolio.data.amount_active_shares,
          totalCost:
            Number(supaStockPortfolio.data.amount_active_shares) *
            Number(supaStockPortfolio.data.average_cost_per_share),
          tradeDate: supaStockPortfolio.data.startTradeDate,
        };
      }
    },
    enabled: !!user && !!ticker,
  });
  return data ?? null;
};

export const useDividends = (
  user: IUser | null,
  ticker: string | undefined,
  portfolioId: string
) => {
  const { data } = useQuery({
    queryKey: ["dividends", { user, ticker, portfolioId }],
    queryFn: async () => {
      const supaDividend = await supabaseClient
        .from("dividend")
        .select()
        .eq("ticker", ticker)
        .eq("portfolio_id", portfolioId);

      if (supaDividend.data) {
        const result = supaDividend.data.map((item) => ({
          payDate: moment(item.payDate).format("DD.MM.YYYY"),
          totalAmount: item.totalAmount,
          amountShares: item.amount_shares,
          amountPerShare: item.dividendValue,
        }));
        return result;
      }
    },
    enabled: !!ticker && !!portfolioId,
  });
  return data ?? null;
};

export const useTransactions = (
  user: IUser | null,
  ticker: string | undefined,
  portfolioId: string
) => {
  const { data } = useQuery({
    queryKey: ["transactions", { user, ticker, portfolioId }],
    queryFn: async () => {
      const supaTransactions = await supabaseClient
        .from("transaction")
        .select()
        .eq("ticker", ticker)
        .eq("portfolio_id", portfolioId);

      if (supaTransactions.data) {
        const result = supaTransactions.data.map((item) => ({
          count: item.count,
          date: item.date,
          price: item.price,
          type: item.type,
        }));
        return result;
      }
    },
  });
  return data ?? null;
};
