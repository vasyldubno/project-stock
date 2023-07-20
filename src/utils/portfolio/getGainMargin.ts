import { supabaseClient } from "@/config/supabaseClient";
import { getMarketCap } from "./getMarketCap";

export const getGainMargin = async () => {
  const supaStocks = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true);

  const marketCap = await getMarketCap();

  const cost = supaStocks.data?.reduce((acc, item) => {
    if (item.average_cost_per_share && item.amount_active_shares) {
      return (acc += item.average_cost_per_share * item.amount_active_shares);
    }
    return acc;
  }, 0);

  if (cost) {
    const result = (marketCap * 100) / cost - 100;
    return Number(result.toFixed(2));
  }
};
