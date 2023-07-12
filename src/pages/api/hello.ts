// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const price = await axios.get<{
  //   data: { primaryData: { lastSalePrice: string } };
  // }>(`https://api.nasdaq.com/api/quote/USB/info?assetclass=stocks`);

  try {
    const response = await fetch(
      "https://api.nasdaq.com/api/quote/USB/info?assetclass=stocks"
    );

    const data = response.json();

    res.json({ data });
  } catch {
    res.status(500).send("Error fetching data");
  }
}
