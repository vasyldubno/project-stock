import { supabaseClient } from "@/config/supabaseClient";
import { getPriceCurrent } from "@/utils/getPriceCurrent";
import { getPriceGrowth } from "@/utils/getPriceGrowth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("STOCK/PRICE-CURRENT");
  const stocks = await supabaseClient
    .from("stock")
    .select()
    // .eq("ticker", "FMC")
    .order("ticker", { ascending: true });

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      setTimeout(async () => {
        try {
          if (stock.ticker) {
            const priceGrowth = getPriceGrowth(
              stock.price_target,
              stock.price_current
            );
            const priceCurrent = await getPriceCurrent(
              stock.ticker,
              stock.exchange
            );

            // console.log(index, stock.ticker, priceGrowth, priceCurrent);

            if (priceCurrent) {
              await supabaseClient
                .from("stock")
                .update({
                  price_current: priceCurrent,
                  price_growth: priceGrowth,
                })
                .eq("ticker", stock.ticker);
            }
          }
        } catch (error) {
          console.log("ERROR", index, stock.ticker);
        }
      }, 600 * index);
    });
  }

  res.json({ message: "Ok" });
}
