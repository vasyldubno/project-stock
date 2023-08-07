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
  const { userId } = req.body;

  const supaPortfolio = await supabaseClient
    .from("portfolio")
    .select()
    .eq("user_id", userId);

  if (supaPortfolio.data) {
    const portfolioIds = supaPortfolio.data.map((item) => item.id);

    const stocks = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("is_trading", true)
      .eq("is_dividend", true)
      .in("portfolio_id", portfolioIds)
      .order("ticker", { ascending: true });

    if (stocks.data) {
      stocks.data.forEach((stock, index) => {
        setTimeout(async () => {
          try {
            const response = await axios.get<IResponse>(
              `https://api.polygon.io/v3/reference/dividends?ticker=${stock.ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs`
            );

            if (stock.startTradeDate) {
              const today = moment().format("YYYY-MM-DD");
              const std = new Date(stock.startTradeDate);

              /* --- UPDATE DIVIDEND INCOME --- */

              const last = response.data.results.find(
                (res) =>
                  moment(new Date(res.pay_date)).isBefore(new Date(today)) &&
                  moment(new Date(res.ex_dividend_date)).isAfter(moment(std))
              );

              if (last) {
                const isExistDividends = moment(
                  stock.lastDividendPayDate
                ).isSame(moment(last.pay_date));

                if (
                  !isExistDividends &&
                  stock.amount_active_shares &&
                  stock.average_cost_per_share
                ) {
                  const supaUser = await supabaseClient
                    .from("user")
                    .select()
                    .eq("id", userId)
                    .single();

                  if (supaUser.data) {
                    const totalDividends = ROUND(
                      last.cash_amount * stock.amount_active_shares
                    );
                    const cost =
                      stock.average_cost_per_share * stock.amount_active_shares;
                    const newTotalReturnValue = ROUND(
                      stock.total_return_value ?? 0 + totalDividends
                    );
                    const newTotalReturnMargin = ROUND(
                      (newTotalReturnValue / cost) * 100
                    );
                    const newTotalDividendIncome = ROUND(
                      stock.total_dividend_income ?? 0 + totalDividends
                    );
                    const newBalance = ROUND(
                      supaUser.data.balance + totalDividends
                    );
                    const year = Number(moment(last.pay_date).format("YYYY"));

                    await supabaseClient
                      .from("stock_portfolio")
                      .update({
                        lastDividendPayDate: last.pay_date,
                        total_dividend_income: newTotalDividendIncome,
                        total_return_value: newTotalReturnValue,
                        total_return_margin: newTotalReturnMargin,
                      })
                      .eq("ticker", stock.ticker)
                      .eq("portfolio_id", stock.portfolio_id);

                    await supabaseClient.from("dividend").insert({
                      amount_shares: stock.amount_active_shares,
                      dividendValue: ROUND(last.cash_amount),
                      dividendYield: ROUND(
                        (last.cash_amount / stock.average_cost_per_share) * 100
                      ),
                      ticker: stock.ticker,
                      payDate: last.pay_date,
                      totalAmount: totalDividends,
                      portfolio_id: stock.portfolio_id,
                      year,
                    });

                    await supabaseClient
                      .from("user")
                      .update({ balance: newBalance })
                      .eq("id", supaUser.data.id);
                  }
                }
              }

              /* --- UPDATE UPCOMING DIVIDEND ---  */
              const lastUpcomeDividend = response.data.results.find((item) =>
                moment(item.pay_date).isAfter(today)
              );

              if (lastUpcomeDividend) {
                await supabaseClient
                  .from("stock_portfolio")
                  .update({
                    dividend_upcoming_date: lastUpcomeDividend.pay_date,
                    dividend_upcoming_value: lastUpcomeDividend.cash_amount,
                  })
                  .eq("ticker", stock.ticker)
                  .eq("portfolio_id", stock.portfolio_id);
              } else {
                await supabaseClient
                  .from("stock_portfolio")
                  .update({
                    dividend_upcoming_date: null,
                    dividend_upcoming_value: null,
                  })
                  .eq("ticker", stock.ticker)
                  .eq("portfolio_id", stock.portfolio_id);
              }
            }
          } catch {
            // console.log("ERROR", stock.ticker);
          }
        }, index * 15000);
      });
    }
  }

  res.json({ message: "Ok" });
}
