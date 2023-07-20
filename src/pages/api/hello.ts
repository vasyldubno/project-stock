// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";
import axios from "axios";
import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "@/utils/getHTML";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient
    .from("stock")
    .select()
    .order("ticker", { ascending: true });

  const portfolio = await supabaseClient.from("stock_portfolio").select();

  if (stocks.data && portfolio.data) {
    const portfolioArrayTicker = portfolio.data.map((item) => item.ticker);

    const a = stocks.data.filter(
      (item) =>
        item.report_date?.includes("2023-07") &&
        portfolioArrayTicker.includes(item.ticker)
    );

    res.json({
      message: "Ok",
      stocks: a,
    });
  }
}
