// timeout === 100

import { load } from "cheerio";
import { getHTML } from "../getHTML";

export const getGFValue = async (ticker: string) => {
  try {
    const html = await getHTML(
      `https://www.gurufocus.com/term/gf_value/${ticker.replace(
        "-",
        "."
      )}/GF-Value/`
    );

    if (html) {
      const $ = load(html);
      const result = $("#def_body_detail_height").find("font").first().text();
      return Number(result.replace(/[^0-9.]/g, ""));
    }
  } catch {
    console.log("ERROR => GET_GF_VALUE", ticker);
  }
};
