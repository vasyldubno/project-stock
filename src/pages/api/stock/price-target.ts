import { xataClient } from "@/config/xataClient";
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
        const price = await axios.get(
          `https://api.nasdaq.com/api/analyst/${stock.ticker}/targetprice`
        );

        const priceTarget = Number(
          price.data.data.consensusOverview.priceTarget
        );
        const buy = Number(price.data.data.consensusOverview.buy);

        if (stock.ticker) {
          const xataStock = await xataClient.db.stock
            .filter("ticker", stock.ticker)
            .getFirst();

          if (xataStock) {
            if (!xataStock.analystRating?.id) {
              const newAnalystRating = await xataClient.db.analystRating.create(
                {
                  buy,
                }
              );

              await xataClient.db.stock.update(xataStock.id, {
                priceTarget,
                analystRating: { id: newAnalystRating.id },
              });
            } else {
              await xataClient.db.analystRating.update(
                xataStock.analystRating.id,
                { buy }
              );
              await xataClient.db.stock.update(xataStock.id, { priceTarget });
            }
          }
        }

        console.log(index, stock.ticker);
      } catch (err) {
        console.log("ERROR =>", stock.ticker, err);
      }
    }, 200 * index);
  });

  res.json({ stocks });
}
