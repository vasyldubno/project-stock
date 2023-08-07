import { supabaseClient } from "@/config/supabaseClient";
import { useQuery } from "react-query";

export const useStocks = (tickers: string[]) => {
  const { data } = useQuery({
    queryKey: ["stocksBySecrorAndIndustry", { tickers }],
    queryFn: async () => {
      const res = await supabaseClient
        .from("stock")
        .select()
        .in("ticker", tickers);
      return res;
    },
    enabled: tickers.length > 0,
  });
  return data;
};
