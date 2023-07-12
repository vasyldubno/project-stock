// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const price = await axios.get<{
  //   data: { primaryData: { lastSalePrice: string } };
  // }>(`https://api.nasdaq.com/api/quote/USB/info?assetclass=stocks`);

  try {
    const response = await axios.get(
      "https://finnhub.io/api/v1/quote?symbol=USB&token=cenkaeiad3i2t1u14mvgcenkaeiad3i2t1u14n00"
    );

    res.json({ price: response.data.c });
  } catch {
    res.status(500).send("Error fetching data");
  }
}
