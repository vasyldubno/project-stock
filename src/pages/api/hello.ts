// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseClient } from "@/config/supabaseClient";
import { ROUND } from "@/utils/round";
import axios from "axios";
import { load } from "cheerio";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supaStockPortfolio = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("portfolio_id", "66f93f95-8f8e-49f3-be47-80d203c0eef5")
    .eq("is_trading", true);

  if (supaStockPortfolio.data) {
    const cost = supaStockPortfolio.data.reduce(
      (acc, item) =>
        (acc +=
          Number(item.amount_active_shares) *
          Number(item.average_cost_per_share)),
      0
    );

    console.log(cost);
  }

  const supaTransactionBuy = await supabaseClient
    .from("transaction")
    .select()
    .eq("type", "buy");

  const supaTransactionSell = await supabaseClient
    .from("transaction")
    .select()
    .eq("type", "sell");

  const supaDividend = await supabaseClient.from("dividend").select();

  if (
    supaTransactionBuy.data &&
    supaTransactionSell.data &&
    supaDividend.data
  ) {
    const buy = supaTransactionBuy.data.reduce(
      (acc, item) => (acc += item.price * item.count),
      0
    );

    const sell = supaTransactionSell.data.reduce(
      (acc, item) => (acc += item.price * item.count),
      0
    );

    const dividends = supaDividend.data.reduce(
      (acc, item) => (acc += item.totalAmount),
      0
    );

    // console.log(10000 - buy + sell + dividends);
  }

  res.json({
    message: "Ok",
  });
}
