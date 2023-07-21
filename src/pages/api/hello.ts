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
  const {
    data: { last_price },
  } = await axios.get(
    "https://markets.sh/api/v1/symbols/NYSE:SQ?api_token=7ea62693bd4ebc0ae34595335732676b"
  );

  const stock = await supabaseClient
    .from("stock")
    .select()
    .eq("ticker", "A")
    .single();

  if (stock.data && last_price) {
    const price = Number(last_price.toFixed(2));
    await supabaseClient
      .from("stock")
      .update({ price_current: price })
      .eq("ticker", "A");
  }

  // await supabaseClient.from("test").insert({ content: last_price });

  res.json({
    message: "Ok",
  });
}
