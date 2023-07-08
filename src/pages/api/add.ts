// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { clientMongo } from "@/config/clientMongo";
import { StockModel } from "@/models/stock-model";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const connectedToDB = await clientMongo();
  // const r = await StockModel.findOne({ ticker: "AAPL" });

  console.log(process.env.NEXT_PUBLIC_MONGODB_URL);
  console.log(process.env.NEXT_PUBLIC_MONGODB_DATABASE);

  res.status(200).json({ message: "Ok" });
}
