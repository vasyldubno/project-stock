import { supabaseClient } from "@/config/supabaseClient";
import { xataClient } from "@/config/xataClient";
import { getPE } from "@/utils/getPE";
import { getPriceCurrent } from "@/utils/getPriceCurrent";
import { getPriceGrowth } from "@/utils/getPriceGrowth";
import { isNegative } from "@/utils/isNegative";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const xataStocks = await xataClient.db.stock.getAll();
  const stocks = await supabaseClient.from("stock").select();

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      setTimeout(async () => {
        try {
          if (stock.ticker) {
            // const xataStock = await xataClient.db.stock
            //   .filter("ticker", stock.ticker)
            //   .getFirst();
            // const supaStock = await supabaseClient
            //   .from("stock")
            //   .select()
            //   .eq("ticker", stock.ticker)
            //   .single();

            // if (supaStock.data) {
            // const pe = await getPE(stock.ticker, stock.eps);
            const priceGrowth = getPriceGrowth(
              stock.priceTarget,
              stock.price_current
            );
            const priceCurrent = await getPriceCurrent(
              stock.ticker,
              stock.exchange
            );

            // await xataClient.db.stock.update(xataStock.id, {
            //   priceCurrent,
            //   pe: isNegative(pe) ? 0 : pe,
            //   priceGrowth,
            // });

            console.log(index, stock.ticker, priceGrowth, priceCurrent);

            await supabaseClient
              .from("stock")
              .update({
                price_current: priceCurrent,
                // pe: pe,
                priceGrowth,
              })
              .eq("ticker", stock.ticker);
            // }
          }
        } catch (error) {
          console.log("ERROR", index, stock.ticker);
        }
      }, 600 * index);
    });
  }

  res.json({ message: "Ok" });
}
