// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getXataClient } from "@/types/xata";
import type { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import { getHTML } from "@/utils/getHTML";
import { convertTicker } from "@/utils/convertTicker";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const xata = getXataClient();

  const stocks = await xata.db.stock.getAll();

  stocks.forEach(async (stock, index) => {
    setTimeout(async () => {
      try {
        const html = await getHTML(
          `https://www.gurufocus.com/term/mktcap/${convertTicker(
            stock.ticker
          )}/Market-Cap/`
        );

        if (html) {
          const $ = cheerio.load(html);
          const result = $("#def_body_detail_height")
            .find("font")
            .first()
            .text();

          if (stock.ticker) {
            const xataStock = await xata.db.stock
              .filter("ticker", stock.ticker)
              .getFirst();

            if (xataStock) {
              xata.db.stock.update(xataStock.id, {
                marketCap: Number(result.replace(/[^0-9.]/g, "")) * 1_000_000,
              });
            }
          }

          if (index === stocks.length - 1) {
            console.log("FINISH");
          }
        }
      } catch (error) {
        console.log(`${stock.ticker} ${error}`);
      }
    }, 100 * index);
  });

  res.status(200).json({
    message: "Ok",
  });
}
