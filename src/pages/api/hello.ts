// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { xataClient } from "@/config/xataClient";
import { supabaseClient } from "@/config/supabaseClient";
import { getMarketCap } from "@/utils/portfolio/getMarketCap";
import { getTotalReturn } from "@/utils/portfolio/getTotalReturn";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const r = await supabaseClient
  //   .from("stock")
  //   .update({ price_current: 30 })
  //   .eq("ticker", "ZI")
  //   .select();

  // await supabaseClient
  //   .from("stock_portfolio")
  //   .update({ average_cost_per_share: null })
  //   .eq("ticker", "FSLR");

  const allTransactionsBuy = await supabaseClient
    .from("transaction")
    .select()
    .eq("type", "buy");

  const allStockPortfolio = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("is_trading", true);

  const totalCost = Number(
    allTransactionsBuy.data
      ?.reduce((acc, item) => {
        return (acc += item.count * item.price);
      }, 0)
      ?.toFixed(2)
  );

  const totalGain$ = Number(
    allStockPortfolio.data
      ?.reduce((acc, item) => {
        if (item.gain_unrealized_value) {
          return (acc += item.gain_unrealized_value);
        }
        return acc;
      }, 0)
      ?.toFixed(2)
  );

  const totalGain = allStockPortfolio.data?.reduce((acc, item) => {
    if (item.gain_unrealized_percentage) {
      return (acc += item.gain_unrealized_percentage);
    }
    return acc;
  }, 0);

  res.json({
    message: "Ok",
    totalCost,
    totalReturn: await getTotalReturn(),
    totalGain$,
    totalGain,
    marketCap: await getMarketCap(),
  });
}
