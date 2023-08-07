// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";
import axios from "axios";
import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "@/utils/getHTML";
import { getGFValue } from "@/utils/stock/getGFValue";
import cheerio from "cheerio";

const convertMonth = (month: string) => {
  switch (month) {
    case "Jan":
      return "01";
    case "Feb":
      return "02";
    case "Mar":
      return "03";
    case "Apr":
      return "04";
    case "May":
      return "05";
    case "Jun":
      return "06";
    case "Jul":
      return "07";
    case "Aug":
      return "08";
    case "Sep":
      return "09";
    case "Oct":
      return "10";
    case "Nov":
      return "11";
    case "Dec":
      return "12";
    default:
      return "";
  }
};

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

    const stockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .order("ticker", { ascending: true })
      .eq("is_trading", true)
      .in("portfolio_id", portfolioIds);

    if (stockPortfolio.data) {
      stockPortfolio.data.forEach(async (stock, index) => {
        setTimeout(async () => {
          try {
            const response = await axios.get<{
              results: { pay_date: string; cash_amount: number }[];
            }>(
              `https://api.polygon.io/v3/reference/dividends?ticker=${stock.ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs `
            );

            const today = moment(new Date()).format("YYYY-MM-DD");

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
          } catch (error) {
            // console.log(`ERROR => ${stock.ticker}`);
          }
        }, index * 15000);
      });
    }
  }

  res.json({
    message: "Ok",
  });
}
