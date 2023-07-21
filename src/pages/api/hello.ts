// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";
import axios from "axios";
import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "@/utils/getHTML";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tickers: { ticker: string; exchange: string }[] = [
    { ticker: "A", exchange: "NYSE" },
    { ticker: "AAL", exchange: "NASDAQ" },
    { ticker: "AAP", exchange: "NYSE" },
    { ticker: "AAPL", exchange: "NASDAQ" },
  ];

  tickers.forEach((stock, index) => {
    setTimeout(async () => {
      const {
        data: { last_price },
      } = await axios.get(
        `https://markets.sh/api/v1/symbols/${stock.exchange}:${stock.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b`
      );

      const stockSupa = await supabaseClient
        .from("stock")
        .select()
        .eq("ticker", stock)
        .single();

      if (stockSupa.data && last_price) {
        const price = Number(last_price.toFixed(2));
        await supabaseClient
          .from("stock")
          .update({ price_current: price })
          .eq("ticker", stock);
      }

      // await supabaseClient.from("test").insert({ content: last_price });
    }, index * 1000);
  });

  res.json({
    message: "Ok",
  });
}
