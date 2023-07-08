// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { clientMongo } from "@/config/clientMongo";
import { StockModel } from "@/models/stock-model";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await clientMongo();
  // const r = await StockModel.findOne({ ticker: "AAPL" });

  res.status(200).json({ message: "Ok" });
}
