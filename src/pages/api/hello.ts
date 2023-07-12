// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { xataClient } from "@/config/xataClient";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment-timezone";
import { getAmountActiveShares } from "@/utils/amountActiveShares";
import cron from "cron";

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
  // const job = new cron.CronJob("*/1 * * * *", async () => {
  //   await axios.get(
  //     `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/portfolio/update-portfolio`
  //   );
  // });

  // job.start();

  const price = await axios.get<{
    data: { primaryData: { lastSalePrice: string } };
  }>(`https://api.nasdaq.com/api/quote/USB/info?assetclass=stocks`);

  const marketPrice = Number(
    Number(price.data.data.primaryData.lastSalePrice.split("$")[1]).toFixed(2)
  );

  res.status(200).json({ message: "Ok", marketPrice });
}
