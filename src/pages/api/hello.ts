// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/firebaseConfig";
import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "@/utils/getHTML";
import { ROUND } from "@/utils/round";
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
      setTimeout(async () => {
        try {
          // const response = await axios.get(
          //   `https://api.polygon.io/v3/reference/dividends?ticker=${stock.ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs`
          // );
          // /* --- UPDATE UPCOMING DIVIDEND ---  */
          // const today = moment().format("YYYY-MM-DD");
          // const lastUpcomeDividend = response.data.results.find((item: any) =>
          //   moment(item.pay_date).isAfter(today)
          // );
          // console.log(stock.ticker, !!lastUpcomeDividend);
          // await supabaseClient
          //   .from("stock")
          //   .update({
          //     dividend_upcoming_date: lastUpcomeDividend
          //       ? lastUpcomeDividend?.pay_date
          //       : null,
          //     dividend_upcoming_value: lastUpcomeDividend
          //       ? lastUpcomeDividend?.cash_amount
          //       : null,
          //   })
          //   .eq("ticker", stock.ticker);

          const html = await axios.get(
            `https://stockanalysis.com/stocks/${stock.ticker.replace(
              "-",
              "."
            )}/dividend/`
          );

          if (html) {
            const $ = load(html.data);

            const today = moment().format("YYYY-MM-DD");
            let lastPayDate = "";
            let lastCashAmount;

            $("table > tbody > tr").each((i, el) => {
              const payDate = $(el).find("td:nth-child(4)").text();
              const cashAmount = $(el).find("td:nth-child(2)").text();

              if (moment(payDate).isAfter(today)) {
                lastPayDate = moment(payDate).format("YYYY-MM-DD");
                lastCashAmount = ROUND(Number(cashAmount.split("$")[1]));
              }
            });

            console.log(lastPayDate);
            console.log(lastCashAmount);

            /* --- UPDATE UPCOMING DIVIDEND ---  */
            await supabaseClient
              .from("stock")
              .update({
                dividend_upcoming_date: lastPayDate ? lastPayDate : null,
                dividend_upcoming_value: lastCashAmount ? lastCashAmount : null,
              })
              .eq("ticker", stock.ticker);
          }
        } catch {
          console.log("ERROR");
        }
      }, index * 2000);
    });
  }

  /* --- UPDATE:IS_DIVIDEND --- */
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

  /* --- RESET UPCOMING_DIVIDEND --- */
  // if (stocks.data) {
  //   stocks.data.forEach(async (stock) => {
  //     await supabaseClient
  //       .from("stock")
  //       .update({
  //         dividend_upcoming_date: null,
  //         dividend_upcoming_value: null,
  //       })
  //       .eq("ticker", stock.ticker);
  //   });
  // }

  res.json({
    message: "Ok",
    stocks,
  });
}
