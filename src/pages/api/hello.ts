// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/firebaseConfig";
import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "@/utils/getHTML";
import axios from "axios";
import { load } from "cheerio";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient
    .from("stock")
    .select()
    // .eq("ticker", "AAPL")
    .limit(100)
    .eq("is_dividend", true)
    .order("ticker", { ascending: true });

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      const t = setTimeout(async () => {
        try {
          const response = await axios.get(
            `https://api.polygon.io/v3/reference/dividends?ticker=${stock.ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs`
          );

          /* --- UPDATE UPCOMING DIVIDEND ---  */
          const today = moment().format("YYYY-MM-DD");

          const lastUpcomeDividend = response.data.results.find((item: any) =>
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
        } catch {}
        clearTimeout(t);
      }, index * 15000);
    });
  }

  // if (stocks.data) {
  //   stocks.data.forEach((stock, index) => {
  //     const t = setTimeout(async () => {
  //       console.log(stock.ticker);
  //       clearTimeout(t);
  //     }, index * 15000);
  //   });
  // }

  // if (stocks.data) {
  //   stocks.data.forEach((stock, index) => {
  //     setTimeout(async () => {
  //       try {
  //         const html = await getHTML(
  //           `https://finviz.com/quote.ashx?t=${stock.ticker}`
  //         );
  //         console.log(stock.ticker);
  //         const $ = load(html);

  //         const a = $(
  //           ".snapshot-table-wrapper > table > tbody > tr:nth-child(7) td:nth-child(2)"
  //         ).text();

  //         const b = Number(a) > 0;

  //         await supabaseClient
  //           .from("stock")
  //           .update({ is_dividend: Number(a) > 0 })
  //           .eq("ticker", stock.ticker);
  //       } catch {
  //         // console.log("ERROR => /API/STOCK/FUNDAMENTALS", stock.ticker);
  //       }
  //     }, 300 * index);
  //   });
  // }

  res.json({
    message: "Ok",
    // stocks,
  });
}
