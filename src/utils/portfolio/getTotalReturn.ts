import { supabaseClient } from "@/config/supabaseClient";

export const getTotalReturn = async () => {
  const stockPortfolio = await supabaseClient.from("stock_portfolio").select();

  const result = stockPortfolio.data?.reduce((acc, item) => {
    if (item.total_return_value && item.average_cost_per_share) {
      return (acc += item.total_return_value + item.average_cost_per_share);
    }
    return acc;
  }, 0);

  return result;
};
