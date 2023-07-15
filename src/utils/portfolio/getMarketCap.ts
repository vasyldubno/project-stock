import { supabaseClient } from "@/config/supabaseClient";
import { averageCostPerShare } from "../averageCostPerShare";
import { getAmountActiveShares } from "../amountActiveShares";

export const getMarketCap = async () => {
  const stockPortfolio = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true);

  const result = stockPortfolio.data?.reduce(async (accPromise, item) => {
    const acc = await accPromise;
    if (item.market_price) {
      return (
        acc + item.market_price * (await getAmountActiveShares(item.ticker))
      );
    }
    return acc;
  }, Promise.resolve(0));

  return result;
};
