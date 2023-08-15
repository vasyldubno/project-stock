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
  res.json({
    message: "Ok",
  });
}
