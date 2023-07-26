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
  const portfolio = await supabaseClient.from("portfolio").select().single();

  if (portfolio.data) {
    const r = await supabaseClient
      .from("portfolio")
      .update({
        total_return: 610.6,
      })
      .eq("id", portfolio.data.id);

    console.log(r);
  }

  res.json({
    message: "Ok",
  });
}
