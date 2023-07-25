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

const determineMonth = (monthNumber: string) => {
  switch (monthNumber) {
    case "01":
      return "January";
    case "02":
      return "February";
    case "03":
      return "March";
    case "04":
      return "April";
    case "04":
      return "May";
    case "06":
      return "June";
    case "07":
      return "July";
    case "08":
      return "August";
    case "09":
      return "September";
    case "10":
      return "October";
    case "11":
      return "November";
    case "12":
      return "December";

    default:
      return "January";
  }
};

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
          const response = await axios.get<IResponse>(
            `https://api.polygon.io/v3/reference/dividends?ticker=${stock.ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs`
          );

          const monthNumber = moment(response.data.results[0].pay_date).format(
            "MM"
          );
          const monthName = determineMonth(monthNumber);

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

                const supaDividendInMonth = await supabaseClient
                  .from("dividend_in_month")
                  .select()
                  .eq("year", "2023")
                  .single();

                if (supaDividendInMonth.data) {
                  await supabaseClient
                    .from("dividend_in_month")
                    .update({
                      [monthName]: supaDividendInMonth.data[monthName]
                        ? supaDividendInMonth.data[monthName]! +
                          Number(
                            (
                              last.cash_amount * stock.amount_active_shares
                            ).toFixed(2)
                          )
                        : Number(
                            (
                              last.cash_amount * stock.amount_active_shares
                            ).toFixed(2)
                          ),
                    })
                    .eq("year", "2023");
                }
              }
            }
          }
        } catch {
          console.log("ERROR", stock.ticker);
        }
      }, index * 15000);
    });
  }

  res.json({ message: "Ok" });
}
