// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getXataClient } from "@/types/xata";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const xata = getXataClient();
  // const a = await xata.db.stock.getAll();

  res.status(200).json({
    message: "Ok",
    // a,
    xata,
  });
}
