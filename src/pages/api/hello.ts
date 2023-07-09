// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getXataClient } from "@/types/xata";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const xata = getXataClient();
  const stocks = await xata.db.stock.filter("marketCap", 0).getAll();

  res.status(200).json({ name: "John Doe", stocks });
}
