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
        console.log(stock.ticker);
        clearTimeout(t);
      }, index * 15000);
    });
  }

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
