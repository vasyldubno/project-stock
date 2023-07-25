// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";
import axios from "axios";
import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "@/utils/getHTML";
import { getGFValue } from "@/utils/stock/getGFValue";
import cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient
    .from("transaction")
    .select()
    .eq("type", "buy")
    .order("ticker", { ascending: true });

  const html = await getHTML(
    "https://www.nasdaq.com/market-activity/stocks/ko/dividend-history"
  );
  const $ = cheerio.load(html);
  const a = $("table.dividend-history__table").html();
  console.log(a);

  res.json({
    message: "Ok",
  });
}
