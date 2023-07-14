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
  const xataStocks = await xataClient.db.stock.getAll();

  xataStocks.forEach((stock, index) => {
    setTimeout(async () => {
      try {
        console.log(index, stock.ticker);
        if (stock.ticker) {
          const xataStock = await xataClient.db.stock
            .filter("ticker", stock.ticker)
            .getFirst();

          if (
            xataStock &&
            xataStock.eps &&
            xataStock.priceTarget &&
            xataStock.priceCurrent
          ) {
            const pe = await getPE(stock);
            const priceGrowth = getPriceGrowth(stock);
            const priceCurrent = await getPriceCurrent(stock.ticker);

            await xataClient.db.stock.update(xataStock.id, {
              priceCurrent,
              pe: isNegative(pe) ? 0 : pe,
              priceGrowth,
            });
          }
        }
      } catch (error) {
        console.log("ERROR", index, stock.ticker);
      }
    }, 2000 * index);
  });

  res.json({ message: "Ok" });
}
