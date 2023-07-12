// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { xataClient } from "@/config/xataClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const price = await axios.get<{
  //   data: { primaryData: { lastSalePrice: string } };
  // }>(`https://api.nasdaq.com/api/quote/USB/info?assetclass=stocks`);

  try {
    const xataPortfolio = await xataClient.db.portfolioStock.getAll();

    if (xataPortfolio) {
      xataPortfolio.forEach((item, index) => {
        setTimeout(async () => {
          const response = await axios.get(
            `https://markets.sh/api/v1/symbols/${item.exchange}:${item.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b `
          );

          console.log(index, response.data.last_price);
        }, 0 * index);
      });
    }

    res.json({ message: "Ok" });
  } catch {
    res.status(500).send("Error fetching data");
  }
}
