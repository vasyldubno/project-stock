import { xataClient } from "@/config/xataClient";
import { getHTML } from "@/utils/getHTML";
import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stocks = await xataClient.db.stock.getAll();
  // const stocks = [{ ticker: "AAPL" }];

  stocks.forEach((stock, index) => {
    console.log(index, stock.ticker);
    setTimeout(async () => {
      try {
        const html = await getHTML(
          `https://finviz.com/quote.ashx?t=${stock.ticker}`
        );
        const $ = cheerio.load(html);

        const pe = $(
          ".snapshot-table-wrapper > table > tbody > tr:nth-child(1) td:nth-child(4)"
        ).text();
        const peg = $(
          ".snapshot-table-wrapper > table > tbody > tr:nth-child(3) td:nth-child(4)"
        ).text();
        const roe = $(
          ".snapshot-table-wrapper > table > tbody > tr:nth-child(6) td:nth-child(8)"
        ).text();
        const annualDividend = $(
          ".snapshot-table-wrapper > table > tbody > tr:nth-child(7) td:nth-child(2)"
        ).text();
        const dividendYield = $(
          ".snapshot-table-wrapper > table > tbody > tr:nth-child(8) td:nth-child(2)"
        ).text();
        const payoutRation = $(
          ".snapshot-table-wrapper > table > tbody > tr:nth-child(11) td:nth-child(8)"
        ).text();
        const eps = $(
          ".snapshot-table-wrapper > table > tbody > tr:nth-child(1) td:nth-child(6)"
        ).text();

        if (stock.ticker) {
          const xataStock = await xataClient.db.stock
            .filter("ticker", stock.ticker)
            .getFirst();

          if (xataStock) {
            await xataClient.db.stock.update(xataStock.id, {
              pe: Number(pe),
              roe: Number(roe.split("%")[0]),
              annualDividend: Number(annualDividend),
              dividendYield: Number(dividendYield.split("%")[0]),
              payoutRation: Number(payoutRation.split("%")[0]),
              eps: Number(eps),
            });
          }
        }

        if (index === stocks.length - 1) {
          console.log("FINISH");
        }
      } catch {
        console.log("ERROR =>", index, stock.ticker);
      }
    }, 300 * index);
  });

  res.json({ stocks });
}
