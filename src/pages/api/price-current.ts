import { xataClient } from "@/types/xata";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await xataClient.db.stock.getAll();

  stocks.forEach((stock, index) => {
    console.log("START");
    setTimeout(async () => {
      try {
        const response = await axios.get<{ last_price: number }>(
          `https://markets.sh/api/v1/symbols/${stock.exchange}:${stock.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b`
        );

        if (stock.ticker) {
          const xataStock = await xataClient.db.stock
            .filter("ticker", stock.ticker)
            .getFirst();

          if (xataStock) {
            await xataClient.db.stock.update(xataStock.id, {
              priceCurrent: Number(response.data.last_price.toFixed(2)),
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
    }, 300 * index);
  });

  res.json({ stocks });
}
