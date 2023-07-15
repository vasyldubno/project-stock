import { supabaseClient } from "@/config/supabaseClient";

export const getTotalReturn = async () => {
  const stockPortfolio = await supabaseClient.from("stock_portfolio").select();

  const result = stockPortfolio.data?.reduce((acc, item) => {
    if (item.gainRealizedValue) {
      return (acc += item.gainRealizedValue);
    }
    return acc;
  }, 0);

  return result;
};
