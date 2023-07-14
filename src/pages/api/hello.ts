// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { xataClient } from "@/config/xataClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json({ message: "Ok" });
}
