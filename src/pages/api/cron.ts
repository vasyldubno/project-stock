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
  const job = new cron.CronJob("*/1 * * * *", async () => {
    await axios.get("http://localhost:3000/api/portfolio/update-portfolio");
  });

  job.start();

  res.status(200).json({ message: "Ok" });
}
