// TIMEOUT 300ms

import { supabaseClient } from "@/config/supabaseClient";
import { getHTML } from "../getHTML";
import { load } from "cheerio";

export const updateReportDate = async (ticker: string) => {
  const html = await getHTML(
    `https://www.zacks.com/stock/research/${ticker}/earnings-calendar`
  );
  const $ = load(html);
  const element = $(
    ".key-expected-earnings-data-module > table > tbody > tr > th:nth-child(1)"
  ).text();

  const isValid = !element.startsWith("NA");

  if (isValid && element.length > 0) {
    try {
      const month = element.split("/")[0];
      const day = element.split("/")[1];
      const year = element.split("/")[2].substring(0, 4);

      const date = `${year}-${month}-${day}`;
      await supabaseClient
        .from("stock")
        .update({ report_date: date })
        .eq("ticker", ticker);
    } catch {
      // console.log("ERROR CHEERIO updateReportdate =>", ticker);
    }
  }
};
