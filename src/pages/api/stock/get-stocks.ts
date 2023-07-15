import { xataClient } from "@/config/xataClient";
import { getHTML } from "@/utils/getHTML";
import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import { supabaseClient } from "@/config/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const stocks = await xataClient.db.stock
  //   .select(["roe", "priceGrowth", "analystRating.*", "pe", "ticker"])
  //   .filter({
  //     roe: { $ge: 20 },
  //     priceGrowth: { $ge: 20 },
  //     analystRating: { buy: { $ge: 10 } },
  //     pe: { $le: 30, $gt: 0 },
  //   })
  //   .getAll();

  const stocks = await supabaseClient
    .from("stock")
    .select()
    .gte("roe", 20)
    .gte("priceGrowth", 20)
    .gte("analystRatingBuy", 10)
    .lte("pe", 30)
    .gt("pe", 0);

  // const xataPortfolioStocks = await xataClient.db.portfolioStock
  //   .filter("isTrading", true)
  //   .getAll();

  const stockPortfolio = await supabaseClient.from("stock_portfolio").select();
  // .eq("isTrading", true);

  if (stocks.data && stockPortfolio.data) {
    res.json({
      stock: stockPortfolio.data,
      stocks: stocks.data.filter(
        (stock) =>
          !stockPortfolio.data.some(
            (stockPortfolio) => stockPortfolio.ticker === stock.ticker
          )
      ),
    });
  }
}
