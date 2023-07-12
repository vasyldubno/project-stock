// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { xataClient } from "@/config/xataClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const existTest = await xataClient.db.test.getFirst();

  if (existTest) {
    await xataClient.db.test.update(existTest.id, {
      amount: { $increment: 1 },
    });
  } else {
    await xataClient.db.test.create({ amount: 0 });
  }

  res.json({ message: "Ok" });
}
