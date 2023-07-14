// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { xataClient } from "@/config/xataClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const xataStocks = await xataClient.db.stock.getAll();

  if (xataStocks) {
    xataStocks.forEach((stock, index) => {
      setTimeout(async () => {
        try {
          const responsePrice = await axios.get(
            `https://markets.sh/api/v1/symbols/${stock.exchange}:${stock.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b`
          );

          if (index === 0) {
            console.log("START");
          } else if (index === xataStocks.length - 1) {
            console.log("FINISH");
          } else {
            console.log(index, stock.ticker, responsePrice.data.last_price);
          }
        } catch {
          console.log("ERROR", stock.ticker);
        }
      }, 600 * index);
    });
  }

  res.json({ message: "Ok" });
}
