// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { clientMongo } from "@/config/clientMongo";
import { StockModel } from "@/models/stock-model";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const connectedToDB = await clientMongo();
  // const r = await StockModel.findOne({ ticker: "AAPL" });

  try {
    const response = await mongoose.connect(
      process.env.NEXT_PUBLIC_MONGODB_URL as string,
      {
        dbName: process.env.NEXT_PUBLIC_MONGODB_DATABASE as string,
      }
    );

    res.status(200).json({
      message: "Ok",
      a: process.env.NEXT_PUBLIC_MONGODB_URL,
      b: process.env.NEXT_PUBLIC_MONGODB_DATABASE,
      response,
    });
  } catch (error) {
    res.status(200).json({
      error,
    });
  }
}
