import { supabaseClient } from "@/config/supabaseClient";
import axios from "axios";
import { load } from "cheerio";

export const updateMargins = async () => {
  const stocks = await supabaseClient
    .from("stock")
    .select()
    .order("ticker", { ascending: true });

  if (stocks.data) {
    stocks.data.forEach((stock, index) => {
      setTimeout(async () => {
        const htmlStockAnalysis = await axios.get(
          `https://stockanalysis.com/stocks/${stock.ticker.replace(
            "-",
            "."
          )}/financials/`
        );

        if (htmlStockAnalysis.data) {
          const $ = load(htmlStockAnalysis.data);

          let grossMargin = 0;
          let netMargin = 0;

          $("table[data-test='financials'] > tbody > tr").each((i, el) => {
            const a = $(el).find("td:nth-child(1) > span").text();

            if (a === "Gross Margin") {
              grossMargin = Number(
                $(el).find("td:nth-child(2)").text().split("%")[0]
              );
            }

            if (a === "Profit Margin") {
              netMargin = Number(
                $(el).find("td:nth-child(2)").text().split("%")[0]
              );
            }
          });

          await supabaseClient
            .from("stock")
            .update({
              gross_margin: Number(grossMargin),
              net_margin: Number(netMargin),
            })
            .eq("ticker", stock.ticker);
        }
      }, index * 5000);
    });
  }
};
