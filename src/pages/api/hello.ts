// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseClient } from "@/config/supabaseClient";
import { ROUND } from "@/utils/round";
import axios from "axios";
import { load } from "cheerio";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { from, to } = req.query;

  const stocks = await supabaseClient
    .from("stock")
    .select()
    // .eq("ticker", "QCOM")
    // .limit(100)
    // .range(from, to)
    .eq("is_dividend", true)
    .order("ticker", { ascending: true });

  // if (stocks.data) {
  //   stocks.data.forEach((stock, index) => {
  //     setTimeout(async () => {
  //       try {
  //         const html = await axios.get(
  //           `https://stockanalysis.com/stocks/${stock.ticker.replace(
  //             "-",
  //             "."
  //           )}/dividend/`
  //         );

  //         /* --- UPDATE UPCOMING DIVIDEND ---  */
  //         if (html) {
  //           const $ = load(html.data);

  //           const today = moment().format("YYYY-MM-DD");

  //           let lastPayDate = "";
  //           let lastCashAmount;

  //           $("table > tbody > tr").each((i, el) => {
  //             const payDate = $(el).find("td:nth-child(4)").text();
  //             const cashAmount = $(el).find("td:nth-child(2)").text();

  //             if (moment(payDate).isAfter(today)) {
  //               lastPayDate = moment(payDate).format("YYYY-MM-DD");
  //               lastCashAmount = ROUND(Number(cashAmount.split("$")[1]));
  //             }
  //           });

  //           await supabaseClient
  //             .from("stock")
  //             .update({
  //               dividend_upcoming_date: lastPayDate ? lastPayDate : null,
  //               dividend_upcoming_value: lastCashAmount ? lastCashAmount : null,
  //             })
  //             .eq("ticker", stock.ticker);
  //         }

  //         /* --- UPDATE DIVIDEND INCOME --- */
  //         const supaStockPortfolio = await supabaseClient
  //           .from("stock_portfolio")
  //           .select()
  //           .eq("ticker", stock.ticker);

  //         if (supaStockPortfolio.data) {
  //           supaStockPortfolio.data.forEach(async (stockPortfolio) => {
  //             if (html) {
  //               const $ = load(html.data);
  //               const today = moment().format("YYYY-MM-DD");
  //               let foundFirstMatchingRow = false;
  //               let lastPayDate;
  //               let lastCashAmount;

  //               $("table > tbody > tr").each((i, el) => {
  //                 if (!foundFirstMatchingRow) {
  //                   const payDate = $(el).find("td:nth-child(4)").text();
  //                   const cashAmount = $(el).find("td:nth-child(2)").text();
  //                   const exDividendDate = $(el).find("td:nth-child(1)").text();

  //                   if (
  //                     moment(payDate).isBefore(today) &&
  //                     moment(exDividendDate).isAfter(
  //                       stockPortfolio.startTradeDate
  //                     )
  //                   ) {
  //                     foundFirstMatchingRow = true;
  //                     lastPayDate = payDate;
  //                     lastCashAmount = cashAmount;
  //                   }
  //                 }
  //               });

  //               if (lastPayDate) {
  //                 const isExistDividends = moment(
  //                   stockPortfolio.lastDividendPayDate
  //                 ).isSame(lastPayDate);

  //                 if (!isExistDividends) {
  //                   console.log("NEW DIVIDENDS", stockPortfolio.ticker);
  //                   const supaPortfolio = await supabaseClient
  //                     .from("portfolio")
  //                     .select()
  //                     .eq("id", stockPortfolio.portfolio_id)
  //                     .single();

  //                   if (supaPortfolio.data) {
  //                     const supaUser = await supabaseClient
  //                       .from("user")
  //                       .select()
  //                       .eq("id", supaPortfolio.data.user_id)
  //                       .single();

  //                     if (supaUser.data) {
  //                       const totalDividends = ROUND(
  //                         Number(lastCashAmount) *
  //                           Number(stockPortfolio.amount_active_shares)
  //                       );
  //                       const cost =
  //                         Number(stockPortfolio.average_cost_per_share) *
  //                         Number(stockPortfolio.amount_active_shares);
  //                       const newTotalReturnValue = ROUND(
  //                         Number(stockPortfolio.total_return_value) +
  //                           totalDividends
  //                       );
  //                       const newTotalReturnMargin = ROUND(
  //                         (newTotalReturnValue / cost) * 100
  //                       );
  //                       const newTotalDividendIncome = ROUND(
  //                         Number(stockPortfolio.total_dividend_income) +
  //                           totalDividends
  //                       );
  //                       const newBalance = ROUND(
  //                         supaUser.data.balance + totalDividends
  //                       );
  //                       const year = Number(moment(lastPayDate).format("YYYY"));

  //                       await supabaseClient
  //                         .from("stock_portfolio")
  //                         .update({
  //                           lastDividendPayDate:
  //                             moment(lastPayDate).format("YYYY-MM-DD"),
  //                           total_dividend_income: newTotalDividendIncome,
  //                           total_return_value: newTotalReturnValue,
  //                           total_return_margin: newTotalReturnMargin,
  //                         })
  //                         .eq("ticker", stockPortfolio.ticker)
  //                         .eq("portfolio_id", stockPortfolio.portfolio_id);

  //                       await supabaseClient.from("dividend").insert({
  //                         amount_shares: Number(
  //                           stockPortfolio.amount_active_shares
  //                         ),
  //                         dividendValue: ROUND(Number(lastCashAmount)),
  //                         dividendYield: ROUND(
  //                           (Number(lastCashAmount) /
  //                             Number(stockPortfolio.average_cost_per_share)) *
  //                             100
  //                         ),
  //                         ticker: stockPortfolio.ticker,
  //                         payDate: moment(lastPayDate).format("YYYY-MM-DD"),
  //                         totalAmount: totalDividends,
  //                         portfolio_id: stockPortfolio.portfolio_id,
  //                         year,
  //                       });

  //                       await supabaseClient
  //                         .from("user")
  //                         .update({ balance: newBalance })
  //                         .eq("id", supaUser.data.id);
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           });
  //         }
  //       } catch {
  //         console.log("ERROR");
  //       }
  //     }, index * 2000);
  //   });
  // }

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
