import { supabaseClient } from "@/config/supabaseClient";

export const getGainValue = async (portfolioId: string) => {
  const allStockPortfolio = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true)
    .eq("portfolio_id", portfolioId);

  const result = Number(
    allStockPortfolio.data
      ?.reduce((acc, item) => {
        if (item.gain_value) {
          return (acc += item.gain_value);
        }
        return acc;
      }, 0)
      ?.toFixed(2)
  );

  return result;
};
