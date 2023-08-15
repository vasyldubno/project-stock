import { supabaseClient } from "@/config/supabaseClient";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient.from("stock").select();

  if (stocks.data) {
    stocks.data.forEach(async (stock, index) => {
      setTimeout(async () => {
        try {
          const price = await axios.get(
            `https://api.nasdaq.com/api/analyst/${stock.ticker}/targetprice`
          );

          const priceTarget = Number(
            price.data.data.consensusOverview.priceTarget
          );
          const buy = Number(price.data.data.consensusOverview.buy);

          await supabaseClient
            .from("stock")
            .update({ analystRatingBuy: buy, price_target: priceTarget })
            .eq("ticker", stock.ticker);
        } catch (err) {}
      }, 200 * index);
    });
  }

  res.json({ stocks });
}
