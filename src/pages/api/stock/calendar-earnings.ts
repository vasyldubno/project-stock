import { xataClient } from "@/config/xataClient";
import { getHTML } from "@/utils/getHTML";
import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import { supabaseClient } from "@/config/supabaseClient";
import { updateReportDate } from "@/utils/stock/updateReportDate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient
    .from("stock")
    .select()
    .order("report_date", { ascending: true });

  const portfolio = await supabaseClient.from("stock_portfolio").select();

  if (stocks.data && portfolio.data) {
    const portfolioArrayTicker = portfolio.data.map((item) => item.ticker);

    const today = new Date();
    const endOfMonth = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1,
      0
    );

    const a = stocks.data.filter((item) => {
      if (item.report_date) {
        const objDate = new Date(item.report_date);
        return (
          objDate >= today &&
          objDate <= endOfMonth &&
          portfolioArrayTicker.includes(item.ticker)
        );
      }
    });

    res.json({
      message: "Ok",
      stocks: a,
    });
  }
}
