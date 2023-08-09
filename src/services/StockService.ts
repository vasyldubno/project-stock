import { CLIENT_URL } from "@/config/consts";
import { db } from "@/config/firebaseConfig";
import { supabaseClient } from "@/config/supabaseClient";
import {
  IStock,
  ISupaPortfolio,
  ISupaScreener,
  ISupaStock,
  IUser,
} from "@/types/types";
import axios from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { use } from "react";

export class StockService {
  static async updatePriceCurrent(userId: string) {
    return axios.post(`${CLIENT_URL}/api/stock/price-current`, { userId });
  }

  static async getCalendarEarnings(
    user: IUser | null,
    portfolio: ISupaPortfolio | null
  ) {
    const supaPortfolio = await supabaseClient
      .from("portfolio")
      .select()
      .eq("user_id", user?.id)
      .eq("id", portfolio?.id)
      .single();

    if (supaPortfolio.data) {
      const supaStockPortfolio = await supabaseClient
        .from("stock_portfolio")
        .select()
        .eq("portfolio_id", supaPortfolio.data.id);

      if (supaStockPortfolio.data) {
        const stockPortfolioTickers = supaStockPortfolio.data.map(
          (item) => item.ticker
        );

        if (stockPortfolioTickers) {
          const supaStock = await supabaseClient
            .from("stock")
            .select()
            .in("ticker", stockPortfolioTickers)
            .order("report_date", { ascending: true })
            .order("ticker", { ascending: true });

          if (supaStock.data) {
            const today = new Date();
            const endOfMonth = new Date(
              today.getUTCFullYear(),
              today.getUTCMonth() + 1,
              0
            );

            const result = supaStock.data.filter((item) => {
              if (item.report_date) {
                const objDate = new Date(item.report_date);
                return objDate >= today && objDate <= endOfMonth;
              }
            });

            return result;
          }
        }
      }
    }
  }

  static async updateFundamentals() {
    return axios.get(`${CLIENT_URL}/api/stock/fundamentals`);
  }

  static async updateUpcomingDividends(userId: string) {
    return axios.post(`${CLIENT_URL}/api/stock/update-upcome-dividends`, {
      userId,
    });
  }

  static async getStocksDividends() {
    const response = await supabaseClient
      .from("stock")
      .select()
      .gte("dividendYield", 1)
      // .lte("payoutRation", 70)
      // .lte("pe", 30)
      // .lte("de", 3)
      .gte("price_growth", 5)
      // .gte("roe", 20)
      .gte("analystRatingBuy", 5)
      .or("isDividendAristocrat.eq.true,isDividendKing.eq.true");

    return response.data;
  }

  static async getStocks(screener: ISupaScreener | null, user: IUser | null) {
    const supaPortfolio = await supabaseClient
      .from("portfolio")
      .select()
      .eq("user_id", user?.id);

    if (screener) {
      if (supaPortfolio.data) {
        const stockPortfolio = await supabaseClient
          .from("stock_portfolio")
          .select()
          .in(
            "portfolio_id",
            supaPortfolio.data.map((item) => item.id)
          )
          .order("ticker", { ascending: true });

        if (stockPortfolio.data) {
          const tickers = stockPortfolio.data.map((item) => item.ticker);

          const query = supabaseClient
            .from("stock")
            .select()
            .order("price_growth", { ascending: false });

          if (screener.roe) {
            if (screener.roe.startsWith(">")) {
              const value = parseFloat(screener.roe.slice(1));
              query.gt("roe", value);
              query.gte("roe", 0);
            } else if (screener.roe.startsWith("<")) {
              const value = parseFloat(screener.roe.slice(1));
              query.lt("roe", value);
              query.gte("roe", 0);
            }
          }

          if (screener.analyst) {
            if (screener.analyst.startsWith(">")) {
              const value = parseFloat(screener.analyst.slice(1));
              query.gt("analystRatingBuy", value);
            } else if (screener.analyst.startsWith("<")) {
              const value = parseFloat(screener.analyst.slice(1));
              query.lt("analystRatingBuy", value);
            }
          }

          if (screener.de) {
            if (screener.de.startsWith(">")) {
              const value = parseFloat(screener.de.slice(1));
              query.gt("de", value);
            } else if (screener.de.startsWith("<")) {
              const value = parseFloat(screener.de.slice(1));
              query.lt("de", value);
            }
          }

          if (screener.margin_safety) {
            if (screener.margin_safety.startsWith(">")) {
              const value = parseFloat(screener.margin_safety.slice(1));
              query.gt("gfValueMargin", value);
            } else if (screener.margin_safety.startsWith("<")) {
              const value = parseFloat(screener.margin_safety.slice(1));
              query.lt("gfValueMargin", value);
            }
          }

          if (screener.pe) {
            if (screener.pe.startsWith(">")) {
              const value = parseFloat(screener.pe.slice(1));
              query.gt("pe", value);
              query.gte("pe", 0);
            } else if (screener.pe.startsWith("<")) {
              const value = parseFloat(screener.pe.slice(1));
              query.lt("pe", value);
              query.gte("pe", 0);
            }
          }

          if (screener.priceGrowth) {
            if (screener.priceGrowth.startsWith(">")) {
              const value = parseFloat(screener.priceGrowth.slice(1));
              query.gt("price_growth", value);
            } else if (screener.priceGrowth.startsWith("<")) {
              const value = parseFloat(screener.priceGrowth.slice(1));
              query.lt("price_growth", value);
            }
          }

          if (screener.payout_ratio) {
            if (screener.payout_ratio.startsWith(">")) {
              const value = parseFloat(screener.payout_ratio.slice(1));
              query.gt("payoutRation", value);
            } else if (screener.payout_ratio.startsWith("<")) {
              const value = parseFloat(screener.payout_ratio.slice(1));
              query.lt("payoutRation", value);
            }
          }

          if (screener.dividend_yield) {
            if (screener.dividend_yield.startsWith(">")) {
              const value = parseFloat(screener.dividend_yield.slice(1));
              query.gt("dividendYield", value);
            } else if (screener.dividend_yield.startsWith("<")) {
              const value = parseFloat(screener.dividend_yield.slice(1));
              query.lt("dividendYield", value);
            }
          }

          if (screener.sector) {
            query.eq("sector", screener.sector);
          }

          if (screener.industry) {
            query.eq("subIndustry", screener.industry);
          }

          const result = await query;

          if (result.data) {
            const res = result.data.filter(
              (item) => !tickers.includes(item.ticker)
            );
            return res;
          }
        }
      } else {
        const query = supabaseClient
          .from("stock")
          .select()
          .order("price_growth", { ascending: false });

        if (screener.roe) {
          if (screener.roe.startsWith(">")) {
            const value = parseFloat(screener.roe.slice(1));
            query.gt("roe", value);
          } else if (screener.roe.startsWith("<")) {
            const value = parseFloat(screener.roe.slice(1));
            query.lt("roe", value);
          } else if (!isNaN(parseFloat(screener.roe))) {
            const value = parseFloat(screener.roe);
            query.eq("roe", value);
          }
        }

        if (screener.analyst) {
          if (screener.analyst.startsWith(">")) {
            const value = parseFloat(screener.analyst.slice(1));
            query.gt("analystRatingBuy", value);
          } else if (screener.analyst.startsWith("<")) {
            const value = parseFloat(screener.analyst.slice(1));
            query.lt("analystRatingBuy", value);
          } else if (!isNaN(parseFloat(screener.analyst))) {
            const value = parseFloat(screener.analyst);
            query.eq("analystRatingBuy", value);
          }
        }

        if (screener.de) {
          if (screener.de.startsWith(">")) {
            const value = parseFloat(screener.de.slice(1));
            query.gt("de", value);
          } else if (screener.de.startsWith("<")) {
            const value = parseFloat(screener.de.slice(1));
            query.lt("de", value);
          } else if (!isNaN(parseFloat(screener.de))) {
            const value = parseFloat(screener.de);
            query.eq("de", value);
          }
        }

        if (screener.margin_safety) {
          if (screener.margin_safety.startsWith(">")) {
            const value = parseFloat(screener.margin_safety.slice(1));
            query.gt("gfValueMargin", value);
          } else if (screener.margin_safety.startsWith("<")) {
            const value = parseFloat(screener.margin_safety.slice(1));
            query.lt("gfValueMargin", value);
          } else if (!isNaN(parseFloat(screener.margin_safety))) {
            const value = parseFloat(screener.margin_safety);
            query.eq("gfValueMargin", value);
          }
        }

        if (screener.pe) {
          if (screener.pe.startsWith(">")) {
            const value = parseFloat(screener.pe.slice(1));
            query.gt("pe", value);
          } else if (screener.pe.startsWith("<")) {
            const value = parseFloat(screener.pe.slice(1));
            query.lt("pe", value);
          } else if (!isNaN(parseFloat(screener.pe))) {
            const value = parseFloat(screener.pe);
            query.eq("pe", value);
          }
        }

        if (screener.priceGrowth) {
          if (screener.priceGrowth.startsWith(">")) {
            const value = parseFloat(screener.priceGrowth.slice(1));
            query.gt("price_growth", value);
          } else if (screener.priceGrowth.startsWith("<")) {
            const value = parseFloat(screener.priceGrowth.slice(1));
            query.lt("price_growth", value);
          } else if (!isNaN(parseFloat(screener.priceGrowth))) {
            const value = parseFloat(screener.priceGrowth);
            query.eq("price_growth", value);
          }
        }

        if (screener.payout_ratio) {
          if (screener.payout_ratio.startsWith(">")) {
            const value = parseFloat(screener.payout_ratio.slice(1));
            query.gt("payoutRation", value);
          } else if (screener.payout_ratio.startsWith("<")) {
            const value = parseFloat(screener.payout_ratio.slice(1));
            query.lt("payoutRation", value);
          } else if (!isNaN(parseFloat(screener.payout_ratio))) {
            const value = parseFloat(screener.payout_ratio);
            query.eq("payoutRation", value);
          }
        }

        if (screener.dividend_yield) {
          if (screener.dividend_yield.startsWith(">")) {
            const value = parseFloat(screener.dividend_yield.slice(1));
            query.gt("dividendYield", value);
          } else if (screener.dividend_yield.startsWith("<")) {
            const value = parseFloat(screener.dividend_yield.slice(1));
            query.lt("dividendYield", value);
          } else if (!isNaN(parseFloat(screener.dividend_yield))) {
            const value = parseFloat(screener.dividend_yield);
            query.eq("dividendYield", value);
          }
        }

        if (screener.sector) {
          query.eq("sector", screener.sector);
        }

        if (screener.industry) {
          query.eq("subIndustry", screener.industry);
        }

        const result = await query;

        return result.data;
      }
    }

    /* --- SUPABASE --- */
    // const stocks = await supabaseClient
    //   .from("stock")
    //   .select()
    //   .gte("roe", 20)
    //   .gte("price_growth", 15)
    //   .gte("analystRatingBuy", 10)
    //   .lte("pe", 30)
    //   .gt("pe", 0)
    //   .gte("gfValueMargin", 10)
    //   .lte("de", 3)
    //   .order("price_growth", { ascending: false });
    // const stockPortfolio = await supabaseClient
    //   .from("stock_portfolio")
    //   .select()
    //   .eq("is_trading", true);
    // if (stocks.data && stockPortfolio.data) {
    //   return stocks.data.filter(
    //     (stock) =>
    //       !stockPortfolio.data.some(
    //         (stockPortfolio) => stockPortfolio.ticker === stock.ticker
    //       )
    //   );
    // }
    /* --- FIREBASE --- */
    // const stockRef = query(
    //   collection(db, "stock"),
    //   where("priceGrowth", ">=", 20),
    //   orderBy("priceGrowth", "desc")
    // );
    // const stocks = (await getDocs(stockRef)).docs.map((item) => item.data());
    // const filretedData = stocks.filter(
    //   (item) =>
    //     item.roe >= 20 &&
    //     item.analystRatingBuy >= 10 &&
    //     item.de <= 3 &&
    //     item.intrinsicMargin >= 10
    // );
    // return filretedData;
  }

  static async getAllStocks() {
    const stockRef = query(collection(db, "stock"), orderBy("ticker", "asc"));

    const stocks = (await getDocs(stockRef)).docs.map((item) =>
      item.data()
    ) as IStock[];

    return stocks;
  }
}
