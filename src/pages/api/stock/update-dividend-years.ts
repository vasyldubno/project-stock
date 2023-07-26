// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";
import axios from "axios";
import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "@/utils/getHTML";
import { getGFValue } from "@/utils/stock/getGFValue";
import cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient
    .from("stock")
    .select()
    .order("ticker", { ascending: true });
  // .eq("ticker", "AFL");

  if (stocks.data) {
    stocks.data.forEach(async (stock, index) => {
      try {
        const html = await getHTML(
          `https://www.marketbeat.com/stocks/${stock.exchange}/${stock.ticker}/dividend/`
        );
        const $ = cheerio.load(html);

        console.log(index, stock.ticker);

        const result = $(
          ".col-12.col-md-6 > dl > div:nth-child(3) > dt"
        ).text();

        if (result === "Dividend Increase Track Record") {
          const response = $(
            ".col-12.col-md-6 > dl > div:nth-child(3) > dd"
          ).text();

          const years = response.trim().split(" ")[0];
          const isDividendAristocrat =
            Number(years) >= 25 && Number(years) < 50;
          const isDividendKing = Number(years) >= 50;
          // console.log("isDividendAristocrat", isDividendAristocrat);
          // console.log("isDividendKing", isDividendKing);

          await supabaseClient
            .from("stock")
            .update({
              isDividendAristocrat,
              isDividendKing,
            })
            .eq("ticker", stock.ticker);

          // if (Number(years) >= 50) {
          //   return supabaseClient
          //     .from("stock")
          //     .update({ isDividendKing: true })
          //     .eq("ticker", stock.ticker);
          // }
          // if (Number(years) >= 25 && Number(years) < 50) {
          //   return supabaseClient
          //     .from("stock")
          //     .update({ isDividendAristocrat: true })
          //     .eq("ticker", stock.ticker);
          // }
          // if (Number(years) < 25) {
          //   return supabaseClient
          //     .from("stock")
          //     .update({ isDividendAristocrat: false, isDividendKing: false })
          //     .eq("ticker", stock.ticker);
          // }
        }
      } catch (error) {
        // console.log(`ERROR => ${stock.ticker}`);
      }
    });
  }

  res.json({
    message: "Ok",
  });
}
