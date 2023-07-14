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
      try {
        if (stock.ticker) {
          const responsePrice = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=cenkaeiad3i2t1u14mvgcenkaeiad3i2t1u14n00`
          );

          const marketPrice = responsePrice.data.c;

          console.log(index, stock.ticker, marketPrice);

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
      } catch {
        console.log("ERROR", index, stock.ticker);
      }
    }, 1000 * index);
  });

  res.json({ message: "Ok", portfolio });
}
