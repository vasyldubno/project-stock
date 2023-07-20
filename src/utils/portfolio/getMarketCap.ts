import { supabaseClient } from "@/config/supabaseClient";

export const getMarketCap = async () => {
  const stockPortfolio = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true);

  const result = stockPortfolio.data?.reduce((acc, item) => {
    if (item.market_price && item.amount_active_shares) {
      return (acc += item.market_price * item.amount_active_shares);
    }
    return acc;
  }, 0);

  return Number(result?.toFixed(2));
};
