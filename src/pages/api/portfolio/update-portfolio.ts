import { xataClient } from "@/config/xataClient";
import { getUnrealizedPercentage } from "@/utils/getUnrealizedPercentage";
import { getUnrealizedValue } from "@/utils/getUnrealizedValue";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const portfolio = await xataClient.db.portfolioStock
    .filter("isTrading", true)
    .getAll();

  portfolio.forEach(async (stock, index) => {
    if (stock.ticker) {
      console.log(index, stock.ticker);

      const price = await axios.get(
        `https://markets.sh/api/v1/symbols/${stock.exchange}:${stock.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b`
      );

      const marketPrice = Number(price.data.last_price);

      await xataClient.db.portfolioStock.update(stock.id, {
        marketPrice,
        gainUnrealizedValue: await getUnrealizedValue(
          stock.ticker,
          marketPrice
        ),
        gainUnrealizedPercentage: await getUnrealizedPercentage(
          stock.ticker,
          marketPrice
        ),
      });
    }
  });

  res.json({ message: "Ok", portfolio });
}
