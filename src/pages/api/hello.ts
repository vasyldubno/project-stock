// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

interface INasdaqDividends {
  data: {
    dividends: {
      rows: {
        exOrEffDate: string;
        type: string;
        amount: string;
        declarationDate: string;
        recordDate: string;
        paymentDate: string;
        currency: string;
      }[];
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const price = await axios.get<{
    data: { primaryData: { lastSalePrice: string } };
  }>(`https://api.nasdaq.com/api/quote/USB/info?assetclass=stocks`);

  res.status(200).json({ message: "Ok" });
}
