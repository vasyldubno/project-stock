// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getXataClient } from "@/types/xata";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
  second: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const xata = getXataClient();
  const a = await xata.db.index.getAll();

  res.status(200).json({ name: "John Doe", second: a });
}
