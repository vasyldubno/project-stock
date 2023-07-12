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
      try {
        console.log(index, stock.ticker);

        // const price = await axios.get(
        //   `https://markets.sh/api/v1/symbols/${stock.exchange}:${stock.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b`
        // );

        // const marketPrice = Number(price.data.last_price);

        const price = await axios.get<{
          data: { primaryData: { lastSalePrice: string } };
        }>(
          `https://api.nasdaq.com/api/quote/${stock.ticker}/info?assetclass=stocks`
        );

        const marketPrice = Number(
          Number(
            price.data.data.primaryData.lastSalePrice.split("$")[1]
          ).toFixed(2)
        );

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
      } catch {
        console.log("ERROR", stock.ticker);
      }
    }
  });

  res.json({ message: "Ok", portfolio });
}
