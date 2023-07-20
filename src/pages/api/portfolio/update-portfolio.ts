import { supabaseClient } from "@/config/supabaseClient";
import { getUnrealizedPercentage } from "@/utils/getUnrealizedPercentage";
import { getUnrealizedValue } from "@/utils/getUnrealizedValue";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true)
    .order("ticker", { ascending: true });

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      setTimeout(async () => {
        try {
          const responsePrice = await axios.get(
            `https://markets.sh/api/v1/symbols/${stock.exchange}:${stock.ticker}?api_token=7ea62693bd4ebc0ae34595335732676b`
          );

          const marketPrice = responsePrice.data.last_price;

          await supabaseClient
            .from("stock_portfolio")
            .update({
              market_price: marketPrice,
              gain_unrealized_value:
                (await getUnrealizedValue(stock.ticker, marketPrice)) ?? null,
              gain_unrealized_percentage:
                (await getUnrealizedPercentage(stock.ticker, marketPrice)) ??
                null,
            })
            .eq("ticker", stock.ticker);

          console.log(index, stock.ticker, marketPrice);
        } catch {
          console.log("ERROR", index, stock.ticker);
        }
      }, index * 600);
    });
  }

  res.json({ message: "Ok" });
}
