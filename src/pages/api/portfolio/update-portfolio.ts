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
            `https://markets.sh/api/v1/symbols/${stock.exchange}:${stock.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b`
          );

          const marketPrice = responsePrice.data.last_price;

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
    }, 600 * index);
  });

  res.json({ message: "Ok" });
}
