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

  portfolio.forEach((stock, index) => {
    setTimeout(async () => {
      console.log(index, stock.ticker);
      if (stock.ticker) {
        // const responsePrice = await axios.get(
        //   `https://markets.sh/api/v1/symbols/${stock.exchange}:${stock.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b`
        // );

        // const marketPrice = Number(responsePrice.data.last_price);

        const responsePrice = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=cenkaeiad3i2t1u14mvgcenkaeiad3i2t1u14n00`
        );

        const marketPrice = responsePrice.data.c;

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
    }, 1000 * index);
  });

  res.json({ message: "Ok", portfolio });
}
