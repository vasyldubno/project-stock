// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientMongo from "@/config/clientMongo";
import { StockModel } from "@/models/stock-model";
import { getXataClient } from "@/types/xata";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const connectedToDB = await clientMongo();
  // const r = await StockModel.findOne({ ticker: "AAPL" });

  // const mongo = await clientMongo;

  const xata = getXataClient();
  const a = await xata.db.stock.getAll();

  res.status(200).json({
    message: "Ok",
    a,
  });
}
