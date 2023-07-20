import { xataClient } from "@/config/xataClient";
import { getHTML } from "@/utils/getHTML";
import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import { supabaseClient } from "@/config/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient
    .from("stock")
    .select()
    .gte("roe", 20)
    .gte("priceGrowth", 20)
    .gte("analystRatingBuy", 10)
    .lte("pe", 30)
    .gt("pe", 0);

  const stockPortfolio = await supabaseClient.from("stock_portfolio").select();

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
