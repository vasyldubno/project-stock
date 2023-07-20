import { xataClient } from "@/config/xataClient";
import { averageCostPerShare } from "@/utils/averageCostPerShare";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment-timezone";
import { getRealizedValue } from "@/utils/getRealizedValue";
import { getRealizedPercentage } from "@/utils/getRealizedPercentage";
import { getAmountActiveShares } from "@/utils/amountActiveShares";
import { supabaseClient } from "@/config/supabaseClient";

interface INasdaqDividends {
  data: {
    dividends: {
      rows: {
        exOrEffDate: string;
        type: string;
        amount: string;
        declarationDate: string;
        recordDate: string;
        paymentDate: string;
        currency: string;
      }[];
    };
  };
}

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
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true)
    .order("ticker", { ascending: true });

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      setTimeout(async () => {
        try {
          console.log(index + 1, stock.ticker);
          const response = await axios.get<IResponse>(
            `https://api.polygon.io/v3/reference/dividends?ticker=${stock.ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs`
          );

          if (stock.startTradeDate) {
            const today = moment().format("YYYY-MM-DD");
            const std = new Date(stock.startTradeDate);

            const last = response.data.results.find(
              (res) =>
                moment(new Date(res.pay_date)).isBefore(new Date(today)) &&
                moment(new Date(res.ex_dividend_date)).isAfter(moment(std))
            );

            if (last) {
              const isExistDividends = moment(stock.lastDividendPayDate).isSame(
                moment(last.pay_date)
              );

              if (
                !isExistDividends &&
                stock.amount_active_shares &&
                stock.average_cost_per_share
              ) {
                await supabaseClient
                  .from("stock_portfolio")
                  .update({
                    lastDividendPayDate: last.pay_date,
                    total_dividend_income: stock.total_dividend_income
                      ? stock.total_dividend_income +
                        last.cash_amount * stock.amount_active_shares
                      : last.cash_amount * stock.amount_active_shares,
                    total_return_value: stock.total_return_value
                      ? stock.total_return_value +
                        last.cash_amount * stock.amount_active_shares
                      : last.cash_amount * stock.amount_active_shares,
                    total_return_margin: stock.total_return_value
                      ? Number(
                          (
                            ((stock.total_return_value +
                              last.cash_amount * stock.amount_active_shares) /
                              (stock.average_cost_per_share *
                                stock.amount_active_shares)) *
                            100
                          ).toFixed(2)
                        )
                      : Number(
                          (
                            ((last.cash_amount * stock.amount_active_shares) /
                              (stock.average_cost_per_share *
                                stock.amount_active_shares)) *
                            100
                          ).toFixed(2)
                        ),
                  })
                  .eq("ticker", stock.ticker);

                await supabaseClient.from("dividend").insert({
                  amount_shares: stock.amount_active_shares,
                  dividendValue: Number(last.cash_amount.toFixed(2)),
                  dividendYield: Number(
                    (
                      (last.cash_amount / stock.average_cost_per_share) *
                      100
                    ).toFixed(2)
                  ),
                  ticker: stock.ticker,
                  payDate: last.pay_date,
                  totalAmount: Number(
                    (last.cash_amount * stock.amount_active_shares).toFixed(2)
                  ),
                });
              }
            }
          }
        } catch {
          console.log("ERROR", index + 1, stock.ticker);
        }
      }, index * 15000);
    });
  }

  // const portfolio = await xataClient.db.portfolioStock
  //   .filter("isTrading", true)
  //   .getAll();

  // portfolio.forEach(async (stock, index) => {
  //   console.log(index + 1, stock.ticker);

  //   const response = await axios.get<INasdaqDividends>(
  //     `https://api.nasdaq.com/api/quote/${stock.ticker}/dividends?assetclass=stocks`
  //   );

  //   if (stock.startTradeDate) {
  //     const today = moment().format("YYYY-MM-DD");
  //     const std = new Date(stock.startTradeDate);

  //     if (response.data.data.dividends.rows) {
  //       const last = response.data.data.dividends.rows.find(
  //         (res) =>
  //           moment(new Date(res.paymentDate)).isBefore(new Date(today)) &&
  //           moment(new Date(res.exOrEffDate)).isAfter(moment(std))
  //       );
  //       if (last) {
  //         const isExistDividends = moment(stock.lastDividendPayDate).isSame(
  //           new Date(moment(last.paymentDate).format("YYYY-MM-DD"))
  //         );
  //         if (!isExistDividends && stock.ticker && stock.averageCostPerShare) {
  //           const xataStock = await xataClient.db.portfolioStock
  //             .filter("ticker", stock.ticker)
  //             .getFirst();
  //           if (xataStock) {
  //             await xataClient.db.portfolioStock.update(xataStock.id, {
  //               lastDividendPayDate: moment(last.paymentDate)
  //                 .tz("UTC")
  //                 .startOf("day")
  //                 .toDate(),
  //               gainRealizedValue: stock.gainRealizedValue
  //                 ? Number(
  //                     (
  //                       stock.gainRealizedValue +
  //                       (await getAmountActiveShares(stock.ticker)) *
  //                         Number(Number(last.amount.split("$")[1]).toFixed(2))
  //                     ).toFixed(2)
  //                   )
  //                 : Number(
  //                     (
  //                       (await getAmountActiveShares(stock.ticker)) *
  //                       Number(Number(last.amount.split("$")[1]).toFixed(2))
  //                     ).toFixed(2)
  //                   ),
  //               gainRealizedPercentage: stock.gainRealizedPercentage
  //                 ? stock.gainRealizedPercentage +
  //                   Number(
  //                     (
  //                       (Number(Number(last.amount.split("$")[1]).toFixed(2)) /
  //                         stock.averageCostPerShare) *
  //                       100
  //                     ).toFixed(2)
  //                   )
  //                 : Number(
  //                     (
  //                       (Number(Number(last.amount.split("$")[1]).toFixed(2)) /
  //                         stock.averageCostPerShare) *
  //                       100
  //                     ).toFixed(2)
  //                   ),
  //               dividendValue: stock.dividendValue
  //                 ? {
  //                     $increment: Number(
  //                       (
  //                         (await getAmountActiveShares(stock.ticker)) *
  //                         Number(Number(last.amount.split("$")[1]).toFixed(2))
  //                       ).toFixed(2)
  //                     ),
  //                   }
  //                 : Number(
  //                     (
  //                       (await getAmountActiveShares(stock.ticker)) *
  //                       Number(Number(last.amount.split("$")[1]).toFixed(2))
  //                     ).toFixed(2)
  //                   ),
  //               dividendPercentage: stock.dividendPercentage
  //                 ? {
  //                     $increment: Number(
  //                       (
  //                         (Number(
  //                           Number(last.amount.split("$")[1]).toFixed(2)
  //                         ) /
  //                           stock.averageCostPerShare) *
  //                         100
  //                       ).toFixed(2)
  //                     ),
  //                   }
  //                 : Number(
  //                     (
  //                       (Number(Number(last.amount.split("$")[1]).toFixed(2)) /
  //                         stock.averageCostPerShare) *
  //                       100
  //                     ).toFixed(2)
  //                   ),
  //             });
  //             await xataClient.db.dividend.create({
  //               dividendValue: Number(
  //                 Number(last.amount.split("$")[1]).toFixed(2)
  //               ),
  //               dividendYield: Number(
  //                 (
  //                   (Number(Number(last.amount.split("$")[1]).toFixed(2)) /
  //                     stock.averageCostPerShare) *
  //                   100
  //                 ).toFixed(2)
  //               ),
  //               ticker: stock.ticker,
  //               payDate: new Date(
  //                 moment(last.paymentDate).format("YYYY-MM-DD")
  //               ),
  //               totalAmount:
  //                 (await getAmountActiveShares(stock.ticker)) *
  //                 Number(Number(last.amount.split("$")[1]).toFixed(2)),
  //             });
  //           }
  //         }
  //       }
  //     }
  //   }
  // });

  res.json({ message: "Ok" });
}
