import { supabaseClient } from "@/config/supabaseClient";

export const getGainValue = async () => {
  const allStockPortfolio = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true);

  const result = Number(
    allStockPortfolio.data
      ?.reduce((acc, item) => {
        if (item.gain_unrealized_value) {
          return (acc += item.gain_unrealized_value);
        }
        return acc;
      }, 0)
      ?.toFixed(2)
  );

  return result;
};
