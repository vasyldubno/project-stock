import { xataClient } from "@/config/xataClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await xataClient.db.stock.getAll();

  stocks.forEach(async (stock, index) => {
    console.log(index, stock.ticker);

    if (stock.priceCurrent && stock.priceTarget && stock.ticker) {
      const priceGrowth = Number(
        (
          ((stock.priceTarget - stock.priceCurrent) / stock.priceCurrent) *
          100
        ).toFixed(2)
      );

      const xataStock = await xataClient.db.stock
        .filter("ticker", stock.ticker)
        .getFirst();

      if (xataStock) {
        await xataClient.db.stock.update(xataStock.id, { priceGrowth });
      }
    }
  });

  res.json({ stocks });
}
