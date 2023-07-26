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
  const stocks = await supabaseClient
    .from("stock_portfolio")
    .select()
    .order("ticker", { ascending: true })
    // .limit(10)
    .eq("is_trading", true);
  // .eq("ticker", "CSCO");

  if (stocks.data) {
    stocks.data.forEach(async (stock, index) => {
      setTimeout(async () => {
        try {
          // const html = await getHTML(
          //   `https://www.marketbeat.com/stocks/${stock.exchange}/${stock.ticker}/dividend/`
          // );
          // const $ = cheerio.load(html);
          // const result = $(
          //   ".col-12.col-md-6 > dl > div:nth-child(6) > dt"
          // ).text();
          // if (result === "Next Dividend Payment") {
          //   const response = $(
          //     ".col-12.col-md-6 > dl > div:nth-child(6) > dd"
          //   ).text();
          //   const responseArray = response.trim().split(" ");
          //   const day = responseArray[1];
          //   const month = convertMonth(responseArray[0].replace(".", ""));
          //   const year = new Date().getUTCFullYear();
          //   const date = `${year}-${month}-${day}`;
          //   await supabaseClient
          //     .from("stock_portfolio")
          //     .update({ dividend_upcoming_date: date })
          //     .eq("ticker", stock.ticker);
          //   console.log(stock.ticker);
          // } else {
          //   await supabaseClient
          //     .from("stock_portfolio")
          //     .update({ dividend_upcoming_date: null })
          //     .eq("ticker", stock.ticker);
          // }

          const response = await axios.get<{
            results: { pay_date: string; cash_amount: number }[];
          }>(
            `https://api.polygon.io/v3/reference/dividends?ticker=${stock.ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs `
          );

          const today = moment(new Date()).format("YYYY-MM-DD");

          const last = response.data.results.find((item) =>
            moment(item.pay_date).isAfter(today)
          );

          // console.log(index);

          if (last) {
            // console.log(index, stock.ticker);
            await supabaseClient
              .from("stock_portfolio")
              .update({
                dividend_upcoming_date: last.pay_date,
                dividend_upcoming_value: last.cash_amount,
              })
              .eq("ticker", stock.ticker);
          } else {
            await supabaseClient
              .from("stock_portfolio")
              .update({
                dividend_upcoming_date: null,
                dividend_upcoming_value: null,
              })
              .eq("ticker", stock.ticker);
          }
        } catch (error) {
          // console.log(`ERROR => ${stock.ticker}`);
        }
      }, index * 15000);
    });
  }

  res.json({
    message: "Ok",
  });
}
