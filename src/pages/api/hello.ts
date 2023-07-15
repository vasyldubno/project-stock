// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { xataClient } from "@/config/xataClient";
import { supabaseClient } from "@/config/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const r = await supabaseClient
  //   .from("stock")
  //   .update({ price_current: 30 })
  //   .eq("ticker", "ZI")
  //   .select();

  await supabaseClient
    .from("stock_portfolio")
    .update({ average_cost_per_share: null })
    .eq("ticker", "FSLR");

  res.json({
    message: "Ok",
  });
}
