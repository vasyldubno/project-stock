import { supabaseClient } from "@/config/supabaseClient";
import { ROUND } from "@/utils/round";
import axios from "axios";
import moment from "moment-timezone";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponse {
  results: {
    cash_amount: number;
    ex_dividend_date: string;
    pay_date: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient
    .from("stock")
    .select()
    .eq("is_trading", true)
    .eq("is_dividend", true)
    .order("ticker", { ascending: true });

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      setTimeout(async () => {
        try {
          const response = await axios.get<IResponse>(
            `https://api.polygon.io/v3/reference/dividends?ticker=${stock.ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs`
          );

          const supaStockPortfolio = await supabaseClient
            .from("stock_portfolio")
            .select()
            .eq("ticker", stock.ticker);

          if (supaStockPortfolio.data) {
            supaStockPortfolio.data.forEach(async (stockPortfolio) => {
              if (stockPortfolio.startTradeDate) {
                const today = moment().format("YYYY-MM-DD");
                const std = new Date(stockPortfolio.startTradeDate);

                /* --- UPDATE DIVIDEND INCOME --- */

                const last = response.data.results.find(
                  (res) =>
                    moment(new Date(res.pay_date)).isBefore(new Date(today)) &&
                    moment(new Date(res.ex_dividend_date)).isAfter(moment(std))
                );

                if (last) {
                  const isExistDividends = moment(
                    stockPortfolio.lastDividendPayDate
                  ).isSame(moment(last.pay_date));

                  if (
                    !isExistDividends &&
                    stockPortfolio.amount_active_shares &&
                    stockPortfolio.average_cost_per_share
                  ) {
                    const supaPortfolio = await supabaseClient
                      .from("portfolio")
                      .select()
                      .eq("id", stockPortfolio.portfolio_id)
                      .single();

                    if (supaPortfolio.data) {
                      const supaUser = await supabaseClient
                        .from("user")
                        .select()
                        .eq("id", supaPortfolio.data.user_id)
                        .single();

                      if (supaUser.data) {
                        const totalDividends = ROUND(
                          last.cash_amount * stockPortfolio.amount_active_shares
                        );
                        const cost =
                          stockPortfolio.average_cost_per_share *
                          stockPortfolio.amount_active_shares;
                        const newTotalReturnValue = ROUND(
                          stockPortfolio.total_return_value ??
                            0 + totalDividends
                        );
                        const newTotalReturnMargin = ROUND(
                          (newTotalReturnValue / cost) * 100
                        );
                        const newTotalDividendIncome = ROUND(
                          stockPortfolio.total_dividend_income ??
                            0 + totalDividends
                        );
                        const newBalance = ROUND(
                          supaUser.data.balance + totalDividends
                        );
                        const year = Number(
                          moment(last.pay_date).format("YYYY")
                        );

                        await supabaseClient
                          .from("stock_portfolio")
                          .update({
                            lastDividendPayDate: last.pay_date,
                            total_dividend_income: newTotalDividendIncome,
                            total_return_value: newTotalReturnValue,
                            total_return_margin: newTotalReturnMargin,
                          })
                          .eq("ticker", stockPortfolio.ticker)
                          .eq("portfolio_id", stockPortfolio.portfolio_id);

                        await supabaseClient.from("dividend").insert({
                          amount_shares: stockPortfolio.amount_active_shares,
                          dividendValue: ROUND(last.cash_amount),
                          dividendYield: ROUND(
                            (last.cash_amount /
                              stockPortfolio.average_cost_per_share) *
                              100
                          ),
                          ticker: stock.ticker,
                          payDate: last.pay_date,
                          totalAmount: totalDividends,
                          portfolio_id: stockPortfolio.portfolio_id,
                          year,
                        });

                        await supabaseClient
                          .from("user")
                          .update({ balance: newBalance })
                          .eq("id", supaUser.data.id);
                      }
                    }
                  }
                }

                /* --- UPDATE UPCOMING DIVIDEND ---  */
                const lastUpcomeDividend = response.data.results.find((item) =>
                  moment(item.pay_date).isAfter(today)
                );

                await supabaseClient
                  .from("stock")
                  .update({
                    dividend_upcoming_date: lastUpcomeDividend?.pay_date
                      ? lastUpcomeDividend?.pay_date
                      : null,
                    dividend_upcoming_value: lastUpcomeDividend?.cash_amount
                      ? lastUpcomeDividend?.cash_amount
                      : null,
                  })
                  .eq("ticker", stock.ticker);
              }
            });
          }
        } catch {}
      }, index * 15000);
    });
  }

  res.json({ message: "Ok" });
}
