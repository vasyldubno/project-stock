import { xataClient } from "@/config/xataClient";
import { getHTML } from "@/utils/getHTML";
import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import { supabaseClient } from "@/config/supabaseClient";
import { updateReportDate } from "@/utils/stock/updateReportDate";
import { getGFValue } from "@/utils/stock/getGFValue";

const convertMarketCap = (numberString: string) => {
  if (typeof numberString !== "string") {
    throw new Error("Input must be a string.");
  }

  const lastChar = numberString.slice(-1).toUpperCase();
  const numericPart = parseFloat(numberString);

  if (isNaN(numericPart)) {
    throw new Error("Invalid number format.");
  }

  let multiplier;

  switch (lastChar) {
    case "B":
      multiplier = 1000000000;
      break;
    case "M":
      multiplier = 1000000;
      break;
    default:
      throw new Error('Invalid abbreviation. Use "B" or "M".');
  }

  return numericPart * multiplier;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log("/API/STOCK/FUNDAMENTALS");
  const stocks = await supabaseClient
    .from("stock")
    .select()
    .order("ticker", { ascending: true });
  // .eq("ticker", "FMC");

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      setTimeout(async () => {
        try {
          const html = await getHTML(
            `https://finviz.com/quote.ashx?t=${stock.ticker}`
          );
          // console.log(index, stock.ticker);

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
          const marketCap = $(
            ".snapshot-table-wrapper > table > tbody > tr:nth-child(2) td:nth-child(2)"
          ).text();
          const de = $(
            ".snapshot-table-wrapper > table > tbody > tr:nth-child(10) td:nth-child(4)"
          ).text();

          const GFValue = (await getGFValue(stock.ticker)) ?? null;

          const getGFValueMargin = () => {
            if (GFValue && stock.price_current) {
              const result = Number(
                (
                  ((GFValue - stock.price_current) / stock.price_current) *
                  100
                ).toFixed(2)
              );
              return result;
            } else {
              return 0;
            }
          };

          await supabaseClient
            .from("stock")
            .update({
              pe: Number(pe),
              roe: Number(roe.split("%")[0]),
              eps: Number(eps),
              annualDividend: Number(annualDividend),
              dividendYield: Number(dividendYield.split("%")[0]),
              payoutRation: Number(payoutRation.split("%")[0]),
              marketCap: convertMarketCap(marketCap),
              gfValue: GFValue,
              gfValueMargin: getGFValueMargin(),
              de: Number(de),
            })
            .eq("ticker", stock.ticker);

          updateReportDate(stock.ticker);
        } catch {
          // console.log("ERROR => /API/STOCK/FUNDAMENTALS", stock.ticker);
        }
      }, 300 * index);
    });
  }

  res.json({ message: "Ok" });
}
