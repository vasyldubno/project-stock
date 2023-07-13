import { xataClient } from "@/config/xataClient";
import { isNegative } from "@/utils/isNegative";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await xataClient.db.stock.getAll();

  stocks.forEach(async (stock, index) => {
    setTimeout(async () => {
      try {
        const response = await axios.get<{ last_price: number }>(
          `https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=cenkaeiad3i2t1u14mvgcenkaeiad3i2t1u14n00`
        );
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
            const priceGrowth = Number(
              (
                ((xataStock.priceTarget - xataStock.priceCurrent) /
                  xataStock.priceCurrent) *
                100
              ).toFixed(2)
            );

            await xataClient.db.stock.update(xataStock.id, {
              priceCurrent: Number(response.data.last_price.toFixed(2)),
              pe: isNegative(
                Number(response.data.last_price.toFixed(2)) / xataStock.eps
              )
                ? 0
                : Number(response.data.last_price.toFixed(2)) / xataStock.eps,
              priceGrowth,
            });
          }
        }
        if (index === stocks.length - 1) {
          console.log("FINISH");
        } else {
          console.log(`${index} ${stock.ticker}`);
        }
      } catch (error) {
        console.log(`${stock.ticker} ${error}`);
      }
    }, 1000 * index);
  });

  res.json({ stocks });
}
