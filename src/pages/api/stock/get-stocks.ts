import { xataClient } from "@/config/xataClient";
import { getHTML } from "@/utils/getHTML";
import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await xataClient.db.stock
    .select(["roe", "priceGrowth", "analystRating.*", "pe", "ticker"])
    .filter({
      roe: { $ge: 20 },
      priceGrowth: { $ge: 20 },
      analystRating: { buy: { $ge: 10 } },
      pe: { $le: 30, $gt: 0 },
    })
    .getAll();

  const xataPortfolioStocks = await xataClient.db.portfolioStock
    .filter("isTrading", true)
    .getAll();

  res.json({
    stocks: stocks.filter(
      (item) =>
        !xataPortfolioStocks.some((item2) => item2.ticker === item.ticker)
    ),
  });
}
