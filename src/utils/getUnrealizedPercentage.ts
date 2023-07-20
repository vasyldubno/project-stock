import { supabaseClient } from "@/config/supabaseClient";

export const getUnrealizedPercentage = async (
  ticker: string,
  marketPrice: number
) => {
  const transactions = await supabaseClient
    .from("transaction")
    .select()
    .eq("ticker", ticker);

  if (transactions.data) {
    const result = transactions.data.reduce((acc, item) => {
      if (item.price) {
        const res = Number(
          (((marketPrice - item.price) / item.price) * 100).toFixed(2)
        );
        return (acc += res);
      }
      return acc;
    }, 0);

    return result;
  }
};
