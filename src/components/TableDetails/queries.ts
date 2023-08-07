import { supabaseClient } from "@/config/supabaseClient";
import { Dividend, ShareLots, Transaction } from "./types";
import { Dispatch, SetStateAction } from "react";

export const getData = async ({
  ticker,
  setDividends,
  setTransactions,
  setShareLots,
}: {
  ticker: string | undefined;
  setDividends: Dispatch<SetStateAction<Dividend[]>>;
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  setShareLots: Dispatch<SetStateAction<ShareLots[]>>;
}) => {
  const responseDividend = await supabaseClient
    .from("dividend")
    .select()
    .eq("ticker", ticker)
    .order("payDate", { ascending: false });

  const responseTransaction = await supabaseClient
    .from("transaction")
    .select()
    .eq("ticker", ticker)
    .order("date", { ascending: false });

  const responseShareLots = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("ticker", ticker)
    .gt("amount_active_shares", 0);

  if (responseDividend.data) {
    const dividends: Dividend[] = responseDividend.data.map((item) => ({
      payDate: item.payDate,
      totalAmount: item.totalAmount,
      amountShares: item.amount_shares,
      amountPerShare: item.dividendValue,
    }));
    setDividends(dividends);
  }

  if (responseTransaction.data) {
    const transactions: Transaction[] = responseTransaction.data.map(
      (item) => ({
        count: item.count,
        date: item.date,
        price: item.price,
        type: item.type,
      })
    );
    setTransactions(transactions);
  }

  if (responseShareLots.data) {
    const shareLots: ShareLots[] = responseShareLots.data.map((item) => {
      if (item.amount_active_shares && item.average_cost_per_share) {
        return {
          averagePrice: item.average_cost_per_share,
          gain: item.gain_margin,
          marketPrice: item.price_current,
          shares: item.amount_active_shares,
          totalCost: item.amount_active_shares * item.average_cost_per_share,
          tradeDate: item.startTradeDate,
        };
      } else {
        return {
          averagePrice: item.average_cost_per_share,
          gain: item.gain_margin,
          marketPrice: item.price_growth,
          shares: item.amount_active_shares,
          totalCost: 0,
          tradeDate: item.startTradeDate,
        };
      }
    });
    setShareLots(shareLots);
  }
};
