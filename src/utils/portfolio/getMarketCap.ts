import { supabaseClient } from "@/config/supabaseClient";

export const getMarketCap = async (portfolioId: string) => {
  const stockPortfolio = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true)
    .eq("portfolio_id", portfolioId);

  const result = stockPortfolio.data?.reduce((acc, item) => {
    if (item.price_current && item.amount_active_shares) {
      return (acc += item.price_current * item.amount_active_shares);
    }
    return acc;
  }, 0);

  return Number(result?.toFixed(2));
};
