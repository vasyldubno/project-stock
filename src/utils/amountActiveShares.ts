import { supabaseClient } from "@/config/supabaseClient";
import { xataClient } from "@/config/xataClient";

export const getAmountActiveShares = async (ticker: string) => {
  // const activeShares = await xataClient.db.transaction
  //   .filter({ ticker, type: "buy" })
  //   .getAll();

  const activeShares = await supabaseClient
    .from("transaction")
    .select()
    .eq("ticker", ticker)
    .eq("type", "buy");

  if (activeShares.data) {
    const amountActiveShares = activeShares.data.reduce((acc, item) => {
      if (item.count) {
        return (acc += item.count);
      }
      return acc;
    }, 0);

    return amountActiveShares;
  }

  return 0;
};
