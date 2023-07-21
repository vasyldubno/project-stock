// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";
import axios from "axios";
import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "@/utils/getHTML";
import { getGFValue } from "@/utils/stock/getGFValue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await supabaseClient.from("stock").select().limit(10);

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      setTimeout(async () => {
        // console.log(await getGFValue(stock.ticker));
      }, index * 15000);
    });
  }

  res.json({
    message: "Ok",
  });
}
